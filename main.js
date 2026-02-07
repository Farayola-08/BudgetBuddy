// BudgetBuddy - main frontend interactions (vanilla JS)
// - Handles demo button clicks, contact form, mobile navbar behavior
// - Simple in-memory simulation for expenses and savings goals

(() => {
	'use strict';

	// Demo arrays (simulated storage)
	const expenses = [];
	let savingsGoal = { name: 'Emergency Fund', target: 200, saved: 40 };

	// Helpers
	const qs = (s) => document.querySelector(s);
	const qsa = (s) => Array.from(document.querySelectorAll(s));

	// Demo buttons - show small alerts (demo mode)
	function setupDemoButtons() {
		qsa('.demo-btn').forEach(btn => {
			btn.addEventListener('click', (e) => {
				const action = btn.dataset.action || 'demo';
				if (action === 'start') {
					alert('Demo: Redirect to onboarding (no backend in this demo).');
				} else if (action === 'learn') {
					const el = document.getElementById('features');
					if (el) el.scrollIntoView({ behavior: 'smooth' });
				} else {
					alert('This is a frontend demo for BudgetBuddy.');
				}
			});
		});
	}

	// Contact form
	function setupContactForm() {
		const form = qs('#contactForm');
		if (!form) return;
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const name = qs('#contactName').value || 'Friend';
			const email = qs('#contactEmail').value || 'email';
			// demo feedback
			alert(`Thanks ${name}! We'll review your message and reply to ${email} (demo).`);
			form.reset();
		});
	}

	// Close mobile navbar when a nav link is clicked
	function setupNavCloseOnClick() {
		qsa('.navbar-nav .nav-link').forEach(link => {
			link.addEventListener('click', () => {
				const bsCollapse = bootstrap.Collapse.getInstance(qs('#navMenu'));
				if (bsCollapse && window.innerWidth < 992) bsCollapse.hide();
			});
		});
	}

	// Simulate add expense and update UI if present
	function addExpense(description, amount) {
		const entry = { id: Date.now(), description, amount: Number(amount) };
		expenses.push(entry);
		updateExpenseUI();
		return entry;
	}

	function updateExpenseUI() {
		const list = qs('#expenseList');
		const totalEl = qs('#expenseTotal');
		if (!list) return; // not required for homepage demo
		list.innerHTML = '';
		const total = expenses.reduce((s, e) => s + e.amount, 0);
		expenses.forEach(e => {
			const li = document.createElement('div');
			li.className = 'd-flex justify-content-between py-2 border-bottom';
			li.innerHTML = `<div>${e.description}</div><div class="text-muted">$${e.amount.toFixed(2)}</div>`;
			list.appendChild(li);
		});
		if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
	}

	// Savings goal UI update
	function updateSavingsUI() {
		const bar = qs('#savingsProgress');
		const pct = Math.min(100, (savingsGoal.saved / Math.max(1, savingsGoal.target)) * 100);
		if (bar) {
			bar.style.width = pct + '%';
			bar.setAttribute('aria-valuenow', String(Math.round(pct)));
			bar.textContent = Math.round(pct) + '%';
		}
		const goalText = qs('#savingsGoalText');
		if (goalText) goalText.textContent = `${savingsGoal.name} — $${savingsGoal.saved}/${savingsGoal.target}`;
	}

	// Seed some demo data
	function seedDemoData() {
		addExpense('Coffee', 3.5);
		addExpense('Textbook (partial)', 25);
		savingsGoal = { name: 'Laptop Fund', target: 500, saved: 120 };
		updateSavingsUI();
	}

	// Initialize everything
	function init() {
		setupDemoButtons();
		setupContactForm();
		setupNavCloseOnClick();
		seedDemoData();
	}

	// DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

})();

