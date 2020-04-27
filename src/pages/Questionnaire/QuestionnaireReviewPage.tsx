import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router";
import {makeGetRequest, makePostRequest} from "../../utils/rest";
import "./QuestionnairePage.scss"

export type PossibleAnswer = {
    id: number,
    text: string,
    isSelected?: boolean
    isCorrectAnswer?: boolean
};

export type QuestionnaireQuestion = {
    id: number,
    question: string,
    possibleAnswers: Array<PossibleAnswer>
};




export type QuestionAttempt = {
    formQuestion: number,
    userAnswer: string,
    isCorrectAnswer?: boolean
};

export type QuestionnaireAttempt = {
    username: string,
    form: number,
    questionAttempts: Array<QuestionAttempt>
}

const QuestionnaireReviewPage: React.FC = () => {
    let {token} = useParams();

    const history = useHistory();
    const initQuestionnaireQuestions: Array<QuestionnaireQuestion> = [];
    const initQuestionAttempts: Array<QuestionAttempt> = [];
    const iniQuestionnaireAttempt: QuestionnaireAttempt = {
        username: '',
        form: -1,
        questionAttempts: []
    };
    const [username, setUsername] = useState('');
    const [formId, setFormId] = useState(-1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [questionAttempts, setQuestionAttempts] = useState(initQuestionAttempts);
    const [questions, setQuestions] = useState(initQuestionnaireQuestions);
    const [questionnaireAttempt, setQuestionnaireAttempt] = useState(iniQuestionnaireAttempt);

    useEffect(() => {
        makeGetRequest('/questionnaire/' + token).then((res: any) => {
            setFormId(res['id']);
            const requestQuestions: Array<QuestionnaireQuestion> = res['questionnaireQuestions'];
            const qAttempts: Array<QuestionAttempt> = [];
            for (const q of requestQuestions){
                qAttempts.push({
                    formQuestion: q.id,
                    userAnswer: '',
                    isCorrectAnswer: false
                });
            }
            setQuestionAttempts(qAttempts);
            setQuestions(requestQuestions);
        });
    }, [token]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const questionnaire : QuestionnaireAttempt = {
            username: username,
            form: formId,
            questionAttempts: questionAttempts
        };

        makePostRequest("/questionnaire/" + token + "/review", questionnaire).then((res: any)=>{
            const resultToken = res['result_token'];
            history.push("/quizz/" + resultToken + '/result');
        });


    };
    const selectAnswer = (id: number, index: number) => {
        const newQuestionAttempts = [...questionAttempts];
        const newQuestions = [...questions];
        const userAnswerArr = newQuestionAttempts[currentIndex].userAnswer.split(',');
        const indexOf = userAnswerArr.indexOf(id.toString());
        if (indexOf === -1){
            userAnswerArr.push(id.toString());
        } else {
            userAnswerArr.splice(indexOf, 1)
        }
        newQuestionAttempts[currentIndex].userAnswer = userAnswerArr.toString();
        const answer = newQuestions[currentIndex].possibleAnswers[index];
        newQuestions[currentIndex].possibleAnswers[index].isSelected = (answer.isSelected !== true);
        setQuestionAttempts(newQuestionAttempts);
        setQuestions(newQuestions);

    };

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

    const renderForm = () => {
        if (questions != null && questions.length > 0) {
            return <form onSubmit={handleSubmit}>

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
                            return (
                                <div key={index} className="flex-horizontal">
                                    <span className={`possible-answer ${answer.isSelected ? 'selected' : ''}`} onClick={()=>{
                                        selectAnswer(answer.id, index);
                                    }}>
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
                    <button>Envoyer le formulaire</button>
                </div>
            </form>;
        }
    };

    return (
        <div className="container">
            <header className="header-content">
            </header>
            <p className="intro">
                Entre ton pseudo qui permettra de t'indentifier:
                <input type="text" name="username" onChange={(e)=>{setUsername(e.target.value)}}/>
            </p>

            {renderForm()}


        </div>

    );
};

export default QuestionnaireReviewPage;