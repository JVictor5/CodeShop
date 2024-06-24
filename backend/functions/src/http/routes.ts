import { Router } from 'express';

import usersRouter from './users/routes.js';
import prodsRouter from './product/routes.js';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/prods', prodsRouter);

export default routes;
