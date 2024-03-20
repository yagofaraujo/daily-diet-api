import { InvalidUploadFileTypeError } from '@/domain/usecases/errors/invalid-upload-file-type-error';
import { UploadFileUseCase } from '@/domain/usecases/upload-file';
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  InternalServerErrorException,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/uploads')
export class UploadController {
  constructor(private uploadFileUseCase: UploadFileUseCase) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg|pdf)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log('iniciando controller');
    const result = await this.uploadFileUseCase.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      content: file.buffer,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidUploadFileTypeError:
          throw new BadRequestException(error.message);
        default:
          throw new InternalServerErrorException('Unexpected Error');
      }
    }

    const { storageFileName } = result.value;

    return { storageFileName };
  }
}
