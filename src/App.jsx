import { Routes, Route, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "./lib/theme.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Seo from "./components/Seo.jsx";
import MatrixRain from "./components/MatrixRain.jsx";
import Home from "./pages/Home.jsx";
import VpnComparison from "./pages/VpnComparison.jsx";
import PrivacyTools from "./pages/PrivacyTools.jsx";
import DeGoogle from "./pages/DeGoogle.jsx";
import SelfDefense from "./pages/SelfDefense.jsx";
import AmITracked from "./pages/AmITracked.jsx";
import Fingerprint from "./pages/Fingerprint.jsx";
import AntiDetect from "./pages/AntiDetect.jsx";
import Osint from "./pages/Osint.jsx";
import ThreatHub from "./pages/osint/ThreatHub.jsx";
import OsintPeople from "./pages/osint/PeopleHub.jsx";
import PrivacyHub from "./pages/PrivacyHub.jsx";
import OsintExposure from "./pages/osint/Exposure.jsx";
import OsintBreach from "./pages/osint/Breach.jsx";
import OsintFootprint from "./pages/osint/Footprint.jsx";
import OsintBrokers from "./pages/osint/Brokers.jsx";
import OsintUsername from "./pages/osint/Username.jsx";
import OsintEmail from "./pages/osint/EmailHeaders.jsx";
import OsintDecoder from "./pages/osint/DecoderBench.jsx";
import OsintDomain from "./pages/osint/DomainIntel.jsx";
import OsintRedirects from "./pages/osint/Redirects.jsx";
import OsintSSL from "./pages/osint/SSLInspector.jsx";
import OsintQR from "./pages/osint/QRScanner.jsx";
import OsintIntel from "./pages/osint/IntelRadar.jsx";
import PentestHub from "./pages/pentest/Hub.jsx";
import PentestSubdomains from "./pages/osint/Subdomains.jsx";
import PentestNmap from "./pages/pentest/Nmap.jsx";
import PentestHashId from "./pages/pentest/HashId.jsx";
import PentestCidr from "./pages/pentest/Cidr.jsx";
import LearnHub from "./pages/learn/Hub.jsx";
import LearnHashing from "./pages/learn/Hashing.jsx";
import LearnIp from "./pages/learn/IpLesson.jsx";
import LearnCracking from "./pages/learn/Cracking.jsx";
import LearnTraffic from "./pages/learn/Traffic.jsx";
import Blog from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import Guides from "./pages/Guides.jsx";
import GuideDetail from "./pages/GuideDetail.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import Disclaimer from "./pages/Disclaimer.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="surveil-grid">
      <Seo path="/404" title="Page not found" noindex />
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-28 text-center">
        <p className="font-mono text-6xl font-extrabold text-brand">404</p>
        <h1 className="mt-4 font-mono text-2xl font-bold">This page went dark.</h1>
        <p className="mt-3 text-muted">
          The page you're after doesn't exist — or it covered its tracks well.
        </p>
        <Link to="/" className="btn-primary mt-8">Back to safety →</Link>
      </div>
    </div>
  );
}

export default function App() {
  const { theme } = useTheme();
  return (
    <>
      {theme === "hacker" && <MatrixRain />}
      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="scanline" aria-hidden="true" />
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Tools — the focus */}
            <Route path="/am-i-tracked" element={<AmITracked />} />
            <Route path="/fingerprint" element={<Fingerprint />} />
            <Route path="/anti-detect" element={<AntiDetect />} />
            <Route path="/osint" element={<ThreatHub />} />
            <Route path="/osint/recon" element={<Osint />} />
            <Route path="/osint/recon/:indicator" element={<Osint />} />
            <Route path="/osint/people" element={<OsintPeople />} />
            <Route path="/osint/exposure" element={<OsintExposure />} />
            <Route path="/osint/breach" element={<OsintBreach />} />
            <Route path="/osint/footprint" element={<OsintFootprint />} />
            <Route path="/osint/brokers" element={<OsintBrokers />} />
            <Route path="/osint/username" element={<OsintUsername />} />
            <Route path="/osint/email" element={<OsintEmail />} />
            <Route path="/osint/base64" element={<OsintDecoder />} />
            <Route path="/osint/decoder" element={<OsintDecoder />} />
            <Route path="/osint/domain" element={<OsintDomain />} />
            <Route path="/osint/redirects" element={<OsintRedirects />} />
            <Route path="/osint/ssl" element={<OsintSSL />} />
            <Route path="/osint/qr" element={<OsintQR />} />
            <Route path="/osint/intel" element={<OsintIntel />} />
            <Route path="/pentest" element={<PentestHub />} />
            <Route path="/pentest/subdomains" element={<PentestSubdomains />} />
            <Route path="/pentest/nmap" element={<PentestNmap />} />
            <Route path="/pentest/hash-id" element={<PentestHashId />} />
            <Route path="/pentest/cidr" element={<PentestCidr />} />
            <Route path="/osint/:indicator" element={<Osint />} />
            <Route path="/learn" element={<LearnHub />} />
            <Route path="/learn/hashing" element={<LearnHashing />} />
            <Route path="/learn/cracking" element={<LearnCracking />} />
            <Route path="/learn/ip" element={<LearnIp />} />
            <Route path="/learn/traffic" element={<LearnTraffic />} />
            {/* Secondary — kept, out of focus */}
            <Route path="/guides" element={<Guides />} />
            <Route path="/guides/:slug" element={<GuideDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/best-vpns" element={<VpnComparison />} />
            <Route path="/privacy" element={<PrivacyHub />} />
            <Route path="/privacy-tools" element={<PrivacyTools />} />
            <Route path="/de-google" element={<DeGoogle />} />
            <Route path="/self-defense" element={<SelfDefense />} />
            {/* Info / legal */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}
