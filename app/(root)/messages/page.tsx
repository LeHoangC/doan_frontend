'use client'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useCreateConversation, useCreateNewMessage, useFriends, useMessages } from '@/data/user'
import Image from 'next/image'
import { IoSend } from 'react-icons/io5'
import { useForm } from 'react-hook-form'
import moment from 'moment'
moment.locale('vi')
import { io, Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import { API_ENDPOINT } from '@/data/api-endpoint'
import { useAuthStore } from '@/store'

type SelectedUserContextType = {
    selectedUser: any
    setSelectedUser: (user: any) => void
    currentChat: any
    setCurrentChat: (user: any) => void
    socket: any
    onlineUser: any
}

const SelectedUserContext = createContext<SelectedUserContextType | null>(null)

const useSelectedUser = () => {
    const context = useContext(SelectedUserContext)
    if (!context) {
        throw new Error('useSelectedUser must be used within a SelectedUserProvider')
    }
    return context
}

// Provider để bọc các thành phần con
const SelectedUserProvider = ({ children }: { children: React.ReactNode }) => {
    const socket = useRef<Socket | null>()

    const { user } = useAuthStore()

    const [selectedUser, setSelectedUser] = useState(null)
    const [currentChat, setCurrentChat] = useState(null)
    const [onlineUser, setOnlineUser] = useState([])

    useEffect(() => {
        socket.current = io('ws://localhost:3001')
    }, [])

    useEffect(() => {
        socket?.current?.on('getUsers', (data: any) => {
            setOnlineUser(data)
        })
    }, [])

    useEffect(() => {
        socket.current?.emit('newUser', user?._id)
    }, [user])

    return (
        <SelectedUserContext.Provider
            value={{ selectedUser, setSelectedUser, currentChat, setCurrentChat, socket, onlineUser }}
        >
            {children}
        </SelectedUserContext.Provider>
    )
}

const Sidebar = () => {
    const { user } = useAuthStore()

    const { data } = useFriends({ id: user?._id! })
    const { mutate: createConversation } = useCreateConversation()
    const { setSelectedUser, setCurrentChat, onlineUser } = useSelectedUser()

    const handleCreateNewChat = (friend: any) => {
        setSelectedUser(friend)

        createConversation(friend._id, {
            onSuccess: (data) => {
                setCurrentChat(data.metadata)
            },
        })
    }

    return (
        <div className="p-4">
            <div className="flex items-center gap-4 mb-6">
                <div className="avatar">
                    <div className="w-12 rounded-full">
                        <Image
                            alt=""
                            width={48}
                            height={48}
                            src={
                                user?.picturePath
                                    ? `http://localhost:3001/assets/${user?.picturePath}`
                                    : '/no-avatar.png'
                            }
                        />
                    </div>
                </div>
                <h2 className="text-lg font-bold">{user?.name}</h2>
            </div>

            <input
                type="text"
                placeholder="Tìm kiếm"
                className="py-2 px-4 w-full mb-4 border outline-none rounded-lg"
            />

            <ul>
                {data?.metadata.map((friend: any, index: number) => (
                    <li
                        onClick={() => handleCreateNewChat(friend)}
                        key={index}
                        className="flex items-center justify-between p-2 mb-2 rounded-md bg-gray-50 hover:bg-gray-200 cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`avatar ${
                                    onlineUser.find((user: any) => user.userId === friend._id) ? 'online' : 'offline'
                                }`}
                            >
                                <div className="w-12 rounded-full">
                                    <Image
                                        width={40}
                                        height={40}
                                        src={
                                            friend?.picturePath
                                                ? `http://localhost:3001/assets/${friend?.picturePath}`
                                                : '/no-avatar.png'
                                        }
                                        alt="Friend avatar"
                                        className="w-10 h-10 rounded-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold">{friend.name}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

const ChatHeader = () => {
    const { selectedUser } = useSelectedUser()

    if (!selectedUser) return null

    return (
        <div className="p-4 border-b">
            <div className="flex items-center gap-4">
                <Image
                    width={48}
                    height={48}
                    src={
                        selectedUser?.picturePath
                            ? `http://localhost:3001/assets/${selectedUser?.picturePath}`
                            : '/no-avatar.png'
                    }
                    alt="Chat avatar"
                    className="w-12 h-12 rounded-full"
                />
                <div>
                    <h2 className="text-lg font-bold">{selectedUser.name}</h2>
                    {/* <p className="text-sm text-gray-500">Grateful for every sunrise and sunset 🌅</p> */}
                </div>
            </div>
        </div>
    )
}

const ChatWindow = () => {
    const { selectedUser } = useSelectedUser()
    if (!selectedUser)
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                    <h2 className="text-xl font-semibold">Chọn một người bạn để bắt đầu trò chuyện</h2>
                    <p className="mt-2 text-sm">
                        Danh sách bạn bè đang ở bên trái, hãy nhấp vào để bắt đầu cuộc trò chuyện.
                    </p>
                </div>
            </div>
        )
    return (
        <div className="flex flex-col h-full bg-slate-100">
            <ChatHeader />
            <ChatMessages />
            <ChatInput />
        </div>
    )
}

const ChatMessages = () => {
    const queryClient = useQueryClient()

    const scrollRef = useRef<HTMLDivElement | null>(null)
    const { currentChat, selectedUser, socket } = useSelectedUser()
    const { data } = useMessages({ conversationId: currentChat?._id })

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [data])

    useEffect(() => {
        socket.current.on('check', (dataSocket: number) => {
            if (dataSocket === 1) {
                queryClient.invalidateQueries({ queryKey: [API_ENDPOINT.MESSAGE] })
            }
        })
    }, [])

    return (
        <div className="h-full overflow-y-scroll mx-6 mt-4">
            {data?.metadata?.map((message: any) => {
                return (
                    <div
                        className={`chat chat-${message.sender === selectedUser?._id ? 'start' : 'end'}`}
                        key={message._id}
                        ref={scrollRef}
                    >
                        <Message message={message} />
                    </div>
                )
            })}
        </div>
    )
}

const Message = ({ message }: { message: any }) => {
    const [isClickMessage, setIsClickMessage] = useState(false)
    const time = moment(message.createdAt).fromNow()
    return (
        <div onClick={() => setIsClickMessage((prev) => !prev)}>
            <div className="chat-bubble">{message.text}</div>
            <div className="chat-footer">{isClickMessage && <time className="text-xs opacity-70">{time}</time>}</div>
        </div>
    )
}

const ChatInput = () => {
    const { user } = useAuthStore()

    const { currentChat, socket, selectedUser } = useSelectedUser()
    const { mutate: createNewMessage } = useCreateNewMessage()
    const { register, handleSubmit, setValue, getValues } = useForm({ defaultValues: { messageText: '' } })

    const onSubmit = (data: { messageText: string }) => {
        createNewMessage({ conversationId: currentChat._id, text: data.messageText })

        const dataEmit = {
            senderId: user?._id,
            receiverId: selectedUser._id,
            text: getValues('messageText'),
        }

        socket.current.emit('sendMessage', dataEmit)
        setValue('messageText', '')
    }

    return (
        <form className="mt-auto p-4 border-t relative" onSubmit={handleSubmit(onSubmit)}>
            <input
                {...register('messageText', { required: true })}
                placeholder="Nhập tin nhắn..."
                className="w-full py-2 pl-3 pr-14 border outline-none rounded-lg"
            ></input>

            <div className="absolute top-[50%] translate-y-[-50%] right-10 cursor-pointer">
                <IoSend size={20} color="blue" />
            </div>
        </form>
    )
}

const Messages = () => {
    return (
        <SelectedUserProvider>
            <div className="h-[calc(100vh-96px)]">
                <div className="h-[90%] flex">
                    <div className="w-1/4 border-r border-gray-300">
                        <Sidebar />
                    </div>
                    <div className="w-3/4">
                        <ChatWindow />
                    </div>
                </div>
            </div>
        </SelectedUserProvider>
    )
}

export default Messages
