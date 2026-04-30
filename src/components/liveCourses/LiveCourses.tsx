"use client";

import React, { useEffect, useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import ComponentCard from "../common/ComponentCard";
import Radio from "../form/input/Radio";
import DatePicker from "../form/date-picker";
import { FaMinus, FaPlus, FaBook, FaInfoCircle, FaUserTie, FaImages, FaLayerGroup, FaGraduationCap } from "react-icons/fa";
import Checkbox from "../form/input/Checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import { toast } from "react-toastify";
import { LiveCoursesSkeleton } from "../skeltons/Skeltons";
import DropzoneComponent from "../blogs/DropZone";

interface ModuleType {
  module_number: number | string;
  module_name: string;
  module_title: string;
  module_price_usd: string;
  module_price_inr: string;
  most_popular: boolean;
  plan_sub_title: string[];
}

interface FormDataType {
  title: string;
  hero_subtitle: string;
  course_image: string;
  students_enrolled: string;
  left_this_week: string;
  master_features: string[];
  course_includes: string[];
  instructor_name: string;
  instructor_qualification: string;
  instructor_experience: string;
  instructor_students_taught: string;
  instructor_quote: string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    hero_subtitle: "",
    course_image: "",
    students_enrolled: "",
    left_this_week: "",
    master_features: [""],
    course_includes: [""],
    instructor_name: "",
    instructor_qualification: "",
    instructor_experience: "",
    instructor_students_taught: "",
    instructor_quote: "",
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

  const [preview, setPreview] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<File | null>(null);

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

  const addMasterFeature = () => {
    setFormData((prev) => ({ ...prev, master_features: [...prev.master_features, ""] }));
  };

  const handleMasterFeatureChange = (i: number, value: string) => {
    const features = [...formData.master_features];
    features[i] = value;
    setFormData((prev) => ({ ...prev, master_features: features }));
  };

  const removeMasterFeature = (i: number) => {
    setFormData((prev) => ({
      ...prev,
      master_features: prev.master_features.filter((_, idx) => idx !== i),
    }));
  };

  const addCourseInclude = () => {
    setFormData((prev) => ({ ...prev, course_includes: [...prev.course_includes, ""] }));
  };

  const handleCourseIncludeChange = (i: number, value: string) => {
    const includes = [...formData.course_includes];
    includes[i] = value;
    setFormData((prev) => ({ ...prev, course_includes: includes }));
  };

  const removeCourseInclude = (i: number) => {
    setFormData((prev) => ({
      ...prev,
      course_includes: prev.course_includes.filter((_, idx) => idx !== i),
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
      try {
        if (id) {
          const res = await api.get(`${endPointApi.getByIdLiveCourses}/${id}`);
          const data = res.data.data;

          setFormData((prev) => ({
            ...prev,
            title: data.course_title ?? "",
            hero_subtitle: data.hero_subtitle ?? "",
            course_image: data.course_image ?? "",
            students_enrolled: data.students_enrolled ?? "",
            left_this_week: data.left_this_week ?? "",
            master_features: data.master_features ?? [""],
            course_includes: data.course_includes ?? [""],
            instructor_name: data.instructor?.name ?? "",
            instructor_qualification: data.instructor?.qualification ?? "",
            instructor_experience: data.instructor?.experience ?? "",
            instructor_students_taught: data.instructor?.students_taught ?? "",
            instructor_quote: data.instructor?.quote ?? "",
            duration: data.duration ?? "",
            zoom_link: data.zoom_link ?? "",
            date: data.date ?? "",
            tags: data.tags ?? [""],
            status: data.status ?? "",
            soldOut: data.isSoldOut ?? false,

            modules: (() => {
              const apiModules = data.choose_plan_list?.map((m: any) => ({
                module_number: m.moduleNumber ?? "",
                module_name: m.title ?? "",
                module_title: m.subtitle ?? "",
                module_price_usd: m.price_usd ?? "",
                module_price_inr: m.price_inr ?? "",
                most_popular: m.isMostPopular ?? false,
                plan_sub_title: m.features?.length ? m.features : [""],
              })) || [];

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

          if (data.course_image) {
            setPreview(data.course_image);
          }
        } else {
          // Create mode - set default empty form
          setFormData({
            title: "",
            hero_subtitle: "",
            course_image: "",
            students_enrolled: "",
            left_this_week: "",
            master_features: [""],
            course_includes: [""],
            instructor_name: "",
            instructor_qualification: "",
            instructor_experience: "",
            instructor_students_taught: "",
            instructor_quote: "",
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
        }
      } catch (error) {
        console.log("Error fetching live course:", error);
        toast.error("Failed to fetch course data");
      } finally {
        // Minimum loading time for better UX
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      let uploadedImageUrl = formData.course_image;
      if (mainImage) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", mainImage);
        const resUpload = await api.post(endPointApi.uploadImageForExcel!, formDataUpload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (resUpload.data.success) {
          uploadedImageUrl = resUpload.data.file_url;
        }
      }

      const instructorObj = {
        name: formData.instructor_name,
        qualification: formData.instructor_qualification,
        experience: formData.instructor_experience,
        students_taught: formData.instructor_students_taught,
        quote: formData.instructor_quote,
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
          price_usd: Number(mod.module_price_usd || 0),
          price_inr: Number(mod.module_price_inr || 0),
          features: mod.plan_sub_title.filter(x => x !== ""),
          isMostPopular: mod.most_popular
        }));

      for (let i = 0; i < modulePayload.length; i++) {
        if (!modulePayload[i].price_usd || !modulePayload[i].price_inr) {
          toast.error(`Module ${i + 1} must have both USD and INR prices`);
          setIsSubmitting(false);
          return;
        }
      }

      const body = {
        course_title: formData.title,
        hero_subtitle: formData.hero_subtitle,
        course_image: uploadedImageUrl,
        students_enrolled: formData.students_enrolled,
        left_this_week: formData.left_this_week,
        master_features: formData.master_features.filter(f => f.trim() !== ""),
        course_includes: formData.course_includes.filter(i => i.trim() !== ""),
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

  // Show skeleton while loading
  if (isLoading) {
    return <LiveCoursesSkeleton />;
  }

  return (
    <div className="max-w-[1200px] mx-auto pb-20">

 <ComponentCard title={id ? "Edit Live Course" : "Add Live Courses"} name="">
      <div className="space-y-8">
        {/* SECTION 1: BASIC INFORMATION */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2 pb-2 border-b border-gray-50">
            <div className="w-10 h-10 rounded-xl bg-[#FFCA00]/10 flex items-center justify-center text-[#FFCA00]">
              <FaBook size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Course Title</Label>
                 <Input
                placeholder="Enter course title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Hero Subtitle</Label>
              <Input
                placeholder="Brief course overview for the hero section"
                type="text"
                name="hero_subtitle"
                value={formData.hero_subtitle}
                onChange={handleChange}
                className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: VISUALS & CORE METRICS */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2 pb-2 border-b border-gray-50">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <FaImages size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Visuals & Metrics</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Specimen Image */}
            <div className="lg:col-span-4 space-y-1">
              <Label className="text-gray-700 font-semibold">Course Specimen Image</Label>
              <DropzoneComponent
                preview={preview}
                setPreview={setPreview}
                onFileSelect={(file: File) => setMainImage(file)}
                className="h-[180px]"
              />
              <p className="text-xs text-gray-400">High-quality pathology images recommended (16:9 ratio)</p>
            </div>

            {/* Right: Core Metrics */}
            <div className="lg:col-span-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Students Enrolled</Label>
                  <Input
                    placeholder="Enter instructor qualification"
                    type="text"
                    name="students_enrolled"
                    value={formData.students_enrolled}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Left This Week</Label>
                  <Input
                    placeholder="e.g. 36"
                    type="text"
                    name="left_this_week"
                    value={formData.left_this_week}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Course Duration</Label>
                  <Input
                    type="text"
                    placeholder="e.g. 8 weeks"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <DatePicker
                    id="date-picker"
                    label="Next Session Date"
                    placeholder="Select date"
                    defaultDate={formData.date}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FaInfoCircle />
                  <span className="text-sm font-medium text-gray-600">These metrics are displayed in the feature cards.</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sold Out</span>
                     <Checkbox
                        checked={formData.soldOut}
                        onChange={(checked: boolean) =>
                          setFormData(prev => ({ ...prev, soldOut: checked }))
                        }
                      />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: INSTRUCTOR DETAILS */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2 pb-2 border-b border-gray-50">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
              <FaUserTie size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Instructor Profile</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Name</Label>
              <Input
                placeholder="Dr. Nandkishore Managoli"
                type="text"
                name="instructor_name"
                value={formData.instructor_name}
                onChange={handleChange}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Qualification</Label>
              <Input
                placeholder="MD, Senior Surgical Pathologist"
                type="text"
                name="instructor_qualification"
                value={formData.instructor_qualification}
                onChange={handleChange}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Experience</Label>
              <Input
                placeholder="e.g. 30+ Years Experience"
                type="text"
                name="instructor_experience"
                value={formData.instructor_experience}
                onChange={handleChange}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Students Taught</Label>
              <Input
                placeholder="e.g. 1000+ Students"
                type="text"
                name="instructor_students_taught"
                value={formData.instructor_students_taught}
                onChange={handleChange}
                className="h-12"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label className="text-gray-700 font-semibold">Instructor Quote</Label>
              <Input
                placeholder="A professional quote from the instructor"
                type="text"
                name="instructor_quote"
                value={formData.instructor_quote}
                onChange={handleChange}
                className="h-12"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: LOGISTICS & CATEGORY */}
        <div className="bg-white p-4  rounded-3xl shadow-sm border border-gray-100">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FFCA00]/10 flex items-center justify-center text-[#FFCA00]">
                    <FaLayerGroup size={16} />
                  </div>
                  <h3 className="font-bold text-gray-800">Course Status</h3>
                </div>
                <div className="flex items-center gap-6 p-2 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
                   <Radio
                      id="status_live"
                      label="Live"
                      name="status"
                      value="live"
                      checked={formData.status === "live"}
                      onChange={() => handleRadioChange("live")}
                    />
                    <Radio
                      id="status_recorded"
                      label="Recorded"
                      name="status"
                      value="recorded"
                      checked={formData.status === "recorded"}
                      onChange={() => handleRadioChange("recorded")}
                    />
                    <Radio
                      id="status_upcoming"
                      label="Upcoming"
                      name="status"
                      value="upcoming"
                      checked={formData.status === "upcoming"}
                      onChange={() => handleRadioChange("upcoming")}
                    />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-500">
                    <FaInfoCircle size={16} />
                  </div>
                  <h3 className="font-bold text-gray-800">Session Link</h3>
                </div>
                <Input
                  placeholder="Enter Zoom or Meeting Link"
                  type="text"
                  name="zoom_link"
                  value={formData.zoom_link}
                  onChange={handleChange}
                  className="h-10"
                />
              </div>
           </div>
        </div>

        {/* SECTION 5: CURRICULUM & FEATURES */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  
  {/* What You'll Master */}
  <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 h-[250px] flex flex-col">
    
    {/* Header */}
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-bold text-gray-800 flex items-center gap-2">
        <div className="w-2 h-6 bg-[#FFCA00] rounded-full"></div>
        What You'll Master
      </h3>
      <button
        type="button"
        onClick={addMasterFeature}
        className="bg-[#FFCA00] text-white w-8 h-8 rounded-md flex items-center justify-center transition-all hover:bg-[#FFB000]"
      >
        <FaPlus size={14} />
      </button>
    </div>

    {/* Scroll Area */}
    <div className="space-y-4 overflow-y-auto pr-2 flex-1">
      {formData.master_features.map((feature, i) => (
        <div key={i} className="relative group">
            <Input
              placeholder={`Outcome ${i + 1}`}
              value={feature}
              onChange={(e) =>
                handleMasterFeatureChange(i, e.target.value)
              }
              className="pr-10"
            />
          {formData.master_features.length > 1 && (
            <button
              type="button"
              onClick={() => removeMasterFeature(i)}
              className="absolute right-3 top-1/2 -translate-y-1/2 border border-[#FFCA00] w-7 h-7 text-[#FFCA00] rounded-md flex items-center justify-center hover:bg-[#FFCA00] hover:text-white transition-all"
            >
              <FaMinus size={12} />
            </button>
          )}
        </div>
      ))}
    </div>
  </div>

  {/* Course Includes */}
  <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 h-[250px] flex flex-col">
    
    {/* Header */}
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-bold text-gray-800 flex items-center gap-2">
        <div className="w-2 h-6 bg-[#FFCA00] rounded-full"></div>
        Course Includes
      </h3>
      <button
        type="button"
        onClick={addCourseInclude}
        className="bg-[#FFCA00] text-white w-8 h-8 rounded-md flex items-center justify-center transition-all hover:bg-[#FFB000]"
      >
        <FaPlus size={14} />
      </button>
    </div>

    {/* Scroll Area */}
    <div className="space-y-4 overflow-y-auto pr-2 flex-1">
      {formData.course_includes.map((include, i) => (
        <div key={i} className="relative group">
            <Input
              placeholder={`Benefit ${i + 1}`}
              value={include}
              onChange={(e) =>
                handleCourseIncludeChange(i, e.target.value)
              }
              className="pr-10"
            />
          {formData.course_includes.length > 1 && (
            <button
              type="button"
              onClick={() => removeCourseInclude(i)}
              className="absolute right-3 top-1/2 -translate-y-1/2 border border-[#FFCA00] w-7 h-7 text-[#FFCA00] rounded-md flex items-center justify-center hover:bg-[#FFCA00] hover:text-white transition-all"
            >
              <FaMinus size={12} />
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
</div>

        {/* Tags Section */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FaGraduationCap className="text-[#FFCA00]" />
                Instructor Tags
              </h3>
              <button 
                type="button" 
                onClick={addTag} 
                className="bg-[#FFCA00] text-white w-8 h-8 rounded-md flex items-center justify-center transition-all hover:bg-[#FFB000]"
              >
                <FaPlus size={14} />
              </button>
           </div>
           <div className="flex flex-wrap gap-4">
             {formData.tags.map((tag, i) => (
               <div key={i} className="relative group">
                 <input
                    type="text"
                    placeholder="Tag name"
                    value={tag}
                    onChange={(e) => handleTagChange(i, e.target.value)}
                    className="bg-gray-50 p-2 pr-10 rounded-xl border border-gray-100 text-sm font-medium w-36 focus:ring-2 focus:ring-[#FFCA00] outline-none transition-all"
                  />
                  {formData.tags.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeTag(i)} 
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <FaMinus size={10} />
                    </button>
                  )}
               </div>
             ))}
           </div>
        </div>
      </div>
</ComponentCard>
      {/* MODULE SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {formData.modules.map((module, mIndex) => (
          <ComponentCard key={mIndex} title={`Module ${mIndex + 1}`}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>Module Number</Label>
                  <Input
                    value={module.module_number as any}
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

              {/* DUAL CURRENCY PRICE FIELDS */}
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
          {isSubmitting ? "Saving..." : (id ? "Update" : "Save")}
        </Button>
        <Button size="sm" variant="outline" onClick={() => router.push("/liveCourses")}>
          Cancel
        </Button>
      </div>
    </div>
    
  );
};

export default LiveCourses;