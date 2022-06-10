const checkLength = (input: HTMLInputElement, value: number) =>
  input.value.length >= value;

const checkEmail = (input: HTMLInputElement) =>
  /\S+@+\S+\.\S+/.test(input.value);

const checkPasswordsMatch = (
  input: HTMLInputElement,
  comparedInput: HTMLInputElement
) => input.value === comparedInput.value;

interface Validation {
  method: Function;
  error: string;
  empty: string;
  args?: number | HTMLInputElement;
}

interface Validations {
  [key: string]: Validation;
}

const validations: Validations = {
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
    args: document.querySelector('input#password') as HTMLInputElement
  }
};

const debounce = (callback: Function, wait: number = 600) => {
  let timeoutId: number | undefined = undefined;
  return (...args: any) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};

const validateInput = (input: HTMLInputElement, validation: Validation) => {
  const div = input.closest('div');
  if (input.value === '') {
    div.setAttribute('data-error', validation.empty);
    div.className = 'error';
    return false;
  }

  const status = validation.method(input, validation?.args);
  if (!status) {
    div.setAttribute('data-error', validation.error);
    div.className = 'error';
    return false;
  }
  div.className = 'success';
  return true;
};

const checkRequired = (inputs: NodeListOf<HTMLInputElement>) => {
  const button = document.getElementById('submit');
  let isFormValid: boolean;

  inputs.forEach((input) => {
    isFormValid = validateInput(input, validations[input.id]);
  });

  button.className = isFormValid ? 'focusable success' : 'focusable error';
};

const handleFocusState = () => {
  const focusables: NodeListOf<HTMLElement> =
    document.querySelectorAll('.focusable');
  focusables.forEach((element) => {
    element.addEventListener('blur', () => {
      const activeElement = document.querySelector('.active');
      if (activeElement) activeElement.classList.remove('active');
    });
    element.addEventListener('focus', () => {
      if (element.id === 'submit') {
        element.classList.add('active');
      } else {
        element.closest('div').classList.add('active');
      }
    });
  });
};

const InputChange = (
  input: HTMLInputElement,
  inputs: NodeListOf<HTMLInputElement>
) => {
  const div = input.closest('div');
  const button = document.getElementById('submit');
  div.classList.remove('error', 'success');
  const validation = validations[input.id];
  const arguments = validation?.args;
  const status = validation.method(input, arguments);
  if (!status) {
    div.classList.add('error');
    div.setAttribute('data-error', validation.error);
  } else {
    div.classList.add('success');
  }
  inputs.forEach((input) => {
    if (input.classList.contains('error')) {
      button.className = 'focusable error';
    }
  });
};

const handleInputChange = debounce(
  (input: HTMLInputElement, inputs: NodeListOf<HTMLInputElement>) => {
    InputChange(input, inputs);
  }
);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const inputs = document.querySelectorAll('input');
  handleFocusState();

  inputs.forEach((input) => {
    input.addEventListener('keydown', () => {
      if (input.value !== '') handleInputChange(input, inputs);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    checkRequired(inputs);
  });
});
