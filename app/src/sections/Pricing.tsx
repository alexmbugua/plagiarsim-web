import { useEffect, useRef, useState } from 'react';
import { Check, Sparkles, Landmark, Bitcoin, CreditCard, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 15,
    period: 'per report',
    description: 'Perfect for single submissions',
    features: [
      '1 Plagiarism Report',
      '1 AI Detection Report',
      '24-hour delivery',
      'Email support',
    ],
    popular: false,
  },
  {
    id: 'student',
    name: 'Student',
    price: 49,
    period: 'per month',
    description: 'Best for regular students',
    features: [
      '10 Reports per month',
      'Plagiarism + AI Detection',
      'Basic Proofreading',
      'Citation Help',
      'Priority delivery (12h)',
      'WhatsApp support',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99,
    period: 'per month',
    description: 'Complete academic support',
    features: [
      'Unlimited Reports',
      'Plagiarism + AI Detection',
      'Advanced Proofreading',
      'Full Citation Support',
      'Assignment Guidance',
      'Instant delivery',
      '24/7 Priority Support',
    ],
    popular: false,
  },
];

const paymentMethods = [
  { id: 'bank', name: 'Bank Transfer', icon: Landmark, description: 'Direct bank transfer' },
  { id: 'crypto', name: 'Cryptocurrency', icon: Bitcoin, description: 'BTC, ETH, USDT accepted' },
  { id: 'paypal', name: 'PayPal', icon: Wallet, description: 'Secure PayPal payment' },
  { id: 'wise', name: 'Wise', icon: CreditCard, description: 'International transfer' },
];

interface PricingProps {
  onSelectPlan: (plan: typeof plans[0]) => void;
}

export default function Pricing({ onSelectPlan }: PricingProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [animatedPrices, setAnimatedPrices] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 50%',
        onEnter: () => {
          plans.forEach((plan, index) => {
            gsap.to({}, {
              duration: 1,
              ease: 'expo.out',
              onUpdate: function() {
                const progress = this.progress();
                setAnimatedPrices(prev => {
                  const newPrices = [...prev];
                  newPrices[index] = Math.round(plan.price * progress);
                  return newPrices;
                });
              },
            });
          });
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSelectPlan = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setShowPaymentDialog(true);
    onSelectPlan(plan);
  };

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center mb-16 opacity-0">
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-secondary mb-4">
            Simple <span className="text-primary">Pricing</span>
          </h2>
          <p className="font-inter text-text-gray max-w-xl mx-auto">
            Choose the plan that works best for you. All plans include access to our full range of services.
          </p>
          
          {/* Payment Methods */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-light-gray">
                <method.icon className="w-4 h-4 text-primary" />
                <span className="font-inter text-sm text-secondary">{method.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl p-8 transition-all duration-400 hover:-translate-y-4 hover:shadow-card-hover flex flex-col ${
                plan.popular
                  ? 'shadow-card-hover border-2 border-primary scale-105 z-10'
                  : 'shadow-card border border-light-gray/50'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 animate-pulse-glow">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}

              <div className="flex-1">
                <h3 className="font-poppins font-semibold text-xl text-secondary mb-1">
                  {plan.name}
                </h3>
                <p className="font-inter text-sm text-text-gray mb-4">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-poppins font-bold text-4xl text-secondary">
                    ${animatedPrices[index]}
                  </span>
                  <span className="font-inter text-text-gray">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3 group">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 transition-transform group-hover:scale-110" />
                      <span className="font-inter text-sm text-text-gray group-hover:text-secondary transition-colors">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full font-inter font-medium transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? 'bg-primary text-white hover:bg-secondary hover:shadow-btn'
                    : 'bg-secondary/5 text-secondary hover:bg-primary hover:text-white'
                }`}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 font-inter text-sm text-text-gray">
          Secure payments. 100% money-back guarantee if not satisfied.
        </p>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-poppins text-xl">Complete Your Purchase</DialogTitle>
            <DialogDescription className="font-inter text-text-gray">
              {selectedPlan && (
                <>
                  You've selected the <strong>{selectedPlan.name}</strong> plan at{' '}
                  <strong>${selectedPlan.price}</strong> {selectedPlan.period}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <p className="font-inter text-sm text-secondary font-medium">Select Payment Method:</p>
            
            <div className="grid gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-light-gray hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <method.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-inter font-medium text-secondary">{method.name}</p>
                    <p className="font-inter text-xs text-text-gray">{method.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="font-inter text-xs text-text-gray">
                After selecting a payment method, you will receive payment instructions via email or WhatsApp.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
