"use client";

/* ──────────────────────────────────────────────────────────────
   FaviconImg — favicon <img> with the graceful onError fallback
   (hide the img; optionally reveal an emoji sibling). Extracted as
   the ONLY client piece of the tool dossier pages so the page
   itself can be a server component and the 300KB+ dossier dataset
   never ships to the browser.
   ────────────────────────────────────────────────────────────── */

export default function FaviconImg({
  domain,
  alt,
  size,
  className,
  fallbackIcon,
  fallbackClassName,
}: {
  domain: string;
  alt: string;
  size: number;
  className?: string;
  fallbackIcon?: string;
  fallbackClassName?: string;
}) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
        alt={alt}
        width={size}
        height={size}
        className={className}
        loading="lazy"
        onError={(e) => {
          const el = e.currentTarget;
          el.style.display = "none";
          if (fallbackIcon && el.nextElementSibling) {
            (el.nextElementSibling as HTMLElement).style.display = "flex";
          }
        }}
      />
      {fallbackIcon && (
        <span className={fallbackClassName ?? "text-3xl hidden items-center justify-center w-full h-full"}>
          {fallbackIcon}
        </span>
      )}
    </>
  );
}
