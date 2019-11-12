import { state, PromiseStateEnum } from './state';

describe('webgis4u/util/promise/state', () => {
  describe('with async promise', () => {
    let P;
    let promiseResolve;
    let promiseReject;
    beforeEach(() => {
      P = new Promise((resolve, reject) => {
        promiseResolve = resolve;
        promiseReject = reject;
      });
    });

    it('with async promise (unresolved)', () => {
      return expect(state(P)).resolves.toEqual(PromiseStateEnum.Pending);
    });

    it('with async promise (resolve)', () => {
      promiseResolve();
      return expect(state(P)).resolves.toEqual(PromiseStateEnum.Fulfilled);
    });

    it('with async promise (reject)', async () => {
      expect(await state(P)).toBe(PromiseStateEnum.Pending);
      promiseReject();
      expect(await state(P)).toBe(PromiseStateEnum.Rejected);
    });
  });
});
