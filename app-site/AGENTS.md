# app-site maintenance contract

## You are here

`app-site/` is the complete source root for `https://app.lielbenor.com`. It is a
small public selected-work showcase. It is deployed by the separate Vercel
project `liel-app`, whose configured Root Directory is `app-site`.

The repository root is a different website: `https://lielbenor.com`, deployed
by the `liel-ben-or` Vercel project.

## Invariants

- Keep the showcase deployable from this directory alone.
- Do not add app-subdomain routing, middleware, redirects, or host checks to the
  root site's `vercel.json`.
- Do not make the root landing page load showcase assets or code.
- Preserve the main landing page's behavior and request latency.
- Never expose private repository URLs, private repository names, source links,
  credentials, internal identifiers, or confidential client details.
- Showcase cards are public, non-clickable previews with product-facing titles
  and outcome-focused descriptions.
- Store showcase-only assets under `app-site/static/`.
- Keep the implementation static and minimal unless the product requirement
  genuinely needs a runtime.

## Deployment and DNS

- GitHub repository: `Lebnor/Liel-BenOr.github.io`
- Production branch: `main`
- Vercel scope: `lebnors-projects`
- Vercel project: `liel-app`
- Vercel Root Directory: `app-site`
- Production domain: `app.lielbenor.com`
- DNS provider: GoDaddy
- DNS record: `app` must be a CNAME to the target currently recommended by
  Vercel.

Check domain configuration with:

```bash
vercel domains verify app.lielbenor.com --scope lebnors-projects
```

Deploy this site manually with:

```bash
vercel deploy --prod --cwd app-site --scope lebnors-projects
```

## Required verification

After a change:

1. Confirm `https://app.lielbenor.com` returns HTTPS 200.
2. Review the changed page in Playwright at desktop and phone widths.
3. Confirm `https://lielbenor.com` still renders normally.
4. If the change touched shared/root files, compare the main page before and
   after and report any difference.

