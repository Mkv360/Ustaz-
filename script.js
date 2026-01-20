// Telegram WebApp init
if(window.Telegram && Telegram.WebApp){
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
}

// Show inline message
function showMessage(msg){
    document.getElementById('message').textContent = msg;
}

// Show card
function showCard(cardId){
    const cards = document.querySelectorAll('.card');
    cards.forEach(c => c.style.display = 'none');
    const card = document.getElementById(cardId);
    card.style.display = 'block';
    card.scrollIntoView({behavior:'smooth', block:'center'});
}

// Default login card
showCard('login-card');

// Toggle Ustaz fields
function toggleUstazFields(){
    const role = document.getElementById('signup-role').value;
    document.getElementById('ustaz-fields').style.display = role==='Ustaz'?'block':'none';
}

// Populate area dropdown
function populateAreas(){
    const subcity = document.getElementById('subcity').value;
    const areaSelect = document.getElementById('area');
    areaSelect.innerHTML = '<option value="">Select Area</option>';
    const areas = {
        'Bole':['Area 1','Area 2','Area 3'],
        'Kirkos':['Area A','Area B']
    };
    if(areas[subcity]){
        areas[subcity].forEach(a=>{
            const option=document.createElement('option');
            option.value=a;
            option.textContent=a;
            areaSelect.appendChild(option);
        });
    }
}

// Signup → send OTP
function signup(){
    const name = document.getElementById('signup-name').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const role = document.getElementById('signup-role').value;
    const subcity = document.getElementById('subcity').value;
    const area = document.getElementById('area').value;

    if(!name||!phone||!password||!subcity||!area){
        showMessage('Please fill all required fields.');
        return;
    }

    let experience = null, available_days=null;
    if(role==='Ustaz'){
        experience = document.getElementById('experience').value;
        available_days = Array.from(document.querySelectorAll('input[name="days"]:checked')).map(d=>d.value).join(',');
    }

    const signup_data={name, phone, password, role, subcity, area, experience, available_days};
    localStorage.setItem('signup_data', JSON.stringify(signup_data));

    fetch('backend/send_otp.php',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:`phone=${phone}`
    }).then(r=>r.json()).then(data=>{
        if(data.success){
            showMessage('OTP sent! Check logs for testing.');
            document.getElementById('otp-phone').textContent = phone;
            showCard('otp-card');
        } else showMessage('Failed to send OTP.');
    });
}

// Verify OTP → create account
function verifyOtp(){
    const otp = document.getElementById('otp-input').value.trim();
    if(!otp){showMessage('Enter OTP'); return;}
    const signup_data = JSON.parse(localStorage.getItem('signup_data'));

    fetch('backend/verify_otp.php',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:`phone=${signup_data.phone}&otp=${otp}`
    }).then(r=>r.json()).then(data=>{
        if(data.success){
            // OTP valid → create user
            const params = new URLSearchParams(signup_data).toString();
            fetch('backend/signup.php',{
                method:'POST',
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                body: params
            }).then(r=>r.json()).then(res=>{
                if(res.success){
                    showMessage('Account created! Login now.');
                    showCard('login-card');
                } else showMessage(res.message || 'Signup failed.');
            });
        } else showMessage(data.message || 'Invalid OTP');
    });
}

// Resend OTP
function resendOtp(){
    const signup_data = JSON.parse(localStorage.getItem('signup_data'));
    fetch('backend/send_otp.php',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:`phone=${signup_data.phone}`
    }).then(r=>r.json()).then(data=>{
        if(data.success) showMessage('OTP resent!');
        else showMessage('Failed to resend OTP');
    });
}

// Login
function login(){
    const phone=document.getElementById('login-phone').value.trim();
    const password=document.getElementById('login-password').value.trim();
    if(!phone||!password){showMessage('Enter phone and password'); return;}

    fetch('backend/login.php',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:`phone=${phone}&password=${password}`
    }).then(r=>r.json()).then(data=>{
        if(data.success){
            showMessage('Login Successful!');
            // TODO: redirect to main page/dashboard
        } else showMessage(data.message);
    });
}