"use client";

import React, { useCallback, useState, useRef } from "react";
import { Upload, File, X, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { validateFile, formatFileSize } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isDisabled?: boolean;
  selectedFile: File | null;
  onClear: () => void;
  isUploading: boolean;
}

export default function FileUpload({
  onFileSelect,
  isDisabled,
  selectedFile,
  onClear,
  isUploading,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClear = useCallback(() => {
    setError(null);
    onClear();
    if (inputRef.current) inputRef.current.value = "";
  }, [onClear]);

  if (selectedFile) {
    return (
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <File className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium text-sm">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" aria-label="Uploading" />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                disabled={isDisabled}
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        } ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload resume file"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <CardContent className="flex flex-col items-center justify-center p-10 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Upload className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <p className="text-lg font-medium mb-1">
            Drop your resume here or click to browse
          </p>
          <p className="text-sm text-muted-foreground">
            Supports PDF and DOCX files up to 5MB
          </p>
        </CardContent>
      </Card>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleInputChange}
        className="hidden"
        aria-hidden="true"
      />

      {error && (
        <p className="text-sm text-destructive mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
