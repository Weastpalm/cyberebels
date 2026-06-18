import { Link } from "react-router-dom";
export default function BackToConsole({ to = "/osint", label = "the OSINT console" }) {
  return (
    <Link to={to} className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-faint transition-colors hover:text-brand">
      ← back to {label}
    </Link>
  );
}
