"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Label from "../form/Label";
import ComponentCard from "../common/ComponentCard";
import Input from "../form/input/InputField";
import { FaPlus, FaMinus } from "react-icons/fa6";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("primereact/editor").then((m) => m.Editor), { ssr: false });
import Select from "../form/Select";
import Button from "../ui/button/Button";
import { useRouter } from "next/navigation";
import PlanSection from "./PlanSection";
import Radio from "../form/input/Radio";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import DropzoneComponent from "../blogs/DropZone";
import EnrollSection from "./EnrollSection";
import { decodeHtml, generateSlug } from "@/utils/helper";
import { examListSchema } from "@/ValidationSchema/validationSchema";
import { toast } from "react-toastify";
import { MedicalExamSkeleton } from "../skeltons/Skeltons";

interface PlanData {
    id: number | string;
    planMonth: number | string;
    planPriceUSD: number | string;
    planPriceINR: number | string;
    planType: string;
    planSubtitles: string[];
    isPopular: boolean;
}

interface RapidLearningTool {
    id: number | string;
    toolType: string;
    priceUSD: number | string;
    priceINR: number | string;
}

interface FormData {
    country: string;
    status: string;
    category: string;
    examName: string;
    slug: string;
    title: string;
    examSteps: string[];
    description: string;
    plans: PlanData[];
    rapidLearningTools: RapidLearningTool[];
}

