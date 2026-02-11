"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import ComponentCard from "../common/ComponentCard";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("primereact/editor").then((m) => m.Editor), { ssr: false });
import type { EditorTextChangeEvent } from "primereact/editor";
import MultiSelect from "../form/MultiSelect";
import { decodeHtml } from "@/utils/helper";
import { questionSchema } from "@/ValidationSchema/validationSchema";
import { toast } from "react-toastify";
import { QuestionSkeleton } from "../skeltons/Skeltons";

// const categoryOptions = [
//   { value: "3", label: "3 Month" },
//   { value: "5", label: "5 Month" },
//   { value: "6", label: "6 Month" },
// ];

const featuresOptions = [
  { value: "Adaptive AI", text: "Adaptive AI", selected: false },
  { value: "Analytics", text: "Analytics", selected: false },
  { value: "More features", text: "More features", selected: false },
];

const Question = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    tag: "",
    rating: "",
    total_reviews: "",
    features: [] as string[],
    price: "",
    sort_description: "",
    description: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchById = async () => {
      try {
        if (id) {
          const res = await api.get(`${endPointApi.getByIdQuestion}/${id}`);
          const data = res.data || {};
          const decodedDescription = decodeHtml(data.description ?? "");

          setFormData({
            title: data.title ?? "",
            tag: data.tag ?? "",
            rating: data.rating?.toString() ?? "",
            total_reviews: data.total_reviews?.toString() ?? "",
            features: Array.isArray(data.features) ? data.features : [],
            price: data.price ?? '',
            sort_description: data.sort_description ?? "",
            description: decodedDescription,
          });
        } else {
          // Create mode - set empty form
          setFormData({
            title: "",
            tag: "",
            rating: "",
            total_reviews: "",
            features: [] as string[],
            price: "",
            sort_description: "",
            description: "",
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

  const handleChange = (field: keyof typeof formData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleEditorChange = (e: EditorTextChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      description: e.htmlValue || "",
    }));
    setErrors((prev) => ({ ...prev, description: "" }));
  };

  const validate = async () => {
    try {
      await questionSchema.validate(formData, { abortEarly: false });
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

  const handleSubmit = async () => {
    const isValid = await validate();
    if (!isValid) return;
    setIsSubmitting(true);

    const body = {
      title: formData.title,
      tag: formData.tag,
      rating: formData.rating,
      total_reviews: formData.total_reviews,
      features: formData.features,
      price: formData.price,
      sort_description: formData.sort_description,
      description: formData.description,
    };

    try {
      if (id) {
        const res = await api.put(`${endPointApi.updateQuestion}/${id}`, body);
        toast.success(res.data?.message);
      } else {
        const res = await api.post(`${endPointApi.createQuestion}`, body);
        toast.success(res.data?.message);
      }
      router.push("/question");
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show skeleton while loading
  if (isLoading) {
    return <QuestionSkeleton />;
  }

  return (
    <div className="space-y-6">
      <ComponentCard title={id ? "Edit Question" : "Add Question"} name="">
        <div className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <Label>Tag</Label>
              <Input
                placeholder="Enter tag"
                type="text"
                value={formData.tag}
                onChange={(e) => handleChange("tag", e.target.value)}
                error={errors.tag}
              />
              {errors.tag && <p className="text-sm text-error-500 mt-1">{errors.tag}</p>}
            </div>
            <div>
              <Label>Rating</Label>
              <Input
                placeholder="Enter rating"
                type="text"
                value={formData.rating}
                onChange={(e) => handleChange("rating", e.target.value)}
                error={errors.rating}
              />
              {errors.rating && <p className="text-sm text-error-500 mt-1">{errors.rating}</p>}
            </div>
            <div>
              <Label>Total Reviews</Label>
              <Input
                placeholder="Enter total reviews"
                type="text"
                value={formData.total_reviews}
                onChange={(e) => handleChange("total_reviews", e.target.value)}
                error={errors.total_reviews}
              />
              {errors.total_reviews && <p className="text-sm text-error-500 mt-1">{errors.total_reviews}</p>}
            </div>

            <div>
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
            <div>
              {/* <Label>Features</Label> */}
              <div className="relative">
                <MultiSelect
                  label="Features"
                  options={featuresOptions}
                  defaultSelected={formData.features || []}
                  onChange={(selected: string[]) => handleChange("features", selected)}
                  error={errors.features}
                />
                {errors.features && <p className="text-sm text-error-500 mt-1">{errors.features}</p>}
              </div>
            </div>
            <div>
              <Label>Sort Description</Label>
              <Input
                placeholder="Enter sort description"
                type="text"
                value={formData.sort_description}
                onChange={(e) => handleChange("sort_description", e.target.value)}
                error={errors.sort_description}
              />
              {errors.sort_description && <p className="text-sm text-error-500 mt-1">{errors.sort_description}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Editor
              value={formData.description}
              style={{ height: "320px" }}
              onTextChange={handleEditorChange}
              className={` ${errors.description
                ? "border border-error-500"
                : "border border-gray-100"
                }`}
            />
            {errors.description && <p className="text-sm text-error-500 mt-1">{errors.description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Button size="sm" variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : (id ? "Update" : "Save")}
          </Button>
          <Button size="sm" variant="outline" onClick={() => router.push("/question")}>
            Cancel
          </Button>
        </div>
      </ComponentCard>
    </div>
  );
};

export default Question;