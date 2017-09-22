"use strict";

//Variables globales du module
var lastClicked_Tile=0;
var lastClicked_MenuOption="4_2";
var array_Tiles=new Array(); // Les tuiles, leur valeur change par un click de l'utilisateur;
var array_Solution=new Array(); // Les tuiles telles que selectionnees au chargement de la page
var array_Essai=new Array(0,0,0,0); // Les tuiles classées selon la Solution, cad, 0=non, 1=couleur ok, 2=couleur ok ET position ok, pour Col Verification
var couleurs=new Array();
var canvas;
var canvas_offsetY=30;

couleurs=[["#FF1111", "#FF9999"], ["#11FF11", "#99FF99"], ["#1111FF", "#9999FF"], ["#FFA500", "#FF8C00"], ["#DEB887", "#FFE4C4"]];

// Taille et distance entre les "boutons", c'est a dire les cercles qui (originalement) apparaissent pour sélectionner la solution
var rayon=20;
var paddingX_Boutons=5;
var baseX_Boutons=rayon+paddingX_Boutons;
var distX_Boutons=(rayon*2)+paddingX_Boutons;

/* Taille et distance entre les "pins", c'est a dire les rectangles qui apparaissent apres avoir cliqué le bouton "verifier" et qui representent une appreciation du choix du joueur versus la solution */
var pinsW=15;
var paddingX_SoluPins=5;
var paddingY_SoluPins=10;
var baseX_SoluPins=pinsW+paddingX_SoluPins;
//var distX_SoluPins=(pinsW*2)+(paddingX_SoluPins*3.25);
var distY_SoluPins=(pinsW*2)+(paddingX_SoluPins*3);

// Parametres du jeu
var ligne_courante=1; // La ligne courante qui doit etre construite et etre interactive
var nbr_tuiles=4; // le nombre de points/boutons. pour le moment n'influe pas sur la largeur du Canvas
var nbr_tuiles_max=4; // pour le placement dessiné durant canvas.dessinerComparaison et le Bouton
var max_essais=9;
var nbr_essais=0;
var dessinerPastille=dessinerPastille_3D; // Laquelle des fonctions de dessin utiliser :)
var dessinerBouton=dessinerBouton_3D; // Laquelle des fonctions de dessin utiliser :)
var panneauScoreID = ".widget_mksoft>div>div.dialogue.winlose";
var alerteRegles = ".widget_mksoft>div>div.dialogue.alerte";
//var BASE_DIR = "/jeux_canvas/widgets/assets";
var BASE_DIR = "../common/xhr/";

/* FUNCTIONS XHR */
/*********************
	FONCTIONS DE TRAITEMENT DES RETOURS POSITIFS
	(C'est à dire, quand la requête XHR s'est complètée correctement. Ici on réagit selon le type de la requête, que ce soit par un message de confirmation ou la manipulation des données de retour.)
*********************/
function retour_enregistrerScore(retour){
	if(retour <= 0){
		$(panneauScoreID + " fieldset:nth-child(4)").html("Une erreur est survenue durant l'enregistrement de votre pointage : " + retour);
	}else{
		var XHR_Query = "oper=lire&nombre=-5&f=Jeu_TLC_Scores"; // demander les 5 dernières entrées
		execXHR_Request(BASE_DIR + "Jeux_ManageScores.xhr.php", XHR_Query, retour_lireScores, traiterErreurs);
	}
}

function retour_lireScores(retour){
	// éventuellement voir pour un polyfill (IE6 et autres vieux) :: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/JSON
	retour = JSON.parse(retour);

	var cTable="<table><tr><th>"+retour[0].join("</th><th>")+"</th></tr>";
	for(var iCmpt=1;iCmpt<retour.length;iCmpt++){
		cTable += "<tr><td>"+retour[iCmpt].join("</td><td>")+"</td></tr>";
	}
	cTable += "</table>";
	$(panneauScoreID + " fieldset:nth-child(4)").html(cTable);
	$(panneauScoreID + " fieldset:nth-child(3)").css({"display":"none"});
}


