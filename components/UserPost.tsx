import { axiosInstance } from '@/config/axios.config'
import { API_ENDPOINT } from '@/data/api-endpoint'
import { PostType } from '@/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import Post from './Post'

const fetchData = async ({ pageParam, userSlug }: { pageParam: number; userSlug: string }) => {
    const params = { page: pageParam }
    const response = await axiosInstance.get(`/posts/user/${userSlug}`, { params })
    return response
}

const UserPost = ({ userSlug }: { userSlug: string }) => {
    const { data, fetchNextPage } = useInfiniteQuery({
        queryKey: [API_ENDPOINT.POST, userSlug],
        queryFn: ({ pageParam = 1 }) => fetchData({ pageParam, userSlug }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPage) => {
            if (allPage.length < 1) {
                return allPage.length + 1
            } else {
                return undefined
            }
        },
    })
    const { ref, inView } = useInView()

    useEffect(() => {
        if (inView) {
            fetchNextPage()
        }
    }, [inView])

    if (!data || data.pages.every((page) => page?.data.metadata.length === 0)) {
        return <p className="text-center font-semibold text-xl text-white">Người dùng này chưa có bài viết nào.</p>
    }

    return (
        <div className="flex flex-col gap-6">
            {data?.pages.map((page) =>
                page?.data.metadata.map((post: PostType) => <Post key={post._id} data={post} />)
            )}
            <div ref={ref}></div>
        </div>
    )
}

export default UserPost
