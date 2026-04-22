"use client";

import SubjectInfoForm from '@/components/subjectInfo/SubjectInfoForm';
import { PlusIcon } from '@/icons';
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { GoPencil } from "react-icons/go";
import { RiDeleteBin5Line } from "react-icons/ri";
import CommonDialog from '@/components/tables/CommonDialog';
import { Button } from 'primereact/button';

interface SubjectData {
  id: string;
  name: string;
  sku: string;
  title: string;
  image: string;
  slogan: string;
  chapters: any[];
}

const page = () => {
  const searchParams = useSearchParams();
  const examId = searchParams.get('id');

  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SubjectData | null>(null);

  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const fetchSubjects = async () => {
    if (!examId) return;
    try {
      const res = await api.get(`${endPointApi.getAllSubjectInfo}?exam_id=${examId}`);
      if (res.data?.data) {
        setSubjects(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchSubjects();
      setLoading(false);
    };
    loadData();
  }, [examId]);

  const handleEditSubject = (subject: SubjectData) => {
    setFormKey((k) => k + 1);
    setActiveSubjectId(subject.id);
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('subject-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAddNewSubject = () => {
    setFormKey((k) => k + 1);
    setActiveSubjectId(null);
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('subject-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteClick = (subject: SubjectData) => {
    setSelectedRow(subject);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRow) return;
    try {
      await api.delete(`${endPointApi.deleteSubjectInfo}/${selectedRow.id}`);
      await fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
      alert('Error deleting subject');
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setActiveSubjectId(null);
    fetchSubjects();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setActiveSubjectId(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-gray-500">Loading curriculum...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subject Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage curriculum subjects, chapters, and topics</p>
        </div>
        <button
          onClick={handleAddNewSubject}
          className="bg-[#ffcb07] hover:bg-[#e6b800] text-black px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2">
          <PlusIcon /> Add New Subject
        </button>
      </div>

      {/* Accordion Form Area */}
      <div
        className={`transition-all duration-300 ease-in-out ${showForm ? "opacity-100 mb-8" : "max-h-0 overflow-hidden opacity-0 mb-0"
          }`}
      >
        <div id="subject-form-section" className="bg-white rounded-2xl border border-gray-200">
          <div className="bg-primary/10 p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-bold text-lg text-black">
              {activeSubjectId ? "Edit Subject" : "Create New Subject"}
            </h2>
            <button
              onClick={handleFormCancel}
              className="text-gray-500 hover:text-black p-1 hover:bg-white rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="p-6">
            <SubjectInfoForm
              key={formKey}
              examId={examId!}
              existingSubjectId={activeSubjectId}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      </div>

      {/* Subjects List — 2 columns for better layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-gray-200 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <PlusIcon />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No subjects yet</h3>
            <p className="text-gray-500 mb-6 max-w-xs mx-auto">Start by adding your first subject to the curriculum.</p>
            {/* <button
              onClick={handleAddNewSubject}
              className="bg-[#ffcb07] text-black font-bold px-8 py-3 rounded-xl hover:bg-[#e6b800] transition-all"
            >
              Add First Subject
            </button> */}
          </div>
        ) : (
          subjects.map((subject) => (
            <div
              key={subject.id}
              className="group bg-white rounded-2xl transition-all border border-gray-200 overflow-hidden"
            >
              <div className="p-5 pl-7">
                {/* Top Section */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Subject Image */}
                    <div className="shrink-0">
                      {subject.image ? (
                        <img
                          src={subject.image}
                          alt={subject.name}
                          className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-black font-bold text-xl border border-gray-200">
                          {subject.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{subject.name}</h3>
                      {subject.title && (
                        <p className="text-gray-500 text-sm truncate">{subject.title}</p>
                      )}
                      {subject.slogan && (
                        <div className="inline-block bg-primary/10 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
                          {subject.slogan}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ✅ Standard PrimeReact Buttons */}
                  <div className="flex gap-2 shrink-0">
                    <Button
                      icon={<GoPencil size={16} />}
                      rounded
                      outlined
                      severity="success"
                      onClick={() => handleEditSubject(subject)}
                      className="p-0"
                      style={{ width: "2rem", height: "2rem" }}
                      tooltip="Edit Subject"
                      tooltipOptions={{ position: "bottom" }}
                    />
                    <Button
                      icon={<RiDeleteBin5Line size={16} />}
                      rounded
                      outlined
                      severity="danger"
                      onClick={() => handleDeleteClick(subject)}
                      className="p-0"
                      style={{ width: "2rem", height: "2rem" }}
                      tooltip="Delete Subject"
                      tooltipOptions={{ position: "bottom" }}
                    />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-0 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex-1 text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {subject.chapters?.length || 0}
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Chapters</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="flex-1 text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {subject.chapters?.reduce(
                        (total: number, ch: any) => total + (ch.topics?.length || 0),
                        0
                      ) || 0}
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Topics</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="flex-1 text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {subject.chapters?.reduce(
                        (total: number, ch: any) =>
                          total +
                          (ch.topics?.reduce(
                            (t: number, topic: any) => t + (topic.lessons?.length || 0),
                            0
                          ) || 0),
                        0
                      ) || 0}
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Lessons</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <CommonDialog
        visible={isDeleteModalOpen}
        header="Confirm Delete"
        footerType="confirm-delete"
        onHide={() => setIsDeleteModalOpen(false)}
        onSave={confirmDelete}
      >
        <div className="confirmation-content flex items-center gap-3">
          <i className="pi pi-exclamation-triangle text-3xl text-red-500" />
          {selectedRow && (
            <span>
              Are you sure you want to delete <b>{selectedRow.name}</b>?
            </span>
          )}
        </div>
      </CommonDialog>
    </div>
  );
};

export default page;