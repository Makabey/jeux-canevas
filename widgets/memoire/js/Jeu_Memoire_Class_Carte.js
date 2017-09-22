/*
Éventuellement pousser le data d'une carte vers la mémoire du browser (HTML5) pour que la classe présente ne fasse -que- générer les images?

Plus tard changer le code pour créer un canvas temporaire et invisible, attaché au parent de la classe, donc ici je pense à qqch comme this.document. L'idée étant de détacher la classe de la nécessité d'emprunter le canvas du jeu (visible) et pouvoir créer les cartes de façon "invisible", comme si on chargeais des images en arrière-plan.
*/

/* Ressource entre autres liens :: http://javascript.crockford.com/private.html */

const MAKECARD_DEFAULT_WIDTH=89;
const MAKECARD_DEFAULT_HEIGHT=125;
const MAKECARD_LOWEST_SCALE=0.1;
const MAKECARD_HIGHEST_SCALE=5.0;
const MAKECARD_DEFAULT_FILL_COLOR="#DDDDDD";
const MAKECARD_DEFAULT_STROKE_COLOR="#000000";

/* class */
function class_Carte(){
	/* cCanvas=objet HTML5
	 nEchelle=ratio entre 0.5 et 1.5 pour permettre l'ajustement dynamique sur l'écran. Pour le moment la taille "1.0" est celle qu'utilise déjà les fonctions soit 89*125. Cette variable n'est pas encore utilisee */

	// var array_Cartes_Messages=new Array("cCanvas est 'undefined'.","'%s', cette carte n'existe pas.");
	this.cCanvas;
	this.ctx;
	this.nEchelle;
	this.width=MAKECARD_DEFAULT_WIDTH;
	this.height=MAKECARD_DEFAULT_HEIGHT;
	this.clrFill=MAKECARD_DEFAULT_FILL_COLOR;
	this.clrStroke=MAKECARD_DEFAULT_STROKE_COLOR;

	this.shdOS=3;
	this.startX=3;
	this.startY=3;
	this.border=6;
	this.shdBlur=7;
	this.shdClr="#333333";
	this.cardPadding = (this.shdOS*2)+this.border+this.shdBlur; //-3;

	/* // expérience pour ajouter un canvas dynamiquement qui appartiendrais
	 // à la classe et serais invisible; pour la composition des cartes

	var mc =document.createElement("CANVAS");
	mc.height=80;
	mc.width=80;
	var ctx=mc.getContext("2d");
	ctx.fillStyle="#FF00CC";
	document.body.appendChild(mc);
	ctx.fillRect(0, 0, 80, 80);
	// */
}

/* Constructor : soit tout code qui n'est pas dans une function interne, soit une function appellée
 à la fin de la classe juste avant qu'elle soit fermée par le dernier '}' */
class_Carte.prototype.Init = function(cCanvas,width,height,clrFill,clrStroke){
	if(typeof cCanvas == "undefined"){
		// plus tard ajouter une procédure de Catch appartenant à _Index
		return; // ne pas continuer!
	}
	//if((typeof nEchelle == "undefined") || (isNaN(nEchelle))){
		this.nEchelle=1.0;
	//	}else{
	//	this.nEchelle=nEchelle;
	//	}
	if((typeof width == "undefined") || (isNaN(width))){
		this.width=MAKECARD_DEFAULT_WIDTH;
	}else{
		this.width=Math.abs(width);
	}
	if((typeof height == "undefined") || (isNaN(height))){
		this.height=MAKECARD_DEFAULT_HEIGHT;
	}else{
		this.height=Math.abs(height);
	}
	if(typeof clrFill == "undefined"){
		this.clrFill=MAKECARD_DEFAULT_FILL_COLOR;
	}else{
		this.clrFill=clrFill;
	}
	if(typeof clrStroke == "undefined"){
		this.clrStroke=MAKECARD_DEFAULT_STROKE_COLOR;
	}else{
		this.clrStroke=clrStroke;
	}
	this.cCanvas=cCanvas;
	//this.ctx=this.cCanvas.ctx;
	this.ctx=this.cCanvas.getContext("2d");
	this.ctx.fillStyle=this.clrFill;
	this.ctx.strokeStyle=this.clrStroke;
}

class_Carte.prototype.changerEchelle = function(nEchelle){
	if((typeof nEchelle == "undefined") || (isNaN(nEchelle))){
		this.nEchelle=1.0;
	}else{
		this.nEchelle=Math.abs(nEchelle);
		if(this.nEchelle<MAKECARD_LOWEST_SCALE) this.nEchelle=MAKECARD_LOWEST_SCALE;
		if(this.nEchelle>MAKECARD_HIGHEST_SCALE) this.nEchelle=MAKECARD_HIGHEST_SCALE;
	}
	this.width=Math.ceil(this.width*=this.nEchelle);
	this.height=Math.ceil(this.height*=this.nEchelle);
}

