"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import { toast } from "react-toastify";

function AddTopicForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const chapterId = searchParams.get("chapterId");
  const subjectId = searchParams.get("subjectId");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    chapter: chapterId || "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTopicById();
    }
  }, [id]);

  const fetchTopicById = async () => {
    try {
      const { data } = await api.get(`${endPointApi.getByIdTopic}/${id}`);
      setFormData({
        name: data.data?.name || data.name || "",
        description: data.data?.description || data.description || "",
        chapter_id: chapterId || "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch topic");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Topic name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      if (id) {
        const res = await api.patch(`${endPointApi.updateTopic}/${id}`, formData);
        toast.success(res.data?.message || "Topic updated successfully");
      } else {
        const res = await api.post(`${endPointApi.createTopic}`, formData);
        toast.success(res.data?.message || "Topic created successfully");
      }
      router.push(`/question-bank/topics?chapterId=${chapterId}&subjectId=${subjectId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save topic");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <button
          onClick={() => router.push(`/question-bank/topics?chapterId=${chapterId}&subjectId=${subjectId}`)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          ← Back
        </button>
      </div>
      <ComponentCard title={id ? "Edit Topic" : "Add Topic"} name="">
        <div className="space-y-6">
          <div>
            <Label>Topic Name</Label>
            <Input
              name="name"
              type="text"
              placeholder="Enter topic name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
            />
            {errors.name && <p className="text-sm text-error-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label>Description</Label>
            <Input
              name="description"
              type="text"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
            />
            {errors.description && <p className="text-sm text-error-500 mt-1">{errors.description}</p>}
          </div>

          <div className="flex items-center gap-5">
            <Button size="sm" variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => router.push(`/question-bank/topics?chapterId=${chapterId}&subjectId=${subjectId}`)}>
              Cancel
            </Button>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}

export default function AddTopicPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddTopicForm />
    </Suspense>
  );
}
