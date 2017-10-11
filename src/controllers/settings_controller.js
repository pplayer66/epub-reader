EPUBJS.reader.SettingsController = function() {
	var activeClass = 'active-setting';
	var activeNightWatch = 'active-night-watch';

	var $fontSizeActive = $('#fontsize-setting').find('.active-setting');
	var $fontSizes = $('#fontsize-setting').find('.setting-content-value');
	$fontSizes.click(function(){
		if ($(this)==$fontSizeActive){
			return;
		}
		$fontSizeActive.removeClass(activeClass);
		$fontSizeActive = $(this);
		$fontSizeActive.addClass(activeClass);
		var fontsize = $(this).text();
		book.setStyle('font-size', fontsize);
	});

	var $themeActive = $('#theme-setting').find('.active-setting');
	var $themes = $('#theme-setting').find('.setting-content-value');
	var themesClickHandler = function(){
		if ($(this)==$themeActive){
			return;
		}
		$themeActive.removeClass(activeClass);
		$themeActive = $(this);
		$themeActive.addClass(activeClass);
		var theme = $themeActive.css('background');
		$('#main').css('background', theme);
	};
	$themes.click(themesClickHandler);

	var $intervalActive = $('#interval-setting').find('.active-setting');
	var $intervals = $('#interval-setting').find('.setting-content-value');
	$intervals.click(function(){
		if ($(this)==$intervalActive)
			return;
		$intervalActive.removeClass(activeClass);
		$intervalActive = $(this);
		$intervalActive.addClass(activeClass);
		var interval = $intervalActive.attr('id').split('-');
		if (interval.length > 1){
			interval = interval.join('.');
		}else{
			interval = interval[0];
		}
		book.setStyle('line-height', interval);
	});

	var $fontfamilyActive = $('#fontfamily-setting').find('.active-setting');
	var $fonts = $('#fontfamily-setting').find('.setting-content-value');
	$fonts.click(function(){
		if ($(this)==$fontfamilyActive)
			return;
		$fontfamilyActive.removeClass(activeClass);
		$fontfamilyActive = $(this);
		$fontfamilyActive.addClass(activeClass);
		var font = $fontfamilyActive.attr('id')
		book.setStyle('font-family', font);
	});

	var $nightWatchButton = $('#nightwatch-setting').find('i');
	$nightWatchButton.click(function(){
		if ($(this).hasClass('icon-moon')){
			$themes.on('click', themesClickHandler);
			$(this).removeClass('icon-moon');
			$(this).addClass('icon-moon-inv');
			var currentBG = $('#theme-setting').find('.active-setting').css('background');
			$('#main').css('background', currentBG);
			book.setStyle('color', '#655757');
		}else{
			$(this).removeClass('icon-moon-inv');
			$(this).addClass('icon-moon');
			$('#main').css('background', '#151515');
			book.setStyle('color', '#afafaf');
			$themes.off('click')
		}
	})
};