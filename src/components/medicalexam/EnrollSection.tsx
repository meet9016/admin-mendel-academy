import React, { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import DropzoneComponent from "../blogs/DropZone";
import { Editor } from "primereact/editor";

interface EnrollData {
    title: string;
    description: string;
    image: File | null;
}

interface EnrollSectionProps {
    data: EnrollData;
    onChange: (data: EnrollData) => void;
}

const EnrollSection: React.FC<EnrollSectionProps> = ({ data, onChange }) => {
    const [localData, setLocalData] = useState<EnrollData>(data);
    const [preview, setPreview] = useState<string | null>(null);

    // ✅ Sync local state with parent data whenever parent updates
    useEffect(() => {
        setLocalData(data);
    }, [data]);

    const handleChange = (field: keyof EnrollData, value: any) => {
        const updated = { ...localData, [field]: value };
        setLocalData(updated);
        onChange(updated);
    };

    return (
        <div>
            <div className="space-y-6">
                <ComponentCard title="Add Enroll" name="">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                placeholder="Enter Title"
                                value={localData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <Label>Description</Label>
                            <Editor
                                style={{ height: "320px" }}
                                value={localData.description}
                                onTextChange={(e) =>
                                    handleChange("description", e.htmlValue ?? "")
                                }
                            />
                        </div>
                    </div>

                    <DropzoneComponent
                        preview={preview}
                        setPreview={setPreview}
                        onFileSelect={(file: File) => handleChange("image", file)}
                    />
                </ComponentCard>
            </div>
        </div>
    );
};

export default EnrollSection;
