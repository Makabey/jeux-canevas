
/* class */
function class_PaquetCartes(){
	this.array_TypesCartes=new Array("vide", "dos1", "wild", "anneau", "pyramide", "carrer", "bonhom", "coeur", "trefle", "carreau", "pique", "fleur", "ixe", "triangle"); // 11 cartes + wild, dos et vide
	this.array_CartesPaquet=new Array(); // index 0:nom, 1:X, 2:Y, 3:0=dos/1=ventre
	this.array_CartesRetournees=new Array(-1,-1); // Les 2 cartes presentement retournees et sujette à comparaison
	this.nbrPairesTrouvees; // servirait peut-etre plus comme stats que pour determiner si joueur a gagner
	this.nbrCartesUtilisees;
	this.nbrWildNONUtilises;
	this.rejeterDoubleWild;
}

class_PaquetCartes.prototype.Init = function(nbrCartes,inclureWilds,rejeterDoubleWild){
	var index1=0;
	var idxInitial=2;
	this.array_CartesRetournees=[-1,-1];
	this.nbrPairesTrouvees=0;
	this.nbrCartesUtilisees=0;
	this.nbrWildNONUtilises=0;
	this.rejeterDoubleWild=rejeterDoubleWild;

	if(nbrCartes<4){nbrCartes=4;}
	nbrCartes=Math.floor(nbrCartes/2);
	if(!inclureWilds){
		idxInitial=3;
		this.nbrWildNONUtilises=2;
	} // ne pas mettre de -wild- \\ maintenant "3" pcq j'ai ajouter 'vide' et 'dos' dans "this.array_TypesCartes"
	if(nbrCartes>(this.array_TypesCartes.length-idxInitial)){
		nbrCartes=(this.array_TypesCartes.length-idxInitial);
	}
	for(cmpt=0;cmpt<nbrCartes;cmpt++){ //doubler les entree du Array original
		this.array_CartesPaquet[index1]=new Array(this.array_TypesCartes[cmpt+idxInitial],0,0);
		index1++;
		this.array_CartesPaquet[index1]=new Array(this.array_TypesCartes[cmpt+idxInitial],0,0);
		index1++;
	}
	this.array_CartesPaquet.shuffle();
	this.array_CartesPaquet.shuffle();
	this.array_CartesPaquet.shuffle();
}

