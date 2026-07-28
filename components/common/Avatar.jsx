"use client";

import { useEffect, useState } from 'react';

export default function Avatar({ src, alt = "User avatar", size = "md", className = "", username }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-16 h-16 text-2xl",
    xl: "w-24 h-24 text-3xl",
  };

  const dimensions = {
    sm: 32,
    md: 40,
    lg: 64,
    xl: 96,
  };

  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
  ];

  const getColorIndex = (username) => {
    if (!username) return 0;
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % colors.length;
  };

  const bgColor = colors[getColorIndex(username)];
  const containerStyle = `relative overflow-hidden rounded-full flex items-center justify-center border border-outline shrink-0 ${sizes[size]} ${className}`;

  if (!src || imageFailed) {
    const initial = username ? username.charAt(0).toUpperCase() : '?';
    return (
      <div className={`${containerStyle} ${bgColor}`}>
        <span className="font-bold text-white">{initial}</span>
      </div>
    );
  }

  return (
    <div className={containerStyle}>
      <img
        src={src}
        alt={alt}
        width={dimensions[size]}
        height={dimensions[size]}
        className="object-cover w-full h-full"
        onError={() => setImageFailed(true)}
      />
    </div>
  );
}
