// pages/index.js
import Head from 'next/head';
import NYCSafetyCalculator from './components/NYCSafetyCalculator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Head>
        <title>NYC Safety Calculator</title>
        <meta name="description" content="Calculate safety improvements based on NYC neighborhood locations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <NYCSafetyCalculator />
      </main>
    </div>
  );
}