import { stateful, isSingleton } from './stateful';

test('set singleton', () => {
  @stateful
  class MyClass {
  }

  expect(isSingleton(MyClass)).toEqual(true);
});

test('singleton is not inherited', () => {
  @stateful
  class MyClass {
  }

  class MyClass2 extends MyClass {
  }

  expect(isSingleton(MyClass)).toEqual(true);
  expect(isSingleton(MyClass2)).toEqual(false);
});
