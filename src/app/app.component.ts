import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as isURL from 'validator/lib/isURL';
import { map } from 'rxjs/operators';

import { DataService } from './services/data.service';
import { CountWordsService } from './services/count-words.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  form: FormGroup;
  url = new FormControl('', [Validators.required]);
  wordsCount = '';
  outputText = '';

  constructor(
    private dataService: DataService,
    private countWordsService: CountWordsService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      url: this.url,
    });

    // validate the input text value
    this.url.valueChanges.subscribe(value => {
      this.outputText = '';
      if (value && isURL(value, { require_protocol: true })) {
        this.url.setErrors(null);
      } else {
        this.url.setErrors({ incorrect: true });
      }
    });
  }

  setClassUrl() {
    return { error: !this.url.pristine && !this.url.valid };
  }

  fetchData() {
    this.dataService
      .fetchRandom(this.url.value.trim())
      .pipe(
        map(res => ({
          wordsCount: this.countWordsService.getWordsCount(res.text_out),
          outputText: res.text_out
        }))
      )
      .subscribe(
        stream => {
          if (stream.outputText) {
            this.wordsCount = stream.wordsCount.toString();
            this.outputText = stream.outputText;
          }
        },
        // Error handler
        () => {
          this.wordsCount = '0';
          this.outputText = 'Error fetching data';
        }
      );
  }
}
