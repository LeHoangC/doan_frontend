import * as yup from 'yup'

export const profileValidationSchema = yup.object().shape({
    education: yup.string(),
    location: yup.string(),
    gender: yup.string()
})