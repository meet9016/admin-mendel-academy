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
    planTitle: string;
    planSubtitles: string[];
    isPopular: boolean;
}

interface RapidLearningTool {
    id: number | string;
    toolType: string;
    priceUSD: number | string;
    priceINR: number | string;
}

interface EliteMentorshipService {
    id: number | string;
    name: string;
    subtitle: string;
    priceUSD: number | string;
    priceINR: number | string;
}

interface TsunamiData {
    name: string;
    includedServicePriceUSD: number | string;
    includedServicePriceINR: number | string;
    includedServices: string;
    description: string;
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
    mainTitle: string;
    planSectionTitle: string;
    mentorshipTsunamiSectionTitle: string;
    rapidToolsSectionTitle: string;
    isPlanVisible: boolean;
    isRapidToolsVisible: boolean;
    plans: PlanData[];
    rapidLearningTools: RapidLearningTool[];
    eliteMentorship: EliteMentorshipService[];
    tsunami: TsunamiData;
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
        mainTitle: "",
        planSectionTitle: "",
        mentorshipTsunamiSectionTitle: "",
        rapidToolsSectionTitle: "",
        isPlanVisible: true,
        isRapidToolsVisible: true,
        plans: [
            { id: "", planMonth: "", planPriceUSD: "", planPriceINR: "", planType: "", planTitle: "", planSubtitles: [""], isPopular: false },
        ],
        rapidLearningTools: [],
        eliteMentorship: [],
        tsunami: {
            name: "",
            includedServicePriceUSD: "",
            includedServicePriceINR: "",
            includedServices: "",
            description: "",
        },
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
                planTitle: "",
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

    const addEliteMentorshipService = () => {
        if (formData.eliteMentorship.length < 10) {
            const newService: EliteMentorshipService = {
                id: "",
                name: "",
                subtitle: "",
                priceUSD: "",
                priceINR: ""
            };
            handleChange("eliteMentorship", [...formData.eliteMentorship, newService]);
        }
    };

    const removeEliteMentorshipService = (index: number) => {
        const updatedServices = formData.eliteMentorship.filter((_, i) => i !== index);
        handleChange("eliteMentorship", updatedServices);
    };

    const handleEliteMentorshipChange = (index: number, field: keyof EliteMentorshipService, value: string | number) => {
        const updatedServices = [...formData.eliteMentorship];
        updatedServices[index] = { ...updatedServices[index], [field]: value };
        handleChange("eliteMentorship", updatedServices);
        setErrors((prev) => ({
            ...prev,
            [`eliteMentorship[${index}].${field}`]: "",
        }));
    };

