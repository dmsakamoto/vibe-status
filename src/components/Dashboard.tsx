"use client";

import { useState, useCallback } from "react";
import { ServiceCard } from "./ServiceCard";
import { Header } from "./Header";
import { usePolling } from "@/hooks/usePolling";
import { sortByWorstStatus } from "@/lib/status-utils";
import type { DashboardData, ServiceStatus } from "@/lib/types";

interface Props {
  initialData: DashboardData;
  serviceKeys?: string[];
  isLoggedIn?: boolean;
}

export function Dashboard({ initialData, serviceKeys, isLoggedIn }: Props) {
  const [services, setServices] = useState<ServiceStatus[]>(
    initialData.services
  );
  const [fetchedAt, setFetchedAt] = useState<string>(initialData.fetchedAt);

  const refresh = useCallback(async () => {
    try {
      const params = serviceKeys ? `?keys=${serviceKeys.join(",")}` : "";
      const res = await fetch(`/api/status${params}`);
      if (!res.ok) return;
      const data: DashboardData = await res.json();
      setServices(sortByWorstStatus(data.services));
      setFetchedAt(data.fetchedAt);
    } catch {
      // Silently ignore — will retry next interval
    }
  }, [serviceKeys]);

  usePolling(refresh, 60_000);

  const indicators = services.map((s) => s.indicator);

  return (
    <div className="ocean-bg min-h-screen">
      <div className="mx-auto max-w-2xl space-y-4 px-5 py-8 sm:py-12">
        <Header lastRefresh={fetchedAt} indicators={indicators} isLoggedIn={isLoggedIn} />
        <div className="space-y-3">
          {services.map((service, i) => (
            <ServiceCard key={service.key} service={service} index={i} />
          ))}
        </div>
        <footer className="pt-6 text-center text-xs text-muted">
          polling every 60s &middot; powered by statuspage api
        </footer>
      </div>
    </div>
  );
}
