import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { setUserSortPreference } from "@/lib/user-services";

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { preference } = body;

  if (preference !== "custom" && preference !== "severity") {
    return NextResponse.json(
      { error: "Invalid preference. Must be 'custom' or 'severity'." },
      { status: 400 }
    );
  }

  await setUserSortPreference(session.user.id, preference);
  return NextResponse.json({ preference });
}
