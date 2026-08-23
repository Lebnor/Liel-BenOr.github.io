# Liel Ben-Or websites

This repository contains two independently hosted static websites. They share a
Git repository, but they do not share a Vercel project or request-routing path.

| Public URL | Source directory | Vercel project | Purpose |
| --- | --- | --- | --- |
| `https://lielbenor.com` | repository root | `liel-ben-or` | Main personal landing page |
| `https://app.lielbenor.com` | `app-site/` | `liel-app` | Selected-work showcase |

## Architecture

```text
Lebnor/Liel-BenOr.github.io (main branch)
├── index.html, static/, vercel.json ──> Vercel: liel-ben-or ──> lielbenor.com
└── app-site/
    ├── index.html
    ├── static/
    └── vercel.json             ──> Vercel: liel-app ──> app.lielbenor.com
```

The `liel-app` Vercel project is connected to this repository with its Root
Directory set to `app-site`. The main `liel-ben-or` project uses the repository
root. A change under `app-site/` must not require host-based routing or runtime
logic in the main site's `vercel.json`.

## DNS

DNS is managed through GoDaddy (`ns13.domaincontrol.com` and
`ns14.domaincontrol.com`). `app.lielbenor.com` reaches Vercel through a CNAME
record named `app`. Vercel owns HTTPS certificate provisioning after the domain
is attached to the `liel-app` project.

Do not replace the CNAME with a TXT record. When Vercel requests a new target,
retrieve the current recommended value instead of relying on a copied value:

```bash
vercel domains verify app.lielbenor.com --scope lebnors-projects
```

## Deployment

Both Vercel projects track the `main` branch of
`https://github.com/Lebnor/Liel-BenOr.github.io`.

- Root-site changes deploy through the `liel-ben-or` project.
- Showcase changes deploy through the `liel-app` project, rooted at `app-site/`.
- Local `.vercel/` metadata and `.env.local` files are intentionally ignored.
  They are not architectural documentation.

For a manual showcase deployment:

```bash
vercel deploy --prod --cwd app-site --scope lebnors-projects
```

## Verification

After a production change, verify the websites separately:

```bash
curl -I https://lielbenor.com
curl -I https://app.lielbenor.com
```

Then open the affected URL in Playwright and confirm its desktop and phone
layouts. When changing only `app-site/`, also confirm that the main landing page
still renders unchanged. The main-site experience must not gain routing,
runtime, or latency dependencies on the showcase.

