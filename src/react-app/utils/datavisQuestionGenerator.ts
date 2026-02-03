import { Question } from './questionGenerators';

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

// Bar Chart Interpretation
function generateBarChartQuestion(): Question {
  const months = ['Jan', 'Feb', 'Mar', 'Apr'];
  const values = [randomInt(50, 100), randomInt(50, 100), randomInt(50, 100), randomInt(50, 100)];
  const max = Math.max(...values);
  const maxMonth = months[values.indexOf(max)];
  
  let wrong1 = months[randomInt(0, 3)];
  while (wrong1 === maxMonth) {
    wrong1 = months[randomInt(0, 3)];
  }
  let wrong2 = months[randomInt(0, 3)];
  while (wrong2 === maxMonth || wrong2 === wrong1) {
    wrong2 = months[randomInt(0, 3)];
  }
  let wrong3 = months[randomInt(0, 3)];
  while (wrong3 === maxMonth || wrong3 === wrong1 || wrong3 === wrong2) {
    wrong3 = months[randomInt(0, 3)];
  }
  
  const options = shuffle([maxMonth, wrong1, wrong2, wrong3]);
  
  return {
    id: `bar-${Date.now()}-${Math.random()}`,
    question: `Sales data: Jan=${values[0]}, Feb=${values[1]}, Mar=${values[2]}, Apr=${values[3]}. Which month had highest sales?`,
    options,
    correctAnswer: options.indexOf(maxMonth),
    explanation: `${maxMonth} had the highest sales with ${max} units.`,
    topic: 'Bar Charts',
    hint: `Method: Compare all values to find the maximum\nValues: Jan=${values[0]}, Feb=${values[1]}, Mar=${values[2]}, Apr=${values[3]}\nHighest: ${maxMonth} with ${max} units\nAnswer: ${maxMonth}`,
  };
}

// Pie Chart Analysis
function generatePieChartQuestion(): Question {
  const categories = ['Product A', 'Product B', 'Product C', 'Product D'];
  const percentages = [randomInt(15, 35), randomInt(15, 35), randomInt(15, 35), randomInt(10, 25)];
  const total = percentages.reduce((a, b) => a + b, 0);
  const normalized = percentages.map(p => Math.round((p / total) * 100));
  
  const max = Math.max(...normalized);
  const maxCategory = categories[normalized.indexOf(max)];
  
  const wrong1 = categories[(normalized.indexOf(max) + 1) % categories.length];
  const wrong2 = categories[(normalized.indexOf(max) + 2) % categories.length];
  const wrong3 = categories[(normalized.indexOf(max) + 3) % categories.length];
  
  const options = shuffle([maxCategory, wrong1, wrong2, wrong3]);
  
  return {
    id: `pie-${Date.now()}-${Math.random()}`,
    question: `Market share: A=${normalized[0]}%, B=${normalized[1]}%, C=${normalized[2]}%, D=${normalized[3]}%. Which has largest share?`,
    options,
    correctAnswer: options.indexOf(maxCategory),
    explanation: `${maxCategory} has the largest market share at ${max}%.`,
    topic: 'Pie Charts',
    hint: `Method: Compare percentages to find the largest\nA=${normalized[0]}%, B=${normalized[1]}%, C=${normalized[2]}%, D=${normalized[3]}%\nLargest: ${maxCategory} at ${max}%\nAnswer: ${maxCategory}`,
  };
}

// Line Graph Trends
function generateLineGraphQuestion(): Question {
  const values = [randomInt(100, 200), randomInt(120, 220), randomInt(140, 240), randomInt(160, 260)];
  const increase = values[3] - values[0];
  
  const wrong1 = increase + randomInt(10, 30);
  const wrong2 = increase - randomInt(10, 30);
  const wrong3 = Math.round(increase * 1.5);
  
  const options = shuffle([
    increase.toString(),
    wrong1.toString(),
    wrong2.toString(),
    wrong3.toString(),
  ]);
  
  return {
    id: `line-${Date.now()}-${Math.random()}`,
    question: `Revenue trend: 2020=${values[0]}, 2021=${values[1]}, 2022=${values[2]}, 2023=${values[3]}. What's the total increase from 2020 to 2023?`,
    options,
    correctAnswer: options.indexOf(increase.toString()),
    explanation: `The increase is ${values[3]} - ${values[0]} = ${increase}.`,
    topic: 'Line Graphs',
    hint: `Formula: Total increase = Final value - Initial value\n2023 value: ${values[3]}\n2020 value: ${values[0]}\nIncrease = ${values[3]} - ${values[0]} = ${increase}\nAnswer: ${increase}`,
  };
}

// Table Data
function generateTableQuestion(): Question {
  const cities = ['City A', 'City B', 'City C'];
  const populations = [randomInt(500, 1000), randomInt(500, 1000), randomInt(500, 1000)];
  const total = populations.reduce((a, b) => a + b, 0);
  const avg = Math.round(total / cities.length);
  
  const wrong1 = avg + randomInt(50, 100);
  const wrong2 = avg - randomInt(50, 100);
  const wrong3 = Math.round(total / 2);
  
  const options = shuffle([
    avg.toString(),
    wrong1.toString(),
    wrong2.toString(),
    wrong3.toString(),
  ]);
  
  return {
    id: `table-${Date.now()}-${Math.random()}`,
    question: `Population data: City A=${populations[0]}k, City B=${populations[1]}k, City C=${populations[2]}k. What's the average population?`,
    options,
    correctAnswer: options.indexOf(avg.toString()),
    explanation: `Average = (${populations[0]} + ${populations[1]} + ${populations[2]}) / 3 = ${avg}k.`,
    topic: 'Tables',
    hint: `To find the average, add all the values together and divide by how many values there are. This is called the arithmetic mean.`,
  };
}

// Percentage Calculations
function generatePercentageChartQuestion(): Question {
  const total = randomInt(500, 1000);
  const percentage = randomInt(20, 60);
  const value = Math.round((total * percentage) / 100);
  
  const wrong1 = Math.round((total * (percentage + 10)) / 100);
  const wrong2 = Math.round((total * (percentage - 10)) / 100);
  const wrong3 = Math.round(total / 2);
  
  const options = shuffle([
    value.toString(),
    wrong1.toString(),
    wrong2.toString(),
    wrong3.toString(),
  ]);
  
  return {
    id: `percent-${Date.now()}-${Math.random()}`,
    question: `If the total budget is ${total} and ${percentage}% is allocated to marketing, how much is the marketing budget?`,
    options,
    correctAnswer: options.indexOf(value.toString()),
    explanation: `Marketing budget = ${percentage}% of ${total} = ${value}.`,
    topic: 'Data Percentages',
    hint: `To find a percentage of a value, multiply the total by the percentage and divide by 100. Think of percentage as "per hundred".`,
  };
}

export function generateDatavisQuestion(_level: number = 1): Question {
  const generators = [
    generateBarChartQuestion,
    generatePieChartQuestion,
    generateLineGraphQuestion,
    generateTableQuestion,
    generatePercentageChartQuestion,
  ];
  
  const randomGenerator = generators[randomInt(0, generators.length - 1)];
  return randomGenerator();
}

export function generateDatavisQuestionSet(count: number, level: number = 1): Question[] {
  const questions: Question[] = [];
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
