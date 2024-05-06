CREATE TABLE IF NOT EXISTS palabra (
    id SERIAL PRIMARY KEY,
    texto VARCHAR(255) NOT NULL,
    UNIQUE (texto)
);

CREATE TABLE IF NOT EXISTS categoria (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    UNIQUE (nombre)
);

CREATE TABLE IF NOT EXISTS palabras_por_categoria (
    id SERIAL PRIMARY KEY,
    id_palabra INT,
    id_categoria INT,
    FOREIGN KEY (id_palabra) REFERENCES palabra(id)  ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id)  ON DELETE CASCADE,
    UNIQUE(id_palabra, id_categoria)
);

CREATE TABLE IF NOT EXISTS sala_de_juego (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    id_categoria INT,
    estado VARCHAR(20),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id)  ON DELETE CASCADE,
    UNIQUE (nombre)
);