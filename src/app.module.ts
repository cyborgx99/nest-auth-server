import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { PrismaService } from 'prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthTokenGuard } from './common/guards';
import { configValidationSchema } from './common/constants';
import { ItemModule } from './item/item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    AuthModule,
    ItemModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthTokenGuard,
    },
  ],
})
export class AppModule {}
