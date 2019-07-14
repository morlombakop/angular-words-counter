import { Injectable } from '@angular/core';

@Injectable()
export class CountWordsService {
  getWordsCount(text: string, htmlTag: string = 'p', regExp?: RegExp): number {
    if (text) {
      let cleanText = '';

      cleanText = text.replace( new RegExp(`</${htmlTag}>`, 'g'), '')
        .replace(new RegExp(`<${htmlTag}>`, 'g'), ' ').trim();

      if (regExp) {
        cleanText = cleanText.replace(regExp, '');
      }

      return cleanText.split(' ').length;
    }

    return 0;
  }
}
