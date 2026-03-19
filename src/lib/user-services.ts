import { prisma } from "./prisma";
import { DEFAULT_SERVICE_KEYS, isValidServiceKey } from "@/config/services";

export async function getUserServiceKeys(userId: string): Promise<string[]> {
  const rows = await prisma.userService.findMany({
    where: { userId },
    orderBy: { sortOrder: "asc" },
    select: { serviceKey: true },
  });

  if (rows.length === 0) return DEFAULT_SERVICE_KEYS;

  return rows.map((r) => r.serviceKey);
}

export async function setUserServiceKeys(
  userId: string,
  keys: string[]
): Promise<void> {
  const validKeys = keys.filter(isValidServiceKey).slice(0, 7);

  await prisma.$transaction([
    prisma.userService.deleteMany({ where: { userId } }),
    ...validKeys.map((serviceKey, i) =>
      prisma.userService.create({
        data: { userId, serviceKey, sortOrder: i },
      })
    ),
  ]);
}

export async function getUserSortPreference(
  userId: string
): Promise<"custom" | "severity"> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { sortPreference: true },
  });
  return (user?.sortPreference as "custom" | "severity") ?? "severity";
}

export async function setUserSortPreference(
  userId: string,
  preference: "custom" | "severity"
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { sortPreference: preference },
  });
}
