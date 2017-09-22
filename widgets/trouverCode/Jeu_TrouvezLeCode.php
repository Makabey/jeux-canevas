<?php
	$nom_joueur = ""; # vide pour le moment, plus tard supporter lecture/écriture par cookie
?>
<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta charset="utf-8">
		<title>Jeu "Trouvez le code" (widget)</title>
		<link rel="stylesheet" href="../common/css/Jeux_Canvas.css">
		<meta name="author" content="Eric Robert" />
		<meta name="description" content="Jeu du style MasterMind où l'on doit trouver la combinaison secrète" />
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<script src="../common/js/functions.js"></script>
		<script src="../common/xhr/xhrFunctions.js"></script>
		<script src="../common/js/Canvas_plugin1.js"></script>
		<script src="js/Jeu_TrouvezLeCode.js"></script>
	</head>
	<body id="combinaison">
		<div class="widget_mksoft combinaison">
			<p>Trouvez le code</p>
			<div role="main">
				<div role="menubar">
					<ul role="menu">
						<li role="menuitem">Options
							<ul id="menu_options">
								<li role="menuitemradio" aria-checked="false" data-value="3_1"><div></div><span>3 pastilles en 2D</span></li>
								<li role="menuitemradio" aria-checked="false" data-value="3_2"><div></div><span>3 pastilles en 3D</span></li>
								<li role="menuitemradio" aria-checked="false" data-value="4_1"><div></div><span>4 pastilles en 2D</span></li>
								<li role="menuitemradio" aria-checked="true" data-value="4_2"><div></div><span>4 pastilles en 3D</span></li>
							</ul>
						</li>
						<li role="menuitem">Aide
							<ul id="menu_aide">
								<li role="menuitem" data-value="regles"><div></div><span>Règles</span></li>
							</ul>
						</li>
					</ul>
				</div>

				<canvas width="275" height="460">Si vous voyez ceci, alors votre fureteur ne supporte pas l'objet "canvas".</canvas> <!-- aime PAS que la taille soit en STYLE! -->

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
							<li>Cliquez les pastilles pour entrer votre code puis le bouton 'Vérifier';</li>
							<li>Une case verte indique que l'une des pastilles est de la bonne couleur et à la bonne position;</li>
							<li>Une case rouge, qu'une pastille est de la bonne couleur mais à la mauvaise position;</li>
							<li>Les cases n'indiquent pas la position, seulement l'état;</li>
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

						//afficherPanneauScores(true);

						$(".dialogue.alerte").show();
					});
				</script>-->
			</div>
		</div>
		<script>
		// DEBUG
		afficherPanneauScores(true, "\nVous avez pris 0 coups pour réussir.");
		</script>
	</body>
</html>
