import { IUploadParams, IUploader } from '@/domain/usecases/contracts/storage/uploader';
import { randomUUID } from 'node:crypto';

interface Upload {
  fileName: string;
}

export class FakeUploader implements IUploader {
  public uploads: Upload[] = [];

  async upload({ fileName }: IUploadParams): Promise<{ storageFileName: string }> {
    const uniqueName = randomUUID().concat(fileName);

    this.uploads.push({
      fileName: uniqueName,
    });

    return { storageFileName: uniqueName };
  }
}
