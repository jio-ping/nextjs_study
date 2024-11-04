"use server";
import { createAuthSession, destroySession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user";
import { redirect } from "next/navigation";
// 서버 액션 역할 하는 기능 생성을 위한 지시문
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
  //password를 평문으로 저장하게 되면 보안상 문제가 생길 수 있음 (해시처리 필수)
  const hashedPassword = hashUserPassword(password);
  try {
    const id = createUser(email, hashedPassword); // 세션 생성
    await createAuthSession(id);
    redirect("/training");
  } catch (error) {
    //sqlite는 unique 조건 위반시 에러 발생
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email:
            "It seems like an account for the chosen email already exists.",
        },
      };
    }
    throw error;
  }
}

export async function login(prevState, formData) {
  // 사용자가 제출한 값을 검증할 필요는 없음
  const email = formData.get("email");
  const password = formData.get("password");

  const existingUser = getUserByEmail(email);
  if (!existingUser) {
    return {
      errors: {
        email: "Could not authenticate user, please check your credentials ",
      },
    };
  }
  //
  const isValidPassword = verifyPassword(existingUser.password, password);
  if (!isValidPassword) {
    return {
      errors: {
        password: "Could not authenticate user, please check your credentials ",
      },
    };
  }

  // 인증 세션을 만듦
  await createAuthSession(existingUser.id);
  // 리디렉션
  redirect("/training");
}

// helper server action  - 모드에 따라 적절한 서버 동작 호출
export async function auth(mode, prevState, formData) {
  if (mode === "login") {
    return login(prevState, formData);
  }
  return signup(prevState, formData);
}

export async function logout() {
  await destroySession();
  redirect("/");
}
