import Header from "@/components/Header"
import Landing from "@/components/Landing"
import { useEffect } from 'react';
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    function handleKeyPress(event) {
      if (event && (event.key || event.metaKey)) {
        event.preventDefault();
        let key = (event.key).toLowerCase();

        if (key === 's') {
          router.push('/signup')
        }

        if (key === 'l') {
          router.push('/login')
        }

        if (key === 'd') {
          router.push('/dashboard')
        }
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
