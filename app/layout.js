// app/layout.js
import './globals.css';

export const metadata = {
  title: 'The Malin Madness',
  description: 'Imperial Family Databank',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
