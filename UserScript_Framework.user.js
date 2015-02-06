// ==UserScript==
// @name		UserScript Framework
// @namespace	bluelovers
// @author		bluelovers
//
// downloadURL	https://github.com/bluelovers/UserScript-Framework/raw/develop/UserScript_Framework.user.js?KU201
// updateURL	https://github.com/bluelovers/UserScript-Framework/raw/develop/UserScript_Framework.user.js?KU201
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
// Tampermonkey
//
// @grant		GM_download
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
	//"use strict";

	const __TEST__ = true;

	const __GM_STORAGE_PREFIX = ['', GM_info.script.namespace, GM_info.script.name, ''].join('***');

	const LF = "\n";

	__TEST__ && console.log([this, __GM_STORAGE_PREFIX]);

	/*
	var userScriptFramework = userScriptFramework || { options: {}, };

	userScriptFramework.options.test = {a: 123};
	userScriptFramework.options.fn_clone = {a: 456};
	*/

(function(Sandbox, unsafeWindow, $, undefined){

	if (Sandbox.userScriptFramework && Sandbox.userScriptFramework.isReady)
	{
		return Sandbox.userScriptFramework;
	}

	var UF = userScriptFramework = Sandbox.userScriptFramework || {};
	var ufClasses;

	function _fn_env()
	{
		_fn_hack.call(Sandbox);

		Sandbox.unsafeWindow = unsafeWindow;
		Sandbox.window = window;

		Sandbox.jQuery = $;
		UF = userScriptFramework = Sandbox.UF = Sandbox.userScriptFramework = Sandbox.userScriptFramework || {};

		//Sandbox.a = function(){return 11111;};
	};

	function _fn_init()
	{
		_fn_gm();

		UF = userScriptFramework = Sandbox.UF = Sandbox.userScriptFramework = new userScriptFrameworkClass();

		unsafeWindow.userScriptFramework = Sandbox.userScriptFramework;
		unsafeWindow.Sandbox = Sandbox;

		_fn_done.call(Sandbox);

		//console.log([99, Sandbox.userScriptFramework, Sandbox.userScriptFramework.fn]);

		//Sandbox.userScriptFramework.log(Sandbox.userScriptFramework, Sandbox.userScriptFramework.fn);
	};

	function _fn_jquery()
	{
		if ($)
		{
			UF.fn.extend = extend = $.extend || extend;
			UF.fn.isPlainObject = isPlainObject = $.isPlainObject || isPlainObject;
			UF.fn.isArray = isArray = $.isArray || isArray;

			if (UF.fn.download.isUndefined)
			{
				UF.fn.download = function(url, name)
				{
					var details = {};

					if (isPlainObject(url))
					{
						details = url;

						url = details.url;
						name = details.name;
					}
					else
					{
						details.url = url;
						details.name = name;
					}

					var options = extend({}, {

						xhr: UF.xhr,

						data: details.params,

						error: details.onerror,

						xhrFields: {
							responseType: 'blob',
							withCredentials: true,
						},

//						responseType: 'blob',
//						responseType:'arraybuffer',

//						processData: false,

//						crossDomain: true,

//						async: true,

					}, details.options, {
						type: details.type || 'GET' || 'POST',
						url: details.url,

						headers: extend({

							referer: window.location.href,

							'Cookie' : document.cookie,

						}, details.headers),

						success: function(response, status, xhr)
						{

							try
							{

							// check for a filename
							var filename = '';
							var disposition = xhr.getResponseHeader('Content-Disposition');
							if (disposition && disposition.indexOf('attachment') !== -1)
							{
								var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
								var matches = filenameRegex.exec(disposition);
								if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
							}

							filename = filename || details.name;

							var type = xhr.getResponseHeader('Content-Type');
							var blob = new Blob([response],
							{
								type: type
							});

							var URL, downloadUrl, a;

							if (typeof window.navigator.msSaveBlob !== 'undefined')
							{
								// IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
								window.navigator.msSaveBlob(blob, filename);
							}
							else
							{
								URL = window.URL || window.webkitURL;
								downloadUrl = URL.createObjectURL(blob);

								if (filename)
								{
									// use HTML5 a[download] attribute to specify filename
									a = document.createElement("a");
									// safari doesn't support this yet
									if (typeof a.download === 'undefined')
									{
										window.location = downloadUrl;
									}
									else
									{
										a.href = downloadUrl;
										a.download = filename;
										document.body.appendChild(a);
										a.click();
									}
								}
								else
								{
									window.location = downloadUrl;
								}

								setTimeout(function()
								{
									URL.revokeObjectURL(downloadUrl);
								}, 100); // cleanup
							}

							UF.log('UF.fn.download.success', [response, status, xhr], filename, disposition, type, blob, [URL, downloadUrl], a);

							}
							catch(e)
							{
								UF.log('UF.fn.download.success', [response, status, xhr], e);
							}
						},
					});

					var _ajax = $.ajax(options);

					if (details.onload)
					{
						_ajax.done(details.onload);
					}

					UF.log('UF.fn.download', options, _ajax);

					return _ajax;
				};
			}
		}

		//Sandbox.userScriptFramework.log(jQuery);
	};

	function userScriptFrameworkClass()
	{
		if (userScriptFrameworkClass.prototype.isReady)
		{
			return;
		}

		extend(userScriptFrameworkClass, Sandbox.userScriptFramework, {});

		userScriptFrameworkClass.fn = userScriptFrameworkClass.prototype.fn = extend(userScriptFrameworkClass.prototype, Sandbox.GM, Sandbox.userScriptFramework.fn || Sandbox.UF.fn, {

			isReady: true,

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

			isArray: isArray,

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

			getResourceClasses: function(resourceName, defaultValue)
			{
				return this.fn.classes[resourceName] || (defaultValue ? this.fn.classes[defaultValue] : undefined);
			},

			doneEvent: function (event, mode)
			{
				event.stopPropagation();
				if (!mode) event.preventDefault();
			},

			logTest: function ()
			{
				if (__TEST__)
				{
					this.log.apply(this, arguments);
				}
			},

		});

		userScriptFrameworkClass.fn.utils = extend(userScriptFrameworkClass.fn.utils, {

			_parseDomOption: function(data, source)
			{
				var options = {};

				var target = document.getElementsByTagName('head')[0] || document.documentElement;

				if (data !== undefined)
				{
					if (this.isPlainObject(data))
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
						this.tryCatch(function(){

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

				options = extend(options, {
					target: target,
					source: source,
				});

				return options;
			},

		});

		userScriptFrameworkClass.fn.utils.__proto__ = userScriptFrameworkClass.fn;

		ufClasses = userScriptFrameworkClass.fn.classes = extend(userScriptFrameworkClass.fn.classes, {

			//XMLHttpRequestClass: XMLHttpRequestClass,

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

		this.options = extend(true, this.options, {

			fn_overwrite: {

				addStyle: true,
				log: true,

			},

			fn_clone: {

				//

			},

			ajax: {

				xhrClass: null,

			},

		}, Sandbox.userScriptFramework.options);

//		this.fn.utils.__proto__.constructor = this;

		//console.log([this, this.fn, userScriptFramework, userScriptFramework.fn]);

		return this;
	};

	function _fn_classes()
	{
		function XMLHttpRequestClass(options)
		{
			const UNSENT = 0;
			const OPENED = 1;
			const HEADERS_RECEIVED = 2;
			const LOADING = 3;
			const DONE = 4;

			return new XMLHttpRequestClass.prototype.createNew(options);
		};

		/**
		 * http://ryangreenberg.com/archives/2010/03/greasemonkey_jquery.php
		 * https://gist.github.com/Acorn-zz/1060206
		 **/

		extend(XMLHttpRequestClass.prototype, ufClasses['Object'].prototype,
		{
			isReady: true,

			_xhr: null,
			_xhr_events: ['load', 'error', 'readystatechange', 'abort', 'progress', 'timeout'],

			status: null,
			statusText: null,

			//data: null,
			//context: null,

			readyState: XMLHttpRequestClass.UNSENT,

			finalUrl: null,

			response: null,
			responseHeaders: null,
			responseText: null,
			responseXML: null,
			responseURL: null,

			lengthComputable: null,
			loaded: null,
			total: null,

			createNew: function(options)
			{
				extend(this,
				{

					type: null,
					url: null,
					async: null,
					username: null,
					password: null,

					headers:
					{},

				}, options);

				return this;
			},

			open: function(type, url, async, username, password)
			{
				this.type = type ? type : null;
				this.url = url ? url : null;
				this.async = async ? async : null;
				this.username = username ? username : null;
				this.password = password ? password : null;
				this.readyState = XMLHttpRequestClass.OPENED;

				return this;
			},

			setRequestHeader: function(name, value)
			{
				//UF.log('setRequestHeader', this, name, value);

				if (isPlainObject(name))
				{
					var k;
					for (k in name)
					{
						this.setRequestHeader(k, name[k]);
					}
				}
				else
				{
					var o = this._handleRequestHeader(name, value);

					//UF.log('setRequestHeader 2', this, o);

					if (isPlainObject(o.name))
					{
						this.setRequestHeader(o.name, o.value);
					}
					else
					{
						this.headers[o.name] = o.value;
					}
				}
				return this;
			},

			_handleRequestHeader: function(name, value)
			{
				switch (name)
				{
					case 'referer':
						name = {
							'X-Alt-Referer': value,
							'Referer': value,
						};
						break;
					case 'charset':
						name = 'Accept-Charset';
						break;
					case 'encoding':
						name = 'Accept-Encoding';
						break;
					case 'cors':
						name = {
							'Access-Control-Allow-Origin': value,
							'Origin': value,
						};
						break;
				}

				//UF.log('_handleRequestHeader', this, name, value);

				return {
					name: name,
					value: value,
				};
			},

			abort: function()
			{
				this.readyState = XMLHttpRequestClass.UNSENT;

				if (this._xhr && this._xhr.abort) this._xhr.abort();

				return this;
			},

			getAllResponseHeaders: function(name)
			{
				if (this.readyState != XMLHttpRequestClass.DONE) return '';
				return this.responseHeaders;
			},

			getResponseHeader: function(name)
			{
//				return this.headers[name];

				var regexp = new RegExp('^' + name + ': (.*)$', 'im');
				var match = regexp.exec(this.responseHeaders);
				if (match)
				{
					return match[1];
				}
				return '';
			},

			getOptions: function()
			{
				return this.getOwnPropertys(true);
			},

			clone: function()
			{
				return new this.constructor(this.getOptions());
			},

			_trigger: function(event_name, args)
			{
				var callback = this['on' + event_name];

				UF.logTest('_trigger', this, callback, arguments);

				if (typeof callback === 'function')
				{
					return callback.apply(this, args);
				}
			},

			_createCallback: function(that, event_name)
			{
				return function(rsp)
				{
					// Populate wrapper object with returned data
					for (k in rsp)
					{
						that[k] = rsp[k];
					}

//					UF.log('_createCallback', that, event_name, arguments);

					that._trigger.call(that, event_name, arguments);
				};
			},

			send: function(data)
			{
				this.data = data;
				var that = this;

				var options = this.getOwnPropertys(true);

				options['method'] = this.type;

				var i, event_name;

				for (i in this._xhr_events)
				{
					event_name = this._xhr_events[i];

					options['on' + event_name] = this._createCallback(that, event_name);
				}

				this._xhr = UF.xmlhttpRequest(options);

				UF.logTest(this, this.getOwnPropertys(true), options);

				return this;
			},

		});

		XMLHttpRequestClass.prototype.createNew.prototype = XMLHttpRequestClass.prototype;

		ufClasses['XMLHttpRequestClass'] = XMLHttpRequestClass;

	};

	function _fn_done()
	{
		try
		{
			var _defineProperties = [];

			_defineProperties[0] = {

				info: {
					writable: false,
					enumerable: false,
					configurable: false,
				},

			};

			Object.defineProperties(Sandbox.GM, extend({}, _defineProperties[0], {}));
			Object.defineProperties(userScriptFrameworkClass.fn, extend({}, _defineProperties[0], {

				xhr: {

					get: function()
					{
						var xhr = ufClasses[(this.options.ajax.xhrClass || 'XMLHttpRequestClass')];

						return xhr;
					},

					set: function(val)
					{

					},

				},

			}));
		}
		catch(e)
		{
			console.log([e]);
		}

		var name;

		//console.log([Sandbox, userScriptFramework, userScriptFramework.fn]);

		for (name in Sandbox.GM)
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
			deep = false,
			i = 1;

		if (length == 1)
		{
			return extend($, target);
		}

		if (typeof target === "boolean")
		{
			deep = target;

			// skip the boolean and the target
			target = arguments[i] ||
			{};
			i++;
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

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy))))
					{
						if (copyIsArray)
						{
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						}
						else
						{
							clone = src && isPlainObject(src) ? src :
							{};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

						// Don't bring in undefined values
					}
					else if (copy !== undefined)
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

	var isArray = ($ && $.isArray) ? $.isArray : (function(source)
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
	});

	function _fn_gm()
	{
		// https://greasyfork.org/zh-TW/scripts/6414-grant-none-shim/code

		Sandbox.GM = new Object;

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

		extend(Sandbox.GM,
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

			download: ((typeof GM_download === 'function') ? GM_download : throwNewErrorFn('download')),

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

	function _fn_hack()
	{
		ufClasses = userScriptFrameworkClass.prototype.classes = extend(userScriptFrameworkClass.prototype.classes,
		{

			'Object': extend(true, function() {},
			{
				prototype:
				{
					getOwnPropertys: function(mode)
					{
						var name;
						var options = {};

						var _proto = this.prototype || this.__proto__;

						mode = !mode;

						for (name in this)
						{
							if (this.hasOwnProperty(name) && (mode || !(name in _proto)))
							{
								options[name] = this[name];
							}
						}

						return options;
					},
				},
			}),

			/*
			'Function': extend(true, function() {},
			{
				prototype:
				{
					// http://upshots.org/javascript/jquery-test-if-element-is-in-viewport-visible-on-screen
					debounce: function(threshold)
					{
						var callback = this;
						var timeout;
						return function()
						{
							var context = this,
								params = arguments;
							clearTimeout(timeout);
							timeout = setTimeout(function()
							{
								callback.apply(context, params);
							}, threshold);
						};
					},

					// http://stackoverflow.com/questions/1833588/javascript-clone-a-function
					clone: function()
					{
						var that = this;
						var temp = function temporary()
						{
							return that.apply(this, arguments);
						};
						for (var key in this)
						{
							if (this.hasOwnProperty(key))
							{
								temp[key] = this[key];
							}
						}
						return temp;
					},
				},
			}),
			*/

		});

		_fn_classes();
	};

	_fn_env.call(Sandbox);
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

				UF.logTest([script, script.src, script.readyState]);
			}
		})();
	}
	else
	{
		_fn_jquery.call(Sandbox);
	}

	_fn_done.call(Sandbox);

})(Sandbox = typeof Sandbox === 'undefined' ? this : Sandbox, Sandbox.unsafeWindow = Sandbox.unsafeWindow || (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window), Sandbox.jQuery = Sandbox.jQuery || (typeof jQuery !== 'undefined' ? jQuery : void(0)));

	if (__TEST__)
	{

		console.log([Sandbox, Sandbox.jQuery, Sandbox.UF, Sandbox.GM]);

	//	console.log([Sandbox.UF.fn.utils._parseDomOption({a: 1})]);

		console.log([a = Sandbox.UF.xhr(), a.getOwnPropertys(true), a.send(false), a.getOwnPropertys(true), ('data' in a.__proto__), a.clone()]);

		console.log([a.setRequestHeader('referer', 'http://share.dmhy.org/topics/view/382287_1_A_Tokyo_Ghoul_A_05_BIG5_MP4_720P.html')]);

//		console.log([a()]);

//		console.log([GM_xmlhttpRequest({
//			method: "GET",
//			url: "http://www.example.com/",
//			onload: function(response) {
//				//alert(response.responseText);
//			}
//		})]);

		0 && jQuery(function(){

			var _fn = function(event){
				UF.doneEvent(event);

				UF.log(event, this);

				var _this = jQuery(this);

				var ret = UF.download({
					url: _this.attr('href'),
					name: _this.attr('download'),
					onload: function(){
						UF.log('done.onload', this, ret, arguments);
					},
				});

				ret
					.done(function(){
						UF.log('done', this, ret, arguments);
					});
				;

				jQuery(document).add('.a_torrent').off('click.download');

				UF.log('download', ret);
			};

			jQuery(document)
				.on('click.download', '.a_torrent', _fn)
				.on('click.download', function(event){
					UF.log(event, this);
				})
			;

			jQuery('.a_torrent')
				.on('click.download', _fn)
			;

			UF.log(jQuery('.a_torrent'));

		});

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

}
catch(e)
{
	console.log(['userScriptFramework', e, e.message, e.columnNumber, e.lineNumber, e.fileName, e.stack]);
}

;