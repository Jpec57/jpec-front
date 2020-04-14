import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import "./css/fontawesome-all.min.css";
import "./css/main.scss";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import FirstPage from "./pages/HomePage/HomePage";
import MathPage from "./pages/Math/MathPage";
import DeepLearningPage from "./pages/Math/DeepLeaning/DeepLearning";
import KNNPage from "./pages/Math/kNN/KNN";
import RegressionPage from "./pages/Math/Regression/RegressionPage";
import JapanesePage from "./pages/Japanese/JapanesePage";
import ReviewPage from "./pages/Japanese/SRS/ReviewPage";

export default function App() {
  return (
    <Router>
      <section id="header">
        <div className="container">
          <h1 id="logo">
            <a href="index.html">Jpec website</a>
          </h1>
          <p>
            This website is created to show you what I am currently fond of.
          </p>
          <nav id="nav" className="navbar navbar-default">
            <ul>
              <li>
                <Link to="/" className="icon solid fa-home">
                  HomePage
                </Link>
              </li>
              <li>
                <Link to="/japanese" className="icon solid fa-globe-asia">
                  Japanese
                </Link>
              </li>
              <li>
                <Link to="/math" className="icon solid fa-calculator">
                  Maths
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </section>
      <Switch>
        <Route path="/math/linear-regression" component={RegressionPage} />
        <Route path="/math/k-nn" component={KNNPage} />
        <Route path="/math/deep-learning" component={DeepLearningPage} />
        <Route path="/math" component={MathPage} />
        <Route path="/japanese/review" component={ReviewPage} />
        <Route path="/japanese" component={JapanesePage} />
        <Route path="/" component={FirstPage} />
      </Switch>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
