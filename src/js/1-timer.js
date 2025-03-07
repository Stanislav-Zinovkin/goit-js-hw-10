import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.querySelector('#datetime-picker');
let userSelectedDate = null;
const startButton = document.querySelector('[data-start]');
const timerFields = document.querySelectorAll('.field .value');
let timerInterval = null;

flatpickr(datetimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate < new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a valid date!',
        position: 'topCenter',
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
});

startButton.addEventListener('click', () => {
  if (userSelectedDate) {
    startButton.disabled = true;
    datetimePicker.disabled = true;

    timerInterval = setInterval(() => {
      const currentTime = new Date();
      const remainingTime = userSelectedDate - currentTime;

      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        updateTimer(0, 0, 0, 0);
        enableControls();
        showCompletionMessage();
        return;
      }

      const { days, hours, minutes, seconds } = convertMs(remainingTime);
      updateTimer(days, hours, minutes, seconds);
    }, 1000);
  }
});

function updateTimer(days, hours, minutes, seconds) {
  timerFields[0].textContent = addLeadingZero(days);
  timerFields[1].textContent = addLeadingZero(hours);
  timerFields[2].textContent = addLeadingZero(minutes);
  timerFields[3].textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function enableControls() {
  startButton.disabled = true;
  datetimePicker.disabled = false;
}

function showCompletionMessage() {
  iziToast.success({
    title: 'Completed',
    message: 'The timer has finished!',
    position: 'topCenter',
  });
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
