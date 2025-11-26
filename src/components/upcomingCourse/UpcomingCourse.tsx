'use client'
import React, { useEffect, useState } from 'react'
import ComponentCard from '../common/ComponentCard'
import Label from '../form/Label'
import Input from '../form/input/InputField'
import DatePicker from '../form/date-picker'
import Radio from '../form/input/Radio'
import { Editor, EditorTextChangeEvent } from 'primereact/editor'
import Button from "../ui/button/Button";
import DropzoneComponent from '../blogs/DropZone'
import { api } from '@/utils/axiosInstance'
import endPointApi from '@/utils/endPointApi'
import Select from '../form/Select'
import { useRouter, useSearchParams } from 'next/navigation'
import { decodeHtml } from '@/utils/helper'
import { upcomingcourseSchema } from '@/ValidationSchema/validationSchema'
import { toast } from 'react-toastify'


const UpcomingCourse = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        type: "",
        date: "",
        wishlistspot: "",
        status: "open",
        description: "",
    });
    const categoryOptions = [
        { value: "Beginner", label: "Beginner" },
        { value: "Intermediate", label: "International Exams" },
        { value: "Advanced Level", label: "Advanced Level" },
    ];
    // Handle text input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };
    // Handle date selection
    const handleDateChange = (_dates: unknown, currentDateString: string) => {
        setFormData((prev) => ({ ...prev, date: currentDateString }));
        setErrors((prev) => ({ ...prev, date: "" }));
    };
    // Handle radio button selection
    const handleRadioChange = (value: string) => {
        setFormData((prev) => ({ ...prev, status: value }));
    };
    // Handle Editor text change
    const handleEditorChange = (e: EditorTextChangeEvent) => {
        setFormData((prev) => ({
            ...prev,
            description: e.htmlValue || "",
        }));
        setErrors((prev) => ({ ...prev, description: "" }));
    };
    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    useEffect(() => {
        const fetchById = async () => {
            try {
                if (!id) return;
                const res = await api.get(`${endPointApi.getByIdUpcomeing}/${id}`);
                const data = res.data || {};
                const decodedDescription = decodeHtml(data.description ?? "");

                setFormData({
                    title: data.title ?? "",
                    category: data.level ?? "",
                    type: data.type ?? "",
                    date: data.startDate ?? "",
                    wishlistspot: data.waitlistSpots?.toString() ?? "",
                    status: data.status ?? "open",
                    description: decodedDescription,
                });
                if (data?.image) {
                    setPreview(data.image);
                    setMainImage(null);
                }
            } catch (err) {
                console.error("Error fetching data by ID:", err);
            }
        };

        fetchById();
    }, [id]);

    const handleSubmit = async () => {
        const isValid = await validate();
        if (!isValid) return;
        try {
            setIsSubmitting(true)
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('level', formData.category);
            formDataToSend.append('type', formData.type);
            formDataToSend.append('description', formData.description);
            formDataToSend.append("startDate", formData.date);
            formDataToSend.append('waitlistSpots', formData.wishlistspot);
            formDataToSend.append("status", formData.status);
            if (mainImage) {
                formDataToSend.append("image", mainImage);
            }
            let res;
            if (id) {
                res = await api.put(`${endPointApi.updateUpcomeing}/${id}`, formDataToSend);
                toast.success(res.data?.message);
            }
            else {
                res = await api.post(`${endPointApi.createUpcomeing}`, formDataToSend);
                toast.success(res.data?.message);
            }
            router.push("/upcomingCourse");
        } catch (error) {
            console.log("Submission Error:", error)
            toast.error("Something went wrong! Please try again.");
        } finally {
            setIsSubmitting(false)
        }
    }

    const validate = async () => {
        try {
            await upcomingcourseSchema.validate(formData, { abortEarly: false });
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
    };


    return (
        <div className="space-y-6">
            <ComponentCard title="Add Upcomeing Course" name="">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={formData.title}
                                placeholder='Enter title'
                                onChange={handleChange}
                                error={!!errors.title}
                            />
                            {errors.title && <p className="text-sm text-error-500 mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <Label>Level</Label>
                            <Select
                                options={categoryOptions}
                                placeholder="Select category"
                                value={formData.category}
                                onChange={(value: string) => handleSelectChange("category", value)}
                                error={!!errors?.category}
                            />
                            {errors.category && <p className="text-sm text-error-500 mt-1">{errors.category}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Type</Label>
                            <Input
                                type="text"
                                name="type"
                                value={formData.type}
                                placeholder='Enter type'
                                onChange={handleChange}
                                error={!!errors.type}
                            />
                            {errors.type && <p className="text-sm text-error-500 mt-1">{errors.type}</p>}
                        </div>
                        <div>
                            <DatePicker
                                id="date-picker"
                                label="Date Picker"
                                placeholder="Select a date"
                                defaultDate={formData.date}
                                onChange={handleDateChange}
                                error={errors.date}
                            />
                            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>WishList Spot</Label>
                            <Input
                                type="text"
                                name="wishlistspot"
                                value={formData.wishlistspot}
                                placeholder='Enter wishlistspot'
                                onChange={handleChange}
                                error={!!errors.wishlistspot}
                            />
                            {errors.wishlistspot && <p className="text-red-500 text-sm mt-1">{errors.wishlistspot}</p>}
                        </div>
                        <div className="flex flex-wrap items-center gap-8">
                            <Radio
                                id="radio1"
                                name="status"
                                value="open"
                                checked={formData.status === "open"}
                                onChange={handleRadioChange}
                                label="open"
                            />
                            <Radio
                                id="radio2"
                                name="status"
                                value="closed"
                                checked={formData.status === "closed"}
                                onChange={handleRadioChange}
                                label="closed"
                            />
                            <Radio
                                id="radio2"
                                name="status"
                                value="waitlist"
                                checked={formData.status === "waitlist"}
                                onChange={handleRadioChange}
                                label="waitlist"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Description</Label>
                            <Editor
                                value={formData.description}
                                onTextChange={handleEditorChange}
                                style={{ height: "320px" }}
                                className={` ${errors.description
                                    ? "border border-error-500"
                                    : "border border-gray-100"
                                    }`}
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
                </div>
                <div className="flex items-center gap-5">
                    <Button size="sm" variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                    <Button size="sm" variant="outline" >
                        Cancel
                    </Button>
                </div>
            </ComponentCard>
        </div>
    )
}

export default UpcomingCourse