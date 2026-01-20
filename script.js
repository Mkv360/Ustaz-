// Show card by ID
function showCard(cardId) {
    document.querySelectorAll('.card').forEach(c => c.style.display = 'none');
    document.getElementById(cardId).style.display = 'block';
}
showCard('login-card'); // default

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

// Signup
function signup(){
    const name = document.getElementById('signup-name').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const role = document.getElementById('signup-role').value;
    const subcity = document.getElementById('subcity').value;
    const area = document.getElementById('area').value;

    let experience = null, available_days = null;
    if(role==='Ustaz'){
        experience = document.getElementById('experience').value;
        available_days = Array.from(document.querySelectorAll('input[name="days"]:checked')).map(d=>d.value).join(',');
    }

    fetch('backend/send_otp.php',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:`phone=${phone}`
    }).then(r=>r.json()).then(data=>{
        if(data.success){
            localStorage.setItem('signup_data', JSON.stringify({name, phone, password, role, subcity, area, experience, available_days}));
            showCard('otp-card');
        }
    });
}

// Verify OTP
function verifyOtp(){
    const otp = document.getElementById('otp-input').value;
    const signup_data = JSON.parse(localStorage.getItem('signup_data'));
    fetch('backend/verify_otp.php',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:`phone=${signup_data.phone}&otp=${otp}`
    }).then(r=>r.json()).then(data=>{
        if(data.success){
            // Save user to DB
            const params = new URLSearchParams(signup_data).toString();
            fetch('backend/signup.php',{
                method:'POST',
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                body: params
            }).then(r=>r.json()).then(res=>{
                if(res.success){
                    alert('Signup successful! Login now.');
                    showCard('login-card');
                }
            });
        } else {
            alert(data.message || 'Invalid OTP');
        }
    });
}

// Login
function login(){
    const phone = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;
    fetch('backend/login.php',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:`phone=${phone}&password=${password}`
    }).then(r=>r.json()).then(data=>{
        if(data.success){
            alert('Login Successful!');
        } else {
            alert(data.message);
        }
    });
}