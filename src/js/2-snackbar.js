import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
const form = document.querySelector('.form');

document.addEventListener('DOMContentLoaded', () => {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const delayInput = form.querySelector('input[name="delay"]');
    const stateRadio = form.querySelector('input[name="state"]:checked');
    const state = stateRadio ? stateRadio.value : null;
    const delay = parseInt(delayInput.value, 10);
    // console.log(state);

    if (!isNaN(delay) && delay > 0 && state) {
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          if (state === 'fulfilled') {
            resolve(delay);
          } else {
            reject(delay);
          }
        }, delay);
      });

      try {
        const result = await promise;
        console.log(`✅ Fulfilled promise in ${result}ms`);
        iziToast.success({
          title: 'OK',
          message: `✅ Fulfilled promise in ${result}ms`,
          position: 'topCenter',
        });
      } catch (error) {
        console.log(`❌ Rejected promise in ${error}ms`);
        iziToast.error({
          title: 'Error',
          message: `❌ Rejected promise in ${error}ms`,
          position: 'topCenter',
        });
      } finally {
        form.reset();
      }
    } else {
      console.log('Please enter a valid delay and choose a state.');
      iziToast.warning({
        title: 'Caution',
        message: 'Please enter a valid delay and choose a state.',
        position: 'topCenter',
      });
    }
  });
});
