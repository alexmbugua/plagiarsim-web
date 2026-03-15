import { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, FileCheck, BookOpen, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import ParticleNetwork from '@/components/particles/ParticleNetwork';

interface HeroProps {
  onRegisterClick: () => void;
}

export default function Hero({ onRegisterClick }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        gradientRef.current,
        { opacity: 0, scale: 1.2 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out' }
      );

      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll('.word');
        gsap.fromTo(
          words,
          { y: 60, opacity: 0, rotateX: 15 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'expo.out',
            delay: 0.3,
          }
        );
      }

      gsap.fromTo(
        descRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out', delay: 0.8 }
      );

      gsap.fromTo(
        ctaRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)', delay: 1 }
      );

      gsap.fromTo(
        imageRef.current,
        { z: -200, opacity: 0, rotateY: -15 },
        { z: 0, opacity: 1, rotateY: 0, duration: 1, ease: 'expo.out', delay: 0.6 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!imageRef.current) return;
    
    const floatAnimation = gsap.to(imageRef.current, {
      y: -15,
      rotation: 2,
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    return () => {
      floatAnimation.kill();
    };
  }, []);

  const services = [
    { icon: FileCheck, label: 'Plagiarism Reports' },
    { icon: Sparkles, label: 'AI Detection' },
    { icon: PenTool, label: 'Proofreading' },
    { icon: BookOpen, label: 'Citation Help' },
  ];

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      <ParticleNetwork />

      <div
        ref={gradientRef}
        className="absolute right-0 top-1/4 w-[600px] h-[600px] -z-10 opacity-0"
      >
        <img
          src="/hero-gradient.png"
          alt=""
          className="w-full h-full object-contain animate-rotate-slow"
        />
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8" style={{ perspective: '1000px' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-inter text-sm text-primary font-medium">Powered by Turnitin Technology</span>
            </div>

            <h1
              ref={titleRef}
              className="font-poppins font-bold text-4xl sm:text-5xl lg:text-6xl text-secondary leading-tight"
            >
              <span className="word inline-block mr-[0.3em]">Get</span>
              <span className="word inline-block mr-[0.3em]">Professional</span>
              <span className="word inline-block mr-[0.3em] text-primary">Academic</span>
              <span className="word inline-block mr-[0.3em] text-primary">Reports</span>
              <span className="word inline-block mr-[0.3em]">&</span>
              <span className="word inline-block mr-[0.3em]">Services</span>
            </h1>

            <p
              ref={descRef}
              className="font-inter text-lg text-text-gray max-w-xl leading-relaxed opacity-0"
            >
              We help students access professional plagiarism and AI detection reports powered by Turnitin. 
              Plus proofreading, citation help, and assignment assistance to boost your academic success.
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-4 opacity-0">
              <Button
                onClick={onRegisterClick}
                size="lg"
                className="font-inter font-medium bg-primary text-white hover:bg-secondary transition-all duration-300 hover:-translate-y-1 hover:shadow-btn-lg group"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="font-inter font-medium border-light-gray text-secondary hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-250"
              >
                Our Services
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-center gap-2">
                  <service.icon className="w-5 h-5 text-primary" />
                  <span className="font-inter text-sm text-secondary">{service.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-8 pt-8 border-t border-light-gray">
              {[
                { value: '50K+', label: 'Students Helped' },
                { value: '100K+', label: 'Reports Generated' },
                { value: '99%', label: 'Satisfaction Rate' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-poppins font-bold text-3xl text-primary">{stat.value}</div>
                  <div className="font-inter text-sm text-text-gray">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={imageRef}
            className="relative flex justify-center lg:justify-end"
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
          >
            <div className="relative w-full max-w-[500px]">
              <img
                src="/hero-hand.png"
                alt="Academic Success"
                className="w-full h-auto drop-shadow-2xl"
              />
              
              <div className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-card p-4 animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                    <FileCheck className="w-4 h-4 text-success" />
                  </div>
                  <span className="font-inter text-sm font-medium text-secondary">Plagiarism: 5%</span>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 bg-white rounded-xl shadow-card p-4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-inter text-sm font-medium text-secondary">AI Score: 2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
