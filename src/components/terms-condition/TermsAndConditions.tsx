'use client';
import React, { useEffect, useState } from 'react'
import ComponentCard from '../common/ComponentCard'
import Button from '../ui/button/Button'
import { useRouter } from 'next/navigation'
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { decodeHtml } from '@/utils/helper';
import { toast } from 'react-toastify';

const TermsAndConditions = () => {
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
                const res = await api.get(`${endPointApi.getAllTermsAndConditions}`);
                const data = res.data || {};
                console.log(":==", data.data?.description);

                const decodedDescription = decodeHtml(data.data.description ?? "");
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
        // const isValid = await validate();
        // if (!isValid) return;
        setIsSubmitting(true);
        try {
            const body = {
                description: formData.description,
            }
            const res = await api.post(`${endPointApi.postTermsAndConditions}`, body);
            toast.success(res.data?.message);

            // router.push("/faq");
        } catch (error) {
            toast.error("Something went wrong! Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const editorHeader = (
        <span className="ql-formats">
            {/* Text styles */}
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />

            {/* Text color & background */}
            <select className="ql-color" />
            <select className="ql-background" />

            {/* Headings */}
            <select className="ql-header">
                <option value="1">H1</option>
                <option value="2">H2</option>
                <option value="3">H3</option>
                <option value="">Normal</option>
            </select>

            {/* Alignment */}
            <select className="ql-align" />

            {/* Lists */}
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />

            {/* Indent */}
            <button className="ql-indent" value="-1" />
            <button className="ql-indent" value="+1" />

            {/* Blockquote & Code */}
            <button className="ql-blockquote" />
            <button className="ql-code-block" />

            {/* Link only (no image) */}
            <button className="ql-link" />

            {/* Clear formatting */}
            <button className="ql-clean" />
        </span>
    );

    return (
        <div className="space-y-6">
            <ComponentCard title="Add T&C" name="">

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">

                    <div>
                        <div>
                            <Editor
                                value={formData.description}
                                onTextChange={handleEditorChange}
                                style={{ height: "420px" }}
                                headerTemplate={editorHeader}
                                className={` ${errors.description
                                    ? "border border-error-500"
                                    : "border border-gray-100"
                                    }`}
                            />
                            {errors.description && <p className="text-sm text-error-500 mt-1">{errors.description}</p>}
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

export default TermsAndConditions;