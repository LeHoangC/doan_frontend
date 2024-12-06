import Image from 'next/image'
import React from 'react'

const Stories = () => {
    return (
        <div className="p-4 bg-[#1f1f1f] rounded-lg shadow-md overflow-scroll text-sm scrollbar-hide">
            <div className="flex gap-8 w-max">
                <div className="flex flex-col text-white items-center gap-2 cursor-pointer">
                    <Image
                        src="https://images.pexels.com/photos/29005031/pexels-photo-29005031/free-photo-of-kham-pha-nh-ng-hang-d-ng-bang-k-thu-c-a-iceland.jpeg"
                        alt="story"
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full ring-2"
                    />
                    <span>Cường</span>
                </div>
                <div className="flex flex-col items-center gap-2 cursor-pointer">
                    <Image
                        src="https://images.pexels.com/photos/29005031/pexels-photo-29005031/free-photo-of-kham-pha-nh-ng-hang-d-ng-bang-k-thu-c-a-iceland.jpeg"
                        alt="story"
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full ring-2"
                    />
                    <span>Cường</span>
                </div>
            </div>
        </div>
    )
}

export default Stories
