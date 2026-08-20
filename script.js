// DOM Elements
const screens = {
    landing: document.getElementById('landing-screen'),
    exam: document.getElementById('exam-screen'),
    results: document.getElementById('results-screen')
};

const startExamBtn = document.getElementById('start-exam-btn');
const studentNameInput = document.getElementById('student-name');
const studentRollInput = document.getElementById('student-roll');
const studentSectionInput = document.getElementById('student-section');
const studentMobileInput = document.getElementById('student-mobile');
const studentEmailInput = document.getElementById('student-email');
const roleSelect = document.getElementById('role-select');
const examTitle = document.getElementById('exam-title');
const roleTag = document.getElementById('role-tag');

const questionNumberDisplay = document.getElementById('question-number-display');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');

const paletteGrid = document.getElementById('palette-grid');

// Action Buttons
const prevBtn = document.getElementById('prev-btn');
const saveNextBtn = document.getElementById('save-next-btn');
const markReviewBtn = document.getElementById('mark-review-btn');
const clearResponseBtn = document.getElementById('clear-response-btn');

const topSubmitBtn = document.getElementById('top-submit-btn');
const bottomSubmitBtn = document.getElementById('bottom-submit-btn');
const restartBtn = document.getElementById('restart-btn');
const downloadReportBtn = document.getElementById('download-report-btn');

// Legend Counters
const countAnswered = document.getElementById('count-answered');
const countNotAnswered = document.getElementById('count-not-answered');
const countMarked = document.getElementById('count-marked');
const countNotVisited = document.getElementById('count-not-visited');

// Timer
const timeDisplay = document.getElementById('time-display');

// State
let currentRole = '';
let currentRoleName = '';
let questions = []; // Loaded from window.questionBank
let questionStates = []; // Array of { answer: index/null, status: 'not-visited' | 'not-answered' | 'answered' | 'marked' }
let currentIndex = 0;
let timerInterval = null;
let timeLeft = 60 * 60; // 60 minutes in seconds

let studentData = {};

// Anti-cheating variables
let warningCount = 0;
const MAX_WARNINGS = 3;
let isExamActive = false;

// Initialization
function init() {
    document.getElementById('student-form').addEventListener('submit', handleStartExam);

    saveNextBtn.addEventListener('click', handleSaveAndNext);
    prevBtn.addEventListener('click', handlePrevious);
    markReviewBtn.addEventListener('click', handleMarkReview);
    clearResponseBtn.addEventListener('click', handleClearResponse);
    
    topSubmitBtn.addEventListener('click', submitTest);
    bottomSubmitBtn.addEventListener('click', submitTest);
    restartBtn.addEventListener('click', resetExam);
    downloadReportBtn.addEventListener('click', downloadReport);
}

// Handle Form Submission
function handleStartExam(e) {
    e.preventDefault();
    const name = studentNameInput.value.trim();
    const roll = studentRollInput.value.trim();
    const section = studentSectionInput.value.trim();
    const mobile = studentMobileInput.value.trim();
    const email = studentEmailInput.value.trim();
    const roleKey = roleSelect.value;
    
    if (!name || !roll || !section || !mobile || !email || !roleKey) {
        alert("Please fill in all details and select a role.");
        return;
    }
    
    studentData = { name, roll, section, mobile, email };
    const roleName = roleSelect.options[roleSelect.selectedIndex].text;
    startExam(roleKey, roleName);
}

// Start Exam
function startExam(roleKey, roleName) {
    if (!window.questionBank || !window.questionBank[roleKey]) {
        alert("Questions for this role are not loaded yet.");
        return;
    }
    
    // Attempt to go fullscreen for anti-cheating
    enterFullscreen();
    
    // Enable anti-cheating listeners
    isExamActive = true;
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    currentRoleKey = roleKey;
    currentRoleName = roleName;
    questions = window.questionBank[roleKey];
    
    // Initialize states
    questionStates = questions.map(() => ({
        answer: null,
        status: 'not-visited'
    }));

    currentIndex = 0;
    examTitle.textContent = `${roleName} Examination`;
    roleTag.textContent = roleName;

    buildPalette();
    startTimer();
    
    showScreen('exam');
    loadQuestion(0);
}

// Build Palette Grid
function buildPalette() {
    paletteGrid.innerHTML = '';
    questions.forEach((_, index) => {
        const btn = document.createElement('button');
        btn.className = 'grid-btn not-visited';
        btn.textContent = index + 1;
        btn.addEventListener('click', () => {
            // Before jumping, evaluate the status of the current question if it was just visited and not marked
            evaluateCurrentQuestionStatus();
            loadQuestion(index);
        });
        paletteGrid.appendChild(btn);
    });
    updateLegendCounts();
}

