import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <nav className="topbar">
      <Link href='/' className='flex gap-4 items-center'>
      <Image src="/assets/logo.svg" alt="logo" height={28} width={28}/>
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>
    </nav>
  );
}
