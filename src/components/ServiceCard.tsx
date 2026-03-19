"use client";

import { useState, useEffect } from "react";
import { StatusIndicator } from "./StatusIndicator";
import { ComponentList } from "./ComponentList";
import {
  getStatusLabel,
  getStatusBorderColor,
  getStatusTextColor,
  getStatusGlow,
} from "@/lib/status-utils";
import type { ServiceStatus } from "@/lib/types";

interface Props {
  service: ServiceStatus;
  index: number;
  dragHandleProps?: Record<string, unknown>;
  isDragging?: boolean;
}

export function ServiceCard({ service, index, dragHandleProps, isDragging }: Props) {
  const [expanded, setExpanded] = useState(false);
  const borderColor = getStatusBorderColor(service.indicator);
  const textColor = getStatusTextColor(service.indicator);
  const glow = getStatusGlow(service.indicator);
  const hasIssue =
    service.indicator !== "none" && service.indicator !== "unknown";

  // Collapse when dragging starts
  useEffect(() => {
    if (isDragging) setExpanded(false);
  }, [isDragging]);

  return (
    <div
      className={`card-animate rounded-2xl border border-border border-l-4 ${borderColor} bg-surface transition-all duration-200 hover:bg-surface-hover ${
        hasIssue ? glow : ""
      } ${isDragging ? "opacity-50" : ""}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex w-full items-center">
        {dragHandleProps && (
          <button
            className="flex items-center pl-4 text-muted/50 hover:text-muted cursor-grab active:cursor-grabbing"
            {...dragHandleProps}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="6" r="1.5" />
              <circle cx="15" cy="6" r="1.5" />
              <circle cx="9" cy="12" r="1.5" />
              <circle cx="15" cy="12" r="1.5" />
              <circle cx="9" cy="18" r="1.5" />
              <circle cx="15" cy="18" r="1.5" />
            </svg>
          </button>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex flex-1 items-center justify-between px-5 py-4 text-left"
          aria-expanded={expanded}
        >
          <div className="flex items-center gap-4">
            <StatusIndicator status={service.indicator} />
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {service.name}
              </h3>
              <p className={`mt-0.5 text-xs ${textColor}`}>
                {service.error
                  ? "Unable to fetch status"
                  : getStatusLabel(service.indicator)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted sm:inline">
              {service.components.length} components
            </span>
            <svg
              className={`h-4 w-4 text-muted transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>
      </div>

      {expanded && (
        <div className="expand-animate border-t border-border px-5 pb-4 pt-3">
          <ComponentList components={service.components} />
          <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3 text-[11px] text-muted">
            <a
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              View status page &rarr;
            </a>
            <span>
              Updated {new Date(service.updatedAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
