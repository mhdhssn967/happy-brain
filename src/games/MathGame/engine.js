/**
 * Math Game Engine
 */

/**
 * Generate a random math problem
 */
export const generateMathProblem = (level, operationType) => {
  const multiplier = Math.min(Math.ceil(level / 5), 4);
  
  let num1, num2, operation, answer;

  switch (operationType) {
    case "addition":
      num1 = Math.floor(Math.random() * (10 * multiplier)) + 1;
      num2 = Math.floor(Math.random() * (10 * multiplier)) + 1;
      operation = "+";
      answer = num1 + num2;
      break;

    case "subtraction":
      // Make sure result is positive
      num1 = Math.floor(Math.random() * (20 * multiplier)) + 10;
      num2 = Math.floor(Math.random() * num1);
      operation = "-";
      answer = num1 - num2;
      break;

    case "multiplication":
      num1 = Math.floor(Math.random() * (12 * multiplier)) + 1;
      num2 = Math.floor(Math.random() * (12 * multiplier)) + 1;
      operation = "×";
      answer = num1 * num2;
      break;

    case "division":
      // Generate divisible numbers
      num2 = Math.floor(Math.random() * (12 * multiplier)) + 1;
      const quotient = Math.floor(Math.random() * (12 * multiplier)) + 1;
      num1 = num2 * quotient;
      operation = "÷";
      answer = quotient;
      break;

    default:
      num1 = 5;
      num2 = 3;
      operation = "+";
      answer = 8;
  }

  return {
    num1,
    num2,
    operation,
    answer,
    problem: `${num1} ${operation} ${num2}`,
  };
};

/**
 * Check if answer is correct
 */
export const isAnswerCorrect = (userAnswer, correctAnswer) => {
  return parseInt(userAnswer) === correctAnswer;
};