import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../_lib/cn';

const buttonVariants = cva(
  'rounded-md transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
  {
    variants: {
      variant: {
        primary:
          'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600',
        secondary:
          'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-transparent dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800',
        ghost:
          'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:bg-transparent dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

export function Button({ children, variant, size, className, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </button>
  );
}