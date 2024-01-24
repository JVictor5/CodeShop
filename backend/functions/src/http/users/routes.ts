import { ensureAuthentication } from '@burand/functions/middlewares';
import { Router } from 'express';

import { handleCreateAdmin } from './useCases/createAdmin/index.js';
import { handleCreateUser } from './useCases/createUsers/index.js';
import { handleUpdateUser } from './useCases/updateUsers/index.js';

const routes = Router();

routes.use(ensureAuthentication);

routes.post('/', handleCreateUser);
routes.post('/admins', handleCreateAdmin);
routes.put('/:id', handleUpdateUser);

export default routes;
