'use client'
import { Provider } from 'jotai';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';
import { cn } from '@/lib/utils';

function EditorLayoutContent({ children }: { children: React.ReactNode }) {
  const [isDarkMode] = useAtom(darkModeAtom);

  return (
    <div className={cn(
      'h-screen transition-colors duration-200',
      {
        'bg-gray-900 text-white': isDarkMode,
        'bg-white text-gray-900': !isDarkMode,
      }
    )}>
      <main className="h-full flex flex-col">
        {children}
      </main>
    </div>
  );
}

export default function EditorLayout({ 
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider>
      <EditorLayoutContent>
        {children}
      </EditorLayoutContent>
    </Provider>
  );
}
