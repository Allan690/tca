const { Job, jobsLeftForOthers, readFile, readAndProcessFile } = require('./index');

jest.mock('fs');

const fs = require('fs');

describe('Job Scheduler Tests', () => {
    it('Job constructor should create a job object correctly', () => {
        const job = new Job('0900', '1030', '100');
        expect(job).toEqual({ startTime: 900, endTime: 1030, profit: 100 });
    });

    test.each([
        // [jobs, expected result]
        [
            [
                new Job('0900', '1030', '100'),
                new Job('1000', '1200', '500'),
                new Job('1100', '1200', '300')
            ],
            [2, 400]
        ],
        [
            [
                new Job('0900', '1000', '250'),
                new Job('0945', '1200', '550'),
                new Job('1130', '1500', '150')
            ],
            [2, 400]
        ],
        [
            [
                new Job('0900', '1030', '100'),
                new Job('1000', '1200', '100'),
                new Job('1100', '1200', '100')
            ],
            [1, 100]
        ]
    ])('jobsLeftForOthers should return correct result for given jobs', (jobs, expectedResult) => {
        expect(jobsLeftForOthers(jobs)).toEqual(expectedResult);
    });

    it('readFile should correctly read data from file', () => {
        const mockData = '1\n3\n0900\n1030\n100\n1000\n1200\n500\n1100\n1200\n300';
        fs.readFileSync.mockReturnValue(mockData);

        const filePath = 'jobs.input.txt';
        const data = readFile(filePath);

        expect(data).toBe(mockData);
        expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8');
    });

    it('readAndProcessFile should correctly parse raw data into jobs and calculate result', () => {
        const rawData = '1\n3\n0900\n1030\n100\n1000\n1200\n500\n1100\n1200\n300';
        const result = readAndProcessFile(rawData);
        expect(result).toEqual([2, 400]);
    });
});

