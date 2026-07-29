import { supabase } from "@/lib/supabase";
import EnquiriesTable from "@/components/EnquiriesTable";

// Server component: fetch happens on the server on each request. For a
// small internal tool like this, that's simpler and safer than shipping a
// client-side fetch-on-mount — no loading flash, no exposed query logic.
// Realtime updates aren't needed here since a consultant refreshing the
// page is a totally normal workflow for a low-volume internal tool.
export default async function Home() {
  const { data: enquiries, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("received_at", { ascending: false });

  if (error) {
    return (
      <main className="max-w-5xl mx-auto p-8">
        <h1 className="text-xl font-semibold text-red-600">
          Couldn&apos;t load enquiries
        </h1>
        <p className="text-gray-600 mt-2">{error.message}</p>
        <p className="text-gray-400 text-sm mt-4">
          Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
          are set, and that the schema in supabase/migrations has been run.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6 sm:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Marlow &amp; Finch — Enquiry Desk
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Incoming enquiries from the intake automation. Filter to your desk,
          check the ones flagged for review, and move things along.
        </p>
      </header>

      <EnquiriesTable initialEnquiries={enquiries ?? []} />
    </main>
  );
}
