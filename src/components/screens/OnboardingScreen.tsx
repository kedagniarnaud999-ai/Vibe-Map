import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, BookOpen, Users, Sparkles, ArrowRight, Check } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      badge: 'DISCOVER & EXPLORE',
      title: 'Don’t just see Benin. Understand where you are.',
      description:
        'La Vibe Map guides independent travelers through the living heritage, sacred sanctuaries, and historic kingdoms of Benin.',
      icon: Compass,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAYRkhFIC1UIMj-wtR3I2XflFdCO4hl5uPhcPGbvRkTjpiupKomSdzy3oo91TkhEp5znDF7GUsnzhwI1Tb3NaXMkqsJpLYV7I4ht9-mR8hdPlIbBKMe2JQ8mEUNWM_VqEKLJZn28-7BRg28B58wrYmEjfM2yLwgCOdEzi83Z1eBW09qhceR6NiPLnTaZigYp1YysTL60qKBmJsfMLygRB5nMeKXu2BgAdXiqv4xsLXwyTumG8egnF91',
      tag: 'Sacred Ouidah & Beyond'
    },
    {
      badge: 'DIGITAL CULTURAL LIBRARY',
      title: 'Decode symbols, proverbs & sacred rituals.',
      description:
        'Explore curated stories written by historians, decode royal Dahomey appliqué textiles, and master cultural etiquette before every visit.',
      icon: BookOpen,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAvlDb0XuU_Cb4imwPnzeB5ynevor-y5iP5Ob-77rRPkwOCWMh5kUN8L-gIrdee1M7fawU7VYx8VhPOwlmbwQyGyJJOf-40SRG_4v_xTuuMTrgbofWxd2KMJHsmTLPUgUu1lslm4B3ASn8mGGR5af1UbDPZe3c4EWfLtfseDFwxLxmkiHy4B0frryKq-jHLmhWUa_a3FXcOFAZUB5Vwk669z_H1978s5UfhHpK3s0QdK-IAiGvCJu_N',
      tag: 'Fon Appliqué & Oral History'
    },
    {
      badge: 'VERIFIED MEDIATORS & AI VIBE',
      title: 'Connect with certified keepers of tradition.',
      description:
        'Book verified cultural mediators, weave custom day itineraries, and access an AI cultural companion grounded in respect and nuance.',
      icon: Users,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCOBwAO2hQQWAA9OHvGDKO4mWxpsFow-PevNyma39HaHhFrKO8upgdHcjhEjZep2cPMYofRNVXMhPuW3k6WB0N7O11q3jHzj5uOlb8pNAA_wMpPn7gSrpXnt39vxgzkJafdn8NA_XNHiun7EJlgO3z0S99C7WkzOlTnnjulIpxhSFZ4tGVu0kudyd4U_Q7IyPsp_dqgH2We7YnyGUa-IMNb1ju7fi8tvpuembDT0ri5mMrNwkbDUT4W',
      tag: 'Authentic Human Connections'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const current = steps[currentStep];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-[#fdfcf8] flex flex-col justify-between p-6 max-w-lg mx-auto relative overflow-hidden">
      {/* Top row */}
      <div className="flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#c14e2f] flex items-center justify-center text-white font-serif font-bold text-sm">
            VM
          </div>
          <span className="font-serif font-bold text-[#c14e2f] text-lg">La Vibe Map</span>
        </div>
        <button
          onClick={onComplete}
          className="text-xs font-semibold uppercase tracking-wider text-[#8c867c] hover:text-[#c14e2f] transition-colors px-3 py-1.5 rounded-full hover:bg-[#e8e2d5]"
        >
          Passer
        </button>
      </div>

      {/* Main presentation */}
      <div className="my-auto py-6 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Image card */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#e8e2d5] aspect-[4/3] bg-[#efece2]">
              <img
                src={current.image}
                alt={current.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#c14e2f] text-xs font-semibold w-fit">
                  <Icon className="w-3.5 h-3.5" />
                  {current.tag}
                </span>
              </div>
            </div>

            {/* Content info */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40]">
                {current.badge}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2926] leading-snug">
                {current.title}
              </h2>
              <p className="text-sm text-[#6b665e] leading-relaxed font-sans">
                {current.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="space-y-4 z-10 pb-4">
        {/* Step indicator pills */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-8 bg-[#c14e2f]'
                  : 'w-2 bg-[#dedad0]'
              }`}
              aria-label={`Step ${index + 1}`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="w-full py-3.5 px-6 rounded-xl bg-[#c14e2f] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#a83f23] active:scale-[0.98] transition-all"
        >
          {currentStep === steps.length - 1 ? (
            <>
              <span>Commencer l’Expérience</span>
              <Check className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Continuer</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
