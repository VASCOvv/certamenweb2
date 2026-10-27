import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EquiposModule } from './equipos/equipos.module.js';

@Module({
  imports: [
    // Carga las variables del archivo .env y las deja disponibles en toda la app
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión a MySQL usando las variables de entorno
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true, // carga las entidades registradas con forFeature
        synchronize: true, // crea/actualiza las tablas según las entidades (solo desarrollo)
      }),
    }),

    EquiposModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}