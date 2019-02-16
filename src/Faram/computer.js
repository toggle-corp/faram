import produce from 'immer';

const isEqual = (a, b) => (
    a === b || (Number.isNaN(a) && Number.isNaN(b))
);

const emptyList = [];
const emptyObj = {};

const calculateData = (inputValue, schema, params = emptyList) => {
    let value = inputValue;

    const { fields, member } = schema;

    if (fields) {
        const safeObj = value || emptyObj;
        Object.keys(fields).forEach((fieldName) => {
            const childSchema = fields[fieldName];

            const oldData = safeObj[fieldName];
            const newParams = [...params, oldData];
            const newData = typeof childSchema === 'function'
                ? childSchema(...newParams)
                : calculateData(oldData, childSchema, newParams);

            if (!isEqual(oldData, newData)) {
                value = produce(safeObj, (deferedObj) => {
                    // eslint-disable-next-line no-param-reassign
                    deferedObj[fieldName] = newData;
                });
            }
        });
    } else if (member) {
        const safeList = value || emptyList;
        safeList.forEach((oldData, index) => {
            const newParams = [...params, oldData];
            const newData = calculateData(oldData, member, newParams);

            if (!isEqual(oldData, newData)) {
                value = produce(safeList, (deferedList) => {
                    // eslint-disable-next-line no-param-reassign
                    deferedList[index] = newData;
                });
            }
        });
    }
    return value;
};


const computeOutputs = (initialValue, schema, maxIteration = 100) => {
    let value = initialValue;

    if (!schema) {
        return value;
    }

    let i;
    for (i = 0; i < maxIteration; i += 1) {
        const newValue = calculateData(value, schema, [value]);
        if (newValue === value) {
            break;
        }
        value = newValue;
    }

    if (i >= maxIteration) {
        console.warn(`Faram computed for ${i} times.`);
    }

    return value;
};

export default computeOutputs;
