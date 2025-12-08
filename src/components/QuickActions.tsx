import { useState } from 'react';
import { Plus, X, Building2, Users, FileText, Briefcase, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      icon: Building2,
      label: 'Nouveau projet',
      path: '/projects/setup-wizard',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: Users,
      label: 'Nouveau contact',
      path: '/contacts/new',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      icon: Briefcase,
      label: 'Nouvelle entreprise',
      path: '/companies/new',
      color: 'bg-orange-500 hover:bg-orange-600',
    },
    {
      icon: FileText,
      label: 'Nouveau document',
      action: () => alert('Fonctionnalité à venir'),
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      icon: CheckSquare,
      label: 'Nouvelle tâche',
      action: () => alert('Fonctionnalité à venir'),
      color: 'bg-pink-500 hover:bg-pink-600',
    },
  ];

  const handleAction = (action: typeof actions[0]) => {
    if (action.path) {
      navigate(action.path);
    } else if (action.action) {
      action.action();
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-40">
      {isOpen && (
        <div className="mb-4 space-y-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => handleAction(action)}
                className={`flex items-center gap-3 w-full ${action.color} text-white px-4 py-3 rounded-lg shadow-lg transition-all hover:scale-105`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
        } text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>
    </div>
  );
}
