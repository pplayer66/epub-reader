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
		var currentTotal = 0;


		// $(window).resize(function(){
		// 	console.log($(window).width());
		// });

		book.on('renderer:chapterDisplayed', function() {
			$('.overlay').show();
			setTimeout(function(){
				$('.overlay').hide();
			}, 400);
			EPUBJS.core.addCss('/css/styles.css', null, book.renderer.doc.head);
		});

		var triggerNextPage = function(t)
		{
			setTimeout(function(){
				book.nextPage();
			}, t)
		};

		var sendDataCfi = function(cfirange)
		{
			var text = '';
			var cfi = new EPUBJS.EpubCFI();
			var startRange = cfi.generateRangeFromCfi(cfirange.start, book.renderer.render.document);
			var endRange = cfi.generateRangeFromCfi(cfirange.end, book.renderer.render.document);
			// Create a new range to handle full cfi range (this should be fixed in v0.3)
			var fullRange = document.createRange();
			if (startRange)
				fullRange.setStart(startRange.startContainer, startRange.startOffset);
			if (endRange)
				fullRange.setEnd(endRange.startContainer, endRange.startOffset);
			text = fullRange.toString();
			textLength = (text.trim()).length;
			currentTotal = currentTotal + textLength;
			var currentLocation = book.getCurrentLocationCfi();
			var size = getDocumentWidth();
			$.ajax({
				url: `/book/addpage?title=${title}&cfi=${currentLocation}&progress=${currentTotal}&size=${size}`,
				type: 'GET',
				success: function(data){
					console.log('returned data', data);
					triggerNextPage(1200);
				},
				error: function(err){console.log(err)}
			});
		};

		var getDocumentWidth = function(){
			var currentWidth = $(document).width();
			var width;
			if (currentWidth >= 1900)
				width='min1900';
			else if (currentWidth >= 1700)
				width='min1700';
			else if (currentWidth >= 1500)
				width='min1500';
			else if (currentWidth >= 1300)
				width='min1300';
			else if (currentWidth >= 950)
				width='min950';
			else if (currentWidth >= 750)
				width='min750';
			else if (currentWidth >= 600)
				width='min600';
			else if (currentWidth >= 480)
				width='min480';
			else if (currentWidth < 480)
				width='max479';
			return width;
		};

		var getLocation = function(){
			return book.getCurrentLocationCfi();
		}

		var currentSize = getDocumentWidth();

		var addWindowResizeListener = function(){
			$(window).resize(function(e){
				var windowSize = getDocumentWidth();
				if (windowSize===currentSize)
					return;
				$(window).off('resize');
				currentSize = windowSize;
				console.log(currentSize);
				fetchDataCfi();
				setTimeout(function(){
					addWindowResizeListener();
				}, 1500);
			});
		};

		var fetchDataCfi = function()
		{
			var size = getDocumentWidth();

			$.ajax(
			{
				url: `/book/pages?title=${title}&size=${size}`,
				type: 'GET',
				success: function(data){
					console.log(data);
					var total = data[data.length-1].progress;
					console.log(total);
					book.pages = _.keyBy(data, 'cfi');
					book.on("renderer:visibleRangeChanged", function(cfirange){
						var curloc = book.getCurrentLocationCfi();
						if (!book.pages[curloc]){
							return;
						}
						var currentLocation = getLocation();
						var currentProgress = book.pages[currentLocation].progress;
						var percentage = (currentProgress * 100) / total;
						progressBar.style.display = 'block';
						progressValue.innerText = `${percentage.toFixed(2)}%`;
						progressStatus.style.width = `${percentage.toFixed(2)}%`;
					});
				},
				error: function(err){console.log(err)}
			})
		};

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

		// book.on('renderer:visibleRangeChanged', sendDataCfi);
		addWindowResizeListener();
		fetchDataCfi();
		// addBook();
	}
};