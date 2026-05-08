# ITFlow — Onboarding Video Script
# Runtime: ~3 minutes | Record in Loom or QuickTime
# Upload URL → Vercel env: NEXT_PUBLIC_ONBOARDING_VIDEO_URL

---

## INTRO  [0:00 – 0:20]

"Welcome to ITFlow — the platform your IT team uses to track, request,
and transfer equipment across all your locations.

Before you start, you're in the Demo environment — it's pre-loaded with
sample data so you can explore everything safely. When you're ready for
real operations, just switch to Production using the org badge in the top bar."

---

## DASHBOARD  [0:20 – 0:50]

"The Dashboard is your command center.

At the top you'll see four key metrics — total assets, what's available
right now, pending requests that need your attention, and items in transit.

Below that is the multi-site inventory bar — this shows stock health
across every location at a glance. Green is healthy, amber is getting low,
red needs attention.

The approval queue on the right shows requests waiting for your sign-off.
You can approve or reject right here with one click.

At the bottom, active shipments show you exactly where packages are in
transit, and the activity feed gives you a real-time audit trail of
everything happening across the platform."

---

## INVENTORY  [0:50 – 1:20]

"The Inventory page shows every asset and stock item across all your sites.

Use the filters to narrow down by site, category, or status.
The toggle on the right switches between serialized assets — tracked
individually by serial number — and quantity stock like chargers and cables.

Click any row to open the detail drawer. Here you'll see the full asset
history, movement log, and active requests. The Request Transfer button
starts a new transfer request directly from this asset."

---

## REQUESTS  [1:20 – 1:50]

"Requests is where all transfer activity lives.

The tab bar at the top filters by status — Pending, Approved, In Progress,
and so on. Pending items are highlighted because they need your action.

To create a new request, hit the New Request button. You'll pick the item,
choose a source and destination site, set the priority, and optionally
link a Jira ticket. When you submit, a Jira issue is created automatically
and the source site manager gets a Slack notification.

Site managers can approve or reject directly from this page, or even
from the Slack message if that integration is configured."

---

## SHIPMENTS  [1:50 – 2:20]

"Once a request is approved, it becomes a shipment.

The Shipments page shows every active shipment as a card with a
five-step progress tracker — Preparing, Shipped, In Transit,
Delivered, and Received.

When you're ready to ship, click the card, add the carrier and
tracking number, and mark it shipped. Inventory is automatically
placed in transit.

When the destination receives it, they confirm receipt here —
and inventory updates automatically at the new location.
If there's a problem, you can flag an exception which notifies
the team immediately via Slack."

---

## ADMIN  [2:20 – 2:50]

"The Admin section is for team leads and IT managers.

Under Users, you can manage roles — Technician, Site Manager,
Regional Manager, or Admin — and control which environments
each person has access to.

Locations shows all your sites with asset counts and user counts.
You can add new sites or deactivate ones that are no longer active.

The Catalog tab is your item master — every type of asset or
accessory in the system. And Integrations is where you connect
Jira and Slack once you're ready to go live."

---

## OUTRO  [2:50 – 3:00]

"That's ITFlow. Start exploring in the Demo environment —
everything you do here is safe and won't affect real operations.

When your team is ready, switch to Production and start
tracking your real inventory. Let's go."

---

# RECORDING TIPS
# - Screen record at 1920×1080 or higher
# - Use system audio or a lapel mic — no background noise
# - Keep cursor movements slow and deliberate
# - Pause 1 second before switching sections
# - Upload to Loom, YouTube (unlisted), or Supabase Storage
# - Paste the URL into Vercel env → NEXT_PUBLIC_ONBOARDING_VIDEO_URL
# - Redeploy Vercel after adding the env var
