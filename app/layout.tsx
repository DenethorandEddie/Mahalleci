import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Mahalleci - Mahallenizi Keşfedin',
  description: 'Mahalle yorumları ve değerlendirmeleri',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
