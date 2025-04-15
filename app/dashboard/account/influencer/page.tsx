"use client";

import { Suspense } from "react";
import InfluencerContent from "./influencer-content";

export default function InfluencerProfilePage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <InfluencerContent />
    </Suspense>
  );
} 