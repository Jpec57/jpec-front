import React, {useState} from "react";
import "./QuestionnairePage.scss"
import {makePostRequest} from "../../utils/rest";
import {useHistory} from "react-router";

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

const ERR_QUESTION = 'La question ne doit pas être vide et avoir au moins deux réponses dont au moins une est correcte.';
const ERR_FORM = 'Le formulaire doit comporter au moins une question valide.';

const QuestionnairePage: React.FC = () => {

    const initForm: QuestionnaireForm = {
        email: 'jp@gg.fr',
        questions: [],
    };
    const initAnswers: Array<Answer> = [{
        text: '',
        isCorrectAnswer: true
        },
        {
            text: '',
            isCorrectAnswer: false
        }
    ];
    const history = useHistory();
    const [form, setForm] = useState(initForm);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [currentAnswers, setCurrentAnswers] = useState(initAnswers);

    const [error, setError] = useState('');

    const addQuestion = () => {
        const newForm = {...form};
        newForm.questions.push({
            question: '',
            possibleAnswers: initAnswers
        });
        setForm(newForm);
    };

    const addAnswer = () => {
        const newAnswers = [...currentAnswers];
        newAnswers.push({
            text: '',
            isCorrectAnswer: false
        });
        setCurrentAnswers(newAnswers);
    };

    const saveFormCurrentQuestion = (index: number) => {
        form.questions[index - 1] = {
            question: currentQuestion,
            possibleAnswers: currentAnswers
        };
        setForm(form);
    };

    const handleAnswerValidityChange = (index: number) => {
        const newAnswers = [...currentAnswers];
        newAnswers[index].isCorrectAnswer = !newAnswers[index].isCorrectAnswer;
        setCurrentAnswers(newAnswers);
    };

    const handleAnswerTextChange = (index: number, text: string) => {
        const newAnswers = [...currentAnswers];
        newAnswers[index].text = text;
        setCurrentAnswers(newAnswers);
    };

    const getValidFormQuestionsNumber = () => {
        const questions = form.questions;
        let i = 0;
        while (i < questions.length) {
            if (!checkQuestionCompleteness(i + 1)) {
                return i;
            }
            i++;
        }
        return i;
    };

    const updateQuestionAndAnswersStates = (newIndex: number) => {
        const currentQuestion = form.questions[newIndex - 1];
        setCurrentQuestion(currentQuestion.question);
        setCurrentAnswers(currentQuestion.possibleAnswers);
    };

    const goToPreviousQuestion = () => {
        setError('');
        saveFormCurrentQuestion(currentQuestionIndex);
        const newIndex = currentQuestionIndex - 1;
        if (newIndex >= 1) {
            setCurrentQuestionIndex(newIndex);
        }
        updateQuestionAndAnswersStates(newIndex);
    };

    const checkQuestionCompleteness = (index: number): boolean => {
        const question = form.questions[index - 1].question;
        if (!question || question.length === 0) {
            return false;
        }
        const answers = form.questions[index - 1].possibleAnswers;
        let nbPossibleAnswers = 0;
        let nbNotEmptyAnswers = 0;
        for (const answer of answers) {
            if (answer.text.length > 0) {
                nbNotEmptyAnswers++;
                if (answer.isCorrectAnswer) {
                    nbPossibleAnswers++;
                }
            }
        }
        return (nbPossibleAnswers >= 1 && nbNotEmptyAnswers >= 2);
    };

    const goToNextQuestion = () => {
        saveFormCurrentQuestion(currentQuestionIndex);
        const isQuestionValid = checkQuestionCompleteness(currentQuestionIndex);
        if (!isQuestionValid) {
            setError(ERR_QUESTION);
            return;
        }
        setError('');
        const newIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(newIndex);
        if (form.questions.length <= currentQuestionIndex) {
            addQuestion();
        }
        updateQuestionAndAnswersStates(newIndex);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        saveFormCurrentQuestion(currentQuestionIndex);
        const isCurrentQuestionValid = checkQuestionCompleteness(currentQuestionIndex);
        if (!isCurrentQuestionValid) {
            setError(ERR_QUESTION);
            return;
        }
        const nbValidQuestions = getValidFormQuestionsNumber();
        if (nbValidQuestions < 1) {
            setError(ERR_FORM);
            return;
        }
        setError('');
        const formToSend = {
            email: form.email,
            questionnaireQuestions: form.questions.slice(0, nbValidQuestions)
        };
        makePostRequest('/questionnaire', formToSend).then((data: any) => {
            const resultToken = data['resultToken'];
            history.push("/quizz/" + resultToken + '/result');

        });
    };

    const _renderForm = () => {
        return (
            <form onSubmit={handleSubmit}>

                <div className="flex-horizontal centered-content">
                    <div
                        className={`vertical-centered mr-20 ml-20 flex-vertical ${currentQuestionIndex <= 1 ? 'invisible' : ''}`}
                        onClick={() => {
                            goToPreviousQuestion();
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
                                value={currentQuestion}
                                onChange={e => setCurrentQuestion(e.target.value)}
                            />
                        </div>

                        {currentAnswers.map((answer, index) => {
                            return (
                                <div className="flex-horizontal">
                                    <input type="checkbox" id={`check-answer-${currentQuestionIndex}-${index}`}
                                           name={`check-answer-${currentQuestionIndex}-${index}`}
                                           className={`check-answer ${answer.isCorrectAnswer ? 'valid' : 'not-valid'}`}
                                           checked={answer.isCorrectAnswer}
                                           onClick={() => handleAnswerValidityChange(index)}/>
                                    <input
                                        name={`answer-${currentQuestionIndex}-${index}`}
                                        type="text"
                                        className="answer-field"
                                        value={answer.text}
                                        onChange={e => {
                                            handleAnswerTextChange(index, e.target.value);
                                        }}
                                    />
                                </div>
                            );
                        })}

                        <button className="add-answer-button" onClick={(event) => {
                            event.preventDefault();
                            addAnswer();
                        }}>Ajouter une réponse possible
                        </button>
                    </div>
                    <div className="vertical-centered mr-20 ml-20 flex-vertical" onClick={() => {
                        goToNextQuestion();
                    }}>
                        <i className="icon solid fa-angle-right big-icon"/>
                        <span color="#777">Question suivante</span>
                    </div>
                </div>

                <p className="centered-div mt-20 error-box">
                    {error}
                </p>

                <div className="centered-div form-create-button-div">
                    <button>Créer le formulaire</button>
                </div>
            </form>
        );
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

            <div>
                {_renderForm()}
            </div>


        </div>

    );
};

export default QuestionnairePage;