"use server"; // 서버 액션 역할 하는 기능 생성을 위한 지시문
export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  //validatition
  let errors = {};
  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }
  if (password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }
  //serveraction의 경우 클라이언트에겐 응답으로 전달 -> 새로운 formData
  if (Object.keys(errors).length > 0) return { errors };

  //store it in the database (create a new user)
}
