import { useState } from 'react';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getServerSideProps() {
  const startTime = new Date().toISOString();
  await sleep(3000);
  const endTime = new Date().toISOString();

  return {
    props: {
      startTime,
      endTime,
    },
  };
}

export default function App(props: any) {
  const { startTime, endTime } = props;

  const [count, setCount] = useState(0);

  return (
    <>
      <h2>This is App component rendered by Server!</h2>

      <hr />

      <h3>Server Side Data</h3>
      <p>Start Time: {startTime}</p>
      <p>End Time: {endTime}</p>

      <hr />

      <h3>Client Side Data</h3>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <p>Count: {count}</p>
    </>
  );
}
