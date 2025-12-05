import { ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens, getSemanticColor } from '../../lib/design-system/tokens';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string | Date;
  icon?: ReactNode;
  status?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  metadata?: Record<string, any>;
}

interface TimelineProps {
  items: TimelineItem[];
  variant?: 'vertical' | 'horizontal';
  showConnector?: boolean;
  className?: string;
}

export function Timeline({
  items,
  variant = 'vertical',
  showConnector = true,
  className = '',
}: TimelineProps) {
  const { theme } = useTheme();

  if (variant === 'horizontal') {
    return <HorizontalTimeline items={items} showConnector={showConnector} className={className} />;
  }

  return (
    <div className={`relative ${className}`}>
      {items.map((item, index) => (
        <TimelineItemComponent
          key={item.id}
          item={item}
          isLast={index === items.length - 1}
          showConnector={showConnector}
          theme={theme}
        />
      ))}
    </div>
  );
}

function TimelineItemComponent({
  item,
  isLast,
  showConnector,
  theme,
}: {
  item: TimelineItem;
  isLast: boolean;
  showConnector: boolean;
  theme: 'light' | 'dark';
}) {
  const isDark = theme === 'dark';
  const bgColor = isDark ? designTokens.colors.dark.background : designTokens.colors.light.background;
  const borderColor = isDark ? designTokens.colors.dark.border : designTokens.colors.light.border;

  const statusColor = item.status
    ? getSemanticColor(item.status === 'default' ? 'info' : item.status, theme)
    : designTokens.colors.light.brand;

  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      {/* Timeline line */}
      {showConnector && !isLast && (
        <div
          className="absolute left-6 top-12 bottom-0 w-0.5"
          style={{ backgroundColor: borderColor }}
        />
      )}

      {/* Icon/dot */}
      <div className="relative flex-shrink-0">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: statusColor,
            boxShadow: `0 0 0 4px ${bgColor}`,
          }}
        >
          {item.icon || (
            <div className="w-3 h-3 rounded-full bg-white" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4
              className="font-semibold text-base mb-1"
              style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}
            >
              {item.title}
            </h4>
            {item.description && (
              <p
                className="text-sm mb-2"
                style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}
              >
                {item.description}
              </p>
            )}
          </div>
          <time
            className="text-xs whitespace-nowrap"
            style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}
          >
            {typeof item.timestamp === 'string' ? item.timestamp : item.timestamp.toLocaleDateString()}
          </time>
        </div>

        {/* Metadata */}
        {item.metadata && (
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(item.metadata).map(([key, value]) => (
              <span
                key={key}
                className="text-xs px-2 py-1 rounded"
                style={{
                  backgroundColor: isDark ? designTokens.colors.dark.secondary : designTokens.colors.light.secondary,
                  color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent,
                }}
              >
                {key}: {String(value)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HorizontalTimeline({
  items,
  showConnector,
  className,
}: {
  items: TimelineItem[];
  showConnector: boolean;
  className: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const borderColor = isDark ? designTokens.colors.dark.border : designTokens.colors.light.border;

  return (
    <div className={`relative ${className}`}>
      {/* Horizontal line */}
      {showConnector && (
        <div
          className="absolute top-6 left-6 right-6 h-0.5"
          style={{ backgroundColor: borderColor }}
        />
      )}

      {/* Items */}
      <div className="flex justify-between items-start relative">
        {items.map((item, index) => (
          <HorizontalTimelineItem key={item.id} item={item} theme={theme} />
        ))}
      </div>
    </div>
  );
}

function HorizontalTimelineItem({ item, theme }: { item: TimelineItem; theme: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  const statusColor = item.status
    ? getSemanticColor(item.status === 'default' ? 'info' : item.status, theme)
    : designTokens.colors.light.brand;

  return (
    <div className="flex flex-col items-center text-center max-w-32">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
        style={{ backgroundColor: statusColor }}
      >
        {item.icon || <div className="w-3 h-3 rounded-full bg-white" />}
      </div>
      <h5
        className="font-medium text-sm mb-1"
        style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}
      >
        {item.title}
      </h5>
      <time
        className="text-xs"
        style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}
      >
        {typeof item.timestamp === 'string' ? item.timestamp : item.timestamp.toLocaleDateString()}
      </time>
    </div>
  );
}
