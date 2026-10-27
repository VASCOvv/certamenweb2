# Sistema de Inventario de Equipamiento Tecnológico

Aplicación web cliente-servidor para registrar y administrar el equipamiento tecnológico de una institución. Permite mantener un inventario centralizado, consultar los equipos, registrar nuevos, editarlos y eliminarlos.

El frontend está construido con **Vue.js**, consume una **API REST en NestJS** mediante HTTP y JSON, y los datos se almacenan en **MySQL** usando **TypeORM**.

**Estudiante:** Vasco Zambrano
**Asignatura:** Lenguaje de Programación Web II — Instituto Profesional Virginio Gómez, sede Chillán
**Evaluación:** N.º 2 — Actividad Evaluada

---

## Tecnologías utilizadas

| Capa | Tecnología |
|---|---|
| Frontend | Vue.js 3, Vue Router, Vite, JavaScript, `fetch()` |
| Backend | NestJS 12, TypeScript |
| Validación | class-validator, class-transformer, ValidationPipe |
| ORM | TypeORM |
| Base de datos | MySQL 8 |
| Configuración | @nestjs/config (variables de entorno `.env`) |
| Control de versiones | Git y GitHub |

---

## Arquitectura

```
Usuario
   |
   v
Vue.js / Vite  (http://localhost:5173)
   |
   | fetch() · HTTP · JSON
   v
NestJS REST API  (http://localhost:3000)
   |
   | Controller  →  Service
   v
TypeORM Repository
   |
   v
MySQL · inventario_tecnologico2
```

---

## Requisitos de instalación

