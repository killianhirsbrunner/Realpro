import { forwardRef, useCallback, useState, useId, type ChangeEvent, type DragEvent } from 'react';
import clsx from 'clsx';
import { Upload, X, File, Image, FileText, AlertCircle } from 'lucide-react';

export interface FileUploadProps {
  /** Label text */
  label?: string;
  /** Description/hint text */
  description?: string;
  /** Error message */
  error?: string;
  /** Accepted file types (e.g., ".pdf,.doc" or "image/*") */
  accept?: string;
  /** Allow multiple files */
  multiple?: boolean;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Currently selected files */
  value?: File[];
  /** Callback when files change */
  onChange?: (files: File[]) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Show file list */
  showFileList?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional classes */
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileIcon(file: File) {
  if (file.type.startsWith('image/')) return Image;
  if (file.type.includes('pdf')) return FileText;
  return File;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      label,
      description,
      error,
      accept,
      multiple = false,
      maxSize,
      maxFiles,
      value = [],
      onChange,
      disabled = false,
      showFileList = true,
      size = 'md',
      className,
    },
    ref
  ) => {
    const id = useId();
    const [isDragging, setIsDragging] = useState(false);
    const [fileErrors, setFileErrors] = useState<string[]>([]);

    const sizeStyles = {
      sm: {
        dropzone: 'py-4 px-4',
        icon: 'h-6 w-6',
        text: 'text-xs',
        fileItem: 'py-2 px-2',
        fileIcon: 'h-4 w-4',
      },
      md: {
        dropzone: 'py-6 px-6',
        icon: 'h-8 w-8',
        text: 'text-sm',
        fileItem: 'py-2.5 px-3',
        fileIcon: 'h-5 w-5',
      },
      lg: {
        dropzone: 'py-8 px-8',
        icon: 'h-10 w-10',
        text: 'text-base',
        fileItem: 'py-3 px-4',
        fileIcon: 'h-6 w-6',
      },
    };

    const styles = sizeStyles[size];

    const validateFiles = useCallback(
      (files: File[]): { valid: File[]; errors: string[] } => {
        const errors: string[] = [];
        const valid: File[] = [];

        for (const file of files) {
          if (maxSize && file.size > maxSize) {
            errors.push(`${file.name} dépasse la taille maximale de ${formatFileSize(maxSize)}`);
            continue;
          }

          if (accept) {
            const acceptedTypes = accept.split(',').map((t) => t.trim());
            const isAccepted = acceptedTypes.some((type) => {
              if (type.startsWith('.')) {
                return file.name.toLowerCase().endsWith(type.toLowerCase());
              }
              if (type.endsWith('/*')) {
                return file.type.startsWith(type.replace('/*', '/'));
              }
              return file.type === type;
            });

            if (!isAccepted) {
              errors.push(`${file.name} n'est pas un type de fichier accepté`);
              continue;
            }
          }

          valid.push(file);
        }

        if (maxFiles) {
          const totalFiles = value.length + valid.length;
          if (totalFiles > maxFiles) {
            errors.push(`Maximum ${maxFiles} fichiers autorisés`);
            return { valid: valid.slice(0, maxFiles - value.length), errors };
          }
        }

        return { valid, errors };
      },
      [accept, maxSize, maxFiles, value.length]
    );

    const handleFiles = useCallback(
      (files: FileList | null) => {
        if (!files || disabled) return;

        const fileArray = Array.from(files);
        const { valid, errors } = validateFiles(fileArray);

        setFileErrors(errors);

        if (valid.length > 0) {
          const newFiles = multiple ? [...value, ...valid] : valid.slice(0, 1);
          onChange?.(newFiles);
        }
      },
      [disabled, multiple, onChange, validateFiles, value]
    );

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
        // Reset input value to allow selecting the same file again
        e.target.value = '';
      },
      [handleFiles]
    );

    const handleDragOver = useCallback((e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const handleDragEnter = useCallback((e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
      (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (!disabled) {
          handleFiles(e.dataTransfer.files);
        }
      },
      [disabled, handleFiles]
    );

    const removeFile = useCallback(
      (index: number) => {
        const newFiles = [...value];
        newFiles.splice(index, 1);
        onChange?.(newFiles);
      },
      [onChange, value]
    );

    return (
      <div className={className}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            {label}
          </label>
        )}

        {/* Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={clsx(
            'relative rounded-lg border-2 border-dashed transition-colors duration-150',
            'flex flex-col items-center justify-center text-center cursor-pointer',
            styles.dropzone,
            isDragging
              ? 'border-brand-400 bg-brand-50 dark:bg-brand-950'
              : error
              ? 'border-error-300 bg-error-50 dark:border-error-700 dark:bg-error-950'
              : 'border-neutral-300 bg-neutral-50 hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            ref={ref}
            id={id}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
          />

          <Upload
            className={clsx(
              styles.icon,
              'text-neutral-400 dark:text-neutral-500 mb-2'
            )}
          />

          <p className={clsx(styles.text, 'text-neutral-700 dark:text-neutral-300 font-medium')}>
            Glissez-déposez ou{' '}
            <span className="text-brand-500 hover:text-brand-600">parcourez</span>
          </p>

          {description && (
            <p
              id={`${id}-description`}
              className={clsx(styles.text, 'text-neutral-500 dark:text-neutral-400 mt-1')}
            >
              {description}
            </p>
          )}

          {(accept || maxSize) && (
            <p className={clsx('text-xs text-neutral-400 dark:text-neutral-500 mt-2')}>
              {accept && `Types: ${accept}`}
              {accept && maxSize && ' · '}
              {maxSize && `Max: ${formatFileSize(maxSize)}`}
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <p id={`${id}-error`} className="mt-1.5 text-sm text-error-600 dark:text-error-400" role="alert">
            {error}
          </p>
        )}

        {/* File validation errors */}
        {fileErrors.length > 0 && (
          <div className="mt-2 space-y-1">
            {fileErrors.map((err, i) => (
              <p key={i} className="flex items-center gap-1.5 text-sm text-error-600 dark:text-error-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {err}
              </p>
            ))}
          </div>
        )}

        {/* File list */}
        {showFileList && value.length > 0 && (
          <ul className="mt-3 space-y-2">
            {value.map((file, index) => {
              const FileIcon = getFileIcon(file);
              return (
                <li
                  key={`${file.name}-${index}`}
                  className={clsx(
                    'flex items-center justify-between rounded-lg',
                    'bg-neutral-100 dark:bg-neutral-800',
                    styles.fileItem
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileIcon className={clsx(styles.fileIcon, 'text-neutral-500 flex-shrink-0')} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    disabled={disabled}
                    className="p-1 rounded text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
                    aria-label={`Supprimer ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';
