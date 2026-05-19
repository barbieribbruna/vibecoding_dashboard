// Script para login falso, dinamizar relógio, data de hoje, Pomodoro, gráfico e dados falsos do dashboard

// Função de login falso (simula o OAuth)
function handleFakeLogin() {
    const overlay = document.getElementById('login-overlay');

    if (overlay) {
        overlay.classList.add('hidden');
    }

    applyMockData();
}

// Variável global para o gráfico Chart.js
let emailChart = null;

// Dados 100% falsos/mockados. Não há conexão com Gmail, Google Agenda ou qualquer API externa.
const mockDashboardData = {
    gmail: {
        unreadCount: 14,
        readingTimeText: '~14 min de leitura',
        description: '4 mensagens fictícias marcadas como importantes ou urgentes.'
    },
    weeklyEmails: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        data: [12, 5, 8, 20, 3, 15, 9]
    },
    tasks: {
        pendingCount: 8,
        description: '3 tarefas fictícias com prazo para expirar hoje.'
    },
    calendar: [
        { title: 'Planejamento da semana', time: '09:30', duration: 30 },
        { title: 'Daily', time: '11:00', duration: 45 },
        { title: 'Bloco de estudos', time: '14:00', duration: 60 },
        { title: 'Revisão de tarefas', time: '16:00', duration: 30 }
    ]
};

