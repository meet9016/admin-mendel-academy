import * as Yup from 'yup';

export const blogSchema = Yup.object().shape({
    examName: Yup.string().required("Exam name is required"),
    title: Yup.string().required("Title is required"),
    date: Yup.string().required("Date is required"),
    shortDescription: Yup.string().required("Short description is required."),
    description: Yup.string().required("Description is required."),
})

export const questionSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    tag: Yup.string().required("Tag is required"),
    rating: Yup.number()
        .typeError("Rating must be a number")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot be more than 5")
        .required("Rating is required"),
    total_reviews: Yup.string().required("Total reviews is required"),
    price: Yup.number()
        .typeError("Price must be a number")
        .required("Price is required"),
    features: Yup.array()
        .min(1, "At least one feature is required")
        .required("Features are required"),
    sort_description: Yup.string().required("Sort description is required"),
    description: Yup.string().required("Description is required"),
})

export const prerecordSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    subtitle: Yup.string().required("Subtitle is required"),
    category: Yup.string().required("Category is required"),
    total_reviews: Yup.string().required("Total reviews is required"),
    vimeo_video_id: Yup.string().required("Vimeo video ID is required"),
    price: Yup.number()
        .typeError("Price must be a number")
        .required("Price is required"),
    rating: Yup.number()
        .typeError("Rating must be a number")
        .required("Rating is required"),
    duration: Yup.string().required("Duration is required"),
    description: Yup.string().required("Description is required"),
    date: Yup.string().required("Date is required"),
})

// export const livecourseSchema = Yup.object().shape({
//     title: Yup.string().required("Title is required"),
//     instructor_name: Yup.string().required("Instructor name is required"),
//     date: Yup.string().required("Date is required"),
//     sub_scribe_student_count: Yup.string().required("Subscribed student count is required"),
//     zoom_link: Yup.string()
//         .url("Enter a valid Zoom link")
//         .required("Zoom link is required"),
// })

export const examListSchema = Yup.object().shape({
    category: Yup.string().required("Course category is required"),
    examName: Yup.string().required("Exam name is required"),
    country: Yup.string().required("Country is required"),
    title: Yup.string().required("Title is required"),
    examSteps: Yup.array()
        .of(Yup.string().required("Step can not be empty"))
        .min(1, "At least one exam step is required"),
    description: Yup.string().required("Description is required"),
    // FIXED ENROLL SECTION
    enrollData: Yup.object().shape({
        title: Yup.string().required("Enroll title is required"),
        description: Yup.string().required("Enroll description is required"),
    }),
    //PLAN SECTION
    plans: Yup.array().of(
        Yup.object().shape({
            planDay: Yup.string(),

            planPrice: Yup.string().when("planDay", {
                is: (val: string) => val && val !== "" && val !== null,
                then: (schema) => schema.required("Plan price is required"),
                otherwise: (schema) => schema.notRequired(),
            }),

            planType: Yup.string().when("planDay", {
                is: (val: string) => val && val !== "" && val !== null,
                then: (schema) => schema.required("Plan type is required"),
                otherwise: (schema) => schema.notRequired(),
            }),

            planSubtitles: Yup.array()
                .of(Yup.string().required("Subtitle cannot be empty"))
                .when("planDay", {
                    is: (val: string) => val && val !== "" && val !== null,
                    then: (schema) =>
                        schema.min(1, "At least one subtitle is required"),
                    otherwise: (schema) => schema.notRequired(),
                }),

            isPopular: Yup.boolean(),
        })
    )
})

export const faqSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
})

export const upcomingProgramSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    waitlistCount: Yup.number()
        .typeError("Waitlist count must be a number")
        .required("Waitlist count is required"),
    date: Yup.string().required("Date is required"),
    course_types: Yup.string().required("Course types is required"),
    description: Yup.string().required("Description is required"),
});

export const liveCourseSchema = Yup.object().shape({
    title: Yup.string().required("Course title is required"),
    instructor_name: Yup.string().required("Instructor name is required"),
    instructor_qualification: Yup.string().required("Instructor qualification is required"),

    duration: Yup.string().required("Duration is required"),

    date: Yup.string().required("Date is required"),

    status: Yup.string().required("Status is required"),

    tags: Yup.array()
        .of(Yup.string().required("Tag cannot be empty"))
        .min(1, "At least one tag is required"),

    soldOut: Yup.boolean(),

    modules: Yup.array().of(
        Yup.object().shape({
            module_number: Yup.string().required("Module number is required"),
            module_name: Yup.string().required("Module name is required"),
            module_title: Yup.string().required("Module title is required"),

            module_price: Yup.number()
                .typeError("Module price must be a number")
                .required("Module price is required"),

            plan_sub_title: Yup.array()
                .of(Yup.string().required("Subtitle cannot be empty"))
                .min(1, "At least one subtitle is required"),

            most_popular: Yup.boolean(),
        })
    )
});
