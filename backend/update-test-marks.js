db.tests.find().forEach(function (test) {
  if (test.test_responses && test.test_responses.length > 0) {
    test.test_responses.forEach(function (response) {
      let correctCount = 0;
      const totalQuestions = test.test_question.length;

      for (let i = 0; i < totalQuestions; i++) {
        if (response.answers[i] === test.test_question[i].answer) {
          correctCount++;
        }
      }

      response.marks =
        Math.round((correctCount / totalQuestions) * 10 * 10) / 10;
    });

    db.tests.updateOne(
      { _id: test._id },
      { $set: { test_responses: test.test_responses } }
    );
  }
});
