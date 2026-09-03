import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  MapPin,
  Navigation,
  Heart,
  Sparkles,
  Car,
  Footprints,
  Clock,
  RefreshCw,
  LocateFixed,
  Lock,
  Layers,
  CheckCircle2,
  Share2,
  AlertCircle,
  ExternalLink,
  Map as MapIcon,
  Plus,
  Trash2,
  BookmarkPlus,
  Edit3,
  Bookmark,
  Send,
  PauseCircle,
  PlayCircle,
  Eye,
  EyeOff,
  Ghost,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import L from 'leaflet';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';

// Map Layer Configurations (Google Maps & Romantic Styles)
const MAP_LAYERS = {
  google_roadmap: {
    id: 'google_roadmap',
    name: 'Google Harita 🗺️',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
  google_satellite: {
    id: 'google_satellite',
    name: 'Google Uydu 🛰️',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
  romantic_pastel: {
    id: 'romantic_pastel',
    name: 'Romantik Pastel 🌸',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c', 'd'],
  },
};

// Haversine Distance Calculation (Returns km)
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Bearing Calculation (Degrees)
const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const y = Math.sin(((lon2 - lon1) * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.cos(((lon2 - lon1) * Math.PI) / 180);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
};

const LoveRadar = () => {
  const {
    radarData,
    updatePartnerLocation,
    togglePartnerLocationSharing,
    activePersona,
    profile,
    savedPlaces,
    addSavedPlace,
    deleteSavedPlace,
  } = useSharedData();
  const { playPop, playChime } = useSound();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef({ ceren: null, tahir: null, polyline: null, tempClickMarker: null });

  const [viewMode, setViewMode] = useState('map'); // 'map' | 'radar'
  const [mapLayer, setMapLayer] = useState('google_roadmap'); // 'google_roadmap' | 'google_satellite' | 'romantic_pastel'
  const [gpsLoading, setGpsLoading] = useState(false);

  // Custom Place Naming states
  const [isEditingName, setIsEditingName] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [clickedMapCoords, setClickedMapCoords] = useState(null); // { lat, lng }
  const [clickedPlaceName, setClickedPlaceName] = useState('');
  const [saveToFavorites, setSaveToFavorites] = useState(true);

  const isCeren = activePersona === 'partner1';
  const myKey = isCeren ? 'partner1' : 'partner2';
  const partnerKey = isCeren ? 'partner2' : 'partner1';

  const myData = radarData?.[myKey] || { lat: 40.9833, lng: 29.0278, locationName: 'Kadıköy', isSharing: true };
  const partnerData =
    radarData?.[partnerKey] || { lat: 41.0422, lng: 29.0067, locationName: 'Beşiktaş', isSharing: true };

  const cerenData = radarData?.partner1 || { lat: 40.9833, lng: 29.0278, locationName: 'Kadıköy', isSharing: true };
  const tahirData = radarData?.partner2 || { lat: 41.0422, lng: 29.0067, locationName: 'Beşiktaş', isSharing: true };

  const cerenIsSharing = cerenData?.isSharing !== false;
  const tahirIsSharing = tahirData?.isSharing !== false;
  const myIsSharing = myData?.isSharing !== false;
  const partnerIsSharing = partnerData?.isSharing !== false;

  // Calculate Distance & Metrics
  const distanceKm = calculateDistanceKm(
    cerenData.lat,
    cerenData.lng,
    tahirData.lat,
    tahirData.lng
  );
  const isTogether = distanceKm < 0.1; // under 100 meters

  const bearingToPartner = calculateBearing(
    myData.lat,
    myData.lng,
    partnerData.lat,
    partnerData.lng
  );

  const estimatedSteps = Math.round(distanceKm * 1250);
  const walkingMinutes = Math.round((distanceKm / 5) * 60);
  const drivingMinutes = Math.max(1, Math.round((distanceKm / 35) * 60));

  // Toggle Location Sharing Handler
  const handleToggleSharing = async (targetKey) => {
    playPop();
    const nextVal = await togglePartnerLocationSharing(targetKey || myKey);
    if (nextVal) {
      playChime();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#34d399', '#38bdf8', '#fb7185'],
      });
    }
  };

  // Google Maps Directions Route URL
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${cerenData.lat},${cerenData.lng}&destination=${tahirData.lat},${tahirData.lng}`;

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (viewMode !== 'map' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([cerenData.lat, cerenData.lng], 13);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add map click listener to drop pins & name custom place
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setClickedMapCoords({ lat, lng });
        setClickedPlaceName('');
      });

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Switch Tile Layer (Google Maps or Romantic)
    const layerConfig = MAP_LAYERS[mapLayer] || MAP_LAYERS.google_roadmap;
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileLayer = L.tileLayer(layerConfig.url, {
      maxZoom: layerConfig.maxZoom,
      subdomains: layerConfig.subdomains || ['a', 'b', 'c'],
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Custom HTML Marker for Ceren
    const cerenIcon = L.divIcon({
      className: 'custom-leaflet-marker-ceren',
      html: `
        <div class="relative flex flex-col items-center justify-center cursor-pointer group">
          <div class="w-12 h-12 rounded-full ${cerenIsSharing ? 'bg-rose-500 ring-rose-300/60 animate-pulse' : 'bg-slate-500 ring-slate-300 opacity-75'} border-3 border-white shadow-2xl flex items-center justify-center text-2xl text-white transform group-hover:scale-115 transition-transform ring-4">
            ${profile.partner1?.avatar || '👱🏼‍♀️'}
          </div>
          <span class="mt-1 ${cerenIsSharing ? 'bg-rose-600/95' : 'bg-slate-700/90'} backdrop-blur-md text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-lg whitespace-nowrap border border-white/40 flex items-center gap-1">
            ${profile.partner1?.name || 'Ceren'} ${!cerenIsSharing ? '🔒' : ''}
          </span>
        </div>
      `,
      iconSize: [48, 64],
      iconAnchor: [24, 32],
    });

    // Custom HTML Marker for Tahir
    const tahirIcon = L.divIcon({
      className: 'custom-leaflet-marker-tahir',
      html: `
        <div class="relative flex flex-col items-center justify-center cursor-pointer group">
          <div class="w-12 h-12 rounded-full ${tahirIsSharing ? 'bg-blue-600 ring-blue-300/60 animate-pulse' : 'bg-slate-500 ring-slate-300 opacity-75'} border-3 border-white shadow-2xl flex items-center justify-center text-2xl text-white transform group-hover:scale-115 transition-transform ring-4">
            ${profile.partner2?.avatar || '👨🏻‍🦰'}
          </div>
          <span class="mt-1 ${tahirIsSharing ? 'bg-blue-700/95' : 'bg-slate-700/90'} backdrop-blur-md text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-lg whitespace-nowrap border border-white/40 flex items-center gap-1">
            ${profile.partner2?.name || 'Tahir'} ${!tahirIsSharing ? '🔒' : ''}
          </span>
        </div>
      `,
      iconSize: [48, 64],
      iconAnchor: [24, 32],
    });

    // Remove old markers
    if (markersRef.current.ceren) map.removeLayer(markersRef.current.ceren);
    if (markersRef.current.tahir) map.removeLayer(markersRef.current.tahir);
    if (markersRef.current.polyline) map.removeLayer(markersRef.current.polyline);

    // Add new markers
    const cerenMarker = L.marker([cerenData.lat, cerenData.lng], { icon: cerenIcon }).addTo(map);
    const tahirMarker = L.marker([tahirData.lat, tahirData.lng], { icon: tahirIcon }).addTo(map);

    // Add polyline connecting both (if both sharing, vibrant line; if not, faint dashed gray)
    const isBothSharing = cerenIsSharing && tahirIsSharing;
    const polyline = L.polyline(
      [
        [cerenData.lat, cerenData.lng],
        [tahirData.lat, tahirData.lng],
      ],
      {
        color: isBothSharing ? '#f43f5e' : '#94a3b8',
        weight: isBothSharing ? 4 : 2.5,
        dashArray: isBothSharing ? '10, 10' : '6, 6',
        opacity: isBothSharing ? 0.9 : 0.5,
      }
    ).addTo(map);

    markersRef.current = { ceren: cerenMarker, tahir: tahirMarker, polyline };

    // Fit bounds with padding and invalidate size
    const group = L.featureGroup([cerenMarker, tahirMarker]);
    map.fitBounds(group.getBounds().pad(0.35));

    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    cerenData.lat,
    cerenData.lng,
    cerenIsSharing,
    tahirData.lat,
    tahirData.lng,
    tahirIsSharing,
    viewMode,
    mapLayer,
    profile,
  ]);

  // Live GPS Location Updater
  const handleGetLiveGPS = () => {
    if (!navigator.geolocation) {
      alert('Tarayıcınız veya cihazınız GPS konum desteği vermiyor.');
      return;
    }

    setGpsLoading(true);
    playPop();

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const defaultGpsName = `${isCeren ? 'Ceren' : 'Tahir'}'in Canlı Konumu 📍`;
        updatePartnerLocation(myKey, {
          lat: latitude,
          lng: longitude,
          locationName: defaultGpsName,
        });
        setGpsLoading(false);
        playChime();
        confetti({
          particleCount: 50,
          spread: 65,
          origin: { y: 0.7 },
          colors: ['#38bdf8', '#fb7185', '#34d399'],
        });
      },
      (err) => {
        setGpsLoading(false);
        alert(
          'Konum alınamadı. Lütfen tarayıcınızdan konum iznini onaylayın veya haritaya tıklayarak konum seçin.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Update Custom Name for Current Location
  const handleUpdateCurrentPlaceName = (e) => {
    e.preventDefault();
    if (!newLocationName.trim()) return;

    playPop();
    updatePartnerLocation(myKey, {
      lat: myData.lat,
      lng: myData.lng,
      locationName: newLocationName.trim(),
    });

    if (saveToFavorites) {
      addSavedPlace({
        name: newLocationName.trim(),
        lat: myData.lat,
        lng: myData.lng,
      });
    }

    setNewLocationName('');
    setIsEditingName(false);
    playChime();
  };

  // Apply a Saved Place to Current Location
  const handleSelectSavedPlace = (place) => {
    playPop();
    updatePartnerLocation(myKey, {
      lat: place.lat,
      lng: place.lng,
      locationName: place.name,
    });
    playChime();
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#fb7185', '#38bdf8'],
    });
  };

  // Delete a Saved Place
  const handleDeleteSavedPlace = (e, id) => {
    e.stopPropagation();
    playPop();
    if (window.confirm('Bu kayıtlı mekanı silmek istiyor musunuz?')) {
      deleteSavedPlace(id);
    }
  };

  // Apply Location from Map Click
  const handleApplyClickedLocation = () => {
    if (!clickedMapCoords) return;
    playPop();

    const placeName = clickedPlaceName.trim() || `${isCeren ? 'Ceren' : 'Tahir'}'in Seçtiği Nokta 📍`;

    updatePartnerLocation(myKey, {
      lat: clickedMapCoords.lat,
      lng: clickedMapCoords.lng,
      locationName: placeName,
    });

    if (saveToFavorites) {
      addSavedPlace({
        name: placeName,
        lat: clickedMapCoords.lat,
        lng: clickedMapCoords.lng,
      });
    }

    setClickedMapCoords(null);
    setClickedPlaceName('');
    playChime();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#34d399', '#fb7185'],
    });
  };

  // Set "Together" (Yan Yanayız)
  const handleSetTogether = () => {
    playChime();
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.5 },
      colors: ['#fb7185', '#f43f5e', '#fda4af', '#f472b6'],
    });

    const sharedPlaceName = 'Birlikteyiz 💖 (' + (myData.locationName || 'Yan Yana') + ')';
    updatePartnerLocation(myKey, {
      lat: myData.lat,
      lng: myData.lng,
      locationName: sharedPlaceName,
    });
    updatePartnerLocation(partnerKey, {
      lat: myData.lat,
      lng: myData.lng,
      locationName: sharedPlaceName,
    });
  };

  return (
    <div className="space-y-3">
      {/* Top Header Bar - Strictly Minimal & Non-overlapping */}
      <div className="glass-pill px-3.5 py-2 rounded-2xl border border-rose-200/90 shadow-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-2xs shrink-0">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-extrabold text-slate-800 text-xs sm:text-sm truncate">
            Aşk Radarı & Harita
          </h2>
          {isTogether ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black shrink-0">
              Yan Yanasınız 💖
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black shrink-0">
              {distanceKm.toFixed(1)} km
            </span>
          )}
        </div>

        {/* Map vs Radar Mode Toggle */}
        <div className="flex bg-white/90 p-0.5 rounded-xl border border-rose-200 shadow-2xs text-[11px] shrink-0">
          <button
            onClick={() => {
              playPop();
              setViewMode('map');
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-rose-50'
            }`}
          >
            Harita 🗺️
          </button>
          <button
            onClick={() => {
              playPop();
              setViewMode('radar');
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'radar'
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-rose-50'
            }`}
          >
            Radar 🎯
          </button>
        </div>
      </div>

      {/* Main Map or Circular Radar Canvas */}
      <div className="space-y-4">
        {viewMode === 'map' ? (
          <div className="glass-card rounded-3xl overflow-hidden border border-rose-200/90 shadow-xl relative h-[420px] sm:h-[480px]">
            {/* Interactive Leaflet Map */}
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            {/* Floating Top Controls: Layer Selector */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-2xl border border-rose-200 shadow-md text-[11px]">
              {Object.values(MAP_LAYERS).map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => {
                    playPop();
                    setMapLayer(layer.id);
                  }}
                  className={`px-2 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    mapLayer === layer.id
                      ? 'bg-rose-500 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-rose-50'
                  }`}
                >
                  {layer.name.replace('Google ', '')}
                </button>
              ))}
            </div>

            {/* Floating Map Hint */}
            <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-rose-200 text-[10px] font-bold text-slate-700 shadow-sm hidden sm:flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-500" />
              <span>Haritaya tıklayarak konum seç</span>
            </div>

            {/* Ghost Mode Alert Ribbon when location sharing is paused */}
            {!myIsSharing && (
              <div className="absolute top-12 left-3 z-20 bg-slate-900/95 text-white backdrop-blur-md px-3 py-1.5 rounded-2xl border border-amber-500/50 shadow-xl text-[11px] font-bold flex items-center gap-2">
                <Ghost className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Konum paylaşımın durduruldu 🔒</span>
                <button
                  onClick={() => handleToggleSharing(myKey)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-[10px] font-black cursor-pointer transition-colors"
                >
                  Yeniden Başlat ▶️
                </button>
              </div>
            )}

            {/* Floating Live GPS & Sharing Toggle Action Group */}
            <div className="absolute bottom-16 sm:bottom-18 right-3.5 z-20 flex items-center gap-2">
              {/* Sharing Pause / Resume Button */}
              {myIsSharing ? (
                <button
                  onClick={() => handleToggleSharing(myKey)}
                  className="px-3 py-2 rounded-2xl bg-white/95 hover:bg-amber-50 text-amber-800 border border-amber-200 shadow-lg font-extrabold text-xs flex items-center gap-1.5 cursor-pointer active:scale-90 transition-all backdrop-blur-md"
                  title="Konum Paylaşımını Durdur (Gizli Mod)"
                >
                  <PauseCircle className="w-4 h-4 text-amber-600" />
                  <span className="hidden xs:inline">Paylaşımı Durdur ⏸️</span>
                </button>
              ) : (
                <button
                  onClick={() => handleToggleSharing(myKey)}
                  className="px-3 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer active:scale-90 transition-all animate-pulse"
                  title="Konum Paylaşımını Yeniden Başlat"
                >
                  <PlayCircle className="w-4 h-4 text-white" />
                  <span>Paylaşımı Başlat ▶️</span>
                </button>
              )}

              {/* Locate Fixed GPS Button */}
              <button
                onClick={handleGetLiveGPS}
                disabled={gpsLoading}
                className="px-3 py-2 rounded-2xl bg-white/95 hover:bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-lg font-extrabold text-xs flex items-center gap-1.5 cursor-pointer active:scale-90 transition-all backdrop-blur-md"
                title="Canlı GPS Konumunu Al"
              >
                <LocateFixed className={`w-4 h-4 text-emerald-500 ${gpsLoading ? 'animate-spin' : ''}`} />
                <span>{gpsLoading ? 'Alınıyor...' : 'Konumumu Bul 📍'}</span>
              </button>
            </div>

            {/* Floating Bottom Action & Distance Bar */}
            <div className="absolute bottom-3 inset-x-3 z-20 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-rose-200/90 shadow-xl flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2 h-2 rounded-full ${myIsSharing && partnerIsSharing ? 'bg-emerald-500 animate-ping' : 'bg-amber-400'} shrink-0`} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                    <span>{isTogether ? 'Yan Yanasınız! 🎉' : `${distanceKm.toFixed(1)} km Mesafe`}</span>
                    {(!cerenIsSharing || !tahirIsSharing) && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-md">
                        (Gizli Mod)
                      </span>
                    )}
                    <span className="text-slate-400 font-normal">•</span>
                    <span className="text-slate-500 font-medium text-[11px]">
                      🚗 ~{drivingMinutes} dk | 🚶 ~{walkingMinutes} dk
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                  title="Google Maps Yol Tarifi"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Yol Tarifi 🚗</span>
                </a>

                <button
                  onClick={handleSetTogether}
                  className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                  title="Konumları birleştir"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Yan Yanayız! 💖</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Futuristic Romantic Radar View */
          <div className="glass-card rounded-3xl p-6 border border-rose-200/80 shadow-xl relative h-[420px] sm:h-[480px] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden">
            {/* Radar Rings */}
            <div className="relative w-72 h-72 rounded-full border border-rose-500/30 flex items-center justify-center">
              <div className="absolute w-52 h-52 rounded-full border border-rose-500/40" />
              <div className="absolute w-32 h-32 rounded-full border border-rose-500/50" />
              <div className="absolute w-12 h-12 rounded-full border border-rose-500/60" />

              {/* Rotating Sweep Line */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500/20 via-transparent to-transparent pointer-events-none"
              />

              {/* Center: My Avatar */}
              <div className="w-10 h-10 rounded-full bg-rose-600 border-2 border-white text-white flex items-center justify-center text-lg z-20 shadow-lg shadow-rose-500/50">
                {isCeren ? profile.partner1?.avatar || '👱🏼‍♀️' : profile.partner2?.avatar || '👨🏻‍🦰'}
              </div>

              {/* Partner Blip */}
              <motion.div
                style={{
                  transform: `rotate(${bearingToPartner}deg) translate(${Math.min(
                    110,
                    Math.max(35, distanceKm * 15)
                  )}px) rotate(-${bearingToPartner}deg)`,
                }}
                className="absolute z-20 flex flex-col items-center"
              >
                <div className="w-9 h-9 rounded-full bg-blue-500 border-2 border-white text-white flex items-center justify-center text-base shadow-lg animate-bounce">
                  {!isCeren ? profile.partner1?.avatar || '👱🏼‍♀️' : profile.partner2?.avatar || '👨🏻‍🦰'}
                </div>
                <span className="text-[9px] font-black bg-slate-900/90 text-white px-1.5 py-0.2 rounded-full border border-white/20 mt-1 whitespace-nowrap">
                  {distanceKm.toFixed(1)} km
                </span>
              </motion.div>
            </div>

            <div className="mt-4 text-center z-10">
              <p className="text-xs font-extrabold text-rose-400">
                Aşk Pusulası: %{Math.round(bearingToPartner)}° İstikameti
              </p>
              <p className="text-[11px] text-slate-400">
                Partnerin şu an bu yönde ve {distanceKm.toFixed(1)} km uzaklıkta bulunuyor.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Location Cards & Saved Places Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ceren's Location Card */}
        <div
          className={`glass-card p-4 sm:p-5 rounded-3xl border transition-all ${
            isCeren ? 'border-rose-300 ring-2 ring-rose-300/30 shadow-md' : 'border-rose-200/70'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-rose-100 mb-2 gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{profile.partner1?.avatar || '👱🏼‍♀️'}</span>
              <div>
                <h4 className="font-extrabold text-xs text-slate-800">
                  {profile.partner1?.name}'in Konumu
                </h4>
                <span className="text-[10px] text-slate-400">
                  {isCeren ? 'Senin Konumun 💖' : 'Partnerin'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {isCeren ? (
                <>
                  <button
                    onClick={() => handleToggleSharing('partner1')}
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 cursor-pointer transition-colors ${
                      cerenIsSharing
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs animate-pulse'
                    }`}
                    title={cerenIsSharing ? 'Konum paylaşımını durdur' : 'Konum paylaşımını başlat'}
                  >
                    {cerenIsSharing ? (
                      <>
                        <PauseCircle className="w-3 h-3 text-amber-600" />
                        <span>Paylaşımı Durdur ⏸️</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-3 h-3 text-white" />
                        <span>Yeniden Başlat ▶️</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      playPop();
                      setNewLocationName(myData.locationName || '');
                      setIsEditingName(!isEditingName);
                    }}
                    className="text-[10px] bg-rose-100 text-rose-700 font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 hover:bg-rose-200 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>İsim Ver</span>
                  </button>
                </>
              ) : (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  cerenIsSharing ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {cerenIsSharing ? '🟢 Paylaşımda' : '🔒 Konum Gizlendi'}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs font-bold text-rose-700 flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{cerenData.locationName || 'Belirtilmedi'}</span>
            {!cerenIsSharing && (
              <span className="text-[10px] font-medium text-slate-400">(Paylaşım Durduruldu)</span>
            )}
          </p>

          {/* Inline Name Editor for Ceren */}
          {isCeren && isEditingName && (
            <form onSubmit={handleUpdateCurrentPlaceName} className="mt-3 space-y-2 pt-2 border-t border-rose-100">
              <input
                type="text"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                placeholder="Örn: Evde Dinleniyorum 🏡, Moda Çay Bahçesi ☕"
                className="w-full text-xs px-3 py-2 rounded-xl border border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                autoFocus
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveToFavorites}
                    onChange={(e) => setSaveToFavorites(e.target.checked)}
                    className="rounded text-rose-500 focus:ring-rose-400 cursor-pointer"
                  />
                  <span>Kayıtlı Mekanlara da Ekle ⭐</span>
                </label>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Kaydet
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Tahir's Location Card */}
        <div
          className={`glass-card p-4 sm:p-5 rounded-3xl border transition-all ${
            !isCeren ? 'border-blue-300 ring-2 ring-blue-300/30 shadow-md' : 'border-blue-200/70'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-blue-100 mb-2 gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{profile.partner2?.avatar || '👨🏻‍🦰'}</span>
              <div>
                <h4 className="font-extrabold text-xs text-slate-800">
                  {profile.partner2?.name}'in Konumu
                </h4>
                <span className="text-[10px] text-slate-400">
                  {!isCeren ? 'Senin Konumun 💙' : 'Partnerin'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {!isCeren ? (
                <>
                  <button
                    onClick={() => handleToggleSharing('partner2')}
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 cursor-pointer transition-colors ${
                      tahirIsSharing
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs animate-pulse'
                    }`}
                    title={tahirIsSharing ? 'Konum paylaşımını durdur' : 'Konum paylaşımını başlat'}
                  >
                    {tahirIsSharing ? (
                      <>
                        <PauseCircle className="w-3 h-3 text-amber-600" />
                        <span>Paylaşımı Durdur ⏸️</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-3 h-3 text-white" />
                        <span>Yeniden Başlat ▶️</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      playPop();
                      setNewLocationName(myData.locationName || '');
                      setIsEditingName(!isEditingName);
                    }}
                    className="text-[10px] bg-blue-100 text-blue-700 font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 hover:bg-blue-200 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>İsim Ver</span>
                  </button>
                </>
              ) : (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  tahirIsSharing ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tahirIsSharing ? '🟢 Paylaşımda' : '🔒 Konum Gizlendi'}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{tahirData.locationName || 'Belirtilmedi'}</span>
            {!tahirIsSharing && (
              <span className="text-[10px] font-medium text-slate-400">(Paylaşım Durduruldu)</span>
            )}
          </p>

          {/* Inline Name Editor for Tahir */}
          {!isCeren && isEditingName && (
            <form onSubmit={handleUpdateCurrentPlaceName} className="mt-3 space-y-2 pt-2 border-t border-blue-100">
              <input
                type="text"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                placeholder="Örn: Ofisteyim 💼, Spor Salonu 🏋️"
                className="w-full text-xs px-3 py-2 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                autoFocus
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveToFavorites}
                    onChange={(e) => setSaveToFavorites(e.target.checked)}
                    className="rounded text-blue-500 focus:ring-blue-400 cursor-pointer"
                  />
                  <span>Kayıtlı Mekanlara da Ekle ⭐</span>
                </label>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Kaydet
                </button>
              </div>
            </form>
          )}
        </div>

          {/* Custom Saved Places List (Kayıtlı Özel Mekanlarımız) */}
          <div className="glass-card p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-rose-500" />
                <span>Kayıtlı Özel Mekanlarımız ⭐</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-bold">
                {savedPlaces?.length || 0} Mekan
              </span>
            </div>

            {savedPlaces && savedPlaces.length > 0 ? (
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {savedPlaces.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => handleSelectSavedPlace(place)}
                    className="group p-2.5 rounded-2xl bg-white/80 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-300 transition-all flex items-center justify-between cursor-pointer shadow-2xs"
                    title={`Bu konumu seç (${isCeren ? 'Ceren' : 'Tahir'})`}
                  >
                    <div className="flex items-center gap-2 truncate flex-1">
                      <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-rose-700 truncate">
                          {place.name}
                        </p>
                        <p className="text-[9px] text-slate-400">
                          {place.createdBy ? `${place.createdBy} tarafından eklendi` : 'Özel Konum'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        Seç 📍
                      </span>
                      <button
                        onClick={(e) => handleDeleteSavedPlace(e, place.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Bu mekanı sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-1">
                <p className="text-xs font-bold text-slate-600">Henüz kayıtlı mekan yok 🕊️</p>
                <p className="text-[10px] text-slate-400">
                  Haritaya tıklayarak veya yukarıdan konumunuza isim vererek kendi özel mekanlarınızı kaydedebilirsiniz.
                </p>
              </div>
            )}
          </div>
        </div>

      {/* Modal: When user clicks on map, popup to name and set location */}
      <AnimatePresence>
        {clickedMapCoords && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-rose-200 space-y-4"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">
                    Haritada Yeni Nokta Seçildi 📍
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isCeren ? 'Ceren' : 'Tahir'} için konumu burası yap
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Bu mekana bir isim verin:</label>
                <input
                  type="text"
                  value={clickedPlaceName}
                  onChange={(e) => setClickedPlaceName(e.target.value)}
                  placeholder="Örn: Favori Kafemiz ☕, Sahil Yolu 🌊"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/40"
                  autoFocus
                />

                <label className="flex items-center gap-2 pt-1 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveToFavorites}
                    onChange={(e) => setSaveToFavorites(e.target.checked)}
                    className="rounded text-rose-500 focus:ring-rose-400 cursor-pointer"
                  />
                  <span>Kayıtlı Mekanlarıma da kaydet ⭐</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    playPop();
                    setClickedMapCoords(null);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  İptal
                </button>
                <button
                  onClick={handleApplyClickedLocation}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs shadow-md shadow-rose-200 cursor-pointer"
                >
                  Konumumu Burası Yap 📍
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoveRadar;
