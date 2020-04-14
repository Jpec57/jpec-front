import React from 'react';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { Link } from 'react-router-dom';
import acp_principle_img from '../../../css/images/acp_principle.jpg';

const Latex = require('react-latex');

const DeepLearningPage: React.FC = () => {
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
          <h3>Apprentissage profond</h3>
          </div>

          <h3>Sommaire</h3>
      <h4>Introduction</h4>
      <ul>
        <li><a href="#definition-anchor">Definitions</a></li>
        <li><a href="#knowledge-based-anchor">Approche fondée sur la connaissance</a></li>
        <li><a href="#automatic-learning-anchor">Apprentissage automatique</a></li>
        <li><a href="#representation-learning-anchor">Apprentissage de représentation</a></li>
        <li><a href="#deep-learning-anchor">Apprentissage profond</a></li>
      </ul>

      <h4>Rappels mathématiques</h4>
      <ul>
        <li><a href="#norm-anchor">Normes</a></li>
        <li><a href="#matrix-decomposition-anchor">Décompositions matricielles intéressantes</a></li>
        <li>
          <a href="#acp-anchor">Applications: Analyse en Composantes Principales</a>
          <ul>
            <li><a href="#acp-goal-anchor">> Objectifs</a></li>
            <li><a href="#acp-constraints-anchor">> Contraintes</a></li>
            <li><a href="#acp-consequences-anchor">> Conséquences sur la résolution du problème</a></li>
            <li><a href="#acp-matrix-anchor">> Trouver la matrice optimale</a></li>
          </ul>
        </li>

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
          Apprentissage profond
        </h1>
      </header>

      <h3>
          Introduction
        </h3>
        <p id="definition-anchor">

          L'apprentissage profond, autrement appelé <i>Deep learning</i> est un ensemble de méthodes d'apprentissage automatique tentant de tirer
          des informations à partir de données brutes pour les modéliser. 
        
        <br></br>
        Cette modélisation est construite à l'aide d'un enchaînement d'opérations mathématiques
          que l'on compare fréquemment au fonctionnement du cerveau humain avec les neurones. 
          Pour cette raison, l'apprentisage profond est très souvent appelé "réseau de neurones artificiels"
          (RNA). Cette similitude est due à l'inspiration qu'à évoquer l'étude du cerveau humain 
          pour établir un algorithme de pensée efficace pour l'ordinateur. Toutefois, la similitude s'arrête ici
          car l'apprentissage profond n'a pas pour but de copier le fonctionnement exact du cerveau humain, ni
          d'en comprendre tous les rouages, mais bien simplement de s'en inspirer.

        </p>
        <p id='knowledge-based-anchor'>
          Durant les premiers balbutiements de l'IA, on chercha à codifier les connaissances du monde en un langage 
          formel sur lequel l'ordinateur pouvait raisonner en utilisant des règles d'inférences logiques: c'est <b>l'approche
          fondée sur la connaissance.</b>

        </p>
        <p>
          Toutefois, les difficultés de mémoire et de complexité d'encodage amenèrent rapidement les programmes à tenter d'exploiter 
          directement les données brutes pour en extraire eux même des modèles.
        </p>
        <p id='automatic-learning-anchor'>
          <b>L'apprentissage automatique</b> permet de s'affranchir de l'énumération de tous les comportements possibles
          en se basant sur une représentation des données qui leur est transmise. 
          La performance de ces algorithmes dépendaient beaucoup de la représentation des données transmises. On
          communique à l'ordinateur les points clés à prendre en compte pour une décision. 
        </p>
        <p id='automatic-learning-limit-anchor'>
          Très perfomant pour bon nombre
          de tâches, il n'en reste pas moins impossible à appliquer à divers problématiques telles que la reconnaissance
          d'une roue sur une image. En effet, notre expérience en tant qu'être vivant nous a permis, au travers de milliers
          d'exemples observés de définir ce qu'est une roue, mais comment cela se traduit il en pixels ? La définir comme un cercle
          reviendrait à oublier les ombres pouvant perturber l'image, les objets pouvant cacher la vue totale de la roue...

        </p>
        <p id='representation-learning-anchor'>
          <b>L'apprentisage de représentation</b> permet de découvrir les caractéristiques composant la donnée. Le but 
          de ce type d'algorithme est généralement de différencier les facteurs de variation (sources d'influence de la donnée)
          
        </p>
        <p id='representation-learning-limitation-anchor'>
          Lorsqu'il est presque aussi difficile d'obtenir une représentation que de résoudre le problème initial,
          l'apprentisage par représentation ne semble pas suffire.

          Par exemple, si ces données sont trop sophistiquées et nécessitent une expérience digne d'un
          humain afin d'en apercevoir les nuances comme pourrait l'être la distinction de l'accent d'une personne
          l'apprentissage profond est nécessaire.
          </p>
        <p id="deep-learning-anchor">
          <b>L'apprentissage profond</b> permet quant à lui de déduire des représentations complexes à partir de
          représentations simples et intermédiaires. A partir des différences de pixels, 
          le programme peut distinguer les coins et les contours présents sur l'image pour déterminer 
          les bords de l'objet représenté. On se dirige des couches visibles vers des couches "cachées"
          représentant des concepts abstraits.
        </p>

        <h3>
          Rappels mathématiques (...ou pas)
        </h3>

        <h4 id="norm-anchor">
          Normes
        </h4>

