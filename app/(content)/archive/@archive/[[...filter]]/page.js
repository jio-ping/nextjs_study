import NewsList from "@/components/news-list";
import { getAvailableNewsMonths, getNewsForYear } from "@/lib/news";
import { getAvailableNewsYears } from "@/lib/news";
import Link from "next/link";
export default function FilteredNewsPage({ params }) {
  const selectedYear = params.filter?.[0];
  const selectedMonth = params.filter?.[1];

  let news;
  let links = getAvailableNewsYears();

  if (selectedYear && !selectedMonth) {
    news = getNewsForYear(selectedYear);
    links = getAvailableNewsYears(selectedYear);
  }
  if (selectedMonth && selectedYear) {
    news = getNewsForYearAndMonth(selectedYear, selectedMonth);
    links = [];
  }
  let newsContent = <p>No news found for the seleceted period.</p>;

  if (news && news.length > 0) {
    newsContent = <NewsList news={news} />;
  }

  //선택연도가 있지만 연도가 포함되지 않으면
  if (
    (selectedYear && !getAvailableNewsYears().includes(+selectedYear)) ||
    (selectedMonth && !getAvailableNewsMonths().includes(+selectedMonth))
  ) {
    throw new Error("Invalid Filter");
  }
  return (
    <>
      <header id="archive-header">
        <nav>
          <ul>
            {links.map((link) => {
              const href = selectedYear
                ? `/archive/${selectedYear}/${link}`
                : `/archive/${link}`;

              return (
                <li key={link}>
                  <Link href={href}>{link}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      {newsContent}
    </>
  );
}
