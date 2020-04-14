import React, { useState } from "react";
import "./ReviewPage.scss";

enum AnswerCorrectness {
  NONE,
  ERROR,
  CORRECT,
  NOT_EXACTLY
}

const ReviewPage: React.FC = () => {
  const [answer, setAnswer] = useState();
  const [isJapanese, setIsJapanese] = useState(false);
  const [question, setQuestion] = useState(`
  This is a test with content. This is a test with content. This is
              a test with content. This is a test with content. This is a test
              with content.
  `);
  const [solution, setSolution] = useState(
    `This will be the description of the solution`
  );

  const [answerCorrectness, setAnswerCorrectness] = useState(
    AnswerCorrectness.NONE
  );

  const getAnswerBoxBackgroundColor = () => {
    switch (answerCorrectness) {
      case AnswerCorrectness.NONE:
        return "background-default";
      case AnswerCorrectness.ERROR:
        return "background-error";
      case AnswerCorrectness.CORRECT:
        return "background-correct";
    }
  };

  return (
    <div className="container">
      <header className="header-content"></header>
      <div className="page">
        <div className="review-box">
          <div className="review-header">
            <span lang="ja">{question}</span>
          </div>
          <div className={"review-answer-box " + getAnswerBoxBackgroundColor()}>
            <div className="input-box">
              <input
                type="text"
                placeholder={
                  isJapanese
                    ? "答えを記入してください"
                    : "Type your answer here"
                }
                autoCorrect="false"
              />
            </div>
            <div
              className="next-button"
              onClick={() => {
                if (answerCorrectness === AnswerCorrectness.CORRECT) {
                  setAnswerCorrectness(AnswerCorrectness.ERROR);
                } else {
                  setAnswerCorrectness(AnswerCorrectness.CORRECT);
                }
              }}
            >
              <span>CLICK</span>
            </div>
          </div>
          <div
            className={
              "review-solution-box " +
              (answerCorrectness === AnswerCorrectness.NONE
                ? "invisible"
                : "visible")
            }
          >
            <span> {solution}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
