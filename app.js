var checkLength = function (input, value) {
    return input.value.length >= value;
};
var checkEmail = function (input) {
    return /\S+@+\S+\.\S+/.test(input.value);
};
var checkPasswordsMatch = function (input, comparedInput) { return input.value === comparedInput.value; };
var validations = {
    username: {
        method: checkLength,
        error: 'Username must be at least 3 characters.',
        empty: 'This field is required.',
        args: 3
    },
    email: {
        method: checkEmail,
        error: 'Email is not valid.',
        empty: 'This field is required.'
    },
    password: {
        method: checkLength,
        error: 'Password must be at least 6 characters.',
        empty: 'This field is required.',
        args: 6
    },
    confirmation: {
        method: checkPasswordsMatch,
        error: 'Passwords do no match.',
        empty: 'Password confirmation is required.',
        args: document.querySelector('input#password')
    }
};
var debounce = function (callback, wait) {
    if (wait === void 0) { wait = 600; }
    var timeoutId = undefined;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(function () {
            callback.apply(null, args);
        }, wait);
    };
};
var validateInput = function (input, validation) {
    var div = input.closest('div');
    if (input.value === '') {
        div.setAttribute('data-error', validation.empty);
        div.className = 'error';
        return false;
    }
    var status = validation.method(input, validation === null || validation === void 0 ? void 0 : validation.args);
    if (!status) {
        div.setAttribute('data-error', validation.error);
        div.className = 'error';
        return false;
    }
    div.className = 'success';
    return true;
};
var checkRequired = function (inputs) {
    var button = document.getElementById('submit');
    var isFormValid;
    inputs.forEach(function (input) {
        isFormValid = validateInput(input, validations[input.id]);
    });
    button.className = isFormValid ? 'focusable success' : 'focusable error';
};
var handleFocusState = function () {
    var focusables = document.querySelectorAll('.focusable');
    focusables.forEach(function (element) {
        element.addEventListener('blur', function () {
            var activeElement = document.querySelector('.active');
            if (activeElement)
                activeElement.classList.remove('active');
        });
        element.addEventListener('focus', function () {
            if (element.id === 'submit') {
                element.classList.add('active');
            }
            else {
                element.closest('div').classList.add('active');
            }
        });
    });
};
var InputChange = function (input, inputs) {
    var div = input.closest('div');
    var button = document.getElementById('submit');
    div.classList.remove('error', 'success');
    var validation = validations[input.id];
    var arguments = validation === null || validation === void 0 ? void 0 : validation.args;
    var status = validation.method(input, arguments);
    if (!status) {
        div.classList.add('error');
        div.setAttribute('data-error', validation.error);
    }
    else {
        div.classList.add('success');
    }
    inputs.forEach(function (input) {
        if (input.classList.contains('error')) {
            button.className = 'focusable error';
        }
    });
};
var handleInputChange = debounce(function (input, inputs) {
    InputChange(input, inputs);
});
document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('form');
    var inputs = document.querySelectorAll('input');
    handleFocusState();
    inputs.forEach(function (input) {
        input.addEventListener('keydown', function () {
            if (input.value !== '')
                handleInputChange(input, inputs);
        });
    });
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        checkRequired(inputs);
    });
});
