import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { toast } from "react-toastify";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import DropzoneComponent from "../blogs/DropZone";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { Skeleton } from "primereact/skeleton";

import {
  GalaxyTool,
  GalaxyAppSectionData,
  mapGalaxySectionFromApi,
  buildGalaxySectionForSubmit,
  emptyTool,
  emptySampleQuestion,
  emptyOption,
  emptyFlashcardQA,
  emptyCard,
} from "./GalaxyAppSectionForm";

interface Props {
  examId: string;
  toolName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface ToolManagementFormRef {
  handleAddQuestion: () => void;
  handleAddFlashcard: () => void;
}

const ToolManagementForm = forwardRef<ToolManagementFormRef, Props>(({ examId, toolName, onSuccess, onCancel }, ref) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [examData, setExamData] = useState<any>(null);
  const [galaxySection, setGalaxySection] = useState<GalaxyAppSectionData | null>(null);
  const [tool, setTool] = useState<GalaxyTool | null>(null);

  const updateTool = (updater: (prev: GalaxyTool) => GalaxyTool) => {
    setTool((prev) => (prev ? updater(prev) : prev));
  };

  const handleAddQuestion = () => {
    updateTool((t) => ({ ...t, sampleQuestions: [...t.sampleQuestions, emptySampleQuestion()] }));
    setTimeout(() => {
        const elements = document.querySelectorAll('.sample-question-item');
        if (elements.length > 0) {
            elements[elements.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
  };

  const handleAddFlashcard = () => {
    updateTool((t) => ({ ...t, flashcardQA: [...t.flashcardQA, emptyFlashcardQA()] }));
    setTimeout(() => {
        const elements = document.querySelectorAll('.flashcard-qa-item');
        if (elements.length > 0) {
            elements[elements.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
  };

  useImperativeHandle(ref, () => ({
    handleAddQuestion,
    handleAddFlashcard
  }));

  useEffect(() => {
    if (examId && toolName) {
      fetchExamData();
    }
  }, [examId, toolName]);

  const fetchExamData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endPointApi.getByIdExamList}/${examId}`);
      const data = res.data || {};
      setExamData(data);

      const section = mapGalaxySectionFromApi(data);
      setGalaxySection(section);

      let existingTool = section.tools.find((t) => t.toolName === toolName);
      if (!existingTool) {
        existingTool = emptyTool(toolName);
      }
      setTool(existingTool);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tool data");
      onCancel?.();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!tool || !galaxySection || !examData) return;
    setSaving(true);
    try {
      const updatedTools = galaxySection.tools.map((t) =>
        t.toolName === toolName ? tool : t
      );
      if (!galaxySection.tools.find(t => t.toolName === toolName)) {
        updatedTools.push(tool);
      }
      const updatedSection = { ...galaxySection, tools: updatedTools };

      const formDataToSend = new FormData();
      
      const ex = examData.exams?.[0] || {};
      
      formDataToSend.append("exams[0][_id]", ex._id || examId);
      formDataToSend.append("category_name", examData.category_name || "");
      formDataToSend.append("exams[0][exam_name]", ex.exam_name || "");
      formDataToSend.append("exams[0][slug]", ex.slug || "");
      formDataToSend.append("exams[0][country]", ex.country || "");
      formDataToSend.append("exams[0][status]", ex.status || "Active");
      formDataToSend.append("exams[0][title]", ex.title || "");
      formDataToSend.append("exams[0][description]", ex.description || "");
      
      if (ex.sub_titles && Array.isArray(ex.sub_titles) && ex.sub_titles.length > 0) {
        ex.sub_titles.forEach((step: string, i: number) => {
          formDataToSend.append(`exams[0][sub_titles][${i}]`, step);
        });
      } else {
        formDataToSend.append(`exams[0][sub_titles][0]`, "");
      }

      formDataToSend.append("plan_section_title", examData.plan_section_title || "");
      formDataToSend.append("mentorship_tsunami_section_title", examData.mentorship_tsunami_section_title || "");
      formDataToSend.append("rapid_tools_section_title", examData.rapid_tools_section_title || "");
      
      formDataToSend.append("is_plan_visible", String(examData.is_plan_visible ?? true));
      formDataToSend.append("is_rapid_tools_visible", String(examData.is_rapid_tools_visible ?? true));

      // Re-append existing plans so they don't get lost
      if (examData.choose_plan_list && examData.choose_plan_list.length > 0) {
          examData.choose_plan_list.forEach((plan: any, i: number) => {
              formDataToSend.append(`choose_plan_list[${i}][_id]`, plan._id || "");
              formDataToSend.append(`choose_plan_list[${i}][plan_pricing_dollar]`, plan.plan_pricing_dollar || "");
              formDataToSend.append(`choose_plan_list[${i}][plan_pricing_inr]`, plan.plan_pricing_inr || "");
              formDataToSend.append(`choose_plan_list[${i}][plan_month]`, plan.plan_month || "");
              formDataToSend.append(`choose_plan_list[${i}][plan_type]`, plan.plan_type || "");
              formDataToSend.append(`choose_plan_list[${i}][plan_title]`, plan.plan_title || "");
              if (plan.plan_sub_title && Array.isArray(plan.plan_sub_title)) {
                  plan.plan_sub_title.forEach((sub: string, j: number) => {
                      formDataToSend.append(`choose_plan_list[${i}][plan_sub_title][${j}]`, sub);
                  });
              }
              formDataToSend.append(`choose_plan_list[${i}][most_popular]`, String(plan.most_popular || false));
          });
      }

      // Re-append existing rapid tools
      if (examData.rapid_learning_tools && examData.rapid_learning_tools.length > 0) {
          examData.rapid_learning_tools.forEach((rt: any, i: number) => {
              formDataToSend.append(`rapid_learning_tools[${i}][_id]`, rt._id || "");
              formDataToSend.append(`rapid_learning_tools[${i}][tool_type]`, rt.tool_type || "");
              formDataToSend.append(`rapid_learning_tools[${i}][price_usd]`, String(rt.price_usd || ""));
              formDataToSend.append(`rapid_learning_tools[${i}][price_inr]`, String(rt.price_inr || ""));
          });
      } else {
          formDataToSend.append('rapid_learning_tools', JSON.stringify([]));
      }

      // Re-append mentorship
      if (examData.elite_mentorship && examData.elite_mentorship.length > 0) {
          examData.elite_mentorship.forEach((em: any, i: number) => {
              formDataToSend.append(`elite_mentorship[${i}][_id]`, em._id || "");
              formDataToSend.append(`elite_mentorship[${i}][name]`, em.name || "");
              formDataToSend.append(`elite_mentorship[${i}][subtitle]`, em.subtitle || "");
              formDataToSend.append(`elite_mentorship[${i}][price_usd]`, String(em.price_usd || ""));
              formDataToSend.append(`elite_mentorship[${i}][price_inr]`, String(em.price_inr || ""));
          });
      } else {
          formDataToSend.append('elite_mentorship', JSON.stringify([]));
      }

      // Re-append tsunami
      if (examData.tsunami) {
          formDataToSend.append(`tsunami[name]`, examData.tsunami.name || "");
          formDataToSend.append(`tsunami[included_service_price_usd]`, String(examData.tsunami.included_service_price_usd || ""));
          formDataToSend.append(`tsunami[included_service_price_inr]`, String(examData.tsunami.included_service_price_inr || ""));
          formDataToSend.append(`tsunami[included_services]`, examData.tsunami.included_services || "");
          formDataToSend.append(`tsunami[description]`, examData.tsunami.description || "");
      }

      formDataToSend.append("who_can_enroll_title", examData.who_can_enroll_title || "");
      formDataToSend.append("who_can_enroll_description", examData.who_can_enroll_description || "");

      if (examData.sample_recorded_lectures) {
          formDataToSend.append("sample_recorded_lectures", JSON.stringify(examData.sample_recorded_lectures));
      }

      // Finally append Galaxy App Section
      formDataToSend.append(
        "galaxy_app_section",
        JSON.stringify(buildGalaxySectionForSubmit(updatedSection))
      );

      updatedSection.tools.forEach((t, ti) => {
        if (t.sampleImageFile) {
            formDataToSend.append(`galaxy_tool_sample_image_${ti}`, t.sampleImageFile);
        }
        t.cards.forEach((card, ci) => {
            if (card.imageFile) {
                formDataToSend.append(`galaxy_card_image_${ti}_${ci}`, card.imageFile);
            }
        });
      });

      await api.put(`${endPointApi.updateExamList}/${examId}`, formDataToSend);
      toast.success("Tool data updated successfully!");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update tool data");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !tool) {
    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <Skeleton width="150px" height="1.2rem" className="mb-2" />
                    <Skeleton width="100%" height="2.5rem" />
                </div>
                <div className="md:col-span-2">
                    <Skeleton width="150px" height="1.2rem" className="mb-2" />
                    <Skeleton width="100%" height="2.5rem" />
                </div>
                <div>
                    <Skeleton width="120px" height="1.2rem" className="mb-2" />
                    <Skeleton width="100%" height="2.5rem" />
                </div>
                <div>
                    <Skeleton width="120px" height="1.2rem" className="mb-2" />
                    <Skeleton width="100%" height="2.5rem" />
                </div>
                <div className="md:col-span-2">
                    <Skeleton width="100px" height="1.2rem" className="mb-2" />
                    <Skeleton width="100%" height="6rem" />
                </div>
            </div>
        </div>
    );
  }

  // Define visibility flags based on requirements
  const showBottomText = !["Mendel Qbanks", "Mendel Chitras", "Mendel Flashcards"].includes(toolName);
  const showTagline = !["Mendel Qbanks", "Mendel Chitras", "Mendel Flashcards"].includes(toolName);
  const showSampleImage = !["Mendel Qbanks", "Mendel Flashcards"].includes(toolName);
  const showSampleQuestions = !["Mendel Flashcards", "Mendel Chitras"].includes(toolName);
  const showChitraCards = ["Mendel Chitras"].includes(toolName);
  const showFlashcardQA = ["Mendel Flashcards"].includes(toolName);

  return (
    <div className="flex flex-col h-full relative">
      <div className="space-y-6 p-2 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <Label>Section Subtitle</Label>
                <Input
                    type="text"
                    placeholder="Subtitle..."
                    value={tool.sectionSubtitle}
                    onChange={(e: any) => updateTool((t) => ({ ...t, sectionSubtitle: e.target.value }))}
                />
            </div>
          
            {showBottomText && (
                <div className="md:col-span-2">
                    <Label>Bottom Scroll Text (optional)</Label>
                    <Input
                        type="text"
                        placeholder="Text to scroll at the bottom..."
                        value={tool.bottomText}
                        onChange={(e: any) => updateTool((t) => ({ ...t, bottomText: e.target.value }))}
                    />
                </div>
            )}

            {showTagline && (
                <div>
                    <Label>Tagline</Label>
                    <Input
                        type="text"
                        placeholder="STUDY TOOL"
                        value={tool.tagline}
                        onChange={(e: any) => updateTool((t) => ({ ...t, tagline: e.target.value }))}
                    />
                </div>
            )}

            <div>
                <Label>Individual Price</Label>
                <Input
                    type="text"
                    placeholder="$16.99"
                    value={tool.individualPrice}
                    onChange={(e: any) => updateTool((t) => ({ ...t, individualPrice: e.target.value }))}
                />
            </div>
            <div>
                <Label>Individual Price Subtext</Label>
                <Input
                    type="text"
                    placeholder="per subject / month"
                    value={tool.individualPer}
                    onChange={(e: any) => updateTool((t) => ({ ...t, individualPer: e.target.value }))}
                />
            </div>
            <div>
                <Label>Galaxy App Price</Label>
                <Input
                    type="text"
                    placeholder="From $309"
                    value={tool.galaxyPrice}
                    onChange={(e: any) => updateTool((t) => ({ ...t, galaxyPrice: e.target.value }))}
                />
            </div>
            <div>
                <Label>Galaxy App Price Subtext</Label>
                <Input
                    type="text"
                    placeholder="Everything included · 1 month+"
                    value={tool.galaxyPer}
                    onChange={(e: any) => updateTool((t) => ({ ...t, galaxyPer: e.target.value }))}
                />
            </div>
            
            <div className="md:col-span-2">
                <Label>Description</Label>
                <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[100px]"
                    placeholder="Tool description..."
                    value={tool.description}
                    onChange={(e: any) => updateTool((t) => ({ ...t, description: e.target.value }))}
                />
            </div>
        </div>

        {showSampleImage && (
            <div>
                <Label>Detail Sample Image</Label>
                <DropzoneComponent
                    preview={tool.sampleImageFile ? URL.createObjectURL(tool.sampleImageFile) : tool.sampleImage || null}
                    setPreview={() => {}}
                    className="h-40"
                    onFileSelect={(file: File) => updateTool((t) => ({ ...t, sampleImageFile: file }))}
                />
            </div>
        )}

        <div>
            <div className="flex items-center justify-between mb-4">
                <Label className="font-bold">What's Included (Features)</Label>
                <button
                    type="button"
                    onClick={() => updateTool((t) => ({ ...t, includedPoints: [...t.includedPoints, ""] }))}
                    className="bg-[#ffcb07] text-black px-3 py-1.5 flex items-center justify-center rounded-md text-sm font-semibold hover:bg-yellow-400 transition-colors"
                >
                    <FaPlus className="mr-2" /> Add Feature
                </button>
            </div>
            <div className="flex flex-wrap gap-4">
                {tool.includedPoints.map((point, pi) => (
                    <div key={pi} className="flex gap-2 mb-2 w-full md:w-[calc(20%-1rem)]">
                        <Input
                            type="text"
                            placeholder={`Feature ${pi + 1}`}
                            value={point}
                            onChange={(e: any) => updateTool((t) => {
                                const newPoints = [...t.includedPoints];
                                newPoints[pi] = e.target.value;
                                return { ...t, includedPoints: newPoints };
                            })}
                        />
                        {tool.includedPoints.length > 1 && (
                            <button
                                type="button"
                                onClick={() => updateTool((t) => ({
                                    ...t, includedPoints: t.includedPoints.filter((_, i) => i !== pi)
                                }))}
                                className="border border-red-400 text-red-500 min-w-[40px] w-10 h-[42px] rounded-md flex items-center justify-center hover:bg-red-50 transition-colors"
                            >
                                <FaMinus />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {showSampleQuestions && (
            <div className="">
                <div className="mb-4">
                    <Label className="text-sm font-bold text-gray-800 mb-0">Sample Questions / Content List</Label>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {tool.sampleQuestions.map((q, qi) => (
                        <div key={qi} className="sample-question-item bg-white p-4 rounded-md border border-gray-300 relative space-y-4 shadow-sm">
                            <button
                            type="button"
                            onClick={() => updateTool((t) => ({
                                ...t, sampleQuestions: t.sampleQuestions.filter((_, i) => i !== qi)
                            }))}
                            className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 border-2 border-white text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-colors z-10"
                        >
                            <IoClose size={16} />
                        </button>
                        
                        <div className="grid grid-cols-1 gap-2">
                            <div>
                                <Label>Question {qi + 1} Badge</Label>
                                <Input
                                    type="text"
                                    placeholder="Q1 · Cardiology · Medium"
                                    value={q.badge}
                                    onChange={(e: any) => updateTool((t) => {
                                        const sq = [...t.sampleQuestions];
                                        sq[qi] = { ...sq[qi], badge: e.target.value };
                                        return { ...t, sampleQuestions: sq };
                                    })}
                                />
                            </div>
                            <div>
                                <Label>Question {qi + 1} Text / Content</Label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[80px]"
                                    placeholder="Question text or content"
                                    value={q.question}
                                    onChange={(e: any) => updateTool((t) => {
                                        const sq = [...t.sampleQuestions];
                                        sq[qi] = { ...sq[qi], question: e.target.value };
                                        return { ...t, sampleQuestions: sq };
                                    })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-bold text-gray-600">Question {qi + 1} Options</Label>
                                <button
                                    type="button"
                                    onClick={() => updateTool((t) => {
                                        const sq = [...t.sampleQuestions];
                                        sq[qi] = { ...sq[qi], options: [...sq[qi].options, emptyOption()] };
                                        return { ...t, sampleQuestions: sq };
                                    })}
                                    className="bg-gray-200 text-black px-2 py-1 rounded text-xs flex items-center gap-1"
                                >
                                    <FaPlus /> Add Option
                                </button>
                            </div>
                            
                            {q.options.map((opt, oi) => (
                                <div key={oi} className="flex gap-2 items-center">
                                    <Input
                                        type="text"
                                        placeholder={`Option ${oi + 1}`}
                                        value={opt.text}
                                        onChange={(e: any) => updateTool((t) => {
                                            const sq = [...t.sampleQuestions];
                                            const opts = [...sq[qi].options];
                                            opts[oi] = { ...opts[oi], text: e.target.value };
                                            sq[qi] = { ...sq[qi], options: opts };
                                            return { ...t, sampleQuestions: sq };
                                        })}
                                    />
                                    <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={opt.isCorrect}
                                            onChange={(e: any) => updateTool((t) => {
                                                const sq = [...t.sampleQuestions];
                                                const opts = [...sq[qi].options];
                                                opts[oi] = { ...opts[oi], isCorrect: e.target.checked };
                                                sq[qi] = { ...sq[qi], options: opts };
                                                return { ...t, sampleQuestions: sq };
                                            })}
                                        />
                                        Correct
                                    </label>
                                    {q.options.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => updateTool((t) => {
                                                const sq = [...t.sampleQuestions];
                                                const opts = sq[qi].options.filter((_, i) => i !== oi);
                                                sq[qi] = { ...sq[qi], options: opts };
                                                return { ...t, sampleQuestions: sq };
                                            })}
                                            className="border border-red-400 text-red-500 w-10 h-10 rounded-md flex items-center justify-center"
                                        >
                                            <FaMinus />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                </div>
            </div>
        )}

        {showChitraCards && (
            <div className="">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-800">Chitras Carousel Cards</p>
                    <button
                        type="button"
                        onClick={() => updateTool((t) => ({ ...t, cards: [...t.cards, emptyCard()] }))}
                        className="bg-[#ffcb07] text-black px-3 py-1.5 flex mb-0.5 items-center gap-1 rounded-md text-sm font-semibold"
                    >
                        <FaPlus /> Add Card
                    </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {tool.cards.map((card, ci) => (
                        <div key={ci} className="border border-gray-300 bg-white rounded-lg p-4 relative shadow-sm">
                            <button
                                type="button"
                                onClick={() => updateTool((t) => ({ ...t, cards: t.cards.filter((_, i) => i !== ci) }))}
                                className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 border-2 border-white text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-colors z-10"
                            >
                                <IoClose size={16} />
                            </button>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Label>Category / Badge</Label>
                                    <Input
                                        type="text"
                                        placeholder="LABORATORY TECHNIQUES"
                                        value={card.badge}
                                        onChange={(e: any) => updateTool((t) => {
                                            const c = [...t.cards];
                                            c[ci] = { ...c[ci], badge: e.target.value };
                                            return { ...t, cards: c };
                                        })}
                                    />
                                </div>
                                <div>
                                    <Label>Title</Label>
                                    <Input
                                        type="text"
                                        placeholder="CRISPR-Cas9 Gene Editing"
                                        value={card.title}
                                        onChange={(e: any) => updateTool((t) => {
                                            const c = [...t.cards];
                                            c[ci] = { ...c[ci], title: e.target.value };
                                            return { ...t, cards: c };
                                        })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label>Image</Label>
                                    <DropzoneComponent
                                        preview={card.imageFile ? URL.createObjectURL(card.imageFile) : card.image || null}
                                        setPreview={() => {}}
                                        className="h-40"
                                        onFileSelect={(file: File) => updateTool((t) => {
                                            const c = [...t.cards];
                                            c[ci] = { ...c[ci], imageFile: file };
                                            return { ...t, cards: c };
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {showFlashcardQA && (
            <div>
                <div className="mb-4">
                    <Label className="text-sm font-bold text-gray-800 mb-0">Flashcard Q&amp;A Pairs</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tool.flashcardQA.map((card, ci) => (
                    <div key={ci} className="flashcard-qa-item bg-white p-5 rounded-lg border border-gray-200 relative space-y-4 shadow-sm">
                        <button
                            type="button"
                            onClick={() => updateTool((t) => ({ ...t, flashcardQA: t.flashcardQA.filter((_, i) => i !== ci) }))}
                            className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 border-2 border-white text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-colors z-10"
                        >
                            <IoClose size={16} />
                        </button>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-gray-700 font-semibold">Question</Label>
                                <textarea
                                    className="w-full border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 rounded-lg p-3 text-sm min-h-[80px] transition-shadow"
                                    placeholder="Enter the question..."
                                    value={card.question}
                                    onChange={(e: any) => updateTool((t) => {
                                        const fqa = [...t.flashcardQA];
                                        fqa[ci] = { ...fqa[ci], question: e.target.value };
                                        return { ...t, flashcardQA: fqa };
                                    })}
                                />
                            </div>
                            <div>
                                <Label className="text-gray-700 font-semibold">Answer</Label>
                                <textarea
                                    className="w-full border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 rounded-lg p-3 text-sm min-h-[80px] transition-shadow"
                                    placeholder="Enter the answer..."
                                    value={card.answer}
                                    onChange={(e: any) => updateTool((t) => {
                                        const fqa = [...t.flashcardQA];
                                        fqa[ci] = { ...fqa[ci], answer: e.target.value };
                                        return { ...t, flashcardQA: fqa };
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            </div>
        )}

      </div>
      
      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mt-6 flex justify-end gap-3 rounded-b-2xl">
        <Button onClick={onCancel} variant="outline" size="sm">Cancel</Button>
        <Button onClick={handleSave} variant="primary" size="sm" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
});

export default ToolManagementForm;
