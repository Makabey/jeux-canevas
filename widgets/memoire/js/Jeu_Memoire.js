"use strict";

// Params pour la base de données qui pour le moment est locale et bidon
var nombreCartes=16;
// pour placer les DIVs si on utilise la fonction qui affiche les REGIONS
var canvas_offsetX=9;
var canvas_offsetY=48;

var inclureWilds=true;
var rejeterDoubleWild=false;
var jeuMemoire=new class_JeuMemoire();

var panneauScoreID = ".widget_mksoft>div>div.dialogue.winlose";
var alerteRegles = ".widget_mksoft>div>div.dialogue.alerte";
//var BASE_DIR = "/jeux_canvas/widgets/assets";
var BASE_DIR = "../common/xhr/";
var canvas;

/* FUNCTIONS XHR */
/*********************
	FONCTIONS DE TRAITEMENT DES RETOURS POSITIFS
	(C'est à dire, quand la requête XHR s'est complètée correctement. Ici on réagit selon le type de la requête, que ce soit par un message de confirmation ou la manipulation des données de retour.)
*********************/
function retour_enregistrerScore(retour){
	if(retour <= 0){
		$(panneauScoreID + " fieldset:nth-child(4)").html("Une erreur est survenue durant l'enregistrement de votre pointage : "+retour);
	}else{
		var XHR_Query = "oper=lire&nombre=-5&f=Jeu_Memoire_Scores"; // demander les 5 dernières entrées
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

	if(bGagnant){
		$(panneauScoreID + " fieldset:nth-child(3)").css({"display":"block"});

	}else{
		$(panneauScoreID + " fieldset:nth-child(3)").css({"display":"none"});
	}

	$(panneauScoreID + " fieldset:nth-child(2)>p").html(message);

	$(panneauScoreID + " fieldset:nth-child(4)").html(sTemp);

	$(panneauScoreID).css({"display":"block"});

	sTemp = panneauScoreID + ' fieldset:nth-child(3) input';

	setTimeout(function (){
		document.querySelector(sTemp).focus();
	}, 500); // setTimeOut nécessaire, sinon le focus ne s'effectue pas
}


function resetJeu(){
	var tmpCanvas = document.getElementsByTagName("canvas")[0];

	jeuMemoire.Init(tmpCanvas, "jeuMemoire", canvas_offsetX, canvas_offsetY, nombreCartes, inclureWilds, rejeterDoubleWild);

	$(panneauScoreID).css({"display":"none"});
	$(panneauScoreID + " fieldset:nth-child(4)").html('');
}


/* EVENTS */
function doMouseDown(event){
	// Durant cet evenement on cherche sur quel "tuile" l'usager as cliquer
	// c'est pour eventuellement appeller une autre fonction pour redessiner le bouton
	var layerX = event.layerX;
	var layerY = event.layerY;
	var nomRegion = this.findRegionByPos(layerX, layerY);
	var retour;

	if(nomRegion !== false){
		retour = jeuMemoire.retournerCarte_dos(nomRegion);

		if(true == retour){
			afficherPanneauScores(true, "\nVous avez pris " + jeuMemoire.nbrEssais + " coups pour réussir.");
		}
	}
}


/* ONLOAD / READY */
$(function(){
	$("#frmCfg_btnReset").click(function(){
		resetJeu();
	});

	$(panneauScoreID + " fieldset:first-child button").click(function (){ // 'X' fermeture Scores
		resetJeu();
	});

	$(panneauScoreID + " fieldset:nth-child(5) button").click(function (){ // 'Fermer' fermeture Scores
		resetJeu();
	});

	$(panneauScoreID + " form").submit(function(){ // bouton 'Envoyer'
		var nomUsager = $(panneauScoreID + " fieldset:nth-child(3)>input").val();
		var strDate = date("d/m/Y@H:i:s");
		var XHR_Query = "oper=inserer&usager=" + nomUsager + "&essais=" + jeuMemoire.nbrEssais + "&date=" + strDate + "&f=Jeu_Memoire_Scores";

		execXHR_Request(BASE_DIR + "Jeux_ManageScores.xhr.php", XHR_Query, retour_enregistrerScore, traiterErreurs);

		return false;
	});

	$(alerteRegles + " button").click(function(){ // 'Fermer' fermeture dialogue
		$(alerteRegles).hide();
	});

	$(".widget_mksoft>div>div[role='menubar']>ul ul li").click(function(){
		var value = this.dataset.value;

		if(value !== "regles"){
			if("reset" === value){
				resetJeu();
			}else{
				var continuer=true;

				if(jeuMemoire.nbrEssais > 0){
					continuer = confirm("Si vous changez d'option, le jeu sera réinitialisé.\n\nContinuer?");
				}

				if(continuer){
					if(value === "inclureWilds"){
						if(true === inclureWilds){
							inclureWilds = false;
							value="false";

							/* ceci est une sous-option, donc si le parent est FALSE, l'enfant aussi */
							rejeterDoubleWild=false;
							$(".widget_mksoft>div>div[role='menubar']>ul ul li[data-value='rejeterDoubleWild']").attr("aria-checked", "false");
						}else{
							inclureWilds = true;
							value="true";
						}
					}

					if((value === "rejeterDoubleWild") && (true === inclureWilds)){
						if(true === rejeterDoubleWild){
							rejeterDoubleWild = false;
							value="false";
						}else{
							rejeterDoubleWild = true;
							value="true";
						}
					}

					$(this).attr("aria-checked", value);

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

/* EOF */
