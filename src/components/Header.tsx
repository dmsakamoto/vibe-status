"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";
import {
  getAggregateStatus,
  getStatusTextColor,
} from "@/lib/status-utils";
import type { StatusIndicatorValue } from "@/lib/types";

interface Props {
  lastRefresh: string | null;
  indicators: StatusIndicatorValue[];
  user?: { name?: string; image?: string };
}

export function Header({ lastRefresh, indicators, user }: Props) {
  const aggregate = getAggregateStatus(indicators);
  const textColor = getStatusTextColor(aggregate.indicator);
  const allGood = aggregate.indicator === "none";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

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
            <div className="hidden items-center gap-2 sm:flex">
              <span className="live-pulse inline-block h-1.5 w-1.5 rounded-full bg-accent-green" />
              <span className="font-mono text-[10px] text-muted">
                {new Date(lastRefresh).toLocaleTimeString()}
              </span>
            </div>
          )}
          <ThemeToggle />
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="rounded-full border-2 border-border transition-all hover:border-accent-orange hover:scale-110"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "Avatar"}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-orange text-sm font-bold text-white">
                    {user.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
                  {user.name && (
                    <div className="border-b border-border px-4 py-2.5">
                      <p className="truncate text-sm font-medium text-foreground">
                        {user.name}
                      </p>
                    </div>
                  )}
                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-accent-red"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="pixel-btn flex items-center self-stretch rounded-lg px-4 text-sm tracking-wider"
            >
              Customize
            </Link>
          )}
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
            <span className={`text-base font-bold sm:text-lg ${textColor}`}>
              {aggregate.label}
            </span>
            <span className="ml-2 font-mono text-[10px] text-muted sm:ml-3 sm:text-xs">
              {indicators.filter((i) => i === "none").length}/
              {indicators.length} healthy
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
