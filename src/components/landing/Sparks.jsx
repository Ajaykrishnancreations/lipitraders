import React from "react";

// Decorative spark particles for industrial feel
export const Sparks = ({ count = 18, className = "" }) => {
  const sparks = Array.from({ length: count }).map((_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 1.5;
    const duration = 1 + Math.random() * 1.5;
    const tx = (Math.random() - 0.5) * 80 + "px";
    return (
      <span
        key={i}
        className="spark"
        style={{
          left: `${left}%`,
          top: "0",
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          ["--tx"]: tx,
        }}
      />
    );
  });
  return <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>{sparks}</div>;
};

export const FloatingParticles = ({ count = 14, className = "" }) => {
  const items = Array.from({ length: count }).map((_, i) => {
    const left = Math.random() * 100;
    const size = 2 + Math.random() * 3;
    const delay = Math.random() * 6;
    const duration = 8 + Math.random() * 8;
    const drift = (Math.random() - 0.5) * 60 + "px";
    return (
      <span
        key={i}
        className="absolute rounded-full"
        style={{
          left: `${left}%`,
          bottom: "-20px",
          width: size,
          height: size,
          background: i % 2 === 0 ? "#FF5722" : "#D4A437",
          boxShadow: `0 0 ${size * 3}px ${i % 2 === 0 ? "#FF5722" : "#D4A437"}`,
          animation: `float-up ${duration}s linear ${delay}s infinite`,
          ["--xdrift"]: drift,
        }}
      />
    );
  });
  return <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>{items}</div>;
};

export const SpinningGear = ({ size = 220, reverse = false, className = "", strokeColor = "#FF5722" }) => {
  const teeth = 12;
  const teethEls = Array.from({ length: teeth }).map((_, i) => {
    const angle = (360 / teeth) * i;
    return (
      <rect
        key={i}
        x="48"
        y="2"
        width="4"
        height="10"
        fill={strokeColor}
        transform={`rotate(${angle} 50 50)`}
      />
    );
  });
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={{
        animation: `${reverse ? "gear-spin-reverse" : "gear-spin"} 18s linear infinite`,
        filter: `drop-shadow(0 0 12px ${strokeColor}44)`,
      }}
    >
      <circle cx="50" cy="50" r="38" fill="none" stroke={strokeColor} strokeWidth="2" opacity="0.7" />
      <circle cx="50" cy="50" r="30" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.4" />
      <circle cx="50" cy="50" r="10" fill="none" stroke={strokeColor} strokeWidth="2" />
      {teethEls}
    </svg>
  );
};
