import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>NEXERA ID Examples Root Portfolio</title>
        <meta
          name="description"
          content="NEXERA ID Examples Root Portfolio page"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 "></div>
      </main>
    </>
  );
}
