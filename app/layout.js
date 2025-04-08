import './globals.css';

export const metadata = {
  title: 'TAPs - Digital Business Cards',
  description: 'Share your digital business card with a simple link',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}