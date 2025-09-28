import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h2>This is App component rendered by Server!</h2>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <p>Count: {count}</p>
    </>
  );
}
