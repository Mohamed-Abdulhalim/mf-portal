import { EnquiryStatus } from "@/lib/supabase";

const STYLES: Record<EnquiryStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  in_progress: "bg-amber-100 text-amber-800",
  awaiting_client: "bg-purple-100 text-purple-800",
  placed: "bg-green-100 text-green-800",
  closed_lost: "bg-gray-200 text-gray-600",
};

const LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  in_progress: "In Progress",
  awaiting_client: "Awaiting Client",
  placed: "Placed",
  closed_lost: "Closed / Lost",
};

export default function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
