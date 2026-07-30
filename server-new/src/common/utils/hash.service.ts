import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async hash(passport: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(passport, salt);
  }

  async compare(passport: string, hash: string): Promise<boolean> {
    return bcrypt.compare(passport, hash);
  }
}
