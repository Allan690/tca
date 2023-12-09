const fs = require('fs');
const { readInputFile, findGoodiesDistribution, writeOutputToFile } = require('./index');

jest.mock('fs');

describe('Goodies Distribution', () => {
    describe('readInputFile', () => {
        it('should parse number of employees and goodies correctly', () => {
            const mockData = 'Number of employees: 4\nGoodies and Prices:\nFitbit Plus: 7980\nIPods: 22349';
            fs.readFileSync.mockReturnValue(mockData);

            const filePath = 'test.txt';
            const result = readInputFile(filePath);

            expect(result).toEqual({
                numberOfEmployees: 4,
                goodies: [
                    { name: 'Fitbit Plus', price: 7980 },
                    { name: 'IPods', price: 22349 }
                ]
            });
        });
    });

    describe('findGoodiesDistribution', () => {
        it('should find the optimal distribution of goodies', () => {
            const goodies = [
                { name: 'Goodie1', price: 100 },
                { name: 'Goodie2', price: 500 },
                { name: 'Goodie3', price: 300 }
            ];
            const numberOfEmployees = 2;

            const result = findGoodiesDistribution(numberOfEmployees, goodies);

            expect(result).toEqual({
                chosenGoodies: [
                    { name: 'Goodie1', price: 100 },
                    { name: 'Goodie3', price: 300 }
                ],
                minDiff: 200
            });
        });
    });

    describe('writeOutputToFile', () => {
        it('should write the chosen goodies and price difference to a file', () => {
            const chosenGoodies = [
                { name: 'Goodie1', price: 100 },
                { name: 'Goodie2', price: 200 }
            ];
            const minDiff = 100;
            const filePath = 'test.txt';

            writeOutputToFile(filePath, chosenGoodies, minDiff);

            const expectedOutput = 'The goodies selected for distribution are:\nGoodie1: 100\nGoodie2: 200\nAnd the difference between the chosen goodie with highest price and the lowest price is 100\n';
            expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, expectedOutput, 'utf8');
        });
    });
});
