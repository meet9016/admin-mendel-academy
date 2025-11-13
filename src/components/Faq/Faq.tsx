'use client';
import React, { useEffect, useState } from 'react'
import ComponentCard from '../common/ComponentCard'
import Label from '../form/Label'
import Input from '../form/input/InputField'
import Button from '../ui/button/Button'
import { useRouter } from 'next/navigation'
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { decodeHtml } from '@/utils/helper';

const Faq = () => {
    const router = useRouter();
 const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setId(params.get("id"));
    }
  }, []);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    const [formData, setFormData] = useState({
        title: "",
        description: ""
    })

    // Handle text input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };


    // Handle Editor text change
    const handleEditorChange = (e: EditorTextChangeEvent) => {
        setFormData((prev) => ({
            ...prev,
            description: e.htmlValue || "",
        }));
        setErrors((prev) => ({ ...prev, description: "" }));
    };

    useEffect(() => {
        const fetchById = async () => {
            try {
                if (!id) return;
                const res = await api.get(`${endPointApi.getByIdFaq}/${id}`);
                const data = res.data || {};
                const decodedDescription = decodeHtml(data.description ?? "");
                setFormData({
                    title: data.title ?? "",
                    description: decodedDescription,
                });
            } catch (err) {
                console.error("Error fetching data by ID:", err);
            }
        };

        fetchById();
    }, [id]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const body = {
                title: formData.title,
                description: formData.description,
            }
            if (id) {
                await api.put(`${endPointApi.updateFaq}/${id}`, body);
            } else {
                await api.post(`${endPointApi.createFaq}`, body);
            }
            router.push("/faq");
        } catch (error) {
            console.error("Submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            <ComponentCard title="Add FAQ" name="">

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div>
                        <Label>Title</Label>
                        <Input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            error={!!errors.title}
                            placeholder="Enter title"
                        />
                    </div>

                    <div>
                        <div>
                            <Editor
                                value={formData.description}
                                onTextChange={handleEditorChange}
                                style={{ height: "320px" }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    <Button size="sm" variant="primary" onClick={handleSubmit} disabled={isSubmitting} >
                        {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => router.push("/faq")}>
                        Cancel
                    </Button>
                </div>
            </ComponentCard>
        </div>
    )
}

export default Faq;