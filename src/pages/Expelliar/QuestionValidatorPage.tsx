import React, { useRef, MutableRefObject, useState, useEffect } from "react";
import { makeGetRequest, makeExpelliarGetRequest } from "../../utils/rest";
import './QuestionValidatorPage.scss';

const QuestionValidatorPage: React.FC = () => {

    const [questions, setQuestions] = useState([
        {
            "id": 2,
            "tome": null,
            "text": "Qui est le patron ?",
            "difficulty": null,
            "answers": [
                "Zola",
                "Deux"
            ],
            "correctAnswer": "Zola"
        },
        {
            "id": 3,
            "tome": null,
            "text": "Qui est le patron 2?",
            "difficulty": null,
            "answers": [
                "Zola",
                "Deux"
            ],
            "correctAnswer": "Zola"
        }
    ]);

    const [selectedQuestions, setSelectedQuestions] = useState([false, false]);

    useEffect(()=>{
        makeExpelliarGetRequest('/questions/unaccepted').then((res: any) => {
            console.log(res);
            // const requestQuestions: Array<QuestionnaireQuestion> = res['questionnaireQuestions'];
        });
    }, []);

  return (
    <div className="container question-validator-page">
      <header className="header-content"></header>

        <table>
            {questions.map((question, index)=> {
                return (
                    <tr>
                    <td>
                        {question.text}
                    </td>
                    <td>
                        {question.difficulty}
                    </td>

                    <td>
                        <input name={`validate-question-${question.id}`} type="checkbox" checked={selectedQuestions[index]} onClick={()=>{
                            const tmp = [...selectedQuestions];
                            tmp[index] = !tmp[index];
                            setSelectedQuestions(tmp);                        
                        }}/>
                    </td>
                    </tr>
                );
            })}

            
        </table>
        <button onClick={()=>{
            console.log("ok");
        }}>
            Valider
        </button>
    </div>
  );
};

export default QuestionValidatorPage;
