import NewsList from "@/components/news-list.js";
import { DUMMY_NEWS } from "@/public/dummy-news";
export default function NewsPage() {
  return (
    <>
      <h1>News Page</h1>
      <NewsList news={DUMMY_NEWS} />
    </>
  );
}
