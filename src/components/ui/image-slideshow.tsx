
"use client";

import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface ImageSlideshowProps {
  images: (string | StaticImageData)[];
  interval?: number;
  className?: string;
  imageClassName?: string;
  activeImageOpacity?: number; // Opacity for the visible image (0 to 1)
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({
  images,
  interval = 5000, // Default to 5 seconds
  className,
  imageClassName,
  activeImageOpacity = 0.3, // Default to 0.3 for the hero section style
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearTimeout(timer);
  }, [currentIndex, images, interval]);

  if (!images || images.length === 0) {
    return null; 
  }

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {images.map((src, index) => (
        <Image
          key={typeof src === 'string' ? src : src.src} 
          src={src}
          alt={`Slideshow image ${index + 1}`}
          layout="fill"
          objectFit="cover"
          priority={index === 0} 
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            imageClassName,
            index === currentIndex ? `opacity-${Math.round(activeImageOpacity * 100)}` : "opacity-0"
          )}
          style={index === currentIndex ? { opacity: activeImageOpacity } : { opacity: 0 }}
          data-ai-hint="Tanzania landscape slideshow"
        />
      ))}
    </div>
  );
};

export default ImageSlideshow;
