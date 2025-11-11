import React, { useState } from 'react'
import ComponentCard from '../common/ComponentCard'
import Label from '../form/Label'
import Input from '../form/input/InputField'
import DropzoneComponent from '../blogs/DropZone'
import { Editor } from 'primereact/editor'

const EnrollSection = () => {
    const [preview, setPreview] = useState<string | null>(null);
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
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <Label>Description</Label>
                            <Editor
                                style={{ height: "320px" }}
                            />
                        </div>
                    </div>
                    <DropzoneComponent
                        preview={preview}
                        setPreview={setPreview}
                    />
                </ComponentCard>
            </div>
        </div>
    )
}

export default EnrollSection