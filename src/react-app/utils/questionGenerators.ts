export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  hint: string;
}

// Utility to shuffle array
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Generate unique random number
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Percentage Questions - Enhanced with level scaling
function generatePercentageQuestion(level: number = 1): Question {
  const difficulty = Math.min(Math.floor(level / 10), 5);
  const baseMin = 200 + (level * 100);
  const baseMax = 1000 + (level * 200);
  const percentMin = 10 + (level * 5);
  const percentMax = 50 + (level * 10);
  
  const base = randomInt(baseMin, baseMax);
  const percent = randomInt(percentMin, Math.min(percentMax, 90));
  
  // Add complexity based on difficulty
  let result: number;
  let questionText: string;
  
  if (difficulty >= 4) {
    // Advanced: Compound percentages
    const percent2 = randomInt(10, 30);
    const intermediate = (base * percent) / 100;
    result = (intermediate * percent2) / 100;
    questionText = `What is ${percent2}% of ${percent}% of ${base}?`;
  } else if (difficulty >= 2) {
    // Intermediate: Percentage increase/decrease
    result = base + (base * percent) / 100;
    questionText = `If ${base} is increased by ${percent}%, what is the new value?`;
  } else {
    // Basic: Simple percentage
    result = (base * percent) / 100;
    questionText = `What is ${percent}% of ${base}?`;
  }
  
  const wrong1 = result + randomInt(10 * (difficulty + 1), 50 * (difficulty + 1));
  const wrong2 = result - randomInt(10 * (difficulty + 1), 50 * (difficulty + 1));
  const wrong3 = Math.round(result * 1.5);
  
  const options = shuffle([
    Math.round(result).toString(),
    Math.round(wrong1).toString(),
    Math.round(wrong2).toString(),
    Math.round(wrong3).toString(),
  ]);
  
  return {
    id: `perc-${Date.now()}-${Math.random()}`,
    question: questionText,
    options,
    correctAnswer: options.indexOf(Math.round(result).toString()),
    explanation: `Using percentage formula: ${Math.round(result)}`,
    topic: 'Percentages',
    hint: `To find a percentage of a number, multiply the number by the percentage and divide by 100. For compound percentages, calculate step by step. Double-check your arithmetic.`,
  };
}

// Ratio Questions - Enhanced
function generateRatioQuestion(level: number = 1): Question {
  const difficulty = Math.min(Math.floor(level / 10), 5);
  const ratioMax = 8 + Math.floor(level / 2);
  
  let questionText: string;
  let partA: number;
  let total: number;
  
  if (difficulty >= 3) {
    // Advanced: Three-part ratio
    const a = randomInt(2, ratioMax);
    const b = randomInt(2, ratioMax);
    const c = randomInt(2, ratioMax);
    total = randomInt(200 + (level * 50), 800 + (level * 100));
    const sum = a + b + c;
    partA = Math.floor((total * a) / sum);
    questionText = `Divide ${total} in the ratio ${a}:${b}:${c}. What is the first share?`;
  } else {
    // Basic: Two-part ratio
    const a = randomInt(2, ratioMax);
    const b = randomInt(2, ratioMax);
    total = randomInt(100 + (level * 50), 500 + (level * 100));
    const sum = a + b;
    partA = Math.floor((total * a) / sum);
    questionText = `Divide ${total} in the ratio ${a}:${b}. What is the larger share?`;
  }
  
  const wrong1 = partA + randomInt(20, 60);
  const wrong2 = partA - randomInt(20, 60);
  const wrong3 = Math.floor(total / 2);
  
  const options = shuffle([
    partA.toString(),
    wrong1.toString(),
    wrong2.toString(),
    wrong3.toString(),
  ]);
  
  return {
    id: `ratio-${Date.now()}-${Math.random()}`,
    question: questionText,
    options,
    correctAnswer: options.indexOf(partA.toString()),
    explanation: `The share is ${partA}`,
    topic: 'Ratios',
    hint: `First, add up all the ratio parts. Then divide the total by this sum to get one part's value. Multiply by the specific ratio number to get each share.`,
  };
}

