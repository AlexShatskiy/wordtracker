import { Injectable } from '@nestjs/common';

@Injectable()
export class WordsService {
  findInDB(_term: string, _lang: string): null {
    return null;
  }
}
