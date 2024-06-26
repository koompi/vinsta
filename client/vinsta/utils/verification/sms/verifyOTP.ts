import axios from 'axios';

// Function to verify OTP
async function verifyOTP(phoneNumber: string, otp: string) {
  const apiUrl = 'http://sms.koompi.org/verify_otp'; // 

  const requestData = {
    phone_number: phoneNumber,
    otp: otp,
  };

  try {
    const response = await axios.post(apiUrl, requestData);
    console.log('Response:', response.data); // Handle response according to your application's logic
  } catch (error) {
    console.error('Error verifying OTP:', error);
    // Handle error appropriately
  }
}

// // Example usage
// verifyOTP('85512345678', '123456'); // Replace with actual data
