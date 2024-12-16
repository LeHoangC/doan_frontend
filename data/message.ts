import { axiosInstance } from "@/config/axios.config"
import { API_ENDPOINT } from "./api-endpoint"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useMessages({ conversationId }: { conversationId: string }) {
    const fetchData = async () => {
        return (await axiosInstance.get(`${API_ENDPOINT.MESSAGE}/${conversationId}`)).data
    }

    return useQuery({
        queryKey: [API_ENDPOINT.MESSAGE, conversationId],
        queryFn: fetchData,
        enabled: !!conversationId
    })
}

export const useRecallMessageMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (msgId) => {
            const response = await axiosInstance.post(`${API_ENDPOINT.MESSAGE}/${msgId}`)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_ENDPOINT.MESSAGE] })
        }
    })
}

export const useDelMessageMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (msgId) => {
            const response = await axiosInstance.delete(`${API_ENDPOINT.MESSAGE}/${msgId}`)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_ENDPOINT.MESSAGE] })
        }
    })
}