import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
// import { scheduled } from 'rxjs';
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
          const randomText = { ...res, id: uuid(url, uuid.URL) };
          this.addData(randomText);
          return randomText;
        })
      );
  }

  getSavedRecord(id: string): RandomText|undefined {
    const randomText = this.data.find(item => item.id === id);
    return randomText ? this.clone<RandomText>(randomText) : undefined;
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
