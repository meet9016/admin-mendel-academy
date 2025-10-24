"use client";

import React, { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import DatePicker from "../form/date-picker";
import Radio from "../form/input/Radio";
import TextArea from "../form/input/TextArea";
import DropzoneComponent from "./DropZone";
import { api } from "@/utils/axiosInstance";
import Button from "../ui/button/Button";
import { useRouter } from "next/navigation";
import endPointApi from "@/utils/endPointApi";

const Blogs = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    examName: "",
    title: "",
    date: "",
    status: "option2",
    shortDescription: "",
    description: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔁 Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📄 Handle textarea change
  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  // 📅 Handle date selection
  const handleDateChange = (_dates: any, currentDateString: string) => {
    setFormData((prev) => ({ ...prev, date: currentDateString }));
  };

  // 🔘 Handle radio button selection
  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  // ✅ Form validation
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.examName.trim()) newErrors.examName = "Exam Name is required.";
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    if (!formData.shortDescription.trim()) newErrors.shortDescription = "Short description is required.";
    // if (!formData.description.trim()) newErrors.description = "Description is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async () => {
    console.log("wewee");
    
    if (!validate()) return;
    console.log("wewee5555");

    setIsSubmitting(true);
    const body = {
      exam_name: formData.examName,
      title: formData.title,
      sort_description: formData.shortDescription,
      long_description: formData.description,
      date: formData.date,
      image: '',
      status: 'Active'
    }
    try {
      await api.post(endPointApi.createBlog, body);
      router.push("/blogs");
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <ComponentCard title="" name="">
          <div className="space-y-6">
            <div>
              <Label>Exam Name</Label>
              <Input
                name="examName"
                type="text"
                placeholder="Exam name"
                value={formData.examName}
                onChange={handleChange}
                error={!!errors.examName}
                errorMessage={errors.examName}
              />
            </div>

            <div>
              <Label>Title</Label>
              <Input
                name="title"
                placeholder="Title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                errorMessage={errors.title}
              />
            </div>

            <div>
              <DatePicker
                id="date-picker"
                label="Date Picker Input"
                placeholder="Select a date"
                onChange={handleDateChange}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <Radio
                id="radio1"
                name="status"
                value="option1"
                checked={formData.status === "option1"}
                onChange={handleRadioChange}
                label="Active"
              />
              <Radio
                id="radio2"
                name="status"
                value="option2"
                checked={formData.status === "option2"}
                onChange={handleRadioChange}
                label="Inactive"
              />
            </div>

            <div>
              <Label>Short Description</Label>
              <Input
                name="shortDescription"
                type="text"
                placeholder="Short description"
                value={formData.shortDescription}
                onChange={handleChange}
                error={!!errors.shortDescription}
                errorMessage={errors.shortDescription}
              />
            </div>

            <div className="space-y-6">
              <div>
                <Label>Description</Label>
                {/* <TextArea
                  rows={6}
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  error={!!errors.description}
                  hint={errors.description || "Please enter a valid message."}
                /> */}
                <Input
                name="description"
                type="text"
                placeholder="Short description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                errorMessage={errors.description}
              />
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>

      <div className="space-y-6">
        <DropzoneComponent />

        <div className="flex items-center gap-5">
          <Button size="sm" variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => router.push("/blogs")}>
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};

export default Blogs;
