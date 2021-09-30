import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { user } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsvModule } from 'nest-csv-parser'
import { PreauthMiddleware } from 'src/auth/preauth.middlewate';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    TypeOrmModule.forFeature([user]),HttpModule
  
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class UserModule  {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreauthMiddleware)
    .exclude(
      { path: '/api/auth', method: RequestMethod.GET },
      
      
    )
    .forRoutes(AuthController);
  }
}
