import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import * as uuid from 'uuid/v5';

import { RandomText } from '../models/random-text.model';

@Injectable()
export class DataService {
  private data: RandomText[] = [];

  constructor(private http: HttpClient) {
  }

  fetchRandom(url: string): Observable<RandomText> {
    return this.http.get<RandomText>(url)
      .pipe(
        map(res => {
          const id = uuid(url, uuid.URL);
          const randomText = { ...res, id };
          this.addData(randomText);
          console.log('@@@@@@', randomText.text_out.replace( new RegExp('</p>', 'g'), '@@@@@').replace(new RegExp('<p>', 'g'), '&&&&&'));
          return randomText;
        })
      );
  }

  getSavedRecord(id: string): RandomText {
    return this.clone<RandomText>(this.data.find(item => item.id === id));
  }

  getAll(): RandomText[] {
    return this.clone<RandomText[]>(this.data);
  }

  private addData(value: RandomText): void {
    this.data.push(value);
  }

  private clone<T>(data: T): T {
    // keep the data immutable;
    return JSON.parse(JSON.stringify(data));
  }
}
