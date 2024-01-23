import Busboy from 'busboy';
import { NextFunction, Request, Response } from 'express';

import { createWriteStream, readFile, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { ApiError } from '@burand/functions/exceptions';
import { File } from '@interfaces/file.js';
import { fileTypeFromBuffer } from 'file-type';
/**
 * Fetches a file from the request and populates the request body and files.
 */
export function fetchFile(request: Request, _response: Response, nextFunction: NextFunction): void {
  const busboy = Busboy({
    headers: request.headers
  });

  const fields: Record<string, string> = {};
  const files: File[] = [];
  const fileWrites: Promise<void>[] = [];

  busboy.on('field', (fieldname, val) => {
    fields[fieldname] = val;
  });

  busboy.on('file', (fieldname, file, { filename }) => {
    const filepath = join(tmpdir(), filename);

    const writeStream = createWriteStream(filepath);

    file.pipe(writeStream);

    fileWrites.push(
      new Promise<void>((resolve, reject) => {
        file.on('end', () => writeStream.end());

        writeStream.on('finish', () => {
          readFile(filepath, async (err, buffer) => {
            if (err) return reject(err);

            const fileResult = await fileTypeFromBuffer(buffer);

            if (!fileResult)
              return reject(new ApiError('Unsuported file format', 'application/unsoported-file-format'));

            files.push({
              fieldname,
              buffer,
              mime: fileResult.mime,
              ext: fileResult.ext
            });

            try {
              unlinkSync(filepath);
            } catch {
              return reject(err);
            }

            return resolve();
          });
        });

        writeStream.on('error', reject);
      })
    );
  });

  busboy.on('finish', () => {
    Promise.all(fileWrites)
      .then(() => {
        request.body = fields;
        request.files = files;

        nextFunction();
      })
      .catch(nextFunction);
  });

  busboy.end(request.rawBody);
}
