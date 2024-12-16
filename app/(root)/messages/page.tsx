'use client'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useCreateConversation, useCreateNewMessage, useFriends } from '@/data/user'
import Image from 'next/image'
import { IoSend } from 'react-icons/io5'
import { useForm } from 'react-hook-form'
import moment from 'moment'
moment.locale('vi')
import { io, Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import { API_ENDPOINT } from '@/data/api-endpoint'
import { useAuthStore } from '@/store'
import { IoMdMore } from 'react-icons/io'
import Peer from 'simple-peer'
import { useDelMessageMutation, useMessages, useRecallMessageMutation } from '@/data/message'
import { FaPhone } from 'react-icons/fa'

type SelectedUserContextType = {
    selectedUser: any
    setSelectedUser: (user: any) => void
    currentChat: any
    setCurrentChat: (user: any) => void
    socket: any
    onlineUser: any
    roomId: string
    fromVideo: string
    isReject: boolean
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

    const [roomId, setRoomId] = useState('')
    const [isReject, setIsReject] = useState(false)
    const [fromVideo, setFromVideo] = useState('')

    useEffect(() => {
        socket.current = io('ws://localhost:3001')
    }, [])

    useEffect(() => {
        socket?.current?.on('getUsers', (data: any) => {
            setOnlineUser(data)
        })
        socket?.current?.on('incoming_call', ({ from, roomId }) => {
            setRoomId(roomId)
            setFromVideo(from)
        })

        socket?.current?.on('reject', () => {
            console.log('reject')

            setIsReject(true)
        })
    }, [])

    useEffect(() => {
        socket.current?.emit('newUser', user?._id)
    }, [user])

    return (
        <SelectedUserContext.Provider
            value={{
                selectedUser,
                setSelectedUser,
                currentChat,
                setCurrentChat,
                socket,
                onlineUser,
                roomId,
                fromVideo,
                isReject,
            }}
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
                <h2 className="text-lg font-bold text-white">{user?.name}</h2>
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

const ChatHeader = ({ callUser }) => {
    const { selectedUser } = useSelectedUser()

    if (!selectedUser) return null

    return (
        <div className="p-4 border-b flex justify-between">
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
            <div className="cursor-pointer" onClick={() => callUser(selectedUser._id)}>
                <FaPhone size={20} />
            </div>
        </div>
    )
}

const ChatWindow = ({ callUser }) => {
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
            <ChatHeader callUser={callUser} />
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
    const { mutate: recallMessage } = useRecallMessageMutation()
    const { mutate: delMessage } = useDelMessageMutation()

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
                        className={`chat ${
                            message.sender === selectedUser?._id ? 'chat-start' : 'chat-end'
                        } group relative`} // Thêm group và relative ở đây
                        key={message._id}
                        ref={scrollRef}
                    >
                        {/* Hiển thị IoMdMore khi hover vào phần tử cha */}
                        {message.sender !== selectedUser?._id && (
                            <div className="dropdown dropdown-end cursor-pointer z-50 mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-1/2 transform -translate-y-1/2">
                                <div tabIndex={0}>
                                    <IoMdMore size={20} />
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-max shadow"
                                >
                                    {!message?.isRecall && (
                                        <li onClick={() => recallMessage(message._id)}>
                                            <a>Thu hồi</a>
                                        </li>
                                    )}
                                    <li onClick={() => delMessage(message._id)}>
                                        <a>Xóa</a>
                                    </li>
                                </ul>
                            </div>
                        )}
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
        <div onClick={() => setIsClickMessage((prev) => !prev)} className="mr-2">
            {message?.isRecall ? (
                <>
                    <div className="bg-gray-400 p-2 rounded-xl mr-2">Tin nhắn đã được thu hồi</div>
                </>
            ) : (
                <div className="chat-bubble pr-6">{message.text}</div>
            )}
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
    const { user } = useAuthStore()
    const [inCall, setInCall] = useState(false)

    const randomRoomId = Math.floor(Math.random() * 900000000) + 100000000

    const { socket, roomId, fromVideo, isReject, selectedUser } = useSelectedUser()

    const localVideo = useRef()
    const remoteVideo = useRef()
    const peerRef = useRef()

    const createPeer = (initiator, stream) => {
        return new Peer({
            initiator, // Đúng cho một peer duy nhất
            trickle: false,
            stream,
        })
    }

    const endCall = () => {
        if (peerRef.current) {
            peerRef.current.destroy() // Đóng kết nối WebRTC
            peerRef.current = null
        }

        if (localVideo.current) {
            localVideo.current.srcObject.getTracks().forEach((track) => track.stop())
        }

        setInCall(false)
    }

    useEffect(() => {
        isReject && endCall()
    }, [isReject])

    console.log(isReject)

    const joinRoom = () => {
        setInCall(true)
        // Bắt đầu lấy stream từ camera
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            if (localVideo.current) localVideo.current.srcObject = stream

            const peer = createPeer(true, stream)

            peer.on('signal', (signal) => {
                socket.current.emit('send_signal', { signal, room: roomId || randomRoomId })
            })

            peer.on('stream', (stream) => {
                if (remoteVideo.current) remoteVideo.current.srcObject = stream
            })

            peer.on('error', (err) => {
                endCall()
            })

            peer.on('close', () => {
                endCall()
            })

            socket.current.on('receive_signal', (data) => {
                if (peerRef.current) {
                    const peerConnection = peerRef.current._pc
                    if (peerConnection.signalingState === 'stable') {
                        console.warn('Cannot set remote description: already stable')
                        return
                    }
                    peerRef.current.signal(data.signal)
                }
            })

            peerRef.current = peer
        })
    }

    const callUser = (target) => {
        joinRoom()
        socket.current.emit('call_user', { from: user?.name, to: target, roomId: randomRoomId })
    }

    const modalRef = useRef<HTMLDialogElement>(null)

    const openModal = () => {
        if (modalRef.current) {
            modalRef.current.showModal()
        }
    }

    const closeModal = () => {
        if (modalRef.current) {
            modalRef.current.close()
        }
    }

    const acceptCall = () => {
        closeModal()
        joinRoom()
    }

    const rejectCall = () => {
        closeModal()
        socket.current.emit('reject', { to: selectedUser?._id })
    }

    if (roomId && fromVideo) {
        openModal()
    }
    return (
        <div className="relative">
            <div className="h-[calc(100vh-96px)]">
                <div className="h-[90%] flex">
                    <div className="w-1/4 border-r border-gray-300">
                        <Sidebar />
                    </div>
                    <div className="w-3/4">
                        <ChatWindow callUser={callUser} />
                    </div>
                </div>
            </div>
            {inCall && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div>
                        <video ref={localVideo} autoPlay muted className="w-[600px]" />
                    </div>
                    <div className="absolute top-0 right-0">
                        <video ref={remoteVideo} autoPlay className="w-[100px]" />
                    </div>
                </div>
            )}
            <dialog className="modal" ref={modalRef}>
                <div className="modal-box">
                    <p className="py-4">{fromVideo} muốn gọi video với bạn</p>
                    <div className="flex justify-end gap-4">
                        <button className="btn btn-sm btn-active" onClick={rejectCall}>
                            Từ chối
                        </button>
                        <button className="btn btn-sm btn-active btn-primary" onClick={acceptCall}>
                            Chấp nhận
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

const MessageRoot = () => {
    return (
        <SelectedUserProvider>
            <Messages />
        </SelectedUserProvider>
    )
}

export default MessageRoot
