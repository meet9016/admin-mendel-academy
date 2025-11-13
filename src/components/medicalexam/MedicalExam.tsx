"use client";
import React, { useEffect, useState } from "react";
import Label from "../form/Label";
import ComponentCard from "../common/ComponentCard";
import Input from "../form/input/InputField";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { Editor } from "primereact/editor";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import { useRouter, useSearchParams } from "next/navigation";
import PlanSection from "./PlanSection";
import Radio from "../form/input/Radio";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import DropzoneComponent from "../blogs/DropZone";
import EnrollSection from "./EnrollSection";
import { decodeHtml } from "@/utils/helper";

interface PlanData {
    planDay: number | string;
    planPrice: string;
    planType: string;
    planSubtitles: string[];
    isPopular: boolean;
}

interface FormData {
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
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const categoryOptions = [
        { value: "USMLE Program", label: "USMLE Program" },
        { value: "International Exams", label: "International Exams" },
    ];

    const [formErrors, setFormErrors] = useState<Record<string, string> | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [previewWho, setPreviewWho] = useState<string | null>(null);
    console.log("preview", preview);


    //  Main single state
    const [formData, setFormData] = useState<FormData>({
        country: "",
        status: "Active",
        category: "",
        examName: "",
        title: "",
        examSteps: [""],
        description: "",
        plans: [
            { planDay: "", planPrice: "", planType: "", planSubtitles: [""], isPopular: false },
            { planDay: "", planPrice: "", planType: "", planSubtitles: [""], isPopular: false },
            { planDay: "", planPrice: "", planType: "", planSubtitles: [""], isPopular: false },
            { planDay: "", planPrice: "", planType: "", planSubtitles: [""], isPopular: false },
        ],
    });

    const [enrollData, setEnrollData] = useState({
        title: "",
        description: "",
        image: null as File | null,
    });
    const [mainImage, setMainImage] = useState<File | null>(null);

    //  Handle updates to any field in formData
    const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setFormErrors((prev) => ({ ...prev, [field]: "" }));
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
        setFormErrors((prev) => ({
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


    //  Validate and Submit
    // const handleSave = async () => {
    //     try {
    //         const valid = await FormSchema.validate(formData, { abortEarly: false });
    //         setFormErrors(null);
    //         console.log(" Validated Data:", valid);
    //     } catch (err: any) {
    //         const formatted: Record<string, string> = {};
    //         if (err.inner && err.inner.length) {
    //             err.inner.forEach((e: any) => {
    //                 if (e.path) formatted[e.path] = e.message;
    //             });
    //         } else if (err.path) {
    //             formatted[err.path] = err.message;
    //         }
    //         setFormErrors(formatted);
    //         console.log(" Validation Errors:", formatted);
    //     }
    // };

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
                        // 🧩 Map existing plans (if any)
                        const existingPlans =
                            data.choose_plan_list && data.choose_plan_list.length > 0
                                ? data.choose_plan_list.map((plan: any) => ({
                                    planDay: plan.plan_day ?? "",
                                    planPrice: plan.plan_pricing ?? "",
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
                            planDay: "",
                            planPrice: "",
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
                    image: data?.who_can_enroll_image ?? "",
                });
                setPreviewWho(data?.who_can_enroll_image)
            } catch (err) {
                console.error("Error fetching data by ID:", err);
            }
        };

        fetchById();
    }, [id]);

    const handleSave = async () => {
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
            formDataToSend.append("exams[0][title]", formData.examName);
            formDataToSend.append("exams[0][description]", formData.description);
            formData.examSteps.forEach((step, i) => {
                formDataToSend.append(`exams[0][sub_titles][${i}]`, step);
            });

            // Choose Plan List
            formData.plans.forEach((plan, i) => {
                // if (plan.planPrice && plan.planDay && plan.planType) {
                if ((plan.planDay && plan.planType) || plan.planDay === "Custom") {
                    if(id){
                        formDataToSend.append(`choose_plan_list[${i}][_id]`, plan.id);
                    }
                    formDataToSend.append(`choose_plan_list[${i}][plan_pricing]`, plan.planPrice);
                    formDataToSend.append(`choose_plan_list[${i}][plan_day]`, plan.planDay.toString());
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
            } else {
                res = await api.post(`${endPointApi.createExamList}`, formDataToSend);
            }

            if (res.data) {
                router.push('/medicalexamlist')
            } else {
                console.log("API Failed");
            }
        } catch (err) {
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
                            error={!!formErrors?.category}
                            hint={formErrors?.category}
                        />
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
                            error={!!formErrors?.examName}
                            hint={formErrors?.examName}
                        />
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
                        // error={!!formErrors?.examName}
                        // hint={formErrors?.examName}
                        />
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
                        />
                    </div>
                </div>

                {/* Exam Detail Steps */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <Label>Exam Detail Steps</Label>
                        <button
                            type="button"
                            onClick={addStep}
                            className="bg-[#ffcb07] text-white w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#ffcb07] transition-colors duration-200"
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
                                    error={!!formErrors?.[`examSteps[${index}]`]}
                                    hint={formErrors?.[`examSteps[${index}]`]}

                                />
                                {formData.examSteps.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeStep(index)}
                                        className="absolute right-3 top-[22px] transform -translate-y-1/2 border border-[#ffcb07] text-[#ffcb07] w-8 h-8 rounded-md flex items-center justify-center hover:bg-[#ffcb07] hover:text-white transition-colors duration-200"
                                    >
                                        <FaMinus />
                                    </button>

                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="grid grid-cols-1 gap-3">
                    <Label>Description</Label>
                    <div>
                        <Editor
                            style={{ height: "320px" }}
                            value={formData.description}
                            onTextChange={(e) => {
                                handleChange("description", e.htmlValue ?? "");
                                setFormErrors((prev) => ({ ...prev, description: "" }));
                            }}
                        />
                        {formErrors?.description && (
                            <p className="text-red-500 text-sm">{formErrors.description}</p>
                        )}
                    </div>
                </div>
                <DropzoneComponent
                    preview={preview}
                    setPreview={setPreview}
                    onFileSelect={(file: File) => setMainImage(file)}
                />
            </ComponentCard>

            {/* ENROLL SECTION */}
            <div>
                <EnrollSection
                    data={enrollData}
                    onChange={(data) => setEnrollData(data)}
                    previewWho={previewWho}
                    setPreviewWho={setPreviewWho}
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
