"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { MapArtifact } from "@/contexts/artifact";
import { getImgUrl } from "@/lib/imgProcessor";
import SkeletonImage from "@/components/SkeletonImage";

interface MapComponentProps {
  locale: string;
  dict: any;
  /** Architecture items with coordinates, prepared on the server */
  artifacts: MapArtifact[];
}

interface MappedArtifact {
  item: MapArtifact;
  coords: [number, number];
}

export default function MapComponent({ locale, dict, artifacts }: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersClusterRef = useRef<any>(null);
  const markerByItemRef = useRef<Map<string, any>>(new Map());
  const layersRef = useRef<{ osm: any; satellite: any } | null>(null);
  const leafletRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const [mappedList, setMappedList] = useState<MappedArtifact[]>([]);
  // Markers are added once Leaflet has loaded
  const isLoading = !isMapReady;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mapMode, setMapMode] = useState<"osm" | "satellite">("osm");

  // Filtered list based on search input
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return mappedList;
    const q = searchQuery.toLowerCase().trim();
    return mappedList.filter(
      ({ item }) =>
        item.name.toLowerCase().includes(q) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.short_description &&
          item.short_description.toLowerCase().includes(q))
    );
  }, [mappedList, searchQuery]);

  // Initialize the Leaflet map once (independent of the artifact data)
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;
    let map: any = null;

    async function initMap() {
      const leafletModule = await import("leaflet");
      let L = (leafletModule.default || leafletModule) as any;

      // Wrap in Proxy to allow plugins like leaflet.markercluster to attach properties to L
      if (!Object.isExtensible(L)) {
        const target: any = {};
        L = new Proxy(target, {
          get(t, prop) {
            if (prop in t) return t[prop];
            return (
              (leafletModule as any)[prop] ??
              (leafletModule.default as any)?.[prop]
            );
          },
          set(t, prop, val) {
            t[prop] = val;
            return true;
          },
          has(t, prop) {
            return (
              prop in t ||
              prop in leafletModule ||
              Boolean(leafletModule.default && prop in leafletModule.default)
            );
          },
        });
      }

      // @ts-ignore
      window.L = L;
      leafletRef.current = L;

      if (!L.markerClusterGroup) {
        await import("leaflet.markercluster");
      }

      if (!isMounted || !mapContainerRef.current) return;

      // Vietnam center coordinates and default zoom
      const defaultCenter: [number, number] = [16.0544, 107.5];
      const defaultZoom = 6;

      map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: false,
        maxZoom: 18,
      });

      mapInstanceRef.current = map;

      // 1. OpenStreetMap France Layer (Clean Vietnamese typography)
      const osmLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> France',
          maxNativeZoom: 18,
          maxZoom: 18,
        }
      );

      // 2. ESRI Satellite Layer (maxNativeZoom: 17 to prevent "Data Unavailable")
      const satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: '&copy; Esri, Earthstar Geographics, USDA, USGS',
          maxNativeZoom: 17,
          maxZoom: 18,
        }
      );

      layersRef.current = { osm: osmLayer, satellite: satelliteLayer };
      osmLayer.addTo(map);

      // Setup Marker Cluster Group
      const clusterGroup = (L as any).markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 45,
        spiderfyOnMaxZoom: true,
        iconCreateFunction: (cluster: any) => {
          const count = cluster.getChildCount();
          return L.divIcon({
            html: `<div class="custom-cluster-badge"><span>${count}</span></div>`,
            className: "custom-cluster-icon",
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });
        },
      });

      markersClusterRef.current = clusterGroup;
      map.addLayer(clusterGroup);

      if (isMounted) setIsMapReady(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (map) {
        map.remove();
        mapInstanceRef.current = null;
        markersClusterRef.current = null;
      }
      setIsMapReady(false);
    };
  }, []);

  // Add markers once the map is ready and whenever the artifact list changes
  useEffect(() => {
    const L = leafletRef.current;
    const clusterGroup = markersClusterRef.current;
    if (!isMapReady || !L || !clusterGroup) return;

    clusterGroup.clearLayers();
    markerByItemRef.current.clear();

    // Helper to build a marker for an artifact
    function createMarker(item: MapArtifact, coords: [number, number]) {
      const singleIcon = L.divIcon({
        html: `<div class="custom-single-pin"><div class="custom-single-pin-inner"></div></div>`,
        className: "custom-single-marker",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      const marker = L.marker(coords, { icon: singleIcon, title: item.name });

      const popupContent = `
        <div class="w-64 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 overflow-hidden font-sans">
          <div class="h-32 w-full overflow-hidden bg-stone-100 relative">
            <img src="${getImgUrl(item.main_image, 400)}" alt="${item.name.replace(/"/g, "&quot;")}" class="w-full h-full object-cover" onerror="this.src='/icon.png'" />
          </div>
          <div class="p-3">
            <h4 class="font-bold text-sm text-stone-900 dark:text-stone-100 line-clamp-2 leading-tight">${item.name}</h4>
            <div class="flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400 mt-1">
              <span>📍 ${item.location || "Việt Nam"}</span>
              ${item.artifact_date ? `<span class="opacity-40">•</span><span>${item.artifact_date}</span>` : ""}
            </div>
            ${item.short_description ? `<p class="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2 mt-1.5 italic">${item.short_description}</p>` : ""}
            <a href="/${locale}/artifact/${item.id}" style="color: #ffffff !important;" class="mt-3 block w-full text-center py-1.5 bg-viet-red text-white text-xs font-bold rounded hover:opacity-90 transition-opacity no-underline">
              ${dict.map_view_details || "Xem chi tiết"} &rarr;
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 280 });
      marker.on("click", () => {
        setSelectedId(item.id);
      });

      markerByItemRef.current.set(item.id, marker);
      return marker;
    }

    // Already filtered on the server (architecture + explicit coordinates)
    const mapped: MappedArtifact[] = artifacts.map((item) => ({
      item,
      coords: item.coords,
    }));

    setMappedList(mapped);
    if (mapped.length === 0) return;

    // Add all markers in one pass so the cluster is computed only once
    clusterGroup.addLayers(
      mapped.map(({ item, coords }) => createMarker(item, coords))
    );
  }, [isMapReady, artifacts, locale, dict]);

  // Focus marker when clicked from sidebar list
  function handleSelectArtifact(item: MapArtifact, coords: [number, number]) {
    setSelectedId(item.id);
    const map = mapInstanceRef.current;
    const marker = markerByItemRef.current.get(item.id);

    if (map) {
      map.flyTo(coords, 14, { duration: 1.2 });
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 1200);
      }
    }
  }

  // Reset to nationwide overview
  function handleResetView() {
    setSelectedId(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([16.0544, 107.5], 6, { duration: 1 });
    }
  }

  // Zoom controls
  function handleZoomIn() {
    mapInstanceRef.current?.zoomIn();
  }

  function handleZoomOut() {
    mapInstanceRef.current?.zoomOut();
  }

  // Toggle Map Mode: OSM France vs ESRI Satellite
  function toggleMapMode() {
    const map = mapInstanceRef.current;
    if (!map || !layersRef.current) return;
    const { osm, satellite } = layersRef.current;

    if (mapMode === "osm") {
      map.removeLayer(osm);
      satellite.addTo(map);
      setMapMode("satellite");
    } else {
      map.removeLayer(satellite);
      osm.addTo(map);
      setMapMode("osm");
    }
  }

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-stone-100 dark:bg-stone-900">
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-30 pointer-events-none flex items-center justify-between gap-2">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Toggle Sidebar Button with Chevron */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="btn h-9 px-3 bg-white/95 dark:bg-stone-900/95 text-stone-700 dark:text-stone-200 rounded-lg shadow-md border border-stone-200/80 dark:border-stone-800 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md hover:text-viet-red transition-all cursor-pointer"
            title={
              isSidebarOpen
                ? dict.map_collapse || "Thu gọn danh sách"
                : dict.map_locations || "Mở danh sách địa điểm"
            }
          >
            {isSidebarOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            )}
            <span className="hidden sm:inline">
              {isSidebarOpen
                ? dict.map_collapse || "Thu gọn"
                : dict.map_locations || "Địa điểm"}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-viet-red font-bold flex items-center gap-1">
              {isLoading && (
                <span className="w-1.5 h-1.5 rounded-full bg-viet-red animate-ping" />
              )}
              <span>{filteredList.length}</span>
            </span>
          </motion.button>

          {/* Reset Overview Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResetView}
            className="btn h-9 px-3 bg-white/95 dark:bg-stone-900/95 text-stone-700 dark:text-stone-200 rounded-lg shadow-md border border-stone-200/80 dark:border-stone-800 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md hover:text-viet-red transition-all cursor-pointer"
            title={dict.map_overview || "Toàn cảnh"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m10 15 5-3-5-3v6Z" />
            </svg>
            <span className="hidden sm:inline">
              {dict.map_overview || "Toàn cảnh"}
            </span>
          </motion.button>
        </div>

        {/* Right Action Buttons: Zoom & Map Mode */}
        <div className="flex items-center gap-1 sm:gap-1.5 pointer-events-auto bg-white/95 dark:bg-stone-900/95 p-1 rounded-lg shadow-md border border-stone-200/80 dark:border-stone-800 backdrop-blur-md">
          {/* Zoom In Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleZoomIn}
            className="btn p-2 text-stone-700 dark:text-stone-200 hover:text-viet-red hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-all cursor-pointer"
            title="Zoom In"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" x2="16.65" y1="21" y2="16.65" />
              <line x1="11" x2="11" y1="8" y2="14" />
              <line x1="8" x2="14" y1="11" y2="11" />
            </svg>
          </motion.button>

          {/* Zoom Out Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleZoomOut}
            className="btn p-2 text-stone-700 dark:text-stone-200 hover:text-viet-red hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-all cursor-pointer"
            title="Zoom Out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" x2="16.65" y1="21" y2="16.65" />
              <line x1="8" x2="14" y1="11" y2="11" />
            </svg>
          </motion.button>

          <div className="h-4 w-px bg-stone-200 dark:bg-stone-700 mx-0.5" />

          {/* Toggle Globe / Earth Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMapMode}
            className={`btn px-2.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
              mapMode === "satellite"
                ? "bg-viet-red text-white hover:bg-viet-red/90"
                : "text-stone-700 dark:text-stone-200 hover:text-viet-red hover:bg-stone-100 dark:hover:bg-stone-800"
            }`}
            title={
              mapMode === "osm"
                ? dict.map_mode_satellite || "Ảnh vệ tinh"
                : dict.map_mode_map || "Bản đồ"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <span className="hidden md:inline">
              {mapMode === "osm"
                ? dict.map_mode_map || "Bản đồ"
                : dict.map_mode_satellite || "Ảnh vệ tinh"}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Floating Left Sidebar */}
      <div
        className={`absolute top-14 left-3 bottom-3 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] z-20 pointer-events-auto bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-stone-200/80 dark:border-stone-800 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-[120%] opacity-0 pointer-events-none"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-tight text-viet-red flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
                <path d="M15 5.764v15" />
                <path d="M9 3.236v15" />
              </svg>
              <span>{dict.nav_map || "Địa điểm kiến trúc"}</span>
            </h2>
            <div className="flex items-center gap-1">
              {isLoading && (
                <span className="text-[10px] text-stone-500 animate-pulse">
                  {dict.map_locating || "Đang định vị..."}
                </span>
              )}
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-viet-red">
                {filteredList.length}
              </span>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                dict.map_search_placeholder || "Tìm công trình hoặc địa danh..."
              }
              className="w-full text-xs px-3 py-2 pl-8 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-1 focus:ring-viet-red"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-2.5 top-2.5 text-stone-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Item List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
          {filteredList.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-xs italic">
              {isLoading
                ? dict.map_locating || "Đang định vị..."
                : dict.map_no_results || "Không tìm thấy hiện vật kiến trúc phù hợp."}
            </div>
          ) : (
            filteredList.map(({ item, coords }) => {
              const isSelected = selectedId === item.id;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectArtifact(item, coords)}
                  className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-red-50 dark:bg-red-950/30 border-l-4 border-viet-red"
                      : "hover:bg-stone-50 dark:hover:bg-stone-800/50"
                  }`}
                >
                  <div className="w-14 h-14 shrink-0 rounded-md overflow-hidden">
                    <SkeletonImage
                      src={getImgUrl(item.main_image, 160)}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      fallbackClassName="object-contain! p-2 opacity-60"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-viet-red">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5 truncate">
                      <span>📍</span>
                      <span className="truncate">{item.location || "Việt Nam"}</span>
                    </p>
                    {item.artifact_date && (
                      <span className="inline-block text-[10px] text-stone-400 dark:text-stone-500 mt-1">
                        {item.artifact_date}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Map Container */}
      <div ref={mapContainerRef} className="h-full w-full z-10" />
    </div>
  );
}
