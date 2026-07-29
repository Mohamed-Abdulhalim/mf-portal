"use client";

import { useMemo, useState } from "react";
import { Enquiry, EnquiryStatus } from "@/lib/supabase";
import StatusBadge from "./StatusBadge";

const STATUS_OPTIONS: EnquiryStatus[] = [
  "new",
  "in_progress",
  "awaiting_client",
  "placed",
  "closed_lost",
];

export default function EnquiriesTable({
  initialEnquiries,
}: {
  initialEnquiries: Enquiry[];
}) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [consultantFilter, setConsultantFilter] = useState<string>("all");
  const [reviewOnly, setReviewOnly] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  // Derived from the data rather than hardcoded, so a new consultant showing
  // up in the routing table (see workflow.json DESK_ROUTING) just appears
  // here automatically without a code change to this file.
  const consultants = useMemo(() => {
    const set = new Set(
      enquiries.map((e) => e.assigned_consultant).filter(Boolean) as string[]
    );
    return Array.from(set).sort();
  }, [enquiries]);

  const filtered = enquiries.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (consultantFilter !== "all" && e.assigned_consultant !== consultantFilter)
      return false;
    if (reviewOnly && !e.needs_human_review) return false;
    return true;
  });

  async function handleStatusChange(id: string, newStatus: EnquiryStatus) {
    setPendingId(id);
    // Optimistic update: the consultant sees the change immediately rather
    // than waiting on the round trip. If the PATCH fails we roll it back
    // and surface an alert — simple, but honest about the failure mode
    // instead of silently leaving the UI in a wrong state.
    const previous = enquiries;
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );

    const res = await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      setEnquiries(previous);
      alert("Couldn't update status — please try again.");
    }
    setPendingId(null);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>

        <select
          value={consultantFilter}
          onChange={(e) => setConsultantFilter(e.target.value)}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="all">All consultants</option>
          {consultants.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={reviewOnly}
            onChange={(e) => setReviewOnly(e.target.checked)}
          />
          Needs review only
        </label>

        <span className="text-sm text-gray-500 ml-auto">
          {filtered.length} of {enquiries.length} enquiries
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Received</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Company / Contact</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Role</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Consultant</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Review?</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filtered.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                  {new Date(e.received_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">
                    {e.company || e.contact_name || "—"}
                  </div>
                  <div className="text-gray-500 text-xs max-w-xs truncate">
                    {e.summary}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>{e.role_title || "—"}</div>
                  <div className="text-gray-500 text-xs">{e.location}</div>
                </td>
                <td className="px-4 py-3">{e.assigned_consultant || "—"}</td>
                <td className="px-4 py-3">
                  {e.needs_human_review ? (
                    <span
                      className="text-amber-600 text-xs font-medium"
                      title={e.review_reasons || ""}
                    >
                      ⚠ Review
                    </span>
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={e.status} />
                    <select
                      value={e.status}
                      disabled={pendingId === e.id}
                      onChange={(ev) =>
                        handleStatusChange(e.id, ev.target.value as EnquiryStatus)
                      }
                      className="rounded border border-gray-300 px-2 py-1 text-xs disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No enquiries match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
