var $books = $('.book');

$books.click(function(){
	var book = $(this).attr('data-src');
	var title = $(this).attr('data-title');
	window.location.href = `/reader?book=${book}&title=${title}`;
})