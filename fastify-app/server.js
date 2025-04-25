const path = require('path')
const autoload = require('@fastify/autoload')
const fastify = require('fastify') ({logger: true})

fastify.register(autoload, {
    dir: path.join(__dirname, 'plugins'),
})

fastify.register(autoload, {
    dir: path.join(__dirname, 'routes'),
    options: { prefix: '/api' }
})

fastify.ready(err => {
    if (err) throw err
    console.log(fastify.printRoutes())
})

const start = async () => {
    try {
        await fastify.listen({ port: 4000 })
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start();