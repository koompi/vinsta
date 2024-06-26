import axios from 'axios';


// Function to send OTP
async function sendOTP(phoneNumber: string, companyName: string, locale: string) {
  const apiUrl = 'http://sms.koompi.org/send_otp'; // Replace with your server's IP

  const requestData = {
    phone_number: phoneNumber,
    company_name: companyName,
    locale: locale,
  };

  try {
    const response = await axios.post(apiUrl, requestData);
    console.log('Response:', response.data); // Handle response according to your application's logic
  } catch (error) {
    console.error('Error sending OTP:', error);
    // Handle error appropriately
  }
}

// // Example usage
// sendOTP('85512345678', 'Company X', 'en'); // Replace with actual data
