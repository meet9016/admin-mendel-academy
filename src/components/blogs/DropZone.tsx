"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { toast } from "react-toastify";
import {
  FiUploadCloud,
  FiImage,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrash2,
  FiRefreshCw,
  FiInfo,
} from "react-icons/fi";

interface ImageMeta {
  width: number;
  height: number;
  size?: number;
  name?: string;
}

interface DropzoneProps {
  preview: string | null;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
  onFileSelect?: (file: File) => void;
  onRemove?: () => void;
  className?: string;
  recommendedWidth?: number;
  recommendedHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxSizeMB?: number;
}

const DropzoneComponent: React.FC<DropzoneProps> = ({
  preview,
  setPreview,
  onFileSelect,
  onRemove,
  className,
  recommendedWidth = 1200,
  recommendedHeight = 675,
  minWidth = 800,
  minHeight = 450,
  maxSizeMB = 5,
}) => {
  const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null);
  const [dimensionWarning, setDimensionWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Measure dimensions whenever preview changes
  useEffect(() => {
    if (preview && typeof preview === "string") {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        setImageMeta((prev) => ({
          width: w,
          height: h,
          size: prev?.size,
          name: prev?.name,
        }));

        if (w < minWidth || h < minHeight) {
          setDimensionWarning(
            `Image resolution (${w} × ${h} px) is lower than minimum recommended (${minWidth} × ${minHeight} px). It may appear pixelated.`
          );
        } else {
          setDimensionWarning(null);
        }
      };
      img.onerror = () => {
        console.warn("Could not load preview image for dimension detection.");
      };
      img.src = preview;
    } else {
      setImageMeta(null);
      setDimensionWarning(null);
    }
  }, [preview, minWidth, minHeight]);

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections && fileRejections.length > 0) {
      const rejection = fileRejections[0];
      const error = rejection.errors[0];
      if (error?.code === "file-too-large") {
        toast.error(`File size exceeds ${maxSizeMB} MB! Please choose a smaller image.`);
      } else {
        toast.error(error?.message || "Invalid file. Supported formats: JPG, PNG, WebP, SVG.");
      }
      return;
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const imageUrl = URL.createObjectURL(file);

      // Measure dimensions
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        setImageMeta({
          width: w,
          height: h,
          size: file.size,
          name: file.name,
        });

        if (w < minWidth || h < minHeight) {
          setDimensionWarning(
            `Warning: Uploaded image (${w} × ${h} px) is below minimum recommended (${minWidth} × ${minHeight} px).`
          );
        } else {
          setDimensionWarning(null);
        }
      };
      img.src = imageUrl;

      setPreview(imageUrl);
      onFileSelect?.(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: !!preview, // disable root click if image is already previewed, use button instead
    maxSize: maxSizeMB * 1024 * 1024,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "image/svg+xml": [".svg"],
    },
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setImageMeta(null);
    setDimensionWarning(null);
    if (onRemove) {
      onRemove();
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return null;
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  };

  return (
    <div className="space-y-3">
      {/* Dropzone Container */}
      <div
        {...getRootProps()}
        className={`relative transition-all duration-200 border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer overflow-hidden ${className ? className : "min-h-[300px]"
          } ${isDragActive
            ? "border-brand-500 bg-brand-50/50 dark:bg-brand-900/20"
            : preview
              ? "border-gray-300 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900/40 cursor-default"
              : "border-gray-300 hover:border-brand-400 bg-gray-50 hover:bg-gray-100/50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-500"
          }`}
      >
        <input {...getInputProps()} ref={fileInputRef} />

        {/* ================= PREVIEW STATE ================= */}
        {preview ? (
          <div className="relative flex flex-col items-center justify-center w-full h-full gap-4">
            {/* Image Preview Box */}
            <div className="relative max-h-[340px] max-w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Blog Preview"
                className="max-h-[300px] w-auto object-contain mx-auto rounded-lg"
              />
            </div>

            {/* Image Meta Bar */}
            <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                  {/* Dimensions badge */}
                  {imageMeta?.width && imageMeta?.height ? (
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold ${imageMeta.width >= minWidth && imageMeta.height >= minHeight
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                        }`}
                    >
                      {imageMeta.width >= minWidth && imageMeta.height >= minHeight ? (
                        <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <FiAlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      )}
                      <span>
                        {imageMeta.width} × {imageMeta.height} px
                      </span>
                    </span>
                  ) : null}

                  {/* File size badge (for uploaded files) */}
                  {imageMeta?.size && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium">
                      💾 {formatFileSize(imageMeta.size)}
                    </span>
                  )}

                  {/* File name */}
                  {imageMeta?.name && (
                    <span className="text-gray-500 dark:text-gray-400 truncate max-w-[150px] sm:max-w-[200px]" title={imageMeta.name}>
                      {imageMeta.name}
                    </span>
                  )}
                </div>

                {/* Actions: Change / Remove */}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      open();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors cursor-pointer"
                  >
                    <FiRefreshCw className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                  >
                    <FiTrash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Warning if below minimum dimensions */}
              {dimensionWarning && (
                <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                  <FiAlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{dimensionWarning}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ================= EMPTY STATE ================= */
          <div className="flex flex-col items-center text-center py-4 px-2">
            {/* Upload Icon */}
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-900/30 dark:text-brand-400 shadow-xs">
                <FiUploadCloud className="w-8 h-8" />
              </div>
            </div>

            {/* Main title */}
            <h4 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
              {isDragActive ? "Drop image to upload" : "Drag & drop blog image here, or browse"}
            </h4>

            <p className="mb-5 text-xs text-gray-500 dark:text-gray-400 max-w-sm">
              Supports high-resolution PNG, JPG, JPEG, WebP, or SVG formats
            </p>

            {/* Accepted Specs Badge Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full max-w-lg mb-6">
              {/* Recommended Dimensions */}
              <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-800/60">
                <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                  Recommended
                </span>
                <span className="text-sm font-extrabold text-blue-900 dark:text-blue-200 mt-0.5">
                  {recommendedWidth} × {recommendedHeight} px
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400">16:9 Aspect Ratio</span>
              </div>

              {/* Minimum Dimensions */}
              <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/60">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  Min Resolution
                </span>
                <span className="text-sm font-extrabold text-amber-900 dark:text-amber-200 mt-0.5">
                  {minWidth} × {minHeight} px
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400">Landscape Format</span>
              </div>

              {/* Max Size */}
              <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/60">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  Max File Size
                </span>
                <span className="text-sm font-extrabold text-emerald-900 dark:text-emerald-200 mt-0.5">
                  {maxSizeMB} MB
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">JPG, PNG, WebP</span>
              </div>
            </div>

            {/* Browse Button */}
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer">
              <FiImage className="w-3.5 h-3.5" />
              <span>Browse Image File</span>
            </span>
          </div>
        )}
      </div>

    </div>
  );
};

export default DropzoneComponent;
