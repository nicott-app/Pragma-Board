import React from 'react';
import { Topbar } from './Topbar';
import { GlobalDialogs } from './GlobalDialogs';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Topbar />
      <main id="app" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        {children}
      </main>
      <GlobalDialogs />
    </div>
  );
};
