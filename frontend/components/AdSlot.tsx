interface AdSlotProps {
  visible: boolean;
  slot?: string;
}

export default function AdSlot({ visible, slot = "auto" }: AdSlotProps) {
  if (!visible) return null;

  return (
    <div
      className="w-full my-4 min-h-[90px] flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded"
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle block w-full"
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
