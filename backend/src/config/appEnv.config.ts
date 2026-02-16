import { registerAs } from "@nestjs/config";



export default registerAs('appEnv', () => ({
   environment: process.env.NODE_ENV || 'production'
}))