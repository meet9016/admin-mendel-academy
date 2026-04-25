"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Button } from "primereact/button";

interface SubjectData {
  id: string;
  name: string;
  sku: string;
  title: string;
  image: string;
  slogan: string;
  chapters: any[];
}

interface Props {
  subjects: SubjectData[];
  onEdit: (subject: SubjectData) => void;
  onDelete: (subject: SubjectData) => void;
}

const Badge = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gray-100 text-gray-500 text-[11px] font-semibold shrink-0">
      {count}
    </span>
  ) : null;

const SubjectRow = ({ subject, onEdit, onDelete }: {
  subject: SubjectData;
  onEdit: (s: SubjectData) => void;
  onDelete: (s: SubjectData) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState<any>(null);
  const [activeTopic, setActiveTopic] = useState<any>(null);

  const level = activeTopic ? "subtopics" : activeChapter ? "topics" : "chapters";

  const items: any[] =
    level === "chapters" ? subject.chapters || [] :
    level === "topics"   ? activeChapter?.topics || [] :
    activeTopic?.subtopics || activeTopic?.lessons || [];

  const handleItemClick = (item: any) => {
    if (level === "chapters") {
      setActiveChapter(item);
      setActiveTopic(null);
    } else if (level === "topics") {
      const subs = item.subtopics || item.lessons || [];
      if (subs.length > 0) setActiveTopic(item);
    }
  };

  const handleToggle = () => {
    if (open) { setActiveChapter(null); setActiveTopic(null); }
    setOpen(o => !o);
  };

  const breadcrumbs = [
    { label: subject.title || subject.name, onClick: () => { setActiveChapter(null); setActiveTopic(null); } },
    ...(activeChapter ? [{ label: activeChapter.title || activeChapter.name, onClick: () => setActiveTopic(null) }] : []),
    ...(activeTopic   ? [{ label: activeTopic.title || activeTopic.name, onClick: () => {} }] : []),
  ];

  const chapterCount = subject.chapters?.length || 0;

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      {/* Header */}
      <div
        className={`flex items-center gap-2 px-4 py-3 cursor-pointer transition-colors select-none ${open ? "bg-[#fffdf0]" : "hover:bg-gray-50"}`}
        onClick={handleToggle}
      >
        {open
          ? <ChevronDown size={15} className="text-[#FFCA00] shrink-0" />
          : <ChevronRight size={15} className="text-gray-400 shrink-0" />}

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {open ? (
            breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <React.Fragment key={i}>
                  {i > 0 && <ChevronRight size={12} className="text-gray-400 shrink-0" />}
                  <button
                    onClick={e => { e.stopPropagation(); if (!isLast) crumb.onClick(); }}
                    className={`text-theme-sm font-medium transition-colors ${isLast ? "text-gray-900 cursor-default" : "text-gray-500 hover:text-gray-800 hover:underline"}`}
                  >
                    {crumb.label}
                  </button>
                </React.Fragment>
              );
            })
          ) : (
            <span className="text-theme-sm font-medium text-gray-700 truncate">
              {subject.title || subject.name}
            </span>
          )}
          {/* Chapter count next to subject name */}
          {!open && <Badge count={chapterCount} />}
        </div>

        {subject.slogan && !open && (
          <span className="text-theme-xs bg-[#FFCA00]/20 text-gray-700 font-semibold px-2 py-0.5 rounded-full shrink-0">
            {subject.slogan}
          </span>
        )}

        <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
          <Button icon={<GoPencil size={12} />} rounded outlined severity="success" onClick={() => onEdit(subject)} className="p-0" style={{ width: "1.5rem", height: "1.5rem" }} tooltip="Edit" tooltipOptions={{ position: "bottom", className: "small-tooltip" }} />
          <Button icon={<RiDeleteBin5Line size={12} />} rounded outlined severity="danger" onClick={() => onDelete(subject)} className="p-0" style={{ width: "1.5rem", height: "1.5rem" }} tooltip="Delete" tooltipOptions={{ position: "bottom", className: "small-tooltip" }} />
        </div>
      </div>

      {/* Items */}
      {open && (
        <div className="bg-gray-50 border-t border-gray-200 divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="pl-8 py-3 text-theme-xs text-gray-400">Nothing here yet</div>
          ) : items.map((item: any, i: number) => {
            const isLeaf = level === "subtopics";
            const subCount =
              level === "chapters" ? (item.topics?.length || 0) :
              level === "topics"   ? (item.subtopics?.length || item.lessons?.length || 0) : 0;
            const clickable = !isLeaf && !(level === "topics" && subCount === 0);

            return (
              <div
                key={item.id ?? i}
                className={`flex items-center gap-2 pl-8 pr-4 py-2.5 transition-colors ${clickable ? "hover:bg-[#fffdf0] cursor-pointer" : ""}`}
                onClick={() => clickable && handleItemClick(item)}
              >
                {isLeaf
                  ? <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                  : <ChevronRight size={13} className="text-gray-400 shrink-0" />}
                <span className="text-theme-sm font-medium text-gray-700">
                  {item.title || item.name}
                </span>
                {/* Count right next to item name */}
                {!isLeaf && <Badge count={subCount} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SubjectTreeView = ({ subjects, onEdit, onDelete }: Props) => {
  if (subjects.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center">
        <h3 className="text-theme-xl font-bold text-gray-900">No subjects yet</h3>
        <p className="text-theme-sm text-gray-500 mt-1">Start by adding your first subject to the curriculum.</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {subjects.map(s => (
        <SubjectRow key={s.id} subject={s} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default SubjectTreeView;
