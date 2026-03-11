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

    if (!nome || !senha){
        reply.status.apply(400).send({error: 'Nome ou senha invalidos'});
        }
    

    const resultado = await sql.query('INSERT INTO usuario (nome, senha) VALUES ($1, $2)', [nome, senha])
    reply.status(201).send({mensagem: "Deu Certo!"})

})

server.put('/usuario/:id', async (request, reply) => {
    const body = request.body
    const id = request.params.id

    if (!body || !body.nome || !body.senha) {
        reply.status(400).send({error: 'nome ou senha invalido!'})
    } else if(!id) {
        reply.status(400).send({error: 'Faltou o ID!'})
    }

    const existe = await sql.query('select * from usuario where id = $1', [id])
    
    if (existe.rows.length === 0) {
        reply.status(400).send({error: 'Usuário não existe no banco de dados'})
    }

    const resultado = await sql.query('UPDATE usuario SET nome = $1, senha = $2 WHERE  id = $3', [body.nome, body.senha, id])
    return 'Usuario alterado!'
})

server.delete('/usuarios/:id', async (request, reply) => {
    const id = request.params.id
    const resultado = await sql.query('DELETE FROM usuario where id= $1', [id])
    reply.status(204)
})

server.listen({
    port: 3000
})

