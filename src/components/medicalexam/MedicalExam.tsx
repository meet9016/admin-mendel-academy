"use client";
import React, { useState } from "react";
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

interface PlanData {
    planDay: string
    planPrice: string
    planType: string
    planSubtitles: string[]
    isPopular: boolean
}
interface FormData {
    country: string;
    status: string;
    category: string;
    examName: string;
    examSteps: string[];
    description: string;
    plans: PlanData[];
}

const MedicalExam = () => {
    const router = useRouter()
    const categoryOptions = [
        { value: "USMLE Program", label: "USMLE Program" },
        { value: "International Exams", label: "International Exams" },
    ];

    const [formErrors, setFormErrors] = useState<Record<string, string> | null>(null);


    //  Main single state
    const [formData, setFormData] = useState<FormData>({
        country: "",
        status: "Active",
        category: "",
        examName: "",
        examSteps: [""],
        description: "",
        plans: [
            { planDay: "", planPrice: "", planType: "", planSubtitles: [""], isPopular: false },
            { planDay: "", planPrice: "", planType: "", planSubtitles: [""], isPopular: false },
            { planDay: "", planPrice: "", planType: "", planSubtitles: [""], isPopular: false },
            { planDay: "", planPrice: "", planType: "", planSubtitles: [""], isPopular: false },
        ],
    });



    //  Handle updates to any field in formData
    const handleChange = (field: keyof FormData, value: any) => {
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



    const handleSave = async () => {
        try {
            const body = {
                category_name: formData.category,
                exams: [
                    {
                        exam_name: formData.examName,
                        country: formData.country,
                        status: formData?.status,
                        sub_titles: formData.examSteps,
                        description: formData.description,
                    },
                ],
                choose_plan_list: formData.plans
                    .filter(plan => plan.planDay && plan.planPrice && plan.planType)
                    .map(plan => ({
                        plan_pricing: plan.planPrice,
                        plan_day: Number(plan.planDay),
                        plan_type: plan.planType,
                        plan_sub_title: plan.planSubtitles,
                        most_popular: plan.isPopular,
                    })),
            };

            console.log("Final Body:", body);

            const res = await api.post(`${endPointApi.createExamList}`, body);

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            onChange={(e: any) => handleChange("examName", e.target.value)}
                            error={!!formErrors?.examName}
                            hint={formErrors?.examName}
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
                            onChange={(e: any) => handleChange("country", e.target.value)}
                        // error={!!formErrors?.examName}
                        // hint={formErrors?.examName}
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
                                    onChange={(e: any) => handleStepChange(index, e.target.value)}
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
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <Editor
                            style={{ height: "320px" }}
                            value={formData.description}
                            onTextChange={(e) => {
                                handleChange("description", e.htmlValue);
                                setFormErrors((prev) => ({ ...prev, description: "" }));
                            }}
                        />
                        {formErrors?.description && (
                            <p className="text-red-500 text-sm">{formErrors.description}</p>
                        )}
                    </div>
                </div>
            </ComponentCard>




            {/* PLAN SECTION */}
            <div className="grid grid-cols-2 gap-6">
                
                {formData.plans.map((plan, index) => (
                    <PlanSection
                        key={index}
                        data={plan as any}
                        onChange={(updated) => handlePlanChange(index, updated as any)}
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
