export interface IUploadParams {
  fileName: string;
  fileType: string;
  content: Buffer;
}

export interface IUploader {
  upload(params: IUploadParams): Promise<{ url: string }>;
}
