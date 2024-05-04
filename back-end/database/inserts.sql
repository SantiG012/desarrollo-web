INSERT INTO palabra (texto) VALUES ('carro');
INSERT INTO palabra (texto) VALUES ('avión');
INSERT INTO palabra (texto) VALUES ('barco');
INSERT INTO palabra (texto) VALUES ('bicicleta');
INSERT INTO palabra (texto) VALUES ('motocicleta');

INSERT INTO categoria (nombre) VALUES ('vehículos');
INSERT INTO palabras_por_categoria (id_palabra, id_categoria) VALUES (1, 1);
INSERT INTO palabras_por_categoria (id_palabra, id_categoria) VALUES (2, 1);
INSERT INTO palabras_por_categoria (id_palabra, id_categoria) VALUES (3, 1);
INSERT INTO palabras_por_categoria (id_palabra, id_categoria) VALUES (4, 1);
INSERT INTO palabras_por_categoria (id_palabra, id_categoria) VALUES (5, 1);

INSERT INTO sala_de_juego (nombre, id_categoria, estado) VALUES ('Sala 1', 1, 'waiting');
