// State object to hold the timer's current status
const state = {
    timerId: null as number | null,
    timeRemaining: 25 * 60, // in seconds
    isPaused: true,
    mode: 'pomodoro' as 'pomodoro' | 'shortBreak' | 'longBreak',
};

// Constants for timer durations in seconds
const DURATION = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

// Constants for button text
const TEXT = {
    start: 'スタート',
    pause: '一時停止',
};

// DOM Elements
const minutesEl = document.getElementById('minutes') as HTMLSpanElement;
const secondsEl = document.getElementById('seconds') as HTMLSpanElement;
const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;
const modeButtons = document.querySelectorAll('.mode-btn');
const app = document.getElementById('app');

// --- Functions ---

/**
 * Updates the timer display in the DOM and the page title.
 */
function updateTimerDisplay() {
    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = state.timeRemaining % 60;
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
    document.title = `${minutesEl.textContent}:${secondsEl.textContent} - ポモドーロタイマー`;
}

/**
 * Stops the active setInterval timer.
 */
function stopTimer() {
    if (state.timerId) {
        clearInterval(state.timerId);
        state.timerId = null;
    }
}

/**
 * The main countdown function, executed every second by setInterval.
 */
function countdown() {
    if (state.timeRemaining > 0) {
        state.timeRemaining--;
        updateTimerDisplay();
    } else {
        stopTimer();
        state.isPaused = true;
        startBtn.textContent = TEXT.start;
        // タイマー終了時のサウンドはなし（ユーザー希望）
        app?.classList.add('timer-ended');
        setTimeout(() => app?.classList.remove('timer-ended'), 400);
    }
}

/**
 * Toggles the timer between starting and pausing.
 */
function toggleTimer() {
    state.isPaused = !state.isPaused;
    if (!state.isPaused) {
        // Start the timer
        startBtn.textContent = TEXT.pause;
        if (!state.timerId) {
            state.timerId = setInterval(countdown, 1000);
        }
    } else {
        // Pause the timer
        startBtn.textContent = TEXT.start;
        stopTimer();
    }
}

/**
 * Resets the timer to the current mode's default time.
 */
function resetTimer() {
    stopTimer();
    state.isPaused = true;
    startBtn.textContent = TEXT.start;
    state.timeRemaining = DURATION[state.mode];
    updateTimerDisplay();
}

/**
 * Switches the timer to a new mode (Pomodoro, Short Break, or Long Break).
 * @param newMode - The mode to switch to.
 */
function switchMode(newMode: 'pomodoro' | 'shortBreak' | 'longBreak') {
    state.mode = newMode;

    // Update body class for background color
    document.body.className = '';
    if (newMode === 'shortBreak') {
        document.body.classList.add('short-break');
    } else if (newMode === 'longBreak') {
        document.body.classList.add('long-break');
    }

    // Update active button style
    modeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-mode') === newMode) {
            btn.classList.add('active');
        }
    });

    resetTimer();
}


// --- Event Listeners ---

startBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);

modeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const target = event.currentTarget as HTMLButtonElement;
        const mode = target.dataset.mode;
        if (mode === 'pomodoro' || mode === 'shortBreak' || mode === 'longBreak') {
            switchMode(mode);
        }
    });
});

// --- Initialisation ---

/**
 * Initializes the application.
 */
function init() {
    switchMode('pomodoro');
}

document.addEventListener('DOMContentLoaded', init);
