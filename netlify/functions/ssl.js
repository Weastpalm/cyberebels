// SSL/TLS certificate inspector — connects to host:443 and returns the cert details.
import tls from "node:tls";
import { cors, json, blockedOrigin } from "./_guard.js";
export const config = { rateLimit: { windowSize: 60, windowLimit: 20, aggregateBy: ["domain", "ip"] } };

function inspect(host) {
  return new Promise((resolve) => {
    const socket = tls.connect({ host, port: 443, servername: host, timeout: 8000, rejectUnauthorized: false }, () => {
      const c = socket.getPeerCertificate(true) || {};
      const valid = c.valid_to ? new Date(c.valid_to) : null;
      resolve({
        ok: true, host,
        subject: c.subject ? c.subject.CN || JSON.stringify(c.subject) : null,
        issuer: c.issuer ? c.issuer.O || c.issuer.CN || JSON.stringify(c.issuer) : null,
        validFrom: c.valid_from || null,
        validTo: c.valid_to || null,
        daysLeft: valid ? Math.floor((valid.getTime() - Date.now()) / 86400000) : null,
        san: (c.subjectaltname || "").replace(/DNS:/g, "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 30),
        serial: c.serialNumber || null,
        fingerprint: c.fingerprint256 || c.fingerprint || null,
      });
      socket.end();
    });
    socket.on("error", (e) => resolve({ ok: false, error: e.message }));
    socket.on("timeout", () => { socket.destroy(); resolve({ ok: false, error: "Connection timed out." }); });
  });
}

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors(), body: "" };
  if (blockedOrigin(event)) return json(403, { error: "Forbidden origin." });
  let { host } = event.queryStringParameters || {};
  if (!host) return json(400, { error: "Missing 'host'." });
  host = host.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0].split(":")[0];
  try { return json(200, await inspect(host)); }
  catch (e) { return json(200, { ok: false, error: "Inspection failed." }); }
};