/**********************
	FONCTIONS DE TRAITEMENT DES RETOURS NÉGATIFS
**********************/
function traiterErreurs(msgErreur){
	/*
		Voir appels à "execXHR_Request",
		Sert à traiter l'erreur recue.
	*/
	if(msgErreur.substring(0,6) =="<br />"){ // Si commence par '<br />', on suppose que c'est une erreur PHP!
		msgErreur = "[PHP] " + strStripHTML(msgErreur);
	}

	alert("[traiterErreurs] L'erreur suivante est survenue : '"+msgErreur+"'");
}


/**********************
	WRAPPERS
**********************/


/****************************
	FUNCTIONS globales
****************************/
function afficherPanneauScores(bGagnant, message){
	var sTemp="";
	var cmpt1;

	if(bGagnant){
		$(panneauScoreID + " fieldset:nth-child(3)").css({"display":"block"});
	}else{
		$(panneauScoreID + " fieldset:nth-child(3)").css({"display":"none"});

		sTemp = '<span>Solution : </span>';
		for(cmpt1=0;cmpt1<nbr_tuiles;cmpt1++){
			sTemp += '<div style="background-color:' + couleurs[array_Solution[cmpt1]][0] + ';"></div>';
		}
	}

	$(panneauScoreID + " fieldset:nth-child(2)>p").html(message);

	$(panneauScoreID + " fieldset:nth-child(4)").html(sTemp);

	$(panneauScoreID).css({"display":"block"});

	sTemp = panneauScoreID + ' fieldset:nth-child(3) input';

	setTimeout(function (){
		document.querySelector(sTemp).focus();
	}, 500); // setTimeOut nécessaire, sinon le focus ne s'effectue pas
}


function InitialiserSolution(){ // Tirer les "nbr_tuiles" chiffres de la solution
	var cmpt1;

	for(cmpt1=0;cmpt1<nbr_tuiles;cmpt1++){
		array_Solution[cmpt1]=Math.floor(Math.random()*couleurs.length);
	}
}

function ComparerEssaiEtSolution(){
	/* comparer array_Tiles avec array_Solution, mettre les conclusions dans array_Essai

		possibilitees :
		-bonne couleur et bonne position
		-bonne couleur, mauvaise position
		-mauvaise couleur
	*/
	// Les tuiles classes selon la Solution, cad, 0=non(Dud), 1=couleur ok(SemiParfait), 2=couleur ok ET position ok(Parfait), pour Col Verification
	var index=0;
	var array_SoluLocale=array_Solution.slice(0); // duplique le -contenu- du Array >> http://my.opera.com/GreyWyvern/blog/show.dml/1725165
	var array_TilesLocale=array_Tiles.slice(0);
	var retour = 0;
	var cmpt1, cmpt2;

	array_Essai=new Array(0,0,0,0); // Initialiser a "Dud"

	for(cmpt1=0;cmpt1<nbr_tuiles;cmpt1++){ // Tester lesquels sont "Parfait"
		if(array_TilesLocale[cmpt1]==array_SoluLocale[cmpt1]){
			array_Essai[index]=2;
			index++;
			array_SoluLocale[cmpt1]=99; // indiquer que la case as ete evaluee
			array_TilesLocale[cmpt1]=98;
		}
	}
	retour = index;

	for(cmpt1=0;cmpt1<nbr_tuiles;cmpt1++){ // Tester lesquels sont "SEMIParfait"
		for(cmpt2=0;cmpt2<nbr_tuiles;cmpt2++){
			if(array_TilesLocale[cmpt1]==array_SoluLocale[cmpt2]){
				array_Essai[index]=1;
				index++;
				array_SoluLocale[cmpt2]=99; // indiquer que la case as ete evaluee
				array_TilesLocale[cmpt1]=98;
				break;
			}
		}
	}

	return retour;
}