<ul>
  <li>
  La norme utilisée par convention est la norme euclidienne 
        <Latex>{` $L^{2}(x) = ||x||_{2} = (\\sum \\limits_{\\underset{}{i=0}}^n |x_{i}|^{2})^{1/2}$.`}</Latex>
  </li>
  <li>
  Une autre norme couramment utilisée est la norme uniforme <Latex>{`$L^{\\infty} = max |x_{i}|$.`}</Latex>
  </li>
  <li>
  La norme <Latex>{`$L^{1} = \\sum \\limits_{\\underset{}{i=0}}^n |x_{i}|$`}</Latex> est quant à elle principalement utilisée lorsque la différence entre les éléments égaux à zéro et 
les éléments différents de zéro est importante.
  </li>
  <li>
  Il existe aussi la norme de Frobenius qui permet de mesure la taille d'une matrice notée <Latex>{`$L^{F}=\\sqrt{\\sum \\limits_{\\underset{}{i,j}} A_{i,j}^{2}} = \\sqrt{Tr(AA^{T})}$`}</Latex>

  </li>
</ul>

        <h4 id="matrix-decomposition-anchor">
          Décompositions de matrices intéressantes
        </h4>

        <div>Quelques décompositions matricielles sont intéressantes afin d'accélérer le calcul informatique. Cela peut être dû au fait d'avoir une formule toute faite
          pour les multiplications ou simplement une réduction du nombre d'opérations à réaliser. Ainsi, on notera:
          <ul>
            <li>
              la décomposition en valeurs propres:         
              <Latex>{` $A = V * diag(\\lambda) * V^{-1} $avec V une concaténation de n vecteurs propres et $\\lambda$ une concaténation de n valeurs propres.`}</Latex>
            </li>
            <li>
              la décomposition en valeurs singulières: 
              <Latex>{` $A = U * D * V^{T} $`}</Latex>  où U et V sont orthogonales. 
            </li>
          </ul>
          Cette dernière notation est intéressante car elle permet de généraliser partiellement l'inversion matricielle des matrices non carrées.
          De cette façon, quand on cherche à résoudre l'équation Ax = y, il suffit de prendre B l'inverse à gauche de A donnant x = By.
          Deux cas se présente alors:
          <ul>
            <li>
              Si A est plus haut que large: il est possible qu'il n'y ait pas de solution. En prenant <Latex>{"$x = A^{+} y$"}</Latex>, on obtient le x pour lequel Ax
              est aussi proche que possible de y en norme euclidienne où <Latex>{`$A^{+}= \\lim_{\\alpha \\to 0}(A^{T}A + \\alpha I)^{-1}A^{T} = V * D^{+} * U^{T}$`}</Latex>
            </li>
            <li>
            Si A est plus large que haut: il est possible d'avoir plusieurs solutions, mais on obtient au moins la solution donnée par x qui a une norme euclidienne 
            minimale parmis toutes les solutions possibles.
            </li>
          </ul>
        </div>



        <h4 id="acp-anchor">
          Application: analyse en composantes principales (ACP)
        </h4>

        <p>
          L'ACP consiste en une compression, avec perte de précision, de données
          afin de réduire la quantité de mémoire nécessaire au stockage des informations.
          Pour réaliser ceci,on cherchera à <b>représenter les éléments en plus basse dimension</b>.
        </p>
        <h5 id="acp-goal-anchor">Objectifs</h5>
        <p>
  On veut donc passer des vecteurs <Latex>{`$x^{(i)} \\in	\\R^{n}$`}</Latex> aux vecteurs 
  <Latex>{` $c^{(i)} \\in	\\R^{l}$`}</Latex> avec <Latex>{`$l < n$`}</Latex> pour diminuer la dimension.
        </p>

        <div>
          Cela implique alors les deux sous objectifs suivants:
          <ol><li>
  <Latex>{`$\\Rightarrow$`}</Latex> Trouver f tel que <Latex>{`$f(x) = c$`}</Latex> qui permet <b>à partir de l'encodement de x de trouver c</b>.
  </li><li>
          <Latex>{`$\\Leftarrow$`}</Latex> Trouver g tel que <Latex>{`$x \\approx g(f(x)) = g(c)$`}</Latex> qui permet <b>à partir de l'encodement de x de trouver c</b>.
          </li>
          </ol>

