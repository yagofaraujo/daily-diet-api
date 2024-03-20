import { IUploadParams, IUploader } from '@/domain/usecases/contracts/storage/uploader';
import { Storage } from '@google-cloud/storage';
import { randomUUID } from 'node:crypto';
import { EnvService } from '../nestjs/env/env.service';

export class GcpUploader implements IUploader {
  private storage: Storage;

  constructor(private envService: EnvService) {
    this.storage = new Storage({
      credentials: {
        private_key: envService.get('GCP_PRIVATE_KEY'),
        client_email: envService.get('GCP_CLIENT_EMAIL'),
      },
    });
  }

  async upload({ fileName, fileType, content }: IUploadParams): Promise<{ storageFileName: string }> {
    const uniqueFileName = generateUniqueFileName(fileName);

    const bucket = this.storage.bucket(this.envService.get('GCP_BUCKET_NAME'));

    const file = bucket.file(uniqueFileName);

    await file.save(String(content), {
      public: true,
      metadata: {
        contentType: fileType,
      },
    });

    return { storageFileName: uniqueFileName };
  }
}

function generateUniqueFileName(fileName: string): string {
  const textWithoutAccents = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const textWithUnderscoresInsteadOfWhiteSpaces = textWithoutAccents
    .replace(/[^a-zA-Z0-9\s.]/g, '')
    .replace(/\s/g, '_');
  const uploadId = randomUUID();

  return `${uploadId}-${textWithUnderscoresInsteadOfWhiteSpaces}`;
}
