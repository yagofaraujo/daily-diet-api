import { IUploadParams, IUploader } from '@/domain/usecases/contracts/storage/uploader';
import { Storage } from '@google-cloud/storage';
import { randomUUID } from 'node:crypto';
import { EnvService } from '../nestjs/env/env.service';

export class GcpUploader implements IUploader {
  private storage: Storage;

  constructor(private envService: EnvService) {
    this.storage = new Storage({
      credentials: {
        private_key: envService.get('GCP_PRIVATE_KEY').replace(/\\n/g, '\n'),
        client_email: envService.get('GCP_CLIENT_EMAIL'),
      },
    });
  }

  async upload({ fileName, fileType, content }: IUploadParams): Promise<{ storageFileName: string }> {
    try {
      const uniqueFileName = generateUniqueFileName(fileName);

      console.log('teste 1');
      const bucket = this.storage.bucket(this.envService.get('GCP_BUCKET_NAME'));
      console.log(bucket);
      console.log('teste 2');

      const file = bucket.file(uniqueFileName);
      console.log('teste 3');

      await file.save(String(content), {
        public: true,
        metadata: {
          contentType: fileType,
        },
      });
      console.log('teste 4');

      return { storageFileName: uniqueFileName };
    } catch (error) {
      console.log(error);
      throw error;
    }
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
