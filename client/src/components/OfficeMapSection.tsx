import {
  APILoadingStatus,
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  InfoWindow,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
} from "@vis.gl/react-google-maps";
import { ArrowUpRight, Globe2, MapPin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { OFFICE_LOCATIONS, type OfficeLocation } from "../data/nhlData";

const BOTH_BOUNDS = {
  north: 34.5,
  south: 3.5,
  east: 126.0,
  west: 75.0,
};

function MapCameraController({
  focusMode,
  selectedOffice,
}: {
  focusMode: "both" | OfficeLocation["id"];
  selectedOffice: OfficeLocation;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (focusMode === "both") {
      map.fitBounds(BOTH_BOUNDS, { top: 44, bottom: 32, left: 44, right: 44 });
      return;
    }
    map.panTo({ lat: selectedOffice.lat, lng: selectedOffice.lng });
    map.setZoom(selectedOffice.zoom);
  }, [map, focusMode, selectedOffice]);

  return null;
}

function OfficeMarkerPin({
  office,
  isSelected,
  showInfoWindow,
  onSelect,
  onCloseInfo,
}: {
  office: OfficeLocation;
  isSelected: boolean;
  showInfoWindow: boolean;
  onSelect: () => void;
  onCloseInfo: () => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: office.lat, lng: office.lng }}
        title={office.title}
        zIndex={isSelected ? 20 : 10}
        onClick={onSelect}
      >
        <div className={`nhl-gmp-pin ${isSelected ? "is-selected" : ""}`}>
          <span className="nhl-gmp-pin-num tabular-nums">{office.pinNumber}</span>
          <span className="nhl-gmp-pin-name">{office.shortName}</span>
        </div>
      </AdvancedMarker>

      {showInfoWindow && marker && (
        <InfoWindow anchor={marker} maxWidth={280} onCloseClick={onCloseInfo}>
          <div className="nhl-gmp-info">
            <span className="nhl-gmp-info-kicker">
              {office.pinNumber} · {office.role}
            </span>
            <strong className="nhl-gmp-info-title">{office.title}</strong>
            <p className="nhl-gmp-info-address">{office.address}</p>
            <p className="nhl-gmp-info-cap">{office.capabilities}</p>
            <a
              href={office.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nhl-gmp-info-link"
            >
              <span>Open in Google Maps</span>
              <ArrowUpRight size={13} strokeWidth={1.6} aria-hidden="true" />
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function OfficeMapCanvas({
  focusMode,
  selectedOfficeId,
  infoOpenId,
  onSelectOffice,
  onCloseInfo,
}: {
  focusMode: "both" | OfficeLocation["id"];
  selectedOfficeId: OfficeLocation["id"];
  infoOpenId: OfficeLocation["id"] | null;
  onSelectOffice: (id: OfficeLocation["id"]) => void;
  onCloseInfo: () => void;
}) {
  const status = useApiLoadingStatus();
  const selectedOffice =
    OFFICE_LOCATIONS.find((o) => o.id === selectedOfficeId) ?? OFFICE_LOCATIONS[0];

  if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="nhl-gmp-fallback" role="status">
        <MapPin size={18} strokeWidth={1.5} aria-hidden="true" />
        <p>
          Interactive map unavailable right now. Open direct directions for{" "}
          <a
            href={OFFICE_LOCATIONS[0].directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nhl-link"
          >
            Ningbo HQ
          </a>{" "}
          or{" "}
          <a
            href={OFFICE_LOCATIONS[1].directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nhl-link"
          >
            Colombo Regional Office
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="nhl-gmap-canvas">
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={{ lat: 18.4, lng: 100.7 }}
        defaultZoom={3}
        gestureHandling="cooperative"
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={true}
        internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
        style={{ width: "100%", height: "100%" }}
      >
        <MapCameraController focusMode={focusMode} selectedOffice={selectedOffice} />
        {OFFICE_LOCATIONS.map((office) => (
          <OfficeMarkerPin
            key={office.id}
            office={office}
            isSelected={selectedOfficeId === office.id}
            showInfoWindow={infoOpenId === office.id}
            onSelect={() => onSelectOffice(office.id)}
            onCloseInfo={onCloseInfo}
          />
        ))}
      </GoogleMap>
    </div>
  );
}

export function OfficeMapSection() {
  const [apiKey, setApiKey] = useState<string>(
    () => import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  );
  const [keyChecked, setKeyChecked] = useState<boolean>(() =>
    Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
  );
  const [focusMode, setFocusMode] = useState<"both" | OfficeLocation["id"]>("both");
  const [selectedOfficeId, setSelectedOfficeId] = useState<OfficeLocation["id"]>("ningbo");
  const [infoOpenId, setInfoOpenId] = useState<OfficeLocation["id"] | null>(null);

  useEffect(() => {
    if (apiKey) return;
    let cancelled = false;
    fetch("/api/maps-config")
      .then((res) => (res.ok ? res.json() : { apiKey: "" }))
      .then((data: { apiKey?: string }) => {
        if (cancelled) return;
        if (data?.apiKey) setApiKey(data.apiKey);
        setKeyChecked(true);
      })
      .catch(() => {
        if (!cancelled) setKeyChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  const handleSelectOffice = useCallback((id: OfficeLocation["id"]) => {
    setSelectedOfficeId(id);
    setFocusMode(id);
    setInfoOpenId(id);
  }, []);

  const handleShowBoth = useCallback(() => {
    setFocusMode("both");
    setInfoOpenId(null);
  }, []);

  return (
    <div className="nhl-offices-explorer">
      {/* Interactive Office Cards (1: Ningbo HQ, 2: Colombo Regional Office) */}
      <div className="nhl-inquiry-offices">
        {OFFICE_LOCATIONS.map((office) => {
          const isActive = focusMode === office.id;
          return (
            <div
              key={office.id}
              className={`nhl-office-card ${isActive ? "is-active" : ""}`}
            >
              <div className="nhl-office-card-top">
                <span className="nhl-label">
                  Pin {office.pinNumber} · {office.role}
                </span>
                <button
                  type="button"
                  className={`nhl-office-pin-btn ${isActive ? "is-active" : ""}`}
                  aria-pressed={isActive}
                  onClick={() => handleSelectOffice(office.id)}
                >
                  <MapPin size={12} strokeWidth={1.6} aria-hidden="true" />
                  <span>{isActive ? "Pinned" : "Focus pin"}</span>
                </button>
              </div>

              <h3>{office.title}</h3>
              <p>{office.address}</p>
              <span className="nhl-office-detail">{office.capabilities}</span>

              <div className="nhl-office-links">
                <a
                  href={office.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nhl-link"
                >
                  <span>Google Maps Pin</span>
                  <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
                </a>
                {office.phone && office.email && (
                  <>
                    <span aria-hidden="true">·</span>
                    <a
                      href={`tel:${office.phone.replace(/\s+/g, "")}`}
                      className="nhl-link"
                    >
                      {office.phone}
                    </a>
                    <span aria-hidden="true">·</span>
                    <a href={`mailto:${office.email}`} className="nhl-link">
                      {office.email}
                    </a>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Google Maps Viewport with Switcher Controls */}
      <div className="nhl-gmap-shell">
        <div className="nhl-gmap-bar">
          <div className="nhl-gmap-bar-title">
            <span className="nhl-label">Global Offices Map · Live Google Maps</span>
          </div>
          <div className="nhl-gmap-controls" role="group" aria-label="Select office pin on map">
            <button
              type="button"
              className={`nhl-gmap-btn ${focusMode === "both" ? "is-active" : ""}`}
              onClick={handleShowBoth}
            >
              <Globe2 size={13} strokeWidth={1.6} aria-hidden="true" />
              <span>Both pins</span>
            </button>
            {OFFICE_LOCATIONS.map((office) => (
              <button
                key={office.id}
                type="button"
                className={`nhl-gmap-btn ${focusMode === office.id ? "is-active" : ""}`}
                onClick={() => handleSelectOffice(office.id)}
              >
                <span className="tabular-nums">{office.pinNumber}</span>
                <span>{office.shortName}</span>
              </button>
            ))}
          </div>
        </div>

        {!keyChecked ? (
          <div className="nhl-gmp-fallback" role="status">
            <span className="nhl-spinner" aria-hidden="true" />
            <span>Loading office locations map...</span>
          </div>
        ) : !apiKey ? (
          <div className="nhl-gmp-fallback" role="status">
            <MapPin size={18} strokeWidth={1.5} aria-hidden="true" />
            <p>
              View pin locations directly on Google Maps:{" "}
              <a
                href={OFFICE_LOCATIONS[0].directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="nhl-link"
              >
                1. Ningbo, China HQ
              </a>{" "}
              ·{" "}
              <a
                href={OFFICE_LOCATIONS[1].directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="nhl-link"
              >
                2. Regional Office Colombo, Sri Lanka
              </a>
            </p>
          </div>
        ) : (
          <APIProvider apiKey={apiKey} language="en" libraries={["marker"]}>
            <OfficeMapCanvas
              focusMode={focusMode}
              selectedOfficeId={selectedOfficeId}
              infoOpenId={infoOpenId}
              onSelectOffice={handleSelectOffice}
              onCloseInfo={() => setInfoOpenId(null)}
            />
          </APIProvider>
        )}
      </div>
    </div>
  );
}
