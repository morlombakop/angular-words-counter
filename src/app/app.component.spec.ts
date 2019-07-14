import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { AppComponent } from './app.component';
import { DataService } from './services/data.service';
import { CountWordsService } from './services/count-words.service';
import { RandomText } from './models/random-text.model';

describe('AppComponent', () => {
  const mockDataService = jasmine.createSpyObj('DataService', ['fetchRandom']);
  const mockCountWordsService = jasmine.createSpyObj('CountWordsService', ['getWordsCount']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: CountWordsService, useValue: mockCountWordsService },
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app: AppComponent = fixture.debugElement.componentInstance;

    spyOn(app, 'setClassUrl');
    fixture.detectChanges();

    expect(app).toBeTruthy();
    expect(app.setClassUrl).toHaveBeenCalled();
  });

  it('should have empty wordsCount and output text', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app: AppComponent = fixture.debugElement.componentInstance;
    expect(app.wordsCount).toEqual('');
    expect(app.outputText).toEqual('');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Angular Words Count');
  });

  it('Should have form input elements', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.debugElement.nativeElement;
    const form = compiled.querySelector('form') as Element;

    expect(form).toBeDefined();
    expect(form.getElementsByTagName('button').length).toEqual(2);
    expect(form.getElementsByTagName('input').length).toEqual(1);
  });

  it('Should display words count', () => {
    const testData: RandomText = { text_out: 'Foo bar'} as RandomText;
    const fetchRandomSpy = mockDataService.fetchRandom.and.returnValue(of(testData));
    const getWordsCountSpy = mockCountWordsService.getWordsCount.and.returnValue(5);

    const fixture = TestBed.createComponent(AppComponent);
    const app: AppComponent = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    app.fetchData();

    expect(fetchRandomSpy).toHaveBeenCalled();
    expect(getWordsCountSpy).toHaveBeenCalledWith(testData.text_out);
    expect(app.wordsCount).toEqual('5');
    expect(app.outputText).toEqual(testData.text_out);
  });

  it('Should handle http errors', fakeAsync(() => {
    const fetchRandomSpy = mockDataService.fetchRandom.and.returnValue(
      throwError('TwainService test failure')
    );
    const fixture = TestBed.createComponent(AppComponent);
    const app: AppComponent = fixture.debugElement.componentInstance;

    fixture.detectChanges();
    app.fetchData();
    tick();

    expect(fetchRandomSpy).toHaveBeenCalled();
    expect(app.wordsCount).toEqual('0');
    expect(app.outputText).toEqual('Error fetching data');
  }));
});
