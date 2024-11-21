import { axiosInstance } from '@/config/axios.config'
import { AuthResponse, LoginType, RegisterType } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { API_ENDPOINT } from './api-endpoint'

export const useLogin = () => {
    const mutation = useMutation({
        mutationFn: async (data: LoginType) => {
            const response = await axiosInstance.post<AuthResponse>(API_ENDPOINT.LOGIN, data)
            return response.data
        }
    })
    return mutation
}

export function useRegister() {

    const mutation = useMutation({
        mutationFn: async (data: RegisterType) => {
            const response = await axiosInstance.post<AuthResponse>(API_ENDPOINT.REGISTER, data)
            return response.data
        }
    })

    return mutation
}

export function useLogout() {
    const router = useRouter()
    return useMutation({
        mutationFn: async () => {
            return (await axiosInstance.post(API_ENDPOINT.LOGOUT))
        },
        onSuccess: () => {
            window.localStorage.removeItem('token')
            window.localStorage.removeItem('user')
            router.replace('auth')
        }
    })
}

export function useFollowing({ id }: { id: string }) {
    const fetchData = async () => {
        return (await axiosInstance.get(`${API_ENDPOINT.FOLLOWING}/${id}`)).data
    }

    return useQuery({
        queryKey: [API_ENDPOINT.FOLLOWING],
        queryFn: fetchData,
    })
}

export function useUserNotFriend({ id }: { id: string }) {
    const fetchData = async () => {
        return (await axiosInstance.get(`${API_ENDPOINT.NOT_FRIEND}/${id}`)).data
    }

    return useQuery({
        queryKey: [API_ENDPOINT.NOT_FRIEND],
        queryFn: fetchData,
    })
}

export function useFriendRequest({ id }: { id: string }) {
    const fetchData = async () => {
        return (await axiosInstance.get(`${API_ENDPOINT.REQUESTER}/${id}`)).data
    }

    return useQuery({
        queryKey: [API_ENDPOINT.REQUESTER],
        queryFn: fetchData,
    })
}

export function useAddFriend() {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async ({ receiverId }: { receiverId: string }) => {
            const response = await axiosInstance.post(API_ENDPOINT.ADD_FRIEND, { receiverId })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_ENDPOINT.NOT_FRIEND] })
            queryClient.invalidateQueries({ queryKey: [API_ENDPOINT.FOLLOWING_AND_FRIEND] })
        }
    })

    return mutation
}

export function useAcceptFriend() {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async ({ friendId }: { friendId: string }) => {
            const response = await axiosInstance.post(API_ENDPOINT.ACCEPT_FRIEND, { friendId })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_ENDPOINT.NOT_FRIEND] })
            queryClient.invalidateQueries({ queryKey: [API_ENDPOINT.FOLLOWING_AND_FRIEND] })
        }
    })

    return mutation
}


export function useFriends({ id }: { id: string }) {
    const fetchData = async () => {
        return (await axiosInstance.get(`${API_ENDPOINT.FRIEND}/${id}`)).data
    }

    return useQuery({
        queryKey: [API_ENDPOINT.FRIEND],
        queryFn: fetchData,
    })
}


export function useCreateConversation() {
    const mutation = useMutation({
        mutationFn: async (receiverId: string) => {
            const response = await axiosInstance.get(`${API_ENDPOINT.CONVERSATION}/${receiverId}`)
            return response.data
        },
    })

    return mutation
}

export function useMessages({ conversationId }: { conversationId: string }) {
    const fetchData = async () => {
        return (await axiosInstance.get(`${API_ENDPOINT.MESSAGE}/${conversationId}`)).data
    }

    return useQuery({
        queryKey: [API_ENDPOINT.MESSAGE, conversationId],
        queryFn: fetchData,
    })
}

export function useCreateNewMessage() {
    const queryClient = useQueryClient()

    const mutate = useMutation({
        mutationFn: async (data: any) => {
            return (await axiosInstance.post(API_ENDPOINT.MESSAGE, data)).data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_ENDPOINT.MESSAGE] })
        }
    })

    return mutate
}