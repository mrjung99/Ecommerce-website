import * as Joi from 'joi';

export default Joi.object({
  DB_NAME: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_PORT: Joi.number().port().default(5432),
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASS: Joi.string().required(),
  MAIL_PORT: Joi.number().port().default(587),
  MAIL_HOST: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
});
