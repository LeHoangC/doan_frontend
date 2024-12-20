'use client'
import React, { useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { axiosInstance } from '@/config/axios.config'
import { PostType } from '@/types'
import Post from './Post'
import { API_ENDPOINT } from '@/data/api-endpoint'

const fetchData = async ({ pageParam }: { pageParam: number }) => {
    const params = { page: pageParam }
    const response = await axiosInstance.get(`/posts/following-and-friend`, {
        params,
    })
    return response
}

const Feed = () => {
    const { data, fetchNextPage } = useInfiniteQuery({
        queryKey: [API_ENDPOINT.FOLLOWING_AND_FRIEND],
        queryFn: fetchData,
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
    }, [inView, fetchNextPage])

    if (!data || data.pages.every((page) => page?.data.metadata.length === 0)) {
        return (
            <p className="text-center font-semibold text-xl text-white">
                Hiện chưa có bài viết nào trên bảng tin của bạn.
            </p>
        )
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

export default Feed
