import { ensureAuthentication } from '@burand/functions/middlewares';
import { Router } from 'express';

import { UserPermission } from '@enums/UserPermission.js';
import { ensureUserPermission } from '@middlewares/ensureUserPermission.js';

import { handleCreateAdmin } from './useCases/createAdmin/index.js';
import { handleCreateUser } from './useCases/createUsers/index.js';
import { handleUpdateUser } from './useCases/updateUsers/index.js';

const routes = Router();

routes.use(ensureAuthentication);

routes.post('/', ensureUserPermission([UserPermission.WRITE_USERS]), handleCreateUser);
routes.post('/admins', ensureUserPermission([UserPermission.WRITE_ADMINS]), handleCreateAdmin);
routes.put('/:id', ensureUserPermission([UserPermission.WRITE_USERS, UserPermission.WRITE_ADMINS]), handleUpdateUser);

export default routes;
