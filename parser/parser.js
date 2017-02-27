/*!
    Blocks - Parser v0.1 release
    (c) 2016 Korchevskiy Evgeniy (aka ReSLeaR-)
    ---
    vk.com/reslear | upost.su | github.com/reslear
    Released under the MIT @license.
*/


// data-bc
/*
    TODO:
    - переписать функцию render
    - кастомные события
    ✓ link onclick fix
    ✓ ignore BR and HR tag's
*/

;(function() {

    'user strict';

    // Constructor
    this.BlocksParser = function(selector) {

        this.SELECTOR = selector;
        this.BLOCK = document.querySelector(this.SELECTOR);

        this.BACKUP = this.BLOCK.cloneNode(true);
    };

    // Public
    BlocksParser.prototype.render = function( isBack, isBackup ) {

        var rendered;

        if( isBackup ) {
            rendered = this.BACKUP;
        } else {
            var node = this.BLOCK.cloneNode(true);
            rendered = isBack ? _backRender(node) : editableRender(node);

            rendered.classList[isBack ? 'remove' : 'add']('blocks-parser');
        }

        this.BLOCK.parentNode.replaceChild(rendered, this.BLOCK);
        this.BLOCK = rendered;
    };

    BlocksParser.prototype.get = function() {
        return _backRender( this.BLOCK.cloneNode(true) );
    };

    BlocksParser.prototype.single = function(element, isBack) {
        var rendered = isBack ? _backRender(element) : editableRender(element);
        return rendered;
    };

    // Private
    var events = {
        blur: function() {
            //this.classList.remove('bm-focus');
        },
        focus: function() {
            //this.classList.add('bm-focus');
        },
        keydown: function() {
            var parent = this.parentNode;
            var parent2 = parent.parentNode;

            if ( parent && parent.tagName === 'CODE' && parent2 && parent2.tagName === 'PRE' ) {
                if (event.keyCode !== 9) {return;}

                document.execCommand('insertHTML', false, '&#009');
                event.preventDefault();
            }

        },
        click: function(event) {

            if( this.parentNode.tagName === 'A' ) {

                event.preventDefault();
                return false;
            }
        }
    };


    function addEditableEvents(node) {
        for (var key in events) {
            node.addEventListener(key, events[key]);
        }
    }



    var _backRender = function(main) {

        var self = {};

        self.process = function(node) {
            if( node.nodeType === 1 ) {
                var parent = node.parentNode;

                if( node.classList.contains('bm-child') ) {
                    node.outerHTML = node.innerHTML;
                }

                node.classList.remove('bm-render');
            }
        };

        self.recursive = function(parent) {
            var node = parent.childNodes;

            for( var i = 0, len = node.length; i < len; i++ ) {

                if( node[i].children && node[i].children.length ) {
                  self.recursive(node[i]);
                }

                self.process(node[i]);
            }

            return parent;
        };

        return self.recursive(main);
    };

    /* Переработанный
    ------------------------------------------------------------------------ */
    var ignore_tags = ['BR','HR','IMG'];

    var editableRender = function(main) {

        var self = {};

        self.clean = function(el) {
            while (el.firstChild) {
              el.removeChild(el.firstChild);
            }
        };

        self.createChild = function(html) {
            var child = document.createElement('div');

            child.setAttribute('contenteditable', '');
            child.classList.add('bm-child');

            child.innerHTML = html;
            addEditableEvents(child);

            return child;
        };

        self.process = function(node) {

            var child;

            if(node.nodeType === 3 ){

                child = self.createChild(node.textContent);
                node.parentNode.replaceChild(child, node);

            } else if(node.nodeType === 1 ){

                node.classList.add('bm-render');
                child = self.createChild(node.innerHTML);

                self.clean(node);
                node.appendChild(child);
            }
        };

        self.validate = function(node) {
            if(node.nodeType === 3 ){

                // защита от пустых строк у текста
                if ( !node.textContent.trim().length ) {
                    return false;
                }
            }else if(node.nodeType === 1 ) {

                // выходим, если уже прорисовали или узел игнорный

                if ('bmIgnore' in node.dataset || ~ignore_tags.indexOf(node.tagName) ) {
                    return false;
                }
            }
            return true;
        };

        self.recursive = function(parent) {
            var node = parent.childNodes;

            for( var i = 0, len = node.length; i < len; i++ ) {
                if(!self.validate(node[i])){continue;}
                self[node[i].children && node[i].children.length ? 'recursive' : 'process'](node[i]);
            }

            return parent;
        };

        return self.recursive(main);
    };

    /* --------------------------------------------------------------------- */

    // Private utils fx
    function extend(obj1, obj2) {
        for (var key in obj2) {
            obj1[key] = obj2[key];
        }
        return obj1;
    }

    function each(arr, fx){
      return [].forEach.call(arr, fx);
    }

})();
