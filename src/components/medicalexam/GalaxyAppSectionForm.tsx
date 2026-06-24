"use client";
import React, { useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import ComponentCard from "../common/ComponentCard";
import DropzoneComponent from "../blogs/DropZone";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

export interface GalaxyCardOption {
  text: string;
  isCorrect: boolean;
}

export interface GalaxySampleQuestion {
  badge: string;
  question: string;
  options: GalaxyCardOption[];
}

export interface GalaxyFlashcardQA {
  question: string;
  answer: string;
}

export interface GalaxyTool {
  toolName: string;
  sectionSubtitle: string;
  bottomText: string;
  iphoneVideo: GalaxyDeviceVideo;
  ipadVideo: GalaxyDeviceVideo;
  desktopVideo: GalaxyDeviceVideo;
  videoLink: string;
  tagline: string;
  description: string;
  includedPoints: string[];
  sampleQuestionBadge: string;
  sampleQuestionText: string;
  sampleQuestionOptions: GalaxyCardOption[];
  sampleQuestions: GalaxySampleQuestion[];
  flashcardQA: GalaxyFlashcardQA[];
  individualPrice: string;
  individualPer: string;
  galaxyPrice: string;
  galaxyPer: string;
  sampleImage: string;
  sampleImageFile?: File | null;
  cards: GalaxyCard[];
  toolLink: string;
}

export interface GalaxyAppSectionData {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  tools: GalaxyTool[];
}

const DEFAULT_TOOL_NAMES = [
  "Mendel Qbanks",
  "Mendel Chitras",
  "Mendel Flashcards",
  "Mendel Study Notes",
  "Rapid Recall",
  "Fast Facts",
];

export const emptyOption = (): GalaxyCardOption => ({ text: "", isCorrect: false });
export const emptyCard = (): GalaxyCard => ({
  badge: "",
  title: "",
  image: "",
  imageFile: null,
  cardType: "question",
  options: [emptyOption()],
});

export const emptySampleQuestion = (): GalaxySampleQuestion => ({
  badge: "",
  question: "",
  options: [emptyOption(), emptyOption()],
});

export const emptyFlashcardQA = (): GalaxyFlashcardQA => ({ question: "", answer: "" });

export const emptyTool = (name: string): GalaxyTool => ({
  toolName: name,
  sectionSubtitle: "",
  bottomText: "",
  iphoneVideo: { title: "", link: "" },
  ipadVideo: { title: "", link: "" },
  desktopVideo: { title: "", link: "" },
  videoLink: "",
  tagline: "STUDY TOOL",
  description: "",
  includedPoints: [""],
  sampleQuestionBadge: "",
  sampleQuestionText: "",
  sampleQuestionOptions: [emptyOption()],
  sampleQuestions: [],
  flashcardQA: [],
  individualPrice: "",
  individualPer: "per subject / month",
  galaxyPrice: "",
  galaxyPer: "Everything included · 1 month+",
  sampleImage: "",
  sampleImageFile: null,
  cards: [],
  toolLink: "",
});

export const getDefaultGalaxyAppSection = (): GalaxyAppSectionData => ({
  sectionLabel: "THE MENDEL GALAXY APP",
  sectionTitle: "Here's what you get",
  sectionDescription:
    "Six high-yield study tools built for USMLE Step 1 — Mendel Qbanks, Chitras, Mendel Flashcards, Mendel Study Notes, Rapid Recall, and Fast Facts. Click any tool below to explore details & pricing.",
  tools: DEFAULT_TOOL_NAMES.map((name) => emptyTool(name)),
});

export const mapGalaxySectionFromApi = (data: any): GalaxyAppSectionData => {
  if (!data?.galaxy_app_section?.tools?.length) {
    return getDefaultGalaxyAppSection();
  }
  const section = data.galaxy_app_section;
  return {
    sectionLabel: section.section_label || getDefaultGalaxyAppSection().sectionLabel,
    sectionTitle: section.section_title || getDefaultGalaxyAppSection().sectionTitle,
    sectionDescription: section.section_description || getDefaultGalaxyAppSection().sectionDescription,
    tools: DEFAULT_TOOL_NAMES.map((defaultName, index) => {
      const t = section.tools[index] || {};
      return {
        toolName: t.tool_name || defaultName,
        sectionSubtitle: t.section_subtitle || "",
        bottomText: t.bottom_text || "",
        iphoneVideo: {
          title: t.iphone_video?.title || "",
          link: t.iphone_video?.link || "",
        },
        ipadVideo: {
          title: t.ipad_video?.title || "",
          link: t.ipad_video?.link || "",
        },
        desktopVideo: {
          title: t.desktop_video?.title || "",
          link: t.desktop_video?.link || "",
        },
        videoLink: t.video_link || t.iphone_video?.link || "",
        tagline: t.tagline || "STUDY TOOL",
        description: t.description || "",
        includedPoints: t.included_points?.length ? t.included_points : [""],
        sampleQuestionBadge: t.sample_question_badge || "",
        sampleQuestionText: t.sample_question_text || "",
        sampleQuestionOptions: t.sample_question_options?.length
          ? t.sample_question_options.map((o: any) => ({
              text: o.text || "",
              isCorrect: !!o.is_correct,
            }))
          : [emptyOption()],
        sampleQuestions: t.sample_questions?.length
          ? t.sample_questions.map((q: any) => ({
              badge: q.badge || "",
              question: q.question || "",
              options: q.options?.length
                ? q.options.map((o: any) => ({ text: o.text || "", isCorrect: !!o.is_correct }))
                : [emptyOption(), emptyOption()],
            }))
          : (t.sample_question_text 
              ? [{
                  badge: t.sample_question_badge || "",
                  question: t.sample_question_text || "",
                  options: t.sample_question_options?.length
                    ? t.sample_question_options.map((o: any) => ({ text: o.text || "", isCorrect: !!o.is_correct }))
                    : [emptyOption(), emptyOption()]
                }]
              : []),
        flashcardQA: t.flashcard_qa?.length
          ? t.flashcard_qa.map((f: any) => ({ question: f.question || "", answer: f.answer || "" }))
          : [],
        individualPrice: t.individual_price || "",
        individualPer: t.individual_per || "per subject / month",
        galaxyPrice: t.galaxy_price || "",
        galaxyPer: t.galaxy_per || "Everything included · 1 month+",
        sampleImage: t.sample_image || "",
        sampleImageFile: null,
        toolLink: t.tool_link || "",
        cards: (t.cards || []).map((c: any) => ({
          badge: c.badge || "",
          title: c.title || "",
          image: c.image || "",
          imageFile: null,
          cardType: c.card_type || "question",
          options: c.options?.length
            ? c.options.map((o: any) => ({ text: o.text || "", isCorrect: !!o.is_correct }))
            : [],
        })),
      };
    }),
  };
};

export const buildGalaxySectionForSubmit = (data: GalaxyAppSectionData) => ({
  section_label: data.sectionLabel,
  section_title: data.sectionTitle,
  section_description: data.sectionDescription,
  tools: data.tools.map((tool) => ({
    tool_name: tool.toolName,
    section_subtitle: tool.sectionSubtitle,
    bottom_text: tool.bottomText,
    video_link: tool.videoLink,
    iphone_video: { title: "iPhone Demo", link: tool.videoLink },
    ipad_video: { title: "iPad Demo", link: tool.videoLink },
    desktop_video: { title: "Desktop Demo", link: tool.videoLink },
    tagline: tool.tagline,
    description: tool.description,
    included_points: tool.includedPoints.filter((p) => p.trim()),
    sample_question_badge: tool.sampleQuestionBadge,
    sample_question_text: tool.sampleQuestionText,
    sample_question_options: tool.sampleQuestionOptions
      .filter((o) => o.text.trim())
      .map((o) => ({ text: o.text, is_correct: o.isCorrect })),
    sample_questions: tool.sampleQuestions.map((q) => ({
      badge: q.badge,
      question: q.question,
      options: q.options
        .filter((o) => o.text.trim())
        .map((o) => ({ text: o.text, is_correct: o.isCorrect })),
    })),
    flashcard_qa: tool.flashcardQA
      .filter((f) => f.question.trim() || f.answer.trim())
      .map((f) => ({ question: f.question, answer: f.answer })),
    individual_price: tool.individualPrice,
    individual_per: tool.individualPer,
    galaxy_price: tool.galaxyPrice,
    galaxy_per: tool.galaxyPer,
    sample_image: tool.sampleImage,
    tool_link: tool.toolLink,
    cards: tool.cards.map(({ imageFile, ...card }) => ({
      badge: card.badge,
      title: card.title,
      image: card.image,
      card_type: card.cardType,
      options: card.options
        .filter((o) => o.text.trim())
        .map((o) => ({ text: o.text, is_correct: o.isCorrect })),
    })),
  })),
});

interface Props {
  data: GalaxyAppSectionData;
  onChange: (data: GalaxyAppSectionData) => void;
}

const GalaxyAppSectionForm: React.FC<Props> = ({ data, onChange }) => {
  const [openTool, setOpenTool] = useState<number>(0);
  const [openSampleQuestions, setOpenSampleQuestions] = useState<Record<number, boolean>>({});

  const updateSection = (field: keyof GalaxyAppSectionData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const updateTool = (toolIndex: number, updater: (tool: GalaxyTool) => GalaxyTool) => {
    const tools = [...data.tools];
    tools[toolIndex] = updater(tools[toolIndex]);
    onChange({ ...data, tools });
  };

  const renderVideoLinkSection = (toolIndex: number, tool: GalaxyTool) => (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-2">
      <Label className="text-sm font-semibold text-gray-700">Tool Video Preview Link (Same for All Devices)</Label>
      <Input
        type="text"
        placeholder="https://youtu.be/..."
        value={tool.videoLink}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          updateTool(toolIndex, (t) => ({ ...t, videoLink: e.target.value }))
        }
      />
    </div>
  );

  const renderDetailPopup = (toolIndex: number, tool: GalaxyTool) => (
    <div className="space-y-4 mt-6">
      <p className="text-sm font-semibold text-gray-700">Detail Popup Content</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Tagline</Label>
          <Input
            type="text"
            placeholder="STUDY TOOL"
            value={tool.tagline}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateTool(toolIndex, (t) => ({ ...t, tagline: e.target.value }))
            }
          />
        </div>
        <div>
          <Label>Individual Price</Label>
          <Input
            type="text"
            placeholder="$16.99"
            value={tool.individualPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateTool(toolIndex, (t) => ({ ...t, individualPrice: e.target.value }))
            }
          />
        </div>
        <div>
          <Label>Individual Price Subtext</Label>
          <Input
            type="text"
            placeholder="per subject / month"
            value={tool.individualPer}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateTool(toolIndex, (t) => ({ ...t, individualPer: e.target.value }))
            }
          />
        </div>
        <div>
          <Label>Galaxy App Price</Label>
          <Input
            type="text"
            placeholder="From $309"
            value={tool.galaxyPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateTool(toolIndex, (t) => ({ ...t, galaxyPrice: e.target.value }))
            }
          />
        </div>
        <div>
          <Label>Galaxy App Price Subtext</Label>
          <Input
            type="text"
            placeholder="Everything included · 1 month+"
            value={tool.galaxyPer}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateTool(toolIndex, (t) => ({ ...t, galaxyPer: e.target.value }))
            }
          />
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[100px]"
          placeholder="Tool description for detail popup"
          value={tool.description}
          onChange={(e) => updateTool(toolIndex, (t) => ({ ...t, description: e.target.value }))}
        />
      </div>

      <div>
        <Label>Detail Sample Image</Label>
        <DropzoneComponent
          preview={tool.sampleImageFile ? URL.createObjectURL(tool.sampleImageFile) : tool.sampleImage || null}
          setPreview={() => {}}
          className="h-40"
          onFileSelect={(file: File) =>
            updateTool(toolIndex, (t) => ({ ...t, sampleImageFile: file }))
          }
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>What&apos;s Included (Features)</Label>
          <button
            type="button"
            onClick={() =>
              updateTool(toolIndex, (t) => ({
                ...t,
                includedPoints: [...t.includedPoints, ""],
              }))
            }
            className="bg-[#ffcb07] text-black w-8 h-8 flex items-center justify-center rounded-md"
          >
            <FaPlus />
          </button>
        </div>
        {tool.includedPoints.map((point, pi) => (
          <div key={pi} className="flex gap-2 mb-2">
            <Input
              type="text"
              placeholder={`Feature ${pi + 1}`}
              value={point}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateTool(toolIndex, (t) => {
                  const includedPoints = [...t.includedPoints];
                  includedPoints[pi] = e.target.value;
                  return { ...t, includedPoints };
                })
              }
            />
            {tool.includedPoints.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  updateTool(toolIndex, (t) => ({
                    ...t,
                    includedPoints: t.includedPoints.filter((_, i) => i !== pi),
                  }))
                }
                className="border border-red-400 text-red-500 w-10 h-10 rounded-md flex items-center justify-center"
              >
                <FaMinus />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        <button
          type="button"
          onClick={() => {
            const isOpen = openSampleQuestions[toolIndex];
            if (!isOpen) {
              // If no items exist, add one when opening
              if (tool.sampleQuestions.length === 0) {
                updateTool(toolIndex, (t) => ({ ...t, sampleQuestions: [emptySampleQuestion()] }));
              }
            }
            setOpenSampleQuestions((prev) => ({ ...prev, [toolIndex]: !isOpen }));
          }}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Label className="text-sm font-bold text-gray-800 mb-0">Sample Questions / Content List (Detail Popup)</Label>
            {tool.sampleQuestions.length > 0 && (
              <span className="bg-[#ffcb07] text-black text-xs font-bold px-2 py-0.5 rounded-full">{tool.sampleQuestions.length}</span>
            )}
          </div>
          <span className="text-gray-400 text-xs">{openSampleQuestions[toolIndex] ? "▲ Close" : "▼ Add / Edit Questions"}</span>
        </button>

        {openSampleQuestions[toolIndex] && (
          <div className="p-4 space-y-4 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  updateTool(toolIndex, (t) => ({
                    ...t,
                    sampleQuestions: [...t.sampleQuestions, emptySampleQuestion()],
                  }))
                }
                className="bg-[#ffcb07] text-black px-3 py-1.5 flex items-center gap-1 rounded-md text-xs font-semibold"
              >
                <FaPlus /> Add Question
              </button>
            </div>

            {tool.sampleQuestions.map((q, qi) => (
              <div key={qi} className="bg-white p-4 rounded-md border border-gray-300 relative space-y-4 shadow-sm">
                <button
                  type="button"
                  onClick={() =>
                    updateTool(toolIndex, (t) => ({
                      ...t,
                      sampleQuestions: t.sampleQuestions.filter((_, i) => i !== qi),
                    }))
                  }
                  className="absolute top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow"
                >
                  <IoClose size={14} />
                </button>

                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <Label>Question {qi + 1} Badge</Label>
                    <Input
                      type="text"
                      placeholder="Q1 · Cardiology · Medium"
                      value={q.badge}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateTool(toolIndex, (t) => {
                          const sampleQuestions = [...t.sampleQuestions];
                          sampleQuestions[qi] = { ...sampleQuestions[qi], badge: e.target.value };
                          return { ...t, sampleQuestions };
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Question {qi + 1} Text / Content</Label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[80px]"
                      placeholder="Question text or content"
                      value={q.question}
                      onChange={(e) =>
                        updateTool(toolIndex, (t) => {
                          const sampleQuestions = [...t.sampleQuestions];
                          sampleQuestions[qi] = { ...sampleQuestions[qi], question: e.target.value };
                          return { ...t, sampleQuestions };
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-gray-600">Question {qi + 1} Options</Label>
                    <button
                      type="button"
                      onClick={() =>
                        updateTool(toolIndex, (t) => {
                          const sampleQuestions = [...t.sampleQuestions];
                          sampleQuestions[qi] = {
                            ...sampleQuestions[qi],
                            options: [...sampleQuestions[qi].options, emptyOption()],
                          };
                          return { ...t, sampleQuestions };
                        })
                      }
                      className="bg-gray-200 text-black px-2 py-1 rounded text-xs flex items-center gap-1"
                    >
                      <FaPlus /> Add Option
                    </button>
                  </div>

                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex gap-2 items-center">
                      <Input
                        type="text"
                        placeholder={`Option ${oi + 1}`}
                        value={opt.text}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateTool(toolIndex, (t) => {
                            const sampleQuestions = [...t.sampleQuestions];
                            const options = [...sampleQuestions[qi].options];
                            options[oi] = { ...options[oi], text: e.target.value };
                            sampleQuestions[qi] = { ...sampleQuestions[qi], options };
                            return { ...t, sampleQuestions };
                          })
                        }
                      />
                      <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={opt.isCorrect}
                          onChange={(e) =>
                            updateTool(toolIndex, (t) => {
                              const sampleQuestions = [...t.sampleQuestions];
                              const options = [...sampleQuestions[qi].options];
                              options[oi] = { ...options[oi], isCorrect: e.target.checked };
                              sampleQuestions[qi] = { ...sampleQuestions[qi], options };
                              return { ...t, sampleQuestions };
                            })
                          }
                        />
                        Correct
                      </label>
                      {q.options.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            updateTool(toolIndex, (t) => {
                              const sampleQuestions = [...t.sampleQuestions];
                              const options = sampleQuestions[qi].options.filter((_, i) => i !== oi);
                              sampleQuestions[qi] = { ...sampleQuestions[qi], options };
                              return { ...t, sampleQuestions };
                            })
                          }
                          className="border border-red-400 text-red-500 w-10 h-10 rounded-md flex items-center justify-center"
                        >
                          <FaMinus />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderFlashcardQA = (toolIndex: number, tool: GalaxyTool) => (
    <div className="space-y-4 mt-6">
      <div className="border border-purple-200 rounded-lg overflow-hidden bg-purple-50">
        <button
          type="button"
          onClick={() => {
            const isOpen = openSampleQuestions[toolIndex];
            if (!isOpen && tool.flashcardQA.length === 0) {
              updateTool(toolIndex, (t) => ({ ...t, flashcardQA: [emptyFlashcardQA()] }));
            }
            setOpenSampleQuestions((prev) => ({ ...prev, [toolIndex]: !isOpen }));
          }}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-purple-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Label className="text-sm font-bold text-purple-800 mb-0">Flashcard Q&amp;A Pairs (for carousel preview)</Label>
            {tool.flashcardQA.length > 0 && (
              <span className="bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{tool.flashcardQA.length}</span>
            )}
          </div>
          <span className="text-purple-400 text-xs">{openSampleQuestions[toolIndex] ? "▲ Close" : "▼ Add / Edit Cards"}</span>
        </button>

        {openSampleQuestions[toolIndex] && (
          <div className="p-4 space-y-4 border-t border-purple-200">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  updateTool(toolIndex, (t) => ({
                    ...t,
                    flashcardQA: [...t.flashcardQA, emptyFlashcardQA()],
                  }))
                }
                className="bg-purple-500 text-white px-3 py-1.5 flex items-center gap-1 rounded-md text-xs font-semibold"
              >
                <FaPlus /> Add Card
              </button>
            </div>

            {tool.flashcardQA.map((card, ci) => (
              <div key={ci} className="bg-white p-4 rounded-md border border-purple-200 relative space-y-3 shadow-sm">
                <button
                  type="button"
                  onClick={() =>
                    updateTool(toolIndex, (t) => ({
                      ...t,
                      flashcardQA: t.flashcardQA.filter((_, i) => i !== ci),
                    }))
                  }
                  className="absolute top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow"
                >
                  <IoClose size={14} />
                </button>
                <div>
                  <Label>Card {ci + 1} — Question</Label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[70px]"
                    placeholder="Enter the question side of the flashcard"
                    value={card.question}
                    onChange={(e) =>
                      updateTool(toolIndex, (t) => {
                        const flashcardQA = [...t.flashcardQA];
                        flashcardQA[ci] = { ...flashcardQA[ci], question: e.target.value };
                        return { ...t, flashcardQA };
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Card {ci + 1} — Answer</Label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[70px]"
                    placeholder="Enter the answer side of the flashcard"
                    value={card.answer}
                    onChange={(e) =>
                      updateTool(toolIndex, (t) => {
                        const flashcardQA = [...t.flashcardQA];
                        flashcardQA[ci] = { ...flashcardQA[ci], answer: e.target.value };
                        return { ...t, flashcardQA };
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderChitraCards = (toolIndex: number, tool: GalaxyTool) => (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">Chitras Carousel Cards</p>
        <button
          type="button"
          onClick={() => updateTool(toolIndex, (t) => ({ ...t, cards: [...t.cards, emptyCard()] }))}
          className="bg-[#ffcb07] text-black px-3 py-1.5 flex items-center gap-1 rounded-md text-sm"
        >
          <FaPlus /> Add Card
        </button>
      </div>
      {tool.cards.map((card, ci) => (
        <div key={ci} className="border border-gray-200 rounded-lg p-4 relative">
          <button
            type="button"
            onClick={() =>
              updateTool(toolIndex, (t) => ({ ...t, cards: t.cards.filter((_, i) => i !== ci) }))
            }
            className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
          >
            <IoClose size={14} />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Heading / Category</Label>
              <Input
                type="text"
                placeholder="LABORATORY TECHNIQUES"
                value={card.badge}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateTool(toolIndex, (t) => {
                    const cards = [...t.cards];
                    cards[ci] = { ...cards[ci], badge: e.target.value };
                    return { ...t, cards };
                  })
                }
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                placeholder="CRISPR-Cas9 Gene Editing"
                value={card.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateTool(toolIndex, (t) => {
                    const cards = [...t.cards];
                    cards[ci] = { ...cards[ci], title: e.target.value };
                    return { ...t, cards };
                  })
                }
              />
            </div>
            <div className="md:col-span-2">
              <Label>Image</Label>
              <DropzoneComponent
                preview={card.imageFile ? URL.createObjectURL(card.imageFile) : card.image || null}
                setPreview={() => {}}
                className="h-48"
                onFileSelect={(file: File) =>
                  updateTool(toolIndex, (t) => {
                    const cards = [...t.cards];
                    cards[ci] = { ...cards[ci], imageFile: file };
                    return { ...t, cards };
                  })
                }
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <ComponentCard title="The Mendel Galaxy App Section" name="">
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <Label>Section Label</Label>
          <Input
            type="text"
            placeholder="THE MENDEL GALAXY APP"
            value={data.sectionLabel}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateSection("sectionLabel", e.target.value)
            }
          />
        </div>
        <div>
          <Label>Section Title</Label>
          <Input
            type="text"
            placeholder="Here's what you get"
            value={data.sectionTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateSection("sectionTitle", e.target.value)
            }
          />
        </div>
        <div>
          <Label>Section Description</Label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[80px]"
            value={data.sectionDescription}
            onChange={(e) => updateSection("sectionDescription", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {data.tools.map((tool, toolIndex) => (
          <div key={toolIndex} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenTool(openTool === toolIndex ? -1 : toolIndex)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-left"
            >
              <span className="font-semibold text-gray-800">{tool.toolName}</span>
              <span className="text-gray-400">{openTool === toolIndex ? "▲" : "▼"}</span>
            </button>

            {openTool === toolIndex && (
              <div className="p-4 space-y-4">
                {renderVideoLinkSection(toolIndex, tool)}

                {(toolIndex <= 2 || toolIndex === 3) && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label>Section Subtitle</Label>
                        <Input
                          type="text"
                          placeholder="5,500+ questions that think like the exam"
                          value={tool.sectionSubtitle}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateTool(toolIndex, (t) => ({ ...t, sectionSubtitle: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Bottom Scroll Text (optional)</Label>
                        <Input
                          type="text"
                          placeholder="Scroll to explore sample questions →"
                          value={tool.bottomText}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateTool(toolIndex, (t) => ({ ...t, bottomText: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  </>
                )}

                {renderDetailPopup(toolIndex, tool)}

                {toolIndex === 1 && renderChitraCards(toolIndex, tool)}
                {toolIndex === 2 && renderFlashcardQA(toolIndex, tool)}
              </div>
            )}
          </div>
        ))}
      </div>
    </ComponentCard>
  );
};

export default GalaxyAppSectionForm;
