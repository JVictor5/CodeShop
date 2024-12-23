import { ensureAuthentication } from '@burand/functions/middlewares';
import { Router } from 'express';

import { fetchFile } from '@middlewares/fetchFile.js';
import { handleCreateAdmin } from './useCases/createAdmin/index.js';
import { handleCreateUser } from './useCases/createUsers/index.js';
import { handleUpdateUser } from './useCases/updateUsers/index.js';
import { handleFileUpload } from './useCases/updateAvatar/index.js';
import { handleGetFile } from './useCases/getAvatar/index.js';
import { recoverPass } from './useCases/recoverPassword/index.js';
import { enviEmail } from './useCases/email/index.js';

const routes = Router();

routes.post('/', handleCreateUser);
routes.post('/admins', ensureAuthentication, handleCreateAdmin);
routes.put('/:id', ensureAuthentication, handleUpdateUser);
routes.post('/:id/:typeMedia/upload', ensureAuthentication, fetchFile, handleFileUpload);
routes.get('/:id/avatar', handleGetFile);
routes.post('/pass', recoverPass);
routes.post('/email', enviEmail);

export default routes;
