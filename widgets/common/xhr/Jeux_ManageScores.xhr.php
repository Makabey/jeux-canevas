<?php
/*
	Erreurs :
		1 : "Usager" est manquant
		2 : "Usager" ne répond pas au regexp établi
		3 : ...
*/

require_once "../inc/csvFunctions.inc.php";

if(!isset($_POST['oper'])){// || !isset($_POST['usager'])){ // oper DOIT être présent
	// Pour JavaScript : 0/1 : false/true ¬ texte erreur
	echo '0¬Parameter "oper" is missing';
	exit();
}

/* =================================================== */

$fichierScores = $_POST['f'];
if(substr($fichierScores, -4, 4) !== ".csv"){ $fichierScores .= '.csv'; }

$resultat = false;
switch($_POST['oper']){
	case 'lire' : # SELECT
		$resultat = lireScores($_POST['nombre'], $fichierScores);
		break;

	case 'inserer': # INSERT
		if(!isset($_POST['usager'])){
			echo "0¬1";
		}

		$resultat = insererScores($_POST['usager'], $_POST['essais'], $_POST['date'], $fichierScores);
		break;

	default: $resultat = '0¬"' . $_POST["oper"] . '" unknown value for parameter "oper"';
}

echo $resultat; /* résultat final retourné à XHR */
exit();

/* =================================================== */

/*
	FONCTIONS
*/
function lireScores($nombre, $fichierScores){
	/*
		Lire $nombre usagerS dans la BD
	*/
	$nombre *= 1; // type casting & forcer à valeur "safe"

	$resultat = lireCSV_VersTblIdx($refArrDonnees, CSV_BASE_DIR . $fichierScores, $nombre);

	if(false !== $resultat){
		foreach($refArrDonnees as $key=>$val){ // Date trop longue alors retirer l'heure
			$tmp = explode('@', $val[2]);
			$refArrDonnees[$key][2] = $tmp[0];
		}
		$retour = JSON_encode($refArrDonnees);
		$resultat = "1¬".$retour;
	}else{
		$resultat = "0¬false";
	}

	return $resultat;
}

function insererScores($usager, $essais, $date, $fichierScores){
	/*
		Insérer un nouvel usager dans la BD
	*/
	$resultat = false;

	/*
		Vérifier tout de suite la validité de $_POST['usager'], inutile d'aller plus loin si transige le regexp, parce que si 'usager' ne répond pas à la regexp utilisée par JS -donc- potentiellement injection!
	*/
	$pseudoMatch = preg_match("/[a-zA-Z0-9\- ]{3,20}/", $usager);
	if(1 !== $pseudoMatch){
		$resultat = "0¬2";
	}else{
		#appel a la fonction d'écriture CSV
		$refArrDonnees = array($usager, $essais, $date);
		$sEntetes = array('Nom','Essais','Date');
		$resultat = ecrireCSV_VersTblIdx($refArrDonnees, CSV_BASE_DIR . $fichierScores, $sEntetes);
		if($resultat > -1){
			$resultat = "1¬" . $resultat;
		}else{
			$resultat = "0¬" . $refArrDonnees[0];
		}
	}

	return $resultat;
}

/* == EOF == */
