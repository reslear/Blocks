

;(function() {

    'user strict';
    if(!window.Blocks){window.Blocks={};}

    var default_config = {

        // key(aZ-_)  : array [title, html_string || array[open,close] ], is_modal

        h       : ['H1-5', '<h1>Заголовок</h1>'],
        p       : ['P', '<p>Абзац</p>'],
        div     : ['DIV', '<div>Блок...</div>'],
        img     : ['Image', ['<img src="','">'], 'Введите ссылку на изображение:' ],
        list    : ['ul,ol,li', '<ul><li>Пункт...</li></ul>'],
        precode : ['Pre,Code', '<pre><code>Блок с кодом</pre></code>'],
        quote   : ['Quote', '<blockquote>Цитата</blockquote>'],
        other   : ['Свободный HTML', '', 'Введите свободный HTML код:']
    };

    // Constructor
    var plugin = Blocks.Add = function() {
        this.setConfig.apply(this, arguments);
    };

    // Public
    plugin.prototype.setConfig = function(user_config, isMerge) {

        this.CONFIG = isMerge ? Object.assign({}, default_config, (user_config || {}) ) : user_config || default_config;


    };

    plugin.prototype.init = function(selector, where, place, on_isert, on_promt) {

        if ( !selector || !(this.CONTAINER = document.querySelector(selector)) ) {
            return false;
        }

        this.PLACE = place || 'beforebegin';
        this.WHERE = where ? document.querySelector(where) : null;
        this.ON_INSERT = (typeof on_isert === "function" ? on_isert : null);
        this.ON_PROMT = on_promt || default_promt;

        var parent = '';
        var config = this.CONFIG;

        for( var key in config ) {
           var item = config[key];
           var button = '<button class="blocks-add-btn" type="button" title="'+ escapeAttr( get_html(item) ) + '" data-blocks-add="'+key+'">'+ escapeAttr(item[0]) +'</div>';

           parent = parent + button;
        }

        this.CONTAINER.classList.add('blocks-add');
        this.CONTAINER.innerHTML = parent;

        initEvents.call(this);
    };

    function default_promt() {
        return prompt(arguments[0], '');
    }

    function get_html( config, value ){
        return Array.isArray(config[1]) ? (config[1][0] || '') + (value || '') + (config[1][1] || '') : config[1] + (value || '');
    }

    function insert( html ){
        return (this.WHERE || this.CONTAINER).insertAdjacentHTML(this.PLACE, html );
    }

    function pre_insert( button ) { //where, position

        var data = button.dataset.blocksAdd;
        if( !data ){return false;}

        var config = this.CONFIG[data];

        var html = get_html(config, config[2] ? this.ON_PROMT(config[2]) : '');
        var inseretHtml = this.ON_INSERT ? this.ON_INSERT.apply(null, [html, config]) : html;

        insert.call(this, inseretHtml);
    }

    function initEvents() {

        var elements = this.CONTAINER.querySelectorAll('button');
        var that = this;

        [].forEach.call(elements, function( button ) {
            button.addEventListener('click', pre_insert.bind(that, button) );
        });
    }

    function escapeAttr(text) {
        var arr = {"\\'": '&apos;', '\\"': '&quot;', '<': '&lt;', '>': '&gt;'};

        for(var key in arr){
            text = text.replace( new RegExp(key, 'g'), arr[key]);
        }

        return text;
    }

})();
