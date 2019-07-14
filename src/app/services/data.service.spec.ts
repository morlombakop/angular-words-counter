import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DataService } from './data.service';
import { RandomText } from '../models/random-text.model';

describe('Count Words Services', () => {
  let httpTestingController: HttpTestingController;
  let dataService: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ DataService ]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    dataService = TestBed.get(DataService);
  });

  afterEach(() => {
     // After every test, assert that there are no more pending requests.
     httpTestingController.verify();
  });

  it('Should initialize with empty records', () => {
    expect(dataService.getAll()).toEqual([]);
    expect(dataService.getSavedRecord('123-foo-bar')).toBeUndefined();
  });

  it('Should return expected RandomText', () => {
    const testData: RandomText = {
      text_out: 'Foo bar',
      type: 'lorem',
      format: 'p',
      number: 20,
      number_max: 40,
      amount: 3,
      time: '08:46:51',
    } as RandomText;

    const fakeUrl = 'http://www.fake.com';

    dataService.fetchRandom(fakeUrl).subscribe(
      data => {
        const { id, ...rest } = data;

        expect(rest).toEqual(testData, 'Should return expected RandomTex');
        expect(dataService.getSavedRecord(id)).toEqual(data);
        expect(dataService.getAll()).toEqual([data]);
      },
      fail
    );

    const req = httpTestingController.expectOne(fakeUrl);
    expect(req.request.method).toEqual('GET');

    // Respond with the mock random text
    req.flush(testData);
  });
});