function evaluateCurrentQuestionStatus() {
    const state = questionStates[currentIndex];
    // If it's marked, we leave it as marked.
    if (state.status === 'marked') return;
    
    // Otherwise, if answered or not answered
    if (state.answer !== null) {
        state.status = 'answered';
    } else {
        state.status = 'not-answered';
    }
}

// Load Question
function loadQuestion(index) {
    currentIndex = index;
    const question = questions[currentIndex];
    const state = questionStates[currentIndex];
    
    // If we visit a not-visited question, it immediately becomes not-answered internally until we leave
    if (state.status === 'not-visited') {
        state.status = 'not-answered';
    }

    // UI Updates
    questionNumberDisplay.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
    questionText.textContent = question.q;
    
    optionsContainer.innerHTML = '';
    question.options.forEach((opt, optIndex) => {
        const row = document.createElement('label');
        row.className = 'option-row';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'question_option';
        radio.value = optIndex;
        if (state.answer === optIndex) {
            radio.checked = true;
        }
        
        radio.addEventListener('change', () => {
            questionStates[currentIndex].answer = optIndex;
        });

        const span = document.createElement('span');
        span.className = 'option-label';
        span.textContent = opt;

        row.appendChild(radio);
        row.appendChild(span);
        optionsContainer.appendChild(row);
    });

    updatePaletteUI();
    
    // Button states
    prevBtn.disabled = currentIndex === 0;
    if (currentIndex === questions.length - 1) {
        saveNextBtn.textContent = 'Save';
    } else {
        saveNextBtn.textContent = 'Save & Next →';
    }
}

// Action Handlers
function handleSaveAndNext() {
    const state = questionStates[currentIndex];
    // Force status update based on answer presence
    if (state.answer !== null) {
        state.status = 'answered';
    } else {
        state.status = 'not-answered';
    }
    
    if (currentIndex < questions.length - 1) {
        loadQuestion(currentIndex + 1);
    } else {
        updatePaletteUI();
    }
}

function handlePrevious() {
    evaluateCurrentQuestionStatus();
    if (currentIndex > 0) {
        loadQuestion(currentIndex - 1);
    }
}

function handleMarkReview() {
    const state = questionStates[currentIndex];
    // Toggle marked state
    if (state.status === 'marked') {
        state.status = state.answer !== null ? 'answered' : 'not-answered';
    } else {
        state.status = 'marked';
    }
    updatePaletteUI();
}

function handleClearResponse() {
    questionStates[currentIndex].answer = null;
    const radios = document.querySelectorAll('input[name="question_option"]');
    radios.forEach(r => r.checked = false);
}

// Update Palette UI & Legend
function updatePaletteUI() {
    const buttons = paletteGrid.querySelectorAll('.grid-btn');
    
    let answered = 0, notAnswered = 0, marked = 0, notVisited = 0;

    questionStates.forEach((state, idx) => {
        const btn = buttons[idx];
        btn.className = 'grid-btn'; // reset
        
        btn.classList.add(state.status);
        
        if (idx === currentIndex) {
            btn.classList.add('current');
        }

        if (state.status === 'answered') answered++;
        else if (state.status === 'not-answered') notAnswered++;
        else if (state.status === 'marked') marked++;
        else if (state.status === 'not-visited') notVisited++;
    });

    countAnswered.textContent = answered;
    countNotAnswered.textContent = notAnswered;
    countMarked.textContent = marked;
    countNotVisited.textContent = notVisited;
}
function updateLegendCounts() {
    // Initial call
    countAnswered.textContent = 0;
    countNotAnswered.textContent = 0;
    countMarked.textContent = 0;
    countNotVisited.textContent = questions.length;
}

// Timer Logic
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 60 * 60; // reset
    updateTimeDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimeDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitTest();
        }
    }, 1000);
}

function updateTimeDisplay() {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    timeDisplay.textContent = `${m}:${s}`;
}

