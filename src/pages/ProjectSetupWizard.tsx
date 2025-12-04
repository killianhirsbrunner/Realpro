import { useState } from 'react';
import { ChevronLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import Step1Info from '../components/wizard/Step1Info';
import Step2Structure from '../components/wizard/Step2Structure';
import Step3Actors from '../components/wizard/Step3Actors';
import Step4Finances from '../components/wizard/Step4Finances';
import Step5Planning from '../components/wizard/Step5Planning';
import Step6Summary from '../components/wizard/Step6Summary';
import { useProjectCreation } from '../hooks/useProjectCreation';
import { Link } from 'react-router-dom';

export default function ProjectSetupWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    vatRate: '8.1',
    defaultLanguage: 'fr',
    type: 'PPE',
    canton: 'VD',
    buildingsCount: '1',
    entrancesCount: '1',
    floorsCount: '3',
    contingencyRate: '5',
    paymentMode: 'SCHEDULE',
    lots: [],
    actors: [],
  });

  const { createProject } = useProjectCreation();

  const updateFormData = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    await createProject(formData);
  };

  const steps = [
    { number: 1, title: 'Informations', completed: currentStep > 1 },
    { number: 2, title: 'Structure', completed: currentStep > 2 },
    { number: 3, title: 'Intervenants', completed: currentStep > 3 },
    { number: 4, title: 'Finances', completed: currentStep > 4 },
    { number: 5, title: 'Planning', completed: currentStep > 5 },
    { number: 6, title: 'Récapitulatif', completed: currentStep > 6 },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/projects"
              className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <ChevronLeft className="w-5 h-5" />
              Retour aux projets
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Créer un nouveau projet
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Assistant de création guidé en {steps.length} étapes
          </p>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step.completed
                        ? 'bg-green-600 text-white'
                        : currentStep === step.number
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {step.completed ? (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      currentStep === step.number
                        ? 'text-neutral-900 dark:text-neutral-100'
                        : 'text-neutral-600 dark:text-neutral-400'
                    } hidden sm:inline`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      step.completed
                        ? 'bg-green-600'
                        : 'bg-neutral-200 dark:bg-neutral-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          {currentStep === 1 && (
            <Step1Info data={formData} onUpdate={updateFormData} onNext={nextStep} />
          )}
          {currentStep === 2 && (
            <Step2Structure data={formData} onUpdate={updateFormData} onNext={nextStep} onPrev={prevStep} />
          )}
          {currentStep === 3 && (
            <Step3Actors data={formData} onUpdate={updateFormData} onNext={nextStep} onPrev={prevStep} />
          )}
          {currentStep === 4 && (
            <Step4Finances data={formData} onUpdate={updateFormData} onNext={nextStep} onPrev={prevStep} />
          )}
          {currentStep === 5 && (
            <Step5Planning data={formData} onUpdate={updateFormData} onNext={nextStep} onPrev={prevStep} />
          )}
          {currentStep === 6 && (
            <Step6Summary data={formData} onPrev={prevStep} onSubmit={handleSubmit} />
          )}
        </div>
      </div>
    </div>
  );
}
