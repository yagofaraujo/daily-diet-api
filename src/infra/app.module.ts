import { Module } from '@nestjs/common';
import { HttpModule } from './http.module';

@Module({
  imports: [HttpModule],
})
export class AppModule {}
