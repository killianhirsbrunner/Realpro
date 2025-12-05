import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../../lib/design-system/tokens';
import { User, AlertCircle, Clock, CheckCircle2, MapPin, Wrench, Calendar } from 'lucide-react';

interface ServiceTicket {
  id: string;
  ticket_number: string;
  lot_number: string;
  buyer_name: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'carpentry' | 'painting' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  assigned_to?: string;
  created_at: string;
  due_date?: string;
}

interface Technician {
  id: string;
  name: string;
  specialties: string[];
  current_tickets: number;
  max_capacity: number;
  availability: 'available' | 'busy' | 'unavailable';
  rating: number;
}

interface ServiceTicketAssignmentProps {
  ticket: ServiceTicket;
  technicians: Technician[];
  onAssign: (ticketId: string, technicianId: string) => Promise<void>;
  onClose: () => void;
  className?: string;
}

export function ServiceTicketAssignment({
  ticket,
  technicians,
  onAssign,
  onClose,
  className = '',
}: ServiceTicketAssignmentProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent':
        return designTokens.colors.light.danger;
      case 'high':
        return designTokens.colors.light.warning;
      case 'medium':
        return designTokens.colors.light.info;
      case 'low':
        return designTokens.colors.light.success;
      default:
        return isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent;
    }
  }

  function getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      plumbing: 'Plomberie',
      electrical: 'Électricité',
      hvac: 'Chauffage/Ventilation',
      carpentry: 'Menuiserie',
      painting: 'Peinture',
      other: 'Autre',
    };
    return labels[category] || category;
  }

  function getCategoryIcon(category: string) {
    return <Wrench className="w-4 h-4" />;
  }

  function getAvailabilityColor(availability: string): string {
    switch (availability) {
      case 'available':
        return designTokens.colors.light.success;
      case 'busy':
        return designTokens.colors.light.warning;
      case 'unavailable':
        return designTokens.colors.light.danger;
      default:
        return isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent;
    }
  }

  function getAvailabilityLabel(availability: string): string {
    const labels: Record<string, string> = {
      available: 'Disponible',
      busy: 'Occupé',
      unavailable: 'Indisponible',
    };
    return labels[availability] || availability;
  }

  function getWorkloadPercentage(technician: Technician): number {
    return (technician.current_tickets / technician.max_capacity) * 100;
  }

  function isRecommended(technician: Technician): boolean {
    const hasSpecialty = technician.specialties.some(s =>
      s.toLowerCase().includes(ticket.category) ||
      ticket.category.includes(s.toLowerCase())
    );
    const isAvailable = technician.availability === 'available';
    const hasCapacity = technician.current_tickets < technician.max_capacity;
    const goodRating = technician.rating >= 4.0;

    return hasSpecialty && isAvailable && hasCapacity && goodRating;
  }

  async function handleAssign() {
    if (!selectedTechnician) return;

    setLoading(true);
    try {
      await onAssign(ticket.id, selectedTechnician);
      onClose();
    } catch (error) {
      console.error('Error assigning ticket:', error);
    } finally {
      setLoading(false);
    }
  }

  const recommendedTechnicians = technicians.filter(isRecommended);
  const otherTechnicians = technicians.filter(t => !isRecommended(t));

  return (
    <div className={className}>
      {/* Ticket Info */}
      <div
        className="p-6 rounded-lg mb-6"
        style={{
          backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
          borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
          borderWidth: '1px',
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                Ticket #{ticket.ticket_number}
              </h3>
              <div
                className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                style={{
                  backgroundColor: `${getPriorityColor(ticket.priority)}20`,
                  color: getPriorityColor(ticket.priority),
                }}
              >
                <AlertCircle className="w-3 h-3" />
                {ticket.priority.toUpperCase()}
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Lot {ticket.lot_number} - {ticket.buyer_name}
              </div>
              <div className="flex items-center gap-1">
                {getCategoryIcon(ticket.category)}
                {getCategoryLabel(ticket.category)}
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm mb-4" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
          {ticket.description}
        </p>

        {ticket.due_date && (
          <div className="flex items-center gap-2 text-sm" style={{ color: designTokens.colors.light.warning }}>
            <Calendar className="w-4 h-4" />
            <span>Échéance: {new Date(ticket.due_date).toLocaleDateString('fr-CH')}</span>
          </div>
        )}
      </div>

      {/* Recommended Technicians */}
      {recommendedTechnicians.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
            <CheckCircle2 className="w-4 h-4" style={{ color: designTokens.colors.light.success }} />
            Techniciens recommandés ({recommendedTechnicians.length})
          </h4>
          <div className="space-y-2">
            {recommendedTechnicians.map((tech) => (
              <TechnicianCard
                key={tech.id}
                technician={tech}
                isSelected={selectedTechnician === tech.id}
                isRecommended={true}
                onSelect={() => setSelectedTechnician(tech.id)}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Technicians */}
      {otherTechnicians.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
            Autres techniciens ({otherTechnicians.length})
          </h4>
          <div className="space-y-2">
            {otherTechnicians.map((tech) => (
              <TechnicianCard
                key={tech.id}
                technician={tech}
                isSelected={selectedTechnician === tech.id}
                isRecommended={false}
                onSelect={() => setSelectedTechnician(tech.id)}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.secondary,
            color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground,
          }}
        >
          Annuler
        </button>
        <button
          onClick={handleAssign}
          disabled={!selectedTechnician || loading}
          className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: selectedTechnician ? designTokens.colors.light.brand : isDark ? designTokens.colors.dark.background : designTokens.colors.light.secondary,
            color: selectedTechnician ? '#ffffff' : isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent,
          }}
        >
          {loading ? 'Assignation...' : 'Assigner le ticket'}
        </button>
      </div>
    </div>
  );
}

interface TechnicianCardProps {
  technician: Technician;
  isSelected: boolean;
  isRecommended: boolean;
  onSelect: () => void;
  isDark: boolean;
}

function TechnicianCard({ technician, isSelected, isRecommended, onSelect, isDark }: TechnicianCardProps) {
  const workloadPercentage = (technician.current_tickets / technician.max_capacity) * 100;
  const availabilityColor = getAvailabilityColor(technician.availability);

  function getAvailabilityColor(availability: string): string {
    switch (availability) {
      case 'available':
        return designTokens.colors.light.success;
      case 'busy':
        return designTokens.colors.light.warning;
      case 'unavailable':
        return designTokens.colors.light.danger;
      default:
        return designTokens.colors.light.accent;
    }
  }

  function getAvailabilityLabel(availability: string): string {
    const labels: Record<string, string> = {
      available: 'Disponible',
      busy: 'Occupé',
      unavailable: 'Indisponible',
    };
    return labels[availability] || availability;
  }

  return (
    <div
      className="p-4 rounded-lg cursor-pointer transition-all"
      style={{
        backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
        borderColor: isSelected
          ? designTokens.colors.light.brand
          : isRecommended
          ? designTokens.colors.light.success
          : isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
        borderWidth: isSelected ? '2px' : '1px',
        borderLeftWidth: isRecommended ? '4px' : isSelected ? '2px' : '1px',
      }}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                {technician.name}
              </p>
              {isRecommended && (
                <span
                  className="px-2 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: `${designTokens.colors.light.success}20`,
                    color: designTokens.colors.light.success,
                  }}
                >
                  Recommandé
                </span>
              )}
            </div>
            <p className="text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              {technician.specialties.join(', ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {'⭐'.repeat(Math.floor(technician.rating))}
            <span className="text-xs ml-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              {technician.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
            Charge de travail
          </span>
          <span className="font-medium" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
            {technician.current_tickets}/{technician.max_capacity} tickets
          </span>
        </div>
        <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${workloadPercentage}%`,
              backgroundColor: workloadPercentage > 80
                ? designTokens.colors.light.danger
                : workloadPercentage > 50
                ? designTokens.colors.light.warning
                : designTokens.colors.light.success,
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: `${availabilityColor}20`,
              color: availabilityColor,
            }}
          >
            <Clock className="w-3 h-3" />
            {getAvailabilityLabel(technician.availability)}
          </div>
        </div>
      </div>
    </div>
  );
}
