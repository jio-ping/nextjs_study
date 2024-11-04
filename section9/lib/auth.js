import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { cookies } from "next/headers";
import db from "./db";

const adapter = new BetterSqlite3Adapter(db, {
  user: "users",
  session: "sessions",
});

const lucia = new Lucia(adapter, {
  sessionCookie: {
    //nextjs에서 lucia 사용시 설정
    expires: false,
    attributes: {
      // production 용으로 실행하는 경우 https에서만 작동토록 쿠키 설정
      // NODE_ENV 환경변수는 호스팅 제공 업체에 의해 자동으로 설정됨
      // 이 환경변수가 production 값을 가짐 => 이미 배포함
      secure: process.env.NODE_ENV,
    },
  },
});

/**
 *  특정 사용자에 대해 세션 테이블에 새 세션을 생성, 저장 => 쿠키 설정
 *  lucia는 자동으로 DB에 저장함
 * @param {*} userId = email이 아닌 record id
 */
export async function createAuthSession(userId) {
  // session table에 새 항목을 생성하고 새로운 고유 세션 아이디 생성
  const session = await lucia.createSession(userId, {});
  //lucia가 세션 쿠키에 설정한 데이터
  const sessionCookie = lucia.createSessionCookie(session.id);
  // Next.js의 cookies 발신응답에 포함된 쿠키에 접근할 수 있음
  // cookies().get: 쿠키를 가져오고 읽을 수 있는 객체
  // cookies().set: 새 쿠키를 설정할 수 있는 객체
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}

export async function verifyAuth() {
  // 요청이 인증된 사용자로부터 오는지 확인
  // 들어오는 요청에 인증 쿠키 - 쿠키는 유효(DB에 저장한 세션ID)
  // 가짜 쿠키일 수도 있으니 유효성 검사가 필요함
  const sessionCookie = cookies().get(lucia.sessionCookieName);
  if (!sessionCookie) {
    return { user: null, session: null };
  }
  const sessionId = sessionCookie.value;

  if (!sessionId) {
    return { user: null, session: null };
  }

  const result = lucia.validateSession(sessionId);
  try {
    // 새로고침 후 사용자의 접근이 차단되지 않도록 만듦
    if (result.session && result.session.fresh) {
      // 새 세션 쿠키를 생성함
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      // 쿠키 설정 - 기존 활성 세션을 위한 쿠키 재생성 ( 쿠키 연장 )
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!result.session) {
      //유효한 세션의 쿠키가 아님 - 새로운 세션의 쿠키 데이터 생성
      const sessionCookie = lucia.createBlankSessionCookie();
      // 기존 쿠키를 지움
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {}
  return result;
}

// 해당 사용자에 대해 세션과 세션쿠키를 종료
export async function destroySession() {
  // 유효한 세션이 있는지 확인
  const { session } = await verifyAuth();
  if (!session) {
    return { error: "Unauthorized!" };
  }
  // 세션을 무효화 (DB 테이블에 접근해 세션 삭제)
  await lucia.invalidateSession(session.id);
  // 쿠키 삭제
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
