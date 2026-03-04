import { strict as assert } from 'assert';
import {
    generateLogicalQuestion,
    generateLogicalQuestionSet,
} from '../react-app/utils/logicalQuestionGenerator';

describe('logicalQuestionGenerator', () => {
    const VALID_TOPICS = [
        'Number Series',
        'Coding-Decoding',
        'Blood Relations',
        'Direction Sense',
        'Logical Deduction',
    ];

    describe('generateLogicalQuestion()', () => {
        it('should return a question object', () => {
            const q = generateLogicalQuestion(1);
            assert.ok(q, 'should return a truthy object');
        });

        it('should have all required fields', () => {
            const q = generateLogicalQuestion(1);
            assert.ok(typeof q.id === 'string', 'id should be string');
            assert.ok(typeof q.question === 'string', 'question should be string');
            assert.ok(Array.isArray(q.options), 'options should be array');
            assert.ok(typeof q.correctAnswer === 'number', 'correctAnswer should be number');
            assert.ok(typeof q.explanation === 'string', 'explanation should be string');
            assert.ok(typeof q.topic === 'string', 'topic should be string');
            assert.ok(typeof q.hint === 'string', 'hint should be string');
        });

        it('should have exactly 4 options', () => {
            for (let i = 0; i < 20; i++) {
                const q = generateLogicalQuestion(i + 1);
                assert.strictEqual(q.options.length, 4, `options.length should be 4, got ${q.options.length}`);
            }
        });

        it('should have correctAnswer in range [0, 3]', () => {
            for (let i = 0; i < 25; i++) {
                const q = generateLogicalQuestion(i + 1);
                assert.ok(
                    q.correctAnswer >= 0 && q.correctAnswer <= 3,
                    `correctAnswer ${q.correctAnswer} is out of range [0, 3]`
                );
            }
        });

        it('should produce one of the valid topics', () => {
            for (let i = 0; i < 30; i++) {
                const q = generateLogicalQuestion(i + 1);
                assert.ok(
                    VALID_TOPICS.includes(q.topic),
                    `Unexpected topic: "${q.topic}"`
                );
            }
        });

        it('should cover multiple topics across many calls', () => {
            const topics = new Set<string>();
            for (let i = 0; i < 100; i++) {
                topics.add(generateLogicalQuestion(1).topic);
            }
            assert.ok(topics.size >= 2, `Expected at least 2 unique topics, got ${topics.size}`);
        });

        it('should not throw at any level', () => {
            for (const level of [1, 5, 10, 20, 50]) {
                assert.doesNotThrow(() => generateLogicalQuestion(level), `threw at level ${level}`);
            }
        });

        it('should use default level when called with no arguments', () => {
            assert.doesNotThrow(() => generateLogicalQuestion());
        });

        it('correctAnswer index should point to the correct option', () => {
            for (let i = 0; i < 20; i++) {
                const q = generateLogicalQuestion(1);
                const chosen = q.options[q.correctAnswer];
                assert.ok(typeof chosen === 'string' && chosen.length > 0, 'chosen option should be a non-empty string');
            }
        });
    });

    describe('generateLogicalQuestionSet()', () => {
        it('should return the requested count', () => {
            const qs = generateLogicalQuestionSet(5, 1);
            assert.strictEqual(qs.length, 5);
        });

        it('should have no duplicate question texts', () => {
            const qs = generateLogicalQuestionSet(5, 1);
            const texts = new Set(qs.map((q) => q.question));
            assert.strictEqual(texts.size, qs.length, 'found duplicate questions');
        });

        it('each question should have 4 options', () => {
            const qs = generateLogicalQuestionSet(5, 1);
            qs.forEach((q, i) => {
                assert.strictEqual(q.options.length, 4, `q[${i}] options.length should be 4`);
            });
        });

        it('should work with count = 1', () => {
            assert.strictEqual(generateLogicalQuestionSet(1, 1).length, 1);
        });

        it('should work with default level', () => {
            assert.strictEqual(generateLogicalQuestionSet(3).length, 3);
        });
    });
});