function updateClock() {
    const timeDisplay = document.querySelector('.time-display');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    if (timeDisplay) {
        timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

function updateDate() {
    const dateSpan = document.querySelector('.welcome-date');

    if (dateSpan) {
        const now = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        let formattedDate = now.toLocaleDateString('pt-BR', options);
        formattedDate = formattedDate.toLowerCase();
        dateSpan.textContent = formattedDate;
    }
}

function updateGreeting() {
    const greetingTextSpan = document.getElementById('greeting-text');
    const greetingEmojiSpan = document.getElementById('greeting-emoji');

    if (greetingTextSpan && greetingEmojiSpan) {
        const now = new Date();
        const hours = now.getHours();
        let greeting = 'Bom dia';
        let emoji = '☀️';

        if (hours >= 12 && hours < 18) {
            greeting = 'Boa tarde';
            emoji = '⛅';
        } else if (hours >= 18 || hours < 5) {
            greeting = 'Boa noite';
            emoji = '🌙';
        }

        greetingTextSpan.textContent = greeting + ',';
        greetingEmojiSpan.textContent = emoji;
    }
}

// Pomodoro Timer Controller
let pomoInterval = null;
let pomoTimeLeft = 3000; // 50 minutos em segundos
let pomoMode = 'focus'; // 'focus' ou 'break'
let pomoIsRunning = false;

function renderPlayIcon() {
    return `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pomo-play-icon" id="pomo-play-icon">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
            `;
}

function renderPauseIcon() {
    return `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pomo-play-icon" id="pomo-play-icon">
                    <line x1="18" y1="4" x2="18" y2="20"></line>
                    <line x1="6" y1="4" x2="6" y2="20"></line>
                </svg>
            `;
}

function setPomodoroIcon(iconSvg) {
    const playIcon = document.getElementById('pomo-play-icon');

    if (playIcon) {
        playIcon.outerHTML = iconSvg;
    }
}

function updatePomoDisplay() {
    const display = document.getElementById('pomo-display');

    if (display) {
        const minutes = Math.floor(pomoTimeLeft / 60);
        const seconds = pomoTimeLeft % 60;
        display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

function togglePomodoro() {
    if (pomoIsRunning) {
        clearInterval(pomoInterval);
        pomoIsRunning = false;
        setPomodoroIcon(renderPlayIcon());
        return;
    }

    pomoIsRunning = true;
    setPomodoroIcon(renderPauseIcon());

    pomoInterval = setInterval(() => {
        if (pomoTimeLeft > 0) {
            pomoTimeLeft--;
            updatePomoDisplay();
            return;
        }

        clearInterval(pomoInterval);
        pomoIsRunning = false;
        setPomodoroIcon(renderPlayIcon());

        if (pomoMode === 'focus') {
            alert('Hora da pausa! Descanse 10 minutos.');
            setMode('break');
        } else {
            alert('Fim da pausa! Hora de focar.');
            setMode('focus');
        }
    }, 1000);
}

function resetPomodoro() {
    clearInterval(pomoInterval);
    pomoIsRunning = false;
    pomoTimeLeft = pomoMode === 'focus' ? 3000 : 600;
    updatePomoDisplay();
    setPomodoroIcon(renderPlayIcon());
}

function setMode(mode) {
    clearInterval(pomoInterval);
    pomoIsRunning = false;
    pomoMode = mode;
    pomoTimeLeft = mode === 'focus' ? 3000 : 600;

    const modeFocus = document.getElementById('mode-focus');
    const modeBreak = document.getElementById('mode-break');

    if (modeFocus) modeFocus.classList.toggle('active', mode === 'focus');
    if (modeBreak) modeBreak.classList.toggle('active', mode === 'break');

    updatePomoDisplay();
    setPomodoroIcon(renderPlayIcon());
}

function applyMockData() {
    updateGmailCard(mockDashboardData.gmail);
    updateTasksCard(mockDashboardData.tasks);
    updateCalendarSection(mockDashboardData.calendar);
    updateWeeklyChart(mockDashboardData.weeklyEmails);
}

function updateGmailCard(gmailData) {
    const valSpan = document.querySelector('.email-card .card-value');
    const highlightSpan = document.querySelector('.email-card .meta-highlight');
    const descSpan = document.querySelector('.email-card .card-desc');

    if (valSpan) valSpan.textContent = gmailData.unreadCount;
    if (highlightSpan) highlightSpan.textContent = gmailData.readingTimeText;
    if (descSpan) descSpan.textContent = gmailData.description;
}

function updateTasksCard(tasksData) {
    const valSpan = document.querySelector('.tasks-card .card-value');
    const descSpan = document.querySelector('.tasks-card .card-desc');

    if (valSpan) valSpan.textContent = tasksData.pendingCount;
    if (descSpan) descSpan.textContent = tasksData.description;
}

function updateWeeklyChart(volume) {
    if (emailChart) {
        emailChart.data.labels = volume.labels;
        emailChart.data.datasets[0].data = volume.data;
        emailChart.update();
    }
}

function updateCalendarSection(events) {
    const countSpan = document.querySelector('.calendar-card .card-value');
    const highlightSpan = document.querySelector('.calendar-card .meta-highlight');
    const descSpan = document.querySelector('.calendar-card .card-desc');
    const listContainer = document.querySelector('.agenda-list');
    const subtitleSpan = document.querySelector('.agenda-subtitle');

    if (countSpan) countSpan.textContent = events.length;

    const totalMinutes = events.reduce((sum, event) => sum + event.duration, 0);
    if (highlightSpan) {
        const hrs = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        highlightSpan.textContent = mins > 0 ? `${hrs}h${mins} em compromissos` : `${hrs}h em compromissos`;
    }

    if (descSpan) {
        const nextEvent = events[0];
        descSpan.textContent = nextEvent
            ? `Próximo às ${nextEvent.time}: ${nextEvent.title}`
            : 'Nenhum compromisso fictício programado.';
    }

    if (subtitleSpan) {
        subtitleSpan.textContent = `${events.length} compromisso(s) fictício(s) programado(s)`;
    }

    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (events.length === 0) {
        listContainer.innerHTML = `
                    <div class="agenda-empty-state">
                        <p>Nenhum compromisso fictício para hoje.</p>
                    </div>
                `;
        return;
    }

    events.forEach(event => {
        const durationText = event.duration > 0 ? `${event.duration} min` : 'Dia todo';
        const itemHtml = `
                    <div class="agenda-item">
                        <div class="agenda-item-left">
                            <div class="event-icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="event-icon">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            </div>
                            <div class="event-info">
                                <h4 class="event-title">${event.title}</h4>
                                <span class="event-duration">${durationText}</span>
                            </div>
                        </div>
                        <div class="agenda-item-right">
                            <span class="event-time">${event.time}</span>
                        </div>
                    </div>
                `;

        listContainer.insertAdjacentHTML('beforeend', itemHtml);
    });
}

// Inicializações ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    updateDate();
    updateGreeting();
    setInterval(updateClock, 1000);
    updatePomoDisplay();

    // Configuração do Gráfico de Emails (Chart.js)
    const ctx = document.getElementById('emailChart').getContext('2d');
    const purpleGradient = ctx.createLinearGradient(0, 0, 0, 200);
    purpleGradient.addColorStop(0, 'rgba(168, 85, 247, 0.85)');
    purpleGradient.addColorStop(1, 'rgba(126, 34, 206, 0.15)');

    const hoverGradient = ctx.createLinearGradient(0, 0, 0, 200);
    hoverGradient.addColorStop(0, 'rgba(192, 132, 252, 0.95)');
    hoverGradient.addColorStop(1, 'rgba(147, 51, 234, 0.35)');

    emailChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: mockDashboardData.weeklyEmails.labels,
            datasets: [{
                label: 'Volume de Emails',
                data: mockDashboardData.weeklyEmails.data,
                backgroundColor: purpleGradient,
                hoverBackgroundColor: hoverGradient,
                borderColor: '#a855f7',
                borderWidth: 1.5,
                borderRadius: 6,
                borderSkipped: false,
                barPercentage: 0.5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#110d24',
                    titleColor: '#f8fafc',
                    bodyColor: '#cbd5e1',
                    borderColor: 'rgba(168, 85, 247, 0.25)',
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false,
                    font: {
                        family: 'Plus Jakarta Sans'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            family: 'Plus Jakarta Sans',
                            size: 11,
                            weight: '500'
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.04)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            family: 'Plus Jakarta Sans',
                            size: 11
                        },
                        stepSize: 5
                    }
                }
            }
        }
    });

    applyMockData();
});