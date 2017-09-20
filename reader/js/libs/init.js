document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		EPUBJS.filePath = "js/libs/";
		EPUBJS.cssPath = "css/";
		// EPUBJS.Hooks.register('beforeChapterDisplay').swipeDetection = function (callback, renderer) {
		// 	var script = renderer.doc.createElement('script');
		// 	script.text = "!function(a,b,c){function f(a){d=a.touches[0].clientX,e=a.touches[0].clientY}function g(f){if(d&&e){var g=f.touches[0].clientX,h=f.touches[0].clientY,i=d-g,j=e-h;Math.abs(i)>Math.abs(j)&&(i>a?b():i<0-a&&c()),d=null,e=null}}var d=null,e=null;document.addEventListener('touchstart',f,!1),document.addEventListener('touchmove',g,!1)}";
		// 	script.text += "(10,function(){parent.ePubViewer.Book.nextPage()},function(){parent.ePubViewer.Book.prevPage()});"
		// 	renderer.doc.head.appendChild(script);
		// 	if (callback) {
		// 		callback();
		// 	}
		// };
		window.reader = ePubReader("troi.epub");
	}
};