"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import ComponentCard from "../common/ComponentCard";
import { toast } from "react-toastify";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("primereact/editor").then((mod) => mod.Editor), { ssr: false });
import type { EditorTextChangeEvent } from "primereact/editor";
import DropzoneComponent from "../blogs/DropZone";
import { FiPlus, FiTrash2 } from "react-icons/fi";

interface Lesson {
  name: string;
  video_link: string;
  image: string;
  tags: string[];
  full_title: string;
  description: string;
  imageFile?: File;
}

interface Topic {
  title: string;
  lessons: Lesson[];
}

interface Chapter {
  title: string;
  image: string;
  long_title: string;
  topics: Topic[];
  imageFile?: File;
}

interface FormDataType {
  exam_id: string;
  name: string;
  sku: string;
  title: string;
  description: string;
  image: string;
  slogan: string;
  chapters: Chapter[];
}

interface SubjectInfoFormProps {
  examId: string;
  existingSubjectId?: string | null;
  onSuccess?: () => void;
}

const SubjectInfoForm: React.FC<SubjectInfoFormProps> = ({
  examId,
  existingSubjectId,
  onSuccess,
}) => {
  const router = useRouter();

  // FIX 1: isEditMode ko state me rakhne ki zaroorat nahi
  // seedha prop se derive karo — koi stale value nahi rahegi
  const isEditMode = !!existingSubjectId;

  const [isLoading, setIsLoading] = useState(false); // FIX 2: true se false — pehle true tha isliye blank form flash hoti thi
  const [formData, setFormData] = useState<FormDataType>({
    exam_id: examId,
    name: "",
    sku: "",
    title: "",
    description: "",
    image: "",
    slogan: "",
    chapters: [],
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [chapterPreviews, setChapterPreviews] = useState<(string | null)[]>([]);
  const [lessonPreviews, setLessonPreviews] = useState<(string | null)[][][]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  const handleEditorChange = (e: EditorTextChangeEvent) => {
    setFormData((prev) => ({ ...prev, description: e.htmlValue || "" }));
    setErrors((prev: any) => ({ ...prev, description: "" }));
  };

  const addChapter = () => {
    setFormData((prev) => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        {
          title: "",
          image: "",
          long_title: "",
          topics: [
            {
              title: "",
              lessons: [
                { name: "", video_link: "", image: "", tags: [], full_title: "", description: "" },
              ],
            },
          ],
        },
      ],
    }));
    setChapterPreviews((prev) => [...prev, null]);
    setLessonPreviews((prev) => [...prev, [[null]]]);
  };

  const removeChapter = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== index),
    }));
    setChapterPreviews((prev) => prev.filter((_, i) => i !== index));
    setLessonPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const updateChapter = (index: number, field: keyof Chapter, value: any) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, i) => (i === index ? { ...ch, [field]: value } : ch)),
    }));
  };

  const addTopic = (chapterIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, i) =>
        i === chapterIndex
          ? {
            ...ch,
            topics: [
              ...ch.topics,
              {
                title: "",
                lessons: [
                  {
                    name: "",
                    video_link: "",
                    image: "",
                    tags: [],
                    full_title: "",
                    description: "",
                  },
                ],
              },
            ],
          }
          : ch
      ),
    }));
    setLessonPreviews((prev) => {
      const updated = [...prev];
      if (!updated[chapterIndex]) updated[chapterIndex] = [];
      updated[chapterIndex].push([null]);
      return updated;
    });
  };

  const removeTopic = (chapterIndex: number, topicIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, i) =>
        i === chapterIndex
          ? { ...ch, topics: ch.topics.filter((_, j) => j !== topicIndex) }
          : ch
      ),
    }));
    setLessonPreviews((prev) => {
      const updated = [...prev];
      if (updated[chapterIndex]) {
        updated[chapterIndex] = updated[chapterIndex].filter((_, j) => j !== topicIndex);
      }
      return updated;
    });
  };

  const updateTopic = (
    chapterIndex: number,
    topicIndex: number,
    field: keyof Topic,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, i) =>
        i === chapterIndex
          ? {
            ...ch,
            topics: ch.topics.map((t, j) =>
              j === topicIndex ? { ...t, [field]: value } : t
            ),
          }
          : ch
      ),
    }));
  };

  const handleChapterImageSelect = (chapterIndex: number, file: File) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, i) =>
        i === chapterIndex ? { ...ch, imageFile: file } : ch
      ),
    }));
    const imageUrl = URL.createObjectURL(file);
    setChapterPreviews((prev) => prev.map((p, i) => (i === chapterIndex ? imageUrl : p)));
  };

  const handleLessonImageSelect = (
    chapterIndex: number,
    topicIndex: number,
    lessonIndex: number,
    file: File
  ) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, i) =>
        i === chapterIndex
          ? {
            ...ch,
            topics: ch.topics.map((t, j) =>
              j === topicIndex
                ? {
                  ...t,
                  lessons: t.lessons.map((l, k) =>
                    k === lessonIndex ? { ...l, imageFile: file } : l
                  ),
                }
                : t
            ),
          }
          : ch
      ),
    }));
    const imageUrl = URL.createObjectURL(file);
    setLessonPreviews((prev) => {
      const updated = [...prev];
      if (!updated[chapterIndex]) updated[chapterIndex] = [];
      if (!updated[chapterIndex][topicIndex]) updated[chapterIndex][topicIndex] = [];
      updated[chapterIndex][topicIndex][lessonIndex] = imageUrl;
      return updated;
    });
  };

  const addLesson = (chapterIndex: number, topicIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, i) =>
        i === chapterIndex
          ? {
            ...ch,
            topics: ch.topics.map((t, j) =>
              j === topicIndex
                ? {
                  ...t,
                  lessons: [
                    ...t.lessons,
                    {
                      name: "",
                      video_link: "",
                      image: "",
                      tags: [],
                      full_title: "",
                      description: "",
                    },
                  ],
                }
                : t
            ),
          }
          : ch
      ),
    }));
    setLessonPreviews((prev) => {
      const updated = [...prev];
      if (!updated[chapterIndex]) updated[chapterIndex] = [];
      if (!updated[chapterIndex][topicIndex]) updated[chapterIndex][topicIndex] = [];
      updated[chapterIndex][topicIndex].push(null);
      return updated;
    });
  };

  const removeLesson = (chapterIndex: number, topicIndex: number, lessonIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, i) =>
        i === chapterIndex
          ? {
            ...ch,
            topics: ch.topics.map((t, j) =>
              j === topicIndex
                ? { ...t, lessons: t.lessons.filter((_, k) => k !== lessonIndex) }
                : t
            ),
          }
          : ch
      ),
    }));
    setLessonPreviews((prev) => {
      const updated = [...prev];
      if (updated[chapterIndex]?.[topicIndex]) {
        updated[chapterIndex][topicIndex] = updated[chapterIndex][topicIndex].filter(
          (_, k) => k !== lessonIndex
        );
      }
      return updated;
    });
  };

  const updateLesson = (
    chapterIndex: number,
    topicIndex: number,
    lessonIndex: number,
    updatedLesson: Lesson
  ) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, i) =>
        i === chapterIndex
          ? {
            ...ch,
            topics: ch.topics.map((t, j) =>
              j === topicIndex
                ? {
                  ...t,
                  lessons: t.lessons.map((l, k) =>
                    k === lessonIndex ? updatedLesson : l
                  ),
                }
                : t
            ),
          }
          : ch
      ),
    }));
  };

  // FIX 3: useEffect — existingSubjectId pe depend karo, subjectId variable pe nahi
  // Jab bhi existingSubjectId change hoga (add -> edit ya edit -> dusra edit), fresh data load hoga
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (existingSubjectId) {
          // EDIT MODE: API se data fetch karo
          const res = await api.get(`${endPointApi.getByIdSubjectInfo}/${existingSubjectId}`);
          const data = res.data?.data;

          if (data) {
            const chapters = (data.chapters || []).map((chapter: any) => ({
              ...chapter,
              topics: (chapter.topics || []).map((topic: any) => ({
                ...topic,
                lessons: (topic.lessons || []).map((lesson: any) => ({
                  name: lesson.name || "",
                  video_link: lesson.video_link || "",
                  image: lesson.image || "",
                  tags: lesson.tags || [],
                  full_title: lesson.full_title || "",
                  description: lesson.description || "",
                })),
              })),
            }));

            setFormData({
              exam_id: data.exam_id?._id || data.exam_id || examId || "",
              name: data.name || "",
              sku: data.sku || "",
              title: data.title || "",
              description: data.description || "",
              image: data.image || "",
              slogan: data.slogan || "",
              chapters,
            });

            if (data.image) setPreview(data.image);

            setChapterPreviews(chapters.map((ch: Chapter) => ch.image || null));

            const lessonPreviewsArray: (string | null)[][][] = [];
            chapters.forEach((ch: any, ci: number) => {
              lessonPreviewsArray[ci] = [];
              ch.topics.forEach((t: any, ti: number) => {
                lessonPreviewsArray[ci][ti] = [];
                t.lessons.forEach((l: any, li: number) => {
                  lessonPreviewsArray[ci][ti][li] = l.image || null;
                });
              });
            });
            setLessonPreviews(lessonPreviewsArray);
          }
        } else {
          // ADD MODE: form reset karo
          setFormData({
            exam_id: examId,
            name: "",
            sku: "",
            title: "",
            description: "",
            image: "",
            slogan: "",
            chapters: [],
          });
          setPreview(null);
          setMainImage(null);
          setChapterPreviews([]);
          setLessonPreviews([]);
        }
      } catch (err) {
        console.error("Error fetching subject data:", err);
        toast.error("Failed to load subject data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [existingSubjectId]); // FIX 4: sirf existingSubjectId pe depend karo

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const form = new FormData();

      // FIX 1: Properly handle exam_id - extract string value if it's an object
      let examIdValue = formData.exam_id;
      if (typeof formData.exam_id === "object" && formData.exam_id !== null) {
        examIdValue = (formData.exam_id as any).id || (formData.exam_id as any)._id || "";
      }
      form.append("exam_id", examIdValue as string);
      
      form.append("name", formData.name);
      form.append("sku", formData.sku);
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("slogan", formData.slogan);

      const chaptersForSubmit = formData.chapters
        .filter((ch) => ch.title.trim() !== "")
        .map(({ imageFile, ...chapter }) => ({
          ...chapter,
          topics: chapter.topics
            .filter((t) => t.title.trim() !== "")
            .map((t) => ({
              ...t,
              lessons: t.lessons
                .filter((l) => l.name.trim() !== "")
                .map(({ imageFile, ...l }) => l),
            })),
        }));

      form.append("chapters", JSON.stringify(chaptersForSubmit));

      if (mainImage) form.append("image", mainImage);

      formData.chapters.forEach((ch, ci) => {
        if (ch.imageFile) form.append(`chapter_image_${ci}`, ch.imageFile);
        ch.topics.forEach((t, ti) => {
          t.lessons.forEach((l, li) => {
            if (l.imageFile) form.append(`lesson_image_${ci}_${ti}_${li}`, l.imageFile);
          });
        });
      });

      // FIX 2: Only append id for update, not for create
      if (isEditMode && existingSubjectId) {
        form.append("id", existingSubjectId);
      }

      let res;
      if (isEditMode) {
        // UPDATE: Use PUT endpoint
        res = await api.put(`${endPointApi.updateSubjectInfo}`, form);
      } else {
        // CREATE: Use POST endpoint
        res = await api.post(`${endPointApi.createSubjectInfo}`, form);
      }

      toast.success(res.data?.message);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/medicalexamlist");
      }
    } catch (error: any) {
      console.error("Error submitting subject info:", error);
      // Show detailed error message from backend
      const errorMessage = error.response?.data?.message || "Something went wrong! Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <ComponentCard title={isEditMode ? "Edit Subject Info" : "Add Subject Info"} name="">
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Name *</Label>
              <Input
                type="text"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
              />
              {errors.name && <p className="text-sm text-error-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label>SKU</Label>
              <Input
                type="text"
                name="sku"
                placeholder="Enter SKU"
                value={formData.sku}
                onChange={handleChange}
                error={!!errors.sku}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                placeholder="Enter title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
              />
            </div>
            <div>
              <Label>Slogan</Label>
              <Input
                type="text"
                name="slogan"
                placeholder="Enter slogan"
                value={formData.slogan}
                onChange={handleChange}
                error={!!errors.slogan}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-start">
            <div>
              <Label>Description</Label>
              <Editor
                value={formData.description}
                onTextChange={handleEditorChange}
                style={{ height: "315px" }}
                className={`${errors.description ? "border border-error-500" : "border border-gray-100"}`}
              />
              {errors.description && (
                <p className="text-sm text-error-500 mt-1">{errors.description}</p>
              )}
            </div>
            <div>
              <Label>Select Image</Label>
              <DropzoneComponent
                preview={preview}
                setPreview={setPreview}
                onFileSelect={(file: File) => setMainImage(file)}
                // height={358}
              />
            </div>
          </div>

          {/* Chapters Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Chapters</h3>
              <button
                type="button"
                onClick={addChapter}
                className="bg-[#ffcb07] text-black px-4 py-2 rounded-md hover:bg-[#e6b800] flex items-center gap-2"
              >
                <FiPlus size={16} />
                Add Chapter
              </button>
            </div>

            {formData.chapters.map((chapter, chapterIndex) => (
              <div
                key={chapterIndex}
                className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-semibold">Chapter {chapterIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeChapter(chapterIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <Label>Title *</Label>
                    <Input
                      type="text"
                      placeholder="Enter chapter title"
                      value={chapter.title}
                      onChange={(e) => updateChapter(chapterIndex, "title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Long Title</Label>
                    <Input
                      type="text"
                      placeholder="Enter long title"
                      value={chapter.long_title}
                      onChange={(e) => updateChapter(chapterIndex, "long_title", e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Label>Chapter Image</Label>
                  <DropzoneComponent
                    preview={chapterPreviews[chapterIndex] || null}
                    setPreview={(url) => {
                      setChapterPreviews((prev) =>
                        prev.map((p, i) => (i === chapterIndex ? url : p))
                      );
                    }}
                    onFileSelect={(file: File) => handleChapterImageSelect(chapterIndex, file)}
                  />
                </div>

                {/* Topics Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-semibold">Topics</Label>
                    <button
                      type="button"
                      onClick={() => addTopic(chapterIndex)}
                      className="bg-[#ffcb07] text-black px-3 py-1 rounded text-sm hover:bg-[#e6b800] flex items-center gap-1"
                    >
                      <FiPlus size={14} />
                      Add Topic
                    </button>
                  </div>

                  {/* Topics — 1 per row, full width */}
                  <div>
                <div className="flex flex-col gap-4">
                  {chapter.topics.map((topic, topicIndex) => (
                    <div
                      key={topicIndex}
                      className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col"
                    >
                      {/* Topic header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Topic {topicIndex + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeTopic(chapterIndex, topicIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>

                      {/* Topic title input */}
                      <div className="mb-3">
                        <Input
                          type="text"
                          placeholder="Enter topic title"
                          value={topic.title}
                          onChange={(e) =>
                            updateTopic(chapterIndex, topicIndex, "title", e.target.value)
                          }
                        />
                      </div>

                      {/* Sub Topics */}
                      <div className="bg-gray-50 border border-gray-100 rounded p-3 flex flex-col flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-gray-600">Sub Topics</span>
                              <button
                                type="button"
                                onClick={() => addLesson(chapterIndex, topicIndex)}
                                className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200 flex items-center gap-1"
                              >
                                <FiPlus size={11} /> Add Sub Topic
                              </button>
                            </div>

                            {/* Sub topics grid — 2 columns */}
                            <div>
                              <div className="grid grid-cols-2 gap-2">
                                {topic.lessons.map((lesson, lessonIndex) => (
                                  <div
                                    key={lessonIndex}
                                    className="bg-white border border-gray-200 rounded p-2"
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-[10px] font-medium text-gray-400">#{lessonIndex + 1}</span>
                                      <button
                                        type="button"
                                        onClick={() => removeLesson(chapterIndex, topicIndex, lessonIndex)}
                                        className="text-red-400 hover:text-red-600"
                                      >
                                        <FiTrash2 size={12} />
                                      </button>
                                    </div>
                                    <Input
                                      type="text"
                                      placeholder="Sub topic name"
                                      value={lesson.name}
                                      onChange={(e) =>
                                        updateLesson(chapterIndex, topicIndex, lessonIndex, {
                                          ...lesson,
                                          name: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-5 mt-6">
          <Button size="sm" variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Save"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (onSuccess) {
                onSuccess();
              } else {
                router.push("/medicalexamlist");
              }
            }}
          >
            Cancel
          </Button>
        </div>
      </ComponentCard>
    </div>
  );
};

export default SubjectInfoForm;