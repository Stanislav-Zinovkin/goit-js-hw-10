import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const datetimePicker = document.querySelector('#datetime - picker');
flatpickr(datetimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
  },
});
const startButton = document.querySelector('[data-start]');
let userSelectedDate = null;

flatpickr(datetimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate < new Date()) {
      window.alert('Please choose a valid date!');
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
});
const timerFields = document.querySelector('.field .value');
let timerInterval = null;

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
  startButton.disabled = false;
  datetimePicker.disabled = false;
}
