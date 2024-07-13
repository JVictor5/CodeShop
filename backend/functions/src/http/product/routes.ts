import { ensureAuthentication } from '@burand/functions/middlewares';
import { Router } from 'express';

import { fetchFile } from '@middlewares/fetchFile.js';
import { handleFileUpload } from './CreateProdImg/index.js';
import { handleGetFileProd } from './GetProdImg/index.js';
//

const routes = Router();

routes.post('/:productId/upload', ensureAuthentication, fetchFile, handleFileUpload);
routes.get('/:id/:produc/:filename', handleGetFileProd);
export default routes;