const MedicalExam = () => {
    const router = useRouter();
    const [id, setId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

    const rapidLearningToolOptions = [
        { value: "mendel chitras", label: "Mendel Chitras" },
        { value: "mendel anki flashcards", label: "Mendel Anki Flashcards" },
        { value: "mendel rapid recall", label: "Mendel Rapid Recall" },
        { value: "mendel memory hacks", label: "Mendel Memory Hacks" },
        { value: "mendel library", label: "Mendel Library" },
    ];

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [preview, setPreview] = useState<string | null>(null);
    const [previewWho, setPreviewWho] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        country: "",
        status: "Active",
        category: "",
        examName: "",
        slug: "",
        title: "",
        examSteps: [""],
        description: "",
        plans: [
            { id: "", planMonth: "", planPriceUSD: "", planPriceINR: "", planType: "", planSubtitles: [""], isPopular: false },
        ],
        rapidLearningTools: [],
    });

    const [enrollData, setEnrollData] = useState({
        title: "",
        description: "",
        image: null as File | null,
    });
    
    const [enrollPreview, setEnrollPreview] = useState<string | null>(null);
    const [mainImage, setMainImage] = useState<File | null>(null);
    const descriptionRef = useRef<string>("");
    const enrollDescriptionRef = useRef<string>("");

    useEffect(() => {
        descriptionRef.current = formData.description;
    }, [formData.description]);

    useEffect(() => {
        enrollDescriptionRef.current = enrollData.description;
    }, [enrollData.description]);

    const handleChange = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
        setFormData((prev) => {
            if (prev[field] === value) return prev;
            
            const newData = { ...prev, [field]: value };
            
            // Auto-generate slug from examName if in create mode or slug is empty
            if (field === "examName" && (!id || !prev.slug)) {
                newData.slug = generateSlug(value as string);
            }
            
            return newData;
        });
        setErrors((prev) => ({ ...prev, [field]: "" }));
    }, [id]);

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

    const addPlan = () => {
        if (formData.plans.length < 8) {
            const newPlan: PlanData = {
                id: "",
                planMonth: "",
                planPriceUSD: "",
                planPriceINR: "",
                planType: "",
                planSubtitles: [""],
                isPopular: false
            };
            handleChange("plans", [...formData.plans, newPlan]);
        }
    };

    const removePlan = (index: number) => {
        if (formData.plans.length > 1) {
            const updatedPlans = formData.plans.filter((_, i) => i !== index);
            handleChange("plans", updatedPlans);
        }
    };

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

    const addRapidTool = () => {
        if (formData.rapidLearningTools.length < 5) {
            const newTool: RapidLearningTool = {
                id: "",
                toolType: "",
                priceUSD: "",
                priceINR: ""
            };
            handleChange("rapidLearningTools", [...formData.rapidLearningTools, newTool]);
        }
    };

    const removeRapidTool = (index: number) => {
        const updatedTools = formData.rapidLearningTools.filter((_, i) => i !== index);
        handleChange("rapidLearningTools", updatedTools);
    };

    const handleRapidToolChange = (index: number, field: keyof RapidLearningTool, value: string | number) => {
        const updatedTools = [...formData.rapidLearningTools];
        updatedTools[index] = { ...updatedTools[index], [field]: value };
        handleChange("rapidLearningTools", updatedTools);
        setErrors((prev) => ({
            ...prev,
            [`rapidLearningTools[${index}].${field}`]: "",
        }));
    };

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
                if (id) {
                    const res = await api.get(`${endPointApi.getByIdExamList}/${id}`);
                    const data = res.data || {};
                    const decodedDescription = decodeHtml(data.exams[0].description ?? "");

                    descriptionRef.current = decodedDescription;
                    const enrollDesc = data?.who_can_enroll_description ?? "";
                    enrollDescriptionRef.current = enrollDesc;

                    setFormData({
                        ...(id && { id: data.exams[0]._id ?? "" }),
                        category: data?.category_name ?? "",
                        country: data.exams[0].country ?? "",
                        status: data.exams[0].status ?? "Active",
                    examName: data.exams[0].exam_name ?? "",
                    slug: data.exams[0].slug ?? "",
                    title: data.exams[0].title ?? "",
                        examSteps:
                            data.exams[0].sub_titles && data.exams[0].sub_titles.length > 0
                                ? data.exams[0].sub_titles
                                : [""],
                        description: decodedDescription,
                        plans: (() => {
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
                                    : [{
                                        id: "",
                                        planMonth: "",
                                        planPriceUSD: "",
                                        planPriceINR: "",
                                        planType: "",
                                        planSubtitles: [""],
                                        isPopular: false,
                                    }];

                            return existingPlans;
                        })(),
                        rapidLearningTools: (() => {
                            const existingTools =
                                data.rapid_learning_tools && data.rapid_learning_tools.length > 0
                                    ? data.rapid_learning_tools.map((tool: any) => ({
                                        id: tool._id,
                                        toolType: tool.tool_type ?? "",
                                        priceUSD: tool.price_usd ?? "",
                                        priceINR: tool.price_inr ?? ""
                                    }))
                                    : [];
                            return existingTools;
                        })(),
                    });

                    setPreview(data?.exams[0]?.image)
                    setEnrollData({
                        title: data?.who_can_enroll_title ?? "",
                        description: enrollDesc,
                        image: null,
                    });
                    
                    if (data?.who_can_enroll_image) {
                        setEnrollPreview(data.who_can_enroll_image);
                    }
                } else {
                    // Create mode - initialize empty form
                    setFormData({
                        country: "",
                        status: "Active",
                        category: "",
                        examName: "",
                        title: "",
                        examSteps: [""],
                        description: "",
                        plans: [
                            { id: "", planMonth: "", planPriceUSD: "", planPriceINR: "", planType: "", planSubtitles: [""], isPopular: false },
                        ],
                        rapidLearningTools: [],
                    });
                    
                    setEnrollData({
                        title: "",
                        description: "",
                        image: null,
                    });
                }
            } catch (err) {
                console.error("Error fetching data by ID:", err);
                toast.error("Failed to load data");
            } finally {
                // Minimum loading time for better UX
                setTimeout(() => {
                    setIsLoading(false);
                }, 300);
            }
        };

        fetchById();
    }, [id]);

    const handleSave = async () => {
        const isValid = await validate();
        if (!isValid) return;
        
        try {
            const formDataToSend = new FormData();
            if (id) {
                formDataToSend.append("exams[0][_id]", formData.id || id);
            }
            formDataToSend.append("category_name", formData.category);
            formDataToSend.append("exams[0][exam_name]", formData.examName);
            formDataToSend.append("exams[0][slug]", formData.slug);
            formDataToSend.append("exams[0][country]", formData.country);
            formDataToSend.append("exams[0][status]", formData.status);
            formDataToSend.append("exams[0][title]", formData.title);
            formDataToSend.append("exams[0][description]", formData.description);
            formData.examSteps.forEach((step, i) => {
                formDataToSend.append(`exams[0][sub_titles][${i}]`, step);
            });

            formData.plans.forEach((plan, i) => {
                if ((plan.planMonth && plan.planType) || plan.planMonth === "Custom") {
                    if (plan?.id !== undefined && plan?.id !== null && plan.id !== "" && id) {
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

            const hasValidTools = formData.rapidLearningTools.some(tool => 
                tool.toolType && (tool.priceUSD || tool.priceINR)
            );
            
            if (hasValidTools) {
                formData.rapidLearningTools.forEach((tool, i) => {
                    if (tool.toolType && (tool.priceUSD || tool.priceINR)) {
                        if (tool?.id !== undefined && tool?.id !== null && tool.id !== "" && id) {
                            formDataToSend.append(`rapid_learning_tools[${i}][_id]`, String(tool.id));
                        }
                        formDataToSend.append(`rapid_learning_tools[${i}][tool_type]`, tool.toolType);
                        formDataToSend.append(`rapid_learning_tools[${i}][price_usd]`, String(tool.priceUSD));
                        formDataToSend.append(`rapid_learning_tools[${i}][price_inr]`, String(tool.priceINR));
                    }
                });
            } else if (id) {
                formDataToSend.append('rapid_learning_tools', JSON.stringify([]));
            }

            formDataToSend.append("who_can_enroll_title", enrollData.title);
            formDataToSend.append("who_can_enroll_description", enrollData.description);
            if (enrollData.image) {
                formDataToSend.append("who_can_enroll_image", enrollData.image);
            }

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

    // Show skeleton while loading
    if (isLoading) {
        return <MedicalExamSkeleton />;
    }

    return (
        <div className="space-y-6">
            <ComponentCard title={id ? "Edit Medical Exam" : "Add Medical Exam"} name="">
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
                        />
                        {errors.examName && <p className="text-sm text-error-500 mt-1">{errors.examName}</p>}
                    </div>

                    <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            type="text"
                            placeholder="Slug (auto-generated)"
                            value={formData.slug}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleChange("slug", e.target.value)
                            }
                            error={!!errors?.slug}
                        />
                        {errors.slug && <p className="text-sm text-error-500 mt-1">{errors.slug}</p>}
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
                                const newValue = e.htmlValue ?? "";
                                if (newValue !== descriptionRef.current) {
                                    descriptionRef.current = newValue;
                                    handleChange("description", newValue);
                                }
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
                    descriptionRef={enrollDescriptionRef}
                    errors={{
                        title: errors["enrollData.title"],
                        description: errors["enrollData.description"]
                    }}
                />
            </div>

            {/* PLAN SECTION */}
            <ComponentCard 
                title="Plans" 
                name=""
                action={
                    formData.plans.length < 8 ? (
                        <button
                            type="button"
                            onClick={addPlan}
                            className="bg-[#ffcb07] text-black px-4 py-2 flex items-center gap-2 rounded-md hover:bg-[#ffcb07] transition-colors duration-200"
                        >
                            <FaPlus /> Add Plan
                        </button>
                    ) : undefined
                }
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {formData.plans.map((plan, index) => {
                        const selectedDays = formData.plans
                            .filter((_, i) => i !== index)
                            .map(p => String(p.planMonth));
                        
                        const selectedTypes = formData.plans
                            .filter((_, i) => i !== index)
                            .map(p => p.planType);
                        
                        return (
                            <div key={index} className="relative">
                                <PlanSection
                                    data={plan}
                                    onChange={(updated: PlanData) => handlePlanChange(index, updated)}
                                    onPopularChange={() => handlePopularChange(index)}
                                    selectedDays={selectedDays}
                                    selectedTypes={selectedTypes}
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
                                {formData.plans.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removePlan(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                                    >
                                        <FaMinus />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </ComponentCard>

            {/* RAPID LEARNING TOOLS SECTION */}
            <ComponentCard 
                title="Rapid Learning Tools" 
                name=""
                action={
                    formData.rapidLearningTools.length < 5 ? (
                        <button
                            type="button"
                            onClick={addRapidTool}
                            className="bg-[#ffcb07] text-black px-4 py-2 flex items-center gap-2 rounded-md hover:bg-[#ffcb07] transition-colors duration-200"
                        >
                            <FaPlus /> Add Tool
                        </button>
                    ) : undefined
                }
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {formData.rapidLearningTools.map((tool, index) => {
                        const selectedToolTypes = formData.rapidLearningTools
                            .filter((_, i) => i !== index)
                            .map(t => t.toolType);
                        
                        const availableToolOptions = rapidLearningToolOptions.filter(
                            option => !selectedToolTypes.includes(option.value) || option.value === tool.toolType
                        );
                        
                        return (
                            <div key={index} className="relative border border-gray-200 rounded-lg p-4">
                                <div className="space-y-4">
                                    <div>
                                        <Label>Tool Type</Label>
                                        <Select
                                            options={availableToolOptions}
                                            placeholder="Select tool type"
                                            value={tool.toolType}
                                            onChange={(value: string) => handleRapidToolChange(index, 'toolType', value)}
                                            error={!!errors?.[`rapidLearningTools[${index}].toolType`]}
                                        />
                                        {errors[`rapidLearningTools[${index}].toolType`] && (
                                            <p className="text-sm text-error-500 mt-1">
                                                {errors[`rapidLearningTools[${index}].toolType`]}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Plan Price (USD) $</Label>
                                            <Input
                                                type="number"
                                                placeholder="Enter USD price"
                                                value={tool.priceUSD}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleRapidToolChange(index, 'priceUSD', e.target.value)
                                                }
                                                error={!!errors?.[`rapidLearningTools[${index}].priceUSD`]}
                                            />
                                            {errors[`rapidLearningTools[${index}].priceUSD`] && (
                                                <p className="text-sm text-error-500 mt-1">
                                                    {errors[`rapidLearningTools[${index}].priceUSD`]}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <Label>Plan Price (INR) ₹</Label>
                                            <Input
                                                type="number"
                                                placeholder="Enter INR price"
                                                value={tool.priceINR}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleRapidToolChange(index, 'priceINR', e.target.value)
                                                }
                                                error={!!errors?.[`rapidLearningTools[${index}].priceINR`]}
                                            />
                                            {errors[`rapidLearningTools[${index}].priceINR`] && (
                                                <p className="text-sm text-error-500 mt-1">
                                                    {errors[`rapidLearningTools[${index}].priceINR`]}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={() => removeRapidTool(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                                >
                                    <FaMinus />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </ComponentCard>

            <div className="flex items-center gap-5">
                <Button size="sm" variant="primary" onClick={handleSave}>
                    {id ? "Update" : "Save"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => router.push("/medicalexamlist")}>
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default MedicalExam;