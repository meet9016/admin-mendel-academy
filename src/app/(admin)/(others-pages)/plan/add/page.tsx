"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import { toast } from 'react-toastify';
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Radio from "@/components/form/input/Radio";
import Button from "@/components/ui/button/Button";
import { PlanSkeleton } from "@/components/skeltons/Skeltons";
import { planSchema } from "@/ValidationSchema/validationSchema";
import { generateSlug } from "@/utils/helper";
import Select from "@/components/form/Select";
import MultiSelect from "@/components/form/MultiSelect";
import { BiCrown, BiShield } from "react-icons/bi";
import { FiZap, FiStar } from "react-icons/fi";
import { GiLaurelCrown } from "react-icons/gi";
import { Badge } from "primereact/badge";
import { Chip } from "primereact/chip";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
type FormData = {
  id: string;
  name: string;
  price_inr: string;
  price_usd: string;
  duration: string;
  duration_months: number | string;
  features: string[];
  icon_type: 'crown' | 'shield' | 'zap' | 'star' | 'rocket';
  is_popular: boolean;
  is_best_value: boolean;
  sort_order: number | string;
  status: 'Active' | 'Inactive';
};

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export default function PlanAddEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [featureInput, setFeatureInput] = useState("");
  const [highlightInput, setHighlightInput] = useState("");

  const [formData, setFormData] = useState<any>({
    name: "",   
    price_inr: "",
    price_usd: "",
    duration: "",
    duration_months: "",
    features: [],
    is_popular: false,
    is_best_value: false,
    sort_order: 0,
    status: "Active",
  });

  /* -------------------- Fetch Data if Editing -------------------- */
  useEffect(() => {
    const fetchPlanById = async () => {
      try {
        if (id) {
          const res = await api.get(`${endPointApi.getPlanById}/${id}`);
          const data = res.data.data || {};
          
          setFormData({
            name: data.name || "",
            price_inr: data.price_inr || "",
            price_usd: data.price_usd || "",
            duration: data.duration || "",
            duration_months: data.duration_months || "",
            features: data.features || [],
            is_popular: data.is_popular || false,
            is_best_value: data.is_best_value || false,
            sort_order: data.sort_order || 0,
            status: data.status || "Active",
          });
        }
      } catch (err) {
        console.error("Error fetching plan:", err);
        toast.error("Failed to load plan data");
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchPlanById();
  }, [id]);

  /* -------------------- Handlers ---------------------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      
      // Auto-generate ID from name if in create mode or ID is empty
      if (name === "name" && (!id || !prev.id)) {
        newData.id = generateSlug(value);
      }
      
      return newData;
    });
    
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === "" || /^\d+$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  /* -------------------- Validation -------------------------------- */
  const validate = async () => {
    try {
      await planSchema.validate(formData, { abortEarly: false });
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

  /* -------------------- Submit ------------------------------------ */
  const handleSubmit = async () => {
    const isValid = await validate();
    if (!isValid) return;

    setIsSubmitting(true);
    
    // Prepare data for API
    const submitData = {
      ...formData,
      price_inr: formData.price_inr,
      price_usd: formData.price_usd,
      duration_months: Number(formData.duration_months),
      sort_order: Number(formData.sort_order),
      is_popular: formData.is_popular,
      is_best_value: formData.is_best_value,
    };

    try {
      if (id) {
        const res = await api.put(`${endPointApi.updatePlan}/${id}`, submitData);
        toast.success(res.data?.message || "Plan updated successfully");
      } else {
        const res = await api.post(endPointApi.createPlan, submitData);
        toast.success(res.data?.message || "Plan created successfully");
      }
      router.push("/plan");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <PlanSkeleton />;
  }

  return (
    <div className="space-y-6">
      <ComponentCard title={id ? "Edit Plan" : "Add New Plan"} name="">
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Plan Name *</Label>
                <Input
                  name="name"
                  placeholder="Plan Name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                />
                {errors.name && <p className="text-sm text-error-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label>Price Inr *</Label>
                <Input
                  name="price_inr"
                  placeholder="Price Inr"
                  value={formData.price_inr}
                  onChange={handleChange}
                  error={!!errors.price_inr}
                />
                {errors.price_inr && <p className="text-sm text-error-500 mt-1">{errors.price_inr}</p>}
              </div>

              <div>
                <Label>Price Usd *</Label>
                <Input
                  name="price_usd"
                  type="text"
                  placeholder="Price Usd"
                  value={formData.price_usd}
                  onChange={handleNumberChange}
                  error={!!errors.price_usd}
                />
                {errors.price_usd && <p className="text-sm text-error-500 mt-1">{errors.price_usd}</p>}
              </div>
            </div>
          </div>

          {/* Duration Information */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">Duration & Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Duration Description *</Label>
                <Input
                  name="duration"
                  placeholder="Duration Description"
                  value={formData.duration}
                  onChange={handleChange}
                  error={!!errors.duration}
                />
                {errors.duration && <p className="text-sm text-error-500 mt-1">{errors.duration}</p>}
              </div>

              <div>
                <Label>Duration (months) *</Label>
                <Input
                  name="duration_months"
                  type="text"
                  placeholder="Duration (months)"
                  value={formData.duration_months}
                  onChange={handleNumberChange}
                  error={!!errors.duration_months}
                />
                {errors.duration_months && <p className="text-sm text-error-500 mt-1">{errors.duration_months}</p>}
              </div>

              <div>
                <Label>Sort Order</Label>
                <Input
                  name="sort_order"
                  type="text"
                  placeholder="0"
                  value={formData.sort_order}
                  onChange={handleNumberChange}
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a feature..."
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                  className="flex-1"
                />
                <Button onClick={handleAddFeature} variant="primary" size="sm">
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <Chip
                    key={index}
                    label={feature}
                    removable
                    onRemove={() => handleRemoveFeature(index)}
                    className="bg-gray-100"
                  />
                ))}
              </div>
              {errors.features && <p className="text-sm text-error-500">{errors.features}</p>}
            </div>
          </div>

          {/* Badge Configuration */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">Badge</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="flex items-center gap-8">
                <Radio
                  id="popular"
                  name="is_popular"
                  value="true"
                  checked={formData.is_popular}
                  onChange={() => {
                    setFormData(prev => ({ 
                      ...prev, 
                      is_popular: true,
                      is_best_value: false 
                    }));
                  }}
                  label="Most Popular"
                />
                <Radio
                  id="bestValue"
                  name="is_best_value"
                  value="true"
                  checked={formData.is_best_value}
                  onChange={() => {
                    setFormData(prev => ({ 
                      ...prev, 
                      is_best_value: true,
                      is_popular: false 
                    }));
                  }}
                  label="Best Value"
                />
                <Radio
                  id="none"
                  name="none"
                  value="false"
                  checked={!formData.is_popular && !formData.is_best_value}
                  onChange={() => {
                    setFormData(prev => ({ 
                      ...prev, 
                      is_popular: false,
                      is_best_value: false 
                    }));
                  }}
                  label="None"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">Status</h3>
            <div className="flex items-center gap-8">
              <Radio
                id="active"
                name="status"
                value="Active"
                checked={formData.status === "Active"}
                onChange={() => setFormData(prev => ({ ...prev, status: "Active" }))}
                label="Active"
              />
              <Radio
                id="inactive"
                name="status"
                value="Inactive"
                checked={formData.status === "Inactive"}
                onChange={() => setFormData(prev => ({ ...prev, status: "Inactive" }))}
                label="Inactive"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-5 pt-4">
            <Button 
              size="sm" 
              variant="primary" 
              onClick={handleSubmit} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : (id ? "Update Plan" : "Create Plan")}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => router.push("/plan")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}