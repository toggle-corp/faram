import computeOutputs from './computer';

test('compute without schema', () => {
    const input = { people: 2, money: 100 };
    // NOTE: reference shouldn't change
    expect(computeOutputs(input, undefined)).toBe(input);
});

test('compute output without change', () => {
    const input = { people: 2, name: 'lowercase' };
    const schema = {
        fields: {
            name: val => val.name.toLowerCase(),
        },
    };
    // NOTE: reference shouldn't change
    expect(computeOutputs(input, schema)).toBe(input);
});

test('compute output', () => {
    const input = { people: 2, money: 100 };
    const schema = {
        fields: {
            total: val => val.people * val.money,
        },
    };
    const output = { people: 2, money: 100, total: 200 };
    expect(computeOutputs(input, schema)).toEqual(output);
});

test('compute infinite', () => {
    const input = { people: 2, money: 100 };
    const schema = {
        fields: {
            money: val => val.money + 1,
        },
    };
    const output = { people: 2, money: 110 };
    expect(computeOutputs(input, schema, 10)).toEqual(output);
});

test('compute output', () => {
    const input = [{ people: 2, money: 100 }];
    const schema = {
        member: {
            fields: {
                total: (parent, val) => val.people * val.money,
            },
        },
    };
    const output = [{ people: 2, money: 100, total: 200 }];
    expect(computeOutputs(input, schema)).toEqual(output);
});
