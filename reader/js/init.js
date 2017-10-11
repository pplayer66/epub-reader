document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		EPUBJS.filePath = "js/libs/";
		EPUBJS.cssPath = "css/";
		window.reader = ePubReader("troi.epub");
		var book = window.reader.book;
		var progressStatus = document.getElementById('progress-status');
		var progressBar = document.getElementById('progress');
		var progressValue = document.getElementById('progress-value');
		
		var goingToChapter;
		var progress = 0;
		var title = 'Падение Трои';
		var chaptersTotalProgress = 0;
		var initialCfi = 'epubcfi(/6/2[titlepage]!/4/1:0)';

		$progressSlider = $('#progress-slider');


		var getSliderPositionPercent = function(accuracy){
			var parentWidth = $('#progress-range').width();
			var width = $('#progress-status').width();
			var percent = 100 * width / parentWidth;
			return percent.toFixed(accuracy);
		}

		var movingRenderer = function(){
			
		}

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
					var i = 0;
					while (book.chapters[i].progress < progress){
						i++;
					}
					goingToChapter = book.chapters[i];
					$('#current-chapter').text(goingToChapter.chapterTitle);
				},
				stop: function(e){
					$('#progress-status').css('transition', 'width 0.2s ease');
					$(this).css('transition', 'left .2s ease');
					$('#current-chapter').css('display', 'none');
					var currentChapterPosition = book.currentChapter.spinePos - 1;
					if (progress > book.chapters[currentChapterPosition].progress){
						book.goto(goingToChapter.cfi);
					}else if(progress < book.chapters[currentChapterPosition - 1].progress){
						book.goto(goingToChapter.cfi);
					}else{
						var spreads = book.renderer.spreads;
						var chapterPages = book.renderer.pageMap;
						if (spreads){
							for (i=0; i <= book.renderer.displayedPages*2; i+=2){
								if (chapterPages[i] && chapterPages[i+1]){
									// console.log(getCfiRangeTextLength(initialCfi, chapterPages[i+1].end));
									if ((getCfiRangeTextLength(initialCfi, chapterPages[i+1].end) + book.chapters[book.currentChapter.spinePos-2].progress) < progress)
										continue;
									else{
										book.goto(chapterPages[i].start);
										break;
									}
								}else if (chapterPages[i] && !chapterPages[i+1]){
									book.goto(chapterPages[i].start);
									break;
								}
							};
						}else {
							for (i=0; i <= book.renderer.displayedPages; i++){
								if ((getCfiRangeTextLength(initialCfi, chapterPages[i].end) + book.chapters[currentChapterPosition-1].progress) < progress){
									continue;
								}else{
									book.goto(chapterPages[i].start);
									break;
								}
							};
						}
					}
				}
		});
		// book.getMetadata().then(function(meta){
		// 	var title = meta.bookTitle;
		// });


		$.ajax({
			url: `/book/chapters?title=${title}`,
			type: 'GET',
			success: function(chapters){
				book.chapters = chapters;
				book.total = +(chapters[chapters.length - 1].progress);
				book.on('renderer:visibleRangeChanged', countProgress);
			}
		});

		var getVisibleRangeTextLength = function(cfirange){
			if(book.renderer.chapterPos == Math.ceil(book.currentChapter.pages / 2)) {
				var text='';
				var cfi = new EPUBJS.EpubCFI();
				var startRange = cfi.generateRangeFromCfi(initialCfi, book.renderer.render.document);
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
					url: `/book/addchapter?title=${title}&chapter=${book.currentChapter.cfiBase}&progress=${chaptersTotalProgress}&cfi=${book.currentChapter.cfi}&chapterTitle=${$.trim($('.toc_link').eq(book.currentChapter.spinePos-2).text())}`,
					type: 'GET'
				});
			};
			return;
		}

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
			// book.on('renderer:visibleRangeChanged', getVisibleRangeTextLength);
			$('.overlay').show();
			setTimeout(function(){
				$('.overlay').hide();
			}, 400);
			var currentChapterPosition = book.currentChapter.spinePos - 1;
			if (progress !==0){
				var spreads = book.renderer.spreads;
				var chapterPages = book.renderer.pageMap;
				if (spreads){
					for (i=0; i <= book.renderer.displayedPages*2; i+=2){
						if (chapterPages[i] && chapterPages[i+1]){
							if ((getCfiRangeTextLength(initialCfi, chapterPages[i+1].end) + book.chapters[currentChapterPosition-1].progress) < progress)
								continue;
							else{
								book.goto(chapterPages[i].start);
								break;
							}
						}else if (chapterPages[i] && !chapterPages[i+1]){
							book.goto(chapterPages[i].start);
							break;
						}
					};
				}else {
					for (i=0; i <= book.renderer.displayedPages; i++){
						if ((getCfiRangeTextLength(initialCfi, chapterPages[i].end) + book.chapters[currentChapterPosition-1].progress) < progress){
							continue;
						}else{
							book.goto(chapterPages[i].start);
							break;
						}
					};
				}
			}
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
			var startRange = cfi.generateRangeFromCfi(initialCfi, book.renderer.render.document);
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
				var currentProgress = book.chapters[idx].progress + textLength;
				var percentage = (currentProgress * 100) / book.total;
				progressBar.style.display = 'block';
				progressValue.innerText = `${percentage.toFixed(2)}%`;
				progressStatus.style.width = `${percentage.toFixed(2)}%`;
				$progressSlider.css('left', `${percentage.toFixed(2)}%`);
			}
		}
	}
};