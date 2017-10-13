document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		EPUBJS.filePath = "js/libs/";
		EPUBJS.cssPath = "css/";
		window.reader = ePubReader(`${$('#main').attr('data-book')}.epub`);
		var book = window.reader.book;
		var $progressStatus = $('#progress-status');
		var $progressBar = $('#progress');
		var $progressValue = $('#progress-value');
		var $progressSlider = $('#progress-slider');
		var goingToChapter;
		var progress = 0;
		var title = $('#main').attr('data-title');
		var currentChapterProgress = 0;

		$('#booklist').click(function(){
			window.location.href = '/home';
		})

		$('#savebook').click(function(){
			$.get( "/book/addbook", {title}, function(data){
				console.log(data);
			});
		})

		$('#sendchapter').click(function(){
			countCurrentChapterProgress();
		})

		book.getMetadata().then(function(meta){
			title = meta.bookTitle;
			console.log(title);
		});


		$.ajax({
			url: `/book/chapters?title=${title}`,
			type: 'GET',
			success: function(chapters){
				if (!chapters)
					return;
				console.log(chapters);
				book.chapters = _.keyBy(chapters, 'cfi');
				book.total = +(chapters[chapters.length - 1].chapterProgress);
				book.on('renderer:visibleRangeChanged', countProgress);
			}
		});

		var getSliderPositionPercent = function(accuracy){
			var parentWidth = $('#progress-range').width();
			var width = $('#progress-status').width();
			var percent = 100 * width / parentWidth;
			return percent.toFixed(accuracy);
		}

		var movingRenderer = function(currentChapter){
			var chapterPages;
			var currentChapterStartProgress = currentChapter.chapterProgress - currentChapter.chapterLength;
			if (book.renderer.spreads){
				chapterPages = book.renderer.pageMap;
				for (var i=0; i <= book.renderer.displayedPages*2; i+=2){
					if (chapterPages[i] && chapterPages[i+1]){
						var currentPageProgress = getCfiRangeTextLength(chapterPages[0].start, chapterPages[i+1].end);
						var pageprogress = currentPageProgress + currentChapterStartProgress;
						if (pageprogress < progress){
							continue;
						}else{
							book.goto(chapterPages[i].start);
							break;
						}
					}else if (chapterPages[i] && !chapterPages[i+1]){
						book.goto(chapterPages[i].start);
						break;
					}
				};
			}else {
				chapterPages = book.renderer.pageMap;
				for (var i=0; i <= book.renderer.displayedPages; i++){
					var currentPageProgress = getCfiRangeTextLength(chapterPages[0].start, chapterPages[i].end);
					var pageprogress = currentPageProgress + currentChapterStartProgress;
					if (pageprogress < progress){
						continue;
					}else{
						book.goto(chapterPages[i].start);
						break;
					}
				};
			}
		};

		$progressSlider.draggable(
		{
				containment: "parent",
				axis: "x",
				start: function(){
					$(this).css('transition', 'none');
					$('#progress-status').css('transition', 'none');
					$('#current-chapter').css('display', 'block');
				},
				drag: function(e){
					$('#progress-status').width($(this).css('left'));
					$('#progress-value').text(`${getSliderPositionPercent(2)}%`);
					progress = (getSliderPositionPercent(4) * book.total) / 100;
					goingToChapter = _.find(book.chapters, function(chp){
						return chp.chapterProgress > progress;
					})
					$('#current-chapter').text(goingToChapter.label);
				},
				stop: function(e){
					$('#progress-status').css('transition', 'width 0.2s ease');
					$(this).css('transition', 'left .2s ease');
					$('#current-chapter').css('display', 'none');
					var currentChapterCfi = book.getCurrentLocationCfi().split('!').shift()+')';
					var currentChapter = book.chapters[currentChapterCfi];
					if (goingToChapter.cfi !== currentChapter.cfi)
						return book.goto(goingToChapter.cfi);
					movingRenderer(currentChapter);
				}
		});

		var countCurrentChapterProgress = function(){
			var text='';
			var cfi = new EPUBJS.EpubCFI();
			var startRange = cfi.generateRangeFromCfi(book.renderer.pageMap[0].start, book.renderer.render.document);
			var endRange = cfi.generateRangeFromCfi(book.renderer.pageMap[book.renderer.pageMap.length-1].end, book.renderer.render.document);
			var fullRange = document.createRange();
			if (startRange)
				fullRange.setStart(startRange.startContainer, startRange.startOffset);
			if (endRange)
				fullRange.setEnd(endRange.startContainer, endRange.startOffset);
			text = fullRange.toString();
			var chapters = book.toc;
			var currentChapterCfi = book.currentChapter.cfi.split('!').shift()+')';
			var currentChapter = chapters.filter(function(chapter){return chapter.cfi == currentChapterCfi})[0];
			if (!currentChapter)
				currentChapter = book.currentChapter;
			var currentChapterLength = (text.trim()).length;
			var currentChapterLabel = currentChapter.label || `ГЛАВА ${book.currentChapter.spinePos+1}`;
			currentChapterProgress += currentChapterLength;
			$.ajax({
				url: `/book/addchapter?title=${title}&cfi=${currentChapterCfi}&chapterLength=${currentChapterLength}&chapterProgress=${currentChapterProgress}&label=${currentChapterLabel}`,
				type: 'GET',
				success: function(data){
					console.log(data);
				}
			});
		};

		var getCfiRangeTextLength = function(start, end){
			var cfi = new EPUBJS.EpubCFI();
			var startRange = cfi.generateRangeFromCfi(start, book.renderer.render.document);
			var endRange = cfi.generateRangeFromCfi(end, book.renderer.render.document);
			var fullRange = document.createRange();
			if (startRange)
				fullRange.setStart(startRange.startContainer, startRange.startOffset);
			if (endRange)
				fullRange.setEnd(endRange.startContainer, endRange.startOffset);
			text = fullRange.toString();
			var textLength = (text.trim()).length;
			return textLength;
		};

		book.on('renderer:chapterDisplayed', function() {
			EPUBJS.core.addCss('/css/styles.css', null, book.renderer.doc.head);
			// countCurrentChapterProgress();
			$('.overlay').show();
			setTimeout(function(){
				$('.overlay').hide();
			}, 400);
			if (progress == 0)
				return;
			var currentChapterCfi = book.getCurrentLocationCfi().split('!').shift()+')';
			var currentChapter = book.chapters[currentChapterCfi];
			movingRenderer(currentChapter);
		});

		var countProgress = function(){
			var currentChapterPassedLength = getCfiRangeTextLength(book.renderer.pageMap[0].start, book.renderer.visibleRangeCfi.end);
			var currentChapterCfi = book.getCurrentLocationCfi().split('!').shift()+')';
			var currentChapter = book.chapters[currentChapterCfi];
			var currentProgress = currentChapter.chapterProgress - currentChapter.chapterLength + currentChapterPassedLength;
			var percentage = (currentProgress * 100) / book.total;
			$progressBar.css('display', 'block')
			$progressValue.text(`${percentage.toFixed(2)}%`);
			$progressStatus.css('width', `${percentage.toFixed(2)}%`);
			$progressSlider.css('left', `${percentage.toFixed(2)}%`);
		}
	}
};