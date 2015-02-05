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
// grant		none
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
// @noframes
//
// require		http://code.jquery.com/jquery-latest.js?KU201
//
// @resource	jquery http://code.jquery.com/jquery-latest.js?KU201
// @resource	jMod https://github.com/jgjake2/myUserJS-API/raw/master/jMod/current/jMod.full.js?KU201
//
//
// ==/UserScript==
try
{

	const __GM_STORAGE_PREFIX = ['', GM_info.script.namespace, GM_info.script.name, ''].join('***');

	const LF = "\n";

(function(Sandbox, unsafeWindow, $, undefined){

	if (Sandbox.userScriptFramework)
	{
		return Sandbox.userScriptFramework;
	}

	var UF, userScriptFramework;

	var _fn_env = function()
	{
		Sandbox.unsafeWindow = unsafeWindow;
		Sandbox.window = window;

		Sandbox.jQuery = $;
		UF = userScriptFramework = Sandbox.UF = Sandbox.userScriptFramework = Sandbox.userScriptFramework || {};

		//Sandbox.a = function(){return 11111;};
	};

	_fn_env.call(Sandbox);

	var _fn_init = function()
	{
		_fn_gm();

		UF = userScriptFramework = Sandbox.UF = Sandbox.userScriptFramework = new userScriptFrameworkClass();

		unsafeWindow.userScriptFramework = Sandbox.userScriptFramework;
		unsafeWindow.Sandbox = Sandbox;

		_fn_done.call(Sandbox);

		//console.log([99, Sandbox.userScriptFramework, Sandbox.userScriptFramework.fn]);

		//Sandbox.userScriptFramework.log(Sandbox.userScriptFramework, Sandbox.userScriptFramework.fn);
	};

	var _fn_jquery = function()
	{
		if ($)
		{
			UF.fn.extend = extend = $.extend || extend;
			UF.fn.isPlainObject = isPlainObject = $.isPlainObject || isPlainObject;
		}

		//Sandbox.userScriptFramework.log(jQuery);
	};

	var userScriptFrameworkClass = function()
	{
		extend(userScriptFrameworkClass, Sandbox.userScriptFramework, {});

		userScriptFrameworkClass.fn = userScriptFrameworkClass.prototype.fn = extend(userScriptFrameworkClass.prototype, Sandbox.GM.prototype, Sandbox.userScriptFramework.fn || Sandbox.UF.fn, {

			_cache_: {
				fn_overwrite: {},
				fn_old: {},
				fn_clone: {},
			},

			_parent_: Sandbox.GM,

			isTampermonkey: function()
			{
				if (!GM_info)
				{
					return null;
				}

				// http://tampermonkey.net/documentation.php#GM_info
				if (GM_info.scriptHandler === 'scriptHandler' && typeof GM_addValueChangeListener === 'function' && typeof GM_download === 'function')
				{
					return true;
				}

				return false;
			},

			addStyle: function(source, target)
			{
				var options = this.utils._parseDomOption(target);
				var target = options.target;

				if (!target)
				{
					return;
				}

				if (this.isArray(source))
				{
					source = source.join(LF);
				}

				return this._parent_.addStyle.call(this, source, target);
			},

			addScript: function(source, target)
			{
				var options = this.utils._parseDomOption(target);
				var target = options.target;

				if (!target)
				{
					return;
				}

				var elem = document.createElement('script');
				elem.type = 'text/javascript';

				//elem.async = true;

				if (options.success)
				{
					elem.onreadystatechange = elem.onload = options.success;

					elem.addEventListener('load', options.success, false);
					elem.addEventListener('readystatechange', options.success, false);
				}

				if (typeof source !== 'string')
				{
					extend(elem, options, source);
				}
				else if (0)
				{
					elem.async = false;
					elem.defer = false;

					elem.text = source;
				}
				else
				{
					elem.src = source;
				}

				target.appendChild(elem);

				return elem;
			},

			isArray: ($ && $.isArray) ? $.isArray : (function(source)
			{
				if ($ && $.isArray)
				{
					return $.isArray(source);
				}
				else if (Array.isArray)
				{
					return Array.isArray(source);
				}

				return Object.prototype.toString.call(source) === '[object Array]';
			}),

			tryCatch: function(_try, _catch)
			{
				try
				{
					return _try();
				}
				catch(e)
				{
					(_catch || this.log)(e);

					return false;
				}
			},

			extend: extend,

			isPlainObject: isPlainObject,

			/**
				Usage:
				 	$.ajax(
				 	{
				 		url: '/p/',
				 		xhr: function()
				 		{
				 			return userScriptFramework.xhr();
				 		},
				 		type: 'POST',
				 		success: function(val) {

				 		}
				 	});
			 **/
			xhrJQuery: function(options)
			{
				var xhr = new this.fn.classes.xmlhttpRequestJQueryClass();

				if (options)
				{
					extend(xhr, options);
				}

				return xhr;
			},

		});

		userScriptFrameworkClass.fn.utils = extend(userScriptFrameworkClass.fn.utils, {

			_parseDomOption: function(data)
			{
				var options = {};

				var target = document.getElementsByTagName('head')[0] || document.documentElement;

				if (data !== undefined)
				{
					if (isPlainObject(data))
					{
						extend(options, data);

						target = data.target || target;
					}
					else
					{
						target = data || target;
					}

					if (target == -1)
					{
						UF.tryCatch(function(){

							target = $('style, link[rel="stylesheet"], link[type="text/css"]').eq(-1).parents('head, body').eq(-1)[0];

						}, function(e){
							var _dom = document.querySelectorAll('style, link[rel="stylesheet"], link[type="text/css"]');

							if (_dom.length)
							{
								target = _dom[_dom.length - 1].parentNode || target;
							}
						});
					}
				}

				options.target = target;

//				console.log([data, options]);

				return options;
			},

		});

		userScriptFrameworkClass.fn.classes = extend(userScriptFrameworkClass.fn.classes, {

			xmlhttpRequestJQueryClass: GM_xmlhttpRequestJQueryClass,

		});

		Sandbox.UF.prototype = Sandbox.userScriptFramework.prototype = userScriptFrameworkClass.fn;

		userScriptFrameworkClass.fn.metadata = userScriptFrameworkClass.fn.info.script;

		(function(_fn)
		{

			userScriptFrameworkClass.fn.getResourceURL = function(resourceName, skipError)
			{
				if (undefined === this._getResource(resourceName))
				{
					if (!skipError)
					{
						throw new ReferenceError('getResourceURL: resource "' + resourceName + '" does not exist.');
					}

					return;
				}

				return _fn.apply(this, arguments);
			};

		})(userScriptFrameworkClass.fn.getResourceURL);

		(function(_fn)
		{

			userScriptFrameworkClass.fn.getResourceText = function(resourceName, skipError)
			{
				if (undefined === this._getResource(resourceName))
				{
					if (!skipError)
					{
						throw new ReferenceError('getResourceText: resource "' + resourceName + '" does not exist.');
					}

					return;
				}

				return _fn.apply(this, arguments);
			};

		})(userScriptFrameworkClass.fn.getResourceText);

		extend(this, {

			options: {

				fn_overwrite: {

					addStyle: true,
					log: true,

				},

				fn_clone: {

					//

				},

			},

		});

		this.fn.utils.constructor = this;

		//console.log([this, this.fn, userScriptFramework, userScriptFramework.fn]);

		return this;
	};

	function GM_xmlhttpRequestJQueryClass()
	{
		this.type = null;
		this.url = null;
		this.async = null;
		this.username = null;
		this.password = null;
		this.status = null;
		this.headers = {};
		this.readyState = null;

		this.prototype.open = function(type, url, async, username, password)
		{
			this.type = type ? type : null;
			this.url = url ? url : null;
			this.async = async ? async : null;
			this.username = username ? username : null;
			this.password = password ? password : null;
			this.readyState = 1;
		};

		this.prototype.setRequestHeader = function(name, value)
		{
			this.headers[name] = value;
		};

		this.prototype.abort = function()
		{
			this.readyState = 0;
		};

		this.prototype.getResponseHeader = function(name)
		{
			return this.headers[name];
		};

		this.prototype.send = function(data)
		{
			this.data = data;
			var that = this;

			UF.xmlhttpRequest(
			{
				method: this.type,
				url: this.url,
				headers: this.headers,
				data: this.data,
				onload: function(rsp)
				{
					// Populate wrapper object with returned data
					for (k in rsp)
					{
						that[k] = rsp[k];
					}
				},
				onerror: function(rsp)
				{
					for (k in rsp)
					{
						that[k] = rsp[k];
					}
				},
				onreadystatechange: function(rsp)
				{
					for (k in rsp)
					{
						that[k] = rsp[k];
					}
				}
			});
		};
	};

	var _fn_done = function()
	{
		var name;

		//console.log([Sandbox, userScriptFramework, userScriptFramework.fn]);

		for (name in Sandbox.GM.prototype)
		{
			if (name != 'fn')
			{
				var _fn = undefined, _fn_new = undefined, _fn_name = 'GM_' + name;

				if (UF._cache_.fn_overwrite[_fn_name] !== undefined)
				{
					continue;
				}

				eval('var _fn = typeof ' + _fn_name + ' === "undefined" ? undefined : ' + _fn_name + ';');

				if (typeof _fn !== 'undefined')
				{
					UF._cache_.fn_old[_fn_name] = _fn;
				}

				if (name.substr(0, 1) === '_' || UF.options.fn_overwrite[name] === false)
				{
					UF._cache_.fn_overwrite[_fn_name] = false;

					continue;
				}

				if (typeof UF[name] === 'function')
				{
					if (typeof _fn === 'undefined' || UF.options.fn_overwrite[name] === true)
					{
						_fn_new = UF[name];
					}

					if (_fn_new && _fn_new !== _fn)
					{
						Sandbox[_fn_name] = UF._cache_.fn_overwrite[_fn_name] = _fn_new;
					}
					else
					{
						UF._cache_.fn_overwrite[_fn_name] = false;
					}
				}

				//userScriptFramework.log(name, _fn_name, _fn, _fn_new);
			}
		}

		for (name in UF.options.fn_clone)
		{
			if (UF._cache_.fn_clone[name] !== undefined)
			{
				continue;
			}

			var _fn = undefined, _fn_new = undefined, _fn_name = '';
			var data = UF.options.fn_clone[name];

			if (!data || ((data instanceof Array) && data[1] === false))
			{
				continue;
			}

			if (typeof data === 'string')
			{
				_fn_name = UF.options.fn_clone[name];

				eval('var _fn = typeof ' + _fn_name + ' === "undefined" ? undefined : ' + _fn_name + ';');
			}
			else if (data instanceof Array)
			{
				_fn_name = data[0];
				eval('var _fn_new = typeof ' + _fn_name + ' === "undefined" ? undefined : ' + _fn_name + ';');

				_fn = (typeof _fn_new === 'undefined') ? data[1] : _fn_new;
			}

			//console.log([name, data, _fn, _fn_new, _fn_name, typeof data, data instanceof Array]);

			if (typeof _fn === 'function')
			{
				UF._cache_.fn_clone[name] = UF.fn[name] = _fn;
			}
			else
			{
				UF._cache_.fn_clone[name] = false;
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

	var isPlainObject = ($ && $.isPlainObject) ? $.isPlainObject : (function(obj)
	{
		if (!obj || typeof obj !== 'object' || obj.nodeType || obj == window)
		{
			return false;
		}

		return true;
	});

	var _fn_gm = function()
	{
		// https://greasyfork.org/zh-TW/scripts/6414-grant-none-shim/code

		Sandbox.GM = {};

		var __setupRequestEvent = function (aOpts, aReq, aEventName)
		{
			if (!aOpts['on' + aEventName]) return;

			aReq.addEventListener(aEventName, function(aEvent)
			{
				var responseState = {
					responseText: aReq.responseText,
					responseXML: aReq.responseXML,
					readyState: aReq.readyState,
					responseHeaders: null,
					status: null,
					statusText: null,
					finalUrl: null
				};
				switch (aEventName)
				{
					case "progress":
						responseState.lengthComputable = aEvent.lengthComputable;
						responseState.loaded = aEvent.loaded;
						responseState.total = aEvent.total;
						break;
					case "error":
						break;
					default:
						if (4 != aReq.readyState) break;
						responseState.responseHeaders = aReq.getAllResponseHeaders();
						responseState.status = aReq.status;
						responseState.statusText = aReq.statusText;
						break;
				}
				aOpts['on' + aEventName](responseState);
			});
		};

		Sandbox.GM.prototype = extend(Sandbox.GM,
		{

			__GM_STORAGE_PREFIX: __GM_STORAGE_PREFIX,

			_storage_: localStorage,

			info: GM_info,

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

			_getResource: function(resourceName)
			{
				return this.info.script.resources[resourceName];
			},

			getResourceURL: ((typeof GM_getResourceURL === 'function') ? GM_getResourceURL : function(resourceName)
			{
				return 'greasemonkey-script:' + this.info.uuid + '/' + resourceName;
			}),

			deleteValue: ((typeof GM_deleteValue === 'function') ? GM_deleteValue : function(name)
			{
				this._storage_.removeItem(this.__GM_STORAGE_PREFIX + name);

				return this;
			}),

			getValue: ((typeof GM_getValue === 'function') ? GM_getValue : function(name, defaultValue)
			{
				var val = this._storage_.getItem(this.__GM_STORAGE_PREFIX + name);
				if (null === val && 'undefined' != typeof defaultValue) return defaultValue;
				return val;
			}),

			listValues: ((typeof GM_listValues === 'function') ? GM_listValues : function()
			{
				var prefixLen = this.__GM_STORAGE_PREFIX.length;
				var values = [];
				var i = 0;
				for (var i = 0; i < this._storage_.length; i++)
				{
					var k = this._storage_.key(i);
					if (k.substr(0, prefixLen) === this.__GM_STORAGE_PREFIX)
					{
						values.push(k.substr(prefixLen));
					}
				}
				return values;
			}),

			setValue: ((typeof GM_setValue === 'function') ? GM_setValue : function(name, value)
			{
				this._storage_.setItem(this.__GM_STORAGE_PREFIX + name, value);

				return this;
			}),

			getResourceText: ((typeof GM_getResourceText === 'function') ? GM_getResourceText : throwNewErrorFn('getResourceText')),

			xmlhttpRequest: ((typeof GM_xmlhttpRequest === 'function') ? GM_xmlhttpRequest : function(aOpts)
			{
				if (this.prototype.xmlhttpRequest.__setupRequestEvent === undefined)
				{
					this.prototype.xmlhttpRequest.__setupRequestEvent = __setupRequestEvent;
				}

				var req = new XMLHttpRequest();

				this.xmlhttpRequest.__setupRequestEvent.call(this, aOpts, req, 'abort');
				this.xmlhttpRequest.__setupRequestEvent.call(this, aOpts, req, 'error');
				this.xmlhttpRequest.__setupRequestEvent.call(this, aOpts, req, 'load');
				this.xmlhttpRequest.__setupRequestEvent.call(this, aOpts, req, 'progress');
				this.xmlhttpRequest.__setupRequestEvent.call(this, aOpts, req, 'readystatechange');

				req.open(aOpts.method, aOpts.url, !aOpts.synchronous,
					aOpts.user || '', aOpts.password || '');
				if (aOpts.overrideMimeType)
				{
					req.overrideMimeType(aOpts.overrideMimeType);
				}
				if (aOpts.headers)
				{
					for (var prop in aOpts.headers)
					{
						if (Object.prototype.hasOwnProperty.call(aOpts.headers, prop))
						{
							req.setRequestHeader(prop, aOpts.headers[prop]);
						}
					}
				}
				var body = aOpts.data ? aOpts.data : null;
				if (aOpts.binary)
				{
					return req.sendAsBinary(body);
				}
				else
				{
					return req.send(body);
				}
			}),

			registerMenuCommand: ((typeof GM_registerMenuCommand === 'function') ? GM_registerMenuCommand : throwNewErrorFn('registerMenuCommand')),

			setClipboard: ((typeof GM_setClipboard === 'function') ? GM_setClipboard : throwNewErrorFn('setClipboard')),

		});

	};

	function throwNewErrorFn(name)
	{
		return extend(function()
		{
			throw new ReferenceError(name + ' is not defined.');
		},
		{
			name: name,
			isUndefined: true,
		});
	};

	_fn_init.call(Sandbox);

	if (!$ || $ == ({}))
	{
		//console.log(['wait jquery']);

		(function(){
			var head, script = {}, text, src;

			var _old_jq = {
				'unsafeWindow': {
					jQuery: unsafeWindow.jQuery,
					'$': unsafeWindow.$,
				},

				/*
				'window': {
					jQuery: window.jQuery,
					'$': window.$,
				},
				*/
			};

			var _done;
			var text = '';

			var _fn = function(event){

//				console.log(this, script, event, $, window.jQuery, unsafeWindow.jQuery);

				if (_done)
				{
					return;
				}

				if (event && (event.type == 'readystatechange' || event.name == 'readystatechange'))
				{
					if (script.readyState === 'loaded' || script.readyState === 'complete')
					{

					}
					else
					{
						return;
					}
				}

				_done = true;

				$ = UF.$ = Sandbox.jQuery = (window.jQuery || unsafeWindow.jQuery).noConflict(true);

//				console.log(['jQuery', $, event]);

				var name;

				for (name in ['unsafeWindow', 'window'])
				{
					if (Sandbox[name] && Sandbox[name].jQuery === $)
					{
						Sandbox[name].jQuery = _old_jq[name].jQuery;
					}
					if (Sandbox[name] && Sandbox[name]['$'] === $)
					{
						Sandbox[name]['$'] = _old_jq[name]['$'];
					}
				}

				try
				{
					script.parentNode.removeChild(script);
				}
				catch(e)
				{}

				_fn_jquery.call(Sandbox);
			};

			try
			{
				text = GM_getResourceText('jquery');
			}
			catch(e)
			{
				//console.log(['userScriptFramework', e, e.message, e.columnNumber, e.lineNumber, e.fileName, e.stack]);
			}



			if (text)
			{
				var ret = eval(text);

				_fn();
			}
			else
			{
				script = UF.addScript({
//					async: true,
					rel: 'jquery',

					src: 'http://code.jquery.com/jquery-latest.js?KU201',
				}, {
					success: _fn,
				});

				console.log([script, script.src, script.readyState]);
			}
		})();
	}
	else
	{
		_fn_jquery.call(Sandbox);
	}

	_fn_done.call(Sandbox);

})(Sandbox = typeof Sandbox === 'undefined' ? this : Sandbox, Sandbox.unsafeWindow = Sandbox.unsafeWindow || (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window), Sandbox.jQuery = Sandbox.jQuery || (typeof jQuery !== 'undefined' ? jQuery : void(0)));

	console.log([Sandbox, Sandbox.jQuery, Sandbox.UF, Sandbox.GM]);

	console.log([Sandbox.userScriptFramework.getResourceURL, Sandbox.userScriptFramework.getResourceURL()]);

	/*
	console.log(1);

	console.log([Sandbox, Sandbox.unsafeWindow, Sandbox.window]);

	console.log([Sandbox.$, Sandbox.jQuery, Sandbox.userScriptFramework]);

	console.log(a());

	console.log(2);


	console.log(['GM_log', typeof GM_log]);
	console.log(['GM_openInTab', typeof GM_openInTab]);
	console.log(['GM_xmlhttpRequest', typeof GM_xmlhttpRequest]);

	console.log(['GM_getResourceText', typeof GM_getResourceText]);

	console.log([__GM_STORAGE_PREFIX]);
	*/

}
catch(e)
{
	console.log(['userScriptFramework', e, e.message, e.columnNumber, e.lineNumber, e.fileName, e.stack]);
}

;