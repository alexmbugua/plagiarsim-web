import { useEffect, useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    quote: "Turnitin Check has become an essential tool in my academic workflow. The AI detection is incredibly accurate, and the detailed reports help me ensure my work maintains the highest standards of integrity.",
    name: "Sarah Mitchell",
    role: "Graduate Student",
    image: "/testimonial-1.jpg",
    rating: 5,
  },
  {
    id: 2,
    quote: "As an educator, I rely on Turnitin Check to maintain academic honesty in my classroom. The comprehensive reports make it easy to identify issues and educate students about proper citation.",
    name: "Dr. James Anderson",
    role: "University Professor",
    image: "/testimonial-2.jpg",
    rating: 5,
  },
  {
    id: 3,
    quote: "The speed and accuracy of Turnitin Check is unmatched. I can upload a document and have a complete analysis within minutes. It's saved me countless hours of manual checking.",
    name: "Emily Rodriguez",
    role: "Content Manager",
    image: "/testimonial-3.jpg",
    rating: 5,
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

      // Carousel animation
      gsap.fromTo(
        carouselRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: 'smooth',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        goToNext();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, isAnimating]);

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const normalizedDiff = ((diff + testimonials.length) % testimonials.length);
    
    if (normalizedDiff === 0) {
      return {
        transform: 'translateX(0) translateZ(200px) rotateY(0deg)',
        opacity: 1,
        zIndex: 10,
      };
    } else if (normalizedDiff === 1 || normalizedDiff === -2) {
      return {
        transform: 'translateX(120%) translateZ(0) rotateY(-45deg)',
        opacity: 0.6,
        zIndex: 5,
      };
    } else {
      return {
        transform: 'translateX(-120%) translateZ(0) rotateY(45deg)',
        opacity: 0.6,
        zIndex: 5,
      };
    }
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16 opacity-0">
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-secondary mb-4">
            What Our <span className="text-primary">Users Say</span>
          </h2>
          <p className="font-inter text-text-gray max-w-xl mx-auto">
            Trusted by students, educators, and professionals worldwide
          </p>
        </div>

        {/* 3D Carousel */}
        <div
          ref={carouselRef}
          className="relative h-[400px] flex items-center justify-center"
          style={{ perspective: '2000px' }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="absolute w-full max-w-2xl bg-white rounded-2xl p-8 shadow-card-hover transition-all duration-800"
              style={{
                ...getCardStyle(index),
                transformStyle: 'preserve-3d',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-primary/20 mb-4" />

              {/* Quote Text */}
              <p className="font-inter text-lg text-secondary leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-poppins font-semibold text-secondary">
                    {testimonial.name}
                  </h4>
                  <p className="font-inter text-sm text-text-gray">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrev}
            className="rounded-full border-light-gray hover:border-primary hover:bg-primary hover:text-white transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          {/* Dots */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setActiveIndex(index);
                    setTimeout(() => setIsAnimating(false), 800);
                  }
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-primary w-8'
                    : 'bg-light-gray hover:bg-primary/50'
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="rounded-full border-light-gray hover:border-primary hover:bg-primary hover:text-white transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
