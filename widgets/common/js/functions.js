"use strict";

function supports_input_placeholder() {
	/*
		source : http://diveinto.html5doctor.com/detect.html#input-placeholder

		RETOURNE true si le fureteur supporte l'attribut 'placeholder'
	*/
	var i = document.createElement('input');
	return 'placeholder' in i;
}

function strStripHTML(str){
	/*
		Enlève tout le HTML de 'str' et retourne ce qu'il reste
		Sert primairement à ramener les erreurs PHP au message en enlevant tout le formatage.
		source :: http://stackoverflow.com/questions/822452/strip-html-from-text-javascript
	*/
	str=str.replace(/<br>/gi, "\n");
	str=str.replace(/<p.*>/gi, "\n");
	str=str.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 (Link->$1) ");
	str=str.replace(/<(?:.|\s)*?>/g, "");
	return str;
}


function date(strFormat){
	/*
		l'idée ultime est de pouvoir reproduire la façon dont PHP le fait, par exemple traiter 'strFormat' tel que "d-m-Y @ H:i:s" pourrais donner une chaine telle que "03-11-2014 @15:53:24"

		Quelqu'un l'as sûrement déjà fait mais je veux le faire moi-même, pour l'exercice.
	*/
	var dDate = new Date();
	var strDate = "";
	var temp;
	var iCmpt;
	var slash = String.fromCharCode(92);
	var Jours_D = new Array('Dim','Lun','Mar','Mer','Jeu','Ven','Sam');
	var Jours_l = new Array('Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi');
	var Mois_M = new Array('Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc');
	var Mois_F = new Array('Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre');

	for(iCmpt=0;iCmpt<strFormat.length;iCmpt++){

		switch(strFormat.charAt(iCmpt)){
			case slash : // sauter le charactere qui suit parce qu'il est littéral
				iCmpt++;
				strDate += strFormat[iCmpt];
				break;

			case 'd':
				if(dDate.getDate() < 10){strDate += "0";}
			case 'j':
				strDate += dDate.getDate();
				break;

			case 'D':
				strDate += Jours_D[dDate.getDay()];
				break;

			case 'l':
				strDate += Jours_l[dDate.getDay()];
				break;

			case 'F':
				strDate += Mois_F[dDate.getMonth()];
				break;

			case 'm':
				if((dDate.getMonth() + 1) < 10){strDate += "0";}
			case 'n':
				strDate += (dDate.getMonth() + 1);
				break;

			case 'M':
				strDate += Mois_M[dDate.getMonth()];
				break;

			case 'Y':
				strDate += dDate.getFullYear();
				break;

			case 'y':
				strDate += dDate.getYear();
				break;

			case 'H':
				if(dDate.getHours() < 10){strDate += "0";}
			case 'G':
				strDate += dDate.getHours();
				break;

			case 'h':
				temp = dDate.getHours();
				if(((temp < 13)?temp:(temp-12)) < 10){strDate += "0";}
			case 'g':
				temp = dDate.getHours();
				strDate += (temp < 13)?temp:(temp-12);
				break;

			case 'i':
				if(dDate.getMinutes() < 10){strDate += "0";}
				strDate += dDate.getMinutes();
				break;

			case 's':
				if(dDate.getSeconds() < 10){strDate += "0";}
				strDate += dDate.getSeconds();
				break;

			default:
				strDate += strFormat[iCmpt];
				//break;
		}
	}

	return strDate;
}

// Array.prototype.shuffle >> http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
Array.prototype.shuffle = function () {
	for (var i = this.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var tmp = this[i];
		this[i] = this[j];
		this[j] = tmp;
	}
	return this;
}

// === EOF ===
