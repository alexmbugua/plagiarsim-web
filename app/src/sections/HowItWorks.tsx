import { useEffect, useRef } from 'react';
import { Upload, Settings, FileCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Upload,
    number: '01',
    title: 'Upload Your Document',
    description: 'Simply drag and drop your file or browse to select. We support all major document formats including PDF, DOCX, and TXT.',
  },
  {
    icon: Settings,
    number: '02',
    title: 'Choose Your Check',
    description: 'Select between AI detection, plagiarism check, or run both simultaneously for comprehensive analysis.',
  },
  {
    icon: FileCheck,
    number: '03',
    title: 'Get Results',
    description: 'Receive your detailed report within minutes. Review highlighted sections, similarity scores, and actionable insights.',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Timeline line animation
      gsap.fromTo(
        timelineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Steps animation
      const stepCards = stepsRef.current?.children;
      if (stepCards) {
        Array.from(stepCards).forEach((card, index) => {
          const direction = index % 2 === 0 ? -80 : 80;
          gsap.fromTo(
            card,
            { x: direction, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16 opacity-0">
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-secondary mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="font-inter text-text-gray max-w-xl mx-auto">
            Get your comprehensive report in three simple steps
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-light-gray hidden lg:block -translate-x-1/2">
            <div
              ref={timelineRef}
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-success to-warning origin-top"
              style={{ height: '100%' }}
            />
          </div>

          {/* Steps */}
          <div ref={stepsRef} className="space-y-12 lg:space-y-24">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Content Card */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <div className="bg-white rounded-2xl p-8 shadow-card border border-light-gray/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover hover:border-l-4 hover:border-l-primary">
                    <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                        <step.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="font-poppins font-bold text-4xl text-primary/20">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="font-poppins font-semibold text-xl text-secondary mb-3">
                      {step.title}
                    </h3>
                    <p className="font-inter text-text-gray text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Center Marker */}
                <div className="relative hidden lg:flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-primary border-4 border-white shadow-md z-10" />
                  <div className="absolute w-12 h-12 rounded-full bg-primary/20 animate-ping" />
                </div>

                {/* Empty Space for Alternating Layout */}
                <div className="flex-1 hidden lg:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
