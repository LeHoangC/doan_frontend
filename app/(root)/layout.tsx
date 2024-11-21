import Navbar from '@/components/Navbar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="w-full sticky top-0 z-10 bg-white px-4 md:px-10 lg:px-14 xl:px-20 2xl:px-40">
                <Navbar />
            </div>
            <main>{children}</main>
        </>
    )
}
