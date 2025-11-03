"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import ComponentCard from "../common/ComponentCard";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import MultiSelect from "../form/MultiSelect";
import { decodeHtml } from "@/utils/helper";

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

  const [errors, setErrors] = useState({
    title: "",
    tag: "",
    rating: "",
    total_reviews: "",
    features: "",
    price: "",
    sort_description: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchById = async () => {
      try {
        if (!id) return;
        const res = await api.get(`${endPointApi.getByIdQuestion}/${id}`);
        const data = res.data || {};
        const decodedDescription = decodeHtml(data.description ?? "");

        // Ensure duration is a string for select matching
        setFormData({
          title: data.title ?? "",
          tag: data.tag ?? "",
          rating: data.rating?.toString() ?? "",
          total_reviews: data.total_reviews?.toString() ?? "",
          features: Array.isArray(data.features) ? data.features.join(", ") : data.features ?? "",
          price: data.price ?? '',
          sort_description: data.sort_description ?? "",
          description: decodedDescription,
        });
      } catch (err) {
        console.error("Error fetching data by ID:", err);
      }
    };

    fetchById();
  }, [id]);


  const handleChange = (field: keyof typeof formData, value: string  | string[]) => {
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
  };

  const validate = () => {
    const newErrors = {
      title: "",
      tag: "",
      rating: "",
      total_reviews: "",
      features: "",
      price: "",
      sort_description: "",
      description: "",
      // duration: "",
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

    // if (!formData.duration) {
    //   newErrors.duration = "Please select a category";
    //   isValid = false;
    // }

    if (!formData.description) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  console.log("formData", formData);

  const handleSubmit = async () => {
    if (!validate()) return;

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
      // duration: formData.duration,
    };

    try {
      if (id) {
        await api.put(`${endPointApi.updateQuestion}/${id}`, body);
      } else {
        await api.post(`${endPointApi.createQuestion}`, body);
      }
      router.push("/question");
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ComponentCard title="Add Question" name="">
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
                  
                />
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
            {/* <div>
              <Label>Duration</Label>
              <div className="relative">
                <Select
                  options={categoryOptions}
                  placeholder="Select month"
                  defaultValue={formData.duration || ''}
                  onChange={(selectedOption) =>
                    handleChange("duration", selectedOption || "")
                  }
                // error={errors.duration}
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div> */}
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Editor
              value={formData.description}
              style={{ height: "320px" }}
              onTextChange={handleEditorChange}
            />
            {errors.description && <p className="text-sm text-error-500 mt-1">{errors.description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Button size="sm" variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => router.push("/question")}>
            Cancel
          </Button>
        </div>
      </ComponentCard>

      {/* Buttons */}
    </div>
  );
};

export default Question;
