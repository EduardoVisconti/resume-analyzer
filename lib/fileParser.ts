import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === "application/pdf") {
    return extractFromPDF(buffer);
  }

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return extractFromDOCX(buffer);
  }

  throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
}

async function extractFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  const text = data.text.trim();

  if (!text) {
    throw new Error(
      "Could not extract text from PDF. The file may be image-based or corrupted."
    );
  }

  return text;
}

async function extractFromDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  const text = result.value.trim();

  if (!text) {
    throw new Error(
      "Could not extract text from DOCX. The file may be empty or corrupted."
    );
  }

  return text;
}
