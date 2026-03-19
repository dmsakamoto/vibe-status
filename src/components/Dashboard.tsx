"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { SortableServiceCard } from "./SortableServiceCard";
import { ServiceCard } from "./ServiceCard";
import { Header } from "./Header";
import { usePolling } from "@/hooks/usePolling";
import { sortByWorstStatus } from "@/lib/status-utils";
import type { DashboardData, ServiceStatus } from "@/lib/types";

interface Props {
  initialData: DashboardData;
  serviceKeys?: string[];
  user?: { name?: string; image?: string };
  initialSortPreference?: "custom" | "severity";
}

export function Dashboard({
  initialData,
  serviceKeys,
  user,
  initialSortPreference,
}: Props) {
  const [services, setServices] = useState<ServiceStatus[]>(
    initialData.services
  );
  const [fetchedAt, setFetchedAt] = useState<string>(initialData.fetchedAt);
  const [sortPreference, setSortPreference] = useState<
    "custom" | "severity"
  >(initialSortPreference ?? "severity");

  const isLoggedIn = !!user;
  const isCustomSort = sortPreference === "custom";

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const refresh = useCallback(async () => {
    try {
      const params = serviceKeys ? `?keys=${serviceKeys.join(",")}` : "";
      const res = await fetch(`/api/status${params}`);
      if (!res.ok) return;
      const data: DashboardData = await res.json();

      if (sortPreference === "severity" || !isLoggedIn) {
        setServices(sortByWorstStatus(data.services));
      } else {
        // Merge updated statuses into current order
        setServices((prev) => {
          const statusMap = new Map(
            data.services.map((s) => [s.key, s])
          );
          return prev.map((s) => statusMap.get(s.key) ?? s);
        });
      }
      setFetchedAt(data.fetchedAt);
    } catch {
      // Silently ignore — will retry next interval
    }
  }, [serviceKeys, sortPreference, isLoggedIn]);

  usePolling(refresh, 60_000);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setServices((prev) => {
      const oldIndex = prev.findIndex((s) => s.key === active.id);
      const newIndex = prev.findIndex((s) => s.key === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);

      // Persist new order
      const newKeys = reordered.map((s) => s.key);
      fetch("/api/user/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys: newKeys }),
      }).catch(() => {
        // Silent rollback on failure
        setServices(prev);
      });

      return reordered;
    });
  }

  async function toggleSortPreference() {
    const next = sortPreference === "custom" ? "severity" : "custom";
    setSortPreference(next);

    if (next === "severity") {
      setServices((prev) => sortByWorstStatus(prev));
    }

    // Persist preference
    fetch("/api/user/sort-preference", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preference: next }),
    });
  }

  const indicators = services.map((s) => s.indicator);

  return (
    <div className="ocean-bg min-h-screen">
      <div className="mx-auto max-w-2xl space-y-4 px-5 py-8 sm:py-12">
        <Header lastRefresh={fetchedAt} indicators={indicators} user={user} />

        {isLoggedIn && (
          <div className="flex justify-end">
            <button
              onClick={toggleSortPreference}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h12M3 17h6" />
              </svg>
              {isCustomSort ? "My Order" : "Worst First"}
            </button>
          </div>
        )}

        <div className="space-y-3">
          {isLoggedIn && isCustomSort ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={services.map((s) => s.key)}
                strategy={verticalListSortingStrategy}
              >
                {services.map((service, i) => (
                  <SortableServiceCard
                    key={service.key}
                    service={service}
                    index={i}
                  />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            services.map((service, i) => (
              <ServiceCard key={service.key} service={service} index={i} />
            ))
          )}
        </div>

        <footer className="pt-6 text-center text-xs text-muted space-y-1">
          <p>polling every 60s &middot; powered by statuspage api</p>
          <p>
            Built with ❤️. If you have feedback, please{" "}
            <a
              href="https://github.com/dmsakamoto/vibe-status/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-foreground"
            >
              share
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  );
}
