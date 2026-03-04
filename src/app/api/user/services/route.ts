import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserServiceKeys, setUserServiceKeys } from "@/lib/user-services";
import { isValidServiceKey } from "@/config/services";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = await getUserServiceKeys(session.user.id);
  return NextResponse.json({ keys });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const keys: unknown = body.keys;

  if (
    !Array.isArray(keys) ||
    keys.length === 0 ||
    keys.length > 7 ||
    !keys.every((k): k is string => typeof k === "string" && isValidServiceKey(k))
  ) {
    return NextResponse.json(
      { error: "Invalid keys. Provide 1-7 valid service keys." },
      { status: 400 }
    );
  }

  await setUserServiceKeys(session.user.id, keys);
  return NextResponse.json({ keys });
}
