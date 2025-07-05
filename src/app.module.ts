import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { throttlerConfig } from './common/config/throttler.config';
import { CustomThrottlerGuard } from './common/guards/throttler.guard';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    BooksModule,
    PrismaModule,
    ThrottlerModule.forRoot(throttlerConfig),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
