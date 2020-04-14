import React from 'react';
import Card from '../../components/Card/Card';
import './MathPage.scss';

const mathPages = [
  {
    name: "Apprentissage Profond",
    path: "/deep-learning",
    img: "https://singularityhub.com/wp-content/uploads/2018/11/multicolored-brain-connections_shutterstock_347864354-1068x601.jpg"
  },
  {
    name: "k-NN",
    path: "/k-nn",
    img: "https://www.kdnuggets.com/wp-content/uploads/knn1.png"
  },
  {
    name: "Régression linéaire",
    path: "/linear-regression",
    img: "https://user.oc-static.com/upload/2019/04/23/15560371787169_3c1-b.jpg"
  }
];


const MathPage: React.FC = () => {

  return (
    <div className="container">
      <header className="header-content">
      </header>

<div className="grid">
<div className="grid-container">

{mathPages.map((page, index) => {
      return (
        <div key={index} className="grid-item"> <Card key={index} name={page.name} path={`/math${page.path}`} img={page.img}/></div>  
      );
  })}
  </div>
</div>

    </div>
  );
}

export default MathPage;
/*
Récupérer les données
Nettoyer (consistantes et sans valeur abbérante)
Explorer 
Créer le modèle statistique
Evaluer la qualité du modèle (à représenter)
Déployer l'algorithme (en production)


chaque donnée observée est l'expression d'une variable aléatoire générée par une distribution de probabilité
*/