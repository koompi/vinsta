import axios from 'axios';

export const sendOTP = async (chatId: string): Promise<void> => {
  try {
    const response = await axios.post('https://vinsta.koompi.org/send_otp', {
      chatId,
    });
    console.log('OTP sent successfully:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error sending OTP:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
};

export const verifyOTP = async (chatId: string, otp: string): Promise<void> => {
  try {
    const response = await axios.post('https://vinsta.koompi.org/verify_otp', {
      chatId,
      otp,
    });
    console.log('OTP verification response:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error verifying OTP:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
};

