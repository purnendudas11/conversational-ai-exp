export const quickExtract = (input) => {
  const lower = input.toLowerCase();

  // Budget extraction
  const budgetMatch = input.match(/\$?\d{2,3}[,]?\d{0,3}/);

  return {
    budget: budgetMatch ? budgetMatch[0] : null,

    carType:
      lower.includes('suv')
        ? 'SUV'
        : lower.includes('sedan')
        ? 'Sedan'
        : lower.includes('truck')
        ? 'Truck'
        : null,

    brand:
      lower.includes('toyota')
        ? 'Toyota'
        : lower.includes('lexus')
        ? 'Lexus'
        : null,

    condition:
      lower.includes('used')
        ? 'Used'
        : lower.includes('new')
        ? 'New'
        : null,

    fuel:
      lower.includes('hybrid')
        ? 'Hybrid'
        : lower.includes('electric')
        ? 'Electric'
        : lower.includes('gas')
        ? 'Gas'
        : null
  };
};