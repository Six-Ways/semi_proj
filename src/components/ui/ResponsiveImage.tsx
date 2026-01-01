"use client";

import React from "react";
import Image, { ImageProps as NextImageProps } from "next/image";

interface ResponsiveImageProps extends Omit<NextImageProps, "src" | "fill"> {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: number;
  priority?: boolean;
  lazy?: boolean;
}

export function ResponsiveImage({
  src,
  alt,
  className = "",
  aspectRatio = 16 / 9,
  priority = false,
  lazy = true,
  ...props
}: ResponsiveImageProps) {
  // 确保src是字符串
  const imageSrc = typeof src === "string" ? src : "/placeholder.jpg";
  
  // 生成不同格式的图片源（如果支持的话）
  const generateSrcSet = () => {
    // 这里可以根据需要生成不同格式的图片源
    // 例如：webp、avif等
    return imageSrc;
  };

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div
        style={{
          aspectRatio,
          width: "100%",
        }}
      >
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority={priority}
          loading={lazy ? "lazy" : "eager"}
          className="object-cover transition-transform duration-500 hover:scale-105"
          quality={85}
          {...props}
        />
      </div>
    </div>
  );
}

// 基于滚动触发的响应式图片组件
export function ScrollResponsiveImage({
  src,
  alt,
  className = "",
  aspectRatio = 16 / 9,
  priority = false,
  lazy = true,
  ...props
}: ResponsiveImageProps) {
  return (
    <div className={`scroll-image-container ${className}`}>
      <ResponsiveImage
        src={src}
        alt={alt}
        className={className}
        aspectRatio={aspectRatio}
        priority={priority}
        lazy={lazy}
        {...props}
      />
    </div>
  );
}