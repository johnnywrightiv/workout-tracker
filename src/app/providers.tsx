'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ColorSchemeProvider } from '@/components/color-scheme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ColorSchemeProvider>{children}</ColorSchemeProvider>
    </Provider>
  );
}
