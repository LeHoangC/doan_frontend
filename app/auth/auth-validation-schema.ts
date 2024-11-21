import * as yup from 'yup'

export const loginValidationSchema = yup.object().shape({
    email: yup.string().email('Email không hợp lệ.').required("Email là bắt buộc.").typeError("Email không hợp lệ."),
    password: yup.string().required('Mật khẩu là bắt buộc.')
})

export const registerValidationSchema = yup.object().shape({
    name: yup.string().required("Tên người dùng là bắt buộc."),
    email: yup.string().email('Email không hợp lệ.').required("Email là bắt buộc.").typeError("Email không hợp lệ."),
    password: yup.string().required('Mật khẩu là bắt buộc.')
})