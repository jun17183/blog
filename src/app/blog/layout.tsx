import '@/app/blog/_styles/index.css';

import { ThemeProvider } from '@/app/blog/_providers/ThemeProviders';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}