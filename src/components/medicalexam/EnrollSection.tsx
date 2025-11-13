import React from "react";
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
  previewWho: string | null; // ✅ matches useState<string | null>
  setPreviewWho: React.Dispatch<React.SetStateAction<string | null>>;
}

const EnrollSection: React.FC<EnrollSectionProps> = ({ data, onChange, previewWho, setPreviewWho }) => {

  const handleChange = (field: keyof EnrollData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <ComponentCard title="Add Enroll" name="">
        {/* ✅ Title Input */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Enter Title"
              value={data.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
        </div>

        {/* ✅ Description Editor */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Label>Description</Label>
            <Editor
              style={{ height: "320px" }}
              value={data.description}
              onTextChange={(e) =>
                handleChange("description", e.htmlValue ?? "")
              }
            />
          </div>
        </div>

        {/* ✅ Image Dropzone */}
        <DropzoneComponent
          preview={previewWho}
          setPreview={setPreviewWho}
          onFileSelect={(file: File) => handleChange("image", file)}
        />
      </ComponentCard>
    </div>
  );
};

export default EnrollSection;
