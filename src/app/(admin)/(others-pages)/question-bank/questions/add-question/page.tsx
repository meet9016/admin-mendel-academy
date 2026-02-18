"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import dynamic from "next/dynamic";
import type { EditorTextChangeEvent } from "primereact/editor";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import { toast } from "react-toastify";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

const Editor = dynamic(() => import("primereact/editor").then((m) => m.Editor), { ssr: false });

type MCQOption = {
  id: string;
  text: string;
  explanation: string;
  showExplanation?: boolean;
};

// Skeleton Component
function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="mb-4">
        <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
      <ComponentCard title="" name="">
        <div className="space-y-6">
          {/* Question Field Skeleton */}
          <div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-[200px] bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"></div>
          </div>

          {/* MCQ Options Section Skeleton */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
            
            <div className="space-y-3">
              {/* Option 1 Skeleton */}
              <div className="flex gap-3 items-start">
                <div className="w-full space-y-2">
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                </div>
              </div>

              {/* Option 2 Skeleton */}
              <div className="flex gap-3 items-start">
                <div className="w-full space-y-2">
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Correct Answer Select Skeleton */}
          <div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>

          {/* Description Skeleton */}
          <div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-[200px] bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"></div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex items-center gap-5">
            <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}

function AddQuestionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const topicId = searchParams.get("topicId");
  const chapterId = searchParams.get("chapterId");
  const subjectId = searchParams.get("subjectId");

  const [question, setQuestion] = useState("");
  const [mcqOptions, setMcqOptions] = useState<MCQOption[]>([{ 
    id: "1", 
    text: "", 
    explanation: "",
    showExplanation: false 
  }]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const questionRef = useRef(question);
  const descriptionRef = useRef(description);

  useEffect(() => {
    questionRef.current = question;
  }, [question]);

  useEffect(() => {
    descriptionRef.current = description;
  }, [description]);

  useEffect(() => {
    if (id) {
      fetchQuestionById();
    }
  }, [id]);

  const fetchQuestionById = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`${endPointApi.getByIdQuestionBank}/${id}`);
      const questionData = data.data || data;
      setQuestion(decodeHtmlEntities(questionData.question || ""));
      setMcqOptions(
        questionData.options?.map((opt: string, idx: number) => ({
          id: (idx + 1).toString(),
          text: opt,
          explanation: decodeHtmlEntities(questionData.optionExplanations?.[idx] || ""),
          showExplanation: false
        })) || [{ id: "1", text: "", explanation: "", showExplanation: false }]
      );
      setCorrectAnswer(questionData.correctAnswer || "");
      setDescription(decodeHtmlEntities(questionData.description || ""));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch question");
    } finally {
      setIsLoading(false);
    }
  };

  const decodeHtmlEntities = (html: string) => {
    if (!html) return "";
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  // Function to strip HTML tags for display in select dropdown
  const stripHtmlTags = (html: string) => {
    if (!html) return "";
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleQuestionChange = useCallback((e: EditorTextChangeEvent) => {
    const newValue = e.htmlValue || "";
    if (newValue !== questionRef.current) {
      setQuestion(newValue);
    }
  }, []);

  const handleDescriptionChange = useCallback((e: EditorTextChangeEvent) => {
    const newValue = e.htmlValue || "";
    if (newValue !== descriptionRef.current) {
      setDescription(newValue);
    }
  }, []);

  const addMCQOption = () => {
    setMcqOptions([...mcqOptions, { 
      id: Date.now().toString(), 
      text: "", 
      explanation: "",
      showExplanation: false 
    }]);
  };

  const removeMCQOption = (id: string) => {
    if (mcqOptions.length > 1) {
      setMcqOptions(mcqOptions.filter((opt) => opt.id !== id));
    }
  };

  const updateMCQOption = (id: string, text: string) => {
    setMcqOptions(mcqOptions.map((opt) => (opt.id === id ? { ...opt, text } : opt)));
    if (errors.options) {
      setErrors(prev => ({ ...prev, options: "" }));
    }
  };

  const updateMCQOptionExplanation = (id: string, explanation: string) => {
    setMcqOptions(mcqOptions.map((opt) => (opt.id === id ? { ...opt, explanation } : opt)));
  };

  const toggleExplanation = (id: string) => {
    setMcqOptions(mcqOptions.map((opt) => 
      opt.id === id ? { ...opt, showExplanation: !opt.showExplanation } : opt
    ));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!question.trim() || question === "<p></p>") newErrors.question = "Question is required";
    const validOptions = mcqOptions.filter((opt) => opt.text.trim());
    if (validOptions.length < 2) newErrors.options = "At least 2 options are required";
    if (!correctAnswer.trim()) newErrors.correctAnswer = "Correct answer is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const validOptions = mcqOptions.filter((opt) => opt.text.trim());

    const payload = {
      question,
      options: validOptions.map((opt) => opt.text),
      correctAnswer,
      description,
      topic: topicId,
      optionExplanations: validOptions.map((opt) =>
        opt.text === correctAnswer ? "" : opt.explanation || ""
      ),
    };

    setIsSubmitting(true);
    try {
      if (id) {
        const res = await api.patch(`${endPointApi.updateQuestionBank}/${id}`, payload);
        toast.success(res.data?.message || "Question updated successfully");
      } else {
        const res = await api.post(`${endPointApi.createQuestionBank}`, payload);
        toast.success(res.data?.message || "Question created successfully");
      }
      router.push(`/question-bank/questions?topicId=${topicId}&chapterId=${chapterId}&subjectId=${subjectId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save question");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show skeleton while loading
  if (isLoading) {
    return <FormSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <button
          onClick={() => router.push(`/question-bank/questions?topicId=${topicId}&chapterId=${chapterId}&subjectId=${subjectId}`)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          ← Back
        </button>
      </div>
      <ComponentCard title={id ? "Edit Question" : "Add Question"} name="">
        <div className="space-y-6">
          <div>
            <Label>Question</Label>
            <Editor
              value={question}
              onTextChange={handleQuestionChange}
              style={{ height: "200px" }}
              className={`${errors.question ? "border border-error-500" : "border border-gray-300"}`}
            />
            {errors.question && <p className="text-sm text-error-500 mt-1">{errors.question}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <Label>MCQ Options</Label>
              <Button size="sm" variant="outline" onClick={addMCQOption}>
                + Add Option
              </Button>
            </div>
            <div className="space-y-3">
              {mcqOptions.map((option, index) => (
                <div key={option.id} className="flex gap-3 items-start">
                  <div className="w-full space-y-2">
                    <div className="flex gap-3 items-center">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-8">
                        {index + 1}.
                      </span>
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => updateMCQOption(option.id, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
                      />
                      {mcqOptions.length > 1 && (
                        <button
                          onClick={() => removeMCQOption(option.id)}
                          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    {/* Show "Why this is wrong" button only if option is not correct answer */}
                    {option.text.trim() && option.text !== correctAnswer && (
                      <div className="ml-8">
                        <button
                          type="button"
                          onClick={() => toggleExplanation(option.id)}
                          className="flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600 font-medium mb-2"
                        >
                          {option.showExplanation ? (
                            <>
                              <FaChevronUp size={16} />
                              Hide explanation
                            </>
                          ) : (
                            <>
                              <FaChevronDown size={16} />
                              Why this is wrong
                            </>
                          )}
                        </button>
                        
                        {/* Accordion content */}
                        {option.showExplanation && (
                          <div className="mt-2 animate-slideDown">
                            <Label>Explain why this answer is incorrect</Label>
                            <Editor
                              value={option.explanation}
                              onTextChange={(e: EditorTextChangeEvent) =>
                                updateMCQOptionExplanation(option.id, e.htmlValue || "")
                              }
                              style={{ height: "120px" }}
                              className="border border-gray-300 dark:border-gray-600 mt-1"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {errors.options && <p className="text-sm text-error-500 mt-1">{errors.options}</p>}
          </div>

          <div>
            <Label>Correct Answer</Label>
            <select
              value={correctAnswer}
              onChange={(e) => {
                setCorrectAnswer(e.target.value);
                if (errors.correctAnswer) {
                  setErrors(prev => ({ ...prev, correctAnswer: "" }));
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select correct answer</option>
              {mcqOptions
                .filter((opt) => opt.text.trim())
                .map((option) => (
                  <option key={option.id} value={option.text}>
                    {stripHtmlTags(option.text)}
                  </option>
                ))}
            </select>
            {errors.correctAnswer && <p className="text-sm text-error-500 mt-1">{errors.correctAnswer}</p>}
          </div>

          <div>
            <Label>Description/Explanation</Label>
            <Editor
              value={description}
              onTextChange={handleDescriptionChange}
              style={{ height: "200px" }}
              className={`${errors.description ? "border border-error-500" : "border border-gray-300"}`}
            />
            {errors.description && <p className="text-sm text-error-500 mt-1">{errors.description}</p>}
          </div>

          <div className="flex items-center gap-5">
            <Button size="sm" variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/question-bank/questions?topicId=${topicId}&chapterId=${chapterId}&subjectId=${subjectId}`)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}

export default function AddQuestionPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <AddQuestionForm />
    </Suspense>
  );
}