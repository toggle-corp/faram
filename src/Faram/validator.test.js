import {
    accumulateValues,
    accumulateErrors,
    accumulateDifferentialErrors,
    analyzeErrors,
} from './validator';
import {
    requiredCondition,
} from '../validations';

const commonFields = {
    id: [requiredCondition],
    title: [requiredCondition],
    type: [requiredCondition],
    ordering: [],
    hidden: [],
    pets: {
        keySelector: item => item.id,
        member: {
            fields: {
                id: [requiredCondition],
                name: [requiredCondition],
            },
        },
    },
};

const schema = {
    identifier: (val = {}) => val.type,
    validation: (val = {}) => {
        const errors = [];
        if (val.type.startsWith('$')) {
            errors.push('This type is reserved');
        }
        return errors;
    },
    fields: { // the name of the actual field is "fields"
        default: {
            ...commonFields,
        },
        $string: {
            ...commonFields,
        },
        string: {
            ...commonFields,
        },
        number: {
            ...commonFields,
            options: {
                fields: {
                    separator: [requiredCondition],
                },
            },
        },
        geo: {
            ...commonFields,
            options: {
                fields: {
                    geoType: [requiredCondition],
                    adminLevel: [requiredCondition],
                },
            },
        },
        datetime: {
            ...commonFields,
            options: {
                fields: {
                    dateFormat: [requiredCondition],
                },
            },
        },
    },
};

/*
*/
test('accumulate value', () => {
    const input = {
        type: 'string',

        id: 12,
        title: 'name',

        misc: 100,
    };
    expect(accumulateValues(input, {})).toEqual(undefined);
});

test('accumulate value', () => {
    const input = {
        type: 'string',

        id: 12,
        title: 'name',

        misc: 100,
    };
    const output = {
        type: 'string',

        id: 12,
        title: 'name',
    };
    expect(accumulateValues(input, schema)).toEqual(output);
});

test('accumulate value with list', () => {
    const input = {
        type: 'string',

        id: 12,
        title: 'name',

        misc: 100,

        pets: [
            { id: 1, name: 'oye' },
            { id: 2, name: 'como' },
            { id: 3, name: 'va', parasite: 'tick' },
        ],
    };
    const output = {
        type: 'string',

        id: 12,
        title: 'name',

        pets: [
            { id: 1, name: 'oye' },
            { id: 2, name: 'como' },
            { id: 3, name: 'va' },
        ],
    };
    expect(accumulateValues(input, schema)).toEqual(output);
});

test('accumulate value with null', () => {
    const input = {
        type: 'string',

        id: 12,
        title: 'name',

        misc: 100,
    };
    const output = {
        type: 'string',

        id: 12,
        title: 'name',
        ordering: null,
        hidden: null,
        pets: null,
    };
    const settings = {
        noFalsyValues: false,
        falsyValue: null,
    };
    expect(accumulateValues(input, schema, settings)).toEqual(output);
});

test('accumulate error for invalid schema', () => {
    const input = {
        type: 'string',
        id: 12,
        title: 'name',

        misc: 100,
    };
    expect(accumulateErrors(input, {})).toEqual(undefined);
});

test('accumulate error with no error', () => {
    const input = {
        type: 'string',
        id: 12,
        title: 'name',

        misc: 100,
    };
    expect(accumulateErrors(input, schema)).toEqual(undefined);
});

test('accumulate error with error', () => {
    const input = {
        type: 'string',
        id: 12,

        misc: 100,
    };
    const error = { title: 'Field must not be empty' };
    expect(accumulateErrors(input, schema)).toEqual(error);
});

test('accumulate error with nested error', () => {
    const input = {
        type: 'string',
        id: 12,

        misc: 100,
        pets: [{ id: 12 }],
    };
    const error = {
        title: 'Field must not be empty',
        pets: {
            12: {
                name: 'Field must not be empty',
            },
        },
    };
    expect(accumulateErrors(input, schema)).toEqual(error);
});

test('accumulate error with validator', () => {
    const input = {
        type: '$string',
        id: 12,

        misc: 100,
    };
    const error = {
        $internal: ['This type is reserved'],
        title: 'Field must not be empty',
    };
    expect(accumulateErrors(input, schema)).toEqual(error);
});

test('accumulate differential error', () => {
    const input = {
        type: 'string',
        id: 12,
        misc: 100,
        pets: [
            { id: 1, name: 'oye' },
            { id: 2, name: 'como' },
            { id: 3, name: 'va', parasite: 'tick' },
        ],
    };
    const [firstPet, ...otherPets] = input.pets;
    const newInput = {
        ...input,
        id: undefined,
        pets: [
            {
                ...firstPet,
                name: undefined,
            },
            ...otherPets,
            { id: 4, name: undefined },
        ],
    };
    const oldError = {
        title: 'Field must not be empty',
        pets: {
            2: { name: 'Field must not be empty' },
        },
    };
    const newError = {
        title: 'Field must not be empty',
        id: 'Field must not be empty',
        pets: {
            1: { name: 'Field must not be empty' },
            2: { name: 'Field must not be empty' },
        },
    };
    expect(accumulateDifferentialErrors(input, newInput, oldError, schema)).toEqual(newError);
});

test('accumulate differential error, schema changed', () => {
    const input = {
        type: 'string',
        id: 12,
        misc: 100,
    };
    const newInput = {
        ...input,
        id: undefined,
        type: '$string',
    };
    const oldError = {
        title: 'Field must not be empty',
    };
    const newError = {
        $internal: ['This type is reserved'],
        id: 'Field must not be empty',
    };
    expect(accumulateDifferentialErrors(input, newInput, oldError, schema)).toEqual(newError);
});

test('analyze error', () => {
    expect(analyzeErrors(undefined)).toBe(false);
    expect(analyzeErrors({})).toBe(false);
    expect(analyzeErrors({ name: undefined })).toBe(false);
    expect(analyzeErrors({
        pets: {
            12: {
                name: undefined,
            },
        },
    })).toBe(false);
    expect(analyzeErrors({
        title: 'Field must not be empty',
    })).toBe(true);
    expect(analyzeErrors({
        title: 'Field must not be empty',
        id: 'Field must not be empty',
    })).toBe(true);
    expect(analyzeErrors({
        pets: {
            12: {
                name: 'Field must not be empty',
            },
        },
    })).toBe(true);
});
