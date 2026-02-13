"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import { PlusIcon } from "@/icons";
import { Skeleton } from "primereact/skeleton";
import CommonDialog from "@/components/tables/CommonDialog";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import { toast } from "react-toastify";

type Chapter = {
  id: number;
  name: string;
  description: string;
};

function ChaptersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subjectId");

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toDelete, setToDelete] = useState<Chapter | null>(null);

  const fetchChapters = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`${endPointApi.getChapterBySubject}/${subjectId}`);
      setChapters(data.data || data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch chapters");
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    if (subjectId) {
      fetchChapters();
    }
  }, [fetchChapters, subjectId]);

  const filteredChapters = chapters.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await api.delete(`${endPointApi.deleteChapter}/${toDelete.id}`);
      setChapters(chapters.filter(c => c.id !== toDelete.id));
      toast.success("Chapter deleted successfully");
      setToDelete(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete chapter");
    }
  };

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Chapters"
        Plusicon={<PlusIcon />}
        name="Add Chapter"
        onAddProductClick={`/question-bank/chapters/add-chapter?subjectId=${subjectId}`}
      >
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push("/question-bank")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            ← Back
          </button>
          <input
            type="text"
            placeholder="Search chapters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
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
            {filteredChapters.map(chapter => (
              <div
                key={chapter.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800"
              >
                <div onClick={() => router.push(`/question-bank/topics?chapterId=${chapter.id}&subjectId=${subjectId}`)}>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {chapter.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {chapter.description}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/question-bank/chapters/add-chapter?id=${chapter.id}&subjectId=${subjectId}`);
                    }}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setToDelete(chapter);
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

export default function ChaptersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChaptersContent />
    </Suspense>
  );
}
