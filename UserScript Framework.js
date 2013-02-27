if (typeof GM_addStyle === 'undefined') {
	GM_addStyle = function (css) {
		var head = document.getElementsByTagName('head')[0],
			style = document.createElement('style');
		if (!head) {
			return
		}
		style.type = 'text/css';
		try {
			style.innerHTML = css
		} catch (x) {
			style.innerText = css
		}
		head.appendChild(style);
	};
};