
"use client";

import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface ImageSlideshowProps {
  images: (string | StaticImageData)[];
  captions?: string[];
  interval?: number;
  className?: string;
  imageClassName?: string;
  captionClassName?: string;
  activeImageOpacity?: number; 
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({
  images,
  captions,
  interval = 5000, 
  className,
  imageClassName,
  captionClassName,
  activeImageOpacity = 0.3, 
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

  const currentCaption = captions && captions.length > currentIndex ? captions[currentIndex] : null;

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
      {currentCaption && (
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-1000 ease-in-out",
            captionClassName,
            // This logic tries to show caption only when image is active
            // However, for smoother transitions, we might want caption to fade with image or independently
          )}
          style={{ opacity: 1 }} // Caption is always part of the active slide conceptually
        >
          <p className="text-center text-xl md:text-3xl font-semibold text-primary-foreground"
             style={{ textShadow: '0 0 5px rgba(0,0,0,0.5), 0 0 10px rgba(0,0,0,0.3)' }}>
            {currentCaption}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageSlideshow;
