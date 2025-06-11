
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
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("AdSense push error: ", err);
    }
  }, [adSlot, adClient, layoutKey]); // Re-run if these key props change

  return (
    <div className={className}>
      {/* Ad unit: responses */}
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
        data-ad-layout-key={layoutKey}
      ></ins>
    </div>
  );
};

export default AdSenseUnit;
