import { ImageOff } from "lucide-react";
import { type ImgHTMLAttributes, useEffect, useRef, useState } from "react";

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackLabel?: string;
}

export function SafeImage({
  fallbackLabel,
  className = "",
  onError,
  onLoad,
  alt = "",
  src,
  ...rest
}: SafeImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) {
      setStatus("loaded");
    } else {
      setStatus("loading");
    }
  }, [src]);

  if (status === "error") {
    return (
      <div
        className={`nhl-img-fallback ${className}`}
        role="img"
        aria-label={fallbackLabel || alt || "Image unavailable"}
      >
        <ImageOff size={18} strokeWidth={1.5} aria-hidden="true" />
        <span>{fallbackLabel || "Preview unavailable"}</span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      {...rest}
      src={src}
      alt={alt}
      className={`${className} ${status === "loading" ? "is-loading" : "is-loaded"}`.trim()}
      onLoad={(e) => {
        setStatus("loaded");
        onLoad?.(e);
      }}
      onError={(e) => {
        setStatus("error");
        onError?.(e);
      }}
    />
  );
}
