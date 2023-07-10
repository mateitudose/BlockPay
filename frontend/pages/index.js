import Header from "@/components/Header"
import Landing from "@/components/Landing"
import { useEffect } from 'react';
import { useRouter } from 'next/router'

const keyMap = {
  s: '/signup',
  l: '/login',
  d: '/dashboard'
}

export default function Home() {
  const router = useRouter()

  // useEffect(() => {
  //   function handleKeyPress(event) {
  //     if (event && event.key) {
  //       let key = (event.key).toLowerCase();
  //       if (keyMap[key]) {
  //         event.preventDefault();
  //         router.push(keyMap[key])
  //       }
  //     }
  //   }

  //   // Add the event listener when the component mounts
  //   window.addEventListener('keydown', handleKeyPress);

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener('keydown', handleKeyPress);
  //   };
  // }, []); // Empty dependency array ensures that the effect runs only once

  return (
    <div>
      <title>Blockpay | Payment Processor</title>
      <Header />
      <Landing />
    </div>
  )
}