class_PaquetCartes.prototype.retournerCarte_dos = function(idLocal){
	var posW=-1;
	var nbrW=0;
	var posClone=0;
	var sNomCarte='';
	var array_Retour=new Array();
	var nRetourIdx=0;

	this.array_CartesRetournees[2] = -1; // index réservé à la carte clone lorsque l'une des deux première est un "Wild".

	if(this.array_CartesRetournees[0]!=idLocal &&
	 this.array_CartesRetournees[1]!=idLocal &&
	 this.array_CartesPaquet[idLocal][0]!='R'){ // Si pas double click ou mm carte 2 fois, continuer
		if(this.array_CartesRetournees[0]==-1){
			this.array_CartesRetournees[0]=idLocal;
		}else if(this.array_CartesRetournees[1]==-1){
			this.array_CartesRetournees[1]=idLocal;
		}else{
			return array_Retour; // la fonction n'as pas eut le temps de traiter les 2 dnr cartes cliquees
		}

		array_Retour[nRetourIdx]=this.array_CartesPaquet[idLocal].slice(0);
		array_Retour[nRetourIdx][3]=0; // idLocal=index dans this.array_CartesPaquet, 0=dos et 1=ventre (est utiliser plus loin)
		array_Retour[nRetourIdx][4]=idLocal;
		nRetourIdx++;

		// Est-ce que ceci est la seconde carte a etre retournee? Oui alors verifier si on as une paire ou si l'une des deux est un 'wild' et si oui, trouver le clone
		if(this.array_CartesRetournees[1]!=-1){ // Logiquement, l'index 0 est aussi renseigner
			// y a-t'il des 'Wild' et combien?
			if(this.array_CartesPaquet[this.array_CartesRetournees[1]][0]=='wild'){
				posW=1;
				nbrW++;
			}
			if(this.array_CartesPaquet[this.array_CartesRetournees[0]][0]=='wild'){
				posW=0;
				nbrW++;
			}

			if(((this.array_CartesPaquet.length-this.nbrPairesTrouvees*2)==2) && (nbrW==2)){
				nbrW=0; // il est possible que seuls les 2 wilds restent ET que le rejet de double wild soit actif resultant en une partie qui ne peux pas finir
			}

			switch(nbrW){
				case 1:
					// si une carte est 'W'(Wild/Joker), la marquer 'R', retourner le clone
					// de l'autre carte et mettre son index dans positions(posW)[2]
					this.array_CartesPaquet[this.array_CartesRetournees[posW]][0]='R';
					posW=(posW==1)?0:1;
					sNomCarte=this.array_CartesPaquet[this.array_CartesRetournees[posW]][0];

					this.array_CartesPaquet[this.array_CartesRetournees[posW]][0]='R';

					while((this.array_CartesPaquet[posClone][0]!=sNomCarte) && (posClone<this.array_CartesPaquet.length)){
						posClone++;
						}

					array_Retour[nRetourIdx]=this.array_CartesPaquet[posClone].slice(0);
					array_Retour[nRetourIdx][3]=0; // idLocal=index dans this.array_CartesPaquet, 0=dos et 1=ventre (est utiliser plus loin)
					array_Retour[nRetourIdx][4]=posClone;
					nRetourIdx++;
					this.array_CartesPaquet[posClone][0]='R';
					this.nbrCartesUtilisees++; //=3;
					this.nbrWildNONUtilises--;
					break;

				case 2: // 2 wild? on les retournent sur le ventre et on les oublient!
					if(this.rejeterDoubleWild){
						array_Retour[nRetourIdx]=this.array_CartesPaquet[this.array_CartesRetournees[0]].slice(0);
						array_Retour[nRetourIdx][3]=1;
						array_Retour[nRetourIdx][4]=this.array_CartesRetournees[0];
						nRetourIdx++;

						array_Retour[nRetourIdx]=this.array_CartesPaquet[this.array_CartesRetournees[1]].slice(0);
						array_Retour[nRetourIdx][3]=1;
						array_Retour[nRetourIdx][4]=this.array_CartesRetournees[1];
						nRetourIdx++;
						return array_Retour;
						}
					break;
				//default:
			}

			if(this.array_CartesPaquet[this.array_CartesRetournees[0]][0]==this.array_CartesPaquet[this.array_CartesRetournees[1]][0]){
				//array des cartes, marquer la carte 'R' comme 'Retournee'
				this.array_CartesPaquet[this.array_CartesRetournees[0]][0]='R';
				this.array_CartesPaquet[this.array_CartesRetournees[1]][0]='R';
				this.array_CartesRetournees=[-1,-1];
				this.nbrPairesTrouvees++;
				this.nbrCartesUtilisees+=2;
			}else{
				// retourner cartes pas pareilles sur le ventre

				array_Retour[nRetourIdx]=this.array_CartesPaquet[this.array_CartesRetournees[0]].slice(0);
				array_Retour[nRetourIdx][3]=1; // idLocal=index dans this.array_CartesPaquet, 0=dos et 1=ventre (est utiliser plus loin)
				array_Retour[nRetourIdx][4]=this.array_CartesRetournees[0];
				nRetourIdx++;
				array_Retour[nRetourIdx]=this.array_CartesPaquet[this.array_CartesRetournees[1]].slice(0);
				array_Retour[nRetourIdx][3]=1; // idLocal=index dans this.array_CartesPaquet, 0=dos et 1=ventre (est utiliser plus loin)
				array_Retour[nRetourIdx][4]=this.array_CartesRetournees[1];
				nRetourIdx++;
			}
		}
		return array_Retour;
	}
}

/* EOF */
