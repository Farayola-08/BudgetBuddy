// Dashboard JavaScript with Enhanced Animations and Micro-interactions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard components
    animateBalance();
    initSpendingChart();
    animateProgressBars();
    animateChallengeProgress();
    setupButtonInteractions();
    setupCardAnimations();
    setupTransactionHovers();
    
    // Add smooth number updates
    setupCountUpAnimations();
});

// Smooth count-up animation for balance
function animateBalance() {
    const balanceElement = document.getElementById('balanceAmount');
    const targetAmount = 1247.50;
    let currentAmount = 0;
    const increment = targetAmount / 60;
    const duration = 2000;
    const stepTime = duration / 60;
    
    let startTime = Date.now();
    
    function updateBalance() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        currentAmount = targetAmount * easeOutQuart;
        
        balanceElement.textContent = `$${currentAmount.toFixed(2)}`;
        
        if (progress < 1) {
            requestAnimationFrame(updateBalance);
        } else {
            balanceElement.textContent = `$${targetAmount.toFixed(2)}`;
            balanceElement.classList.add('animate-count');
        }
    }
    
    updateBalance();
    
    // Animate progress ring
    setTimeout(() => {
        animateProgressRing();
    }, 300);
}

// Animate the budget health progress ring
function animateProgressRing() {
    const progressRing = document.querySelector('.progress-ring-progress');
    const healthPercentage = 75; // 75% budget health
    const circumference = 2 * Math.PI * 58;
    const offset = circumference - (healthPercentage / 100) * circumference;
    
    // Trigger animation
    progressRing.style.strokeDashoffset = offset;
}

// Initialize spending chart with animation
function initSpendingChart() {
    const ctx = document.getElementById('spendingChart').getContext('2d');
    
    // Chart data
    const chartData = {
        labels: ['Food & Dining', 'Transportation', 'Entertainment', 'Shopping', 'Bills'],
        datasets: [{
            data: [35, 20, 15, 20, 10],
            backgroundColor: [
                '#f59e0b',
                '#3b82f6',
                '#ef4444',
                '#8b5cf6',
                '#10b981'
            ],
            borderWidth: 0,
            cutout: '70%',
            borderRadius: 12,
        }]
    };
    
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            family: 'Poppins',
                            size: 12,
                            weight: 500
                        },
                        color: '#64748b',
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: label,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                hidden: false,
                                index: i,
                                pointStyle: 'circle'
                            }));
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    padding: 12,
                    titleFont: {
                        size: 13,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    boxPadding: 8
                }
            },
            animation: {
                animateRotate: true,
                animateScale: false,
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
    
    return chart;
}

// Animate progress bars for savings goals
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    // Use Intersection Observer to animate when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.getAttribute('data-progress');
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// Animate challenge progress ring
function animateChallengeProgress() {
    const challengeRing = document.querySelector('.challenge-progress-fill');
    if (!challengeRing) return;
    
    const percentage = 73;
    const circumference = 2 * Math.PI * 42;
    const offset = circumference - (percentage / 100) * circumference;
    
    setTimeout(() => {
        challengeRing.style.strokeDashoffset = offset;
    }, 800);
}

// Setup button interactions
function setupButtonInteractions() {
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const saveMoneyBtn = document.getElementById('saveMoneyBtn');
    const addGoalBtn = document.getElementById('addGoalBtn');
    
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', function(e) {
            rippleEffect(e, this);
            setTimeout(() => {
                alert('Add Expense feature coming soon!');
            }, 200);
        });
    }
    
    if (saveMoneyBtn) {
        saveMoneyBtn.addEventListener('click', function(e) {
            rippleEffect(e, this);
            setTimeout(() => {
                alert('Save Money feature coming soon!');
            }, 200);
        });
    }
    
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('Add Goal feature coming soon!');
        });
    }
}

// Ripple effect for buttons
function rippleEffect(e, element) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';
    
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// Setup card hover animations
function setupCardAnimations() {
    const cards = document.querySelectorAll('.dashboard-card, .balance-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle scale on hover (already in CSS)
        });
        
        // Add click feedback
        card.addEventListener('click', function(e) {
            if (e.target.tagName !== 'BUTTON' && e.target.closest('button') === null) {
                // Card was clicked (not a button)
                this.style.transform = 'translateY(-6px) scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
}

// Setup transaction hover animations
function setupTransactionHovers() {
    const transactions = document.querySelectorAll('.transaction-item');
    
    transactions.forEach((transaction, index) => {
        transaction.style.animationDelay = (index * 0.1) + 's';
        
        transaction.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.transaction-icon');
            if (icon) {
                icon.style.animation = 'bounce 0.6s ease-out';
            }
        });
    });
}

// Setup count-up animations for numbers in goals
function setupCountUpAnimations() {
    const goalAmounts = document.querySelectorAll('.goal-amount');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateGoalAmount(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    goalAmounts.forEach(amount => observer.observe(amount));
}

function animateGoalAmount(element) {
    const text = element.textContent;
    const matches = text.match(/\$(\d+)/g);
    
    if (!matches) return;
    
    const current = parseInt(matches[0].replace('$', ''));
    let displayValue = 0;
    const increment = current / 30;
    
    const timer = setInterval(() => {
        displayValue += increment;
        if (displayValue >= current) {
            displayValue = current;
            clearInterval(timer);
        }
        element.textContent = `$${Math.round(displayValue)} / $${text.split('/')[1].trim()}`;
    }, 30);
}

// Add ripple animation keyframe
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes bounce {
        0% { transform: scale(1) rotate(-5deg); }
        50% { transform: scale(1.15) rotate(5deg); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Add celebration animation for milestone goals
function celebrateGoalMilestone(goalElement) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.pointerEvents = 'none';
    // Add celebration effect
}

// Smooth scroll behavior for dashboard elements
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scroll to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
