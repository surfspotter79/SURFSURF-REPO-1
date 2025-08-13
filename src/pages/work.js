// src/pages/work.js
import { useState } from 'react';
import Head from 'next/head';

export default function Work() {
  const [notes, setNotes] = useState('');

  return (
    <>
      <Head>
        <title>Surfspotter Workbench</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main style={{ minHeight: '100vh', padding: '2rem', background: 'linear-gradient(#eff6ff, #fff)' }}>
        <div style={{
          maxWidth: 880, margin: '0 auto', background: '#fff', padding: 24, borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0,0,0,.06)'
        }}>
          <h1 style={{ fontSize: 28, margin: 0 }}>Surfspotter Workbench</h1>
          <p style={{ marginTop: 8, color: '#475569' }}>
            Private staging area for layout drafts, copy, and components.
          </p>

          <label style={{ display: 'block', fontWeight: 600, marginTop: 20, marginBottom: 8 }}>
            Scratchpad
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ideas, todos, component notes…"
            style={{ width: '100%', height: 180, padding: 12, borderRadius: 12, border: '1px solid #e2e8f0' }}
          />

          <div style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>Next steps</h2>
            <ul style={{ lineHeight: 1.8, margin: 0, paddingLeft: 20 }}>
              <li>Design hero section and spot search</li>
              <li>Map component + swell overlay</li>
              <li>Auth + user settings</li>
            </ul>
          </div>

          <p style={{ color: '#667085', fontSize: 14, marginTop: 16 }}>
            Access directly at <code>/work</code>. Not linked in public nav.
          </p>
        </div>
      </main>
    </>
  );
}
