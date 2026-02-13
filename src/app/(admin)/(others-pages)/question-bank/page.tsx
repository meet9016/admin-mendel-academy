"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import { PlusIcon } from "@/icons";
import { Skeleton } from "primereact/skeleton";
import CommonDialog from "@/components/tables/CommonDialog";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import { toast } from "react-toastify";

type Subject = {
  id: number;
  name: string;
  description: string;
};

export default function SubjectsPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toDelete, setToDelete] = useState<Subject | null>(null);

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`${endPointApi.getAllSubject}`);
      setSubjects(data.data || data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await api.delete(`${endPointApi.deleteSubject}/${toDelete.id}`);
      setSubjects(subjects.filter(s => s.id !== toDelete.id));
      toast.success("Subject deleted successfully");
      setToDelete(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete subject");
    }
  };

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Subjects"
        Plusicon={<PlusIcon />}
        name="Add Subject"
        onAddProductClick="/question-bank/add-subject"
      >
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <div key={i} className="border rounded-lg p-6">
                <Skeleton width="100%" height="2rem" className="mb-4" />
                <Skeleton width="100%" height="4rem" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map(subject => (
              <div
                key={subject.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800"
              >
                <div onClick={() => router.push(`/question-bank/chapters?subjectId=${subject.id}`)}>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {subject.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {subject.description}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/question-bank/add-subject?id=${subject.id}`);
                    }}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setToDelete(subject);
                    }}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ComponentCard>

      <CommonDialog
        visible={!!toDelete}
        header="Confirm Delete"
        footerType="confirm-delete"
        onHide={() => setToDelete(null)}
        onSave={confirmDelete}
      >
        <div className="confirmation-content flex items-center gap-3">
          <i className="pi pi-exclamation-triangle text-3xl text-red-500" />
          {toDelete && (
            <span>
              Are you sure you want to delete <b>{toDelete.name}</b>?
            </span>
          )}
        </div>
      </CommonDialog>
    </div>
  );
}
