export interface FileFormModel {
  id?: string;
  fileName: string;
  fileContent: File | null;
  contentType: string | null;
  sizeBytes: number | null;
  description: string | null;
  group: number | null;
}

export interface FileUploadModel {
  fileContent: File;
  description?: string | null;
}