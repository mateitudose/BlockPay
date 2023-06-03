import Header from "@/components/Header"
import Landing from "@/components/Landing"
import { useEffect } from 'react';
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    function handleKeyPress(event) {
      let key = event.key;
      console.log('Key pressed:', key);

      if (key === 's' || key === 'S') {
        router.push('/signup')
      }
      if (key === 'l' || key === 'L') {
        router.push('/login')
      }
    }

    // Add the event listener when the component mounts
    window.addEventListener('keydown', handleKeyPress);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []); // Empty dependency array ensures that the effect runs only once

  return (
    <>
      <Header />
      <Landing />
    </>
  )
}