function resetJeu(){
	ligne_courante=1;
	lastClicked_Tile=0;
	nbr_essais=0;

	array_Tiles=new Array();
	array_Essai=new Array(0,0,0,0);

	canvas.clear();
	InitialiserSolution(); // Tirer les "nbr_tuiles" chiffres a deviner
	creerLigne(canvas, nbr_tuiles, ligne_courante, array_Essai); // Dessiner une premiere ligne interactive

	$(panneauScoreID).css({"display":"none"});
	$(panneauScoreID + " fieldset:nth-child(4)").html('');
}


function dessinerPastille_2D(leCaneva, posX, posY, rayon, couleur1, couleur2){ // Cree trois cercles superposes pour faire figure de bouton
	var ctx=leCaneva.getContext("2d");
	var couleur3="#FFFFFF";
	var diviseur;

	ctx.beginPath();
	ctx.arc(posX, posY, rayon,0,2*Math.PI,false);
	ctx.fillStyle=couleur1;
	ctx.fill();
	ctx.strokeStyle="#000000";
	ctx.stroke();

	diviseur=2.3;
	rayon/=diviseur;
	posX=posX-(rayon/diviseur)-2;
	posY=posY-(rayon/diviseur)-4;
	ctx.beginPath();
	ctx.arc(posX, posY, rayon,0,2*Math.PI,false);
	ctx.fillStyle=couleur2;
	ctx.fill();

	diviseur=2.7;
	rayon/=diviseur;
	posX=posX-(rayon/diviseur)-2;
	posY=posY-(rayon/diviseur)-2;
	ctx.beginPath();
	ctx.arc(posX, posY, rayon,0,2*Math.PI,false);
	ctx.fillStyle=couleur3;
	ctx.fill();
}

function dessinerPastille_3D(leCaneva, posX, posY, rayon, couleur1, couleur2){ // Cree un bouton avec dégradés
	var ctx=leCaneva.getContext("2d");
	var couleur3="#FFFFFF";
	var couleur4="#111111";

	ctx.beginPath();
	ctx.arc(posX,posY,rayon,0,2*Math.PI,false);

	// Create gradient
	var grd=ctx.createRadialGradient(posX-Math.ceil(rayon/3.25),posY-Math.ceil(rayon/3.25),Math.ceil(rayon/10),posX-rayon+6,posY-rayon+6,rayon*2);
	grd.addColorStop(0,couleur3);
	grd.addColorStop(0.1,couleur1);
	grd.addColorStop(1,couleur4);

	// Fill with gradient
	ctx.fillStyle=grd;
	ctx.fill();
}

function dessinerBouton_2D(leCaneva, posX, posY, texte, clrTexte, clrBordure, clrFond, width, height, angleCoins, offsetTextX){
	var ctx = leCaneva.getContext("2d");
	var border = 2;
	var police_hauteur = 16;
	var police_largeur = 6;
	var texte_offsetX, texte_offsetY;

	if(texte === undefined){ texte = "Ok"; }
	if(clrTexte === undefined){ clrTexte = "#000000"; }
	if(clrBordure === undefined){ clrBordure = "#000000"; }
	if(clrFond === undefined){ clrFond = "#DDDDDD"; }
	if(width === undefined){ width = 200; }
	if(height === undefined){ height = 50; }
	if(angleCoins === undefined){ angleCoins = 10; }
	if(offsetTextX === undefined){ offsetTextX = -5; }

	width -= border*2;
	height -= border*2;

	ctx.lineWidth = border*2;
	ctx.roundRect(posX+border, posY+border, width, height, {upperLeft:angleCoins, upperRight:angleCoins, lowerLeft:angleCoins, lowerRight:angleCoins});
	ctx.fillStyle = clrFond;
	ctx.strokeStyle = clrBordure;
	ctx.stroke();
	ctx.fill();

	ctx.lineWidth=1;
	ctx.font="bold 1.0em Georgia";
	ctx.strokeStyle = 'none';
	ctx.fillStyle = clrTexte;
	texte_offsetX = Math.floor((width/2) - ((police_largeur*texte.length)/2)) + offsetTextX;
	texte_offsetY = Math.floor((height/2) + (police_hauteur/2)) ;
	ctx.fillText(texte, posX+texte_offsetX, posY+texte_offsetY);
}

