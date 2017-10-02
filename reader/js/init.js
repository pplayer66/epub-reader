document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		EPUBJS.filePath = "js/libs/";
		EPUBJS.cssPath = "css/";
		window.reader = ePubReader("troi.epub");
		var book = window.reader.book;
		var progressStatus = document.getElementById('progress-status');
		var progressBar = document.getElementById('progress');
		var progressValue = document.getElementById('progress-value');
		var title = 'Падение Трои - Питер Акройд';
		var chapterTotalProgess = 0;
		var currentChapterProgress = 0;
		var chapters = [];
		var total = 0;
		var currentChapter;

		book.getMetadata().then(function(meta){
			var title = meta.bookTitle;
		});



		var getCurrentCfiRange = function(cfirange){
			var text = '';
			var currentLocation = book.getCurrentLocationCfi();
			var nextPageChapter = currentLocation.split('/6/').pop().split('[').shift();
			if (currentChapter !== nextPageChapter){
				chapterTotalProgess += currentChapterProgress
				chapters.push({chapter: currentChapter, progress: chapterTotalProgess});
				console.log(chapters);
				currentChapter = nextPageChapter;
				return;
			}
			var cfi = new EPUBJS.EpubCFI();
			var startRange = cfi.generateRangeFromCfi("epubcfi(/6/2[titlepage]!/4/1:0)", book.renderer.render.document);
			var endRange = cfi.generateRangeFromCfi(cfirange.end, book.renderer.render.document);
			var fullRange = document.createRange();
			if (startRange)
				fullRange.setStart(startRange.startContainer, startRange.startOffset);
			if (endRange)
				fullRange.setEnd(endRange.startContainer, endRange.startOffset);
			text = fullRange.toString();
			var textLength = (text.trim()).length;
			console.log('textLength', textLength);
			currentChapterProgress = textLength;
		}
		
		// $(document).click(function(){
		// 	// book.setStyle('font-size', '20px');
		// 	// book.setStyle('line-height', '2em');
		// 	// book.setStyle('font-family', 'san-serif');
		// 	// getCurrentCfiRange()
		// });
		// $(window).resize(function(){
		// 	book.setStyle("background", "blue");
		// })

		
		book.on('renderer:chapterDisplayed', function() {
			$('.overlay').show();
			setTimeout(function(){
				$('.overlay').hide();
			}, 400);
			EPUBJS.core.addCss('/css/styles.css', null, book.renderer.doc.head);
			book.setStyle('font-size', '16px');
		});

		var triggerNextPage = function(t)
		{
			setTimeout(function(){
				book.nextPage();
			}, t)
		};



		var getLocation = function(){
			return book.getCurrentLocationCfi();
		}


		var countPercentage = function(){
			console.log('current location progress', book.pages[getLocation()]);
			if (!book.pages[getLocation()])
				return;
			var currentProgress = book.pages[getLocation()].progress;
			var percentage = (currentProgress * 100) / total;
			progressBar.style.display = 'block';
			progressValue.innerText = `${percentage.toFixed(2)}%`;
			progressStatus.style.width = `${percentage.toFixed(2)}%`;
		}



		var addBook = function()
		{
			$.ajax(
				{
					url: `/book/addbook?title=${title}`,
					type: 'GET',
					success: function(data){
						console.log('saved book', data)
					},
					error: function(err){
						console.log(err);
					}
				})
		};

		book.on('renderer:visibleRangeChanged', getCurrentCfiRange);
		// addBook();
	}
};