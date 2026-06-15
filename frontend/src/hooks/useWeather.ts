import { useState, useEffect } from "react"
import type { WeatherData } from "@/lib/types"

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    async function fetchWeather(lat: number, lon: number, name: string) {
      try {
        const res  = await fetch(`/api/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}`)
        const data = await res.json()
        setWeather(data)
      } catch {
        setError("Météo indisponible")
      } finally {
        setLoading(false)
      }
    }

    async function resolveLocationName(lat: number, lon: number): Promise<string> {
      try {
        // Reverse geocoding gratuit via Open-Meteo Search
        const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
        const data = await res.json()
        const city    = data.address?.city ?? data.address?.town ?? data.address?.village ?? ""
        const country = data.address?.country ?? ""
        return city ? `${city}, ${country}` : country || "Votre position"
      } catch {
        return "Votre position"
      }
    }

    if (!navigator.geolocation) {
      // Pas de GPS - fallback Ouidah
      fetchWeather(6.3676, 2.0833, "Ouidah, Bénin")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        const name = await resolveLocationName(latitude, longitude)
        fetchWeather(latitude, longitude, name)
      },
      () => {
        // Permission refusée ou erreur - fallback Ouidah
        fetchWeather(6.3676, 2.0833, "Ouidah, Bénin")
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300_000 }
    )
  }, [])

  return { weather, loading, error }
}