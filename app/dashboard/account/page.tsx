"use client";

import { Suspense } from "react";
import AccountContent from "./account-content";

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <AccountContent />
    </Suspense>
  );
}