// Submit Test
async function submitTest() {
    isExamActive = false;
    clearInterval(timerInterval);
    evaluateCurrentQuestionStatus();
    updatePaletteUI();
    
    // Calculate Score
    let score = 0;
    questionStates.forEach((state, idx) => {
        if (state.answer === questions[idx].a) {
            score++;
        }
    });

    const percentage = (score / questions.length) * 100;
    
    // Disable submit buttons and show loading text
    topSubmitBtn.textContent = "Submitting...";
    bottomSubmitBtn.textContent = "Submitting...";
    topSubmitBtn.disabled = true;
    bottomSubmitBtn.disabled = true;
    
    // Send data to Google Sheets
    // IMPORTANT: Replace the URL below with the Web App URL you get from Google Apps Script
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwK_ZQpjJQLcetdUUht5MKpwSBRbCjcYRHHZNhIDBLInIoGaocXC-jCjA4ZkCihIJMD/exec';
    
    // We send the data using text/plain to avoid complex CORS preflight issues with Google Scripts
    if (GOOGLE_SHEET_URL !== 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE') {
        fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify({
                name: studentData.name,
                roll: studentData.roll,
                section: studentData.section,
                mobile: studentData.mobile,
                email: studentData.email,
                role: currentRoleName,
                score: score,
                percentage: percentage.toFixed(2)
            })
        }).catch(err => console.error("Failed to save to Google Sheets:", err));
    } else {
        console.warn("Google Sheet URL not set. Data not saved.");
    }

    document.getElementById('final-score').textContent = score;
    const msg = document.getElementById('result-message');
    
    let feedback = "";
    if (percentage >= 90) feedback = "Outstanding! You are a perfect fit for our team.";
    else if (percentage >= 70) feedback = "Great job! Your skills are impressive.";
    else if (percentage >= 50) feedback = "Good effort! We will review your application.";
    else feedback = "Thank you for participating. Keep honing your skills!";
    
    msg.innerHTML = `<strong>Name:</strong> ${studentData.name} <br>
                     <strong>Roll No:</strong> ${studentData.roll} | <strong>Section:</strong> ${studentData.section} <br><br>
                     ${feedback}`;
    
    // Remove anti-cheating listeners
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
    document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
    document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    
    // Exit fullscreen if possible
    const doc = document;
    if (doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement) {
        if (doc.exitFullscreen) {
            doc.exitFullscreen().catch(err => console.log(err));
        } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
            doc.msExitFullscreen();
        }
    }
    
    showScreen('results');
}

// Anti-Cheating Logic
function issueWarning(reason) {
    if (!isExamActive) return;
    
    warningCount++;
    if (warningCount > MAX_WARNINGS) {
        alert("Anti-Cheating Violation: You have violated the rules too many times. Your exam will now be automatically submitted.");
        submitTest();
    } else {
        alert(`WARNING (${warningCount}/${MAX_WARNINGS}): ${reason}. Doing this again may result in auto-submission.`);
        enterFullscreen(); // Force back to fullscreen
    }
}

function handleVisibilityChange() {
    if (document.hidden && isExamActive) {
        issueWarning("Please do not switch tabs or leave the exam window");
    }
}

function handleFullscreenChange() {
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement && isExamActive) {
        issueWarning("You exited fullscreen mode (ESC). You must remain in fullscreen during the exam");
    }
}

function enterFullscreen() {
    const elem = document.documentElement;
    const requestFs = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.msRequestFullscreen;
    
    if (requestFs) {
        requestFs.call(elem).then(() => {
            // Try to lock the ESC key so they cannot exit fullscreen
            if (navigator.keyboard && navigator.keyboard.lock) {
                navigator.keyboard.lock(['Escape']).catch(e => console.log("Keyboard lock failed:", e));
            }
        }).catch(err => console.log(err));
    }
}

function resetExam() {
    showScreen('landing');
}

function downloadReport() {
    const scoreText = document.getElementById('final-score').textContent;
    const percentage = (parseInt(scoreText) / questions.length) * 100;
    
    let reportContent = `SOCIAL MEDIA DEPARTMENT - RECRUITMENT EXAMINATION REPORT\n`;
    reportContent += `==========================================================\n\n`;
    reportContent += `Candidate Name : ${studentData.name}\n`;
    reportContent += `Roll No.       : ${studentData.roll}\n`;
    reportContent += `Section        : ${studentData.section}\n`;
    reportContent += `Mobile         : ${studentData.mobile}\n`;
    reportContent += `Email          : ${studentData.email}\n`;
    reportContent += `Role Applied   : ${currentRoleName}\n\n`;
    reportContent += `----------------------------------------------------------\n`;
    reportContent += `Score          : ${scoreText} out of ${questions.length}\n`;
    reportContent += `Percentage     : ${percentage.toFixed(2)}%\n`;
    reportContent += `----------------------------------------------------------\n\n`;
    reportContent += `Detailed Question Analysis:\n\n`;

    questionStates.forEach((state, idx) => {
        reportContent += `Q${idx + 1}: ${questions[idx].q}\n`;
        if (state.answer !== null) {
            const isCorrect = state.answer === questions[idx].a;
            reportContent += `Your Answer: ${questions[idx].options[state.answer]}\n`;
            reportContent += `Result: ${isCorrect ? 'Correct' : 'Incorrect'} (Correct Answer: ${questions[idx].options[questions[idx].a]})\n`;
        } else {
            reportContent += `Result: Not Answered (Correct Answer: ${questions[idx].options[questions[idx].a]})\n`;
        }
        reportContent += `\n`;
    });

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${studentData.name.replace(/\s+/g, '_')}_Exam_Report.txt`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Screen management
function showScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenId].classList.add('active');
}

document.addEventListener('DOMContentLoaded', init);
