import crypto from "crypto";
export function decryptVMPassword(encryptedPassword: string, userPassword: string): string | null {
    try {
      const [salt, iv, encryptedMasterkey] = encryptedPassword.split(':');
      const key = crypto.pbkdf2Sync(userPassword, Buffer.from(salt, "hex"), 100000, 32, "sha512");
      const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(iv, "hex"));
      let decrypted = decipher.update(Buffer.from(encryptedMasterkey, "hex"));
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString("utf8");
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  }
  