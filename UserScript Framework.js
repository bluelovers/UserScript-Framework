;

var undefined;

if (typeof GM_addStyle === 'undefined')
{
	GM_addStyle = function(css, head)
	{
		var head = head || document.getElementsByTagName('head')[0];
		if (!head)
		{
			return;
		}

		var style = document.createElement('style');
		style.type = 'text/css';

		try
		{
			style.innerHTML = css
		}
		catch (x)
		{
			style.innerText = css
		}
		head.appendChild(style);

		return style;
	};
}

if (typeof GM_openInTab === 'undefined')
{
	GM_openInTab = function(url)
	{
		window.open(url);
	};
}

function UF_addStyle(css, head, varmap)
{
	/*
	if (typeof css !== 'string')
	{
		var args = Array.prototype.slice.call(css, 0) || [];

		css = args.join("\n");
	}
	*/

	var head = head || document.getElementsByTagName('head')[0];

	var css = _uf_var_replace(css, varmap)

	/*
	if (varmap)
	{
		var flag = 'g';

		var name;
		for (name in varmap)
		{
			var _regex = new RegExp('(\{[\@\$]' + name + '\})', flag);

			css = css.replace(_regex, varmap[name]);

			var _regex = new RegExp('([\@\$]' + name + ')\\b', flag);

			css = css.replace(_regex, varmap[name]);
		}
	}

//	return css;
	*/

	return GM_addStyle(css, head);
}

	function _uf_var_replace(text, varmap)
	{
		if (0)
		{
			//
		}
		else if (typeof text === 'undefined' || text === '')
		{
			return '';
		}
		else if (typeof text !== 'string')
		{
			var args = Array.prototype.slice.call(text, 0) || [];

			var text = args.join("\n");
		}

		if (varmap)
		{
			var flag = 'g';

			var name;
			for (name in varmap)
			{
				var _regex = new RegExp('(\{[\@\$]' + name + '\})', flag);

				text = text.replace(_regex, varmap[name]);

				var _regex = new RegExp('([\@\$]' + name + ')\\b', flag);

				text = text.replace(_regex, varmap[name]);
			}
		}

		return text;
	}

function parse_url(str, component)
{
	// http://kevin.vanzonneveld.net
	// +      original by: Steven Levithan (http://blog.stevenlevithan.com)
	// + reimplemented by: Brett Zamir (http://brett-zamir.me)
	// + input by: Lorenzo Pisani
	// + input by: Tony
	// + improved by: Brett Zamir (http://brett-zamir.me)
	// %          note: Based on http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
	// %          note: blog post at http://blog.stevenlevithan.com/archives/parseuri
	// %          note: demo at http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
	// %          note: Does not replace invalid characters with '_' as in PHP, nor does it return false with
	// %          note: a seriously malformed URL.
	// %          note: Besides function name, is essentially the same as parseUri as well as our allowing
	// %          note: an extra slash after the scheme/protocol (to allow file:/// as in PHP)
	// *     example 1: parse_url('http://username:password@hostname/path?arg=value#anchor');
	// *     returns 1: {scheme: 'http', host: 'hostname', user: 'username', pass: 'password', path: '/path', query: 'arg=value', fragment: 'anchor'}
	var key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port',
		                'relative', 'path', 'directory', 'file', 'query', 'fragment'],
		ini = (this.php_js && this.php_js.ini) || {},
		mode = (ini['phpjs.parse_url.mode'] && ini['phpjs.parse_url.mode'].local_value) || 'php',
		parser = {
			php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
			strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
			loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
		};

	var m = parser[mode].exec(str),
		uri = {},
		i = 14;
	while (i--)
	{
		if (m[i])
		{
			uri[key[i]] = m[i];
		}
	}

	if (component)
	{
		return uri[component.replace('PHP_URL_', '').toLowerCase()];
	}
	if (mode !== 'php')
	{
		var name = (ini['phpjs.parse_url.queryKey'] && ini['phpjs.parse_url.queryKey'].local_value) || 'queryKey';
		parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
		uri[name] = {};
		uri[key[12]].replace(parser, function($0, $1, $2)
		{
			if ($1)
			{
				uri[name][$1] = $2;
			}
		});
	}

	for (i in key)
	{
		if (!uri[key[i]])
		{
			uri[key[i]] = '';
		}
	}

	delete uri.source;
	return uri;
}

	function _uf_disable_nocontextmenu(mode)
	{
		if (mode)
		{
			unsafeWindow.document.oncontextmenu = unsafeWindow.document.ondragstart = unsafeWindow.document.onselectstart = null;
		}

		$('body, html').removeAttr('ondragstart').removeAttr('oncontextmenu').removeAttr('onselectstart');
	}

	function _uf_map_maxheight(who)
	{
		var maxHeight = Math.max.apply(null, $(who).map(function ()
		{
			return $(this).height();
		}).get());

		return maxHeight;
	}

	function _uf_done(event)
	{
		event.stopPropagation();
		event.preventDefault();

		return false;
	}

	function _uf_log(object)
	{
		var args = Array.prototype.slice.call(arguments, 0) || [];

//		throw new Error(args.toString());

		if (typeof console != "undefined")
		{
			return console.log(args);

			//return console.log.apply(console, args);
		}
	}

	function _uf_trigger_key(who, keycode, eventname)
	{
		var e = jQuery.Event(eventname ? eventname : 'keydown', {
			which: keycode,
			keyCode: keycode,
		});

		return $(who).trigger(e);
	}

	function _uf_wait_while(_bool, _func, _time)
	{
		var _time = _time || 200;

		var _val = _bool();

		//_uf_log(_val);

		if (_val)
		{
			return _func();
		}
		else
		{
			setTimeout(function(){
				_uf_wait_while(_bool, _func, _time);
			}, _time);
		}
	}

	function _uf_trim2(str)
	{
		if (typeof str === 'string')
		{
			return str.replace(/^[,\s]+|[,\s]+$/g, '');
		}
		else if (!str || $.isEmptyObject(str))
		{
			//
		}
		else if ($.isArray(str) || $.isPlainObject(str))
		{
			$.each(str, function(_i, _v){
				var _ret = _uf_trim2(_v);

				if (_ret !== null && typeof _ret !== 'undefined')
				{
					str[_i] = _ret;
				}
				else
				{
					//
				}
			});
		}
		else
		{
			//
		}

		return str;
	}

	// http://upshots.org/javascript/jquery-test-if-element-is-in-viewport-visible-on-screen
	Function.prototype.debounce = function (threshold)
	{
		var callback = this;
		var timeout;
		return function()
		{
			var context = this, params = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(function()
			{
				callback.apply(context, params);
			}, threshold);
		};
	};

	(function($){
		(function(_old){

			var _fn_top = function (who)
			{
				var _top;
				var _o;

				if ($.isNumeric(who))
				{
					_top = who;
				}
				else if ((_o = $(who)) && _o.size())
				{
					_top = _o.offset().top;
				}

				return _top;
			};

//			if (!$.isfunction(_old))
			if (typeof _old === 'undefined')
			{
				$.fn.scrollTo = function (who, offset)
				{
					var _top = _fn_top(who);

					if (offset)
					{
						_top = (_top ? _top : 0) + _fn_top(offset);
					}

					if (_top !== undefined)
					{
						this.scrollTop(_top);
					}

					return this;
				};
			}

//			if (!$.isfunction($.scrollTo))
			if (typeof $.scrollTo === 'undefined')
			{
				$.scrollTo = function (who, offset)
				{
					return $(window).scrollTo(who, offset);
				};
			}
		})($.fn.scrollTo);
	})(jQuery);

;