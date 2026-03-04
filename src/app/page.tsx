import { Dashboard } from "@/components/Dashboard";
import { DEFAULT_SERVICE_KEYS, getServicesByKeys } from "@/config/services";
import { fetchAllServices } from "@/lib/fetcher";
import { sortByWorstStatus } from "@/lib/status-utils";
import { auth } from "@/lib/auth";
import { getUserServiceKeys } from "@/lib/user-services";
import type { DashboardData } from "@/lib/types";

export default async function Home() {
  const session = await auth();

  let serviceKeys = DEFAULT_SERVICE_KEYS;
  if (session?.user?.id) {
    serviceKeys = await getUserServiceKeys(session.user.id);
  }

  const configs = getServicesByKeys(serviceKeys);
  const results = await fetchAllServices(configs);
  const sorted = sortByWorstStatus(results);

  const data: DashboardData = {
    services: sorted,
    fetchedAt: new Date().toISOString(),
  };

  return <Dashboard initialData={data} serviceKeys={serviceKeys} isLoggedIn={!!session?.user} />;
}
