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

        if ( !(this.SELECTOR = selector) || !(this.BLOCK = document.querySelector(this.SELECTOR)) ) {
            return false;
        }

        this.render();
    };

    BlocksParser.prototype.get = function() {

        return _backRender( this.BLOCK.cloneNode(true) );
    };

    BlocksParser.prototype.render = function( isUpdate ) {

        _render.init(this.BLOCK);
        this.BLOCK.classList.add('blocks-parser');
        editableEvents.call(this);
    };

    BlocksParser.prototype.compile = function() {

        editableEvents.call(this, true);
        this.BLOCK.classList.remove('blocks-parser');
        _backRender(this.BLOCK);
    };

    // Private
    var thisParent = function(el) {
        return el.parentNode.classList.contains('blocks-parser') ? el : el.parentNode;
    };

    var events = {
        blur: function() {
            this.classList.remove('bm-focus');
        },
        focus: function() {
            this.classList.add('bm-focus');
        },
        keydown: function(event) {

            var el = thisParent(this);
/*
            if ( el.dataset.bmTag && el.dataset.bmTag === 'code' ) {

                if (event.keyCode === 9) {
                    document.execCommand('insertHTML', false, '&#009');
                    event.preventDefault();
                }
            }
            */
        },
        click: function(event) {

            if( this.parentNode.tagName === 'A' ) {

                event.preventDefault();
                return false;
            }
        }
    };

    function editableEvents( hasRemove ) {

        var editable = this.BLOCK.querySelectorAll('[contenteditable]');

        [].forEach.call(editable, function(item) {

            for (var key in events) {
                item[ (hasRemove ? 'remove' : 'add') + 'EventListener'](key, events[key]);
            }

        });
    }

    // Обратный парсинг  TOD: с clone

    // без клона
    var _backRender = function(main) {

        var self = {};

        self.process = function(node) {

            if( node.nodeType === 1 ) {

                var parent = node.parentNode;

                if( node.classList.contains('bm-child') ) {
                    node.outerHTML = node.innerHTML;
                }

                node.classList.remove('bm-render');

//                if( 'bmRender' in node.dataset) {
//                    delete node.dataset.bmRender;
//                }

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

            return parent; //if( isFirst ){ self.process(parent); }
        };

        return self.recursive(main);
    };


    // Функция парсинга элементов
    var _render = {

        recursive: function(item) {

            var child = document.createElement('div');
                child.setAttribute('contenteditable', '');
                child.classList.add('bm-child');

            if (item.nodeType === 3) {

                // зацщита от пустых строк
                if ( !item.textContent.trim().length ) {
                    return false;
                }

                //child.dataset.bmText = '';

                child.innerHTML = item.textContent;
                item.parentNode.replaceChild(child, item);

            } else if (item.nodeType === 1) {

                // выходим, если уже прорисовали или узел игнорный
                if ( /*item.dataset.hasOwnProperty('bmRender') ||*/ item.dataset.hasOwnProperty('bmIgnore') || item.tagName === 'BR' || item.tagName === 'HR' ) {
                    return;
                }

                if (item.children.length) {

                    _render.init(item);
                } else {

                    child.innerHTML = item.innerHTML;
                    item.innerHTML = child.outerHTML;
                }


                //item.dataset.bmTag = item.tagName.toLowerCase();
                item.classList.add('bm-render');
            }

        },

        init: function(parent) {

            // начать перебор всех потомков
            [].forEach.call(parent.childNodes, _render.recursive);
        }

    };


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
