import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_request, response) => {
  response.json({
    status: 'healthy',
    service: 'mwiti-bakers-api'
  });
});