- [Node.js](https://nodejs.org/) 22.18 o superior (incluye npm)
- [MySQL Server 8](https://dev.mysql.com/downloads/) y MySQL Workbench (u otro cliente MySQL)
- [Git](https://git-scm.com/)
- NestJS CLI (opcional, para generar archivos): `npm install -g @nestjs/cli`

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/VASCOvv/certamenweb2.git
cd certamenweb2
```

### 2. Crear la base de datos MySQL

En MySQL Workbench (o en la consola de MySQL) ejecutar:

```sql
CREATE DATABASE inventario_tecnologico2;
```

> La tabla `equipos` **no se crea manualmente**: TypeORM la genera automáticamente a partir de la entidad `Equipo` al iniciar el backend (`synchronize: true`).

### 3. Configurar las variables de entorno

Dentro de la carpeta `backend`, copiar el archivo de ejemplo y completar los datos de la conexión:

```bash
cd backend
copy .env.example .env      # Windows
# cp .env.example .env      # Linux / macOS
```

Variables necesarias (`backend/.env.example`):

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto de la API | `3000` |
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3307` (por defecto MySQL usa `3306`) |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña del usuario | `tu_contraseña_aqui` |
| `DB_NAME` | Nombre de la base de datos | `inventario_tecnologico2` |

> El archivo `.env` contiene credenciales reales y **no se publica** en el repositorio (está en `.gitignore`).

### 4. Ejecutar el backend

```bash
cd backend
npm install
npm run start:dev
```

La API queda disponible en `http://localhost:3000`.

### 5. Cargar los datos de prueba

Con el backend iniciado al menos una vez (para que exista la tabla), ejecutar en MySQL Workbench el script:

```
backend/database/datos-prueba.sql
```

Este script inserta 6 equipos de ejemplo con los distintos estados posibles.

### 6. Ejecutar el frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173` en el navegador.

---

## Endpoints de la API

URL base: `http://localhost:3000`

| Método | Endpoint | Función | Respuestas |
|---|---|---|---|
| GET | `/equipos` | Listar todos los equipos | `200` |
| GET | `/equipos/:id` | Obtener un equipo por ID | `200`, `400` (ID no numérico), `404` (no existe) |
| POST | `/equipos` | Registrar un equipo | `201`, `400` (datos inválidos), `409` (código duplicado) |
| PATCH | `/equipos/:id` | Actualizar un equipo (parcial) | `200`, `400`, `404`, `409` |
| DELETE | `/equipos/:id` | Eliminar un equipo | `200`, `404` |

### Ejemplo de cuerpo para POST

```json
{
  "codigoInventario": "NB-003",
  "nombre": "Notebook Asus Vivobook",
  "tipo": "Notebook",
  "marca": "Asus",
  "modelo": "Vivobook 15",
  "ubicacion": "Laboratorio 3",
  "estado": "Disponible",
  "fechaAdquisicion": "2025-01-20",
  "observaciones": "Opcional"
}
```

### Reglas de validación

| Campo | Regla |
|---|---|
| `codigoInventario` | Obligatorio, mínimo 3 caracteres, único |
| `nombre` | Obligatorio, mínimo 3 caracteres |
| `tipo`, `marca`, `modelo`, `ubicacion` | Obligatorios, no vacíos |
| `estado` | Solo `Disponible`, `En uso`, `Mantención` o `Baja` |
| `fechaAdquisicion` | Fecha válida en formato `AAAA-MM-DD` |
| `observaciones` | Opcional |

El `ValidationPipe` está configurado con `whitelist` y `forbidNonWhitelisted`, por lo que cualquier campo no declarado en el DTO es rechazado con `400`.

---

## Estructura del proyecto

```
certamenweb2/
├── backend/                         API REST NestJS
│   ├── database/
│   │   └── datos-prueba.sql         Script con equipos de prueba
│   ├── src/
│   │   ├── equipos/
│   │   │   ├── dto/
│   │   │   │   ├── create-equipo.dto.ts   Reglas de validación para crear
│   │   │   │   └── update-equipo.dto.ts   Mismas reglas, campos opcionales (PATCH)
│   │   │   ├── entities/
│   │   │   │   └── equipo.entity.ts       Entidad TypeORM → tabla "equipos"
│   │   │   ├── equipos.controller.ts      Rutas HTTP /equipos
│   │   │   ├── equipos.service.ts         Lógica de negocio y acceso a MySQL
│   │   │   └── equipos.module.ts          Módulo del recurso Equipo
│   │   ├── app.module.ts            Módulo raíz: configuración y conexión MySQL
│   │   └── main.ts                  Arranque, CORS y ValidationPipe
│   ├── pruebas.http                 Pruebas de la API (extensión REST Client)
│   └── .env.example                 Variables de entorno de ejemplo
│
├── frontend/                        Aplicación Vue.js
│   └── src/
│       ├── services/
│       │   └── equiposApi.js        Llamadas fetch a la API y manejo de errores
│       ├── utils/
│       │   └── equipo.js            Estados, tipos y formato de fecha
│       ├── views/
│       │   ├── EquiposListView.vue  Listado, búsqueda, filtro y eliminación
│       │   ├── EquipoDetalleView.vue Detalle de un equipo
│       │   └── EquipoFormView.vue   Formulario de creación y edición
│       ├── router/index.js          Rutas de la aplicación
│       ├── App.vue                  Barra de navegación y RouterView
│       └── assets/main.css          Estilos
│
├── .gitignore
└── README.md
```

---

## Pruebas realizadas

### Pruebas de la API (`backend/pruebas.http`)

Se probaron los endpoints con la extensión **REST Client** de VS Code:

| # | Prueba | Resultado esperado | Resultado |
|---|---|---|---|
| 1 | Listar equipos | `200` con arreglo JSON | ✅ |
| 2 | Crear equipo válido | `201` con el equipo creado e `id` | ✅ |
| 3 | Obtener equipo existente | `200` | ✅ |
| 4 | Obtener equipo inexistente (`/equipos/9999`) | `404` | ✅ |
| 5 | Actualizar parcialmente (PATCH) | `200` con datos actualizados | ✅ |
| 6 | Crear con datos inválidos | `400` con mensajes de validación | ✅ |
| 7 | Enviar campo no declarado (`precio`) | `400` | ✅ |
| 8 | Crear con código de inventario duplicado | `409` | ✅ |
| 9 | ID no numérico (`/equipos/abc`) | `400` | ✅ |
| 10 | Eliminar equipo | `200` con mensaje de confirmación | ✅ |

### Pruebas del frontend

| # | Prueba | Resultado |
|---|---|---|
| 1 | El listado muestra los equipos almacenados en MySQL y un estado de carga | ✅ |
| 2 | Registrar un equipo desde el formulario | ✅ |
| 3 | Los errores de validación de la API se muestran en el formulario | ✅ |
| 4 | Código duplicado muestra el mensaje de la API | ✅ |
| 5 | Ver el detalle y editar un equipo | ✅ |
| 6 | Búsqueda por texto y filtro por estado | ✅ |
| 7 | Al eliminar se solicita confirmación; cancelar no elimina | ✅ |
| 8 | Tras crear, editar o eliminar, la interfaz se actualiza | ✅ |
| 9 | Con el backend detenido se muestra un mensaje de error de conexión | ✅ |

### Prueba de persistencia

Se reinició el backend y se verificó que los equipos seguían almacenados en MySQL y visibles en el frontend. ✅

---

## Declaración de uso de Inteligencia Artificial

**Herramienta utilizada:** Claude (Anthropic).

**Partes del proyecto en que se utilizó y tipo de apoyo:**

| Parte / tarea | Tipo de apoyo |
|---|---|
| Planificación del proyecto en etapas y commits | Explicación y organización |
| Configuración inicial de NestJS y Vue | Explicación de comandos y opciones |
| Conexión a MySQL con TypeORM, entidad y variables de entorno | Generación de código y explicación |
| DTO, validaciones, servicio y controlador (CRUD) | Generación de código y explicación |
| Frontend Vue (vistas, router, servicio `fetch`, estilos) | Generación de código y explicación |
| Error de imports en NestJS 12 (módulos ES requieren extensión `.js`) | Depuración |
| Error `ECONNREFUSED` al conectar con MySQL | Depuración |
| Archivo de pruebas `pruebas.http` y script de datos de prueba | Generación de código |
| README.md | Documentación |

**Revisión y adaptación realizada por el estudiante:**

- Desarrollé el proyecto paso a paso en VS Code, ejecutando y comprobando cada etapa antes de avanzar y realizando un commit por cada avance.
- Identifiqué que mi servidor MySQL funciona en el puerto **3307** y adapté la configuración (`.env` y `.env.example`).
- Ante los errores de compilación con NestJS 12, corregí los imports agregando la extensión `.js` y comprendí el motivo (proyecto configurado como módulos ES).
- Ejecuté y verifiqué manualmente las 10 pruebas de la API, las 9 pruebas del frontend y la prueba de persistencia.
- Verifiqué que el archivo `.env` con credenciales no se publicara en GitHub y corregí el `.gitignore` para excluir archivos de compilación (`*.tsbuildinfo`).

