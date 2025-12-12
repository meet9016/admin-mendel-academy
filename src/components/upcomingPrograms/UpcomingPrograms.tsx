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
import DatePicker from "../form/date-picker";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import DropzoneComponent from "../blogs/DropZone";
import { upcomingProgramSchema } from "@/ValidationSchema/validationSchema";

interface FormDataType {
  title: string;
  waitlistCount: string;
  date: string;
  course_types: string;
  description: string;
}

const UpcomingPrograms = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    waitlistCount: "",
    date: "",
    course_types: "",
    description: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<File | null>(null);


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

  // Handle date selection
  const handleDateChange = (_dates: unknown, currentDateString: string) => {
    setFormData((prev) => ({ ...prev, date: currentDateString }));
    setErrors((prev: any) => ({ ...prev, date: "" }));
  };

  // Handle Editor text change
  const handleEditorChange = (e: EditorTextChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      description: e.htmlValue || "",
    }));
    setErrors((prev: any) => ({ ...prev, description: "" }));
  };
  // Form validation
  const validate = async () => {
    try {
      await upcomingProgramSchema.validate(formData, { abortEarly: false });
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

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await api.get(`${endPointApi.getByIdUpcomeingProgram}/${id}`);
        const data = res.data || {};
        setFormData({
          title: data.title ?? "",
          waitlistCount: data.waitlistCount?.toString() ?? "",
          date: data.date ?? "",
          course_types: data.course_types ?? "",
          description: data.description ?? "",
        });
        if (data.image) {
          setPreview(data.image);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [id]);


  // Submit Handler
  const handleSubmit = async () => {
    const isValid = await validate();
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("waitlistCount", formData.waitlistCount);
      form.append("date", formData.date);
      form.append("course_types", formData.course_types);
      form.append("description", formData.description);
      if (mainImage) {
        form.append("image", mainImage);
      }
      let res;
      if (id) {
        res = await api.put(`${endPointApi.updateUpcomeingProgram}/${id}`, form);
      } else {
        res = await api.post(`${endPointApi.createUpcomeingProgram}`, form)
      }
      toast.success(res.data?.message);
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                placeholder="Enter title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
              />
              {errors.title && <p className="text-sm text-error-500 mt-1">{errors.title}</p>}
            </div>

            <div>
              <Label>Waitlist Count</Label>
              <Input
                type="text"
                name="waitlistCount"
                placeholder="Enter waitlistCount"
                value={formData.waitlistCount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setFormData((prev) => ({
                      ...prev,
                      waitlistCount: value,
                    }));

                    setErrors((prev: any) => ({
                      ...prev,
                      waitlistCount: "",
                    }));
                  }
                }}
                error={!!errors.waitlistCount}
              />
              {errors.waitlistCount && <p className="text-sm text-error-500 mt-1">{errors.waitlistCount}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <DatePicker
                id="date-picker"
                label="Date Picker Input"
                placeholder="Select a date"
                defaultDate={formData.date}
                onChange={handleDateChange}
                error={errors.date}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <Label>Course Types</Label>
              <Input
                type="text"
                name="course_types"
                placeholder="Enter course types"
                value={formData.course_types}
                onChange={handleChange}
                error={!!errors.course_types}
              />
              {errors.course_types && <p className="text-sm text-error-500 mt-1">{errors.course_types}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
              {errors.description && (
                <p className="text-sm text-error-500 mt-1">{errors.description}</p>
              )}
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