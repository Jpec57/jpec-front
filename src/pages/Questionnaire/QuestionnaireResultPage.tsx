import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {makeGetRequest} from "../../utils/rest";
import "./QuestionnairePage.scss"
import {QuestionnaireAttempt, QuestionnaireQuestion} from "./QuestionnaireReviewPage";
import {Card} from "@material-ui/core";
import {Link} from "react-router-dom";

const QuestionnaireResultPage: React.FC = () => {
    let {resultToken} = useParams();
    const [shareToken, setShareToken] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentAttemptIndex, setCurrentAttemptIndex] = useState(-1);
    const initQuestionnaireQuestions: Array<QuestionnaireQuestion> = [];
    const initQuestionnaireAttempts: Array<QuestionnaireAttempt> = [];
    const [questions, setQuestions] = useState(initQuestionnaireQuestions);
    const [questionnaireAttempts, setQuestionnaireAttempts] = useState(initQuestionnaireAttempts);
    useEffect(() => {
        makeGetRequest('/questionnaire/' + resultToken + '/result').then((res: any) => {
            const requestQuestions: Array<QuestionnaireQuestion> = res['questionnaireQuestions'];
            const requestAttempts: Array<QuestionnaireAttempt> = res['questionnaireAttempts'];
            setQuestions(requestQuestions);
            setQuestionnaireAttempts(requestAttempts);
            setShareToken(res['token']);
        });
    }, [resultToken]);


    const goToNextQuestion = () => {
        if (questions.length - 1 > currentIndex) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const resetIndexes = () => {
        setCurrentAttemptIndex(-1);
        setCurrentIndex(0);
    };

    const renderForm = () => {
        if (questions != null && questions.length > 0) {
            return <div>

                <div className="flex-horizontal centered-content">
                    <div
                        className={`vertical-centered mr-20 ml-20 flex-vertical ${currentIndex <= 0 ? 'invisible' : ''}`}
                        onClick={() => {
                            goToPreviousQuestion();
                        }}>
                        <i className="icon solid fa-angle-left big-icon"/>
                        <span color="#777">Question précédente</span>
                    </div>
                    <div className="flex-vertical">

                        <div className="form-header flex-horizontal">

                            <div className="question-number">
                                Q{currentIndex + 1}
                            </div>
                            <span className="question-text">{questions[currentIndex].question}</span>
                        </div>

                        {questions[currentIndex].possibleAnswers.map((answer, index) => {
                            let isWronglySelected = false;
                            let isCorrect = answer.isCorrectAnswer;
                            if (questionnaireAttempts[currentAttemptIndex] != null) {
                                const selectedAnswers = questionnaireAttempts[currentAttemptIndex].questionAttempts[currentIndex].userAnswer.substr(1).split(',');
                                isWronglySelected = !answer.isCorrectAnswer && selectedAnswers.indexOf(answer.id.toString()) !== -1;
                            }

                            return (
                                <div key={index} className="flex-horizontal">
                                    <span
                                        className={`possible-answer 
                                        ${isCorrect ? 'selected' : ''} 
                                        ${isWronglySelected ? 'wrongly-selected' : ''}`}>
                                            {answer.text}
                                        </span>
                                </div>
                            );
                        })}
                    </div>
                    <div
                        className={`vertical-centered mr-20 ml-20 flex-vertical ${questions.length - 1 <= currentIndex ? 'invisible' : ''}`}
                        onClick={() => {
                            goToNextQuestion();
                        }}>
                        <i className="icon solid fa-angle-right big-icon"/>
                        <span color="#777">Question suivante</span>
                    </div>
                </div>

                <div className="centered-div form-create-button-div">
                    <button onClick={() => resetIndexes()}>Retour</button>
                </div>
            </div>;
        }
    };

    const renderAttempts = () => {
        const hasAttempts = questionnaireAttempts && questionnaireAttempts.length > 0;
        if (!hasAttempts){
            return (<div>
                Personne n'a répondu à ce questionnaire pour le moment. Partage le :
                <br></br>
                <div className="centered-div">
                    <Link to={"/quizz/" + shareToken }>{"/quizz/" + shareToken }</Link>
                </div>
            </div>);
        }
        return (<div>
            <p>Choisis une tentative de réponse d'un de tes amis que tu souhaites analyser :</p>

            {questionnaireAttempts.map((attempt, index) => {
                return (
                    <Card className="mt-20 card" onClick={() => {
                        setCurrentAttemptIndex(index)
                    }}>
                        {attempt.username}
                    </Card>
                );
            })}
            <p className="mt-20">
                ... Ou partage le à d'autres amis :
                <br></br>
                <div className="centered-div">
                <Link to={"/quizz/" + shareToken }>{"/quizz/" + shareToken }</Link>
                </div>
            </p>
        </div>);
    };
    return (
        <div className="container">
            <header className="header-content">
            </header>
            <p className="intro intro-title">
                Résultats
            </p>


            {currentAttemptIndex === -1 ? renderAttempts() : renderForm()}


        </div>

    );
};

export default QuestionnaireResultPage;