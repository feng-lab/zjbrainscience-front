import aesjs from "aes-js";
import { fromByteArray, toByteArray } from "base64-js";

const AES_KEY = "#030doH2<FIb#b88"


const encodePwd = (pwd) => {
  const keyBytes = aesjs.utils.utf8.toBytes(AES_KEY); 
  let pwdBytes = aesjs.utils.utf8.toBytes(pwd);
  const aesEcb = new aesjs.ModeOfOperation.ecb(keyBytes);

  pwdBytes = aesjs.padding.pkcs7.pad(pwdBytes, 16);

  return fromByteArray(aesEcb.encrypt(pwdBytes));

}

const decodePwd = (encodePwd) => {
  const keyBytes = aesjs.utils.utf8.toBytes(AES_KEY); 
  const aesEcb = new aesjs.ModeOfOperation.ecb(keyBytes);
  const decodeFrom64 = toByteArray(encodePwd);
  const decodeFromAes = aesEcb.decrypt(decodeFrom64)
  const unpadData = aesjs.padding.pkcs7.strip(decodeFromAes)
  return aesjs.utils.utf8.fromBytes(unpadData)
}

export {
  encodePwd,
  decodePwd
}