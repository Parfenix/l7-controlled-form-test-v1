import axios from 'axios';
import onChange from 'on-change';
// step 3
const validateName = (name) => (name.trim().length ? [] : ['name cannot be empty']);
const validateEmail = (email) => (/\w+@\w+/.test(email) ? [] : ['invalid email']);
const validateField = (fieldName, data) => (fieldName === 'name' ? validateName(data) : validateEmail(data));

export default () => {
  // step 3
  const state = {
    values: {
      name: '',
      email: '',
    },
    errors: {
      name: [],
      email: [],
    },
  };
  // step 1
  const formContainer = document.querySelector('.form-container');

  const formHTML = `
  <form id="registrationForm">
    <div class="form-group">
        <label for="inputName">Name</label>
        <input type="text" class="form-control" id="inputName" placeholder="Введите ваше имя" name="name" required>
    </div>
    <div class="form-group">
        <label for="inputEmail">Email</label>
        <input type="text" class="form-control" id="inputEmail" placeholder="Введите email" name="email" required>
    </div>
    <input type="submit" value="Submit" class="btn btn-primary">
  </form>
  `;
  formContainer.innerHTML = formHTML;
  // step 2
  const form = document.querySelector('form');
  // step 4
  const submit = document.querySelector('[type="submit"]');
  // step 3
  const watchedState = onChange(state, (path) => {
    const selector = path.split('.')[1];
    const input = document.querySelector(`[name=${selector}]`);
    if (validateField(selector, state.values[selector]).length === 0) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    }
    // step 4
    submit.disabled = state.errors.name.length !== 0 || state.errors.email.length !== 0;
  });
    // step 3
  form.addEventListener('input', (e) => {
    e.preventDefault();
    const targetName = e.target.name;
    const data = new FormData(form).get(targetName);
    watchedState.values[targetName] = data;
    watchedState.errors[targetName] = validateField(targetName, data);
  });
  // step 2
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    axios.post('/users', state.values)
      .then((resp) => {
        document.body.innerHTML = `<p>${resp.data.message}</p>`;
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
