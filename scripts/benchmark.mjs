import console from 'console';
import process from 'process';

const results = [];

function measurePerformance(name, fn) {
  const start = process.hrtime.bigint();
  fn();
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1000000;
  results.push({ name, duration });
  console.log(`${name}: ${duration.toFixed(2)}ms`);
}

function runBenchmarks() {
  console.log('Running performance benchmarks...\n');

  measurePerformance('Token lookup - simple path', () => {
    const tokens = { colors: { primary: { 500: '#000000' } } };
    for (let i = 0; i < 10000; i++) {
      tokens.colors.primary[500];
    }
  });

  measurePerformance('Token lookup - nested path', () => {
    const tokens = { colors: { primary: { 500: { default: '#000000' } } } };
    for (let i = 0; i < 10000; i++) {
      tokens.colors.primary[500].default;
    }
  });

  measurePerformance('Object creation - simple', () => {
    for (let i = 0; i < 1000; i++) {
      const obj = { a: 1, b: 2, c: 3 };
    }
  });

  measurePerformance('Object creation - nested', () => {
    for (let i = 0; i < 1000; i++) {
      const obj = { a: { b: { c: { d: 1 } } } };
    }
  });

  measurePerformance('Array operations - map', () => {
    const arr = Array.from({ length: 10000 }, (_, i) => i);
    const mapped = arr.map(x => x * 2);
  });

  measurePerformance('Array operations - filter', () => {
    const arr = Array.from({ length: 10000 }, (_, i) => i);
    const filtered = arr.filter(x => x % 2 === 0);
  });

  measurePerformance('Array operations - reduce', () => {
    const arr = Array.from({ length: 10000 }, (_, i) => i);
    const sum = arr.reduce((a, b) => a + b, 0);
  });

  console.log('\n=== Benchmark Summary ===');
  results.forEach(({ name, duration }) => {
    const status = duration < 100 ? '✅' : duration < 500 ? '⚠️' : '❌';
    console.log(`${status} ${name}: ${duration.toFixed(2)}ms`);
  });

  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  console.log(`\nTotal duration: ${totalDuration.toFixed(2)}ms`);
  console.log(`Average: ${(totalDuration / results.length).toFixed(2)}ms`);

  return results;
}

try {
  const benchmarkResults = runBenchmarks();
  
  process.stdout.write(JSON.stringify(benchmarkResults, null, 2));
} catch (error) {
  console.error('Benchmark failed:', error);
  process.exit(1);
}
