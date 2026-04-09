"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SERVICE_CATALOG } from "@/config/services";

interface Props {
  initialKeys: string[];
}

const MAX_SERVICES = 9;

const categories = Array.from(
  new Set(SERVICE_CATALOG.map((s) => s.category))
);

export function ServicePicker({ initialKeys }: Props) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initialKeys)
  );
  const [saving, startSaving] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  function toggle(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else if (next.size < MAX_SERVICES) {
        next.add(key);
      }
      return next;
    });
  }

  function handleSave() {
    if (selected.size === 0) return;
    setError(null);
    setSaved(false);

    startSaving(async () => {
      const res = await fetch("/api/user/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys: Array.from(selected) }),
      });

      if (!res.ok) {
        setError("Failed to save. Please try again.");
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          {selected.size}/{MAX_SERVICES} services selected
        </p>
        <button
          onClick={handleSave}
          disabled={saving || selected.size === 0}
          className="rounded-xl bg-accent-green px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-accent-red">{error}</p>
      )}

      {saved && (
        <p className="text-sm text-accent-green">Saved! Your dashboard has been updated.</p>
      )}

      {categories.map((category) => (
        <div key={category} className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
            {category}
          </h3>
          <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 sm:grid-cols-3">
            {SERVICE_CATALOG.filter((s) => s.category === category).map(
              (service) => {
                const isSelected = selected.has(service.key);
                const isDisabled =
                  !isSelected && selected.size >= MAX_SERVICES;

                return (
                  <button
                    key={service.key}
                    onClick={() => toggle(service.key)}
                    disabled={isDisabled}
                    className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all ${
                      isSelected
                        ? "border-accent-green bg-accent-green/10 text-foreground"
                        : isDisabled
                          ? "cursor-not-allowed border-border bg-surface text-muted opacity-50"
                          : "border-border bg-surface text-foreground hover:border-accent-green/50 hover:bg-surface-hover"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      {service.name}
                      {isSelected && (
                        <span className="text-accent-green">&#10003;</span>
                      )}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
