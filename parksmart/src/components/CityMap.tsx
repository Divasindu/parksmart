"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { ParkingLocation } from "@/lib/types";
import { COLOMBO_CENTER } from "@/lib/data";

export default function CityMap({
  legalParkings,
  selectedId,
  onSelect,
}: {
  legalParkings: ParkingLocation[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [COLOMBO_CENTER.lat, COLOMBO_CENTER.lng],
      zoom: 13,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    setReady(true);
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !ready) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Green legal markers
    const map = mapRef.current;
    legalParkings.forEach((p) => {
      const marker = L.marker([p.latitude, p.longitude], {
        icon: L.divIcon({
          className: "",
          html: `<div class="ps-safe-marker ${selectedId === p.id ? "ps-safe-marker-selected" : ""}"><span>P</span></div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 34],
        }),
      })
        .addTo(map)
        .bindPopup(`<div style="min-width:170px"><b>${p.name}</b><br/><span style="color:#059669">● Legal parking</span><br/><span style="font-size:12px;color:#52525b">${p.area} · ${p.walkingDistance} m</span><br/><a href="/parking/${p.id}" style="color:#2563eb;font-weight:600;font-size:12px">View details</a></div>`);
      marker.on("click", () => onSelect?.(p.id));
      markersRef.current.push(marker);
    });

    // Red "no parking" zones (illustrative)
    [
      { lat: 6.936, lng: 79.846, name: "Chatham Street" },
      { lat: 6.9235, lng: 79.8465, name: "Promenade Edge" },
    ].forEach((z) => {
      L.marker([z.lat, z.lng], {
        icon: L.divIcon({
          className: "",
          html: `<div class="ps-nopark-marker"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M6 6l12 12"/></svg></div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      })
        .addTo(map)
        .bindPopup(`<div min-w:170px;><b style="color:#dc2626">${z.name} — No parking</b><br/><span style="font-size:12px;color:#52525b">Roadside stopping is prohibited.</span></div>`);
    });
  }, [legalParkings, ready, selectedId, onSelect]);

  useEffect(() => {
    if (!mapRef.current || !selectedId || !ready) return;
    const p = legalParkings.find((x) => x.id === selectedId);
    if (p) mapRef.current.flyTo([p.latitude, p.longitude], 15, { duration: 0.8 });
  }, [selectedId, legalParkings, ready]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-2xl overflow-hidden"
      aria-label="Safe parking zones map"
    />
  );
}