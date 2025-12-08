import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const spinnerVariants = cva('mx-auto animate-bounce', {
  variants: {
    size: {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
    },
    hasText: {
      true: 'mb-4',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    hasText: false,
  },
});

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
} as const;

interface LoadingSpinnerProps extends Omit<VariantProps<typeof spinnerVariants>, 'hasText'> {
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', text, className }: LoadingSpinnerProps) {
  const dimension = sizeMap[size ?? 'md'];

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="text-center">
        <div className={spinnerVariants({ size, hasText: !!text })}>
          <Image
            src="/favicon.ico"
            alt="Loading..."
            width={dimension}
            height={dimension}
            className="object-contain"
          />
        </div>
        {text && <p className="text-gray-600 dark:text-gray-400">{text}</p>}
      </div>
    </div>
  );
}