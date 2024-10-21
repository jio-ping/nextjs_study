import NewsList from "@/components/news-list.js";
import { getAllNews } from "@/lib/news";

export default async function NewsPage() {
  const news = await getAllNews();

  return (
    <>
      <h1>News Page</h1>
      {/* async function 내부이기 때문에 응답 데이터가 있을 때까지 기다림 ..!! 
      응답 데이터가 있기 전까지 jsx 렌더링 하지 않음 -> 있는지 없는지 분기할 필요 없다는 뜻*/}
      <NewsList news={news} />
    </>
  );
}
