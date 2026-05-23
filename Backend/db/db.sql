-- 1. Roles de usuario
CREATE TABLE roles (
    id_roles SERIAL PRIMARY KEY,
    nombre_roles VARCHAR(30) UNIQUE NOT NULL,
    descripcion_roles TEXT
);

-- 2. Usuarios del sistema (con FK a roles)
CREATE TABLE usuarios (
    id_usuarios SERIAL PRIMARY KEY,
    nombre_usuarios VARCHAR(100) NOT NULL,
    email_usuarios VARCHAR(150) UNIQUE NOT NULL,
    password_usuarios VARCHAR(255) NOT NULL,
    estado_usuarios BOOLEAN DEFAULT TRUE,
    id_roles INTEGER NOT NULL,
    fecha_creacion_usuarios TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_roles) REFERENCES roles (id_roles) ON DELETE RESTRICT
);

-- 3. Autores de los libros
CREATE TABLE autores (
    id_autores SERIAL PRIMARY KEY,
    nombre_autores VARCHAR(150) NOT NULL,
    nacionalidad_autores VARCHAR(100),
    fecha_creacion_autores TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Categorías o géneros
CREATE TABLE categorias (
    id_categorias SERIAL PRIMARY KEY,
    nombre_categorias VARCHAR(100) UNIQUE NOT NULL,
    descripcion_categorias TEXT
);

-- 5. Libros (Metadatos)
CREATE TABLE libros (
    id_libros SERIAL PRIMARY KEY,
    titulo_libros VARCHAR(200) NOT NULL,
    descripcion_libros TEXT,
    anio_publicacion_libros INTEGER,
    archivo_url_libros TEXT NOT NULL,
    portada_url_libros TEXT,
    id_usuarios INTEGER NOT NULL, -- Quién lo subió
    fecha_subida_libros TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo_libros BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_libro_usuario FOREIGN KEY (id_usuarios) REFERENCES usuarios (id_usuarios) ON DELETE SET NULL
);

-- 6. Relación Muchos a Muchos: Libros y Autores
CREATE TABLE libro_autor (
    id_libros INTEGER NOT NULL,
    id_autores INTEGER NOT NULL,
    PRIMARY KEY (id_libros, id_autores),
    CONSTRAINT fk_la_libro FOREIGN KEY (id_libros) REFERENCES libros (id_libros) ON DELETE CASCADE,
    CONSTRAINT fk_la_autor FOREIGN KEY (id_autores) REFERENCES autores (id_autores) ON DELETE CASCADE
);

-- 7. Relación Muchos a Muchos: Libros y Categorías
CREATE TABLE libro_categoria (
    id_libros INTEGER NOT NULL,
    id_categorias INTEGER NOT NULL,
    PRIMARY KEY (id_libros, id_categorias),
    CONSTRAINT fk_lc_libro FOREIGN KEY (id_libros) REFERENCES libros (id_libros) ON DELETE CASCADE,
    CONSTRAINT fk_lc_categoria FOREIGN KEY (id_categorias) REFERENCES categorias (id_categorias) ON DELETE CASCADE
);

-- 8. Historial de Descargas
CREATE TABLE descargas (
    id_descargas SERIAL PRIMARY KEY,
    id_usuarios INTEGER NOT NULL,
    id_libros INTEGER NOT NULL,
    fecha_descarga_descargas TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_descarga_usuario FOREIGN KEY (id_usuarios) REFERENCES usuarios (id_usuarios) ON DELETE CASCADE,
    CONSTRAINT fk_descarga_libro FOREIGN KEY (id_libros) REFERENCES libros (id_libros) ON DELETE CASCADE
);

-- 9. Registro de Visualizaciones (Lectura online)
CREATE TABLE visualizaciones (
    id_visualizaciones SERIAL PRIMARY KEY,
    id_usuarios INTEGER NOT NULL,
    id_libros INTEGER NOT NULL,
    fecha_visualizacion_visualizaciones TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_visual_usuario FOREIGN KEY (id_usuarios) REFERENCES usuarios (id_usuarios) ON DELETE CASCADE,
    CONSTRAINT fk_visual_libro FOREIGN KEY (id_libros) REFERENCES libros (id_libros) ON DELETE CASCADE
);

-- 10. Calificaciones de Libros
CREATE TABLE calificaciones (
    id_calificaciones SERIAL PRIMARY KEY,
    id_usuarios INTEGER NOT NULL,
    id_libros INTEGER NOT NULL,
    puntuacion_calificaciones INTEGER NOT NULL CHECK (puntuacion_calificaciones >= 1 AND puntuacion_calificaciones <= 5),
    comentario_calificaciones TEXT,
    fecha_calificacion_calificaciones TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_calificacion_usuario FOREIGN KEY (id_usuarios) REFERENCES usuarios (id_usuarios) ON DELETE CASCADE,
    CONSTRAINT fk_calificacion_libro FOREIGN KEY (id_libros) REFERENCES libros (id_libros) ON DELETE CASCADE,
    CONSTRAINT unique_user_book_rating UNIQUE (id_usuarios, id_libros)
);

CREATE INDEX idx_calificaciones_libro ON calificaciones(id_libros);
CREATE INDEX idx_calificaciones_usuario ON calificaciones(id_usuarios);

-- 11. Auditoría (Actividad del sistema)
CREATE TABLE actividad_sistema (
    id_actividad_sistema SERIAL PRIMARY KEY,
    id_usuarios INTEGER,
    accion_actividad_sistema VARCHAR(150) NOT NULL,
    descripcion_actividad_sistema TEXT,
    fecha_actividad_sistema TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_actividad_usuario FOREIGN KEY (id_usuarios) REFERENCES usuarios (id_usuarios) ON DELETE SET NULL
);

-- Insertar roles básicos
INSERT INTO roles (nombre_roles, descripcion_roles) VALUES 
('ADMIN', 'Acceso total al sistema'),
('BIBLIOTECARIO', 'Gestión de libros y autores'),
('LECTOR', 'Usuario final que consulta y descarga');

-- Insertar un administrador de prueba (Password temporal: 123456)
-- Nota: En el paso de Express usaremos bcrypt, pero esto es para estructura.
INSERT INTO usuarios (nombre_usuarios, email_usuarios, password_usuarios, id_roles) 
VALUES ('Admin BiblioTech', 'admin@bibliotech.com', 'admin123', 1);

SELECT * FROM usuarios;

SELECT * FROM roles;

UPDATE usuarios
SET password_usuarios = '$2b$10$k8vFOb8cXyneA1MG0hI3quu7ZbTqQ2oT8HCeuZ571wzNFO6hBCSL2'
WHERE email_usuarios = 'admin@bibliotech.com';

INSERT INTO autores (nombre_autores, nacionalidad_autores) VALUES 
('Gabriel García Márquez', 'Colombiano'),
('Robert C. Martin', 'Estadounidense'),
('Isabel Allende', 'Chilena'),
('Linus Torvalds', 'Finlandés'),
('J.K. Rowling', 'Británica');

INSERT INTO categorias (nombre_categorias, descripcion_categorias) VALUES 
('Ingeniería de Software', 'Libros sobre desarrollo, arquitectura y buenas prácticas'),
('Realismo Mágico', 'Género literario donde lo extraño es cotidiano'),
('Sistemas Operativos', 'Todo lo relacionado con el Kernel, Linux y administración'),
('Fantasía', 'Libros de mundos imaginarios y magia'),
('Bases de Datos', 'Diseño, optimización y administración de SQL y NoSQL');

INSERT INTO libros (titulo_libros, descripcion_libros, anio_publicacion_libros, archivo_url_libros, portada_url_libros, id_usuarios) VALUES 
('Clean Code', 'Manual de buenas prácticas para escribir código limpio', 2008, 'https://biblio.com/files/clean-code.pdf', 'https://biblio.com/covers/clean-code.jpg', 1),
('Cien Años de Soledad', 'La historia de la familia Buendía en Macondo', 1967, 'https://biblio.com/files/100-anios.pdf', 'https://biblio.com/covers/100-anios.jpg', 1),
('Just for Fun', 'La historia de la creación de Linux', 2001, 'https://biblio.com/files/just-for-fun.pdf', 'https://biblio.com/covers/linux.jpg', 1),
('La Casa de los Espíritus', 'Una narrativa épica sobre la familia Trueba', 1982, 'https://biblio.com/files/casa-espiritus.pdf', 'https://biblio.com/covers/casa-espiritus.jpg', 1),
('SQL Performance Explained', 'Guía para optimizar consultas en bases de datos', 2012, 'https://biblio.com/files/sql-perf.pdf', 'https://biblio.com/covers/sql.jpg', 1);

INSERT INTO libro_autor (id_libros, id_autores) VALUES 
(1, 2), -- Clean Code -> Robert C. Martin
(2, 1), -- Cien Años -> Gabo
(3, 4), -- Just for Fun -> Linus Torvalds
(4, 3), -- La Casa de los Espíritus -> Isabel Allende
(5, 2); -- SQL Performance -> (Asociado ficticiamente a Robert Martin para probar)

INSERT INTO libro_categoria (id_libros, id_categorias) VALUES 
(1, 1), -- Clean Code -> Ingeniería
(2, 2), -- Cien Años -> Realismo Mágico
(3, 3), -- Just for Fun -> Sistemas Operativos
(4, 4), -- La Casa de los Espíritus -> Fantasía
(5, 5), (5, 1); -- SQL Performance -> Bases de Datos e Ingeniería

INSERT INTO descargas (id_usuarios, id_libros) VALUES 
(3, 1), -- Angie descargó Clean Code
(3, 5), -- Angie descargó SQL Performance
(2, 2); -- Tú (Samuel) descargaste Cien Años de Soledad