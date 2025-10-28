"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import ComponentCard from "../common/ComponentCard";
import Radio from "../form/input/Radio";
import DatePicker from "../form/date-picker";

interface FormDataType {
  title: string;
  instructor_name: string;
  sub_scribe_student_count: string;
  zoom_link: string;
  date?: string;        // 👈 added
  status?: string;      // 👈 added
}
const LiveCourses = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    instructor_name: "",
    sub_scribe_student_count: "",
    zoom_link: "",
    date: "",     // 👈 optional default
    status: "",
  });


  const [errors, setErrors] = useState({
    title: "",
    instructor_name: "",
    sub_scribe_student_count: "",
    zoom_link: "",
    date: "",     // 👈 optional default
    status: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchById = async () => {
      try {
        if (!id) return;
        const res = await api.get(`${endPointApi.getByIdLiveCourses}/${id}`);
        const data = res.data || {};
        console.log("data", data);

        // Ensure duration is a string for select matching
        setFormData({
          title: data.course_title ?? "",
          date: data.date ?? "",
          instructor_name: data.instructor_name ?? "",
          status: data.status == "Active" ? "Active" : "Inactive",
          sub_scribe_student_count: data.sub_scribe_student_count ?? "",
          zoom_link: data.zoom_link ?? "",
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

  // 📅 Handle date selection
  const handleDateChange = (_dates: unknown, currentDateString: string) => {
    setFormData((prev) => ({ ...prev, date: currentDateString }));
  };

  // 🔘 Handle radio button selection
  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };
  const validate = () => {
    const newErrors = {
      title: "",
    instructor_name: "",
    sub_scribe_student_count: "",
    zoom_link: "",
    date: "",     // 👈 optional default
    status: "",
    };

    let isValid = true;

    if (!formData.title) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    // if (!formData.price) {
    //   newErrors.price = "Price is required";
    //   isValid = false;
    // }

    // if (!formData.duration) {
    //   newErrors.duration = "Please select a category";
    //   isValid = false;
    // }

    // if (!formData.description) {
    //   newErrors.description = "Description is required";
    //   isValid = false;
    // }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    const body = {
      course_title: formData.title,
      date: formData.date,
      instructor_name: formData.instructor_name,
      status: formData.status,
      sub_scribe_student_count: formData.sub_scribe_student_count,
      zoom_link: formData.zoom_link,
    };

    try {
      if (id) {
        await api.put(`${endPointApi.updateLiveCourses}/${id}`, body);
      } else {
        await api.post(`${endPointApi.createLiveCourses}`, body);
      }
      router.push("/liveCourses");
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="space-y-6">
      <ComponentCard title="Add Live Courses" name="">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <Label>Course Title</Label>
              <Input
                placeholder="Enter course title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                error={errors.title}
              />
              {errors.title && <p className="text-sm text-error-500 mt-1">{errors.title}</p>}
            </div>
            <div>
              <Label>Instructor Name</Label>
              <Input
                placeholder="Enter instructor name"
                type="text"
                value={formData.instructor_name}
                onChange={(e) => handleChange("instructor_name", e.target.value)}
                error={errors.instructor_name}
              />
              {errors.instructor_name && <p className="text-sm text-error-500 mt-1">{errors.instructor_name}</p>}
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
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description */}
            <div>
              <Label>Sub Scribe Student Count</Label>
              <Input
                placeholder="Enter zoom link"
                type="text"
                value={formData.sub_scribe_student_count}
                onChange={(e) => handleChange("sub_scribe_student_count", e.target.value)}
                error={errors.sub_scribe_student_count}
              />
              {errors.sub_scribe_student_count && <p className="text-sm text-error-500 mt-1">{errors.sub_scribe_student_count}</p>}
            </div>
            <div>
              <Label>Zoom Link</Label>
              {/* <TextArea
              rows={6}
              value={formData.description}
              onChange={(val) => handleChange("description", val)}
              error={errors.description}
            /> */}
              <Input
                placeholder="Enter zoom link"
                type="text"
                value={formData.zoom_link}
                onChange={(e) => handleChange("zoom_link", e.target.value)}
                error={errors.zoom_link}
              />
              {errors.zoom_link && <p className="text-sm text-error-500 mt-1">{errors.zoom_link}</p>}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-5">
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

export default LiveCourses;
