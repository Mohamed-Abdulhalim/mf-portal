-- Seed rows: the three real outputs from the Question 1 workflow, plus a
-- couple of extra mock rows so the filters (status x consultant) have
-- something to actually filter across in the demo.

insert into enquiries (
  enquiry_id, received_at, source, raw_text, contact_name, company,
  enquiry_type, role_title, location, salary_or_budget, employment_type,
  headcount, urgency, sector, confidence, assigned_desk, assigned_consultant,
  routing_inbox, needs_human_review, review_reasons, summary, status
) values
(
  'MF-1785349804413-240', '2026-07-29T18:30:04.413Z', 'email_forward',
  'Spoke to Priya at the London office - we need 2 warehouse team leads in Leeds asap, budget ~32k, immediate start.',
  null, null, 'job_order', 'warehouse team lead', 'Leeds', '32k', 'unspecified',
  2, 'immediate', 'industrial_warehouse', 0.90, 'Industrial & Warehouse Desk', 'Dave Mensah',
  'dave@marlowfinch.co.uk', true, 'no company identified',
  'The company needs 2 warehouse team leads in Leeds with a budget of 32k as soon as possible.',
  'new'
),
(
  'MF-1785349920809-671', '2026-07-29T18:32:00.809Z', 'linkedin_dm',
  'hey are you the finance recruitment guys? after a management accountant, hybrid Bristol, perm.',
  null, null, 'job_order', 'Management Accountant', 'Bristol', null, 'permanent',
  1, null, 'finance_accounting', 0.90, 'Finance & Accounting Desk', 'Priya Shah',
  'priya@marlowfinch.co.uk', true, 'no company identified',
  'The client is looking for a management accountant on a permanent basis in Bristol.',
  'in_progress'
),
(
  'MF-1785349935705-360', '2026-07-29T18:32:15.705Z', 'web_form',
  'resend the terms doc',
  'Tom R', null, 'admin_request', null, null, null, 'unspecified',
  null, null, 'unknown', 0.80, 'General Triage', 'Office Team',
  'admin@marlowfinch.co.uk', true, 'admin request but no linked company/client on file',
  'The sender is requesting to resend the terms document.',
  'new'
),
(
  'MF-1785350100000-812', '2026-07-29T19:05:00.000Z', 'web_form',
  'Looking for 3 pickers/packers for our Luton warehouse, contract role, need them within 2 weeks.',
  'Sarah K', 'Luton Distro Ltd', 'job_order', 'picker/packer', 'Luton', null, 'contract',
  3, 'within 2 weeks', 'industrial_warehouse', 0.85, 'Industrial & Warehouse Desk', 'Dave Mensah',
  'dave@marlowfinch.co.uk', false, '',
  'Client needs 3 contract pickers/packers in Luton within two weeks.',
  'placed'
),
(
  'MF-1785350200000-455', '2026-07-29T19:20:00.000Z', 'linkedin_dm',
  'I am a qualified accountant looking for new opportunities, based in Manchester.',
  'James O', null, 'candidate_enquiry', 'Accountant', 'Manchester', null, 'unspecified',
  null, null, 'finance_accounting', 0.75, 'Finance & Accounting Desk', 'Priya Shah',
  'priya@marlowfinch.co.uk', false, '',
  'A candidate accountant based in Manchester is seeking new roles.',
  'closed_lost'
);
