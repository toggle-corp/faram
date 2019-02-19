import {
    accumulateValues,
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
        member: {
            fields: {
                name: [requiredCondition],
            },
        },
    },
};
const schema = {
    identifier: (val = {}) => val.type,
    fields: { // the name of the actual field is "fields"
        default: {
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
            { name: 'oye' },
            { name: 'como' },
            { name: 'va', parasite: 'tick' },
        ],
    };
    const output = {
        type: 'string',

        id: 12,
        title: 'name',

        pets: [
            { name: 'oye' },
            { name: 'como' },
            { name: 'va' },
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
