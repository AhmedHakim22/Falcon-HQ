import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FALCON HQ — Ideas, Scripts & Growth Workspace',
  description: 'المساحة التشغيلية لتطوير أفكار وسكريبتات ومبيعات براند Falcon',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="theme-color" content="#F8F5F0" />
      </head>
      <body className="bg-sand-100 text-charcoal min-h-screen antialiased selection:bg-falcon-50 selection:text-falcon-600">
        {children}
      </body>
    </html>
  );
}
