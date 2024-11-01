import logo from "@/assets/logo.png";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header id="main-header">
      <Link href="/">
        <Image
          src={logo}
          // width={100}
          // height={100}
          sizes="10vw"
          alt="Mobile phone with posts feed on it"
          //Image컴포넌트는 기본적으로 lazy loading header같은 곳에 쓰이는 사진은 priority로 사전로드하도록함
          priority
        />
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/feed">Feed</Link>
          </li>
          <li>
            <Link className="cta-link" href="/new-post">
              New Post
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
