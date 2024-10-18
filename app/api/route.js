//화면에 렌더링되는 페이지를 반환하지 않는 라우트를 설정
// 대신 라우트 핸드럴에서는 json데이터 반환 및 수신 응답
//
export function GET(req) {
  console.log(req);
  return new Response("plain text");
}
export function POST(req) {
  console.log(req);
}
