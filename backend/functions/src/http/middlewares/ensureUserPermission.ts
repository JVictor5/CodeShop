import { ApiError } from '@burand/functions/exceptions';
import { NextFunction, Request, Response } from 'express';

import { UserPermission } from '@enums/UserPermission.js';

export function ensureUserPermission(permissions: UserPermission[]) {
  return (request: Request, _: Response, nextFunction: NextFunction): void => {
    if (!permissions.find(permission => request.user.permissions.includes(permission))) {
      throw new ApiError('Without permission.', 'application/without-permission', 403);
    }

    nextFunction();
  };
}
