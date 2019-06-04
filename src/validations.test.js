import {
    requiredCondition,
    numberCondition,
    integerCondition,
    lessThanCondition,
    greaterThanCondition,
    lessThanOrEqualToCondition,
    greaterThanOrEqualToCondition,
    lengthLessThanCondition,
    lengthGreaterThanCondition,
    lengthEqualToCondition,
    emailCondition,
    urlCondition,
    lenientUrlCondition,
    exclusiveInBetweenCondition,
    inclusiveInBetweenCondition,
} from './validations';

test('required condition', () => {
    expect(requiredCondition('').ok).toBe(false);
    expect(requiredCondition(NaN).ok).toBe(false);
    expect(requiredCondition(undefined).ok).toBe(false);
    expect(requiredCondition(null).ok).toBe(false);
    expect(requiredCondition(false).ok).toBe(true);
    expect(requiredCondition(true).ok).toBe(true);
    expect(requiredCondition(1).ok).toBe(true);
    expect(requiredCondition('hari').ok).toBe(true);
    expect(requiredCondition({ some: 'key' }).ok).toBe(true);
});

test('number condition', () => {
    expect(numberCondition(undefined).ok).toBe(true);
    expect(numberCondition(null).ok).toBe(true);
    expect(numberCondition('').ok).toBe(true);

    expect(numberCondition('hari').ok).toBe(false);
    expect(numberCondition('1.23').ok).toBe(true);
    expect(numberCondition(1.23).ok).toBe(true);
    expect(numberCondition(-1).ok).toBe(true);
});

test('integer condition', () => {
    expect(numberCondition(undefined).ok).toBe(true);
    expect(numberCondition(null).ok).toBe(true);
    expect(numberCondition('').ok).toBe(true);

    expect(integerCondition('1.23').ok).toBe(false);
    expect(integerCondition(1.23).ok).toBe(false);
    expect(integerCondition(-1).ok).toBe(true);
    expect(integerCondition('2').ok).toBe(true);
});

test('exclusively in between', () => {
    expect(exclusiveInBetweenCondition(-20, 20)(100).ok).toBe(false);
    expect(exclusiveInBetweenCondition(-20, 20)(20).ok).toBe(false);
    expect(exclusiveInBetweenCondition(-20, 20)(0).ok).toBe(true);
    expect(exclusiveInBetweenCondition(-20, 20)(-20).ok).toBe(false);
    expect(exclusiveInBetweenCondition(-20, 20)(-100).ok).toBe(false);

    expect(exclusiveInBetweenCondition(undefined, 20)(100).message).toBe('Value must be less than 20');
    expect(exclusiveInBetweenCondition(-20, undefined)(-100).message).toBe('Value must be greater than -20');
    expect(exclusiveInBetweenCondition(-20, 20)(100).message).toBe('Value must be exclusively in between -20 and 20');
});

test('inclusively in between', () => {
    expect(inclusiveInBetweenCondition(-20, 20)(100).ok).toBe(false);
    expect(inclusiveInBetweenCondition(-20, 20)(20).ok).toBe(true);
    expect(inclusiveInBetweenCondition(-20, 20)(0).ok).toBe(true);
    expect(inclusiveInBetweenCondition(-20, 20)(-20).ok).toBe(true);
    expect(inclusiveInBetweenCondition(-20, 20)(-100).ok).toBe(false);

    expect(inclusiveInBetweenCondition(undefined, 20)(100).message).toBe('Value must be less than or equal to 20');
    expect(inclusiveInBetweenCondition(-20, undefined)(-100).message).toBe('Value must be greater than or equal to -20');
    expect(inclusiveInBetweenCondition(-20, 20)(100).message).toBe('Value must be in between -20 and 20');
});

test('less than condition', () => {
    expect(lessThanCondition(1)(3).ok).toBe(false);
    expect(lessThanCondition(1)(1).ok).toBe(false);
    expect(lessThanCondition(1)(-1).ok).toBe(true);
});

test('greater than condition', () => {
    expect(greaterThanCondition(1)(3).ok).toBe(true);
    expect(greaterThanCondition(1)(1).ok).toBe(false);
    expect(greaterThanCondition(1)(-1).ok).toBe(false);
});

test('less than or equal condition', () => {
    expect(lessThanOrEqualToCondition(1)(3).ok).toBe(false);
    expect(lessThanOrEqualToCondition(1)(1).ok).toBe(true);
    expect(lessThanOrEqualToCondition(1)(-1).ok).toBe(true);
});

test('greater than or equal condition', () => {
    expect(greaterThanOrEqualToCondition(1)(3).ok).toBe(true);
    expect(greaterThanOrEqualToCondition(1)(1).ok).toBe(true);
    expect(greaterThanOrEqualToCondition(1)(-1).ok).toBe(false);
});

test('length less than condition', () => {
    expect(lengthLessThanCondition(3)('abcde').ok).toBe(false);
    expect(lengthLessThanCondition(3)('abc').ok).toBe(false);
    expect(lengthLessThanCondition(3)('ab').ok).toBe(true);
    expect(lengthLessThanCondition(3)('').ok).toBe(true);
});


test('length greater than condition', () => {
    expect(lengthGreaterThanCondition(3)('abcde').ok).toBe(true);
    expect(lengthGreaterThanCondition(3)('abc').ok).toBe(false);
    expect(lengthGreaterThanCondition(3)('ab').ok).toBe(false);
});

test('length equal to condition', () => {
    expect(lengthEqualToCondition(3)('abc').ok).toBe(true);
    expect(lengthEqualToCondition(3)('def').ok).toBe(true);
    expect(lengthEqualToCondition(3)('ab').ok).toBe(false);
    expect(lengthEqualToCondition(3)('abcde').ok).toBe(false);
});

test('email condition', () => {
    expect(emailCondition(undefined).ok).toBe(true);
    expect(emailCondition('').ok).toBe(true);
    expect(emailCondition('hari@test.com').ok).toBe(true);
});


test('url condition', () => {
    expect(urlCondition('').ok).toBe(true);
    expect(urlCondition('').ok).toBe(true);
    expect(urlCondition('https://www.w3.org/Protocols/HTTP/1.1/rfc2616.pdf').ok).toBe(true);
    expect(urlCondition('http://www.w3.org/Protocols/HTTP/1.1/rfc2616.pdf').ok).toBe(true);
    expect(urlCondition('www.w3.org/Protocols/HTTP/1.1/rfc2616.pdf').ok).toBe(false);
});


test('lenient url condition', () => {
    expect(lenientUrlCondition('').ok).toBe(true);
    expect(lenientUrlCondition('').ok).toBe(true);
    expect(lenientUrlCondition('https://www.w3.org/Protocols/HTTP/1.1/rfc2616.pdf').ok).toBe(true);
    expect(lenientUrlCondition('http://www.w3.org/Protocols/HTTP/1.1/rfc2616.pdf').ok).toBe(true);
    expect(lenientUrlCondition('www.w3.org/Protocols/HTTP/1.1/rfc2616.pdf').ok).toBe(true);
});
