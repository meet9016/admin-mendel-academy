"use client";

import SubjectInfoForm from '@/components/subjectInfo/SubjectInfoForm';
import { PlusIcon } from '@/icons';
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import CommonDialog from '@/components/tables/CommonDialog';
import BackButton from '@/components/common/BackButton';
import * as XLSX from 'xlsx';
import SubjectTreeView from '@/components/subjectTree/SubjectTreeView';

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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const imageUploadRef = useRef<HTMLInputElement>(null);

  const handleImageUploadForExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    setUploadedImageUrl('');
    setCopied(false);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('project', 'mendel-academy');
      form.append('folder_structure', 'subject-info');
      const res = await api.post(`${endPointApi.uploadImageForExcel}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data?.file_url || res.data?.url || res.data?.data?.url || '';
      setUploadedImageUrl(url);
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Image upload failed');
    } finally {
      setImageUploading(false);
      if (imageUploadRef.current) imageUploadRef.current.value = '';
    }
  };

  const handleCopyUrl = () => {
    if (!uploadedImageUrl) return;
    navigator.clipboard.writeText(uploadedImageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  // Single sheet - subject/chapter/topic blank cell means "same as above"
  const handleDownloadSample = () => {
    const wb = XLSX.utils.book_new();

    const rows = [
      // Biology - Cell Biology - Cell Structure
      { subject_name: 'Biology', subject_sku: 'BIO-001', subject_title: 'Biology Subject', subject_slogan: 'Life Science', subject_image_url: 'https://example.com/biology.jpg', chapter_title: 'Cell Biology', chapter_long_title: 'Intro to Cell Biology', chapter_image_url: 'https://example.com/cell-bio.jpg', topic_title: 'Cell Structure', subtopic_name: 'Nucleus' },
      { subject_name: '',        subject_sku: '',        subject_title: '',               subject_slogan: '',            subject_image_url: '',                                  chapter_title: '',            chapter_long_title: '',                    chapter_image_url: '',                                       topic_title: '',             subtopic_name: 'Mitochondria' },
      { subject_name: '',        subject_sku: '',        subject_title: '',               subject_slogan: '',            subject_image_url: '',                                  chapter_title: '',            chapter_long_title: '',                    chapter_image_url: '',                                       topic_title: '',             subtopic_name: 'Cell Membrane' },
      { subject_name: '',        subject_sku: '',        subject_title: '',               subject_slogan: '',            subject_image_url: '',                                  chapter_title: '',            chapter_long_title: '',                    chapter_image_url: '',                                       topic_title: 'Cell Division', subtopic_name: 'Mitosis' },
      { subject_name: '',        subject_sku: '',        subject_title: '',               subject_slogan: '',            subject_image_url: '',                                  chapter_title: '',            chapter_long_title: '',                    chapter_image_url: '',                                       topic_title: '',             subtopic_name: 'Meiosis' },
      { subject_name: '',        subject_sku: '',        subject_title: '',               subject_slogan: '',            subject_image_url: '',                                  chapter_title: 'Genetics',    chapter_long_title: 'Fundamentals of Genetics', chapter_image_url: 'https://example.com/genetics.jpg',      topic_title: 'DNA Structure', subtopic_name: 'Double Helix' },
      { subject_name: '',        subject_sku: '',        subject_title: '',               subject_slogan: '',            subject_image_url: '',                                  chapter_title: '',            chapter_long_title: '',                    chapter_image_url: '',                                       topic_title: '',             subtopic_name: 'Base Pairing' },
      { subject_name: 'Chemistry', subject_sku: 'CHEM-001', subject_title: 'Chemistry Subject', subject_slogan: 'Matter & Energy', subject_image_url: 'https://example.com/chemistry.jpg', chapter_title: 'Atomic Structure', chapter_long_title: 'Structure of Atom', chapter_image_url: 'https://example.com/atomic.jpg', topic_title: 'Subatomic Particles', subtopic_name: 'Proton' },
      { subject_name: '',          subject_sku: '',          subject_title: '',                 subject_slogan: '',               subject_image_url: '',                                    chapter_title: '',                chapter_long_title: '',               chapter_image_url: '',                                    topic_title: '',                   subtopic_name: 'Neutron' },
      { subject_name: '',          subject_sku: '',          subject_title: '',                 subject_slogan: '',               subject_image_url: '',                                    chapter_title: '',                chapter_long_title: '',               chapter_image_url: '',                                    topic_title: '',                   subtopic_name: 'Electron' },
    ];

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [
      { wch: 16 }, { wch: 12 }, { wch: 18 }, { wch: 16 }, { wch: 35 },
      { wch: 20 }, { wch: 26 }, { wch: 35 },
      { wch: 20 }, { wch: 20 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Subjects');
    XLSX.writeFile(wb, 'sample_subjects.xlsx');
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !examId) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('exam_id', examId);
      const res = await api.post(endPointApi.bulkUploadSubjectInfo!, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchSubjects();
      alert(res.data?.message || 'Subjects uploaded successfully!');
    } catch (error: any) {
      console.error('Excel upload error:', error);
      alert(error?.response?.data?.message || 'Error uploading Excel file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-gray-500">Loading curriculum...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <BackButton />
          <h1 className="text-2xl font-bold text-gray-900">Subject Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleExcelUpload}
          />
          <button
            onClick={handleDownloadSample}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2">
            Sample Excel
          </button>
          <button
            onClick={() => { setShowImageUploader(true); setUploadedImageUrl(''); setCopied(false); }}
            className="border border-blue-400 hover:bg-blue-50 text-blue-700 px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2">
            🖼 Upload Image → URL
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="border border-[#ffcb07] hover:bg-[#ffcb07]/10 text-black px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Upload Excel'}
          </button>
          <button
            onClick={handleAddNewSubject}
            className="bg-[#ffcb07] hover:bg-[#e6b800] text-black px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2">
            <PlusIcon /> Add New Subject
          </button>
        </div>
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

      {/* Subjects Tree View */}
      <SubjectTreeView
        subjects={subjects}
        onEdit={handleEditSubject}
        onDelete={handleDeleteClick}
      />
      
      {/* Subjects List — 2 columns for better layout */}
      {/* Commented out - Subjects grid view
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-gray-200 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <PlusIcon />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No subjects yet</h3>
            <p className="text-gray-500 mb-6 max-w-xs mx-auto">Start by adding your first subject to the curriculum.</p>
          </div>
        ) : (
          subjects.map((subject) => (
            <div
              key={subject.id}
              className="group bg-white rounded-2xl transition-all border border-gray-200 overflow-hidden"
            >
              <div className="p-5 pl-7">
                {/* Top Section }
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Subject Image }
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

                    {/* Info }
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{subject.name}</h3>
                      {subject.title && (
                        <p className="text-gray-500 text-sm truncate">{subject.title}</p>
                      )}
                      {subject.slogan && (
                        <div className="inline-block bg-primary/10 text-primary-foreground text-[12px] font-bold px-2 py-0.5 rounded-full mt-1">
                          {subject.slogan}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Standard PrimeReact Buttons }
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
                      tooltipOptions={{ position: "bottom", className: "small-tooltip" }}
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
                      tooltipOptions={{ position: "bottom", className: "small-tooltip" }}
                    />
                  </div>
                </div>

                {/* Stats Row }
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
      */}

      {/* Image Upload Helper Modal */}
      {showImageUploader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Upload Image → Get URL</h3>
              <button onClick={() => setShowImageUploader(false)} className="text-gray-400 hover:text-black text-xl">✕</button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Image upload કરો, URL copy કરો, Excel ની <b>subject_image_url</b> અથવા <b>chapter_image_url</b> column માં paste કરો.
            </p>

            <input
              ref={imageUploadRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUploadForExcel}
            />

            <button
              onClick={() => imageUploadRef.current?.click()}
              disabled={imageUploading}
              className="w-full border-2 border-dashed border-gray-300 hover:border-[#ffcb07] rounded-xl py-8 text-center text-gray-500 hover:text-gray-700 transition disabled:opacity-50"
            >
              {imageUploading ? (
                <span className="text-sm">⏳ Uploading...</span>
              ) : (
                <div>
                  <div className="text-3xl mb-2">🖼️</div>
                  <div className="text-sm font-medium">Click to select image</div>
                  <div className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</div>
                </div>
              )}
            </button>

            {uploadedImageUrl && (
              <div className="mt-4">
                <img src={uploadedImageUrl} alt="preview" className="w-full h-32 object-cover rounded-lg mb-3 border" />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={uploadedImageUrl}
                    className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-600 truncate"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      copied ? 'bg-green-500 text-white' : 'bg-[#ffcb07] hover:bg-[#e6b800] text-black'
                    }`}
                  >
                    {copied ? '✓ Copied!' : 'Copy URL'}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => { imageUploadRef.current?.click(); }}
              disabled={imageUploading}
              className="mt-4 w-full text-sm text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              Upload another image
            </button>
          </div>
        </div>
      )}

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