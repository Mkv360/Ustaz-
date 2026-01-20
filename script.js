// Show card by ID
function showCard(cardId) {
    document.querySelectorAll('.card').forEach(c => c.style.display = 'none');
    document.getElementById(cardId).style.display = 'block';
}

// Default → Login card
showCard('login-card');

// Toggle Ustaz fields
function toggleUstazFields(){
    const role = document.getElementById('signup-role').value;
    document.getElementById('ustaz-fields').style.display = role === 'Ustaz' ? 'block' : 'none';
}

// Populate areas based on subcity
function populateAreas(){
    const subcity = document.getElementById('subcity').value;
    const areaSelect = document.getElementById('area');
    areaSelect.innerHTML = '<option value="">Select Area</option>';

    const areas = {
        'Bole': ['Area 1', 'Area 2', 'Area 3'],
        'Kirkos': ['Area A', 'Area B']
    };

    if(areas[subcity]){
        areas[subcity].forEach(a=>{
            const option = document.createElement('option');
            option.value = a;
            option.textContent = a;
            areaSelect.appendChild(option);
        });
    }
}

// Step 1: Send OTP (on Create Account click)
function signup(){
    const name = document.getElementById('signup-name').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const role = document.getElementById('signup-role').value;
    const subcity = document.getElementById('subcity').value;
    const area = document.getElementById('area').value;

    if(!name || !phone || !password || !subcity || !area){
        alert('Please fill all required fields.');
        return;
    }

    let experience = null, available_days = null;
    if(role==='Ustaz'){
        experience = document.getElementById('experience').value;
        available_days = Array.from(document.querySelectorAll('input[name="days"]:checked')).map(d=>d.value).join(',');
    }

    // Save user data temporarily in localStorage
    localStorage.setItem('signup_data', JSON.stringify({name, phone, password, role, subcity, area, experience, available_days}));

    // Send OTP request
    fetch('backend/send_otp.php',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:`phone=${phone}`
    }).then(r=>r.json()).then(data=>{
        if(data.success){
            alert('OTP sent! Check logs for testing.');
            showCard('otp-card');
        } else {
            alert('Failed to send OTP.');
        }
    });
}

// Step 2: Verify OTP and create account
function verifyOtp(){
    const otp = document.getElementById('otp-input').value.trim();
    if(!otp){
        alert('Please enter OTP.');
        return;
    }

    const signup_data = JSON.parse(localStorage.getItem('signup_data'));

    // Verify OTP
    fetch('backend/verify_otp.php',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:`phone=${signup_data.phone}&otp=${otp}`
    }).then(r=>r.json()).then(data=>{
        if(data.success){
            // OTP verified → Create account
            const params = new URLSearchParams(signup_data).toString();
            fetch('backend/signup.php',{
                method:'POST',
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                body: params
            }).then(r=>r.json()).then(res=>{
                if(res.success){
                    alert('Account created successfully! You can now login.');
                    showCard('login-card');
                } else {
                    alert(res.message || 'Signup failed.');
                }
            });
        } else {
            alert(data.message || 'Invalid or expired OTP.');
        }
    });
}

// Login
function login(){
    const phone = document.getElementById('login-phone').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if(!phone || !password){
        alert('Please enter phone and password.');
        return;
    }

    fetch('backend/login.php',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:`phone=${phone}&password=${password}`
    }).then(r=>r.json()).then(data=>{
        if(data.success){
            alert('Login Successful!');
            // TODO: redirect to dashboard or main page
        } else {
            alert(data.message);
        }
    });
}