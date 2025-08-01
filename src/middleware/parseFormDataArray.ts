import { NextFunction, Request, Response } from 'express';

function parseFormDataArray(req: Request, res: Response, next: NextFunction) {
  const details: any[] = [];

  // Loop semua key
  for (const key in req.body) {
    const match = key.match(/^details\[(\d+)\]\[(\w+)\]$/);
    if (match) {
      const index = Number(match[1]);
      const field = match[2];

      if (!details[index]) details[index] = {};
      details[index][field] = req.body[key];
      delete req.body[key]; // optional: bersihkan key aslinya
    }
  }

  if (details.length > 0) {
    req.body.details = details;
  }

  next();
}

export { parseFormDataArray };
