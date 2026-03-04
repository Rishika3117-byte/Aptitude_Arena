import { Question } from './questionGenerators';

// Extended Question type that carries chart data
export interface DataVisQuestionWithChart extends Question {
  chartType?: 'bar' | 'pie' | 'line';
  chartData?: Record<string, unknown>[];
  chartTitle?: string;
  xKey?: string;
  yKey?: string;
  valueKey?: string;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// ── Bar Chart Question ──────────────────────────────────────────────────────
function generateBarChartQuestion(): DataVisQuestionWithChart {
  const months = ['Jan', 'Feb', 'Mar', 'Apr'];
  const values = months.map(() => randomInt(40, 100));
  const max = Math.max(...values);
  const maxMonth = months[values.indexOf(max)];

  const otherMonths = months.filter((m) => m !== maxMonth);
  const distractors = shuffle(otherMonths).slice(0, 3);
  const options = shuffle([maxMonth, ...distractors]);

  const chartData = months.map((name, i) => ({ name, Sales: values[i] }));

  return {
    id: `bar-${Date.now()}-${Math.random()}`,
    question: `Look at the bar chart below. Which month had the highest sales?`,
    options,
    correctAnswer: options.indexOf(maxMonth),
    explanation: `${maxMonth} had the highest sales with ${max} units as shown by the tallest bar.`,
    topic: 'Bar Charts',
    hint: `Find the tallest bar in the chart — that month has the highest sales.\nValues: Jan=${values[0]}, Feb=${values[1]}, Mar=${values[2]}, Apr=${values[3]}\nHighest: ${maxMonth} with ${max} units`,
    chartType: 'bar',
    chartData,
    chartTitle: 'Monthly Sales Data',
    xKey: 'name',
    yKey: 'Sales',
  };
}

// ── Pie Chart Question ──────────────────────────────────────────────────────
function generatePieChartQuestion(): DataVisQuestionWithChart {
  const categories = ['Product A', 'Product B', 'Product C', 'Product D'];
  const raw = categories.map(() => randomInt(15, 40));
  const total = raw.reduce((a, b) => a + b, 0);
  const percentages = raw.map((p) => Math.round((p / total) * 100));

  // Fix rounding so total = 100
  const diff = 100 - percentages.reduce((a, b) => a + b, 0);
  percentages[0] += diff;

  const max = Math.max(...percentages);
  const maxCategory = categories[percentages.indexOf(max)];
  const distractors = categories.filter((c) => c !== maxCategory);
  const options = shuffle([maxCategory, ...distractors]);

  const chartData = categories.map((name, i) => ({ name, value: percentages[i] }));

  return {
    id: `pie-${Date.now()}-${Math.random()}`,
    question: `Look at the pie chart below. Which product has the largest market share?`,
    options,
    correctAnswer: options.indexOf(maxCategory),
    explanation: `${maxCategory} has the largest market share at ${max}% — it's the biggest slice of the pie.`,
    topic: 'Pie Charts',
    hint: `Find the largest slice in the pie chart.\nA=${percentages[0]}%, B=${percentages[1]}%, C=${percentages[2]}%, D=${percentages[3]}%\nLargest: ${maxCategory} at ${max}%`,
    chartType: 'pie',
    chartData,
    chartTitle: 'Market Share Distribution',
    valueKey: 'value',
  };
}

// ── Line Chart Question ─────────────────────────────────────────────────────
function generateLineGraphQuestion(): DataVisQuestionWithChart {
  const years = ['2020', '2021', '2022', '2023'];
  const values = [randomInt(100, 200), randomInt(120, 230), randomInt(140, 260), randomInt(160, 280)];
  const increase = values[3] - values[0];

  const wrong1 = increase + randomInt(10, 30);
  const wrong2 = Math.max(1, increase - randomInt(10, 30));
  const wrong3 = Math.round(increase * 1.5);

  const options = shuffle([
    increase.toString(),
    wrong1.toString(),
    wrong2.toString(),
    wrong3.toString(),
  ]);

  const chartData = years.map((name, i) => ({ name, Revenue: values[i] }));

  return {
    id: `line-${Date.now()}-${Math.random()}`,
    question: `Look at the line chart below. What is the total increase in revenue from 2020 to 2023?`,
    options,
    correctAnswer: options.indexOf(increase.toString()),
    explanation: `Total increase = 2023 value (${values[3]}) − 2020 value (${values[0]}) = ${increase}.`,
    topic: 'Line Graphs',
    hint: `Total increase = Final value − Initial value.\n2023: ${values[3]}, 2020: ${values[0]}\nIncrease = ${values[3]} − ${values[0]} = ${increase}`,
    chartType: 'line',
    chartData,
    chartTitle: 'Revenue Trend (2020–2023)',
    xKey: 'name',
    yKey: 'Revenue',
  };
}

// ── Bar Chart – Lowest value ────────────────────────────────────────────────
function generateBarChartLowestQuestion(): DataVisQuestionWithChart {
  const departments = ['HR', 'Sales', 'Tech', 'Finance'];
  const values = departments.map(() => randomInt(30, 90));
  const min = Math.min(...values);
  const minDept = departments[values.indexOf(min)];

  const distractors = shuffle(departments.filter((d) => d !== minDept)).slice(0, 3);
  const options = shuffle([minDept, ...distractors]);

  const chartData = departments.map((name, i) => ({ name, Budget: values[i] }));

  return {
    id: `bar-low-${Date.now()}-${Math.random()}`,
    question: `Look at the bar chart below. Which department has the lowest budget allocation?`,
    options,
    correctAnswer: options.indexOf(minDept),
    explanation: `${minDept} has the lowest budget at ${min} units — the shortest bar in the chart.`,
    topic: 'Bar Charts',
    hint: `Find the shortest bar in the chart.\nHR=${values[0]}, Sales=${values[1]}, Tech=${values[2]}, Finance=${values[3]}\nLowest: ${minDept} with ${min} units`,
    chartType: 'bar',
    chartData,
    chartTitle: 'Department Budget Allocation',
    xKey: 'name',
    yKey: 'Budget',
  };
}

// ── Line Chart – Peak month ─────────────────────────────────────────────────
function generateLinePeakQuestion(): DataVisQuestionWithChart {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const values = months.map(() => randomInt(50, 200));
  const max = Math.max(...values);
  const maxMonth = months[values.indexOf(max)];

  const distractors = shuffle(months.filter((m) => m !== maxMonth)).slice(0, 3);
  const options = shuffle([maxMonth, ...distractors]);

  const chartData = months.map((name, i) => ({ name, Visitors: values[i] }));

  return {
    id: `line-peak-${Date.now()}-${Math.random()}`,
    question: `Look at the line chart below. In which month were website visitors the highest?`,
    options,
    correctAnswer: options.indexOf(maxMonth),
    explanation: `${maxMonth} had the peak with ${max} visitors — the highest point on the line.`,
    topic: 'Line Graphs',
    hint: `Look for the highest point on the line graph — that's the peak month.\nValues: ${months.map((m, i) => `${m}=${values[i]}`).join(', ')}\nPeak: ${maxMonth} with ${max} visitors`,
    chartType: 'line',
    chartData,
    chartTitle: 'Monthly Website Visitors',
    xKey: 'name',
    yKey: 'Visitors',
  };
}

// ── Pie Chart – Smallest share ──────────────────────────────────────────────
function generatePieSmallestQuestion(): DataVisQuestionWithChart {
  const regions = ['North', 'South', 'East', 'West'];
  const raw = regions.map(() => randomInt(10, 40));
  const total = raw.reduce((a, b) => a + b, 0);
  const percentages = raw.map((p) => Math.round((p / total) * 100));
  const diff = 100 - percentages.reduce((a, b) => a + b, 0);
  percentages[0] += diff;

  const min = Math.min(...percentages);
  const minRegion = regions[percentages.indexOf(min)];
  const distractors = shuffle(regions.filter((r) => r !== minRegion)).slice(0, 3);
  const options = shuffle([minRegion, ...distractors]);

  const chartData = regions.map((name, i) => ({ name, value: percentages[i] }));

  return {
    id: `pie-small-${Date.now()}-${Math.random()}`,
    question: `Look at the pie chart below. Which region has the smallest sales contribution?`,
    options,
    correctAnswer: options.indexOf(minRegion),
    explanation: `${minRegion} has the smallest share at ${min}% — the tiniest slice of the pie.`,
    topic: 'Pie Charts',
    hint: `Find the smallest slice in the pie chart.\nNorth=${percentages[0]}%, South=${percentages[1]}%, East=${percentages[2]}%, West=${percentages[3]}%\nSmallest: ${minRegion} at ${min}%`,
    chartType: 'pie',
    chartData,
    chartTitle: 'Regional Sales Contribution',
    valueKey: 'value',
  };
}

// ── Main exports ────────────────────────────────────────────────────────────
export function generateDatavisQuestion(_level: number = 1): DataVisQuestionWithChart {
  const generators = [
    generateBarChartQuestion,
    generatePieChartQuestion,
    generateLineGraphQuestion,
    generateBarChartLowestQuestion,
    generateLinePeakQuestion,
    generatePieSmallestQuestion,
  ];

  const randomGenerator = generators[randomInt(0, generators.length - 1)];
  return randomGenerator();
}

export function generateDatavisQuestionSet(count: number, level: number = 1): DataVisQuestionWithChart[] {
  const questions: DataVisQuestionWithChart[] = [];
  const usedQuestions = new Set<string>();

  while (questions.length < count) {
    const question = generateDatavisQuestion(level);
    if (!usedQuestions.has(question.question)) {
      questions.push(question);
      usedQuestions.add(question.question);
    }
  }

  return questions;
}
