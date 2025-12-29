"use client";

import React, { useEffect, useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import ComponentCard from "../common/ComponentCard";
import Radio from "../form/input/Radio";
import DatePicker from "../form/date-picker";
import { FaMinus, FaPlus } from "react-icons/fa6";
import Checkbox from "../form/input/Checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import { toast } from "react-toastify";

interface ModuleType {
  module_number: number | string;
  module_name: string;
  module_title: string;
  module_price_usd: string;  // ✅ Added USD price
  module_price_inr: string;  // ✅ Added INR price
  most_popular: boolean;
  plan_sub_title: string[];
}

interface FormDataType {
  title: string;
  instructor_name: string;
  instructor_qualification: string;
  duration: string;
  zoom_link: string;
  date: string;
  tags: string[];
  status: string;
  soldOut: boolean;
  modules: ModuleType[];
}

const LiveCourses = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    instructor_name: "",
    instructor_qualification: "",
    duration: "",
    zoom_link: "",
    date: "",
    tags: [""],
    status: "",
    soldOut: false,
    modules: [
      {
        module_number: "",
        module_name: "",
        module_title: "",
        module_price_usd: "",  // ✅ USD price
        module_price_inr: "",  // ✅ INR price
        most_popular: false,
        plan_sub_title: [""],
      },
      {
        module_number: "",
        module_name: "",
        module_title: "",
        module_price_usd: "",
        module_price_inr: "",
        most_popular: false,
        plan_sub_title: [""],
      },
      {
        module_number: "",
        module_name: "",
        module_title: "",
        module_price_usd: "",
        module_price_inr: "",
        most_popular: false,
        plan_sub_title: [""],
      },
    ],
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const addTag = () => {
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
  };

  const handleTagChange = (i: number, value: string) => {
    const tags = [...formData.tags];
    tags[i] = value;
    setFormData((prev) => ({ ...prev, tags }));
  };

  const removeTag = (i: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, idx) => idx !== i),
    }));
  };

  const handleModuleChange = (index: number, field: string, value: any) => {
    const modules = [...formData.modules];
    (modules[index] as any)[field] = value;
    setFormData((prev) => ({ ...prev, modules }));
  };

  const addSubTitle = (mIndex: number) => {
    const modules = [...formData.modules];
    modules[mIndex].plan_sub_title.push("");
    setFormData((prev) => ({ ...prev, modules }));
  };

  const removeSubTitle = (mIndex: number, sIndex: number) => {
    const modules = [...formData.modules];
    modules[mIndex].plan_sub_title = modules[mIndex].plan_sub_title.filter(
      (_, i) => i !== sIndex
    );
    setFormData((prev) => ({ ...prev, modules }));
  };

  const handleSubTitleChange = (mIndex: number, sIndex: number, value: string) => {
    const modules = [...formData.modules];
    modules[mIndex].plan_sub_title[sIndex] = value;
    setFormData((prev) => ({ ...prev, modules }));
  };

  const handlePopularChange = (moduleIndex: number) => {
    const modules = formData.modules.map((m, i) => ({
      ...m,
      most_popular: i === moduleIndex,
    }));
    setFormData((prev) => ({ ...prev, modules }));
  };

  const handleDateChange = (_dates: unknown, currentDateString: string) => {
    setFormData((prev) => ({ ...prev, date: currentDateString }));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const res = await api.get(`${endPointApi.getByIdLiveCourses}/${id}`);
        const data = res.data.data; // ✅ Access nested data

        setFormData((prev) => ({
          ...prev,
          title: data.course_title ?? "",
          instructor_name: data.instructor?.name ?? "",
          instructor_qualification: data.instructor?.qualification ?? "",
          duration: data.duration ?? "",
          zoom_link: data.zoom_link ?? "",
          date: data.date ?? "",
          tags: data.tags ?? [""],
          status: data.status ?? "",
          soldOut: data.isSoldOut ?? false,

          modules: (() => {
            // ✅ Convert API modules with both USD and INR prices
            const apiModules = data.choose_plan_list?.map((m: any) => ({
              module_number: m.moduleNumber ?? "",
              module_name: m.title ?? "",
              module_title: m.subtitle ?? "",
              module_price_usd: m.price_usd ?? "",  // ✅ Get USD price
              module_price_inr: m.price_inr ?? "",  // ✅ Get INR price
              most_popular: m.isMostPopular ?? false,
              plan_sub_title: m.features?.length ? m.features : [""],
            })) || [];

            // Ensure always 3 modules
            while (apiModules.length < 3) {
              apiModules.push({
                module_number: "",
                module_name: "",
                module_title: "",
                module_price_usd: "",
                module_price_inr: "",
                most_popular: false,
                plan_sub_title: [""],
              });
            }

            return apiModules;
          })(),
        }));

      } catch (error) {
        console.log("Error fetching live course:", error);
        toast.error("Failed to fetch course data");
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const instructorObj = {
        name: formData.instructor_name,
        qualification: formData.instructor_qualification,
        image: ""
      };

      const modulePayload = formData.modules
        .filter(mod => {
          const isNotEmpty =
            mod.module_number !== "" ||
            mod.module_name !== "" ||
            mod.module_title !== "" ||
            mod.module_price_usd !== "" ||
            mod.module_price_inr !== "" ||
            mod.plan_sub_title.some(s => s !== "");

          return isNotEmpty;
        })
        .map(mod => ({
          moduleNumber: (mod.module_number || 0),
          title: mod.module_name,
          subtitle: mod.module_title,
          description: "",
          price_usd: Number(mod.module_price_usd || 0),  // ✅ Send USD price
          price_inr: Number(mod.module_price_inr || 0),  // ✅ Send INR price
          features: mod.plan_sub_title.filter(x => x !== ""),
          isMostPopular: mod.most_popular
        }));

      // ✅ Validate that each module has both prices
      for (let i = 0; i < modulePayload.length; i++) {
        if (!modulePayload[i].price_usd || !modulePayload[i].price_inr) {
          toast.error(`Module ${i + 1} must have both USD and INR prices`);
          setIsSubmitting(false);
          return;
        }
      }

      const body = {
        course_title: formData.title,
        date: formData.date,
        instructor_name: formData.instructor_name,
        status: formData.status,
        isSoldOut: formData.soldOut,
        duration: formData.duration,
        zoom_link: formData.zoom_link,
        tags: formData.tags.filter((t) => t.trim() !== ""),
        instructor: instructorObj,
        choose_plan_list: modulePayload
      };

      console.log("FINAL BODY SENDING:", body);

      let res;
      if (id) {
        res = await api.put(`${endPointApi.updateLiveCourses}/${id}`, body);
        toast.success(res.data?.message);
      } else {
        res = await api.post(`${endPointApi.createLiveCourses}`, body);
        toast.success(res.data?.message);
      }
      router.push("/liveCourses");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong! Please try again.");
      console.log("Submission error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <ComponentCard title="Add Live Courses" name="">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>Course Title</Label>
                <Input
                  placeholder="Enter course title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Instructor Name</Label>
                <Input
                  placeholder="Enter instructor name"
                  type="text"
                  name="instructor_name"
                  value={formData.instructor_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Instructor Qualification</Label>
                <Input
                  placeholder="Enter instructor qualification"
                  type="text"
                  name="instructor_qualification"
                  value={formData.instructor_qualification}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>Duration</Label>
                <Input
                  type="text"
                  placeholder="Enter duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Zoom Link</Label>
                <Input
                  placeholder="Enter zoom link"
                  type="text"
                  name="zoom_link"
                  value={formData.zoom_link}
                  onChange={handleChange}
                />
              </div>
              <div>
                <DatePicker
                  id="date-picker"
                  label="Date Picker Input"
                  placeholder="Select a date"
                  defaultDate={formData.date}
                  onChange={handleDateChange}
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <Label>Instructor Tags</Label>
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-[#FFCA00] text-white w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#FFCA00] transition-colors duration-200"
                >
                  <FaPlus />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.tags.map((tag, i) => (
                  <div key={i} className="relative">
                    <Input
                      type="text"
                      placeholder={`Tag ${i + 1}`}
                      value={tag}
                      onChange={(e) => handleTagChange(i, e.target.value)}
                    />

                    {formData.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTag(i)}
                        className="absolute right-3 top-[22px] transform -translate-y-1/2 
                       border border-[#FFCA00] text-[#FFCA00] w-8 h-8 rounded-md 
                       flex items-center justify-center hover:bg-[#FFCA00] 
                       hover:text-white transition-colors duration-200"
                      >
                        <FaMinus />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Status</Label>
                <div className="flex flex-wrap items-center gap-8 mt-2">
                  <Radio
                    id="status_live"
                    label="live"
                    name="status"
                    value="live"
                    checked={formData.status === "live"}
                    onChange={() => handleRadioChange("live")}
                  />
                  <Radio
                    id="status_recorded"
                    label="recorded"
                    name="status"
                    value="recorded"
                    checked={formData.status === "recorded"}
                    onChange={() => handleRadioChange("recorded")}
                  />
                  <Radio
                    id="status_upcoming"
                    label="upcoming"
                    name="status"
                    value="upcoming"
                    checked={formData.status === "upcoming"}
                    onChange={() => handleRadioChange("upcoming")}
                  />
                </div>
              </div>

              <div>
                <Label>Sold Out</Label>
                <Checkbox
                  checked={formData.soldOut}
                  onChange={(checked: boolean) =>
                    setFormData(prev => ({ ...prev, soldOut: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* MODULE SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {formData.modules.map((module, mIndex) => (
          <ComponentCard key={mIndex} title={`Module ${mIndex + 1}`}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>Module Number</Label>
                  <Input
                    value={module.module_number}
                    onChange={(e) =>
                      handleModuleChange(mIndex, "module_number", e.target.value)
                    }
                    placeholder="Module number"
                  />
                </div>
                <div>
                  <Label>Module Name</Label>
                  <Input
                    value={module.module_name}
                    onChange={(e) =>
                      handleModuleChange(mIndex, "module_name", e.target.value)
                    }
                    placeholder="Module name"
                  />
                </div>
                <div>
                  <Label>Module Title</Label>
                  <Input
                    value={module.module_title}
                    onChange={(e) =>
                      handleModuleChange(mIndex, "module_title", e.target.value)
                    }
                    placeholder="Module title"
                  />
                </div>
              </div>

              {/* ✅ DUAL CURRENCY PRICE FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Module Price (USD)</Label>
                  <Input
                    type="number"
                    placeholder="Enter USD price"
                    value={module.module_price_usd}
                    onChange={(e) =>
                      handleModuleChange(mIndex, "module_price_usd", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Module Price (INR)</Label>
                  <Input
                    type="number"
                    placeholder="Enter INR price"
                    value={module.module_price_inr}
                    onChange={(e) =>
                      handleModuleChange(mIndex, "module_price_inr", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Most Popular</Label>
                <Checkbox
                  checked={module.most_popular}
                  onChange={() => handlePopularChange(mIndex)}
                  label="Most Popular"
                />
              </div>

              {/* SUB-TITLES */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Sub Titles</Label>
                  <button
                    onClick={() => addSubTitle(mIndex)}
                    className="bg-[#FFCA00] text-white w-8 h-8 rounded-md flex items-center justify-center"
                  >
                    <FaPlus />
                  </button>
                </div>

                {module.plan_sub_title.map((sub, sIndex) => (
                  <div key={sIndex} className="relative mb-4">
                    <Input
                      value={sub}
                      placeholder={`Sub Title ${sIndex + 1}`}
                      onChange={(e) =>
                        handleSubTitleChange(mIndex, sIndex, e.target.value)
                      }
                      className="pr-10"
                    />

                    {module.plan_sub_title.length > 1 && (
                      <button
                        onClick={() => removeSubTitle(mIndex, sIndex)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 border border-[#FFCA00] w-7 h-7 text-[#FFCA00] rounded-md flex items-center justify-center"
                      >
                        <FaMinus />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ComponentCard>
        ))}
      </div>

      <div className="flex items-center gap-5 mt-5">
        <Button size="sm" variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => router.push("/liveCourses")}>
          Cancel
        </Button>
      </div>
    </>
  );
};

export default LiveCourses;