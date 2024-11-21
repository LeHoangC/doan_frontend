import Image from 'next/image'
import Link from 'next/link'

const UserInfoCard = async () => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
            {/* TOP */}
            <div className="flex justify-between items-center font-medium">
                <span className="text-gray-500">User Information</span>

                <Link href="/" className="text-blue-500 text-xs">
                    See all
                </Link>
            </div>
            <div className="flex flex-col gap-4 text-gray-500">
                <div className="flex items-center gap-2">
                    <span className="text-xl text-black">Le Hoang Cuong</span>
                    <span className="text-sm">Cuong</span>
                </div>
                <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsum molestias sunt reiciendis provident
                    sit error odit qui harum. Laborum facilis architecto ratione, laboriosam eligendi veniam vitae quas
                    beatae recusandae odit?
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex gap-1 items-center">
                        <Image
                            src="https://images.pexels.com/photos/29062949/pexels-photo-29062949/free-photo-of-ng-i-ph-n-sanh-di-u-trong-chi-c-ao-khoac-xanh-ngoai-tr-i-mua-dong.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                            alt=""
                            width={16}
                            height={16}
                        />
                        <span>Cuong</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserInfoCard
