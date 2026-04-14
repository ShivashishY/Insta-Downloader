"use client";

import { useEffect, useState } from "react";

interface AdSlotProps {
  slotId: string;
  className?: string;
}

export default function AdSlot({ slotId, className = "" }: AdSlotProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`ad-slot ${className}`}>
      <p className="font-medium">Advertisement</p>
      <p>AdSense Slot: {slotId}</p>
    </div>
  );
}
