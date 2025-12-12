/**
 * @realpro/ui Components
 *
 * Generic, reusable UI components for Realpro Suite applications.
 * No business logic - only presentational components.
 */

// Core Form Components
export { Button, type ButtonProps } from './Button';
export { Input, type InputProps } from './Input';
export { Select, type SelectProps } from './Select';
export { Textarea, type TextareaProps } from './Textarea';

// Display Components
export { Badge, type BadgeProps } from './Badge';
export { Card, CardHeader, CardContent, CardFooter, type CardProps } from './Card';
export { Avatar, AvatarGroup, type AvatarProps, type AvatarGroupProps } from './Avatar';
export { Progress, type ProgressProps } from './Progress';

// Data Display
export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  type TableProps,
  type TableHeaderProps,
  type TableBodyProps,
  type TableRowProps,
  type TableHeadProps,
  type TableCellProps,
} from './Table';

// Feedback Components
export { Spinner, type SpinnerProps } from './Spinner';
export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  SkeletonAvatar,
  type SkeletonProps,
  type SkeletonTextProps,
  type SkeletonCardProps,
  type SkeletonTableProps,
  type SkeletonAvatarProps,
} from './Skeleton';
export { EmptyState, type EmptyStateProps } from './EmptyState';
export { toast, RealProToaster, type ToasterProps } from './Toast';
export { Tooltip, type TooltipProps } from './Tooltip';

// Overlay Components
export { Modal, type ModalProps } from './Modal';
export { SidePanel, type SidePanelProps } from './SidePanel';
export {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  type DropdownProps,
  type DropdownItemProps,
} from './Dropdown';

// Navigation Components
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  type TabsProps,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentProps,
} from './Tabs';
