'use client'
import localFont from 'next/font/local'
import './globals.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
})
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
})

const queryClient = new QueryClient()

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <QueryClientProvider client={queryClient}>
            <html lang="en">
                <body className="w-full bg-black flex justify-center">
                    <div className="w-full">{children}</div>
                    <ToastContainer autoClose={3000} />
                    <ReactQueryDevtools initialIsOpen={false} />
                </body>
            </html>
        </QueryClientProvider>
    )
}
