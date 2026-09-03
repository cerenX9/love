import React, { useEffect, useRef } from 'react';

const FloatingHearts = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle system for floating hearts & sparkles
    const particleCount = 28;
    const particles = [];
    const colors = [
      'rgba(244, 63, 94, ',   // rose-500
      'rgba(251, 113, 133, ',  // rose-400
      'rgba(240, 179, 187, ',  // blush-300
      'rgba(192, 146, 252, ',  // lavender-400
      'rgba(253, 164, 175, ',  // rose-300
    ];

    class HeartParticle {
      constructor() {
        this.reset();
        this.y = Math.random() * height; // initial spread
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 50;
        this.size = Math.random() * 12 + 8;
        this.speedY = Math.random() * 0.7 + 0.3;
        this.speedX = Math.sin(Math.random() * Math.PI) * 0.4;
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.35 + 0.15;
        this.angle = Math.random() * Math.PI * 2;
        this.angularSpeed = (Math.random() - 0.5) * 0.02;
        this.scale = Math.random() * 0.6 + 0.6;
        this.type = Math.random() > 0.3 ? 'heart' : 'sparkle';
      }

      update() {
        this.y -= this.speedY;
        this.x += Math.sin(this.y * 0.01) * 0.5 + this.speedX;
        this.angle += this.angularSpeed;

        if (this.y < -30) {
          this.reset();
        }
      }

      draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.scale(this.scale, this.scale);

        if (this.type === 'heart') {
          context.fillStyle = `${this.colorPrefix}${this.opacity})`;
          context.beginPath();
          const topCurveHeight = this.size * 0.3;
          context.moveTo(0, topCurveHeight);
          // top left curve
          context.bezierCurveTo(
            -this.size / 2, -this.size / 2,
            -this.size, topCurveHeight / 3,
            0, this.size
          );
          // top right curve
          context.bezierCurveTo(
            this.size, topCurveHeight / 3,
            this.size / 2, -this.size / 2,
            0, topCurveHeight
          );
          context.closePath();
          context.fill();
        } else {
          // Sparkle star
          context.fillStyle = `${this.colorPrefix}${this.opacity * 1.2})`;
          context.beginPath();
          for (let i = 0; i < 4; i++) {
            context.lineTo(Math.cos((i * Math.PI) / 2) * this.size * 0.6, Math.sin((i * Math.PI) / 2) * this.size * 0.6);
            context.lineTo(
              Math.cos((i * Math.PI) / 2 + Math.PI / 4) * this.size * 0.2,
              Math.sin((i * Math.PI) / 2 + Math.PI / 4) * this.size * 0.2
            );
          }
          context.closePath();
          context.fill();
        }

        context.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new HeartParticle());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
};

export default FloatingHearts;
