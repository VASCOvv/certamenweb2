import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Valores permitidos para el estado del equipo
export enum EstadoEquipo {
  DISPONIBLE = 'Disponible',
  EN_USO = 'En uso',
  MANTENCION = 'Mantención',
  BAJA = 'Baja',
}

// @Entity indica que esta clase representa la tabla "equipos" en MySQL
@Entity('equipos')
export class Equipo {
  // Clave primaria autoincremental
  @PrimaryGeneratedColumn()
  id: number;

  // unique: no pueden existir dos equipos con el mismo código
  @Column({ length: 50, unique: true })
  codigoInventario: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 50 })
  tipo: string;

  @Column({ length: 50 })
  marca: string;

  @Column({ length: 50 })
  modelo: string;

  @Column({ length: 100 })
  ubicacion: string;

  // En MySQL se crea como ENUM: solo acepta esos 4 valores
  @Column({ type: 'enum', enum: EstadoEquipo, default: EstadoEquipo.DISPONIBLE })
  estado: EstadoEquipo;

  // Tipo DATE (solo fecha, sin hora). TypeORM la entrega como texto 'YYYY-MM-DD'
  @Column({ type: 'date' })
  fechaAdquisicion: string;

  // nullable: true → campo opcional
  @Column({ type: 'text', nullable: true })
  observaciones: string | null;
}