import AddPost from '@/components/AddPost'
import Feed from '@/components/Feed'
import LeftMenu from '@/components/LeftMenu'
import RightMenu from '@/components/RightMenu'
import Stories from '@/components/Stories'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'SimpleConnect',
    description: 'Social media app built with Next.js',
}

const Home = () => {
    return (
        <div className="px-4 md:px-10 lg:px-12 xl:px-20 2xl:px-32 min-h-screen">
            <div className="flex gap-20 pt-6">
                <div className="hidden top-24 xl:block w-[20%]">
                    <LeftMenu type="home" />
                </div>
                <div className="w-full lg:w-[70%] xl:w-[50%]">
                    <div className="flex flex-col gap-6">
                        <Stories />
                        <AddPost />
                        <Feed />
                    </div>
                </div>
                <div className="hidden lg:block w-[30%]">
                    <RightMenu />
                </div>
            </div>
        </div>
    )
}

export default Home
