'use client'
import { DarkModeProvider, useDarkMode } from '../blog/components/DarkModeProvider';
import { Provider } from 'jotai';

function EditorLayoutContent({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
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
    <DarkModeProvider>
      <Provider>
        <EditorLayoutContent>
          {children}
        </EditorLayoutContent>
      </Provider>
    </DarkModeProvider>
  );
}
