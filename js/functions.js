"use strict";

$(document).ready(function(){
	$('.btn').click(function(){
		var jeu = $(this).data('jeu');
		if(typeof jeu == 'number'){
			var path = $('#jeux').data('src');
			if(jeu == '1'){
				$('#jeux')
					.attr('height', '700')
					.attr('width', '450')
					.attr('src', path + 'memoire/Jeu_Memoire.php');
			}else{
				$('#jeux')
					.attr('height', '600')
					.attr('width', '350')
					.attr('src', path + 'trouverCode/Jeu_TrouvezLeCode.php');
			}
		}
	});
});

// == EOF ==