class_Carte.prototype.DessinerCarte = function(posX,posY,nom,couleur){
	if(typeof(posX) == 'undefined'){
		alert("posX ne peux etre 'undefined'!");
		return;
	}
	if(typeof(posY) == 'undefined'){posY=posX;}
	if(typeof(nom) == 'undefined'){nom="vide";}
	with(this){
		startX=posX;
		startY=posY;

		try{
			cCanvas.clear(startX,startY,width+cardPadding,height+cardPadding,couleur);
		}
		catch(err){
			var txt="{class_Carte.DessinerCarte}\n";
			txt+="La methode 'Init' n'as peut-etre pas ete appellee.\n\n";
			txt+="Erreur : '"+err.message+"'.";
			alert(txt);
		}
		if(nom != "dos1"){ InitialiserFaceCarte_Vide(); }
		switch(nom){
			case "dos1": InitialiserFaceCarte_DOS1(); break;
			case "wild": InitialiserFaceCarte_Wild(); break;
			case "anneau": InitialiserFaceCarte_Anneau(); break;
			case "bonhom": InitialiserFaceCarte_Bonhom(); break;
			case "carreau": InitialiserFaceCarte_Carreau(); break;
			case "carrer": InitialiserFaceCarte_Carrer(); break;
			case "coeur": InitialiserFaceCarte_Coeur(); break;
			case "fleur": InitialiserFaceCarte_Fleur(); break;
			case "ixe": InitialiserFaceCarte_Ixe(); break;
			case "pique": InitialiserFaceCarte_Pique(); break;
			case "pyramide": InitialiserFaceCarte_Pyramide(); break;
			case "trefle": InitialiserFaceCarte_Trefle(); break;
			case "triangle": InitialiserFaceCarte_Triangle(); break;
			default: alert("nom ("+nom+"), carte inconnue.");
		}
	}
}

class_Carte.prototype.InitialiserFaceCarte_DOS1 = function(){
	var posX;
	var posY;
	var aText=60*Math.PI/180;
	var offsetX=30;
	var offsetY=97;

	this.InitialiserFaceCarte_Vide(); // pour le moment puisque je n'ai pas de dessin de "dos"

	this.ctx.roundRect(this.startX+this.border+7, this.startY+this.border+7, this.width-14, this.height-14, {upperLeft:10,upperRight:10,lowerLeft:10,lowerRight:10});
	this.ctx.lineWidth=1;
	this.ctx.strokestyle="#DDDDDD";
	this.ctx.stroke();
	this.ctx.fillStyle="#71b7e8";
	this.ctx.fill();

	this.ctx.lineWidth=1;
	this.ctx.font="normal 1.0em sans-serif";
	posX=Math.cos(aText) * (this.startX+offsetX) - Math.sin(aText) * (this.startY+offsetY);
	posY=Math.sin(aText) * (this.startX+offsetX) + Math.cos(aText) * (this.startY+offsetY);
	this.ctx.rotate(-aText);
	this.ctx.strokeStyle="#0000CC";

	// Mettre la page en utf-8 ou alors faire ceci.
	//var c= 169; // 0xA9
	//context.fillText(String.fromCharCode(c),posX,posY);

	this.ctx.strokeText("Jeu de",posX,posY);
	posX+=7; posY+=18;
	this.ctx.strokeText("Mémoire",posX,posY);
	this.ctx.rotate(aText);
}

class_Carte.prototype.InitialiserFaceCarte_Vide = function (){
	this.ctx.shadowBlur=this.shdBlur;
	this.ctx.shadowColor=this.shdClr;
	this.ctx.shadowOffsetX=this.shdOS;
	this.ctx.shadowOffsetY=this.shdOS;
	this.ctx.lineWidth=this.border;
	this.ctx.roundRect(this.startX+this.border, this.startY+this.border, this.width, this.height, {upperLeft:10,upperRight:10,lowerLeft:10,lowerRight:10});
	this.ctx.fillStyle=this.clrFill;
	this.ctx.strokeStyle=this.clrStroke;
	this.ctx.stroke();
	this.ctx.fill();

	/* Reset de l'ombre parce que cette fonction est la seule a utiliser une ombre */
	this.ctx.shadowBlur=0;
	this.ctx.shadowOffsetX=0;
	this.ctx.shadowOffsetY=0;
}

