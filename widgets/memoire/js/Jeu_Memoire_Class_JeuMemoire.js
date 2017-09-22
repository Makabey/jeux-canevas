const carteNom=0;
const cartePosX=1;
const cartePosY=2;
const carteEtat=3;
const carteIndex=4;
const tournerSurDOS=0;

/* class */
class_JeuMemoire = function(){
	this.nombreCartes;
	this.canvas;
	this.cCarte;
	this.cpcPaquet;
	this.nbrEssais;
	this.inclureWilds=true;
	this.rejeterDoubleWild=false;
}

function class_JeuMemoire_canvas_doMouseDown(event){
	// Durant cet evenement on cherche sur quel "tuile" l'usager as cliquer
	// c'est pour eventuellement appeller une autre fonction pour redessiner le bouton
	var layerX = event.layerX;
	var layerY = event.layerY;
	var nomRegion = this.findRegionByPos(layerX, layerY);

	if(nomRegion !== false){
		jeuMemoire.retournerCarte_dos(nomRegion);
	}
}


class_JeuMemoire.prototype.Init = function(canvasDOM, class_name, canvas_offsetX, canvas_offsetY, in_nombreCartes, in_inclureWilds, in_rejeterDoubleWild){
	var nvWidth;
	var nvCdPadg;
	var posX;
	var posY;
	var cartes_Rows;
	var cartes_Cols;
	var parent = canvasDOM.parentNode;
	var width = 89;
	var height = 125;

	this.nombreCartes=16;
	this.nbrEssais=0;

	with(this){
		canvas = canvasDOM;
		cCarte=new class_Carte();
		cCarte.Init(canvas);
		nvCdPadg=cCarte.cardPadding-2; // influence la distance Horz et Vert entre les cartes.
		switch (nombreCartes){ // devrait etre une formule pour decider mais je vais tricher puisque je n'ai que 3 possibilites
			case 8 : cartes_Rows=2; cartes_Cols=4; inclureWilds=false; nvWidth=415; break;
			case 16 : cartes_Rows=4; cartes_Cols=4; inclureWilds=true; nvWidth=425; break;
			case 24 : cartes_Rows=4; cartes_Cols=6; inclureWilds=true; nvWidth=653; break;
			}

		nombreCartes=(typeof in_nombreCartes == 'undefined')?nombreCartes:in_nombreCartes;
		nombreCartes=(nombreCartes==8 || nombreCartes==16 || nombreCartes==24)?nombreCartes:16;

		inclureWilds=(typeof in_inclureWilds == 'boolean')?in_inclureWilds:inclureWilds;
		rejeterDoubleWild=(typeof in_rejeterDoubleWild == 'boolean')?in_rejeterDoubleWild:rejeterDoubleWild;

		// Initialiser le paquet et le mélanger
		cpcPaquet = new class_PaquetCartes();
		cpcPaquet.Init(nombreCartes, inclureWilds, rejeterDoubleWild);

		canvas.width=nvWidth; // note : si un jour je code la possibilitée de changer le nombre de cartes, ne pas oublier le DIV parent (CSS)
		canvas.clear();
		for(rng1=0;rng1<cartes_Rows;rng1++){
			for(col1=0;col1<cartes_Cols;col1++){
				nroCarte=(cartes_Cols*rng1)+col1;
				posX=col1*(cCarte.width+nvCdPadg);
				posY=rng1*(cCarte.height+nvCdPadg);

				cpcPaquet.array_CartesPaquet[nroCarte][cartePosX]=posX;
				cpcPaquet.array_CartesPaquet[nroCarte][cartePosY]=posY;
				}
			}
		for(rng1=0;rng1<cartes_Rows;rng1++){
			for(col1=0;col1<cartes_Cols;col1++){
				nroCarte=(cartes_Cols*rng1)+col1;

				posX=col1*(cCarte.width+nvCdPadg);
				posY=rng1*(cCarte.height+nvCdPadg);
				cCarte.DessinerCarte(posX, posY, "dos1");

				posX += Math.floor(cCarte.border/2);
				posY += Math.floor(cCarte.border/2);

				canvas.addRegion(posX, posY, width + cCarte.border, height + cCarte.border, 'carte'+nroCarte);
			}
		}
	}
}


class_JeuMemoire.prototype.retournerCarte_dos = function(idLocal){
/*
Novembre 2014 : J'ai retouché cette fonction et [cpcPaquet].retournerCarte_dos pour tenter de les améliorer et ajouter le support pour mes fonctions de Régions sur les Canvas.

J'ai aussi enlevé le gros bloc de commentaires et plans, je me suis dit que mieux valais recommencer plutot que d'essayer de me comprendre X temps plus tard.

En gros l'idée était de tout réécrire pour que le retour de [cpcPaquet].retournerCarte_dos se limite à quelles cartes dessiner et dans quel état, les noms étant pris d'un array global à l'application ou de [cpcPaquet] qui logiquement est la classe qui doit gèrer les cartes.
*/
	var cmpt;
	var bRetournerCarte=false;
	var retour = false;

	with(this){
		if(canvas.getRegionActive(idLocal) === false){ return false; }

		idLocal = parseInt(idLocal.substr(5),10); // Extraire le numéro de la carte

		retour = cpcPaquet.retournerCarte_dos(idLocal);

		if(!(cpcPaquet.array_CartesRetournees[0]!=-1 && cpcPaquet.array_CartesRetournees[1]==-1)){
			nbrEssais++;
		}

		if(typeof(retour) == 'object'){ // Si 'retour' est un array alors c'est la liste des cartes à manipuler, sinon on as probablement cliquer une carte deja sur le dos
			for(cmpt=0;cmpt<retour.length;cmpt++){
				if(retour[cmpt][carteEtat]==tournerSurDOS){
					cCarte.DessinerCarte(retour[cmpt][cartePosX], retour[cmpt][cartePosY], retour[cmpt][carteNom]);
					canvas.setRegionActive('carte'+retour[cmpt][carteIndex], false);
				}else{
					bRetournerCarte=true;
				}
			}

			if(bRetournerCarte){setTimeout(function() {
				var lPos;
				if(cpcPaquet.array_CartesRetournees[0]>-1){ // au cas ou on clique "Reinitialiser" durant une attente de retournement
					lPos=cpcPaquet.array_CartesPaquet[cpcPaquet.array_CartesRetournees[0]];
					cCarte.DessinerCarte(lPos[1],lPos[2],"dos1");
					lPos=cpcPaquet.array_CartesPaquet[cpcPaquet.array_CartesRetournees[1]];
					cCarte.DessinerCarte(lPos[1],lPos[2],"dos1");
					canvas.setRegionActive('carte'+cpcPaquet.array_CartesRetournees[0], true);
					canvas.setRegionActive('carte'+cpcPaquet.array_CartesRetournees[1], true);
					cpcPaquet.array_CartesRetournees=[-1,-1];
				}
			}, 2000);}
		}

		if((cpcPaquet.nbrCartesUtilisees>=cpcPaquet.array_CartesPaquet.length) ||
			((cpcPaquet.nbrCartesUtilisees>=(cpcPaquet.array_CartesPaquet.length-1)) && cpcPaquet.array_CartesRetournees[0]!=-1)){ // Si on as retourner toutes les carte ou s'il en reste une (en supposant que le nombre est TOUJOURS pair) alors cette dernière est un 'wild' seul et par conséquent on as gagner
			retour = true;
		}
	}

	return retour;
}

/* EOF */
