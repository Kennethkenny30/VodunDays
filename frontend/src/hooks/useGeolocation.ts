"use client";

import { useState, useCallback, useEffect, useRef } from "react";

// Types

export interface UserLocation {
  longitude: number;
  latitude:  number;
  accuracy?: number; // mètres
}

export interface GeolocationState {
  location:         UserLocation | null;
  error:            string | null;
  loading:          boolean;
  permissionDenied: boolean;
  requestLocation:  () => void;
}

// Options

/**
 * maximumAge: 0  → jamais de cache, position fraîche à chaque fois
 * enableHighAccuracy: true → GPS hardware (vs réseau/IP)
 * timeout: 15000 → laisse le temps au GPS de fixer
 */
const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge:         0,
  timeout:            15_000,
};

// Hook

export interface UseGeolocationOptions {
  /** Si false, ne demande pas la permission au montage : attendre un geste utilisateur (requestLocation) */
  auto?: boolean;
}

export function useGeolocation({ auto = true }: UseGeolocationOptions = {}): GeolocationState {
  const [location,         setLocation]         = useState<UserLocation | null>(null);
  const [error,            setError]            = useState<string | null>(null);
  const [loading,          setLoading]          = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const watchIdRef = useRef<number | null>(null);

  const onSuccess = useCallback((pos: GeolocationPosition) => {
    setLocation({
      longitude: pos.coords.longitude,
      latitude:  pos.coords.latitude,
      accuracy:  pos.coords.accuracy,
    });
    setLoading(false);
    setError(null);
    setPermissionDenied(false);
  }, []);

  const onError = useCallback((err: GeolocationPositionError) => {
    setLoading(false);
    switch (err.code) {
      case err.PERMISSION_DENIED:
        setError("Accès à la position refusé");
        setPermissionDenied(true);
        break;
      case err.POSITION_UNAVAILABLE:
        setError("Position non disponible");
        break;
      case err.TIMEOUT:
        setError("Délai d'attente dépassé");
        break;
      default:
        setError("Erreur de géolocalisation");
    }
  }, []);

  const startWatch = useCallback(() => {
    if (!navigator?.geolocation) {
      setError("Géolocalisation non supportée");
      return;
    }
    // Évite les watchers dupliqués
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setLoading(true);
    setError(null);
    watchIdRef.current = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      GEO_OPTIONS,
    );
  }, [onSuccess, onError]);

  // Démarre au montage seulement si auto (sinon la permission attend un geste utilisateur)
  useEffect(() => {
    if (auto) startWatch();
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [auto, startWatch]);

  return { location, error, loading, permissionDenied, requestLocation: startWatch };
}