"use client";

import { useEffect, useRef } from "react";

const RESTAURANT_COORDS: Record<string, [number, number]> = {
  "Berliner Döner Haus": [52.5206, 13.4027],
  "Napoli Pizza & Pasta": [52.5251, 13.3817],
  "Tokyo Ramen & Sushi": [52.5145, 13.4108],
  "Burger Brothers": [52.5302, 13.3847],
};

async function geocode(address: string): Promise<[number, number] | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ", Deutschland")}&format=json&limit=1`;
    const res = await fetch(url, { headers: { "Accept-Language": "de" } });
    const data = await res.json();
    if (data?.[0]) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    return null;
  } catch {
    return null;
  }
}

interface Props {
  restaurantName: string;
  address: string;
  totalDurationMs: number;
}

export default function MapTracker({ restaurantName, address, totalDurationMs }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const startCoord: [number, number] = RESTAURANT_COORDS[restaurantName] ?? [52.5206, 13.4027];
    const defaultEnd: [number, number] = [52.5120, 13.4220];

    let map: import("leaflet").Map;
    let animFrame: number;

    const run = async () => {
      const L = await import("leaflet");

      // Fix marker icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Geocode user address
      let endCoord = defaultEnd;
      if (address) {
        const result = await geocode(address);
        if (result) endCoord = result;
      }

      if (!mapRef.current) return;

      const center: [number, number] = [
        (startCoord[0] + endCoord[0]) / 2,
        (startCoord[1] + endCoord[1]) / 2,
      ];

      map = L.map(mapRef.current, { zoomControl: true, attributionControl: true }).setView(center, 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      }).addTo(map);

      // Force size recalculation
      setTimeout(() => map?.invalidateSize(), 100);

      const makeIcon = (emoji: string, size: number) =>
        L.divIcon({
          html: `<div style="font-size:${size}px;line-height:1;">${emoji}</div>`,
          iconSize: [size + 8, size + 8],
          iconAnchor: [(size + 8) / 2, (size + 8) / 2],
        });

      L.marker(endCoord, { icon: makeIcon("📍", 26) }).addTo(map).bindTooltip("Deine Adresse");
      L.marker(startCoord, { icon: makeIcon("🍽️", 22) }).addTo(map).bindTooltip(restaurantName);
      L.polyline([startCoord, endCoord], { color: "#f97316", weight: 2, dashArray: "6 6", opacity: 0.6 }).addTo(map);

      const courier = L.marker(startCoord, { icon: makeIcon("🛵", 28) }).addTo(map);

      let startTime: number | null = null;
      const animate = (ts: number) => {
        if (!startTime) startTime = ts;
        const prog = Math.min((ts - startTime) / totalDurationMs, 1);
        const eased = prog < 0.5 ? 2 * prog * prog : -1 + (4 - 2 * prog) * prog;
        courier.setLatLng([
          startCoord[0] + (endCoord[0] - startCoord[0]) * eased,
          startCoord[1] + (endCoord[1] - startCoord[1]) * eased,
        ]);
        if (prog < 1) animFrame = requestAnimationFrame(animate);
      };
      animFrame = requestAnimationFrame(animate);
    };

    run();

    return () => {
      cancelAnimationFrame(animFrame);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (map) map.remove();
    };
  }, [restaurantName, address, totalDurationMs]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}
