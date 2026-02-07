// ========== REMINDERS MANAGEMENT ==========

class ReminderManager {
    constructor() {
        this.reminders = this.loadReminders();
        this.initEventListeners();
    }

    // Load reminders from localStorage
    loadReminders() {
        const stored = localStorage.getItem('budgetbuddy_reminders');
        return stored ? JSON.parse(stored) : [];
    }

    // Save reminders to localStorage
    saveReminders() {
        localStorage.setItem('budgetbuddy_reminders', JSON.stringify(this.reminders));
    }

    // Add a new reminder
    addReminder(reminder) {
        reminder.id = Date.now();
        reminder.createdAt = new Date().toISOString();
        reminder.completed = false;
        this.reminders.push(reminder);
        this.saveReminders();
        return reminder;
    }

    // Delete a reminder
    deleteReminder(id) {
        this.reminders = this.reminders.filter(r => r.id !== id);
        this.saveReminders();
    }

    // Mark reminder as done
    markAsDone(id) {
        const reminder = this.reminders.find(r => r.id === id);
        if (reminder) {
            reminder.completed = true;
            reminder.completedAt = new Date().toISOString();
            this.saveReminders();
        }
    }

    // Get active reminders
    getActiveReminders() {
        return this.reminders.filter(r => !r.completed);
    }

    // Initialize event listeners
    initEventListeners() {
        // Custom reminder form
        const form = document.getElementById('customReminderForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleCustomReminderSubmit(e));
        }

        // Frequency selector to show/hide day select
        const frequencySelect = document.getElementById('reminderFrequency');
        if (frequencySelect) {
            frequencySelect.addEventListener('change', (e) => {
                const dayContainer = document.getElementById('reminderDayContainer');
                dayContainer.style.display = e.target.value === 'weekly' ? 'block' : 'none';
            });
        }

        // Preset reminder toggles
        const presetToggles = document.querySelectorAll('.preset-toggle');
        presetToggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.handlePresetToggle(e.target);
            });
        });

        // Load active reminders on page load
        this.displayActiveReminders();
    }

    // Handle custom reminder form submission
    handleCustomReminderSubmit(event) {
        event.preventDefault();

        const title = document.getElementById('reminderTitle').value.trim();
        const message = document.getElementById('reminderMessage').value.trim();
        const frequency = document.getElementById('reminderFrequency').value;
        const time = document.getElementById('reminderTime').value;
        const day = document.getElementById('reminderDay')?.value || null;

        if (!title || !message || !frequency || !time) {
            showNotification('Please fill in all fields', 'warning');
            return;
        }

        const reminder = {
            title,
            message,
            frequency,
            time,
            day,
            type: 'custom',
            enabled: true
        };

        this.addReminder(reminder);
        showNotification(`✅ Reminder "${title}" added!`, 'success');

        // Reset form
        event.target.reset();
        document.getElementById('reminderDayContainer').style.display = 'none';

        // Refresh display
        this.displayActiveReminders();
    }

    // Handle preset reminder toggle
    handlePresetToggle(toggle) {
        const type = toggle.dataset.type;
        const isChecked = toggle.checked;
        const timeInput = document.getElementById(`${type}Time`);
        const dayInput = document.getElementById(`${type}Day`);

        if (isChecked) {
            const time = timeInput?.value || '10:00';
            const day = dayInput?.value || null;

            const presetData = {
                'daily-expense': {
                    title: 'Daily Expense Logging',
                    message: '💸 "Hey 👋 have you tracked your spending today?"',
                    frequency: 'daily',
                    type: 'preset'
                },
                'weekly-budget': {
                    title: 'Weekly Budget Check-in',
                    message: '📊 "Just a quick check-in — how\'s your budget going?"',
                    frequency: 'weekly',
                    type: 'preset'
                },
                'monthly-savings': {
                    title: 'Monthly Savings Review',
                    message: '💙 "Small savings today = big goals tomorrow 💙"',
                    frequency: 'monthly',
                    type: 'preset'
                }
            };

            const preset = presetData[type];
            const reminder = {
                ...preset,
                time,
                day,
                enabled: true
            };

            this.addReminder(reminder);
            showNotification(`✅ ${preset.title} enabled!`, 'success');
        } else {
            // Find and remove the preset reminder
            const presetToRemove = this.reminders.find(r => 
                r.type === 'preset' && r.title.includes(
                    type.replace('-', ' ').split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')
                )
            );

            if (presetToRemove) {
                this.deleteReminder(presetToRemove.id);
                showNotification(`❌ Reminder disabled`, 'info');
            }
        }

        this.displayActiveReminders();
    }

    // Display active reminders
    displayActiveReminders() {
        const container = document.getElementById('activeRemindersList');
        const active = this.getActiveReminders();

        if (active.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No reminders set yet. Start by enabling a quick setup above! 🎯</p>';
            return;
        }

        container.innerHTML = active.map(reminder => this.createReminderCard(reminder)).join('');

        // Add event listeners to action buttons
        document.querySelectorAll('.btn-mark-done').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.markAsDone(id);
                showNotification('✅ Great job! Reminder marked as done!', 'success');
                this.displayActiveReminders();
            });
        });

        document.querySelectorAll('.btn-delete-reminder').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.deleteReminder(id);
                showNotification('🗑️ Reminder deleted', 'info');
                this.displayActiveReminders();
            });
        });
    }

    // Create reminder card HTML
    createReminderCard(reminder) {
        const frequencyEmoji = {
            'once': '⏰',
            'daily': '📅',
            'weekly': '🗓️',
            'monthly': '📆'
        };

        const dayName = reminder.day !== null ? 
            ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][reminder.day] : 
            '';

        return `
            <div class="reminder-item">
                <div class="reminder-item-header">
                    <h5 class="reminder-item-title">${reminder.title}</h5>
                    <span class="reminder-item-badge">${reminder.frequency}</span>
                </div>
                <div class="reminder-item-message">${reminder.message}</div>
                <div class="reminder-item-details">
                    <span><i class="bi bi-clock"></i> ${reminder.time}</span>
                    ${dayName ? `<span><i class="bi bi-calendar"></i> ${dayName}</span>` : ''}
                </div>
                <div class="reminder-item-actions">
                    <button class="btn-mark-done" data-id="${reminder.id}">✅ Mark Done</button>
                    <button class="btn-delete-reminder" data-id="${reminder.id}">🗑️ Delete</button>
                </div>
            </div>
        `;
    }
}

// Initialize Reminder Manager on page load
let reminderManager;
document.addEventListener('DOMContentLoaded', () => {
    reminderManager = new ReminderManager();
});