// Profit & Loss Questions - Enhanced
function generateProfitLossQuestion(level: number = 1): Question {
  const difficulty = Math.min(Math.floor(level / 10), 5);
  const cpMin = 500 + (level * 200);
  const cpMax = 2000 + (level * 500);
  const cp = randomInt(cpMin, cpMax);
  
  let questionText: string;
  let answer: number;
  
  if (difficulty >= 4) {
    // Advanced: Calculate profit percentage
    const sp = cp + randomInt(100, 500);
    const profitPercent = ((sp - cp) / cp) * 100;
    answer = profitPercent;
    questionText = `An item cost $${cp} and was sold for $${sp}. What is the profit percentage?`;
  } else if (difficulty >= 2) {
    // Intermediate: Calculate selling price for loss
    const lossPercent = randomInt(10, 30);
    answer = cp - (cp * lossPercent) / 100;
    questionText = `An item was bought for $${cp}. If it was sold at a loss of ${lossPercent}%, what is the selling price?`;
  } else {
    // Basic: Calculate selling price for profit
    const profitPercent = randomInt(10 + level * 5, 40 + level * 10);
    answer = cp + (cp * profitPercent) / 100;
    questionText = `An item was bought for $${cp}. If it was sold at a profit of ${profitPercent}%, what is the selling price?`;
  }
  
  const wrong1 = answer + randomInt(50, 200);
  const wrong2 = answer - randomInt(50, 200);
  const wrong3 = answer * 1.2;
  
  const options = shuffle([
    answer.toFixed(difficulty >= 4 ? 1 : 0),
    wrong1.toFixed(difficulty >= 4 ? 1 : 0),
    wrong2.toFixed(difficulty >= 4 ? 1 : 0),
    wrong3.toFixed(difficulty >= 4 ? 1 : 0),
  ]);
  
  return {
    id: `profit-${Date.now()}-${Math.random()}`,
    question: questionText,
    options,
    correctAnswer: options.indexOf(answer.toFixed(difficulty >= 4 ? 1 : 0)),
    explanation: `The answer is ${answer.toFixed(difficulty >= 4 ? 1 : 0)}`,
    topic: 'Profit & Loss',
    hint: `Profit = Selling Price - Cost Price. Loss = Cost Price - Selling Price. For percentages: (Profit or Loss / Cost Price) × 100. Check if you're calculating profit or loss.`,
  };
}

// Time & Work Questions - Enhanced
function generateTimeWorkQuestion(level: number = 1): Question {
  const difficulty = Math.min(Math.floor(level / 10), 5);
  const maxDays = 30 + (level * 10);
  const minDays = Math.max(5, 10 - level);
  
  let questionText: string;
  let answer: number;
  
  if (difficulty >= 3) {
    // Advanced: Three people working together
    const daysA = randomInt(minDays, maxDays);
    const daysB = randomInt(minDays, maxDays);
    const daysC = randomInt(minDays, maxDays);
    const rateA = 1 / daysA;
    const rateB = 1 / daysB;
    const rateC = 1 / daysC;
    const combinedRate = rateA + rateB + rateC;
    answer = 1 / combinedRate;
    questionText = `A can do work in ${daysA} days, B in ${daysB} days, and C in ${daysC} days. How many days if they work together?`;
  } else {
    // Basic: Two people working together
    const daysA = randomInt(minDays, maxDays);
    const daysB = randomInt(minDays, maxDays);
    const rateA = 1 / daysA;
    const rateB = 1 / daysB;
    const combinedRate = rateA + rateB;
    answer = 1 / combinedRate;
    questionText = `A can complete a work in ${daysA} days and B can complete it in ${daysB} days. How many days will they take working together?`;
  }
  
  const wrong1 = answer + randomInt(2, 8);
  const wrong2 = answer - randomInt(2, 8);
  const wrong3 = answer * 2;
  
  const options = shuffle([
    answer.toFixed(1),
    wrong1.toFixed(1),
    wrong2.toFixed(1),
    wrong3.toFixed(1),
  ]);
  
  return {
    id: `work-${Date.now()}-${Math.random()}`,
    question: questionText,
    options,
    correctAnswer: options.indexOf(answer.toFixed(1)),
    explanation: `Working together takes ${answer.toFixed(1)} days`,
    topic: 'Time & Work',
    hint: `When people work together, add their work rates (1/time for each person). The combined rate is the sum. Then take 1 divided by the combined rate to get total time.`,
  };
}

// Speed Distance Time Questions - Enhanced
function generateSpeedQuestion(level: number = 1): Question {
  const difficulty = Math.min(Math.floor(level / 10), 5);
  
  let questionText: string;
  let answer: number;
  
  if (difficulty >= 4) {
    // Advanced: Relative speed problems
    const speed1 = randomInt(40 + level * 5, 100 + level * 10);
    const speed2 = randomInt(40 + level * 5, 100 + level * 10);
    const distance = randomInt(200, 600);
    answer = distance / (speed1 + speed2);
    questionText = `Two cars ${distance}km apart travel towards each other at ${speed1}km/h and ${speed2}km/h. When will they meet?`;
  } else if (difficulty >= 2) {
    // Intermediate: Calculate speed
    const distance = randomInt(100 + level * 50, 500 + level * 100);
    const time = randomInt(2, 8);
    answer = distance / time;
    questionText = `A car travels ${distance}km in ${time} hours. What is its speed?`;
  } else {
    // Basic: Calculate time
    const distance = randomInt(100 + level * 50, 500 + level * 100);
    const speed = randomInt(40 + level * 10, 100 + level * 20);
    answer = distance / speed;
    questionText = `A car travels ${distance}km at ${speed}km/h. How many hours does it take?`;
  }
  
  const wrong1 = answer + randomInt(1, 5);
  const wrong2 = answer - randomInt(1, 5);
  const wrong3 = answer * 1.5;
  
  const options = shuffle([
    answer.toFixed(1),
    wrong1.toFixed(1),
    wrong2.toFixed(1),
    wrong3.toFixed(1),
  ]);
  
  return {
    id: `speed-${Date.now()}-${Math.random()}`,
    question: questionText,
    options,
    correctAnswer: options.indexOf(answer.toFixed(1)),
    explanation: `The answer is ${answer.toFixed(1)}`,
    topic: 'Speed, Distance & Time',
    hint: `Remember: Speed = Distance ÷ Time, Distance = Speed × Time, Time = Distance ÷ Speed. For relative speed problems, add speeds when moving toward each other.`,
  };
}

