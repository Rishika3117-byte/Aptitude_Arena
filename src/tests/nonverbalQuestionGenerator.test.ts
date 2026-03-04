import { strict as assert } from 'assert';
import {
    generateNonverbalQuestion,
    generateNonverbalQuestionSet,
} from '../react-app/utils/nonverbalQuestionGenerator';

describe('nonverbalQuestionGenerator', () => {
    const VALID_TOPICS = [
        'Pattern Completion',
        'Mirror Images',
        'Figure Counting',
        'Paper Folding',
        'Embedded Figures',
    ];

    describe('generateNonverbalQuestion()', () => {
        it('should return a valid question object', () => {
            const q = generateNonverbalQuestion(1);
            assert.ok(q, 'expected a truthy question object');
        });

        it('should have all required fields', () => {
            const q = generateNonverbalQuestion(1);
            assert.ok(typeof q.id === 'string', 'id must be string');
            assert.ok(typeof q.question === 'string', 'question must be string');
            assert.ok(Array.isArray(q.options), 'options must be array');
            assert.ok(typeof q.correctAnswer === 'number', 'correctAnswer must be number');
            assert.ok(typeof q.explanation === 'string', 'explanation must be string');
            assert.ok(typeof q.topic === 'string', 'topic must be string');
            assert.ok(typeof q.hint === 'string', 'hint must be string');
        });

        it('should always return exactly 4 options', () => {
            for (let i = 0; i < 25; i++) {
                const q = generateNonverbalQuestion(i + 1);
                assert.strictEqual(q.options.length, 4, `iteration ${i}: options.length = ${q.options.length}`);
            }
        });

        it('should have correctAnswer in range [0, 3]', () => {
            for (let i = 0; i < 25; i++) {
                const q = generateNonverbalQuestion(i + 1);
                assert.ok(
                    q.correctAnswer >= 0 && q.correctAnswer <= 3,
                    `correctAnswer ${q.correctAnswer} out of bounds`
                );
            }
        });

        it('should only produce known non-verbal topics', () => {
            for (let i = 0; i < 30; i++) {
                const q = generateNonverbalQuestion(i + 1);
                assert.ok(VALID_TOPICS.includes(q.topic), `Unknown topic: "${q.topic}"`);
            }
        });

        it('should produce multiple distinct topics over many calls', () => {
            const topics = new Set<string>();
            for (let i = 0; i < 100; i++) {
                topics.add(generateNonverbalQuestion(1).topic);
            }
            assert.ok(topics.size >= 2, `only ${topics.size} unique topics seen`);
        });

        it('should not throw for any level', () => {
            [1, 5, 10, 25, 50].forEach((lvl) => {
                assert.doesNotThrow(() => generateNonverbalQuestion(lvl), `threw at level ${lvl}`);
            });
        });

        it('should handle default level argument', () => {
            assert.doesNotThrow(() => generateNonverbalQuestion());
        });

        it('options[correctAnswer] should be a non-empty string', () => {
            for (let i = 0; i < 20; i++) {
                const q = generateNonverbalQuestion(1);
                const chosen = q.options[q.correctAnswer];
                assert.ok(typeof chosen === 'string' && chosen.length > 0, `chosen option was empty or wrong type`);
            }
        });
    });

    describe('generateNonverbalQuestionSet()', () => {
        it('should return the exact number of questions requested', () => {
            const qs = generateNonverbalQuestionSet(5, 1);
            assert.strictEqual(qs.length, 5);
        });

        it('should contain no duplicate question texts', () => {
            const qs = generateNonverbalQuestionSet(5, 1);
            const textSet = new Set(qs.map((q) => q.question));
            assert.strictEqual(textSet.size, qs.length, 'duplicate question texts found');
        });

        it('every question should have 4 options', () => {
            generateNonverbalQuestionSet(5, 1).forEach((q, i) => {
                assert.strictEqual(q.options.length, 4, `q[${i}].options.length check failed`);
            });
        });

        it('should work with count=1', () => {
            assert.strictEqual(generateNonverbalQuestionSet(1, 1).length, 1);
        });

        it('should use default level when not provided', () => {
            assert.strictEqual(generateNonverbalQuestionSet(3).length, 3);
        });
    });
});
