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

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
};

function QuestionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topicId");
  const chapterId = searchParams.get("chapterId");
  const subjectId = searchParams.get("subjectId");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toDelete, setToDelete] = useState<Question | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`${endPointApi.getQuestionBankByTopic}/${topicId}`);
      const decodedQuestions = (data.data || data).map((q: Question) => ({
        ...q,
        question: decodeHtmlEntities(q.question)
      }));
      setQuestions(decodedQuestions);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  const decodeHtmlEntities = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  useEffect(() => {
    if (topicId) {
      fetchQuestions();
    }
  }, [fetchQuestions, topicId]);

  const filteredQuestions = questions.filter(q =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await api.delete(`${endPointApi.deleteQuestionBank}/${toDelete.id}`);
      setQuestions(questions.filter(q => q.id !== toDelete.id));
      toast.success("Question deleted successfully");
      setToDelete(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete question");
    }
  };

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Questions"
        Plusicon={<PlusIcon />}
        name="Add Question"
        onAddProductClick={`/question-bank/questions/add-question?topicId=${topicId}&chapterId=${chapterId}&subjectId=${subjectId}`}
      >
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push(`/question-bank/topics?chapterId=${chapterId}&subjectId=${subjectId}`)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            ← Back
          </button>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <div key={i} className="border rounded-lg p-6">
                <Skeleton width="100%" height="2rem" className="mb-4" />
                <Skeleton width="100%" height="4rem" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedQuestions.map(question => (
              <div
                key={question.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between items-start mb-4">
                  <div 
                    className="text-lg font-semibold text-gray-900 dark:text-white flex-1 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: question.question }}
                  />
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => router.push(`/question-bank/questions/add-question?id=${question.id}&topicId=${topicId}&chapterId=${chapterId}&subjectId=${subjectId}`)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setToDelete(question)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Options:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {question.options.map((option, idx) => (
                      <li
                        key={idx}
                        className={`text-sm ${
                          option === question.correctAnswer
                            ? "text-green-600 dark:text-green-400 font-semibold"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {option}
                        {option === question.correctAnswer && " ✓"}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
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
              Are you sure you want to delete this question?
            </span>
          )}
        </div>
      </CommonDialog>
    </div>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuestionsContent />
    </Suspense>
  );
}
