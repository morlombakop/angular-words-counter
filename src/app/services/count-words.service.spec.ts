import { CountWordsService } from './count-words.service';

describe('Count Words Services', () => {
  let countWordsService: CountWordsService;

  beforeAll(() => {
    countWordsService = new CountWordsService();
  });

  afterAll(() => {
    countWordsService = null;
  });

  it('Should return the number of words', () => {
    const text = 'Hello word &534 ';
    const wordCount = countWordsService.getWordsCount(text);
    expect(wordCount).toEqual(3);

    const text1 = ' &534 ';
    const wordCount1 = countWordsService.getWordsCount(text1);
    expect(wordCount1).toEqual(1);
  });

  it('Should return 0 for null or empty string', () => {
    const text = '   ';
    const wordCount = countWordsService.getWordsCount(text);
    expect(wordCount).toEqual(0);

    const text2 = null;
    const wordCount2 = countWordsService.getWordsCount(text2);
    expect(wordCount2).toEqual(0);
  });

  it('Should replace default <p> tag', () => {
    const text = '<p> Hello world 123.</p>';
    const wordCount = countWordsService.getWordsCount(text);
    expect(wordCount).toEqual(3);

    const text1 = '<p></p>';
    const wordCount1 = countWordsService.getWordsCount(text1);
    expect(wordCount1).toEqual(0);

    const text2 = '<p> Hello world 123.</p><p>Foo bar  </p>';
    const wordCount2 = countWordsService.getWordsCount(text2);
    expect(wordCount2).toEqual(5);
  });

  it('Should replace any given tag', () => {
    const text = '<x1> Hello world 123.</x1>';
    const wordCount = countWordsService.getWordsCount(text, 'x1');
    expect(wordCount).toEqual(3);

    const text1 = '<x1></x1>';
    const wordCount1 = countWordsService.getWordsCount(text1, 'x1');
    expect(wordCount1).toEqual(0);

    const text2 = '<x1> Hello world 123.</x1><x1>Foo bar  </x1>';
    const wordCount2 = countWordsService.getWordsCount(text2, 'x1');
    expect(wordCount2).toEqual(5);
  });

  it('Should apply regular expression', () => {
    // Regular expression to cover white space and tab and new line;
    const regEx = /\s\s+/g;

    const text = `Hello
      123 World               tab space`;
    const wordCount = countWordsService.getWordsCount(text, undefined, regEx);
    expect(wordCount).toEqual(5);
  });
});
