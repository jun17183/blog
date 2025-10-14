'use client'
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';
import { cn } from '@/lib/utils';

function DetailLayoutContent({ children }: { children: React.ReactNode }) {
  const [isDarkMode] = useAtom(darkModeAtom);

  return (
    <div className={cn(
      'min-h-screen transition-colors duration-200',
      {
        'bg-gray-900 text-white': isDarkMode,
        'bg-white text-gray-900': !isDarkMode,
      }
    )}>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

export default function DetailLayout({ 
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <DetailLayoutContent>
      {children}
    </DetailLayoutContent>
  );
}

