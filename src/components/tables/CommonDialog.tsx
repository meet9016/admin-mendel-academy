import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { RxCross2 } from "react-icons/rx";
import { FiCheck } from "react-icons/fi";

type CommonDialogProps = {
    visible: boolean;
    header?: string;
    onHide: () => void;
    onSave?: () => void;
    onCancel?: () => void;
    footerType?: "save-cancel" | "confirm-delete";
    children?: React.ReactNode;
};

export default function CommonDialog({
    visible,
    header = "Details",
    onHide,
    onSave,
    onCancel,
    footerType = "save-cancel",
    children,
}: CommonDialogProps) {
    const footer =
        footerType === "save-cancel" ? (
            <>
                <Button
                    label="Cancel"
                    icon={<RxCross2 size={18} style={{ marginRight: "6px" }} />} // bigger icon + spacing
                    outlined
                    onClick={onCancel || onHide}
                    className="flex items-center"
                />
                <Button
                    label="Save"
                    icon={<FiCheck size={18} style={{ marginRight: "6px" }} />} // bigger icon + spacing
                    onClick={onSave}
                    className="flex items-center"
                />
            </>
        ) : (
            <>
                <Button
                    label="Yes"
                    // icon={<FiCheck size={18} style={{ marginRight: "6px" }} />}
                    // severity="danger"
                    onClick={onSave}
                    className="flex items-center popup-yes"
                />
                  <Button
                    label="No"
                    // icon={<RxCross2 size={18} style={{ marginRight: "6px" }} />}
                    outlined
                    onClick={onCancel || onHide}
                    className="flex items-center popup-no"
                />
            </>
        );

    return (
        <Dialog
            visible={visible}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header={header}
            modal
            className="p-fluid"
            footer={footer}
            onHide={onHide}
        >
            {children}
        </Dialog>
    );
}
