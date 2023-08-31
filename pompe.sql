DROP TYPE IF EXISTS categ_pompe;
DROP TYPE IF EXISTS categ_pompe_ape_curate;
DROP TYPE IF EXISTS tipuri_produse;
DROP TYPE IF EXISTS categ_automatizari;


CREATE TYPE tipuri_produse AS ENUM('pompe ape curate', 'pompe pluviale', 'automatizari', 'accesorii' );
CREATE TYPE categ_pompe_ape_curate AS ENUM( 'submersibile', 'de suprafata',  'irigatii', 'pompe recirculare','pompe piscina');
CREATE TYPE categ_automatizari AS ENUM( 'panouri electrice', 'presostate mecanice', 'presostate electronice', 'variatoare de turatie');
CREATE TYPE putere_motor AS ENUM( '750w', '1100w', '1500w', '2200W', '3000w');


CREATE TABLE IF NOT EXISTS pompe (
   id serial PRIMARY KEY,
   nume VARCHAR(200) UNIQUE NOT NULL,
   descriere TEXT,
   imagine VARCHAR(300),
   pret NUMERIC(8,2) NOT NULL,
   putere putere_motor DEFAULT '1100w',   
   tip_produs tipuri_produse DEFAULT 'pompe ape curate',
   debit INT NOT NULL CHECK (debit>=0),
   categorie categ_pompe_ape_curate DEFAULT 'submersibile',
   optiuni VARCHAR [], --pot sa nu fie specificare deci nu punem NOT NULL
   rezistenta_la_nisip BOOLEAN NOT NULL DEFAULT FALSE,
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT INTO pompe (nume, descriere, imagine, pret, debit, optiuni, rezistenta_la_nisip, putere, tip_produs, categorie)
VALUES
    ('Panelli Model A1', 'Pompa submersibila pentru apa curata de la Panelli', 'panelli_model_a1.jpg', 199.99, 100, ARRAY['control wireless'], TRUE, '1100w', 'pompe ape curate', 'submersibile'),
    ('Pedrollo Model B2', 'Pompa de suprafata pentru irigatii de la Pedrollo', 'pedrollo_model_b2.jpg', 149.50, 80, NULL, FALSE, '750w', 'pompe ape curate', 'de suprafata'),
    ('JAR Model C3', 'Pompa de recirculare pentru piscina de la JAR', 'jar_model_c3.jpg', 299.00, 120, ARRAY['control smartphone'], TRUE, '1500w', 'pompe ape curate', 'pompe recirculare'),
    ('IBO Model D4', 'Pompa pentru sisteme de irigatii de la IBO', 'ibo_model_d4.jpg', 129.99, 70, NULL, FALSE, '1100w', 'pompe ape curate', 'irigatii'),
    ('ZDS Model E5', 'Pompa pentru curatarea piscinei de la ZDS', 'zds_model_e5.jpg', 259.95, 110, ARRAY['senzor nivel apa'], TRUE, '2200W', 'pompe ape curate', 'pompe piscina'),
    ('Panelli Model F6', 'Pompa pentru drenarea apei pluviale de la Panelli', 'panelli_model_f6.jpg', 179.75, 90, NULL, FALSE, '1100w', 'pompe pluviale', NULL),
    ('Pedrollo Model G7', 'Pompa submersibila pentru apa curata de la Pedrollo', 'pedrollo_model_g7.jpg', 189.00, 95, NULL, TRUE, '1100w', 'pompe ape curate', 'submersibile'),
    ('JAR Model H8', 'Pompa de suprafata pentru irigatii de la JAR', 'jar_model_h8.jpg', 169.99, 85, ARRAY['control wireless'], FALSE, '1500w', 'pompe ape curate', 'de suprafata'),
    ('IBO Model I9', 'Pompa de recirculare pentru piscina de la IBO', 'ibo_model_i9.jpg', 329.50, 130, ARRAY['control smartphone', 'senzor nivel apa'], TRUE, '2200W', 'pompe ape curate', 'pompe recirculare'),
    ('ZDS Model J10', 'Pompa pentru sisteme de irigatii de la ZDS', 'zds_model_j10.jpg', 139.00, 75, NULL, FALSE, '750w', 'pompe ape curate', 'irigatii'),
    ('Panelli Model K11', 'Pompa pentru curatarea piscinei de la Panelli', 'panelli_model_k11.jpg', 249.95, 105, ARRAY['senzor nivel apa'], TRUE, '1500w', 'pompe ape curate', 'pompe piscina'),
    ('Pedrollo Model L12', 'Pompa pentru drenarea apei pluviale de la Pedrollo', 'pedrollo_model_l12.jpg', 159.50, 88, NULL, FALSE, '1100w', 'pompe pluviale', NULL),
    ('JAR Model M13', 'Pompa submersibila pentru apa curata de la JAR', 'jar_model_m13.jpg', 209.99, 98, ARRAY['control wireless'], TRUE, '1100w', 'pompe ape curate', 'submersibile'),
    ('IBO Model N14', 'Pompa de suprafata pentru irigatii de la IBO', 'ibo_model_n14.jpg', 179.00, 92, NULL, FALSE, '750w', 'pompe ape curate', 'de suprafata'),
    ('ZDS Model O15', 'Pompa de recirculare pentru piscina de la ZDS', 'zds_model_o15.jpg', 269.00, 115, ARRAY['control smartphone'], TRUE, '2200W', 'pompe ape curate', 'pompe recirculare'),
    ('Panelli Model P16', 'Pompa pentru sisteme de irigatii de la Panelli', 'panelli_model_p16.jpg', 129.50, 68, NULL, FALSE, '1100w', 'pompe ape curate', 'irigatii'),
    ('Pedrollo Model Q17', 'Pompa pentru curatarea piscinei de la Pedrollo', 'pedrollo_model_q17.jpg', 279.95, 118, ARRAY['senzor nivel apa'], TRUE, '1500w', 'pompe ape curate', 'pompe piscina');