    const handleTsunamiChange = (field: keyof TsunamiData, value: string | number) => {
        handleChange("tsunami", { ...formData.tsunami, [field]: value });
        setErrors((prev) => ({
            ...prev,
            [`tsunami.${field}`]: "",
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
                mainTitle: formData.mainTitle,
                eliteMentorship: formData.eliteMentorship,
                tsunami: formData.tsunami,
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
                        mainTitle: data.exams[0].main_title ?? "",
                        planSectionTitle: data?.plan_section_title ?? "",
                        mentorshipTsunamiSectionTitle: data?.mentorship_tsunami_section_title ?? "",
                        rapidToolsSectionTitle: data?.rapid_tools_section_title ?? "",
                        isPlanVisible: data?.is_plan_visible ?? true,
                        isRapidToolsVisible: data?.is_rapid_tools_visible ?? true,
                        plans: (() => {
                            const existingPlans =
                                data.choose_plan_list && data.choose_plan_list.length > 0
                                    ? data.choose_plan_list.map((plan: any) => ({
                                        planMonth: plan.plan_month ?? "",
                                        planPriceUSD: plan.plan_pricing_dollar ?? "",
                                        planPriceINR: plan.plan_pricing_inr ?? "",
                                        planType: plan.plan_type ?? "",
                                        planTitle: plan.plan_title ?? "",
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
                                        planTitle: "",
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
                        eliteMentorship: (() => {
                            const existingServices =
                                data.elite_mentorship && data.elite_mentorship.length > 0
                                    ? data.elite_mentorship.map((service: any) => ({
                                        id: service._id,
                                        name: service.name ?? "",
                                        subtitle: service.subtitle ?? "",
                                        priceUSD: service.price_usd ?? "",
                                        priceINR: service.price_inr ?? ""
                                    }))
                                    : [];
                            return existingServices;
                        })(),
                        tsunami: (() => {
                            const existingTsunami = data.tsunami || {};
                            return {
                                name: existingTsunami.name ?? "",
                                includedServicePriceUSD: existingTsunami.included_service_price_usd ?? "",
                                includedServicePriceINR: existingTsunami.included_service_price_inr ?? "",
                                includedServices: existingTsunami.included_services ?? "",
                                description: existingTsunami.description ?? "",
                            };
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
                        slug: "",
                        title: "",
                        examSteps: [""],
                        description: "",
                        mainTitle: "",
                        planSectionTitle: "",
                        mentorshipTsunamiSectionTitle: "",
                        rapidToolsSectionTitle: "",
                        isPlanVisible: true,
                        isRapidToolsVisible: true,
                        plans: [
                            { id: "", planMonth: "", planPriceUSD: "", planPriceINR: "", planType: "", planTitle: "", planSubtitles: [""], isPopular: false },
                        ],
                        rapidLearningTools: [],
                        eliteMentorship: [],
                        tsunami: {
                            name: "",
                            includedServicePriceUSD: "",
                            includedServicePriceINR: "",
                            includedServices: "",
                            description: "",
                        },
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

            formDataToSend.append("plan_section_title", formData.planSectionTitle);
            formDataToSend.append("mentorship_tsunami_section_title", formData.mentorshipTsunamiSectionTitle);
            formDataToSend.append("rapid_tools_section_title", formData.rapidToolsSectionTitle);

            formData.plans.forEach((plan, i) => {
                if ((plan.planMonth && plan.planType) || plan.planMonth === "Custom") {
                    if (plan?.id !== undefined && plan?.id !== null && plan.id !== "" && id) {
                        formDataToSend.append(`choose_plan_list[${i}][_id]`, String(plan.id));
                    }

                    formDataToSend.append(`choose_plan_list[${i}][plan_pricing_dollar]`, plan.planPriceUSD);
                    formDataToSend.append(`choose_plan_list[${i}][plan_pricing_inr]`, plan.planPriceINR);
                    formDataToSend.append(`choose_plan_list[${i}][plan_month]`, plan.planMonth.toString());
                    formDataToSend.append(`choose_plan_list[${i}][plan_type]`, plan.planType);
                    formDataToSend.append(`choose_plan_list[${i}][plan_title]`, plan.planTitle ?? "");
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

            const hasValidMentorship = formData.eliteMentorship.some(service =>
                service.name && (service.priceUSD || service.priceINR)
            );

            if (hasValidMentorship) {
                formData.eliteMentorship.forEach((service, i) => {
                    if (service.name && (service.priceUSD || service.priceINR)) {
                        if (service?.id !== undefined && service?.id !== null && service.id !== "" && id) {
                            formDataToSend.append(`elite_mentorship[${i}][_id]`, String(service.id));
                        }
                        formDataToSend.append(`elite_mentorship[${i}][name]`, service.name);
                        formDataToSend.append(`elite_mentorship[${i}][subtitle]`, service.subtitle ?? "");
                        formDataToSend.append(`elite_mentorship[${i}][price_usd]`, String(service.priceUSD));
                        formDataToSend.append(`elite_mentorship[${i}][price_inr]`, String(service.priceINR));
                    }
                });
            } else if (id) {
                formDataToSend.append('elite_mentorship', JSON.stringify([]));
            }

            const hasValidTsunami = formData.tsunami.name || formData.tsunami.includedServicePriceUSD || formData.tsunami.includedServicePriceINR || formData.tsunami.includedServices || formData.tsunami.description;

            if (hasValidTsunami) {
                formDataToSend.append(`tsunami[name]`, formData.tsunami.name);
                formDataToSend.append(`tsunami[included_service_price_usd]`, String(formData.tsunami.includedServicePriceUSD));
                formDataToSend.append(`tsunami[included_service_price_inr]`, String(formData.tsunami.includedServicePriceINR));
                formDataToSend.append(`tsunami[included_services]`, formData.tsunami.includedServices);
                formDataToSend.append(`tsunami[description]`, formData.tsunami.description);
            }

            formDataToSend.append("who_can_enroll_title", enrollData.title);
            formDataToSend.append("who_can_enroll_description", enrollData.description);
            if (enrollData.image) {
                formDataToSend.append("who_can_enroll_image", enrollData.image);
            }

            // Add visibility flags
            formDataToSend.append("is_plan_visible", String(formData.isPlanVisible));
            formDataToSend.append("is_rapid_tools_visible", String(formData.isRapidToolsVisible));

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
                    <div className="flex items-center gap-4">
                        {/* Toggle Switch for Plan Visibility */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{formData.isPlanVisible ? 'Visible' : 'Hidden'}</span>
                            <button
                                type="button"
                                onClick={() => handleChange('isPlanVisible', !formData.isPlanVisible)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    formData.isPlanVisible ? 'bg-[#ffcb07]' : 'bg-gray-300'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        formData.isPlanVisible ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                        
                        {formData.plans.length < 8 ? (
                            <button
                                type="button"
                                onClick={addPlan}
                                className="bg-[#ffcb07] text-black px-4 py-2 flex items-center gap-2 rounded-md hover:bg-[#ffcb07] transition-colors duration-200"
                            >
                                <FaPlus /> Add Plan
                            </button>
                        ) : undefined}
                    </div>
                }
            >
                <div className="mb-6">
                    <Label>Plan Section Title</Label>
                    <Input
                        type="text"
                        placeholder="Enter custom title for plans section"
                        value={formData.planSectionTitle}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange("planSectionTitle", e.target.value)
                        }
                    />
                </div>
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

            {/* ELITE MENTORSHIP SECTION */}
            <ComponentCard
                title="Elite Mentorship"
                name=""
                action={
                    formData.eliteMentorship.length < 10 ? (
                        <button
                            type="button"
                            onClick={addEliteMentorshipService}
                            className="bg-[#ffcb07] text-black px-4 py-2 flex items-center gap-2 rounded-md hover:bg-[#ffcb07] transition-colors duration-200"
                        >
                            <FaPlus /> Add Service
                        </button>
                    ) : undefined
                }
            >
                <div className="mb-6">
                    <Label>Mentorship & Tsunami Section Title</Label>
                    <Input
                        type="text"
                        placeholder="Enter custom title for mentorship & tsunami section"
                        value={formData.mentorshipTsunamiSectionTitle}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange("mentorshipTsunamiSectionTitle", e.target.value)
                        }
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {formData.eliteMentorship.map((service, index) => (
                        <div key={index} className="relative border border-gray-200 rounded-lg p-4">
                            <div className="space-y-4">
                                <div>
                                    <Label>Course Name</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter course name"
                                        value={service.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handleEliteMentorshipChange(index, 'name', e.target.value)
                                        }
                                        error={!!errors?.[`eliteMentorship[${index}].name`]}
                                    />
                                    {errors[`eliteMentorship[${index}].name`] && (
                                        <p className="text-sm text-error-500 mt-1">
                                            {errors[`eliteMentorship[${index}].name`]}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>Subtitle</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter subtitle"
                                        value={service.subtitle}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handleEliteMentorshipChange(index, 'subtitle', e.target.value)
                                        }
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Price (USD) $</Label>
                                        <Input
                                            type="number"
                                            placeholder="Enter USD price"
                                            value={service.priceUSD}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleEliteMentorshipChange(index, 'priceUSD', e.target.value)
                                            }
                                            error={!!errors?.[`eliteMentorship[${index}].priceUSD`]}
                                        />
                                        {errors[`eliteMentorship[${index}].priceUSD`] && (
                                            <p className="text-sm text-error-500 mt-1">
                                                {errors[`eliteMentorship[${index}].priceUSD`]}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Price (INR) ₹</Label>
                                        <Input
                                            type="number"
                                            placeholder="Enter INR price"
                                            value={service.priceINR}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleEliteMentorshipChange(index, 'priceINR', e.target.value)
                                            }
                                            error={!!errors?.[`eliteMentorship[${index}].priceINR`]}
                                        />
                                        {errors[`eliteMentorship[${index}].priceINR`] && (
                                            <p className="text-sm text-error-500 mt-1">
                                                {errors[`eliteMentorship[${index}].priceINR`]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => removeEliteMentorshipService(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                            >
                                <FaMinus />
                            </button>
                        </div>
                    ))}
                </div>
            </ComponentCard>

            {/* TSUNAMI SECTION */}
            <ComponentCard title="Tsunami" name="">
                <div className="space-y-6">
                    <div>
                        <Label>Bundle Name</Label>
                        <Input
                            type="text"
                            placeholder="Enter bundle name"
                            value={formData.tsunami.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleTsunamiChange('name', e.target.value)
                            }
                            error={!!errors?.['tsunami.name']}
                        />
                        {errors['tsunami.name'] && (
                            <p className="text-sm text-error-500 mt-1">
                                {errors['tsunami.name']}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Included Service Price (USD) $</Label>
                            <Input
                                type="number"
                                placeholder="Enter USD price"
                                value={formData.tsunami.includedServicePriceUSD}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleTsunamiChange('includedServicePriceUSD', e.target.value)
                                }
                                error={!!errors?.['tsunami.includedServicePriceUSD']}
                            />
                            {errors['tsunami.includedServicePriceUSD'] && (
                                <p className="text-sm text-error-500 mt-1">
                                    {errors['tsunami.includedServicePriceUSD']}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Included Service Price (INR) ₹</Label>
                            <Input
                                type="number"
                                placeholder="Enter INR price"
                                value={formData.tsunami.includedServicePriceINR}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleTsunamiChange('includedServicePriceINR', e.target.value)
                                }
                                error={!!errors?.['tsunami.includedServicePriceINR']}
                            />
                            {errors['tsunami.includedServicePriceINR'] && (
                                <p className="text-sm text-error-500 mt-1">
                                    {errors['tsunami.includedServicePriceINR']}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label>Included Services</Label>
                        <Input

                            type="text"
                            placeholder="Enter included services"
                            value={formData.tsunami.includedServices}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleTsunamiChange('includedServices', e.target.value)
                            }
                            error={!!errors?.['tsunami.includedServices']}
                        />
                        {errors['tsunami.includedServices'] && (
                            <p className="text-sm text-error-500 mt-1">
                                {errors['tsunami.includedServices']}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Tsunami Outcome</Label>
                        <textarea
                            className={`w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 ${errors?.['tsunami.description']
                                    ? "text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500"
                                    : "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                                }`}
                            rows={3}
                            placeholder="Enter description"
                            value={formData.tsunami.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                handleTsunamiChange('description', e.target.value)
                            }
                        />
                        {errors['tsunami.description'] && (
                            <p className="mt-1.5 text-xs text-error-500">
                                {errors['tsunami.description']}
                            </p>
                        )}
                    </div>
                </div>
            </ComponentCard>

            {/* RAPID LEARNING TOOLS SECTION */}
            <ComponentCard
                title="Rapid Learning Tools"
                name=""
                action={
                    <div className="flex items-center gap-4">
                        {/* Toggle Switch for Rapid Tools Visibility */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{formData.isRapidToolsVisible ? 'Visible' : 'Hidden'}</span>
                            <button
                                type="button"
                                onClick={() => handleChange('isRapidToolsVisible', !formData.isRapidToolsVisible)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    formData.isRapidToolsVisible ? 'bg-[#ffcb07]' : 'bg-gray-300'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        formData.isRapidToolsVisible ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                        
                        {formData.rapidLearningTools.length < 5 ? (
                            <button
                                type="button"
                                onClick={addRapidTool}
                                className="bg-[#ffcb07] text-black px-4 py-2 flex items-center gap-2 rounded-md hover:bg-[#ffcb07] transition-colors duration-200"
                            >
                                <FaPlus /> Add Tool
                            </button>
                        ) : undefined}
                    </div>
                }
            >
                <div className="mb-6">
                    <Label>Rapid Tools Section Title</Label>
                    <Input
                        type="text"
                        placeholder="Enter custom title for rapid learning tools section"
                        value={formData.rapidToolsSectionTitle}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange("rapidToolsSectionTitle", e.target.value)
                        }
                    />
                </div>
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