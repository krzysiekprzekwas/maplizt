"use client";

import { Suspense } from "react";
import PaymentsContent from "./payments-content";

export default function PaymentsPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <PaymentsContent />
    </Suspense>
  );
} 