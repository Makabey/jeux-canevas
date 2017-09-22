/* Module Canvas Global */
HTMLCanvasElement.prototype.private_Regions = {}; /* tableau des régions "cliquable" */

/*
	Ajouter une "région cliquable"

	posX, posY : position sur le canvas
	largeur, hauteur : taille
	nom : identifiant permettant de manipuler la région une fois définie

	RETOUR :
		FALSE si "nom" est omis ou est égal à 'all'
		TRUE si la création as réussi
*/
HTMLCanvasElement.prototype.addRegion = function(posX, posY, largeur, hauteur, nom){
	var etatActiver = true; // si ou non la region est active

	if(nom === undefined) { return false;	}
	if(nom.toLowerCase() === 'all') { return false; } // valeur 'all' invalide ici parce que réservée pour autres fonctions

	if(posX < 0){ posX = 0; }
	if(posX >= this.width){ posX = this.width-1; }
	if(largeur < 1){ largeur = 1; }
	if((largeur+posX) > this.width){ largeur = (this.width-posX); }

	if(posY < 0){ posY = 0; }
	if(posY >= this.height){ posY = this.height-1; }
	if(hauteur < 1){ hauteur = 1; }
	if((hauteur+posY) > this.height){ hauteur = (this.height-posY); }

	this.private_Regions[nom] = {'x':posX, 'y':posY, 'l':largeur, 'h':hauteur, 'a':etatActiver};

	return true;
}

/*
	Effacer une "région cliquable"

	nom : identifiant de la région à effacer ou 'all' pour toutes

	RETOUR :
		1+ : la/les régions existaient et as/ont été effacée(s)
		false : la région n'existait pas ou erreur

	Amélioration : ajouter la détection du mot 'all' pour tout vider le tableau et changer le retour pour le nombre d'entrées effacées, où 0/false serait pas trouvé/erreur??? Dans ce cas il faudrait changer .addRegion pour refuser la valeur 'all' comme nom/clé
*/
HTMLCanvasElement.prototype.delRegion = function(nom){
	var private_Regions_length;

	if(this.private_Regions[nom] !== undefined){
		delete this.private_Regions[nom];
		return 1;
	}else if(nom === 'all'){
		private_Regions_length = Object.keys(this.private_Regions).length;
		this.private_Regions = {};
		return private_Regions_length;
	}else{
		return false;
	}
}

/*
	Trouver une "région cliquable" par position

	posX, posY : position de la sourie

	RETOUR :
		false : la région n'as pas été trouvée
		chaine : le nom de la région correspondant à la position
*/
HTMLCanvasElement.prototype.findRegionByPos = function(posX, posY){
	var private_Regions_length = Object.keys(this.private_Regions).length;
	var iIndex;
	var retour = false;

	if(private_Regions_length > 0){
		for(iIndex in this.private_Regions){
			if (((posX >= this.private_Regions[iIndex].x) && (posX < (this.private_Regions[iIndex].x + this.private_Regions[iIndex].l))) &&
			((posY >= this.private_Regions[iIndex].y) && (posY < (this.private_Regions[iIndex].y + this.private_Regions[iIndex].h)))) {
				retour = iIndex;
			}
		}
	}

	return retour;
}

/*
	Retourne les coordonnees de la region "nom"
*/
HTMLCanvasElement.prototype.findRegionByName = function(nom){
	if(this.private_Regions[nom] === undefined){ return false; }

	return this.private_Regions[nom];
}

HTMLCanvasElement.prototype.setRegionActive = function(nom, etat){
	if(this.private_Regions[nom] === undefined){ return false; }

	if(etat === undefined){
		this.private_Regions[nom].a = true;
	}else{
		this.private_Regions[nom].a = etat;
	}

	return true;
}

HTMLCanvasElement.prototype.getRegionActive = function(nom){
	if(this.private_Regions[nom] === undefined){ return false; }

	return this.private_Regions[nom].a;
}

