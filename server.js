import Fastify from 'fastify'

const server = Fastify()

server.get('/usuario', () => {
    return 'pego fogo :)'
})

server.listen({
    port: 3000
})