class_Carte.prototype.InitialiserFaceCarte_Wild = function(){
	var posX=this.startX+50;
	var posY=this.startY+68;

	this.ctx.lineWidth=1;
	this.ctx.beginPath();
	this.ctx.arc(posX, posY, 40, 0, 2*Math.PI, false);
	this.ctx.closePath();
	this.ctx.fillStyle="#000000";
	this.ctx.fill();

	this.ctx.beginPath();
	this.ctx.arc(posX, posY, 35, 0, 2*Math.PI, false);
	this.ctx.closePath();
	this.ctx.fillStyle="#DDDDDD";
	this.ctx.fill();

	this.ctx.lineWidth=10;
	this.ctx.strokeStyle="#000000";
	this.ctx.beginPath();

	this.ctx.moveTo(posX+19, posY+33);
	this.ctx.lineTo(posX-18, posY-32);
	this.ctx.moveTo(posX-18, posY+33);
	this.ctx.lineTo(posX+19, posY-32);
	this.ctx.moveTo(posX-35, posY);
	this.ctx.lineTo(posX+35, posY);

	this.ctx.closePath();
	this.ctx.stroke();

	this.ctx.lineWidth=4;
	this.ctx.strokeStyle="#DDDDDD";
	this.ctx.beginPath();

	this.ctx.moveTo(posX+17, posY+29);
	this.ctx.lineTo(posX-16, posY-28);
	this.ctx.moveTo(posX-16, posY+29);
	this.ctx.lineTo(posX+17, posY-28);
	this.ctx.moveTo(posX-33, posY);
	this.ctx.lineTo(posX+33, posY);

	this.ctx.closePath();
	this.ctx.stroke();
}

class_Carte.prototype.InitialiserFaceCarte_Anneau = function(){
	var posX=this.startX+50;
	var posY=this.startY+68;

	this.ctx.lineWidth=6;
	this.ctx.beginPath();
	this.ctx.arc(posX, posY, 30, 0, 2*Math.PI, false);
	this.ctx.closePath();
	this.ctx.fillStyle="#000000";
	this.ctx.fill();

	this.ctx.beginPath();
	this.ctx.arc(posX, posY, 15, 0, 2*Math.PI, false);
	this.ctx.closePath();
	this.ctx.fillStyle="#DDDDDD";
	this.ctx.fill();
}

class_Carte.prototype.InitialiserFaceCarte_Pyramide = function(){
	var posX=this.startX+50;
	var posY=this.startY+40;

	this.ctx.beginPath();
	this.ctx.moveTo(posX,posY);
	this.ctx.lineTo(posX-25,posY+50);
	this.ctx.lineTo(posX+25,posY+50);
	this.ctx.closePath();
	this.ctx.fillStyle="#FFFF00";
	this.ctx.fill();
}

class_Carte.prototype.InitialiserFaceCarte_Carrer = function(){
	var posMagicX=2;
	var posMagicY=7;
	var posX=Math.ceil(this.width/6);
	var posX2=this.width-posX;
	var posY=Math.ceil(posX/this.width*this.height);
	var posY2=posY+(posX2-posX);

	with(this){
		ctx.beginPath();
		ctx.rect(posX+startX-posMagicX,posY+startY+posMagicY,posX2,posY2-posMagicY);
		ctx.fillStyle="#00CCCC";
		ctx.fill();
	}
}

class_Carte.prototype.InitialiserFaceCarte_Bonhom = function(){
	var posX=this.startX+50;
	var posY=this.startY+40;

	with(this){
		ctx.lineWidth=6;
		ctx.beginPath();
		ctx.arc(posX,posY, 20, 0, 2*Math.PI, false);
		ctx.closePath();
		ctx.fillStyle="#000000";
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(posX,posY);
		ctx.lineTo(posX,posY+55);
		ctx.lineTo(posX+10,posY+75);
		ctx.moveTo(posX,posY+55);
		ctx.lineTo(posX-10,posY+75);
		ctx.moveTo(posX-20,posY+33);
		ctx.lineTo(posX+20,posY+33);
		ctx.closePath();
		ctx.strokeStyle="#000000";
		ctx.stroke();
	}
}

class_Carte.prototype.InitialiserFaceCarte_Coeur = function(){
	var posX=this.startX+50;
	var posY=this.startY+55;

	this.ctx.lineWidth=6;
	this.ctx.beginPath();
	this.ctx.arc(posX-15, posY, 20, 0, 2*Math.PI, false);
	this.ctx.arc(posX+15, posY, 20, 0, 2*Math.PI, false);
	this.ctx.closePath();
	this.ctx.fillStyle="#FF0000";
	this.ctx.fill();
	this.ctx.beginPath();
	this.ctx.moveTo(posX-33, posY+9);
	this.ctx.lineTo(posX, posY+50);
	this.ctx.lineTo(posX+33, posY+9);
	this.ctx.closePath();
	this.ctx.fillStyle="#FF0000";
	this.ctx.fill();
}

