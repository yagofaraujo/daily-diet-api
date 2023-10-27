import { IUploadParams, IUploader } from '@/domain/usecases/contracts/storage/uploader';
import { Storage } from '@google-cloud/storage';
import { randomUUID } from 'node:crypto';

export class GcpUploader implements IUploader {
  private storage: Storage;

  constructor() {
    this.storage = new Storage({
      keyFilename: './gcpkey.json',
      projectId: 'daily-api-403223',
    });

    // this.storage = new Storage({
    //   projectId: 'daily-api-403223',
    // });
  }

  async upload({ fileName, fileType, content }: IUploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;

    const bucket = this.storage.bucket('daily-api-bucket');
    const file = bucket.file(uniqueFileName);

    await file.save(content, {
      metadata: {
        contentType: fileType,
      },
    });

    return { url: uniqueFileName };
  }
}
