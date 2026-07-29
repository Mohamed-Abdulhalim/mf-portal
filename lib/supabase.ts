import { createClient } from "@supabase/supabase-js";

// NOTE: using the public anon key on the client is fine here because RLS
// policies on `enquiries` are wide open for v1 (no auth yet — see README).
// If auth gets added, this same client keeps working; only the policies change.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type EnquiryStatus =
  | "new"
  | "in_progress"
  | "awaiting_client"
  | "placed"
  | "closed_lost";

export interface Enquiry {
  id: string;
  enquiry_id: string;
  received_at: string;
  source: string;
  raw_text: string;
  contact_name: string | null;
  company: string | null;
  enquiry_type: string;
  role_title: string | null;
  location: string | null;
  salary_or_budget: string | null;
  employment_type: string;
  headcount: number | null;
  urgency: string | null;
  sector: string;
  confidence: number | null;
  assigned_desk: string | null;
  assigned_consultant: string | null;
  routing_inbox: string | null;
  needs_human_review: boolean;
  review_reasons: string | null;
  summary: string | null;
  status: EnquiryStatus;
  updated_at: string;
}
