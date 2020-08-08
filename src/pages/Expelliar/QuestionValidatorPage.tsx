import React, { useState, useEffect } from "react";
import {
  makeExpelliarGetRequest,
  makeExpelliarDeleteRequest,
  makeExpelliarPostRequest,
} from "../../utils/rest";
import "./QuestionValidatorPage.scss";

interface QuestionType {
  id: number;
  tome: number | null;
  text: string;
  difficulty: number | null;
  answers: Array<string | undefined>;
  correctAnswer: string;
}

enum difficulty {
  EASY,
  INTERMEDIATE,
  HARD,
  EXPERT,
}

const QuestionValidatorPage: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [error, setError] = useState<string>("");

  const [selectedQuestions, setSelectedQuestions] = useState([false, false]);

  useEffect(() => {
    makeExpelliarGetRequest("/questions/unaccepted").then((res: any) => {
      setQuestions(res);
    });
  }, []);

  const getDifficultyByInt = (val: number) => {
    switch (val) {
      case 0:
        return "EASY";
      case 1:
        return "INTERMEDIARY";
      case 2:
        return "HARD";
      case 3:
        return "EXPERT";
      case -1:
        return "TODO";
      default:
        return "NOT VALID";
    }
  };

  const selectLine = (index: number) => {
    const tmp = [...selectedQuestions];
    tmp[index] = !tmp[index];
    setSelectedQuestions(tmp);
  };

  const checkForm = (questions: Array<QuestionType>): boolean => {
    var isOk = true;
    questions.forEach((question) => {
      if (
        question.difficulty !== null &&
        (question.difficulty < 0 || question.difficulty > 3)
      ) {
        setError(
          `La difficulté n'est pas valide pour la question "${question.text}" `
        );
        isOk = false;
        return;
      }
      question.answers.forEach((answer) => {
        if (answer?.trim().length === 0) {
          setError(`Une réponse est vide la question "${question.text}" `);
          isOk = false;
          return;
        }
      });
      if (question.text.trim().length === 0) {
        isOk = false;
        setError("Une question est vide (pas de texte)");
        return;
      }
    });
    return isOk;
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    var toSendQuestions: Array<QuestionType> = [];
    questions.forEach((question, index) => {
      console.log(question);
      if (selectedQuestions[index]) {
        toSendQuestions.push(question);
      }
    });
    const questionForm = {
      questions: toSendQuestions,
    };
    console.log(questionForm);

    const isFormValid = checkForm(toSendQuestions);
    if (isFormValid) {
      console.log(questionForm);
      makeExpelliarPostRequest("/admin/questions/multiple", questionForm).then(
        (res: any) => {
          window.location.reload();
        }
      );
    }
  };

  const setComplexity = (questionIndex: number, complexity: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].difficulty = complexity;
    setQuestions(questions);
  };

  const setTextField = (
    questionIndex: number,
    answerIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex] = value;
    setQuestions(questions);
  };

  const setQuestionField = (questionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].text = value;
    setQuestions(questions);
  };
  const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1)



  const _renderTab = () => {
    if (questions.length > 0) {
      return (
        <table>
          <thead>
            <tr>
              {[
                "Question",
                "Complexité",
                "Bonne réponse",
                "Réponse 2",
                "Réponse 3",
                "Réponse 3",
                "Action",
              ].map((cell) => {
                return <td>{cell}</td>;
              })}
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => {
              var nbAnswer = question.answers.length;
              return (
                <tr
                  onClick={() => {
                    selectLine(index);
                  }}
                  className={selectedQuestions[index] ? "selected-row" : ""}
                >
                  <td>
                    <textarea
                      name={`question-text-${index}`}
                      defaultValue={capitalize(question.text)}
                      onChange={(e: any) => {
                        setQuestionField(index, e.currentTarget.value);
                      }}
                    />
                  </td>
                  <td>
                    <div className="complexity-input">
                      <input
                        type="number"
                        name={`complexity-question-${index}`}
                        defaultValue={
                          question.difficulty != null ? question.difficulty : -1
                        }
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                          setComplexity(index, Number(e.currentTarget.value));
                        }}
                      />
                      <span>
                        {getDifficultyByInt(question.difficulty ?? -1)}
                      </span>
                    </div>
                  </td>
                  {[0, 1, 2, 3].map((answerIndex) => {
                    var answers = question.answers;
                    return (
                      <td>
                        <input
                          type="text"
                          name={`"answer-"${answerIndex}`}
                          defaultValue={
                            answerIndex < nbAnswer ? answers[answerIndex] : ""
                          }
                          onChange={(e: React.FormEvent<HTMLInputElement>) => {
                            setTextField(
                              index,
                              answerIndex,
                              e.currentTarget.value
                            );
                          }}
                        />
                      </td>
                    );
                  })}

                  <td>
                    <div
                      className="action-cell"
                      onClick={() => {
                        var questionId = question.id;
                        makeExpelliarDeleteRequest(
                          `/questions/${questionId}`
                        ).then((res: any) => {
                          window.location.reload();
                        });
                      }}
                    >
                      <i className="icon solid fa-trash" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
    return <div>Aucune question en attente</div>;
  };

  return (
    <div className="container question-validator-page">
      <header className="header-content"></header>
      {_renderTab()}
      <div id="error-container">
        <span id="error-span">{error}</span>
      </div>
      <button
        onClick={(e) => {
          handleSubmit(e);
        }}
      >
        VALIDER
      </button>
    </div>
  );
};

export default QuestionValidatorPage;
