import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { InquiryModal } from "./components/InquiryModal";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { InquiryProvider } from "./context/InquiryContext";
import { getCategoryBySlug } from "./data/nhlData";
import { CatalogPage } from "./pages/CatalogPage";
import { CategoryPage } from "./pages/CategoryPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [pathname, hash]);
  return null;
}

function LegacyCategoryRoute() {
  const { slug = "" } = useParams<{ slug: string }>();
  if (getCategoryBySlug(slug)) {
    return <CategoryPage slugOverride={slug} />;
  }
  return <NotFoundPage />;
}

export default function App() {
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  useEffect(() => {
    const onQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener("gmp-quota-exceeded", onQuotaExceeded);
    return () => window.removeEventListener("gmp-quota-exceeded", onQuotaExceeded);
  }, []);

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <BrowserRouter>
          <InquiryProvider>
            {mapsQuotaExceeded && (
              <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
                <span>
                  Google Maps Platform quota reached. If you are the app owner, visit{" "}
                  <a
                    href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold text-amber-950 hover:text-amber-800"
                  >
                    maps developer site
                  </a>{" "}
                  for instructions to update your account.
                </span>
              </div>
            )}
            <ScrollToTop />
            <SiteHeader />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/catalog/:category" element={<CategoryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about-us" element={<Navigate to="/#about" replace />} />
              <Route path="/home" element={<Navigate to="/#about" replace />} />
              <Route path="/how-we-work" element={<Navigate to="/#work" replace />} />
              <Route path="/:slug" element={<LegacyCategoryRoute />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <InquiryModal />
            <SiteFooter />
          </InquiryProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ErrorBoundary>
  );
}
