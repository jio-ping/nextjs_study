import crypto from "node:crypto";
/**
 * 평문으로 된 비밀번호를 다시 원래대로 변환할 수 없는 문자열로 변환(해시화)
 * @param {*} password
 * @returns
 */
export function hashUserPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");

  const hashedPassword = crypto.scryptSync(password, salt, 64);
  return hashedPassword.toString("hex") + ":" + salt;
}
/**
 * 비밀번호를 확인하고 해시로 저장된 비밀번호와 비교하는 함수
 * @param {*} storedPassword
 * @param {*} suppliedPassword
 * @returns
 */
export function verifyPassword(storedPassword, suppliedPassword) {
  const [hashedPassword, salt] = storedPassword.split(":");
  const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
  const suppliedPasswordBuf = crypto.scryptSync(suppliedPassword, salt, 64);
  return crypto.timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}
