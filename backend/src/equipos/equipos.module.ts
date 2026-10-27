import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from './entities/equipo.entity.js';

@Module({
  // forFeature registra la entidad Equipo en este módulo,
  // lo que permite inyectar su Repository en el servicio (etapa 3)
  imports: [TypeOrmModule.forFeature([Equipo])],
})
export class EquiposModule {}