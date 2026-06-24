"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BackButton from '@/components/common/BackButton';
import ToolManagementForm, { ToolManagementFormRef } from "@/components/medicalexam/ToolManagementForm";
import ToolLinksForm from "@/components/medicalexam/ToolLinksForm";
import { GoPencil } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";

const TOOLS = [
  "Mendel Qbanks",
  "Mendel Chitras",
  "Mendel Flashcards",
  "Mendel Study Notes",
  "Rapid Recall",
  "Fast Facts",
];

const ToolsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const examId = searchParams.get('id');
  const toolParam = searchParams.get('tool');
  
  const showForm = toolParam && toolParam !== 'links';
  const showLinksForm = toolParam === 'links';
  const selectedToolName = toolParam && toolParam !== 'links' ? toolParam : "";
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<ToolManagementFormRef>(null);

  useEffect(() => {
    if (toolParam) {
      setFormKey(k => k + 1);
    }
  }, [toolParam]);

  const handleEditTool = (tool: string) => {
    router.push(`/medicalexamlist/tools?id=${examId}&tool=${encodeURIComponent(tool)}`);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleEditLinks = () => {
    router.push(`/medicalexamlist/tools?id=${examId}&tool=links`);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleFormClose = () => {
    router.push(`/medicalexamlist/tools?id=${examId}`);
  };

  const pageTitle = showForm && selectedToolName 
    ? `Edit ${selectedToolName}` 
    : showLinksForm 
      ? 'Edit Tool Links' 
      : 'Manage Tools';

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <BackButton />
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
        </div>
        {showForm && selectedToolName && (
            <div className="flex items-center gap-3">
                {selectedToolName !== "Mendel Flashcards" && selectedToolName !== "Mendel Chitras" && (
                    <button
                        onClick={() => formRef.current?.handleAddQuestion()}
                        className="bg-[#ffcb07] text-black px-4 py-2 w-auto flex items-center justify-center gap-2 rounded-md text-sm font-bold shadow-sm hover:bg-yellow-400 transition-colors"
                    >
                        <FaPlus /> Add New Question
                    </button>
                )}
                {selectedToolName === "Mendel Flashcards" && (
                    <button
                        onClick={() => formRef.current?.handleAddFlashcard()}
                        className="bg-[#ffcb07] text-black px-4 py-2 w-auto flex items-center justify-center gap-2 rounded-md text-sm font-bold shadow-sm hover:bg-yellow-400 transition-colors"
                    >
                        <FaPlus /> Add New Q&amp;A
                    </button>
                )}
            </div>
        )}
      </div>

      {/* Form Area */}
      {showForm && examId && selectedToolName && (
        <div id="tool-form-section" className="bg-white rounded-2xl border border-gray-200 shadow-sm relative mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-2 pt-4">
            <ToolManagementForm
              ref={formRef}
              key={formKey}
              examId={examId}
              toolName={selectedToolName}
              onSuccess={handleFormClose}
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}

      {/* Links Form Area */}
      {showLinksForm && examId && (
        <div id="links-form-section" className="bg-white rounded-2xl border border-gray-200 shadow-sm relative mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-2 pt-4">
            <ToolLinksForm examId={examId} onCancel={handleFormClose} onSuccess={handleFormClose} />
          </div>
        </div>
      )}

      {/* Tools List - Hidden when form is open */}
      {!showForm && !showLinksForm && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {TOOLS.map((tool, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between p-4 px-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-gray-400 font-bold">›</span>
              <span className="font-medium text-gray-900">{tool}</span>
            </div>
            
            <button
              onClick={() => handleEditTool(tool)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-green-500 text-green-600 hover:bg-green-50 transition-colors"
              title={`Edit ${tool}`}
            >
              <GoPencil size={16} />
            </button>
          </div>
        ))}

            {/* The Links Item */}
            <div className="flex items-center justify-between p-4 px-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-gray-400 font-bold">›</span>
                <span className="font-medium text-gray-900">Manage Tool Links</span>
              </div>
              
              <button
                onClick={handleEditLinks}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-green-500 text-green-600 hover:bg-green-50 transition-colors"
                title="Edit Tool Links"
              >
                <GoPencil size={16} />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ToolsPage;
