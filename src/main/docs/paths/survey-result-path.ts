export const surveyResultPath = {
  put: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Enquetes'],
    summary: 'API para criar a resposta de uma enquete',

    parameters: [{
      in: 'path',
      name: 'surveyId',
      required: true,
      schema: {
        type: 'string'
      }
    }],

    requestBody: {
      'application/json': {
        schema: {
          $ref: '#/schemas/saveSurveyResultParams'
        }
      }
    },

    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResult'
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
  },

  get: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Enquetes'],
    summary: 'API para consultar o resultado de uma enquete',

    parameters: [{
      in: 'path',
      name: 'surveyId',
      required: true,
      schema: {
        type: 'string'
      }
    }],

    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResult'
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
