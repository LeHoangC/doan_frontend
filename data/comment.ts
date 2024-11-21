import { axiosInstance } from "@/config/axios.config"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { API_ENDPOINT } from "./api-endpoint"
import { FormComment } from "@/components/Comments"
import { CommentQueryoptions } from "@/types"

type CommentInput = FormComment & {
    postId?: string,
}

export const useCreateComment = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (data: CommentInput) => {
            const response = await axiosInstance.post(API_ENDPOINT.COMMENT, data)
            return response.data
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [API_ENDPOINT.COMMENT] })
            queryClient.invalidateQueries({ queryKey: [API_ENDPOINT.POST] })
        }
    })

    return mutation
}

export const useCommentsQuery = (params: Partial<CommentQueryoptions>, options: any = {}) => {
    const { data } = useQuery({
        queryKey: [API_ENDPOINT.COMMENT, params],
        queryFn: async () => {
            const response = await axiosInstance.get(API_ENDPOINT.COMMENT, { params })
            return response.data.metadata
        }
    })

    return {
        comments: data
    }
}

export const useCommentsQueryInfinity = (params: Partial<CommentQueryoptions>, options: any = {}) => {
    const { data } = useInfiniteQuery({
        queryKey: [API_ENDPOINT.COMMENT, params],
        queryFn: async ({ pageParam }) => {
            const response = await axiosInstance.get(API_ENDPOINT.COMMENT, { params: { ...params, page: pageParam } })
            return response.data.metadata
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPage) => {
            if (allPage.length < 5) {
                return allPage.length + 1
            } else {
                return undefined
            }
        }
    })

    return {
        comments: data
    }

}