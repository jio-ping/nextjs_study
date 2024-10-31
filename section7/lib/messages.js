import sql from "better-sqlite3";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const db = new sql("messages.db");

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY, 
      text TEXT
    )`);
}

initDb();

export function addMessage(message) {
  db.prepare("INSERT INTO messages (text) VALUES (?)").run(message);
}

// next/cache의 unstable_cache-해당 함수가 반환하는 데이터를 nextjs의 데이터 캐시에서 캐시할수있도록
export const getMessages = unstable_cache(
  //react의 cache 함수 - 중복 제거를 위해
  cache(function getMessages() {
    console.log("Fetching messages from db");
    return db.prepare("SELECT * FROM messages").all();
  }),
  ["messages"],
  {
    // revalidate:5 //재검증시간설정,
    tags: ["msg"], // 해당태그가 캐시된 데이터에 추가됨 -> revalidateTag("msg") 시 캐시된 데이터 삭제
  }
);
