<?php
/*
	Édition "Jeux avec CANVAS"
*/

define('CSV_BASE_DIR', '../res/');

#########################################################

function lireCSV_VersTblIdx(&$refArrDonnees, $sNomFichier, $iNbrLignesALire = 0, $iOffsetNbrLignesALire = 0){
	/*
		Lit $sNomFichier et met dans $refArrDonnees les lignes lues.

		Entrées:
			refArrDonnees							: le tableau qui devra contenir les lignes lues, sera vidé avant de commencer
			sNomFichier								: chemin et nom du fichier (incluant l'extension ".csv") CSV voulu
			sIndexMode
					'binaire'			: 	en utilisant un index de puissance de 2, ce qui permettra d'additionner l'index des valeurs vers un nombre unique les représentants plutôt que toutes les indiquer, séparée par un charactère de séparation. ex: "5" pour les items aux index 1 et 4 plutôt que "1,4"
					'fichier'			: garde les index imposés par le fichier
					'sequentiel'	: index de 0+
			sEntetes									: si non vide, la première ligne lue DOIT être égale à la valeur de ce paramètre, sinon le fichier est déclaré invalide; aussi, si non vide, pour que le retour fasse du sens, le premier champs doit être un compteur ou une clé unique dont le nom n'aura pas d'importance dans l'ensemble retour.
			arrChampsEtValeurRechercher	: si -1 alors on n'as spécifié aucune paire champs/Valeur; ex d'utilisation > array("nom", "buzz") pour trouver toutes les lignes qui ont "buzz" pour valeur sous le champs(colonne) "nom"
			iNbrLignesALire							: si 0 alors tout lire, si 1+ alors le nombre de lignes à lire à partir du début, si -1 alors nombre de lignes à partir de la fin
			iOffsetNbrLignesALire					: si 0 OU iNbrLignesALire < 0 alors ignorer, si 1+ ET iNbrLignesALire 1+ alors nombre de lignes à passer à partir du début

			'iNbrLignesALire', 'iOffsetNbrLignesALire' et 'arrChampsEtValeurRechercher' ne sont pas utilisés pour le moment parce que je veux réécrire la fonction plus simplement pour commencer
			'sIndexMode' est toujours là au cas où je me rappelle ce que j'essayais de faire dans la version originale et que je voudrais l'utiliser

		Retour:
			false		: erreur d'ouverture de fichier
			0+		: le nombre de lignes lues
	*/
	$retour = false;
	$refArrDonnees = array(); # S'assurer que le tableau est vide
	$aEntetes = array();

	# Tenter d'ouvrir le fichier
	if(($HndFichier = @fopen($sNomFichier, 'rb')) !== false){
		// Lire la premiere ligne pour determiner si la prochaine contient des entetes
		if(($ligne = fgetcsv($HndFichier, 1000, ";")) !== false){
			if(($ligne[0]*1) === 1){
				if(($aEntetes = fgetcsv($HndFichier, 1000, ";")) !== false){
					array_shift($aEntetes);
					$retour = 0;
				}
			}else{$retour = 0;}

			$iNbrLignesALire *= 1;
			if(false !== $retour){
				/* Lire les iNbrLignesALire voulues,
					si == 0 alors tout lire,
					si 1+ alors le nombre de lignes à lire à partir du début,
					si -1 alors nombre de lignes à partir de la fin
				*/
				if($iNbrLignesALire>0){
					while((($ligne = fgetcsv($HndFichier, 1000, ";")) !== false) && (count($refArrDonnees) < $iNbrLignesALire)){
						array_shift($ligne);
						$refArrDonnees[] = $ligne;
						$retour++;
					}
					array_unshift($refArrDonnees, $aEntetes);
				}elseif($iNbrLignesALire<0){
					// Les éléments sont ajoutés dans l'ordre inverse du fichier, c'est voulu
					while(($ligne = fgetcsv($HndFichier, 1000, ";")) !== false){
						array_shift($ligne); // pour enlever l'item header "ID" ou le numéro de ligne mis durant "ecrireCSV_VersTblIdx"
						$refArrDonnees[] = $ligne;
						$retour++;
					}
					$refArrDonnees = array_reverse($refArrDonnees);
					$refArrDonnees = array_slice($refArrDonnees, 0, abs($iNbrLignesALire));

					if(count($aEntetes) > 0) { array_unshift($refArrDonnees, $aEntetes); } // ajouter les entetes
				}else{
					$refArrDonnees[] = $aEntetes;
					while(($ligne = fgetcsv($HndFichier, 1000, ";")) !== false){
						array_shift($ligne);
						$refArrDonnees[] = $ligne;
						$retour++;
					}
				}
			}
		}
		fclose($HndFichier); # Inutile mais fait par mesure de propreté
	}else{$retour="sourie";}

	return $retour;
}


