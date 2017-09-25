<?php
$sPageTitle = "Accueil | ";

require "inc/header.inc.php";

$jeu = (isset($_GET['j']))?(int)$_GET['j']:1;
if($jeu != 2) $jeu = 1;
?>
		<div class="row">
			<div class="col-md-6 col-xs-12">
				<div class="row">
					<div class="col-xs-12">
						<div class="well repository">
							<h3>Mémoire</h3>
							<p>Le jeux de mémoire classique, proposant de découvrir les paires d'images cachées.</p>
							<button type="button" class="btn btn-info pull-right" data-jeu="1">Afficher</button>
							<div class="clearfix"></div>
						</div>
					</div>
					<div class="col-xs-12">
						<div class="well repository">
							<h3>Trouvez le code</h3>
							<p>Un jeu basé sur ceux où l'on doit découvrir la séquence (ou code) caché.</p>
							<button type="button" class="btn btn-info pull-right" data-jeu="2">Afficher</button>
							<div class="clearfix"></div>
						</div>
					</div>
				</div>
			</div>

			<div class="col-md-6 col-xs-12 text-center">
				<iframe height="500" width="500" id="jeux" data-src="<?=$fullDomain?>widgets/" sandbox="allow-scripts allow-same-origin allow-forms" <?php

					/*
					srcdoc="<?=$fullPath?>widgets/memoire/Jeu_Memoire.php"

					if($jeu == 1){
						echo 'height="400" width="200" name="jeux" srcdoc="widgets/memoire/Jeu_Memoire.php" sandbox=""';
					}else{
						require "Jeu_TrouvezLeCode.php";
					}*/
				?>>
					<p>Les &lt;iFrame&gt; ne sont pas permis dans votre fureteur.</p>
				</iframe>

			</div>
		</div>

		<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>

		<!-- Latest compiled and minified JavaScript -->
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

<?php
require "inc/footer.inc.php";
?>