class_Carte.prototype.InitialiserFaceCarte_Trefle = function(){
	var posX=this.startX+50;
	var posY=this.startY+60;

	this.ctx.lineWidth=6;
	this.ctx.beginPath();
	this.ctx.arc(posX-15, posY+10, 15, 0, 2*Math.PI, false);
	this.ctx.arc(posX+15, posY+10, 15, 0, 2*Math.PI, false);
	this.ctx.closePath();
	this.ctx.arc(posX, posY-15, 15, 0, 2*Math.PI, false);
	this.ctx.closePath();
	this.ctx.fillStyle="#66FF33";
	this.ctx.fill();
	this.ctx.rect(posX-5, posY, 10, 45);
	this.ctx.fill();
}

class_Carte.prototype.InitialiserFaceCarte_Carreau = function(){
	var posX=this.startX+50;
	var posY=this.startY+67;

	this.ctx.beginPath();
	this.ctx.moveTo(posX, posY-45);
	this.ctx.lineTo(posX-30, posY);
	this.ctx.lineTo(posX, posY+45);
	this.ctx.lineTo(posX+30, posY);
	this.ctx.closePath();
	this.ctx.fillStyle="#FF3333";
	this.ctx.fill();
}

class_Carte.prototype.InitialiserFaceCarte_Pique = function(){
	var posX=this.startX+50;
	var posY=this.startY+60;

	this.ctx.lineWidth=6;
	this.ctx.beginPath();
	this.ctx.arc(posX-15, posY+19, 20, 0, 2*Math.PI, false);
	this.ctx.arc(posX+15, posY+19, 20, 0, 2*Math.PI, false);
	this.ctx.closePath();
	this.ctx.fillStyle="#0000FF";
	this.ctx.fill();
	this.ctx.beginPath();
	this.ctx.moveTo(posX-33, posY+10);
	this.ctx.lineTo(posX, posY-40);
	this.ctx.lineTo(posX+33, posY+10);
	this.ctx.closePath();
	this.ctx.fill();
	this.ctx.rect(posX-5, posY+30, 10, 30);
	this.ctx.fill();
}

class_Carte.prototype.InitialiserFaceCarte_Fleur = function(){
	var posX=this.startX+52;
	var posY=this.startY+70;

	var stepPetales;
	var anglePetale;
	var maxPetales=6;
	var radiusPetales=13;
	var radiusFleur=23;
	var destX;
	var destY;
	this.ctx.lineWidth=1;
	this.ctx.fillStyle="#00FF00";
	this.ctx.beginPath();
	this.ctx.arc(posX, posY, radiusPetales, 0, 2*Math.PI, false);
	this.ctx.closePath();
	this.ctx.fill();
	stepPetales=Math.floor(360/maxPetales);
	for(anglePetale=0;anglePetale<=360;anglePetale+=stepPetales){
		this.ctx.beginPath();
		destX=posX+radiusFleur*Math.cos(anglePetale * Math.PI / 180);
		destY=posY+radiusFleur*Math.sin(anglePetale * Math.PI / 180);
		this.ctx.arc(destX, destY, radiusPetales, 0, 2*Math.PI, false);
		this.ctx.closePath();
		this.ctx.fill();
	}
}

class_Carte.prototype.InitialiserFaceCarte_Ixe = function(){
	var posX=60;
	var posY=80;
	this.ctx.lineWidth=10;
	this.ctx.strokeStyle="#FF0000";
	this.ctx.beginPath();
	this.ctx.moveTo(posX-20, posY-40);
	this.ctx.lineTo(posX+20, posY+40);
	this.ctx.moveTo(posX-20, posY+40);
	this.ctx.lineTo(posX+20, posY-40);
	this.ctx.closePath();
	this.ctx.stroke();
}

class_Carte.prototype.InitialiserFaceCarte_Triangle = function(){
	var posX=60;
	var posY=65;
	this.ctx.lineWidth=6;
	this.ctx.beginPath();
	this.ctx.moveTo(posX-30, posY-20);
	this.ctx.lineTo(posX, posY+50);
	this.ctx.lineTo(posX+30, posY+20);
	this.ctx.closePath();
	this.ctx.fillStyle="#0000CC";
	this.ctx.fill();
}

/* EOF */
