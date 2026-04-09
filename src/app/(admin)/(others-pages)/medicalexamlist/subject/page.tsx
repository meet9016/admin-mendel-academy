"use client";

import SubjectInfoForm from '@/components/subjectInfo/SubjectInfoForm';
import ComponentCard from '@/components/common/ComponentCard';
import { PlusIcon } from '@/icons';
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

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

  // FIX: ek hi state — null = form band, string = edit mode, "new" = add mode
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

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
    setActiveSubjectId(subject.id); // edit mode — real ID pass karo
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('subject-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAddNewSubject = () => {
    setActiveSubjectId(null); // add mode — null pass karo
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('subject-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      try {
        await api.delete(`${endPointApi.deleteSubjectInfo}/${subjectId}`);
        await fetchSubjects();
      } catch (error) {
        console.error('Error deleting subject:', error);
        alert('Error deleting subject');
      }
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
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Subject Management"
        Plusicon={<PlusIcon />}
        name="Add New Subject"
        onAddProductClick={handleAddNewSubject}
      />

      <div className="grid gap-6">
        {subjects.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600 mb-4">No subjects found for this exam.</p>
            <button
              onClick={handleAddNewSubject}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Add First Subject
            </button>
          </div>
        ) : (
          subjects.map((subject) => (
            <div key={subject.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    {subject.image && (
                      <img
                        src={subject.image}
                        alt={subject.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{subject.name}</h3>
                      {subject.title && (
                        <p className="text-gray-600 mt-1">{subject.title}</p>
                      )}
                      {subject.slogan && (
                        <p className="text-sm text-blue-600 mt-1">{subject.slogan}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSubject(subject)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {subject.chapters?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Chapters</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {subject.chapters?.reduce(
                        (total: number, ch: any) => total + (ch.topics?.length || 0),
                        0
                      ) || 0}
                    </div>
                    <div className="text-sm text-gray-600">Topics</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
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
                    <div className="text-sm text-gray-600">Lessons</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Section — showForm true hone par hi render hoga */}
      {showForm && (
        <div id="subject-form-section">
          <SubjectInfoForm
            key={activeSubjectId ?? 'new'} // key change hone par fresh component mount hoga
            examId={examId!}
            existingSubjectId={activeSubjectId} // null = add, string = edit
            onSuccess={handleFormSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default page;