import { useState } from 'react'
import './App.css'
import { Button } from "@/components/ui/button";
import { CarouselDemo } from './components/demo/CarouselDemo';
import { AccordionDemo } from './components/demo/AccordionDemo';
import { CardWithForm } from './components/demo/CardWithForm';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-svh">
      <Button>Click me</Button>
      <CarouselDemo></CarouselDemo>
      </div>
      <div className="flex flex-col items-center justify-center min-h min-h-svh">
        <AccordionDemo></AccordionDemo>
        <div className='text-white'>
        <CardWithForm></CardWithForm>
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
