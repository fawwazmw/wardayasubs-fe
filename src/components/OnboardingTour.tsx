import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface TourStep {
  title: string;
  description: string;
  target?: string;
}

const tourSteps: TourStep[] = [
  {
    title: 'Welcome to wardayasubs! 👋',
    description: 'Let\'s take a quick tour to help you get started with tracking your subscriptions.',
  },
  {
    title: 'Dashboard Overview',
    description: 'View your subscription stats, monthly spending, and upcoming renewals at a glance.',
    target: '#overview',
  },
  {
    title: 'Manage Subscriptions',
    description: 'Add, edit, or delete your subscriptions. Use templates for popular services or import from CSV.',
    target: '#subscriptions',
  },
  {
    title: 'Track Payments',
    description: 'Record and view your payment history to keep track of all your subscription expenses.',
    target: '#payments',
  },
  {
    title: 'Organize with Categories',
    description: 'Create custom categories to organize your subscriptions by type (Entertainment, Productivity, etc.).',
    target: '#categories',
  },
  {
    title: 'Keyboard Shortcuts',
    description: 'Press Ctrl + / anytime to see all available keyboard shortcuts for faster navigation.',
  },
  {
    title: 'You\'re all set! 🎉',
    description: 'Start adding your subscriptions and take control of your spending. You can always access settings from the sidebar.',
  },
];

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenOnboardingTour');
    if (!hasSeenTour) {
      // Show tour after a short delay
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenOnboardingTour', 'true');
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === tourSteps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-purple-400">
                Step {currentStep + 1} of {tourSteps.length}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-white">{step.title}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 leading-relaxed">{step.description}</p>
        </div>

        {/* Progress dots */}
        <div className="px-6 pb-4 flex justify-center gap-2">
          {tourSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-purple-500'
                  : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Skip tour
          </button>
          <div className="flex gap-2">
            {!isFirst && (
              <Button
                onClick={handlePrev}
                variant="outline"
                className="bg-slate-800/50 border-slate-700 text-gray-300 hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
            >
              {isLast ? 'Get Started' : 'Next'}
              {!isLast && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
