const fs = require("fs");

// Function to parse the file and extract employee information
function parseFile(filePath) {
  try {
    const fileData = fs.readFileSync(filePath, "utf8");
    const lines = fileData.split("\n");

    // Assuming the file format is CSV with columns
    const employeeData = lines.map((line) => line.split(","));

    return employeeData;
  } catch (error) {
    console.error("Error reading the file:", error.message);
    process.exit(1);
  }
}

// Function to find employees who worked for 7 consecutive days
function findEmployeesWorkedConsecutiveDays(employeeData, consecutiveDays) {
  // Assuming the Date format is consistent (e.g., YYYY-MM-DD)
  const sortedData = employeeData.sort(
    (a, b) => new Date(a[6]) - new Date(b[6])
  );

  const result = [];
  let consecutiveCount = 1;

  for (let i = 1; i < sortedData.length; i++) {
    const currentDate = new Date(sortedData[i][6]);
    const previousDate = new Date(sortedData[i - 1][6]);

    // Assuming consecutive days means consecutive calendar days
    if ((currentDate - previousDate) / (1000 * 60 * 60 * 24) === 1) {
      consecutiveCount++;
    } else {
      consecutiveCount = 1;
    }

    if (consecutiveCount === consecutiveDays) {
      result.push({
        name: sortedData[i][7],
        position: sortedData[i][0],
      });
    }
  }

  return result;
}

// Function to find employees with less than 10 hours between shifts but greater than 1 hour
function findEmployeesShortBreaks(employeeData, minBreak, maxBreak) {
  const result = [];

  for (let i = 1; i < employeeData.length; i++) {
    const currentHours = parseFloat(employeeData[i][4]);
    const previousHours = parseFloat(employeeData[i - 1][4]);

    // Assuming HoursWorked is in decimal format (e.g., 9.5)
    const breakBetweenShifts = currentHours - previousHours;

    if (breakBetweenShifts > minBreak && breakBetweenShifts < maxBreak) {
      result.push({
        name: employeeData[i][7],
        position: employeeData[i][0],
      });
    }
  }

  return result;
}

// Function to find employees who worked for more than 14 hours in a single shift
function findEmployeesLongShifts(employeeData, maxHours) {
  const result = [];

  for (let i = 0; i < employeeData.length; i++) {
    const hoursWorked = parseFloat(employeeData[i][4]);

    if (hoursWorked > maxHours) {
      result.push({
        name: employeeData[i][7],
        position: employeeData[i][0],
      });
    }
  }

  return result;
}

// Function to write the output to a file
function writeOutputToFile(output, outputFilePath) {
  try {
    fs.writeFileSync(outputFilePath, output.join("\n"), "utf8");
    console.log(`Results written to ${outputFilePath}`);
  } catch (error) {
    console.error("Error writing to the file:", error.message);
  }
}

// Example usage
const inputFilePath = "./data.csv";
const outputFilePath = "./output.txt";
const consecutiveDays = 7;
const minBreak = 1;
const maxBreak = 10;
const maxHours = 14;

const employeeData = parseFile(inputFilePath);

const employeesConsecutiveDays = findEmployeesWorkedConsecutiveDays(
  employeeData,
  consecutiveDays
);
const employeesShortBreaks = findEmployeesShortBreaks(
  employeeData,
  minBreak,
  maxBreak
);
const employeesLongShifts = findEmployeesLongShifts(employeeData, maxHours);

// Combine all results into a single array
const allResults = [
  `Employees who worked for 7 consecutive days: ${JSON.stringify(
    employeesConsecutiveDays
  )}`,
  `Employees with less than 10 hours between shifts: ${JSON.stringify(
    employeesShortBreaks
  )}`,
  `Employees who worked for more than 14 hours in a single shift: ${JSON.stringify(
    employeesLongShifts
  )}`,
];

// Write the combined results to the output file
writeOutputToFile(allResults, outputFilePath);
