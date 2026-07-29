import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side client, separate instance from lib/supabase.ts's browser client.
// Using the anon key here too (not the service role key) on purpose: this
// route should be no more privileged than the browser already is, since
// there's no auth yet to distinguish "the app" from "a consultant".
// Swapping to server-only writes with the service role key is a natural
// follow-up once row-level auth exists.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const VALID_STATUSES = [
  "new",
  "in_progress",
  "awaiting_client",
  "placed",
  "closed_lost",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("enquiries")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
