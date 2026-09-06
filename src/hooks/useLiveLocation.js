import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const getSocketUrl = () => {
  const fallback = 'http://localhost:5002';
  if (typeof window === 'undefined') return fallback;
  return `${window.location.protocol}//${window.location.hostname}:5002`;
};

export const useLiveLocation = ({
  userId,
  role,
  enabled = true,
  onLocationUpdate,
  onSosTriggered,
  onSocketReady,
}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!enabled || !userId) return undefined;

    const socket = io(getSocketUrl(), {
      transports: ['websocket'],
      reconnection: true,
    });

    socketRef.current = socket;
    if (onSocketReady) onSocketReady(socket);

    socket.on('sos:active', (payload) => {
      if (onSosTriggered) onSosTriggered(payload);
    });

    socket.on('sos:resolved', (payload) => {
      if (onSosTriggered && payload?.userId === userId) {
        onSosTriggered(null);
      }
    });

    return () => {
      socket.off('sos:active');
      socket.off('sos:resolved');
      socket.disconnect();
    };
  }, [enabled, userId, onSosTriggered, onSocketReady]);

  useEffect(() => {
    if (!enabled || !userId || !navigator.geolocation) return undefined;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const payload = {
          userId,
          role,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          heading: position.coords.heading ?? 0,
          speed: position.coords.speed ?? 0,
          timestamp: new Date().toISOString(),
        };

        if (socketRef.current) {
          socketRef.current.emit('user:location_update', payload);
        }

        if (onLocationUpdate) onLocationUpdate(payload);
      },
      (error) => {
        console.warn('Live location tracking unavailable:', error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled, userId, role, onLocationUpdate]);

  return socketRef.current;
};
