import { Module } from '@nestjs/common';
import { ContentModule } from '../content/content.module';
import { PublicController } from './public.controller';

@Module({
  imports: [ContentModule],
  controllers: [PublicController],
})
export class PublicModule {}
