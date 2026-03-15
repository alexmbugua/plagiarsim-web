import { useState } from 'react';
import Header from '@/sections/Header';
import Hero from '@/sections/Hero';
import Services from '@/sections/Services';
import Features from '@/sections/Features';
import Pricing from '@/sections/Pricing';
import HowItWorks from '@/sections/HowItWorks';
import Testimonials from '@/sections/Testimonials';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import Dashboard from '@/components/dashboard/Dashboard';
import './App.css';

function AppContent() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const openDashboard = () => {
    setIsDashboardOpen(true);
  };

  const closeDashboard = () => {
    setIsDashboardOpen(false);
  };

  const handleSelectPlan = (_plan: { id: string; name: string; price: number }) => {
    openRegister();
  };

  // Check if we're in WordPress shortcode context (full-screen mode)
  const isWordPressShortcode = document.getElementById('academic-assist-root')?.hasAttribute('data-view');

  // If dashboard is open, show it full-screen
  if (isDashboardOpen) {
    return (
      <div className={`${isWordPressShortcode ? 'min-h-screen' : 'turnitin-check-dashboard-wrapper'}`}>
        {!isWordPressShortcode && (
          <button 
            onClick={closeDashboard}
            className="turnitin-check-back-btn"
          >
            ← Back to Home
          </button>
        )}
        <Dashboard onClose={closeDashboard} />
      </div>
    );
  }

  // In WordPress shortcode, show full app without WordPress theme
  if (isWordPressShortcode) {
    return (
      <div className="min-h-screen bg-white">
        <Header
          onLoginClick={openLogin}
          onRegisterClick={openRegister}
          onDashboardClick={openDashboard}
        />
        
        <main>
          <Hero onRegisterClick={openRegister} />
          <Services onGetStarted={openRegister} />
          <Features />
          <HowItWorks />
          <Pricing onSelectPlan={handleSelectPlan} />
          <Testimonials />
          <CTA onRegisterClick={openRegister} />
        </main>

        <Footer />

        {/* Modals */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onRegisterClick={openRegister}
        />
        
        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onLoginClick={openLogin}
        />
      </div>
    );
  }

  // Default WordPress page template view
  return (
    <div className="turnitin-check-app">
      <Header
        onLoginClick={openLogin}
        onRegisterClick={openRegister}
        onDashboardClick={openDashboard}
      />
      
      <main>
        <Hero onRegisterClick={openRegister} />
        <Services onGetStarted={openRegister} />
        <Features />
        <HowItWorks />
        <Pricing onSelectPlan={handleSelectPlan} />
        <Testimonials />
        <CTA onRegisterClick={openRegister} />
      </main>

      <Footer />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onRegisterClick={openRegister}
      />
      
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onLoginClick={openLogin}
      />
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
