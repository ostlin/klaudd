/*
Theme: Flatfy Theme
Author: Andrea Galanti
Bootstrap Version 
Build: 1.0
http://www.andreagalanti.it
*/

$(window).load(function() { 
	//Preloader 
	$('#status').delay(300).fadeOut(); 
	$('#preloader').delay(300).fadeOut('slow');
	$('body').delay(550).css({'overflow':'visible'});
})

$(document).ready(function() {


		
		//Wow Animation DISABLE FOR ANIMATION MOBILE/TABLET

		// OwlCarousel N1
/*
		//SmothScroll
		$('a[href*=#]').click(function() {
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
			&& location.hostname == this.hostname) {
					var $target = $(this.hash);
					$target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
					if ($target.length) {
							var targetOffset = $target.offset().top;
							$('html,body').animate({scrollTop: targetOffset}, 600);
							return false;
					}
			}
		});
		
*/
});

