"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import DatePicker from "../form/date-picker";
import Radio from "../form/input/Radio";
import DropzoneComponent from "./DropZone";
import { api } from "@/utils/axiosInstance";
import Button from "../ui/button/Button";
import { useRouter, useSearchParams } from "next/navigation";
import endPointApi from "@/utils/endPointApi";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("primereact/editor").then((m) => m.Editor), { ssr: false });
import type { EditorTextChangeEvent } from "primereact/editor";
import { toast } from 'react-toastify';
import { decodeHtml } from "@/utils/helper";
import { blogSchema } from "@/ValidationSchema/validationSchema";

const Blogs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    examName: "",
    title: "",
    date: "",
    status: "Active",
    shortDescription: "",
    description: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<File | null>(null);

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle Editor text change
  const handleEditorChange = (e: EditorTextChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      description: e.htmlValue || "",
    }));
    setErrors((prev) => ({ ...prev, description: "" }));
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

  // useEffect(() => {
  //   const fetchById = async () => {
  //     try {
  //       if (!id) return;
  //       const res = await api.get(`${endPointApi.getByIdBlogs}/${id}`);
  //       const data = res.data || {};
  //       const decodedDescription = decodeHtml(data.long_description ?? "");
  //       // Ensure duration is a string for select matching
  //       setFormData({
  //         examName: data.exam_name ?? "",
  //         title: data.title ?? "",
  //         date: data.date ?? "",
  //         status: data.status == "Active" ? "Active" : "Inactive",
  //         shortDescription: data.sort_description ?? "",
  //         description: decodedDescription,
  //       });

  //     } catch (err) {
  //       console.error("Error fetching data by ID:", err);
  //     }
  //   };

  //   fetchById();
  // }, [id]);

  useEffect(() => {
    const fetchById = async () => {
      try {
        if (!id) return;

        const res = await api.get(`${endPointApi.getByIdBlogs}/${id}`);
        const data = res.data || {};
        const decodedDescription = decodeHtml(data.long_description ?? "");

        setFormData({
          examName: data.exam_name ?? "",
          title: data.title ?? "",
          date: data.date ?? "",
          status: data.status == "Active" ? "Active" : "Inactive",
          shortDescription: data.sort_description ?? "",
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

  // Form validation
  const validate = async () => {
    try {
      await blogSchema.validate(formData, { abortEarly: false });
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



  // Submit handler
  const handleSubmit = async () => {
    const isValid = await validate();
    if (!isValid) return;
    setIsSubmitting(true);
    const formDataToSend = new FormData();

    formDataToSend.append("exam_name", formData.examName);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("sort_description", formData.shortDescription);
    formDataToSend.append("long_description", formData.description);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("status", formData.status);

    if (mainImage) {
      formDataToSend.append("image", mainImage);
    }


    try {
      if (id) {
        const res = await api.put(`${endPointApi.updateBlog}/${id}`, formDataToSend);
        toast.success(res.data?.message);
      } else {
        const res = await api.post(`${endPointApi.createBlog}`, formDataToSend);
        toast.success(res.data?.message);
      }
      router.push("/blogs");
    } catch (error: any) {
      toast.error( error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <ComponentCard title="Add Blog" name="">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Exam Name</Label>
                <Input
                  name="examName"
                  type="text"
                  placeholder="Exam name"
                  value={formData.examName}
                  onChange={handleChange}
                  error={!!errors.examName}
                // errorMessage={errors.examName}
                />
                {errors.examName && <p className="text-sm text-error-500 mt-1">{errors.examName}</p>}
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
                // errorMessage={errors.title}
                />
                {errors.title && <p className="text-sm text-error-500 mt-1">{errors.title}</p>}
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
                <Label>Short Description</Label>
                <Input
                  name="shortDescription"
                  type="text"
                  placeholder="Short description"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  error={!!errors.shortDescription}
                // errorMessage={errors.shortDescription}
                />
                {errors.shortDescription && <p className="text-sm text-error-500 mt-1">{errors.shortDescription}</p>}
              </div>
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


            <div>
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

          </div>

          <DropzoneComponent
            preview={preview}
            setPreview={setPreview}
            onFileSelect={(file: File) => setMainImage(file)}
          />
          <div className="flex items-center gap-5">
            <Button size="sm" variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => router.push("/blogs")}>
              Cancel
            </Button>
          </div>
        </ComponentCard>
      </div>


    </>
  );
};

export default Blogs;
