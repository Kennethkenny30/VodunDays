import { NextResponse } from "next/server"

const WMO_CODES: Record<number, { condition: string; icon: string }> = {
  0:  { condition: "Ensoleillé",            icon: "sun"   },
  1:  { condition: "Peu nuageux",           icon: "sun"   },
  2:  { condition: "Partiellement nuageux", icon: "cloud" },
  3:  { condition: "Couvert",               icon: "cloud" },
  45: { condition: "Brouillard",            icon: "cloud" },
  51: { condition: "Bruine légère",         icon: "rain"  },
  61: { condition: "Pluie légère",          icon: "rain"  },
  63: { condition: "Pluie modérée",         icon: "rain"  },
  65: { condition: "Pluie forte",           icon: "rain"  },
  80: { condition: "Averses",               icon: "rain"  },
  95: { condition: "Orage",                 icon: "storm" },
  99: { condition: "Orage violent",         icon: "storm" },
}

// Fallback si pas de coordonnées : Ouidah
const DEFAULT_LAT = 6.3676
const DEFAULT_LON = 2.0833

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get("lat") ?? String(DEFAULT_LAT))
  const lon = parseFloat(searchParams.get("lon") ?? String(DEFAULT_LON))
  const locationName = searchParams.get("name") ?? "Votre position"

  const url = new URL("https://api.open-meteo.com/v1/forecast")
  url.searchParams.set("latitude",      String(lat))
  url.searchParams.set("longitude",     String(lon))
  url.searchParams.set("current",       "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,uv_index")
  url.searchParams.set("daily",         "temperature_2m_max,temperature_2m_min")
  url.searchParams.set("hourly",        "temperature_2m,weather_code")
  url.searchParams.set("timezone",      "auto")  // ← détecte automatiquement le fuseau selon lat/lon
  url.searchParams.set("forecast_days", "1")

  const res  = await fetch(url.toString(), { next: { revalidate: 1800 } })
  const data = await res.json()

  const wmo     = WMO_CODES[data.current.weather_code] ?? { condition: "Inconnu", icon: "sun" }
  const nowHour = new Date().getHours()

  const hourly = data.hourly.time
    .map((t: string, i: number) => ({
      h:    t.slice(11, 16),
      t:    Math.round(data.hourly.temperature_2m[i]),
      icon: (WMO_CODES[data.hourly.weather_code[i]] ?? { icon: "sun" }).icon,
    }))
    .filter((_: unknown, i: number) => {
      const h = parseInt(data.hourly.time[i].slice(11, 13))
      return h >= nowHour && h <= nowHour + 8
    })
    .slice(0, 5)

  return NextResponse.json({
    temperature: Math.round(data.current.temperature_2m),
    condition:   wmo.condition,
    icon:        wmo.icon,
    high:        Math.round(data.daily.temperature_2m_max[0]),
    low:         Math.round(data.daily.temperature_2m_min[0]),
    wind:        Math.round(data.current.wind_speed_10m),
    humidity:    data.current.relative_humidity_2m,
    uv:          Math.round(data.current.uv_index ?? 0),
    location:    locationName,
    hourly,
  })
}