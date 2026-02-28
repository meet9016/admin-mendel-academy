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
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("primereact/editor").then((m) => m.Editor), { ssr: false });
import type { EditorTextChangeEvent } from "primereact/editor";
import { decodeHtml } from "@/utils/helper";
import { toast } from "react-toastify";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { FaMinus } from "react-icons/fa6";
import { PrerecordedSkeleton } from "../skeltons/Skeltons";

const categoryOptions = [
  { value: "3", label: "3 Month" },
  { value: "5", label: "5 Month" },
  { value: "6", label: "6 Month" },
];

interface OptionType {
  type: "record-book" | "video" | "writing-book";
  description: string;
  price_usd: number;
  price_inr: number;
  features: string[];
  is_available: boolean;
}

interface FormDataType {
  title: string;
  category: string;
  total_reviews: string;
  subtitle: string;
  vimeo_video_id: string;
  rating: string;
  duration: string;
  description: string;
  date: string;
  status: string;
  options: OptionType[];
}

// Single Option Section Component (like PlanSection)
const OptionSection = ({
  data,
  onChange,
  onRemove,
  errors,
}: {
  data: OptionType;
  onChange: (updatedData: OptionType) => void;
  onRemove: () => void;
  errors?: Record<string, string>;
}) => {
  const handleChange = <K extends keyof OptionType>(
    field: K,
    value: OptionType[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const addFeature = () => {
    onChange({ ...data, features: [...data.features, ""] });
  };

  const removeFeature = (index: number) => {
    if (data.features.length <= 1) return;
    const updated = data.features.filter((_, i) => i !== index);
    onChange({ ...data, features: updated });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...data.features];
    updated[index] = value;
    onChange({ ...data, features: updated });
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "record-book": "Record Book",
      "video": "Video Course",
      "writing-book": "Writing Book",
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Add {getTypeLabel(data.type)}
        </h3>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-800 transition-colors"
          title="Remove option"
        >
          <FiTrash2 size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Price (USD)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
              $
            </span>
            <Input
              type="number"
              placeholder="Enter USD"
              className="pl-8"
              value={data.price_usd || "" as any}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("price_usd", parseFloat(e.target.value) || 0)
              }
              error={errors?.[`${data.type}_price_usd`]}
            />
          </div>
          {errors?.[`${data.type}_price_usd`] && (
            <p className="text-sm text-error-500 mt-1">
              {errors[`${data.type}_price_usd`]}
            </p>
          )}
        </div>

        <div>
          <Label>Price (INR)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
              ₹
            </span>
            <Input
              type="number"
              placeholder="Enter INR"
              className="pl-8"
              value={data.price_inr || "" as any}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("price_inr", parseFloat(e.target.value) || 0)
              }
              error={errors?.[`${data.type}_price_inr`]}
            />
          </div>
          {errors?.[`${data.type}_price_inr`] && (
            <p className="text-sm text-error-500 mt-1">
              {errors[`${data.type}_price_inr`]}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Label>Description</Label>
        <textarea
          className={`w-full px-3 py-2 border ${errors?.[`${data.type}_description`]
            ? "border-error-500"
            : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none`}
          rows={3}
          placeholder="Enter description"
          value={data.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        {errors?.[`${data.type}_description`] && (
          <p className="text-sm text-error-500 mt-1">
            {errors[`${data.type}_description`]}
          </p>
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <Label>Features</Label>
          <button
            type="button"
            className="bg-[#ffcb07] w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#e6b800] transition-colors duration-200"
            onClick={addFeature}
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </div>

        {data.features.map((feature, index) => (
          <div key={index} className="relative mb-2">
            <Input
              type="text"
              placeholder={`Enter feature ${index + 1}`}
              value={feature}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFeatureChange(index, e.target.value)
              }
              error={errors?.[`${data.type}_features_${index}`]}
            />
            {errors?.[`${data.type}_features_${index}`] && (
              <p className="text-sm text-error-500 mt-1">
                {errors[`${data.type}_features_${index}`]}
              </p>
            )}
            {data.features.length > 1 && (
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="absolute right-3 top-1/2 -translate-y-1/2 border border-[#ffcb07] text-[#ffcb07] w-8 h-8 rounded-md flex items-center justify-center hover:bg-[#ffcb07] hover:text-black transition-colors duration-200"
              >
                <FaMinus className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <input
          type="checkbox"
          id={`${data.type}_available`}
          checked={data.is_available}
          onChange={(e) => handleChange("is_available", e.target.checked)}
          className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
        />
        <label
          htmlFor={`${data.type}_available`}
          className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          Available for purchase
        </label>
      </div>
    </div>
  );
};

const Prerecorded = () => {
  const router = useRouter();

  const allOptionTypes: Array<"record-book" | "video" | "writing-book"> = [
    "record-book",
    "video",
    "writing-book",
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    category: "",
    total_reviews: "",
    subtitle: "",
    vimeo_video_id: "",
    rating: "",
    duration: "",
    description: "",
    date: "",
    status: "Active",
    options: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormDataType, string>>>({});
  const [optionErrors, setOptionErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize options with all three types
  const [optionsData, setOptionsData] = useState<OptionType[]>(
    allOptionTypes.map((type) => ({
      type,
      description: "",
      price_usd: 0,
      price_inr: 0,
      features: [""],
      is_available: true,
    }))
  );

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchById = async () => {
      try {
        if (id) {
          const res = await api.get(`${endPointApi.getByIdPreRecorded}/${id}`);
          const data = res.data?.data || res.data || {};
          const decodedDescription = decodeHtml(data.description ?? "");

          setFormData({
            title: data.title ?? "",
            category: data.category ?? "",
            total_reviews: data.total_reviews ?? "",
            subtitle: data.subtitle ?? "",
            vimeo_video_id: data.vimeo_video_id ?? "",
            rating: data.rating ?? "",
            duration: data.duration ? String(data.duration) : "",
            description: decodedDescription,
            date: data.date ?? "",
            status: data.status == "Active" ? "Active" : "Inactive",
            options: data.options || [],
          });

          // Populate options data for editing
          if (data.options && data.options.length > 0) {
            const loadedOptions = [...optionsData];
            data.options.forEach((opt: OptionType) => {
              const index = allOptionTypes.indexOf(opt.type);
              if (index !== -1) {
                loadedOptions[index] = opt;
              }
            });
            setOptionsData(loadedOptions);
          }
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
    
    // If no id (create mode), still show skeleton briefly
    if (!id) {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [id]);

  const handleChange = (field: keyof FormDataType, value: string) => {
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

  const handleDateChange = (_dates: unknown, currentDateString: string) => {
    setFormData((prev) => ({ ...prev, date: currentDateString }));
    setErrors((prev) => ({ ...prev, date: "" }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  // ========== OPTION MANAGEMENT ==========

  const updateOption = (index: number, updatedData: OptionType) => {
    const updated = [...optionsData];
    updated[index] = updatedData;
    setOptionsData(updated);

    // Clear errors for this option
    const optionType = updatedData.type;
    const errorKeys = Object.keys(optionErrors).filter((key) =>
      key.startsWith(optionType)
    );
    const newErrors = { ...optionErrors };
    errorKeys.forEach((key) => delete newErrors[key]);
    setOptionErrors(newErrors);
  };

  const removeOption = (index: number) => {
    const optionType = optionsData[index].type;
    const updated = optionsData.filter((_, i) => i !== index);
    setOptionsData(updated);

    // Clear errors for this option
    const errorKeys = Object.keys(optionErrors).filter((key) =>
      key.startsWith(optionType)
    );
    const newErrors = { ...optionErrors };
    errorKeys.forEach((key) => delete newErrors[key]);
    setOptionErrors(newErrors);

    toast.success(`${optionType.replace("-", " ")} option removed`);
  };

  // ========== PRICE CALCULATION ==========

  const getCalculatedPrices = () => {
    const validOptions = optionsData.filter(
      (o) => o.price_usd > 0 && o.price_inr > 0
    );

    if (validOptions.length === 0) return { usd: null, inr: null };

    return {
      usd: Math.min(...validOptions.map((o) => o.price_usd)),
      inr: Math.min(...validOptions.map((o) => o.price_inr)),
    };
  };

  // ========== FORM VALIDATION & SUBMIT ==========

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormDataType, string>> = {};

    // Required field validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.vimeo_video_id.trim()) {
      newErrors.vimeo_video_id = "Vimeo Video ID is required";
    }
    if (!formData.duration) {
      newErrors.duration = "Duration is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOptions = () => {
    const newErrors: Record<string, string> = {};

    // Filter out empty options
    const filledOptions = optionsData.filter(
      (opt) =>
        opt.description.trim() ||
        opt.price_usd > 0 ||
        opt.price_inr > 0 ||
        opt.features.some((f) => f.trim())
    );

    if (filledOptions.length === 0) {
      newErrors.general = "At least one option is required";
      setOptionErrors(newErrors);
      return false;
    }

    // Validate only filled options
    filledOptions.forEach((option) => {
      if (!option.description?.trim()) {
        newErrors[`${option.type}_description`] = "Description is required";
      }

      if (!option.price_usd || option.price_usd <= 0) {
        newErrors[`${option.type}_price_usd`] = "Must be greater than 0";
      }

      if (!option.price_inr || option.price_inr <= 0) {
        newErrors[`${option.type}_price_inr`] = "Must be greater than 0";
      }

      const validFeatures = option.features.filter((f) => f.trim());
      if (validFeatures.length === 0) {
        newErrors[`${option.type}_features_0`] = "At least one feature required";
      }

      option.features.forEach((feature, idx) => {
        if (!feature.trim() && option.features.length > 1) {
          newErrors[`${option.type}_features_${idx}`] = "Cannot be empty";
        }
      });
    });

    setOptionErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate options
    if (!validateOptions()) {
      toast.error("Please complete all option details");
      return;
    }

    setIsSubmitting(true);

    // Filter and clean only filled options
    const cleanedOptions = optionsData
      .filter(
        (opt) =>
          opt.description.trim() ||
          opt.price_usd > 0 ||
          opt.price_inr > 0 ||
          opt.features.some((f) => f.trim())
      )
      .map((opt) => ({
        ...opt,
        features: opt.features.filter((f) => f.trim()),
      }));

    const body = {
      title: formData.title,
      category: formData.category,
      total_reviews: formData.total_reviews,
      subtitle: formData.subtitle,
      rating: formData.rating,
      vimeo_video_id: formData.vimeo_video_id,
      duration: formData.duration,
      description: formData.description,
      date: formData.date,
      status: formData.status,
      options: cleanedOptions,
    };

    try {
      if (id) {
        const res = await api.put(`${endPointApi.updatePreRecorded}/${id}`, body);
        toast.success(res.data?.message || "Updated successfully");
      } else {
        const res = await api.post(`${endPointApi.createPreRecorded}`, body);
        toast.success(res.data?.message || "Created successfully");
      }

      // Add a small delay to ensure toast is visible before redirect
      setTimeout(() => {
        router.push("/prerecord");
      }, 500);

    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Something went wrong! Please try again.";
      toast.error(errorMessage);
      console.error("Submission error:", error);
      setIsSubmitting(false); // Re-enable button on error
    }
  };

  const calculatedPrices = getCalculatedPrices();

  // Show skeleton while loading
  if (isLoading) {
    return <PrerecordedSkeleton isEditMode={!!id} />;
  }

  return (
    <div className="space-y-6">
      <ComponentCard title={id ? "Edit PreRecorded" : "Add PreRecorded"} name="">
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label>Title *</Label>
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
              <Label>Sub title</Label>
              <Input
                placeholder="Enter sub title"
                type="text"
                value={formData.subtitle}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                error={errors.subtitle}
              />
              {errors.subtitle && <p className="text-sm text-error-500 mt-1">{errors.subtitle}</p>}
            </div>
            <div>
              <Label>Category</Label>
              <Input
                placeholder="Enter category"
                type="text"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                error={errors.category}
              />
              {errors.category && <p className="text-sm text-error-500 mt-1">{errors.category}</p>}
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
              {errors.total_reviews && (
                <p className="text-sm text-error-500 mt-1">{errors.total_reviews}</p>
              )}
            </div>
            <div>
              <Label>Vimeo Video ID *</Label>
              <Input
                placeholder="Enter vimeo video id"
                type="text"
                value={formData.vimeo_video_id}
                onChange={(e) => handleChange("vimeo_video_id", e.target.value)}
                error={errors.vimeo_video_id}
              />
              {errors.vimeo_video_id && (
                <p className="text-sm text-error-500 mt-1">{errors.vimeo_video_id}</p>
              )}
            </div>
            <div>
              <Label>Rating</Label>
              <Input
                placeholder="Enter rating"
                type="text"
                value={formData.rating}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    handleChange("rating", e.target.value);
                  }
                }}
                error={errors.rating}
              />
              {errors.rating && <p className="text-sm text-error-500 mt-1">{errors.rating}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Duration *</Label>
              <div className="relative">
                <Select
                  options={categoryOptions}
                  placeholder="Select month"
                  defaultValue={formData.duration || ""}
                  onChange={(selectedOption) => handleChange("duration", selectedOption || "")}
                  error={errors.duration as any}
                />
                {errors.duration && <p className="text-sm text-error-500 mt-1">{errors.duration}</p>}
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
            <div>
              <DatePicker
                id="date-picker"
                label="Date Picker *"
                placeholder="Select a date"
                defaultDate={formData.date}
                value={formData.date as any}
                onChange={handleDateChange}
                error={errors.date}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
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
            <Label>Description *</Label>
            <Editor
              value={formData.description}
              style={{ height: "320px" }}
              onTextChange={handleEditorChange}
              className={`${errors.description ? "border border-error-500" : "border border-gray-100"}`}
            />
            {errors.description && (
              <p className="text-sm text-error-500 mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* ========== OPTIONS SECTION ========== */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Additional Learning Options *</h3>
            <p className="text-sm text-gray-500 mt-1">
              Add purchase options with different materials. At least one option is required.
            </p>
          </div>

          {/* Error Message */}
          {optionErrors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{optionErrors.general}</p>
            </div>
          )}

          {/* Options Grid - Shows all three cards side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {optionsData.map((option, index) => (
              <OptionSection
                key={`${option.type}-${index}`}
                data={option}
                onChange={(updated) => updateOption(index, updated)}
                onRemove={() => removeOption(index)}
                errors={optionErrors}
              />
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-5 mt-6">
          <Button
            size="sm"
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : (id ? "Update" : "Save")}
          </Button>
          <Button size="sm" variant="outline" onClick={() => router.push("/prerecord")}>
            Cancel
          </Button>
        </div>
      </ComponentCard>
    </div>
  );
};

export default Prerecorded;