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
  PROMOTER: { bg: 'bg-blue-100', text: 'text-blue-700' },
  ARCHITECT: { bg: 'bg-brand-100', text: 'text-brand-700' },
  CONTRACTOR: { bg: 'bg-secondary-100', text: 'text-secondary-700' },
  ENGINEER: { bg: 'bg-green-100', text: 'text-green-700' },
  NOTARY: { bg: 'bg-gray-100', text: 'text-gray-700' },
  BROKER: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  MANAGER: { bg: 'bg-red-100', text: 'text-red-700' },
};

export default function ProjectTeamList({ team, onEditMember, onRemoveMember }: ProjectTeamListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {team.map((member) => {
        const roleStyle = roleColors[member.role] || { bg: 'bg-gray-100', text: 'text-gray-700' };
        return (
          <div
            key={member.id}
            className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{member.name}</p>
                <span className={`inline-block mt-1 px-2 py-1 ${roleStyle.bg} ${roleStyle.text} rounded text-xs font-medium`}>
                  {member.role}
                </span>
              </div>
            </div>

            {member.company && (
              <p className="text-sm text-gray-600 mt-3">{member.company}</p>
            )}

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${member.email}`} className="hover:text-blue-600 truncate">
                  {member.email}
                </a>
              </div>

              {member.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${member.phone}`} className="hover:text-blue-600">
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
                    className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    Modifier
                  </button>
                )}
                {onRemoveMember && (
                  <button
                    onClick={() => onRemoveMember(member.id)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
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
