import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContactRepository } from './entity/contact.entity';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: "mysql",
      host: "mysql-108c56b5-sheltonfdo23-e2fe.d.aivencloud.com",
      port: 26424,
      username: "avnadmin",
      password: "AVNS__yGv8_9wVEp5NeX5SCd",
      database: "defaultdb",
      autoLoadModels: true,
      synchronize: true,
      ssl:true, 
      sync: { alter: true },

    }),
    SequelizeModule.forFeature([
      ContactRepository
    ])

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

