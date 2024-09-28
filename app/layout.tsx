'use client'

import './globals.css';
import { ConfigProvider, theme } from 'antd';
import { Providers } from './components/Providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
            token: {
              colorPrimary: '#8d32a8',
              colorBgContainer: '#f0f2f5',
            },
          }}
        >
          <Providers>{children}</Providers>
        </ConfigProvider>
      </body>
    </html>
  );
}