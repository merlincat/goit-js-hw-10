import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate;
const startButton = document.querySelector('[data-start]');
const inputPicker = document.querySelector('#datetime-picker');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    // Обробка події закриття вікна вибору дати
    if (selectedDates.length > 0) {
      userSelectedDate = selectedDates[0];
      validateSelectedDate(userSelectedDate);
    }
  },
};

// Ініціалізуйте Flatpickr з переданими параметрами
const datetimePicker = flatpickr(inputPicker, options);

function validateSelectedDate(date) {
  const currentDate = new Date();

  if (date < currentDate) {
    // Виведення повідомлення про помилку
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      position: 'topCenter',
    });

    // Деактивація кнопки "Start", якщо обрана дата в минулому
    startButton.disabled = true;
    inputPicker.disabled = false;
  } else {
    // Активація кнопки "Start", якщо обрана дата в майбутньому
    startButton.disabled = false;
    inputPicker.disabled = true;
  }
}

let countdownInterval;
function updateTimer() {
  const currentDate = new Date();
  const targetDate = datetimePicker.selectedDates[0];
  const timeDifference = targetDate - currentDate;

  if (timeDifference < 0) {
    clearInterval(countdownInterval);
    startButton.disabled = false;
    inputPicker.disabled = false;

    daysElement.textContent = '00';
    hoursElement.textContent = '00';
    minutesElement.textContent = '00';
    secondsElement.textContent = '00';
    iziToast.success({
      title: 'Success',
      message: 'Countdown timer has ended!',
      position: 'topCenter',
    });
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeDifference);

  daysElement.textContent = formatTime(days);
  hoursElement.textContent = formatTime(hours);
  minutesElement.textContent = formatTime(minutes);
  secondsElement.textContent = formatTime(seconds);
}

function startCountdown() {
  if (datetimePicker.selectedDates.length === 0) {
    iziToast.alert({
      title: 'Alert',
      message: 'Please select a valid date and time.',
      position: 'topCenter',
    });
    return;
  }

  countdownInterval = setInterval(updateTimer, 1000);
  updateTimer();
  startButton.disabled = true;
}

function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

startButton.addEventListener('click', startCountdown);
