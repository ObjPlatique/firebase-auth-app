// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCncBGAm7X8kXncs3BGKAcLmCc66CfmCKg",
  authDomain: "fir-1-a20aa.firebaseapp.com",
  projectId: "fir-1-a20aa",
  storageBucket: "fir-1-a20aa.firebasestorage.app",
  messagingSenderId: "551902739682",
  appId: "1:551902739682:web:2d9a5e3a8308093eecf2bb",
  measurementId: "G-6J901QZLLK"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const messageBox = document.getElementById('messageBox');
const userInfo = document.getElementById('userInfo');
const userEmail = document.getElementById('userEmail');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const googleSignupBtn = document.getElementById('googleSignupBtn');

// Validation Functions
const isValidEmail = (email) => {
    return email.includes('@');
};

const isValidPassword = (password) => {
    // Minimum 6 characters, at least 1 uppercase, 1 lowercase, 1 number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(password);
};

// Message Display Functions
const showMessage = (message, type = 'success') => {
    messageBox.textContent = message;
    messageBox.classList.remove('hidden', 'success', 'error');
    messageBox.classList.add(type);
    
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 5000);
};

const updateUserDisplay = (user) => {
    if (user) {
        userEmail.textContent = user.email;
        userInfo.classList.remove('hidden');
    } else {
        userInfo.classList.add('hidden');
    }
};

// Password Toggle
const togglePasswordButtons = document.querySelectorAll('.toggle-password');
togglePasswordButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = button.dataset.target;
        const input = document.getElementById(targetId);
        
        if (input.type === 'password') {
            input.type = 'text';
            button.textContent = '🙈';
        } else {
            input.type = 'password';
            button.textContent = '👁️';
        }
    });
});

// Tab Switching
function switchToSignup(e) {
    e.preventDefault();
    document.querySelector('.login-card').classList.add('hidden');
    document.querySelector('.signup-card').classList.remove('hidden');
}

function switchToLogin(e) {
    e.preventDefault();
    document.querySelector('.signup-card').classList.add('hidden');
    document.querySelector('.login-card').classList.remove('hidden');
}

// Login Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Client-side validation
    if (!isValidEmail(email)) {
        showMessage('❌ Email must contain "@" character.', 'error');
        return;
    }
    
    if (!isValidPassword(password)) {
        showMessage('❌ Password must be at least 6 characters with 1 uppercase, 1 lowercase, and 1 number.', 'error');
        return;
    }
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        showMessage(`✅ Login successful! Welcome ${userCredential.user.email}.`, 'success');
        loginForm.reset();
        updateUserDisplay(userCredential.user);
    } catch (error) {
        console.error('Login error:', error);
        if (error.code === 'auth/invalid-credential') {
            showMessage('❌ Invalid email or password.', 'error');
        } else if (error.code === 'auth/user-not-found') {
            showMessage('❌ User not found. Please signup first.', 'error');
        } else if (error.code === 'auth/wrong-password') {
            showMessage('❌ Wrong password.', 'error');
        } else {
            showMessage(`❌ Login failed: ${error.message}`, 'error');
        }
    }
});

// Signup Handler
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Client-side validation
    if (!isValidEmail(email)) {
        showMessage('❌ Email must contain "@" character.', 'error');
        return;
    }
    
    if (!isValidPassword(password)) {
        showMessage('❌ Password must be at least 6 characters with 1 uppercase, 1 lowercase, and 1 number.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('❌ Passwords do not match.', 'error');
        return;
    }
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        showMessage(`✅ Signup successful! Account created for ${userCredential.user.email}.`, 'success');
        signupForm.reset();
        updateUserDisplay(userCredential.user);
        
        // Switch to login card after 2 seconds
        setTimeout(() => {
            switchToLogin({ preventDefault: () => {} });
        }, 2000);
    } catch (error) {
        console.error('Signup error:', error);
        if (error.code === 'auth/email-already-in-use') {
            showMessage('❌ This email is already registered.', 'error');
        } else if (error.code === 'auth/weak-password') {
            showMessage('❌ Password is too weak.', 'error');
        } else if (error.code === 'auth/invalid-email') {
            showMessage('❌ Invalid email address.', 'error');
        } else {
            showMessage(`❌ Signup failed: ${error.message}`, 'error');
        }
    }
});

// Google Login
googleLoginBtn.addEventListener('click', async () => {
    try {
        const result = await auth.signInWithPopup(provider);
        showMessage(`✅ Google login successful! Welcome ${result.user.email}.`, 'success');
        updateUserDisplay(result.user);
    } catch (error) {
        console.error('Google login error:', error);
        if (error.code !== 'auth/cancelled-popup-request') {
            showMessage(`❌ Google login failed: ${error.message}`, 'error');
        }
    }
});

googleSignupBtn.addEventListener('click', async () => {
    try {
        const result = await auth.signInWithPopup(provider);
        showMessage(`✅ Google signup successful! Welcome ${result.user.email}.`, 'success');
        updateUserDisplay(result.user);
    } catch (error) {
        console.error('Google signup error:', error);
        if (error.code !== 'auth/cancelled-popup-request') {
            showMessage(`❌ Google signup failed: ${error.message}`, 'error');
        }
    }
});

// Logout Handler
async function handleLogout() {
    try {
        await auth.signOut();
        showMessage('✅ You have been logged out.', 'success');
        updateUserDisplay(null);
        loginForm.reset();
        signupForm.reset();
        switchToLogin({ preventDefault: () => {} });
    } catch (error) {
        showMessage(`❌ Logout failed: ${error.message}`, 'error');
    }
}

// Monitor Auth State
auth.onAuthStateChanged((user) => {
    if (user) {
        updateUserDisplay(user);
    } else {
        updateUserDisplay(null);
    }
});

console.log('Firebase Auth App initialized. Please add your Firebase config credentials in script.js');
