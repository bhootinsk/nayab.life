import { Module } from '@nestjs/common';
import { ContentModule } from '../content/content.module';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [ContentModule, AuthModule],
  controllers: [AdminController],
})
export class AdminModule {}
