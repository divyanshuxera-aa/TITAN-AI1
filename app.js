import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

const dialog = document.getElementById('auth-dialog');
const statusBox = document.getElementById('auth-status');
const toast = document.getElementById('toast');
let authMode = 'login';
let auth = null;
const configReady = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('PASTE_') && firebaseConfig.projectId && firebaseConfig.projectId !== 'YOUR_PROJECT_ID' && firebaseConfig.appId && !firebaseConfig.appId.includes('PASTE_');
if (configReady) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    onAuthStateChanged(auth, user => {
      const button = document.getElementById('open-login');
      if (button) button.textContent = user ? 'Sign out' : 'Sign in';
      if (user && statusBox) statusBox.textContent = `Signed in as ${user.email || 'TITAN.AI user'}.`;
    });
  } catch (error) { console.error('Firebase initialization failed:', error); }
}
function showAuth(mode='login') {
  setMode(mode);
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else alert('Your browser does not support this login dialog. Please update your browser.');
}
function setMode(mode) {
  authMode = mode;
  document.querySelectorAll('.auth-tabs button').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  document.getElementById('auth-title').innerHTML = mode === 'signup' ? 'Create your <span>TITAN.AI</span> account' : 'Sign in to <span>TITAN.AI</span>';
  document.getElementById('name-label').classList.toggle('hidden', mode !== 'signup');
  document.getElementById('confirm-label').classList.toggle('hidden', mode !== 'signup');
  document.getElementById('terms-label').classList.toggle('hidden', mode !== 'signup');
  document.getElementById('password').autocomplete = mode === 'signup' ? 'new-password' : 'current-password';
  statusBox.textContent = configReady ? 'Firebase Authentication ready.' : 'Setup required: add your Firebase web config in firebase-config.js and enable Email/Password in Firebase Console.';
}
function notify(message) {
  toast.textContent = message; toast.classList.add('show');
  clearTimeout(notify.timer); notify.timer = setTimeout(() => toast.classList.remove('show'), 3200);
}
document.getElementById('open-login').addEventListener('click', async () => {
  if (auth?.currentUser) { try { await signOut(auth); notify('You have signed out.'); } catch { notify('Sign-out failed. Please try again.'); } }
  else showAuth('login');
});
document.getElementById('hero-join').addEventListener('click', () => showAuth('signup'));
document.getElementById('banner-join').addEventListener('click', () => showAuth('signup'));
document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
document.querySelectorAll('.auth-tabs button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
document.getElementById('toggle-password').addEventListener('click', e => {
  const input = document.getElementById('password'); input.type = input.type === 'password' ? 'text' : 'password';
  e.currentTarget.textContent = input.type === 'password' ? 'Show' : 'Hide';
});
document.getElementById('auth-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  if (!configReady || !auth) { statusBox.textContent = 'Firebase is not configured yet. Edit firebase-config.js with your project values, then enable Email/Password in Firebase Console.'; return; }
  if (!email || password.length < 8) { statusBox.textContent = 'Enter a valid email and a password with at least 8 characters.'; return; }
  try {
    if (authMode === 'signup') {
      if (!document.getElementById('display-name').value.trim()) { statusBox.textContent = 'Enter your display name.'; return; }
      if (password !== document.getElementById('confirm-password').value) { statusBox.textContent = 'Passwords do not match.'; return; }
      if (!document.getElementById('accept-terms').checked) { statusBox.textContent = 'Please accept the Terms and Privacy Policy.'; return; }
      await createUserWithEmailAndPassword(auth, email, password);
      statusBox.textContent = 'Account created and signed in successfully.';
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      statusBox.textContent = 'Signed in successfully.';
    }
    setTimeout(() => dialog.close(), 700);
  } catch (error) {
    const messages = { 'auth/email-already-in-use':'That email already has an account. Sign in instead.', 'auth/invalid-credential':'Email or password is incorrect.', 'auth/weak-password':'Choose a stronger password.', 'auth/invalid-email':'Enter a valid email address.', 'auth/operation-not-allowed':'Enable Email/Password in Firebase Console > Authentication > Sign-in method.' };
    statusBox.textContent = messages[error.code] || `Authentication failed: ${error.message}`;
  }
});
document.getElementById('google-login').addEventListener('click', async () => {
  if (!auth) { statusBox.textContent = 'Configure Firebase first. Then enable Google under Firebase Console > Authentication > Sign-in method.'; return; }
  try { await signInWithPopup(auth, new GoogleAuthProvider()); statusBox.textContent = 'Signed in with Google.'; setTimeout(() => dialog.close(), 700); }
  catch (error) { statusBox.textContent = `Google sign-in failed: ${error.message}`; }
});
document.getElementById('phone-login').addEventListener('click', () => {
  statusBox.textContent = 'Phone OTP needs Firebase Phone provider, an on-page reCAPTCHA verifier, and authorized domains. It is not enabled in this starter yet.';
});
function updateClock() {
  const now = new Date();
  const time = new Intl.DateTimeFormat('en-IN', {timeZone:'Asia/Kolkata', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true}).format(now);
  const date = new Intl.DateTimeFormat('en-IN', {timeZone:'Asia/Kolkata', day:'2-digit', month:'short', year:'numeric'}).format(now);
  document.getElementById('india-clock').textContent = `${time} · ${date} IST`;
}
updateClock(); setInterval(updateClock, 1000);
document.getElementById('uid-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const uid = document.getElementById('player-uid').value.trim();
  const status = document.getElementById('uid-status');
  const fill = document.getElementById('analysis-progress-fill');
  const date = document.getElementById('registry-date').value;
  const file = document.getElementById('reference-file').files?.[0];
  fill.style.width = '0%';
  if (!/^[0-9]{5,20}$/.test(uid)) { status.textContent = 'ERROR · Enter a numeric UID between 5 and 20 digits.'; return; }
  status.textContent = 'CHECKING INPUT FORMAT…';
  for (const pct of [20, 45, 70, 100]) {
    await new Promise(resolve => setTimeout(resolve, 180));
    fill.style.width = `${pct}%`;
  }
  status.textContent = `LOCAL DEMO COMPLETE · UID ${uid} passed format validation.${date ? ` Registry date: ${date}.` : ''}${file ? ` Reference file selected: ${file.name}.` : ''} No live game-server scan, IP/location tracking, ban status check, or account restoration was performed. A real profile lookup requires an authorized API and backend.`;
});
