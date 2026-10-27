import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEquipoDto } from './dto/create-equipo.dto.js';
import { UpdateEquipoDto } from './dto/update-equipo.dto.js';
import { Equipo } from './entities/equipo.entity.js';

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo)
    private readonly equiposRepository: Repository<Equipo>,
  ) {}

  findAll(): Promise<Equipo[]> {
    return this.equiposRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Equipo> {
    const equipo = await this.equiposRepository.findOneBy({ id });
    if (!equipo) {
      throw new NotFoundException(`No existe un equipo con id ${id}`);
    }
    return equipo;
  }

  async create(createEquipoDto: CreateEquipoDto): Promise<Equipo> {
    await this.verificarCodigoDisponible(createEquipoDto.codigoInventario);
    const equipo = this.equiposRepository.create(createEquipoDto);
    return this.equiposRepository.save(equipo);
  }

  async update(id: number, updateEquipoDto: UpdateEquipoDto): Promise<Equipo> {
    const equipo = await this.findOne(id);

    if (
      updateEquipoDto.codigoInventario &&
      updateEquipoDto.codigoInventario !== equipo.codigoInventario
    ) {
      await this.verificarCodigoDisponible(updateEquipoDto.codigoInventario);
    }

    this.equiposRepository.merge(equipo, updateEquipoDto);
    return this.equiposRepository.save(equipo);
  }

  async remove(id: number): Promise<{ message: string }> {
    const equipo = await this.findOne(id);
    await this.equiposRepository.remove(equipo);
    return { message: `Equipo con id ${id} eliminado correctamente` };
  }

  private async verificarCodigoDisponible(codigoInventario: string): Promise<void> {
    const existe = await this.equiposRepository.findOneBy({ codigoInventario });
    if (existe) {
      throw new ConflictException(
        `Ya existe un equipo con el código de inventario ${codigoInventario}`,
      );
    }
  }
}