// import { ApiError } from '@burand/functions/exceptions';
// import { AddDocument } from '@burand/functions/typings';
// import { singleton } from 'tsyringe';

// import { User } from '@models/User.js';
// import { UserRepository } from '@repositories/UserRepository.js';
// import { CreateShopParams } from './CreateShopValidation.js';

// @singleton()
// export class CreateUserUseCase {
//   constructor(private _user: UserRepository) {}

//   async execute({ name, email }: CreateShopParams): Promise<void> {
//     try {
//       const userData: AddDocument<User> = {
//         name,
//         email,
//         document,
//         documentType,
//         phone,
//         nivel,
//         active: true,
//         avatar: null,
//         lastAccess: null
//       };

//       await this._user.add(userData);
//     } catch {
//       console.error('');

//       throw new ApiError('User create failed', 'application/create-user', 500);
//     }
//   }
// }
