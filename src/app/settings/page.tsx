import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserServiceKeys } from "@/lib/user-services";
import { ServicePicker } from "@/components/ServicePicker";
import { SignOutButton } from "@/components/SignOutButton";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const serviceKeys = await getUserServiceKeys(session.user.id);

  return (
    <div className="ocean-bg min-h-screen">
      <div className="mx-auto max-w-2xl space-y-6 px-5 py-8 sm:py-12">
        {/* Header with back link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            &larr; Back to dashboard
          </Link>
        </div>

        {/* Profile card */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Avatar"}
                  width={48}
                  height={48}
                  className="rounded-full border border-border"
                />
              )}
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {session.user.name || "User"}
                </h2>
                <p className="text-sm text-muted">{session.user.email}</p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>

        {/* Service picker */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-4 text-lg font-bold text-foreground">
            Your Dashboard Services
          </h2>
          <p className="mb-5 text-sm text-muted">
            Choose up to 7 services to monitor on your dashboard.
          </p>
          <ServicePicker initialKeys={serviceKeys} />
        </div>
      </div>
    </div>
  );
}
