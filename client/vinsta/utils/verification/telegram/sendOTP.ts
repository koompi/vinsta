import axios from 'axios';

const botToken = '7339995010:AAGKK95yHIzzqDXRgyPQwX0FwQf9iG6azo8'; // Replace with your Telegram bot token
const otpStorage: Record<string, string> = {}; // Temporary storage for OTPs

// Function to generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send OTP to the specified chat_id
export async function sendOTP(chatId: string): Promise<void> {
  const otp = generateOTP();
  const message = `Your OTP is: ${otp}`;

  // Store the OTP with chatId as the key
  otpStorage[chatId] = otp;

  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await axios.post(apiUrl, {
      chat_id: chatId,
      text: message,
    });

    if (response.data.ok) {
    //   console.log(`OTP sent successfully to chat ID: ${chatId}`);
    } else {
      console.error('Failed to send OTP:', response.data);
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
}

// // Example usage
// const chatId = '670967877'; // Replace with the chat_id you got from /get_chatid
// sendOTP(chatId);

export { otpStorage };
