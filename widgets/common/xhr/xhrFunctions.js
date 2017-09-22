/*
	Référence :: http://siddh.developpez.com/articles/ajax/

	Considérer de changer la fonction avec ceci pour la rendre plus robuste : https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests
*/

function execXHR_Request(urlTarget, queryString, fct_callBack, fct_callError){
	var xhr = getXhr();
	var xhrAnswer;

	if(false !== xhr){
		/*
			if (xhr && xhr.readyState != 0){
				xhr.abort(); // On annule la requête en cours !
			}
		*/

		// On défini ce qu'on va faire quand on aura la réponse
		xhr.onreadystatechange = function(){
			// On ne fait quelque chose que si on a tout reçu et que le serveur est ok
			if(xhr.readyState == 4 && xhr.status == 200){
				/*
					On s'attend à toujours avoir un retour de forme
					"0¬MessageErreur" ou "1¬Donnees" et donc 0===false
				*/
				xhrAnswer = xhr.responseText.split('¬');
				var retour = (xhrAnswer.length > 1)?xhrAnswer[1]:xhrAnswer[0];
				// NE PAS éliminer les trois ligne de CONSOLE qui suivent! Seulement commenter!!
				/*console.log("[xhrFunctions] " + xhr.responseText);
				console.log("[xhrFunctions] " + xhrAnswer);
				console.log("[xhrFunctions] " + retour); // */
				if((xhrAnswer[0][0] == "1") || (xhrAnswer[0].toLowerCase() == "true")){ // TRUE, pas d'erreur
					if(typeof fct_callBack === 'function'){
						fct_callBack(retour);
					}else{
						console.log("execXHR_Request = TRUE, mais l'objet de traitement passé n'est pas une fonction.");
					}
				}else{
					if(typeof fct_callError === 'function'){
						if((xhrAnswer[0][0] == "0") || (xhrAnswer[0].toLowerCase() == "false")){ // FALSE, erreur controlee
							fct_callError(retour);
						}else{ // autre, erreur que PHP crache... eh oui, c'est possible que mon code chie un peu :p
							fct_callError(xhrAnswer[0]);
						}
					}else{
						console.log("execXHR_Request = FALSE, mais l'objet de traitement passé n'est pas une fonction.");
					}
				}
			}
		}

		xhr.onerror = function (e) {
			console.log("[execXHR_Request] statusText : " + xhr.statusText + "\n e : "+e);
		};

		xhr.open("POST", urlTarget, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(queryString);
	}
	return false;
}


function getXhr(){
	var xhr = null;

	if(window.XMLHttpRequest){ // Firefox et autres
		xhr = new XMLHttpRequest();
	}else if(window.ActiveXObject){ // Internet Explorer
		try {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
	}
	else { // XMLHttpRequest non supporté par le navigateur
		alert("Votre navigateur ne supporte pas les objets XMLHTTPRequest...");
		xhr = false;
	}
	return xhr;
}

/* == EOF == */
