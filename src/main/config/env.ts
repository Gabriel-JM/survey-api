export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/survey-api',
  port: process.env.PORT ?? 5000,
  jwtSecret: process.env.JWT_SECRET ?? 'flkg904oj9'
} as const
