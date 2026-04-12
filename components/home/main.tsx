"use client"

import { useEffect, useRef } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder"
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css"

const Geo = {
  forwardGeocode: async (
    config: any,
  ): Promise<{ type: "FeatureCollection"; features: any[] }> => {
    const query = config.query
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=geojson&limit=5`

    try {
      const response = await fetch(url)
      const geojson = await response.json()

      const features = geojson.features.map((f: any) => ({
        ...f,
        type: "Feature",
        place_name: f.properties.display_name,
        center: f.geometry.coordinates,
      }))

      return { type: "FeatureCollection", features }
    } catch (e) {
      console.error("Geocoding failed", e)
      return { type: "FeatureCollection", features: [] }
    }
  },
}

export default function Home() {
  const mapRef = useRef<maplibregl.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const geocoderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    // Get user geolocation and center map there if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          mapRef.current?.setCenter([longitude, latitude])
        },
        (error) => {
          mapRef.current?.setCenter([123.8854, 10.3157])
          console.warn("Geolocation failed, using default center", error)
        },
      )
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      zoom: 16,
      attributionControl: {
        compact: true,
      },
    })

    const geocoder = new MaplibreGeocoder(Geo, {
      maplibregl: maplibregl,
      placeholder: "Search for a gas station or address...",
    })

    // Mount geocoder manually so we control its DOM position
    const geocoderEl = geocoder.onAdd(map)
    geocoderRef.current?.appendChild(geocoderEl)

    mapRef.current = map

    return () => {
      geocoder.onRemove()
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      <div
        ref={geocoderRef}
        className="absolute top-0 left-0 right-0 z-10 p-4"
      />
    </div>
  )
}
