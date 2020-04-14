import React, { useState } from 'react';
const FirstPage: React.FC = () => {
  const [drawnNumber, setDrawnNumber] = useState(-1);

  const renderResult = () => {
    if (drawnNumber >= 0){
      return (
      <div>
        You draw a <span>{drawnNumber}</span>
      </div>);
    }
    return null;
  };

  return (
    <div className="container">
      <header className="header-content">
      </header>
      <div>
        <span>This is a test</span>
        <div id="canvas_box" className="canvas-box">
        </div>
        <div id="chart_box" className="chart-box"></div>

        <button id="clear-button" className="btn btn-dark">Clear</button>
        <button id="predict-button" className="btn btn-dark" onClick={()=>{setDrawnNumber(4)}}>Predict</button>
      </div>
      {renderResult()}
    </div>
  );
}

export default FirstPage;
