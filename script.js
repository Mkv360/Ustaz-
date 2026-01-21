document.addEventListener('DOMContentLoaded', () => {

  const flipCard = document.querySelector('.flip-card');
  const showSignup = document.getElementById('show-signup');
  const backToLogin = document.getElementById('back-to-login');
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const otpSection = document.getElementById('otp-section');
  const homeSection = document.getElementById('home-section');
  const landing = document.getElementById('landing');
  const userNameSpan = document.getElementById('user-name');

  // Show signup
  showSignup.addEventListener('click', () => flipCard.classList.add('flipped'));
  backToLogin.addEventListener('click', () => flipCard.classList.remove('flipped'));

  // Role toggle fields
  const roleSelect = document.getElementById('role');
  const genderInput = document.getElementById('gender');
  const experienceInput = document.getElementById('experience');

  roleSelect.addEventListener('change', () => {
    if(roleSelect.value === 'ustaz'){
      genderInput.style.display = 'block';
      experienceInput.style.display = 'block';
    } else {
      genderInput.style.display = 'none';
      experienceInput.style.display = 'none';
    }
  });

  // Subcity → area dynamic
  const subcity = document.getElementById('subcity');
  const area = document.getElementById('area');
  const subcityAreas = {
    subcity1: ['Area 1', 'Area 2'],
    subcity2: ['Area 3', 'Area 4']
  };

  subcity.addEventListener('change', () => {
    area.innerHTML = '<option value="">Select Area</option>';
    (subcityAreas[subcity.value] || []).forEach(a => {
      const opt = document.createElement('option');
      opt.value = a;
      opt.textContent = a;
      area.appendChild(opt);
    });
  });

  // Login / Signup → OTP
  loginBtn.addEventListener('click', () => goToOtp('User'));
  signupBtn.addEventListener('click', () => goToOtp(document.getElementById('full-name').value));

  function goToOtp(name){
    landing.style.display = 'none';
    otpSection.style.display = 'flex';
    userNameSpan.textContent = name; // store for home section
  }

  // OTP → Home
  document.getElementById('verify-otp').addEventListener('click', () => {
    otpSection.style.display = 'none';
    homeSection.style.display = 'block';
  });

  document.getElementById('logout-btn').addEventListener('click', () => {
    homeSection.style.display = 'none';
    landing.style.display = 'flex';
  });

});