document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		EPUBJS.filePath = "js/libs/";
		EPUBJS.cssPath = "css/";
		window.reader = ePubReader("troi.epub");
		var book = window.reader.book;
		var progressStatus = document.getElementById('progress-status');
		var progressBar = document.getElementById('progress');
		var progressValue = document.getElementById('progress-value');
		var total = 347451;
		// setInterval(function(){
		// 	book.nextPage()
		// }, 1500);
		progressBar.onclick = function(){
			book.nextPage();
		}
   //     book.on('renderer:locationChanged', function(location){
			// console.log(book.getCurrentLocationCfi());
   //     });
		book.on("renderer:visibleRangeChanged", function(cfirange) {
			var text = '';
			var cfi = new EPUBJS.EpubCFI();
			var startRange = cfi.generateRangeFromCfi(cfirange.start, book.renderer.render.document);
			var endRange = cfi.generateRangeFromCfi(cfirange.end, book.renderer.render.document);
			// Create a new range to handle full cfi range (this should be fixed in v0.3)
			var fullRange = document.createRange();
			if (startRange) {
			fullRange.setStart(startRange.startContainer, startRange.startOffset);
			}
			if (endRange) {
			fullRange.setEnd(endRange.startContainer, endRange.startOffset);
			}
			// text = fullRange.toString();
			// textLength = (text.trim()).length;
			// console.log(textLength);
			// total = total + textLength;
			var currentLocation = book.getCurrentLocationCfi();
			var percentage = (+(window.localStorage.getItem(currentLocation)) *100) / total;

			// window.localStorage.setItem(currentLocation, total);
			console.log(percentage);
			progressBar.style.display = 'block';
			progressStatus.style.width = `${percentage.toFixed(2)}%`;
		});
	}
};