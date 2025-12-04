import { getRoleDisplayName, getRoleColor, UserRole } from '../lib/permissions';

interface RoleBadgeProps {
  role: UserRole | string;
  size?: 'sm' | 'md' | 'lg';
}

export function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
  const displayName = getRoleDisplayName(role);
  const colorClasses = getRoleColor(role);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${colorClasses} ${sizeClasses[size]}`}
    >
      {displayName}
    </span>
  );
}
