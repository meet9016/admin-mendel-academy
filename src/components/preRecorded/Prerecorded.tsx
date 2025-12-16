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
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { decodeHtml } from "@/utils/helper";
import { prerecordSchema } from "@/ValidationSchema/validationSchema";
import { toast } from "react-toastify";
import { FiPlus, FiTrash2, FiCheck, FiX, FiAlertCircle } from "react-icons/fi";

const categoryOptions = [
  { value: "3", label: "3 Month" },
  { value: "5", label: "5 Month" },
  { value: "6", label: "6 Month" },
];

interface OptionType {
  type: "record-book" | "video" | "writing-book";
  description: string;
  price: number;
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
  price: string;
  duration: string;
  description: string;
  date: string;
  status: string;
  options: OptionType[];
}

const Prerecorded = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    category: "",
    total_reviews: "",
    subtitle: "",
    vimeo_video_id: "",
    price: "",
    rating: "",
    duration: "",
    description: "",
    date: "",
    status: "Active",
    options: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormDataType, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptionForm, setShowOptionForm] = useState(false);

  const [currentOption, setCurrentOption] = useState<OptionType>({
    type: "record-book",
    description: "",
    price: 0,
    features: [""],
    is_available: true,
  });

  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchById = async () => {
      try {
        if (!id) return;
        const res = await api.get(`${endPointApi.getByIdPreRecorded}/${id}`);
        const data = res.data?.data || res.data || {};
        const decodedDescription = decodeHtml(data.description ?? "");

        setFormData({
          title: data.title ?? "",
          category: data.category ?? "",
          total_reviews: data.total_reviews ?? "",
          subtitle: data.subtitle ?? "",
          vimeo_video_id: data.vimeo_video_id ?? "",
          price: data.price?.toString() ?? "",
          rating: data.rating ?? "",
          duration: data.duration ? String(data.duration) : "",
          description: decodedDescription,
          date: data.date ?? "",
          status: data.status == "Active" ? "Active" : "Inactive",
          options: data.options || [],
        });
      } catch (err) {
        console.error("Error fetching data by ID:", err);
      }
    };

    fetchById();
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

  // ✅ HELPER: Check if main price equals minimum option price
  const validatePriceWithOptions = (): { isValid: boolean; message: string } => {
    if (formData.options.length === 0) {
      return { isValid: true, message: "" };
    }

    const mainPrice = parseFloat(formData.price);
    if (isNaN(mainPrice)) {
      return { isValid: false, message: "Please enter a valid main price" };
    }

    const optionPrices = formData.options.map(opt => opt.price);
    const minOptionPrice = Math.min(...optionPrices);

    if (mainPrice !== minOptionPrice) {
      return {
        isValid: false,
        message: `Main price ($${mainPrice}) must equal the minimum option price ($${minOptionPrice}). This ensures the "starting from" price is accurate.`
      };
    }

    return { isValid: true, message: "" };
  };

  // ========== OPTION MANAGEMENT ==========

  const handleAddOption = () => {
    setShowOptionForm(true);
    setEditingOptionIndex(null);
    setCurrentOption({
      type: "record-book",
      description: "",
      price: 0,
      features: [""],
      is_available: true,
    });
  };

  const handleEditOption = (index: number) => {
    setEditingOptionIndex(index);
    setCurrentOption({ ...formData.options[index] });
    setShowOptionForm(true);
  };

  const handleDeleteOption = (index: number) => {
    const updatedOptions = formData.options.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, options: updatedOptions }));
    toast.success("Option removed");
  };

  const handleSaveOption = () => {
    if (!currentOption.description || currentOption.price <= 0) {
      toast.error("Please fill all option fields");
      return;
    }

    if (currentOption.features.filter(f => f.trim()).length === 0) {
      toast.error("Please add at least one feature");
      return;
    }

    const cleanOption = {
      ...currentOption,
      features: currentOption.features.filter(f => f.trim()),
    };

    if (editingOptionIndex !== null) {
      const updatedOptions = [...formData.options];
      updatedOptions[editingOptionIndex] = cleanOption;
      setFormData((prev) => ({ ...prev, options: updatedOptions }));
      toast.success("Option updated");
    } else {
      setFormData((prev) => ({
        ...prev,
        options: [...prev.options, cleanOption],
      }));
      toast.success("Option added");
    }

    setShowOptionForm(false);
    setCurrentOption({
      type: "record-book",
      description: "",
      price: 0,
      features: [""],
      is_available: true,
    });
  };

  const handleOptionChange = (field: keyof OptionType, value: any) => {
    setCurrentOption((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...currentOption.features];
    updatedFeatures[index] = value;
    setCurrentOption((prev) => ({ ...prev, features: updatedFeatures }));
  };

  const addFeature = () => {
    setCurrentOption((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index: number) => {
    if (currentOption.features.length <= 1) return;
    const updatedFeatures = currentOption.features.filter((_, i) => i !== index);
    setCurrentOption((prev) => ({ ...prev, features: updatedFeatures }));
  };

  // ========== FORM VALIDATION & SUBMIT ==========

  const validate = async () => {
    try {
      await prerecordSchema.validate(formData, { abortEarly: false });
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

    // ✅ Validate price with options before submitting
    const priceValidation = validatePriceWithOptions();
    if (!priceValidation.isValid) {
      toast.error(priceValidation.message);
      return;
    }

    setIsSubmitting(true);
    const body = {
      title: formData.title,
      category: formData.category,
      total_reviews: formData.total_reviews,
      subtitle: formData.subtitle,
      rating: formData.rating,
      vimeo_video_id: formData.vimeo_video_id,
      price: formData.price,
      duration: formData.duration,
      description: formData.description,
      date: formData.date,
      status: formData.status,
      options: formData.options,
    };

    try {
      if (id) {
        const res = await api.put(`${endPointApi.updatePreRecorded}/${id}`, body);
        toast.success(res.data?.message);
      } else {
        const res = await api.post(`${endPointApi.createPreRecorded}`, body);
        toast.success(res.data?.message);
      }
      router.push("/prerecord");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Something went wrong! Please try again.";
      toast.error(errorMessage);
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Calculate suggested price
  const getSuggestedPrice = () => {
    if (formData.options.length === 0) return null;
    const prices = formData.options.map(opt => opt.price);
    return Math.min(...prices);
  };

  const suggestedPrice = getSuggestedPrice();
  const priceValidation = validatePriceWithOptions();

  return (
    <div className="space-y-6">
      <ComponentCard title="Add PreRecorded" name="">
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <Label>Vimeo Video ID</Label>
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
            <div className="flex-1">
              <Label>Main Price (Starting From)</Label>
              <Input
                placeholder="Enter price"
                type="text"
                value={formData.price}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    handleChange("price", value);
                  }
                }}
                error={errors.price}
              />
              {errors.price && <p className="text-sm text-error-500 mt-1">{errors.price}</p>}

              {/* ✅ Price validation warning */}
              {suggestedPrice !== null && parseFloat(formData.price) !== suggestedPrice && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                  <FiAlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-yellow-800">
                    <p className="font-medium">Price Mismatch!</p>
                    <p>Main price should be <strong>${suggestedPrice}</strong> (minimum option price)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div>
              <Label>Duration</Label>
              <div className="relative">
                <Select
                  options={categoryOptions}
                  placeholder="Select month"
                  defaultValue={formData.duration || ""}
                  onChange={(selectedOption) => handleChange("duration", selectedOption || "")}
                  error={errors.duration}
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
                label="Date Picker"
                placeholder="Select a date"
                defaultDate={formData.date}
                value={formData.date}
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
            <Label>Description</Label>
            <Editor
              value={formData.description}
              style={{ height: "320px" }}
              onTextChange={handleEditorChange}
              className={`${errors.description ? "border border-error-500" : "border border-gray-100"
                }`}
            />
            {errors.description && (
              <p className="text-sm text-error-500 mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* ========== OPTIONS SECTION ========== */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Additional Learning Options</h3>
              <p className="text-sm text-gray-500 mt-1">
                Add optional materials students can purchase. Main price will show the minimum option price.
              </p>
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={handleAddOption}
              className="flex items-center gap-2"
            >
              <FiPlus /> Add Option
            </Button>
          </div>

          {/* Display Added Options */}
          {formData.options.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {formData.options.map((option, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <span className="inline-block text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded uppercase">
                        {option.type.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditOption(index)}
                        className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOption(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{option.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-success-600">${option.price}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${option.is_available
                        ? "bg-success-100 text-success-700"
                        : "bg-error-100 text-error-700"
                        }`}
                    >
                      {option.is_available ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs font-medium text-gray-500 mb-2">Features:</p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      {option.features.slice(0, 2).map((f, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-primary-500 mt-0.5">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                      {option.features.length > 2 && (
                        <li className="text-gray-400 text-xs">
                          + {option.features.length - 2} more feature{option.features.length - 2 > 1 ? 's' : ''}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Option Form Modal/Panel */}
          {showOptionForm && (
            <div className="border-2 border-primary-200 rounded-lg p-6 bg-primary-50 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-gray-900">
                  {editingOptionIndex !== null ? "Edit Option" : "Add New Option"}
                </h4>
                <button
                  onClick={() => setShowOptionForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Option Type</Label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      value={currentOption.type}
                      onChange={(e) =>
                        handleOptionChange("type", e.target.value as any)
                      }
                    >
                      <option value="record-book">Record Book</option>
                      <option value="video">Video Course</option>
                      <option value="writing-book">Writing Book</option>
                    </select>
                  </div>
                  <div>
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      placeholder="Enter price"
                      value={currentOption.price || ""}
                      onChange={(e) =>
                        handleOptionChange("price", parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition resize-none"
                    rows={3}
                    placeholder="Enter a brief description of this option"
                    value={currentOption.description}
                    onChange={(e) => handleOptionChange("description", e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Features</Label>
                    <button
                      onClick={addFeature}
                      className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
                    >
                      <FiPlus size={16} /> Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {currentOption.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Feature ${index + 1}`}
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          className="flex-1"
                        />
                        {currentOption.features.length > 1 && (
                          <button
                            onClick={() => removeFeature(index)}
                            className="text-red-600 hover:text-red-800 p-2"
                            title="Remove feature"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    id="is_available"
                    checked={currentOption.is_available}
                    onChange={(e) => handleOptionChange("is_available", e.target.checked)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_available" className="text-sm font-medium text-gray-700">
                    Available for purchase
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-primary-200">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleSaveOption}
                    className="flex items-center gap-2"
                  >
                    <FiCheck /> Save Option
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowOptionForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
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

export default Prerecorded;