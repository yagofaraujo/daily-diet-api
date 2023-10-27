import { GcpUploader } from '@/infra/storage/uploader';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: GcpUploader,
      useFactory: () => new GcpUploader(),
    },
  ],
  exports: [GcpUploader],
})
export class StorageModule {}
