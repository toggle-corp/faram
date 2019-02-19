import {
    isFalsy,
    isDefined,
    isInteger,
    splitInWhitespace,
    getErrorForDateValues,
    getErrorForTimeValues,
    isValidEmail,
    isValidUrl,
} from '@togglecorp/fujs';


export const exclusiveInBetweenCondition = (min, max) => (value) => {
    const ok = isFalsy(value)
        || (isFalsy(min) && isFalsy(max))
        || (isFalsy(min) && value < max)
        || (isFalsy(max) && value > min)
        || (value < max && value > min);

    const message = ((isFalsy(min) && isFalsy(max)) && '')
        || (isFalsy(min) && `Value must be less than ${max}`)
        || (isFalsy(max) && `Value must be greater than ${min}`)
        || `Value must be exclusively in between ${min} and ${max}`;

    return { ok, message };
};

export const inclusiveInBetweenCondition = (min, max) => (value) => {
    const ok = isFalsy(value)
        || (isFalsy(min) && isFalsy(max))
        || (isFalsy(min) && value <= max)
        || (isFalsy(max) && value >= min)
        || (value <= max && value >= min);

    const message = ((isFalsy(min) && isFalsy(max)) && '')
        || (isFalsy(min) && `Value must be less than or equal to ${max}`)
        || (isFalsy(max) && `Value must be greater than or equal to ${min}`)
        || `Value must be in between ${min} and ${max}`;

    return { ok, message };
};

export const lessThanCondition = n => (value) => {
    const ok = isFalsy(value) || value < n;
    return {
        ok,
        message: `Value must be less than ${n}`,
    };
};

export const greaterThanCondition = n => (value) => {
    const ok = isFalsy(value) || value > n;
    return {
        ok,
        message: `Value must be greater than ${n}`,
    };
};

export const lessThanOrEqualToCondition = n => (value) => {
    const ok = isFalsy(value) || value <= n;
    return {
        ok,
        message: `Value must be less than or equal to ${n}`,
    };
};

export const greaterThanOrEqualToCondition = n => (value) => {
    const ok = isFalsy(value) || value >= n;
    return {
        ok,
        message: `Value must be greater than or equal to ${n}`,
    };
};


export const lengthLessThanCondition = n => (value) => {
    const ok = isFalsy(value) || value.length < n;
    return {
        ok,
        message: `Length must be less than ${n}`,
    };
};

export const lengthGreaterThanCondition = n => (value) => {
    const ok = isFalsy(value) || value.length > n;
    return {
        ok,
        message: `Length must be greater than ${n}`,
    };
};

export const lengthEqualToCondition = n => (value) => {
    const ok = isFalsy(value) || value.length === n;
    return {
        ok,
        message: `Length must be exactly ${n}`,
    };
};

export const requiredCondition = (value) => {
    const ok = isDefined(value) && !(
        (typeof value === 'string' && splitInWhitespace(value).length <= 0)
        || (Array.isArray(value) && value.length <= 0)
    );
    return {
        ok,
        message: 'Field must not be empty',
    };
};

export const numberCondition = (value) => {
    const ok = !Number.isNaN(value) && (isFalsy(value) || !isFalsy(+value));
    return {
        ok,
        message: 'Value must be a number',
    };
};

export const integerCondition = (value) => {
    const ok = !Number.isNaN(value) && (isFalsy(value) || isInteger(+value));
    return {
        ok,
        message: 'Value must be a integer',
    };
};

export const emailCondition = (value) => {
    const ok = isFalsy(value, ['']) || isValidEmail(value);
    return {
        ok,
        message: 'Value must be a valid email',
    };
};

export const urlCondition = (value) => {
    const ok = isFalsy(value, ['']) || isValidUrl(value);
    return {
        ok,
        message: 'Value must be a valid URL',
    };
};

export const dateCondition = (value) => {
    let error;

    if (!isFalsy(value, '')) {
        const dates = value.split('-');
        const [yearValue, monthValue, dayValue] = dates;
        error = getErrorForDateValues({ yearValue, monthValue, dayValue });
    }

    return {
        ok: !error,
        message: error,
    };
};

const TIME_SEPARATOR = ':';

export const timeCondition = (value) => {
    let error;

    if (!isFalsy(value, '')) {
        const values = value.split(TIME_SEPARATOR);
        const [hourValue, minuteValue, secondValue] = values;
        error = getErrorForTimeValues({ hourValue, minuteValue, secondValue });
    }

    return {
        ok: !error,
        message: error,
    };
};
