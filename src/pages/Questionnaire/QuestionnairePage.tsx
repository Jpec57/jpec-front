import React, {useEffect, useState} from "react";
import "./QuestionnairePage.scss"
import {makeGetRequest} from "../../utils/rest";

type Answer = {
    text: string,
    isCorrectAnswer: boolean
}

type Question = {
    question: string,
    possibleAnswers: Array<Answer>
}

type QuestionnaireForm = {
    email: string | null,
    questions: Array<Question>
}

const QuestionnairePage: React.FC = () => {

    const initAnswers: Array<Answer> = [{
        text: '',
        isCorrectAnswer: true
    },
        {
            text: '',
            isCorrectAnswer: false
        }
    ];
    const initQuestions: Array<Question> = [{
        question: '',
        possibleAnswers: []
    }];
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
    const [questions, setQuestions] = useState(initQuestions);
    const [answers, setAnswers] = useState(initAnswers);


    // useEffect(() => {
    //     makeGetRequest("/decks/1")
    //         .then(response => {
    //             return response.json();
    //         })
    //         .then(data => {
    //             console.log(data);
    //         });
    // });


    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: '',
                possibleAnswers: []
            }
        ]);
    };

    const addAnswer = () => {
        setAnswers([
            ...answers,
            {
                text: '',
                isCorrectAnswer: false
            }
        ]);
    };


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form: any = event.target;
        const data = new FormData(form);

        for (var [key, value] of data.entries()) {
            console.log(key, value);
        }
        // for (let name of data.keys()) {
        //     const input = form.elements[name];
        //     const parserName = input.dataset.parse;
        //
        //     if (parserName) {
        //         const parser = inputParsers[parserName];
        //         const parsedValue = parser(data.get(name));
        //         data.set(name, parsedValue);
        //     }
        // }
        //

    };

    return (
        <div className="container">
            <header className="header-content">
            </header>
            <p className="intro">
                Envie de voir si ton entourage te connaît bien ? Ou tout simplement ennuyé en période de confinement ?
                <br></br>Créer un questionnaire que tu pourras partager avec tes proches pour tester leur connaissance
                sur toi même
                ou quelque chose qui te tient à coeur.
            </p>

            <form onSubmit={handleSubmit}>

                <div className="flex-horizontal centered-content">
                    <div
                        className={`vertical-centered mr-20 ml-20 flex-vertical ${currentQuestionIndex <= 1 ? 'invisible' : ''}`}
                        onClick={() => {
                            if (currentQuestionIndex - 1 >= 1) (
                                setCurrentQuestionIndex(currentQuestionIndex - 1)
                            )
                        }}>
                        <i className="icon solid fa-angle-left big-icon"/>
                        <span color="#777">Question précédente</span>
                    </div>
                    <div className="flex-vertical">

                        <div className="form-header flex-horizontal">

                            <div className="question-number">
                                Q{currentQuestionIndex}
                            </div>
                            <input
                                name={`question-${currentQuestionIndex}`}
                                type="text"
                            />
                        </div>


                        {answers.map((answer, index) => {
                            return (
                                <input
                                    name={`answer-${currentQuestionIndex}-${index}`}
                                    type="text"
                                    className="answer-field"
                                />
                            );
                        })}

                        <button className="add-answer-button" onClick={(event)=>{
                            event.preventDefault();
                            addAnswer();
                        }}>Ajouter une réponse possible</button>
                    </div>
                    <div className="vertical-centered mr-20 ml-20 flex-vertical" onClick={() => {
                        setCurrentQuestionIndex(currentQuestionIndex + 1);
                        if (questions.length <= currentQuestionIndex) {
                            addQuestion();
                        }
                    }}>
                        <i className="icon solid fa-angle-right big-icon"/>
                        <span color="#777">Question suivante</span>
                    </div>
                </div>

                <div className="centered-div form-create-button-div">
                    <button>Créer le formulaire</button>
                </div>
            </form>

        </div>

    );
};

export default QuestionnairePage;