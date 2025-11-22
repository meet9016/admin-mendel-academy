import * as Yup from 'yup';

export const blogSchema = Yup.object().shape({
    examName: Yup.string().required("Exam name is required"),
    title: Yup.string().required("Title is required"),
    date: Yup.string().required("Date is required"),
    shortDescription: Yup.string().required("Short description is required."),
    description: Yup.string().required("Description is required."),
})