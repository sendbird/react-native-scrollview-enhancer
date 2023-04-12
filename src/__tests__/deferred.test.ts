import { deferred } from '../deferred';

describe('deferred', () => {
  it('resolves with correct value', async () => {
    const deferredString = deferred<string>();
    const expectedString = 'hello world';
    setTimeout(() => {
      deferredString.resolve(expectedString);
    }, 1000);
    const resultString = await deferredString.promise;
    expect(resultString).toBe(expectedString);
  });

  it('rejects with correct reason', async () => {
    const deferredError = deferred<Error>();
    const expectedError = new Error('Something went wrong');
    setTimeout(() => {
      deferredError.reject(expectedError);
    }, 1000);
    try {
      await deferredError.promise;
    } catch (error) {
      expect(error).toBe(expectedError);
    }
  });
});
