import { GcpUploader } from '@/infra/storage/uploader';
import { Module } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { EnvModule } from './env.module';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: GcpUploader,
      useFactory: (envService: EnvService) => new GcpUploader(envService),
      inject: [EnvService],
    },
  ],
  exports: [GcpUploader],
})
export class StorageModule {}
