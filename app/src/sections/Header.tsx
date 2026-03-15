import { useState, useEffect } from 'react';
import { Menu, X, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onDashboardClick: () => void;
}

export default function Header({ onLoginClick, onRegisterClick, onDashboardClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Services', id: 'services' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Pricing', id: 'pricing' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        isScrolled
          ? 'glassmorphism shadow-[0_4px_20px_rgba(0,0,0,0.1)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection('hero')}
          >
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-poppins font-bold text-lg text-secondary leading-tight">
                Academic<span className="text-primary">Assist</span>
              </span>
              <span className="font-inter text-[10px] text-text-gray -mt-1">Powered by Turnitin</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="relative font-inter text-sm font-medium text-secondary hover:text-primary transition-colors duration-250 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-primary transition-all duration-250 group-hover:w-full group-hover:left-0" />
              </button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={onDashboardClick}
                  className="font-inter text-sm font-medium text-secondary hover:text-primary"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="font-inter text-sm font-medium border-light-gray hover:border-primary hover:text-primary"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={onLoginClick}
                  className="font-inter text-sm font-medium text-secondary hover:text-primary"
                >
                  Sign In
                </Button>
                <Button
                  onClick={onRegisterClick}
                  className="font-inter text-sm font-medium bg-primary text-white hover:bg-secondary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-btn"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-secondary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg transition-all duration-400 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <nav className="flex flex-col p-4 gap-4">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="font-inter text-sm font-medium text-secondary hover:text-primary text-left py-2"
            >
              {link.label}
            </button>
          ))}
          <hr className="border-light-gray" />
          {isAuthenticated ? (
            <>
              <Button
                onClick={onDashboardClick}
                className="w-full bg-primary text-white hover:bg-secondary"
              >
                Dashboard
              </Button>
              <Button
                onClick={logout}
                variant="outline"
                className="w-full"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onLoginClick}
                className="w-full"
              >
                Sign In
              </Button>
              <Button
                onClick={onRegisterClick}
                className="w-full bg-primary text-white hover:bg-secondary"
              >
                Get Started
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
