declare namespace Express {
  export interface Request {
    user: {
      uid: string;
      email: string;
      permissions: string[];
    };

    files: {
      fieldname: string;
      mime: string;
      ext: string;
      buffer: Buffer;
    }[];

    rawBody: Buffer;
  }
}