function ecrireCSV_VersTblIdx(&$refArrDonnees, $sNomFichier, $sEntetes=-1){
	/*
		Écrit vers $sNomFichier les données de $refArrDonnees

		Entrées:
			$refArrDonnees							: le tableau qui devra contenir les données à manipuler
			$sNomFichier							: chemin et nom du fichier (incluant l'extension ".csv") CSV voulu
			$sEntetes									: DOIT être un Array

		Retour:
			<= -1	: erreur d'ouverture de fichier ::
					-2 : impossible d'ouvrir le fichier $sNomFichier
					-3 : impossible d'ecrire le fichier Source
					#-4 : impossible d'ecrire le fichier Destination
					#-5 : la valeur de $arrChampsEtValeurRechercher[0] n'as pas été trouvée dans $sEntetes
					#-6 : $iIndexRechercher est plus grand que count($ligne), càd se réfère à un champs inexistant
					#-7 : $refArrDonnees ne contient pas le même nombre de champs que $ligne
					-8 : impossible de mettre le compteur à jour
			0+		: le nombre de caractères écrits
	*/

	$retour = 0;

	# Tenter d'ouvrir le fichier
	$HndFichier_Source = @fopen($sNomFichier, 'cb+');
	if(false === $HndFichier_Source){
		$refArrDonnees=array("Impossible d'ouvrir le fichier '$sNomFichier'");
		return -2;
	}

	# Préparer le nom de la première colonne a partir du nom du fichier
	$sID_NomFichier = $sNomFichier;
	$pos = strrpos($sID_NomFichier, '/');

	if(false === $pos){
		$sID_NomFichier .= "_ID";
	}else{
		$sID_NomFichier = substr($sID_NomFichier, $pos+1);
		$pos = strrpos($sID_NomFichier, '.');
		if(false === $pos){
			$sID_NomFichier .= "_ID";
		}else{
			$sID_NomFichier = substr($sID_NomFichier, 0, $pos) ."_ID";
		}
	}

	# Lire la premiere ligne, si absente, faire le setup initial
	$ligne = fgetcsv($HndFichier_Source, 1000, ";");
	if($ligne === false){
		if(is_array($sEntetes) && !empty($sEntetes)){
			# Placer le nom du fichier comme étant le nom de la première colonne
			array_unshift($sEntetes, $sID_NomFichier);
			$ligne = fputcsv($HndFichier_Source, array(1), ';');
			$ligne = fputcsv($HndFichier_Source, $sEntetes, ';');

			if(false === $ligne){
				$refArrDonnees=array("[1]Impossible d'écrire dans le fichier '$sNomFichier'");
				$retour = -3; # impossible d'ecrire le fichier Destination
			}else{
				$retour += $ligne;
			}
		}else{
			$ligne = fputcsv($HndFichier_Source, array(0), ';');
			if(false === $ligne){
				$refArrDonnees=array("[2]Impossible d'écrire dans le fichier '$sNomFichier'");
				$retour = -3; # impossible d'ecrire le fichier Destination
			}
		}
	}

	if($retour > -1){
		$iCompteur = incrementerCompteur($sID_NomFichier);

		if(false !== $iCompteur){
			fseek($HndFichier_Source, 0, SEEK_END); # force a aller à la fin du fichier, ici c'est le cas où on ajoute une nouvelle ligne sans désir de trouver et mettre à jour une ancienne ligne.

			array_unshift($refArrDonnees, $iCompteur);
			$ligne = fputcsv($HndFichier_Source, $refArrDonnees, ';');
			if(false !== $ligne){
				$retour += $ligne;
			}else{
				$refArrDonnees=array("[3]Impossible d'écrire dans le fichier '$sNomFichier'");
				$retour = -3; # impossible d'ecrire le fichier Destination
			}
			fclose($HndFichier_Source);
		}else{
			$refArrDonnees=array("Impossible de mettre le compteur à jour");
			$retour = -8;
		}
	}

	return $retour;
}


