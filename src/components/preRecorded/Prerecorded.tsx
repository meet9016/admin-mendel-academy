"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import { ChevronDownIcon } from "@/icons";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import ComponentCard from "../common/ComponentCard";
import Radio from "../form/input/Radio";
import DatePicker from "../form/date-picker";

const categoryOptions = [
  { value: "3", label: "3 Month" },
  { value: "5", label: "5 Month" },
  { value: "6", label: "6 Month" },
];

const Prerecorded = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    vimeo_video_id: "",
    price: "",
    duration: "",
    description: "",
    date: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({
    title: "",
    vimeo_video_id: "",
    price: "",
    duration: "",
    description: "",
    date: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchById = async () => {
      try {
        if (!id) return;
        const res = await api.get(`${endPointApi.getByIdPreRecorded}/${id}`);
        const data = res.data || {};
        console.log("data", data);

        // Ensure duration is a string for select matching
        setFormData({
          title: data.title ?? "",
          vimeo_video_id: data.vimeo_video_id ?? "",
          price: data.price?.toString() ?? "",
          duration: data.duration ? String(data.duration) : '',
          description: data.description ?? "",
           date: data.date ?? "",
          status: data.status == "Active" ? "Active" : "Inactive",
        });
      } catch (err) {
        console.error("Error fetching data by ID:", err);
      }
    };

    fetchById();
  }, [id]);


  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

   // 📅 Handle date selection
  const handleDateChange = (_dates: unknown, currentDateString: string) => {
    setFormData((prev) => ({ ...prev, date: currentDateString }));
  };

  // 🔘 Handle radio button selection
  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };
  const validate = () => {
    0
    const newErrors = {
      title: "",
      price: "",
      duration: "",
      description: "",
    };

    let isValid = true;

    if (!formData.title) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
      isValid = false;
    }

    if (!formData.duration) {
      newErrors.duration = "Please select a category";
      isValid = false;
    }

    if (!formData.description) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    const body = {
      title: formData.title,
      vimeo_video_id: formData.vimeo_video_id,
      price: formData.price,
      duration: formData.duration,
      description: formData.description,
      date: formData.date,
      status: formData.status,
    };

    try {
      if (id) {
        await api.put(`${endPointApi.updatePreRecorded}/${id}`, body);
      } else {
        await api.post(`${endPointApi.createPreRecorded}`, body);
      }
      router.push("/prerecord");
    } catch (error) {
      console.error("Submission error:", error);
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
          <div>
            <Label>vimeo video id</Label>
            <Input
              placeholder="Enter vimeo video id"
              type="text"
              value={formData.vimeo_video_id}
              onChange={(e) => handleChange("vimeo_video_id", e.target.value)}
              error={errors.vimeo_video_id}
            />
            {errors.vimeo_video_id && <p className="text-sm text-error-500 mt-1">{errors.vimeo_video_id}</p>}
          </div>

          {/* Price and Category */}
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
              <Label>Duration</Label>
              <div className="relative">

                <Select
                  options={categoryOptions}
                  placeholder="Select month"
                  defaultValue={formData.duration || ''}
                  onChange={(selectedOption) =>
                    handleChange("duration", selectedOption || "")
                  }
                  error={errors.duration}
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
              {errors.duration && <p className="text-sm text-error-500 mt-1">{errors.duration}</p>}
            </div>
          </div>

          <div>
            <DatePicker
              id="date-picker"
              label="Date Picker Input"
              placeholder="Select a date"
              defaultDate={formData.date}
              onChange={handleDateChange}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
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

          {/* Description */}
          <div>
            <Label>Description</Label>
            {/* <TextArea
              rows={6}
              value={formData.description}
              onChange={(val) => handleChange("description", val)}
              error={errors.description}
            /> */}
            <Input
              placeholder="Enter description"
              type="text"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              error={errors.description}
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
        <Button size="sm" variant="outline" onClick={() => router.push("/liveCourses")}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Prerecorded;
