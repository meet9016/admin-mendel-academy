'use client';
import React from 'react'
import ComponentCard from '../common/ComponentCard'
import Label from '../form/Label'
import Input from '../form/input/InputField'
import Button from '../ui/button/Button'
import { useRouter } from 'next/navigation'
import { Editor } from 'primereact/editor';

const Faq = () => {
    const router = useRouter();
    return (
        <div className="space-y-6">
            <ComponentCard title="Add FAQ" name="">

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div>
                        <Label>Title</Label>
                        <Input type="text" placeholder="Enter title" />
                    </div>

                    <div>
                        <div>
                            <Editor
                                style={{ height: "320px" }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    <Button size="sm" variant="primary" >
                        Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => router.push("/faq")}>
                        Cancel
                    </Button>
                </div>
            </ComponentCard>
        </div>
    )
}

export default Faq