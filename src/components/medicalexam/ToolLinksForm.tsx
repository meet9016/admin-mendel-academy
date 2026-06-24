import React, { useState, useEffect } from "react";
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
  onSuccess?: () => void;
  onCancel?: () => void;
}

const DEFAULT_TOOL_NAMES = [
  "Mendel Qbanks",
  "Mendel Chitras",
  "Mendel Flashcards",
  "Mendel Study Notes",
  "Rapid Recall",
  "Fast Facts",
];

const ToolLinksForm: React.FC<Props> = ({ examId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [examData, setExamData] = useState<any>(null);
  const [galaxySection, setGalaxySection] = useState<GalaxyAppSectionData | null>(null);
  const [tool, setTool] = useState<GalaxyTool | null>(null);

  useEffect(() => {
    if (examId) {
      fetchExamData();
    }
  }, [examId]);

  const fetchExamData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endPointApi.getByIdExamList}/${examId}`);
      const data = res.data || {};
      setExamData(data);

      const section = mapGalaxySectionFromApi(data);
      setGalaxySection(section);
      setTool(section.tools[0] || emptyTool(DEFAULT_TOOL_NAMES[0])); // Just to satisfy the loading state check
    } catch (err) {
      console.error(err);
      toast.error("Failed to load links data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!tool || !galaxySection || !examData) return;
    setSaving(true);
    try {
      // Tools are already updated directly in galaxySection state for links
      const updatedSection = galaxySection;

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
      toast.success("Links updated successfully!");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update links");
    } finally {
      setSaving(false);
    }
  };

  const updateLink = (toolName: string, field: 'toolLink' | 'videoLink', value: string) => {
    if (!galaxySection) return;
    const updatedTools = galaxySection.tools.map(t => {
        if (t.toolName === toolName) {
            return { ...t, [field]: value };
        }
        return t;
    });
    // Ensure all 6 tools exist
    DEFAULT_TOOL_NAMES.forEach(name => {
        if (!updatedTools.find(t => t.toolName === name)) {
            const newT = emptyTool(name);
            updatedTools.push({ ...newT, [field]: name === toolName ? value : newT[field] as any });
        }
    });
    setGalaxySection({ ...galaxySection, tools: updatedTools });
  };

  if (loading || !galaxySection) {
    return (
        <div className="p-6 space-y-6 bg-white rounded-2xl border border-gray-200 mt-6">
            <Skeleton width="150px" height="1.2rem" className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton width="100%" height="2.5rem" />
                <Skeleton width="100%" height="2.5rem" />
            </div>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 mt-6 relative">
    
      <div className="p-6 space-y-8">
        {DEFAULT_TOOL_NAMES.map(name => {
          const tData = galaxySection.tools.find(t => t.toolName === name) || emptyTool(name);
          return (
            <div key={name} className="space-y-3">
              <h3 className="font-semibold text-gray-800">{name}</h3>
              <div className="grid grid-cols-1 gap-4">
                  <div>
                      <Label>Video Preview Link (All Devices)</Label>
                      <Input
                          type="text"
                          placeholder="https://youtu.be/..."
                          value={tData.videoLink}
                          onChange={(e: any) => updateLink(name, 'videoLink', e.target.value)}
                      />
                  </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer */}
      <div className="sticky bottom-0 z-20 bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3 rounded-b-2xl shadow-md">
        <Button onClick={onCancel} variant="outline" size="sm">Cancel</Button>
        <Button onClick={handleSave} variant="primary" size="sm" disabled={saving}>
          {saving ? "Saving Links..." : "Save Links"}
        </Button>
      </div>
    </div>
  );
};

export default ToolLinksForm;
