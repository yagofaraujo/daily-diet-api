import { Either, left, right } from '@/core/either';
import { InvalidUploadFileTypeError } from './errors/invalid-upload-file-type-error';
import { IUploader } from './contracts/storage/uploader';

const UPLOAD_VALID_FILE_TYPES_REGEX = /^(image\/(jpeg|png))$|^application\/pdf$/;

export interface IUploadFileUseCaseRequest {
  fileName: string;
  fileType: string;
  content: Buffer;
}

type IUploadFileUseCaseResponse = Either<
  InvalidUploadFileTypeError,
  {
    url: string;
  }
>;

export class UploadFileUseCase {
  constructor(private uploader: IUploader) {}

  async execute({ fileName, fileType, content }: IUploadFileUseCaseRequest): Promise<IUploadFileUseCaseResponse> {
    const validValidType = UPLOAD_VALID_FILE_TYPES_REGEX.test(fileType);

    if (!validValidType) {
      return left(new InvalidUploadFileTypeError(fileType));
    }

    const { url } = await this.uploader.upload({ fileName, fileType, content });

    return right({
      url,
    });
  }
}
