import { axiosInstance } from "@/config/axios.config"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { API_ENDPOINT } from "./api-endpoint"
import { QueryOptions } from "@/types"

export const usePostsQuery = async (options?: Pick<QueryOptions, 'limit'>) => {
    const fetchData = async ({ pageParam }: { pageParam: number }) => {
        const params = { page: pageParam }
        const response = await axiosInstance.get(`/posts/following-and-friend`, { params })
        return response
    }

    const { data, fetchNextPage } = useInfiniteQuery({
        queryKey: [API_ENDPOINT.POST],
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

    return { posts: data?.pages?.flatMap((page) => page.data) ?? [], loadMore: fetchNextPage }
}

export const useLikePost = () => {
    const mutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await axiosInstance.post(`${API_ENDPOINT.LIKE_POST}/${id}`)
            return response.data
        }
    })
    return mutation
}

export const useDeletePostMutation = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await axiosInstance.delete(`${API_ENDPOINT.POST}/${id}`)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_ENDPOINT.FOLLOWING_AND_FRIEND] })
        }
    })
    return mutation
}

export const useCreatePostMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: FormData) => {
            const response = await axiosInstance.post(API_ENDPOINT.POST, data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_ENDPOINT.FOLLOWING_AND_FRIEND] })
        }
    })
}