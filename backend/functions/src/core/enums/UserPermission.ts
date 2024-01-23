// Prefixes: READ_ | GET_ | LIST_ | WRITE_ | CREATE_ | UPDATE_ | DELETE_

export enum UserPermission {
  READ_ADMINS = 'read:admins',
  WRITE_ADMINS = 'write:admins',

  WRITE_USERS = 'write:users',
  READ_USERS = 'read:users'
}
