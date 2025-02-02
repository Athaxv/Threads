"use client"
import React from 'react'
import { sidebarLinks } from '../../constants/index'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { SignedIn, SignOutButton, useAuth } from '@clerk/nextjs'
import { useClerk } from '@clerk/clerk-react';

const LeftSidebar = () => {
  const { signOut } = useClerk();
  const router = useRouter()
  const pathName = usePathname()
  const { userId } = useAuth();

  const handleSignOut = () => {
    signOut(() => {
      router.push("/sign-in"); // Redirect after sign-out
    });
  };

  return (
    <section className='custom-scrollbar leftsidebar'>
      <div className='flex flex-col flex-1 w-full gap-6 px-6'>
        {
          sidebarLinks.map((link) => {
            const isActive = (pathName.includes(link.route) && link.route.length > 1) || pathName === link.route;
            if (link.route === '/profile') {
              link.route = `${link.route}/${userId}`
            }
            return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${ isActive && 'bg-primary-500'}`}
              >
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={24}
                  height={24}
                />
                <p className='text-light-1 max-lg:hidden'>{link.label}</p>
              </Link>
          )})
        }

        
      </div>
      <div className='mt-10 px-6'>
      <SignedIn>
            <button onClick={handleSignOut}>
              <div className="flex cursor-pointer gap-4 p-4">
                <Image
                  src="/assets/logout.svg"
                  alt="logout"
                  height={24}
                  width={24}
                  />
                  <p className='text-light-2 max-lg:hidden'>Logout</p>
              </div>
            </button>
          </SignedIn>
          </div>
    </section>
  )
}

export default LeftSidebar
