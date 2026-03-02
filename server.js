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
    const resultado = await sql.query('select * from usuario')
    return resultado.rows
})

server.post('/usuario', async (request, reply) => {
    const nome = request.body.nome
    const senha = request.body.senha
    const resultado = await sql.query('INSERT INTO usuario (nome, senha) VALUES ($1, $2)', [nome, senha])
    return 'Usuario cadastrado!'
})

server.listen({
    port: 3000
})

