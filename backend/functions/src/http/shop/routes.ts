// import { ensureAuthentication } from '@burand/functions/middlewares';
import { Router } from 'express';

import { handleCreateShop } from './shopCases/createShop/index.js';

const routes = Router();

routes.post('/sellers', handleCreateShop);

export default routes;
