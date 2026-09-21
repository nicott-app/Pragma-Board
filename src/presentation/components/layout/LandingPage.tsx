import React, { useEffect } from 'react';
import './LandingPage.css';


// Sections
import { LandingNavbar, LandingHero, LandingProblem } from './landing/LandingSections1';
import { LandingValueProp, LandingProductShowcase } from './landing/LandingSections2';
import { LandingIASection, LandingWorkflow, LandingComparison, LandingCTA, LandingFooter } from './landing/LandingSections3';

export const LandingPage: React.FC = () => {
  // Inyectamos la clase base al body y html para asegurar que se apliquen los colores base
  // del theme de Stitch en toda la pantalla
  useEffect(() => {
    document.documentElement.classList.add('bg-surface-canvas');
    document.body.classList.add('bg-surface-canvas');
    return () => {
      document.documentElement.classList.remove('bg-surface-canvas');
      document.body.classList.remove('bg-surface-canvas');
    };
  }, []);

  return (
    <div className="bg-surface-canvas text-text-primary antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      <LandingNavbar />
      <main className="w-full pt-16 bg-surface-canvas">
        <div className="flex flex-col w-full text-text-primary selection:bg-primary-container selection:text-on-primary-container">
          <LandingHero />
          <LandingProblem />
          <LandingValueProp />
          <LandingProductShowcase />
          <LandingIASection />
          <LandingWorkflow />
          <LandingComparison />
          <LandingCTA />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
};
