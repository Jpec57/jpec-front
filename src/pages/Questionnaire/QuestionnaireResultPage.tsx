import React from "react";
import {useParams} from "react-router";

const QuestionnaireResultPage: React.FC = () => {
    let { token } = useParams();

    return (
        <div className="container">
            <header className="header-content">
            </header>

            <div className="grid">
                <div className="grid-container">
                    Bonjour {token}
                </div>
            </div>

        </div>
    );
};

export default QuestionnaireResultPage;