import { useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/sections/Header';
import Hero from '@/sections/Hero';
import Services from '@/sections/Services';
import About from '@/sections/About';
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

  if (isDashboardOpen) {
    return <Dashboard onClose={closeDashboard} />;
  }

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
        <About />
        <Features />
        <HowItWorks />
        <Pricing onSelectPlan={handleSelectPlan} />
        <Testimonials />
        <CTA onRegisterClick={openRegister} />
      </main>

      <Footer />

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
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
