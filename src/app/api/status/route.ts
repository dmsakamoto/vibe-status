import { NextRequest, NextResponse } from "next/server";
import {
  SERVICE_CATALOG,
  DEFAULT_SERVICE_KEYS,
  getServicesByKeys,
  isValidServiceKey,
} from "@/config/services";
import { fetchAllServices } from "@/lib/fetcher";
import { sortByWorstStatus } from "@/lib/status-utils";
import type { DashboardData } from "@/lib/types";

export const revalidate = 60;

export async function GET(req: NextRequest) {
  const keysParam = req.nextUrl.searchParams.get("keys");

  let configs;
  if (keysParam) {
    const keys = keysParam.split(",").filter(isValidServiceKey);
    configs = keys.length > 0 ? getServicesByKeys(keys) : getServicesByKeys(DEFAULT_SERVICE_KEYS);
  } else {
    configs = getServicesByKeys(DEFAULT_SERVICE_KEYS);
  }

  const results = await fetchAllServices(configs);
  const sorted = sortByWorstStatus(results);

  const data: DashboardData = {
    services: sorted,
    fetchedAt: new Date().toISOString(),
  };

  return NextResponse.json(data);
}
