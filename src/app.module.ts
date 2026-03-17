import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PetsModule } from './pets/pets.module';
import { AdoptionModule } from './adoption/adoption.module';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true, // This makes it available everywhere
      envFilePath: '.env',
     }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AuthModule,
    UsersModule,
    PetsModule,
    AdoptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
