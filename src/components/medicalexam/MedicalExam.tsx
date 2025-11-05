"use client";
import React, { useState } from "react";
import Label from "../form/Label";
import ComponentCard from "../common/ComponentCard";
import Input from "../form/input/InputField";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { Editor } from "primereact/editor";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import { useRouter } from "next/navigation";

const MedicalExam = () => {
    const router = useRouter()
    const categoryOptions = [
        { value: "USMLE Program", label: "USMLE Program" },
        { value: "International Exams", label: "International Exams" },
    ];
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [examSteps, setExamSteps] = useState<string[]>([""]);

    console.log(examSteps, 'examSteps');

    const addStep = () => {
        setExamSteps([...examSteps, ""]);
    };

    const removeStep = (index: number) => {
        console.log(index, 'oooooooooooooo')
        const updated = examSteps.filter((_, i) => i !== index);
        setExamSteps(updated);
        console.log(updated, 'updtaedddd')
    };

    const handleStepChange = (index: number, value: string) => {
        const updated = [...examSteps];
        updated[index] = value;
        setExamSteps(updated);
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Add Medical Exam" name="">
                {/* Category + Exam Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label>Course Category</Label>
                        <Select
                            options={categoryOptions}
                            placeholder="Select category"
                        />
                    </div>

                    <div>
                        <Label htmlFor="price">Exam name</Label>
                        <Input type="text" placeholder="Exam name" />
                    </div>
                </div>

                {/* Exam Detail Steps */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <Label>Exam Detail Steps</Label>
                        <button
                            type="button"
                            onClick={addStep}
                            className="bg-[#ffcb07] text-white w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#ffcb07] transition-colors duration-200"
                        >
                            <FaPlus />
                        </button>
                    </div>

                    {/* Inputs in 2-column layout same as Exam Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {examSteps.map((step, index) => (
                            <div key={index} className="relative">
                                <Input
                                    type="text"
                                    placeholder={`Exam detail step ${index + 1}`}
                                    value={step}
                                    onChange={(e: any) =>
                                        handleStepChange(index, e.target.value)
                                    }
                                />
                                {examSteps.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeStep(index)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 border border-[#ffcb07] text-[#ffcb07] w-8 h-8 rounded-md flex items-center justify-center hover:bg-[#ffcb07] hover:text-white transition-colors duration-200"
                                    >
                                        <FaMinus />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <Editor
                            style={{ height: "320px" }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    <Button size="sm" variant="primary">
                        Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => router.push("/medicalexamlist")}>
                        Cancel
                    </Button>
                </div>
            </ComponentCard>
        </div>
    );
};

export default MedicalExam;
