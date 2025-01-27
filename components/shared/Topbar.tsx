import { OrganizationSwitcher, SignedIn, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { dark } from '@clerk/themes'

export default function Home() {
  return (
    <nav className="topbar">
      <Link href='/' className='flex gap-4 items-center'>
      <Image src="/assets/logo.svg" alt="logo" height={28} width={28}/>
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src="/assets/logout.svg"
                  alt="logout"
                  height={24}
                  width={24}
                  />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organanizationSwitchTrigger: "py-2 px-4"
            }
          }}
          />
      </div>
    </nav>
  );
}
