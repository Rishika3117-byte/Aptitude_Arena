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

// Synonyms
function generateSynonymQuestion(): Question {
  const words = [
    { word: 'HAPPY', answer: 'Joyful', wrongs: ['Sad', 'Angry', 'Tired'] },
    { word: 'FAST', answer: 'Quick', wrongs: ['Slow', 'Lazy', 'Steady'] },
    { word: 'BRAVE', answer: 'Courageous', wrongs: ['Cowardly', 'Fearful', 'Weak'] },
    { word: 'SMART', answer: 'Intelligent', wrongs: ['Dull', 'Foolish', 'Ignorant'] },
    { word: 'ANCIENT', answer: 'Old', wrongs: ['Modern', 'New', 'Recent'] },
  ];
  
  const selected = words[randomInt(0, words.length - 1)];
  const options = shuffle([selected.answer, ...selected.wrongs]);
  
  return {
    id: `synonym-${Date.now()}-${Math.random()}`,
    question: `Choose the word closest in meaning to: ${selected.word}`,
    options,
    correctAnswer: options.indexOf(selected.answer),
    explanation: `${selected.answer} is a synonym of ${selected.word}.`,
    topic: 'Synonyms',
    hint: `A synonym is a word with the same or very similar meaning. Try using each option in a sentence with the original word - which one makes sense in the same contexts?`,
  };
}

// Antonyms
function generateAntonymQuestion(): Question {
  const words = [
    { word: 'LIGHT', answer: 'Dark', wrongs: ['Bright', 'Shiny', 'Clear'] },
    { word: 'HOT', answer: 'Cold', wrongs: ['Warm', 'Boiling', 'Burning'] },
    { word: 'TALL', answer: 'Short', wrongs: ['High', 'Long', 'Big'] },
    { word: 'RICH', answer: 'Poor', wrongs: ['Wealthy', 'Affluent', 'Prosperous'] },
    { word: 'HARD', answer: 'Soft', wrongs: ['Tough', 'Solid', 'Firm'] },
  ];
  
  const selected = words[randomInt(0, words.length - 1)];
  const options = shuffle([selected.answer, ...selected.wrongs]);
  
  return {
    id: `antonym-${Date.now()}-${Math.random()}`,
    question: `Choose the word opposite in meaning to: ${selected.word}`,
    options,
    correctAnswer: options.indexOf(selected.answer),
    explanation: `${selected.answer} is an antonym of ${selected.word}.`,
    topic: 'Antonyms',
    hint: `An antonym is a word with the opposite meaning. Think about what the original word means, then look for the option that means the reverse or contrary.`,
  };
}

// Analogies
function generateAnalogyQuestion(): Question {
  const analogies = [
    { pair: 'Book : Read', answer: 'Music : Listen', wrongs: ['Food : Drink', 'Car : Fly', 'Phone : Sleep'] },
    { pair: 'Doctor : Hospital', answer: 'Teacher : School', wrongs: ['Student : Office', 'Cook : Garden', 'Pilot : Restaurant'] },
    { pair: 'Pen : Write', answer: 'Knife : Cut', wrongs: ['Spoon : Jump', 'Fork : Swim', 'Plate : Run'] },
    { pair: 'Cat : Meow', answer: 'Dog : Bark', wrongs: ['Fish : Fly', 'Bird : Swim', 'Cow : Roar'] },
  ];
  
  const selected = analogies[randomInt(0, analogies.length - 1)];
  const options = shuffle([selected.answer, ...selected.wrongs]);
  
  return {
    id: `analogy-${Date.now()}-${Math.random()}`,
    question: `${selected.pair} :: ?`,
    options,
    correctAnswer: options.indexOf(selected.answer),
    explanation: `${selected.answer} completes the analogy in the same relationship.`,
    topic: 'Analogies',
    hint: `Identify the relationship between the first pair of words. Is it cause-effect? Part-whole? Type-category? Then find the option that has the exact same type of relationship.`,
  };
}

// Sentence Completion
function generateSentenceQuestion(): Question {
  const sentences = [
    { 
      sentence: 'The weather was so ___ that we decided to stay indoors.',
      answer: 'terrible',
      wrongs: ['pleasant', 'beautiful', 'sunny']
    },
    { 
      sentence: 'She was ___ by the sudden news.',
      answer: 'shocked',
      wrongs: ['happy', 'excited', 'pleased']
    },
    { 
      sentence: 'The project was ___ due to lack of funds.',
      answer: 'abandoned',
      wrongs: ['started', 'celebrated', 'improved']
    },
  ];
  
  const selected = sentences[randomInt(0, sentences.length - 1)];
  const options = shuffle([selected.answer, ...selected.wrongs]);
  
  return {
    id: `sentence-${Date.now()}-${Math.random()}`,
    question: `Fill in the blank: ${selected.sentence}`,
    options,
    correctAnswer: options.indexOf(selected.answer),
    explanation: `${selected.answer} best completes the sentence contextually.`,
    topic: 'Sentence Completion',
    hint: `Read the sentence and understand what it's trying to say. Consider the tone, context, and grammar. Which word best completes the meaning and flows naturally?`,
  };
}

// Spotting Errors
function generateErrorQuestion(): Question {
  const sentences = [
    { 
      question: 'Find the error: "She don\'t like coffee."',
      answer: 'don\'t should be doesn\'t',
      wrongs: ['No error', 'like should be likes', 'coffee should be coffees']
    },
    { 
      question: 'Find the error: "The team are playing well."',
      answer: 'are should be is',
      wrongs: ['No error', 'playing should be plays', 'well should be good']
    },
  ];
  
  const selected = sentences[randomInt(0, sentences.length - 1)];
  const options = shuffle([selected.answer, ...selected.wrongs]);
  
  return {
    id: `error-${Date.now()}-${Math.random()}`,
    question: selected.question,
    options,
    correctAnswer: options.indexOf(selected.answer),
    explanation: `The error is: ${selected.answer}`,
    topic: 'Spotting Errors',
    hint: `Read each part of the sentence carefully. Check for: subject-verb agreement, correct tense usage, proper word forms, and logical sentence structure. One part will sound incorrect.`,
  };
}

export function generateVerbalQuestion(_level: number = 1): Question {
  const generators = [
    generateSynonymQuestion,
    generateAntonymQuestion,
    generateAnalogyQuestion,
    generateSentenceQuestion,
    generateErrorQuestion,
  ];
  
  const randomGenerator = generators[randomInt(0, generators.length - 1)];
  return randomGenerator();
}

export function generateVerbalQuestionSet(count: number, level: number = 1): Question[] {
  const questions: Question[] = [];
  const usedQuestions = new Set<string>();
  
  while (questions.length < count) {
    const question = generateVerbalQuestion(level);
    if (!usedQuestions.has(question.question)) {
      questions.push(question);
      usedQuestions.add(question.question);
    }
  }
  
  return questions;
}
