<?php
	$nom_joueur = ""; # vide pour le moment, plus tard supporter lecture/écriture par cookie
?>
<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<!-- <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> -->
		<meta charset="utf-8">
		<title>Jeu de mémoire (widget)</title>
		<link rel="stylesheet" href="../common/css/Jeux_Canvas.css">
		<meta name="author" content="Eric Robert" />
		<meta name="description" content="Jeu du style Mémoire où l'on doit pairer chaque carte avec sa soeur" />
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<script src="../common/js/functions.js"></script>
		<script src="../common/xhr/xhrFunctions.js"></script>
		<script src="../common/js/Canvas_plugin1.js"></script>
		<script src="js/Jeu_Memoire_Class_Carte.js"></script>
		<script src="js/Jeu_Memoire_Class_PaquetCarte.js"></script>
		<script src="js/Jeu_Memoire_Class_JeuMemoire.js"></script>
		<script src="js/Jeu_Memoire.js"></script>
	</head>
	<body id="memoire">
		<div class="widget_mksoft memoire">
			<p>Trouvez les paires</p>
			<div role="main">

				<div role="menubar">
					<ul role="menu">
						<li role="menuitem">Options
							<ul id="menu_options">
								<li data-value="reset" class="separatorUnder"><div></div><span>Réinitialiser le jeu</span></li>
								<li role="menuitemcheckbox" aria-checked="true" data-value="inclureWilds"><div></div><span>Insérer des "Joker"</span></li>
								<li role="menuitemcheckbox" aria-checked="false" data-value="rejeterDoubleWild"><div></div><div></div><span>Rejeter double "Joker"</span></li>
							</ul>
						</li>
						<li role="menuitem">Aide
							<ul id="menu_aide">
								<li role="menuitem" data-value="regles"><div></div><span>Règles</span></li>
							</ul>
						</li>
					</ul>
				</div>

				<!-- NOTE : la largeur du CANVAS est aussi controlées dans Jeu_Memoire_Class_JeuMemoire.js >> ln~91 // -->
				<canvas width="425" height="570">Si vous voyez ceci, alors votre fureteur ne supporte pas l'objet "canvas".</canvas> <!-- aime PAS que la taille soit en STYLE! // -->

				<div class="dialogue winlose">
					<div role="dialog">
						<form action="#" method="post">
							<fieldset><button type="button">x</button></fieldset>
							<fieldset><p>Message g/p</p></fieldset>
							<fieldset>
									<label id="label_joueur_Nom" for="joueur_Nom">Nom : </label><input type="text" id="joueur_Nom" pattern="[a-zA-Z0-9\- ]{3,20}" placeholder="Votre nom" required="required" title="de 3 à 20 caractères alpha-numériques" value="<?php echo $nom_joueur; ?>" />
									<button type="submit">Envoyer</button>
							</fieldset>
							<fieldset><!-- la tables des scores est affichée ici // --></fieldset>
							<fieldset><button type="button">Fermer</button></fieldset>
						</form>
					</div>
				</div>

				<div class="dialogue alerte">
					<div role="dialog">
						<h3>Règles</h3>
						<ul>
							<li>Cliquez les cartes pour former les paires;</li>
							<li>Un "essai" est comptabilisé pour chaque deux cartes cliquées, qu'elles forment une paire ou non;</li>
							<li>Les cartes "Joker" comportent un "Astérisque encerclé" et forcent le retournement de l'autre carte cliquée avec elle;</li>
							<li>Si vous trouvez les deux "Joker" dans le même essai, elles sont traitée comme une paire (sauf si 'Rejeter double "Joker"' est coché);
							<li>L'option 'Insérer des "Joker"' ajoute deux "Joker" dans le jeu;</li>
							<li>L'option 'Rejeter double "Joker"' traite le cas où vous trouvez les deux "Joker", dans le même essai, comme une paire invalide;</li>
						</ul>
						<form action="#" method="post">
							<fieldset>
								<button type="button">Fermer</button>
							</fieldset>
						</form>
					</div>
				</div>

				<!--<script>
					$(function(){
						/*$('div[role="complementary"]').css({"display":"inline-block"});
						var XHR_Query = "oper=lire&nombre=-5"; // demander les 5 dernières entrées
						execXHR_Request("assets/xhr/Jeu_TrouvezLeCode.xhr.php", XHR_Query, retour_lireScores, traiterErreurs);*/
						afficherPanneauScores (true);
					});
				</script> -->
			</div>
		</div>
	</body>
</html>
