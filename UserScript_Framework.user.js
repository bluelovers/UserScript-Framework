// ==UserScript==
// @name		UserScript Framework
// @namespace	bluelovers
// @author		bluelovers
//
// downloadURL
// updateURL
//
// @include		*
//
// exclude		*
//
// exclude		*.js*
// exclude		*.css*
//
// @version		1
//
// @grant		none
//
// @grant		GM_info
//
// @grant		GM_deleteValue
// @grant		GM_getValue
// @grant		GM_listValues
// @grant		GM_setValue
//
// @grant		GM_getResourceText
// @grant		GM_getResourceURL
//
// grant		GM_addStyle
// grant		GM_log
// @grant		GM_openInTab
// @grant		GM_registerMenuCommand
// @grant		GM_setClipboard
// @grant		GM_xmlhttpRequest
// @grant		unsafeWindow
//
// @run-at		document-start
//
// require	 http://code.jquery.com/jquery-latest.js?KU201
//
// ==/UserScript==

try
{

	//GM_addStyle('a { color: red; }');

	console.log(['GM_log', typeof GM_log]);
	console.log(['GM_openInTab', typeof GM_openInTab]);
	console.log(['GM_xmlhttpRequest', typeof GM_xmlhttpRequest]);
	console.log(['GM_addStyle', typeof GM_addStyle]);

	//console.log(0);

	//return;

(function(Sandbox, unsafeWindow, $, undefined){

	if (Sandbox.userScriptFramework)
	{
		return Sandbox.userScriptFramework;
	}

	var USF, userScriptFramework;

	var _fn_env = function()
	{
		Sandbox.unsafeWindow = unsafeWindow;
		Sandbox.window = window;

		Sandbox.jQuery = $;
		USF = userScriptFramework = Sandbox.USF = Sandbox.userScriptFramework = Sandbox.userScriptFramework || {};

		//Sandbox.a = function(){return 11111;};
	};

	_fn_env.call(Sandbox);

	var _fn_init = function()
	{
		_fn_gm();

		USF = userScriptFramework = Sandbox.USF = Sandbox.userScriptFramework = new userScriptFrameworkClass();

		unsafeWindow.userScriptFramework = Sandbox.userScriptFramework;
		unsafeWindow.Sandbox = Sandbox;

		//console.log([99, Sandbox.userScriptFramework, Sandbox.userScriptFramework.fn]);

		//Sandbox.userScriptFramework.log(Sandbox.userScriptFramework, Sandbox.userScriptFramework.fn);
	};

	var _fn_jquery = function()
	{
		extend = $.extend || extend;

		//Sandbox.userScriptFramework.log(jQuery);
	};

	var userScriptFrameworkClass = function()
	{
		extend(userScriptFrameworkClass, Sandbox.userScriptFramework, {});

		userScriptFrameworkClass.fn = userScriptFrameworkClass.prototype.fn = extend(userScriptFrameworkClass.prototype, Sandbox.GM.prototype, Sandbox.userScriptFramework.fn, {

			_cache_: {
				fn_overwrite: {},
				fn_old: {},
				fn_clone: {},
			},

		});

		Sandbox.userScriptFramework.prototype = userScriptFrameworkClass.fn;

		extend(this, {

			options: {

				fn_overwrite: {

					addStyle: true,

				},

				fn_clone: {

				},

			},

		});

		//console.log([this, this.fn, userScriptFramework, userScriptFramework.fn]);

		return this;
	};

	var _fn_done = function()
	{
		var name;

		console.log([Sandbox, userScriptFramework, userScriptFramework.fn]);

		for (name in userScriptFramework.fn)
		{
			if (name != 'fn')
			{
				var _fn, _fn_new, _fn_name = 'GM_' + name;

				eval('var _fn = typeof ' + _fn_name + ' === "undefined" ? undefined : ' + _fn_name + ';');

				if (typeof _fn !== 'undefined')
				{
					userScriptFramework._cache_.fn_old[_fn_name] = _fn;
				}

				if (typeof userScriptFramework[name] === 'function')
				{
					if (typeof _fn === 'undefined')
					{
						_fn_new = userScriptFramework[name];
					}

					if (_fn_new && _fn_new !== _fn)
					{
						Sandbox[_fn_name] = userScriptFramework._cache_.fn_overwrite[_fn_name] = _fn_new;
					}
				}

				//userScriptFramework.log(name, _fn_name, _fn, _fn_new);
			}
		}

		for (name in userScriptFramework.options.fn_clone)
		{
			var _fn = undefined, _fn_new, _fn_name;
			var data = userScriptFramework.options.fn_clone[name];

			if (typeof data === 'string')
			{
				_fn_name = userScriptFramework.options.fn_clone[name];

				eval('var _fn = typeof ' + _fn_name + ' === "undefined" ? undefined : ' + _fn_name + ';');
			}
			else if (data instanceof Array)
			{
				_fn_name = data[0];
				eval('var _fn_new = typeof ' + _fn_name + ' === "undefined" ? undefined : ' + _fn_name + ';');

				_fn = (typeof _fn_new === 'undefined') ? data[1] : _fn_new;
			}

			console.log([name, data, _fn, _fn_new, _fn_name, typeof data, data instanceof Array]);

			if (typeof _fn === 'function')
			{
				userScriptFramework._cache_.fn_clone[name] = userScriptFramework.fn[name] = _fn;
			}
			else
			{
				userScriptFramework._cache_.fn_clone[name] = false;
			}
		}
	};

	var extend = ($ && $.extend) ? $.extend : (function()
	{
		var src, copyIsArray, copy, name, options, clone,
			length = arguments.length,
			target = arguments[0] ||
			{},
			i = 1;

		if (length == 1)
		{
			return extend($, target);
		}

		// Handle case when target is a string or something (possible in deep copy)
		if (typeof target !== 'object' && typeof target !== 'function')
		{
			target = {};
		}

		for (; i < length; i++)
		{
			if ((options = arguments[i]) != null)
			{
				for (name in options)
				{
					src = target[name];
					copy = options[name];

					if (target === copy)
					{
						continue;
					}

					if (copy !== undefined)
					{
						target[name] = copy;
					}
				}
			}
		}

		return target;
	});

	var _fn_gm = function()
	{
		Sandbox.GM = {};

		Sandbox.GM.prototype = extend(Sandbox.GM, {

			log: function(e)
			{
				var args = Array.prototype.slice.call(arguments, 0) || [];

				if (typeof console !== 'undefined')
				{
					return console.log(args);
				}
			},

			openInTab: ((typeof GM_openInTab === 'function') ? GM_openInTab : function(url, options)
			{
				return window.open(url);
			}),

			addStyle: function(css, head)
			{
				var head = head || document.getElementsByTagName('head')[0] || document.documentElement;
				if (!head)
				{
					return;
				}

				var style = document.createElement('style');
				style.type = 'text/css';

				style.innerText = style.textContent = style.innerHTML = css;

				head.appendChild(style);

				return style;
			},

		});
	};

	_fn_init.call(Sandbox);

	if (!$ || $ == ({}))
	{
		(function(){
			var head = document.getElementsByTagName('head')[0] || document.documentElement;
			var script = document.createElement('script');

			script.type = 'text/javascript';
			script.async = true;

			script.setAttribute('rel', 'jquery');

			script.src = 'http://code.jquery.com/jquery-latest.js?KU201';

			var _old_jq = {
				'unsafeWindow': {
					jQuery: unsafeWindow.jQuery,
					'$': unsafeWindow.$,
				},

				'window': {
					jQuery: window.jQuery,
					'$': window.$,
				},
			};

			//console.log(_old_jq);

			script.addEventListener('load', function(){
				$ = Sandbox.jQuery = window.jQuery.noConflict(true);

				var name;

				for (name in ['unsafeWindow', 'window'])
				{
					if (Sandbox[name].jQuery === $)
					{
						Sandbox[name].jQuery = _old_jq[name].jQuery;
					}
					if (Sandbox[name]['$'] === $)
					{
						Sandbox[name]['$'] = _old_jq[name]['$'];
					}
				}

				head.removeChild(script);

				_fn_jquery.call(Sandbox);
			}, false);

			head.appendChild(script);
		})();
	}
	else
	{
		_fn_jquery.call(Sandbox);
	}

	_fn_done.call(Sandbox);

})(Sandbox = typeof Sandbox === 'undefined' ? this : Sandbox, Sandbox.unsafeWindow = Sandbox.unsafeWindow || (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window), Sandbox.jQuery = Sandbox.jQuery || (typeof jQuery !== 'undefined' ? jQuery : void(0)));

	/*
	console.log(1);

	console.log([Sandbox, Sandbox.unsafeWindow, Sandbox.window]);

	console.log([Sandbox.$, Sandbox.jQuery, Sandbox.userScriptFramework]);

	console.log(a());

	console.log(2);
	*/

	console.log(['GM_log', typeof GM_log]);
	console.log(['GM_openInTab', typeof GM_openInTab]);
	console.log(['GM_xmlhttpRequest ', typeof GM_xmlhttpRequest ]);

}
catch(e)
{
	return console.log(['userScriptFramework', e]);
}

;