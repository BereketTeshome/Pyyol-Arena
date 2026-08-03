import React, { useState } from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { GamesSection } from './GamesSection';
import { PartnersSection } from './PartnersSection';
import { HowItWorksSection } from './HowItWorksSection';
import { LiveMatchesSection } from './LiveMatchesSection';
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
    <div className="min-h-screen bg-[#022B3A] text-white font-sans overflow-x-hidden flex flex-col">
      {/* Header */}
      <LandingHeader
        onLaunchDashboard={onEnterDashboard}
        onOpenAuth={handleOpenAuth}
        onScrollToSection={scrollToSection}
      />

      {/* Landing Content Stack strictly in requested order */}
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

        {/* 5. LiveMatches */}
        <LiveMatchesSection onSpectateMatch={onEnterDashboard} />

        {/* 6. Pricing */}
        <PricingSection onSelectTier={() => handleOpenAuth('signup')} />

        {/* 7. Testimonials */}
        <TestimonialsSection />

        {/* 8. FAQ */}
        <FAQSection />

        {/* 9. CTA */}
        <CTASection
          onLaunchDashboard={onEnterDashboard}
          onOpenAuth={() => handleOpenAuth('signup')}
        />
      </main>

      {/* 10. Footer */}
      <LandingFooter
        onScrollToSection={scrollToSection}
        onLaunchDashboard={onEnterDashboard}
      />

      {/* Video Trailer Modal */}
      <VideoTrailerModal
        isOpen={showTrailerModal}
        onClose={() => setShowTrailerModal(false)}
      />

      {/* Authentication Modal with Sign In, Sign Up, Forgot Password / Reset */}
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
