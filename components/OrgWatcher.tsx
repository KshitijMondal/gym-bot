"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";

export default function OrgWatcher() {
  const { orgId, isLoaded } = useAuth();
  
  // We use a ref to remember the previous Organization ID
  const previousOrgId = useRef<string | undefined | null>(undefined);

  useEffect(() => {
    if (!isLoaded) return;

    // If this isn't the first page load AND the organization actually changed...
    if (previousOrgId.current !== undefined && previousOrgId.current !== orgId) {
      // The Sledgehammer: Force a hard browser reload.
      // This instantly wipes all client state and forces a fresh database pull.
      window.location.reload();
    }

    // Update the ref to the current organization
    previousOrgId.current = orgId;
  }, [orgId, isLoaded]);

  return null;
}