"use client";
import React, { useEffect, useState } from "react";
import Label from "../form/Label";
import ComponentCard from "../common/ComponentCard";
import Input from "../form/input/InputField";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { Editor } from "primereact/editor";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import { useRouter } from "next/navigation";
import PlanSection from "./PlanSection";
import Radio from "../form/input/Radio";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import DropzoneComponent from "../blogs/DropZone";
import EnrollSection from "./EnrollSection";
import { decodeHtml } from "@/utils/helper";
import { examListSchema } from "@/ValidationSchema/validationSchema";
import { toast } from "react-toastify";

interface PlanData {
    id: number | string;
    planMonth: number | string;
    planPriceUSD: number | string;
    planPriceINR: number | string;
    planType: string;
    planSubtitles: string[];
    isPopular: boolean;
}

interface FormData {
    // id: string;
    country: string;
    status: string;
    category: string;
    examName: string;
    title: string;
    examSteps: string[];
    description: string;
    plans: PlanData[];
}

const MedicalExam = () => {
    const router = useRouter();
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            setId(params.get("id"));
        }
    }, []);

    const categoryOptions = [
        { value: "USMLE Program", label: "USMLE Program" },
        { value: "International Exams", label: "International Exams" },
    ];

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [preview, setPreview] = useState<string | null>(null);
    const [previewWho, setPreviewWho] = useState<string | null>(null);

    //  Main single state
    const [formData, setFormData] = useState<FormData>({
        // id: "",
        country: "",
        status: "Active",
        category: "",
        examName: "",
        title: "",
        examSteps: [""],
        description: "",
        plans: [
            { id: "", planMonth: "", planPriceUSD: "", planPriceINR: "", planType: "", planSubtitles: [""], isPopular: false },
            { id: "", planMonth: "", planPriceUSD: "", planPriceINR: "", planType: "", planSubtitles: [""], isPopular: false },
            { id: "", planMonth: "", planPriceUSD: "", planPriceINR: "", planType: "", planSubtitles: [""], isPopular: false },
            { id: "", planMonth: "", planPriceUSD: "", planPriceINR: "", planType: "", planSubtitles: [""], isPopular: false },
        ],
    });

    const [enrollData, setEnrollData] = useState({
        title: "",
        description: "",
        image: null as File | null,

    });
    const [enrollPreview, setEnrollPreview] = useState<string | null>(null);
    const [mainImage, setMainImage] = useState<File | null>(null);

    //  Handle updates to any field in formData
    const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    //  Steps (array)
    const addStep = () => {
        handleChange("examSteps", [...formData.examSteps, ""]);
    };

    const removeStep = (index: number) => {
        const updated = formData.examSteps.filter((_, i) => i !== index);
        handleChange("examSteps", updated);
    };

    const handleStepChange = (index: number, value: string) => {
        const updated = [...formData.examSteps];
        updated[index] = value;
        handleChange("examSteps", updated);
        setErrors((prev) => ({
            ...prev,
            [`examSteps[${index}]`]: "",
        }));
    };

    //  Plans
    const handlePlanChange = (index: number, updatedPlan: PlanData) => {
        const updatedPlans = [...formData.plans];
        updatedPlans[index] = updatedPlan;
        handleChange("plans", updatedPlans);
    };

    const handlePopularChange = (index: number) => {
        const updatedPlans = formData.plans.map((plan, i) => ({
            ...plan,
            isPopular: i === index,
        }));
        handleChange("plans", updatedPlans);
    };

    // Handle radio button selection
    const handleRadioChange = (value: string) => {
        setFormData((prev) => ({ ...prev, status: value }));
    };

    const validate = async () => {
        try {
            const finalData = {
                ...formData,
                enrollData: enrollData,
            };
            await examListSchema.validate(finalData, { abortEarly: false });
            setErrors({});
            return true;
        } catch (err: any) {
            const newErrors: any = {};
            err.inner.forEach((e: any) => {
                newErrors[e.path] = e.message;
            });
            setErrors(newErrors);
            return false;
        }
    }

    useEffect(() => {
        const fetchById = async () => {
            try {
                if (!id) return;

                const res = await api.get(`${endPointApi.getByIdExamList}/${id}`);
                const data = res.data || {};
                const decodedDescription = decodeHtml(data.exams[0].description ?? "");

                //  Set form data from API
                setFormData({
                    id: data.exams[0]._id ?? "",
                    category: data?.category_name ?? "",
                    country: data.exams[0].country ?? "",
                    status: data.exams[0].status ?? "Active",
                    examName: data.exams[0].exam_name ?? "",
                    title: data.exams[0].title ?? "",
                    examSteps:
                        data.exams[0].sub_titles && data.exams[0].sub_titles.length > 0
                            ? data.exams[0].sub_titles
                            : [""],
                    description: decodedDescription,
                    plans: (() => {
                        //  Map existing plans (if any)
                        const existingPlans =
                            data.choose_plan_list && data.choose_plan_list.length > 0
                                ? data.choose_plan_list.map((plan: any) => ({
                                    planMonth: plan.plan_month ?? "",
                                    planPriceUSD: plan.plan_pricing_dollar ?? "",
                                    planPriceINR: plan.plan_pricing_inr ?? "",
                                    planType: plan.plan_type ?? "",
                                    planSubtitles:
                                        plan.plan_sub_title && plan.plan_sub_title.length > 0
                                            ? plan.plan_sub_title
                                            : [""],
                                    isPopular:
                                        plan.most_popular === true || plan.most_popular === "true",
                                    id: plan._id
                                }))
                                : [];

                        const emptyPlan = {
                            planMonth: "",
                            planPriceUSD: "",
                            planPriceINR: "",
                            planType: "",
                            planSubtitles: [""],
                            isPopular: false,
                        };

                        while (existingPlans.length < 4) {
                            existingPlans.push({ ...emptyPlan });
                        }

                        return existingPlans;
                    })(),
                });

                setPreview(data?.exams[0]?.image)
                //  Enroll Section
                setEnrollData({
                    title: data?.who_can_enroll_title ?? "",
                    description: data?.who_can_enroll_description ?? "",
                    image: null,
                });
                if (data?.who_can_enroll_image) {
                setEnrollPreview(data.who_can_enroll_image);
            }
            } catch (err) {
                console.error("Error fetching data by ID:", err);
            }
        };

        fetchById();
    }, [id]);


    const handleSave = async () => {
        const isValid = await validate();
        if (!isValid) return;
        
        try {
            const formDataToSend = new FormData();
            // Category
            if (id) {
                // formDataToSend.append("_id", id);
                formDataToSend.append("exams[0][_id]", formData.id);
            }
            formDataToSend.append("category_name", formData.category);
            // Exams
            formDataToSend.append("exams[0][exam_name]", formData.examName);
            formDataToSend.append("exams[0][country]", formData.country);
            formDataToSend.append("exams[0][status]", formData.status);
            formDataToSend.append("exams[0][title]", formData.title);
            formDataToSend.append("exams[0][description]", formData.description);
            formData.examSteps.forEach((step, i) => {
                formDataToSend.append(`exams[0][sub_titles][${i}]`, step);
            });

            // Choose Plan List
            formData.plans.forEach((plan, i) => {
                // if (plan.planPrice && plan.planMonth && plan.planType) {
                if ((plan.planMonth && plan.planType) || plan.planMonth === "Custom") {
                    if (plan?.id !== undefined && plan?.id !== null && id) {
                        formDataToSend.append(`choose_plan_list[${i}][_id]`, String(plan.id));
                    }

                    formDataToSend.append(`choose_plan_list[${i}][plan_pricing_dollar]`, plan.planPriceUSD);
                    formDataToSend.append(`choose_plan_list[${i}][plan_pricing_inr]`, plan.planPriceINR);
                    formDataToSend.append(`choose_plan_list[${i}][plan_month]`, plan.planMonth.toString());
                    formDataToSend.append(`choose_plan_list[${i}][plan_type]`, plan.planType);
                    plan.planSubtitles.forEach((sub, j) => {
                        formDataToSend.append(`choose_plan_list[${i}][plan_sub_title][${j}]`, sub);
                    });
                    formDataToSend.append(`choose_plan_list[${i}][most_popular]`, String(plan.isPopular));
                }
            });

            // Enroll Section
            formDataToSend.append("who_can_enroll_title", enrollData.title);
            formDataToSend.append("who_can_enroll_description", enrollData.description);
            if (enrollData.image) {
                formDataToSend.append("who_can_enroll_image", enrollData.image);
            }

            // Exam main image
            if (mainImage) {
                formDataToSend.append("image", mainImage);
            }
            let res;

            if (id) {
                res = await api.put(`${endPointApi.updateExamList}/${id}`, formDataToSend);
                router.push("/medicalexamlist");
                toast.success(res.data?.message);
            } else {
                res = await api.post(`${endPointApi.createExamList}`, formDataToSend);
                toast.success(res.data?.message);
                router.push("/medicalexamlist");
            }

        } catch (err) {
            toast.error("Something went wrong! Please try again.");
            console.log("ERROR:", err);
        }
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Add Medical Exam" name="">
                {/* Category + Exam Name */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <Label>Course Category</Label>
                        <Select
                            options={categoryOptions}
                            placeholder="Select category"
                            value={formData.category}
                            onChange={(value: string) => handleChange("category", value)}
                            error={!!errors?.category}
                        // hint={formErrors?.category}
                        />
                        {errors.category && <p className="text-sm text-error-500 mt-1">{errors.category}</p>}
                    </div>

                    <div>
                        <Label htmlFor="price">Exam name</Label>
                        <Input
                            type="text"
                            placeholder="Enter exam name"
                            value={formData.examName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleChange("examName", e.target.value)
                            }
                            error={!!errors?.examName}
                        // hint={formErrors?.examName}
                        />
                        {errors.examName && <p className="text-sm text-error-500 mt-1">{errors.examName}</p>}
                    </div>

                    <div className="flex flex-wrap items-center gap-8">
                        <Radio
                            id="radio1"
                            name="status"
                            value="Active"
                            checked={formData.status === "Active"}
                            onChange={handleRadioChange}
                            label="Active"
                        />
                        <Radio
                            id="radio2"
                            name="status"
                            value="Inactive"
                            checked={formData.status === "Inactive"}
                            onChange={handleRadioChange}
                            label="Inactive"
                        />
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="price">Country name</Label>
                        <Input
                            type="text"
                            placeholder="Enter country"
                            value={formData.country}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleChange("country", e.target.value)
                            }
                            error={!!errors?.country}
                        // hint={formErrors?.examName}
                        />
                        {errors.country && <p className="text-sm text-error-500 mt-1">{errors.country}</p>}
                    </div>
                    <div>
                        <Label>Title</Label>
                        <Input
                            type="text"
                            placeholder="Enter Title"
                            value={formData.title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleChange("title", e.target.value)
                            }
                            error={!!errors?.title}
                        />
                        {errors.title && <p className="text-sm text-error-500 mt-1">{errors.title}</p>}
                    </div>
                </div>

                {/* Exam Detail Steps */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <Label>Exam Detail Steps</Label>
                        <button
                            type="button"
                            onClick={addStep}
                            className="bg-[#ffcb07] text-black w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#ffcb07]  transition-colors duration-200"
                        >
                            <FaPlus />
                        </button>
                    </div>

                    {/* Inputs in 2-column layout same as Exam Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {formData.examSteps.map((step, index) => (
                            <div key={index} className="relative">
                                <Input
                                    type="text"
                                    placeholder={`Exam detail step ${index + 1}`}
                                    value={step}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleStepChange(index, e.target.value)
                                    }
                                    error={!!errors?.[`examSteps[${index}]`]}
                                // hint={formErrors?.[`examSteps[${index}]`]
                                />
                                {errors[`examSteps[${index}]`] && (
                                    <p className="text-sm text-error-500 mt-1">
                                        {errors[`examSteps[${index}]`]}
                                    </p>
                                )}
                                {formData.examSteps.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeStep(index)}
                                        className="absolute right-3 top-[22px] transform -translate-y-1/2 border border-[#ffcb07] text-[#ffcb07] w-8 h-8 rounded-md flex items-center justify-center hover:bg-[#ffcb07] hover:text-black transition-colors duration-200"
                                    >
                                        <FaMinus />
                                    </button>

                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label>Description</Label>
                        <Editor
                            style={{ height: "320px" }}
                            value={formData.description}
                            onTextChange={(e) => {
                                handleChange("description", e.htmlValue ?? "");
                            }}
                        />
                        {errors.description && <p className="text-sm text-error-500 mt-1">{errors.description}</p>}
                    </div>
                    <div>
                        <Label>Select Image</Label>
                        <DropzoneComponent
                            preview={preview}
                            setPreview={setPreview}
                            onFileSelect={(file: File) => setMainImage(file)}
                        />
                    </div>
                </div>
            </ComponentCard>

            {/* ENROLL SECTION */}
            <div>
                <EnrollSection
                    data={enrollData}
                    onChange={(data) => setEnrollData(data)}
                    preview={enrollPreview}
                    setPreview={setEnrollPreview}
                    errors={{
                        title: errors["enrollData.title"],
                        description: errors["enrollData.description"]
                    }}
                />
            </div>

            {/* PLAN SECTION */}
            <div className="grid grid-cols-2 gap-6">

                {formData.plans.map((plan, index) => (
                    <PlanSection
                        key={index}
                        data={plan}
                        onChange={(updated: PlanData) => handlePlanChange(index, updated)}
                        onPopularChange={() => handlePopularChange(index)}
                        // errors={formErrors?.[`plans[${index}]`] || {}}
                        errors={{
                            planMonth: errors[`plans[${index}].planMonth`],
                            planPriceUSD: errors[`plans[${index}].planPriceUSD`],
                            planPriceINR: errors[`plans[${index}].planPriceINR`],
                            planType: errors[`plans[${index}].planType`],
                            ...Object.fromEntries(
                                Object.entries(errors).filter(([key]) =>
                                    key.startsWith(`plans[${index}].planSubtitles`)
                                )
                            )
                        }}
                    />
                ))}
            </div>

            <div className="flex items-center gap-5">
                <Button size="sm" variant="primary" onClick={handleSave} >
                    Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => router.push("/medicalexamlist")}>
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default MedicalExam;
