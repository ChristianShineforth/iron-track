// plugins/swagger.js
const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  console.log('🟡 Swagger plugin loaded')
  // Register Swagger UI
  await fastify.register(require('@fastify/swagger'), {
    openapi: {
      info: {
        title: 'Fastify API',
        description: 'API documentation for your app',
        version: '1.0.0',
      },
      servers: [
        { url: 'http://localhost:3000' }
      ],
    }
  })

  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
    transformSpecificationClone: true,
  })

  // Generate docs
  fastify.ready(err => {
    if (err) throw err
    fastify.swagger() // This compiles the OpenAPI spec
  })
})