// Age Problems - New question type
function generateAgeQuestion(level: number = 1): Question {
  const currentAge = randomInt(20 + level, 50 + level * 2);
  const yearsAgo = randomInt(5, 15);
  const yearsFuture = randomInt(5, 15);
  
  const types = [
    {
      question: `A person is currently ${currentAge} years old. How old were they ${yearsAgo} years ago?`,
      answer: currentAge - yearsAgo,
    },
    {
      question: `A person is currently ${currentAge} years old. How old will they be in ${yearsFuture} years?`,
      answer: currentAge + yearsFuture,
    },
    {
      question: `${yearsAgo} years ago, a person was ${currentAge - yearsAgo} years old. What is their current age?`,
      answer: currentAge,
    },
  ];
  
  const selected = types[randomInt(0, types.length - 1)];
  const wrong1 = selected.answer + randomInt(3, 10);
  const wrong2 = selected.answer - randomInt(3, 10);
  const wrong3 = selected.answer + randomInt(15, 25);
  
  const options = shuffle([
    selected.answer.toString(),
    wrong1.toString(),
    wrong2.toString(),
    wrong3.toString(),
  ]);
  
  return {
    id: `age-${Date.now()}-${Math.random()}`,
    question: selected.question,
    options,
    correctAnswer: options.indexOf(selected.answer.toString()),
    explanation: `The answer is ${selected.answer} years`,
    topic: 'Age Problems',
    hint: `Draw a timeline if needed. Add years to find future age, subtract years to find past age. If given past age, add back to find current age.`,
  };
}

// Mixture & Alligation - New question type
function generateMixtureQuestion(level: number = 1): Question {
  const price1 = randomInt(20 + level * 5, 50 + level * 10);
  const price2 = randomInt(30 + level * 5, 60 + level * 10);
  const quantity1 = randomInt(5, 20);
  const quantity2 = randomInt(5, 20);
  
  const totalCost = (price1 * quantity1) + (price2 * quantity2);
  const totalQuantity = quantity1 + quantity2;
  const avgPrice = totalCost / totalQuantity;
  
  const wrong1 = avgPrice + randomInt(5, 15);
  const wrong2 = avgPrice - randomInt(5, 15);
  const wrong3 = (price1 + price2) / 2;
  
  const options = shuffle([
    avgPrice.toFixed(1),
    wrong1.toFixed(1),
    wrong2.toFixed(1),
    wrong3.toFixed(1),
  ]);
  
  return {
    id: `mixture-${Date.now()}-${Math.random()}`,
    question: `Mix ${quantity1}kg of tea at $${price1}/kg with ${quantity2}kg at $${price2}/kg. What is the average price per kg?`,
    options,
    correctAnswer: options.indexOf(avgPrice.toFixed(1)),
    explanation: `Average price = Total cost / Total quantity = ${avgPrice.toFixed(1)}`,
    topic: 'Mixtures',
    hint: `Calculate total cost of each item (quantity × price). Add all costs together. Divide by total quantity. This gives the average price per unit.`,
  };
}

// Main generator that randomly picks a question type based on level
export function generateQuantitativeQuestion(level: number = 1): Question {
  const generators = [
    () => generatePercentageQuestion(level),
    () => generateRatioQuestion(level),
    () => generateProfitLossQuestion(level),
    () => generateTimeWorkQuestion(level),
    () => generateSpeedQuestion(level),
    () => generateAgeQuestion(level),
    () => generateMixtureQuestion(level),
  ];
  
  const randomGenerator = generators[randomInt(0, generators.length - 1)];
  return randomGenerator();
}

// Generate a set of unique questions
export function generateQuestionSet(count: number, level: number = 1): Question[] {
  const questions: Question[] = [];
  const usedQuestions = new Set<string>();
  
  let attempts = 0;
  const maxAttempts = count * 10; // Prevent infinite loops
  
  while (questions.length < count && attempts < maxAttempts) {
    const question = generateQuantitativeQuestion(level);
    if (!usedQuestions.has(question.question)) {
      questions.push(question);
      usedQuestions.add(question.question);
    }
    attempts++;
  }
  
  return questions;
}
