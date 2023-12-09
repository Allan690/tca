const fs = require('fs');
const path = require('path');

/**
 * Reads the input file and parses the number of employees and the list of goodies with their prices.
 * @param {string} filePath - Path to the input file.
 * @returns {object} An object containing the number of employees and an array of goodies (with name and price).
 */
function readInputFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8').split('\n');
    const numberOfEmployees = parseInt(data[0].split(': ')[1]);
    const goodies = data.slice(2).map(line => {
        const [name, price] = line.split(': ');
        return { name, price: parseInt(price) };
    });
    return { numberOfEmployees, goodies };
}


/**
 * Finds the optimal distribution of goodies for the given number of employees.
 * The function aims to minimize the price difference between the highest and lowest priced goodies.
 * @param {number} numberOfEmployees - The number of employees to distribute goodies to.
 * @param {Array.<{name: string, price: number}>} goodies - Array of goodies with their names and prices.
 * @returns {object} An object containing the selected goodies and the minimum price difference.
 */
function findGoodiesDistribution(numberOfEmployees, goodies) {
    goodies.sort((a, b) => a.price - b.price);

    let minDiff = Infinity;
    let chosenGoodies = [];

    for (let i = 0; i <= goodies.length - numberOfEmployees; i++) {
        let diff = goodies[i + numberOfEmployees - 1].price - goodies[i].price;
        if (diff < minDiff) {
            minDiff = diff;
            chosenGoodies = goodies.slice(i, i + numberOfEmployees);
        }
    }

    return { chosenGoodies, minDiff };
}

/**
 * Writes the selected goodies and the price difference to an output file.
 * @param {string} filePath - Path to the output file.
 * @param {Array.<{name: string, price: number}>} chosenGoodies - The goodies selected for distribution.
 * @param {number} minDiff - The minimum price difference between the chosen goodies.
 */
function writeOutputToFile(filePath, chosenGoodies, minDiff) {
    let output = `The goodies selected for distribution are:\n`;
    chosenGoodies.forEach(goodie => {
        output += `${goodie.name}: ${goodie.price}\n`;
    });
    output += `And the difference between the chosen goodie with highest price and the lowest price is ${minDiff}\n`;

    fs.writeFileSync(filePath, output, 'utf8');
}

/**
 * Processes the distribution of goodies by reading the input file, finding the optimal distribution,
 * and writing the results to an output file.
 * @param {string} inputFilePath - Path to the input file.
 * @param {string} outputFilePath - Path to the output file where results will be written.
 */
function processGoodiesDistribution(inputFilePath, outputFilePath) {
    const { numberOfEmployees, goodies } = readInputFile(inputFilePath);
    const { chosenGoodies, minDiff } = findGoodiesDistribution(numberOfEmployees, goodies);
    writeOutputToFile(outputFilePath, chosenGoodies, minDiff);
}

module.exports = {
    readInputFile, findGoodiesDistribution, writeOutputToFile 
}

// const directory = path.dirname(__filename);
// processGoodiesDistribution(`${directory}/goodies.input.txt`, `${directory}/goodies.output.txt`);
