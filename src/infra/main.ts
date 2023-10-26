import { NestFactory } from '@nestjs/core';
import { AppModule } from './nestjs/modules/app.module';
import { EnvService } from './nestjs/env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  });

  const envService = app.get(EnvService);
  const port = envService.get('PORT');

  await app.listen(port);
}
bootstrap();
