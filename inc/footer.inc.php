
	</div>
	<footer>
		<div id="footer">
		 <div class="container">
			<p class="text-muted">Création: Eric Robert</p>
		 </div>
		</div>
	</footer>

	<!-- Bootstrap core JavaScript
	================================================== -->
	<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>

	<!-- Latest compiled and minified JavaScript -->
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
	<!--<script src="<?=$rootDomain?>xhr/xhrFunctions.js"></script>-->
	<script src="<?=$rootDomain?>js/functions.js"></script>
	<script>
		"use strict";
		/* Variables nécessaires pour le fichier JS qui suit, si applicable */
		<?php
		// Variables générées par PHP pour JS
		/*if($sNomDeCettePage != 'index'){
			if(isset($_SESSION['pseudo'])){
				$pseudo = $_SESSION['pseudo'];
				$idRoman = (isset($_SESSION[$pseudo]['idRoman']))?$_SESSION[$pseudo]['idRoman']:-1;

				echo "var idUsager = {$_SESSION[$pseudo]['idUsager']};", PHP_EOL;
				echo "var idRoman = $idRoman;", PHP_EOL;
			}
		}*/
		?>
	</script>
 </body>
</html>