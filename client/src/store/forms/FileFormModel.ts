export interface FileFormModel {
  id?: string;
  filename: string;
  fileContent: File | null;
  contentType: string | null;
  sizeBytes: number | null;
  description: string | null;
}

export interface FileUploadModel {
  fileContent: File;
  description?: string | null;
}