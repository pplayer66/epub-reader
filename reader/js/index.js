var $books = $('.book');

$books.click(function(){
	var book = $(this).attr('data-src');
	window.location.href = `/reader?book=${book}`;
})