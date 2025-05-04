const express = require('express');
const bodyParser = require('body-parser');
const phone = require('phone');

const app = express();
app.use(bodyParser.json());

const accountSid = 'your_sid';
const authToken = 'your_auth_token';
const client = phone(accountSid, authToken);

const otpStore = {}; // In-memory store, use a DB in production

// Send OTP
app.post('/send-otp', (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[phone] = otp;

  client.messages
    .create({
      body: `Your OTP is ${otp}`,
      from: 'your_phone',
      to: phone,
    })
    .then(() => res.send({ success: true }))
    .catch(err => res.status(500).send({ error: err.message }));
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (otpStore[phone] === otp) {
    delete otpStore[phone];
    res.send({ verified: true });
  } else {
    res.status(401).send({ verified: false });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));

function sendOTP() {
  const phone = document.getElementById('phone').value;
  fetch('/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  }).then(() => {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('otp-form').style.display = 'block';
  });
}

function verifyOTP() {
  const phone = document.getElementById('phone').value;
  const otp = document.getElementById('otp').value;
  fetch('/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp })
  }).then(response => {
    if (response.ok) {
      alert('OTP Verified!');
    } else {
      alert('Invalid OTP');
    }
  });
}
