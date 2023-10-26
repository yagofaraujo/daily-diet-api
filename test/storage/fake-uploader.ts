import { IUploadParams, IUploader } from '@/domain/usecases/contracts/storage/uploader';
import { randomUUID } from 'node:crypto';

interface Upload {
  fileName: string;
  url: string;
}

export class FakeUploader implements IUploader {
  public uploads: Upload[] = [];

  async upload({ fileName }: IUploadParams): Promise<{ url: string }> {
    const url = randomUUID().concat(fileName);

    this.uploads.push({
      fileName,
      url,
    });

    return { url };
  }
}
