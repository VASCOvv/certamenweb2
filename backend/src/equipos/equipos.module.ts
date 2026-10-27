import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from './entities/equipo.entity.js';
import { EquiposController } from './equipos.controller.js';
import { EquiposService } from './equipos.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Equipo])],
  controllers: [EquiposController],
  providers: [EquiposService],
})
export class EquiposModule {}