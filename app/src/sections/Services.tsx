import { useEffect, useRef } from 'react';
import { 
  FileCheck, 
  Sparkles, 
  PenTool, 
  BookOpen, 
  ClipboardList,
  Search,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Search,
    title: 'Plagiarism Reports',
    subtitle: 'Powered by Turnitin',
    description: 'Get detailed plagiarism reports showing similarity percentages, matched sources, and highlighted sections. We run your documents through Turnitin to provide professional academic integrity reports.',
    features: ['Similarity Score', 'Source Matching', 'Highlighted Text', 'Citation Suggestions'],
    color: 'from-blue-500 to-blue-600',
    popular: true,
  },
  {
    icon: Sparkles,
    title: 'AI Detection Reports',
    subtitle: 'Powered by Turnitin',
    description: 'Identify AI-generated content with precision. Our reports show AI probability scores and flag suspicious sections to ensure your work meets academic standards.',
    features: ['AI Probability Score', 'Section Analysis', 'Model Detection', 'Detailed Breakdown'],
    color: 'from-purple-500 to-purple-600',
    popular: true,
  },
  {
    icon: PenTool,
    title: 'Proofreading',
    subtitle: 'Expert Editors',
    description: 'Professional proofreading services to polish your academic work. Our editors check grammar, spelling, punctuation, and overall flow to ensure clarity and professionalism.',
    features: ['Grammar Check', 'Spelling Correction', 'Style Improvement', 'Format Review'],
    color: 'from-green-500 to-green-600',
    popular: false,
  },
  {
    icon: BookOpen,
    title: 'Citation Help',
    subtitle: 'All Formats',
    description: 'Get help with APA, MLA, Chicago, Harvard, and other citation formats. We ensure your references and bibliography are perfectly formatted according to academic standards.',
    features: ['APA Format', 'MLA Format', 'Chicago Style', 'Harvard Referencing'],
    color: 'from-orange-500 to-orange-600',
    popular: false,
  },
  {
    icon: ClipboardList,
    title: 'Assignment Help',
    subtitle: 'Expert Guidance',
    description: 'Struggling with an assignment? Our experts provide guidance, feedback, and support to help you understand concepts and complete your work successfully.',
    features: ['Topic Guidance', 'Structure Help', 'Feedback & Review', 'Research Support'],
    color: 'from-pink-500 to-pink-600',
    popular: false,
  },
  {
    icon: FileCheck,
    title: 'Comprehensive Reports',
    subtitle: 'All-in-One',
    description: 'Get the complete package - plagiarism check, AI detection, proofreading notes, and citation review in one comprehensive report for your peace of mind.',
    features: ['Plagiarism + AI', 'Proofreading Notes', 'Citation Review', 'Actionable Feedback'],
    color: 'from-teal-500 to-teal-600',
    popular: true,
  },
];

interface ServicesProps {
  onGetStarted: () => void;
}

export default function Services({ onGetStarted }: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
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

      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: cardsRef.current,
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
      id="services"
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-gray-50/50"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center mb-16 opacity-0">
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-secondary mb-4">
            Our <span className="text-primary">Services</span>
          </h2>
          <p className="font-inter text-text-gray max-w-2xl mx-auto">
            We provide comprehensive academic support services to help students succeed. 
            From plagiarism reports to proofreading, we've got you covered.
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-card border border-light-gray/50 transition-all duration-300 hover:-translate-y-3 hover:shadow-card-hover"
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-primary text-white text-xs font-medium rounded-full">
                    Popular
                  </span>
                </div>
              )}

              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                <service.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="font-poppins font-semibold text-xl text-secondary mb-1">
                {service.title}
              </h3>
              <p className="font-inter text-sm text-primary mb-4">{service.subtitle}</p>
              
              <p className="font-inter text-text-gray text-sm leading-relaxed mb-6">
                {service.description}
              </p>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="font-inter text-sm text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={onGetStarted}
                variant="outline"
                className="w-full font-inter text-sm border-light-gray hover:border-primary hover:text-primary group/btn"
              >
                Learn More
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
