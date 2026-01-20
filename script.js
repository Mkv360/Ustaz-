// -------------------- Telegram WebApp Initialization --------------------
if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand(); // expand iframe to fit content
}

// -------------------- Show inline messages --------------------
function showMessage(msg) {
    const messageEl = document.getElementById('message');
    if (messageEl) messageEl.textContent = msg;
}

// -------------------- Show a specific card --------------------
function showCard(cardId) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(c => c.style.display = 'none');
    const card = document.getElementById(cardId);
    card.style.display = 'block';
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// -------------------- Default view --------------------
showCard('login-card');

// -------------------- Toggle Ustaz fields --------------------
function toggleUstazFields() {
    const role = document.getElementById('signup-role').value;
    document.getElementById('ustaz-fields').style.display = role === 'Ustaz' ? 'block' : 'none';
}

// -------------------- Populate area dropdown --------------------
function populateAreas() {
    const subcity = document.getElementById('subcity').value;
    const areaSelect = document.getElementById('area');
    areaSelect.innerHTML = '<option value="">Select Area</option>';
    const areas = {
        'Bole': ['Area 1', 'Area 2', 'Area 3'],
        'Kirkos': ['Area A', 'Area B']
    };
    if (areas[subcity]) {
        areas[subcity].forEach(a => {
            const option = document.createElement('option');
            option.value = a;
            option.textContent = a;
            areaSelect.appendChild(option);
        });
    }
}

// -------------------- Step 1: Signup → Send OTP --------------------
function signup() {
    const name = document.getElementById('signup-name').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const role = document.getElementById('signup-role').value;
    const subcity = document.getElementById('subcity').value;
    const area = document.getElementById('area').value;

    if (!name || !phone || !password || !subcity || !area) {
        showMessage('Please fill all required fields.');
        return;
    }

    let experience = null, available_days = null;
    if (role === 'Ustaz') {
        experience = document.getElementById('experience').value;
        available_days = Array.from(document.querySelectorAll('input[name="days"]:checked'))
            .map(d => d.value).join(',');
    }

    const signup_data = { name, phone, password, role, subcity, area, experience, available_days };
    localStorage.setItem('signup_data', JSON.stringify(signup_data));

    // Call API send_otp.php (CORS enabled in PHP)
    fetch('/api/send_otp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `phone=${phone}`
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            showMessage('OTP sent! Check Replit console for demo OTP.');
            document.getElementById('otp-phone').textContent = phone;
            showCard('otp-card');
        } else {
            showMessage(data.message || 'Failed to send OTP.');
        }
    })
    .catch(err => showMessage('Error sending OTP.'));
}

// -------------------- Step 2: Verify OTP → Create Account --------------------
function verifyOtp() {
    const otp = document.getElementById('otp-input').value.trim();
    if (!otp) { showMessage('Please enter OTP.'); return; }

    const signup_data = JSON.parse(localStorage.getItem('signup_data'));
    if (!signup_data) {
        showMessage('Signup data missing. Please start again.');
        showCard('signup-card');
        return;
    }

    fetch('/api/verify_otp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `phone=${signup_data.phone}&otp=${otp}`
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            // OTP verified → create user account
            const params = new URLSearchParams(signup_data).toString();
            fetch('/api/signup.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params
            })
            .then(r => r.json())
            .then(res => {
                if (res.success) {
                    showMessage('Account created! Please login.');
                    showCard('login-card');
                } else {
                    showMessage(res.message || 'Signup failed.');
                }
            });
        } else {
            showMessage(data.message || 'Invalid or expired OTP.');
        }
    })
    .catch(err => showMessage('Error verifying OTP.'));
}

// -------------------- Resend OTP --------------------
function resendOtp() {
    const signup_data = JSON.parse(localStorage.getItem('signup_data'));
    if (!signup_data) { showMessage('Signup data missing'); return; }

    fetch('/api/send_otp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `phone=${signup_data.phone}`
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) showMessage('OTP resent! Check Replit console.');
        else showMessage('Failed to resend OTP.');
    })
    .catch(err => showMessage('Error resending OTP.'));
}

// -------------------- Login --------------------
function login() {
    const phone = document.getElementById('login-phone').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!phone || !password) { showMessage('Please enter phone and password.'); return; }

    fetch('/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `phone=${phone}&password=${password}`
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            showMessage('Login Successful!');
            // TODO: redirect to dashboard or main page
        } else showMessage(data.message || 'Invalid credentials.');
    })
    .catch(err => showMessage('Error during login.'));
}