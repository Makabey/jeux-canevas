# Jeux utilisant l'élément CANVAS de HTML5

## Mémoire
Le jeux de mémoire classique, proposant de découvrir les paires d'images cachées.

## Trouver le code
Un jeu basé sur ceux où l'on doit découvrir la séquence (ou code) caché.

## Installation
* Installez un serveur web, sous Windows vous avez l'embarras du choix (Wamp, Xamp, Easy-php, etc...); pour Linux la pile LAMP(Apache) ou LEMP(nGinx);
* Il y as deux usagers 'démo' :


## Avertissement !
* Le présent projet as été fait il y as bien longtemps et corrigé aussi peu que possible pour se conformer à HTML5;
* Le but primaire était une expérimentation avec la balise CANVAS de HTML5;
* La structure de fichier utilisée avait pour but de permettre d'inclure chaque jeu dans un iFrame comme étant des "widget" indépendants de la page hôte; 
* Dans le futur, je pourrais revisiter ce projet pour le rendre plus solide, rendre le code plus maintenable et plus attrayant visuellement;
* Beaucoup des buts initiaux n'ont pas été implémentés;
* Le code est loin d'être optimisé;


<!--
ToDo:

[ ] Accueil : étudier BootStrap et refaire la page, en mieux
[ ] Accueil : étudier le code que j'ai déjà pour me rappeller comment fonctionne le routing avec un .htaccess <-- en fait je n'ai pas de fichier htaccess pour le moment, bizarre, tenter d'en mettre un?

[ ] Jeux : changer csvFunctions, lire et écrire pour permettre d'avoir les X derniers meilleurs scores
[ ] Jeux : Supporter les sessions ou cookies pour le nom du joueur
[ ] Jeux : une passe SEO et support d'autres fureteurs que FF

[ ] Jeux : tenter de créer une librairie JS pour le dialogue de win/lose?(question d'uniformiser) Il fonctionnerais comme ceci :
	= à l'appel de la fonction d'init (qui reçoit le chemin et nom de fichier à manipuler, message "win" défaut pouvant inclure X paramètres '%s' et le message "lose" aussi avec paramètre), il crée un bloc de script (dans le head?) pour prendre en charge ses évènements (boutons, etc), ou alors possible de laisser un bloc window.addEventListener dans le fichier JS? <-- PS: utiliser un namespace?
	= il crée/injecte aussi tout le code HTML/CSS ou pour le CSS injecte le fichier dans le HEAD de la page hôte?
	= tenter de tout faire -sans- jQuery!
	= pour la fonction appellée dans les cas win/lose, écrire le code de façon à pouvoir lui passer quel état afficher(win/lose) et soit une chaine/int, soit un array de valeurs (qui doivent correspondre au nombre de params passés durant la fonction Init mais sans trop insister si le nombre est différent, la fonction essaie de faire "fitter" au mieux, ex: dupliquer le dernier param s'il y en as trop peu) à injecter dans les messages de win/lose, incluant si nécessaire un peu de HTML (ex: la solu pour TrouverCode)
	= pour les fonctions de XHR et CSV, je met quand même les fichiers dans le HEAD ou est-ce que les balises script/src sont injectée?
[ ] Jeux : tenter d'encapsuler et d'en faire de vrai Widgets? ( avec tout les changements écris plus tôt, reviens à ça et donc devrais être assez facile à convertir )
[ ] Jeux : (idée de widget/encapsulation/classes) faire en sorte que l'on puisse dans une autre page inclure un module JS qui fait tout le travail d'init et d'affichage incluant probablement créer dynamiquement toutes les balises (ce qui serait un peu exagérer)
-->