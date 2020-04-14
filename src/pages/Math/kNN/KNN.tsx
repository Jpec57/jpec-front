import React from 'react';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { Link } from 'react-router-dom';

const KNNPage: React.FC = () => {
  const size = useWindowSize();
  
  const renderTableContent = (width: number | undefined) => {
    if (typeof width === "undefined" || (width != null && width < 650)){
      return (
        <div className="flex-1">
        </div>
      );
    }
      return (
        <div className="table-content">
        <div className="table-content-enum">
          <div className="flex-horizontal">
          <Link to="/math" className="icon solid fa-chevron-left mr-15"></Link>
          <h3>k-Nearest Neighbors</h3>
          </div>

          <h3>Sommaire</h3>
      <h4>Introduction</h4>
      <ul>
        <li><a href="#use-anchor">Utilités</a></li>
      </ul>
        </div>
  </div>
      );
  };

  const renderRightMargin = (width: number | undefined) => {
    if (typeof width === "undefined" || (width != null && width < 650)){
      return (
        <div className="flex-1"></div>
      );
    }
    return (
      <div className="flex-2"></div>
    );
  }

  return (

    <div className="container flex-horizontal">

    {renderTableContent(size.width)}


  <div className="main">
  <header className="content-header">
        <h1>
        k Nearest Neighbors
        </h1>
      </header>
      <h3>
          Introduction
        </h3>
        <p id="use-anchor">

          Le k-NN est un algorithme servant pour les problèmes de classification et de régression. On choisit les <i>k</i> données
          les plus proches du point que l'on cherche à évaluer pour en prédire la valeur. 

        </p>

  </div>
      {renderRightMargin(size.width)}
      </div>
  );
}

export default KNNPage;