import { ensureAuthentication } from '@burand/functions/middlewares';
import { Router } from 'express';

import { fetchFile } from '@middlewares/fetchFile.js';
import { handleFileUpload } from './CreateProdImg/index.js';
//

const routes = Router();

routes.post('/:productId/upload', ensureAuthentication, fetchFile, handleFileUpload);
// routes.get('/:id/avatar' );
export default routes;
