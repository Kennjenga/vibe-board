'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'right' | 'bottom' | 'left' | 'center';
}

interface TourGuideProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
}

export default function TourGuide({ steps, isOpen, onClose }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<DOMRect | null>(null);
  
  // Find the target element and calculate its position
  useEffect(() => {
    if (isOpen && steps.length > 0) {
      const target = document.querySelector(steps[currentStep].target);
      if (target) {
        setTargetElement(target.getBoundingClientRect());
      } else if (steps[currentStep].position === 'center') {
        // For center position, we don't need a target element
        setTargetElement(null);
      }
    }
  }, [isOpen, currentStep, steps]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, onClose]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      setCurrentStep(0);
    }
  };
  
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Calculate position for the tooltip
  const getTooltipPosition = () => {
    if (!targetElement && steps[currentStep].position !== 'center') {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
    
    if (steps[currentStep].position === 'center') {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const rect = targetElement!;
    const position = steps[currentStep].position;
    
    switch (position) {
      case 'top':
        return {
          bottom: `${windowHeight - rect.top + 15}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'right':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + 15}px`,
          transform: 'translateY(-50%)'
        };
      case 'bottom':
        return {
          top: `${rect.bottom + 15}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          top: `${rect.top + rect.height / 2}px`,
          right: `${windowWidth - rect.left + 15}px`,
          transform: 'translateY(-50%)'
        };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="cyber-tour-overlay">
      <AnimatePresence>
        <motion.div
          key={`step-${currentStep}`}
          className="cyber-tour-step"
          style={getTooltipPosition()}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-2 cyber-text">{steps[currentStep].title}</h3>
          <p className="text-gray-700 mb-6">{steps[currentStep].content}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-3 py-1 text-sm border border-[var(--neon-blue)]/30 rounded-lg hover:bg-[var(--neon-blue)]/10 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              {currentStep + 1} of {steps.length}
            </div>
            
            <button
              onClick={handleNext}
              className="px-3 py-1 text-sm bg-[var(--neon-blue)] text-white rounded-lg hover:bg-[var(--neon-blue)]/80 transition-colors"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close tour"
          >
            ✕
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
