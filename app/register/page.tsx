'use client'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { MdOutlineMail } from 'react-icons/md'
import { registerValidationSchema } from '../auth/auth-validation-schema'
import axios from 'axios'
import { useAuthStore } from '@/store'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import { BsGithub } from 'react-icons/bs'
import { FaFacebook } from 'react-icons/fa'
import Image from 'next/image'

type FormRegister = {
    name: string
    email: string
    password: string
}

const Register = () => {
    const [isShowPass, setIsShowPass] = useState(false)

    const { login: loginStore } = useAuthStore()

    const router = useRouter()

    const { register: registerRegister, handleSubmit: handleSubmitRegister } = useForm<FormRegister>({
        resolver: yupResolver(registerValidationSchema),
    })

    const onSubmitRegister = async ({ email, password, name }: FormRegister) => {
        await axios
            .post('http://localhost:3001/v1/api/auth/signup', { email, password, name })
            .then(({ data }) => {
                loginStore(data.metadata)
                router.replace('/')
            })
            .catch((errors) => toast.error(errors?.response.data.message))
    }

    return (
        <div className="w-full bg-white font-[sans-serif]">
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
                    <div className="md:max-w-md w-full px-4 py-4">
                        <form onSubmit={handleSubmitRegister(onSubmitRegister)}>
                            <div className="mb-12">
                                <h3 className="text-gray-800 text-3xl font-extrabold">Đăng ký</h3>
                            </div>

                            <div>
                                <label className="text-gray-800 text-base block mb-2">Tên đăng nhập</label>
                                <div className="relative flex items-center">
                                    <input
                                        {...registerRegister('name')}
                                        type="text"
                                        required
                                        className="w-full text-gray-800 text-base border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                                        placeholder="Enter name"
                                    />
                                </div>
                            </div>

                            <div className="mt-8">
                                <label className="text-gray-800 text-base block mb-2">Email</label>
                                <div className="relative flex items-center">
                                    <input
                                        {...registerRegister('email')}
                                        type="text"
                                        required
                                        className="w-full text-gray-800 text-base border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                                        placeholder="Enter email"
                                    />
                                    <MdOutlineMail className="w-[18px] h-[18px] absolute right-2 cursor-pointer opacity-30" />
                                </div>
                            </div>

                            <div className="mt-8">
                                <label className="text-gray-800 text-base block mb-2">Mật khẩu</label>
                                <div className="relative flex items-center">
                                    <input
                                        {...registerRegister('password')}
                                        type={isShowPass ? 'text' : 'password'}
                                        required
                                        className="w-full text-gray-800 text-base border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                                        placeholder="Enter password"
                                    />
                                    <span
                                        className="w-[18px] h-[18px] absolute right-2 cursor-pointer opacity-30"
                                        onClick={() => setIsShowPass(!isShowPass)}
                                    >
                                        {isShowPass ? <FiEyeOff /> : <FiEye />}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-12">
                                <button
                                    type="submit"
                                    className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                >
                                    Đăng ký
                                </button>
                            </div>

                            <p className="text-gray-800 text-sm !mt-8 text-center">
                                You have an account?{' '}
                                <Link
                                    href="/auth"
                                    className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
                                >
                                    Login here
                                </Link>
                            </p>

                            <div className="space-x-6 flex justify-center mt-6">
                                <FcGoogle size={32} />
                                <BsGithub size={32} />
                                <FaFacebook size={32} className="text-blue-600" />
                            </div>
                        </form>
                    </div>

                    <div className="md:h-full bg-[#000842] rounded-xl lg:p-12 p-8">
                        <Image
                            src="https://readymadeui.com/signin-image.webp"
                            className="w-full h-full object-contain"
                            alt="login-image"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
