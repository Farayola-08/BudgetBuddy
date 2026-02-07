// auth.js — simple frontend-only auth handlers for BudgetBuddy
// Stores users in localStorage under 'budgetBuddy_users' (array of {name,email,password})

function getUsers(){
  try{ return JSON.parse(localStorage.getItem('budgetBuddy_users')||'[]'); }
  catch(e){ return []; }
}

function saveUsers(users){ localStorage.setItem('budgetBuddy_users', JSON.stringify(users)); }

function showError(id, message){
  const el = document.getElementById(id);
  if(!el) return;
  if(message){ el.innerText = message; el.classList.add('show-error'); }
  else { el.innerText=''; el.classList.remove('show-error'); }
}

// SIGNUP
const signupForm = document.getElementById('signupForm');
if(signupForm){
  signupForm.addEventListener('submit', function(e){
    e.preventDefault();
    // gather
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const pwd = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    const agreed = document.getElementById('agreeTerms').checked;

    // reset errors
    showError('fullNameErr',''); showError('signupEmailErr',''); showError('signupPasswordErr',''); showError('confirmPasswordErr',''); showError('agreeErr','');

    let ok = true;
    if(!name){ showError('fullNameErr','Enter your full name.'); ok=false; }
    if(!email || !email.includes('@')){ showError('signupEmailErr','Enter a valid email.'); ok=false; }
    if(!pwd || pwd.length < 6){ showError('signupPasswordErr','Password must be at least 6 characters.'); ok=false; }
    if(pwd !== confirm){ showError('confirmPasswordErr','Passwords do not match.'); ok=false; }
    if(!agreed){ showError('agreeErr','You must agree to continue.'); ok=false; }
    if(!ok) return;

    const users = getUsers();
    if(users.find(u=>u.email === email)){
      showError('signupEmailErr','An account with this email already exists.');
      return;
    }

    users.push({ name, email, password: pwd });
    saveUsers(users);

    alert('Account created successfully');
    window.location.href = '/dashboard.html';
  });
}

// LOGIN
const loginForm = document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pwd = document.getElementById('loginPassword').value;

    showError('loginEmailErr',''); showError('loginPasswordErr','');

    let ok = true;
    if(!email){ showError('loginEmailErr','Please enter your email.'); ok=false; }
    if(!pwd){ showError('loginPasswordErr','Please enter your password.'); ok=false; }
    if(!ok) return;

    const users = getUsers();
    const user = users.find(u=>u.email === email && u.password === pwd);
    if(!user){
      alert('Invalid email or password.');
      return;
    }

    // demo: remember me not implemented beyond visual
    alert('Login successful');
    window.location.href = '/dashboard.html';
  });
}
