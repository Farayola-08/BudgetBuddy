// ========== NOTIFICATIONS & TOASTS ==========

class NotificationManager {
    constructor() {
        this.notifications = this.loadNotifications();
        this.init();
    }

    // Load notifications from localStorage
    loadNotifications() {
        const stored = localStorage.getItem('budgetbuddy_notifications');
        return stored ? JSON.parse(stored) : [];
    }

    // Save notifications to localStorage
    saveNotifications() {
        localStorage.setItem('budgetbuddy_notifications', JSON.stringify(this.notifications));
    }

    // Add a notification
    addNotification(title, message, type = 'info') {
        const notification = {
            id: Date.now(),
            title,
            message,
            type,
            timestamp: new Date().toISOString(),
            read: false
        };
        this.notifications.push(notification);
        this.saveNotifications();
        this.updateBadge();
        return notification;
    }

    // Mark notification as read
    markAsRead(id) {
        const notif = this.notifications.find(n => n.id === id);
        if (notif) {
            notif.read = true;
            this.saveNotifications();
            this.updateBadge();
        }
    }

    // Get unread notifications
    getUnreadNotifications() {
        return this.notifications.filter(n => !n.read);
    }

    // Update notification badge
    updateBadge() {
        const badge = document.getElementById('notificationBadge');
        const unread = this.getUnreadNotifications().length;
        if (badge) {
            badge.textContent = unread;
            const bell = document.getElementById('notificationBell');
            if (unread > 0) {
                bell.classList.add('has-notifications');
            } else {
                bell.classList.remove('has-notifications');
            }
        }
    }

    // Display notifications in offcanvas
    displayNotifications() {
        const list = document.getElementById('notificationList');
        if (!list) return;

        const unread = this.getUnreadNotifications();
        if (unread.length === 0) {
            list.innerHTML = '<p class="text-center text-muted p-3">No new notifications</p>';
            return;
        }

        list.innerHTML = unread.map(notif => `
            <div class="notification-item" data-id="${notif.id}">
                <div class="notification-item-title">${notif.title}</div>
                <div class="notification-item-message">${notif.message}</div>
                <div class="notification-item-time">${this.formatTime(notif.timestamp)}</div>
            </div>
        `).join('');

        // Mark as read on click
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                this.markAsRead(id);
                this.displayNotifications();
            });
        });
    }

    // Format timestamp
    formatTime(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString();
    }

    // Initialize
    init() {
        // Update badge on load
        this.updateBadge();

        // Display notifications when offcanvas opens
        const offcanvas = document.getElementById('notificationOffcanvas');
        if (offcanvas) {
            offcanvas.addEventListener('show.bs.offcanvas', () => {
                this.displayNotifications();
            });
        }
    }
}

// Global notification manager
let notificationManager;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    notificationManager = new NotificationManager();
});

// ========== TOAST NOTIFICATIONS ==========

// Function to show toast notifications
function showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer') || createToastContainer();
    const toastId = `toast-${Date.now()}`;

    const toastHtml = `
        <div id="${toastId}" class="toast ${type}" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <span>${getToastIcon(type)}</span>
                <strong class="me-auto">${getToastTitle(type)}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">${message}</div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: duration });
    toast.show();

    // Remove from DOM after toast closes
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(container);
    return container;
}

// Get toast icon based on type
function getToastIcon(type) {
    const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    return icons[type] || icons['info'];
}

// Get toast title based on type
function getToastTitle(type) {
    const titles = {
        'success': 'Success!',
        'error': 'Error',
        'warning': 'Warning',
        'info': 'Info'
    };
    return titles[type] || titles['info'];
}

// ========== REMINDER MODAL NOTIFICATION ==========

// Show reminder modal
function showReminderModal(title, message, icon = '🔔') {
    const modalHtml = `
        <div class="modal fade" id="reminderModal" tabindex="-1" aria-labelledby="reminderModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body reminder-modal-body">
                        <div class="reminder-modal-icon">${icon}</div>
                        <div class="reminder-modal-message">${title}</div>
                        <div class="reminder-modal-subtext">${message}</div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Dismiss</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Got it! ✓</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if present
    const existing = document.getElementById('reminderModal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('reminderModal'));
    modal.show();

    // Clean up after modal closes
    document.getElementById('reminderModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('reminderModal').remove();
    });
}