"use client";
import Link from "next/link";
import { useFormState } from "react-dom";
import { auth } from "@/actions/auth-actions";
export default function AuthForm({ mode }) {
  const [formState, formAction] = useFormState(auth.bind(null, mode), {});
  return (
    <form id="auth-form" action={formAction}>
      <div>
        <img src="/images/auth-icon.jpg" alt="A lock icon" />
      </div>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        {formState.errors && (
          <ul id="form-errors">
            {Object.keys(formState.errors).map((error) => (
              <li key={error}>{formState.errors[error]}</li>
            ))}
          </ul>
        )}
      </p>
      <p>
        <button type="submit">
          {mode === "login" ? "Login" : "Create Account"}
        </button>
      </p>
      <p>
        {mode === "login" && (
          <Link href="/?mode=signup">Create an account</Link>
        )}
      </p>
      {/* 쿼리 파라미터를 사용한 모드 전환 */}
      {mode === "signup" && (
        <Link href="/?mode=login">Login with existing account.</Link>
      )}
    </form>
  );
}
