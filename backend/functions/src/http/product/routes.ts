import { ensureAuthentication } from '@burand/functions/middlewares';
import { Router } from 'express';

import { fetchFile } from '@middlewares/fetchFile.js';
import { handleFileUpload } from './CreateProdImg/index.js';
import { handleVideosUpload } from './CreateProdVideos/index.js';
import { handleGetFileProd } from './GetProdImg/index.js';
import { handleFileDelete } from './DeleteProdImg/index.js';
//

const routes = Router();

routes.post('/:productId/:typeMedia/upload', ensureAuthentication, fetchFile, handleFileUpload);
routes.post('/:productId/uploadVideos', ensureAuthentication, fetchFile, handleVideosUpload);
routes.get('/:productId/:typeMedia/:size/getAll', ensureAuthentication, handleGetFileProd);
routes.delete('/:productId/:typeMedia/:fileName/deleteImage', ensureAuthentication, handleFileDelete);
export default routes;