function dessinerBouton_3D(leCaneva, posX, posY, texte, clrTexte, clrBordure, clrFond, width, height, angleCoins, offsetTextX){
	var ctx = leCaneva.getContext("2d");
	var border = 2;
	var police_hauteur = 16;
	var police_largeur = 6;
	var texte_offsetX, texte_offsetY;
	var retour;
	var width1, height1, posX1, posY1;
	var trait;

	if(texte === undefined){ texte = "Ok"; }
	if(clrTexte === undefined){ clrTexte = "#000000"; }
	if(clrBordure === undefined){ clrBordure = "#000000"; }
	if(clrFond === undefined){ clrFond = "#DDDDDD"; }
	if(width === undefined){ width = 200; }
	if(height === undefined){ height = 50; }
	if(angleCoins === undefined){ angleCoins = 10; }
	if(offsetTextX === undefined){ offsetTextX = -5; }

	width1 = width - border*2;
	height1 = height - border*2;
	posX1 = posX + border*1;
	posY1 = posY + border*1;

	// Fond du bouton
	ctx.roundRect(posX1, posY1, width1, height1, {upperLeft:angleCoins, upperRight:angleCoins, lowerLeft:angleCoins, lowerRight:angleCoins});
	ctx.fillStyle = clrFond;
	ctx.fill();

	// Contour interne
	ctx.lineWidth = border*2;
	width1-=2;
	height1-=2;
	posX1+=1;
	posY1+=2;
	retour = HexColorRemix(clrFond, "lighten", 8);
	trait = (false === retour)?"#000":retour;
	ctx.roundRectUL(posX1, posY1, width1, height1, {upperLeft:angleCoins, upperRight:angleCoins, lowerLeft:angleCoins, lowerRight:angleCoins}, trait);

	// Contour externe
	width1 = width - border;
	height1 = height - border;
	posX1 = posX + border;
	posY1 = posY + border-1;
	trait = "#333";
	ctx.roundRectLR(posX1, posY1, width1, height1, {upperLeft:angleCoins, upperRight:angleCoins, lowerLeft:angleCoins, lowerRight:angleCoins}, trait);

	// Mettre le texte
	ctx.lineWidth=1;
	ctx.font="bold 1.0em Georgia";
	ctx.strokeStyle = 'none';
	ctx.fillStyle = clrTexte;
	texte_offsetX = Math.floor(((width-border*2)/2) - ((police_largeur*texte.length)/2)) + offsetTextX;
	texte_offsetY = Math.floor(((height-border*2)/2) + (police_hauteur/2)) ;
	ctx.fillText(texte, posX+texte_offsetX, posY+texte_offsetY);
}

