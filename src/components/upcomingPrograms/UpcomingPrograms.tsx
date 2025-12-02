"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import ComponentCard from "../common/ComponentCard";
import Radio from "../form/input/Radio";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { toast } from "react-toastify";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";

interface FormDataType {
  title: string;
  waitlistCount: string;
  duration: string;
  status: string;
  features: string[];
}

const UpcomingPrograms = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    waitlistCount: "",
    duration: "",
    status: "Launching Soon",
    features: [""],
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  //  SINGLE onChange function for all inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };


  // Radio Change
  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };


  // Feature Add / Remove / Change
  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index: number) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, features: updated }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...formData.features];
    updated[index] = value;

    setFormData((prev) => ({
      ...prev,
      features: updated,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [`features[${index}]`]: "",
    }));
  };


  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await api.get(`${endPointApi.getByIdUpcomeingProgram}/${id}`);
        const data = res.data || {};

        setFormData({
          title: data.title ?? "",
          waitlistCount: data.waitlistCount?.toString() ?? "",
          duration: data.duration ?? "",
          status: data.status ?? "Launching Soon",
          features: Array.isArray(data.features) ? data.features : [""],
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, [id]);

  // Submit Handler
  const handleSubmit = async () => {
    setIsSubmitting(true);

    const body = {
      title: formData.title,
      waitlistCount: formData.waitlistCount,
      duration: formData.duration,
      status: formData.status,
      features: formData.features,
    };
    try {
      if (id) {
        const res = await api.put(`${endPointApi.updateUpcomeingProgram}/${id}`, body)
        toast.success(res.data?.message);
      } else {
        const res = await api.post(`${endPointApi.createUpcomeingProgram}`, body)
        toast.success(res.data?.message);
      }
      router.push("/upcomingProgram");
    } catch (error) {
      console.error("Error creating program:", error);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="space-y-6">
      <ComponentCard title="Add Upcoming Program" name="">
        <div className="space-y-6">

          {/* ---------- Row 1 ---------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                placeholder="Enter title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Waitlist Count</Label>
              <Input
                type="text"
                name="waitlistCount"
                placeholder="Enter waitlistCount"
                value={formData.waitlistCount}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ---------- Row 2 ---------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Duration</Label>
              <Input
                type="text"
                name="duration"
                placeholder="Enter duration"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Status</Label>
              <Radio
                id="radio1"
                name="status"
                value="Launching Soon"
                checked={formData.status === "Launching Soon"}
                onChange={handleRadioChange}
                label="Launching Soon"
              />
            </div>
          </div>

          {/* ---------- Features ---------- */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <Label>Features</Label>

              <button
                type="button"
                onClick={addFeature}
                className="bg-[#ffcb07] text-white w-8 h-8 rounded-md flex items-center justify-center hover:bg-[#ffcb07]"
              >
                <FaPlus />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.features.map((feature, index) => (
                <div key={index} className="relative">

                  <Input
                    type="text"
                    placeholder={`Feature ${index + 1}`}
                    value={feature}
                    onChange={(e) =>
                      handleFeatureChange(index, e.target.value)
                    }
                    error={!!errors?.[`features[${index}]`]}
                  />

                  {errors[`features[${index}]`] && (
                    <p className="text-sm text-error-500 mt-1">
                      {errors[`features[${index}]`]}
                    </p>
                  )}

                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ffcb07] border border-[#ffcb07] w-8 h-8 rounded-md flex items-center justify-center hover:bg-[#ffcb07] hover:text-white"
                    >
                      <FaMinus />
                    </button>

                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ---------- Buttons ---------- */}
        <div className="flex items-center gap-5 mt-6">
          <Button size="sm" variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>

          <Button size="sm" variant="outline" onClick={() => router.push("/prerecord")}>
            Cancel
          </Button>
        </div>
      </ComponentCard>
    </div>
  );
};

export default UpcomingPrograms;
