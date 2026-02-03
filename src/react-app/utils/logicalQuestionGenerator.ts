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

// Number Series
function generateNumberSeriesQuestion(): Question {
  const patterns = [
    { name: 'Add constant', gen: (start: number, diff: number) => Array.from({ length: 5 }, (_, i) => start + i * diff) },
    { name: 'Multiply constant', gen: (start: number, mult: number) => Array.from({ length: 5 }, (_, i) => start * Math.pow(mult, i)) },
    { name: 'Square sequence', gen: (start: number, _param?: number) => Array.from({ length: 5 }, (_, i) => Math.pow(start + i, 2)) },
  ];
  
  const pattern = patterns[randomInt(0, patterns.length - 1)];
  const start = randomInt(2, 10);
  const param = randomInt(2, 5);
  
  const series = pattern.gen(start, param);
  const answer = series[series.length - 1];
  const seriesDisplay = series.slice(0, 4).join(', ') + ', ?';
  
  const wrong1 = answer + randomInt(5, 15);
  const wrong2 = answer - randomInt(5, 15);
  const wrong3 = answer * 2;
  
  const options = shuffle([
    answer.toString(),
    wrong1.toString(),
    wrong2.toString(),
    wrong3.toString(),
  ]);
  
  return {
    id: `series-${Date.now()}-${Math.random()}`,
    question: `Complete the series: ${seriesDisplay}`,
    options,
    correctAnswer: options.indexOf(answer.toString()),
    explanation: `The pattern follows ${pattern.name}. The next number is ${answer}.`,
    topic: 'Number Series',
    hint: `Look for a consistent pattern in how numbers change from one to the next. Consider: addition, subtraction, multiplication, or alternating patterns. The pattern name is: ${pattern.name}.`,
  };
}

// Coding-Decoding
function generateCodingQuestion(): Question {
  const words = ['CAT', 'DOG', 'BAT', 'RAT', 'PIG', 'COW', 'HEN'];
  const word = words[randomInt(0, words.length - 1)];
  const shift = randomInt(1, 5);
  
  const encoded = word.split('').map(char => 
    String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65)
  ).join('');
  
  const testWord = words.find(w => w !== word) || 'FOX';
  const correctAnswer = testWord.split('').map(char => 
    String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65)
  ).join('');
  
  const wrong1 = testWord.split('').map(char => 
    String.fromCharCode(((char.charCodeAt(0) - 65 + shift + 1) % 26) + 65)
  ).join('');
  const wrong2 = testWord.split('').map(char => 
    String.fromCharCode(((char.charCodeAt(0) - 65 + shift - 1) % 26) + 65)
  ).join('');
  const wrong3 = testWord.split('').reverse().join('');
  
  const options = shuffle([correctAnswer, wrong1, wrong2, wrong3]);
  
  return {
    id: `coding-${Date.now()}-${Math.random()}`,
    question: `If ${word} is coded as ${encoded}, then how is ${testWord} coded?`,
    options,
    correctAnswer: options.indexOf(correctAnswer),
    explanation: `Each letter is shifted by ${shift} positions forward in the alphabet. So ${testWord} becomes ${correctAnswer}.`,
    topic: 'Coding-Decoding',
    hint: `Each letter in the word is shifted by the same number of positions in the alphabet. Count how many positions each letter moved in the example, then apply the same shift to the test word.`,
  };
}

// Blood Relations
function generateBloodRelationQuestion(): Question {
  const relations = [
    { q: "A is B's father. B is C's sister. What is A to C?", answer: 'Father', wrongs: ['Uncle', 'Brother', 'Grandfather'] },
    { q: "M is N's mother. N is O's brother. What is M to O?", answer: 'Mother', wrongs: ['Sister', 'Aunt', 'Grandmother'] },
    { q: "X is Y's brother. Y is Z's daughter. What is X to Z?", answer: 'Son', wrongs: ['Brother', 'Father', 'Uncle'] },
  ];
  
  const relation = relations[randomInt(0, relations.length - 1)];
  const options = shuffle([relation.answer, ...relation.wrongs]);
  
  return {
    id: `blood-${Date.now()}-${Math.random()}`,
    question: relation.q,
    options,
    correctAnswer: options.indexOf(relation.answer),
    explanation: `Based on the relationships described, the answer is ${relation.answer}.`,
    topic: 'Blood Relations',
    hint: `Draw a family tree or diagram to visualize the relationships. Trace each connection step by step - who is related to whom and how. Remember: brother/sister, father/mother, son/daughter relationships.`,
  };
}

// Direction Sense
function generateDirectionQuestion(): Question {
  const directions = ['North', 'South', 'East', 'West'];
  const distance1 = randomInt(5, 15);
  const distance2 = randomInt(5, 15);
  
  const dir1 = directions[randomInt(0, 3)];
  let dir2 = directions[randomInt(0, 3)];
  while (dir2 === dir1) {
    dir2 = directions[randomInt(0, 3)];
  }
  
  const options = shuffle(directions);
  const correctIdx = randomInt(0, 3);
  
  return {
    id: `direction-${Date.now()}-${Math.random()}`,
    question: `A person walks ${distance1}m ${dir1}, then turns and walks ${distance2}m ${dir2}. In which direction is he from the starting point?`,
    options,
    correctAnswer: correctIdx,
    explanation: `After walking ${dir1} and then ${dir2}, the person is in the ${options[correctIdx]} direction from the start.`,
    topic: 'Direction Sense',
    hint: `Draw the path on paper. Start at a point, then move in the first direction, then turn and move in the second direction. Now imagine a straight line from start to end - which direction is it?`,
  };
}

// Logical Deduction
function generateLogicalDeductionQuestion(): Question {
  const statements = [
    {
      q: "All roses are flowers. Some flowers are red. Which conclusion follows?",
      answer: "Some roses may be red",
      wrongs: ["All roses are red", "No roses are red", "All flowers are roses"]
    },
    {
      q: "No cats are dogs. All dogs are animals. Which conclusion follows?",
      answer: "Some animals are not cats",
      wrongs: ["All animals are cats", "No animals are cats", "All cats are animals"]
    },
  ];
  
  const statement = statements[randomInt(0, statements.length - 1)];
  const options = shuffle([statement.answer, ...statement.wrongs]);
  
  return {
    id: `deduction-${Date.now()}-${Math.random()}`,
    question: statement.q,
    options,
    correctAnswer: options.indexOf(statement.answer),
    explanation: `The logical conclusion is: ${statement.answer}`,
    topic: 'Logical Deduction',
    hint: `Read each statement carefully. Look for logical connections - what must be true if these statements are true? Eliminate options that contradict the given facts or require assumptions.`,
  };
}

export function generateLogicalQuestion(_level: number = 1): Question {
  const generators = [
    generateNumberSeriesQuestion,
    generateCodingQuestion,
    generateBloodRelationQuestion,
    generateDirectionQuestion,
    generateLogicalDeductionQuestion,
  ];
  
  const randomGenerator = generators[randomInt(0, generators.length - 1)];
  return randomGenerator();
}

export function generateLogicalQuestionSet(count: number, level: number = 1): Question[] {
  const questions: Question[] = [];
  const usedQuestions = new Set<string>();
  
  while (questions.length < count) {
    const question = generateLogicalQuestion(level);
    if (!usedQuestions.has(question.question)) {
      questions.push(question);
      usedQuestions.add(question.question);
    }
  }
  
  return questions;
}
