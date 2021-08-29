import { stateful, isStateful } from './stateful';

test('set singleton', () => {
  @stateful
  class MyClass {
  }

  expect(isStateful(MyClass)).toEqual(true);
});

test('singleton is not inherited', () => {
  @stateful
  class MyClass {
  }

  class MyClass2 extends MyClass {
  }

  expect(isStateful(MyClass)).toEqual(true);
  expect(isStateful(MyClass2)).toEqual(false);
});
