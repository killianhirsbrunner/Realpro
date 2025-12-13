import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/Landing';
import { AppsPage } from './pages/Apps';
import { PricingPage } from './pages/Pricing';
import { FeaturesPage } from './pages/Features';
import { ContactPage } from './pages/Contact';
import { AboutPage } from './pages/About';
import { FAQPage } from './pages/FAQ';
import { LegalPage } from './pages/Legal';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="apps" element={<AppsPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="features" element={<FeaturesPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="legal" element={<LegalPage />} />
        <Route path="legal/:page" element={<LegalPage />} />
      </Route>
    </Routes>
  );
}