<div className="centered-div">
<img src={acp_principle_img} alt='ACP principle' height={300}/>
</div>
        </div>

        <h5 id="acp-constraints-anchor">Contraintes</h5>
        <div>
          Pour réduire la complexité du problème, nous sommes amenés à ajouter des 
          contraintes à notre problème initial. Ainsi, on choisit d'utiliser la multiplication
  matricielle pour représenter le code dans <Latex>{`$\\R^{n}$`}</Latex>, soit <Latex>{`$g(c) = Dc$`}</Latex> avec <Latex>{`$D \\in \\R^{n*l}$`}</Latex> et D avec des colonnes orthogonales aux normes unitaires.
        </div>


        <h5 id="acp-consequences-anchor">Conséquences sur la résolution du problème</h5>
        <div>
          On va chercher le code optimal <Latex>{`$c^{*}$`}</Latex> qui minimise la distance euclidienne
          entre un élément <Latex>{`$x$`}</Latex> et sa reconstruction en plus basse dimension <Latex>{`$g(c)$`}</Latex>. D'où: 
          <div className='centered-div'>
            <Latex>{`$c^{*} = \\underset{c}{argmin} ||x-g(c)||_{2}^{2}$`}</Latex>
          </div>
          NB: On s'autorise à considérer le carré de la distance euclidienne minimale 
          car cette dernière est positive  avec la fonction carrée qui est monotone et strictement
          croissante et qu'on ne s'intéresse qu'à l'argument donnant la distance minimale et non sa valeur.

          <Latex displayMode={true}>{`$$||x-g(c)||_{2}^{2} = (x - g(c))^{T} (x - g(c)) $$`}</Latex>
          <Latex displayMode={true}>{`$ = x^{T}x - 2x^{T}g(c) + g(c)^{T}g(c)$`}</Latex>
  Or, par hypothèse, on a posé <Latex>{`$g(c) = Dc$`}</Latex>. De plus, on a <Latex>{`$x^{T} * x$ `}</Latex>
  qui ne dépend pas de <b>c</b> (variable pour laquelle on cherche à minimiser l'écart), d'où:
  <Latex displayMode={true}>{`$$c^{*} = \\underset{c}{argmin} (-2x^{T}Dc + c^{T}D^{T}Dc)$$`}</Latex>

  <Latex displayMode={true}>{`$$= \\underset{c}{argmin} (-2x^{T}Dc + c^{T}c)$$`}</Latex>


Ainsi, on a en dérivant selon <b>c</b> (dérivée matricielle: ) :
<Latex displayMode={true}>{`$\\nabla_{c} (-2x^{T}Dc + c^{T}c) = 0$`}</Latex>
<Latex displayMode={true}>{`$-2x^{T}D + 2c^{T} = 0$`}</Latex>
<Latex displayMode={true}>{`$c^{T} = x^{T}D$`}</Latex>
<Latex displayMode={true}>{`$ \\boxed {c = f(x) = D^{T}x}$`}</Latex>

A partir de ce résultat, nous pouvons donc retrouver l'opérateur de reconstruction ACP:
<Latex displayMode={true}>{`$ \\boxed {r(x) = g(c) = g(f(x)) = DD^{T}x}$`}</Latex>


<h5 id="acp-matrix-anchor">Trouver l'expression de la matrice D optimale</h5>

<div>
  Nous avons, à ce stade, réussi à exprimer notre opérateur de reconstruction d'un élément x à partir de l'expression
  d'une matrice D. Il convient à présent de ne plus considérer un élément de façon isolée dans l'expression de la matrice 
  <Latex>{` $D^{*}$`}</Latex> optimale car elle servira à décoder l'ensemble des points.
    Nous utiliserons donc la <b>norme de Frobenius</b> pour minimiser les erreurs calculées
    sur tout les dimensions et tous les points.

  <Latex displayMode={true}>{`$D^{*} = \\underset{D}{argmin}{\\sqrt{\\underset{i,j}{\\sum} (x^{(i)}_{j} - r(x^{(i)})_{j} )^{2} }}$`}</Latex>
  avec <Latex>{`$D^{T}D = I_{l}$`}</Latex>

<p>
Pour déterminer l'algorithme de recherche de <Latex>{`$D^{*}$`}</Latex>, commençons par nous pencher sur le 
  cas l = 1. La matrice <b>D</b> sera alors notée simplement <b>d</b> car réduite à un vecteur.

  <Latex displayMode={true}>{`$d^{*} = \\underset{d}{argmin}{\\underset{i,j}{\\sum} (x^{(i)} - dd^{T}x^{(i)})^{2} }$`}</Latex>
  Soit en utilisant une matrice pour s'abstraire de la notation en somme: 
  <Latex displayMode={true}>{`$d^{*} = \\underset{d}{argmin}{||X - Xdd^{T}||^{2}_{F} }$`}</Latex>
  avec <Latex>{`$d^{T}d = 1$`}</Latex>

</p>

<p>A l'aide de simplifications similaires à la partie précédente (supprimer les termes ne 
dépendant plus de d, l'orthogonalité et les contraintes de norme de d ie <Latex>{`$d^{T}d = 1$`}</Latex> et les propriétés d'invariance cyclique de la trace), on obtient:
  <Latex displayMode={true}>{`$d^{*} = \\underset{d}{argmin}{ (- Tr(X^{T}Xdd^{T})) }$`}</Latex>
  <Latex displayMode={true}>{`$d^{*} = \\underset{d}{argmax}{(Tr(X^{T}Xdd^{T}))}$`}</Latex>
  <Latex displayMode={true}>{`$d^{*} = \\underset{d}{argmax}{(Tr(d^{T}X^{T}Xd))}$`}</Latex>
  avec <Latex>{`$d^{T}d = 1$`}</Latex>
</p>

<p>
En utilisant alors la décomposition en éléments propres, on trouve que le <b>d </b>
optimal est donnée par le vecteur propre de <Latex>{`$X^{T}X$`}</Latex> correspondant à la
plus grande valeur propre. (Cette conclusion est encore floue pour moi. N'hésitez pas à me contacter
pour me l'expliquer &#128566; ).
</p>

<p>
  Nous nous sommes exclusivement concentrés sur une dimension (l=1) pour trouver
  la première composante principale. Toutefois, ce raisonnement se généralise est la matrice 
  <b> D</b> est donnée par les <b>l</b> vecteurs propres correspondant aux plus grandes valeurs propres.
</p>

</div>

        </div>



        </div>
      {renderRightMargin(size.width)}
      </div>
  );
}

export default DeepLearningPage;
/*
Récupérer les données
Nettoyer (consistantes et sans valeur abbérante)
Explorer 
Créer le modèle statistique
Evaluer la qualité du modèle (à représenter)
Déployer l'algorithme (en production)


chaque donnée observée est l'expression d'une variable aléatoire générée par une distribution de probabilité
*/