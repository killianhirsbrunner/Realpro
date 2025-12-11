import { Mail, Phone, User } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  company?: string;
  avatar?: string;
}

interface ProjectTeamListProps {
  team: TeamMember[];
  onEditMember?: (memberId: string) => void;
  onRemoveMember?: (memberId: string) => void;
}

const roleColors: Record<string, { bg: string; text: string }> = {
  PROMOTER: { bg: 'bg-brand-100 dark:bg-brand-900/30', text: 'text-brand-700 dark:text-brand-300' },
  ARCHITECT: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
  CONTRACTOR: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
  ENGINEER: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
  NOTARY: { bg: 'bg-neutral-100 dark:bg-neutral-700', text: 'text-neutral-700 dark:text-neutral-300' },
  BROKER: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' },
  MANAGER: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
};

export default function ProjectTeamList({ team, onEditMember, onRemoveMember }: ProjectTeamListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {team.map((member) => {
        const roleStyle = roleColors[member.role] || { bg: 'bg-neutral-100 dark:bg-neutral-700', text: 'text-neutral-700 dark:text-neutral-300' };
        return (
          <div
            key={member.id}
            className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-md dark:hover:shadow-neutral-900/50 transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-semibold text-lg">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{member.name}</p>
                <span className={`inline-block mt-1 px-2 py-1 ${roleStyle.bg} ${roleStyle.text} rounded-lg text-xs font-medium`}>
                  {member.role}
                </span>
              </div>
            </div>

            {member.company && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3">{member.company}</p>
            )}

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${member.email}`} className="hover:text-brand-600 dark:hover:text-brand-400 truncate transition-colors">
                  {member.email}
                </a>
              </div>

              {member.phone && (
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${member.phone}`} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    {member.phone}
                  </a>
                </div>
              )}
            </div>

            {(onEditMember || onRemoveMember) && (
              <div className="mt-4 flex gap-2">
                {onEditMember && (
                  <button
                    onClick={() => onEditMember(member.id)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/40 rounded-lg transition-colors"
                  >
                    Modifier
                  </button>
                )}
                {onRemoveMember && (
                  <button
                    onClick={() => onRemoveMember(member.id)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                  >
                    Retirer
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
