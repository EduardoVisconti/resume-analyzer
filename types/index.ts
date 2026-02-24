export interface AnalysisResult {
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  redFlags: string[];
  keywords: {
    present: string[];
    missing: string[];
  };
  formatting: string[];
  matchScore?: number;
}

export interface CoverLetterRequest {
  resumeText: string;
  jobDescription: string;
}

export interface CoverLetterResponse {
  coverLetter: string;
}

export interface AnalyzeRequest {
  resumeText: string;
  jobDescription?: string;
}

export interface FileUploadState {
  file: File | null;
  fileName: string;
  fileSize: number;
  isUploading: boolean;
  error: string | null;
  extractedText: string | null;
}

export type AnalysisStatus = "idle" | "uploading" | "analyzing" | "complete" | "error";
