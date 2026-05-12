export const mergeAnswers = (existing, incoming) => {
  return {
    ...existing,
    ...Object.fromEntries(
      Object.entries(incoming).filter(([_, value]) => {
        return value !== null && value !== undefined && value !== '';
      })
    )
  };
};

export const getMissingFields = (answers, requiredFields) => {
  return requiredFields.filter(field => !answers[field]);
};


export const getNextQuestion = (
  answers,
  requiredFields,
  questions
) => {
  const missing = getMissingFields(answers, requiredFields);

  if (missing.length === 0) {
    return null;
  }

  return {
    field: missing[0],
    question: questions[missing[0]]
  };
};