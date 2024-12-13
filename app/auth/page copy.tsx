'use client'
import React, { useState } from 'react'
import './auth.css'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginValidationSchema, registerValidationSchema } from './auth-validation-schema'
import { useLogin, useRegister } from '@/data/user'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useAuthStore } from '@/store'
import { axiosInstance } from '@/config/axios.config'
import axios from 'axios'

type FormLogin = {
    email: string
    password: string
}

type FormRegister = {
    name: string
    email: string
    password: string
}

const Auth = () => {
    const [isActive, setIsActive] = useState(false)
    const [isShowPass, setIsShowPass] = useState(false)
    const { mutate: login } = useLogin()
    const { mutate: register } = useRegister()
    const { login: loginStore } = useAuthStore()

    const router = useRouter()

    const {
        register: registerLogin,
        getValues,
        formState: { errors: errorsLogin },
    } = useForm<FormLogin>({
        resolver: yupResolver(loginValidationSchema),
    })

    const {
        register: registerRegister,
        getValues: getValuesRegister,
        formState: { errors: errorsRegister },
    } = useForm<FormRegister>({
        resolver: yupResolver(registerValidationSchema),
    })

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        const email = getValues('email')
        const password = getValues('password')

        await axios
            .post('http://localhost:3001/v1/api/auth/login', { email, password })
            .then(({ data }) => {
                loginStore(data.metadata)
                router.replace('/')
            })
            .catch((errors) => toast.error(errors?.response.data.message))
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        const email = getValuesRegister('email')
        const password = getValuesRegister('password')
        const name = getValuesRegister('name')

        await axios
            .post('http://localhost:3001/v1/api/auth/signup', { email, password, name })
            .then(({ data }) => {
                loginStore(data.metadata)
                router.replace('/')
            })
            .catch((errors) => toast.error(errors?.response.data.message))
    }

    const handleChangeLayout = () => setIsActive((prev) => !prev)

    // const onSubmitLogin = ({ email, password }: FormLogin) => {
    //     login(
    //         { email, password },
    //         {
    //             onSuccess: ({ metadata }) => {
    //                 loginStore(metadata)
    //                 router.replace('/')
    //             },
    //             onError: (errors: any) => {
    //                 toast.error(errors?.response.data.message)
    //             },
    //         }
    //     )
    // }

    // const onSubmitRegister = ({ email, password, name }: FormRegister) => {
    //     register(
    //         { email, password, name },
    //         {
    //             onSuccess: ({ metadata }) => {
    //                 loginStore(metadata)
    //                 router.replace('/')
    //             },
    //             onError: (errors: any) => {
    //                 toast.error(errors?.response.data.message)
    //             },
    //         }
    //     )
    // }

    return (
        <div className="wrapper-auth">
            <div className={`container ${isActive ? 'active' : ''}`}>
                <div className="form-container sign-up">
                    <form
                        // onSubmit={handleSubmitRegister(onSubmitRegister)}
                        onSubmit={(e) => handleRegister(e)}
                        className="bg-white flex items-center justify-center flex-col px-10 h-full"
                    >
                        <h1 className="font-semibold text-xl mb-4">Đăng ký tài khoản</h1>
                        <input type="text" placeholder="Name" {...registerRegister('name')} />
                        <span className="self-start text-xs px-2 text-red-500 mb-1">
                            {errorsRegister?.name?.message}
                        </span>
                        <input type="email" placeholder="Email" {...registerRegister('email')} />
                        <span className="self-start text-xs px-2 text-red-500 mb-1">
                            {errorsRegister?.email?.message}
                        </span>
                        <input type="password" placeholder="Password" {...registerRegister('password')} />
                        <span className="self-start text-xs px-2 text-red-500 mb-1">
                            {errorsRegister?.password?.message}
                        </span>
                        <button>Đăng ký</button>
                    </form>
                </div>
                <div className="form-container sign-in">
                    <form
                        // onSubmit={handleSubmitLogin(onSubmitLogin)}
                        onSubmit={(e) => handleLogin(e)}
                        className="bg-white flex items-center justify-center flex-col px-10 h-full"
                    >
                        <h1 className="font-semibold text-xl mb-4">Đăng nhập</h1>
                        <input type="email" placeholder="Email" {...registerLogin('email')} />
                        <span className="self-start text-xs px-2 text-red-500 mb-1">{errorsLogin?.email?.message}</span>
                        <div className="w-full relative">
                            <input
                                type={isShowPass ? 'text' : 'password'}
                                placeholder="Password"
                                {...registerLogin('password')}
                            />
                            <span
                                className="absolute top-[50%] translate-y-[-50%] right-3"
                                onClick={() => setIsShowPass(!isShowPass)}
                            >
                                {isShowPass ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>
                        <span className="self-start text-xs px-2 text-red-500 mb-1">
                            {errorsLogin?.password?.message}
                        </span>
                        <Link href="#" className="text-gray-600 text-sm my-[15px] mb-[10px]">
                            Quên mật khẩu?
                        </Link>
                        <button>Đăng nhập</button>
                    </form>
                </div>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Bạn đã có tài khoản?</h1>
                            <p className="text-sm tracking-[0.3px] my-5">
                                Nhập thông tin cá nhân của bạn để sử dụng tất cả các tính năng của trang web
                            </p>
                            <button onClick={handleChangeLayout}>Đăng nhập</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Bạn chưa có tài khoản?</h1>
                            <p className="text-sm tracking-[0.3px] my-5">
                                Đăng ký thông tin cá nhân của bạn để sử dụng tất cả các tính năng của trang web
                            </p>
                            <button onClick={handleChangeLayout}>Đăng ký</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth
