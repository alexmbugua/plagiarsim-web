import { useEffect, useRef } from 'react';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const quickLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
];

const services = [
  { label: 'Plagiarism Reports', href: '#services' },
  { label: 'AI Detection', href: '#services' },
  { label: 'Proofreading', href: '#services' },
  { label: 'Citation Help', href: '#services' },
  { label: 'Assignment Help', href: '#services' },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: MessageCircle, href: '#', label: 'WhatsApp' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.footer-border',
        { width: '0%' },
        {
          width: '100%',
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer ref={footerRef} className="relative pt-20 pb-8 bg-white">
      <div className="footer-border absolute top-0 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-poppins font-bold text-lg text-secondary block leading-tight">
                  Academic<span className="text-primary">Assist</span>
                </span>
                <span className="font-inter text-[10px] text-text-gray">Powered by Turnitin</span>
              </div>
            </div>
            <p className="font-inter text-sm text-text-gray leading-relaxed mb-6">
              We help students access professional plagiarism and AI detection reports, plus proofreading, 
              citation help, and assignment assistance to achieve academic success.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-poppins font-semibold text-secondary mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="font-inter text-sm text-text-gray hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-poppins font-semibold text-secondary mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="font-inter text-sm text-text-gray hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-poppins font-semibold text-secondary mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-inter text-sm text-text-gray">
                  support@academicassist.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-inter text-sm text-text-gray">
                  WhatsApp: +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-inter text-sm text-text-gray">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-inter text-sm text-text-gray">
                  Online Service - Worldwide
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-light-gray">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-inter text-sm text-text-gray text-center md:text-left">
              © {new Date().getFullYear()} AcademicAssist. All rights reserved.
            </p>
            <p className="font-inter text-xs text-text-gray text-center md:text-right">
              We use Turnitin technology to provide plagiarism and AI detection reports. 
              Turnitin is a registered trademark of Turnitin, LLC.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
