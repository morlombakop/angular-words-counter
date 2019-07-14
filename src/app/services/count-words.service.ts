import { Injectable } from '@angular/core';

@Injectable()
export class CountWordsService {
  getWordsCount(text: string, htmlTag: string = 'p', regExp?: RegExp): number {
    let cleanText = text ? text.trim() : '';

    if (cleanText) {
      cleanText = text.replace( new RegExp(`</${htmlTag}>`, 'g'), '')
        .replace(new RegExp(`<${htmlTag}>`, 'g'), ' ');

      if (regExp) {
        cleanText = cleanText.replace(regExp, ' ');
      }

      cleanText = cleanText.trim();
      return cleanText ? cleanText.split(' ').length : 0;
    }

    return 0;
  }
}
