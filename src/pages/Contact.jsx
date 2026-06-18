import { useState } from "react";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";

// CHANGE THIS to the inbox you want messages to land in:
const CONTACT_EMAIL = "hello@cyberebels.com";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function send() {
    const body =
      `From: ${name || "(no name)"} <${email || "no email"}>\n\n` + message;
    const url =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(subject || "Message from CybeRebels")}` +
      `&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  }

  const field =
    "w-full rounded-md border border-line bg-elevated px-4 py-3 text-sm text-ink outline-none focus:border-brand";

  return (
    <div>
      <Seo
        path="/contact"
        title="Contact CybeRebels"
        description="Questions, corrections, tool suggestions, or partnership ideas? Get in touch with the CybeRebels team."
      />
      <PageHeader
        eyebrow="// contact"
        title="Say"
        accent="hello."
        intro="Questions, corrections, a tool you want reviewed, or a partnership idea — we read everything."
      />

      <div className="mx-auto grid max-w-5xl gap-8 px-4 pb-16 lg:grid-cols-[1.2fr_1fr]">
        <div className="panel p-7">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-mono text-xs text-muted">Name</label>
                <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs text-muted">Email</label>
                <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
              </div>
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-muted">Subject</label>
              <input className={field} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What's this about?" />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-muted">Message</label>
              <textarea className={field + " min-h-[140px] resize-y"} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message…" />
            </div>
            <button onClick={send} className="btn-primary w-full sm:w-auto">
              Open in my email app →
            </button>
            <p className="font-mono text-[11px] text-faint">
              This opens a pre-filled email in your own mail app — nothing is sent
              through us, and we never see what you type until you hit send.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="panel p-6">
            <h2 className="font-mono text-[1rem] font-bold">Email us directly</h2>
            <p className="mt-2 text-sm text-muted">
              Prefer your own client? Reach us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="link-accent">{CONTACT_EMAIL}</a>.
            </p>
          </div>
          <div className="panel p-6">
            <h2 className="font-mono text-[1rem] font-bold">Response time</h2>
            <p className="mt-2 text-sm text-muted">
              We're a small operation, so give us a few days. Corrections and
              security issues jump the queue.
            </p>
          </div>
          <div className="panel p-6">
            <h2 className="font-mono text-[1rem] font-bold">A note on privacy</h2>
            <p className="mt-2 text-sm text-muted">
              Only email us what you're comfortable sharing. For anything sensitive,
              consider an encrypted address (Proton Mail, Tuta) on your end.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
