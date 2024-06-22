import axios from 'axios';
import dotenv from 'dotenv';


export const verifyOTP = async (chatId: string, otp: string): Promise<boolean> => {
  try {
    const response = await axios.post("https://vinsta.koompi.org/verify_otp", {
      chatId,
      otp,
    });
    console.log('OTP verification response:', response.data);
    return response.data.valid; // Assuming the API returns a boolean field 'valid' indicating the OTP validity
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error verifying OTP:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return false;
  }
};
