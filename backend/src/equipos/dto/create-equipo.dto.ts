import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EstadoEquipo } from '../entities/equipo.entity.js';

const Trim = () =>
  Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));

export class CreateEquipoDto {
  @Trim()
  @IsString({ message: 'El código de inventario debe ser texto' })
  @MinLength(3, { message: 'El código de inventario debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El código de inventario no puede superar 50 caracteres' })
  codigoInventario: string;

  @Trim()
  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede superar 100 caracteres' })
  nombre: string;

  @Trim()
  @IsString({ message: 'El tipo debe ser texto' })
  @IsNotEmpty({ message: 'El tipo es obligatorio' })
  @MaxLength(50, { message: 'El tipo no puede superar 50 caracteres' })
  tipo: string;

  @Trim()
  @IsString({ message: 'La marca debe ser texto' })
  @IsNotEmpty({ message: 'La marca es obligatoria' })
  @MaxLength(50, { message: 'La marca no puede superar 50 caracteres' })
  marca: string;

  @Trim()
  @IsString({ message: 'El modelo debe ser texto' })
  @IsNotEmpty({ message: 'El modelo es obligatorio' })
  @MaxLength(50, { message: 'El modelo no puede superar 50 caracteres' })
  modelo: string;

  @Trim()
  @IsString({ message: 'La ubicación debe ser texto' })
  @IsNotEmpty({ message: 'La ubicación es obligatoria' })
  @MaxLength(100, { message: 'La ubicación no puede superar 100 caracteres' })
  ubicacion: string;

  @IsEnum(EstadoEquipo, {
    message: 'El estado debe ser: Disponible, En uso, Mantención o Baja',
  })
  estado: EstadoEquipo;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha de adquisición debe tener formato AAAA-MM-DD',
  })
  @IsDateString({ strict: true }, { message: 'La fecha de adquisición no es válida' })
  fechaAdquisicion: string;

  @IsOptional()
  @Trim()
  @IsString({ message: 'Las observaciones deben ser texto' })
  @MaxLength(1000, { message: 'Las observaciones no pueden superar 1000 caracteres' })
  observaciones?: string | null;
}