function incrementerCompteur($sCompteur){
	/*
	Augmente et retourne le compteur demandé par $sCompteur, s'il n'existe pas, le crée et retourne 0

	retour
		FALSE si problème
		0+ pour le decompte courant
	*/
	$sNomFichier = CSV_BASE_DIR.'table_compteur.csv';
	$retour = false;

	# Tenter d'ouvrir le fichier
	$HndFichier = @fopen($sNomFichier, 'cb+');
	if(false === $HndFichier){
		return false;
	}

	if($HndFichier !== false){
		# Lire la premiere ligne
		$entetes = fgetcsv($HndFichier, 1000, ";");
		$donnees = array();

		if($entetes === false){ # Le fichier était vide
			$entetes[] = $sCompteur;
			$donnees[] = 0;
			$iIndex = 0;
			$retour = true;
		}else{
			if(!is_numeric($entetes[0])){
				// Avant de determiner si $entetes contient $sCompteur, voir si on as bien une seconde ligne contenant les donnees
				$donnees = fgetcsv($HndFichier, 1000, ";");
				if($donnees !== false){
					// Est-ce que $entetes et $donnees contiennent le même nombre de champs?
					if(count($entetes) == count($donnees)){
						$iIndex = array_search($sCompteur, $entetes);
						if($iIndex === false){ # Index pas trouvé
							$entetes[] = $sCompteur;
							$donnees[] = 0;
							$iIndex = count($donnees)-1;
						}else{
							$donnees[$iIndex]++;
						}
						$retour = true; // Pas d'erreur? L'indiquer pour plus loin
					}
				}
			}
		}

		// S'il n'y as eut aucune erreur jusqu'ici...
		if($retour === true){
			$retour = rewind($HndFichier);
			if($retour === true){
				$retour = fputcsv($HndFichier, $entetes, ';');
				if($retour !== false){
					$retour = fputcsv($HndFichier, $donnees, ';');
					if($retour !== false){
						$retour = $donnees[$iIndex]; # Puisque l'entete et la donnee sont bien ecrit, retourner le compte
					}
				}
			}
		}
	}

	return $retour;
}


function lireCompteur($sCompteur){
	/*
	l'idee est de ne pas devoir lire chaque fichiers pour connaitre l'index le plus haut
	ex: produits_ID

	retour
		FALSE si problème
		0+ pour le decompte courant, c'est à dire l'index le plus haut pour $sCompteur
	*/

	$sNomFichier = CSV_BASE_DIR.'table_compteur.csv';
	$retour = false;
	# Par sanité, vérifier si $sNomFichier existe et est en fait ou non un nom de répertoire
	if(is_readable($sNomFichier)){
		# Tenter d'ouvrir le fichier
		if(($HndFichier = fopen($sNomFichier, 'rb')) !== false){
			# Lire la premiere ligne
			$entetes = fgetcsv($HndFichier, 1000, ";");

			if($entetes !== false){ # Le fichier n'est pas vide
				$iIndex = array_search($sCompteur, $entetes);
				if($iIndex !== false){ # Index trouvé
					$donnees = fgetcsv($HndFichier, 1000, ";");
					if(($donnees !== false) && isset($donnees[$iIndex])){
						$retour = intval($donnees[$iIndex]);
					}
				}
			}
		}
	}

	return $retour;
}

/* == EOF == */
