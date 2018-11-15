import { EntityRefIdGenerator } from "./entity-refid-generator";

describe('EntityRefIdGenerator', () => {
  let refIdGenerator: EntityRefIdGenerator = null;
  let nowFunc: jasmine.Spy;
  let randomFunc: jasmine.Spy;

  beforeEach(() => {
    nowFunc = jasmine.createSpy("nowfunc", () => Date.now());
    randomFunc = jasmine.createSpy("randomFunc", () => Math.random());
    nowFunc.and.callThrough();
    randomFunc.and.callThrough();

    refIdGenerator = new EntityRefIdGenerator("tag", nowFunc, randomFunc);
  });

  it("should generate a value whose first parameter is an incrementing number", () => {
    expect(refIdGenerator.next()).toMatch(/^0\-.*/, "starts with 1");
    expect(refIdGenerator.next()).toMatch(/^1\-.*/, "starts with 2");
    expect(refIdGenerator.next()).toMatch(/^2\-.*/, "starts with 3");
  });

  ["dog", "cat"].forEach(animal => {
    it(`should generate a value whose second parameter is the tag: ${animal}`, () => {
      refIdGenerator = new EntityRefIdGenerator(animal);
      const regex = new RegExp(`^\\d+\\-${animal}\\-*`);
      expect(refIdGenerator.next()).toMatch(regex, "second parameter should always be the tag");
      expect(refIdGenerator.next()).toMatch(regex, "second parameter should always be the tag");
      expect(refIdGenerator.next()).toMatch(regex, "second parameter should always be the tag");
    });
  });

  it("should generate a value whose third parameter is the now value", () => {
    nowFunc.and.returnValue("now");
    expect(refIdGenerator.next()).toMatch(/^0\-tag\-now\-.*/, "third parameter should be the now value");
    expect(refIdGenerator.next()).toMatch(/^1\-tag\-now\-.*/, "third parameter should be the now value");
    expect(refIdGenerator.next()).toMatch(/^2\-tag\-now\-.*/, "third parameter should be the now value");
  });

  it("should generate a value whose fourth parameter is the random value", () => {
    randomFunc.and.returnValue("random");
    expect(refIdGenerator.next()).toMatch(/\-random$/, "fourth parameter should be the random value");
    expect(refIdGenerator.next()).toMatch(/\-random$/, "fourth parameter should be the random value");
    expect(refIdGenerator.next()).toMatch(/\-random$/, "fourth parameter should be the random value");
  });
});
