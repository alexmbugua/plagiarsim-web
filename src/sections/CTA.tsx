import { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CTAProps {
  onRegisterClick: () => void;
}

export default function CTA({ onRegisterClick }: CTAProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { backgroundPosition: '0% 50%' },
        {
          backgroundPosition: '100% 50%',
          duration: 10,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        }
      );

      const elements = contentRef.current?.children;
      if (elements) {
        gsap.fromTo(
          elements,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #3557e7 0%, #0f1b41 50%, #3557e7 100%)',
        backgroundSize: '200% 200%',
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-white/15 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={contentRef} className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
            <GraduationCap className="w-5 h-5 text-white" />
            <span className="font-inter text-sm text-white">Powered by Turnitin Technology</span>
          </div>

          <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-white mb-6">
            Ready to Boost Your Academic Success?
          </h2>
          
          <p className="font-inter text-white/80 text-lg leading-relaxed mb-8">
            Join thousands of students who trust AcademicAssist for plagiarism reports, 
            AI detection, proofreading, and assignment help. Get started today!
          </p>

          <Button
            onClick={onRegisterClick}
            size="lg"
            className="font-inter font-medium bg-white text-primary hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>

          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {[
              { value: '50K+', label: 'Students Helped' },
              { value: '100K+', label: 'Reports Generated' },
              { value: '99%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-poppins font-bold text-2xl text-white">{stat.value}</div>
                <div className="font-inter text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
