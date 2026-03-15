import { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Dot pattern animation
      gsap.fromTo(
        dotsRef.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Image reveal
      gsap.fromTo(
        imageRef.current,
        { clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)', scale: 1.1 },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          scale: 1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Content animations
      const contentElements = contentRef.current?.children;
      if (contentElements) {
        gsap.fromTo(
          contentElements,
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    'Advanced AI detection algorithms',
    'Comprehensive plagiarism database',
    'Detailed similarity reports',
    'Fast and secure processing',
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Dot Pattern Decoration */}
      <div
        ref={dotsRef}
        className="absolute left-8 top-1/4 w-32 h-32 opacity-0"
      >
        <img src="/dot-pattern.png" alt="" className="w-full h-full" />
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div ref={imageRef} className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-card-hover">
              <img
                src="/hero-hand.png"
                alt="About Turnitin Check"
                className="w-full h-auto"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
            </div>

            {/* Floating dot decoration */}
            <div className="absolute -bottom-8 -right-8 w-24 h-24 opacity-60">
              <img src="/dot-pattern.png" alt="" className="w-full h-full animate-float" />
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="space-y-6">
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-secondary">
              About <span className="text-primary">Turnitin Check</span>
            </h2>

            <p className="font-inter text-text-gray leading-relaxed">
              Turnitin Check is your comprehensive solution for academic integrity. 
              Our advanced platform combines state-of-the-art plagiarism detection 
              with cutting-edge AI content analysis.
            </p>

            <p className="font-inter text-text-gray leading-relaxed">
              Whether you're a student ensuring your work is original, an educator 
              maintaining academic standards, or a professional protecting your content, 
              our tool provides the insights you need with precision and reliability.
            </p>

            {/* Feature List */}
            <ul className="space-y-3 pt-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-inter text-sm text-secondary">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-6 font-inter font-medium bg-primary text-white hover:bg-secondary transition-all duration-300 hover:translate-x-1 group"
            >
              Learn More
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
