"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Select from "../form/Select";
import { ChevronDownIcon } from "@/icons";
import Button from "../ui/button/Button";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";

const categoryOptions = [
  { value: "marketing", label: "Marketing" },
  { value: "template", label: "Template" },
  { value: "development", label: "Development" },
];

const Question = () => {
  const router = useRouter();

  // One state for all fields
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    duration: "",
    description: "",
  });

  // Error state
  const [errors, setErrors] = useState({
    title: "",
    duration: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle field changes
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validation
  const validate = () => {
    const newErrors = {
      title: "",
      price: "",
      duration: "",
      description: "",
    };

    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }
    if (!formData.price.trim()) {
      newErrors.price = "Sub is required";
      isValid = false;
    }
    if (!formData.duration) {
      newErrors.duration = "Please select a duration";
      isValid = false;
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    const body = {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      duration: formData.duration,
    };

    try {
      await api.post(`${endPointApi.createQuestion}`, body);
      router.push("/question");
    } catch (error) {
      console.error("Submission error:", error);
      // Show notification or message
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="space-y-6">
      <ComponentCard title="" name="">
        <div className="space-y-6">

          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              placeholder="Enter title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              error={errors.title}
            />
            {errors.title && <p className="text-sm text-error-500 mt-1">{errors.title}</p>}
          </div>

          {/* Subtitle & Category */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Label>Price</Label>
              <Input
                placeholder="Enter price"
                type="text"
                value={formData.price}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    handleChange("price", value);
                  }
                }}
                error={errors.price}

              />
              {errors.price && <p className="text-sm text-error-500 mt-1">{errors.price}</p>}

            </div>

            <div className="flex-1">
              <Label>Category</Label>
              <div className="relative">
                <Select
                  options={categoryOptions}
                  placeholder="Select duration"
                  value={formData.duration}
                  onChange={(val) => handleChange("duration", val)}
                  error={errors.duration}

                // className="dark:bg-dark-900"
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
              {errors.duration && <p className="text-sm text-error-500 mt-1">{errors.duration}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <TextArea
              rows={6}
              value={formData.description}
              onChange={(val) => handleChange("description", val)}
              error={!!errors.description}
            />
            {errors.description && <p className="text-sm text-error-500 mt-1">{errors.description}</p>}
          </div>
        </div>
      </ComponentCard>

      {/* Buttons */}
      <div className="flex items-center gap-5">
        <Button size="sm" variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => router.push("/blogs")}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Question;
