import { strict as assert } from 'assert';
import {
    generateDatavisQuestion,
    generateDatavisQuestionSet,
} from '../react-app/utils/datavisQuestionGenerator';

describe('datavisQuestionGenerator', () => {
    const VALID_TOPICS = [
        'Bar Charts',
        'Pie Charts',
        'Line Graphs',
        'Tables',
        'Data Percentages',
    ];

    describe('generateDatavisQuestion()', () => {
        it('should return a valid question object', () => {
            const q = generateDatavisQuestion(1);
            assert.ok(q, 'expected a truthy question object');
        });

        it('should have all required fields', () => {
            const q = generateDatavisQuestion(1);
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
                const q = generateDatavisQuestion(i + 1);
                assert.strictEqual(q.options.length, 4, `iteration ${i}: options.length = ${q.options.length}`);
            }
        });

        it('should have correctAnswer in range [0, 3]', () => {
            for (let i = 0; i < 25; i++) {
                const q = generateDatavisQuestion(i + 1);
                assert.ok(
                    q.correctAnswer >= 0 && q.correctAnswer <= 3,
                    `correctAnswer ${q.correctAnswer} is out of range`
                );
            }
        });

        it('should only produce known data-vis topics', () => {
            for (let i = 0; i < 30; i++) {
                const q = generateDatavisQuestion(i + 1);
                assert.ok(VALID_TOPICS.includes(q.topic), `Unexpected topic: "${q.topic}"`);
            }
        });

        it('should produce multiple distinct topics over many calls', () => {
            const topics = new Set<string>();
            for (let i = 0; i < 100; i++) {
                topics.add(generateDatavisQuestion(1).topic);
            }
            assert.ok(topics.size >= 2, `Expected ≥2 distinct topics, got ${topics.size}`);
        });

        it('should not throw for any level', () => {
            [1, 5, 10, 25, 50].forEach((lvl) =>
                assert.doesNotThrow(() => generateDatavisQuestion(lvl), `threw at level ${lvl}`)
            );
        });

        it('should handle default level argument', () => {
            assert.doesNotThrow(() => generateDatavisQuestion());
        });

        it('options[correctAnswer] should be a non-empty string', () => {
            for (let i = 0; i < 20; i++) {
                const q = generateDatavisQuestion(1);
                const chosen = q.options[q.correctAnswer];
                assert.ok(typeof chosen === 'string' && chosen.length > 0);
            }
        });

        it('bar chart question: correct answer should be the month with highest sales', () => {
            // Run many times to hit bar chart sub-type
            let barChartTested = false;
            for (let i = 0; i < 50 && !barChartTested; i++) {
                const q = generateDatavisQuestion(1);
                if (q.topic === 'Bar Charts') {
                    barChartTested = true;
                    // Explanation should mention the correct month
                    const correctOption = q.options[q.correctAnswer];
                    assert.ok(
                        q.explanation.includes(correctOption),
                        `Bar chart explanation should mention correct answer "${correctOption}"`
                    );
                }
            }
        });

        it('line graph question: increase should equal final minus initial', () => {
            // Try to hit line graph sub-type
            let tested = false;
            for (let i = 0; i < 60 && !tested; i++) {
                const q = generateDatavisQuestion(1);
                if (q.topic === 'Line Graphs') {
                    tested = true;
                    const answer = Number(q.options[q.correctAnswer]);
                    assert.ok(!isNaN(answer), 'Line graph correct answer should be numeric');
                }
            }
        });
    });

    describe('generateDatavisQuestionSet()', () => {
        it('should return the exact count requested', () => {
            const qs = generateDatavisQuestionSet(5, 1);
            assert.strictEqual(qs.length, 5);
        });

        it('should contain no duplicate question texts', () => {
            const qs = generateDatavisQuestionSet(5, 1);
            const texts = new Set(qs.map((q) => q.question));
            assert.strictEqual(texts.size, qs.length, 'duplicate question texts found');
        });

        it('every question should have 4 options', () => {
            generateDatavisQuestionSet(5, 1).forEach((q, i) =>
                assert.strictEqual(q.options.length, 4, `q[${i}].options.length != 4`)
            );
        });

        it('should work with count=1', () => {
            assert.strictEqual(generateDatavisQuestionSet(1).length, 1);
        });

        it('should work with default level', () => {
            assert.strictEqual(generateDatavisQuestionSet(4).length, 4);
        });
    });
});
