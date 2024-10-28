import { ensureAuthentication } from '@burand/functions/middlewares';
import { Router } from 'express';

import { fetchFile } from '@middlewares/fetchFile.js';
import { handleFileUpload } from './shopCases/updateAvatarShop/index.js';
import { handleCreateShop } from './shopCases/createShop/index.js';

const routes = Router();

routes.post('/sellers', handleCreateShop);
routes.post('/:shopId/:typeMedia/upload', ensureAuthentication, fetchFile, handleFileUpload);

export default routes;
