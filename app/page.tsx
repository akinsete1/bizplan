import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import ProblemSection from '@/components/home/ProblemSection';
import HowItWorks from '@/components/home/HowItWorks';
import TemplatePreview from '@/components/home/TemplatePreview';
import PricingSection from '@/components/home/PricingSection';
import TrustSection from '@/components/home/TrustSection';
import CTASection from '@/components/home/CTASection';
import LeadCapturePopup from '@/components/home/LeadCapturePopup';

export const metadata: Metadata = {
  title: 'BizPlan Nigeria – Create Professional Business Plans & Grant Proposals',
  description: 'Turn your business idea into a funding-ready plan. Professional business plans, grant proposals, loan applications designed for Nigerian entrepreneurs.',
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustSection />
        <ProblemSection />
        <HowItWorks />
        <TemplatePreview />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
      <LeadCapturePopup />
    </>
  );
}
