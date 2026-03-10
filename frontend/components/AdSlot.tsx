"use client";

import { useEffect } from "react";

interface AdSlotProps {
  visible: boolean;
  slot?: string;
}

export default function AdSlot({ visible, slot = "auto" }: AdSlotProps) {
  useEffect(() => {
    if (!visible) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {}
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="w-full my-2" aria-label="Advertisement">
      <ins
        className="adsbygoogle block w-full"
        data-ad-client="ca-pub-9488224992325074"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
