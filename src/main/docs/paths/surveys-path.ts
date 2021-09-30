export const surveysPath = {
  get: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Enquetes'],
    summary: 'API para listar as enquetes',

    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
} as const
