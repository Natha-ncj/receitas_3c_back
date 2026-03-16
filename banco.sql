CREATE TABLE IF NOT EXISTS usuario (
	id serial primary key,
	nome varchar(255) not null,
	email varchar(255) not null unique,
	ativo boolean default true,
	senha varchar(255) not null,
	criado_em timestamp default current_timestamp
);

CREATE TABLE IF NOT EXISTS receita (
	id serial primary key,
	nome varchar(200) not null,
	ingredientes text not null,
	instrucoin text not null,
	tempo_preparo_min integer not null,
	usuario_id integer not null references usuario(id) on delete cascade
);
