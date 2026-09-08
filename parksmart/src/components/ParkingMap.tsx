"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { ParkingLocation, DestinationOption } from "@/lib/types";
import { getAvailabilityStatus } from "@/lib/utils";
import { COLOMBO_CENTER } from "@/lib/data";

function createIcon(color: string, selected: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="ps-marker ${selected ? "ps-marker-selected" : ""}" style="background:${color};border:3px solid ${selected ? "#fff" : color};">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M19 17H5m14 0a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2m14 0a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2M6 7h12"/></svg>
      <div class="ps-marker-label">${selected ? "" : ""}</div>
    </div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });
}

export default function ParkingMap({
  parkings,
  destination,
  selectedId,
  onSelect,
  showRoute,
  height = "100%",
}: {
  parkings: ParkingLocation[];
  destination: DestinationOption | null;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  showRoute?: boolean;
  height?: string;
}) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [COLOMBO_CENTER.lat, COLOMBO_CENTER.lng],
      zoom: 13,
      scrollWheelZoom: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    setMapReady(true);
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // markers
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    const map = mapRef.current;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    parkings.forEach((p) => {
      const status = getAvailabilityStatus(p.availableSpaces, p.totalSpaces);
      const color = status === "available" ? "#16a34a" : status === "limited" ? "#f97316" : "#ef4444";
      const selected = selectedId === p.id;
      const marker = L.marker([p.latitude, p.longitude], {
        icon: createIcon(color, selected),
        title: p.name,
      }).addTo(map);

      marker.on("click", () => onSelect?.(p.id));

      const popup = L.popup({ offset: [0, -38] }).setContent(
        `<div style="font-family:inherit;min-width:200px">
          <div style="font-weight:700;font-size:14px;color:#0f172a">${p.name}</div>
          <div style="font-size:12px;color:#10b981;font-weight:600;margin-top:2px">● ${p.availableSpaces} / ${p.totalSpaces} spaces available</div>
          <div style="font-size:12px;color:#52525b;margin-top:2px">Rs. ${p.pricePerHour}/hour</div>
          <div style="font-size:12px;color:#52525b">${p.walkingDistance} m from destination · ★ ${p.rating}</div>
          <div style="display:flex;gap:6px;margin-top:8px">
            <a href="/parking/${p.id}" style="font-size:12px;font-weight:600;color:#2563eb;text-decoration:none;background:#eff6ff;padding:4px 8px;border-radius:6px">View Details</a>
            <a href="/reserve?parking=${p.id}" style="font-size:12px;font-weight:600;color:#fff;text-decoration:none;background:#2563eb;padding:4px 8px;border-radius:6px">Reserve</a>
          </div>
        </div>`
      );
      marker.bindPopup(popup);
      markersRef.current[p.id] = marker;
    });

    return () => {
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};
    };
  }, [parkings, mapReady, selectedId, onSelect]);

  // center on selected
  useEffect(() => {
    if (!mapRef.current || !selectedId || !mapReady) return;
    const p = parkings.find((x) => x.id === selectedId);
    if (p) {
      mapRef.current.flyTo([p.latitude, p.longitude], 15, { duration: 1 });
    }
  }, [selectedId, parkings, mapReady]);

  // destination marker
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    const map = mapRef.current;
    if (destination) {
      L.marker([destination.latitude, destination.longitude], {
        icon: L.divIcon({
          className: "",
          html: '<div class="ps-dest-marker"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>',
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        }),
        title: destination.name,
      })
        .addTo(map)
        .bindPopup(`<b>${destination.name}</b>`);
      if (!selectedId) {
        map.setView([destination.latitude, destination.longitude], 14);
      }
    }
  }, [destination, mapReady, selectedId]);

  // route
  useEffect(() => {
    if (!mapRef.current || !mapReady || !showRoute) return;
    const map = mapRef.current;
    if (routeLayerRef.current) {
      routeLayerRef.current.clearLayers();
    }
    routeLayerRef.current = L.layerGroup().addTo(map);

    const selected = parkings.find((p) => p.id === selectedId);
    if (selected && destination) {
      const points: [number, number][] = [
        [destination.latitude, destination.longitude],
        [selected.latitude, selected.longitude],
      ];
      L.polyline(points, {
        color: "#2563eb",
        weight: 4,
        opacity: 0.8,
        dashArray: "8 8",
      }).addTo(routeLayerRef.current);
    }
  }, [showRoute, selectedId, parkings, destination, mapReady]);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className="w-full rounded-2xl overflow-hidden"
      aria-label="Parking availability map"
    />
  );
}
