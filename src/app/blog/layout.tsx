import '@/app/blog/_styles/index.css';

import { ThemeProvider } from '@/app/blog/_providers/ThemeProviders';
import { QueryProvider } from '@/app/blog/_providers/QueryProvider';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </ThemeProvider>
  );
}