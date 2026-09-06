import React, { useRef, useEffect } from 'react';

// =========================================================
// 1. ANIMATED FLOOD CANVAS (Flood.png)
// =========================================================
export const AnimatedFloodCanvas: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 350);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const img = new Image();
    img.src = '/Flood.png';
    let loaded = false;
    img.onload = () => {
      loaded = true;
    };

    // Rain drops
    const rainCount = 140;
    const rain = Array.from({ length: rainCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 10 + Math.random() * 8,
      len: 14 + Math.random() * 14,
      tilt: -2,
    }));

    // Water ripples
    const ripples: { x: number; y: number; r: number; opacity: number }[] = [];

    let time = 0;

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      // 1. Image with slow drone camera pan
      if (loaded) {
        const panX = Math.sin(time * 0.4) * 12;
        const panY = Math.cos(time * 0.3) * 6;
        const scale = 1.05 + Math.sin(time * 0.2) * 0.02;

        ctx.save();
        ctx.translate(width / 2 + panX, height / 2 + panY);
        ctx.scale(scale, scale);
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.restore();
      } else {
        ctx.fillStyle = '#091024';
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Animated Cyan HUD 3D Grid Overlay across flooded street
      ctx.save();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 1.5;
      const gridY = height * 0.55;
      ctx.beginPath();
      for (let x = width * 0.15; x <= width * 0.55; x += 30) {
        ctx.moveTo(x, gridY);
        ctx.lineTo(x - 40, height * 0.95);
      }
      for (let y = gridY; y <= height * 0.95; y += 20) {
        const p = (y - gridY) / (height * 0.4);
        ctx.moveTo(width * 0.15 - p * 40, y);
        ctx.lineTo(width * 0.55 - p * 40, y);
      }
      ctx.stroke();

      // Pulsing HIGH FLOOD RISK Box
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(width * 0.3, height * 0.6, 110, 45);
      ctx.fillRect(width * 0.3, height * 0.6, 110, 45);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('HIGH FLOOD', width * 0.3 + 12, height * 0.6 + 20);
      ctx.fillStyle = '#ef4444';
      ctx.fillText('RISK 78%', width * 0.3 + 12, height * 0.6 + 35);
      ctx.restore();

      // 3. Falling Rain
      ctx.save();
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.6)';
      ctx.lineWidth = 1.2;
      rain.forEach((r) => {
        r.y += r.speed;
        r.x += r.tilt;
        if (r.y > height) {
          r.y = -10;
          r.x = Math.random() * width;
          if (Math.random() < 0.2) {
            ripples.push({ x: r.x, y: height * 0.65 + Math.random() * (height * 0.3), r: 1, opacity: 0.8 });
          }
        }
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x + r.tilt, r.y + r.len);
        ctx.stroke();
      });
      ctx.restore();

      // 4. Water Splash Ripples
      ctx.save();
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.r += 0.3;
        rip.opacity -= 0.025;
        if (rip.opacity <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.ellipse(rip.x, rip.y, rip.r * 1.6, rip.r * 0.7, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${rip.opacity})`;
        ctx.stroke();
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={`w-full h-full object-cover ${className || ''}`} />;
};

// =========================================================
// 2. ANIMATED LANDSLIDE CANVAS (Using uploaded Landslide.png)
// =========================================================
export const AnimatedLandslideCanvas: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 350);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const img = new Image();
    img.src = '/Landslide.png';
    let loaded = false;
    img.onload = () => {
      loaded = true;
    };

    // Shifting soil & rock particles
    const particles = Array.from({ length: 45 }, () => ({
      x: width * 0.55 + (Math.random() - 0.5) * (width * 0.3),
      y: height * 0.25 + Math.random() * (height * 0.45),
      speedY: 1.0 + Math.random() * 1.5,
      speedX: -0.3 - Math.random() * 0.5,
      size: 2 + Math.random() * 3,
      opacity: 0.6 + Math.random() * 0.4,
    }));

    // Rain
    const rain = Array.from({ length: 130 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 12 + Math.random() * 7,
      len: 16,
    }));

    let time = 0;

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      // 1. Slow Camera Zoom over mountain landslide image
      if (loaded) {
        const zoom = 1.04 + Math.sin(time * 0.3) * 0.02;
        const driftX = Math.sin(time * 0.2) * 8;
        ctx.save();
        ctx.translate(width / 2 + driftX, height / 2);
        ctx.scale(zoom, zoom);
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.restore();
      } else {
        ctx.fillStyle = '#061a14';
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Glowing Animated AI 3D Mesh Net over Mountain Cliff (Cyan Mesh)
      ctx.save();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
      ctx.lineWidth = 1.2;

      const meshPoints: [number, number][] = [];
      const cols = 6;
      const rows = 5;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = width * 0.45 + c * (width * 0.09) - r * 15;
          const py = height * 0.2 + r * (height * 0.12) + Math.sin(time * 2 + c) * 3;
          meshPoints.push([px, py]);
        }
      }

      // Draw mesh lines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const [x, y] = meshPoints[idx];

          if (c < cols - 1) {
            const [nx, ny] = meshPoints[idx + 1];
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nx, ny);
            ctx.stroke();
          }
          if (r < rows - 1) {
            const [nx, ny] = meshPoints[idx + cols];
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nx, ny);
            ctx.stroke();
          }

          // Node Dots
          ctx.fillStyle = '#00F0FF';
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // 3. Floating Orange Telemetry Badges: ACTIVE SLIDE ZONE & CRITICAL SLOPE RISK
      ctx.save();
      // Badge 1: ACTIVE SLIDE ZONE (at mid cliff)
      const b1X = width * 0.52;
      const b1Y = height * 0.32;
      ctx.fillStyle = 'rgba(249, 115, 22, 0.85)';
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 1.5;
      ctx.fillRect(b1X, b1Y, 115, 28);
      ctx.strokeRect(b1X, b1Y, 115, 28);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('ACTIVE SLIDE', b1X + 8, b1Y + 12);
      ctx.fillStyle = '#ffedd5';
      ctx.fillText('ZONE • 85%', b1X + 8, b1Y + 23);

      // Connecting Pin Line
      ctx.beginPath();
      ctx.moveTo(b1X + 57, b1Y + 28);
      ctx.lineTo(b1X + 57, b1Y + 45);
      ctx.strokeStyle = '#f97316';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(b1X + 57, b1Y + 45, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#f97316';
      ctx.fill();

      // Badge 2: CRITICAL SLOPE RISK (at top right cliff)
      const b2X = width * 0.78;
      const b2Y = height * 0.28;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.fillRect(b2X, b2Y, 120, 28);
      ctx.strokeRect(b2X, b2Y, 120, 28);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('CRITICAL SLOPE', b2X + 8, b2Y + 12);
      ctx.fillStyle = '#fecdd3';
      ctx.fillText('RISK • HIGH', b2X + 8, b2Y + 23);

      ctx.restore();

      // 4. Shifting soil particles
      ctx.save();
      ctx.fillStyle = '#f59e0b';
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y > height * 0.8) {
          p.y = height * 0.25;
          p.x = width * 0.55 + (Math.random() - 0.5) * (width * 0.3);
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });
      ctx.restore();

      // 5. Rain
      ctx.save();
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.55)';
      ctx.lineWidth = 1.2;
      rain.forEach((r) => {
        r.y += r.speed;
        if (r.y > height) {
          r.y = -10;
          r.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - 2, r.y + r.len);
        ctx.stroke();
      });
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={`w-full h-full object-cover ${className || ''}`} />;
};

// =========================================================
// 3. ANIMATED EVACUATION CANVAS (evacuation.png)
// =========================================================
export const AnimatedEvacuationCanvas: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 350);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const img = new Image();
    img.src = '/evacuation.png';
    let loaded = false;
    img.onload = () => {
      loaded = true;
    };

    // Rain
    const rain = Array.from({ length: 130 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 11 + Math.random() * 7,
      len: 14,
    }));

    let time = 0;

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      // 1. Render Evacuation Image
      if (loaded) {
        const driftX = Math.sin(time * 0.3) * 6;
        ctx.save();
        ctx.translate(width / 2 + driftX, height / 2);
        ctx.scale(1.04, 1.04);
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.restore();
      } else {
        ctx.fillStyle = '#06131c';
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Flashing Red & Blue Strobe Lights on Emergency Vans
      const strobeBlue = Math.sin(time * 15) > 0;
      const strobeRed = Math.cos(time * 15) > 0;

      ctx.save();
      if (strobeBlue) {
        const blueGrad = ctx.createRadialGradient(width * 0.15, height * 0.45, 5, width * 0.15, height * 0.45, 60);
        blueGrad.addColorStop(0, 'rgba(59, 130, 246, 0.9)');
        blueGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.fillStyle = blueGrad;
        ctx.beginPath();
        ctx.arc(width * 0.15, height * 0.45, 60, 0, Math.PI * 2);
        ctx.fill();
      }

      if (strobeRed) {
        const redGrad = ctx.createRadialGradient(width * 0.35, height * 0.45, 5, width * 0.35, height * 0.45, 60);
        redGrad.addColorStop(0, 'rgba(239, 68, 68, 0.9)');
        redGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = redGrad;
        ctx.beginPath();
        ctx.arc(width * 0.35, height * 0.45, 60, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. Flowing Animated Cyan Directional Arrows along the road
      ctx.save();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;

      const arrowX = width * 0.5 + ((time * 60) % (width * 0.35));
      const arrowY = height * 0.32;

      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY - 8);
      ctx.lineTo(arrowX + 12, arrowY);
      ctx.lineTo(arrowX, arrowY + 8);

      ctx.moveTo(arrowX - 18, arrowY - 8);
      ctx.lineTo(arrowX - 6, arrowY);
      ctx.lineTo(arrowX - 18, arrowY + 8);
      ctx.stroke();

      // HUD Text Badge overlay
      ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1;
      ctx.fillRect(width * 0.5, height * 0.2, 210, 32);
      ctx.strokeRect(width * 0.5, height * 0.2, 210, 32);

      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('DESTINATION SAFE ZONE:', width * 0.5 + 10, height * 0.2 + 14);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('HIGHTOWN ALTITUDE >>>', width * 0.5 + 10, height * 0.2 + 26);
      ctx.restore();

      // 4. Falling Rain
      ctx.save();
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.55)';
      ctx.lineWidth = 1.2;
      rain.forEach((r) => {
        r.y += r.speed;
        if (r.y > height) {
          r.y = -10;
          r.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - 1.5, r.y + r.len);
        ctx.stroke();
      });
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={`w-full h-full object-cover ${className || ''}`} />;
};
