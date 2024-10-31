import Messages from "@/components/messages";
import { getMessages } from "@/lib/messages";
import { unstable_noStore } from "next/cache";

export const revalidate = 5;
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  // unstable_noStore(); // 이 컴포넌트에서만
  // const response = await fetch("http://localhost:8080/messages", {
  //   // cache: "no-store", // 동일 요청이 보내지는 이 곳의 데이터는 cache 되지 않음
  //   next: {
  //     // revalidate: 5, // nextjs가 캐시 데이터를 재사용해야할 초
  //     tags: ["msg"],
  //   },
  // });

  const messages = await getMessages();

  if (!messages || messages.length === 0) {
    return <p>No messages found</p>;
  }

  return <Messages messages={messages} />;
}
