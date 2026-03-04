"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import {
  getAggregateStatus,
  getStatusTextColor,
} from "@/lib/status-utils";
import type { StatusIndicatorValue } from "@/lib/types";

interface Props {
  lastRefresh: string | null;
  indicators: StatusIndicatorValue[];
  isLoggedIn?: boolean;
}

export function Header({ lastRefresh, indicators, isLoggedIn }: Props) {
  const aggregate = getAggregateStatus(indicators);
  const textColor = getStatusTextColor(aggregate.indicator);
  const allGood = aggregate.indicator === "none";

  return (
    <header className="space-y-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="float text-4xl" role="img" aria-label="island">
            🏝️
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              vibe status
            </h1>
            <p className="text-sm text-muted">
              dev essentials &mdash; live monitoring
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <div className="flex items-center gap-2">
              <span className="live-pulse inline-block h-1.5 w-1.5 rounded-full bg-accent-green" />
              <span className="font-mono text-[10px] text-muted">
                {new Date(lastRefresh).toLocaleTimeString()}
              </span>
            </div>
          )}
          <ThemeToggle />
          <Link
            href={isLoggedIn ? "/settings" : "/login"}
            className="pixel-btn flex items-center self-stretch rounded-lg px-4 text-sm tracking-wider"
          >
            Customize
          </Link>
        </div>
      </div>

      {/* Aggregate status banner */}
      <div
        className={`relative rounded-2xl border border-border bg-surface px-5 py-4 ${
          allGood ? "status-glow-green" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{aggregate.emoji}</span>
          <div className="flex-1">
            <span className={`text-lg font-bold ${textColor}`}>
              {aggregate.label}
            </span>
            <span className="ml-3 font-mono text-xs text-muted">
              {indicators.filter((i) => i === "none").length}/
              {indicators.length} services healthy
            </span>
          </div>
        </div>
        {allGood && (
          <div className="wave-container mt-2 h-4">
            <span className="wave-text text-sm text-accent-green/60">
              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
