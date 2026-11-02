"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import { Skeleton } from "primereact/skeleton";
import {
  FaSave,
  FaUndo,
  FaExternalLinkAlt,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import {
  FiLayout,
  FiVideo,
  FiTool,
  FiDollarSign,
  FiUsers,
  FiMessageSquare,
  FiHelpCircle,
  FiCheckCircle,
} from "react-icons/fi";

export const DEFAULT_STEP1_CONTENT = {
  hero: {
    eyebrow: "USMLE STEP 1 PREP",
    title: "Step 1, simplified.",
    highlight: "simplified.",
    subtitle:
      "QBank, illustrated Chitras, flashcards and notes in one app, with analytics that tell you when you’re ready.",
    trial_btn_text: "Try a free Self-Assessment",
    trial_btn_link: "/auth/register?offer=self-assessment",
    tour_btn_text: "Watch the app tour",
    meta_text:
      "For MD students, DO students and IMGs · iPhone, iPad and web",
    mockup_days_left: "109 days left",
  },
  tour: {
    eyebrow: "A LOOK INSIDE · 3-MINUTE TOUR",
    title: "Practice it. Understand the why. Track it.",
    title_highlight: "the why",
    video_url: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1",
    card_title: "Watch the 3-minute app tour",
    card_subtitle:
      "See QBank, Chitras, Flashcards and Self-Assessments in action.",
    card_btn_text: "Play video tour",
  },
  tools: {
    eyebrow: "WHAT’S INCLUDED",
    title: "Six study tools. One subscription.",
    subtitle:
      "Everything you need for comprehensive preclinical mastery and high-confidence board preparation.",
    list: [
      {
        title: "Mendel QBank",
        desc: "Tutor and exam modes, custom blocks, and Understand the why after every question.",
        tag: "CORE QUESTION BANK",
      },
      {
        title: "Mendel Chitras",
        desc: "853 illustrated one-page visual summaries covering pathophysiology to memory hacks.",
        tag: "VISUAL MEMORY",
      },
      {
        title: "Mendel Flashcards",
        desc: "Spaced repetition that schedules reviews for you based on mastery curve.",
        tag: "SPACED REPETITION",
      },
      {
        title: "Mendel Study Notes",
        desc: "2,300+ concise notes organized systematically by organ system and discipline.",
        tag: "HIGH YIELD NOTES",
      },
      {
        title: "Rapid Recall",
        desc: "High-yield diagnostic and pharmacology tables engineered for last-minute review.",
        tag: "LAST MINUTE DRILLS",
      },
      {
        title: "Fast Facts",
        desc: "Clinical mnemonics that explain the core mechanism, not just abbreviate words.",
        tag: "SMART MNEMONICS",
      },
    ],
  },
  ready: {
    badge: "PREDICTED READINESS",
    title: "Know if you’re ready to pass.",
    description:
      "Step 1 is pass/fail. Our NBME-style Self-Assessments give you a predicted score and percentile, so you know how far above the line you are. Your first one is free, and every plan adds two more.",
    btn_text: "Start 5-day free trial",
    btn_link: "/auth/register?offer=trial",
  },
  pricing: {
    eyebrow: "PRICING",
    title: "Every tool, every plan.",
    subtitle:
      "All six study tools and 3 Self-Assessments with every plan. Longer plans cost less per month.",
    disclaimer:
      "All prices in USD. Immediate access upon enrollment. Cancel anytime.",
    plans: [
      {
        duration: "1 month",
        price: "$309",
        pm: "$309 / mo",
        popular: false,
        badge: "",
        desc: "Last-mile intensive practice.",
      },
      {
        duration: "3 months",
        price: "$429",
        pm: "≈ $143 / mo",
        popular: false,
        badge: "",
        desc: "Organ system mastery cycle.",
      },
      {
        duration: "6 months",
        price: "$449",
        pm: "≈ $75 / mo",
        popular: false,
        badge: "",
        desc: "Extended pre-dedicated prep.",
      },
      {
        duration: "12 months",
        price: "$499",
        pm: "≈ $42 / mo",
        popular: true,
        badge: "BEST VALUE",
        desc: "Complete 365-day board foundation.",
      },
      {
        duration: "24 months",
        price: "$699",
        pm: "≈ $29 / mo",
        popular: false,
        badge: "",
        desc: "Day 1 preclinical to board exam.",
      },
    ],
  },
  mentorship: {
    eyebrow: "LIVE MENTORSHIP",
    title: "Prefer to learn live?",
    subtitle:
      "Physician-led coaching with Dr. Kishore Managoli, MD. Every course includes one year of the Mendel Galaxy app free.",
    featured: {
      badge: "THIS PAGE’S EXAM",
      name: "USMLE Step 1 Mentorship",
      subtitle: "High-yield group mentorship with Dr. Managoli",
      price: "$1,199",
      features: [
        "Live virtual group classes",
        "Concept-first, visual teaching",
        "1-year Mendel Galaxy app access included",
      ],
      btn_text: "Enroll in Step 1 Mentorship",
      btn_link: "/auth/register?mentorship=usmle-step-1",
    },
    other_courses: [
      {
        name: "USMLE Step 2 CK",
        badge: "Popular",
        price: "$1,499",
        link: "/auth/register?mentorship=step-2-ck",
      },
      {
        name: "USMLE Step 3",
        badge: "",
        price: "$899",
        link: "/auth/register?mentorship=step-3",
      },
      {
        name: "COMLEX 1",
        badge: "",
        price: "$1,199",
        link: "/auth/register?mentorship=comlex-1",
      },
      {
        name: "Shelf exams",
        badge: "/ per exam",
        price: "$299",
        link: "/auth/register?mentorship=shelf",
      },
    ],
    bundles: [
      {
        tag: "Bundle",
        name: "Tsunami Bundle",
        subtitle: "Step 1 + Step 2 CK live mentorship",
        price: "$2,235",
        link: "/auth/register?bundle=tsunami",
      },
      {
        tag: "Bundle · Boards to Match",
        name: "Full Match Bundle",
        subtitle: "Step 1 + Step 2 CK + Step 3 complete pathway",
        price: "$2,995",
        link: "/auth/register?bundle=full-match",
      },
    ],
    one_on_one_title: "Designer 1:1 mentoring",
    one_on_one_desc:
      "A personal roadmap built around your clinical strengths, diagnostic speed, and subject weaknesses.",
    one_on_one_btn: "Contact us for details",
  },
  testimonials: {
    eyebrow: "STUDENT STORIES",
    title: "Real scores. Real matches.",
    list: [
      {
        quote:
          "“The Chitras changed how I think about disease mechanisms. I stopped memorizing and started understanding.”",
        author: "Riaa S.",
        credential: "Matched Internal Medicine",
      },
      {
        quote:
          "“As an IMG, I needed a structured approach. The explanations teach you to think, not just recall.”",
        author: "Arjun M.",
        credential: "IMG · Matched Neurology",
      },
      {
        quote:
          "“Dr. Managoli’s mentorship rebuilt my approach. Rapid Recall saved me the week before the exam.”",
        author: "Priya K.",
        credential: "Matched Psychiatry",
      },
    ],
  },
  faqs: {
    title: "Questions, answered.",
    subtitle: "Still deciding? Watch the app tour first →",
    footer_text:
      "Last updated October 30, 2026 · Mendel Academy, founded by Dr. Kishore Managoli, MD",
    list: [
      {
        q: "Is USMLE Step 1 pass/fail?",
        a: "Yes. USMLE Step 1 has reported pass/fail outcomes only since January 26, 2022. Step 2 CK and Step 3 still report a three-digit score. Mendel Academy’s Self-Assessments estimate how ready you are to pass with statistical confidence intervals.",
      },
      {
        q: "What is the Mendel Academy USMLE Step 1 program?",
        a: "It is a concept-first USMLE Step 1 prep program delivered in the Mendel Galaxy app. It includes a QBank, Mendel Chitras, flashcards, study notes, Rapid Recall and Fast Facts, plus analytics and NBME-style Self-Assessments.",
      },
      {
        q: "How much does Mendel Academy Step 1 prep cost?",
        a: "App plans range from $309 for 1 month to $699 for 24 months; the 12-month plan is $499. Every plan includes all six study tools and three Self-Assessments in total. Live Step 1 mentorship is $1,199 and includes one year of app access.",
      },
      {
        q: "How many Self-Assessments are included?",
        a: "Self-Assessment 1 is free for everyone, with no purchase needed. Every Mendel Galaxy app plan adds Self-Assessments 2 and 3, so plan members get three in total. Self-Assessment 4 is available separately. Each is an NBME-style, exam-paced test of 280 questions with a predicted score and percentile.",
      },
      {
        q: "What is Understand the why in the Mendel QBank?",
        a: "Understand the why is the explanation after every Mendel QBank question. Triage paraphrases the question down to what it is really asking, Core Mechanism explains the science, Peel the Reasoning reveals the logic one clue at a time down to the core principle, and The Trap breaks down the dangerous distractors and how to duck them. It closes with the educational objective, the question writer’s intent and a Mendel Hack to remember it.",
      },
      {
        q: "What is a Mendel Chitra?",
        a: "A Mendel Chitra is a hand-illustrated, one-page visual summary of a medical topic, covering definition, pathophysiology, presentation, workup, management and memory hacks.",
      },
      {
        q: "Is Mendel Academy good for IMGs and DO students?",
        a: "Yes. The program is specifically built for preclinical MD students, international medical graduates (IMGs) and DO students taking USMLE Step 1.",
      },
      {
        q: "Which devices does the Mendel Galaxy app work on?",
        a: "The Mendel Galaxy app works on iPhone, iPad and on the web from any desktop or laptop.",
      },
    ],
  },
  cta: {
    title: "Simplify your Step 1 prep today.",
    btn_text: "Try a free Self-Assessment",
    btn_link: "/auth/register?offer=self-assessment",
  },
};

interface Props {
  examId: string;
}

export default function USMLEStep1ContentForm({ examId }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "hero"
    | "tour"
    | "tools"
    | "ready"
    | "pricing"
    | "mentorship"
    | "testimonials"
    | "faqs_cta"
  >("hero");
  const [formData, setFormData] = useState<any>(DEFAULT_STEP1_CONTENT);

  useEffect(() => {
    if (examId) {
      fetchDetail();
    }
  }, [examId]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endPointApi.getByIdExamList}/${examId}`);
      const data = res.data || {};
      const savedDetail = data.usmle_step1_detail;

      if (savedDetail && typeof savedDetail === "object" && Object.keys(savedDetail).length > 0) {
        setFormData({
          hero: { ...DEFAULT_STEP1_CONTENT.hero, ...(savedDetail.hero || {}) },
          tour: { ...DEFAULT_STEP1_CONTENT.tour, ...(savedDetail.tour || {}) },
          tools: {
            ...DEFAULT_STEP1_CONTENT.tools,
            ...(savedDetail.tools || {}),
            list: savedDetail.tools?.list || DEFAULT_STEP1_CONTENT.tools.list,
          },
          ready: { ...DEFAULT_STEP1_CONTENT.ready, ...(savedDetail.ready || {}) },
          pricing: {
            ...DEFAULT_STEP1_CONTENT.pricing,
            ...(savedDetail.pricing || {}),
            plans:
              savedDetail.pricing?.plans && savedDetail.pricing.plans.length > 0
                ? savedDetail.pricing.plans
                : DEFAULT_STEP1_CONTENT.pricing.plans,
          },
          mentorship: {
            ...DEFAULT_STEP1_CONTENT.mentorship,
            ...(savedDetail.mentorship || {}),
            featured: {
              ...DEFAULT_STEP1_CONTENT.mentorship.featured,
              ...(savedDetail.mentorship?.featured || {}),
              features:
                savedDetail.mentorship?.featured?.features ||
                DEFAULT_STEP1_CONTENT.mentorship.featured.features,
            },
            other_courses:
              savedDetail.mentorship?.other_courses ||
              DEFAULT_STEP1_CONTENT.mentorship.other_courses,
            bundles:
              savedDetail.mentorship?.bundles ||
              DEFAULT_STEP1_CONTENT.mentorship.bundles,
          },
          testimonials: {
            ...DEFAULT_STEP1_CONTENT.testimonials,
            ...(savedDetail.testimonials || {}),
            list:
              savedDetail.testimonials?.list ||
              DEFAULT_STEP1_CONTENT.testimonials.list,
          },
          faqs: {
            ...DEFAULT_STEP1_CONTENT.faqs,
            ...(savedDetail.faqs || {}),
            list: savedDetail.faqs?.list || DEFAULT_STEP1_CONTENT.faqs.list,
          },
          cta: { ...DEFAULT_STEP1_CONTENT.cta, ...(savedDetail.cta || {}) },
        });
      } else {
        setFormData(DEFAULT_STEP1_CONTENT);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load USMLE Step 1 page content");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const endpoint = endPointApi.updateStep1Detail || "examlist/update-step1";
      await api.put(`${endpoint}/${examId}`, {
        usmle_step1_detail: formData,
      });
      toast.success("USMLE Step 1 page content saved successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all fields to their original default values?"
      )
    ) {
      setFormData(DEFAULT_STEP1_CONTENT);
      toast.info("Reset to defaults. Remember to click 'Save Changes' to persist.");
    }
  };

  const updateSection = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
        <Skeleton width="40%" height="2rem" />
        <Skeleton width="100%" height="15rem" />
        <Skeleton width="80%" height="3rem" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            USMLE Step 1 Landing Page Editor
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Edit all content displayed on{" "}
            <code className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[11px]">
              /services/usmle-step-1
            </code>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <a
            href="http://localhost:3006/services/usmle-step-1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FaExternalLinkAlt className="w-3 h-3 text-gray-500" />
            <span>View Live Page</span>
          </a>

          <button
            type="button"
            onClick={handleResetToDefaults}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
          >
            <FaUndo className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ffcb07] hover:bg-yellow-400 text-black font-bold text-xs shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <FaSave className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-200 bg-white px-4 py-2.5 rounded-2xl shadow-xs">
        {[
          { id: "hero", label: "Hero Section", icon: <FiLayout /> },
          { id: "tour", label: "3-Min Tour Video", icon: <FiVideo /> },
          { id: "tools", label: "6 Study Tools", icon: <FiTool /> },
          { id: "ready", label: "Predicted Readiness", icon: <FiCheckCircle /> },
          { id: "pricing", label: "Pricing Plans", icon: <FiDollarSign /> },
          { id: "mentorship", label: "Live Mentorship", icon: <FiUsers /> },
          { id: "testimonials", label: "Testimonials", icon: <FiMessageSquare /> },
          { id: "faqs_cta", label: "FAQs & Final CTA", icon: <FiHelpCircle /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-black text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Hero Section */}
      {activeTab === "hero" && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900">Hero Section Content</h3>
            <p className="text-xs text-gray-500">Main header, badges, CTA buttons and phone mockup copy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Eyebrow Badge
              </label>
              <input
                type="text"
                value={formData.hero.eyebrow}
                onChange={(e) => updateSection("hero", "eyebrow", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Highlighted Word in Headline
              </label>
              <input
                type="text"
                value={formData.hero.highlight}
                onChange={(e) => updateSection("hero", "highlight", e.target.value)}
                placeholder="e.g. simplified."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Main Headline
              </label>
              <input
                type="text"
                value={formData.hero.title}
                onChange={(e) => updateSection("hero", "title", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Subtitle Description
              </label>
              <textarea
                rows={2}
                value={formData.hero.subtitle}
                onChange={(e) => updateSection("hero", "subtitle", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Primary Button Text
              </label>
              <input
                type="text"
                value={formData.hero.trial_btn_text}
                onChange={(e) => updateSection("hero", "trial_btn_text", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Primary Button Link
              </label>
              <input
                type="text"
                value={formData.hero.trial_btn_link}
                onChange={(e) => updateSection("hero", "trial_btn_link", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Tour Button Text
              </label>
              <input
                type="text"
                value={formData.hero.tour_btn_text}
                onChange={(e) => updateSection("hero", "tour_btn_text", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Target Audience Sub-line
              </label>
              <input
                type="text"
                value={formData.hero.meta_text}
                onChange={(e) => updateSection("hero", "meta_text", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Hero Phone Mockup Countdown Tag
              </label>
              <input
                type="text"
                value={formData.hero.mockup_days_left}
                onChange={(e) => updateSection("hero", "mockup_days_left", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 3-Minute Tour Video */}
      {activeTab === "tour" && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900">3-Minute Tour Video</h3>
            <p className="text-xs text-gray-500">Configure video embed link and tour CTA card.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Tour Section Eyebrow</label>
              <input
                type="text"
                value={formData.tour.eyebrow}
                onChange={(e) => updateSection("tour", "eyebrow", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Highlighted Text</label>
              <input
                type="text"
                value={formData.tour.title_highlight}
                onChange={(e) => updateSection("tour", "title_highlight", e.target.value)}
                placeholder="e.g. the why"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">Tour Section Title</label>
              <input
                type="text"
                value={formData.tour.title}
                onChange={(e) => updateSection("tour", "title", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">
                YouTube Video Embed URL
              </label>
              <input
                type="text"
                value={formData.tour.video_url}
                onChange={(e) => updateSection("tour", "video_url", e.target.value)}
                placeholder="https://www.youtube-nocookie.com/embed/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Video CTA Title</label>
              <input
                type="text"
                value={formData.tour.card_title}
                onChange={(e) => updateSection("tour", "card_title", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Video CTA Subtitle</label>
              <input
                type="text"
                value={formData.tour.card_subtitle}
                onChange={(e) => updateSection("tour", "card_subtitle", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Video CTA Button Text</label>
              <input
                type="text"
                value={formData.tour.card_btn_text}
                onChange={(e) => updateSection("tour", "card_btn_text", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: 6 Study Tools */}
      {activeTab === "tools" && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900">Six Study Tools</h3>
            <p className="text-xs text-gray-500">Manage tool titles, tags, and descriptions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Eyebrow</label>
              <input
                type="text"
                value={formData.tools.eyebrow}
                onChange={(e) => updateSection("tools", "eyebrow", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Title</label>
              <input
                type="text"
                value={formData.tools.title}
                onChange={(e) => updateSection("tools", "title", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">Subtitle</label>
              <input
                type="text"
                value={formData.tools.subtitle}
                onChange={(e) => updateSection("tools", "subtitle", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-900">Tools List</h4>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev: any) => ({
                    ...prev,
                    tools: {
                      ...prev.tools,
                      list: [
                        ...prev.tools.list,
                        { title: "New Tool", desc: "Tool description", tag: "FEATURE" },
                      ],
                    },
                  }))
                }
                className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
              >
                <FaPlus className="w-3 h-3" /> Add Tool
              </button>
            </div>

            {formData.tools.list.map((tool: any, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-gray-400">Tool #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.tools.list];
                      updated.splice(idx, 1);
                      updateSection("tools", "list", updated);
                    }}
                    className="text-xs text-rose-500 hover:text-rose-700 cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Tool Title</label>
                    <input
                      type="text"
                      value={tool.title}
                      onChange={(e) => {
                        const updated = [...formData.tools.list];
                        updated[idx].title = e.target.value;
                        updateSection("tools", "list", updated);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Category Tag</label>
                    <input
                      type="text"
                      value={tool.tag}
                      onChange={(e) => {
                        const updated = [...formData.tools.list];
                        updated[idx].tag = e.target.value;
                        updateSection("tools", "list", updated);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={tool.desc}
                    onChange={(e) => {
                      const updated = [...formData.tools.list];
                      updated[idx].desc = e.target.value;
                      updateSection("tools", "list", updated);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Predicted Readiness */}
      {activeTab === "ready" && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900">Predicted Readiness Banner</h3>
            <p className="text-xs text-gray-500">Configure the yellow banner explaining pass/fail readiness and self-assessments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Badge</label>
              <input
                type="text"
                value={formData.ready.badge}
                onChange={(e) => updateSection("ready", "badge", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Title</label>
              <input
                type="text"
                value={formData.ready.title}
                onChange={(e) => updateSection("ready", "title", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.ready.description}
                onChange={(e) => updateSection("ready", "description", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Button Text</label>
              <input
                type="text"
                value={formData.ready.btn_text}
                onChange={(e) => updateSection("ready", "btn_text", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Button Link</label>
              <input
                type="text"
                value={formData.ready.btn_link}
                onChange={(e) => updateSection("ready", "btn_link", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Pricing Plans */}
      {activeTab === "pricing" && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900">Pricing Section &amp; Plans</h3>
            <p className="text-xs text-gray-500">Edit the pricing title, description, disclaimer, and all 5 subscription plans.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Pricing Eyebrow</label>
              <input
                type="text"
                value={formData.pricing.eyebrow}
                onChange={(e) => updateSection("pricing", "eyebrow", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Pricing Title</label>
              <input
                type="text"
                value={formData.pricing.title}
                onChange={(e) => updateSection("pricing", "title", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">Pricing Subtitle</label>
              <textarea
                rows={2}
                value={formData.pricing.subtitle}
                onChange={(e) => updateSection("pricing", "subtitle", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">Pricing Disclaimer Text</label>
              <input
                type="text"
                value={formData.pricing.disclaimer}
                onChange={(e) => updateSection("pricing", "disclaimer", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 mt-4 space-y-4">
            <h4 className="text-sm font-bold text-gray-900">5 Subscription Plans</h4>
            <div className="space-y-4">
              {formData.pricing.plans.map((p: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">Plan #{idx + 1} ({p.duration})</span>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(p.popular)}
                        onChange={(e) => {
                          const updated = [...formData.pricing.plans];
                          updated.forEach((plan, i) => {
                            plan.popular = i === idx ? e.target.checked : false;
                            plan.badge = plan.popular ? "BEST VALUE" : "";
                          });
                          updateSection("pricing", "plans", updated);
                        }}
                        className="rounded text-amber-500 focus:ring-yellow-400"
                      />
                      <span>Mark as Most Popular (Best Value)</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-600 block mb-1">Duration Label</label>
                      <input
                        type="text"
                        value={p.duration}
                        onChange={(e) => {
                          const updated = [...formData.pricing.plans];
                          updated[idx].duration = e.target.value;
                          updateSection("pricing", "plans", updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-600 block mb-1">Price</label>
                      <input
                        type="text"
                        value={p.price}
                        onChange={(e) => {
                          const updated = [...formData.pricing.plans];
                          updated[idx].price = e.target.value;
                          updateSection("pricing", "plans", updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-600 block mb-1">Per-Month Rate</label>
                      <input
                        type="text"
                        value={p.pm}
                        onChange={(e) => {
                          const updated = [...formData.pricing.plans];
                          updated[idx].pm = e.target.value;
                          updateSection("pricing", "plans", updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-600 block mb-1">Description</label>
                      <input
                        type="text"
                        value={p.desc}
                        onChange={(e) => {
                          const updated = [...formData.pricing.plans];
                          updated[idx].desc = e.target.value;
                          updateSection("pricing", "plans", updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Live Mentorship */}
      {activeTab === "mentorship" && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900">Live Mentorship &amp; Bundles</h3>
            <p className="text-xs text-gray-500">Configure Featured Step 1 Mentorship, other courses, bundle pricing, and 1:1 consultation banner.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Section Eyebrow</label>
              <input
                type="text"
                value={formData.mentorship.eyebrow}
                onChange={(e) => updateSection("mentorship", "eyebrow", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Section Title</label>
              <input
                type="text"
                value={formData.mentorship.title}
                onChange={(e) => updateSection("mentorship", "title", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">Section Subtitle</label>
              <input
                type="text"
                value={formData.mentorship.subtitle}
                onChange={(e) => updateSection("mentorship", "subtitle", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>
          </div>

          {/* Featured Mentorship Card */}
          <div className="border-t border-gray-100 pt-5 mt-4 space-y-4">
            <h4 className="text-sm font-bold text-gray-900">Featured Course (Left Card)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Badge</label>
                <input
                  type="text"
                  value={formData.mentorship.featured.badge}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      mentorship: {
                        ...prev.mentorship,
                        featured: { ...prev.mentorship.featured, badge: e.target.value },
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Course Name</label>
                <input
                  type="text"
                  value={formData.mentorship.featured.name}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      mentorship: {
                        ...prev.mentorship,
                        featured: { ...prev.mentorship.featured, name: e.target.value },
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Price</label>
                <input
                  type="text"
                  value={formData.mentorship.featured.price}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      mentorship: {
                        ...prev.mentorship,
                        featured: { ...prev.mentorship.featured, price: e.target.value },
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Bundles */}
          <div className="border-t border-gray-100 pt-5 mt-4 space-y-4">
            <h4 className="text-sm font-bold text-gray-900">Bundles</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.mentorship.bundles.map((bundle: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <label className="text-xs font-bold text-gray-700 block">Bundle #{idx + 1}</label>
                  <input
                    type="text"
                    value={bundle.name}
                    onChange={(e) => {
                      const updated = [...formData.mentorship.bundles];
                      updated[idx].name = e.target.value;
                      updateSection("mentorship", "bundles", updated);
                    }}
                    placeholder="Bundle Name"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-sm"
                  />
                  <input
                    type="text"
                    value={bundle.subtitle}
                    onChange={(e) => {
                      const updated = [...formData.mentorship.bundles];
                      updated[idx].subtitle = e.target.value;
                      updateSection("mentorship", "bundles", updated);
                    }}
                    placeholder="Subtitle"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-sm"
                  />
                  <input
                    type="text"
                    value={bundle.price}
                    onChange={(e) => {
                      const updated = [...formData.mentorship.bundles];
                      updated[idx].price = e.target.value;
                      updateSection("mentorship", "bundles", updated);
                    }}
                    placeholder="Price (e.g. $2,235)"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 1:1 Mentoring Strip */}
          <div className="border-t border-gray-100 pt-5 mt-4 space-y-4">
            <h4 className="text-sm font-bold text-gray-900">Designer 1:1 Mentoring Strip</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Title</label>
                <input
                  type="text"
                  value={formData.mentorship.one_on_one_title}
                  onChange={(e) => updateSection("mentorship", "one_on_one_title", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Button Text</label>
                <input
                  type="text"
                  value={formData.mentorship.one_on_one_btn}
                  onChange={(e) => updateSection("mentorship", "one_on_one_btn", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-600 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.mentorship.one_on_one_desc}
                  onChange={(e) => updateSection("mentorship", "one_on_one_desc", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Testimonials */}
      {activeTab === "testimonials" && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900">Student Stories &amp; Testimonials</h3>
            <p className="text-xs text-gray-500">Manage student quotes, names, and residency match credentials.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Section Eyebrow</label>
              <input
                type="text"
                value={formData.testimonials.eyebrow}
                onChange={(e) => updateSection("testimonials", "eyebrow", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Section Title</label>
              <input
                type="text"
                value={formData.testimonials.title}
                onChange={(e) => updateSection("testimonials", "title", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-900">Testimonials List</h4>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev: any) => ({
                    ...prev,
                    testimonials: {
                      ...prev.testimonials,
                      list: [
                        ...prev.testimonials.list,
                        {
                          quote: "“New student testimonial quote here.”",
                          author: "Dr. Name",
                          credential: "Matched Specialty",
                        },
                      ],
                    },
                  }))
                }
                className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
              >
                <FaPlus className="w-3 h-3" /> Add Testimonial
              </button>
            </div>

            {formData.testimonials.list.map((item: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">Story #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.testimonials.list];
                      updated.splice(idx, 1);
                      updateSection("testimonials", "list", updated);
                    }}
                    className="text-xs text-rose-500 hover:text-rose-700 cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Quote</label>
                  <textarea
                    rows={2}
                    value={item.quote}
                    onChange={(e) => {
                      const updated = [...formData.testimonials.list];
                      updated[idx].quote = e.target.value;
                      updateSection("testimonials", "list", updated);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Author Name</label>
                    <input
                      type="text"
                      value={item.author}
                      onChange={(e) => {
                        const updated = [...formData.testimonials.list];
                        updated[idx].author = e.target.value;
                        updateSection("testimonials", "list", updated);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Credential / Match</label>
                    <input
                      type="text"
                      value={item.credential}
                      onChange={(e) => {
                        const updated = [...formData.testimonials.list];
                        updated[idx].credential = e.target.value;
                        updateSection("testimonials", "list", updated);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: FAQs & Final CTA */}
      {activeTab === "faqs_cta" && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900">Frequently Asked Questions &amp; Final Banner</h3>
            <p className="text-xs text-gray-500">Manage accordion FAQs and bottom yellow call-to-action banner.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">FAQ Section Title</label>
              <input
                type="text"
                value={formData.faqs.title}
                onChange={(e) => updateSection("faqs", "title", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">FAQ Subtitle</label>
              <input
                type="text"
                value={formData.faqs.subtitle}
                onChange={(e) => updateSection("faqs", "subtitle", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">FAQ Footer Text</label>
              <input
                type="text"
                value={formData.faqs.footer_text}
                onChange={(e) => updateSection("faqs", "footer_text", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-900">FAQ List</h4>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev: any) => ({
                    ...prev,
                    faqs: {
                      ...prev.faqs,
                      list: [
                        ...prev.faqs.list,
                        { q: "New Question?", a: "Detailed answer goes here." },
                      ],
                    },
                  }))
                }
                className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
              >
                <FaPlus className="w-3 h-3" /> Add FAQ
              </button>
            </div>

            {formData.faqs.list.map((faq: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">FAQ #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.faqs.list];
                      updated.splice(idx, 1);
                      updateSection("faqs", "list", updated);
                    }}
                    className="text-xs text-rose-500 hover:text-rose-700 cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Question</label>
                  <input
                    type="text"
                    value={faq.q}
                    onChange={(e) => {
                      const updated = [...formData.faqs.list];
                      updated[idx].q = e.target.value;
                      updateSection("faqs", "list", updated);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Answer</label>
                  <textarea
                    rows={3}
                    value={faq.a}
                    onChange={(e) => {
                      const updated = [...formData.faqs.list];
                      updated[idx].a = e.target.value;
                      updateSection("faqs", "list", updated);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-5 mt-4 space-y-4">
            <h4 className="text-sm font-bold text-gray-900">Final Yellow CTA Banner</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Banner Title</label>
                <input
                  type="text"
                  value={formData.cta.title}
                  onChange={(e) => updateSection("cta", "title", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Button Text</label>
                <input
                  type="text"
                  value={formData.cta.btn_text}
                  onChange={(e) => updateSection("cta", "btn_text", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Button Link</label>
                <input
                  type="text"
                  value={formData.cta.btn_link}
                  onChange={(e) => updateSection("cta", "btn_link", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ffcb07] hover:bg-yellow-400 text-black font-bold text-sm shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          <FaSave className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save All Changes"}</span>
        </button>
      </div>
    </div>
  );
}
