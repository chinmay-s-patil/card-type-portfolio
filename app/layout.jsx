// app/layout.jsx
import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next' // ← add this line

export const metadata = {
  title: 'Chinmay Patil — Portfolio',
  description: 'Portfolio — CFD, OpenFOAM, Web apps'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-slate-900 text-slate-100">
        {children}
        <SpeedInsights /> {/* ← drop it here */}
      </body>
    </html>
  )
}