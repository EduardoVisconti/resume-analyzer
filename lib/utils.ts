import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getScoreColor(score: number): string {
  if (score >= 8) return "text-green-500";
  if (score >= 6) return "text-yellow-500";
  if (score >= 4) return "text-orange-500";
  return "text-red-500";
}

export function getScoreBgColor(score: number): string {
  if (score >= 8) return "bg-green-500";
  if (score >= 6) return "bg-yellow-500";
  if (score >= 4) return "bg-orange-500";
  return "bg-red-500";
}

export function getMatchScoreLabel(score: number): string {
  if (score >= 80) return "Excellent Match";
  if (score >= 60) return "Good Match";
  if (score >= 40) return "Fair Match";
  return "Needs Improvement";
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload a PDF or DOCX file.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "File too large. Maximum size is 5MB.",
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: "File is empty. Please upload a valid resume.",
    };
  }

  return { valid: true };
}
