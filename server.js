import Fastify from 'fastify'
import { Pool } from 'pg'

const server = Fastify()

const sql = new Pool({
    user: "postgres",
    password: "senai",
    host: "localhost",
    port: 5432,
    database: "receitas"
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
        [nome, email, senha]
    )

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

server.listen({
    port: 3000
})