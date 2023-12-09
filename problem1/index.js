const fs = require('fs');
const path = require('path')


/**
 * Represents a job with a start time, end time, and profit.
 * @constructor
 * @param {string} startTime - The start time of the job in HHMM format.
 * @param {string} endTime - The end time of the job in HHMM format.
 * @param {string} profit - The profit associated with completing the job.
 */
function Job(startTime, endTime, profit) {
    this.startTime = Number(startTime);
    this.endTime = Number(endTime);
    this.profit = Number(profit);
}


/**
 * Finds the last job that does not conflict with the given job.
 * @param {Job[]} jobs - Array of jobs.
 * @param {number} index - Index of the job to check against.
 * @returns {number} - Index of the last non-conflicting job or -1 if none found.
 */
function findLastNonConflict(jobs, index) {
    for (let i = index - 1; i >= 0; i--) {
        if (jobs[i].endTime <= jobs[index].startTime) {
            return i;
        }
    }
    return -1;
}

/**
 * Determines the jobs to be taken to maximize profit without overlapping.
 * @param {Job[]} jobs - Array of jobs.
 * @returns {Job[]} - Array of jobs chosen to maximize profit.
 */
function determineJobsTaken(jobs) {
    let n = jobs.length;
    let chosenJobs = [];
    let i = n - 1;

    while (i >= 0) {
        let lastNonConflict = findLastNonConflict(jobs, i);
        if (lastNonConflict === -1 || jobs[i].profit + (
            lastNonConflict === -1 ? 0 : jobs[lastNonConflict].profit) > jobs[i - 1].profit
            ) {
            chosenJobs.push(jobs[i]);
            i = lastNonConflict;
        } else {
            i--;
        }
    }

    return chosenJobs.reverse();
}

/**
 * Computes the number of jobs and total earnings left for other employees.
 * @param {Job[]} jobs - Array of all available jobs.
 * @returns {number[]} - Array containing the number of jobs left and the total earnings left.
 */
function jobsLeftForOthers(jobs) {
    let totalEarnings = jobs.reduce((acc, job) => acc + job.profit, 0);
    let jobsForJohn = determineJobsTaken(jobs);
    let earningsForJohn = jobsForJohn.reduce((acc, job) => acc + job.profit, 0);
    const result = [jobs.length - jobsForJohn.length, totalEarnings - earningsForJohn];
    return result;
}


/**
 * Reads the content of a file.
 * @param {string} filePath - Path to the file to be read.
 * @returns {string} - Content of the file.
 */
function readFile(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}


/**
 * Reads a file and processes it to determine jobs left for others.
 * @param {string} filePath - Path to the file containing job data.
 * @returns {number[]} - Array containing the number of jobs left and the total earnings left.
 */
function readAndProcessFile(filePath) {
    const data = readFile(filePath);
    const lines = data.trim().split('\n');
    let jobs = [];

    for (let i = 2; i <= lines.length - 1; i += 3) {
        jobs.push(new Job(lines[i], lines[i + 1], lines[i + 2]));
    }

    const jobsLeft = jobsLeftForOthers(jobs);

    writeOutputToFile(path.dirname(__filename) +'/jobs.output.txt', jobsLeft);

    return jobsLeft
}


/**
 * Writes the given data to a file.
 * @param {string} filePath - Path to the file where data will be written.
 * @param {number[]} data - The data to be written to the file.
 */
function writeOutputToFile(filePath, data) {
    output = "The number of tasks and earnings available for others:\n"
    const formattedData = `Tasks: ${data[0]}\nEarnings: ${data[1]}\n`;
    output += formattedData
    fs.writeFileSync(filePath, output, 'utf8');
}

// driver code - uncomment when running with node, comment or remove this when running tests
// readAndProcessFile(path.dirname(__filename) + '/jobs.input.txt');

module.exports = {
    Job, readAndProcessFile, jobsLeftForOthers, readFile
}
