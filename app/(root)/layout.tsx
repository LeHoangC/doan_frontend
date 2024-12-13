import Navbar from '@/components/Navbar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="w-full sticky top-0 z-10 bg-[#1f1f1f] px-4 md:px-10 lg:px-12 xl:px-20 2xl:px-32">
                <Navbar />
            </div>
            <main className="max-w-[2000px] mx-auto">{children}</main>
        </>
    )
}
