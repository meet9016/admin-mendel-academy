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

type Topic = {
  id: number;
  name: string;
  description: string;
};

function TopicsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapterId");
  const subjectId = searchParams.get("subjectId");

  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toDelete, setToDelete] = useState<Topic | null>(null);

  const fetchTopics = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`${endPointApi.getTopicByChapter}/${chapterId}`);
      setTopics(data.data || data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch topics");
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    if (chapterId) {
      fetchTopics();
    }
  }, [fetchTopics, chapterId]);

  const filteredTopics = topics.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await api.delete(`${endPointApi.deleteTopic}/${toDelete.id}`);
      setTopics(topics.filter(t => t.id !== toDelete.id));
      toast.success("Topic deleted successfully");
      setToDelete(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete topic");
    }
  };

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Topics"
        Plusicon={<PlusIcon />}
        name="Add Topic"
        onAddProductClick={`/question-bank/topics/add-topic?chapterId=${chapterId}&subjectId=${subjectId}`}
      >
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push(`/question-bank/chapters?subjectId=${subjectId}`)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            ← Back
          </button>
          <input
            type="text"
            placeholder="Search topics..."
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
            {filteredTopics.map(topic => (
              <div
                key={topic.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800"
              >
                <div onClick={() => router.push(`/question-bank/questions?topicId=${topic.id}&chapterId=${chapterId}&subjectId=${subjectId}`)}>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {topic.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {topic.description}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/question-bank/topics/add-topic?id=${topic.id}&chapterId=${chapterId}&subjectId=${subjectId}`);
                    }}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setToDelete(topic);
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

export default function TopicsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TopicsContent />
    </Suspense>
  );
}
