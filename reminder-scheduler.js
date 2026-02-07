// ========== REMINDER SCHEDULER ==========

class ReminderScheduler {
    constructor() {
        this.checkInterval = 60000; // Check every minute
        this.lastCheck = {};
        this.start();
    }

    // Start the scheduler
    start() {
        this.checkReminders();
        setInterval(() => this.checkReminders(), this.checkInterval);
        console.log('🔔 Reminder Scheduler started');
    }

    // Check if reminders should trigger
    checkReminders() {
        if (!reminderManager || !reminderManager.reminders) return;

        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const currentDay = now.getDay();

        reminderManager.reminders.forEach(reminder => {
            // Skip if already completed or disabled
            if (reminder.completed || !reminder.enabled) return;

            const shouldTrigger = this.shouldTriggerReminder(reminder, currentTime, currentDay);

            if (shouldTrigger) {
                this.triggerReminder(reminder);
                this.updateLastCheck(reminder.id);
            }
        });
    }

    // Determine if reminder should trigger
    shouldTriggerReminder(reminder, currentTime, currentDay) {
        const key = reminder.id;

        if (!reminder.time || reminder.time !== currentTime) return false;

        if (reminder.frequency === 'daily') {
            return !this.wasTriggeredToday(key);
        } else if (reminder.frequency === 'weekly') {
            return reminder.day === currentDay && !this.wasTriggeredThisWeek(key);
        } else if (reminder.frequency === 'monthly') {
            const today = new Date().getDate();
            return today === 1 && !this.wasTriggeredThisMonth(key);
        } else if (reminder.frequency === 'once') {
            return !this.lastCheck[key];
        }

        return false;
    }

    // Check if reminder was triggered today
    wasTriggeredToday(key) {
        const lastTrigger = this.lastCheck[key];
        if (!lastTrigger) return false;

        const lastTriggerDate = new Date(lastTrigger);
        const today = new Date();

        return lastTriggerDate.toDateString() === today.toDateString();
    }

    // Check if reminder was triggered this week
    wasTriggeredThisWeek(key) {
        const lastTrigger = this.lastCheck[key];
        if (!lastTrigger) return false;

        const lastTriggerDate = new Date(lastTrigger);
        const today = new Date();

        const daysAgo = Math.floor((today - lastTriggerDate) / (1000 * 60 * 60 * 24));
        return daysAgo < 7;
    }

    // Check if reminder was triggered this month
    wasTriggeredThisMonth(key) {
        const lastTrigger = this.lastCheck[key];
        if (!lastTrigger) return false;

        const lastTriggerDate = new Date(lastTrigger);
        const today = new Date();

        return lastTriggerDate.getMonth() === today.getMonth() && 
               lastTriggerDate.getFullYear() === today.getFullYear();
    }

    // Update last check timestamp
    updateLastCheck(key) {
        this.lastCheck[key] = new Date().toISOString();
    }

    // Trigger reminder
    triggerReminder(reminder) {
        console.log('🔔 Reminder triggered:', reminder.title);

        // Show toast notification
        showNotification(`⏰ ${reminder.message}`, 'info', 5000);

        // Add to notification panel
        if (notificationManager) {
            notificationManager.addNotification(
                `🔔 ${reminder.title}`,
                reminder.message,
                'info'
            );
        }

        // Show modal for important reminders
        if (reminder.type === 'preset') {
            const icon = this.getReminderIcon(reminder.title);
            showReminderModal(reminder.title, reminder.message, icon);
        }

        // Play sound (optional)
        this.playNotificationSound();
    }

    // Get icon for reminder type
    getReminderIcon(title) {
        if (title.includes('Expense')) return '💸';
        if (title.includes('Budget')) return '📊';
        if (title.includes('Savings')) return '💙';
        return '🔔';
    }

    // Play notification sound
    playNotificationSound() {
        // Create a simple beep using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

// Initialize Reminder Scheduler on page load
let reminderScheduler;
document.addEventListener('DOMContentLoaded', () => {
    // Wait a moment to ensure other managers are initialized
    setTimeout(() => {
        reminderScheduler = new ReminderScheduler();
    }, 500);
});