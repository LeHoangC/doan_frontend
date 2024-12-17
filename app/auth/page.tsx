'use client'
import { useState } from 'react'
import './auth.css'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginValidationSchema } from './auth-validation-schema'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useAuthStore } from '@/store'
import axios from 'axios'
import Image from 'next/image'

type FormLogin = {
    email: string
    password: string
}

const Auth = () => {
    const [isShowPass, setIsShowPass] = useState(false)
    const { login: loginStore } = useAuthStore()

    const router = useRouter()

    const { register: registerLogin, handleSubmit: handleSubmitLogin } = useForm<FormLogin>({
        resolver: yupResolver(loginValidationSchema),
    })

    const onSubmitLogin = async ({ email, password }: FormLogin) => {
        await axios
            .post('http://localhost:3001/v1/api/auth/login', { email, password })
            .then(({ data }) => {
                loginStore(data.metadata)
                router.replace('/')
            })
            .catch((errors) => toast.error(errors?.response.data.message))
    }

    return (
        <div className="bg-gray-300 font-[sans-serif]">
            <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                <div className="max-w-md w-full">
                    <a href="javascript:void(0)">
                        <Image
                            src="/logo.png"
                            alt="logo"
                            width={160}
                            height={160}
                            className="w-40 mb-8 mx-auto block"
                        />
                    </a>

                    <div className="p-8 rounded-2xl bg-white shadow">
                        <h2 className="text-gray-800 text-center text-2xl font-bold">Đăng nhập</h2>
                        <form className="mt-8 space-y-4" onSubmit={handleSubmitLogin(onSubmitLogin)}>
                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Email</label>
                                <div className="relative flex items-center">
                                    <input
                                        {...registerLogin('email')}
                                        type="text"
                                        required
                                        className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                        placeholder="Enter user name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Mật khẩu</label>
                                <div className="relative flex items-center">
                                    <input
                                        {...registerLogin('password')}
                                        type={isShowPass ? 'text' : 'password'}
                                        required
                                        className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                        placeholder="Enter password"
                                    />
                                    <span
                                        className="absolute top-[50%] translate-y-[-50%] right-3"
                                        onClick={() => setIsShowPass(!isShowPass)}
                                    >
                                        {isShowPass ? <FiEyeOff /> : <FiEye />}
                                    </span>
                                </div>
                            </div>

                            <div className="text-sm">
                                <a
                                    href="jajvascript:void(0);"
                                    className="text-blue-600 hover:underline font-semibold select-none"
                                >
                                    Quên mật khẩu?
                                </a>
                            </div>

                            <div className="!mt-8">
                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                >
                                    Đăng nhập
                                </button>
                            </div>
                            <p className="text-gray-800 text-sm !mt-8 text-center">
                                Không có tài khoản
                                <Link
                                    href="/register"
                                    className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
                                >
                                    Register here
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth
