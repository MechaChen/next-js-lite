# next-js-lite

Simple Next.js support page router functionalities, which render initial content from server

&nbsp;

## How it works?

<img width="600" height="1196" alt="image" src="https://github.com/user-attachments/assets/63299a91-907a-40d0-9f22-bee350ad6102" />


## How to run?

1. install npm package

```bash
bun i
```

&nbsp;

2. run server

```bash
bun dev
```

&nbsp;

3. add your new page component under `/page` and add and props in `getServerProps`

```jsx
export async function getServerSideProps() {
  const serverProps1 = 'Prop1 from Server';
  await sleep(3000);
  const serverProps2 = 'Prop2 from Server';

  return {
    props: {
      startTime,
      endTime,
    },
  };
}

export default function NewPage(props: any) {
  const { serverProps1, serverProps2 } = props;
   ...
}
```
