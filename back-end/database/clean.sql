BEGIN;

-- Clean palabra table
TRUNCATE TABLE palabra RESTART IDENTITY CASCADE;

-- Clean categoria table
TRUNCATE TABLE categoria RESTART IDENTITY CASCADE;

-- Clean palabras_por_categoria table
TRUNCATE TABLE palabras_por_categoria RESTART IDENTITY CASCADE;

-- Clean sala_de_juego table
TRUNCATE TABLE sala_de_juego RESTART IDENTITY CASCADE;

COMMIT;