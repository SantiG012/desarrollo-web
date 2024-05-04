GRANT SELECT, INSERT, UPDATE, DELETE ON palabra TO pinturillo_db_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON categoria TO pinturillo_db_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON palabras_por_categoria TO pinturillo_db_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON sala_de_juego TO pinturillo_db_admin;

GRANT USAGE, SELECT ON SEQUENCE palabra_id_seq TO pinturillo_db_admin;
GRANT USAGE, SELECT ON SEQUENCE categoria_id_seq TO pinturillo_db_admin;
GRANT USAGE, SELECT ON SEQUENCE palabras_por_categoria_id_seq TO pinturillo_db_admin;
GRANT USAGE, SELECT ON SEQUENCE sala_de_juego_id_seq TO pinturillo_db_admin;