import { strict as assert } from 'assert';
import {
    generateVerbalQuestion,
    generateVerbalQuestionSet,
} from '../react-app/utils/verbalQuestionGenerator';

describe('verbalQuestionGenerator', () => {
    const VALID_TOPICS = [
        'Synonyms',
        'Antonyms',
        'Analogies',
        'Sentence Completion',
        'Spotting Errors',
    ];

    describe('generateVerbalQuestion()', () => {
        it('should return a valid question object', () => {
            const q = generateVerbalQuestion(1);
            assert.ok(q, 'expected a truthy object');
        });

        it('should have all required fields', () => {
            const q = generateVerbalQuestion(1);
            assert.ok(typeof q.id === 'string');
            assert.ok(typeof q.question === 'string');
            assert.ok(Array.isArray(q.options));
            assert.ok(typeof q.correctAnswer === 'number');
            assert.ok(typeof q.explanation === 'string');
            assert.ok(typeof q.topic === 'string');
            assert.ok(typeof q.hint === 'string');
        });

        it('should always have exactly 4 options', () => {
            for (let i = 0; i < 25; i++) {
                const q = generateVerbalQuestion(i + 1);
                assert.strictEqual(q.options.length, 4, `options.length was ${q.options.length} at iteration ${i}`);
            }
        });

        it('should have correctAnswer in range [0, 3]', () => {
            for (let i = 0; i < 25; i++) {
                const q = generateVerbalQuestion(i + 1);
                assert.ok(
                    q.correctAnswer >= 0 && q.correctAnswer <= 3,
                    `correctAnswer ${q.correctAnswer} out of range`
                );
            }
        });

        it('should produce one of the known verbal topics', () => {
            for (let i = 0; i < 30; i++) {
                const q = generateVerbalQuestion(i + 1);
                assert.ok(VALID_TOPICS.includes(q.topic), `Unexpected topic: "${q.topic}"`);
            }
        });

        it('should cover multiple topics over many calls', () => {
            const topicsFound = new Set<string>();
            for (let i = 0; i < 100; i++) {
                topicsFound.add(generateVerbalQuestion(1).topic);
            }
            assert.ok(topicsFound.size >= 2, `Expected ≥2 distinct topics, got ${topicsFound.size}`);
        });

        it('should not throw at any level', () => {
            for (const lvl of [1, 5, 10, 20, 50]) {
                assert.doesNotThrow(() => generateVerbalQuestion(lvl));
            }
        });

        it('should work with default level argument', () => {
            assert.doesNotThrow(() => generateVerbalQuestion());
        });

        it('the correct option should be a non-empty string', () => {
            for (let i = 0; i < 20; i++) {
                const q = generateVerbalQuestion(1);
                const picked = q.options[q.correctAnswer];
                assert.ok(typeof picked === 'string' && picked.length > 0);
            }
        });
    });

    describe('generateVerbalQuestionSet()', () => {
        it('should return the exact requested count', () => {
            const qs = generateVerbalQuestionSet(5, 1);
            assert.strictEqual(qs.length, 5);
        });

        it('should contain no duplicate question texts', () => {
            const qs = generateVerbalQuestionSet(5, 1);
            const texts = new Set(qs.map((q) => q.question));
            assert.strictEqual(texts.size, qs.length, 'duplicate question texts found');
        });

        it('every question should have 4 options', () => {
            const qs = generateVerbalQuestionSet(4, 1);
            qs.forEach((q, i) =>
                assert.strictEqual(q.options.length, 4, `q[${i}].options.length ≠ 4`)
            );
        });

        it('should work with count = 1', () => {
            assert.strictEqual(generateVerbalQuestionSet(1).length, 1);
        });

        it('should work with default level', () => {
            assert.strictEqual(generateVerbalQuestionSet(3).length, 3);
        });
    });
});
