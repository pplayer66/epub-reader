document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		EPUBJS.filePath = "js/libs/";
		EPUBJS.cssPath = "css/";
		window.reader = ePubReader("troi.epub");
		var book = window.reader.book;
		var progressStatus = document.getElementById('progress-status');
		var progressBar = document.getElementById('progress');
		var progressValue = document.getElementById('progress-value');

		var title = 'Падение Трои';
 		var chaptersTotalProgress = 0;
		var currentChapterTotalProgress = 0;
		var currentChapter;
		var newChapter;
		var currentCfi;

		// book.getMetadata().then(function(meta){
		// 	var title = meta.bookTitle;
		// });


		$.ajax({
			url: `/book/chapters?title=${title}`,
			type: 'GET',
			success: function(chapters){
				book.chapters = chapters;
				book.total = +(chapters[chapters.length - 1].progress);
				console.log('book chapters', book.chapters);
				console.log('booktotal', book.total);
				book.on('renderer:visibleRangeChanged', countProgress);
			},
			error: function(err){

			}
		});



		var getVisibleRangeTextLength = function(cfirange){
			if(book.renderer.chapterPos == Math.ceil(book.currentChapter.pages / 2)) {
				var text='';
				var cfi = new EPUBJS.EpubCFI();
				var startRange = cfi.generateRangeFromCfi('epubcfi(/6/2[titlepage]!/4/1:0)', book.renderer.render.document);
				var endRange = cfi.generateRangeFromCfi(cfirange.end, book.renderer.render.document);
				var fullRange = document.createRange();
				if (startRange)
					fullRange.setStart(startRange.startContainer, startRange.startOffset);
				if (endRange)
					fullRange.setEnd(endRange.startContainer, endRange.startOffset);
				text = fullRange.toString();
				var textLength = (text.trim()).length;
				chaptersTotalProgress += textLength;
				$.ajax({
					url: `/book/addchapter?title=${title}&chapter=${book.currentChapter.cfiBase}&progress=${chaptersTotalProgress}`,
					type: 'GET',
					success: function(data){
						console.log(data);
						triggerNextPage(1000);
					},
					error: function(err){
						console.log(err);
					}
				});
			}else{
			triggerNextPage(500);
			}
		}

		book.on('renderer:chapterDisplayed', function() {
			// book.on('renderer:visibleRangeChanged', getVisibleRangeTextLength);
			$('.overlay').show();
			setTimeout(function(){
				$('.overlay').hide();
			}, 400);
			EPUBJS.core.addCss('/css/styles.css', null, book.renderer.doc.head);
			book.setStyle('font-size', '20px');
		});

		var triggerNextPage = function(t)
		{
			setTimeout(function(){
				book.nextPage();
			}, t)
		};




		var countProgress = function(cfirange){
			var text='';
			var cfi = new EPUBJS.EpubCFI();
			var startRange = cfi.generateRangeFromCfi('epubcfi(/6/2[titlepage]!/4/1:0)', book.renderer.render.document);
			var endRange = cfi.generateRangeFromCfi(cfirange.end, book.renderer.render.document);
			var fullRange = document.createRange();
			if (startRange)
				fullRange.setStart(startRange.startContainer, startRange.startOffset);
			if (endRange)
				fullRange.setEnd(endRange.startContainer, endRange.startOffset);
			text = fullRange.toString();
			var textLength = (text.trim()).length;
			var index = book.chapters.findIndex(function(item){
				return item.chapter == book.currentChapter.cfiBase;
			});
			var idx = index - 1;
			if (idx >= 0){
				console.log('index', index);
				console.log('idx', idx);
				var currentProgress = book.chapters[idx].progress + textLength;
				var percentage = (currentProgress * 100) / book.total;
				progressBar.style.display = 'block';
				progressValue.innerText = `${percentage.toFixed(2)}%`;
				progressStatus.style.width = `${percentage.toFixed(2)}%`;
			}
		}

	}
};