/*
	Dessine sur le CANVAS les zones existantes
*/
HTMLCanvasElement.prototype.drawAllRegions = function(){
	var private_Regions_length = Object.keys(this.private_Regions).length;
	var iIndex;
	var retour = false; // aucune région définie
	var ctx=this.getContext("2d");

	if(private_Regions_length > 0){
		retour = true;

		for(iIndex in this.private_Regions){
			ctx.lineWidth=1;
			ctx.fillStyle="rgba(0,255,0,0.5)";
			ctx.fillRect(this.private_Regions[iIndex].x, this.private_Regions[iIndex].y, this.private_Regions[iIndex].l, this.private_Regions[iIndex].h);
			ctx.fill();
		}
	}

	return retour;
}


/*
	Permet, selon si ou non on passe des paramètres, d'effacer en tout ou en partie le contenu du canvas.
*/
HTMLCanvasElement.prototype.clear = function (posX, posY, largeur, hauteur, couleur){
	var defaultClearColor = "#FFFFFF";
	var ctx=this.getContext("2d");

	largeur = (typeof largeur == 'undefined')?this.width:largeur;
	largeur = (largeur>this.width)?this.width:largeur;
	hauteur = (typeof hauteur == 'undefined')?this.height:hauteur;
	hauteur = (hauteur>this.height)?this.height:hauteur;

	posX = (typeof posX == 'undefined')?0:posX;
	posX = (posX>this.width)?Math.floor(this.width/2):posX;
	posY = (typeof posY == 'undefined')?0:posY;
	posY = (posY>this.height)?Math.floor(this.height/2):posY;

	ctx.fillStyle=(typeof couleur == 'undefined')?defaultClearColor:couleur;

	// ** note: clearRect prend les mm paramètres et choisi la couleur du canvas lui-mm (defaut blanc)
	ctx.fillRect(posX, posY, largeur, hauteur);
}

/**
 * SOURCE :: http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Object} radius All corner radii. Defaults to 0,0,0,0;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 *
 *
 * Use it like this:
 *
 * var canvas = document.getElementById("canvas");
 * var c = canvas.getContext("2d");
 * c.roundRect(50, 100, 50, 100, {upperLeft:10,upperRight:10}, true, true);
 * c.strokestyle="#COLOR";
 * c.stroke();
 * c.fillStyle="#COLOR";
 * c.fill();
 */
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, stroke){ //, fill
	var cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
	if (typeof radius === "object") {
		for (var side in radius) {
			cornerRadius[side] = radius[side];
		}
	}

	this.beginPath();
	this.moveTo(x + cornerRadius.upperLeft, y);
	this.lineTo(x + width - cornerRadius.upperRight, y);
	this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
	this.lineTo(x + width, y + height - cornerRadius.lowerRight);
	this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
	this.lineTo(x + cornerRadius.lowerLeft, y + height);
	this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
	this.lineTo(x, y + cornerRadius.upperLeft);
	this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
	this.closePath();
}

CanvasRenderingContext2D.prototype.roundRectUL = function (x, y, width, height, radius, stroke) { //, fill
	var curLineWidth = this.lineWidth;

	this.save();
	this.beginPath();
	this.moveTo(x - curLineWidth, y - curLineWidth);
	this.lineTo(x + width + curLineWidth, y - curLineWidth);
	this.lineTo(x - curLineWidth, y + height + curLineWidth);
	this.closePath();

	this.clip();
	this.lineWidth = curLineWidth;
	this.roundRect(x, y, width, height, radius, stroke);
	this.strokeStyle = stroke;
	this.stroke();
	this.restore(); // couper le clipping
}

CanvasRenderingContext2D.prototype.roundRectLR = function (x, y, width, height, radius, stroke) { //, fill
	var curLineWidth = this.lineWidth;

	this.save(); // activer le clipping
	this.beginPath();
	this.moveTo(x + width + curLineWidth, y - curLineWidth);
	this.lineTo(x + width + curLineWidth, y + height + curLineWidth);
	this.lineTo(x - curLineWidth, y + height + curLineWidth);
	this.closePath();

	this.clip();
	this.lineWidth = curLineWidth;
	this.roundRect(x, y, width, height, radius, stroke);
	this.strokeStyle = stroke;
	this.stroke();
	this.restore(); // couper le clipping
}

// == EOF ==
