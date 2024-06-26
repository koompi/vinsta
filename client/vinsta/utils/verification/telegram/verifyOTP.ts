import axios from 'axios';

export const verifyOTP = async (chatId: string, otp: string): Promise<any> => {
  try {
    const response = await axios.post('https://vinsta.koompi.org/verify_otp', {
      chatId,
      otp,
    });
    return response.data; // Return the entire response data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error verifying OTP:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error; // Rethrow the error to be caught in sshVirtualMachine
  }
};
