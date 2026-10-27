USE inventario_tecnologico2;

INSERT INTO equipos (codigoInventario, nombre, tipo, marca, modelo, ubicacion, estado, fechaAdquisicion, observaciones) VALUES
('NB-001', 'Notebook Lenovo ThinkPad', 'Notebook', 'Lenovo', 'ThinkPad E14 Gen 5', 'Laboratorio 1', 'Disponible', '2024-03-15', 'Incluye cargador y mochila'),
('PC-001', 'PC de escritorio HP', 'PC', 'HP', 'ProDesk 400 G9', 'Laboratorio 2', 'En uso', '2023-08-10', NULL),
('MON-001', 'Monitor Samsung 24 pulgadas', 'Monitor', 'Samsung', 'S24C310', 'Laboratorio 2', 'Disponible', '2023-08-10', 'Conectado al equipo PC-001'),
('PRY-001', 'Proyector Epson', 'Proyector', 'Epson', 'PowerLite X49', 'Sala 204', 'Mantención', '2022-05-20', 'Lámpara con desgaste, enviado a revisión'),
('IMP-001', 'Impresora multifuncional Brother', 'Impresora', 'Brother', 'DCP-L2540DW', 'Secretaría', 'En uso', '2021-11-02', NULL),
('NB-002', 'Notebook Dell Latitude', 'Notebook', 'Dell', 'Latitude 3420', 'Bodega', 'Baja', '2019-04-08', 'Pantalla dañada, dado de baja');