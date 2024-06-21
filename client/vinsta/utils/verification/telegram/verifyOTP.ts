import { otpStorage } from './sendOTP';

// Function to verify OTP
export function verifyOTP(chatId: string, otp: string): boolean {
  const storedOtp = otpStorage[chatId];

  if (storedOtp === otp) {
    // OTP is valid, remove it from storage
    delete otpStorage[chatId];
    return true;
  }

  // OTP is invalid
  return false;
}

// // Example usage
// const isValid = verifyOTP(chatId, '123456'); // Replace '123456' with the OTP to be verified
// console.log(`Is the OTP valid? ${isValid}`);
