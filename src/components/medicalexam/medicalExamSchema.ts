import * as yup from "yup";

export const PlanSchema = yup.object({
    planMonth: yup.string().required("Plan day is required"),
    planPrice: yup
        .string()
        .required("Plan price is required")
        .matches(/^\d+(\.\d{1,2})?$/, "Enter a valid price"),
    planType: yup.string().required("Plan type is required"),
    planSubtitles: yup
        .array()
        .of(yup.string().required("Subtitle is required"))
        .min(1, "At least one subtitle required"),
    isPopular: yup.boolean(),
});

export const FormSchema = yup.object({
    category: yup.string().required("Category is required"),
    examName: yup.string().required("Exam name is required"),
    examSteps: yup
        .array()
        .of(yup.string().required("Step cannot be empty"))
        .min(1, "Add at least one step"),
    description: yup.string().required("Description is required"),
    // plans: yup.array().of(PlanSchema).min(1, "At least one plan is required"),
});
