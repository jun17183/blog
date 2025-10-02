'use client'
import { DarkModeProvider, useDarkMode } from '../components/DarkModeProvider';
import { Provider } from 'jotai';

function DetailLayoutContent({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
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
    <DarkModeProvider>
      <Provider>
        <DetailLayoutContent>
          {children}
        </DetailLayoutContent>
      </Provider>
    </DarkModeProvider>
  );
}

