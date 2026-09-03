// Date utilities for love duration counter, calendar, and time capsules

const MONTH_NAMES_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const DAY_NAMES_TR = [
  'Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'
];

export function calculateTimeTogether(startDateStr) {
  const start = new Date(startDateStr);
  const now = new Date();

  let diffMs = now - start;
  if (diffMs < 0) {
    diffMs = 0;
  }

  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

  // Hierarchical precision breakdown (borrowing from lower units upwards)
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  let hours = now.getHours() - start.getHours();
  let minutes = now.getMinutes() - start.getMinutes();
  let seconds = now.getSeconds() - start.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }

  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }

  if (hours < 0) {
    hours += 24;
    days -= 1;
  }

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    seconds: Math.max(0, seconds),
    totalDays,
    totalHours,
  };
}

export function getTimeRemaining(targetDateStr) {
  const target = new Date(targetDateStr);
  const now = new Date();
  const diffMs = target - now;

  if (diffMs <= 0) {
    return {
      isPassed: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    isPassed: false,
    days,
    hours,
    minutes,
    seconds,
  };
}

export function isDateReached(targetDateStr) {
  if (!targetDateStr) return true;
  const target = new Date(targetDateStr);
  const now = new Date();
  return now >= target;
}

export function formatDateTurkish(dateInput, includeTime = false) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;

  const day = date.getDate();
  const month = MONTH_NAMES_TR[date.getMonth()];
  const year = date.getFullYear();

  if (!includeTime) {
    return `${day} ${month} ${year}`;
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} • ${hours}:${minutes}`;
}

export function formatTimeAgo(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  const now = new Date();
  const diffSeconds = Math.floor((now - date) / 1000);

  if (diffSeconds < 60) return 'Az önce';
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} dakika önce`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} saat önce`;
  if (diffSeconds < 86400 * 7) return `${Math.floor(diffSeconds / 86400)} gün önce`;

  return formatDateTurkish(dateInput);
}

export { MONTH_NAMES_TR, DAY_NAMES_TR };
