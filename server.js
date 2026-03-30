import Fastify from 'fastify'
import { Pool } from 'pg'
import cors from '@fastify/cors'

const server = Fastify()

const sql = new Pool({
    user: "postgres",
    password: "senai",
    host: "localhost",
    port: 5432,
    database: "receitas"
})

server.register(cors, {
    origin: '*'
})

server.get('/usuario', async () => {
    const resultado = await sql.query('SELECT * FROM usuario')
    return resultado.rows
})

server.post('/usuario', async (request, reply) => {

    const { nome, email, senha } = request.body

    if (!nome || !email || !senha){
        return reply.status(400).send({error: 'Nome, email ou senha inválidos'})
    }

    await sql.query(
        'INSERT INTO usuario (nome, email, senha) VALUES ($1, $2, $3)',
        [nome, email, senha])
    reply.status(201).send({mensagem: "Usuário criado!"})
})

server.put('/usuario/:id', async (request, reply) => {

    const { nome, senha } = request.body
    const id = request.params.id

    if (!nome || !senha){
        return reply.status(400).send({error: 'Nome ou senha inválidos'})
    }

    const existe = await sql.query(
        'SELECT * FROM usuario WHERE id = $1',
        [id]
    )

    if (existe.rows.length === 0){
        return reply.status(404).send({error: 'Usuário não existe'})
    }

    await sql.query(
        'UPDATE usuario SET nome = $1, senha = $2 WHERE id = $3',
        [nome, senha, id]
    )

    return {mensagem: "Usuário alterado"}
})

server.delete('/usuario/:id', async (request, reply) => {

    const id = request.params.id

    await sql.query(
        'DELETE FROM usuario WHERE id = $1',
        [id]
    )

    reply.status(204).send()
})

server.post('/login', async (request, reply) => {
    const body = request.body;
    const resultado = await sql.query('select * from usuario where email = $1 and senha = $2', [body.email, body.senha])

    if (resultado.rows.length === 0) {
        return reply.status(401).send({error: 'email ou senha inválidos.'})
    }

    reply.status(200).send({mensagem: "login realizado com sucesso!", ok: true})
})

server.listen({
    port: 3000
})