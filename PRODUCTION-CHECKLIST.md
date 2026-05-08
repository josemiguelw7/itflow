# ITFlow — Production Checklist
# Complete these steps when moving from demo to live

---

## 1. Custom domain on Vercel

```bash
# Add your domain (e.g. itflow.yourcompany.com)
vercel domains add itflow.yourcompany.com

# Then in your DNS provider add:
# Type: CNAME
# Name: itflow
# Value: cname.vercel-dns.com
#
# Or if apex domain (yourcompany.com):
# Type: A  →  76.76.21.21
```

In Vercel dashboard:
- Project → Settings → Domains → Add domain
- Vercel will auto-provision SSL

---

## 2. Update Supabase Auth URL

Supabase → Authentication → URL Configuration:
- Site URL:      https://itflow.yourcompany.com
- Redirect URLs: https://itflow.yourcompany.com/auth/callback

---

## 3. Update Vercel env var

```
NEXT_PUBLIC_APP_URL = https://itflow.yourcompany.com
```

---

## 4. Run RLS policies in Supabase

Supabase → SQL Editor → paste contents of `supabase-rls.sql` → Run

This locks all data to org-scoped access. Test with a non-admin
user before rolling out to the full team.

---

## 5. Connect Jira

In ITFlow → Admin → Integrations → Jira:
- Jira base URL:  https://yourorg.atlassian.net
- Email:          itflow-bot@yourorg.com (service account)
- API token:      https://id.atlassian.com/manage-profile/security/api-tokens
- Project key:    IT (or whatever your IT project is)
- Hit "Save & test connection"

Find transition IDs:
GET https://yourorg.atlassian.net/rest/api/3/issue/{anyIssueKey}/transitions
Update JIRA_TRANSITION_INPROGRESS / REJECT / DONE in Vercel env

---

## 6. Connect Slack

Create Slack app: https://api.slack.com/apps
- New App → From scratch → name: ITFlow
- Incoming Webhooks → Activate → Add to channel (#it-inventory)
- Copy webhook URL → Vercel env: SLACK_WEBHOOK_URL

For interactive buttons (approve/reject from Slack):
- Interactivity & Shortcuts → enable
- Request URL: https://itflow.yourcompany.com/api/webhooks/slack
- Copy Signing Secret → Vercel env: SLACK_SIGNING_SECRET

---

## 7. Switch auth to Okta (when ready)

Follow instructions in OKTA-SWAP-GUIDE.ts

Summary:
1. npm install next-auth
2. Create Okta app (Web, OIDC)
3. Copy 3 files from guide into project
4. Add 4 env vars to Vercel
5. Deploy

---

## 8. Seed production data

In Supabase SQL Editor — run your real locations:

```sql
INSERT INTO locations (id, name, code, address, timezone, org_id) VALUES
  (gen_random_uuid()::text, 'Your HQ',  'HQ',  'Your address', 'America/Chicago', 'org_prod'),
  -- add more sites...
;
```

---

## 9. Invite your team

1. Share the URL with your IT team
2. They log in via magic link (or Okta SSO if configured)
3. First login creates their user record with TECHNICIAN role
4. Admin promotes them in Admin → Users → change role

---

## 10. Record onboarding video

Script is in ONBOARDING-VIDEO-SCRIPT.md
Upload to Loom/YouTube unlisted
Add URL to Vercel env: NEXT_PUBLIC_ONBOARDING_VIDEO_URL
Redeploy

---

## Final deployment command

```bash
git add -A
git commit -m "production ready"
git push
# Vercel auto-deploys on push to main
```
