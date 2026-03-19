import type { StatuspageResponse, ServiceStatus } from "./types";
import type { ServiceConfig } from "@/config/services";

export async function fetchServiceStatus(
  service: ServiceConfig
): Promise<ServiceStatus> {
  const url = `${service.statusPageUrl}/api/v2/summary.json`;
  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data: StatuspageResponse = await res.json();

  // Filter to showcase, non-group components
  // If no components have showcase=true (incident.io or all-hidden), show all non-group components
  const hasAnyShowcase = data.components.some((c) => c.showcase === true);
  const components = data.components
    .filter((c) => (!hasAnyShowcase || c.showcase) && !c.group)
    .map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      description: c.description,
    }));

  return {
    key: service.key,
    name: service.name,
    url: service.statusPageUrl,
    indicator: data.status.indicator,
    description: data.status.description,
    components,
    updatedAt: data.page.updated_at,
  };
}

export async function fetchAllServices(
  serviceConfigs: ServiceConfig[]
): Promise<ServiceStatus[]> {
  const results = await Promise.allSettled(
    serviceConfigs.map((s) => fetchServiceStatus(s))
  );

  return results.map((result, i) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    // Return a fallback for failed fetches
    return {
      key: serviceConfigs[i].key,
      name: serviceConfigs[i].name,
      url: serviceConfigs[i].statusPageUrl,
      indicator: "unknown" as const,
      description: "Unable to fetch status",
      components: [],
      updatedAt: new Date().toISOString(),
      error: result.reason?.message || "Fetch failed",
    };
  });
}
