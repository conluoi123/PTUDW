import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, ChevronRight, ChevronLeft, X, CheckCircle2 } from 'lucide-react';
import { Button } from "./ui/button";
import { GAME_TUTORIALS } from "../data/gameTutorials";

export const GameTutorial = ({ gameId, isOpen, onClose, onStepChange }) => {
  const [step, setStep] = useState(0);
  const tutorial = GAME_TUTORIALS[gameId];

  // Reset step when opening different game
  useEffect(() => {
    if (isOpen) setStep(0);
  }, [isOpen, gameId]);

  // Notify parent of highlight changes
  useEffect(() => {
    if (isOpen && tutorial) {
      const currentHighlight = tutorial.steps[step]?.highlight;
      if (onStepChange) onStepChange(currentHighlight);
    } else {
       if (onStepChange) onStepChange(null);
    }
  }, [step, isOpen, tutorial, onStepChange]);

  if (!isOpen || !tutorial) return null;

  const currentStep = tutorial.steps[step];
  const isLastStep = step === tutorial.steps.length - 1;

  const handleClose = () => {
    if (onStepChange) onStepChange(null);
    onClose();
  };

  const handleNext = () => {
    if (isLastStep) {
      handleClose();
    } else {
      setStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(s => s - 1);
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto">
      
      {/* Tutorial Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <HelpCircle size={64} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-white relative z-10 tracking-tight">
            {tutorial.title}
          </h2>
          <div className="flex gap-1 mt-2 relative z-10">
            {tutorial.steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${i <= step ? 'bg-white' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="mb-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
            <span className="bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
               Step {step + 1}/{tutorial.steps.length}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
            {currentStep.title}
          </h3>
          
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base min-h-[80px]">
            {currentStep.content}
          </p>

          {/* Highlight Hint (Optional visual cue) */}
          {currentStep.highlight && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs rounded-lg border border-yellow-200 dark:border-yellow-800/50 flex items-center gap-2">
              <CheckCircle2 size={16} />
              Look for the highlighted area on screen!
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Skip
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={step === 0}
              size="icon"
              className="rounded-full w-10 h-10"
            >
              <ChevronLeft size={18} />
            </Button>
            
            <Button
              onClick={handleNext}
              className="rounded-full px-6 bg-blue-600 hover:bg-blue-500 text-white"
            >
              {isLastStep ? "Let's Play!" : "Next"}
              {!isLastStep && <ChevronRight size={16} className="ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
