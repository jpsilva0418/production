# jpsilva0418/production — standing instructions

## Delivering client demos: always a link, never a file

JP reviews demos on his phone. HTML files sent as attachments do not open there,
and `*.vercel.app` preview URLs sit behind Vercel login. So every client demo is:

1. published into the demo library — `jp-web-design/public/demo/<slug>/`, rules in
   `jp-web-design/DEMOS.md` (one slug per client, noindex, append-only `_shared`);
2. live at **`https://jpsilvadigital.com/demo/<slug>`**, which deploys from the
   `claude/jp-silva-digital-launch` branch (Vercel project `jp-silva-digital`);
3. handed over as that full URL on its own line in the chat reply.

Pushing to `claude/jp-silva-digital-launch` puts the change on jpsilvadigital.com,
so get JP's OK for that push. Never send the demo only as files.

## Preview links that always open

Before a demo goes live on jpsilvadigital.com, it gets its own Vercel project named
`<client>-demo-preview` (deploy from the branch, root `jp-web-design`), with **Vercel
Authentication turned off** (`ssoProtection: null`). Its link —
`https://<client>-demo-preview.vercel.app/demo/<slug>` — then opens on any phone,
permanently, with no login and no expiring share token. Never hand JP a
`_vercel_share` link or a protected preview URL.
