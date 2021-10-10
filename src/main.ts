
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './logger.inteceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors: {
    origin: true,
    preflightContinue: false,
    methods: 'GET, PUT, POST, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  }});
  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
