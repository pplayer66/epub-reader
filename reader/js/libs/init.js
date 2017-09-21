document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		EPUBJS.filePath = "js/libs/";
		EPUBJS.cssPath = "css/";
		window.reader = ePubReader("troi.epub");
		var book = window.reader.book;
		var progressStatus = document.getElementById('progress-status');
		var progressBar = document.getElementById('progress');
		var progressValue = document.getElementById('progress-value');
		book.pageListReady.then(function(pageList){
			progressBar.style.display = 'block';
		});
		book.on('book:pageChanged', function(location){
			var percentStatus = (location.percentage*100).toFixed(1);
			if (+percentStatus >= 99.5)
				percentStatus = '100';
			progressStatus.style.width = `${percentStatus}%`;
			progressValue.textContent = `${percentStatus}%`;
		});
	}
};