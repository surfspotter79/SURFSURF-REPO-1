// api/work.js
export default function handler(req, res) {
  const auth = req.headers.authorization || '';
  const [scheme, encoded] = auth.split(' ');

  const username = process.env.BASIC_AUTH_USERNAME || 'admin';
  const password = process.env.BASIC_AUTH_PASSWORD || 'changeme';
  const valid = Buffer.from(`${username}:${password}`).toString('base64');

  if (scheme !== 'Basic' || encoded !== valid) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Surfspotter Workbench"');
    return res.status(401).send('Authentication required');
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');

  res.end(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Surfspotter Workbench</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="robots" content="noindex,nofollow" />
  <style>
    body{margin:0;background:linear-gradient(#eff6ff,#fff);font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial}
    main{min-height:100vh;padding:2rem}
    .card{max-width:880px;margin:0 auto;background:#fff;padding:24px;border-radius:16px;
          box-shadow:0 10px 30px rgba(0,0,0,.06)}
    h1{margin:0;font-size:28px}
    p.muted{margin:.5rem 0 1rem;color:#475569}
    textarea{width:100%;height:180px;padding:12px;border-radius:12px;border:1px solid #e2e8f0}
    ul{line-height:1.8;margin:0;padding-left:20px}
    code{background:#f1f5f9;padding:.1rem .35rem;border-radius:.35rem}
  </style>
</head>
<body>
  <main>
    <div class="card">
      <h1>Surfspotter Workbench</h1>
      <p class="muted">Private staging area for layout drafts, copy, and components.</p>

      <label style="display:block;font-weight:600;margin:20px 0 8px;">Scratchpad</label>
      <textarea placeholder="Ideas, todos, component notes…"></textarea>

      <div style="margin-top:16px">
        <h2 style="font-size:20px;margin-bottom:8px;">Next steps</h2>
        <ul>
          <li>Design hero section and spot search</li>
          <li>Map component + swell overlay</li>
          <li>Auth + user settings</li>
        </ul>
      </div>

      <p class="muted" style="font-size:14px;margin-top:16px;">
        Access at <code>/work</code>. Not linked in public nav.
      </p>
    </div>
  </main>
</body>
</html>`);
}
