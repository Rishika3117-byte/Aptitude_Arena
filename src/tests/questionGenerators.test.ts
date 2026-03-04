import { strict as assert } from 'assert';
import {
    generateQuantitativeQuestion,
    generateQuestionSet,
    Question,
} from '../react-app/utils/questionGenerators';

describe('questionGenerators', () => {
    // ─── Question interface shape ────────────────────────────────────────────────
    describe('Question interface', () => {
        it('should have all required fields', () => {
            const q: Question = generateQuantitativeQuestion(1);
            assert.ok(typeof q.id === 'string', 'id should be a string');
            assert.ok(typeof q.question === 'string', 'question should be a string');
            assert.ok(Array.isArray(q.options), 'options should be an array');
            assert.ok(typeof q.correctAnswer === 'number', 'correctAnswer should be a number');
            assert.ok(typeof q.explanation === 'string', 'explanation should be a string');
            assert.ok(typeof q.topic === 'string', 'topic should be a string');
            assert.ok(typeof q.hint === 'string', 'hint should be a string');
        });
    });

    // ─── generateQuantitativeQuestion ───────────────────────────────────────────
    describe('generateQuantitativeQuestion()', () => {
        it('should return a question object', () => {
            const q = generateQuantitativeQuestion(1);
            assert.ok(q, 'should return a non-null object');
        });

        it('should have exactly 4 options', () => {
            for (let i = 0; i < 10; i++) {
                const q = generateQuantitativeQuestion(i + 1);
                assert.strictEqual(q.options.length, 4, `level ${i + 1}: options.length should be 4`);
            }
        });

        it('should have correctAnswer within options index range [0, 3]', () => {
            for (let i = 0; i < 20; i++) {
                const q = generateQuantitativeQuestion(i + 1);
                assert.ok(
                    q.correctAnswer >= 0 && q.correctAnswer <= 3,
                    `level ${i + 1}: correctAnswer ${q.correctAnswer} out of range`
                );
            }
        });

        it('should have a non-empty question string', () => {
            for (let i = 0; i < 10; i++) {
                const q = generateQuantitativeQuestion(i + 1);
                assert.ok(q.question.length > 0, 'question string should not be empty');
            }
        });

        it('options[correctAnswer] should be the correct answer listed in explanation', () => {
            // Run multiple times due to random nature
            for (let i = 0; i < 15; i++) {
                const q = generateQuantitativeQuestion(5);
                const selectedOption = q.options[q.correctAnswer];
                assert.ok(
                    q.explanation.includes(selectedOption),
                    `explanation should mention the correct option "${selectedOption}"`
                );
            }
        });

        it('should cover multiple topics across many calls', () => {
            const topics = new Set<string>();
            for (let i = 0; i < 100; i++) {
                topics.add(generateQuantitativeQuestion(10).topic);
            }
            // With 7 question types, 100 calls should hit several topics
            assert.ok(topics.size >= 3, `only ${topics.size} unique topics found - expected at least 3`);
        });

        it('should work at high level (level 50)', () => {
            assert.doesNotThrow(() => generateQuantitativeQuestion(50));
        });

        it('should work at default level', () => {
            assert.doesNotThrow(() => generateQuantitativeQuestion());
        });
    });

    // ─── generateQuestionSet ────────────────────────────────────────────────────
    describe('generateQuestionSet()', () => {
        it('should return the requested number of questions', () => {
            const qs = generateQuestionSet(5, 1);
            assert.strictEqual(qs.length, 5);
        });

        it('should return an array of Question objects', () => {
            const qs = generateQuestionSet(3, 1);
            qs.forEach((q, i) => {
                assert.ok(typeof q.id === 'string', `q[${i}].id not a string`);
                assert.ok(typeof q.question === 'string', `q[${i}].question not a string`);
                assert.ok(Array.isArray(q.options), `q[${i}].options not an array`);
                assert.strictEqual(q.options.length, 4, `q[${i}].options length should be 4`);
                assert.ok(typeof q.correctAnswer === 'number', `q[${i}].correctAnswer not a number`);
            });
        });

        it('should return unique questions (no duplicate question text)', () => {
            const qs = generateQuestionSet(5, 1);
            const texts = qs.map((q) => q.question);
            const unique = new Set(texts);
            assert.strictEqual(unique.size, texts.length, 'duplicate questions detected');
        });

        it('should work with count = 1', () => {
            const qs = generateQuestionSet(1, 1);
            assert.strictEqual(qs.length, 1);
        });

        it('should work with default level', () => {
            const qs = generateQuestionSet(3);
            assert.strictEqual(qs.length, 3);
        });

        it('should work at higher levels', () => {
            const qs = generateQuestionSet(5, 30);
            assert.strictEqual(qs.length, 5);
        });
    });
});