function HexColorRemix(couleur, operation, difference){
	/*
		operation :
			darken : noircir / additionner la valeur de difference
	*/
	var retour = "";
	var cmpt;
	var tmpClr;
	var hexCode = /[#0-9A-F]/i;

	if(false === hexCode.test(couleur)) return false;

	couleur = couleur.toUpperCase();

	for(cmpt=0;cmpt<couleur.length;cmpt++){
		if(couleur[cmpt] == '#'){
			retour='#'; // pas de concaténation parce que c'est supposé être le premier caractère
		}else{
			tmpClr = couleur.charCodeAt(cmpt);

			switch(operation){
				case 'lighten':
					tmpClr += difference;
					if(tmpClr > 57){
						tmpClr -= 57;
						tmpClr += 65;
					}

					if(tmpClr > 70) tmpClr = 70; // Si plus que 'F', corriger
					break;

				case 'darken': // opération per défaut et donc mm code que 'default'
				default:
					tmpClr -= difference;
					if(tmpClr < 65){
						tmpClr = 65 - tmpClr;
						tmpClr = 58 - tmpClr;
					}

					if(tmpClr < 48) tmpClr=48; // si sous 0, corriger
			}

			retour += String.fromCharCode(tmpClr);
		}
	}

	return retour;
}

function creerLigne(LeCanevas, numX, rowY, arrCouleursVoulues, modeSoluce){ // Creer une ligne sur (les elements de) laquelle le joueur peux cliquer pour entrer sa solution
	var y, iCmpt, posX, posY, width, height;
	var texteBouton;

	if(modeSoluce === undefined){ modeSoluce = false; }
	y=rowY-1;
	texteBouton = (modeSoluce)?"Réinit.":"Vérifier";

	for(iCmpt=0;iCmpt<numX;iCmpt++){
		posX = baseX_Boutons+(distX_Boutons*iCmpt);
		posY = baseX_Boutons+(distX_Boutons*y);

		dessinerPastille(LeCanevas, posX, posY, rayon, couleurs[arrCouleursVoulues[iCmpt]][0], couleurs[arrCouleursVoulues[iCmpt]][1]);
		posX -= rayon;
		posY = (posY-rayon);
		width = height = (rayon*2)+2;
		LeCanevas.addRegion(posX, posY, width, height, "Pastille"+iCmpt);
	}

	posX = (paddingX_Boutons*2)+(distX_Boutons*nbr_tuiles_max);
	posY = paddingX_Boutons + (distX_Boutons*y);
	width = 78;
	height = 40;
	dessinerBouton(LeCanevas, posX, posY, texteBouton, "#ffffff", "#000000", "#00aaff", width, height, 10);

	width += 2;
	height += 2;
	LeCanevas.addRegion(posX, posY, width, height, "BoutonVerifReset");

	array_Tiles=arrCouleursVoulues.slice(0);
}

function changeTileColor(lastClicked_Tile){ // Changer la couleur de la tuile cliquee
	var posX = baseX_Boutons+(distX_Boutons*(lastClicked_Tile));
	var posY = baseX_Boutons+(distX_Boutons*(ligne_courante-1));
	var couleur1, couleur2;

	array_Tiles[lastClicked_Tile]++;
	if(array_Tiles[lastClicked_Tile] > (couleurs.length-1)){
		array_Tiles[lastClicked_Tile] = 0;
	}

	couleur1 = couleurs[array_Tiles[lastClicked_Tile]][0];
	couleur2 = couleurs[array_Tiles[lastClicked_Tile]][1];

	dessinerPastille(canvas, posX, posY, rayon, couleur1, couleur2);
}

function dessinerComparaison(canvasRslt, offsetX, array_Essai){
	// Dessiner ce que le joueur as bien devine
	// Les tuiles selon la Solution, cad, 0=non(Dud), 1=couleur ok(SemiParfait), 2=couleur ok ET position ok(Parfait)
	var ctx=canvasRslt.getContext("2d");
	var regionBouton = canvasRslt.findRegionByName("BoutonVerifReset");
	var cmpt1;

	// Effacer le bouton
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(regionBouton.x-1, regionBouton.y-1, regionBouton.l+1, regionBouton.h+1);

	for(cmpt1=0;cmpt1<nbr_tuiles;cmpt1++){
		switch(array_Essai[cmpt1]){
			case 2 : ctx.fillStyle="#00FF00"; break;
			case 1 : ctx.fillStyle="#FF0000"; break;
			case 0 : ctx.fillStyle="#888800"; break;
		}
		ctx.fillRect(paddingX_SoluPins+(baseX_SoluPins*cmpt1)+offsetX, paddingY_SoluPins+(distY_SoluPins*(ligne_courante-1)), pinsW, pinsW*2);
	}
}


/* EVENTS */
function doMouseDown(event){
	// pour une autre approche, voir :: http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/

	// Durant cet evenement on cherche sur quel "tuile" l'usager as cliquer
	// c'est pour eventuellement appeller une autre fonction pour redessiner le bouton
	// 'clientX/Y' donnent la partie 'visible'
	//	'pageX/Y' donnent selon le 0,0 de la page
	// 'layerX/Y' donnent le 0, 0 de l'élément s'il est positionné, "position:relative" fonctionne

	var layerX = event.layerX;
	var layerY = event.layerY;
	var nomRegion = this.findRegionByPos(layerX, layerY);
	var tuiles_juste;

	if(nomRegion !== false){
		if(nomRegion == "BoutonVerifReset"){
			nbr_essais++;
			tuiles_juste = ComparerEssaiEtSolution();
			dessinerComparaison(canvas, (distX_Boutons*nbr_tuiles_max)+paddingX_Boutons, array_Essai);

			if(tuiles_juste<nbr_tuiles){
				ligne_courante++;
				if(nbr_essais<max_essais){
					creerLigne(canvas, nbr_tuiles, ligne_courante, array_Tiles);
				}else{
					creerLigne(canvas, nbr_tuiles, ligne_courante, array_Solution, true);
					afficherPanneauScores(false, "Désolé, vous n'avez plus d'essais.");
				}
			}else{
				afficherPanneauScores(true, "Félicitation! Vous avez réussi en " + nbr_essais + " essais.");
			}
		}else{
			lastClicked_Tile = nomRegion.substring(nomRegion.length-1)*1;
			changeTileColor(lastClicked_Tile);
		}
	}
}


/* ONLOAD / READY */
$(function(){
	if(!supports_input_placeholder()){
		$(panneauScoreID + " fieldset:nth-child(3) label").addClass("phLess");
		$(panneauScoreID + " fieldset:nth-child(3) input").addClass("phLess");
	}

	$(panneauScoreID + " fieldset:first-child button").click(function (){ // 'X' fermeture Scores
		resetJeu();
	});

	$(panneauScoreID + " fieldset:nth-child(5) button").click(function (){ // 'Fermer' fermeture Scores
		resetJeu();
	});

	$(panneauScoreID + " form").submit(function(){ // bouton 'Envoyer'
		var nomUsager = $(panneauScoreID + " fieldset:nth-child(3)>input").val();
		var strDate = date("d/m/Y@H:i:s");
		var XHR_Query = "oper=inserer&usager=" + nomUsager + "&essais=" + nbr_essais + "&date=" + strDate + "&f=Jeu_TLC_Scores";

		execXHR_Request(BASE_DIR + "Jeux_ManageScores.xhr.php", XHR_Query, retour_enregistrerScore, traiterErreurs);

		return false;
	});

	$(alerteRegles + " button").click(function(){  // 'Fermer' fermeture dialogue
		$(alerteRegles).hide();
	});

	$(".widget_mksoft>div>div[role='menubar']>ul ul li").click(function(){
		var value = this.dataset.value;

		if(value !== "regles"){
			if(lastClicked_MenuOption !== value){

				var continuer=true;

				if(nbr_essais > 0){
					continuer = confirm("Si vous changez d'option, le jeu sera réinitialisé.\n\nContinuer?");
				}

				if(continuer){
					$(this).attr("aria-checked", "true");

					$(".widget_mksoft>div>div[role='menubar']>ul ul li[data-value='" + lastClicked_MenuOption + "']").attr("aria-checked", "false");
					lastClicked_MenuOption = value;

					value = value.split('_');

					nbr_tuiles = value[0]*1; // typeCasting : string > int
					dessinerPastille = ((value[1]*1) === 1)?dessinerPastille_2D:dessinerPastille_3D;
					dessinerBouton = ((value[1]*1) === 1)?dessinerBouton_2D:dessinerBouton_3D;

					resetJeu();
				}
			}
		}else{
			$(alerteRegles).show();
		}
	});

	canvas = document.querySelectorAll('canvas')[0];
	canvas.addEventListener("mousedown", doMouseDown, false); // ajouter event MouseClick

	resetJeu();
});

/* == EOF == */
