import React, { useRef, useEffect } from 'react';

interface KineticBackgroundCanvasProps {
  videoSrc?: string;
  imageSrc?: string;
  activeMode?: 'hybrid' | 'city' | 'mountain';
}

export const KineticBackgroundCanvas: React.FC<KineticBackgroundCanvasProps> = ({
  videoSrc = '/landingpagevideo.mp4',
  activeMode = 'hybrid',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Rain Particles
    const rainCount = 240;
    const rainDrops = Array.from({ length: rainCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 15 + Math.random() * 25,
      speed: 14 + Math.random() * 10,
      opacity: 0.2 + Math.random() * 0.5,
      tilt: -2 - Math.random() * 3,
    }));

    // Splash Ripples
    const splashRipples: { x: number; y: number; radius: number; maxRadius: number; opacity: number }[] = [];
    const addSplash = () => {
      if (Math.random() < 0.35) {
        splashRipples.push({
          x: Math.random() * (width * 0.45),
          y: height * 0.65 + Math.random() * (height * 0.3),
          radius: 1,
          maxRadius: 8 + Math.random() * 12,
          opacity: 0.8,
        });
      }
    };

    // Floating Drones
    const droneCount = 18;
    const drones = Array.from({ length: droneCount }, (_, i) => ({
      x: (width * (i + 1)) / (droneCount + 1) + (Math.random() - 0.5) * 80,
      y: height * 0.25 + Math.random() * (height * 0.5),
      baseY: height * 0.25 + Math.random() * (height * 0.5),
      floatSpeed: 0.02 + Math.random() * 0.03,
      floatOffset: Math.random() * Math.PI * 2,
      size: 4 + Math.random() * 4,
      color: i % 2 === 0 ? '#00F0FF' : '#f97316',
    }));

    // Mesh Nodes
    const meshNodes = [
      { id: 'flood_risk', xRatio: 0.32, yRatio: 0.18, color: '#00F0FF' },
      { id: 'landslide_risk', xRatio: 0.68, yRatio: 0.22, color: '#f97316' },
      { id: 'water_level', xRatio: 0.08, yRatio: 0.55, color: '#38bdf8' },
      { id: 'rainfall', xRatio: 0.18, yRatio: 0.78, color: '#22d3ee' },
      { id: 'drainage', xRatio: 0.40, yRatio: 0.50, color: '#f59e0b' },
      { id: 'soil_moisture', xRatio: 0.90, yRatio: 0.38, color: '#10b981' },
      { id: 'ground_tilt', xRatio: 0.90, yRatio: 0.52, color: '#f97316' },
      { id: 'vibration', xRatio: 0.90, yRatio: 0.66, color: '#f43f5e' },
    ];

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. Render Video Frame onto Canvas if playing, or fallback image
      const video = videoRef.current;
      if (video && video.readyState >= 2) {
        ctx.save();
        const vAspect = video.videoWidth / video.videoHeight;
        const cAspect = width / height;
        let renderW = width;
        let renderH = height;
        if (cAspect > vAspect) {
          renderH = width / vAspect;
        } else {
          renderW = height * vAspect;
        }
        ctx.drawImage(video, (width - renderW) / 2, (height - renderH) / 2, renderW, renderH);
        ctx.restore();
      }

      // 2. Dark Mood Overlay
      const vignette = ctx.createRadialGradient(
        width * 0.35,
        height * 0.4,
        width * 0.2,
        width / 2,
        height / 2,
        width * 0.75
      );
      vignette.addColorStop(0, 'rgba(3, 0, 8, 0.45)');
      vignette.addColorStop(0.6, 'rgba(3, 0, 8, 0.78)');
      vignette.addColorStop(1, 'rgba(3, 0, 8, 0.96)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // 3. Scanning Laser Line
      const scanY = height * 0.2 + ((Math.sin(time * 0.8) + 1) / 2) * (height * 0.6);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(width * 0.45, scanY);
      ctx.lineTo(width, scanY);
      ctx.strokeStyle = activeMode === 'mountain' ? 'rgba(249, 115, 22, 0.45)' : 'rgba(0, 240, 255, 0.45)';
      ctx.lineWidth = 2;
      ctx.shadowColor = activeMode === 'mountain' ? '#f97316' : '#00F0FF';
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.restore();

      // 4. AI Mesh Lines
      ctx.save();
      ctx.lineWidth = 1;
      for (let i = 0; i < meshNodes.length; i++) {
        for (let j = i + 1; j < meshNodes.length; j++) {
          const n1 = meshNodes[i];
          const n2 = meshNodes[j];
          const x1 = n1.xRatio * width;
          const y1 = n1.yRatio * height;
          const x2 = n2.xRatio * width;
          const y2 = n2.yRatio * height;

          const dist = Math.hypot(x2 - x1, y2 - y1);
          if (dist < width * 0.45) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            const lineAlpha = (1 - dist / (width * 0.45)) * 0.35;
            ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
            ctx.stroke();

            const pulsePos = (time * 0.6 + i + j) % 1;
            const px = x1 + (x2 - x1) * pulsePos;
            const py = y1 + (y2 - y1) * pulsePos;

            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#00F0FF';
            ctx.shadowColor = '#00F0FF';
            ctx.shadowBlur = 8;
            ctx.fill();
          }
        }
      }
      ctx.restore();

      // 5. Pulsing Node Radar Rings
      meshNodes.forEach((node) => {
        const nx = node.xRatio * width;
        const ny = node.yRatio * height;

        ctx.save();
        ctx.beginPath();
        ctx.arc(nx, ny, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 14;
        ctx.fill();

        const ringRadius = 6 + ((time * 25 + nx) % 32);
        const ringAlpha = 1 - (ringRadius - 6) / 32;
        ctx.beginPath();
        ctx.arc(nx, ny, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = ringAlpha * 0.75;
        ctx.stroke();
        ctx.restore();
      });

      // 6. Floating Telemetry Surveillance Drones
      drones.forEach((drone) => {
        drone.y = drone.baseY + Math.sin(time * 2 + drone.floatOffset) * 14;

        ctx.save();
        ctx.beginPath();
        ctx.arc(drone.x, drone.y, drone.size, 0, Math.PI * 2);
        ctx.fillStyle = drone.color;
        ctx.shadowColor = drone.color;
        ctx.shadowBlur = 15;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(drone.x - drone.size * 1.5, drone.y + 4);
        ctx.lineTo(drone.x + drone.size * 1.5, drone.y + 4);
        ctx.lineTo(drone.x + drone.size * 3, drone.y + 35);
        ctx.lineTo(drone.x - drone.size * 3, drone.y + 35);
        ctx.closePath();

        const beamGrad = ctx.createLinearGradient(drone.x, drone.y, drone.x, drone.y + 35);
        beamGrad.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
        beamGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = beamGrad;
        ctx.fill();
        ctx.restore();
      });

      // 7. Falling Rain
      ctx.save();
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.55)';
      ctx.lineWidth = 1.2;
      rainDrops.forEach((drop) => {
        drop.y += drop.speed;
        drop.x += drop.tilt;

        if (drop.y > height) {
          drop.y = -20;
          drop.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.tilt * 2, drop.y + drop.length);
        ctx.stroke();
      });
      ctx.restore();

      // 8. Water Splash Ripples
      addSplash();
      ctx.save();
      for (let i = splashRipples.length - 1; i >= 0; i--) {
        const splash = splashRipples[i];
        splash.radius += 0.4;
        splash.opacity -= 0.02;

        if (splash.opacity <= 0 || splash.radius >= splash.maxRadius) {
          splashRipples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.ellipse(splash.x, splash.y, splash.radius * 1.8, splash.radius * 0.8, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${splash.opacity})`;
        ctx.lineWidth = 1;
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
  }, [activeMode]);

  return (
    <>
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-[-2] opacity-75 brightness-110 contrast-125 pointer-events-none"
      />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      />
    </>
  );
};
