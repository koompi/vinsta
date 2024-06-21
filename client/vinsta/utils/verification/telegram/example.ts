import { sendOTP } from "./sendOTP";
import { verifyOTP } from "./verifyOTP";
import promptSync from 'prompt-sync';

const prompt = promptSync();

// Example usage
const chatId = '670967877'; // Replace with the chat_id you got from /get_chatid

// Function to test OTP sending and verifying
async function testOTP() {
  // Send OTP
  const otp = await sendOTP(chatId);
  console.log(`Generated OTP: ${otp}`);

  // Wait for user to input the OTP they received
  const userOtp = prompt('Enter the OTP you received: ');

  // Verify OTP (use the OTP provided by the user)
  const isValid = verifyOTP(chatId, userOtp);
  console.log(`Is the OTP valid? ${isValid}`);
}

// Run the test
testOTP();
