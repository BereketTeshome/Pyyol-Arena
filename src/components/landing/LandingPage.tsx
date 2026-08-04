import React, { useState } from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { GamesSection } from './GamesSection';
import { PartnersSection } from './PartnersSection';
import { HowItWorksSection } from './HowItWorksSection';
import { ModelBenchmarkSection } from './ModelBenchmarkSection';
import { PricingSection } from './PricingSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FAQSection } from './FAQSection';
import { CTASection } from './CTASection';
import { LandingFooter } from './LandingFooter';
import { VideoTrailerModal } from './VideoTrailerModal';
import { AuthModal } from '../AuthModal';

interface LandingPageProps {
  onEnterDashboard: () => void;
  onUserAuthenticated: (handle: string) => void;
  onOpenLiveMatchesPage?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  onUserAuthenticated,
}) => {
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAuth = (mode: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-[#051824] bg-[radial-gradient(ellipse_120%_120%_at_50%_0%,rgba(14,70,105,0.35)_0%,rgba(3,18,29,1)_100%)] text-white font-sans overflow-x-hidden flex flex-col relative select-none">
      {/* Header */}
      <LandingHeader
        onLaunchDashboard={onEnterDashboard}
        onOpenAuth={handleOpenAuth}
        onScrollToSection={scrollToSection}
      />

      {/* Landing Content Stack */}
      <main className="flex-1 flex flex-col">
        {/* 1. Hero with Video Banner */}
        <HeroSection
          onPlayNow={onEnterDashboard}
          onWatchTrailer={() => setShowTrailerModal(true)}
        />

        {/* 2. GamesSection */}
        <GamesSection />

        {/* 3. Partners Marquee Section */}
        <PartnersSection />

        {/* 4. HowItWorks */}
        <HowItWorksSection />

        {/* 5. AI Model Benchmark & Usage Index */}
        <ModelBenchmarkSection />

        {/* 6. Pricing */}
        <PricingSection onSelectTier={() => handleOpenAuth('signup')} />

        {/* 6. Testimonials */}
        <TestimonialsSection />

        {/* 7. FAQ */}
        <FAQSection />

        {/* 8. CTA */}
        <CTASection
          onLaunchDashboard={onEnterDashboard}
          onOpenAuth={() => handleOpenAuth('signup')}
        />
      </main>

      {/* 9. Footer */}
      <LandingFooter
        onScrollToSection={scrollToSection}
        onLaunchDashboard={onEnterDashboard}
      />

      {/* Video Trailer Modal */}
      <VideoTrailerModal
        isOpen={showTrailerModal}
        onClose={() => setShowTrailerModal(false)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onAuthSuccess={(handle) => {
          onUserAuthenticated(handle);
          onEnterDashboard();
        }}
      />
    </div>
  );
};


