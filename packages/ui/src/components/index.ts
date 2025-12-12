/**
 * @realpro/ui Components
 *
 * Premium Apple-like UI components for Realpro Suite
 * All components follow WCAG 2.1 AA accessibility guidelines
 */

// ═══════════════════════════════════════════════════════════════════════════
// FORM COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export { Button, type ButtonProps } from './Button';
export { IconButton, type IconButtonProps } from './IconButton';
export { Input, type InputProps } from './Input';
export { Textarea, type TextareaProps } from './Textarea';
export { Select, type SelectProps } from './Select';
export { Checkbox, type CheckboxProps } from './Checkbox';
export { Switch, type SwitchProps } from './Switch';
export { Radio, RadioGroup, type RadioProps, type RadioGroupProps } from './Radio';
export { DatePicker, type DatePickerProps } from './DatePicker';
export { FileUpload, type FileUploadProps } from './FileUpload';
export { SearchInput, type SearchInputProps } from './SearchInput';

// ═══════════════════════════════════════════════════════════════════════════
// DATA DISPLAY
// ═══════════════════════════════════════════════════════════════════════════

export { Badge, type BadgeProps } from './Badge';
export { Card, CardHeader, CardContent, CardFooter, type CardProps } from './Card';
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
export { DataGrid, type DataGridProps, type DataGridColumn } from './DataGrid';
export { Avatar, AvatarGroup, type AvatarProps, type AvatarGroupProps } from './Avatar';
export { Progress, type ProgressProps } from './Progress';
export { StatCard, type StatCardProps } from './StatCard';

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

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
export { Breadcrumbs, type BreadcrumbsProps, type BreadcrumbItem } from './Breadcrumbs';
export { Pagination, type PaginationProps } from './Pagination';
export { Stepper, type StepperProps, type StepperStep } from './Stepper';

// ═══════════════════════════════════════════════════════════════════════════
// FEEDBACK
// ═══════════════════════════════════════════════════════════════════════════

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
export { toast, RealProToaster, type ToasterProps } from './Toast';
export { Tooltip, type TooltipProps } from './Tooltip';
export { Alert, type AlertProps, type AlertVariant } from './Alert';
export { EmptyState, type EmptyStateProps } from './EmptyState';
export { ErrorState, type ErrorStateProps, type ErrorType } from './ErrorState';

// ═══════════════════════════════════════════════════════════════════════════
// OVERLAYS
// ═══════════════════════════════════════════════════════════════════════════

export { Modal, type ModalProps } from './Modal';
export { SidePanel, type SidePanelProps } from './SidePanel';
export {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  type DropdownProps,
  type DropdownItemProps,
} from './Dropdown';
