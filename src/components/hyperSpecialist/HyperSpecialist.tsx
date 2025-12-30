"use client";

import React, { useEffect, useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import ComponentCard from "../common/ComponentCard";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import { toast } from "react-toastify";

interface FormDataType {
    title: string;
    description: string;
    tags: string[];
    priceUSD: string;
    priceINR: string;
}
const HyperSpecialist = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormDataType>({
        title: "",
        description: "",
        tags: [""],
        priceUSD: "",
        priceINR: "",
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addTag = () => {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
    };

    const handleTagChange = (i: number, value: string) => {
        const tags = [...formData.tags];
        tags[i] = value;
        setFormData((prev) => ({ ...prev, tags }));
    };

    const removeTag = (i: number) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((_, idx) => idx !== i),
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                const res = await api.get(`${endPointApi.getByIdHyperSpecialist}/${id}`);
                const data = res.data.data;

                setFormData((prev) => ({
                    ...prev,
                    title: data.title ?? "",
                    description: data.description ?? "",
                    priceUSD: data.price_dollar ?? "",
                    priceINR: data.price_inr ?? "",
                    tags: data.tags ?? [""],
                }));

            } catch (error) {
                console.log("Error fetching live course:", error);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            const body = {
                title: formData.title,
                description: formData.description,
                price_dollar: formData.priceUSD,
                price_inr: formData.priceINR,
                tags: formData.tags.filter((t) => t.trim() !== ""),
            };

            let res;
            if (id) {
                // UPDATE
                res = await api.put(`${endPointApi.updateHyperSpecialist}/${id}`, body);
                toast.success(res.data?.message);
            } else {
                // CREATE
                res = await api.post(`${endPointApi.createHyperSpecialist}`, body);
                toast.success(res.data?.message);
            }
            router.push("/hyperSpecialist");
        } catch (error) {
            toast.error("Something went wrong! Please try again.");
            console.log("Submission error", error);
        } 
    };

    return (
        <>
            <div className="space-y-6">
                <ComponentCard title="Add Live Courses" name="">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Title */}
                            <div>
                                <Label>Title</Label>
                                <Input
                                    placeholder="Enter title"
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Input
                                    placeholder="Enter description"
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* USD PRICE */}
                                <div>
                                    <Label>Plan Price (USD)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                                            $
                                        </span>

                                        <Input
                                            type="number"
                                            placeholder="Enter USD"
                                            className="pl-8"
                                            name="priceUSD"
                                            value={String(formData.priceUSD)}
                                            onChange={handleChange}

                                        //   error={!!errors?.priceUSD}
                                        />
                                    </div>
                                </div>

                                {/* INR PRICE */}
                                <div>
                                    <Label>Plan Price (INR)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                                            ₹
                                        </span>

                                        <Input
                                            type="number"
                                            placeholder="Enter INR"
                                            className="pl-8"
                                            name="priceINR"
                                            value={String(formData.priceINR)}
                                            onChange={handleChange}
                                        //   error={!!errors?.priceINR}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <Label>Instructor Tags</Label>
                                <button
                                    type="button"
                                    onClick={addTag}
                                    className="bg-[#FFCA00] text-white w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#FFCA00] transition-colors duration-200"
                                >
                                    <FaPlus />
                                </button>
                            </div>

                            {/* Tags Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {formData.tags.map((tag, i) => (
                                    <div key={i} className="relative">
                                        <Input
                                            type="text"
                                            placeholder={`Tag ${i + 1}`}
                                            value={tag}
                                            onChange={(e) => handleTagChange(i, e.target.value)}
                                        />

                                        {/* Remove Button */}
                                        {formData.tags.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTag(i)}
                                                className="absolute right-3 top-[22px] transform -translate-y-1/2 
                       border border-[#FFCA00] text-[#FFCA00] w-8 h-8 rounded-md 
                       flex items-center justify-center hover:bg-[#FFCA00] 
                       hover:text-white transition-colors duration-200"
                                            >
                                                <FaMinus />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </ComponentCard>
            </div>
            <div className="flex items-center gap-5 mt-5">
                <Button size="sm" variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => router.push("/hyperSpecialist")}>
                    Cancel
                </Button>
            </div>
        </>
    );
};

export default HyperSpecialist;
