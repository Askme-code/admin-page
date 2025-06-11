
"use client";

import React, { useEffect } from 'react';

interface AdSenseUnitProps {
  adClient: string;
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  layoutKey?: string; // Optional: for scenarios requiring a key for re-renders
}

const AdSenseUnit: React.FC<AdSenseUnitProps> = ({
  adClient,
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: 'block' },
  className,
  layoutKey,
}) => {
  // This key determines the identity of the AdSenseUnit instance from React's perspective.
  // If layoutKey is provided and changes, React will treat it as a new component instance,
  // unmounting the old one and mounting a new one.
  const reactKeyForAdUnit = layoutKey || `${adClient}-${adSlot}`;

  useEffect(() => {
    // This effect will run when the component mounts, or if reactKeyForAdUnit changes.
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        // The push({}) processes all ins tags with class adsbygoogle that haven't been filled.
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        // console.error("AdSense push error in AdSenseUnit.tsx: ", err);
        // Error is often "All 'ins' elements... already have ads in them."
        // The key prop on the div below is intended to prevent this by forcing a new DOM element
        // when reactKeyForAdUnit changes. If reactKeyForAdUnit is stable, this effect runs once on mount.
      }
    }
    // React StrictMode in development runs effects twice (mount-unmount-remount).
    // The keying strategy should help ensure that the "remount" gets a fresh <ins> tag.
  }, [reactKeyForAdUnit]); // Effect dependency matches the React key's source.

  return (
    // The `key` prop here ensures that if `reactKeyForAdUnit` changes,
    // React unmounts the entire old div (and its children, including <ins>)
    // and mounts a completely new one. This should present a "fresh" <ins> to AdSense.
    <div className={className} key={reactKeyForAdUnit}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
        // The `data-ad-layout-key` (if it was here) is an AdSense specific attribute,
        // not the React key. For solving this "already filled" issue,
        // the React key on the parent div is more relevant for ensuring DOM freshness.
      ></ins>
    </div>
  );
};

export default AdSenseUnit;
