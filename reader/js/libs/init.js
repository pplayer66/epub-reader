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
		var triggerNextPage = function(t)
		{
			setTimeout(function(){
				book.nextPage();
			}, t)
		}
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
			$.ajax({
				url: `/book/addpage?title=${title}&cfi=${currentLocation}&progress=${currentTotal}`,
				type: 'GET',
				success: function(data){
					console.log('returned data', data);
					triggerNextPage(1500);
				},
				error: function(err){console.log(err)}
			});
		};

		var fetchDataCfi = function()
		{
			$.ajax(
			{
				url: `/book/pages`,
				type: 'GET',
				success: function(data){
					var total = data[data.length-1].progress;
					console.log(total);
					book.pages = _.keyBy(data, 'cfi');
					book.on("renderer:visibleRangeChanged", function(cfirange){
						var currentLocation = book.getCurrentLocationCfi();
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
					url: `/book/addbook?title=${title}&total=${total}`,
					type: 'GET',
					success: function(data){
						console.log('saved book', data)
					},
					error: function(err){
						console.log(err);
					}
				})
		};
	}
};