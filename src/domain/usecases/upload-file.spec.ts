import { InvalidUploadFileTypeError } from './errors/invalid-upload-file-type-error';
import { IUploadFileUseCaseRequest, UploadFileUseCase } from './upload-file';
import { FakeUploader } from '@/test/storage/fake-uploader';

let sut: UploadFileUseCase;
let fakeUploader: FakeUploader;

describe('Upload File Use Case', () => {
  beforeEach(() => {
    fakeUploader = new FakeUploader();
    sut = new UploadFileUseCase(fakeUploader);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Should be able to upload a file', async () => {
    const mockExecuteUploadFileUseCase = vi.spyOn(sut, 'execute');

    const useCasePayload: IUploadFileUseCaseRequest = {
      fileName: 'sample.png',
      fileType: 'image/png',
      content: Buffer.from(''),
    };

    const result = await sut.execute(useCasePayload);

    expect(mockExecuteUploadFileUseCase).toHaveBeenCalledTimes(1);
    expect(mockExecuteUploadFileUseCase).toHaveBeenCalledWith(useCasePayload);

    expect(result.isRight()).toBeTruthy();
    expect(fakeUploader.uploads).toHaveLength(1);

    if (result.isRight()) {
      expect(fakeUploader.uploads[0]).toEqual(expect.objectContaining({ fileName: result.value.storageFileName }));
      expect(fakeUploader.uploads[0].fileName.includes('sample.png')).toBeTruthy();
    }
  });

  it('Should not be able to upload a file with invalid file type', async () => {
    const mockExecuteUploadFileUseCase = vi.spyOn(sut, 'execute');

    const useCasePayload: IUploadFileUseCaseRequest = {
      fileName: 'audio.mp3',
      fileType: 'audio/mpeg',
      content: Buffer.from(''),
    };

    const result = await sut.execute(useCasePayload);

    expect(mockExecuteUploadFileUseCase).toHaveBeenCalledTimes(1);
    expect(mockExecuteUploadFileUseCase).toHaveBeenCalledWith(useCasePayload);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidUploadFileTypeError);
  });
});
