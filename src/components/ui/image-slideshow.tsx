
"use client";

import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface ImageSlideshowProps {
  images: (string | StaticImageData)[];
  captions?: { heading: string; subheading: string }[];
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
          fill
          priority={index === 0}
          sizes="100vw"
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out object-cover",
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
            "absolute inset-0 flex flex-col items-center justify-center p-4 transition-opacity duration-1000 ease-in-out text-center",
            captionClassName
          )}
          style={{ opacity: 1 }}
        >
          <h2
            className="font-headline text-3xl md:text-5xl font-bold text-primary-foreground mb-3"
            style={{ textShadow: '0 0 8px rgba(0,0,0,0.6), 0 0 12px rgba(0,0,0,0.4)' }}
          >
            {currentCaption.heading}
          </h2>
          <p
            className="text-lg md:text-xl text-primary-foreground font-light max-w-2xl"
            style={{ textShadow: '0 0 5px rgba(0,0,0,0.5), 0 0 10px rgba(0,0,0,0.3)' }}
          >
            {currentCaption.subheading}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageSlideshow;
