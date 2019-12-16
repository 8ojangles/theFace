(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @fileOverview Implementation of a doubly linked-list data structure
 * @author Jason S. Jones
 * @license MIT
 */

(function () {
    'use strict';

    var isEqual = require('lodash.isequal');
    var Node = require('./lib/list-node');
    var Iterator = require('./lib/iterator');

    /**************************************************
     * Doubly linked list class
     *
     * Implementation of a doubly linked list data structure.  This
     * implementation provides the general functionality of adding nodes to
     * the front or back of the list, as well as removing node from the front
     * or back.  This functionality enables this implemention to be the
     * underlying data structure for the more specific stack or queue data
     * structure.
     *
     ***************************************************/

    /**
     * Creates a LinkedList instance.  Each instance has a head node, a tail
     * node and a size, which represents the number of nodes in the list.
     *
     * @constructor
     */
    function DoublyLinkedList() {
        this.head = null;
        this.tail = null;
        this.size = 0;

        // add iterator as a property of this list to share the same
        // iterator instance with all other methods that may require
        // its use.  Note: be sure to call this.iterator.reset() to
        // reset this iterator to point the head of the list.
        this.iterator = new Iterator(this);
    }

    /* Functions attached to the Linked-list prototype.  All linked-list
     * instances will share these methods, meaning there will NOT be copies
     * made for each instance.  This will be a huge memory savings since there
     * may be several different linked lists.
     */
    DoublyLinkedList.prototype = {

        /**
         * Creates a new Node object with 'data' assigned to the node's data
         * property
         *
         * @param {object|string|number} data The data to initialize with the
         *                                    node
         * @returns {object} Node object intialized with 'data'
         */
        createNewNode: function (data) {
            return new Node(data);
        },

        /**
         * Returns the first node in the list, commonly referred to as the
         * 'head' node
         *
         * @returns {object} the head node of the list
         */
        getHeadNode: function () {
            return this.head;
        },

        /**
         * Returns the last node in the list, commonly referred to as the
         * 'tail'node
         *
         * @returns {object} the tail node of the list
         */
        getTailNode: function () {
            return this.tail;
        },

        /**
         * Determines if the list is empty
         *
         * @returns {boolean} true if the list is empty, false otherwise
         */
        isEmpty: function () {
            return (this.size === 0);
        },

        /**
         * Returns the size of the list, or number of nodes
         *
         * @returns {number} the number of nodes in the list
         */
        getSize: function () {
            return this.size;
        },

        /**
         * Clears the list of all nodes/data
         */
        clear: function () {
            while (!this.isEmpty()) {
                this.remove();
            }
        },

        //################## INSERT methods ####################

        /**
         * Inserts a node with the provided data to the end of the list
         *
         * @param {object|string|number} data The data to initialize with the
         *                                    node
         * @returns {boolean} true if insert operation was successful
         */
        insert: function (data) {
            var newNode = this.createNewNode(data);
            if (this.isEmpty()) {
                this.head = this.tail = newNode;
            } else {
                this.tail.next = newNode;
                newNode.prev = this.tail;
                this.tail = newNode;
            }
            this.size += 1;

            return true;
        },

        /**
         * Inserts a node with the provided data to the front of the list
         *
         * @param {object|string|number} data The data to initialize with the
         *                                    node
         * @returns {boolean} true if insert operation was successful
         */
        insertFirst: function (data) {
            if (this.isEmpty()) {
                this.insert(data);
            } else {
                var newNode = this.createNewNode(data);

                newNode.next = this.head;
                this.head.prev = newNode;
                this.head = newNode;

                this.size += 1;
            }

            return true;
        },

        /**
         * Inserts a node with the provided data at the index indicated.
         *
         * @param {number} index The index in the list to insert the new node
         * @param {object|string|number} data The data to initialize with the node
         */
        insertAt: function (index, data) {
            var current = this.getHeadNode(),
                newNode = this.createNewNode(data),
                position = 0;

            // check for index out-of-bounds
            if (index < 0 || index > this.getSize() - 1) {
                return false;
            }

            // if index is 0, we just need to insert the first node
            if (index === 0) {
                this.insertFirst(data);
                return true;
            }

            while (position < index) {
                current = current.next;
                position += 1;
            }

            current.prev.next = newNode;
            newNode.prev = current.prev;
            current.prev = newNode;
            newNode.next = current;

            this.size += 1;

            return true;
        },

        /**
         * Inserts a node before the first node containing the provided data
         *
         * @param {object|string|number} nodeData The data of the node to
         *         find to insert the new node before
         * @param {object|string|number} dataToInsert The data to initialize with the node
         * @returns {boolean} true if insert operation was successful
         */
        insertBefore: function (nodeData, dataToInsert) {
            var index = this.indexOf(nodeData);
            return this.insertAt(index, dataToInsert);
        },

        /**
         * Inserts a node after the first node containing the provided data
         *
         * @param {object|string|number} nodeData The data of the node to
         *         find to insert the new node after
         * @param {object|string|number} dataToInsert The data to initialize with the node
         * @returns {boolean} true if insert operation was successful
         */
        insertAfter: function (nodeData, dataToInsert) {
            var index = this.indexOf(nodeData);
            var size = this.getSize();

            // check if we want to insert new node after the tail node
            if (index + 1 === size) {

                // if so, call insert, which will append to the end by default
                return this.insert(dataToInsert);

            } else {

                // otherwise, increment the index and insert there
                return this.insertAt(index + 1, dataToInsert);
            }
        },

        /**
         * Concatenate another linked list to the end of this linked list. The result is very
         * similar to array.concat but has a performance improvement since there is no need to
         * iterate over the lists
         * @param {DoublyLinkedList} otherLinkedList
         * @returns {DoublyLinkedList}
         */
        concat: function (otherLinkedList) {
            if (otherLinkedList instanceof DoublyLinkedList) {
                //create new list so the calling list is immutable (like array.concat)
                var newList = new DoublyLinkedList();
                if (this.getSize() > 0) { //this list is NOT empty
                    newList.head = this.getHeadNode();
                    newList.tail = this.getTailNode();
                    newList.tail.next = otherLinkedList.getHeadNode();
                    if (otherLinkedList.getSize() > 0) {
                        newList.tail = otherLinkedList.getTailNode();
                    }
                    newList.size = this.getSize() + otherLinkedList.getSize();
                }
                else { //'this' list is empty
                    newList.head = otherLinkedList.getHeadNode();
                    newList.tail = otherLinkedList.getTailNode();
                    newList.size = otherLinkedList.getSize();
                }
                return newList;

            }
            else {
                throw new Error("Can only concat another instance of DoublyLinkedList");
            }
        },

        //################## REMOVE methods ####################

        /**
         * Removes the tail node from the list
         *
         * There is a significant performance improvement with the operation
         * over its singly linked list counterpart.  The mere fact of having
         * a reference to the previous node improves this operation from O(n)
         * (in the case of singly linked list) to O(1).
         *
         * @returns the node that was removed
         */
        remove: function () {
            if (this.isEmpty()) {
                return null;
            }

            // get handle for the tail node
            var nodeToRemove = this.getTailNode();

            // if there is only one node in the list, set head and tail
            // properties to null
            if (this.getSize() === 1) {
                this.head = null;
                this.tail = null;

            // more than one node in the list
            } else {
                this.tail = this.getTailNode().prev;
                this.tail.next = null;
            }
            this.size -= 1;

            return nodeToRemove;
        },

        /**
         * Removes the head node from the list
         *
         * @returns the node that was removed
         */
        removeFirst: function () {
            if (this.isEmpty()) {
                return null;
            }

            var nodeToRemove;

            if (this.getSize() === 1) {
                nodeToRemove = this.remove();
            } else {
                nodeToRemove = this.getHeadNode();
                this.head = this.head.next;
                this.head.prev = null;
                this.size -= 1;
            }

            return nodeToRemove;
        },

        /**
         * Removes the node at the index provided
         *
         * @param {number} index The index of the node to remove
         * @returns the node that was removed
         */
        removeAt: function (index) {
            var nodeToRemove = this.findAt(index);

            // check for index out-of-bounds
            if (index < 0 || index > this.getSize() - 1) {
                return null;
            }

            // if index is 0, we just need to remove the first node
            if (index === 0) {
                return this.removeFirst();
            }

            // if index is size-1, we just need to remove the last node,
            // which remove() does by default
            if (index === this.getSize() - 1) {
                return this.remove();
            }

            nodeToRemove.prev.next = nodeToRemove.next;
            nodeToRemove.next.prev = nodeToRemove.prev;
            nodeToRemove.next = nodeToRemove.prev = null;

            this.size -= 1;

            return nodeToRemove;
        },

        /**
         * Removes the first node that contains the data provided
         *
         * @param {object|string|number} nodeData The data of the node to remove
         * @returns the node that was removed
         */
        removeNode: function (nodeData) {
            var index = this.indexOf(nodeData);
            return this.removeAt(index);
        },

        //################## FIND methods ####################

        /**
         * Returns the index of the first node containing the provided data.  If
         * a node cannot be found containing the provided data, -1 is returned.
         *
         * @param {object|string|number} nodeData The data of the node to find
         * @returns the index of the node if found, -1 otherwise
         */
        indexOf: function (nodeData) {
            this.iterator.reset();
            var current;

            var index = 0;

            // iterate over the list (keeping track of the index value) until
            // we find the node containg the nodeData we are looking for
            while (this.iterator.hasNext()) {
                current = this.iterator.next();
                if (isEqual(current.getData(), nodeData)) {
                    return index;
                }
                index += 1;
            }

            // only get here if we didn't find a node containing the nodeData
            return -1;
        },

        /**
         * Returns the fist node containing the provided data.  If a node
         * cannot be found containing the provided data, -1 is returned.
         *
         * @param {object|string|number} nodeData The data of the node to find
         * @returns the node if found, -1 otherwise
         */
        find: function (nodeData) {
            // start at the head of the list
            this.iterator.reset();
            var current;

            // iterate over the list until we find the node containing the data
            // we are looking for
            while (this.iterator.hasNext()) {
                current = this.iterator.next();
                if (isEqual(current.getData(), nodeData)) {
                    return current;
                }
            }

            // only get here if we didn't find a node containing the nodeData
            return -1;
        },

        /**
         * Returns the node at the location provided by index
         *
         * @param {number} index The index of the node to return
         * @returns the node located at the index provided.
         */
        findAt: function (index) {
            // if idx is out of bounds or fn called on empty list, return -1
            if (this.isEmpty() || index > this.getSize() - 1) {
                return -1;
            }

            // else, loop through the list and return the node in the
            // position provided by idx.  Assume zero-based positions.
            var node = this.getHeadNode();
            var position = 0;

            while (position < index) {
                node = node.next;
                position += 1;
            }

            return node;
        },

        /**
         * Determines whether or not the list contains the provided nodeData
         *
         * @param {object|string|number} nodeData The data to check if the list
         *        contains
         * @returns the true if the list contains nodeData, false otherwise
         */
        contains: function (nodeData) {
            if (this.indexOf(nodeData) > -1) {
                return true;
            } else {
                return false;
            }
        },

        //################## UTILITY methods ####################

        /**
         * Utility function to iterate over the list and call the fn provided
         * on each node, or element, of the list
         *
         * @param {object} fn The function to call on each node of the list
         * @param {bool} reverse Use or not reverse iteration (tail to head), default to false
         */
        forEach: function (fn, reverse) {
            reverse = reverse || false;
            if (reverse) {
                this.iterator.reset_reverse();
                this.iterator.each_reverse(fn);
            } else {
                this.iterator.reset();
                this.iterator.each(fn);
            }
        },

        /**
         * Returns an array of all the data contained in the list
         *
         * @returns {array} the array of all the data from the list
         */
        toArray: function () {
            var listArray = [];
            this.forEach(function (node) {
                listArray.push(node.getData());
            });

            return listArray;
        },

        /**
         * Interrupts iteration over the list
         */
        interruptEnumeration: function () {
            this.iterator.interrupt();
        }
    };

    module.exports = DoublyLinkedList;

}());

},{"./lib/iterator":2,"./lib/list-node":3,"lodash.isequal":4}],2:[function(require,module,exports){
/**
 * @fileOverview Implementation of an iterator for a linked list
 *               data structure
 * @author Jason S. Jones
 * @license MIT
 */

(function () {
    'use strict';

    /**************************************************
     * Iterator class
     *
     * Represents an instantiation of an iterator to be used
     * within a linked list.  The iterator will provide the ability
     * to iterate over all nodes in a list by keeping track of the
     * postition of a 'currentNode'.  This 'currentNode' pointer
     * will keep state until a reset() operation is called at which
     * time it will reset to point the head of the list.
     *
     * Even though this iterator class is inextricably linked
     * (no pun intended) to a linked list instatiation, it was removed
     * from within the linked list code to adhere to the best practice
     * of separation of concerns.
     *
     ***************************************************/

    /**
     * Creates an iterator instance to iterate over the linked list provided.
     *
     * @constructor
     * @param {object} theList the linked list to iterate over
     */
    function Iterator(theList) {
        this.list = theList || null;
        this.stopIterationFlag = false;

        // a pointer the current node in the list that will be returned.
        // initially this will be null since the 'list' will be empty
        this.currentNode = null;
    }

    /* Functions attached to the Iterator prototype.  All iterator instances
     * will share these methods, meaning there will NOT be copies made for each
     * instance.
     */
    Iterator.prototype = {

        /**
         * Returns the next node in the iteration.
         *
         * @returns {object} the next node in the iteration.
         */
        next: function () {
            var current = this.currentNode;
            // a check to prevent error if randomly calling next() when
            // iterator is at the end of the list, meaining the currentNode
            // will be pointing to null.
            //
            // When this function is called, it will return the node currently
            // assigned to this.currentNode and move the pointer to the next
            // node in the list (if it exists)
            if (this.currentNode !== null) {
                this.currentNode = this.currentNode.next;
            }

            return current;
        },

        /**
         * Determines if the iterator has a node to return
         *
         * @returns true if the iterator has a node to return, false otherwise
         */
        hasNext: function () {
            return this.currentNode !== null;
        },

        /**
         * Resets the iterator to the beginning of the list.
         */
        reset: function () {
            this.currentNode = this.list.getHeadNode();
        },

        /**
         * Returns the first node in the list and moves the iterator to
         * point to the second node.
         *
         * @returns the first node in the list
         */
        first: function () {
            this.reset();
            return this.next();
        },

        /**
         * Sets the list to iterate over
         *
         * @param {object} theList the linked list to iterate over
         */
        setList: function (theList) {
            this.list = theList;
            this.reset();
        },

        /**
         * Iterates over all nodes in the list and calls the provided callback
         * function with each node as an argument.
         * Iteration will break if interrupt() is called
         *
         * @param {function} callback the callback function to be called with
         *                   each node of the list as an arg
         */
        each: function (callback) {
            this.reset();
            var el;
            while (this.hasNext() && !this.stopIterationFlag) {
                el = this.next();
                callback(el);
            }
            this.stopIterationFlag = false;
        },

        /*
         * ### REVERSE ITERATION (TAIL -> HEAD) ###
         */

        /**
         * Returns the first node in the list and moves the iterator to
         * point to the second node.
         *
         * @returns the first node in the list
         */
        last: function () {
            this.reset_reverse();
            return this.next_reverse();
        },

        /**
         * Resets the iterator to the tail of the list.
         */
        reset_reverse: function () {
            this.currentNode = this.list.getTailNode();
        },

        /**
         * Returns the next node in the iteration, when iterating from tail to head
         *
         * @returns {object} the next node in the iteration.
         */
        next_reverse: function () {
            var current = this.currentNode;
            if (this.currentNode !== null) {
                this.currentNode = this.currentNode.prev;
            }

            return current;
        },

        /**
         * Iterates over all nodes in the list and calls the provided callback
         * function with each node as an argument,
         * starting from the tail and going towards the head.
         * The iteration will break if interrupt() is called.
         *
         * @param {function} callback the callback function to be called within
         *                    each node as an arg
         */
        each_reverse: function (callback) {
            this.reset_reverse();
            var el;
            while (this.hasNext() && !this.stopIterationFlag) {
                el = this.next_reverse();
                callback(el);
            }
            this.stopIterationFlag = false;
        },

        /*
         * ### INTERRUPT ITERATION ###
         */

        /**
         * Raises interrupt flag (that will stop each() or each_reverse())
         */

        interrupt: function () {
            this.stopIterationFlag = true;
        }
    };

    module.exports = Iterator;

}());

},{}],3:[function(require,module,exports){
(function () {
    'use strict';

    /**************************************************
     * Linked list node class
     *
     * Internal private class to represent a node within
     * a linked list.  Each node has a 'data' property and
     * a pointer the previous node and the next node in the list.
     *
     * Since the 'Node' function is not assigned to
     * module.exports it is not visible outside of this
     * file, therefore, it is private to the LinkedList
     * class.
     *
     ***************************************************/

    /**
     * Creates a node object with a data property and pointer
     * to the next node
     *
     * @constructor
     * @param {object|number|string} data The data to initialize with the node
     */
    function Node(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }

    /* Functions attached to the Node prototype.  All node instances will
     * share these methods, meaning there will NOT be copies made for each
     * instance.  This will be a huge memory savings since there will likely
     * be a large number of individual nodes.
     */
    Node.prototype = {

        /**
         * Returns whether or not the node has a pointer to the next node
         *
         * @returns {boolean} true if there is a next node; false otherwise
         */
        hasNext: function () {
            return (this.next !== null);
        },

        /**
         * Returns whether or not the node has a pointer to the previous node
         *
         * @returns {boolean} true if there is a previous node; false otherwise
         */
        hasPrev: function () {
            return (this.prev !== null);
        },

        /**
         * Returns the data of the the node
         *
         * @returns {object|string|number} the data of the node
         */
        getData: function () {
            return this.data;
        },

        /**
         * Returns a string represenation of the node.  If the data is an
         * object, it returns the JSON.stringify version of the object.
         * Otherwise, it simply returns the data
         *
         * @return {string} the string represenation of the node data
         */
        toString: function () {
            if (typeof this.data === 'object') {
                return JSON.stringify(this.data);
            } else {
                return String(this.data);
            }
        }
    };

    module.exports = Node;

}());

},{}],4:[function(require,module,exports){
(function (global){
/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = isEqual;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
(function (root, factory){
  'use strict';

  /*istanbul ignore next:cant test*/
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Browser globals
    root.objectPath = factory();
  }
})(this, function(){
  'use strict';

  var toStr = Object.prototype.toString;
  function hasOwnProperty(obj, prop) {
    if(obj == null) {
      return false
    }
    //to handle objects with null prototypes (too edge case?)
    return Object.prototype.hasOwnProperty.call(obj, prop)
  }

  function isEmpty(value){
    if (!value) {
      return true;
    }
    if (isArray(value) && value.length === 0) {
        return true;
    } else if (typeof value !== 'string') {
        for (var i in value) {
            if (hasOwnProperty(value, i)) {
                return false;
            }
        }
        return true;
    }
    return false;
  }

  function toString(type){
    return toStr.call(type);
  }

  function isObject(obj){
    return typeof obj === 'object' && toString(obj) === "[object Object]";
  }

  var isArray = Array.isArray || function(obj){
    /*istanbul ignore next:cant test*/
    return toStr.call(obj) === '[object Array]';
  }

  function isBoolean(obj){
    return typeof obj === 'boolean' || toString(obj) === '[object Boolean]';
  }

  function getKey(key){
    var intKey = parseInt(key);
    if (intKey.toString() === key) {
      return intKey;
    }
    return key;
  }

  function factory(options) {
    options = options || {}

    var objectPath = function(obj) {
      return Object.keys(objectPath).reduce(function(proxy, prop) {
        if(prop === 'create') {
          return proxy;
        }

        /*istanbul ignore else*/
        if (typeof objectPath[prop] === 'function') {
          proxy[prop] = objectPath[prop].bind(objectPath, obj);
        }

        return proxy;
      }, {});
    };

    function hasShallowProperty(obj, prop) {
      return (options.includeInheritedProps || (typeof prop === 'number' && Array.isArray(obj)) || hasOwnProperty(obj, prop))
    }

    function getShallowProperty(obj, prop) {
      if (hasShallowProperty(obj, prop)) {
        return obj[prop];
      }
    }

    function set(obj, path, value, doNotReplace){
      if (typeof path === 'number') {
        path = [path];
      }
      if (!path || path.length === 0) {
        return obj;
      }
      if (typeof path === 'string') {
        return set(obj, path.split('.').map(getKey), value, doNotReplace);
      }
      var currentPath = path[0];
      var currentValue = getShallowProperty(obj, currentPath);
      if (path.length === 1) {
        if (currentValue === void 0 || !doNotReplace) {
          obj[currentPath] = value;
        }
        return currentValue;
      }

      if (currentValue === void 0) {
        //check if we assume an array
        if(typeof path[1] === 'number') {
          obj[currentPath] = [];
        } else {
          obj[currentPath] = {};
        }
      }

      return set(obj[currentPath], path.slice(1), value, doNotReplace);
    }

    objectPath.has = function (obj, path) {
      if (typeof path === 'number') {
        path = [path];
      } else if (typeof path === 'string') {
        path = path.split('.');
      }

      if (!path || path.length === 0) {
        return !!obj;
      }

      for (var i = 0; i < path.length; i++) {
        var j = getKey(path[i]);

        if((typeof j === 'number' && isArray(obj) && j < obj.length) ||
          (options.includeInheritedProps ? (j in Object(obj)) : hasOwnProperty(obj, j))) {
          obj = obj[j];
        } else {
          return false;
        }
      }

      return true;
    };

    objectPath.ensureExists = function (obj, path, value){
      return set(obj, path, value, true);
    };

    objectPath.set = function (obj, path, value, doNotReplace){
      return set(obj, path, value, doNotReplace);
    };

    objectPath.insert = function (obj, path, value, at){
      var arr = objectPath.get(obj, path);
      at = ~~at;
      if (!isArray(arr)) {
        arr = [];
        objectPath.set(obj, path, arr);
      }
      arr.splice(at, 0, value);
    };

    objectPath.empty = function(obj, path) {
      if (isEmpty(path)) {
        return void 0;
      }
      if (obj == null) {
        return void 0;
      }

      var value, i;
      if (!(value = objectPath.get(obj, path))) {
        return void 0;
      }

      if (typeof value === 'string') {
        return objectPath.set(obj, path, '');
      } else if (isBoolean(value)) {
        return objectPath.set(obj, path, false);
      } else if (typeof value === 'number') {
        return objectPath.set(obj, path, 0);
      } else if (isArray(value)) {
        value.length = 0;
      } else if (isObject(value)) {
        for (i in value) {
          if (hasShallowProperty(value, i)) {
            delete value[i];
          }
        }
      } else {
        return objectPath.set(obj, path, null);
      }
    };

    objectPath.push = function (obj, path /*, values */){
      var arr = objectPath.get(obj, path);
      if (!isArray(arr)) {
        arr = [];
        objectPath.set(obj, path, arr);
      }

      arr.push.apply(arr, Array.prototype.slice.call(arguments, 2));
    };

    objectPath.coalesce = function (obj, paths, defaultValue) {
      var value;

      for (var i = 0, len = paths.length; i < len; i++) {
        if ((value = objectPath.get(obj, paths[i])) !== void 0) {
          return value;
        }
      }

      return defaultValue;
    };

    objectPath.get = function (obj, path, defaultValue){
      if (typeof path === 'number') {
        path = [path];
      }
      if (!path || path.length === 0) {
        return obj;
      }
      if (obj == null) {
        return defaultValue;
      }
      if (typeof path === 'string') {
        return objectPath.get(obj, path.split('.'), defaultValue);
      }

      var currentPath = getKey(path[0]);
      var nextObj = getShallowProperty(obj, currentPath)
      if (nextObj === void 0) {
        return defaultValue;
      }

      if (path.length === 1) {
        return nextObj;
      }

      return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
    };

    objectPath.del = function del(obj, path) {
      if (typeof path === 'number') {
        path = [path];
      }

      if (obj == null) {
        return obj;
      }

      if (isEmpty(path)) {
        return obj;
      }
      if(typeof path === 'string') {
        return objectPath.del(obj, path.split('.'));
      }

      var currentPath = getKey(path[0]);
      if (!hasShallowProperty(obj, currentPath)) {
        return obj;
      }

      if(path.length === 1) {
        if (isArray(obj)) {
          obj.splice(currentPath, 1);
        } else {
          delete obj[currentPath];
        }
      } else {
        return objectPath.del(obj[currentPath], path.slice(1));
      }

      return obj;
    }

    return objectPath;
  }

  var mod = factory();
  mod.create = factory;
  mod.withInheritedProps = factory({includeInheritedProps: true})
  return mod;
});

},{}],6:[function(require,module,exports){
var animation = {
    state: false,
    counter: 0,
    duration: 240
};

module.exports.animation = animation;
},{}],7:[function(require,module,exports){
// dependencies

// NPM
    var LinkedList = require('dbly-linked-list');
    var objectPath = require("object-path");

// Custom Requires
    var mathUtils = require('./mathUtils.js').mathUtils;
    var trig = require('./trigonomicUtils.js').trigonomicUtils;
    require('./canvasApiAugmentation.js');
    var coloring = require('./colorUtils.js').colorUtils;
    var easing = require('./easing.js').easingEquations;
    var animation = require('./animation.js').animation;
    var debugConfig = require('./debugUtils.js');
    var debug = debugConfig.debug;
    var lastCalledTime = debugConfig.lastCalledTime;
    var environment = require('./environment.js').environment;
    var physics = environment.forces;
    var runtimeEngine = environment.runtimeEngine;
    
    require('./gears.js');
    
    var overlayCfg = require('./overlay.js').overlayCfg;

    var sunCorona = require('./sunCorona.js');
    var sunSpikes = require('./sunSpikes.js');
    var lensFlare = require('./lensFlare.js');
    var sineWave = require('./sineWaveModulator.js').sineWave;
    var proportionalMeasures = require('./proportionalMeasures.js');
    var muscleModifier = require('./muscleModifier.js').muscleModifier;
    var seq = require('./sequencer.js');
    var seqList = seq.seqList;
    var trackPlayer = require('./trackPlayer.js');

// base variables
    var mouseX = 0, 
        mouseY = 0, 
        lastMouseX = 0, 
        lastMouseY = 0, 
        frameRate = 60, 
        lastUpdate = Date.now(),
        mouseDown = false,
        runtime = 0,
        pLive = 0,
        globalClock = 0,
        counter = 0,
        displayOverlay = false;

// create window load function, initialise mouse tracking
    function init() {
        
        window.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        window.addEventListener('mousedown', function(e){mouseDown =true; if(typeof onMouseDown == 'function') onMouseDown() ;});
        window.addEventListener('mouseup', function(e){mouseDown = false;if(typeof onMouseUp == 'function') onMouseUp()  ;});
        window.addEventListener('keydown', function(e){if(typeof onKeyDown == 'function') onKeyDown(e)  ;});
        
        // if(typeof window.setup == 'function') window.setup();
        // cjsloop();  
        
    }

    // window load function
    // includes mouse tracking
    window.addEventListener('load',init);

// static asset canvases
let staticAssetCanvas = document.createElement('canvas');
let staticAssetCtx = staticAssetCanvas.getContext("2d");
staticAssetCanvas.width = window.innerWidth * 2;
staticAssetCanvas.height = window.innerHeight * 2;

var staticAssetConfigs = {};
var imageAssetConfigs = {};

let secondaryStaticAssetCanvas = document.createElement('canvas');
let secondaryStaticAssetCtx = secondaryStaticAssetCanvas.getContext("2d");
secondaryStaticAssetCanvas.width = window.innerWidth * 2;
secondaryStaticAssetCanvas.height = window.innerHeight * 2;

let flareAssetCanvas = document.createElement('canvas');
let flareAssetCtx = flareAssetCanvas.getContext("2d");
flareAssetCanvas.width = window.innerWidth * 2;
flareAssetCanvas.height = window.innerHeight * 2;
flareAssetCanvas.id = 'flareAssetCanvas';

let bgGlareCanvas = document.createElement('canvas');
let bgGlareCtx = bgGlareCanvas.getContext("2d");
bgGlareCanvas.width = window.innerWidth;
bgGlareCanvas.height = window.innerHeight;

let lensFlareCanvas = document.createElement('canvas');
let lensFlareCtx = lensFlareCanvas.getContext("2d");



// standard canvas rendering
// canvas housekeeping

//// Screen Renderers

// face layer
var canvas = document.querySelector("#face-layer");
var ctx = canvas.getContext("2d");

var flareLayer = document.querySelector("#flare-layer");
var flareLayerCtx = canvas.getContext("2d");

var coronaLayer = document.querySelector("#corona-layer");
var coronaLayerCtx = canvas.getContext("2d");


// cache canvas w/h
var canW = window.innerWidth;
var canH = window.innerHeight;
var canvasCentreH = canW / 2;
var canvasCentreV = canH / 2;

// set canvases to full-screen
canvas.width = canW;
canvas.height = canH;
flareLayer.width = canW;
flareLayer.height = canH;
coronaLayer.width = canW;
coronaLayer.height = canH;


// set base canvas config
var canvasConfig = {
    width: canW,
    height: canH,
    centerH: canvasCentreH,
    centerV: canvasCentreV,

    bufferClearRegion: {
        x: canvasCentreH,
        y: canvasCentreV,
        w: 0,
        h: 0
    }
};


// set buffer config for use in constrained canvas clear region
var bufferClearRegion = {
    x: canvasCentreH,
    y: canvasCentreV,
    w: 0,
    h: 0
};


// set base config for face
var sunface = {
    colours: {
        base: {
            red: '#aa0000',
            orange: '#FF9C0D',
            yellow: '#bbbb00',
            white: '#FFFFFF',
            whiteShadow: '#DDDDFF'
        },
        rgb: {
            orange: '255, 156, 13',
            whiteShadow: {
                r: 221,
                g: 221,
                b: 255
            }
        },
        rgba: {
            orangeShadow: 'rgba( 255, 156, 13, 0.3 )',
            orangeShadowLight: 'rgba( 255, 156, 13, 0.2 )',
            orangeShadowLightest: 'rgba( 255, 156, 13, 0.1 )',
            orangeShadowDarkLip: 'rgba( 255, 156, 13, 0.4 )',
            orangeShadowDark: 'rgba( 255, 156, 13, 1 )'
        },
        debug: {
            points: '#00aa00',
            handles: '#0000aa',
            lines: '#0055ff',
            orange: 'rgb( 255, 156, 13, 0.2 )',
            dimmed: 'rgba( 255, 150, 40, 0.2 )',
            fills: 'rgba( 255, 150, 40, 0.2 )',
            fillsTeeth: 'rgba( 255, 255, 255, 0.1 )'
        }
    },
    debug: {
        pointR: 4,
        handleR: 2
    },
    r: 250,
    x: canvasCentreH,
    y: canvasCentreV
    // x: 300,
    // y: 850
}

sunface.faceToStageCentreAngle = trig.angle( sunface.x, sunface.y, canvasCentreH, canvasCentreV );

let distToStageCentre = trig.dist( sunface.x, sunface.y, canvasCentreH, canvasCentreV );

function faceToStageCentreDebugLine( ctx ) {
    let currStroke = ctx.strokeStyle;
    let currFill = ctx.fillStyle;

    ctx.strokeStyle = 'rgba( 150, 150, 150, 0.6 )';
    ctx.fillStyle = 'rgba( 150, 150, 150, 1 )';

    ctx.translate( sunface.x, sunface.y );
    ctx.rotate( sunface.faceToStageCentreAngle );

    ctx.beginPath();
    ctx.moveTo( 0, 0 );
    ctx.lineTo( distToStageCentre, 0 );
    ctx.setLineDash( [5, 6] );
    ctx.stroke();
    ctx.setLineDash( [] );

    ctx.fillCircle( 0, 0, 5 );
    ctx.fillCircle( distToStageCentre, 0, 5 );

    ctx.rotate( -sunface.faceToStageCentreAngle );
    ctx.translate( -sunface.x, -sunface.y );

    let sunCtrTxt = 'Sun Centre X: '+sunface.x+' / Y: '+sunface.y;
    let stageCtrTxt = 'Stage Centre X: '+canvasCentreH+' / Y: '+canvasCentreV;

    ctx.fillText( sunCtrTxt, sunface.x + 20, sunface.y );
    ctx.fillText( stageCtrTxt, canvasCentreH + 20, canvasCentreV );

    ctx.strokeStyle = currStroke;
    ctx.fillStyle = currFill;
}

lensFlare.flareInit(
    { canvas: lensFlareCanvas, ctx: lensFlareCtx },
    { canvas: flareLayer, ctx: flareLayerCtx }
);

lensFlare.setDisplayProps( sunface.x, sunface.y, sunface.r, sunface.faceToStageCentreAngle );

lensFlare.renderFlares();
// console.log( 'sunface.faceToStageCentreAngle: ', sunface.faceToStageCentreAngle );


sunSpikes.renderCfg.canvas = staticAssetCanvas;
sunSpikes.renderCfg.context = staticAssetCtx;
sunSpikes.renderCfg.debugCfg = overlayCfg;
sunSpikes.displayCfg.glareSpikesRandom.canvas = coronaLayer;
sunSpikes.displayCfg.glareSpikesRandom.context = coronaLayerCtx;
sunSpikes.displayCfg.glareSpikesRandom.x = sunface.x;
sunSpikes.displayCfg.glareSpikesRandom.y = sunface.y;

sunSpikes.glareSpikeOptions = {
    x: staticAssetCanvas.width / 2,
    y: staticAssetCanvas.height / 2,
    r: sunface.r / 1.5,
    majorRayLen: 400,
    minorRayLen: 150,
    majorRayWidth: 0.3,
    minorRayWidth: 0.2,
    angle: Math.PI / sunface.faceToStageCentreAngle,
    count: 16,
    blur: 10
}

sunSpikes.glareSpikeRandomOptions = {
    x: staticAssetCanvas.width / 2,
    y: staticAssetCanvas.height / 2,
    r: sunface.r / 4,
    majorRayLen: sunface.r * 2,
    minorRayLen: sunface.r * 1,
    majorRayWidth: 0.005,
    minorRayWidth: 0.0005,
    angle: Math.PI / sunface.faceToStageCentreAngle,
    count: mathUtils.randomInteger( 20, 40 ),
    blur: 10
}

sunSpikes.flareOptions = {
    canvas: flareAssetCanvas,
    context: flareAssetCtx,
    x: flareAssetCanvas.width / 2,
    y: flareAssetCanvas.height / 2,
    r: sunface.r / 1.9,
    gradientWidth: sunface.r * 8,
    rayLen: sunface.r * 8,
    rayWidth: 0.03,
    angle: Math.PI / sunface.faceToStageCentreAngle,
    count: 6,
    blur: 1

    
}

// console.log( 'sunSpikes.glareSpikeOptions.r: ', sunSpikes.glareSpikeOptions );
sunSpikes.initGlareSpikeControlInputs( canvas );

// console.log( 'sunSpikes.glareSpikeControlInputCfg: ', sunSpikes.glareSpikeControlInputCfg );

// sunSpikes.renderGlareSpikes();
// sunSpikes.renderGlareSpikesRandom();
// sunSpikes.renderFlares();

// images
let rainbowGlare = new Image();   // Create new img element
rainbowGlare.src = 'images/rainbowGlare.png'; // Set source path

let rainbowGlareLong = new Image();   // Create new img element
rainbowGlareLong.src = 'images/rainbowGlareLongStrong.png'; // Set source path
rainbowGlareLongLoaded = false;
rainbowGlareLongCfg = {};

imageAssetConfigs.rainbowGlare = {
    src: rainbowGlare,
    w: 150,
    h: 60
}

rainbowGlareLong.onload = function() {

    imageAssetConfigs.rainbowGlareLong = {
        src: rainbowGlareLong,
        w: 290,
        h: 55
    };

    sunSpikes.renderRainbowSpikes(
        {   
            x: secondaryStaticAssetCanvas.width / 2,
            y: secondaryStaticAssetCanvas.height / 2,
            imageCfg: imageAssetConfigs.rainbowGlareLong,
            d: 400,
            count: 2
        },
        secondaryStaticAssetCtx
    );

    rainbowGlareLongLoaded = true;
    rainbowGlareLongCfg = sunSpikes.displayCfg.rainbowSpikes;
}

let rainbowRealImage = new Image();
rainbowRealImage.src = 'images/rainblowArcFlareReal.png';
rainbowRealImageLoaded = false;
rainbowRealImageCfg = {
    w: 1024,
    h: 1024
};

rainbowRealImage.onload = function() {
    rainbowRealImageLoaded = true;
}
// set line widths for drawing based on scene size
sunface.lines = {
    outer: Math.floor( sunface.r / 20 ),
    inner: Math.floor( sunface.r / 40 )
}


// set corona system base size
sunCorona.rayBaseRadius = sunface.r * 1.2;


// set up proprtional measurements from face radius
var pm = proportionalMeasures.setMeasures( sunface.r );

var coronaGradient = ctx.createRadialGradient(sunface.x, sunface.y, sunface.r, sunface.x, sunface.y, sunface.r * 3 );
    coronaGradient.addColorStop(0, "rgba( 255, 255, 180, 1 )");
    coronaGradient.addColorStop(1, "rgba( 255, 255, 180, 0 )");


var coronaGradient2 = ctx.createRadialGradient(sunface.x, sunface.y, sunface.r, sunface.x, sunface.y, sunface.r * 10 );
    coronaGradient2.addColorStop( 0, "rgba( 255, 255, 255, 1 )" );
    // coronaGradient2.addColorStop( 0.88, "rgba( 255, 255, 255, 0 )" );
    // coronaGradient2.addColorStop( 0.89, "rgba( 255, 255, 255, 0.8 )" );
    // coronaGradient2.addColorStop( 0.9, "rgba( 255, 255, 255, 0 )" );
    coronaGradient2.addColorStop( 1, "rgba( 255, 255, 255, 0 )" );

var coronaGradient3 = ctx.createRadialGradient(sunface.x, sunface.y, sunface.r, sunface.x, sunface.y, sunface.r * 5 );
    coronaGradient2.addColorStop( 0, "rgba( 255, 255, 255, 1 )" );
    // coronaGradient2.addColorStop( 0.88, "rgba( 255, 255, 255, 0 )" );
    // coronaGradient2.addColorStop( 0.89, "rgba( 255, 255, 255, 0.8 )" );
    // coronaGradient2.addColorStop( 0.9, "rgba( 255, 255, 255, 0 )" );
    coronaGradient2.addColorStop( 1, "rgba( 255, 255, 255, 0 )" );

var faceGradient = ctx.createRadialGradient(sunface.x, sunface.y, 0, sunface.x, sunface.y + pm.r8, sunface.r );
    faceGradient.addColorStop( 0, "rgba( 255, 255, 100, 1 )" );
    faceGradient.addColorStop( 0.7, "rgba( 255, 255, 100, 1 )" );
    faceGradient.addColorStop( 1, "rgba( 255, 255, 100, 0 )" );

var featureCreaseVerticalGradient = ctx.createLinearGradient(
    sunface.x, sunface.y, sunface.x, sunface.y + sunface.r );
    featureCreaseVerticalGradient.addColorStop(0, "rgba( 255, 156, 13, 1 )");
    featureCreaseVerticalGradient.addColorStop(1, "rgba( 255, 156, 13, 0 )");

let rainbow = ctx.createRadialGradient( sunface.x, sunface.y, sunface.r, sunface.x, sunface.y, sunface.r * 3 );
    rainbow.addColorStop( 0.4, "rgba( 255, 0, 0, 0 )" );
    rainbow.addColorStop( 0.5, "rgba( 255, 0, 0, 0.2 )" );
    rainbow.addColorStop( 0.6, "rgba( 0, 255, 0, 0.2 )" );
    rainbow.addColorStop( 0.7, "rgba( 0, 0, 255, 0.2 )" );
    rainbow.addColorStop( 0.8, "rgba( 0, 0, 255, 0 )" );



// set face colour
var faceOutlineColor = sunface.colours.base.orange;


// set up initial face coordinate vars
var eyeBaseY = sunface.y - ( pm.r3 - pm.r32 );
var leftEyeBaseX = sunface.x - pm.r2 + pm.r16 + pm.r32;
var leftEyeBaseY = eyeBaseY;
var rightEyeBaseX = sunface.x + pm.r2 - pm.r16 - pm.r32;
var rightEyeBaseY = eyeBaseY;
var eyeBaseRadius = pm.r5;

var eyebrowBaseY = eyeBaseY - pm.r24;

var mouthBaseX = sunface.x;
var mouthBaseY = sunface.y + pm.r3 + pm.r12;
var mouthBaseRadius = pm.r3;

var teethBaseCentreY = mouthBaseY - pm.r32;

// declare base config for look constraint
var aimConstraint = {
    target: {

        renderConfig: {
            radius: 30,
            baseRadius: 30,
            roundelScale: 10,
            isHit: false,
            isHighlighted: false,
            isMoving: false
        },

        config: {
            x: {
                ctrlId: 'lookTargetX',
                min: 0,
                max: canW
            },
            y: {
                ctrlId: 'lookTargetY',
                min: 0,
                max: canH,
            },
            z: {
                ctrlId: 'lookTargetZ',
                min: 100,
                max: 3000
            }
        },
        coords: {
            mouseOffset: {
                x: 0,
                y: 0
            },
            base: {
                x: canvasConfig.centerH,
                y: canvasConfig.centerV,
                z: 2000
            },
            curr: {
                x: canvasConfig.centerH,
                y: canvasConfig.centerV,
                z: 2000
            }
        }
    },
    eyes: {

        config: {
            r: eyeBaseRadius
        },

        left: {
            coords: {
                x: leftEyeBaseX,
                y: leftEyeBaseY,
                z: 0
            },
            angles: {
                xy: 0,
                zy: 0,
                xz: 0
            },
            computed: {
                x: 0,
                y: 0
            }
        },
        right: {
            coords: {
                x: rightEyeBaseX,
                y: leftEyeBaseY,
                z: 0
            },
            angles: {
                xy: 0,
                zy: 0,
                xz: 0
            },
            computed: {
                x: 0,
                y: 0
            }
        }
    },

    computeTargetAngles: function() {

        // base eye config
        var eyeConfig = this.eyes.config;

        // target
        var targetCoords = this.target.coords.curr;

        // leftEye
        var leftEyeCoords = this.eyes.left.coords;
        var leftEyeAngles = this.eyes.left.angles;
        var rightEyeCoords = this.eyes.right.coords;
        var rightEyeAngles = this.eyes.right.angles;

        // get zy and xy angles ( in radians ) from eye to target 
        var leftAngleZY = trig.angle( leftEyeCoords.z, leftEyeCoords.y, targetCoords.z, targetCoords.y );
        var leftAngleXZ = trig.angle( leftEyeCoords.x, leftEyeCoords.z, targetCoords.x, targetCoords.z );
        // console.log( 'leftAngleZY/leftAngleXZ: ', trig.radiansToDegrees( leftAngleZY ) + ', '+trig.radiansToDegrees( leftAngleXZ ) );

        // get eye position XY from computed angles
        this.eyes.left.computed.x = eyeConfig.r * Math.cos( leftAngleXZ );
        this.eyes.left.computed.y = eyeConfig.r * Math.sin( leftAngleZY );

        // get zy and xy angles ( in radians ) from eye to target 
        var rightAngleZY = trig.angle( rightEyeCoords.z, rightEyeCoords.y, targetCoords.z, targetCoords.y );
        var rightAngleXZ = trig.angle( rightEyeCoords.x, rightEyeCoords.z, targetCoords.x, targetCoords.z );
        // console.log( 'rightAngleZY/rightAngleXZ: ', trig.radiansToDegrees( rightAngleZY ) + ', '+trig.radiansToDegrees( rightAngleXZ ) );

        // get eye position XY from computed angles
        this.eyes.right.computed.x = eyeConfig.r * Math.cos( rightAngleXZ );
        this.eyes.right.computed.y = eyeConfig.r * Math.sin( rightAngleZY );
    },

    setHudControlsConfig: function() {

        var self = this.target.config;
        var selfCoords = this.target.coords;

        $( '#'+self.x.ctrlId )
            .attr( {
                'min': self.x.min,
                'max': self.x.max,
                'value': selfCoords.curr.x
            } )
            .prop( {
                'min': self.x.min,
                'max': self.x.max,
                'value': selfCoords.curr.x
            } )
            .closest( '.control--panel__item' )
            .find( 'output' )
            .html( selfCoords.curr.x / self.x.max );

        $( '#'+self.y.ctrlId )
            .attr( {
                'min': self.y.min,
                'max': self.y.max,
                'value': selfCoords.curr.y
            } )
            .prop( {
                'min': self.y.min,
                'max': self.y.max,
                'value': selfCoords.curr.y
            } )
            .closest( '.control--panel__item' )
            .find( 'output' )
            .html( selfCoords.curr.y / self.y.max );

        $( '#'+self.z.ctrlId )
            .attr( {
                'min': self.z.min,
                'max': self.z.max,
                'value': selfCoords.curr.z
            } )
            .prop( {
                'min': self.z.min,
                'max': self.z.max,
                'value': selfCoords.curr.z
            } )
            .closest( '.control--panel__item' )
            .find( 'output' )
            .html( selfCoords.curr.z / self.z.max );

            this.setCurrentSize();
    },

    setCurrentSize: function() {
        var self = this.target.coords.curr;
        var selfRenderCfg = this.target.renderConfig;
        selfRenderCfg.radius = selfRenderCfg.baseRadius + ( self.z / 50 );
    },

    renderTarget: function() {

        var self = this.target.coords.curr;
        var selfRenderCfg = this.target.renderConfig;
        ctx.strokeStyle = 'red';

        if ( !selfRenderCfg.isHighlighted ) {
            ctx.lineWidth = 2;
        } else {
            ctx.lineWidth = 4;
        }
        
        ctx.setLineDash([]);

        ctx.line( self.x - selfRenderCfg.radius, self.y, self.x + selfRenderCfg.radius, self.y );
        ctx.line( self.x, self.y - selfRenderCfg.radius, self.x, self.y + selfRenderCfg.radius );
        ctx.strokeCircle( self.x, self.y, selfRenderCfg.radius );
    },

    checkMouseHit: function() {
        var selfRenderCfg = this.target.renderConfig;
        var thisCoords = this.target.coords.curr;
        var mouseOffset = this.target.coords.mouseOffset;

        var mouseTargetDist = trig.dist( mouseX, mouseY, thisCoords.x, thisCoords.y );

        if ( mouseTargetDist < selfRenderCfg.radius ) {

            if ( !selfRenderCfg.isHit ) {
                this.setMouseOffset();
                selfRenderCfg.isHit = true;
                selfRenderCfg.isHighlighted = true;
            }

        } else {
            this.target.renderConfig.isHighlighted = false;
        }

    },

    setMouseOffset: function() {
        var thisCoords = this.target.coords.curr;
        var mouseOffset = this.target.coords.mouseOffset;
        mouseOffset.x = mouseX - thisCoords.x;
        mouseOffset.y = mouseY - thisCoords.y;
    },

    mouseMoveTarget: function() {
        var selfRenderCfg = this.target.renderConfig;
        var thisCoords = this.target.coords.curr;
        var mouseOffset = this.target.coords.mouseOffset;
        if ( selfRenderCfg.isHighlighted ) {

            thisCoords.x = mouseX - mouseOffset.x;
            thisCoords.y = mouseY - mouseOffset.y;

        }
    },

    clearActiveTarget: function() {
        var selfRenderCfg = this.target.renderConfig;
        selfRenderCfg.isHit = false;
        selfRenderCfg.isHighlighted = false;

    }
}

function onMouseUp() {
    aimConstraint.clearActiveTarget();
}

// set up look constraint for eye move system
aimConstraint.setHudControlsConfig();
aimConstraint.computeTargetAngles();


// create face coordinate measures
var baseFaceCoords = {

    eyes: {
        pupils: {
            left: {
                x: leftEyeBaseX,
                y: leftEyeBaseY,
                r: pm.r16
            },
            right: {
                x: rightEyeBaseX,
                y: rightEyeBaseY,
                r: pm.r16
            }
        },
        left: {
            lPointX: leftEyeBaseX - eyeBaseRadius, 
            lPointY: leftEyeBaseY,
            tHandleX: leftEyeBaseX,
            tHandleY: leftEyeBaseY - pm.r5,
            rPointX: leftEyeBaseX + eyeBaseRadius, 
            rPointY: leftEyeBaseY,
            bHandleX: leftEyeBaseX,
            bHandleY: leftEyeBaseY + pm.r6
        },
        right: {
            lPointX: rightEyeBaseX - eyeBaseRadius, 
            lPointY: rightEyeBaseY,
            tHandleX: rightEyeBaseX,
            tHandleY: rightEyeBaseY - pm.r5,
            rPointX: rightEyeBaseX + eyeBaseRadius, 
            rPointY: rightEyeBaseY,
            bHandleX: rightEyeBaseX,
            bHandleY: rightEyeBaseY + pm.r6
        }
    },

    eyebrows: {
        left: {
            lPointX: leftEyeBaseX - (eyeBaseRadius * 1.5), 
            lPointY: eyebrowBaseY,
            handle1X: leftEyeBaseX - pm.r8,
            handle1Y: eyebrowBaseY - pm.r4,
            handle2X: leftEyeBaseX + pm.r8,
            handle2Y: eyebrowBaseY - pm.r4,
            rPointX: leftEyeBaseX + (eyeBaseRadius * 1.5), 
            rPointY: eyebrowBaseY
        },
        right: {
            lPointX: rightEyeBaseX - (eyeBaseRadius * 1.5), 
            lPointY: eyebrowBaseY,
            handle1X: rightEyeBaseX - pm.r8,
            handle1Y: eyebrowBaseY - pm.r4,
            handle2X: rightEyeBaseX + pm.r8,
            handle2Y: eyebrowBaseY - pm.r4,
            rPointX: rightEyeBaseX + (eyeBaseRadius * 1.5), 
            rPointY: eyebrowBaseY
        }

    },

    nose: {
        point1X: leftEyeBaseX + (eyeBaseRadius * 1.5),
        point1Y: eyebrowBaseY,
        handle1X: leftEyeBaseX + (eyeBaseRadius * 1.5) - pm.r24,
        handle1Y: sunface.y - pm.r10,
        point2X: sunface.x - pm.r8,
        point2Y: sunface.y + pm.r6,
        handle2X: sunface.x,
        handle2Y: sunface.y + pm.r5,
        point3X: sunface.x + pm.r8,
        point3Y: sunface.y + pm.r6
    },

    mouth: {

        // top lip inner curve
        
        left_outer_anchor_X: mouthBaseX - mouthBaseRadius, 
        left_outer_anchor_Y: mouthBaseY,
        left_inner_anchor_X: mouthBaseX - mouthBaseRadius + pm.r8, 
        left_inner_anchor_Y: mouthBaseY,

        // from left inner
        top_left_inner_cp1_X: mouthBaseX - pm.r8 - pm.r32,
        top_left_inner_cp1_Y: mouthBaseY,
        top_left_inner_cp2_X: mouthBaseX - pm.r16 - pm.r32,
        top_left_inner_cp2_Y: mouthBaseY - pm.r32,

        // middle inner
        top_inner_anchor_X: mouthBaseX,
        top_inner_anchor_Y: mouthBaseY,

        // to right inner
        top_right_inner_cp1_X: mouthBaseX + pm.r8 + pm.r32,
        top_right_inner_cp1_Y: mouthBaseY,
        top_right_inner_cp2_X: mouthBaseX + pm.r16 + pm.r32,
        top_right_inner_cp2_Y: mouthBaseY - pm.r32,

        right_inner_anchor_X: mouthBaseX + mouthBaseRadius - pm.r8, 
        right_inner_anchor_Y: mouthBaseY,
        right_outer_anchor_X: mouthBaseX + mouthBaseRadius, 
        right_outer_anchor_Y: mouthBaseY,

        // top lip outer curve

        // from right
        top_right_outer_cp1_X: mouthBaseX + pm.r8 + pm.r16 - pm.r16,
        top_right_outer_cp1_Y: mouthBaseY + pm.r32 - pm.r32,
        top_right_outer_cp2_X: mouthBaseX + pm.r8 - pm.r16,
        top_right_outer_cp2_Y: mouthBaseY - pm.r16 - pm.r16,

        // top middle outer
        top_outer_anchor_X: mouthBaseX,
        top_outer_anchor_Y: mouthBaseY - pm.r32,

        // to left
        top_left_outer_cp1_X: mouthBaseX - pm.r8 - pm.r16 + pm.r16,
        top_left_outer_cp1_Y: mouthBaseY + pm.r32 - pm.r32,
        top_left_outer_cp2_X: mouthBaseX - pm.r8 + pm.r16,
        top_left_outer_cp2_Y: mouthBaseY - pm.r16 - pm.r16,

    // bottom lip inner curve

        // from left inner curve
        bottom_left_inner_cp1_X: mouthBaseX - pm.r8 - pm.r32,
        bottom_left_inner_cp1_Y: mouthBaseY,
        bottom_left_inner_cp2_X: mouthBaseX - pm.r16 - pm.r32,
        bottom_left_inner_cp2_Y: mouthBaseY - pm.r32,

        // bottom middle inner
        bottom_inner_anchor_X: mouthBaseX,
        bottom_inner_anchor_Y: mouthBaseY,
        
        // to right inner curve
        bottom_right_inner_cp1_X: mouthBaseX + pm.r8 + pm.r32,
        bottom_right_inner_cp1_Y: mouthBaseY,
        bottom_right_inner_cp2_X: mouthBaseX + pm.r16 + pm.r32,
        bottom_right_inner_cp2_Y: mouthBaseY - pm.r32,

        // from right outer curve
        bottom_right_outer_cp1_X: mouthBaseX + pm.r8 + pm.r32,
        bottom_right_outer_cp1_Y: mouthBaseY + pm.r8,
        bottom_right_outer_cp2_X: mouthBaseX + pm.r8,
        bottom_right_outer_cp2_Y: mouthBaseY + ( pm.r8 - pm.r32 ),

        // bottom middle outer
        bottom_outer_anchor_X: mouthBaseX,
        bottom_outer_anchor_Y: mouthBaseY + pm.r8,

        bottom_left_outer_cp1_X: mouthBaseX - pm.r8 - pm.r32,
        bottom_left_outer_cp1_Y: mouthBaseY + pm.r8,
        bottom_left_outer_cp2_X: mouthBaseX - pm.r8,
        bottom_left_outer_cp2_Y: mouthBaseY + ( pm.r8 - pm.r32 )
    },

    teeth: {
        top: {
            lPoint1X: mouthBaseX - pm.r4 - pm.r64,
            lPoint1Y: teethBaseCentreY - pm.r8 - pm.r16,
            lPoint2X: mouthBaseX - pm.r4,
            lPoint2Y: teethBaseCentreY,
            handleX: mouthBaseX,
            handleY: teethBaseCentreY + pm.r32,
            rPoint1X: mouthBaseX + pm.r4,
            rPoint1Y: teethBaseCentreY,
            rPoint2X: mouthBaseX + pm.r4 + pm.r64,
            rPoint2Y: teethBaseCentreY - pm.r8 - pm.r16
        },
        bottom: {
            lPoint1X: mouthBaseX - pm.r4 - pm.r64,
            lPoint1Y: teethBaseCentreY + pm.r8 + pm.r16,
            lPoint2X: mouthBaseX - pm.r4 - pm.r64,
            lPoint2Y: teethBaseCentreY,
            handleX: mouthBaseX,
            handleY: teethBaseCentreY + pm.r32,
            rPoint1X: mouthBaseX + pm.r4 + pm.r64,
            rPoint1Y: teethBaseCentreY,
            rPoint2X: mouthBaseX + pm.r4 + pm.r64,
            rPoint2Y: teethBaseCentreY + pm.r8 + pm.r16
        }
    },

    lip: {
        point1X: mouthBaseX - pm.r8,
        point1Y: mouthBaseY + pm.r8,
        handle1X: mouthBaseX,
        handle1Y: mouthBaseY + pm.r8 + pm.r64,
        point2X: mouthBaseX + pm.r8,
        point2Y: mouthBaseY + pm.r8
    },

    chin: {
        point1X: mouthBaseX - mouthBaseRadius + pm.r8,
        point1Y: mouthBaseY + ( pm.r2 - pm.r16 ),
        handle1X: mouthBaseX,
        handle1Y: mouthBaseY + pm.r2 + pm.r32,
        point2X: mouthBaseX + mouthBaseRadius - pm.r8,
        point2Y: mouthBaseY + ( pm.r2 - pm.r16 )
    },

    innerCheeks: {
        left: {
            tPointX: mouthBaseX - mouthBaseRadius,
            tPointY: mouthBaseY - pm.r4,
            handleX: mouthBaseX - mouthBaseRadius - pm.r8 - pm.r16,
            handleY: mouthBaseY,
            bPointX: mouthBaseX - mouthBaseRadius,
            bPointY: mouthBaseY + pm.r4
        },
        right: {
            tPointX: mouthBaseX + mouthBaseRadius,
            tPointY: mouthBaseY - pm.r4,
            handleX: mouthBaseX + mouthBaseRadius + pm.r8 + pm.r16,
            handleY: mouthBaseY,
            bPointX: mouthBaseX + mouthBaseRadius,
            bPointY: mouthBaseY + pm.r4
        },
    },

    outerCheeks: {
        left: {
            tPointX: sunface.x - pm.r2 - pm.r4 - pm.r8,
            tPointY: sunface.y + pm.r8,
            handleX: sunface.x - ( pm.r2 + pm.r8 ),
            handleY: sunface.y + pm.r8,
            bPointX: sunface.x - pm.r2 - pm.r16,
            bPointY: sunface.y + pm.r2
        },
        right: {
            tPointX: sunface.x + pm.r2 + pm.r4 + pm.r8,
            tPointY: sunface.y + pm.r8,
            handleX: sunface.x + ( pm.r2 + pm.r8 ),
            handleY: sunface.y + pm.r8,
            bPointX: sunface.x + pm.r2 + pm.r16,
            bPointY: sunface.y + pm.r2
        },
    },
    gradients: {
        topLip: {
            top_Y: 0,
            bottom_Y: 0,
            top_opacity: 0,
            bottom_opacity: 0
        },
        bottomLip: {
            top_Y: 0,
            bottom_Y: 0,
            top_opacity: 0,
            bottom_opacity: 0
        },
        teethShadow: {
            r: 221, g: 221, b: 255,
            curr: {
                r: 0, g: 0, b: 0
            }
        }
    }
}


function setBottomTeethCoords() {

    var teeth = baseFaceCoords.teeth.bottom;
    var toothBaselineY = teeth.lPoint2Y + pm.r64;
    var teethWidth = teeth.rPoint2X - teeth.lPoint2X;

    var incisorWidth = ( teethWidth * 0.6 ) / 4;
    var incisorControl = incisorWidth / 2;
    var canineWidth = ( teethWidth * 0.2 ) / 2;
    var canineControl = canineWidth / 2.5;
    var preMolarWidth = ( teethWidth * 0.2 ) / 2;
    var preMolarControl = preMolarWidth;

    teeth.config = {
        incisorWidth: ( teethWidth * 0.6 ) / 4,
        incisorControl: incisorWidth / 2,
        canineWidth: ( teethWidth * 0.2 ) / 2,
        canineControl: canineWidth / 2.5,
        preMolarWidth: ( teethWidth * 0.2 ) / 2,
        preMolarControl: preMolarWidth
    }
}

setBottomTeethCoords();

// clone base face coordinate store for use in animations
var faceCoords = JSON.parse( JSON.stringify( baseFaceCoords ) );


// set up modifier system and connect to proportional measurements
var muscleModifiers = muscleModifier.createModifiers( pm );
muscleModifier.setRangeInputs( muscleModifiers );


// init eye blink track
trackPlayer.loadTrack( 5, 'blink', seq, muscleModifiers );


// expression events

    $( '.expression-smile' ).click( function( e ){
        trackPlayer.loadTrack( 30, 'smile', seq, muscleModifiers );
        trackPlayer.startTrack( 'smile' );
    } );

    $( '.expression-smile-big' ).click( function( e ){
        trackPlayer.loadTrack( 30, 'bigSmile', seq, muscleModifiers );
        trackPlayer.startTrack( 'bigSmile' );
    } );

    $( '.expression-ecstatic' ).click( function( e ){
        trackPlayer.loadTrack( 30, 'ecstatic', seq, muscleModifiers );
        trackPlayer.startTrack( 'ecstatic' );
    } );

    $( '.expression-sad' ).click( function( e ){
        trackPlayer.loadTrack( 60, 'sad', seq, muscleModifiers );
        trackPlayer.startTrack( 'sad' );
    } );

    $( '.expression-very-sad' ).click( function( e ){
        trackPlayer.loadTrack( 60, 'bigSad', seq, muscleModifiers );
        trackPlayer.startTrack( 'bigSad' );
    } );

    $( '.expression-blink' ).click( function( e ){
        trackPlayer.loadTrack( 10, 'blink', seq, muscleModifiers );
        trackPlayer.startTrack( 'blink' );
    } );

    $( '.expression-reset' ).click( function( e ){
        trackPlayer.loadTrack( 10, 'reset', seq, muscleModifiers );
        trackPlayer.startTrack( 'reset' );
    } );


// sequence button events

    $( '.sequence-yawn' ).click( function( e ){
        trackPlayer.loadTrack( 300, 'yawn', seq, muscleModifiers );
        trackPlayer.startTrack( 'yawn' );
    } );


// control panel events
    

    // facial feature panel events
    var $featurePageParent = $( '[ data-page="page-elements" ]');

    var $featureInputs = $featurePageParent.find( '[ data-face ]' );
    $featureInputs.on( 'input', function( e ) {
        var $self = $( this );
        var getModifier = $self.data( 'modifier' );
        var getMultiplier = $self.data( 'value-multiplier' );

        var result = parseFloat( $self.val() * getMultiplier );
        muscleModifiers[ getModifier ].curr = result;
        $self.closest( '.control--panel__item' ).find( 'output' ).html( result );
    } );

    // spike Glare panel events

    let $spikeGlareElParent = $( '.js-glare-spike-effects' );
    let $spikeGlareInputs = $spikeGlareElParent.find( '.range-slider' );
    let spikeGlareControlInputLink = {
        spikeCountInput: 'count',
        spikeRadiusInput: 'r',
        spikeMajorSize: 'majorRayLen',
        spikeMinorSize: 'minorRayLen',
        spikeMajorWidth: 'majorRayWidth',
        spikeMinorWidth: 'minorRayWidth',
        spikeBlurAmount: 'blur'
    }

    $spikeGlareInputs.on( 'input', function( e ) {
        const $self = $( this )[ 0 ];
        
        const thisOpt = spikeGlareControlInputLink[ $self.id ];
        const thisOptCfg = sunSpikes.glareSpikeControlInputCfg[ thisOpt ];
        let $selfVal = parseFloat( $self.value );

        // console.log( '$selfVal: ', $selfVal );
        // console.log( '$self.id: ', $self.id );
        // console.log( 'thisOpt: ', thisOpt );
        // console.log( 'thisOptCfg: ', thisOptCfg );
        // console.log( 'thisOptCfg: ', result );

        sunSpikes.glareSpikeOptions[ thisOpt ] = $selfVal;
        sunSpikes.clearRenderCtx();
        sunSpikes.renderGlareSpikes();
    } );

// look target events
    var $LookTargetInputs = $featurePageParent.find( '.range-slider[ data-control="look" ]' );
    $LookTargetInputs.on( 'input', function( e ) {
        var $self = $( this );
        var getModifier = $self.data( 'modifier' );
        var getMultiplier = $self.data( 'value-multiplier' );
        var thisAxis = getModifier.indexOf( 'X' ) != -1 ? 'x' : getModifier.indexOf( 'Y' ) != -1 ? 'y' : getModifier.indexOf( 'Z' ) != -1 ? 'z' : false;
        // console.log( 'raw value: ', $self.val() );
        // console.log( 'getMultiplier: ', getMultiplier );
        // console.log( 'raw result: ', $self.val() * getMultiplier );

        if ( thisAxis === 'z' ) {
            aimConstraint.setCurrentSize();
        }
        var result = parseFloat( $self.val() * getMultiplier );
        aimConstraint.target.coords.curr[ thisAxis ] = result;
        $self.parent().find( 'output' ).html( result );
        // console.log( 'wrong one firing' );
    } );


function drawOverlay() {

    if ( overlayCfg.displayOverlay ) {
        // draw reference points
        ctx.strokeStyle = sunface.colours.debug.lines;
        ctx.lineWidth = 1;
        ctx.setLineDash([1, 6]);

        if ( overlayCfg.displayCentreLines ) {

            // draw centre lines
            ctx.line(
                sunface.x - ( sunface.r * 2 ), sunface.y,
                sunface.x + ( sunface.r * 2 ), sunface.y
            );


            ctx.line(
                sunface.x, sunface.y - ( sunface.r * 2 ),
                sunface.x, sunface.y + ( sunface.r * 2 )
            );

            ctx.setLineDash( [] );

        }

        if ( overlayCfg.displayLookTarget ) {
            aimConstraint.renderTarget();
        }

        if ( overlayCfg.displaySunToStage ) {
            faceToStageCentreDebugLine( ctx );
        }

        drawMuscleGroups();
    }
}

function computeFaceCoordinates() {

    // store base and current positions of features

    // eyebrows
    var eyebrowL = faceCoords.eyebrows.left;
    var eyebrowR = faceCoords.eyebrows.right;
    var baseEyebrowL = baseFaceCoords.eyebrows.left;
    var baseEyebrowR = baseFaceCoords.eyebrows.right;

    // eyes
    var eyes = faceCoords.eyes;
    var baseEyes = baseFaceCoords.eyes;

    // nose
    var nose = faceCoords.nose;
    var baseNose = baseFaceCoords.nose;

    // mouth
    var mouth = faceCoords.mouth;
    var baseMouth = baseFaceCoords.mouth;
    var lip = faceCoords.lip;
    var baseLip = baseFaceCoords.lip;

    // teeth
    var teethTop = faceCoords.teeth.top;
    var baseTeethTop = baseFaceCoords.teeth.top;
    var teethBottom = faceCoords.teeth.bottom;
    var baseTeethBottom = baseFaceCoords.teeth.bottom;

    // chin
    var chin = faceCoords.chin;
    var baseChin = baseFaceCoords.chin;

    // inner cheeks
    var cheekLeftInner = faceCoords.innerCheeks.left;
    var baseCheekLeftInner = baseFaceCoords.innerCheeks.left;
    var cheekRightInner = faceCoords.innerCheeks.right;
    var baseCheekRightInner = baseFaceCoords.innerCheeks.right;

    // outer cheeks
    var cheekLeftOuter = faceCoords.outerCheeks.left;
    var baseCheekLeftOuter = baseFaceCoords.outerCheeks.left;
    var cheekRightOuter = faceCoords.outerCheeks.right;
    var baseCheekRightOuter = baseFaceCoords.outerCheeks.right;


    // input modifier values
    var leftBrowMod = muscleModifiers.leftEyebrow.curr > 0 ? muscleModifiers.leftEyebrow.curr / 2 : muscleModifiers.leftEyebrow.curr;
    var leftBrowModQtr = leftBrowMod / 4;
    // var rightBrowMod = muscleModifiers.rightEyebrow.curr;
    var rightBrowMod = muscleModifiers.rightEyebrow.curr > 0 ? muscleModifiers.rightEyebrow.curr / 2 : muscleModifiers.rightEyebrow.curr;
    var rightBrowModQtr = rightBrowMod / 4;

    var leftBrowIndexEased = 1;
    var leftBrowModIndex = muscleModifiers.leftEyebrow.curr / muscleModifiers.leftEyebrow.min;

    if ( muscleModifiers.leftEyebrow.curr > 0 ) {
        leftBrowIndexEased = 1;
    } else {
        leftBrowIndexEased = easing.linearEase( leftBrowModIndex, 1, -1, 1 );
    }
    var leftBrowIndexEasedReverse = 1 - leftBrowIndexEased;
    var leftBrowModIndexReverse = 1 - leftBrowModIndex;



    var rightBrowIndexEased = 1;
    var rightBrowModIndex = muscleModifiers.rightEyebrow.curr / muscleModifiers.rightEyebrow.min;

    if ( muscleModifiers.rightEyebrow.curr > 0 ) {
        rightBrowIndexEased = 1;
    } else {
        rightBrowIndexEased = easing.linearEase( rightBrowModIndex, 1, -1, 1 );
    }
    var rightBrowIndexEasedReverse = 1 - rightBrowIndexEased;
    var rightBrowModIndexReverse = 1 - rightBrowModIndex;



    var leftBrowContractMod = muscleModifiers.leftBrowContract.curr;
    var leftBrowContractModIndex = leftBrowContractMod / muscleModifiers.leftBrowContract.max;
    var rightBrowContractMod = muscleModifiers.rightBrowContract.curr;
    var rightBrowContractModIndex = rightBrowContractMod / muscleModifiers.rightBrowContract.max;
    // console.log( 'leftBrowContractMod: ', leftBrowContractMod );
    // console.log( 'rightBrowContractMod: ', rightBrowContractMod );




    var leftEyeMod = muscleModifiers.leftEye.curr;
    var rightEyeMod = muscleModifiers.rightEye.curr;

    var nostrilLeftRaise = muscleModifiers.nostrilRaiseL.curr;
    var nostrilRightRaise = muscleModifiers.nostrilRaiseR.curr;

    var nostrilLeftFlare = muscleModifiers.nostrilFlareL.curr;
    var nostrilRightFlare = muscleModifiers.nostrilFlareR.curr;

    var leftCheekMod = muscleModifiers.leftCheek.curr;
    var rightCheekMod = muscleModifiers.rightCheek.curr;

    var mouthEdgeLeft = muscleModifiers.mouthEdgeLeft.curr;
    var mouthEdgeLeftIndex = mouthEdgeLeft / muscleModifiers.mouthEdgeLeft.max;
    var mouthEdgeLeftReverseIndex = 1 - mouthEdgeLeftIndex;
    var mouthEdgeRight = muscleModifiers.mouthEdgeRight.curr;
    var mouthEdgeRightIndex = mouthEdgeRight / muscleModifiers.mouthEdgeRight.max;
    var mouthEdgeRightReverseIndex = 1 - mouthEdgeRightIndex;

    var mouthEdgeLeftExtend = muscleModifiers.mouthEdgeLeftExtend.curr;
    var mouthEdgeRightExtend = muscleModifiers.mouthEdgeRightExtend.curr; 

    var topLipLeftPull = muscleModifiers.topLipLeftPull.curr;
    var topLipRightPull = muscleModifiers.topLipRightPull.curr;

    var bottomLipLeftPull = muscleModifiers.bottomLipLeftPull.curr;
    var bottomLipLeftPullIndex = bottomLipLeftPull / muscleModifiers.bottomLipLeftPull.max;
    var bottomLipLeftPullReverseIndex = 1 - bottomLipLeftPullIndex;
    var bottomLipRightPull = muscleModifiers.bottomLipRightPull.curr;
    var bottomLipRightPullIndex = bottomLipRightPull / muscleModifiers.bottomLipRightPull.max;
    var bottomLipRightPullReverseIndex = 1 - bottomLipRightPullIndex;

    var topLipOpenMod = muscleModifiers.topLipOpen.curr;
    var topLipOpenMin = muscleModifiers.topLipOpen.min;
    var topLipOpenMax = muscleModifiers.topLipOpen.max;
    var topLipChangeDelta = topLipOpenMax - topLipOpenMin;

    var topLipOpenIndex = topLipOpenMod / topLipOpenMax;
    var topLipOpenReverseIndex = 1 - topLipOpenIndex;

    var topLipLeftPullNormalised = ( topLipLeftPull * topLipOpenReverseIndex ) * 1.2;
    var topLipRightPullNormalised = ( topLipRightPull * topLipOpenReverseIndex ) * 1.2;

    // topLip eased move, using easing functions
    var topLipOpenEased = easing.easeInQuint( topLipOpenMod, topLipOpenMin, topLipChangeDelta, topLipOpenMax );

    var bottomLipOpenMod = muscleModifiers.bottomLipOpen.curr;

    var lipsPucker = muscleModifiers.lipsPucker.curr;
    var lipsPuckerMin = muscleModifiers.lipsPucker.min;
    var lipsPuckerMax = muscleModifiers.lipsPucker.max;



    var jawOpen = muscleModifiers.jawOpen.curr;
    var jawIndex = muscleModifiers.jawOpen.curr / muscleModifiers.jawOpen.max;
    var jawReverseIndex = 1 - jawIndex;

    var jawLateral = muscleModifiers.jawLateral.curr;

    // muscle modifications

    // eyebrows
    ///////////*****************************/////////////
    eyebrowL.handle1Y = baseEyebrowL.handle1Y + leftBrowMod;
    eyebrowL.handle2Y = baseEyebrowL.handle2Y + leftBrowMod;
    eyebrowL.lPointY = baseEyebrowL.lPointY + leftBrowMod * 0.25;
    eyebrowL.rPointY = baseEyebrowL.rPointY + leftBrowMod;

    eyebrowR.handle1Y = baseEyebrowR.handle1Y + rightBrowMod;
    eyebrowR.handle2Y = baseEyebrowR.handle2Y + rightBrowMod;
    eyebrowR.lPointY = baseEyebrowR.lPointY + rightBrowMod;
    eyebrowR.rPointY = baseEyebrowR.rPointY + rightBrowMod * 0.25;
    
    nose.point1Y = baseNose.point1Y + ( ( leftBrowMod + rightBrowMod ) / 2 );

    eyes.left.tHandleY = baseEyes.left.tHandleY + leftBrowModQtr;
    eyes.right.tHandleY = baseEyes.right.tHandleY + rightBrowModQtr;


    // forhead modifications
    ///////////*****************************/////////////

    eyebrowL.rPointX = baseEyebrowL.rPointX + leftBrowContractMod;
    eyebrowL.handle1X = baseEyebrowL.handle1X + leftBrowContractMod * 2;
    eyebrowL.handle2X = baseEyebrowL.handle2X + leftBrowContractMod * 2;

    eyebrowL.handle1Y -= ( ( leftBrowContractMod * 3 ) * leftBrowIndexEased );
    eyebrowL.handle2Y += ( leftBrowContractMod * 7 ) + ( ( -20 * leftBrowContractModIndex ) * leftBrowIndexEasedReverse );
    eyebrowL.rPointY -= ( leftBrowContractMod * 3 ) + ( ( 20 * leftBrowContractModIndex ) * leftBrowIndexEasedReverse );


    eyebrowR.lPointX = baseEyebrowR.lPointX - rightBrowContractMod;
    eyebrowR.handle1X = baseEyebrowR.handle1X - rightBrowContractMod * 2;
    eyebrowR.handle2X = baseEyebrowR.handle2X - rightBrowContractMod * 2;

    eyebrowR.handle2Y -= ( ( rightBrowContractMod * 3 ) * rightBrowIndexEased );
    eyebrowR.handle1Y += ( rightBrowContractMod * 7 ) + ( ( -20 * rightBrowContractModIndex ) * rightBrowIndexEasedReverse );
    eyebrowR.lPointY -= ( rightBrowContractMod * 3 ) + ( ( 20 * rightBrowContractModIndex ) * rightBrowIndexEasedReverse );


    // nose modifications from forehead ( indirect )
    ///////////*****************************/////////////
    nose.point1X = baseNose.point1X + ( ( leftBrowContractMod + rightBrowContractMod ) / 2 );

    eyes.left.bHandleY = baseEyes.left.bHandleY + leftCheekMod * 0.4;
    eyes.right.bHandleY = baseEyes.right.bHandleY + rightCheekMod * 0.4;

    // eyes mod
    var leftEyeDist = eyes.left.bHandleY - eyes.left.tHandleY;
    eyes.left.tHandleY = eyes.left.bHandleY - ( leftEyeDist * leftEyeMod );

    var rightEyeDist = eyes.right.bHandleY - eyes.right.tHandleY;
    eyes.right.tHandleY = eyes.right.bHandleY - ( rightEyeDist * rightEyeMod );

    

    // mouth ( very, VERY complicated )
    ///////////*****************************///////////// 

    // width
    mouth.left_outer_anchor_X = baseMouth.left_outer_anchor_X + mouthEdgeLeft + ( jawOpen * 0.2 );
    mouth.left_inner_anchor_X = baseMouth.left_inner_anchor_X + mouthEdgeLeft + ( jawOpen * 0.2 );
    mouth.right_outer_anchor_X = baseMouth.right_outer_anchor_X + mouthEdgeRight - ( jawOpen * 0.2 );
    mouth.right_inner_anchor_X = baseMouth.right_inner_anchor_X + mouthEdgeRight - ( jawOpen * 0.2 );

    let lipCentreXAveraged = mouth.left_inner_anchor_X + ( ( mouth.right_inner_anchor_X - mouth.left_inner_anchor_X ) / 2 );
    let lipCentreOffsetX = ( lipCentreXAveraged -  baseMouth.top_inner_anchor_X ) * 1.5;

    mouth.top_inner_anchor_X = lipCentreXAveraged;
    mouth.top_outer_anchor_X = lipCentreXAveraged;
    mouth.bottom_inner_anchor_X = baseMouth.bottom_inner_anchor_X;
    mouth.bottom_outer_anchor_X = baseMouth.bottom_outer_anchor_X;

    mouth.bottom_inner_anchor_X += lipCentreOffsetX;
    mouth.bottom_outer_anchor_X += lipCentreOffsetX;


    let topLipMax = pm.r16 + pm.r32 + pm.r64;
    let topLeftInnerCP1Change = topLipOpenEased + topLipLeftPull < topLipMax ? topLipOpenEased + topLipLeftPull : topLipMax;
    let topLeftInnerCP2Change = topLipOpenMod + ( topLipLeftPull * 0.5 ) < topLipMax ? topLipOpenMod + ( topLipLeftPull * 0.5 ) : topLipMax;

    let topRightInnerCP1Change = topLipOpenEased + topLipRightPull < topLipMax ? topLipOpenEased + topLipRightPull : topLipMax;;
    let topRightInnerCP2Change = topLipOpenMod + ( topLipRightPull * 0.5 ) < topLipMax ? topLipOpenMod + ( topLipRightPull * 0.5 ) : topLipMax;

    let topLipCentreMax = pm.r16 + pm.r32 + pm.r64;
    let topLipCentreAnchorNormalise = ( topLipLeftPull + topLipRightPull ) / 2;

    let topLipInnerCentreChange = ( topLipOpenMod * 1.1 ) + topLipCentreAnchorNormalise < topLipCentreMax ? ( topLipOpenMod * 1.1 ) + topLipCentreAnchorNormalise : topLipCentreMax;
    let topLipOuterCentreChange = ( topLipOpenMod * 1.3 ) + topLipCentreAnchorNormalise < topLipCentreMax ? ( topLipOpenMod * 1.3 ) + topLipCentreAnchorNormalise : topLipCentreMax;
    let cheeksNormalised = ( ( leftCheekMod + rightCheekMod ) / 2 );

    mouth.top_left_inner_cp1_Y = baseMouth.top_left_inner_cp1_Y + ( leftCheekMod * 0.3 ) - topLeftInnerCP1Change;
    mouth.top_left_inner_cp2_Y = baseMouth.top_left_inner_cp2_Y + ( leftCheekMod * 0.2 ) - topLeftInnerCP2Change;
    mouth.top_left_outer_cp1_Y = baseMouth.top_left_outer_cp1_Y + ( leftCheekMod * 0.3 ) - topLeftInnerCP1Change;
    mouth.top_left_outer_cp2_Y = baseMouth.top_left_outer_cp2_Y + ( leftCheekMod * 0.2 ) - topLeftInnerCP2Change;

    mouth.top_right_inner_cp1_Y = baseMouth.top_right_inner_cp1_Y + ( rightCheekMod * 0.3 ) - topRightInnerCP1Change;
    mouth.top_right_inner_cp2_Y = baseMouth.top_right_inner_cp2_Y + ( rightCheekMod * 0.2 ) - topRightInnerCP2Change;
    mouth.top_right_outer_cp1_Y = baseMouth.top_right_outer_cp1_Y + ( rightCheekMod * 0.3 ) - topRightInnerCP1Change;
    mouth.top_right_outer_cp2_Y = baseMouth.top_right_outer_cp2_Y + ( rightCheekMod * 0.2 ) - topRightInnerCP2Change;

    mouth.top_inner_anchor_Y = baseMouth.top_inner_anchor_Y + ( cheeksNormalised * 0.3 ) - topLipInnerCentreChange;
    mouth.top_outer_anchor_Y = baseMouth.top_outer_anchor_Y + ( cheeksNormalised * 0.3 ) - topLipOuterCentreChange;

    if ( lipCentreOffsetX < 0 ) {

        mouth.top_left_inner_cp1_X = baseMouth.top_left_inner_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.top_left_inner_cp2_X = baseMouth.top_left_inner_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.top_left_outer_cp1_X = baseMouth.top_left_outer_cp1_X + ( lipCentreOffsetX * 0.7 );
        mouth.top_left_outer_cp2_X = baseMouth.top_left_outer_cp2_X + ( lipCentreOffsetX );
        mouth.top_right_inner_cp1_X = baseMouth.top_right_inner_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.top_right_inner_cp2_X = baseMouth.top_right_inner_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.top_right_outer_cp1_X = baseMouth.top_right_outer_cp1_X + ( lipCentreOffsetX * 0.7 );
        mouth.top_right_outer_cp2_X = baseMouth.top_right_outer_cp2_X + ( lipCentreOffsetX );

        mouth.bottom_left_inner_cp1_X = baseMouth.bottom_left_inner_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.bottom_left_inner_cp2_X = baseMouth.bottom_left_inner_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.bottom_left_outer_cp1_X = baseMouth.bottom_left_outer_cp1_X + ( lipCentreOffsetX * 0.7 );
        mouth.bottom_left_outer_cp2_X = baseMouth.bottom_left_outer_cp2_X + ( lipCentreOffsetX );
        mouth.bottom_right_inner_cp1_X = baseMouth.bottom_right_inner_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.bottom_right_inner_cp2_X = baseMouth.bottom_right_inner_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.bottom_right_outer_cp1_X = baseMouth.bottom_right_outer_cp1_X + ( lipCentreOffsetX * 0.7 );
        mouth.bottom_right_outer_cp2_X = baseMouth.bottom_right_outer_cp2_X + ( lipCentreOffsetX );

    } else {
        mouth.top_left_inner_cp1_X = baseMouth.top_left_inner_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.top_left_inner_cp2_X = baseMouth.top_left_inner_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.top_left_outer_cp1_X = baseMouth.top_left_outer_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.top_left_outer_cp2_X = baseMouth.top_left_outer_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.top_right_inner_cp1_X = baseMouth.top_right_inner_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.top_right_inner_cp2_X = baseMouth.top_right_inner_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.top_right_outer_cp1_X = baseMouth.top_right_outer_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.top_right_outer_cp2_X = baseMouth.top_right_outer_cp2_X + ( lipCentreOffsetX * 0.8 );

        mouth.bottom_left_inner_cp1_X = baseMouth.bottom_left_inner_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.bottom_left_inner_cp2_X = baseMouth.bottom_left_inner_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.bottom_left_outer_cp1_X = baseMouth.bottom_left_outer_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.bottom_left_outer_cp2_X = baseMouth.bottom_left_outer_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.bottom_right_inner_cp1_X = baseMouth.bottom_right_inner_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.bottom_right_inner_cp2_X = baseMouth.bottom_right_inner_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.bottom_right_outer_cp1_X = baseMouth.bottom_right_outer_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.bottom_right_outer_cp2_X = baseMouth.bottom_right_outer_cp2_X + ( lipCentreOffsetX * 0.8 );
    }


    mouth.top_left_inner_cp1_X -= ( topLipOpenMod * 0.3 ) + topLipLeftPull;
    mouth.top_left_inner_cp2_X -= ( topLipOpenMod * 0.2 ) + ( topLipLeftPull * 0.2 );
    mouth.top_left_outer_cp1_X -= topLipOpenMod + topLipLeftPull;
    mouth.top_left_outer_cp2_X -= ( topLipOpenMod * 0.2 ) + ( topLipLeftPull * 0.5 );

    mouth.top_left_inner_cp1_X -= ( jawOpen * 0.3 );
    mouth.top_left_outer_cp1_X -= ( jawOpen * 0.3 );
    mouth.top_left_outer_cp2_X -= ( jawOpen * 0.2 );

    mouth.top_right_inner_cp1_X += ( topLipOpenMod * 0.3 ) + topLipRightPull;
    mouth.top_right_inner_cp2_X += ( topLipOpenMod * 0.2 ) + ( topLipRightPull * 0.2 );
    mouth.top_right_outer_cp1_X += topLipOpenMod + topLipRightPull;
    mouth.top_right_outer_cp2_X += ( topLipOpenMod * 0.2 ) + ( topLipRightPull * 0.5 );

    mouth.top_right_inner_cp1_X += ( jawOpen * 0.3 );
    mouth.top_right_outer_cp1_X += ( jawOpen * 0.3 );
    mouth.top_right_outer_cp2_X += ( jawOpen * 0.2 );

    mouth.top_outer_anchor_Y -= jawOpen * 0.05;

    

    mouth.bottom_left_inner_cp1_Y = baseMouth.bottom_left_inner_cp1_Y + ( leftCheekMod * 0.3 ) + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.9 );
    mouth.bottom_left_inner_cp2_Y = baseMouth.bottom_left_inner_cp2_Y + ( leftCheekMod * 0.2 ) + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.8 );
    mouth.bottom_right_inner_cp1_Y = baseMouth.bottom_right_inner_cp1_Y + ( rightCheekMod * 0.3 ) + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.9 );
    mouth.bottom_right_inner_cp2_Y = baseMouth.bottom_right_inner_cp2_Y + ( rightCheekMod * 0.2 ) + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.8 );

    // mouth.bottom_inner_anchor_Y = baseMouth.bottom_inner_anchor_Y + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.8 );
    // mouth.bottom_outer_anchor_Y = baseMouth.bottom_outer_anchor_Y + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.8 );

    mouth.bottom_left_outer_cp1_Y = baseMouth.bottom_left_outer_cp1_Y + ( leftCheekMod * 0.3 ) + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.9 );
    mouth.bottom_left_outer_cp2_Y = baseMouth.bottom_left_outer_cp2_Y + ( leftCheekMod * 0.2 ) + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.8 );
    mouth.bottom_right_outer_cp1_Y = baseMouth.bottom_right_outer_cp1_Y + ( rightCheekMod * 0.3 ) + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.9 );
    mouth.bottom_right_outer_cp2_Y = baseMouth.bottom_right_outer_cp2_Y + ( rightCheekMod * 0.2 ) + ( jawOpen * 0.8 ) +  ( bottomLipOpenMod * 0.8 );

    let bottomLipCentreAnchorNormalise = ( mouth.bottom_left_inner_cp2_Y - mouth.bottom_right_inner_cp2_Y ) / 2;

    mouth.bottom_inner_anchor_Y = baseMouth.bottom_inner_anchor_Y + ( cheeksNormalised * 0.3 ) + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.8 ) + bottomLipCentreAnchorNormalise;
    mouth.bottom_outer_anchor_Y = baseMouth.bottom_outer_anchor_Y + ( cheeksNormalised * 0.3 ) + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.8 ) + bottomLipCentreAnchorNormalise;


    mouth.bottom_left_inner_cp1_Y += ( ( bottomLipLeftPull * 0.7 ) * jawReverseIndex );
    mouth.bottom_left_inner_cp2_Y += ( ( bottomLipLeftPull * 0.5 ) * jawReverseIndex );
    mouth.bottom_left_outer_cp1_Y += ( ( bottomLipLeftPull * 0.7 ) * jawReverseIndex );
    mouth.bottom_left_outer_cp2_Y += ( ( bottomLipLeftPull * 0.5 ) * jawReverseIndex );

    mouth.bottom_right_inner_cp1_Y += ( ( bottomLipRightPull * 0.7 ) * jawReverseIndex );
    mouth.bottom_right_inner_cp2_Y += ( ( bottomLipRightPull * 0.5 ) * jawReverseIndex );
    mouth.bottom_right_outer_cp1_Y += ( ( bottomLipRightPull * 0.7 ) * jawReverseIndex );
    mouth.bottom_right_outer_cp2_Y += ( ( bottomLipRightPull * 0.5 ) * jawReverseIndex );


    mouth.bottom_left_inner_cp1_X -= ( bottomLipLeftPull * ( 1.3 + ( 0.6 * jawReverseIndex ) ) );
    mouth.bottom_left_inner_cp2_X -= ( bottomLipLeftPull * 0.5 );
    mouth.bottom_left_outer_cp1_X -= ( bottomLipLeftPull * ( 1.3 + ( 0.6 * jawReverseIndex ) ) );
    mouth.bottom_left_outer_cp2_X -= ( bottomLipLeftPull * 0.5 );

    mouth.bottom_right_inner_cp1_X += ( bottomLipRightPull * ( 1.3 + ( 0.6 * jawReverseIndex ) ) );
    mouth.bottom_right_inner_cp2_X += ( bottomLipRightPull * 0.5 );
    mouth.bottom_right_outer_cp1_X += ( bottomLipRightPull * ( 1.3 + ( 0.6 * jawReverseIndex ) ) );
    mouth.bottom_right_outer_cp2_X += ( bottomLipRightPull * 0.5 );


    // compute curve end points after control points to average out curves in the mouth
    // stops resulting mouth shape looking like an extreme figure of eight
    var lipEdgePartingMax = pm.r16 + pm.r32 + pm.r64;
    var lipMaxIterations = 80;
    var leftLipEdgeParting = 0;
    var leftInnerLipDist = mouth.bottom_left_inner_cp1_Y - mouth.top_left_inner_cp1_Y;
    let leftInnerLipDistWeighted = leftInnerLipDist * 0.1;
    let leftEdgeCtrlPOffset = ( mouth.left_inner_anchor_X - ( mouth.top_left_inner_cp1_X + mouth.bottom_left_inner_cp1_X ) / 2 ) / 2;
    // console.log( 'mouth.bottom_left_inner_cp1_Y - mouth.top_left_inner_cp1_Y: ', mouth.bottom_left_inner_cp1_Y - mouth.top_left_inner_cp1_Y );
    if ( leftInnerLipDist === 0 ) {
        leftLipEdgeParting = 0;
    } else {
        if ( leftInnerLipDist > lipMaxIterations ) {
            leftLipEdgeParting = lipEdgePartingMax;
        } else {
            leftLipEdgeParting = easing.easeOutQuart( leftInnerLipDist, 0, lipEdgePartingMax, lipMaxIterations );
        }
    }
    mouth.left_outer_anchor_X -= leftEdgeCtrlPOffset;
    mouth.left_inner_anchor_X -= leftEdgeCtrlPOffset;
    mouth.left_inner_anchor_X -= leftLipEdgeParting;

    var rightLipEdgeParting = 0;
    var rightInnerLipDist = mouth.bottom_right_inner_cp1_Y - mouth.top_right_inner_cp1_Y;
    let rightInnerLipDistWeighted = rightInnerLipDist * 0.1;
    let rightEdgeCtrlPOffset = ( mouth.right_inner_anchor_X - ( mouth.top_right_inner_cp1_X + mouth.bottom_right_inner_cp1_X ) / 2 ) / 2;

    if ( rightInnerLipDist === 0 ) {
        rightLipEdgeParting = 0;
    } else {
        if ( rightInnerLipDist > lipMaxIterations ) {
            rightLipEdgeParting = lipEdgePartingMax;
        } else {
            rightLipEdgeParting = easing.easeOutQuart( rightInnerLipDist, 0, lipEdgePartingMax, lipMaxIterations );
        }
    }
    mouth.right_inner_anchor_X -= rightEdgeCtrlPOffset;
    mouth.right_outer_anchor_X -= rightEdgeCtrlPOffset;
    mouth.right_inner_anchor_X += rightLipEdgeParting;

    let leftCheekMouthEdgeInfluence = leftCheekMod < 0 ? 0.4 : 0.1;
    let rightCheekMouthEdgeInfluence = rightCheekMod < 0 ? 0.4 : 0.1;
    mouth.left_outer_anchor_Y = baseMouth.left_outer_anchor_Y + ( leftCheekMod * leftCheekMouthEdgeInfluence ) + ( jawOpen * 0.25 )  + ( ( leftInnerLipDistWeighted * bottomLipLeftPullIndex ) * jawIndex);
    mouth.left_inner_anchor_Y = baseMouth.left_inner_anchor_Y + ( leftCheekMod * leftCheekMouthEdgeInfluence ) + ( jawOpen * 0.25 )  + ( ( leftInnerLipDistWeighted * bottomLipLeftPullIndex ) * jawIndex);
    mouth.right_outer_anchor_Y = baseMouth.right_outer_anchor_Y + ( rightCheekMod * rightCheekMouthEdgeInfluence ) + ( jawOpen * 0.25 ) + ( ( rightInnerLipDistWeighted * bottomLipRightPullIndex ) * jawIndex);
    mouth.right_inner_anchor_Y = baseMouth.right_inner_anchor_Y + ( rightCheekMod * rightCheekMouthEdgeInfluence ) + ( jawOpen * 0.25 ) + ( ( rightInnerLipDistWeighted * bottomLipRightPullIndex ) * jawIndex );

    let mouthEdgeLeftExtendAbsolute = mouthEdgeLeftExtend <= 0 ? mouthEdgeLeftExtend * -1 : mouthEdgeLeftExtend;
    let mouthEdgeRightExtendAbsolute = mouthEdgeRightExtend <= 0 ? mouthEdgeRightExtend * -1 : mouthEdgeRightExtend;

    mouth.left_inner_anchor_Y += mouthEdgeLeftExtend * 0.3;
    mouth.left_inner_anchor_X -= mouthEdgeLeftExtendAbsolute * 0.3;
    mouth.left_outer_anchor_Y += mouthEdgeLeftExtend * 0.7;
    

    mouth.top_left_inner_cp1_X -= mouthEdgeLeftExtendAbsolute * 0.3;
    mouth.bottom_left_inner_cp1_X -= mouthEdgeLeftExtendAbsolute * 0.3;
    mouth.top_left_inner_cp2_X -= mouthEdgeLeftExtendAbsolute * 0.3;
    mouth.bottom_left_inner_cp2_X -= mouthEdgeLeftExtendAbsolute * 0.3;

    mouth.top_left_outer_cp1_X -= mouthEdgeLeftExtendAbsolute * 0.3;

    mouth.right_inner_anchor_Y += mouthEdgeRightExtend * 0.3;
    mouth.right_inner_anchor_X += mouthEdgeRightExtendAbsolute * 0.3;
    mouth.right_outer_anchor_Y += mouthEdgeRightExtend * 0.7;

    mouth.top_right_outer_cp1_X += mouthEdgeRightExtendAbsolute * 0.3;

    mouth.top_right_inner_cp1_X += mouthEdgeRightExtendAbsolute * 0.3;
    mouth.bottom_right_inner_cp1_X += mouthEdgeRightExtendAbsolute * 0.3;
    mouth.top_right_inner_cp2_X += mouthEdgeRightExtendAbsolute * 0.3;
    mouth.bottom_right_inner_cp2_X += mouthEdgeRightExtendAbsolute * 0.3;

    if ( mouthEdgeLeftExtend > 0 && mouthEdgeRightExtend > 0 ) {
        mouth.bottom_outer_anchor_Y -= ( mouthEdgeLeftExtend + mouthEdgeRightExtend ) / 2;
    }
    


    mouth.top_left_outer_cp1_X += ( lipsPucker * 0.6 ) * jawReverseIndex;
    // mouth.top_left_outer_cp1_Y -= lipsPucker * 0.4;
    mouth.top_left_outer_cp2_X -= ( lipsPucker * 1.4 ) * jawReverseIndex;
    mouth.top_left_outer_cp2_Y -= ( lipsPucker * 0.4 ) * jawReverseIndex;

    mouth.top_outer_anchor_Y -= ( lipsPucker * 0.4 ) * jawReverseIndex;

    mouth.top_right_outer_cp1_X -= ( lipsPucker * 0.6 ) * jawReverseIndex;
    // mouth.top_right_outer_cp1_Y -= lipsPucker * 0.4;
    mouth.top_right_outer_cp2_X += ( lipsPucker * 1.4 ) * jawReverseIndex;
    mouth.top_right_outer_cp2_Y -= ( lipsPucker * 0.4 ) * jawReverseIndex;

    mouth.bottom_left_outer_cp1_X += ( lipsPucker ) * jawReverseIndex;
    mouth.bottom_left_outer_cp1_Y -= ( lipsPucker * 0.6 ) * jawReverseIndex;
    mouth.bottom_left_outer_cp2_X -= ( lipsPucker * 1.4 ) * jawReverseIndex;
    mouth.bottom_left_outer_cp2_Y += ( lipsPucker * 0.3 ) * jawReverseIndex;

    mouth.bottom_right_outer_cp1_X -= ( lipsPucker ) * jawReverseIndex;
    mouth.bottom_right_outer_cp1_Y -= ( lipsPucker * 0.6 ) * jawReverseIndex;
    mouth.bottom_right_outer_cp2_X += ( lipsPucker * 1.4 ) * jawReverseIndex;
    mouth.bottom_right_outer_cp2_Y += ( lipsPucker * 0.3 ) * jawReverseIndex;


    var mouthGradientsTop = faceCoords.gradients.topLip;
    var mouthGradientsBottom = faceCoords.gradients.bottomLip;

    mouthGradientsTop.top_Y = mouth.left_inner_anchor_Y - pm.r16;
    mouthGradientsTop.bottom_Y = mouth.left_inner_anchor_Y;
    // mouthGradientsTop.top_opacity = 0.2 * jawIndex;
    // mouthGradientsTop.bottom_opacity = 1 - ( 0.4 * jawIndex );
    mouthGradientsTop.top_opacity = 0.2 - ( 0.2 * jawIndex );
    mouthGradientsTop.bottom_opacity = 1 - ( 0.3 * jawIndex );
    mouthGradientsBottom.top_Y = mouth.bottom_inner_anchor_Y;
    mouthGradientsBottom.bottom_Y = mouth.bottom_outer_anchor_Y;
    mouthGradientsTop.top_opacity = 0.4 - ( 0.2 * jawIndex );
    mouthGradientsTop.bottom_opacity = 0.2;

    let jawColModifier = jawIndex > 0.5 ? 1 : jawIndex * 2;
    let teethShadowColour = faceCoords.gradients.teethShadow;
    teethShadowColour.curr.r =  ( ( teethShadowColour.r / 4 ) * 3 ) + ( ( teethShadowColour.r / 4 ) * jawColModifier );
    teethShadowColour.curr.g = ( ( teethShadowColour.g / 4 ) * 3 ) + ( ( teethShadowColour.g / 4 ) * jawColModifier );
    teethShadowColour.curr.b = ( ( teethShadowColour.b / 4 ) * 3 ) + ( ( teethShadowColour.b / 4 ) * jawColModifier );

    // nose
    ///////////*****************************/////////////
    nose.point2Y = baseNose.point2Y + nostrilLeftRaise;
    nose.point3Y = baseNose.point3Y + nostrilRightRaise;

    nose.point2X = baseNose.point2X + ( lipCentreOffsetX * 0.5 ) - nostrilLeftFlare;
    nose.handle2X = baseNose.handle2X + ( lipCentreOffsetX * 0.5 );
    nose.point3X = baseNose.point3X + ( lipCentreOffsetX * 0.5 ) + nostrilRightFlare;


    // lip line
    ///////////*****************************/////////////
    lip.point1X = baseLip.point1X + lipCentreOffsetX + ( jawLateral * 0.6 );
    lip.handle1X = baseLip.handle1X + lipCentreOffsetX + ( jawLateral * 0.6 );
    lip.point2X = baseLip.point2X + lipCentreOffsetX + ( jawLateral * 0.6 );

    lip.point1Y = baseLip.point1Y + ( leftCheekMod * 0.3 ) + nostrilRightRaise;
    lip.handle1Y = baseLip.handle1Y + cheeksNormalised;
    lip.point2Y = baseLip.point2Y + ( rightCheekMod * 0.3 ) + nostrilRightRaise;

    lip.point1Y += ( bottomLipOpenMod + ( jawOpen * 0.85 ) );
    lip.handle1Y += ( bottomLipOpenMod + ( jawOpen * 0.85 ) );
    lip.point2Y += ( bottomLipOpenMod + ( jawOpen * 0.85 ) );

    lip.point1Y -= ( lipsPucker * 0.5 );
    lip.point2Y -= ( lipsPucker * 0.5 );

    // cheeks
    ///////////*****************************/////////////
    cheekLeftInner.tPointY = baseCheekLeftInner.tPointY;
    cheekRightInner.tPointY = baseCheekRightInner.tPointY;

    cheekLeftInner.bPointY = baseCheekLeftInner.bPointY + ( jawOpen * 0.5 );
    cheekRightInner.bPointY = baseCheekRightInner.bPointY + ( jawOpen * 0.5 );

    cheekLeftInner.bPointX = baseCheekLeftInner.bPointX + ( jawLateral * 0.5 );
    cheekRightInner.bPointX = baseCheekRightInner.bPointX + ( jawLateral * 0.5 );

    cheekLeftInner.handleY = baseCheekLeftInner.handleY + ( leftCheekMod * 0.4 ) + mouthEdgeLeftExtend;
    cheekRightInner.handleY = baseCheekRightInner.handleY + ( rightCheekMod * 0.4 ) + mouthEdgeRightExtend;


    cheekLeftInner.handleX = baseCheekLeftInner.handleX + mouthEdgeLeft + ( mouthEdgeLeftExtend * 0.7);
    cheekRightInner.handleX = baseCheekRightInner.handleX + mouthEdgeRight - ( mouthEdgeRightExtend * 0.7);

    cheekLeftInner.handleX += ( lipsPucker * 1.5 );
    cheekRightInner.handleX -= ( lipsPucker * 1.5 );

    cheekLeftOuter.handleY = baseCheekLeftOuter.handleY + ( leftCheekMod * 0.4 );
    cheekRightOuter.handleY = baseCheekRightOuter.handleY + ( rightCheekMod * 0.4 );

    cheekLeftOuter.bPointY = baseCheekLeftOuter.bPointY + ( jawOpen * 0.3 );
    cheekRightOuter.bPointY = baseCheekRightOuter.bPointY + ( jawOpen * 0.3 );

    cheekLeftOuter.bPointX = baseCheekLeftOuter.bPointX + ( jawLateral * 0.3 );
    cheekRightOuter.bPointX = baseCheekRightOuter.bPointX + ( jawLateral * 0.3 );

    ///////////*****************************/////////////

    
    // // mouth openess
    teethBottom.lPoint1Y = baseTeethBottom.lPoint1Y + ( jawOpen * 0.95 );
    teethBottom.lPoint2Y = baseTeethBottom.lPoint2Y + ( jawOpen * 0.95 );
    teethBottom.handleY = baseTeethBottom.handleY + ( jawOpen * 0.95 );
    teethBottom.rPoint1Y = baseTeethBottom.rPoint1Y + ( jawOpen * 0.95 );
    teethBottom.rPoint2Y = baseTeethBottom.rPoint2Y + ( jawOpen * 0.95 );

    chin.point1Y = baseChin.point1Y + ( jawOpen * 0.2 );
    chin.handle1Y = baseChin.handle1Y + ( jawOpen * 0.2 );
    chin.point2Y = baseChin.point2Y + ( jawOpen * 0.2 );

    chin.point1X = baseChin.point1X + ( jawLateral * 0.2 );
    chin.handle1X = baseChin.handle1X + ( jawLateral * 0.2 );
    chin.point2X = baseChin.point2X + ( jawLateral * 0.2 );


    // jaw sideways movement
    teethBottom.lPoint1X = baseTeethBottom.lPoint1X + ( jawLateral * 0.35 );
    teethBottom.lPoint2X = baseTeethBottom.lPoint2X + ( jawLateral * 0.35 );
    teethBottom.handleX = baseTeethBottom.handleX + ( jawLateral * 0.35 );
    teethBottom.rPoint1X = baseTeethBottom.rPoint1X + ( jawLateral * 0.35 );
    teethBottom.rPoint2X = baseTeethBottom.rPoint2X + ( jawLateral * 0.35 );
}



// sunSpikes.displayGlareSpikesRandom();

function drawFace() {

    computeFaceCoordinates();
    aimConstraint.computeTargetAngles();

    ctx.fillStyle = 'rgba( 255, 255, 100, 1 )';
    ctx.fillRect( 0, 0, canvas.width, canvas.height );
    // coronaLayerCtx.globalCompositeOperation = 'source-over';
    // sunSpikes.displayCorona();
    

    // var renderFlares = sunSpikes.displayCfg.flares;

    // coronaLayerCtx.drawImage(
    //     sunSpikes.flareOptions.canvas,
    //     renderFlares.x, renderFlares.y, renderFlares.w, renderFlares.h,
    //     sunface.x - (renderFlares.w / 2 ), sunface.y - (renderFlares.h / 2 ), renderFlares.w, renderFlares.h
    // );    

    // coronaLayerCtx.globalCompositeOperation = 'lighter';

    // var renderGlare = sunSpikes.displayCfg.glareSpikesRandom.render;

    // coronaLayerCtx.drawImage(
    //     sunSpikes.renderCfg.canvas,
    //     renderGlare.x, renderGlare.y, renderGlare.w, renderGlare.h,
    //     sunface.x - (renderGlare.w / 2 ), sunface.y - (renderGlare.h / 2 ), renderGlare.w, renderGlare.h
    // );

    

    // spikes
    // sunSpikes.render( sunface.x, sunface.y, staticAssetConfigs.sunSpike, ctx );

    ////////////////////////////////////////////
    // coronaLayerCtx.globalCompositeOperation = 'source-over';

    // var renderFlares = sunSpikes.displayCfg.flares;

    // coronaLayerCtx.drawImage(
    //     renderFlares.canvas,
    //     renderFlares.x, renderFlares.y, renderFlares.w, renderFlares.h,
    //     sunface.x - (renderFlares.w / 2 ), sunface.y - (renderFlares.h / 2 ), renderFlares.w, renderFlares.h
    // );

    // coronaLayerCtx.globalCompositeOperation = 'lighter';

    // var renderGlare = sunSpikes.displayCfg.glareSpikes;

    // coronaLayerCtx.drawImage(
    //     sunSpikes.renderCfg.canvas,
    //     renderGlare.x, renderGlare.y, renderGlare.w, renderGlare.h,
    //     sunface.x - (renderGlare.w / 2 ), sunface.y - (renderGlare.h / 2 ), renderGlare.w, renderGlare.h
    // );


    ////////////////////////////////////////////
    
    

    //     sunSpikes.renderRainbowSpikes(
    //     {   
    //         x: sunface.x,
    //         y: sunface.y,
    //         imageCfg: imageAssetConfigs.rainbowGlareLong,
    //         d: 300
    //     },
    //     ctx
    // );
    

    // corona shine
    // ctx.fillStyle = coronaGradien2;
    // ctx.fillCircle( sunface.x, sunface.y, sunface.r * 3 );
    if ( !overlayCfg.displayGlareSpikes ) {
        
        // ctx.globalCompositeOperation = 'destination-over';
        // ctx.fillStyle = coronaGradient2;
        // ctx.fillCircle( sunface.x, sunface.y, sunface.r * 10 );
        
        // ctx.fillStyle = coronaGradient3;
        // ctx.fillCircle( sunface.x, sunface.y, sunface.r * 5 );

        // ctx.globalCompositeOperation = 'source-over';
        // ctx.fillStyle = coronaGradient;
        // ctx.fillCircle( sunface.x, sunface.y, sunface.r * 3 );
        // ctx.globalCompositeOperation = 'lighter';



        // sunSpikes.displayCorona();

        // var renderFlares = sunSpikes.displayCfg.flares;

        // coronaLayerCtx.drawImage(
        //     sunSpikes.flareOptions.canvas,
        //     renderFlares.x, renderFlares.y, renderFlares.w, renderFlares.h,
        //     sunface.x - (renderFlares.w / 2 ), sunface.y - (renderFlares.h / 2 ), renderFlares.w, renderFlares.h
        // );

        

        drawFeatures();

        // lensFlare.displayFlares();

    }
    
    

    // drawFeatures();

    // if ( rainbowRealImageLoaded === true ) {

    //     ctx.globalCompositeOperation = 'screen';

    //     ctx.translate( sunface.x, sunface.y );
    //     ctx.rotate( sunface.faceToStageCentreAngle );

    //     ctx.globalAlpha = 0.5;
    //     ctx.drawImage(
    //         rainbowRealImage,
    //          400 + -( rainbowRealImageCfg.w / 2 ),
    //         -( rainbowRealImageCfg.w / 2 ),
    //         rainbowRealImageCfg.w,
    //         rainbowRealImageCfg.h
    //     );
    //     ctx.globalAlpha = 1;
    //     ctx.rotate( -sunface.faceToStageCentreAngle );
    //     ctx.translate( -sunface.x, -sunface.y );
    // }


    //////////////////////////////////
}

function drawFeatures() {
    ctx.lineWidth = sunface.lines.inner;
    ctx.lineCap = 'round';
    // sunCorona.render( sunface.x, sunface.y, sineWave.val, sineWave.invVal, ctx );

    ctx.globalCompositeOperation = 'source-over';

    var leftEye = faceCoords.eyes.left;
    var rightEye = faceCoords.eyes.right;
    var mouth = faceCoords.mouth;

    // base shape
        // ctx.fillStyle = 'white';
        // ctx.fillCircle( sunface.x, sunface.y, sunface.r );
        ctx.fillStyle = faceGradient;
        ctx.fillCircle( sunface.x, sunface.y, sunface.r );
        // ctx.strokeCircle( sunface.x, sunface.y, sunface.r );

        ctx.lineWidth = sunface.lines.inner;

        if ( !overlayCfg.displayOverlay ) {

            ctx.fillStyle = sunface.colours.base.orange;
            ctx.strokeStyle = sunface.colours.base.orange;
        } else {
            ctx.fillStyle = sunface.colours.debug.dimmed;
            ctx.strokeStyle = sunface.colours.debug.dimmed;
        }

    // eye shadows
        drawEyeShadows( faceCoords.eyes, baseFaceCoords.eyes, faceCoords.eyebrows );

    // nose shadow
        drawNoseShadow( faceCoords.nose, faceCoords.mouth );

    // masks

        ctx.save();

    // left eyeshape
        ctx.beginPath();

        ctx.moveTo( leftEye.lPointX, leftEye.lPointY );
        ctx.quadraticCurveTo(
            leftEye.tHandleX, leftEye.tHandleY,
            leftEye.rPointX, leftEye.rPointY
        );
        ctx.quadraticCurveTo(
            leftEye.bHandleX, leftEye.bHandleY,
            leftEye.lPointX, leftEye.lPointY
        );
        ctx.closePath();

        ctx.clip();
        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'rgb( 230, 230, 230 )';
        } else {
            ctx.fillStyle = sunface.colours.debug.fillsTeeth;
        }

        ctx.fillRect( leftEyeBaseX - eyeBaseRadius, leftEyeBaseY - eyeBaseRadius, eyeBaseRadius * 2, eyeBaseRadius * 2 );

        drawLeftPupil( faceCoords.eyes.pupils, aimConstraint.eyes );

        ctx.restore();

    // right eyeshape
        ctx.save();

        ctx.beginPath();
        ctx.moveTo( rightEye.lPointX, rightEye.lPointY );
        ctx.quadraticCurveTo(
            rightEye.tHandleX, rightEye.tHandleY,
            rightEye.rPointX, rightEye.rPointY
        );
        ctx.quadraticCurveTo(
            rightEye.bHandleX, rightEye.bHandleY,
            rightEye.lPointX, rightEye.lPointY
        );
        ctx.closePath();

        ctx.clip();
        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'rgb( 230, 230, 230 )';
        } else {
            ctx.fillStyle = sunface.colours.debug.fillsTeeth;
        }
        ctx.fillRect( rightEyeBaseX - eyeBaseRadius, rightEyeBaseY - eyeBaseRadius, eyeBaseRadius * 2, eyeBaseRadius * 2 );

        drawRightPupil( faceCoords.eyes.pupils, aimConstraint.eyes );

        ctx.restore();

    // mouth

        ctx.save();

        // top lip shape
        ctx.beginPath();
        ctx.moveTo( mouth.left_inner_anchor_X, mouth.left_inner_anchor_Y );

        // top left inner bow
        ctx.bezierCurveTo(
            mouth.top_left_inner_cp1_X, mouth.top_left_inner_cp1_Y,
            mouth.top_left_inner_cp2_X, mouth.top_left_inner_cp2_Y,
            mouth.top_inner_anchor_X, mouth.top_inner_anchor_Y
        );

        // top right inner bow
        ctx.bezierCurveTo(
            mouth.top_right_inner_cp2_X, mouth.top_right_inner_cp2_Y,
            mouth.top_right_inner_cp1_X, mouth.top_right_inner_cp1_Y,
            mouth.right_inner_anchor_X, mouth.right_inner_anchor_Y
        );

        // bottom lip shape

        // bottom right inner bow
        ctx.bezierCurveTo(
            mouth.bottom_right_inner_cp1_X, mouth.bottom_right_inner_cp1_Y,
            mouth.bottom_right_inner_cp2_X, mouth.bottom_right_inner_cp2_Y,
            mouth.bottom_inner_anchor_X, mouth.bottom_inner_anchor_Y
        );

        // bottom left inner bow
        ctx.bezierCurveTo(
            mouth.bottom_left_inner_cp2_X, mouth.bottom_left_inner_cp2_Y,
            mouth.bottom_left_inner_cp1_X, mouth.bottom_left_inner_cp1_Y,
            mouth.left_inner_anchor_X, mouth.left_inner_anchor_Y
        );

        ctx.closePath();

        ctx.clip();

    // masked elements
        // ctx.globalCompositeOperation = 'source-atop';

        // teeth

        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'black';
        } else {
            ctx.fillStyle = 'rgba( 0, 0, 0, 0.4 )';
        }
        ctx.fillRect( mouthBaseX - pm.r2, mouthBaseY - pm.r2, sunface.r, sunface.r)

        ctx.lineWidth = sunface.lines.inner / 2;
        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'white';
        } else {
            ctx.fillStyle = sunface.colours.debug.fillsTeeth;
        }
        drawTeeth( mouth );

        ctx.lineWidth = sunface.lines.inner;

        ctx.restore();

    // drawing

        // release mask
        ctx.globalCompositeOperation = 'source-over';
        let mouthGrads = faceCoords.gradients;
        let mouthGradX = faceCoords.mouth.left_outer_anchor_X;
        // set lip gradient
        var topLipGradient = ctx.createLinearGradient(
            mouthGradX, mouthGrads.topLip.top_Y,
            mouthGradX, mouthGrads.topLip.bottom_Y
        );
        topLipGradient.addColorStop( 0, coloring.rgba( 255, 50, 13, mouthGrads.topLip.bottom_opacity ) );
        topLipGradient.addColorStop( 1, coloring.rgba( 255, 50, 13, mouthGrads.topLip.top_opacity ) );
        // topLipGradient.addColorStop( 1, sunface.colours.rgba.orangeShadowLight );

        var bottomLipGradient = ctx.createLinearGradient(
            mouthGradX, mouthGrads.bottomLip.bottom_Y,
            mouthGradX, mouthGrads.bottomLip.top_Y
        );
        bottomLipGradient.addColorStop( 0, coloring.rgba( 255, 156, 13, mouthGrads.bottomLip.bottom_opacity ) );
        // bottomLipGradient.addColorStop( 0.2, sunface.colours.rgba.orangeShadow );
        bottomLipGradient.addColorStop( 1, coloring.rgba( 255, 156, 13, mouthGrads.topLip.top_opacity ) );

        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = topLipGradient;
        } else {
            ctx.fillStyle = sunface.colours.debug.orange;
        }
    

    // Eyes
        drawEyeShapes();
    // Eyebrows
        drawEyebrows();
    // nose
        drawNose();
        ctx.lineCap="butt";

    // lip
        drawLipShadow();

    // mouth
        drawMouthShape( mouth, topLipGradient, bottomLipGradient );
    // chin
        drawChinShape();
    // cheeks
        // ctx.fillStyle = featureCreaseVerticalGradient;
        ctx.fillStyle = 'rgba( 255, 156, 13, 0.2 )';
        drawCheeks( faceCoords.innerCheeks.left, '32', pm, 5, ctx );
        drawCheeks( faceCoords.innerCheeks.right, '32', pm, 5, ctx );
        drawCheeks( faceCoords.outerCheeks.left, '16', pm, 10, ctx );
        drawCheeks( faceCoords.outerCheeks.right, '16', pm, 10, ctx );
}

// draw feature function set
    function drawEyebrows() {
        // left eyebrow
        ctx.beginPath();
        ctx.moveTo(
            faceCoords.eyebrows.left.lPointX, faceCoords.eyebrows.left.lPointY
        );
        ctx.bezierCurveTo(
            faceCoords.eyebrows.left.handle1X, faceCoords.eyebrows.left.handle1Y,
            faceCoords.eyebrows.left.handle2X, faceCoords.eyebrows.left.handle2Y,
            faceCoords.eyebrows.left.rPointX, faceCoords.eyebrows.left.rPointY
        );
        ctx.bezierCurveTo(
            faceCoords.eyebrows.left.handle2X, faceCoords.eyebrows.left.handle2Y + pm.r16,
            faceCoords.eyebrows.left.handle1X, faceCoords.eyebrows.left.handle1Y + pm.r16,
            faceCoords.eyebrows.left.lPointX, faceCoords.eyebrows.left.lPointY
        );
        ctx.fill();

        // right eyebrow
        ctx.beginPath();
        ctx.moveTo(
            faceCoords.eyebrows.right.lPointX, faceCoords.eyebrows.right.lPointY
        );
        ctx.bezierCurveTo(
            faceCoords.eyebrows.right.handle1X, faceCoords.eyebrows.right.handle1Y,
            faceCoords.eyebrows.right.handle2X, faceCoords.eyebrows.right.handle2Y,
            faceCoords.eyebrows.right.rPointX, faceCoords.eyebrows.right.rPointY
        );
        ctx.bezierCurveTo(
            faceCoords.eyebrows.right.handle2X, faceCoords.eyebrows.right.handle2Y + pm.r16,
            faceCoords.eyebrows.right.handle1X, faceCoords.eyebrows.right.handle1Y + pm.r16,
            faceCoords.eyebrows.right.lPointX, faceCoords.eyebrows.right.lPointY
        );
        ctx.fill();
    }

    function drawEyeShadows( eyes, baseEyes, eyeBrows ) {

        let leftEye = eyes.left;
        let leftEyeBase = baseEyes.left;
        let leftBrow = eyeBrows.left;
        let rightEye = eyes.right;
        let rightEyeBase = baseEyes.right;
        let rightBrow = eyeBrows.right;
        let elShift = 100000;

        ctx.shadowColor = sunface.colours.rgba.orangeShadow;
        ctx.shadowBlur = 15;

        // left eye shadow
        ctx.beginPath();
        ctx.moveTo( leftBrow.lPointX, leftBrow.lPointY - elShift );
        ctx.bezierCurveTo(
            leftBrow.handle1X, leftBrow.handle1Y - elShift,
            leftBrow.handle2X, leftBrow.handle2Y - elShift,
            leftBrow.rPointX, leftBrow.rPointY - elShift
        );
        ctx.quadraticCurveTo(
            leftEye.bHandleX + pm.r4, leftEye.bHandleY - pm.r32 - elShift,
            leftBrow.lPointX, leftBrow.lPointY - elShift
        );
        ctx.closePath();

        ctx.shadowOffsetX = -5;
        ctx.shadowOffsetY = elShift + 10;
        ctx.fill();

        // right eye shadow
        ctx.beginPath();
        ctx.moveTo( rightBrow.lPointX, rightBrow.lPointY - elShift );
        ctx.bezierCurveTo(
            rightBrow.handle1X, rightBrow.handle1Y - elShift,
            rightBrow.handle2X, rightBrow.handle2Y - elShift,
            rightBrow.rPointX, rightBrow.rPointY - elShift
        );
        ctx.quadraticCurveTo(
            rightEye.bHandleX - pm.r4, rightEye.bHandleY - pm.r32 - elShift,
            rightBrow.lPointX, rightBrow.lPointY - elShift
        );
        ctx.closePath();
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = elShift + 10;
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.shadowColor = "rgba( 255, 255, 100, 1 )";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = elShift;

        // left eyeBall shadow
        ctx.beginPath();
        ctx.moveTo( leftEyeBase.lPointX, leftEyeBase.lPointY - elShift );
        ctx.quadraticCurveTo(
            leftEyeBase.tHandleX, leftEyeBase.tHandleY - elShift,
            leftEyeBase.rPointX, leftEyeBase.rPointY - elShift
        );
        ctx.quadraticCurveTo(
            leftEyeBase.bHandleX, leftEyeBase.bHandleY - elShift,
            leftEyeBase.lPointX, leftEyeBase.lPointY - elShift
        );
        ctx.closePath();
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = elShift;
        ctx.fill();

        // right eyeBall shadow
        ctx.beginPath();
        ctx.moveTo( rightEyeBase.lPointX, rightEyeBase.lPointY - elShift );
        ctx.quadraticCurveTo(
            rightEyeBase.tHandleX, rightEyeBase.tHandleY - elShift,
            rightEyeBase.rPointX, rightEyeBase.rPointY - elShift
        );
        ctx.quadraticCurveTo(
            rightEyeBase.bHandleX, rightEyeBase.bHandleY - elShift,
            rightEyeBase.lPointX, rightEyeBase.lPointY - elShift
        );
        ctx.closePath();
        ctx.fill();

        ctx.shadowColor = sunface.colours.rgba.orangeShadowDark;
        ctx.shadowBlur = 3;
        // left eyeBall crease
        ctx.beginPath();
        ctx.moveTo( leftEyeBase.lPointX, leftEyeBase.lPointY - elShift );
        ctx.quadraticCurveTo(
            leftEyeBase.tHandleX, leftEyeBase.tHandleY - elShift,
            leftEyeBase.rPointX, leftEyeBase.rPointY - elShift
        );
        ctx.quadraticCurveTo(
            leftEyeBase.tHandleX, leftEyeBase.tHandleY - elShift + pm.r64,
            leftEyeBase.lPointX, leftEyeBase.lPointY - elShift
        );
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo( rightEyeBase.lPointX, rightEyeBase.lPointY - elShift );
        ctx.quadraticCurveTo(
            rightEyeBase.tHandleX, rightEyeBase.tHandleY - elShift,
            rightEyeBase.rPointX, rightEyeBase.rPointY - elShift
        );
        ctx.quadraticCurveTo(
            rightEyeBase.tHandleX, rightEyeBase.tHandleY - elShift + pm.r64,
            rightEyeBase.lPointX, rightEyeBase.lPointY - elShift
        );
        ctx.closePath();
        ctx.fill();


        ctx.shadowBlur = 0;
    }

    function drawEyeShapes() {

        // left eyeshape
        ctx.beginPath();
        ctx.moveTo( faceCoords.eyes.left.lPointX, faceCoords.eyes.left.lPointY );
        ctx.quadraticCurveTo(
            faceCoords.eyes.left.tHandleX, faceCoords.eyes.left.tHandleY + pm.r32,
            faceCoords.eyes.left.rPointX, faceCoords.eyes.left.rPointY
        );
        ctx.quadraticCurveTo(
            faceCoords.eyes.left.tHandleX, faceCoords.eyes.left.tHandleY - pm.r32,
            faceCoords.eyes.left.lPointX, faceCoords.eyes.left.lPointY
        );
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo( faceCoords.eyes.left.rPointX, faceCoords.eyes.left.rPointY );
        ctx.quadraticCurveTo(
            faceCoords.eyes.left.bHandleX, faceCoords.eyes.left.bHandleY,
            faceCoords.eyes.left.lPointX, faceCoords.eyes.left.lPointY
        );
        ctx.quadraticCurveTo(
            faceCoords.eyes.left.bHandleX, faceCoords.eyes.left.bHandleY + pm.r32,
            faceCoords.eyes.left.rPointX, faceCoords.eyes.left.rPointY
        );
        ctx.fill();

        // right eyeshape
        ctx.beginPath();
        ctx.moveTo( faceCoords.eyes.right.lPointX, faceCoords.eyes.right.lPointY );
        ctx.quadraticCurveTo(
            faceCoords.eyes.right.tHandleX, faceCoords.eyes.right.tHandleY + pm.r32,
            faceCoords.eyes.right.rPointX, faceCoords.eyes.right.rPointY
        );
        ctx.quadraticCurveTo(
            faceCoords.eyes.right.tHandleX, faceCoords.eyes.right.tHandleY - pm.r32,
            faceCoords.eyes.right.lPointX, faceCoords.eyes.right.lPointY
        );
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo( faceCoords.eyes.right.rPointX, faceCoords.eyes.right.rPointY );
        ctx.quadraticCurveTo(
            faceCoords.eyes.right.bHandleX, faceCoords.eyes.right.bHandleY,
            faceCoords.eyes.right.lPointX, faceCoords.eyes.right.lPointY
        );
        ctx.quadraticCurveTo(
            faceCoords.eyes.right.bHandleX, faceCoords.eyes.right.bHandleY + pm.r32,
            faceCoords.eyes.right.rPointX, faceCoords.eyes.right.rPointY
        );
        ctx.fill();
    }

    function drawLeftPupil( pupils, computedProperties ) {
        var leftEyeConstraintX, leftEyeConstraintY;

        if ( pupils.left.x + computedProperties.left.computed.x < pupils.left.x - computedProperties.config.r ) {
            leftEyeConstraintX = pupils.left.x - computedProperties.config.r;
        } else {
            if ( pupils.left.x + computedProperties.left.computed.x > pupils.left.x + computedProperties.config.r ) {
                leftEyeConstraintX = pupils.left.x + computedProperties.config.r;
            } else {
                leftEyeConstraintX = pupils.left.x + computedProperties.left.computed.x;
            }
        }

        if ( pupils.left.y + computedProperties.left.computed.y < pupils.left.y - computedProperties.config.r ) {
            leftEyeConstraintY = pupils.left.y - ( computedProperties.config.r / 1.1 );
        } else {
            if ( pupils.left.y + computedProperties.left.computed.y > pupils.left.y + ( computedProperties.config.r / 1.5 ) ) {
                leftEyeConstraintY = pupils.left.y + ( computedProperties.config.r / 1.5 );
            } else {
                leftEyeConstraintY = pupils.left.y + computedProperties.left.computed.y;
            }
        }

        var leftEyeDetails = trig.getAngleAndDistance(
            pupils.left.x, pupils.left.y,
            leftEyeConstraintX, leftEyeConstraintY
            );

        // (currentIteration, startValue, changeInValue, totalIterations)
        var leftEyeScale = easing.easeInSine( leftEyeDetails.distance, 1, -0.60 ,eyeBaseRadius);
        var leftEyeReverseScale = 1/leftEyeScale;


        // pupil
        ctx.translate( leftEyeConstraintX, leftEyeConstraintY );
        ctx.rotate( leftEyeDetails.angle );
        ctx.scale( leftEyeScale, 1 );

        // console.log( 'leftEyeDetails.angle: ', leftEyeDetails.angle );
        // console.log( 'leftEyeScale: ', leftEyeScale );

        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = sunface.colours.base.orange;
            ctx.strokeStyle = sunface.colours.base.orange;
        } else {
            ctx.fillStyle = sunface.colours.debug.dimmed;
            ctx.strokeStyle = sunface.colours.debug.dimmed;
        }

        ctx.fillCircle( 0, 0, pupils.left.r * 1.4 );

        // iris
        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'black';
        } else {
            ctx.fillStyle = 'rgba( 0, 0, 0, 0.5 )';
        }
        ctx.fillCircle( 0, 0, pupils.left.r * 0.8 );

        ctx.scale( leftEyeReverseScale, 1 );
        ctx.rotate( -leftEyeDetails.angle );
        ctx.translate( -leftEyeConstraintX, -leftEyeConstraintY );

        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'rgba( 100, 100, 200, 0.6 )';
            // ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = 'rgba( 150, 150, 255, 0 )';
        }

        var leftEye = faceCoords.eyes.left;

        // eyelid shadow
        ctx.beginPath();
        ctx.moveTo( leftEye.lPointX, leftEye.lPointY );
        ctx.quadraticCurveTo(
            leftEye.tHandleX, leftEye.tHandleY + pm.r16,
            leftEye.rPointX, leftEye.rPointY
        );
        ctx.lineTo( leftEye.rPointX, leftEye.rPointY - pm.r4 );
        ctx.lineTo( leftEye.lPointX, leftEye.lPointY - pm.r4 );
        ctx.closePath();
        ctx.fill();


        // eye spot shine
        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'rgba( 255, 255, 255, 1 )';
        } else {
            ctx.fillStyle = 'rgba( 255, 255, 255, 0.2 )';
        }
        ctx.fillCircle( leftEyeBaseX + pm.r32, leftEyeBaseY - pm.r64, pm.r32 );
    }

    function drawRightPupil( pupils, computedProperties ) {

        var rightEyeConstraintX, rightEyeConstraintY;

        if ( pupils.right.x + computedProperties.right.computed.x < pupils.right.x - computedProperties.config.r ) {
            rightEyeConstraintX = pupils.right.x - computedProperties.config.r;
        } else {
            if ( pupils.right.x + computedProperties.right.computed.x > pupils.right.x + computedProperties.config.r ) {
                rightEyeConstraintX = pupils.right.x + computedProperties.config.r;
            } else {
                rightEyeConstraintX = pupils.right.x + computedProperties.right.computed.x;
            }
        }

        if ( pupils.right.y + computedProperties.right.computed.y < pupils.right.y - computedProperties.config.r ) {
            rightEyeConstraintY = pupils.right.y - ( computedProperties.config.r / 1.1 );
        } else {
            if ( pupils.right.y + computedProperties.right.computed.y > pupils.right.y + ( computedProperties.config.r / 1.5 ) ) {
                rightEyeConstraintY = pupils.right.y + ( computedProperties.config.r / 1.5 );
            } else {
                rightEyeConstraintY = pupils.right.y + computedProperties.right.computed.y;
            }
        }

        var rightEyeDetails = trig.getAngleAndDistance(
            pupils.right.x, pupils.right.y,
            rightEyeConstraintX, rightEyeConstraintY
            );

        var rightEyeScale = easing.easeInSine( rightEyeDetails.distance, 1, -0.60 ,eyeBaseRadius);
        var rightEyeReverseScale = 1/rightEyeScale;

        // right pupil
        ctx.translate( rightEyeConstraintX, rightEyeConstraintY );
        ctx.rotate( rightEyeDetails.angle );
        ctx.scale( rightEyeScale, 1 );

        if ( !overlayCfg.displayOverlay ) {

            ctx.fillStyle = sunface.colours.base.orange;
            ctx.strokeStyle = sunface.colours.base.orange;
        } else {
            ctx.fillStyle = sunface.colours.debug.dimmed;
            ctx.strokeStyle = sunface.colours.debug.dimmed;
        }

        ctx.fillCircle( 0, 0, pupils.right.r * 1.4 );

        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'black';
        } else {
            ctx.fillStyle = 'rgba( 0, 0, 0, 0.5 )';
        }
        ctx.fillCircle( 0, 0, pupils.right.r * 0.8 );
        ctx.scale( rightEyeReverseScale, 1 );
        ctx.rotate( -rightEyeDetails.angle );
        ctx.translate( -rightEyeConstraintX, -rightEyeConstraintY );


        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'rgba( 100, 100, 200, 0.6 )';
            // ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = 'rgba( 150, 150, 255, 0 )';
        }

        var rightEye = faceCoords.eyes.right;

        ctx.beginPath();
        ctx.moveTo( rightEye.lPointX, rightEye.lPointY );
        ctx.quadraticCurveTo(
            rightEye.tHandleX, rightEye.tHandleY + pm.r16,
            rightEye.rPointX, rightEye.rPointY
        );
        ctx.lineTo( rightEye.rPointX, rightEye.rPointY - pm.r4 );
        ctx.lineTo( rightEye.lPointX, rightEye.lPointY - pm.r4 );
        ctx.closePath();
        ctx.fill();


        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'rgba( 255, 255, 255, 1 )';
        } else {
            ctx.fillStyle = 'rgba( 255, 255, 255, 0.2 )';
        }

        ctx.fillCircle( rightEyeBaseX + pm.r32, rightEyeBaseY - pm.r64, pm.r32 );
    }

    function drawCheeks( item, fillCurveOffset, propMeasure, blur,  context ) {
        
        var c = context;
        var offset = 'r'+fillCurveOffset;
        var item = item;
        var pm = propMeasure;
        var blurAmt = blur;
        var storeOffset = pm[ offset ];
        var renderOffset = 100000;

        c.beginPath();
        c.moveTo( item.tPointX, item.tPointY - renderOffset );
        c.quadraticCurveTo(
            item.handleX - storeOffset, item.handleY - renderOffset,
            item.bPointX, item.bPointY - renderOffset
        );
        c.quadraticCurveTo(
            item.handleX + storeOffset, item.handleY - renderOffset,
            item.tPointX, item.tPointY - renderOffset
        );

        c.shadowColor = sunface.colours.rgba.orangeShadowDark;
        c.shadowBlur = blurAmt;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = renderOffset;
        c.fill();
        c.shadowBlur = 0;
    }

    function drawNose() {

        ctx.beginPath();

        // point 1 ( start/finish )
        ctx.moveTo( faceCoords.nose.point1X, faceCoords.nose.point1Y + pm.r16 );

        // down curve outer
        ctx.quadraticCurveTo(
            faceCoords.nose.handle1X - pm.r32, faceCoords.nose.handle1Y,
            faceCoords.nose.point2X - pm.r32, faceCoords.nose.point2Y + pm.r32
        );
        // cross curve outer
        ctx.quadraticCurveTo(
            faceCoords.nose.handle2X, faceCoords.nose.handle2Y + pm.r32,
            faceCoords.nose.point3X, faceCoords.nose.point3Y
        );
        // cross curve inner ( return path )
        ctx.quadraticCurveTo(
            faceCoords.nose.handle2X, faceCoords.nose.handle2Y,
            faceCoords.nose.point2X, faceCoords.nose.point2Y
        );
        // down curve inner ( return path )
        ctx.quadraticCurveTo(
            faceCoords.nose.handle1X, faceCoords.nose.handle1Y,
            faceCoords.nose.point1X, faceCoords.nose.point1Y + pm.r16
        );
        ctx.closePath();
        // ctx.fill();
    }

    function drawNoseShadow( nose, mouth ) {

        let elShift = 100000;
        let nosePoints = nose;
        let mouthPoints = mouth;

        ctx.shadowColor = sunface.colours.rgba.orangeShadow;
        ctx.shadowBlur = 5;

        // nose shadow
        ctx.beginPath();
        ctx.moveTo( nosePoints.point2X - pm.r16, nosePoints.point2Y - pm.r32 - elShift );
        ctx.quadraticCurveTo(
            nosePoints.handle2X, nosePoints.handle2Y - elShift,
            nosePoints.point3X + pm.r16, nosePoints.point3Y - pm.r32 - elShift
        );
        ctx.quadraticCurveTo(
            mouthPoints.top_outer_anchor_X, mouthPoints.top_outer_anchor_Y + pm.r16 - elShift,
            nosePoints.point2X - pm.r16, nosePoints.point2Y - pm.r32 - elShift
        );
        ctx.closePath();
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = elShift;
        ctx.fill();

        ctx.shadowBlur = 1;

        ctx.beginPath();
        ctx.moveTo( nosePoints.point2X, nosePoints.point2Y - elShift );
        ctx.quadraticCurveTo(
            nosePoints.handle2X, nosePoints.handle2Y - elShift,
            nosePoints.point3X, nosePoints.point3Y - elShift
        );
        ctx.quadraticCurveTo(
            nosePoints.handle2X, nosePoints.handle2Y + pm.r16 - elShift,
            nosePoints.point2X, nosePoints.point2Y - elShift
        );
        ctx.closePath();
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = elShift - 5;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    function drawMouthShape( item, topGradient, bottomGradient ) {

        // top lip shape
        ctx.beginPath();
        ctx.moveTo( item.left_outer_anchor_X, item.left_outer_anchor_Y );
        ctx.lineTo( item.left_inner_anchor_X, item.left_inner_anchor_Y );

        // top left inner bow
        ctx.bezierCurveTo(
            item.top_left_inner_cp1_X, item.top_left_inner_cp1_Y,
            item.top_left_inner_cp2_X, item.top_left_inner_cp2_Y,
            item.top_inner_anchor_X, item.top_inner_anchor_Y
        );

        // top right inner bow
        ctx.bezierCurveTo(
            item.top_right_inner_cp2_X, item.top_right_inner_cp2_Y,
            item.top_right_inner_cp1_X, item.top_right_inner_cp1_Y,
            item.right_inner_anchor_X, item.right_inner_anchor_Y
        );

        ctx.lineTo( item.right_outer_anchor_X, item.right_outer_anchor_Y );

        // top right outer bow
        ctx.bezierCurveTo(
            item.top_right_outer_cp1_X, item.top_right_outer_cp1_Y,
            item.top_right_outer_cp2_X, item.top_right_outer_cp2_Y,
            item.top_outer_anchor_X, item.top_outer_anchor_Y
        );
        // top left outer bow
        ctx.bezierCurveTo(
            item.top_left_outer_cp2_X, item.top_left_outer_cp2_Y,
            item.top_left_outer_cp1_X , item.top_left_outer_cp1_Y,
            item.left_outer_anchor_X, item.left_outer_anchor_Y
        );
        ctx.closePath();

        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = topGradient;
        } else {
            ctx.fillStyle = sunface.colours.debug.orange;
        }

        ctx.fill();


        // bottom lip shape
        ctx.beginPath();
        ctx.moveTo( item.left_outer_anchor_X, item.left_outer_anchor_Y );
        ctx.lineTo( item.left_inner_anchor_X, item.left_inner_anchor_Y );

        // bottom left inner bow
        ctx.bezierCurveTo(
            item.bottom_left_inner_cp1_X, item.bottom_left_inner_cp1_Y,
            item.bottom_left_inner_cp2_X, item.bottom_left_inner_cp2_Y,
            item.bottom_inner_anchor_X, item.bottom_inner_anchor_Y
        );

        // bottom right inner bow
        ctx.bezierCurveTo(
            item.bottom_right_inner_cp2_X, item.bottom_right_inner_cp2_Y,
            item.bottom_right_inner_cp1_X, item.bottom_right_inner_cp1_Y,
            item.right_inner_anchor_X, item.right_inner_anchor_Y
        );

        ctx.lineTo( item.right_outer_anchor_X, item.right_outer_anchor_Y );

        // bottom right outer bow
        ctx.bezierCurveTo(
            item.bottom_right_outer_cp1_X, item.bottom_right_outer_cp1_Y,
            item.bottom_right_outer_cp2_X, item.bottom_right_outer_cp2_Y,
            item.bottom_outer_anchor_X, item.bottom_outer_anchor_Y
        );
        // bottom left outer bow
        ctx.bezierCurveTo(
            item.bottom_left_outer_cp2_X, item.bottom_left_outer_cp2_Y,
            item.bottom_left_outer_cp1_X, item.bottom_left_outer_cp1_Y,
            item.left_outer_anchor_X, item.left_outer_anchor_Y
        );
        ctx.closePath();
        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = bottomGradient;
        } else {
            ctx.fillStyle = sunface.colours.debug.orange;
        }
        ctx.fill();

        // // bottom lip shape
        // ctx.beginPath();
        // ctx.moveTo( item.left_outer_anchor_X, item.left_outer_anchor_Y - 100000 );
        // ctx.lineTo( item.left_inner_anchor_X, item.left_inner_anchor_Y - 100000 );

        // // bottom left inner bow
        // ctx.bezierCurveTo(
        //     item.bottom_left_inner_cp1_X, item.bottom_left_inner_cp1_Y - 100000,
        //     item.bottom_left_inner_cp2_X, item.bottom_left_inner_cp2_Y - 100000,
        //     item.bottom_inner_anchor_X, item.bottom_inner_anchor_Y - 100000
        // );

        // // bottom right inner bow
        // ctx.bezierCurveTo(
        //     item.bottom_right_inner_cp2_X, item.bottom_right_inner_cp2_Y - 100000,
        //     item.bottom_right_inner_cp1_X, item.bottom_right_inner_cp1_Y - 100000,
        //     item.right_inner_anchor_X, item.right_inner_anchor_Y - 100000
        // );

        // ctx.lineTo( item.right_outer_anchor_X, item.right_outer_anchor_Y - 100000 );

        // // bottom right outer bow
        // ctx.bezierCurveTo(
        //     item.bottom_right_outer_cp1_X, item.bottom_right_outer_cp1_Y - 100000,
        //     item.bottom_right_outer_cp2_X, item.bottom_right_outer_cp2_Y - 100000,
        //     item.bottom_outer_anchor_X, item.bottom_outer_anchor_Y - 100000
        // );
        // // bottom left outer bow
        // ctx.bezierCurveTo(
        //     item.bottom_left_outer_cp2_X, item.bottom_left_outer_cp2_Y - 100000,
        //     item.bottom_left_outer_cp1_X, item.bottom_left_outer_cp1_Y - 100000,
        //     item.left_outer_anchor_X, item.left_outer_anchor_Y - 100000
        // );
        // ctx.closePath();
        
        // if ( !overlayCfg.displayOverlay ) {
        //     ctx.fillStyle = sunface.colours.base.yellow;
        // } else {
        //     ctx.fillStyle = sunface.colours.debug.orange;
        // }

        // ctx.shadowColor = 'rgba( 255, 255, 100, 0.5 )';
        // ctx.shadowBlur = 15;
        // ctx.shadowOffsetX = 0;
        // ctx.shadowOffsetY = 100000;

        // ctx.fill();

        // ctx.shadowOffsetY = 0;
    }

    function drawTeeth( item ) {

        ctx.save();

        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'white';
            ctx.strokeWidth = 2;
            ctx.strokeStyle = sunface.colours.base.whiteShadow;
        } else {
            ctx.fillStyle = sunface.colours.debug.fillsTeeth;
        }

        // bottom
        drawBottomTeeth( item );

        // top
        drawTopTeeth( item );

        // teeth shadow ( dont show on debug mode )
        if ( !overlayCfg.displayOverlay ) {
            drawToothShadow( item );
        }

        ctx.restore();
    }

    function drawTopTeeth( item ) {
        // top
        var teeth = faceCoords.teeth.top;
        var toothBaselineY = teeth.lPoint2Y + pm.r64;

        ctx.beginPath();

        ctx.moveTo( teeth.lPoint1X - pm.r16 - pm.r32, teeth.lPoint1Y );
        
        /////// individual teeth
        // left canine
        ctx.lineTo( teeth.lPoint2X - pm.r16, toothBaselineY - pm.r32 );
            
        ctx.quadraticCurveTo(
            teeth.lPoint2X + pm.r128, toothBaselineY + ( pm.r16 - pm.r64 ),
            teeth.lPoint2X + pm.r64, toothBaselineY
        );
        // left incisor
        ctx.quadraticCurveTo(
            teeth.lPoint2X + pm.r16 + pm.r32, toothBaselineY + pm.r32,
            teeth.lPoint2X + pm.r8, toothBaselineY
        );
        // centre left incisor
        ctx.quadraticCurveTo(
            teeth.handleX - pm.r16, toothBaselineY + pm.r32,
            teeth.handleX, toothBaselineY + pm.r64
        );

        // centre right incisor
        ctx.quadraticCurveTo(
            teeth.handleX + pm.r16, toothBaselineY + pm.r32,
            teeth.rPoint2X - pm.r8, toothBaselineY
        );
        // right incisor
        ctx.quadraticCurveTo(
            teeth.rPoint2X - pm.r16 - pm.r32, toothBaselineY + pm.r32,
            teeth.rPoint2X - pm.r64, toothBaselineY
        );
        // right canine
        ctx.quadraticCurveTo(
            teeth.rPoint2X - pm.r128, toothBaselineY + ( pm.r16 - pm.r64 ),
            teeth.rPoint2X + pm.r16, toothBaselineY - pm.r32
        );

        ctx.lineTo( teeth.rPoint2X + pm.r16 + pm.r32, teeth.rPoint2Y );

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function drawBottomTeeth( item ) {

        var teeth = faceCoords.teeth.bottom;
        var teethConfig = teeth.config;
        var toothBaselineY = teeth.lPoint2Y + pm.r64;
        var currX = 0;
        ctx.beginPath();

        // bottom left corner
        ctx.moveTo( teeth.lPoint1X, teeth.lPoint1Y + pm.r8 );

        // left preMolar
        ctx.lineTo( teeth.lPoint2X - pm.r64, toothBaselineY + pm.r32 );
        currX = teeth.lPoint2X - pm.r64;

        ctx.quadraticCurveTo(
            currX + teethConfig.preMolarControl, toothBaselineY - pm.r32,
            currX + teethConfig.preMolarWidth, toothBaselineY
        );
        currX += teethConfig.preMolarWidth
        // left canine
        ctx.quadraticCurveTo(
            currX + teethConfig.canineControl, toothBaselineY - pm.r32 - pm.r64,
            currX + teethConfig.canineWidth, toothBaselineY
        );
        currX += teethConfig.canineWidth;

        // left incisor
        ctx.quadraticCurveTo(
            currX + teethConfig.incisorControl, toothBaselineY - pm.r64,
            currX + teethConfig.incisorWidth, toothBaselineY
        );
        currX += teethConfig.incisorWidth;

        // center left incisor
        ctx.quadraticCurveTo(
            currX + teethConfig.incisorControl, toothBaselineY - pm.r64,
            currX + teethConfig.incisorWidth, toothBaselineY
        );
        currX += teethConfig.incisorWidth;

        // center right incisor
        ctx.quadraticCurveTo(
            currX + teethConfig.incisorControl, toothBaselineY - pm.r64,
            currX + teethConfig.incisorWidth, toothBaselineY
        );
        currX += teethConfig.incisorWidth;

        // right incisor
        ctx.quadraticCurveTo(
            currX + teethConfig.incisorControl, toothBaselineY - pm.r64,
            currX + teethConfig.incisorWidth, toothBaselineY
        );
        currX += teethConfig.incisorWidth;

        // right canine
        ctx.quadraticCurveTo(
            ( currX + teethConfig.canineWidth ) - teethConfig.canineControl, toothBaselineY - pm.r32 - pm.r64,
            currX + teethConfig.canineWidth, toothBaselineY
        );
        currX += teethConfig.canineWidth;

        // right premolar
        ctx.quadraticCurveTo(
            currX + teethConfig.preMolarControl, toothBaselineY - pm.r32,
            teeth.rPoint2X + pm.r64, toothBaselineY + pm.r32
        );

        // bottom right corner
        ctx.lineTo( teeth.rPoint2X, teeth.rPoint2Y + pm.r8 );

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function drawToothShadow( item ) {
        ctx.globalCompositeOperation = 'multiply';
        let teethColour = faceCoords.gradients.teethShadow.curr;
        ctx.fillStyle = coloring.rgb( teethColour.r, teethColour.g, teethColour.b );

        // draw inverse upper lip shape
        ctx.beginPath();
        ctx.moveTo( item.left_inner_anchor_X, item.left_inner_anchor_Y - pm.r4 );
        ctx.lineTo( item.left_inner_anchor_X - pm.r8, item.left_inner_anchor_Y + pm.r16 );
        ctx.lineTo( item.left_inner_anchor_X, item.left_inner_anchor_Y + pm.r16 );

        // top left bow
        ctx.bezierCurveTo(
            item.top_left_inner_cp1_X, item.top_left_inner_cp1_Y + pm.r32,
            item.top_left_inner_cp2_X, item.top_left_inner_cp2_Y + pm.r64,
            item.top_inner_anchor_X, item.top_inner_anchor_Y + pm.r64
        );

        // top right bow
        ctx.bezierCurveTo(
            item.top_right_inner_cp2_X, item.top_right_inner_cp2_Y + pm.r64,
            item.top_right_inner_cp1_X, item.top_right_inner_cp1_Y + pm.r32,
            item.right_inner_anchor_X, item.right_inner_anchor_Y + pm.r16
        );
        ctx.lineTo( item.right_inner_anchor_X + pm.r8, item.right_inner_anchor_Y + pm.r16 );
        ctx.lineTo( item.right_inner_anchor_X, item.right_inner_anchor_Y - pm.r4 );
        ctx.closePath();
        ctx.fill();
    }

    function drawLipShadow() {

        var elShift = 100000;

        ctx.beginPath();
        ctx.moveTo( 
            faceCoords.mouth.left_outer_anchor_X + pm.r16, faceCoords.mouth.left_outer_anchor_Y - elShift );
        ctx.quadraticCurveTo(
            faceCoords.mouth.bottom_outer_anchor_X, faceCoords.mouth.bottom_outer_anchor_Y - pm.r32 - elShift,
            faceCoords.mouth.right_outer_anchor_X - pm.r16, faceCoords.mouth.right_outer_anchor_Y - elShift
        );
        ctx.lineTo( faceCoords.chin.point2X - pm.r16, ( faceCoords.chin.point2Y - pm.r4 ) - elShift );
        ctx.quadraticCurveTo(
            faceCoords.chin.handle1X, faceCoords.chin.handle1Y - pm.r4 - pm.r16 - elShift,
            faceCoords.chin.point1X + pm.r16, ( faceCoords.chin.point1Y - pm.r4 ) - elShift
        );
        ctx.closePath();
        ctx.shadowColor = sunface.colours.rgba.orangeShadow;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = elShift;
        // ctx.fillStyle = 'rgba( 0, 0, 0, 0)';
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.moveTo( 
            faceCoords.mouth.left_outer_anchor_X + pm.r16, faceCoords.mouth.left_outer_anchor_Y + pm.r16 - elShift );
        ctx.quadraticCurveTo(
            faceCoords.mouth.bottom_outer_anchor_X, faceCoords.mouth.bottom_outer_anchor_Y + pm.r16 - elShift,
            faceCoords.mouth.right_outer_anchor_X - pm.r16, faceCoords.mouth.right_outer_anchor_Y + pm.r16 - elShift
        );
        ctx.quadraticCurveTo(
            faceCoords.mouth.bottom_outer_anchor_X, faceCoords.mouth.bottom_outer_anchor_Y + pm.r8 - elShift,
            faceCoords.mouth.left_outer_anchor_X + pm.r16, faceCoords.mouth.left_outer_anchor_Y + pm.r16 - elShift
        );
        ctx.closePath();
        ctx.shadowColor = sunface.colours.rgba.orangeShadowDark;
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = elShift;
        // ctx.fillStyle = 'rgba( 0, 0, 0, 0)';
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    function drawChinShape() {

        var elShift = 100000;

        ctx.beginPath();
        ctx.moveTo( faceCoords.chin.point1X, ( faceCoords.chin.point1Y - pm.r32 ) - elShift );
        ctx.quadraticCurveTo(
            faceCoords.chin.handle1X, ( faceCoords.chin.handle1Y - pm.r32 ) - elShift,
            faceCoords.chin.point2X, ( faceCoords.chin.point2Y - pm.r32 ) - elShift
        );
        ctx.quadraticCurveTo(
            faceCoords.chin.handle1X, ( faceCoords.chin.handle1Y + pm.r32 ) - elShift,
            faceCoords.chin.point1X, ( faceCoords.chin.point1Y - pm.r32 ) - elShift
        );

        ctx.shadowColor = sunface.colours.rgba.orangeShadow;
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = elShift;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

function drawMuscleGroups() {

    var mscGrpPointRadius = 10;
    var anchorRadius = 2;
    if ( overlayCfg.displayHulls === true ) {
        anchorRadius = 4;
    }

    //////////////// Anchors ////////////////

    if ( overlayCfg.displayAnchors === true ) {

        ctx.fillStyle = 'red';

        //////// Eyebrows

        // Left
        ctx.fillCircle( faceCoords.eyebrows.left.lPointX, faceCoords.eyebrows.left.lPointY, anchorRadius );
        ctx.fillCircle( faceCoords.eyebrows.left.rPointX, faceCoords.eyebrows.left.rPointY, anchorRadius );
        // right
        ctx.fillCircle( faceCoords.eyebrows.right.lPointX, faceCoords.eyebrows.right.lPointY, anchorRadius );
        ctx.fillCircle( faceCoords.eyebrows.right.rPointX, faceCoords.eyebrows.right.rPointY, anchorRadius );


        //////// Eyes
        
        // Left
        ctx.fillCircle( faceCoords.eyes.left.lPointX, faceCoords.eyes.left.lPointY, anchorRadius );
        ctx.fillCircle( faceCoords.eyes.left.rPointX, faceCoords.eyes.left.rPointY, anchorRadius );
        // Right
        ctx.fillCircle( faceCoords.eyes.right.lPointX, faceCoords.eyes.right.lPointY, anchorRadius );
        ctx.fillCircle( faceCoords.eyes.right.rPointX, faceCoords.eyes.right.rPointY, anchorRadius );


        //////// Nose
        
        ctx.fillCircle( faceCoords.nose.point1X, faceCoords.nose.point1Y, anchorRadius );
        ctx.fillCircle( faceCoords.nose.point2X, faceCoords.nose.point2Y, anchorRadius );
        ctx.fillCircle( faceCoords.nose.point3X, faceCoords.nose.point3Y, anchorRadius );


        //////// Mouth

        // left
        ctx.fillCircle( faceCoords.mouth.left_outer_anchor_X, faceCoords.mouth.left_outer_anchor_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.left_inner_anchor_X, faceCoords.mouth.left_inner_anchor_Y, anchorRadius );
        // top
        ctx.fillCircle( faceCoords.mouth.top_inner_anchor_X, faceCoords.mouth.top_inner_anchor_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.top_outer_anchor_X, faceCoords.mouth.top_outer_anchor_Y, anchorRadius );
        // bottom
        ctx.fillCircle( faceCoords.mouth.bottom_inner_anchor_X, faceCoords.mouth.bottom_inner_anchor_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.bottom_outer_anchor_X, faceCoords.mouth.bottom_outer_anchor_Y, anchorRadius );
        // right
        ctx.fillCircle( faceCoords.mouth.right_outer_anchor_X, faceCoords.mouth.right_outer_anchor_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.right_inner_anchor_X, faceCoords.mouth.right_inner_anchor_Y, anchorRadius );

        
        //////// Lip

        ctx.fillCircle( faceCoords.lip.point1X, faceCoords.lip.point1Y, anchorRadius );
        ctx.fillCircle( faceCoords.lip.point2X, faceCoords.lip.point2Y, anchorRadius );


        //////// Chin

        ctx.fillCircle( faceCoords.chin.point1X, faceCoords.chin.point1Y, anchorRadius );
        ctx.fillCircle( faceCoords.chin.point2X, faceCoords.chin.point2Y, anchorRadius );


        //////// Inner Cheeks

        // Left
        ctx.fillCircle( faceCoords.innerCheeks.left.tPointX, faceCoords.innerCheeks.left.tPointY, anchorRadius );
        ctx.fillCircle( faceCoords.innerCheeks.left.bPointX, faceCoords.innerCheeks.left.bPointY, anchorRadius );

        // Right
        ctx.fillCircle( faceCoords.innerCheeks.right.tPointX, faceCoords.innerCheeks.right.tPointY, anchorRadius );
        ctx.fillCircle( faceCoords.innerCheeks.right.bPointX, faceCoords.innerCheeks.right.bPointY, anchorRadius );


        //////// Outer Cheeks

        // Left
        ctx.fillCircle( faceCoords.outerCheeks.left.tPointX, faceCoords.outerCheeks.left.tPointY, anchorRadius );
        ctx.fillCircle( faceCoords.outerCheeks.left.bPointX, faceCoords.outerCheeks.left.bPointY, anchorRadius );

        // Right
        ctx.fillCircle( faceCoords.outerCheeks.right.tPointX, faceCoords.outerCheeks.right.tPointY, anchorRadius );
        ctx.fillCircle( faceCoords.outerCheeks.right.bPointX, faceCoords.outerCheeks.right.bPointY, anchorRadius );

    }


    //////////////// control points ////////////////

    if ( overlayCfg.displayControlPoints === true ) {

        ctx.fillStyle = 'green';

        //////// Eyebrows

        // Left
        ctx.fillCircle( faceCoords.eyebrows.left.handle1X, faceCoords.eyebrows.left.handle1Y, anchorRadius );
        ctx.fillCircle( faceCoords.eyebrows.left.handle2X, faceCoords.eyebrows.left.handle2Y, anchorRadius );
        // Right
        ctx.fillCircle( faceCoords.eyebrows.right.handle1X, faceCoords.eyebrows.right.handle1Y, anchorRadius );
        ctx.fillCircle( faceCoords.eyebrows.right.handle2X, faceCoords.eyebrows.right.handle2Y, anchorRadius );


        //////// Eyes
        
        // Left top lid
        ctx.fillCircle( faceCoords.eyes.left.tHandleX, faceCoords.eyes.left.tHandleY, anchorRadius );
        // Left bottom lid
        ctx.fillCircle( faceCoords.eyes.left.bHandleX, faceCoords.eyes.left.bHandleY, anchorRadius );

        // Right top lid
        ctx.fillCircle( faceCoords.eyes.right.tHandleX, faceCoords.eyes.right.tHandleY, anchorRadius );
        // Right bottom lid
        ctx.fillCircle( faceCoords.eyes.right.bHandleX, faceCoords.eyes.right.bHandleY, anchorRadius );


        //////// Nose
        
        ctx.fillCircle( faceCoords.nose.handle1X, faceCoords.nose.handle1Y, anchorRadius );
        ctx.fillCircle( faceCoords.nose.handle2X, faceCoords.nose.handle2Y, anchorRadius );

        //////// Mouth

        ctx.fillCircle( faceCoords.mouth.top_left_inner_cp1_X, faceCoords.mouth.top_left_inner_cp1_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.top_left_inner_cp2_X, faceCoords.mouth.top_left_inner_cp2_Y, anchorRadius );

        ctx.fillCircle( faceCoords.mouth.top_left_outer_cp1_X, faceCoords.mouth.top_left_outer_cp1_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.top_left_outer_cp2_X, faceCoords.mouth.top_left_outer_cp2_Y, anchorRadius );

        ctx.fillCircle( faceCoords.mouth.top_right_inner_cp1_X, faceCoords.mouth.top_right_inner_cp1_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.top_right_inner_cp2_X, faceCoords.mouth.top_right_inner_cp2_Y, anchorRadius );

        ctx.fillCircle( faceCoords.mouth.top_right_outer_cp1_X, faceCoords.mouth.top_right_outer_cp1_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.top_right_outer_cp2_X, faceCoords.mouth.top_right_outer_cp2_Y, anchorRadius );

        ctx.fillCircle( faceCoords.mouth.bottom_left_inner_cp1_X, faceCoords.mouth.bottom_left_inner_cp1_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.bottom_left_inner_cp2_X, faceCoords.mouth.bottom_left_inner_cp2_Y, anchorRadius );

        ctx.fillCircle( faceCoords.mouth.bottom_left_outer_cp1_X, faceCoords.mouth.bottom_left_outer_cp1_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.bottom_left_outer_cp2_X, faceCoords.mouth.bottom_left_outer_cp2_Y, anchorRadius );

        ctx.fillCircle( faceCoords.mouth.bottom_right_inner_cp1_X, faceCoords.mouth.bottom_right_inner_cp1_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.bottom_right_inner_cp2_X, faceCoords.mouth.bottom_right_inner_cp2_Y, anchorRadius );

        ctx.fillCircle( faceCoords.mouth.bottom_right_outer_cp1_X, faceCoords.mouth.bottom_right_outer_cp1_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.bottom_right_outer_cp2_X, faceCoords.mouth.bottom_right_outer_cp2_Y, anchorRadius );


        //////// Lip
        
        ctx.fillCircle( faceCoords.lip.handle1X, faceCoords.lip.handle1Y, anchorRadius );


        //////// chin
        
        ctx.fillCircle( faceCoords.chin.handle1X, faceCoords.chin.handle1Y, anchorRadius );


        //////// Inner Cheeks

        // Left
        ctx.fillCircle( faceCoords.innerCheeks.left.handleX, faceCoords.innerCheeks.left.handleY, anchorRadius );
        // Right
        ctx.fillCircle( faceCoords.innerCheeks.right.handleX, faceCoords.innerCheeks.right.handleY, anchorRadius );


        //////// Outer Cheeks

        // Left
        ctx.fillCircle( faceCoords.outerCheeks.left.handleX, faceCoords.outerCheeks.left.handleY, anchorRadius );
        // Right
        ctx.fillCircle( faceCoords.outerCheeks.right.handleX, faceCoords.outerCheeks.right.handleY, anchorRadius );
    
    }

    //////////////// Hulls ////////////////

    if ( overlayCfg.displayHulls === true ) {

        ctx.setLineDash([3, 3]);

        //////// Eyebrows
        var browL = faceCoords.eyebrows.left;
        var browR = faceCoords.eyebrows.right;
        // Left
        ctx.line( browL.lPointX, browL.lPointY, browL.handle1X, browL.handle1Y);
        ctx.line( browL.handle1X, browL.handle1Y, browL.handle2X, browL.handle2Y);
        ctx.line( browL.handle2X, browL.handle2Y, browL.rPointX, browL.rPointY );
        // Right
        ctx.line( browR.lPointX, browR.lPointY, browR.handle1X, browR.handle1Y);
        ctx.line( browR.handle1X, browR.handle1Y, browR.handle2X, browR.handle2Y);
        ctx.line( browR.handle2X, browR.handle2Y, browR.rPointX, browR.rPointY );


        //////// Eyes
        var eyeL = faceCoords.eyes.left;
        var eyeR = faceCoords.eyes.right;
        // Left
        ctx.line( eyeL.lPointX, eyeL.lPointY, eyeL.tHandleX, eyeL.tHandleY);
        ctx.line( eyeL.tHandleX, eyeL.tHandleY, eyeL.rPointX, eyeL.rPointY );
        ctx.line( eyeL.rPointX, eyeL.rPointY, eyeL.bHandleX, eyeL.bHandleY);
        ctx.line( eyeL.bHandleX, eyeL.bHandleY, eyeL.lPointX, eyeL.lPointY );
        // Right
        ctx.line( eyeR.lPointX, eyeR.lPointY, eyeR.tHandleX, eyeR.tHandleY);
        ctx.line( eyeR.tHandleX, eyeR.tHandleY, eyeR.rPointX, eyeR.rPointY );
        ctx.line( eyeR.rPointX, eyeR.rPointY, eyeR.bHandleX, eyeR.bHandleY);
        ctx.line( eyeR.bHandleX, eyeR.bHandleY, eyeR.lPointX, eyeR.lPointY );


        //////// Nose
        var nose = faceCoords.nose;

        ctx.line( nose.point1X, nose.point1Y, nose.handle1X, nose.handle1Y);
        ctx.line( nose.handle1X, nose.handle1Y, nose.point2X, nose.point2Y);
        ctx.line( nose.point2X, nose.point2Y, nose.handle2X, nose.handle2Y);
        ctx.line( nose.handle2X, nose.handle2Y, nose.point3X, nose.point3Y);


        //////// Mouth
        var mouth = faceCoords.mouth;


        ctx.beginPath();
        ctx.moveTo( mouth.left_outer_anchor_X, mouth.left_outer_anchor_Y );
        ctx.lineTo( mouth.left_inner_anchor_X, mouth.left_inner_anchor_Y );
        ctx.lineTo( mouth.top_left_inner_cp1_X, mouth.top_left_inner_cp1_Y );
        ctx.lineTo( mouth.top_left_inner_cp2_X, mouth.top_left_inner_cp2_Y );
        ctx.lineTo( mouth.top_inner_anchor_X, mouth.top_inner_anchor_Y );
        ctx.lineTo( mouth.top_right_inner_cp2_X, mouth.top_right_inner_cp2_Y );
        ctx.lineTo( mouth.top_right_inner_cp1_X, mouth.top_right_inner_cp1_Y );
        ctx.lineTo( mouth.right_inner_anchor_X, mouth.right_inner_anchor_Y );
        ctx.lineTo( mouth.right_outer_anchor_X, mouth.right_outer_anchor_Y );
        ctx.lineTo( mouth.top_right_outer_cp1_X, mouth.top_right_outer_cp1_Y );
        ctx.lineTo( mouth.top_right_outer_cp2_X, mouth.top_right_outer_cp2_Y );
        ctx.lineTo( mouth.top_outer_anchor_X, mouth.top_outer_anchor_Y );
        ctx.lineTo( mouth.top_left_outer_cp2_X, mouth.top_left_outer_cp2_Y );
        ctx.lineTo( mouth.top_left_outer_cp1_X, mouth.top_left_outer_cp1_Y );
        ctx.lineTo( mouth.left_outer_anchor_X, mouth.left_outer_anchor_Y );
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo( mouth.left_outer_anchor_X, mouth.left_outer_anchor_Y );
        ctx.lineTo( mouth.left_inner_anchor_X, mouth.left_inner_anchor_Y );
        ctx.lineTo( mouth.bottom_left_inner_cp1_X, mouth.bottom_left_inner_cp1_Y );
        ctx.lineTo( mouth.bottom_left_inner_cp2_X, mouth.bottom_left_inner_cp2_Y );
        ctx.lineTo( mouth.bottom_inner_anchor_X, mouth.bottom_inner_anchor_Y );
        ctx.lineTo( mouth.bottom_right_inner_cp2_X, mouth.bottom_right_inner_cp2_Y );
        ctx.lineTo( mouth.bottom_right_inner_cp1_X, mouth.bottom_right_inner_cp1_Y );
        ctx.lineTo( mouth.right_inner_anchor_X, mouth.right_inner_anchor_Y );
        ctx.lineTo( mouth.right_outer_anchor_X, mouth.right_outer_anchor_Y );
        ctx.lineTo( mouth.bottom_right_outer_cp1_X, mouth.bottom_right_outer_cp1_Y );
        ctx.lineTo( mouth.bottom_right_outer_cp2_X, mouth.bottom_right_outer_cp2_Y );
        ctx.lineTo( mouth.bottom_outer_anchor_X, mouth.bottom_outer_anchor_Y );
        ctx.lineTo( mouth.bottom_left_outer_cp2_X, mouth.bottom_left_outer_cp2_Y );
        ctx.lineTo( mouth.bottom_left_outer_cp1_X, mouth.bottom_left_outer_cp1_Y );
        ctx.lineTo( mouth.left_outer_anchor_X, mouth.left_outer_anchor_Y );
        ctx.closePath();
        ctx.stroke();

        // ctx.line( mouth.lPointX, mouth.lPointY, mouth.top_left_cp1_X, mouth.top_left_cp1_Y);
        // ctx.line( mouth.top_left_cp1_X, mouth.top_left_cp1_Y, mouth.top_left_cp2_X, mouth.top_left_cp2_Y);
        // ctx.line( mouth.top_left_cp2_X, mouth.top_left_cp2_Y, mouth.top_anchor_X, mouth.top_anchor_Y);
        // ctx.line( mouth.top_anchor_X, mouth.top_anchor_Y, mouth.top_right_cp2_X, mouth.top_right_cp2_Y );
        // ctx.line( mouth.top_right_cp2_X, mouth.top_right_cp2_Y, mouth.top_right_cp1_X, mouth.top_right_cp1_Y);
        // ctx.line( mouth.top_right_cp1_X, mouth.top_right_cp1_Y, mouth.rPointX, mouth.rPointY );
        // ctx.line( mouth.rPointX, mouth.rPointY, mouth.bottom_right_cp1_X, mouth.bottom_right_cp1_Y );
        // ctx.line( mouth.bottom_right_cp1_X, mouth.bottom_right_cp1_Y, mouth.bottom_right_cp2_X, mouth.bottom_right_cp2_Y);
        // ctx.line( mouth.bottom_right_cp2_X, mouth.bottom_right_cp2_Y, mouth.bottom_anchor_X, mouth.bottom_anchor_Y);
        // ctx.line( mouth.bottom_anchor_X, mouth.bottom_anchor_Y, mouth.bottom_left_cp2_X, mouth.bottom_left_cp2_Y );
        // ctx.line( mouth.bottom_left_cp2_X, mouth.bottom_left_cp2_Y, mouth.bottom_left_cp1_X, mouth.bottom_left_cp1_Y);
        // ctx.line( mouth.bottom_left_cp1_X, mouth.bottom_left_cp1_Y, mouth.lPointX, mouth.lPointY );


        //////// Lip

        ctx.line( faceCoords.lip.point1X, faceCoords.lip.point1Y, faceCoords.lip.handle1X, faceCoords.lip.handle1Y);
        ctx.line( faceCoords.lip.handle1X, faceCoords.lip.handle1Y, faceCoords.lip.point2X, faceCoords.lip.point2Y);


        //////// Chin

        ctx.line( faceCoords.chin.point1X, faceCoords.chin.point1Y, faceCoords.chin.handle1X, faceCoords.chin.handle1Y);
        ctx.line( faceCoords.chin.handle1X, faceCoords.chin.handle1Y, faceCoords.chin.point2X, faceCoords.chin.point2Y);


        //////// Inner Cheeks
        var innerCheekL = faceCoords.innerCheeks.left;
        var innerCheekR = faceCoords.innerCheeks.right;

        // Left
        ctx.line( innerCheekL.tPointX, innerCheekL.tPointY, innerCheekL.handleX, innerCheekL.handleY);
        ctx.line( innerCheekL.handleX, innerCheekL.handleY, innerCheekL.bPointX, innerCheekL.bPointY);
        // right
        ctx.line( innerCheekR.tPointX, innerCheekR.tPointY, innerCheekR.handleX, innerCheekR.handleY);
        ctx.line( innerCheekR.handleX, innerCheekR.handleY, innerCheekR.bPointX, innerCheekR.bPointY);


        //////// Outer Cheeks
        var outerCheekL = faceCoords.outerCheeks.left;
        var outerCheekR = faceCoords.outerCheeks.right;

        // Left
        ctx.line( outerCheekL.tPointX, outerCheekL.tPointY, outerCheekL.handleX, outerCheekL.handleY);
        ctx.line( outerCheekL.handleX, outerCheekL.handleY, outerCheekL.bPointX, outerCheekL.bPointY);
        // right
        ctx.line( outerCheekR.tPointX, outerCheekR.tPointY, outerCheekR.handleX, outerCheekR.handleY);
        ctx.line( outerCheekR.handleX, outerCheekR.handleY, outerCheekR.bPointX, outerCheekR.bPointY);

        ctx.setLineDash( [] );

    }
}

function drawSunface() {
    ctx.lineWidth = sunface.lines.outer;

    if ( !overlayCfg.displayOverlay ) {
        ctx.strokeStyle = faceOutlineColor;
    } else {
        ctx.strokeStyle = sunface.colours.debug.dimmed;
    }
    
    drawFace(); 
}

function updateCycle() {
    // drawFaceGimbleControl();

    if ( mouseDown ) {
        if ( !aimConstraint.target.renderConfig.isHit ) {
            aimConstraint.checkMouseHit();
        }
        
        if ( aimConstraint.target.renderConfig.isHit ) {
            aimConstraint.mouseMoveTarget();
        }
    }


    drawSunface();
    drawOverlay();
    sineWave.modulator();
    trackPlayer.updateTrackPlayer( seq, muscleModifiers );

}

function clearCanvas(ctx) {
    // cleaning
    ctx.clearRect(0, 0, canW, canH);
    // ctx.clearRect( bufferClearRegion.x, bufferClearRegion.y, bufferClearRegion.w, bufferClearRegion.h );

    // blitCtx.clearRect( 0, 0, canW, canH );


    // ctx.fillStyle = 'rgba( 0, 0, 0, 0.1 )';
    // ctx.fillRect( 0, 0, canW, canH );

    // set dirty buffer
    // resetBufferClearRegion();
}

/////////////////////////////////////////////////////////////
// runtime
/////////////////////////////////////////////////////////////
function update() {

    // loop housekeeping
    runtime = undefined;

    // mouse tracking
    lastMouseX = mouseX; 
    lastMouseY = mouseY; 

    // clean canvas
    clearCanvas( ctx );

    // blending
    // if ( ctx.globalCompositeOperation != currTheme.contextBlendingMode ) {
    //     ctx.globalCompositeOperation = currTheme.contextBlendingMode;
    // }

    // updates
    updateCycle();

    // looping
    animation.state === true ? (runtimeEngine.startAnimation(runtime, update), counter++) : runtimeEngine.stopAnimation(runtime);

    // global clock
    // counter++;
}
/////////////////////////////////////////////////////////////
// End runtime
/////////////////////////////////////////////////////////////

if (animation.state !== true) {
    animation.state = true;
    update();
}

$( '.js-attachFlareCanvas' ).click( function( event ){

    if ( $( this ).hasClass( 'is-active' ) ){

        $( this ).removeClass( 'is-active' );
    
    } else {
    
        $( this ).addClass( 'is-active' );
        $( '.asset-canvas-display-layer' ).addClass( 'attachedCanvas' ).append( lensFlareCanvas );
    
    }

} );
},{"./animation.js":6,"./canvasApiAugmentation.js":8,"./colorUtils.js":9,"./debugUtils.js":11,"./easing.js":12,"./environment.js":14,"./gears.js":16,"./lensFlare.js":17,"./mathUtils.js":18,"./muscleModifier.js":19,"./overlay.js":20,"./proportionalMeasures.js":21,"./sequencer.js":23,"./sineWaveModulator.js":34,"./sunCorona.js":35,"./sunSpikes.js":36,"./trackPlayer.js":37,"./trigonomicUtils.js":46,"dbly-linked-list":1,"object-path":5}],8:[function(require,module,exports){
/**
* @description extends Canvas prototype with useful drawing mixins
* @kind constant
*/
var canvasDrawingApi = CanvasRenderingContext2D.prototype;

/**
* @augments canvasDrawingApi
* @description draw circle API
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/
canvasDrawingApi.circle = function (x, y, r) {
	this.beginPath();
	this.arc(x, y, r, 0, Math.PI * 2, true);
};

/**
* @augments canvasDrawingApi
* @description API to draw filled circle
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/
canvasDrawingApi.fillCircle = function (x, y, r, context) {
	this.circle(x, y, r, context);
	this.fill();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw stroked circle
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/
canvasDrawingApi.strokeCircle = function (x, y, r) {
	this.circle(x, y, r);
	this.stroke();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw ellipse.
* @param {number} x - origin X of ellipse.
* @param {number} y - ofigin Y or ellipse.
* @param {number} w - width of ellipse.
* @param {number} w - height of ellipse.
*/
canvasDrawingApi.ellipse = function (x, y, w, h) {
	this.beginPath();
	for (var i = 0; i < Math.PI * 2; i += Math.PI / 16) {
		this.lineTo(x + Math.cos(i) * w / 2, y + Math.sin(i) * h / 2);
	}
	this.closePath();
};

/**
* @augments canvasDrawingApi
* @description API to draw filled ellipse.
* @param {number} x - origin X of ellipse.
* @param {number} y - ofigin Y or ellipse.
* @param {number} w - width of ellipse.
* @param {number} w - height of ellipse.
*/
canvasDrawingApi.fillEllipse = function (x, y, w, h) {
	this.ellipse(x, y, w, h, context);
	this.fill();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw stroked ellipse.
* @param {number} x - origin X of ellipse.
* @param {number} y - ofigin Y or ellipse.
* @param {number} w - width of ellipse.
* @param {number} w - height of ellipse.
*/
canvasDrawingApi.strokeEllipse = function (x, y, w, h) {
	this.ellipse(x, y, w, h);
	this.stroke();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw line between 2 vector coordinates.
* @param {number} x1 - X coordinate of vector 1.
* @param {number} y1 - Y coordinate of vector 1.
* @param {number} x2 - X coordinate of vector 2.
* @param {number} y2 - Y coordinate of vector 2.
*/
canvasDrawingApi.line = function (x1, y1, x2, y2) {
	this.beginPath();
	this.moveTo(x1, y1);
	this.lineTo(x2, y2);
	this.stroke();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw stroked regular polygon shape.
* @param {number} x - X coordinate of the polygon origin.
* @param {number} y - Y coordinate of the polygon origin.
* @param {number} r - Radius of the polygon.
* @param {number} s - Number of sides.
* @param {number} ctx - The canvas context to output.
*/
canvasDrawingApi.strokePoly = function ( x, y, r, s, ctx ) {
	
	var sides = s;
	var radius = r;
	var cx = x;
	var cy = y;
	var angle = 2 * Math.PI / sides;
	
	ctx.beginPath();
	ctx.translate( cx, cy );
	ctx.moveTo( radius, 0 );          
	for ( var i = 1; i <= sides; i++ ) {
		ctx.lineTo(
			radius * Math.cos( i * angle ),
			radius * Math.sin( i * angle )
		);
	}
	ctx.stroke();
	ctx.translate( -cx, -cy );
}

/**
* @augments canvasDrawingApi
* @description API to draw filled regular polygon shape.
* @param {number} x - X coordinate of the polygon origin.
* @param {number} y - Y coordinate of the polygon origin.
* @param {number} r - Radius of the polygon.
* @param {number} s - Number of sides.
* @param {number} ctx - The canvas context to output.
*/
canvasDrawingApi.fillPoly = function ( x, y, r, s, ctx ) {
	
	var sides = s;
	var radius = r;
	var cx = x;
	var cy = y;
	var angle = 2 * Math.PI / sides;
	
	ctx.beginPath();
	ctx.translate( cx, cy );
	ctx.moveTo( radius, 0 );          
	for ( var i = 1; i <= sides; i++ ) {
		ctx.lineTo(
			radius * Math.cos( i * angle ),
			radius * Math.sin( i * angle )
		);
	}
	ctx.fill();
	ctx.translate( -cx, -cy );
	
}
module.exports = canvasDrawingApi;
},{}],9:[function(require,module,exports){
var mathUtils = require('./mathUtils.js').mathUtils;

var colorUtils = {
	/**
 * provides color util methods.
 */
	rgb: function rgb(red, green, blue) {
		return 'rgb(' + mathUtils.clamp(Math.round(red), 0, 255) + ', ' + mathUtils.clamp(Math.round(green), 0, 255) + ', ' + mathUtils.clamp(Math.round(blue), 0, 255) + ')';
	},
	rgba: function rgba(red, green, blue, alpha) {
		return 'rgba(' + mathUtils.clamp(Math.round(red), 0, 255) + ', ' + mathUtils.clamp(Math.round(green), 0, 255) + ', ' + mathUtils.clamp(Math.round(blue), 0, 255) + ', ' + mathUtils.clamp(alpha, 0, 1) + ')';
	},
	hsl: function hsl(hue, saturation, lightness) {
		return 'hsl(' + hue + ', ' + mathUtils.clamp(saturation, 0, 100) + '%, ' + mathUtils.clamp(lightness, 0, 100) + '%)';
	},
	hsla: function hsla(hue, saturation, lightness, alpha) {
		return 'hsla(' + hue + ', ' + mathUtils.clamp(saturation, 0, 100) + '%, ' + mathUtils.clamp(lightness, 0, 100) + '%, ' + mathUtils.clamp(alpha, 0, 1) + ')';
	}
};

module.exports.colorUtils = colorUtils;
},{"./mathUtils.js":18}],10:[function(require,module,exports){
let overlayCfg = require('./overlay.js').overlayCfg;
let sunSpikes = require('./sunSpikes.js');



$( document ).ready( function(){

	let pageAnimClassList = 'is-active to-left from-left to-right from-right';
		$( '.js-page-select' ).click( function( e ){
		let $thisButton = $( this );
		let selectsPage = $thisButton.attr( 'data-page-select' );
		let $currentPage = $( '.control--panel__page.is-active');
		let currentPageOrder = $( '.control--panel__page' ).attr( 'data-page-order' );
		let $newPage = $( '[data-page="'+selectsPage+'"]');
		let newPageOrder = $newPage.attr( 'data-page-order' );
		let isNewPageOrderGreater = newPageOrder > currentPageOrder ? true : false;
		let introClass = isNewPageOrderGreater ? 'from-right' : 'from-left';
		let outroClass = isNewPageOrderGreater ? 'to-left' : 'to-right';
		if ( $thisButton.hasClass( 'is-active') ) {
			return;
		} else {

			$currentPage.removeClass( pageAnimClassList ).addClass( outroClass );
			$thisButton.addClass( 'is-active' ).siblings().removeClass( 'is-active' );
			$newPage.addClass( 'is-active '+introClass );
		}

	} );




	let $controlPages = $( '.control--panel__page' );
	let $controlSections = $( '.control--panel__section' );
	let numSections = $controlSections.length - 1;
	$controlSections.addClass( '.is-active' );
	$controlPages.addClass( '.is-active' );

	$controlPages.css( {
		'transition-duration': '0s',
		'height': 'auto',
		'position': 'relative',
		'overflow': 'initial'
	} );

	for (let i = numSections; i >= 0; i--) {
		let $thisSection = $controlSections.eq( i );
		let $thisAnimatedEl = $thisSection.find( 'fieldset' );
		$thisAnimatedEl.css( {
			'transition-duration': '0s',
			'height': 'auto'
		} );

		let getHeight =  $thisAnimatedEl.outerHeight();

		$thisAnimatedEl.removeAttr( 'style' );

		$thisSection.attr('data-open-height', getHeight );
	}

	$controlSections.removeClass( '.is-active' );
	$controlPages.removeClass( '.is-active' );
	$controlPages.removeAttr( 'style' );


	$( '.js-section-toggle' ).click( function( e ){
		let $parent = $( this ).closest( '.control--panel__section' );
		let parentActive = $parent.hasClass( 'is-active' ) ? true : false;
		let thisHeight = $parent.attr( 'data-open-height' );
		if ( parentActive ) {
			$parent.removeClass( 'is-active' ).find( 'fieldset' ).css( {
				'height': '0'
			} ) ;
		} else {
			$parent.addClass( 'is-active' ).find( 'fieldset' ).css( {
				'height': thisHeight+'px'
			} );
		}

	} );


	$( '.button-list button' ).click( function( e ){
		let $el = $( this );
		let $siblings = $el.closest( '.button-list' ).find( 'button' );
		let isActive = $el.hasClass( 'is-active' ) ? true : false;

		if ( isActive ) {
			$el.removeClass( 'is-active' );
		} else {
			$siblings.removeClass( 'is-active' );
			$el.addClass( 'is-active' );
		}

	} );

	// get current selected animation speed
	// let initSpeedVal = $( '.js-speed-list button.selected').attr( 'data-anim-speed' );
	// console.log( 'initSpeedVal: ', initSpeedVal );
	// $( '.js-custom-anim-speed-input' ).val( initSpeedVal );

	// $( '.js-custom-anim-speed-input' ).on( 'blur', function( e) {
	// 	// get element
	// 	let $el = $( this );
	// 	// get min/max value
	// 	let maxVal = $el.attr( 'max' );
	// 	let minVal = $el.attr( 'min' );
		// get value
	// 	let value = $el.val();

	// 	if ( value > maxVal ) {
	// 		$el.val( maxVal );
	// 	} else {
	// 		if ( value < minVal ) {
	// 			$el.val( minVal );
	// 		} else {
	// 			$el.val( parseFloat( value ).toFixed( 1 ) );
	// 		}
	// 	}
	// } );


	// $( '.js-anim-speed' ).click( function( e ) {
	// 	// get element
	// 	let $el = $( this );
	// 	// get value
	// 	let value = $el.attr( 'data-anim-speed' );

	// 	$( '.js-custom-anim-speed-input' ).val( value );
	// 	$el.off();

	// } );


	// slider controls for individual facial features
	$( '.page-elements .range-slider' ).on( 'input', function( e ) {
		console.log( 'slider processing is firing' );
		// get element
		let $el = $( this );
		// get output el
		let $outputEl = $el.closest( '.control--panel__item' ).find( 'output' );
		// get min/max value
		let maxVal = $el.attr( 'max' );
		let minVal = $el.attr( 'min' );
		// get value
		let value = $el.val();
		let output = 0;

		if ( minVal < 0 ) {
			value < 0 ? output = value / minVal : output = ( value / maxVal ) * -1;
		} else {
			output = value / maxVal;
		}

		$outputEl.html( parseFloat( output ).toFixed( 2 ) );
	} );


	// slider controls for glare spikes
	$( '.js-glare-spike-effects .range-slider' ).on( 'input', function( e ) {
		console.log( 'slider processing is firing' );
		// get element
		let $el = $( this );
		// 	// get output el
		let $outputEl = $el.closest( '.control--panel__item' ).find( 'output' );
		// get value
		let value = $el.val();
		// flip value if range is flipped (display purposes only)
		$outputEl.html( parseFloat( value ).toFixed( 2 ) );
	} );



	$( '.js-display-controls button' ).click( function( e ){
		var $el = $( this );
		var $siblings = $el.siblings();
		var isActive = $el.hasClass( 'is-active' ) ? true : false;

		var thisDisplayItem = $el.data( 'display-item' );

		if ( isActive ) {
			$el.removeClass( 'is-active' );
			overlayCfg[ thisDisplayItem ] = false;

			if ( !$siblings.hasClass( 'is-active' ) ) {
				overlayCfg.displayOverlay = false;
			}


		} else {
			$el.addClass( 'is-active' );

			if ( !overlayCfg.displayOverlay ) {
				overlayCfg.displayOverlay = true;
			}

			overlayCfg[ thisDisplayItem ] = true;
		}

		if ( thisDisplayItem === 'displayGlareSpikes' ) {
			sunSpikes.clearRenderCtx();
			sunSpikes.renderGlareSpikes();
		}

	} );


} );

},{"./overlay.js":20,"./sunSpikes.js":36}],11:[function(require,module,exports){
var mathUtils = require('./mathUtils.js').mathUtils;

var lastCalledTime = void 0;

var debug = {

    helpers: {
        getStyle: function getStyle(element, property) {
            return window.getComputedStyle ? window.getComputedStyle(element, null).getPropertyValue(property) : element.style[property.replace(/-([a-z])/g, function (g) {
                return g[1].toUpperCase();
            })];
        },
        invertColor: function invertColor(hex, bw) {
            if (hex.indexOf('#') === 0) {
                hex = hex.slice(1);
            }
            // convert 3-digit hex to 6-digits.
            if (hex.length === 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            if (hex.length !== 6) {
                throw new Error('Invalid HEX color.');
            }
            var r = parseInt(hex.slice(0, 2), 16),
                g = parseInt(hex.slice(2, 4), 16),
                b = parseInt(hex.slice(4, 6), 16);
            if (bw) {
                // http://stackoverflow.com/a/3943023/112731
                return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
            }
            // invert color components
            r = (255 - r).toString(16);
            g = (255 - g).toString(16);
            b = (255 - b).toString(16);
            // pad each with zeros and return
            return "#" + padZero(r) + padZero(g) + padZero(b);
        }

    },

    display: function display(displayFlag, message, param) {
        var self = this;
        if (self.all === true || displayFlag === true) {
            console.log(message, param);
        }
    },

    debugOutput: function debugOutput(canvas, context, label, param, outputNum, outputBounds) {
        ;

        if (outputBounds) {
            var thisRed = mathUtils.map(param, outputBounds.min, outputBounds.max, 255, 0, true);
            var thisGreen = mathUtils.map(param, outputBounds.min, outputBounds.max, 0, 255, true);
            // var thisBlue = mathUtils.map(param, outputBounds.min, outputBounds.max, 0, 255, true);
            var thisColor = 'rgb( ' + thisRed + ', ' + thisGreen + ', 0 )';

            // console.log( 'changing debug color of: '+param+' to: '+thisColor );
        } else {
            var thisColor = "#efefef";
        }

        var vPos = outputNum * 50 + 50;
        context.textAlign = "left";
        context.font = "14pt arial";
        context.fillStyle = thisColor;

        context.fillText(label + param, 50, vPos);
    },

    calculateFps: function calculateFps() {
        if (!lastCalledTime) {
            lastCalledTime = window.performance.now();
            return 0;
        }
        var delta = (window.performance.now() - lastCalledTime) / 1000;
        lastCalledTime = window.performance.now();
        return 1 / delta;
    },

    flags: {
        all: false,
        parts: {
            clicks: true,
            runtime: true,
            update: false,
            killConditions: false,
            animationCounter: false,
            entityStore: false,
            fps: true
        }
    }
};

module.exports.debug = debug;
module.exports.lastCalledTime = lastCalledTime;
},{"./mathUtils.js":18}],12:[function(require,module,exports){
/*
 * This is a near-direct port of Robert Penner's easing equations. Please shower Robert with
 * praise and all of your admiration. His license is provided below.
 *
 * For information on how to use these functions in your animations, check out my following tutorial: 
 * http://bit.ly/18iHHKq
 *
 * -Kirupa
 */

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */

var easingEquations = {
	/**
 * provides easing util methods.
 */
	linearEase: function linearEase(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * currentIteration / totalIterations + startValue;
	},

	easeInQuad: function easeInQuad(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (currentIteration /= totalIterations) * currentIteration + startValue;
	},

	easeOutQuad: function easeOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
		return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
	},

	easeInOutQuad: function easeInOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
		if ((currentIteration /= totalIterations / 2) < 1) {
			return changeInValue / 2 * currentIteration * currentIteration + startValue;
		}
		return -changeInValue / 2 * (--currentIteration * (currentIteration - 2) - 1) + startValue;
	},

	easeInCubic: function easeInCubic(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.pow(currentIteration / totalIterations, 3) + startValue;
	},

	easeOutCubic: function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
	},

	easeInOutCubic: function easeInOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
		if ((currentIteration /= totalIterations / 2) < 1) {
			return changeInValue / 2 * Math.pow(currentIteration, 3) + startValue;
		}
		return changeInValue / 2 * (Math.pow(currentIteration - 2, 3) + 2) + startValue;
	},

	easeInQuart: function easeInQuart(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.pow(currentIteration / totalIterations, 4) + startValue;
	},

	easeOutQuart: function easeOutQuart(currentIteration, startValue, changeInValue, totalIterations) {
		return -changeInValue * (Math.pow(currentIteration / totalIterations - 1, 4) - 1) + startValue;
	},

	easeInOutQuart: function easeInOutQuart(currentIteration, startValue, changeInValue, totalIterations) {
		if ((currentIteration /= totalIterations / 2) < 1) {
			return changeInValue / 2 * Math.pow(currentIteration, 4) + startValue;
		}
		return -changeInValue / 2 * (Math.pow(currentIteration - 2, 4) - 2) + startValue;
	},

	easeInQuint: function easeInQuint(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.pow(currentIteration / totalIterations, 5) + startValue;
	},

	easeOutQuint: function easeOutQuint(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 5) + 1) + startValue;
	},

	easeInOutQuint: function easeInOutQuint(currentIteration, startValue, changeInValue, totalIterations) {
		if ((currentIteration /= totalIterations / 2) < 1) {
			return changeInValue / 2 * Math.pow(currentIteration, 5) + startValue;
		}
		return changeInValue / 2 * (Math.pow(currentIteration - 2, 5) + 2) + startValue;
	},

	easeInSine: function easeInSine(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (1 - Math.cos(currentIteration / totalIterations * (Math.PI / 2))) + startValue;
	},

	easeOutSine: function easeOutSine(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.sin(currentIteration / totalIterations * (Math.PI / 2)) + startValue;
	},

	easeInOutSine: function easeInOutSine(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue / 2 * (1 - Math.cos(Math.PI * currentIteration / totalIterations)) + startValue;
	},

	easeInExpo: function easeInExpo(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.pow(2, 10 * (currentIteration / totalIterations - 1)) + startValue;
	},

	easeOutExpo: function easeOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
	},

	easeInOutExpo: function easeInOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
		if ((currentIteration /= totalIterations / 2) < 1) {
			return changeInValue / 2 * Math.pow(2, 10 * (currentIteration - 1)) + startValue;
		}
		return changeInValue / 2 * (-Math.pow(2, -10 * --currentIteration) + 2) + startValue;
	},

	easeInCirc: function easeInCirc(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (1 - Math.sqrt(1 - (currentIteration /= totalIterations) * currentIteration)) + startValue;
	},

	easeOutCirc: function easeOutCirc(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.sqrt(1 - (currentIteration = currentIteration / totalIterations - 1) * currentIteration) + startValue;
	},

	easeInOutCirc: function easeInOutCirc(currentIteration, startValue, changeInValue, totalIterations) {
		if ((currentIteration /= totalIterations / 2) < 1) {
			return changeInValue / 2 * (1 - Math.sqrt(1 - currentIteration * currentIteration)) + startValue;
		}
		return changeInValue / 2 * (Math.sqrt(1 - (currentIteration -= 2) * currentIteration) + 1) + startValue;
	},

	easeInElastic: function easeInElastic(t, b, c, d) {
		var s = 1.70158;var p = 0;var a = c;
		if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},
	easeOutElastic: function easeOutElastic(t, b, c, d) {
		var s = 1.70158;var p = 0;var a = c;
		if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	},

	easeInOutElastic: function easeInOutElastic(t, b, c, d) {
		var s = 1.70158;var p = 0;var a = c;
		if (t == 0) return b;if ((t /= d / 2) == 2) return b + c;if (!p) p = d * (.3 * 1.5);
		if (a < Math.abs(c)) {
			a = c;var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
	},

	easeInBack: function easeInBack(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},

	easeOutBack: function easeOutBack(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},

	easeInOutBack: function easeInOutBack(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
		return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
	},

	// easeInBounce: function(t, b, c, d) {
	//     return c - easeOutBounce(d-t, 0, c, d) + b;
	// },

	easeOutBounce: function easeOutBounce(t, b, c, d) {
		if ((t /= d) < 1 / 2.75) {
			return c * (7.5625 * t * t) + b;
		} else if (t < 2 / 2.75) {
			return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
		} else if (t < 2.5 / 2.75) {
			return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
		} else {
			return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
		}
	}

	// easeInOutBounce: function(t, b, c, d) {
	//     if (t < d/2) return this.easeInBounce(t*2, 0, c, d) * .5 + b;
	//     return this.easeOutBounce(t*2-d, 0, c, d) * .5 + c*.5 + b;
	// }
};

easingEquations.easeInBounce = function (t, b, c, d) {
	return c - easingEquations.easeOutBounce(d - t, 0, c, d) + b;
}, easingEquations.easeInOutBounce = function (t, b, c, d) {
	if (t < d / 2) return easingEquations.easeInBounce(t * 2, 0, c, d) * .5 + b;
	return easingEquations.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
};

module.exports.easingEquations = easingEquations;
},{}],13:[function(require,module,exports){
require( './app.js' );
require( './controlPanel.js' );
require( './exportOverlay.js' );
},{"./app.js":7,"./controlPanel.js":10,"./exportOverlay.js":15}],14:[function(require,module,exports){
var environment = {

		runtimeEngine: {

				startAnimation: function startAnimation(animVar, loopFn) {
						if (!animVar) {
								animVar = window.requestAnimationFrame(loopFn);
						}
				},

				stopAnimation: function stopAnimation(animVar) {
						if (animVar) {
								window.cancelAnimationFrame(animVar);
								animVar = undefined;
						}
				}

		},

		canvas: {
				// buffer clear fN
				checkClearBufferRegion: function checkClearBufferRegion(particle, canvasConfig) {

						var bufferClearRegion = canvasConfig.bufferClearRegion;

						var entityWidth = particle.r / 2;
						var entityHeight = particle.r / 2;

						if (particle.x - entityWidth < bufferClearRegion.x) {
								bufferClearRegion.x = particle.x - entityWidth;
						}

						if (particle.x + entityWidth > bufferClearRegion.x + bufferClearRegion.w) {
								bufferClearRegion.w = particle.x + entityWidth - bufferClearRegion.x;
						}

						if (particle.y - entityHeight < bufferClearRegion.y) {
								bufferClearRegion.y = particle.y - entityHeight;
						}

						if (particle.y + entityHeight > bufferClearRegion.y + bufferClearRegion.h) {
								bufferClearRegion.h = particle.y + entityHeight - bufferClearRegion.y;
						}
				},

				resetBufferClearRegion: function resetBufferClearRegion(canvasConfig) {

						var bufferClearRegion = canvasConfig.bufferClearRegion;

						bufferClearRegion.x = canvasConfig.centerH;
						bufferClearRegion.y = canvasConfig.centerV;
						bufferClearRegion.w = canvasConfig.width;
						bufferClearRegion.h = canvasConfig.height;
				}
		},

		forces: {
				friction: 0.01,
				bouyancy: 1,
				gravity: 0,
				wind: 1,
				turbulence: { min: -5, max: 5 }
		}

};

module.exports.environment = environment;
},{}],15:[function(require,module,exports){
$( document ).ready( function(){


	var $featurePageParent = $( '[ data-page="page-elements" ]');
    var $featureInputs = $featurePageParent.find( '.range-slider' );
    var $featureOutputs = $featurePageParent.find( 'output' );
    var $featureInputsLen = $featureInputs.length;

    console.log( 'test input: ', $featureInputs.eq( 2 ) );

    function createExpressionParameterExport() {

    	var output = '';

    	for ( var i = 0; i < $featureInputsLen; i++ ) {
    		var thisInput = $featureInputs.eq( i )[ 0 ];
    		var $thisOutput = parseFloat( $featureOutputs.eq( i ).html() ).toFixed( 2 );

    		thisInput.id === 'mouthEdgeRight' ? $thisOutput = $thisOutput * -1 : false;

    		var tempEnding = '';

    		if ( i !== $featureInputsLen - 1 ) {
    			tempEnding = ',';
    		}

    		output = `${ output }
    		{ name: "${ thisInput.id }", target: "${ $thisOutput }" }${tempEnding}`;
    	}

    	output = `[
    			${ output }
    		]`;

        console.log( 'output: ', output );
    	return output;

    }


	var $exportOverlay = $( '.export-overlay--container' );

	$( '.js-export-expression' ).click( function( e ){

		var $thisButton = $( this );

		if ( $exportOverlay.hasClass( 'is-active') ) {
			$exportOverlay.removeClass( 'is-active' );


		} else {


			$( '.export-overlay--output' ).html( createExpressionParameterExport() );
			$exportOverlay.addClass( 'is-active' );
		}

	} );

	$( '.js-close-export-overlay-limiter' ).click( function( e ){
		e.stopPropagation();
	} );


	$( '.js-close-export-overlay' ).click( function( e ){
		e.stopPropagation();
		var $this = $( this );
		$( '.export-overlay--container' ).removeClass( 'is-active' )
	} );

	


} );
},{}],16:[function(require,module,exports){
function deg2rad(d) {
    return (2 * Math.PI * d) / 360;
}

function rad2deg(r) {
    return (360 * r) / (2 * Math.PI);
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

var Gear = function(x, y, connectionRadius, teeth, fillStyle, strokeStyle) {
    // Gear parameters
    this.x = x;
    this.y = y;
    this.connectionRadius = connectionRadius;
    this.teeth = teeth;

    // Render parameters
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;

    // Calculated properties
    this.diameter = teeth * 4 * connectionRadius; // Each touth is built from two circles of connectionRadius
    this.radius = this.diameter / (2 * Math.PI); // D = 2 PI r

    // Animation properties
    this.phi0 = 0; // Starting angle
    this.angularSpeed = 0; // Speed of rotation in degrees per second
    this.createdAt = new Date(); // Timestamp
}

Gear.prototype.render = function (context) {
    // Update rotation angle
    var ellapsed = new Date() - this.createdAt;
    var phiDegrees = this.angularSpeed * (ellapsed / 1000);
    var phi = this.phi0 + deg2rad(phiDegrees); // Current angle

    // Set-up rendering properties
    context.fillStyle = this.fillStyle;
    context.strokeStyle = this.strokeStyle;
    context.lineCap = 'round';
    context.lineWidth = 1;

    // Draw gear body
    context.beginPath();
    for (var i = 0; i < this.teeth * 2; i++) {
        var alpha = 2 * Math.PI * (i / (this.teeth * 2)) + phi;
        // Calculate individual touth position
        var x = this.x + Math.cos(alpha) * this.radius;
        var y = this.y + Math.sin(alpha) * this.radius;

        // Draw a half-circle, rotate it together with alpha
        // On every odd touth, invert the half-circle
        context.arc(x, y, this.connectionRadius, -Math.PI / 2 + alpha, Math.PI / 2 + alpha, i % 2 == 0);
    }
    context.fill();
    context.stroke();

    // Draw center circle
    context.beginPath();
    context.arc(this.x, this.y, this.connectionRadius, 0, 2 * Math.PI, true);
    context.fill();
    context.stroke();
}

Gear.prototype.connect = function (x, y) {
    var r = this.radius;
    var dist = distance(x, y, this.x, this.y);

    // To create new gear we have to know the number of its touth
    var newRadius = Math.max(dist - r, 10);
    var newDiam = newRadius * 2 * Math.PI;
    var newTeeth = Math.round(newDiam / (4 * this.connectionRadius));

    // Calculate the ACTUAL position for the new gear, that would allow it to interlock with this gear
    var actualDiameter = newTeeth * 4 * this.connectionRadius;
    var actualRadius = actualDiameter / (2 * Math.PI);
    var actualDist = r + actualRadius; // Actual distance from center of this gear
    var alpha = Math.atan2(y - this.y, x - this.x); // Angle between center of this gear and (x,y)
    var actualX = this.x + Math.cos(alpha) * actualDist; 
    var actualY = this.y + Math.sin(alpha) * actualDist;

    // Make new gear
    var newGear = new Gear(actualX, actualY, this.connectionRadius, newTeeth, this.fillStyle, this.strokeStyle);

    // Adjust new gear's rotation to be in direction oposite to the original
    var gearRatio = this.teeth / newTeeth;
    newGear.angularSpeed = -this.angularSpeed * gearRatio;

    // At time t=0, rotate this gear to be at angle Alpha
    this.phi0 = alpha + (this.phi0 - alpha); // = this.phi0, does nothing, for demonstration purposes only
    newGear.phi0 = alpha + Math.PI + (Math.PI / newTeeth) + (this.phi0 - alpha) * (newGear.angularSpeed / this.angularSpeed);
    // At the same time (t=0), rotate the new gear to be at (180 - Alpha), facing the first gear,
    // And add a half gear rotation to make the teeth interlock
    newGear.createdAt = this.createdAt; // Also, syncronize their clocks


    return newGear;
}

module.exports = Gear;
},{}],17:[function(require,module,exports){
var trig = require('./trigonomicUtils.js').trigonomicUtils;
var twoPi = trig.twoPi;
let mathUtils = require('./mathUtils.js').mathUtils;
let easing = require('./easing.js').easingEquations;
let rand = mathUtils.random;
let randI = mathUtils.randomInteger;
let mCos = Math.cos;
let mSin = Math.sin;

var numFlares = randI( 30, 60 );
var flareSizeArr = [];

for (var i = numFlares - 1; i >= 0; i--) {

    let randomRandomiser = randI( 0, 100 );
    let smallThreshold = numFlares < 30 ? 60 : 75;
    let min = randomRandomiser < 50 ? 15 : 15;
    let max = randomRandomiser < 50 ? 120 : 180;

    flareSizeArr.push(
        randI( min, max )
    );
}

var lensFlare = {
    config: {
        count: numFlares,
        sizeArr: flareSizeArr,
        flareArr: [],
        blur: 0
    },
    renderers: {
        render: {
            canvas: null,
            ctx: null,
            w: 2000,
            h: 2000,
            dX: 0,
            dY: 0,
            totTallest: 0,
            compositeArea: {
                x: 0, y: 0, w: 0, h: 0
            }
        },
        display: {
            canvas: null,
            ctx: null,
            x: 0, y: 0, w: 0, h: 0, a: 0, d: 0
        }
    },

    setRendererElements: function( renderOpts, displayOpts ) {
        let renderCfg = this.renderers.render;
        let displayCfg = this.renderers.display;

        renderCfg.canvas = renderOpts.canvas;
        renderCfg.ctx = renderOpts.ctx;
        renderCfg.canvas.width = renderCfg.w;
        renderCfg.canvas.height = renderCfg.h;

        displayCfg.canvas = displayOpts.canvas;
        displayCfg.ctx = displayOpts.ctx;
        displayCfg.w = displayCfg.canvas.width;
        displayCfg.h = displayCfg.canvas.height;
    },

    setDisplayProps: function( originX, originY, originR, originA ) {
        let displayCfg = this.renderers.display;

        displayCfg.x = originX;
        displayCfg.y = originY;
        displayCfg.a = originA;
        displayCfg.maxD = trig.dist( -( originR * 2 ), -( originR * 2 ), displayCfg.w + ( originR * 2 ), displayCfg.h + ( originR * 2 ) );

        // console.log( 'displayCfg.maxD: ', displayCfg.maxD );
        displayCfg.d = ( trig.dist( originX, originY, displayCfg.w / 2, displayCfg.h / 2 ) ) * 3;
        // console.log( 'displayCfg.d: ', displayCfg.d );
        displayCfg.scale = displayCfg.d / displayCfg.maxD;
        // console.log( 'displayCfg.scale: ', displayCfg.scale );
    },

    createFlareConfigs: function() {
        let cfg = this.config;

        for (let i = cfg.count - 1; i >= 0; i--) {

            let thisTypeRandomiser = randI( 0, 100 );
            let thisType = thisTypeRandomiser < 10 ? 'spotShine' : thisTypeRandomiser < 55 ? 'poly' : 'circle';

            let colRand = randI( 0, 100 );

            let r = colRand < 50 ? 255 : colRand < 60 ? 255 : colRand < 80 ? 200 : 200;
            let g = colRand < 50 ? 255 : colRand < 60 ? 200 : colRand < 80 ? 255 : 255;
            let b = colRand < 50 ? 255 : colRand < 60 ? 200 : colRand < 80 ? 200 : 255;

            let thisFlare = {
                color: {
                    r: r,
                    g: g,
                    b: b

                },
                type: thisType
            }

            if ( thisType === 'spotShine' ) {
                thisFlare.color = {
                    r: 255, g: 255, b: 255
                }
            }

            thisFlare.size = thisFlare.type === 'spotShine' ? randI( 40, 80 ) : cfg.sizeArr[ i ];

            thisFlare.d = thisFlare.type === 'spotShine' ? parseFloat( rand( 0.3, 1 ).toFixed( 2 ) ) : parseFloat( rand( 0, 1 ).toFixed( 2 ) );

            thisFlare.hRand = parseFloat( rand( 1, 2 ).toFixed( 2 ) );
            cfg.flareArr.push( thisFlare );
        }
    },

    renderCircleFlare: function( x, y, cfg ) {
        
        let c = this.renderers.render.ctx;
        let baseCfg = this.config;
        let flareCfg = cfg;
        let flareRandomiser = randI( 0, 100 );
        let flareRandomShift = randI( 20, 40 );
        let flareRandomEdge = randI( 0, 10 );
        let randomFill = randI( 0, 100 ) < 20 ? true : false;
        let grad = c.createRadialGradient( 0 - ( flareRandomShift * 3 ), 0, 0, 0, 0, flareCfg.size );
        let rgbColorString = `${ flareCfg.color.r }, ${ flareCfg.color.g }, ${ flareCfg.color.b }, `;

            // grad.addColorStop( 0, `rgba( ${ rgbColorString } 0.6 )` );
            // grad.addColorStop( 0.7,  `rgba( ${ rgbColorString } 0.8 )` );
            // grad.addColorStop( 1,  `rgba( ${ rgbColorString } 0.7 )` );

        if ( flareRandomEdge > 5 ) {
            if ( randomFill === true ) {
                grad.addColorStop( 0,  `rgba( ${ rgbColorString } 0.1 )` );
                grad.addColorStop( 0.95, `rgba( ${ rgbColorString } 0.2 )` );
            } else {
                grad.addColorStop( 0,  `rgba( ${ rgbColorString } 0 )` );
                grad.addColorStop( 0.8,  `rgba( ${ rgbColorString } 0 )` );
                grad.addColorStop( 0.95, `rgba( ${ rgbColorString } 0.2 )` );
            }
            
            grad.addColorStop( 0.97, `rgba( ${ rgbColorString } 0.8 )` );
            grad.addColorStop( 0.99, `rgba( ${ rgbColorString } 0.3 )` );
            grad.addColorStop( 1, `rgba( ${ rgbColorString } 0 )` );
        } else {
            grad.addColorStop( 0,  `rgba( ${ rgbColorString } 0.2 )` );
            grad.addColorStop( 1, `rgba( ${ rgbColorString } 0.3 )` );
        }
            
        c.fillStyle = grad; 
        c.fillCircle( 0, 0, flareCfg.size );
        c.fill();
    },

    renderSpotFlare: function( x, y, cfg ) {
        
        let c = this.renderers.render.ctx;
        let flareCfg = cfg;
        let rgbColorString = `${ flareCfg.color.r }, ${ flareCfg.color.g }, ${ flareCfg.color.b }, `;

        let grad = c.createRadialGradient( 0, 0, 0, 0, 0, flareCfg.size );
        grad.addColorStop( 0,  `rgba( ${ rgbColorString } 1 )` );
        grad.addColorStop( 0.2,  `rgba( ${ rgbColorString } 1 )` );
        grad.addColorStop( 0.4,  `rgba( ${ rgbColorString } 0.1 )` );
        grad.addColorStop( 1,  `rgba( ${ rgbColorString } 0 )` );
        
        c.fillStyle = grad; 
        c.fillCircle( 0, 0, flareCfg.size );
        c.fill();
    },

    renderPolyFlare: function( x, y, cfg ) {
        
        let c = this.renderers.render.ctx;
        let flareCfg = cfg;
        let flareSize = flareCfg.size;
        let flareRandomShift = randI( 0, 40 );

        let flareRandomEdge = randI( 0, 10 );

        let rgbColorString = `${ flareCfg.color.r }, ${ flareCfg.color.g }, ${ flareCfg.color.b }, `;

        let grad = c.createRadialGradient( 0, 0, 0, 0, 0, flareCfg.size );
        grad.addColorStop( 0,  `rgba( ${ rgbColorString } 0.1 )` );
        grad.addColorStop( 1,  `rgba( ${ rgbColorString } 0.2 )` );
        
        let sides = 8;

        c.save();
        
        c.beginPath();
        for (let i = 0; i < sides; i++) {
            let alpha = twoPi * ( i / sides );
            if ( i === 0 ) {
                c.moveTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            } else {
                c.lineTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            }
        }
        c.closePath();
        c.clip();

        c.beginPath();
        for (let i = 0; i < sides; i++) {
            let alpha = twoPi * ( i / sides );
            if ( i === 0 ) {
                c.moveTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            } else {
                c.lineTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            }
        }
        c.closePath();

        c.fillStyle = grad; 
        c.fill();
        
        c.translate( 0, -100000 );
        c.beginPath();
        for (let i = 0; i < sides; i++) {
            let alpha = twoPi * ( i / sides );
            if ( i === 0 ) {
                c.moveTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            } else {
                c.lineTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            }
        }
        c.closePath();
        flareRandomShift = randI( 0, 5 );
        c.strokeStyle = 'red';
        c.shadowColor = `rgba( ${ rgbColorString } 1 )`;
        c.shadowBlur = 40;
        c.shadowOffsetX = 0 - flareRandomShift;
        c.shadowOffsetY = 100000;
        c.lineWidth = 10;
        c.stroke();
        c.shadowBlur = 0;

        if ( flareRandomEdge > 5 ) {
            c.beginPath();
            for (let i = 0; i < sides; i++) {
                let alpha = twoPi * ( i / sides );
                if ( i === 0 ) {
                    c.moveTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
                } else {
                    c.lineTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
                }
            }
            c.closePath();
            c.strokeStyle = 'red';
            c.shadowColor = `rgba( ${ rgbColorString } 1 )`;
            c.shadowBlur = 3;
            c.shadowOffsetX = 0 - flareRandomShift;
            c.shadowOffsetY = 100000;
            c.lineWidth = 2;
            c.stroke();
            c.shadowBlur = 0;
        }

        c.translate( 0, 100000 );

        c.restore();
    },

    getCleanCoords: function( flare ) {
        
        let renderCfg = this.renderer.render;
        let blur = this.config.blur;
        let blur2 = blur * 2;
        let flareS = flare.size;
        let flareS2 = flareS * 2;
        let totalS = flareS2 + blur2;
        let cleanX = renderCfg.dX;
        let cleanY = renderCfg.dY;
    },

    renderFlares: function() {

        let baseCfg = this.config;
        let renderer = this.renderers.render;
        let compositeArea = renderer.compositeArea;
        let c = renderer.ctx;
        let cW = renderer.w;
        let cH = renderer.h;
        let flareCount = baseCfg.count;
        let flares = baseCfg.flareArr;
        let blur = baseCfg.blur;
        let blur2 = blur * 2;

        let currX = 0;
        let currY = 0;
        let currTallest = 0;

        let blurStr = 'blur('+blur.toString()+'px)';
        c.filter = blurStr;
        let polyCount = 0;

        // sort flares based on size - decending order to map to reverse FOR loop ( so loop starts with smallest ) 
        flares.sort( function( a, b ) {
                return b.size - a.size
            }
        );

        for (let i = flareCount - 1; i >= 0; i--) {

            let thisFlare = flares[ i ];
            let flareSize = thisFlare.size;
            let flareSize2 = flareSize * 2;
            let totalFlareW = flareSize2 + blur2;
            let totalFlareH = flareSize2 + blur2;

            totalFlareH > currTallest ? currTallest = totalFlareH : false;

            if ( currX + totalFlareW + blur > cW ) {
                currX = 0;
                currY += currTallest;
                currTallest = totalFlareH;
            }

            let transX = currX + flareSize + blur;
            let transY = currY + flareSize + blur;

            c.translate( transX, transY );

            if ( thisFlare.type === 'spotShine' ) {
                c.globalAlpha = 1;
                this.renderSpotFlare( 0, 0, thisFlare );
            }

            if ( thisFlare.type === 'poly' ) {
                c.globalAlpha = 1;
                this.renderPolyFlare( 0, 0, thisFlare );
                c.globalAlpha = 1;
            }

            if ( thisFlare.type === 'circle' ) {
                c.globalAlpha = parseFloat( rand( 0.5, 1 ).toFixed( 2 ) );
                this.renderCircleFlare( 0, 0, thisFlare );
                c.globalAlpha = 1;
            }


            // c.strokeStyle = 'red';
            // c.lineWidth = 1;
            // c.strokeRect( -( flareSize + blur ), -( flareSize + blur ), totalFlareW, totalFlareH );
            // c.stroke();

            c.translate( -transX, -transY );

            thisFlare.renderCfg = {
                x: currX,
                y: currY,
                w: totalFlareW,

                h: totalFlareH
            }

            currX += totalFlareW;

            if ( i === 0 ) {
                compositeArea.x = 0;
                compositeArea.y = currY + totalFlareH;
                compositeArea.w = cW;
                compositeArea.h = totalFlareH;
            }

        }

        c.filter = 'blur(0px)';
    },


    displayFlares: function() {

        let baseCfg = this.config;
        let renderC = this.renderers.render.canvas;
        let displayCfg = this.renderers.display;
        let c = displayCfg.ctx;
        
        let flareCount = baseCfg.count;
        let flares = baseCfg.flareArr;

        let scale = displayCfg.scale;

        c.globalCompositeOperation = 'lighten';

        c.translate( displayCfg.x, displayCfg.y );
        c.rotate( displayCfg.a );

        for (let i = flareCount - 1; i >= 0; i--) {

            let thisFlare = flares[ i ];
            let thisFlareCfg = thisFlare.renderCfg;
            // console.log( 'thisFlareCfg: ', thisFlareCfg );
            let scaledCoords = ( thisFlareCfg.w / 2 ) * scale;
            let scaledSize = thisFlareCfg.w * scale;
            let scaledX = displayCfg.d * thisFlare.d;
            let inverseScale = 1 - ( scaledX / displayCfg.d );
            let scaleMultiplier = easing.easeInCubic( scaledX, 1, -1, displayCfg.d );
            // console.log( 'inverseScale: ', inverseScale);
            // console.log( 'scaledSize * inverseScale: ', scaledSize * inverseScale );
            c.drawImage(
                renderC,
                thisFlareCfg.x, thisFlareCfg.y, thisFlareCfg.w, thisFlareCfg.h,
                scaledX, -scaledCoords, scaledSize / scaleMultiplier , scaledSize
            );


        }

        c.rotate( -displayCfg.a );
        c.translate( -displayCfg.x, -displayCfg.y );

    },

    compositeFlares: function() {

        let baseCfg = this.config;
        let renderer = this.renderers.render;
        let renderC = renderer.canvas;
        let renderCtx = renderer.ctx;
        let compositeArea = renderer.compositeArea;
        let displayCfg = this.renderers.display;
        let flareCount = baseCfg.count;
        let flares = baseCfg.flareArr;
        let scale = displayCfg.scale;
        let tallestFlare = flares[ 0 ].w * scale;
        let startPos = tallestFlare / 2;

        renderCtx.globalCompositeOperation = 'lighten';

        renderCtx.translate( startPos, compositeArea.y + startPos );

        for (let i = flareCount - 1; i >= 0; i--) {

            let thisFlare = flares[ i ];
            let thisFlareCfg = thisFlare.renderCfg;
            // console.log( 'thisFlareCfg: ', thisFlareCfg );
            let scaledCoords = ( thisFlareCfg.w / 2 ) * scale;
            let scaledSize = thisFlareCfg.w * scale;
            let scaledX = displayCfg.d * thisFlare.d;
            let inverseScale = 1 - ( scaledX / displayCfg.d );
            let scaleMultiplier = easing.easeInCubic( scaledX, 1, -1, displayCfg.d );
            // console.log( 'inverseScale: ', inverseScale);
            // console.log( 'scaledSize * inverseScale: ', scaledSize * inverseScale );
            renderCtx.drawImage(
                renderC,
                thisFlareCfg.x, thisFlareCfg.y, thisFlareCfg.w, thisFlareCfg.h,
                scaledX, -scaledCoords, scaledSize / scaleMultiplier , scaledSize
            );


        }


        renderCtx.translate( -startPos, -( compositeArea.y +startPos ) );

    },

    displayComposite: function() {

        let baseCfg = this.config;

        let renderC = this.renderers.render.canvas;
        let compositeArea = this.renderers.render.compositeArea;
        
        let displayCfg = this.renderers.display;
        let c = displayCfg.ctx;

        c.globalCompositeOperation = 'lighten';

        c.translate( displayCfg.x, displayCfg.y );
        c.rotate( displayCfg.a );

        c.drawImage(
            renderC,
            compositeArea.x, compositeArea.y, compositeArea.w, compositeArea.h,
            0, -( compositeArea.h / 2 ), compositeArea.w , compositeArea.h
        );

        c.rotate( -displayCfg.a );
        c.translate( -displayCfg.x, -displayCfg.y );

    },

    clearCompositeArea: function() {

        let c = this.renderers.render.ctx;
        let compositeArea = this.renderers.render.compositeArea;

        c.clearRect( compositeArea.x, compositeArea.y, compositeArea.w, compositeArea.h );

    },

    update: function() {
        this.compositeFlares();
        this.displayComposite();
        this.clearCompositeArea();

    },

    flareInit: function( renderOpts, displayOpts ) {
        self = this;

        self.setRendererElements( renderOpts, displayOpts );
        self.createFlareConfigs();
    }
}

module.exports = lensFlare;
},{"./easing.js":12,"./mathUtils.js":18,"./trigonomicUtils.js":46}],18:[function(require,module,exports){
/**
* provides maths util methods.
*
* @mixin
*/

var mathUtils = {
	/**
 * @description Generate random integer between 2 values.
 * @param {number} min - minimum value.
 * @param {number} max - maximum value.
 * @returns {number} result.
 */
	randomInteger: function randomInteger(min, max) {
		return Math.floor(Math.random() * (max + 1 - min)) + min;
	},

	/**
 * @description Generate random float between 2 values.
 * @param {number} min - minimum value.
 * @param {number} max - maximum value.
 * @returns {number} result.
 */
	random: function random(min, max) {
		if (min === undefined) {
			min = 0;
			max = 1;
		} else if (max === undefined) {
			max = min;
			min = 0;
		}
		return Math.random() * (max - min) + min;
	},

	getRandomArbitrary: function getRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
	},
	/**
 * @description Transforms value proportionately between input range and output range.
 * @param {number} value - the value in the origin range ( min1/max1 ).
 * @param {number} min1 - minimum value in origin range.
 * @param {number} max1 - maximum value in origin range.
 * @param {number} min2 - minimum value in destination range.
 * @param {number} max2 - maximum value in destination range.
 * @param {number} clampResult - clamp result between destination range boundarys.
 * @returns {number} result.
 */
	map: function map(value, min1, max1, min2, max2, clampResult) {
		var self = this;
		var returnvalue = (value - min1) / (max1 - min1) * (max2 - min2) + min2;
		if (clampResult) return self.clamp(returnvalue, min2, max2);else return returnvalue;
	},

	/**
 * @description Clamp value between range values.
 * @param {number} value - the value in the range { min|max }.
 * @param {number} min - minimum value in the range.
 * @param {number} max - maximum value in the range.
 * @param {number} clampResult - clamp result between range boundarys.
 */
	clamp: function clamp(value, min, max) {
		if (max < min) {
			var temp = min;
			min = max;
			max = temp;
		}
		return Math.max(min, Math.min(value, max));
	}
};

module.exports.mathUtils = mathUtils;
},{}],19:[function(require,module,exports){
var muscleModifier = {
	
	pm: {},

	getMeasures: function( measures ) {
		this.pm = measures;
	},

	setModifiers: function() {

		return {

			lookTargetX: {
				min: -this.pm.r8, max: this.pm.r8, curr: 0
			},
			lookTargetY: {
				min: -this.pm.r8, max: this.pm.r8, curr: 0
			},
			lookTargetZ: {
				min: -this.pm.r8, max: this.pm.r8, curr: 0
			},

			// Raises and lowers left eyebrow
			leftEyebrow: {
				min: -this.pm.r8, max: this.pm.r8, curr: 0
			},
			// Raises and lowers right eyebrow
			rightEyebrow: {
				min: -this.pm.r8, max: this.pm.r8, curr: 0
			},
			// Contracts left eyebrow muscle ( frown )
			leftBrowContract: {
				min: 0, max: this.pm.r32 + this.pm.r64, curr: 0
			},
			// Contracts right eyebrow muscle ( frown )
			rightBrowContract: {
				min: 0, max: this.pm.r32 + this.pm.r64, curr: 0
			},
			// Opens and closes left eye
			leftEye: {
				min: 0, max: 1, curr: 1
			},
			// Opens and closes right eye
			rightEye: {
				min: 0, max: 1, curr: 1
			},


			// Raises and lowers left nostril
			nostrilRaiseL: {
				min: -this.pm.r32, max: this.pm.r32, curr: 0
			},
			// Raises and lowers right nostril
			nostrilRaiseR: {
				min: -this.pm.r32, max: this.pm.r32, curr: 0
			},
			// flares left nostril
			nostrilFlareL: {
				min: 0, max: this.pm.r32, curr: 0
			},
			// flares right nostril
			nostrilFlareR: {
				min: 0, max: this.pm.r32, curr: 0
			},
			

			// raises and lowers left cheek ( pulls mouth edges up and down)
			leftCheek: {
				min: -( this.pm.r8 + this.pm.r16 ), max: this.pm.r8 + this.pm.r16, curr: 0
			},

			// raises and lowers right cheek ( pulls mouth edges up and down)
			rightCheek: {
				min: -( this.pm.r8 + this.pm.r16 ), max: this.pm.r8 + this.pm.r16, curr: 0
			},
			
			// mouth left edge pull in and out 			
			mouthEdgeLeft: {
				min: -( this.pm.r16 + this.pm.r32 ), max: this.pm.r16 + this.pm.r32, curr: 0
			},
			// mouth right edge pull in and out 
			mouthEdgeRight: {
				min: -( this.pm.r16 + this.pm.r32 ), max: this.pm.r16 + this.pm.r32, curr: 0
			},

			mouthEdgeLeftExtend: {
				min: -( this.pm.r16 + this.pm.r32 ), max: this.pm.r16 + this.pm.r32, curr: 0
			},
			// mouth right edge pull in and out 
			mouthEdgeRightExtend: {
				min: -( this.pm.r16 + this.pm.r32 ), max: this.pm.r16 + this.pm.r32, curr: 0
			},
			
			// top lip left pull in and out
			topLipLeftPull: {
				min: 0, max: this.pm.r8, curr: 0
			},

			// top lip right pull in and out
			topLipRightPull: {
				min: 0, max: this.pm.r8, curr: 0
			},

			// bottom lip left pull in and out
			bottomLipLeftPull: {
				min: 0, max: this.pm.r8, curr: 0
			},

			// bottom lip right pull in and out
			bottomLipRightPull: {
				min: 0, max: this.pm.r8, curr: 0
			},

			// Top lip pull up and down
			topLipOpen: {
				min: 0, max: ( this.pm.r8 - this.pm.r32 ), curr: 0
			},

			// bottom lip pull up and down
			bottomLipOpen: {
				min: 0, max: this.pm.r8, curr: 0
			},

			// lips pucker and relax
			lipsPucker: {
				min: 0, max: this.pm.r8, curr: 0
			},

			// opens and closes the jaw ( mouth )
			jawOpen: {
				min: 0, max: this.pm.r4 + this.pm.r8, curr: 0
			},
			// moves jaw laterally ( left and right )
			jawLateral: {
				min: -this.pm.r4, max: this.pm.r4, curr: 0
			}


		}

	},

	createModifiers: function( measures ) {
		this.getMeasures( measures );
		var temp = this.setModifiers();
		return temp;
	},

	setRangeInputs: function( obj ) {
		// get list of members
		var keyList = Object.keys( obj );
		// loop through member list
		for( var i = 0; i <= keyList.length - 1; i++ ) {
			// store member name
			var thisKey = keyList[ i ];
			var thisItem = obj[ thisKey ];

			if ( thisKey === 'lookTargetX' || thisKey === 'lookTargetY' || thisKey === 'lookTargetZ' ) {
				continue;
			}

			// console.log( 'thisKey: ', thisKey );
			
			$( '#'+thisKey )
				.attr( {
					'min': thisItem.min,
					'max': thisItem.max,
					'value': thisItem.curr
				} )
				.prop( {
					'min': thisItem.min,
					'max': thisItem.max,
					'value': thisItem.curr
				} )
				.closest( '.control--panel__item' )
				.find( 'output' )
				.html( thisItem.curr );

		}
	}

}

module.exports.muscleModifier = muscleModifier;
},{}],20:[function(require,module,exports){
var btn = {
    x: 25,
    y: 25,
    w: 125,
    h: 50,
    display: true,
    fontSize: 15,
    bg: '#666666',
    bgActive: '#aaaaaa',
    color: '#333333',
    colorActive: '#dddddd',
    content: 'Display Overlay'
};

btn.textX = btn.x + 10;
btn.textY = btn.y + ( btn.h / 2 );

function drawOverlaySwitchButton( ctx ) {
    ctx.fillStyle = btn.displayOverlay === true ? btn.bgActive : btn.bg;
    ctx.fillRect( btn.x, btn.y, btn.w, btn.h );
    ctx.fillStyle = btn.displayOverlay === true ? btn.colorActive : btn.color;
    ctx.font = btn.fontSize + 'px Tahoma';
    ctx.fillText( btn.content, btn.textX, btn.textY );
};


var overlayCfg = {
    displayOverlay: false,
    displayLookTarget: false,
    displayCentreLines: false,
    displayAnchors: false,
    displayControlPoints: false,
    displayHulls: false,
    displayGlareSpikes: false,
    displaySunToStage: false
}


module.exports.overlayBtnCfg = btn;
module.exports.drawOverlaySwitchButton = drawOverlaySwitchButton;
module.exports.overlayCfg = overlayCfg;
},{}],21:[function(require,module,exports){
var proportionalMeasures = {

	setMeasures: function( baseRadius ) {

		return {
			r2: baseRadius / 2,
			r4: baseRadius / 4,
			r8: baseRadius / 8,
			r16: baseRadius / 16,
			r32: baseRadius / 32,
			r64: baseRadius / 64,
			r128: baseRadius / 128,

			r3: baseRadius / 3,
			r6: baseRadius / 6,
			r12: baseRadius / 12,
			r24: baseRadius / 24,

			r5: baseRadius / 5,
			r10: baseRadius / 10
		}
	
	}
}

module.exports = proportionalMeasures;
},{}],22:[function(require,module,exports){
function expressionItem( modifier, target ) {
	return {
		name: modifier,
		target: target,
		startValue: 0,
		valueChange: 0
	}
}

function createExpression( arr ) {

	var tempArr = [];
	var arrLen = arr.length - 1;

	for (var i = arrLen; i >= 0; i--) {
		var thisItem = arr[ i ];
		tempArr.push( expressionItem( thisItem.name, thisItem.target ) );
	}
	return tempArr;
}



function createSequence( opts ) {

	var tempSeq = {

		// seq params
		returnToInit: opts.returnToInit || false,
		loop: opts.loop || false,
		repeatDelayOnLoop: opts.repeatDelayOnLoop || false,
		fadeChangeOnLoop: opts.fadeChangeOnLoop || false,
		fadeChangeOnLoopEase: opts.fadeChangeOnLoopEase || 'linearEase',
		seq: opts.seq || 'reset',

		// seq timings
		dur: opts.dur || 1,
		delay: opts.delay || 0,
		loopDelay: opts.loopDelay || 0,

		// base params
		playing: false,
		delayTicks: 0,
		loopDelayTicks: 0,

		loopIterations: 0,
		currLoopIteration: 0,
		
		loopDelayTicks: 0,
		totalClock: 0,
		delayClock: 0,
		loopDelayClock: 0,
		clock: 0	
	}

	return tempSeq;

}

function createTrack( opts ) {

	var tempTrack = {

		// track params
		loop: opts.loop || false,
		linkedTrack: opts.linkedTrack || null,
		sequences: opts.sequences || [],

		// base params
		playing: false,
		totalClock: 0,
		clock: 0,	
	}

	return tempTrack;

}

module.exports.createExpression = createExpression;
module.exports.createSequence = createSequence;
module.exports.createTrack = createTrack;
},{}],23:[function(require,module,exports){
var easing = require('./easing.js').easingEquations;

var seqList = require('./sequences/sequenceList.js')


function computeSeqTarget( thisSeq, modifiers ){

        var getMembers = thisSeq.members;
        var getMembersLen = getMembers.length - 1;

        for ( var i = getMembersLen; i >= 0; i-- ) {

            var thisMem = getMembers[ i ];
            var getModifier = modifiers[ thisMem.name ];
            var computedTarget = 0;
            var modMin = getModifier.min;
            var modMax = getModifier.max;
            var tar = thisMem.target;

            if ( modMin === 0 ) {
                computedTarget = modMax * tar;
            } else {
                if ( modMin < 0 ) {
                    if ( tar >= 0 ) {
                        computedTarget = modMax * tar;
                    } else {
                        computedTarget = modMin * -tar;
                    }
                }
            }
            thisMem.target = computedTarget;
        } // close for i
}

function computeSeqList( modifiers ){
	var seqs = this.seqList;
	for( var seq in seqs ){
		sequencer.computeSeqTarget( seqs[ seq ], modifiers )
	}
};

function updateSequence( modifiers ){
	var mOpts = this.masterOpts;
	var seq = this.sequences;
	var seqLen = seq.length - 1;

	for (var i = seqLen - 1; i >= 0; i--) {
		var thisSeq = seq[ i ];

		if ( thisSeq.playing === true ) {
			var thisMembers = thisSeq.members;
			var thisMembersLen = thisMembers.length - 1;
			for (var i = thisMembersLen; i >= 0; i--) {
				var thisMem = thisMembers[ i ];
				
				if ( thisSeq.returnToInit === true ) {
					var tempClock = thisSeq.totalClock / 2;
				}

				modifiers[ thisMem.name ].curr = easing[ thisSeq.easeFn ]( thisSeq.clock, thisSeq.startValue, thisMem.valueChange, thisSeq.totalClock );
				
				if ( thisSeq.clock === thisSeq.totalClock ) {
					if ( thisSeq.returnToInit === false ) {
						thisSeq.playing = false;
					} else {
						var tempVal = thisSeq.startValue + thisMem.valueChange;
						var tempValChange = thisMem.valueChange * -1;
						thisSeq.startValue = tempVal;
						thisSeq.valueChange = tempValChange;
					}
				}
			}

		}
	}

}



var sequencer = {
	isActive: false,
	seqList: seqList,
	computeSeqTarget: computeSeqTarget,
	computeSeqList: computeSeqList
};

module.exports = sequencer;
},{"./easing.js":12,"./sequences/sequenceList.js":31}],24:[function(require,module,exports){
var expressions = require('./expressions.js');

var bigSadSequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'easeOutCubic',
	members: expressions.bigSad
};

module.exports = bigSadSequence;
},{"./expressions.js":28}],25:[function(require,module,exports){
var expressions = require('./expressions.js');

var bigSmileSequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'easeInOutBack',
	members: expressions.bigSmile
};

module.exports = bigSmileSequence;
},{"./expressions.js":28}],26:[function(require,module,exports){
var expressions = require('./expressions.js');

var blinkSequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'linearEase',
	members: expressions.eyesClosed
};

module.exports = blinkSequence;


},{"./expressions.js":28}],27:[function(require,module,exports){
var expressions = require('./expressions.js');

var ecstaticSequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'easeInOutBack',
	members: expressions.ecstatic
};

module.exports = ecstaticSequence;
},{"./expressions.js":28}],28:[function(require,module,exports){
var createExpression = require( '../sequenceUtils.js' ).createExpression;

var smile = createExpression(
	[ { name: "lookTargetX", target: "0.50" }, { name: "lookTargetY", target: "0.43" }, { name: "lookTargetZ", target: "0.67" }, { name: "leftEyebrow", target: "-0.24" }, { name: "leftBrowContract", target: "0.00" }, { name: "rightEyebrow", target: "-0.24" }, { name: "rightBrowContract", target: "0.00" }, { name: "leftEye", target: "1.00" }, { name: "rightEye", target: "1.00" }, { name: "nostrilRaiseL", target: "0.00" }, { name: "nostrilFlareL", target: "0.00" }, { name: "nostrilRaiseR", target: "0.00" }, { name: "nostrilFlareR", target: "0.00" }, { name: "leftCheek", target: "-0.40" }, { name: "rightCheek", target: "-0.40" }, { name: "mouthEdgeLeft", target: "-0.31" }, { name: "mouthEdgeLeftExtend", target: "-0.57" }, { name: "mouthEdgeRight", target: "0.31" }, { name: "mouthEdgeRightExtend", target: "-0.57" }, { name: "lipsPucker", target: "0.00" }, { name: "topLipOpen", target: "0.00" }, { name: "topLipLeftPull", target: "0.00" }, { name: "topLipRightPull", target: "0.00" }, { name: "bottomLipOpen", target: "0.00" }, { name: "bottomLipLeftPull", target: "0.00" }, { name: "bottomLipRightPull", target: "0.00" }, { name: "jawOpen", target: "0.00" }, { name: "jawLateral", target: "0.00" } ]
);

var bigSmile = createExpression(
	[ { name: "lookTargetX", target: "0.00" }, { name: "lookTargetY", target: "0.00" }, { name: "lookTargetZ", target: "0.00" }, { name: "leftEyebrow", target: "-0.56" }, { name: "leftBrowContract", target: "0.00" }, { name: "rightEyebrow", target: "-0.56" }, { name: "rightBrowContract", target: "0.00" }, { name: "leftEye", target: "1.00" }, { name: "rightEye", target: "1.00" }, { name: "nostrilRaiseL", target: "-0.40" }, { name: "nostrilFlareL", target: "0.00" }, { name: "nostrilRaiseR", target: "-0.40" }, { name: "nostrilFlareR", target: "0.00" }, { name: "leftCheek", target: "-0.40" }, { name: "rightCheek", target: "-0.40" }, { name: "mouthEdgeLeft", target: "-0.59" }, { name: "mouthEdgeLeftExtend", target: "-0.40" }, { name: "mouthEdgeRight", target: "0.59" }, { name: "mouthEdgeRightExtend", target: "-0.40" }, { name: "lipsPucker", target: "0.00" }, { name: "topLipOpen", target: "0.26" }, { name: "topLipLeftPull", target: "0.00" }, { name: "topLipRightPull", target: "0.00" }, { name: "bottomLipOpen", target: "0.59" }, { name: "bottomLipLeftPull", target: "0.00" }, { name: "bottomLipRightPull", target: "0.00" }, { name: "jawOpen", target: "0.00" }, { name: "jawLateral", target: "0.00" } ]
);

var ecstatic = createExpression(
	[ { name: "lookTargetX", target: "0.00" }, { name: "lookTargetY", target: "0.00" }, { name: "lookTargetZ", target: "0.00" }, { name: "leftEyebrow", target: "-1.00" }, { name: "leftBrowContract", target: "0.00" }, { name: "rightEyebrow", target: "-1.00" }, { name: "rightBrowContract", target: "0.00" }, { name: "leftEye", target: "1.00" }, { name: "rightEye", target: "1.00" }, { name: "nostrilRaiseL", target: "-1.00" }, { name: "nostrilFlareL", target: "1.00" }, { name: "nostrilRaiseR", target: "-1.00" }, { name: "nostrilFlareR", target: "1.00" }, { name: "leftCheek", target: "-1.00" }, { name: "rightCheek", target: "-1.00" }, { name: "mouthEdgeLeft", target: "-1.00" }, { name: "mouthEdgeLeftExtend", target: "-0.40" }, { name: "mouthEdgeRight", target: "1" }, { name: "mouthEdgeRightExtend", target: "-0.40" }, { name: "lipsPucker", target: "0.00" }, { name: "topLipOpen", target: "0.00" }, { name: "topLipLeftPull", target: "0.00" }, { name: "topLipRightPull", target: "0.00" }, { name: "bottomLipOpen", target: "1.00" }, { name: "bottomLipLeftPull", target: "0.00" }, { name: "bottomLipRightPull", target: "0.00" }, { name: "jawOpen", target: "0.46" }, { name: "jawLateral", target: "0.00" } ]
);



var sad = createExpression(
	[
		{ name: 'forehead', target: 0.25 },
		{ name: 'leftEyebrow', target: 0.5 },
		{ name: 'rightEyebrow', target: 0.5 },
		{ name: 'mouthWidth', target: -0.25 },
		{ name: 'mouthExpression', target: 0.4 },
		{ name: 'mouthOpen', target: 0 },
		{ name: 'topLipOpen', target: 0 },
		{ name: 'bottomLipOpen', target: 0 },
		{ name: 'leftCheek', target: 0.5 },
		{ name: 'rightCheek', target: 0.5 }
	]
);

var bigSad = createExpression(
	[
		{ name: 'forehead', target: 0.5 },
		{ name: 'leftEyebrow', target: -0.8 },
		{ name: 'rightEyebrow', target: -0.8 },
		{ name: 'mouthWidth', target: -0.3 },
		{ name: 'mouthExpression', target: 0.8 },
		{ name: 'mouthOpen', target: 0.2 },
		{ name: 'topLipOpen', target: 0.1 },
		{ name: 'bottomLipOpen', target: 0.15 },
		{ name: 'leftCheek', target: 0.4 },
		{ name: 'rightCheek', target: 0.4 }
	]
);



var eyesClosed = createExpression(
	[
		{ name: 'leftEye', target: 0 },
		{ name: 'rightEye', target: 0 }
	]
);



var yawnIntro = createExpression(
	[
		{ name: 'leftEyebrow', target: -0.6 },
		{ name: 'rightEyebrow', target: -0.6 },
		{ name: 'mouthExpression', target: 0 },
		{ name: 'mouthBias', target: 0 },
		{ name: 'leftCheek', target: -0.25 },
		{ name: 'leftCheekPull', target: 0 },
		{ name: 'rightCheek', target: -0.25 },
		{ name: 'rightCheekPull', target: 0 },
		{ name: 'leftJowl', target: 0 },
		{ name: 'rightJowl', target: 0 }
	]
);

var yawnMidtro1 = createExpression(
	[
		{ name: 'forehead', target: 1 },
		{ name: 'leftEye', target: 0 },
		{ name: 'rightEye', target: 0 },
		{ name: 'mouthWidth', target: 0.2 },
		{ name: 'mouthOpen', target: 0.8 },
		{ name: 'mouthBias', target: 0 },
		{ name: 'topLipOpen', target: 0.5 },
		{ name: 'bottomLipOpen', target: 0.5 },
	]
);




var reset = createExpression(
	[ { name: "lookTargetX", target: "0.00" }, { name: "lookTargetY", target: "0.00" }, { name: "lookTargetZ", target: "0.00" }, { name: "leftEyebrow", target: "0.00" }, { name: "leftBrowContract", target: "0.00" }, { name: "rightEyebrow", target: "0.00" }, { name: "rightBrowContract", target: "0.00" }, { name: "leftEye", target: "1.00" }, { name: "rightEye", target: "1.00" }, { name: "nostrilRaiseL", target: "0.00" }, { name: "nostrilFlareL", target: "0.00" }, { name: "nostrilRaiseR", target: "0.00" }, { name: "nostrilFlareR", target: "0.00" }, { name: "leftCheek", target: "0.00" }, { name: "rightCheek", target: "0.00" }, { name: "mouthEdgeLeft", target: "0.00" }, { name: "mouthEdgeLeftExtend", target: "0.00" }, { name: "mouthEdgeRight", target: "0" }, { name: "mouthEdgeRightExtend", target: "0.00" }, { name: "lipsPucker", target: "0.00" }, { name: "topLipOpen", target: "0.00" }, { name: "topLipLeftPull", target: "0.00" }, { name: "topLipRightPull", target: "0.00" }, { name: "bottomLipOpen", target: "0.00" }, { name: "bottomLipLeftPull", target: "0.00" }, { name: "bottomLipRightPull", target: "0.00" }, { name: "jawOpen", target: "0.00" }, { name: "jawLateral", target: "0.00" } ]
);









var expressions = {
	smile: smile,
	bigSmile: bigSmile,
	ecstatic: ecstatic,
	sad: sad,
	bigSad: bigSad,
	yawnIntro: yawnIntro,
	yawnMidtro1: yawnMidtro1,
	eyesClosed: eyesClosed,
	reset: reset
}

module.exports = expressions;
},{"../sequenceUtils.js":22}],29:[function(require,module,exports){
var expressions = require('./expressions.js');

var resetSequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'easeInOutQuad',
	members: expressions.reset
};

module.exports = resetSequence;


},{"./expressions.js":28}],30:[function(require,module,exports){
var expressions = require('./expressions.js');

var sadSequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'easeOutCubic',
	members: expressions.sad
};

module.exports = sadSequence;
},{"./expressions.js":28}],31:[function(require,module,exports){
var expressions = require('./expressions.js');

var smileSequence = require('./smileSequence.js');
var bigSmileSequence = require('./bigSmileSequence.js');
var ecstaticSequence = require('./ecstaticSequence.js');
var sadSequence = require('./sadSequence.js');
var bigSadSequence = require('./bigSadSequence.js');
var blinkSequence = require('./blinkSequence.js');
var resetSequence = require('./resetSequence.js');

var yawnIntroSequence = require('./yawnSequence.js').yawnIntroSequence;
var yawnMidtro1Sequence = require('./yawnSequence.js').yawnMidtro1Sequence;

var seqList = {
	smileSequence: smileSequence,
	bigSmileSequence: bigSmileSequence,
	ecstaticSequence: ecstaticSequence,
	sadSequence: sadSequence,
	bigSadSequence: bigSadSequence,
	blinkSequence: blinkSequence,
	yawnIntroSequence: yawnIntroSequence,
	yawnMidtro1Sequence: yawnMidtro1Sequence,
	resetSequence: resetSequence
};

module.exports = seqList;
},{"./bigSadSequence.js":24,"./bigSmileSequence.js":25,"./blinkSequence.js":26,"./ecstaticSequence.js":27,"./expressions.js":28,"./resetSequence.js":29,"./sadSequence.js":30,"./smileSequence.js":32,"./yawnSequence.js":33}],32:[function(require,module,exports){
var expressions = require('./expressions.js');

var smileSequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'easeOutCubic',
	members: expressions.smile
};

module.exports = smileSequence;
},{"./expressions.js":28}],33:[function(require,module,exports){
var expressions = require('./expressions.js');

var yawnIntroSequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'linearEase',
	members: expressions.yawnIntro
};


var yawnMidtro1Sequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'linearEase',
	members: expressions.yawnMidtro1
};

module.exports.yawnIntroSequence = yawnIntroSequence;
module.exports.yawnMidtro1Sequence = yawnMidtro1Sequence;

},{"./expressions.js":28}],34:[function(require,module,exports){
// sine wave modulation

var twoPi = require( './trigonomicUtils.js' ).trigonomicUtils.twoPi;

var sineWave = {
	count: 0,
	iterations: twoPi / 75,
	val: 0,
	invVal: 0
}

sineWave.modulator = function() {
	this.val = Math.sin( this.count ) / 2 + 0.5;
    this.invVal = 1 - this.val;
    this.count += this.iterations;
}

module.exports.sineWave = sineWave;
},{"./trigonomicUtils.js":46}],35:[function(require,module,exports){
var twoPi = require('./trigonomicUtils.js').trigonomicUtils.twoPi;

var numRays = 24;
var raySize = 300;

var sunCorona = {
    numRays: numRays,
    numRaysDouble: numRays * 2,
    raySize: raySize,
    raySizeDiffMax: 100,
    raySpread: 0.025,
    phi: 0
}

sunCorona.render = function( x, y, sineWave, invSineWave, ctx ) {

    const wave = sineWave;
    const invWave = invSineWave;

    const numRays = this.numRaysDouble;
    const baseR = this.rayBaseRadius / 3;
    const raySize = this.raySize;
    const raySpread = this.raySpread;
    const rayDiff = this.raySizeDiffMax;

    // straight rays
    let calculateRay = 0;

    // ctx.beginPath();
    // for ( let i = 0; i < numRays; i++ ) {
    //     let alpha = twoPi * ( i / ( numRays ) ) + this.phi;
    //     if ( i % 2 == 0 ) {
    //         calculateRay = baseR + raySize + ( rayDiff * ( i % 4 == 0 ? invWave : wave ) );
    //         ctx.lineTo(
    //             x + Math.cos( alpha ) * calculateRay,
    //             y + Math.sin( alpha ) * calculateRay
    //         );

    //     } else {
    //         let arcMod = raySpread * wave;
    //         ctx.arc( x, y, baseR, alpha - raySpread - arcMod, alpha + raySpread + arcMod );
    //     }

    // }
    // ctx.closePath();
    // ctx.stroke();
    // end straight rays

    // curved rays
    let testCalc = 0;
    let fipper = false;

    ctx.lineCap = 'round';
    
    ctx.beginPath();
    for ( let i = 0; i < numRays; i++ ) {
        let alpha = twoPi * ( i / ( numRays ) ) + this.phi;
        let alpha2 = twoPi * ( ( i + 1 ) / ( numRays ) ) + this.phi;

        testCalc = baseR + raySize + ( rayDiff * ( fipper == true ? invWave : wave ) );

        if ( i === 0 ) {

            ctx.moveTo(
                x + Math.cos( alpha ) * testCalc,
                y + Math.sin( alpha ) * testCalc,
                );

        } else {

            ctx.quadraticCurveTo(
                x + Math.cos( alpha ) * baseR,
                y + Math.sin( alpha ) * baseR,
                x + Math.cos( alpha2 ) * testCalc,
                y + Math.sin( alpha2 ) * testCalc,
                );

            i++;
        }
        fipper = !fipper;
    }
    ctx.closePath();
    ctx.fill();
    // ctx.stroke();
    // end curved rays

    this.phi += 0.005;

}

module.exports = sunCorona;
},{"./trigonomicUtils.js":46}],36:[function(require,module,exports){
var trig = require('./trigonomicUtils.js').trigonomicUtils;
var twoPi = trig.twoPi;

var randI = require('./mathUtils.js').mathUtils.randomInteger;
var numspike = 8;
var spikeSize = 1600;

var sunSpikes = {
    
    numspike: numspike,
    rotation: ( 2 * Math.PI / numspike ),
    halfRotation: ( 2 * Math.PI / numspike ) / 2,

    renderCfg: {
        canvas: null,
        context: null,
        debugCfg: null
    },

    displayCfg: {
        glareSpikesRandom: {
            isRendered: false,
            isDisplayed: false,
            canvas: null,
            context: null,
            x: 0,
            y: 0
        },
    },

    glareSpikeOptions: {
        x: 150,
        y: 150,
        r: 50,
        majorRayLen: 50,
        majorRayWidth: 0.5,
        minorRayWidth: 0.5,
        angle: Math.PI / 0,
        count: 16,
        blur: 15
    },

    glareSpikeRandomOptions: {
        x: 150,
        y: 150,
        r: 50,
        majorRayLen: 50,
        majorRayWidth: 0.5,
        minorRayWidth: 0.5,
        angle: Math.PI / 0,
        count: 16,
        blur: 15
    },

    flareOptions: {
        context: null,
        canvas: null,
        x: 150,
        y: 150,
        r: 50,
        rayLen: 800,
        flareWidth: 0.1,
        angle: Math.PI / 0,
        count: 6,
        blur: 8
    },

    glareSpikeControlInputCfg: {

        r: { id: 'spikeRadiusInput', min: 0, max: 0, curr: 0, rev: false },
        majorRayLen: { id: 'spikeMajorSize', min: 0, max: 2000, curr: 0, rev: false },
        minorRayLen: { id: 'spikeMinorSize', min: 0, max: 500, curr: 0, rev: false },
        majorRayWidth: {id: 'spikeMajorWidth',  min: 0, max: 2, curr: 0, rev: true },
        minorRayWidth: { id: 'spikeMinorWidth', min: 0, max: 2, curr: 0, rev: true },
        count: { id: 'spikeCountInput', min: 4, max: 100, curr: 0, rev: false },
        blur: { id: 'spikeBlurAmount', min: 0, max: 100, curr: 10, rev: false }

    },

    initGlareSpikeControlInputs: function( stage ) {

        let thisCfg = this.glareSpikeControlInputCfg;
        let currOpts = this.glareSpikeOptions;

        thisCfg.r.curr = currOpts.r;
        thisCfg.r.max = thisCfg.r.curr * 2;

        $( '#'+thisCfg.r.id )
            .attr( {
                    'min': thisCfg.r.min,
                    'max': thisCfg.r.max,
                    'value': thisCfg.r.curr
                } )
                .prop( {
                    'min': thisCfg.r.min,
                    'max': thisCfg.r.max,
                    'value': thisCfg.r.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.r.curr );

        thisCfg.majorRayLen.curr = currOpts.majorRayLen;

        $( '#'+thisCfg.majorRayLen.id )
            .attr( {
                    'min': thisCfg.majorRayLen.min,
                    'max': thisCfg.majorRayLen.max,
                    'value': thisCfg.majorRayLen.curr
                } )
                .prop( {
                    'min': thisCfg.majorRayLen.min,
                    'max': thisCfg.majorRayLen.max,
                    'value': thisCfg.majorRayLen.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.majorRayLen.curr );

        thisCfg.minorRayLen.curr = currOpts.minorRayLen;

        $( '#'+thisCfg.minorRayLen.id )
            .attr( {
                    'min': thisCfg.minorRayLen.min,
                    'max': thisCfg.minorRayLen.max,
                    'value': thisCfg.minorRayLen.curr
                } )
                .prop( {
                    'min': thisCfg.minorRayLen.min,
                    'max': thisCfg.minorRayLen.max,
                    'value': thisCfg.minorRayLen.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.minorRayLen.curr );

        thisCfg.count.curr = currOpts.count;

        $( '#'+thisCfg.count.id )
            .attr( {
                    'min': thisCfg.count.min,
                    'max': thisCfg.count.max,
                    'value': thisCfg.count.curr
                } )
                .prop( {
                    'min': thisCfg.count.min,
                    'max': thisCfg.count.max,
                    'value': thisCfg.count.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.count.curr );

        thisCfg.blur.curr = currOpts.blur;
        // console.log( 'currOpts.blur: ', currOpts.blur );
        // console.log( 'thisCfg.blur.curr: ', thisCfg.blur.curr );
        $( '#'+thisCfg.blur.id )
            .attr( {
                    'min': thisCfg.blur.min,
                    'max': thisCfg.blur.max,
                    'value': thisCfg.blur.curr
                } )
                .prop( {
                    'min': thisCfg.blur.min,
                    'max': thisCfg.blur.max,
                    'value': thisCfg.blur.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.blur.curr );

        thisCfg.majorRayWidth.curr = currOpts.majorRayWidth * thisCfg.majorRayWidth.max;
        $( '#'+thisCfg.majorRayWidth.id )
            .attr( {
                    'min': -thisCfg.majorRayWidth.max,
                    'max': thisCfg.majorRayWidth.max,
                    'value': thisCfg.majorRayWidth.curr
                } )
                .prop( {
                    'min': -thisCfg.majorRayWidth.max,
                    'max': thisCfg.majorRayWidth.max,
                    'value': thisCfg.majorRayWidth.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.majorRayWidth.curr );

        thisCfg.minorRayWidth.curr = currOpts.minorRayWidth * thisCfg.minorRayWidth.max;
        $( '#'+thisCfg.minorRayWidth.id )
            .attr( {
                    'min': -thisCfg.minorRayWidth.min,
                    'max': thisCfg.minorRayWidth.max,
                    'value': thisCfg.minorRayWidth.curr
                } )
                .prop( {
                    'min': -thisCfg.minorRayWidth.min,
                    'max': thisCfg.minorRayWidth.max,
                    'value': thisCfg.minorRayWidth.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.minorRayWidth.curr );
    },

    clearRenderCtx: function() {
        let renderCfg = this.renderCfg;
        renderCfg.context.clearRect(
            0, 0, renderCfg.canvas.width, renderCfg.canvas.height

        );
    }
}




var randomW = [];
var randomH = [];

for (var i = 100; i >= 0; i--) {
    randomW.push( randI( 100, 200 ) );
}

for (var i = 100; i >= 0; i--) {
    randomH.push( randI( 20, 100 ) );
}

sunSpikes.render = function( x, y, imgeCfg, ctx ) {

    const image = imgeCfg;
    let currRotation = this.halfRotation;

    ctx.translate( x, y );

    for ( let i = 0; i < numspike; i++ ) {
        
        ctx.rotate( currRotation );

        ctx.drawImage(
            // source
            image.canvas, image.x, image.y, image.w, image.h,
            // destination
            0, -image.h / 2, image.w, image.h
        );
        ctx.rotate( -currRotation );
        currRotation += this.rotation;  
        
    }
    
    ctx.translate( -x, -y );
}

sunSpikes.renderRainbowSpikes = function( options, context ) {

    const ctx = context;
    const debugConfig = this.renderCfg.debugCfg;
    const baseOpts = this.glareSpikeOptions;
    const opts = options;
    console.log( 'opts: ', opts );
    // configuration
    const x = opts.x || baseOpts.x || ctx.width / 2;
    const y = opts.y || baseOpts.y;
    const a = opts.angle || baseOpts.angle;
    const d = opts.d || baseOpts.d || 200;
    const numRays = opts.count || baseOpts.count || 4;
    const numRaysMultiple = numRays * 2;

    const baseR = opts.r || baseOpts.r || 150;
    const curveR = opts.curveR || baseOpts.curveR || baseR;

    const image = opts.imageCfg;
    const imgSrc = image.src;
    let amt = numRays;
    let rotation = ( 2 * Math.PI / amt );
    // let halfRotation = ( 2 * Math.PI / amt ) / 2;
    let currRotation = rotation;
    let widthScale = image.w * 2;
    let heightScale = image.h * 3;

    let currBlend = ctx.globalCompositeOperation;


    ctx.globalAlpha = 0.6;
    // ctx.globalCompositeOperation = 'hue';

    ctx.translate( x, y );
    ctx.rotate( -a );
    for ( let i = 0; i < amt; i++ ) {
        ctx.rotate( currRotation );
        ctx.fillStyle = 'red';
        ctx.fillCircle( 0, 0, 10 );
        ctx.drawImage(
            // source
            imgSrc, 0, 0, image.w, image.h,
            // destination
            d, -( heightScale/2 ), widthScale, heightScale
        );
        ctx.rotate( -currRotation );
        currRotation += rotation;  
        
    }
    ctx.rotate( a );
    ctx.translate( -x, -y );

    ctx.globalAlpha = 1;

    ctx.globalCompositeOperation = currBlend;

    // output config for renders
    this.displayCfg.rainbowSpikes = {
        x: x - ( d + widthScale ),
        y: y - ( d + widthScale ), 
        w: ( d * 2 ) + ( widthScale * 2 ),
        h: ( d * 2 ) + ( widthScale * 2 )
    }
}

sunSpikes.clearAssetCanvas = function( ctx, canvas ) {
    ctx.clearRect( 0, 0, canvas.width, canvas.height );
}

sunSpikes.renderGlareSpikes = function( options ) {

    const ctx = this.renderCfg.context;
    const debugConfig = this.renderCfg.debugCfg
    const opts = options || this.glareSpikeOptions;

    // configuration
    const x = opts.x || ctx.width / 2;
    const y = opts.y;
    const a = opts.angle || 0;
    const numRays = opts.count || 4;
    const numRaysMultiple = numRays * 2;

    const baseR = opts.r || 150;
    const curveR = opts.curveR || baseR;

    const majorRayLen = baseR + opts.majorRayLen || baseR + 300;
    const minorRayLen = baseR + opts.minorRayLen || baseR + opts.majorRayLen / 2 || baseR + 150;

    const majorRayInputFlipped = 1 - opts.majorRayWidth;
    const minorRayInputFlipped = 1 - opts.minorRayWidth;
    const maxRayWidth = twoPi / numRaysMultiple;
    const majorRayWidth = majorRayInputFlipped * maxRayWidth;
    const minorRayWidth = minorRayInputFlipped * maxRayWidth;

    const blur = opts.blur || 10;

    const shadowRenderOffset = debugConfig.displayGlareSpikes === false ? 100000 : 0;
    
    let flipper = true;

    // drawing
    ctx.globalCompositeOperation = 'source-over';
    ctx.translate( x, y - shadowRenderOffset );
    ctx.rotate( -a );
 
    ctx.beginPath();
    for ( let i = 0; i < numRaysMultiple; i++ ) {

        let iNumRays = i / numRays;
        let iNumRaysMulti = i / numRaysMultiple;

        let alpha = twoPi * ( i / ( numRaysMultiple ) );
        let alpha2 = twoPi * ( ( i + 1 ) / ( numRaysMultiple ) );

        let alphaMidPoint = alpha + ( twoPi * numRaysMultiple );

        let curve1Alpha = alphaMidPoint - ( flipper ? minorRayWidth : majorRayWidth );
        let curve2Alpha = alphaMidPoint + ( flipper ? majorRayWidth : minorRayWidth );

        let flippedRaySize = flipper ? majorRayLen : minorRayLen;

        if ( i === 0 ) {
            ctx.moveTo(
                Math.cos( alpha ) * flippedRaySize,
                Math.sin( alpha ) * flippedRaySize,
                );
        } else {

            ctx.bezierCurveTo(
                Math.cos( curve1Alpha ) * curveR, Math.sin( curve1Alpha ) * curveR,
                Math.cos( curve2Alpha ) * curveR, Math.sin( curve2Alpha ) * curveR,
                Math.cos( alpha2 ) * flippedRaySize,
                Math.sin( alpha2 ) * flippedRaySize
            );

            i++;
        }

        flipper = !flipper;

        if ( i === numRaysMultiple - 1 ) {
            break;
        }
    }
    ctx.closePath();


    if ( !debugConfig.displayGlareSpikes ) {
        ctx.shadowColor = 'white';
        ctx.shadowBlur = blur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = shadowRenderOffset;
        ctx.fill();
        ctx.shadowBlur = 0;
    } else {
        ctx.strokeStyle = 'red';
        ctx.stroke();
    }

    ctx.rotate( a );
    ctx.translate( -x, -y + shadowRenderOffset );

    // debug display

    let debugFlipper = true;
    let debugCurveR = curveR;
    let debugTextOffset = 30;

    if ( debugConfig.displayGlareSpikes ) {
        ctx.translate( x, y );
        
        ctx.font = "normal 14px Tahoma";
        ctx.fillStyle = "#666666";
        ctx.setLineDash( [ 1, 6 ] );

        ctx.strokeCircle( 0, 0, baseR );
        // ctx.fillText( 'Radius', baseR + 10, 0 );

        ctx.strokeCircle( 0, 0, debugCurveR );
        ctx.fillText( 'Curve Point Radius', debugCurveR + 10, 0 );

        ctx.strokeCircle( 0, 0, minorRayLen );
        ctx.fillText( 'Minor Spike Radius', minorRayLen + 10, 0 );

        ctx.strokeCircle( 0, 0, majorRayLen );
        let textMetrics = ctx.measureText("Major Spike Radius");
        let textW = textMetrics.width + 10;
        ctx.fillText( 'Major Spike Radius', majorRayLen - textW, 0 );

        ctx.setLineDash( [] );

        ctx.rotate( -a );

        ctx.font = "normal 14px Tahoma";

        // points and lines
        for ( let i = 0; i < numRaysMultiple; i++ ) {

            let iNumRays = i / numRays;
            let iNumRaysMulti = i / numRaysMultiple;
            let alpha = twoPi * ( i / ( numRaysMultiple ) );
            let alpha2 = twoPi * ( ( i + 1 ) / ( numRaysMultiple ) );

            let alphaMidPoint = alpha + ( twoPi * numRaysMultiple );

            let curve1Alpha = alphaMidPoint - ( debugFlipper ? minorRayWidth : majorRayWidth );
            let curve2Alpha = alphaMidPoint + ( debugFlipper ? majorRayWidth : minorRayWidth );

            let debugLineAlpha = twoPi * ( i / numRaysMultiple );
            let debugFlippedRaySize = debugFlipper ? majorRayLen : minorRayLen;

            if ( i === 0 ) {

                // first point
                ctx.fillStyle = 'rgba( 255, 0, 0, 1 )';
                ctx.strokeStyle = 'rgba( 255, 0, 0, 1 )';
                ctx.fillCircle(
                    Math.cos( alpha ) * debugFlippedRaySize,
                    Math.sin( alpha ) * debugFlippedRaySize,
                    5
                    );
                ctx.line( 
                    0, 0, 
                    Math.cos( alpha ) * debugFlippedRaySize,
                    Math.sin( alpha ) * debugFlippedRaySize
                )

                ctx.fillText( i, Math.cos( alpha ) * ( debugFlipper ? majorRayLen : minorRayLen + debugTextOffset ),
                    Math.sin( alpha ) * debugFlippedRaySize + debugTextOffset );

            } else {

                // centre angle of control points
                ctx.setLineDash( [ 1, 6 ] );
                ctx.line( 0, 0, Math.cos( alphaMidPoint ) * majorRayLen, Math.sin( alphaMidPoint ) * majorRayLen );
                ctx.strokeCircle( 0, 0, curveR );
                ctx.setLineDash( [] );


                // first control point of curve ( minus from centre point )
                if ( debugFlipper ) {
                    ctx.fillStyle = 'green';
                    ctx.strokeStyle = 'green';
                } else {
                    ctx.fillStyle = 'blue';
                    ctx.strokeStyle = 'blue';
                }

                ctx.fillCircle( Math.cos( curve1Alpha ) * debugCurveR, Math.sin( curve1Alpha ) * debugCurveR,
                    3
                    );
                ctx.line( 0, 0, Math.cos( curve1Alpha ) * debugCurveR, Math.sin( curve1Alpha ) * debugCurveR );

                // ctx.fillText( i, Math.cos( curve1Alpha ) * ( debugCurveR + debugTextOffset ), Math.sin( curve1Alpha ) * ( debugCurveR + debugTextOffset ) );



                // second control point of curve ( plus from centre point )
                if ( !debugFlipper ) {
                    ctx.fillStyle = 'green';
                    ctx.strokeStyle = 'green';
                } else {
                    ctx.fillStyle = 'blue';
                    ctx.strokeStyle = 'blue';
                }

                ctx.fillCircle(
                    Math.cos( curve2Alpha ) * debugCurveR, Math.sin( curve2Alpha ) * debugCurveR,
                    3
                    );
                // ctx.fillText( i, Math.cos( curve2Alpha ) * ( debugCurveR + debugTextOffset ), Math.sin( curve2Alpha ) * ( debugCurveR + debugTextOffset ) );
                ctx.line( 0, 0, Math.cos( curve2Alpha ) * debugCurveR, Math.sin( curve2Alpha ) * debugCurveR );



                // end point of curve
                ctx.fillStyle = 'rgba( 255, 0, 0, 1 )';
                ctx.strokeStyle = 'rgba( 255, 0, 0, 1 )';
                ctx.fillCircle(
                    Math.cos( alpha2 ) * debugFlippedRaySize, Math.sin( alpha2 ) * debugFlippedRaySize,
                    5
                    );
                ctx.fillText(
                    i + 1, 
                    Math.cos( alpha2 ) * ( debugFlippedRaySize + debugTextOffset ),
                    Math.sin( alpha2 ) * ( debugFlippedRaySize + debugTextOffset )
                );
                ctx.line(
                    0, 0,
                    Math.cos( alpha2 ) * debugFlippedRaySize,
                    Math.sin( alpha2 ) * debugFlippedRaySize
                );

                i += 1;
            }

            debugFlipper = !debugFlipper;

            if ( i === numRaysMultiple - 1 ) {
                break;
            }
        }

        // hulls
        ctx.strokeStyle = 'white';

        ctx.beginPath();

        let hullFlipper = true;
        for ( let i = 0; i < numRaysMultiple; i++ ) {

            let iNumRays = i / numRays;
            let iNumRaysMulti = i / numRaysMultiple;
            let alpha = twoPi * ( i / ( numRaysMultiple ) );
            let alpha2 = twoPi * ( ( i + 1 ) / ( numRaysMultiple ) );

            let alphaMidPoint = alpha + ( twoPi * numRaysMultiple );

            let curve1Alpha = alphaMidPoint - ( hullFlipper ? minorRayWidth : majorRayWidth );
            let curve2Alpha = alphaMidPoint + ( hullFlipper ? majorRayWidth : minorRayWidth );

            let flippedRaySize = hullFlipper ? majorRayLen : minorRayLen;

            if ( i === 0 ) {
                ctx.moveTo(
                    Math.cos( alpha ) * flippedRaySize,
                    Math.sin( alpha ) * flippedRaySize,
                    );
            } else {
                ctx.lineTo( Math.cos( curve1Alpha ) * curveR, Math.sin( curve1Alpha ) * curveR );
                ctx.lineTo( Math.cos( curve2Alpha ) * curveR, Math.sin( curve2Alpha ) * curveR );
                ctx.lineTo( Math.cos( alpha2 ) * flippedRaySize, Math.sin( alpha2 ) * flippedRaySize );

                i++;
            }

            hullFlipper = !hullFlipper;

            if ( i === numRaysMultiple - 1 ) {
                break;
            }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash( [] );


        ctx.rotate( a );
        ctx.translate( -x, -y );
    }

    let maxRayLen = majorRayLen > minorRayLen ? majorRayLen : minorRayLen;

    // output config for renders
    this.displayCfg.glareSpikes = {
        x: x - maxRayLen - 10,
        y: y - maxRayLen - 10, 
        w: maxRayLen * 2 + 20,
        h: maxRayLen * 2 + 20
    }
}

sunSpikes.renderGlareSpikesRandom = function( options ) {

    const ctx = this.renderCfg.context;
    const debugConfig = this.renderCfg.debugCfg
    const opts = options || this.glareSpikeRandomOptions;

    // configuration
    const x = opts.x || ctx.width / 2;
    const y = opts.y;
    const a = opts.angle || 0;
    const numRays = opts.count || 4;
    const numRaysMultiple = numRays * 2;

    const baseR = opts.r || 150;
    const curveR = opts.curveR || baseR;

    let maxSize = opts.majorRayLen || 600;
    let minSize = opts.minorRayLen || 300;

    let randomSize = []; 
    for (var i = numRaysMultiple; i >= 0; i--) {
        randomSize.push( randI( minSize, maxSize ) );
    }

    // const majorRayLen = baseR + opts.majorRayLen || baseR + 300;
    // const minorRayLen = baseR + opts.minorRayLen || baseR + opts.majorRayLen / 2 || baseR + 150;

    const majorRayInputFlipped = 1 - opts.majorRayWidth;
    const minorRayInputFlipped = 1 - opts.minorRayWidth;
    const maxRayWidth = twoPi / numRaysMultiple;
    const majorRayWidth = majorRayInputFlipped * maxRayWidth;
    const minorRayWidth = minorRayInputFlipped * maxRayWidth;

    const blur = opts.blur || 10;

    const shadowRenderOffset = debugConfig.displayGlareSpikes === false ? 100000 : 0;
    


    let flipper = true;

    // drawing
    ctx.globalCompositeOperation = 'source-over';
    ctx.translate( x, y - shadowRenderOffset );
    ctx.rotate( -a );
 
    ctx.beginPath();
    for ( let i = 0; i < numRaysMultiple; i++ ) {

        let iNumRays = i / numRays;
        let iNumRaysMulti = i / numRaysMultiple;

        let alpha = twoPi * ( i / ( numRaysMultiple ) );
        let alpha2 = twoPi * ( ( i + 1 ) / ( numRaysMultiple ) );

        let alphaMidPoint = alpha + ( twoPi * numRaysMultiple );

        let curve1Alpha = alphaMidPoint - maxRayWidth;
        let curve2Alpha = alphaMidPoint + maxRayWidth;

        if ( i === 0 ) {
            ctx.moveTo(
                Math.cos( alpha ) * ( baseR + randomSize[ i ] ),
                Math.sin( alpha ) * ( baseR + randomSize[ i ] ),
                );
        } else {

            ctx.bezierCurveTo(
                Math.cos( curve1Alpha ) * curveR, Math.sin( curve1Alpha ) * curveR,
                Math.cos( curve2Alpha ) * curveR, Math.sin( curve2Alpha ) * curveR,
                Math.cos( alpha2 ) * ( baseR + randomSize[ i + 1 ] ),
                Math.sin( alpha2 ) * ( baseR + randomSize[ i + 1 ] )
            );

            i++;
        }
        console.log( )
        flipper = !flipper;

        if ( i === numRaysMultiple - 1 ) {
            break;
        }
    }
    ctx.closePath();


    if ( !debugConfig.displayGlareSpikes ) {
        ctx.shadowColor = 'white';
        ctx.shadowBlur = blur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = shadowRenderOffset;
        ctx.fill();
        ctx.shadowBlur = 0;
    } else {
        ctx.strokeStyle = 'red';
        ctx.stroke();
    }

    ctx.rotate( a );
    ctx.translate( -x, -y + shadowRenderOffset );

    // debug display

    let maxRayLen = maxSize;

    // output config for renders
    this.displayCfg.glareSpikesRandom.render = {
        x: x - maxRayLen - 10,
        y: y - maxRayLen - 10, 
        w: maxRayLen * 2 + 20,
        h: maxRayLen * 2 + 20
    }

    this.displayCfg.glareSpikesRandom.isRendered = true;

}

sunSpikes.displayCorona = function() {
    let glareSpikeOpts = this.displayCfg.glareSpikesRandom;
    let itemCfg = glareSpikeOpts.render;
    let c = glareSpikeOpts.context;
    let originCanvas = this.renderCfg.canvas;

    if ( glareSpikeOpts.isRendered === false ) {
        this.renderGlareSpikesRandom();
        this.renderFlares();
    }
    if ( !itemCfg ) {
        return;
    }
    if ( glareSpikeOpts.isDisplayed === false ) {
        // console.log( 'itemCfg: ', itemCfg );
        c.drawImage(
            originCanvas,
            itemCfg.x, itemCfg.y, itemCfg.w, itemCfg.h,
            glareSpikeOpts.x - (itemCfg.w / 2 ), glareSpikeOpts.y - (itemCfg.h / 2 ), itemCfg.w, itemCfg.h
        );
        // glareSpikeOpts.isDisplayed = true;

    }

}


sunSpikes.renderFlares = function( options ) {

    const debugConfig = this.renderCfg.debugCfg
    const opts = this.flareOptions;
    const ctx = opts.context || this.renderCfg.context;
    const renderCanvas = opts.canvas || this.renderCfg.canvas;
    const renderOffset = 100000;
    // configuration
    const x = opts.x || ctx.width / 2;
    const y = opts.y;
    const a = opts.angle || 0;
    const numRays = opts.count || 4;
    const numRaysMultiple = numRays * 2;
    const rayWidth = opts.rayWidth || 0.2;
    const gradientWidth = opts.gradientWidth || 1000;
    const baseR = opts.r || 150;
    const curveR = opts.curveR || baseR;
    const blur = opts.blur || 4;
    const rayLen = baseR + opts.rayLen || baseR + 300;

    const maxRayWidth = twoPi / numRays;
    const raySpread = maxRayWidth * rayWidth;
    console.log( 'maxRayWidth: ', maxRayWidth );
    console.log( 'rayWidth: ', rayWidth );
    console.log( 'flare opts: ', opts );
    // drawing
    ctx.globalCompositeOperation = 'source-over';
    ctx.translate( x, y );
    ctx.rotate( -a );
    ctx.filter = 'blur('+blur+'px)';
    let flareGrd = ctx.createRadialGradient( 0, 0, 0, 0, 0, gradientWidth );
    flareGrd.addColorStop( 0, 'rgba( 255, 255, 255, 1' );
    flareGrd.addColorStop( 1, 'rgba( 255, 255, 255, 0' );
    
    ctx.fillStyle = flareGrd;
    
    for ( let i = 0; i < numRays; i++ ) {

        let alpha = twoPi * ( i / ( numRays ) );

        let point1Alpha = alpha - raySpread;
        let point2Alpha = alpha + raySpread;

        ctx.beginPath();
        ctx.moveTo( 0, 0 );

        // ctx.lineTo( 800, -20 );
        // ctx.lineTo( 800, 20 );

        ctx.lineTo( Math.cos( point1Alpha ) * rayLen, Math.sin( point1Alpha ) * rayLen );
        ctx.lineTo( Math.cos( point2Alpha ) * rayLen, Math.sin( point2Alpha ) * rayLen );
        ctx.closePath();
        // ctx.stroke();
        ctx.fill();

    }
    ctx.filter = 'blur(0px)';
    ctx.rotate( a );
    ctx.translate( -x, -y );

    // output config for renders
    this.displayCfg.flares = {
        canvas: renderCanvas,
        x: x - rayLen - 10,
        y: y - rayLen - 10, 
        w: rayLen * 2 + 20,
        h: rayLen * 2 + 20
    }

}

module.exports = sunSpikes;
},{"./mathUtils.js":18,"./trigonomicUtils.js":46}],37:[function(require,module,exports){
var easing = require( './easing.js' ).easingEquations;

var consoleInfoStyle = 'color: #aaaa00;';

var blink = require( './tracks/blink.js' );
var smile = require( './tracks/smile.js' );
var bigSmile = require( './tracks/bigSmile.js' );
var ecstatic = require( './tracks/ecstatic.js' );
var sad = require( './tracks/sad.js' );
var bigSad = require( './tracks/bigSad.js' );

var yawn = require( './tracks/yawn.js' );

var reset = require( './tracks/reset.js' );

var tracks = {
	blink: blink,
	smile: smile,
	bigSmile: bigSmile,
	ecstatic: ecstatic,
	sad: sad,
	bigSad: bigSad,
	yawn: yawn,
	reset: reset
}

var trackList = Object.keys( tracks );


function calculateLoopIterations( totalTime, loopTime, loopDelayTime ) {
	
	var counter = 0;
	var t = totalTime;

	while ( t > loopTime ) {
		t -= loopTime;
		counter++;
		if ( t > loopDelayTime ) {
			t -= loopDelayTime;
		} else {
			break;
		}
	}
	return counter;
};


function setTrackClock( time, track, sequencer ){

	var isOddNum = ( time & 1 ) ? 1 : 0;
	track.totalClock = time + isOddNum;

	var sequences = track.sequences;
	var seqLen = sequences.length - 1;

	for (var i = seqLen; i >= 0; i--) {

        var seq = sequences[i];
        var exp = sequencer.seqList[ track.sequences[ i ].seq ];
        var availableTime = 0;
        var expDur = 0;

    	seq.totalClock = track.totalClock * seq.dur;
    	seq.delayClock = track.totalClock * seq.delay;
    	seq.delayTicks = seq.delayClock;
    	seq.loopDelayTicks = track.totalClock * seq.loopDelay;

    	availableTime = seq.totalClock - seq.delayTicks;

    	if ( seq.loop === true ) {
    		seq.loopIterations = calculateLoopIterations( availableTime, seq.totalClock, seq.loopDelayTicks );
    	}
    	
    	if ( seq.returnToInit === true ) {
        	exp.totalClock = availableTime / 2;
        } else {
        	exp.totalClock = availableTime;
        }

        // console.log( 'thisSeq: ', thisSeq );
        // console.log( 'exp: ', exp );
    }
};


function setLiveExpressionProps( expression, modifiers ) {

	var memList = expression;
	var memsLen = memList.length - 1;
	
	for (var i = memsLen; i >= 0; i--) {

		var m = memList[ i ];
        var mod = modifiers[ m.name ];
        var delta = 0;
        var c = mod.curr;
        var min = mod.min;
        var max = mod.max;
        var t = m.target;

        var cNeg = c < 0 ? true : false;
        var minNeg = min < 0 ? true : false;
        var tNeg = t < 0 ? true : false;

        var tDelta = 0;

        if ( !minNeg ) {
        	tDelta = max * t;
        } else {

        	if ( !tNeg ) {
        		tDelta = max * t;
        	} else {
        		tDelta = min * -t;
        	}

        }

        delta = tDelta - c;

        m.startValue = c;
        m.valueChange = delta;

	} // for loop
};


function loadTrack( time, trackName, sequencer, modifiers ) {
	var track = this.tracks[ trackName ];
	this.setTrackClock( time, track, sequencer );
};


function startTrack( trackName ) {
	var thisTrack = this.tracks[ trackName ];
	thisTrack.playing = true;
};


function updateTrackPlayer( seq, modifiers ) {
	var thisList = this.trackList;
	thisListLen = thisList.length - 1;
	for (var i = thisListLen; i >= 0; i--) {
		this.checkTrack( this.tracks[ thisList[ i ] ], seq, modifiers );
	}
};


function checkTrack( thisTrack, seq, modifiers ){

	if ( thisTrack.playing === true ) {
		this.updateTrack( thisTrack, seq, modifiers );
	}
};


function updateTrack( thisTrack, sequencer, modifiers ) {

	if ( thisTrack.playing === true ) {
		// console.log( '------- TRACK Cycle Tick --------' );
		if ( thisTrack.clock < thisTrack.totalClock ) {
			
			thisTrack.clock++
			this.updateSequences( thisTrack, sequencer, modifiers );

		} else {
			
			if ( thisTrack.loop === true ) {
				thisTrack.clock = 0;
				// reset sequenceClocks
				// reset expressionClocks
			} else {

				stopTrack( thisTrack, sequencer );
				if ( thisTrack.linkedTrack !== null ) {
					this.loadTrack( thisTrack.totalClock, thisTrack.linkedTrack, sequencer, modifiers );
					this.startTrack( thisTrack.linkedTrack );
				}
			}

		}

	}
};


function updateSequences( thisTrack, sequencer, modifiers ) {

	var thisSeqs = thisTrack.sequences;
	var thisSeqsLen = thisSeqs.length - 1;

	for (var i = thisSeqsLen; i >= 0; i--) {
		var thisSeq = thisSeqs[ i ];
		var expression = sequencer.seqList[ thisSeq.seq ].members;

		if ( thisSeq.clock === thisSeq.delayClock ) {
			this.setLiveExpressionProps( expression, modifiers );
			thisSeq.playing = true;
		}

		if ( thisSeq.playing === true ) {
			if ( thisSeq.clock < thisSeq.totalClock ) {
				this.updateExpression( thisSeq, sequencer, modifiers );
				thisSeq.clock++;
				
				// console.log( 'thisSeq.clock: ', thisSeq.clock );
			} else {

				if ( thisSeq.loop === true ) {
					thisSeq.clock = 0;
					// resetExpression();
				} else {
					thisSeq.playing = false;
					// stopExpression();
				}

			}

		} else {

			if ( thisSeq.delay === true ) {

				if ( thisSeq.delayClock === thisTrack.clock ) {
					thisSeq.playing = true;
				}

			}

		}

	} // close for sequence[ n ] loop;
};


function updateExpression( thisSeq, sequencer, modifiers ) {

	var thisExp = sequencer.seqList[ thisSeq.seq ];
	if ( thisSeq.clock === thisSeq.delayClock ) {
		thisExp.playing = true;
	}
	
	if ( thisExp.playing === true ) {

		if ( thisExp.reversePlay === true ) {
			this.expressionRevPlay( thisExp, thisSeq, sequencer );
		} else {
			this.expressionNormalPlay( thisExp, thisSeq, sequencer );
		}

		this.updateExpressionMembers( thisExp, sequencer, modifiers );
	}
};


function updateExpressionMembers( thisExp, sequencer, modifiers ) {
	
	var thisMembers = thisExp.members;
	var thisMembersLen = thisMembers.length - 1;
	for (var i = thisMembersLen; i >= 0; i--) {
		var thisMem = thisMembers[ i ];

		// console.log( 'thisExp.easeFn: '+thisExp.easeFn+', thisExp.clock: '+thisExp.clock+', thisExp.totalClock: '+thisExp.totalClock+', thisMem.startValue: '+thisMem.startValue+', thisMem.valueChange: '+thisMem.valueChange );

		modifiers[ thisMem.name ].curr = easing[ thisExp.easeFn ]( thisExp.clock, thisMem.startValue, thisMem.valueChange, thisExp.totalClock );
		
	}
}


function expressionNormalPlay( thisExp, thisSeq, sequencer ) {

	if ( thisExp.clock < thisExp.totalClock ) {
		thisExp.clock++;

		// console.log( 'thisExp.clock: ', thisExp.clock );
	
		if ( thisExp.clock === thisExp.totalClock ) {
			if ( thisSeq.returnToInit === true ) {
				thisExp.reversePlay = true;
			}
		}

	} else {
		this.expressionCheckLoop( thisExp, thisSeq, sequencer );
	}
};


function expressionRevPlay( thisExp, thisSeq, sequencer ) {
	
	if ( thisExp.clock > 0 ) {
		thisExp.clock--;
		// console.log( 'thisExp.clock: ', thisExp.clock );
	} else {
		this.expressionCheckLoop( thisExp, thisSeq, sequencer );
	}	
};


function expressionCheckLoop( thisExp, thisSeq, sequencer ) {
	if ( thisSeq.loop === true ) {
		thisExp.playing = true;
		thisExp.reversePlay = false;
		thisSeq.clock = 0;
		// set thisSeq.loopDelay
	} else {
		thisExp.playing = false;
		thisExp.reversePlay = false;
		thisSeq.clock = 0;
	}
};


function playTrack( thisTrack ) {

	if ( thisTrack.clock < thisTrack.totalClock ) {
		this.updateClocks( thisTrack );
	} else {
		if ( thisTrack.loop === true ) {
			this.resetClocks( thisTrack );
		} else {
			this.stopTrack( thisTrack );
			this.resetClocks( thisTrack );
		}
	}
};


function stopTrack( thisTrack, sequencer ) {
	thisTrack.playing = false;
	thisTrack.clock = 0;
	
	for (var i = thisTrack.sequences.length - 1; i >= 0; i--) {
		
		var thisSeq = thisTrack.sequences[ i ];
		thisSeq.playing = false;
		thisSeq.clock = 0;

		var thisExp = sequencer.seqList[ thisSeq.seq ]; 
		thisExp.playing = false;
		thisExp.reversePlay = false;
		thisExp.clock = 0;
	}
};


function updateClocks( thisTrack ) {
	thisTrack.clock++;
	// console.log( 'thisTrack.clock: ', thisTrack.clock );
	for (var i = thisTrack.sequences.length - 1; i >= 0; i--) {
		thisTrack.sequences[ i ].clock++;
		// console.log( 'thisTrack.sequences[ i ].clock: ', thisTrack.sequences[ i ].clock ); 
	}
};


function resetClocks( thisTrack ) {
	thisTrack.clock = 0;
	for (var i = thisTrack.sequences.length - 1; i >= 0; i--) {
		thisTrack.sequences[ i ].clock = 0; 
	}
};


var trackPlayer = {

	setTrackClock: setTrackClock,
	setLiveExpressionProps: setLiveExpressionProps,
	loadTrack: loadTrack,
	startTrack: startTrack,
	stopTrack: stopTrack,
	playTrack: playTrack,
	checkTrack: checkTrack,
	updateClocks: updateClocks,
	resetClocks: resetClocks,
	updateSequences: updateSequences,
	expressionNormalPlay: expressionNormalPlay,
	expressionRevPlay: expressionRevPlay,
	expressionCheckLoop: expressionCheckLoop,
	updateExpression: updateExpression,
	updateExpressionMembers: updateExpressionMembers,
	updateTrack: updateTrack,
	updateTrackPlayer: updateTrackPlayer,
	tracks: tracks,
	trackList: trackList

}


module.exports = trackPlayer;
},{"./easing.js":12,"./tracks/bigSad.js":38,"./tracks/bigSmile.js":39,"./tracks/blink.js":40,"./tracks/ecstatic.js":41,"./tracks/reset.js":42,"./tracks/sad.js":43,"./tracks/smile.js":44,"./tracks/yawn.js":45}],38:[function(require,module,exports){
var sequenceUtils = require( '../sequenceUtils.js');
var createSequence = sequenceUtils.createSequence;
var createTrack = sequenceUtils.createTrack;

// if sequence.dur(ation) != 1
// 		then 
// 			sequence:
// 				dur + delay(?) = 1
// if sequence.loop = true
// 		then
// 			sequence:
//				dur + delay(?) + loopDelay(?) = <= 1

var bigSadSequence = createSequence( {
	seq: 'bigSadSequence'

} );


var bigSad = createTrack( {
	sequences: [ bigSadSequence ]
} );

module.exports = bigSad;

},{"../sequenceUtils.js":22}],39:[function(require,module,exports){
var bigSmile = {
	playing: false,
	totalClock: 0,
	clock: 0,
	loop: false,
	linkedTrack: null,
	sequences: [
		{	
			playing: false,
			dur: 1,
			delay: 0,
			loop: false,
			loopDelay: 0,
			returnToInit: false,
			totalClock: 0,
			delayClock: 0,
			clock: 0,
			seq: 'bigSmileSequence'
		}
	]
			
}

module.exports = bigSmile;

},{}],40:[function(require,module,exports){
var blink = {
	playing: false,
	totalClock: 0,
	clock: 0,
	loop: false,
	linkedTrack: null,
	sequences: [
		{	
			playing: false,
			dur: 1,
			delay: 0,
			loop: false,
			loopDelay: 0,
			returnToInit: true,
			totalClock: 0,
			delayClock: 0,
			clock: 0,
			seq: 'blinkSequence'
		}
	]
			
}

module.exports = blink;

},{}],41:[function(require,module,exports){
var ecstatic = {
	playing: false,
	totalClock: 0,
	clock: 0,
	loop: false,
	linkedTrack: null,
	sequences: [
		{	
			playing: false,
			dur: 1,
			delay: 0,
			loop: false,
			loopDelay: 0,
			returnToInit: false,
			totalClock: 0,
			delayClock: 0,
			clock: 0,
			seq: 'ecstaticSequence'
		}
	]
			
}

module.exports = ecstatic;

},{}],42:[function(require,module,exports){
var reset = {
	playing: false,
	totalClock: 0,
	clock: 0,
	loop: false,
	linkedTrack: null,
	sequences: [
		{	
			playing: false,
			dur: 1,
			delay: 0,
			loop: false,
			loopDelay: 0,
			returnToInit: false,
			totalClock: 0,
			delayClock: 0,
			clock: 0,
			seq: 'resetSequence'
		}
	]
			
}

module.exports = reset;

},{}],43:[function(require,module,exports){
var sequenceUtils = require( '../sequenceUtils.js');
var createSequence = sequenceUtils.createSequence;
var createTrack = sequenceUtils.createTrack;

// if sequence.dur(ation) != 1
// 		then 
// 			sequence:
// 				dur + delay(?) = 1
// if sequence.loop = true
// 		then
// 			sequence:
//				dur + delay(?) + loopDelay(?) = <= 1

var sadSequence = createSequence( {
	seq: 'sadSequence'

} );


var sad = createTrack( {
	sequences: [ sadSequence ]
} );

module.exports = sad;

},{"../sequenceUtils.js":22}],44:[function(require,module,exports){
var sequenceUtils = require( '../sequenceUtils.js');
var createSequence = sequenceUtils.createSequence;
var createTrack = sequenceUtils.createTrack;

// if sequence.dur(ation) != 1
// 		then 
// 			sequence:
// 				dur + delay(?) = 1
// if sequence.loop = true
// 		then
// 			sequence:
//				dur + delay(?) + loopDelay(?) = <= 1

var smileSequence = createSequence( {
	seq: 'smileSequence'

} );


var smile = createTrack( {
	sequences: [ smileSequence ]
} );

module.exports = smile;

},{"../sequenceUtils.js":22}],45:[function(require,module,exports){
var sequenceUtils = require( '../sequenceUtils.js');
var createSequence = sequenceUtils.createSequence;
var createTrack = sequenceUtils.createTrack;

// if sequence.dur(ation) != 1
// 		then 
// 			sequence:
// 				dur + delay(?) = 1
// if sequence.loop = true
// 		then
// 			sequence:
//				dur + delay(?) + loopDelay(?) = <= 1

var yawnIntroSequence = createSequence( {
	seq: 'yawnIntroSequence',
	dur: 0.5

} );

var yawnMidtro1Sequence = createSequence( {
	seq: 'yawnMidtro1Sequence',
	dur: 0.25

} );

var yawn = createTrack( {
	sequences: [ yawnIntroSequence, yawnMidtro1Sequence ]
} );

module.exports = yawn;

},{"../sequenceUtils.js":22}],46:[function(require,module,exports){
var _trigonomicUtils;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
* cached values
*/

var piByHalf = Math.Pi / 180;
var halfByPi = 180 / Math.PI;
var twoPi = 2 * Math.PI;

/**
* provides trigonmic util methods.
*
* @mixin
*/
var trigonomicUtils = (_trigonomicUtils = {

	twoPi: twoPi,
	piByHalf: piByHalf,
	halfByPi: halfByPi,

	angle: function(originX, originY, targetX, targetY) {
        var dx = originX - targetX;
        var dy = originY - targetY;
        var theta = Math.atan2(-dy, -dx);
        return theta;
    },

	/**
 * @description calculate distance between 2 vector coordinates.
 * @param {number} x1 - X coordinate of vector 1.
 * @param {number} y1 - Y coordinate of vector 1.
 * @param {number} x2 - X coordinate of vector 2.
 * @param {number} y2 - Y coordinate of vector 2.
 * @returns {number} result.
 */
	dist: function dist(x1, y1, x2, y2) {
		x2 -= x1;y2 -= y1;
		return Math.sqrt(x2 * x2 + y2 * y2);
	},

	/**
 * @description convert degrees to radians.
 * @param {number} degrees - the degree value to convert.
 * @returns {number} result.
 */
	degreesToRadians: function degreesToRadians(degrees) {
		return degrees * piByHalf;
	},

	/**
 * @description convert radians to degrees.
 * @param {number} radians - the degree value to convert.
 * @returns {number} result.
 */
	radiansToDegrees: function radiansToDegrees(radians) {
		return radians * halfByPi;
	},

	/*
 return useful Trigonomic values from position of 2 objects in x/y space
 where x1/y1 is the current poistion and x2/y2 is the target position
 */
	/**
 * @description calculate trigomomic values between 2 vector coordinates.
 * @param {number} x1 - X coordinate of vector 1.
 * @param {number} y1 - Y coordinate of vector 1.
 * @param {number} x2 - X coordinate of vector 2.
 * @param {number} y2 - Y coordinate of vector 2.
 * @typedef {Object} Calculation
 * @property {number} distance The distance between vectors
 * @property {number} angle The angle between vectors
 * @returns { Calculation } the calculated angle and distance between vectors
 */
	getAngleAndDistance: function getAngleAndDistance(x1, y1, x2, y2) {

		// set up base values
		var dX = x2 - x1;
		var dY = y2 - y1;
		// get the distance between the points
		var d = Math.sqrt(dX * dX + dY * dY);
		// angle in radians
		// var radians = Math.atan2(yDist, xDist) * 180 / Math.PI;
		// angle in radians
		var r = Math.atan2(dY, dX);
		return {
			distance: d,
			angle: r
		};
	},

	/**
 * @description get new X coordinate from angle and distance.
 * @param {number} radians - the angle to transform in radians.
 * @param {number} distance - the distance to transform.
 * @returns {number} result.
 */
	getAdjacentLength: function getAdjacentLength(radians, distance) {
		return Math.cos(radians) * distance;
	}

}, _defineProperty(_trigonomicUtils, "getAdjacentLength", function getAdjacentLength(radians, distance) {
	return Math.sin(radians) * distance;
}), _defineProperty(_trigonomicUtils, "findNewPoint", function findNewPoint(x, y, angle, distance) {
	return {
		x: Math.cos(angle) * distance + x,
		y: Math.sin(angle) * distance + y
	};
}), _defineProperty(_trigonomicUtils, "calculateVelocities", function calculateVelocities(x, y, angle, impulse) {
	var a2 = Math.atan2(Math.sin(angle) * impulse + y - y, Math.cos(angle) * impulse + x - x);
	return {
		xVel: Math.cos(a2) * impulse,
		yVel: Math.sin(a2) * impulse
	};
}), _defineProperty(_trigonomicUtils, "radialDistribution", function radialDistribution(cx, cy, r, a) {
	return {
		x: cx + r * Math.cos(a),
		y: cy + r * Math.sin(a)
	};
}), _trigonomicUtils);

module.exports.trigonomicUtils = trigonomicUtils;
},{}]},{},[13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGJseS1saW5rZWQtbGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kYmx5LWxpbmtlZC1saXN0L2xpYi9pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9kYmx5LWxpbmtlZC1saXN0L2xpYi9saXN0LW5vZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmlzZXF1YWwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LXBhdGgvaW5kZXguanMiLCJzcmMvanMvYW5pbWF0aW9uLmpzIiwic3JjL2pzL2FwcC5qcyIsInNyYy9qcy9jYW52YXNBcGlBdWdtZW50YXRpb24uanMiLCJzcmMvanMvY29sb3JVdGlscy5qcyIsInNyYy9qcy9jb250cm9sUGFuZWwuanMiLCJzcmMvanMvZGVidWdVdGlscy5qcyIsInNyYy9qcy9lYXNpbmcuanMiLCJzcmMvanMvZW50cnkuanMiLCJzcmMvanMvZW52aXJvbm1lbnQuanMiLCJzcmMvanMvZXhwb3J0T3ZlcmxheS5qcyIsInNyYy9qcy9nZWFycy5qcyIsInNyYy9qcy9sZW5zRmxhcmUuanMiLCJzcmMvanMvbWF0aFV0aWxzLmpzIiwic3JjL2pzL211c2NsZU1vZGlmaWVyLmpzIiwic3JjL2pzL292ZXJsYXkuanMiLCJzcmMvanMvcHJvcG9ydGlvbmFsTWVhc3VyZXMuanMiLCJzcmMvanMvc2VxdWVuY2VVdGlscy5qcyIsInNyYy9qcy9zZXF1ZW5jZXIuanMiLCJzcmMvanMvc2VxdWVuY2VzL2JpZ1NhZFNlcXVlbmNlLmpzIiwic3JjL2pzL3NlcXVlbmNlcy9iaWdTbWlsZVNlcXVlbmNlLmpzIiwic3JjL2pzL3NlcXVlbmNlcy9ibGlua1NlcXVlbmNlLmpzIiwic3JjL2pzL3NlcXVlbmNlcy9lY3N0YXRpY1NlcXVlbmNlLmpzIiwic3JjL2pzL3NlcXVlbmNlcy9leHByZXNzaW9ucy5qcyIsInNyYy9qcy9zZXF1ZW5jZXMvcmVzZXRTZXF1ZW5jZS5qcyIsInNyYy9qcy9zZXF1ZW5jZXMvc2FkU2VxdWVuY2UuanMiLCJzcmMvanMvc2VxdWVuY2VzL3NlcXVlbmNlTGlzdC5qcyIsInNyYy9qcy9zZXF1ZW5jZXMvc21pbGVTZXF1ZW5jZS5qcyIsInNyYy9qcy9zZXF1ZW5jZXMveWF3blNlcXVlbmNlLmpzIiwic3JjL2pzL3NpbmVXYXZlTW9kdWxhdG9yLmpzIiwic3JjL2pzL3N1bkNvcm9uYS5qcyIsInNyYy9qcy9zdW5TcGlrZXMuanMiLCJzcmMvanMvdHJhY2tQbGF5ZXIuanMiLCJzcmMvanMvdHJhY2tzL2JpZ1NhZC5qcyIsInNyYy9qcy90cmFja3MvYmlnU21pbGUuanMiLCJzcmMvanMvdHJhY2tzL2JsaW5rLmpzIiwic3JjL2pzL3RyYWNrcy9lY3N0YXRpYy5qcyIsInNyYy9qcy90cmFja3MvcmVzZXQuanMiLCJzcmMvanMvdHJhY2tzL3NhZC5qcyIsInNyYy9qcy90cmFja3Mvc21pbGUuanMiLCJzcmMvanMvdHJhY2tzL3lhd24uanMiLCJzcmMvanMvdHJpZ29ub21pY1V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3h6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy94R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pPQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqZ0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcllBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIEBmaWxlT3ZlcnZpZXcgSW1wbGVtZW50YXRpb24gb2YgYSBkb3VibHkgbGlua2VkLWxpc3QgZGF0YSBzdHJ1Y3R1cmVcbiAqIEBhdXRob3IgSmFzb24gUy4gSm9uZXNcbiAqIEBsaWNlbnNlIE1JVFxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGlzRXF1YWwgPSByZXF1aXJlKCdsb2Rhc2guaXNlcXVhbCcpO1xuICAgIHZhciBOb2RlID0gcmVxdWlyZSgnLi9saWIvbGlzdC1ub2RlJyk7XG4gICAgdmFyIEl0ZXJhdG9yID0gcmVxdWlyZSgnLi9saWIvaXRlcmF0b3InKTtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIERvdWJseSBsaW5rZWQgbGlzdCBjbGFzc1xuICAgICAqXG4gICAgICogSW1wbGVtZW50YXRpb24gb2YgYSBkb3VibHkgbGlua2VkIGxpc3QgZGF0YSBzdHJ1Y3R1cmUuICBUaGlzXG4gICAgICogaW1wbGVtZW50YXRpb24gcHJvdmlkZXMgdGhlIGdlbmVyYWwgZnVuY3Rpb25hbGl0eSBvZiBhZGRpbmcgbm9kZXMgdG9cbiAgICAgKiB0aGUgZnJvbnQgb3IgYmFjayBvZiB0aGUgbGlzdCwgYXMgd2VsbCBhcyByZW1vdmluZyBub2RlIGZyb20gdGhlIGZyb250XG4gICAgICogb3IgYmFjay4gIFRoaXMgZnVuY3Rpb25hbGl0eSBlbmFibGVzIHRoaXMgaW1wbGVtZW50aW9uIHRvIGJlIHRoZVxuICAgICAqIHVuZGVybHlpbmcgZGF0YSBzdHJ1Y3R1cmUgZm9yIHRoZSBtb3JlIHNwZWNpZmljIHN0YWNrIG9yIHF1ZXVlIGRhdGFcbiAgICAgKiBzdHJ1Y3R1cmUuXG4gICAgICpcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIExpbmtlZExpc3QgaW5zdGFuY2UuICBFYWNoIGluc3RhbmNlIGhhcyBhIGhlYWQgbm9kZSwgYSB0YWlsXG4gICAgICogbm9kZSBhbmQgYSBzaXplLCB3aGljaCByZXByZXNlbnRzIHRoZSBudW1iZXIgb2Ygbm9kZXMgaW4gdGhlIGxpc3QuXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBEb3VibHlMaW5rZWRMaXN0KCkge1xuICAgICAgICB0aGlzLmhlYWQgPSBudWxsO1xuICAgICAgICB0aGlzLnRhaWwgPSBudWxsO1xuICAgICAgICB0aGlzLnNpemUgPSAwO1xuXG4gICAgICAgIC8vIGFkZCBpdGVyYXRvciBhcyBhIHByb3BlcnR5IG9mIHRoaXMgbGlzdCB0byBzaGFyZSB0aGUgc2FtZVxuICAgICAgICAvLyBpdGVyYXRvciBpbnN0YW5jZSB3aXRoIGFsbCBvdGhlciBtZXRob2RzIHRoYXQgbWF5IHJlcXVpcmVcbiAgICAgICAgLy8gaXRzIHVzZS4gIE5vdGU6IGJlIHN1cmUgdG8gY2FsbCB0aGlzLml0ZXJhdG9yLnJlc2V0KCkgdG9cbiAgICAgICAgLy8gcmVzZXQgdGhpcyBpdGVyYXRvciB0byBwb2ludCB0aGUgaGVhZCBvZiB0aGUgbGlzdC5cbiAgICAgICAgdGhpcy5pdGVyYXRvciA9IG5ldyBJdGVyYXRvcih0aGlzKTtcbiAgICB9XG5cbiAgICAvKiBGdW5jdGlvbnMgYXR0YWNoZWQgdG8gdGhlIExpbmtlZC1saXN0IHByb3RvdHlwZS4gIEFsbCBsaW5rZWQtbGlzdFxuICAgICAqIGluc3RhbmNlcyB3aWxsIHNoYXJlIHRoZXNlIG1ldGhvZHMsIG1lYW5pbmcgdGhlcmUgd2lsbCBOT1QgYmUgY29waWVzXG4gICAgICogbWFkZSBmb3IgZWFjaCBpbnN0YW5jZS4gIFRoaXMgd2lsbCBiZSBhIGh1Z2UgbWVtb3J5IHNhdmluZ3Mgc2luY2UgdGhlcmVcbiAgICAgKiBtYXkgYmUgc2V2ZXJhbCBkaWZmZXJlbnQgbGlua2VkIGxpc3RzLlxuICAgICAqL1xuICAgIERvdWJseUxpbmtlZExpc3QucHJvdG90eXBlID0ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGVzIGEgbmV3IE5vZGUgb2JqZWN0IHdpdGggJ2RhdGEnIGFzc2lnbmVkIHRvIHRoZSBub2RlJ3MgZGF0YVxuICAgICAgICAgKiBwcm9wZXJ0eVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBkYXRhIFRoZSBkYXRhIHRvIGluaXRpYWxpemUgd2l0aCB0aGVcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlXG4gICAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9IE5vZGUgb2JqZWN0IGludGlhbGl6ZWQgd2l0aCAnZGF0YSdcbiAgICAgICAgICovXG4gICAgICAgIGNyZWF0ZU5ld05vZGU6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE5vZGUoZGF0YSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGZpcnN0IG5vZGUgaW4gdGhlIGxpc3QsIGNvbW1vbmx5IHJlZmVycmVkIHRvIGFzIHRoZVxuICAgICAgICAgKiAnaGVhZCcgbm9kZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSB0aGUgaGVhZCBub2RlIG9mIHRoZSBsaXN0XG4gICAgICAgICAqL1xuICAgICAgICBnZXRIZWFkTm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVhZDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgbGFzdCBub2RlIGluIHRoZSBsaXN0LCBjb21tb25seSByZWZlcnJlZCB0byBhcyB0aGVcbiAgICAgICAgICogJ3RhaWwnbm9kZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSB0aGUgdGFpbCBub2RlIG9mIHRoZSBsaXN0XG4gICAgICAgICAqL1xuICAgICAgICBnZXRUYWlsTm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGFpbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGV0ZXJtaW5lcyBpZiB0aGUgbGlzdCBpcyBlbXB0eVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgbGlzdCBpcyBlbXB0eSwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICAgICAqL1xuICAgICAgICBpc0VtcHR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuc2l6ZSA9PT0gMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIHNpemUgb2YgdGhlIGxpc3QsIG9yIG51bWJlciBvZiBub2Rlc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIG5vZGVzIGluIHRoZSBsaXN0XG4gICAgICAgICAqL1xuICAgICAgICBnZXRTaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaXplO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGVhcnMgdGhlIGxpc3Qgb2YgYWxsIG5vZGVzL2RhdGFcbiAgICAgICAgICovXG4gICAgICAgIGNsZWFyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3aGlsZSAoIXRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyMjIyMjIyMjIyMjIyMjIyMjIyBJTlNFUlQgbWV0aG9kcyAjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnNlcnRzIGEgbm9kZSB3aXRoIHRoZSBwcm92aWRlZCBkYXRhIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gZGF0YSBUaGUgZGF0YSB0byBpbml0aWFsaXplIHdpdGggdGhlXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpbnNlcnQgb3BlcmF0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAgICAgICAqL1xuICAgICAgICBpbnNlcnQ6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IHRoaXMuY3JlYXRlTmV3Tm9kZShkYXRhKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZCA9IHRoaXMudGFpbCA9IG5ld05vZGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGFpbC5uZXh0ID0gbmV3Tm9kZTtcbiAgICAgICAgICAgICAgICBuZXdOb2RlLnByZXYgPSB0aGlzLnRhaWw7XG4gICAgICAgICAgICAgICAgdGhpcy50YWlsID0gbmV3Tm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2l6ZSArPSAxO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zZXJ0cyBhIG5vZGUgd2l0aCB0aGUgcHJvdmlkZWQgZGF0YSB0byB0aGUgZnJvbnQgb2YgdGhlIGxpc3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gZGF0YSBUaGUgZGF0YSB0byBpbml0aWFsaXplIHdpdGggdGhlXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpbnNlcnQgb3BlcmF0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAgICAgICAqL1xuICAgICAgICBpbnNlcnRGaXJzdDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0KGRhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IHRoaXMuY3JlYXRlTmV3Tm9kZShkYXRhKTtcblxuICAgICAgICAgICAgICAgIG5ld05vZGUubmV4dCA9IHRoaXMuaGVhZDtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWQucHJldiA9IG5ld05vZGU7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkID0gbmV3Tm9kZTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2l6ZSArPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zZXJ0cyBhIG5vZGUgd2l0aCB0aGUgcHJvdmlkZWQgZGF0YSBhdCB0aGUgaW5kZXggaW5kaWNhdGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggVGhlIGluZGV4IGluIHRoZSBsaXN0IHRvIGluc2VydCB0aGUgbmV3IG5vZGVcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gZGF0YSBUaGUgZGF0YSB0byBpbml0aWFsaXplIHdpdGggdGhlIG5vZGVcbiAgICAgICAgICovXG4gICAgICAgIGluc2VydEF0OiBmdW5jdGlvbiAoaW5kZXgsIGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5nZXRIZWFkTm9kZSgpLFxuICAgICAgICAgICAgICAgIG5ld05vZGUgPSB0aGlzLmNyZWF0ZU5ld05vZGUoZGF0YSksXG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSAwO1xuXG4gICAgICAgICAgICAvLyBjaGVjayBmb3IgaW5kZXggb3V0LW9mLWJvdW5kc1xuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IHRoaXMuZ2V0U2l6ZSgpIC0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgaW5kZXggaXMgMCwgd2UganVzdCBuZWVkIHRvIGluc2VydCB0aGUgZmlyc3Qgbm9kZVxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRGaXJzdChkYXRhKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2hpbGUgKHBvc2l0aW9uIDwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0O1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uICs9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN1cnJlbnQucHJldi5uZXh0ID0gbmV3Tm9kZTtcbiAgICAgICAgICAgIG5ld05vZGUucHJldiA9IGN1cnJlbnQucHJldjtcbiAgICAgICAgICAgIGN1cnJlbnQucHJldiA9IG5ld05vZGU7XG4gICAgICAgICAgICBuZXdOb2RlLm5leHQgPSBjdXJyZW50O1xuXG4gICAgICAgICAgICB0aGlzLnNpemUgKz0gMTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc2VydHMgYSBub2RlIGJlZm9yZSB0aGUgZmlyc3Qgbm9kZSBjb250YWluaW5nIHRoZSBwcm92aWRlZCBkYXRhXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IG5vZGVEYXRhIFRoZSBkYXRhIG9mIHRoZSBub2RlIHRvXG4gICAgICAgICAqICAgICAgICAgZmluZCB0byBpbnNlcnQgdGhlIG5ldyBub2RlIGJlZm9yZVxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBkYXRhVG9JbnNlcnQgVGhlIGRhdGEgdG8gaW5pdGlhbGl6ZSB3aXRoIHRoZSBub2RlXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGluc2VydCBvcGVyYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICAgICAgICovXG4gICAgICAgIGluc2VydEJlZm9yZTogZnVuY3Rpb24gKG5vZGVEYXRhLCBkYXRhVG9JbnNlcnQpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuaW5kZXhPZihub2RlRGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbnNlcnRBdChpbmRleCwgZGF0YVRvSW5zZXJ0KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zZXJ0cyBhIG5vZGUgYWZ0ZXIgdGhlIGZpcnN0IG5vZGUgY29udGFpbmluZyB0aGUgcHJvdmlkZWQgZGF0YVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBub2RlRGF0YSBUaGUgZGF0YSBvZiB0aGUgbm9kZSB0b1xuICAgICAgICAgKiAgICAgICAgIGZpbmQgdG8gaW5zZXJ0IHRoZSBuZXcgbm9kZSBhZnRlclxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBkYXRhVG9JbnNlcnQgVGhlIGRhdGEgdG8gaW5pdGlhbGl6ZSB3aXRoIHRoZSBub2RlXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGluc2VydCBvcGVyYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICAgICAgICovXG4gICAgICAgIGluc2VydEFmdGVyOiBmdW5jdGlvbiAobm9kZURhdGEsIGRhdGFUb0luc2VydCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5pbmRleE9mKG5vZGVEYXRhKTtcbiAgICAgICAgICAgIHZhciBzaXplID0gdGhpcy5nZXRTaXplKCk7XG5cbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHdlIHdhbnQgdG8gaW5zZXJ0IG5ldyBub2RlIGFmdGVyIHRoZSB0YWlsIG5vZGVcbiAgICAgICAgICAgIGlmIChpbmRleCArIDEgPT09IHNpemUpIHtcblxuICAgICAgICAgICAgICAgIC8vIGlmIHNvLCBjYWxsIGluc2VydCwgd2hpY2ggd2lsbCBhcHBlbmQgdG8gdGhlIGVuZCBieSBkZWZhdWx0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0KGRhdGFUb0luc2VydCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2UsIGluY3JlbWVudCB0aGUgaW5kZXggYW5kIGluc2VydCB0aGVyZVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmluc2VydEF0KGluZGV4ICsgMSwgZGF0YVRvSW5zZXJ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ29uY2F0ZW5hdGUgYW5vdGhlciBsaW5rZWQgbGlzdCB0byB0aGUgZW5kIG9mIHRoaXMgbGlua2VkIGxpc3QuIFRoZSByZXN1bHQgaXMgdmVyeVxuICAgICAgICAgKiBzaW1pbGFyIHRvIGFycmF5LmNvbmNhdCBidXQgaGFzIGEgcGVyZm9ybWFuY2UgaW1wcm92ZW1lbnQgc2luY2UgdGhlcmUgaXMgbm8gbmVlZCB0b1xuICAgICAgICAgKiBpdGVyYXRlIG92ZXIgdGhlIGxpc3RzXG4gICAgICAgICAqIEBwYXJhbSB7RG91Ymx5TGlua2VkTGlzdH0gb3RoZXJMaW5rZWRMaXN0XG4gICAgICAgICAqIEByZXR1cm5zIHtEb3VibHlMaW5rZWRMaXN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uY2F0OiBmdW5jdGlvbiAob3RoZXJMaW5rZWRMaXN0KSB7XG4gICAgICAgICAgICBpZiAob3RoZXJMaW5rZWRMaXN0IGluc3RhbmNlb2YgRG91Ymx5TGlua2VkTGlzdCkge1xuICAgICAgICAgICAgICAgIC8vY3JlYXRlIG5ldyBsaXN0IHNvIHRoZSBjYWxsaW5nIGxpc3QgaXMgaW1tdXRhYmxlIChsaWtlIGFycmF5LmNvbmNhdClcbiAgICAgICAgICAgICAgICB2YXIgbmV3TGlzdCA9IG5ldyBEb3VibHlMaW5rZWRMaXN0KCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2l6ZSgpID4gMCkgeyAvL3RoaXMgbGlzdCBpcyBOT1QgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgbmV3TGlzdC5oZWFkID0gdGhpcy5nZXRIZWFkTm9kZSgpO1xuICAgICAgICAgICAgICAgICAgICBuZXdMaXN0LnRhaWwgPSB0aGlzLmdldFRhaWxOb2RlKCk7XG4gICAgICAgICAgICAgICAgICAgIG5ld0xpc3QudGFpbC5uZXh0ID0gb3RoZXJMaW5rZWRMaXN0LmdldEhlYWROb2RlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdGhlckxpbmtlZExpc3QuZ2V0U2l6ZSgpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3TGlzdC50YWlsID0gb3RoZXJMaW5rZWRMaXN0LmdldFRhaWxOb2RlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3TGlzdC5zaXplID0gdGhpcy5nZXRTaXplKCkgKyBvdGhlckxpbmtlZExpc3QuZ2V0U2l6ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHsgLy8ndGhpcycgbGlzdCBpcyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICBuZXdMaXN0LmhlYWQgPSBvdGhlckxpbmtlZExpc3QuZ2V0SGVhZE5vZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3TGlzdC50YWlsID0gb3RoZXJMaW5rZWRMaXN0LmdldFRhaWxOb2RlKCk7XG4gICAgICAgICAgICAgICAgICAgIG5ld0xpc3Quc2l6ZSA9IG90aGVyTGlua2VkTGlzdC5nZXRTaXplKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXdMaXN0O1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gb25seSBjb25jYXQgYW5vdGhlciBpbnN0YW5jZSBvZiBEb3VibHlMaW5rZWRMaXN0XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIyMjIyMjIyMjIyMjIyMjIyMjIFJFTU9WRSBtZXRob2RzICMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXMgdGhlIHRhaWwgbm9kZSBmcm9tIHRoZSBsaXN0XG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZXJlIGlzIGEgc2lnbmlmaWNhbnQgcGVyZm9ybWFuY2UgaW1wcm92ZW1lbnQgd2l0aCB0aGUgb3BlcmF0aW9uXG4gICAgICAgICAqIG92ZXIgaXRzIHNpbmdseSBsaW5rZWQgbGlzdCBjb3VudGVycGFydC4gIFRoZSBtZXJlIGZhY3Qgb2YgaGF2aW5nXG4gICAgICAgICAqIGEgcmVmZXJlbmNlIHRvIHRoZSBwcmV2aW91cyBub2RlIGltcHJvdmVzIHRoaXMgb3BlcmF0aW9uIGZyb20gTyhuKVxuICAgICAgICAgKiAoaW4gdGhlIGNhc2Ugb2Ygc2luZ2x5IGxpbmtlZCBsaXN0KSB0byBPKDEpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgbm9kZSB0aGF0IHdhcyByZW1vdmVkXG4gICAgICAgICAqL1xuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBnZXQgaGFuZGxlIGZvciB0aGUgdGFpbCBub2RlXG4gICAgICAgICAgICB2YXIgbm9kZVRvUmVtb3ZlID0gdGhpcy5nZXRUYWlsTm9kZSgpO1xuXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSBub2RlIGluIHRoZSBsaXN0LCBzZXQgaGVhZCBhbmQgdGFpbFxuICAgICAgICAgICAgLy8gcHJvcGVydGllcyB0byBudWxsXG4gICAgICAgICAgICBpZiAodGhpcy5nZXRTaXplKCkgPT09IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMudGFpbCA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIG1vcmUgdGhhbiBvbmUgbm9kZSBpbiB0aGUgbGlzdFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhaWwgPSB0aGlzLmdldFRhaWxOb2RlKCkucHJldjtcbiAgICAgICAgICAgICAgICB0aGlzLnRhaWwubmV4dCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNpemUgLT0gMTtcblxuICAgICAgICAgICAgcmV0dXJuIG5vZGVUb1JlbW92ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyB0aGUgaGVhZCBub2RlIGZyb20gdGhlIGxpc3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMgdGhlIG5vZGUgdGhhdCB3YXMgcmVtb3ZlZFxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlRmlyc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbm9kZVRvUmVtb3ZlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5nZXRTaXplKCkgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBub2RlVG9SZW1vdmUgPSB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBub2RlVG9SZW1vdmUgPSB0aGlzLmdldEhlYWROb2RlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkID0gdGhpcy5oZWFkLm5leHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkLnByZXYgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuc2l6ZSAtPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbm9kZVRvUmVtb3ZlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVzIHRoZSBub2RlIGF0IHRoZSBpbmRleCBwcm92aWRlZFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBub2RlIHRvIHJlbW92ZVxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgbm9kZSB0aGF0IHdhcyByZW1vdmVkXG4gICAgICAgICAqL1xuICAgICAgICByZW1vdmVBdDogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgbm9kZVRvUmVtb3ZlID0gdGhpcy5maW5kQXQoaW5kZXgpO1xuXG4gICAgICAgICAgICAvLyBjaGVjayBmb3IgaW5kZXggb3V0LW9mLWJvdW5kc1xuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IHRoaXMuZ2V0U2l6ZSgpIC0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiBpbmRleCBpcyAwLCB3ZSBqdXN0IG5lZWQgdG8gcmVtb3ZlIHRoZSBmaXJzdCBub2RlXG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVGaXJzdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiBpbmRleCBpcyBzaXplLTEsIHdlIGp1c3QgbmVlZCB0byByZW1vdmUgdGhlIGxhc3Qgbm9kZSxcbiAgICAgICAgICAgIC8vIHdoaWNoIHJlbW92ZSgpIGRvZXMgYnkgZGVmYXVsdFxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSB0aGlzLmdldFNpemUoKSAtIDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbm9kZVRvUmVtb3ZlLnByZXYubmV4dCA9IG5vZGVUb1JlbW92ZS5uZXh0O1xuICAgICAgICAgICAgbm9kZVRvUmVtb3ZlLm5leHQucHJldiA9IG5vZGVUb1JlbW92ZS5wcmV2O1xuICAgICAgICAgICAgbm9kZVRvUmVtb3ZlLm5leHQgPSBub2RlVG9SZW1vdmUucHJldiA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMuc2l6ZSAtPSAxO1xuXG4gICAgICAgICAgICByZXR1cm4gbm9kZVRvUmVtb3ZlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVzIHRoZSBmaXJzdCBub2RlIHRoYXQgY29udGFpbnMgdGhlIGRhdGEgcHJvdmlkZWRcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gbm9kZURhdGEgVGhlIGRhdGEgb2YgdGhlIG5vZGUgdG8gcmVtb3ZlXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBub2RlIHRoYXQgd2FzIHJlbW92ZWRcbiAgICAgICAgICovXG4gICAgICAgIHJlbW92ZU5vZGU6IGZ1bmN0aW9uIChub2RlRGF0YSkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5pbmRleE9mKG5vZGVEYXRhKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUF0KGluZGV4KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyMjIyMjIyMjIyMjIyMjIyMjIyBGSU5EIG1ldGhvZHMgIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IG5vZGUgY29udGFpbmluZyB0aGUgcHJvdmlkZWQgZGF0YS4gIElmXG4gICAgICAgICAqIGEgbm9kZSBjYW5ub3QgYmUgZm91bmQgY29udGFpbmluZyB0aGUgcHJvdmlkZWQgZGF0YSwgLTEgaXMgcmV0dXJuZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IG5vZGVEYXRhIFRoZSBkYXRhIG9mIHRoZSBub2RlIHRvIGZpbmRcbiAgICAgICAgICogQHJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBub2RlIGlmIGZvdW5kLCAtMSBvdGhlcndpc2VcbiAgICAgICAgICovXG4gICAgICAgIGluZGV4T2Y6IGZ1bmN0aW9uIChub2RlRGF0YSkge1xuICAgICAgICAgICAgdGhpcy5pdGVyYXRvci5yZXNldCgpO1xuICAgICAgICAgICAgdmFyIGN1cnJlbnQ7XG5cbiAgICAgICAgICAgIHZhciBpbmRleCA9IDA7XG5cbiAgICAgICAgICAgIC8vIGl0ZXJhdGUgb3ZlciB0aGUgbGlzdCAoa2VlcGluZyB0cmFjayBvZiB0aGUgaW5kZXggdmFsdWUpIHVudGlsXG4gICAgICAgICAgICAvLyB3ZSBmaW5kIHRoZSBub2RlIGNvbnRhaW5nIHRoZSBub2RlRGF0YSB3ZSBhcmUgbG9va2luZyBmb3JcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLml0ZXJhdG9yLmhhc05leHQoKSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSB0aGlzLml0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNFcXVhbChjdXJyZW50LmdldERhdGEoKSwgbm9kZURhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW5kZXggKz0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gb25seSBnZXQgaGVyZSBpZiB3ZSBkaWRuJ3QgZmluZCBhIG5vZGUgY29udGFpbmluZyB0aGUgbm9kZURhdGFcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgZmlzdCBub2RlIGNvbnRhaW5pbmcgdGhlIHByb3ZpZGVkIGRhdGEuICBJZiBhIG5vZGVcbiAgICAgICAgICogY2Fubm90IGJlIGZvdW5kIGNvbnRhaW5pbmcgdGhlIHByb3ZpZGVkIGRhdGEsIC0xIGlzIHJldHVybmVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBub2RlRGF0YSBUaGUgZGF0YSBvZiB0aGUgbm9kZSB0byBmaW5kXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBub2RlIGlmIGZvdW5kLCAtMSBvdGhlcndpc2VcbiAgICAgICAgICovXG4gICAgICAgIGZpbmQ6IGZ1bmN0aW9uIChub2RlRGF0YSkge1xuICAgICAgICAgICAgLy8gc3RhcnQgYXQgdGhlIGhlYWQgb2YgdGhlIGxpc3RcbiAgICAgICAgICAgIHRoaXMuaXRlcmF0b3IucmVzZXQoKTtcbiAgICAgICAgICAgIHZhciBjdXJyZW50O1xuXG4gICAgICAgICAgICAvLyBpdGVyYXRlIG92ZXIgdGhlIGxpc3QgdW50aWwgd2UgZmluZCB0aGUgbm9kZSBjb250YWluaW5nIHRoZSBkYXRhXG4gICAgICAgICAgICAvLyB3ZSBhcmUgbG9va2luZyBmb3JcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLml0ZXJhdG9yLmhhc05leHQoKSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSB0aGlzLml0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNFcXVhbChjdXJyZW50LmdldERhdGEoKSwgbm9kZURhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gb25seSBnZXQgaGVyZSBpZiB3ZSBkaWRuJ3QgZmluZCBhIG5vZGUgY29udGFpbmluZyB0aGUgbm9kZURhdGFcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgbm9kZSBhdCB0aGUgbG9jYXRpb24gcHJvdmlkZWQgYnkgaW5kZXhcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFRoZSBpbmRleCBvZiB0aGUgbm9kZSB0byByZXR1cm5cbiAgICAgICAgICogQHJldHVybnMgdGhlIG5vZGUgbG9jYXRlZCBhdCB0aGUgaW5kZXggcHJvdmlkZWQuXG4gICAgICAgICAqL1xuICAgICAgICBmaW5kQXQ6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgLy8gaWYgaWR4IGlzIG91dCBvZiBib3VuZHMgb3IgZm4gY2FsbGVkIG9uIGVtcHR5IGxpc3QsIHJldHVybiAtMVxuICAgICAgICAgICAgaWYgKHRoaXMuaXNFbXB0eSgpIHx8IGluZGV4ID4gdGhpcy5nZXRTaXplKCkgLSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBlbHNlLCBsb29wIHRocm91Z2ggdGhlIGxpc3QgYW5kIHJldHVybiB0aGUgbm9kZSBpbiB0aGVcbiAgICAgICAgICAgIC8vIHBvc2l0aW9uIHByb3ZpZGVkIGJ5IGlkeC4gIEFzc3VtZSB6ZXJvLWJhc2VkIHBvc2l0aW9ucy5cbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5nZXRIZWFkTm9kZSgpO1xuICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0gMDtcblxuICAgICAgICAgICAgd2hpbGUgKHBvc2l0aW9uIDwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uICs9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBsaXN0IGNvbnRhaW5zIHRoZSBwcm92aWRlZCBub2RlRGF0YVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBub2RlRGF0YSBUaGUgZGF0YSB0byBjaGVjayBpZiB0aGUgbGlzdFxuICAgICAgICAgKiAgICAgICAgY29udGFpbnNcbiAgICAgICAgICogQHJldHVybnMgdGhlIHRydWUgaWYgdGhlIGxpc3QgY29udGFpbnMgbm9kZURhdGEsIGZhbHNlIG90aGVyd2lzZVxuICAgICAgICAgKi9cbiAgICAgICAgY29udGFpbnM6IGZ1bmN0aW9uIChub2RlRGF0YSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXhPZihub2RlRGF0YSkgPiAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8jIyMjIyMjIyMjIyMjIyMjIyMgVVRJTElUWSBtZXRob2RzICMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFV0aWxpdHkgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIHRoZSBsaXN0IGFuZCBjYWxsIHRoZSBmbiBwcm92aWRlZFxuICAgICAgICAgKiBvbiBlYWNoIG5vZGUsIG9yIGVsZW1lbnQsIG9mIHRoZSBsaXN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBvbiBlYWNoIG5vZGUgb2YgdGhlIGxpc3RcbiAgICAgICAgICogQHBhcmFtIHtib29sfSByZXZlcnNlIFVzZSBvciBub3QgcmV2ZXJzZSBpdGVyYXRpb24gKHRhaWwgdG8gaGVhZCksIGRlZmF1bHQgdG8gZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgICAgICAgICAgcmV2ZXJzZSA9IHJldmVyc2UgfHwgZmFsc2U7XG4gICAgICAgICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlcmF0b3IucmVzZXRfcmV2ZXJzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlcmF0b3IuZWFjaF9yZXZlcnNlKGZuKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVyYXRvci5yZXNldCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlcmF0b3IuZWFjaChmbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIHRoZSBkYXRhIGNvbnRhaW5lZCBpbiB0aGUgbGlzdFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7YXJyYXl9IHRoZSBhcnJheSBvZiBhbGwgdGhlIGRhdGEgZnJvbSB0aGUgbGlzdFxuICAgICAgICAgKi9cbiAgICAgICAgdG9BcnJheTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGxpc3RBcnJheSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgbGlzdEFycmF5LnB1c2gobm9kZS5nZXREYXRhKCkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBsaXN0QXJyYXk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEludGVycnVwdHMgaXRlcmF0aW9uIG92ZXIgdGhlIGxpc3RcbiAgICAgICAgICovXG4gICAgICAgIGludGVycnVwdEVudW1lcmF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLml0ZXJhdG9yLmludGVycnVwdCgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gRG91Ymx5TGlua2VkTGlzdDtcblxufSgpKTtcbiIsIi8qKlxuICogQGZpbGVPdmVydmlldyBJbXBsZW1lbnRhdGlvbiBvZiBhbiBpdGVyYXRvciBmb3IgYSBsaW5rZWQgbGlzdFxuICogICAgICAgICAgICAgICBkYXRhIHN0cnVjdHVyZVxuICogQGF1dGhvciBKYXNvbiBTLiBKb25lc1xuICogQGxpY2Vuc2UgTUlUXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBJdGVyYXRvciBjbGFzc1xuICAgICAqXG4gICAgICogUmVwcmVzZW50cyBhbiBpbnN0YW50aWF0aW9uIG9mIGFuIGl0ZXJhdG9yIHRvIGJlIHVzZWRcbiAgICAgKiB3aXRoaW4gYSBsaW5rZWQgbGlzdC4gIFRoZSBpdGVyYXRvciB3aWxsIHByb3ZpZGUgdGhlIGFiaWxpdHlcbiAgICAgKiB0byBpdGVyYXRlIG92ZXIgYWxsIG5vZGVzIGluIGEgbGlzdCBieSBrZWVwaW5nIHRyYWNrIG9mIHRoZVxuICAgICAqIHBvc3RpdGlvbiBvZiBhICdjdXJyZW50Tm9kZScuICBUaGlzICdjdXJyZW50Tm9kZScgcG9pbnRlclxuICAgICAqIHdpbGwga2VlcCBzdGF0ZSB1bnRpbCBhIHJlc2V0KCkgb3BlcmF0aW9uIGlzIGNhbGxlZCBhdCB3aGljaFxuICAgICAqIHRpbWUgaXQgd2lsbCByZXNldCB0byBwb2ludCB0aGUgaGVhZCBvZiB0aGUgbGlzdC5cbiAgICAgKlxuICAgICAqIEV2ZW4gdGhvdWdoIHRoaXMgaXRlcmF0b3IgY2xhc3MgaXMgaW5leHRyaWNhYmx5IGxpbmtlZFxuICAgICAqIChubyBwdW4gaW50ZW5kZWQpIHRvIGEgbGlua2VkIGxpc3QgaW5zdGF0aWF0aW9uLCBpdCB3YXMgcmVtb3ZlZFxuICAgICAqIGZyb20gd2l0aGluIHRoZSBsaW5rZWQgbGlzdCBjb2RlIHRvIGFkaGVyZSB0byB0aGUgYmVzdCBwcmFjdGljZVxuICAgICAqIG9mIHNlcGFyYXRpb24gb2YgY29uY2VybnMuXG4gICAgICpcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBpdGVyYXRvciBpbnN0YW5jZSB0byBpdGVyYXRlIG92ZXIgdGhlIGxpbmtlZCBsaXN0IHByb3ZpZGVkLlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHRoZUxpc3QgdGhlIGxpbmtlZCBsaXN0IHRvIGl0ZXJhdGUgb3ZlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEl0ZXJhdG9yKHRoZUxpc3QpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gdGhlTGlzdCB8fCBudWxsO1xuICAgICAgICB0aGlzLnN0b3BJdGVyYXRpb25GbGFnID0gZmFsc2U7XG5cbiAgICAgICAgLy8gYSBwb2ludGVyIHRoZSBjdXJyZW50IG5vZGUgaW4gdGhlIGxpc3QgdGhhdCB3aWxsIGJlIHJldHVybmVkLlxuICAgICAgICAvLyBpbml0aWFsbHkgdGhpcyB3aWxsIGJlIG51bGwgc2luY2UgdGhlICdsaXN0JyB3aWxsIGJlIGVtcHR5XG4gICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSBudWxsO1xuICAgIH1cblxuICAgIC8qIEZ1bmN0aW9ucyBhdHRhY2hlZCB0byB0aGUgSXRlcmF0b3IgcHJvdG90eXBlLiAgQWxsIGl0ZXJhdG9yIGluc3RhbmNlc1xuICAgICAqIHdpbGwgc2hhcmUgdGhlc2UgbWV0aG9kcywgbWVhbmluZyB0aGVyZSB3aWxsIE5PVCBiZSBjb3BpZXMgbWFkZSBmb3IgZWFjaFxuICAgICAqIGluc3RhbmNlLlxuICAgICAqL1xuICAgIEl0ZXJhdG9yLnByb3RvdHlwZSA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgbmV4dCBub2RlIGluIHRoZSBpdGVyYXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9IHRoZSBuZXh0IG5vZGUgaW4gdGhlIGl0ZXJhdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5jdXJyZW50Tm9kZTtcbiAgICAgICAgICAgIC8vIGEgY2hlY2sgdG8gcHJldmVudCBlcnJvciBpZiByYW5kb21seSBjYWxsaW5nIG5leHQoKSB3aGVuXG4gICAgICAgICAgICAvLyBpdGVyYXRvciBpcyBhdCB0aGUgZW5kIG9mIHRoZSBsaXN0LCBtZWFpbmluZyB0aGUgY3VycmVudE5vZGVcbiAgICAgICAgICAgIC8vIHdpbGwgYmUgcG9pbnRpbmcgdG8gbnVsbC5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBXaGVuIHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkLCBpdCB3aWxsIHJldHVybiB0aGUgbm9kZSBjdXJyZW50bHlcbiAgICAgICAgICAgIC8vIGFzc2lnbmVkIHRvIHRoaXMuY3VycmVudE5vZGUgYW5kIG1vdmUgdGhlIHBvaW50ZXIgdG8gdGhlIG5leHRcbiAgICAgICAgICAgIC8vIG5vZGUgaW4gdGhlIGxpc3QgKGlmIGl0IGV4aXN0cylcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnROb2RlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Tm9kZSA9IHRoaXMuY3VycmVudE5vZGUubmV4dDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERldGVybWluZXMgaWYgdGhlIGl0ZXJhdG9yIGhhcyBhIG5vZGUgdG8gcmV0dXJuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGl0ZXJhdG9yIGhhcyBhIG5vZGUgdG8gcmV0dXJuLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgICAgICovXG4gICAgICAgIGhhc05leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnROb2RlICE9PSBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNldHMgdGhlIGl0ZXJhdG9yIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGxpc3QuXG4gICAgICAgICAqL1xuICAgICAgICByZXNldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Tm9kZSA9IHRoaXMubGlzdC5nZXRIZWFkTm9kZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBub2RlIGluIHRoZSBsaXN0IGFuZCBtb3ZlcyB0aGUgaXRlcmF0b3IgdG9cbiAgICAgICAgICogcG9pbnQgdG8gdGhlIHNlY29uZCBub2RlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgZmlyc3Qgbm9kZSBpbiB0aGUgbGlzdFxuICAgICAgICAgKi9cbiAgICAgICAgZmlyc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5leHQoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgbGlzdCB0byBpdGVyYXRlIG92ZXJcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHRoZUxpc3QgdGhlIGxpbmtlZCBsaXN0IHRvIGl0ZXJhdGUgb3ZlclxuICAgICAgICAgKi9cbiAgICAgICAgc2V0TGlzdDogZnVuY3Rpb24gKHRoZUxpc3QpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdCA9IHRoZUxpc3Q7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEl0ZXJhdGVzIG92ZXIgYWxsIG5vZGVzIGluIHRoZSBsaXN0IGFuZCBjYWxscyB0aGUgcHJvdmlkZWQgY2FsbGJhY2tcbiAgICAgICAgICogZnVuY3Rpb24gd2l0aCBlYWNoIG5vZGUgYXMgYW4gYXJndW1lbnQuXG4gICAgICAgICAqIEl0ZXJhdGlvbiB3aWxsIGJyZWFrIGlmIGludGVycnVwdCgpIGlzIGNhbGxlZFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdpdGhcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgZWFjaCBub2RlIG9mIHRoZSBsaXN0IGFzIGFuIGFyZ1xuICAgICAgICAgKi9cbiAgICAgICAgZWFjaDogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICB2YXIgZWw7XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5oYXNOZXh0KCkgJiYgIXRoaXMuc3RvcEl0ZXJhdGlvbkZsYWcpIHtcbiAgICAgICAgICAgICAgICBlbCA9IHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3RvcEl0ZXJhdGlvbkZsYWcgPSBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKlxuICAgICAgICAgKiAjIyMgUkVWRVJTRSBJVEVSQVRJT04gKFRBSUwgLT4gSEVBRCkgIyMjXG4gICAgICAgICAqL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBub2RlIGluIHRoZSBsaXN0IGFuZCBtb3ZlcyB0aGUgaXRlcmF0b3IgdG9cbiAgICAgICAgICogcG9pbnQgdG8gdGhlIHNlY29uZCBub2RlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgZmlyc3Qgbm9kZSBpbiB0aGUgbGlzdFxuICAgICAgICAgKi9cbiAgICAgICAgbGFzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5yZXNldF9yZXZlcnNlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0X3JldmVyc2UoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzZXRzIHRoZSBpdGVyYXRvciB0byB0aGUgdGFpbCBvZiB0aGUgbGlzdC5cbiAgICAgICAgICovXG4gICAgICAgIHJlc2V0X3JldmVyc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSB0aGlzLmxpc3QuZ2V0VGFpbE5vZGUoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgbmV4dCBub2RlIGluIHRoZSBpdGVyYXRpb24sIHdoZW4gaXRlcmF0aW5nIGZyb20gdGFpbCB0byBoZWFkXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9IHRoZSBuZXh0IG5vZGUgaW4gdGhlIGl0ZXJhdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIG5leHRfcmV2ZXJzZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLmN1cnJlbnROb2RlO1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudE5vZGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gdGhpcy5jdXJyZW50Tm9kZS5wcmV2O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSXRlcmF0ZXMgb3ZlciBhbGwgbm9kZXMgaW4gdGhlIGxpc3QgYW5kIGNhbGxzIHRoZSBwcm92aWRlZCBjYWxsYmFja1xuICAgICAgICAgKiBmdW5jdGlvbiB3aXRoIGVhY2ggbm9kZSBhcyBhbiBhcmd1bWVudCxcbiAgICAgICAgICogc3RhcnRpbmcgZnJvbSB0aGUgdGFpbCBhbmQgZ29pbmcgdG93YXJkcyB0aGUgaGVhZC5cbiAgICAgICAgICogVGhlIGl0ZXJhdGlvbiB3aWxsIGJyZWFrIGlmIGludGVycnVwdCgpIGlzIGNhbGxlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aXRoaW5cbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgIGVhY2ggbm9kZSBhcyBhbiBhcmdcbiAgICAgICAgICovXG4gICAgICAgIGVhY2hfcmV2ZXJzZTogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0X3JldmVyc2UoKTtcbiAgICAgICAgICAgIHZhciBlbDtcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLmhhc05leHQoKSAmJiAhdGhpcy5zdG9wSXRlcmF0aW9uRmxhZykge1xuICAgICAgICAgICAgICAgIGVsID0gdGhpcy5uZXh0X3JldmVyc2UoKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0b3BJdGVyYXRpb25GbGFnID0gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLypcbiAgICAgICAgICogIyMjIElOVEVSUlVQVCBJVEVSQVRJT04gIyMjXG4gICAgICAgICAqL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSYWlzZXMgaW50ZXJydXB0IGZsYWcgKHRoYXQgd2lsbCBzdG9wIGVhY2goKSBvciBlYWNoX3JldmVyc2UoKSlcbiAgICAgICAgICovXG5cbiAgICAgICAgaW50ZXJydXB0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BJdGVyYXRpb25GbGFnID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEl0ZXJhdG9yO1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBMaW5rZWQgbGlzdCBub2RlIGNsYXNzXG4gICAgICpcbiAgICAgKiBJbnRlcm5hbCBwcml2YXRlIGNsYXNzIHRvIHJlcHJlc2VudCBhIG5vZGUgd2l0aGluXG4gICAgICogYSBsaW5rZWQgbGlzdC4gIEVhY2ggbm9kZSBoYXMgYSAnZGF0YScgcHJvcGVydHkgYW5kXG4gICAgICogYSBwb2ludGVyIHRoZSBwcmV2aW91cyBub2RlIGFuZCB0aGUgbmV4dCBub2RlIGluIHRoZSBsaXN0LlxuICAgICAqXG4gICAgICogU2luY2UgdGhlICdOb2RlJyBmdW5jdGlvbiBpcyBub3QgYXNzaWduZWQgdG9cbiAgICAgKiBtb2R1bGUuZXhwb3J0cyBpdCBpcyBub3QgdmlzaWJsZSBvdXRzaWRlIG9mIHRoaXNcbiAgICAgKiBmaWxlLCB0aGVyZWZvcmUsIGl0IGlzIHByaXZhdGUgdG8gdGhlIExpbmtlZExpc3RcbiAgICAgKiBjbGFzcy5cbiAgICAgKlxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbm9kZSBvYmplY3Qgd2l0aCBhIGRhdGEgcHJvcGVydHkgYW5kIHBvaW50ZXJcbiAgICAgKiB0byB0aGUgbmV4dCBub2RlXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge29iamVjdHxudW1iZXJ8c3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGluaXRpYWxpemUgd2l0aCB0aGUgbm9kZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIE5vZGUoZGF0YSkge1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICB0aGlzLm5leHQgPSBudWxsO1xuICAgICAgICB0aGlzLnByZXYgPSBudWxsO1xuICAgIH1cblxuICAgIC8qIEZ1bmN0aW9ucyBhdHRhY2hlZCB0byB0aGUgTm9kZSBwcm90b3R5cGUuICBBbGwgbm9kZSBpbnN0YW5jZXMgd2lsbFxuICAgICAqIHNoYXJlIHRoZXNlIG1ldGhvZHMsIG1lYW5pbmcgdGhlcmUgd2lsbCBOT1QgYmUgY29waWVzIG1hZGUgZm9yIGVhY2hcbiAgICAgKiBpbnN0YW5jZS4gIFRoaXMgd2lsbCBiZSBhIGh1Z2UgbWVtb3J5IHNhdmluZ3Mgc2luY2UgdGhlcmUgd2lsbCBsaWtlbHlcbiAgICAgKiBiZSBhIGxhcmdlIG51bWJlciBvZiBpbmRpdmlkdWFsIG5vZGVzLlxuICAgICAqL1xuICAgIE5vZGUucHJvdG90eXBlID0ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBub2RlIGhhcyBhIHBvaW50ZXIgdG8gdGhlIG5leHQgbm9kZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGVyZSBpcyBhIG5leHQgbm9kZTsgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICAgICAqL1xuICAgICAgICBoYXNOZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMubmV4dCAhPT0gbnVsbCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIG5vZGUgaGFzIGEgcG9pbnRlciB0byB0aGUgcHJldmlvdXMgbm9kZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGVyZSBpcyBhIHByZXZpb3VzIG5vZGU7IGZhbHNlIG90aGVyd2lzZVxuICAgICAgICAgKi9cbiAgICAgICAgaGFzUHJldjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnByZXYgIT09IG51bGwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBkYXRhIG9mIHRoZSB0aGUgbm9kZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IHRoZSBkYXRhIG9mIHRoZSBub2RlXG4gICAgICAgICAqL1xuICAgICAgICBnZXREYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VuYXRpb24gb2YgdGhlIG5vZGUuICBJZiB0aGUgZGF0YSBpcyBhblxuICAgICAgICAgKiBvYmplY3QsIGl0IHJldHVybnMgdGhlIEpTT04uc3RyaW5naWZ5IHZlcnNpb24gb2YgdGhlIG9iamVjdC5cbiAgICAgICAgICogT3RoZXJ3aXNlLCBpdCBzaW1wbHkgcmV0dXJucyB0aGUgZGF0YVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBzdHJpbmcgcmVwcmVzZW5hdGlvbiBvZiB0aGUgbm9kZSBkYXRhXG4gICAgICAgICAqL1xuICAgICAgICB0b1N0cmluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcodGhpcy5kYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IE5vZGU7XG5cbn0oKSk7XG4iLCIvKipcbiAqIExvZGFzaCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IEpTIEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcy5mb3VuZGF0aW9uLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyB0aGUgc2l6ZSB0byBlbmFibGUgbGFyZ2UgYXJyYXkgb3B0aW1pemF0aW9ucy4gKi9cbnZhciBMQVJHRV9BUlJBWV9TSVpFID0gMjAwO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHByb21pc2VUYWcgPSAnW29iamVjdCBQcm9taXNlXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGBcbiAqIFtzeW50YXggY2hhcmFjdGVyc10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcGF0dGVybnMpLlxuICovXG52YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL14oPzowfFsxLTldXFxkKikkLztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGFWaWV3VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID1cbnR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPSB0eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID1cbnR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPSB0eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID1cbnR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID1cbnR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHByb2Nlc3NgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlUHJvY2VzcyA9IG1vZHVsZUV4cG9ydHMgJiYgZnJlZUdsb2JhbC5wcm9jZXNzO1xuXG4vKiogVXNlZCB0byBhY2Nlc3MgZmFzdGVyIE5vZGUuanMgaGVscGVycy4gKi9cbnZhciBub2RlVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZpbHRlcmAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheUZpbHRlcihhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGgsXG4gICAgICByZXNJbmRleCA9IDAsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXN1bHRbcmVzSW5kZXgrK10gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBcHBlbmRzIHRoZSBlbGVtZW50cyBvZiBgdmFsdWVzYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gYXBwZW5kLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5UHVzaChhcnJheSwgdmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIG9mZnNldCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W29mZnNldCArIGluZGV4XSA9IHZhbHVlc1tpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5zb21lYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFueSBlbGVtZW50IHBhc3NlcyB0aGUgcHJlZGljYXRlIGNoZWNrLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlTb21lKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRpbWVzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHNcbiAqIG9yIG1heCBhcnJheSBsZW5ndGggY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGludm9rZSBgaXRlcmF0ZWVgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRpbWVzKG4sIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobik7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGluZGV4KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgYGNhY2hlYCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gY2FjaGUgVGhlIGNhY2hlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGNhY2hlSGFzKGNhY2hlLCBrZXkpIHtcbiAgcmV0dXJuIGNhY2hlLmhhcyhrZXkpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgbWFwYCB0byBpdHMga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUga2V5LXZhbHVlIHBhaXJzLlxuICovXG5mdW5jdGlvbiBtYXBUb0FycmF5KG1hcCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG1hcC5zaXplKTtcblxuICBtYXAuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gW2tleSwgdmFsdWVdO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbi8qKlxuICogQ29udmVydHMgYHNldGAgdG8gYW4gYXJyYXkgb2YgaXRzIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gc2V0VG9BcnJheShzZXQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShzZXQuc2l6ZSk7XG5cbiAgc2V0LmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSB2YWx1ZTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLFxuICAgIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBTeW1ib2wgPSByb290LlN5bWJvbCxcbiAgICBVaW50OEFycmF5ID0gcm9vdC5VaW50OEFycmF5LFxuICAgIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGUsXG4gICAgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2UsXG4gICAgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxcbiAgICBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIERhdGFWaWV3ID0gZ2V0TmF0aXZlKHJvb3QsICdEYXRhVmlldycpLFxuICAgIE1hcCA9IGdldE5hdGl2ZShyb290LCAnTWFwJyksXG4gICAgUHJvbWlzZSA9IGdldE5hdGl2ZShyb290LCAnUHJvbWlzZScpLFxuICAgIFNldCA9IGdldE5hdGl2ZShyb290LCAnU2V0JyksXG4gICAgV2Vha01hcCA9IGdldE5hdGl2ZShyb290LCAnV2Vha01hcCcpLFxuICAgIG5hdGl2ZUNyZWF0ZSA9IGdldE5hdGl2ZShPYmplY3QsICdjcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1hcHMsIHNldHMsIGFuZCB3ZWFrbWFwcy4gKi9cbnZhciBkYXRhVmlld0N0b3JTdHJpbmcgPSB0b1NvdXJjZShEYXRhVmlldyksXG4gICAgbWFwQ3RvclN0cmluZyA9IHRvU291cmNlKE1hcCksXG4gICAgcHJvbWlzZUN0b3JTdHJpbmcgPSB0b1NvdXJjZShQcm9taXNlKSxcbiAgICBzZXRDdG9yU3RyaW5nID0gdG9Tb3VyY2UoU2V0KSxcbiAgICB3ZWFrTWFwQ3RvclN0cmluZyA9IHRvU291cmNlKFdlYWtNYXApO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVmFsdWVPZiA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udmFsdWVPZiA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgaGFzaCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIEhhc2goZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgSGFzaFxuICovXG5mdW5jdGlvbiBoYXNoQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuYXRpdmVDcmVhdGUgPyBuYXRpdmVDcmVhdGUobnVsbCkgOiB7fTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSB0aGlzLmhhcyhrZXkpICYmIGRlbGV0ZSB0aGlzLl9fZGF0YV9fW2tleV07XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBoYXNoIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGhhc2hHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKG5hdGl2ZUNyZWF0ZSkge1xuICAgIHZhciByZXN1bHQgPSBkYXRhW2tleV07XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gSEFTSF9VTkRFRklORUQgPyB1bmRlZmluZWQgOiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KSA/IGRhdGFba2V5XSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoSGFzKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHJldHVybiBuYXRpdmVDcmVhdGUgPyAoZGF0YVtrZXldICE9PSB1bmRlZmluZWQpIDogaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBoYXNoIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICB0aGlzLnNpemUgKz0gdGhpcy5oYXMoa2V5KSA/IDAgOiAxO1xuICBkYXRhW2tleV0gPSAobmF0aXZlQ3JlYXRlICYmIHZhbHVlID09PSB1bmRlZmluZWQpID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGxpc3QgY2FjaGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBMaXN0Q2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsYXN0SW5kZXggPSBkYXRhLmxlbmd0aCAtIDE7XG4gIGlmIChpbmRleCA9PSBsYXN0SW5kZXgpIHtcbiAgICBkYXRhLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNwbGljZS5jYWxsKGRhdGEsIGluZGV4LCAxKTtcbiAgfVxuICAtLXRoaXMuc2l6ZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogZGF0YVtpbmRleF1bMV07XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIGxpc3QgY2FjaGUgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGxpc3QgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgICsrdGhpcy5zaXplO1xuICAgIGRhdGEucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9IGVsc2Uge1xuICAgIGRhdGFbaW5kZXhdWzFdID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuc2l6ZSA9IDA7XG4gIHRoaXMuX19kYXRhX18gPSB7XG4gICAgJ2hhc2gnOiBuZXcgSGFzaCxcbiAgICAnbWFwJzogbmV3IChNYXAgfHwgTGlzdENhY2hlKSxcbiAgICAnc3RyaW5nJzogbmV3IEhhc2hcbiAgfTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbWFwIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUdldChrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5nZXQoa2V5KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLFxuICAgICAgc2l6ZSA9IGRhdGEuc2l6ZTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplICs9IGRhdGEuc2l6ZSA9PSBzaXplID8gMCA6IDE7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTWFwQ2FjaGVgLlxuTWFwQ2FjaGUucHJvdG90eXBlLmNsZWFyID0gbWFwQ2FjaGVDbGVhcjtcbk1hcENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBtYXBDYWNoZURlbGV0ZTtcbk1hcENhY2hlLnByb3RvdHlwZS5nZXQgPSBtYXBDYWNoZUdldDtcbk1hcENhY2hlLnByb3RvdHlwZS5oYXMgPSBtYXBDYWNoZUhhcztcbk1hcENhY2hlLnByb3RvdHlwZS5zZXQgPSBtYXBDYWNoZVNldDtcblxuLyoqXG4gKlxuICogQ3JlYXRlcyBhbiBhcnJheSBjYWNoZSBvYmplY3QgdG8gc3RvcmUgdW5pcXVlIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTZXRDYWNoZSh2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMgPT0gbnVsbCA/IDAgOiB2YWx1ZXMubGVuZ3RoO1xuXG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGU7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdGhpcy5hZGQodmFsdWVzW2luZGV4XSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBZGRzIGB2YWx1ZWAgdG8gdGhlIGFycmF5IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBhZGRcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQGFsaWFzIHB1c2hcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNhY2hlLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHNldENhY2hlQWRkKHZhbHVlKSB7XG4gIHRoaXMuX19kYXRhX18uc2V0KHZhbHVlLCBIQVNIX1VOREVGSU5FRCk7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGluIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHNldENhY2hlSGFzKHZhbHVlKSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyh2YWx1ZSk7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTZXRDYWNoZWAuXG5TZXRDYWNoZS5wcm90b3R5cGUuYWRkID0gU2V0Q2FjaGUucHJvdG90eXBlLnB1c2ggPSBzZXRDYWNoZUFkZDtcblNldENhY2hlLnByb3RvdHlwZS5oYXMgPSBzZXRDYWNoZUhhcztcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RhY2sgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2soZW50cmllcykge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlKGVudHJpZXMpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqL1xuZnVuY3Rpb24gc3RhY2tDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGU7XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICByZXN1bHQgPSBkYXRhWydkZWxldGUnXShrZXkpO1xuXG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBzdGFjayB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tHZXQoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmdldChrZXkpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIHN0YWNrIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tIYXMoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyhrZXkpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIHN0YWNrIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIHN0YWNrIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzdGFja1NldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBMaXN0Q2FjaGUpIHtcbiAgICB2YXIgcGFpcnMgPSBkYXRhLl9fZGF0YV9fO1xuICAgIGlmICghTWFwIHx8IChwYWlycy5sZW5ndGggPCBMQVJHRV9BUlJBWV9TSVpFIC0gMSkpIHtcbiAgICAgIHBhaXJzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgIHRoaXMuc2l6ZSA9ICsrZGF0YS5zaXplO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlKHBhaXJzKTtcbiAgfVxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFN0YWNrYC5cblN0YWNrLnByb3RvdHlwZS5jbGVhciA9IHN0YWNrQ2xlYXI7XG5TdGFjay5wcm90b3R5cGVbJ2RlbGV0ZSddID0gc3RhY2tEZWxldGU7XG5TdGFjay5wcm90b3R5cGUuZ2V0ID0gc3RhY2tHZXQ7XG5TdGFjay5wcm90b3R5cGUuaGFzID0gc3RhY2tIYXM7XG5TdGFjay5wcm90b3R5cGUuc2V0ID0gc3RhY2tTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgYXJyYXktbGlrZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5oZXJpdGVkIFNwZWNpZnkgcmV0dXJuaW5nIGluaGVyaXRlZCBwcm9wZXJ0eSBuYW1lcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TGlrZUtleXModmFsdWUsIGluaGVyaXRlZCkge1xuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKSxcbiAgICAgIGlzQXJnID0gIWlzQXJyICYmIGlzQXJndW1lbnRzKHZhbHVlKSxcbiAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiAhaXNBcmcgJiYgaXNCdWZmZXIodmFsdWUpLFxuICAgICAgaXNUeXBlID0gIWlzQXJyICYmICFpc0FyZyAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheSh2YWx1ZSksXG4gICAgICBza2lwSW5kZXhlcyA9IGlzQXJyIHx8IGlzQXJnIHx8IGlzQnVmZiB8fCBpc1R5cGUsXG4gICAgICByZXN1bHQgPSBza2lwSW5kZXhlcyA/IGJhc2VUaW1lcyh2YWx1ZS5sZW5ndGgsIFN0cmluZykgOiBbXSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoXG4gICAgICAgICAgIC8vIFNhZmFyaSA5IGhhcyBlbnVtZXJhYmxlIGBhcmd1bWVudHMubGVuZ3RoYCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgICAga2V5ID09ICdsZW5ndGgnIHx8XG4gICAgICAgICAgIC8vIE5vZGUuanMgMC4xMCBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiBidWZmZXJzLlxuICAgICAgICAgICAoaXNCdWZmICYmIChrZXkgPT0gJ29mZnNldCcgfHwga2V5ID09ICdwYXJlbnQnKSkgfHxcbiAgICAgICAgICAgLy8gUGhhbnRvbUpTIDIgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gdHlwZWQgYXJyYXlzLlxuICAgICAgICAgICAoaXNUeXBlICYmIChrZXkgPT0gJ2J1ZmZlcicgfHwga2V5ID09ICdieXRlTGVuZ3RoJyB8fCBrZXkgPT0gJ2J5dGVPZmZzZXQnKSkgfHxcbiAgICAgICAgICAgLy8gU2tpcCBpbmRleCBwcm9wZXJ0aWVzLlxuICAgICAgICAgICBpc0luZGV4KGtleSwgbGVuZ3RoKVxuICAgICAgICApKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0QWxsS2V5c2AgYW5kIGBnZXRBbGxLZXlzSW5gIHdoaWNoIHVzZXNcbiAqIGBrZXlzRnVuY2AgYW5kIGBzeW1ib2xzRnVuY2AgdG8gZ2V0IHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN5bWJvbHNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNGdW5jLCBzeW1ib2xzRnVuYykge1xuICB2YXIgcmVzdWx0ID0ga2V5c0Z1bmMob2JqZWN0KTtcbiAgcmV0dXJuIGlzQXJyYXkob2JqZWN0KSA/IHJlc3VsdCA6IGFycmF5UHVzaChyZXN1bHQsIHN5bWJvbHNGdW5jKG9iamVjdCkpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcmd1bWVudHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqL1xuZnVuY3Rpb24gYmFzZUlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFyZ3NUYWc7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNFcXVhbGAgd2hpY2ggc3VwcG9ydHMgcGFydGlhbCBjb21wYXJpc29uc1xuICogYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuXG4gKiAgMSAtIFVub3JkZXJlZCBjb21wYXJpc29uXG4gKiAgMiAtIFBhcnRpYWwgY29tcGFyaXNvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIGB2YWx1ZWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spIHtcbiAgaWYgKHZhbHVlID09PSBvdGhlcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IG90aGVyID09IG51bGwgfHwgKCFpc09iamVjdExpa2UodmFsdWUpICYmICFpc09iamVjdExpa2Uob3RoZXIpKSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyO1xuICB9XG4gIHJldHVybiBiYXNlSXNFcXVhbERlZXAodmFsdWUsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBiYXNlSXNFcXVhbCwgc3RhY2spO1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgY29tcGFyaXNvbnMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgY29tcGFyZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsRGVlcChvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBvYmpJc0FyciA9IGlzQXJyYXkob2JqZWN0KSxcbiAgICAgIG90aElzQXJyID0gaXNBcnJheShvdGhlciksXG4gICAgICBvYmpUYWcgPSBvYmpJc0FyciA/IGFycmF5VGFnIDogZ2V0VGFnKG9iamVjdCksXG4gICAgICBvdGhUYWcgPSBvdGhJc0FyciA/IGFycmF5VGFnIDogZ2V0VGFnKG90aGVyKTtcblxuICBvYmpUYWcgPSBvYmpUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG9ialRhZztcbiAgb3RoVGFnID0gb3RoVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvdGhUYWc7XG5cbiAgdmFyIG9iaklzT2JqID0gb2JqVGFnID09IG9iamVjdFRhZyxcbiAgICAgIG90aElzT2JqID0gb3RoVGFnID09IG9iamVjdFRhZyxcbiAgICAgIGlzU2FtZVRhZyA9IG9ialRhZyA9PSBvdGhUYWc7XG5cbiAgaWYgKGlzU2FtZVRhZyAmJiBpc0J1ZmZlcihvYmplY3QpKSB7XG4gICAgaWYgKCFpc0J1ZmZlcihvdGhlcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgb2JqSXNBcnIgPSB0cnVlO1xuICAgIG9iaklzT2JqID0gZmFsc2U7XG4gIH1cbiAgaWYgKGlzU2FtZVRhZyAmJiAhb2JqSXNPYmopIHtcbiAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgIHJldHVybiAob2JqSXNBcnIgfHwgaXNUeXBlZEFycmF5KG9iamVjdCkpXG4gICAgICA/IGVxdWFsQXJyYXlzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spXG4gICAgICA6IGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgb2JqVGFnLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbiAgfVxuICBpZiAoIShiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcpKSB7XG4gICAgdmFyIG9iaklzV3JhcHBlZCA9IG9iaklzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCAnX193cmFwcGVkX18nKSxcbiAgICAgICAgb3RoSXNXcmFwcGVkID0gb3RoSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwgJ19fd3JhcHBlZF9fJyk7XG5cbiAgICBpZiAob2JqSXNXcmFwcGVkIHx8IG90aElzV3JhcHBlZCkge1xuICAgICAgdmFyIG9ialVud3JhcHBlZCA9IG9iaklzV3JhcHBlZCA/IG9iamVjdC52YWx1ZSgpIDogb2JqZWN0LFxuICAgICAgICAgIG90aFVud3JhcHBlZCA9IG90aElzV3JhcHBlZCA/IG90aGVyLnZhbHVlKCkgOiBvdGhlcjtcblxuICAgICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICAgIHJldHVybiBlcXVhbEZ1bmMob2JqVW53cmFwcGVkLCBvdGhVbndyYXBwZWQsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFpc1NhbWVUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgcmV0dXJuIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3NbYmFzZUdldFRhZyh2YWx1ZSldO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNgIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXMob2JqZWN0KSB7XG4gIGlmICghaXNQcm90b3R5cGUob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYga2V5ICE9ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBhcnJheXMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7QXJyYXl9IG90aGVyIFRoZSBvdGhlciBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgYXJyYXlgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFycmF5cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbEFycmF5cyhhcnJheSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRyxcbiAgICAgIGFyckxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIG90aExlbmd0aCA9IG90aGVyLmxlbmd0aDtcblxuICBpZiAoYXJyTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhKGlzUGFydGlhbCAmJiBvdGhMZW5ndGggPiBhcnJMZW5ndGgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQoYXJyYXkpO1xuICBpZiAoc3RhY2tlZCAmJiBzdGFjay5nZXQob3RoZXIpKSB7XG4gICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gIH1cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSB0cnVlLFxuICAgICAgc2VlbiA9IChiaXRtYXNrICYgQ09NUEFSRV9VTk9SREVSRURfRkxBRykgPyBuZXcgU2V0Q2FjaGUgOiB1bmRlZmluZWQ7XG5cbiAgc3RhY2suc2V0KGFycmF5LCBvdGhlcik7XG4gIHN0YWNrLnNldChvdGhlciwgYXJyYXkpO1xuXG4gIC8vIElnbm9yZSBub24taW5kZXggcHJvcGVydGllcy5cbiAgd2hpbGUgKCsraW5kZXggPCBhcnJMZW5ndGgpIHtcbiAgICB2YXIgYXJyVmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgIG90aFZhbHVlID0gb3RoZXJbaW5kZXhdO1xuXG4gICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgIHZhciBjb21wYXJlZCA9IGlzUGFydGlhbFxuICAgICAgICA/IGN1c3RvbWl6ZXIob3RoVmFsdWUsIGFyclZhbHVlLCBpbmRleCwgb3RoZXIsIGFycmF5LCBzdGFjaylcbiAgICAgICAgOiBjdXN0b21pemVyKGFyclZhbHVlLCBvdGhWYWx1ZSwgaW5kZXgsIGFycmF5LCBvdGhlciwgc3RhY2spO1xuICAgIH1cbiAgICBpZiAoY29tcGFyZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGNvbXBhcmVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBpZiAoc2Vlbikge1xuICAgICAgaWYgKCFhcnJheVNvbWUob3RoZXIsIGZ1bmN0aW9uKG90aFZhbHVlLCBvdGhJbmRleCkge1xuICAgICAgICAgICAgaWYgKCFjYWNoZUhhcyhzZWVuLCBvdGhJbmRleCkgJiZcbiAgICAgICAgICAgICAgICAoYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8IGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNlZW4ucHVzaChvdGhJbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkpIHtcbiAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIShcbiAgICAgICAgICBhcnJWYWx1ZSA9PT0gb3RoVmFsdWUgfHxcbiAgICAgICAgICAgIGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKVxuICAgICAgICApKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBzdGFja1snZGVsZXRlJ10oYXJyYXkpO1xuICBzdGFja1snZGVsZXRlJ10ob3RoZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgY29tcGFyaW5nIG9iamVjdHMgb2ZcbiAqIHRoZSBzYW1lIGB0b1N0cmluZ1RhZ2AuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjb21wYXJpbmcgdmFsdWVzIHdpdGggdGFncyBvZlxuICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgb3IgYFN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgVGhlIGB0b1N0cmluZ1RhZ2Agb2YgdGhlIG9iamVjdHMgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbEJ5VGFnKG9iamVjdCwgb3RoZXIsIHRhZywgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICBzd2l0Y2ggKHRhZykge1xuICAgIGNhc2UgZGF0YVZpZXdUYWc6XG4gICAgICBpZiAoKG9iamVjdC5ieXRlTGVuZ3RoICE9IG90aGVyLmJ5dGVMZW5ndGgpIHx8XG4gICAgICAgICAgKG9iamVjdC5ieXRlT2Zmc2V0ICE9IG90aGVyLmJ5dGVPZmZzZXQpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIG9iamVjdCA9IG9iamVjdC5idWZmZXI7XG4gICAgICBvdGhlciA9IG90aGVyLmJ1ZmZlcjtcblxuICAgIGNhc2UgYXJyYXlCdWZmZXJUYWc6XG4gICAgICBpZiAoKG9iamVjdC5ieXRlTGVuZ3RoICE9IG90aGVyLmJ5dGVMZW5ndGgpIHx8XG4gICAgICAgICAgIWVxdWFsRnVuYyhuZXcgVWludDhBcnJheShvYmplY3QpLCBuZXcgVWludDhBcnJheShvdGhlcikpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICBjYXNlIG51bWJlclRhZzpcbiAgICAgIC8vIENvZXJjZSBib29sZWFucyB0byBgMWAgb3IgYDBgIGFuZCBkYXRlcyB0byBtaWxsaXNlY29uZHMuXG4gICAgICAvLyBJbnZhbGlkIGRhdGVzIGFyZSBjb2VyY2VkIHRvIGBOYU5gLlxuICAgICAgcmV0dXJuIGVxKCtvYmplY3QsICtvdGhlcik7XG5cbiAgICBjYXNlIGVycm9yVGFnOlxuICAgICAgcmV0dXJuIG9iamVjdC5uYW1lID09IG90aGVyLm5hbWUgJiYgb2JqZWN0Lm1lc3NhZ2UgPT0gb3RoZXIubWVzc2FnZTtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgLy8gQ29lcmNlIHJlZ2V4ZXMgdG8gc3RyaW5ncyBhbmQgdHJlYXQgc3RyaW5ncywgcHJpbWl0aXZlcyBhbmQgb2JqZWN0cyxcbiAgICAgIC8vIGFzIGVxdWFsLiBTZWUgaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXJlZ2V4cC5wcm90b3R5cGUudG9zdHJpbmdcbiAgICAgIC8vIGZvciBtb3JlIGRldGFpbHMuXG4gICAgICByZXR1cm4gb2JqZWN0ID09IChvdGhlciArICcnKTtcblxuICAgIGNhc2UgbWFwVGFnOlxuICAgICAgdmFyIGNvbnZlcnQgPSBtYXBUb0FycmF5O1xuXG4gICAgY2FzZSBzZXRUYWc6XG4gICAgICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHO1xuICAgICAgY29udmVydCB8fCAoY29udmVydCA9IHNldFRvQXJyYXkpO1xuXG4gICAgICBpZiAob2JqZWN0LnNpemUgIT0gb3RoZXIuc2l6ZSAmJiAhaXNQYXJ0aWFsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgICAgIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KG9iamVjdCk7XG4gICAgICBpZiAoc3RhY2tlZCkge1xuICAgICAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgICAgIH1cbiAgICAgIGJpdG1hc2sgfD0gQ09NUEFSRV9VTk9SREVSRURfRkxBRztcblxuICAgICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgICBzdGFjay5zZXQob2JqZWN0LCBvdGhlcik7XG4gICAgICB2YXIgcmVzdWx0ID0gZXF1YWxBcnJheXMoY29udmVydChvYmplY3QpLCBjb252ZXJ0KG90aGVyKSwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjayk7XG4gICAgICBzdGFja1snZGVsZXRlJ10ob2JqZWN0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG5cbiAgICBjYXNlIHN5bWJvbFRhZzpcbiAgICAgIGlmIChzeW1ib2xWYWx1ZU9mKSB7XG4gICAgICAgIHJldHVybiBzeW1ib2xWYWx1ZU9mLmNhbGwob2JqZWN0KSA9PSBzeW1ib2xWYWx1ZU9mLmNhbGwob3RoZXIpO1xuICAgICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIG9iamVjdHMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxPYmplY3RzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRyxcbiAgICAgIG9ialByb3BzID0gZ2V0QWxsS2V5cyhvYmplY3QpLFxuICAgICAgb2JqTGVuZ3RoID0gb2JqUHJvcHMubGVuZ3RoLFxuICAgICAgb3RoUHJvcHMgPSBnZXRBbGxLZXlzKG90aGVyKSxcbiAgICAgIG90aExlbmd0aCA9IG90aFByb3BzLmxlbmd0aDtcblxuICBpZiAob2JqTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhaXNQYXJ0aWFsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBpbmRleCA9IG9iakxlbmd0aDtcbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICB2YXIga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgIGlmICghKGlzUGFydGlhbCA/IGtleSBpbiBvdGhlciA6IGhhc093blByb3BlcnR5LmNhbGwob3RoZXIsIGtleSkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQob2JqZWN0KTtcbiAgaWYgKHN0YWNrZWQgJiYgc3RhY2suZ2V0KG90aGVyKSkge1xuICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICB9XG4gIHZhciByZXN1bHQgPSB0cnVlO1xuICBzdGFjay5zZXQob2JqZWN0LCBvdGhlcik7XG4gIHN0YWNrLnNldChvdGhlciwgb2JqZWN0KTtcblxuICB2YXIgc2tpcEN0b3IgPSBpc1BhcnRpYWw7XG4gIHdoaWxlICgrK2luZGV4IDwgb2JqTGVuZ3RoKSB7XG4gICAga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2tleV07XG5cbiAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgdmFyIGNvbXBhcmVkID0gaXNQYXJ0aWFsXG4gICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgb2JqVmFsdWUsIGtleSwgb3RoZXIsIG9iamVjdCwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihvYmpWYWx1ZSwgb3RoVmFsdWUsIGtleSwgb2JqZWN0LCBvdGhlciwgc3RhY2spO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBpZiAoIShjb21wYXJlZCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgPyAob2JqVmFsdWUgPT09IG90aFZhbHVlIHx8IGVxdWFsRnVuYyhvYmpWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSlcbiAgICAgICAgICA6IGNvbXBhcmVkXG4gICAgICAgICkpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHNraXBDdG9yIHx8IChza2lwQ3RvciA9IGtleSA9PSAnY29uc3RydWN0b3InKTtcbiAgfVxuICBpZiAocmVzdWx0ICYmICFza2lwQ3Rvcikge1xuICAgIHZhciBvYmpDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yLFxuICAgICAgICBvdGhDdG9yID0gb3RoZXIuY29uc3RydWN0b3I7XG5cbiAgICAvLyBOb24gYE9iamVjdGAgb2JqZWN0IGluc3RhbmNlcyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVhbC5cbiAgICBpZiAob2JqQ3RvciAhPSBvdGhDdG9yICYmXG4gICAgICAgICgnY29uc3RydWN0b3InIGluIG9iamVjdCAmJiAnY29uc3RydWN0b3InIGluIG90aGVyKSAmJlxuICAgICAgICAhKHR5cGVvZiBvYmpDdG9yID09ICdmdW5jdGlvbicgJiYgb2JqQ3RvciBpbnN0YW5jZW9mIG9iakN0b3IgJiZcbiAgICAgICAgICB0eXBlb2Ygb3RoQ3RvciA9PSAnZnVuY3Rpb24nICYmIG90aEN0b3IgaW5zdGFuY2VvZiBvdGhDdG9yKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIHN0YWNrWydkZWxldGUnXShvYmplY3QpO1xuICBzdGFja1snZGVsZXRlJ10ob3RoZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGdldEFsbEtleXMob2JqZWN0KSB7XG4gIHJldHVybiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXMsIGdldFN5bWJvbHMpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG52YXIgZ2V0U3ltYm9scyA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgcmV0dXJuIGFycmF5RmlsdGVyKG5hdGl2ZUdldFN5bWJvbHMob2JqZWN0KSwgZnVuY3Rpb24oc3ltYm9sKSB7XG4gICAgcmV0dXJuIHByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqZWN0LCBzeW1ib2wpO1xuICB9KTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgYHRvU3RyaW5nVGFnYCBvZiBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbnZhciBnZXRUYWcgPSBiYXNlR2V0VGFnO1xuXG4vLyBGYWxsYmFjayBmb3IgZGF0YSB2aWV3cywgbWFwcywgc2V0cywgYW5kIHdlYWsgbWFwcyBpbiBJRSAxMSBhbmQgcHJvbWlzZXMgaW4gTm9kZS5qcyA8IDYuXG5pZiAoKERhdGFWaWV3ICYmIGdldFRhZyhuZXcgRGF0YVZpZXcobmV3IEFycmF5QnVmZmVyKDEpKSkgIT0gZGF0YVZpZXdUYWcpIHx8XG4gICAgKE1hcCAmJiBnZXRUYWcobmV3IE1hcCkgIT0gbWFwVGFnKSB8fFxuICAgIChQcm9taXNlICYmIGdldFRhZyhQcm9taXNlLnJlc29sdmUoKSkgIT0gcHJvbWlzZVRhZykgfHxcbiAgICAoU2V0ICYmIGdldFRhZyhuZXcgU2V0KSAhPSBzZXRUYWcpIHx8XG4gICAgKFdlYWtNYXAgJiYgZ2V0VGFnKG5ldyBXZWFrTWFwKSAhPSB3ZWFrTWFwVGFnKSkge1xuICBnZXRUYWcgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSBiYXNlR2V0VGFnKHZhbHVlKSxcbiAgICAgICAgQ3RvciA9IHJlc3VsdCA9PSBvYmplY3RUYWcgPyB2YWx1ZS5jb25zdHJ1Y3RvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgY3RvclN0cmluZyA9IEN0b3IgPyB0b1NvdXJjZShDdG9yKSA6ICcnO1xuXG4gICAgaWYgKGN0b3JTdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoY3RvclN0cmluZykge1xuICAgICAgICBjYXNlIGRhdGFWaWV3Q3RvclN0cmluZzogcmV0dXJuIGRhdGFWaWV3VGFnO1xuICAgICAgICBjYXNlIG1hcEN0b3JTdHJpbmc6IHJldHVybiBtYXBUYWc7XG4gICAgICAgIGNhc2UgcHJvbWlzZUN0b3JTdHJpbmc6IHJldHVybiBwcm9taXNlVGFnO1xuICAgICAgICBjYXNlIHNldEN0b3JTdHJpbmc6IHJldHVybiBzZXRUYWc7XG4gICAgICAgIGNhc2Ugd2Vha01hcEN0b3JTdHJpbmc6IHJldHVybiB3ZWFrTWFwVGFnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpICYmXG4gICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBmdW5jYCBoYXMgaXRzIHNvdXJjZSBtYXNrZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBmdW5jYCBpcyBtYXNrZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNNYXNrZWQoZnVuYykge1xuICByZXR1cm4gISFtYXNrU3JjS2V5ICYmIChtYXNrU3JjS2V5IGluIGZ1bmMpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBQZXJmb3JtcyBhXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIGRlZXAgY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlXG4gKiBlcXVpdmFsZW50LlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBzdXBwb3J0cyBjb21wYXJpbmcgYXJyYXlzLCBhcnJheSBidWZmZXJzLCBib29sZWFucyxcbiAqIGRhdGUgb2JqZWN0cywgZXJyb3Igb2JqZWN0cywgbWFwcywgbnVtYmVycywgYE9iamVjdGAgb2JqZWN0cywgcmVnZXhlcyxcbiAqIHNldHMsIHN0cmluZ3MsIHN5bWJvbHMsIGFuZCB0eXBlZCBhcnJheXMuIGBPYmplY3RgIG9iamVjdHMgYXJlIGNvbXBhcmVkXG4gKiBieSB0aGVpciBvd24sIG5vdCBpbmhlcml0ZWQsIGVudW1lcmFibGUgcHJvcGVydGllcy4gRnVuY3Rpb25zIGFuZCBET01cbiAqIG5vZGVzIGFyZSBjb21wYXJlZCBieSBzdHJpY3QgZXF1YWxpdHksIGkuZS4gYD09PWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uaXNFcXVhbChvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBvYmplY3QgPT09IG90aGVyO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNFcXVhbCh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlcik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KG5ldyBVaW50OEFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShbXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNUeXBlZEFycmF5ID0gbm9kZUlzVHlwZWRBcnJheSA/IGJhc2VVbmFyeShub2RlSXNUeXBlZEFycmF5KSA6IGJhc2VJc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYSBuZXcgZW1wdHkgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBlbXB0eSBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5cyA9IF8udGltZXMoMiwgXy5zdHViQXJyYXkpO1xuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5cyk7XG4gKiAvLyA9PiBbW10sIFtdXVxuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5c1swXSA9PT0gYXJyYXlzWzFdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIHN0dWJBcnJheSgpIHtcbiAgcmV0dXJuIFtdO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5zdHViRmFsc2UpO1xuICogLy8gPT4gW2ZhbHNlLCBmYWxzZV1cbiAqL1xuZnVuY3Rpb24gc3R1YkZhbHNlKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNFcXVhbDtcbiIsIihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSl7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKmlzdGFuYnVsIGlnbm9yZSBuZXh0OmNhbnQgdGVzdCovXG4gIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgcm9vdC5vYmplY3RQYXRoID0gZmFjdG9yeSgpO1xuICB9XG59KSh0aGlzLCBmdW5jdGlvbigpe1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gICAgaWYob2JqID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICAvL3RvIGhhbmRsZSBvYmplY3RzIHdpdGggbnVsbCBwcm90b3R5cGVzICh0b28gZWRnZSBjYXNlPylcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcClcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpe1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgICBmb3IgKHZhciBpIGluIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIGkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiB0b1N0cmluZyh0eXBlKXtcbiAgICByZXR1cm4gdG9TdHIuY2FsbCh0eXBlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzT2JqZWN0KG9iail7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIHRvU3RyaW5nKG9iaikgPT09IFwiW29iamVjdCBPYmplY3RdXCI7XG4gIH1cblxuICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKXtcbiAgICAvKmlzdGFuYnVsIGlnbm9yZSBuZXh0OmNhbnQgdGVzdCovXG4gICAgcmV0dXJuIHRvU3RyLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQm9vbGVhbihvYmope1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnYm9vbGVhbicgfHwgdG9TdHJpbmcob2JqKSA9PT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0S2V5KGtleSl7XG4gICAgdmFyIGludEtleSA9IHBhcnNlSW50KGtleSk7XG4gICAgaWYgKGludEtleS50b1N0cmluZygpID09PSBrZXkpIHtcbiAgICAgIHJldHVybiBpbnRLZXk7XG4gICAgfVxuICAgIHJldHVybiBrZXk7XG4gIH1cblxuICBmdW5jdGlvbiBmYWN0b3J5KG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuXG4gICAgdmFyIG9iamVjdFBhdGggPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmplY3RQYXRoKS5yZWR1Y2UoZnVuY3Rpb24ocHJveHksIHByb3ApIHtcbiAgICAgICAgaWYocHJvcCA9PT0gJ2NyZWF0ZScpIHtcbiAgICAgICAgICByZXR1cm4gcHJveHk7XG4gICAgICAgIH1cblxuICAgICAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbHNlKi9cbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3RQYXRoW3Byb3BdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcHJveHlbcHJvcF0gPSBvYmplY3RQYXRoW3Byb3BdLmJpbmQob2JqZWN0UGF0aCwgb2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwcm94eTtcbiAgICAgIH0sIHt9KTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaGFzU2hhbGxvd1Byb3BlcnR5KG9iaiwgcHJvcCkge1xuICAgICAgcmV0dXJuIChvcHRpb25zLmluY2x1ZGVJbmhlcml0ZWRQcm9wcyB8fCAodHlwZW9mIHByb3AgPT09ICdudW1iZXInICYmIEFycmF5LmlzQXJyYXkob2JqKSkgfHwgaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTaGFsbG93UHJvcGVydHkob2JqLCBwcm9wKSB7XG4gICAgICBpZiAoaGFzU2hhbGxvd1Byb3BlcnR5KG9iaiwgcHJvcCkpIHtcbiAgICAgICAgcmV0dXJuIG9ialtwcm9wXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXQob2JqLCBwYXRoLCB2YWx1ZSwgZG9Ob3RSZXBsYWNlKXtcbiAgICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcGF0aCA9IFtwYXRoXTtcbiAgICAgIH1cbiAgICAgIGlmICghcGF0aCB8fCBwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gc2V0KG9iaiwgcGF0aC5zcGxpdCgnLicpLm1hcChnZXRLZXkpLCB2YWx1ZSwgZG9Ob3RSZXBsYWNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBjdXJyZW50UGF0aCA9IHBhdGhbMF07XG4gICAgICB2YXIgY3VycmVudFZhbHVlID0gZ2V0U2hhbGxvd1Byb3BlcnR5KG9iaiwgY3VycmVudFBhdGgpO1xuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGlmIChjdXJyZW50VmFsdWUgPT09IHZvaWQgMCB8fCAhZG9Ob3RSZXBsYWNlKSB7XG4gICAgICAgICAgb2JqW2N1cnJlbnRQYXRoXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjdXJyZW50VmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjdXJyZW50VmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgICAvL2NoZWNrIGlmIHdlIGFzc3VtZSBhbiBhcnJheVxuICAgICAgICBpZih0eXBlb2YgcGF0aFsxXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBvYmpbY3VycmVudFBhdGhdID0gW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2JqW2N1cnJlbnRQYXRoXSA9IHt9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZXQob2JqW2N1cnJlbnRQYXRoXSwgcGF0aC5zbGljZSgxKSwgdmFsdWUsIGRvTm90UmVwbGFjZSk7XG4gICAgfVxuXG4gICAgb2JqZWN0UGF0aC5oYXMgPSBmdW5jdGlvbiAob2JqLCBwYXRoKSB7XG4gICAgICBpZiAodHlwZW9mIHBhdGggPT09ICdudW1iZXInKSB7XG4gICAgICAgIHBhdGggPSBbcGF0aF07XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xuICAgICAgICBwYXRoID0gcGF0aC5zcGxpdCgnLicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXBhdGggfHwgcGF0aC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuICEhb2JqO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGogPSBnZXRLZXkocGF0aFtpXSk7XG5cbiAgICAgICAgaWYoKHR5cGVvZiBqID09PSAnbnVtYmVyJyAmJiBpc0FycmF5KG9iaikgJiYgaiA8IG9iai5sZW5ndGgpIHx8XG4gICAgICAgICAgKG9wdGlvbnMuaW5jbHVkZUluaGVyaXRlZFByb3BzID8gKGogaW4gT2JqZWN0KG9iaikpIDogaGFzT3duUHJvcGVydHkob2JqLCBqKSkpIHtcbiAgICAgICAgICBvYmogPSBvYmpbal07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICBvYmplY3RQYXRoLmVuc3VyZUV4aXN0cyA9IGZ1bmN0aW9uIChvYmosIHBhdGgsIHZhbHVlKXtcbiAgICAgIHJldHVybiBzZXQob2JqLCBwYXRoLCB2YWx1ZSwgdHJ1ZSk7XG4gICAgfTtcblxuICAgIG9iamVjdFBhdGguc2V0ID0gZnVuY3Rpb24gKG9iaiwgcGF0aCwgdmFsdWUsIGRvTm90UmVwbGFjZSl7XG4gICAgICByZXR1cm4gc2V0KG9iaiwgcGF0aCwgdmFsdWUsIGRvTm90UmVwbGFjZSk7XG4gICAgfTtcblxuICAgIG9iamVjdFBhdGguaW5zZXJ0ID0gZnVuY3Rpb24gKG9iaiwgcGF0aCwgdmFsdWUsIGF0KXtcbiAgICAgIHZhciBhcnIgPSBvYmplY3RQYXRoLmdldChvYmosIHBhdGgpO1xuICAgICAgYXQgPSB+fmF0O1xuICAgICAgaWYgKCFpc0FycmF5KGFycikpIHtcbiAgICAgICAgYXJyID0gW107XG4gICAgICAgIG9iamVjdFBhdGguc2V0KG9iaiwgcGF0aCwgYXJyKTtcbiAgICAgIH1cbiAgICAgIGFyci5zcGxpY2UoYXQsIDAsIHZhbHVlKTtcbiAgICB9O1xuXG4gICAgb2JqZWN0UGF0aC5lbXB0eSA9IGZ1bmN0aW9uKG9iaiwgcGF0aCkge1xuICAgICAgaWYgKGlzRW1wdHkocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgIH1cbiAgICAgIGlmIChvYmogPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgfVxuXG4gICAgICB2YXIgdmFsdWUsIGk7XG4gICAgICBpZiAoISh2YWx1ZSA9IG9iamVjdFBhdGguZ2V0KG9iaiwgcGF0aCkpKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RQYXRoLnNldChvYmosIHBhdGgsICcnKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNCb29sZWFuKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gb2JqZWN0UGF0aC5zZXQob2JqLCBwYXRoLCBmYWxzZSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdFBhdGguc2V0KG9iaiwgcGF0aCwgMCk7XG4gICAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlLmxlbmd0aCA9IDA7XG4gICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICBmb3IgKGkgaW4gdmFsdWUpIHtcbiAgICAgICAgICBpZiAoaGFzU2hhbGxvd1Byb3BlcnR5KHZhbHVlLCBpKSkge1xuICAgICAgICAgICAgZGVsZXRlIHZhbHVlW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdFBhdGguc2V0KG9iaiwgcGF0aCwgbnVsbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIG9iamVjdFBhdGgucHVzaCA9IGZ1bmN0aW9uIChvYmosIHBhdGggLyosIHZhbHVlcyAqLyl7XG4gICAgICB2YXIgYXJyID0gb2JqZWN0UGF0aC5nZXQob2JqLCBwYXRoKTtcbiAgICAgIGlmICghaXNBcnJheShhcnIpKSB7XG4gICAgICAgIGFyciA9IFtdO1xuICAgICAgICBvYmplY3RQYXRoLnNldChvYmosIHBhdGgsIGFycik7XG4gICAgICB9XG5cbiAgICAgIGFyci5wdXNoLmFwcGx5KGFyciwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSk7XG4gICAgfTtcblxuICAgIG9iamVjdFBhdGguY29hbGVzY2UgPSBmdW5jdGlvbiAob2JqLCBwYXRocywgZGVmYXVsdFZhbHVlKSB7XG4gICAgICB2YXIgdmFsdWU7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwYXRocy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoKHZhbHVlID0gb2JqZWN0UGF0aC5nZXQob2JqLCBwYXRoc1tpXSkpICE9PSB2b2lkIDApIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICB9O1xuXG4gICAgb2JqZWN0UGF0aC5nZXQgPSBmdW5jdGlvbiAob2JqLCBwYXRoLCBkZWZhdWx0VmFsdWUpe1xuICAgICAgaWYgKHR5cGVvZiBwYXRoID09PSAnbnVtYmVyJykge1xuICAgICAgICBwYXRoID0gW3BhdGhdO1xuICAgICAgfVxuICAgICAgaWYgKCFwYXRoIHx8IHBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG4gICAgICBpZiAob2JqID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdFBhdGguZ2V0KG9iaiwgcGF0aC5zcGxpdCgnLicpLCBkZWZhdWx0VmFsdWUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudFBhdGggPSBnZXRLZXkocGF0aFswXSk7XG4gICAgICB2YXIgbmV4dE9iaiA9IGdldFNoYWxsb3dQcm9wZXJ0eShvYmosIGN1cnJlbnRQYXRoKVxuICAgICAgaWYgKG5leHRPYmogPT09IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIG5leHRPYmo7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmplY3RQYXRoLmdldChvYmpbY3VycmVudFBhdGhdLCBwYXRoLnNsaWNlKDEpLCBkZWZhdWx0VmFsdWUpO1xuICAgIH07XG5cbiAgICBvYmplY3RQYXRoLmRlbCA9IGZ1bmN0aW9uIGRlbChvYmosIHBhdGgpIHtcbiAgICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcGF0aCA9IFtwYXRoXTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0VtcHR5KHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG4gICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdFBhdGguZGVsKG9iaiwgcGF0aC5zcGxpdCgnLicpKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRQYXRoID0gZ2V0S2V5KHBhdGhbMF0pO1xuICAgICAgaWYgKCFoYXNTaGFsbG93UHJvcGVydHkob2JqLCBjdXJyZW50UGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH1cblxuICAgICAgaWYocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgICAgIG9iai5zcGxpY2UoY3VycmVudFBhdGgsIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBvYmpbY3VycmVudFBhdGhdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gb2JqZWN0UGF0aC5kZWwob2JqW2N1cnJlbnRQYXRoXSwgcGF0aC5zbGljZSgxKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iamVjdFBhdGg7XG4gIH1cblxuICB2YXIgbW9kID0gZmFjdG9yeSgpO1xuICBtb2QuY3JlYXRlID0gZmFjdG9yeTtcbiAgbW9kLndpdGhJbmhlcml0ZWRQcm9wcyA9IGZhY3Rvcnkoe2luY2x1ZGVJbmhlcml0ZWRQcm9wczogdHJ1ZX0pXG4gIHJldHVybiBtb2Q7XG59KTtcbiIsInZhciBhbmltYXRpb24gPSB7XHJcbiAgICBzdGF0ZTogZmFsc2UsXHJcbiAgICBjb3VudGVyOiAwLFxyXG4gICAgZHVyYXRpb246IDI0MFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuYW5pbWF0aW9uID0gYW5pbWF0aW9uOyIsIi8vIGRlcGVuZGVuY2llc1xyXG5cclxuLy8gTlBNXHJcbiAgICB2YXIgTGlua2VkTGlzdCA9IHJlcXVpcmUoJ2RibHktbGlua2VkLWxpc3QnKTtcclxuICAgIHZhciBvYmplY3RQYXRoID0gcmVxdWlyZShcIm9iamVjdC1wYXRoXCIpO1xyXG5cclxuLy8gQ3VzdG9tIFJlcXVpcmVzXHJcbiAgICB2YXIgbWF0aFV0aWxzID0gcmVxdWlyZSgnLi9tYXRoVXRpbHMuanMnKS5tYXRoVXRpbHM7XHJcbiAgICB2YXIgdHJpZyA9IHJlcXVpcmUoJy4vdHJpZ29ub21pY1V0aWxzLmpzJykudHJpZ29ub21pY1V0aWxzO1xyXG4gICAgcmVxdWlyZSgnLi9jYW52YXNBcGlBdWdtZW50YXRpb24uanMnKTtcclxuICAgIHZhciBjb2xvcmluZyA9IHJlcXVpcmUoJy4vY29sb3JVdGlscy5qcycpLmNvbG9yVXRpbHM7XHJcbiAgICB2YXIgZWFzaW5nID0gcmVxdWlyZSgnLi9lYXNpbmcuanMnKS5lYXNpbmdFcXVhdGlvbnM7XHJcbiAgICB2YXIgYW5pbWF0aW9uID0gcmVxdWlyZSgnLi9hbmltYXRpb24uanMnKS5hbmltYXRpb247XHJcbiAgICB2YXIgZGVidWdDb25maWcgPSByZXF1aXJlKCcuL2RlYnVnVXRpbHMuanMnKTtcclxuICAgIHZhciBkZWJ1ZyA9IGRlYnVnQ29uZmlnLmRlYnVnO1xyXG4gICAgdmFyIGxhc3RDYWxsZWRUaW1lID0gZGVidWdDb25maWcubGFzdENhbGxlZFRpbWU7XHJcbiAgICB2YXIgZW52aXJvbm1lbnQgPSByZXF1aXJlKCcuL2Vudmlyb25tZW50LmpzJykuZW52aXJvbm1lbnQ7XHJcbiAgICB2YXIgcGh5c2ljcyA9IGVudmlyb25tZW50LmZvcmNlcztcclxuICAgIHZhciBydW50aW1lRW5naW5lID0gZW52aXJvbm1lbnQucnVudGltZUVuZ2luZTtcclxuICAgIFxyXG4gICAgcmVxdWlyZSgnLi9nZWFycy5qcycpO1xyXG4gICAgXHJcbiAgICB2YXIgb3ZlcmxheUNmZyA9IHJlcXVpcmUoJy4vb3ZlcmxheS5qcycpLm92ZXJsYXlDZmc7XHJcblxyXG4gICAgdmFyIHN1bkNvcm9uYSA9IHJlcXVpcmUoJy4vc3VuQ29yb25hLmpzJyk7XHJcbiAgICB2YXIgc3VuU3Bpa2VzID0gcmVxdWlyZSgnLi9zdW5TcGlrZXMuanMnKTtcclxuICAgIHZhciBsZW5zRmxhcmUgPSByZXF1aXJlKCcuL2xlbnNGbGFyZS5qcycpO1xyXG4gICAgdmFyIHNpbmVXYXZlID0gcmVxdWlyZSgnLi9zaW5lV2F2ZU1vZHVsYXRvci5qcycpLnNpbmVXYXZlO1xyXG4gICAgdmFyIHByb3BvcnRpb25hbE1lYXN1cmVzID0gcmVxdWlyZSgnLi9wcm9wb3J0aW9uYWxNZWFzdXJlcy5qcycpO1xyXG4gICAgdmFyIG11c2NsZU1vZGlmaWVyID0gcmVxdWlyZSgnLi9tdXNjbGVNb2RpZmllci5qcycpLm11c2NsZU1vZGlmaWVyO1xyXG4gICAgdmFyIHNlcSA9IHJlcXVpcmUoJy4vc2VxdWVuY2VyLmpzJyk7XHJcbiAgICB2YXIgc2VxTGlzdCA9IHNlcS5zZXFMaXN0O1xyXG4gICAgdmFyIHRyYWNrUGxheWVyID0gcmVxdWlyZSgnLi90cmFja1BsYXllci5qcycpO1xyXG5cclxuLy8gYmFzZSB2YXJpYWJsZXNcclxuICAgIHZhciBtb3VzZVggPSAwLCBcclxuICAgICAgICBtb3VzZVkgPSAwLCBcclxuICAgICAgICBsYXN0TW91c2VYID0gMCwgXHJcbiAgICAgICAgbGFzdE1vdXNlWSA9IDAsIFxyXG4gICAgICAgIGZyYW1lUmF0ZSA9IDYwLCBcclxuICAgICAgICBsYXN0VXBkYXRlID0gRGF0ZS5ub3coKSxcclxuICAgICAgICBtb3VzZURvd24gPSBmYWxzZSxcclxuICAgICAgICBydW50aW1lID0gMCxcclxuICAgICAgICBwTGl2ZSA9IDAsXHJcbiAgICAgICAgZ2xvYmFsQ2xvY2sgPSAwLFxyXG4gICAgICAgIGNvdW50ZXIgPSAwLFxyXG4gICAgICAgIGRpc3BsYXlPdmVybGF5ID0gZmFsc2U7XHJcblxyXG4vLyBjcmVhdGUgd2luZG93IGxvYWQgZnVuY3Rpb24sIGluaXRpYWxpc2UgbW91c2UgdHJhY2tpbmdcclxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgbW91c2VYID0gZS5jbGllbnRYO1xyXG4gICAgICAgICAgICBtb3VzZVkgPSBlLmNsaWVudFk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihlKXttb3VzZURvd24gPXRydWU7IGlmKHR5cGVvZiBvbk1vdXNlRG93biA9PSAnZnVuY3Rpb24nKSBvbk1vdXNlRG93bigpIDt9KTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uKGUpe21vdXNlRG93biA9IGZhbHNlO2lmKHR5cGVvZiBvbk1vdXNlVXAgPT0gJ2Z1bmN0aW9uJykgb25Nb3VzZVVwKCkgIDt9KTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uKGUpe2lmKHR5cGVvZiBvbktleURvd24gPT0gJ2Z1bmN0aW9uJykgb25LZXlEb3duKGUpICA7fSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gaWYodHlwZW9mIHdpbmRvdy5zZXR1cCA9PSAnZnVuY3Rpb24nKSB3aW5kb3cuc2V0dXAoKTtcclxuICAgICAgICAvLyBjanNsb29wKCk7ICBcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvLyB3aW5kb3cgbG9hZCBmdW5jdGlvblxyXG4gICAgLy8gaW5jbHVkZXMgbW91c2UgdHJhY2tpbmdcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJyxpbml0KTtcclxuXHJcbi8vIHN0YXRpYyBhc3NldCBjYW52YXNlc1xyXG5sZXQgc3RhdGljQXNzZXRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxubGV0IHN0YXRpY0Fzc2V0Q3R4ID0gc3RhdGljQXNzZXRDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5zdGF0aWNBc3NldENhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoICogMjtcclxuc3RhdGljQXNzZXRDYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICogMjtcclxuXHJcbnZhciBzdGF0aWNBc3NldENvbmZpZ3MgPSB7fTtcclxudmFyIGltYWdlQXNzZXRDb25maWdzID0ge307XHJcblxyXG5sZXQgc2Vjb25kYXJ5U3RhdGljQXNzZXRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxubGV0IHNlY29uZGFyeVN0YXRpY0Fzc2V0Q3R4ID0gc2Vjb25kYXJ5U3RhdGljQXNzZXRDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5zZWNvbmRhcnlTdGF0aWNBc3NldENhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoICogMjtcclxuc2Vjb25kYXJ5U3RhdGljQXNzZXRDYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICogMjtcclxuXHJcbmxldCBmbGFyZUFzc2V0Q2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbmxldCBmbGFyZUFzc2V0Q3R4ID0gZmxhcmVBc3NldENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbmZsYXJlQXNzZXRDYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAqIDI7XHJcbmZsYXJlQXNzZXRDYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICogMjtcclxuZmxhcmVBc3NldENhbnZhcy5pZCA9ICdmbGFyZUFzc2V0Q2FudmFzJztcclxuXHJcbmxldCBiZ0dsYXJlQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbmxldCBiZ0dsYXJlQ3R4ID0gYmdHbGFyZUNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbmJnR2xhcmVDYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuYmdHbGFyZUNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblxyXG5sZXQgbGVuc0ZsYXJlQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbmxldCBsZW5zRmxhcmVDdHggPSBsZW5zRmxhcmVDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuXHJcblxyXG4vLyBzdGFuZGFyZCBjYW52YXMgcmVuZGVyaW5nXHJcbi8vIGNhbnZhcyBob3VzZWtlZXBpbmdcclxuXHJcbi8vLy8gU2NyZWVuIFJlbmRlcmVyc1xyXG5cclxuLy8gZmFjZSBsYXllclxyXG52YXIgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNmYWNlLWxheWVyXCIpO1xyXG52YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbnZhciBmbGFyZUxheWVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNmbGFyZS1sYXllclwiKTtcclxudmFyIGZsYXJlTGF5ZXJDdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxudmFyIGNvcm9uYUxheWVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb3JvbmEtbGF5ZXJcIik7XHJcbnZhciBjb3JvbmFMYXllckN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG5cclxuLy8gY2FjaGUgY2FudmFzIHcvaFxyXG52YXIgY2FuVyA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG52YXIgY2FuSCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxudmFyIGNhbnZhc0NlbnRyZUggPSBjYW5XIC8gMjtcclxudmFyIGNhbnZhc0NlbnRyZVYgPSBjYW5IIC8gMjtcclxuXHJcbi8vIHNldCBjYW52YXNlcyB0byBmdWxsLXNjcmVlblxyXG5jYW52YXMud2lkdGggPSBjYW5XO1xyXG5jYW52YXMuaGVpZ2h0ID0gY2FuSDtcclxuZmxhcmVMYXllci53aWR0aCA9IGNhblc7XHJcbmZsYXJlTGF5ZXIuaGVpZ2h0ID0gY2FuSDtcclxuY29yb25hTGF5ZXIud2lkdGggPSBjYW5XO1xyXG5jb3JvbmFMYXllci5oZWlnaHQgPSBjYW5IO1xyXG5cclxuXHJcbi8vIHNldCBiYXNlIGNhbnZhcyBjb25maWdcclxudmFyIGNhbnZhc0NvbmZpZyA9IHtcclxuICAgIHdpZHRoOiBjYW5XLFxyXG4gICAgaGVpZ2h0OiBjYW5ILFxyXG4gICAgY2VudGVySDogY2FudmFzQ2VudHJlSCxcclxuICAgIGNlbnRlclY6IGNhbnZhc0NlbnRyZVYsXHJcblxyXG4gICAgYnVmZmVyQ2xlYXJSZWdpb246IHtcclxuICAgICAgICB4OiBjYW52YXNDZW50cmVILFxyXG4gICAgICAgIHk6IGNhbnZhc0NlbnRyZVYsXHJcbiAgICAgICAgdzogMCxcclxuICAgICAgICBoOiAwXHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuLy8gc2V0IGJ1ZmZlciBjb25maWcgZm9yIHVzZSBpbiBjb25zdHJhaW5lZCBjYW52YXMgY2xlYXIgcmVnaW9uXHJcbnZhciBidWZmZXJDbGVhclJlZ2lvbiA9IHtcclxuICAgIHg6IGNhbnZhc0NlbnRyZUgsXHJcbiAgICB5OiBjYW52YXNDZW50cmVWLFxyXG4gICAgdzogMCxcclxuICAgIGg6IDBcclxufTtcclxuXHJcblxyXG4vLyBzZXQgYmFzZSBjb25maWcgZm9yIGZhY2VcclxudmFyIHN1bmZhY2UgPSB7XHJcbiAgICBjb2xvdXJzOiB7XHJcbiAgICAgICAgYmFzZToge1xyXG4gICAgICAgICAgICByZWQ6ICcjYWEwMDAwJyxcclxuICAgICAgICAgICAgb3JhbmdlOiAnI0ZGOUMwRCcsXHJcbiAgICAgICAgICAgIHllbGxvdzogJyNiYmJiMDAnLFxyXG4gICAgICAgICAgICB3aGl0ZTogJyNGRkZGRkYnLFxyXG4gICAgICAgICAgICB3aGl0ZVNoYWRvdzogJyNERERERkYnXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZ2I6IHtcclxuICAgICAgICAgICAgb3JhbmdlOiAnMjU1LCAxNTYsIDEzJyxcclxuICAgICAgICAgICAgd2hpdGVTaGFkb3c6IHtcclxuICAgICAgICAgICAgICAgIHI6IDIyMSxcclxuICAgICAgICAgICAgICAgIGc6IDIyMSxcclxuICAgICAgICAgICAgICAgIGI6IDI1NVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZ2JhOiB7XHJcbiAgICAgICAgICAgIG9yYW5nZVNoYWRvdzogJ3JnYmEoIDI1NSwgMTU2LCAxMywgMC4zICknLFxyXG4gICAgICAgICAgICBvcmFuZ2VTaGFkb3dMaWdodDogJ3JnYmEoIDI1NSwgMTU2LCAxMywgMC4yICknLFxyXG4gICAgICAgICAgICBvcmFuZ2VTaGFkb3dMaWdodGVzdDogJ3JnYmEoIDI1NSwgMTU2LCAxMywgMC4xICknLFxyXG4gICAgICAgICAgICBvcmFuZ2VTaGFkb3dEYXJrTGlwOiAncmdiYSggMjU1LCAxNTYsIDEzLCAwLjQgKScsXHJcbiAgICAgICAgICAgIG9yYW5nZVNoYWRvd0Rhcms6ICdyZ2JhKCAyNTUsIDE1NiwgMTMsIDEgKSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlYnVnOiB7XHJcbiAgICAgICAgICAgIHBvaW50czogJyMwMGFhMDAnLFxyXG4gICAgICAgICAgICBoYW5kbGVzOiAnIzAwMDBhYScsXHJcbiAgICAgICAgICAgIGxpbmVzOiAnIzAwNTVmZicsXHJcbiAgICAgICAgICAgIG9yYW5nZTogJ3JnYiggMjU1LCAxNTYsIDEzLCAwLjIgKScsXHJcbiAgICAgICAgICAgIGRpbW1lZDogJ3JnYmEoIDI1NSwgMTUwLCA0MCwgMC4yICknLFxyXG4gICAgICAgICAgICBmaWxsczogJ3JnYmEoIDI1NSwgMTUwLCA0MCwgMC4yICknLFxyXG4gICAgICAgICAgICBmaWxsc1RlZXRoOiAncmdiYSggMjU1LCAyNTUsIDI1NSwgMC4xICknXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGRlYnVnOiB7XHJcbiAgICAgICAgcG9pbnRSOiA0LFxyXG4gICAgICAgIGhhbmRsZVI6IDJcclxuICAgIH0sXHJcbiAgICByOiAyNTAsXHJcbiAgICB4OiBjYW52YXNDZW50cmVILFxyXG4gICAgeTogY2FudmFzQ2VudHJlVlxyXG4gICAgLy8geDogMzAwLFxyXG4gICAgLy8geTogODUwXHJcbn1cclxuXHJcbnN1bmZhY2UuZmFjZVRvU3RhZ2VDZW50cmVBbmdsZSA9IHRyaWcuYW5nbGUoIHN1bmZhY2UueCwgc3VuZmFjZS55LCBjYW52YXNDZW50cmVILCBjYW52YXNDZW50cmVWICk7XHJcblxyXG5sZXQgZGlzdFRvU3RhZ2VDZW50cmUgPSB0cmlnLmRpc3QoIHN1bmZhY2UueCwgc3VuZmFjZS55LCBjYW52YXNDZW50cmVILCBjYW52YXNDZW50cmVWICk7XHJcblxyXG5mdW5jdGlvbiBmYWNlVG9TdGFnZUNlbnRyZURlYnVnTGluZSggY3R4ICkge1xyXG4gICAgbGV0IGN1cnJTdHJva2UgPSBjdHguc3Ryb2tlU3R5bGU7XHJcbiAgICBsZXQgY3VyckZpbGwgPSBjdHguZmlsbFN0eWxlO1xyXG5cclxuICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKCAxNTAsIDE1MCwgMTUwLCAwLjYgKSc7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoIDE1MCwgMTUwLCAxNTAsIDEgKSc7XHJcblxyXG4gICAgY3R4LnRyYW5zbGF0ZSggc3VuZmFjZS54LCBzdW5mYWNlLnkgKTtcclxuICAgIGN0eC5yb3RhdGUoIHN1bmZhY2UuZmFjZVRvU3RhZ2VDZW50cmVBbmdsZSApO1xyXG5cclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5tb3ZlVG8oIDAsIDAgKTtcclxuICAgIGN0eC5saW5lVG8oIGRpc3RUb1N0YWdlQ2VudHJlLCAwICk7XHJcbiAgICBjdHguc2V0TGluZURhc2goIFs1LCA2XSApO1xyXG4gICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgY3R4LnNldExpbmVEYXNoKCBbXSApO1xyXG5cclxuICAgIGN0eC5maWxsQ2lyY2xlKCAwLCAwLCA1ICk7XHJcbiAgICBjdHguZmlsbENpcmNsZSggZGlzdFRvU3RhZ2VDZW50cmUsIDAsIDUgKTtcclxuXHJcbiAgICBjdHgucm90YXRlKCAtc3VuZmFjZS5mYWNlVG9TdGFnZUNlbnRyZUFuZ2xlICk7XHJcbiAgICBjdHgudHJhbnNsYXRlKCAtc3VuZmFjZS54LCAtc3VuZmFjZS55ICk7XHJcblxyXG4gICAgbGV0IHN1bkN0clR4dCA9ICdTdW4gQ2VudHJlIFg6ICcrc3VuZmFjZS54KycgLyBZOiAnK3N1bmZhY2UueTtcclxuICAgIGxldCBzdGFnZUN0clR4dCA9ICdTdGFnZSBDZW50cmUgWDogJytjYW52YXNDZW50cmVIKycgLyBZOiAnK2NhbnZhc0NlbnRyZVY7XHJcblxyXG4gICAgY3R4LmZpbGxUZXh0KCBzdW5DdHJUeHQsIHN1bmZhY2UueCArIDIwLCBzdW5mYWNlLnkgKTtcclxuICAgIGN0eC5maWxsVGV4dCggc3RhZ2VDdHJUeHQsIGNhbnZhc0NlbnRyZUggKyAyMCwgY2FudmFzQ2VudHJlViApO1xyXG5cclxuICAgIGN0eC5zdHJva2VTdHlsZSA9IGN1cnJTdHJva2U7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gY3VyckZpbGw7XHJcbn1cclxuXHJcbmxlbnNGbGFyZS5mbGFyZUluaXQoXHJcbiAgICB7IGNhbnZhczogbGVuc0ZsYXJlQ2FudmFzLCBjdHg6IGxlbnNGbGFyZUN0eCB9LFxyXG4gICAgeyBjYW52YXM6IGZsYXJlTGF5ZXIsIGN0eDogZmxhcmVMYXllckN0eCB9XHJcbik7XHJcblxyXG5sZW5zRmxhcmUuc2V0RGlzcGxheVByb3BzKCBzdW5mYWNlLngsIHN1bmZhY2UueSwgc3VuZmFjZS5yLCBzdW5mYWNlLmZhY2VUb1N0YWdlQ2VudHJlQW5nbGUgKTtcclxuXHJcbmxlbnNGbGFyZS5yZW5kZXJGbGFyZXMoKTtcclxuLy8gY29uc29sZS5sb2coICdzdW5mYWNlLmZhY2VUb1N0YWdlQ2VudHJlQW5nbGU6ICcsIHN1bmZhY2UuZmFjZVRvU3RhZ2VDZW50cmVBbmdsZSApO1xyXG5cclxuXHJcbnN1blNwaWtlcy5yZW5kZXJDZmcuY2FudmFzID0gc3RhdGljQXNzZXRDYW52YXM7XHJcbnN1blNwaWtlcy5yZW5kZXJDZmcuY29udGV4dCA9IHN0YXRpY0Fzc2V0Q3R4O1xyXG5zdW5TcGlrZXMucmVuZGVyQ2ZnLmRlYnVnQ2ZnID0gb3ZlcmxheUNmZztcclxuc3VuU3Bpa2VzLmRpc3BsYXlDZmcuZ2xhcmVTcGlrZXNSYW5kb20uY2FudmFzID0gY29yb25hTGF5ZXI7XHJcbnN1blNwaWtlcy5kaXNwbGF5Q2ZnLmdsYXJlU3Bpa2VzUmFuZG9tLmNvbnRleHQgPSBjb3JvbmFMYXllckN0eDtcclxuc3VuU3Bpa2VzLmRpc3BsYXlDZmcuZ2xhcmVTcGlrZXNSYW5kb20ueCA9IHN1bmZhY2UueDtcclxuc3VuU3Bpa2VzLmRpc3BsYXlDZmcuZ2xhcmVTcGlrZXNSYW5kb20ueSA9IHN1bmZhY2UueTtcclxuXHJcbnN1blNwaWtlcy5nbGFyZVNwaWtlT3B0aW9ucyA9IHtcclxuICAgIHg6IHN0YXRpY0Fzc2V0Q2FudmFzLndpZHRoIC8gMixcclxuICAgIHk6IHN0YXRpY0Fzc2V0Q2FudmFzLmhlaWdodCAvIDIsXHJcbiAgICByOiBzdW5mYWNlLnIgLyAxLjUsXHJcbiAgICBtYWpvclJheUxlbjogNDAwLFxyXG4gICAgbWlub3JSYXlMZW46IDE1MCxcclxuICAgIG1ham9yUmF5V2lkdGg6IDAuMyxcclxuICAgIG1pbm9yUmF5V2lkdGg6IDAuMixcclxuICAgIGFuZ2xlOiBNYXRoLlBJIC8gc3VuZmFjZS5mYWNlVG9TdGFnZUNlbnRyZUFuZ2xlLFxyXG4gICAgY291bnQ6IDE2LFxyXG4gICAgYmx1cjogMTBcclxufVxyXG5cclxuc3VuU3Bpa2VzLmdsYXJlU3Bpa2VSYW5kb21PcHRpb25zID0ge1xyXG4gICAgeDogc3RhdGljQXNzZXRDYW52YXMud2lkdGggLyAyLFxyXG4gICAgeTogc3RhdGljQXNzZXRDYW52YXMuaGVpZ2h0IC8gMixcclxuICAgIHI6IHN1bmZhY2UuciAvIDQsXHJcbiAgICBtYWpvclJheUxlbjogc3VuZmFjZS5yICogMixcclxuICAgIG1pbm9yUmF5TGVuOiBzdW5mYWNlLnIgKiAxLFxyXG4gICAgbWFqb3JSYXlXaWR0aDogMC4wMDUsXHJcbiAgICBtaW5vclJheVdpZHRoOiAwLjAwMDUsXHJcbiAgICBhbmdsZTogTWF0aC5QSSAvIHN1bmZhY2UuZmFjZVRvU3RhZ2VDZW50cmVBbmdsZSxcclxuICAgIGNvdW50OiBtYXRoVXRpbHMucmFuZG9tSW50ZWdlciggMjAsIDQwICksXHJcbiAgICBibHVyOiAxMFxyXG59XHJcblxyXG5zdW5TcGlrZXMuZmxhcmVPcHRpb25zID0ge1xyXG4gICAgY2FudmFzOiBmbGFyZUFzc2V0Q2FudmFzLFxyXG4gICAgY29udGV4dDogZmxhcmVBc3NldEN0eCxcclxuICAgIHg6IGZsYXJlQXNzZXRDYW52YXMud2lkdGggLyAyLFxyXG4gICAgeTogZmxhcmVBc3NldENhbnZhcy5oZWlnaHQgLyAyLFxyXG4gICAgcjogc3VuZmFjZS5yIC8gMS45LFxyXG4gICAgZ3JhZGllbnRXaWR0aDogc3VuZmFjZS5yICogOCxcclxuICAgIHJheUxlbjogc3VuZmFjZS5yICogOCxcclxuICAgIHJheVdpZHRoOiAwLjAzLFxyXG4gICAgYW5nbGU6IE1hdGguUEkgLyBzdW5mYWNlLmZhY2VUb1N0YWdlQ2VudHJlQW5nbGUsXHJcbiAgICBjb3VudDogNixcclxuICAgIGJsdXI6IDFcclxuXHJcbiAgICBcclxufVxyXG5cclxuLy8gY29uc29sZS5sb2coICdzdW5TcGlrZXMuZ2xhcmVTcGlrZU9wdGlvbnMucjogJywgc3VuU3Bpa2VzLmdsYXJlU3Bpa2VPcHRpb25zICk7XHJcbnN1blNwaWtlcy5pbml0R2xhcmVTcGlrZUNvbnRyb2xJbnB1dHMoIGNhbnZhcyApO1xyXG5cclxuLy8gY29uc29sZS5sb2coICdzdW5TcGlrZXMuZ2xhcmVTcGlrZUNvbnRyb2xJbnB1dENmZzogJywgc3VuU3Bpa2VzLmdsYXJlU3Bpa2VDb250cm9sSW5wdXRDZmcgKTtcclxuXHJcbi8vIHN1blNwaWtlcy5yZW5kZXJHbGFyZVNwaWtlcygpO1xyXG4vLyBzdW5TcGlrZXMucmVuZGVyR2xhcmVTcGlrZXNSYW5kb20oKTtcclxuLy8gc3VuU3Bpa2VzLnJlbmRlckZsYXJlcygpO1xyXG5cclxuLy8gaW1hZ2VzXHJcbmxldCByYWluYm93R2xhcmUgPSBuZXcgSW1hZ2UoKTsgICAvLyBDcmVhdGUgbmV3IGltZyBlbGVtZW50XHJcbnJhaW5ib3dHbGFyZS5zcmMgPSAnaW1hZ2VzL3JhaW5ib3dHbGFyZS5wbmcnOyAvLyBTZXQgc291cmNlIHBhdGhcclxuXHJcbmxldCByYWluYm93R2xhcmVMb25nID0gbmV3IEltYWdlKCk7ICAgLy8gQ3JlYXRlIG5ldyBpbWcgZWxlbWVudFxyXG5yYWluYm93R2xhcmVMb25nLnNyYyA9ICdpbWFnZXMvcmFpbmJvd0dsYXJlTG9uZ1N0cm9uZy5wbmcnOyAvLyBTZXQgc291cmNlIHBhdGhcclxucmFpbmJvd0dsYXJlTG9uZ0xvYWRlZCA9IGZhbHNlO1xyXG5yYWluYm93R2xhcmVMb25nQ2ZnID0ge307XHJcblxyXG5pbWFnZUFzc2V0Q29uZmlncy5yYWluYm93R2xhcmUgPSB7XHJcbiAgICBzcmM6IHJhaW5ib3dHbGFyZSxcclxuICAgIHc6IDE1MCxcclxuICAgIGg6IDYwXHJcbn1cclxuXHJcbnJhaW5ib3dHbGFyZUxvbmcub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgaW1hZ2VBc3NldENvbmZpZ3MucmFpbmJvd0dsYXJlTG9uZyA9IHtcclxuICAgICAgICBzcmM6IHJhaW5ib3dHbGFyZUxvbmcsXHJcbiAgICAgICAgdzogMjkwLFxyXG4gICAgICAgIGg6IDU1XHJcbiAgICB9O1xyXG5cclxuICAgIHN1blNwaWtlcy5yZW5kZXJSYWluYm93U3Bpa2VzKFxyXG4gICAgICAgIHsgICBcclxuICAgICAgICAgICAgeDogc2Vjb25kYXJ5U3RhdGljQXNzZXRDYW52YXMud2lkdGggLyAyLFxyXG4gICAgICAgICAgICB5OiBzZWNvbmRhcnlTdGF0aWNBc3NldENhbnZhcy5oZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICBpbWFnZUNmZzogaW1hZ2VBc3NldENvbmZpZ3MucmFpbmJvd0dsYXJlTG9uZyxcclxuICAgICAgICAgICAgZDogNDAwLFxyXG4gICAgICAgICAgICBjb3VudDogMlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2Vjb25kYXJ5U3RhdGljQXNzZXRDdHhcclxuICAgICk7XHJcblxyXG4gICAgcmFpbmJvd0dsYXJlTG9uZ0xvYWRlZCA9IHRydWU7XHJcbiAgICByYWluYm93R2xhcmVMb25nQ2ZnID0gc3VuU3Bpa2VzLmRpc3BsYXlDZmcucmFpbmJvd1NwaWtlcztcclxufVxyXG5cclxubGV0IHJhaW5ib3dSZWFsSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxucmFpbmJvd1JlYWxJbWFnZS5zcmMgPSAnaW1hZ2VzL3JhaW5ibG93QXJjRmxhcmVSZWFsLnBuZyc7XHJcbnJhaW5ib3dSZWFsSW1hZ2VMb2FkZWQgPSBmYWxzZTtcclxucmFpbmJvd1JlYWxJbWFnZUNmZyA9IHtcclxuICAgIHc6IDEwMjQsXHJcbiAgICBoOiAxMDI0XHJcbn07XHJcblxyXG5yYWluYm93UmVhbEltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmFpbmJvd1JlYWxJbWFnZUxvYWRlZCA9IHRydWU7XHJcbn1cclxuLy8gc2V0IGxpbmUgd2lkdGhzIGZvciBkcmF3aW5nIGJhc2VkIG9uIHNjZW5lIHNpemVcclxuc3VuZmFjZS5saW5lcyA9IHtcclxuICAgIG91dGVyOiBNYXRoLmZsb29yKCBzdW5mYWNlLnIgLyAyMCApLFxyXG4gICAgaW5uZXI6IE1hdGguZmxvb3IoIHN1bmZhY2UuciAvIDQwIClcclxufVxyXG5cclxuXHJcbi8vIHNldCBjb3JvbmEgc3lzdGVtIGJhc2Ugc2l6ZVxyXG5zdW5Db3JvbmEucmF5QmFzZVJhZGl1cyA9IHN1bmZhY2UuciAqIDEuMjtcclxuXHJcblxyXG4vLyBzZXQgdXAgcHJvcHJ0aW9uYWwgbWVhc3VyZW1lbnRzIGZyb20gZmFjZSByYWRpdXNcclxudmFyIHBtID0gcHJvcG9ydGlvbmFsTWVhc3VyZXMuc2V0TWVhc3VyZXMoIHN1bmZhY2UuciApO1xyXG5cclxudmFyIGNvcm9uYUdyYWRpZW50ID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHN1bmZhY2UueCwgc3VuZmFjZS55LCBzdW5mYWNlLnIsIHN1bmZhY2UueCwgc3VuZmFjZS55LCBzdW5mYWNlLnIgKiAzICk7XHJcbiAgICBjb3JvbmFHcmFkaWVudC5hZGRDb2xvclN0b3AoMCwgXCJyZ2JhKCAyNTUsIDI1NSwgMTgwLCAxIClcIik7XHJcbiAgICBjb3JvbmFHcmFkaWVudC5hZGRDb2xvclN0b3AoMSwgXCJyZ2JhKCAyNTUsIDI1NSwgMTgwLCAwIClcIik7XHJcblxyXG5cclxudmFyIGNvcm9uYUdyYWRpZW50MiA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudChzdW5mYWNlLngsIHN1bmZhY2UueSwgc3VuZmFjZS5yLCBzdW5mYWNlLngsIHN1bmZhY2UueSwgc3VuZmFjZS5yICogMTAgKTtcclxuICAgIGNvcm9uYUdyYWRpZW50Mi5hZGRDb2xvclN0b3AoIDAsIFwicmdiYSggMjU1LCAyNTUsIDI1NSwgMSApXCIgKTtcclxuICAgIC8vIGNvcm9uYUdyYWRpZW50Mi5hZGRDb2xvclN0b3AoIDAuODgsIFwicmdiYSggMjU1LCAyNTUsIDI1NSwgMCApXCIgKTtcclxuICAgIC8vIGNvcm9uYUdyYWRpZW50Mi5hZGRDb2xvclN0b3AoIDAuODksIFwicmdiYSggMjU1LCAyNTUsIDI1NSwgMC44IClcIiApO1xyXG4gICAgLy8gY29yb25hR3JhZGllbnQyLmFkZENvbG9yU3RvcCggMC45LCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIDAgKVwiICk7XHJcbiAgICBjb3JvbmFHcmFkaWVudDIuYWRkQ29sb3JTdG9wKCAxLCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIDAgKVwiICk7XHJcblxyXG52YXIgY29yb25hR3JhZGllbnQzID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHN1bmZhY2UueCwgc3VuZmFjZS55LCBzdW5mYWNlLnIsIHN1bmZhY2UueCwgc3VuZmFjZS55LCBzdW5mYWNlLnIgKiA1ICk7XHJcbiAgICBjb3JvbmFHcmFkaWVudDIuYWRkQ29sb3JTdG9wKCAwLCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIDEgKVwiICk7XHJcbiAgICAvLyBjb3JvbmFHcmFkaWVudDIuYWRkQ29sb3JTdG9wKCAwLjg4LCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIDAgKVwiICk7XHJcbiAgICAvLyBjb3JvbmFHcmFkaWVudDIuYWRkQ29sb3JTdG9wKCAwLjg5LCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIDAuOCApXCIgKTtcclxuICAgIC8vIGNvcm9uYUdyYWRpZW50Mi5hZGRDb2xvclN0b3AoIDAuOSwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCAwIClcIiApO1xyXG4gICAgY29yb25hR3JhZGllbnQyLmFkZENvbG9yU3RvcCggMSwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCAwIClcIiApO1xyXG5cclxudmFyIGZhY2VHcmFkaWVudCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudChzdW5mYWNlLngsIHN1bmZhY2UueSwgMCwgc3VuZmFjZS54LCBzdW5mYWNlLnkgKyBwbS5yOCwgc3VuZmFjZS5yICk7XHJcbiAgICBmYWNlR3JhZGllbnQuYWRkQ29sb3JTdG9wKCAwLCBcInJnYmEoIDI1NSwgMjU1LCAxMDAsIDEgKVwiICk7XHJcbiAgICBmYWNlR3JhZGllbnQuYWRkQ29sb3JTdG9wKCAwLjcsIFwicmdiYSggMjU1LCAyNTUsIDEwMCwgMSApXCIgKTtcclxuICAgIGZhY2VHcmFkaWVudC5hZGRDb2xvclN0b3AoIDEsIFwicmdiYSggMjU1LCAyNTUsIDEwMCwgMCApXCIgKTtcclxuXHJcbnZhciBmZWF0dXJlQ3JlYXNlVmVydGljYWxHcmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudChcclxuICAgIHN1bmZhY2UueCwgc3VuZmFjZS55LCBzdW5mYWNlLngsIHN1bmZhY2UueSArIHN1bmZhY2UuciApO1xyXG4gICAgZmVhdHVyZUNyZWFzZVZlcnRpY2FsR3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIFwicmdiYSggMjU1LCAxNTYsIDEzLCAxIClcIik7XHJcbiAgICBmZWF0dXJlQ3JlYXNlVmVydGljYWxHcmFkaWVudC5hZGRDb2xvclN0b3AoMSwgXCJyZ2JhKCAyNTUsIDE1NiwgMTMsIDAgKVwiKTtcclxuXHJcbmxldCByYWluYm93ID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KCBzdW5mYWNlLngsIHN1bmZhY2UueSwgc3VuZmFjZS5yLCBzdW5mYWNlLngsIHN1bmZhY2UueSwgc3VuZmFjZS5yICogMyApO1xyXG4gICAgcmFpbmJvdy5hZGRDb2xvclN0b3AoIDAuNCwgXCJyZ2JhKCAyNTUsIDAsIDAsIDAgKVwiICk7XHJcbiAgICByYWluYm93LmFkZENvbG9yU3RvcCggMC41LCBcInJnYmEoIDI1NSwgMCwgMCwgMC4yIClcIiApO1xyXG4gICAgcmFpbmJvdy5hZGRDb2xvclN0b3AoIDAuNiwgXCJyZ2JhKCAwLCAyNTUsIDAsIDAuMiApXCIgKTtcclxuICAgIHJhaW5ib3cuYWRkQ29sb3JTdG9wKCAwLjcsIFwicmdiYSggMCwgMCwgMjU1LCAwLjIgKVwiICk7XHJcbiAgICByYWluYm93LmFkZENvbG9yU3RvcCggMC44LCBcInJnYmEoIDAsIDAsIDI1NSwgMCApXCIgKTtcclxuXHJcblxyXG5cclxuLy8gc2V0IGZhY2UgY29sb3VyXHJcbnZhciBmYWNlT3V0bGluZUNvbG9yID0gc3VuZmFjZS5jb2xvdXJzLmJhc2Uub3JhbmdlO1xyXG5cclxuXHJcbi8vIHNldCB1cCBpbml0aWFsIGZhY2UgY29vcmRpbmF0ZSB2YXJzXHJcbnZhciBleWVCYXNlWSA9IHN1bmZhY2UueSAtICggcG0ucjMgLSBwbS5yMzIgKTtcclxudmFyIGxlZnRFeWVCYXNlWCA9IHN1bmZhY2UueCAtIHBtLnIyICsgcG0ucjE2ICsgcG0ucjMyO1xyXG52YXIgbGVmdEV5ZUJhc2VZID0gZXllQmFzZVk7XHJcbnZhciByaWdodEV5ZUJhc2VYID0gc3VuZmFjZS54ICsgcG0ucjIgLSBwbS5yMTYgLSBwbS5yMzI7XHJcbnZhciByaWdodEV5ZUJhc2VZID0gZXllQmFzZVk7XHJcbnZhciBleWVCYXNlUmFkaXVzID0gcG0ucjU7XHJcblxyXG52YXIgZXllYnJvd0Jhc2VZID0gZXllQmFzZVkgLSBwbS5yMjQ7XHJcblxyXG52YXIgbW91dGhCYXNlWCA9IHN1bmZhY2UueDtcclxudmFyIG1vdXRoQmFzZVkgPSBzdW5mYWNlLnkgKyBwbS5yMyArIHBtLnIxMjtcclxudmFyIG1vdXRoQmFzZVJhZGl1cyA9IHBtLnIzO1xyXG5cclxudmFyIHRlZXRoQmFzZUNlbnRyZVkgPSBtb3V0aEJhc2VZIC0gcG0ucjMyO1xyXG5cclxuLy8gZGVjbGFyZSBiYXNlIGNvbmZpZyBmb3IgbG9vayBjb25zdHJhaW50XHJcbnZhciBhaW1Db25zdHJhaW50ID0ge1xyXG4gICAgdGFyZ2V0OiB7XHJcblxyXG4gICAgICAgIHJlbmRlckNvbmZpZzoge1xyXG4gICAgICAgICAgICByYWRpdXM6IDMwLFxyXG4gICAgICAgICAgICBiYXNlUmFkaXVzOiAzMCxcclxuICAgICAgICAgICAgcm91bmRlbFNjYWxlOiAxMCxcclxuICAgICAgICAgICAgaXNIaXQ6IGZhbHNlLFxyXG4gICAgICAgICAgICBpc0hpZ2hsaWdodGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgaXNNb3Zpbmc6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgY29uZmlnOiB7XHJcbiAgICAgICAgICAgIHg6IHtcclxuICAgICAgICAgICAgICAgIGN0cmxJZDogJ2xvb2tUYXJnZXRYJyxcclxuICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgIG1heDogY2FuV1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB5OiB7XHJcbiAgICAgICAgICAgICAgICBjdHJsSWQ6ICdsb29rVGFyZ2V0WScsXHJcbiAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICBtYXg6IGNhbkgsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHo6IHtcclxuICAgICAgICAgICAgICAgIGN0cmxJZDogJ2xvb2tUYXJnZXRaJyxcclxuICAgICAgICAgICAgICAgIG1pbjogMTAwLFxyXG4gICAgICAgICAgICAgICAgbWF4OiAzMDAwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvb3Jkczoge1xyXG4gICAgICAgICAgICBtb3VzZU9mZnNldDoge1xyXG4gICAgICAgICAgICAgICAgeDogMCxcclxuICAgICAgICAgICAgICAgIHk6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYmFzZToge1xyXG4gICAgICAgICAgICAgICAgeDogY2FudmFzQ29uZmlnLmNlbnRlckgsXHJcbiAgICAgICAgICAgICAgICB5OiBjYW52YXNDb25maWcuY2VudGVyVixcclxuICAgICAgICAgICAgICAgIHo6IDIwMDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY3Vycjoge1xyXG4gICAgICAgICAgICAgICAgeDogY2FudmFzQ29uZmlnLmNlbnRlckgsXHJcbiAgICAgICAgICAgICAgICB5OiBjYW52YXNDb25maWcuY2VudGVyVixcclxuICAgICAgICAgICAgICAgIHo6IDIwMDBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBleWVzOiB7XHJcblxyXG4gICAgICAgIGNvbmZpZzoge1xyXG4gICAgICAgICAgICByOiBleWVCYXNlUmFkaXVzXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgbGVmdDoge1xyXG4gICAgICAgICAgICBjb29yZHM6IHtcclxuICAgICAgICAgICAgICAgIHg6IGxlZnRFeWVCYXNlWCxcclxuICAgICAgICAgICAgICAgIHk6IGxlZnRFeWVCYXNlWSxcclxuICAgICAgICAgICAgICAgIHo6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYW5nbGVzOiB7XHJcbiAgICAgICAgICAgICAgICB4eTogMCxcclxuICAgICAgICAgICAgICAgIHp5OiAwLFxyXG4gICAgICAgICAgICAgICAgeHo6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29tcHV0ZWQ6IHtcclxuICAgICAgICAgICAgICAgIHg6IDAsXHJcbiAgICAgICAgICAgICAgICB5OiAwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHJpZ2h0OiB7XHJcbiAgICAgICAgICAgIGNvb3Jkczoge1xyXG4gICAgICAgICAgICAgICAgeDogcmlnaHRFeWVCYXNlWCxcclxuICAgICAgICAgICAgICAgIHk6IGxlZnRFeWVCYXNlWSxcclxuICAgICAgICAgICAgICAgIHo6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYW5nbGVzOiB7XHJcbiAgICAgICAgICAgICAgICB4eTogMCxcclxuICAgICAgICAgICAgICAgIHp5OiAwLFxyXG4gICAgICAgICAgICAgICAgeHo6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29tcHV0ZWQ6IHtcclxuICAgICAgICAgICAgICAgIHg6IDAsXHJcbiAgICAgICAgICAgICAgICB5OiAwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXB1dGVUYXJnZXRBbmdsZXM6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvLyBiYXNlIGV5ZSBjb25maWdcclxuICAgICAgICB2YXIgZXllQ29uZmlnID0gdGhpcy5leWVzLmNvbmZpZztcclxuXHJcbiAgICAgICAgLy8gdGFyZ2V0XHJcbiAgICAgICAgdmFyIHRhcmdldENvb3JkcyA9IHRoaXMudGFyZ2V0LmNvb3Jkcy5jdXJyO1xyXG5cclxuICAgICAgICAvLyBsZWZ0RXllXHJcbiAgICAgICAgdmFyIGxlZnRFeWVDb29yZHMgPSB0aGlzLmV5ZXMubGVmdC5jb29yZHM7XHJcbiAgICAgICAgdmFyIGxlZnRFeWVBbmdsZXMgPSB0aGlzLmV5ZXMubGVmdC5hbmdsZXM7XHJcbiAgICAgICAgdmFyIHJpZ2h0RXllQ29vcmRzID0gdGhpcy5leWVzLnJpZ2h0LmNvb3JkcztcclxuICAgICAgICB2YXIgcmlnaHRFeWVBbmdsZXMgPSB0aGlzLmV5ZXMucmlnaHQuYW5nbGVzO1xyXG5cclxuICAgICAgICAvLyBnZXQgenkgYW5kIHh5IGFuZ2xlcyAoIGluIHJhZGlhbnMgKSBmcm9tIGV5ZSB0byB0YXJnZXQgXHJcbiAgICAgICAgdmFyIGxlZnRBbmdsZVpZID0gdHJpZy5hbmdsZSggbGVmdEV5ZUNvb3Jkcy56LCBsZWZ0RXllQ29vcmRzLnksIHRhcmdldENvb3Jkcy56LCB0YXJnZXRDb29yZHMueSApO1xyXG4gICAgICAgIHZhciBsZWZ0QW5nbGVYWiA9IHRyaWcuYW5nbGUoIGxlZnRFeWVDb29yZHMueCwgbGVmdEV5ZUNvb3Jkcy56LCB0YXJnZXRDb29yZHMueCwgdGFyZ2V0Q29vcmRzLnogKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ2xlZnRBbmdsZVpZL2xlZnRBbmdsZVhaOiAnLCB0cmlnLnJhZGlhbnNUb0RlZ3JlZXMoIGxlZnRBbmdsZVpZICkgKyAnLCAnK3RyaWcucmFkaWFuc1RvRGVncmVlcyggbGVmdEFuZ2xlWFogKSApO1xyXG5cclxuICAgICAgICAvLyBnZXQgZXllIHBvc2l0aW9uIFhZIGZyb20gY29tcHV0ZWQgYW5nbGVzXHJcbiAgICAgICAgdGhpcy5leWVzLmxlZnQuY29tcHV0ZWQueCA9IGV5ZUNvbmZpZy5yICogTWF0aC5jb3MoIGxlZnRBbmdsZVhaICk7XHJcbiAgICAgICAgdGhpcy5leWVzLmxlZnQuY29tcHV0ZWQueSA9IGV5ZUNvbmZpZy5yICogTWF0aC5zaW4oIGxlZnRBbmdsZVpZICk7XHJcblxyXG4gICAgICAgIC8vIGdldCB6eSBhbmQgeHkgYW5nbGVzICggaW4gcmFkaWFucyApIGZyb20gZXllIHRvIHRhcmdldCBcclxuICAgICAgICB2YXIgcmlnaHRBbmdsZVpZID0gdHJpZy5hbmdsZSggcmlnaHRFeWVDb29yZHMueiwgcmlnaHRFeWVDb29yZHMueSwgdGFyZ2V0Q29vcmRzLnosIHRhcmdldENvb3Jkcy55ICk7XHJcbiAgICAgICAgdmFyIHJpZ2h0QW5nbGVYWiA9IHRyaWcuYW5nbGUoIHJpZ2h0RXllQ29vcmRzLngsIHJpZ2h0RXllQ29vcmRzLnosIHRhcmdldENvb3Jkcy54LCB0YXJnZXRDb29yZHMueiApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAncmlnaHRBbmdsZVpZL3JpZ2h0QW5nbGVYWjogJywgdHJpZy5yYWRpYW5zVG9EZWdyZWVzKCByaWdodEFuZ2xlWlkgKSArICcsICcrdHJpZy5yYWRpYW5zVG9EZWdyZWVzKCByaWdodEFuZ2xlWFogKSApO1xyXG5cclxuICAgICAgICAvLyBnZXQgZXllIHBvc2l0aW9uIFhZIGZyb20gY29tcHV0ZWQgYW5nbGVzXHJcbiAgICAgICAgdGhpcy5leWVzLnJpZ2h0LmNvbXB1dGVkLnggPSBleWVDb25maWcuciAqIE1hdGguY29zKCByaWdodEFuZ2xlWFogKTtcclxuICAgICAgICB0aGlzLmV5ZXMucmlnaHQuY29tcHV0ZWQueSA9IGV5ZUNvbmZpZy5yICogTWF0aC5zaW4oIHJpZ2h0QW5nbGVaWSApO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRIdWRDb250cm9sc0NvbmZpZzogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcy50YXJnZXQuY29uZmlnO1xyXG4gICAgICAgIHZhciBzZWxmQ29vcmRzID0gdGhpcy50YXJnZXQuY29vcmRzO1xyXG5cclxuICAgICAgICAkKCAnIycrc2VsZi54LmN0cmxJZCApXHJcbiAgICAgICAgICAgIC5hdHRyKCB7XHJcbiAgICAgICAgICAgICAgICAnbWluJzogc2VsZi54Lm1pbixcclxuICAgICAgICAgICAgICAgICdtYXgnOiBzZWxmLngubWF4LFxyXG4gICAgICAgICAgICAgICAgJ3ZhbHVlJzogc2VsZkNvb3Jkcy5jdXJyLnhcclxuICAgICAgICAgICAgfSApXHJcbiAgICAgICAgICAgIC5wcm9wKCB7XHJcbiAgICAgICAgICAgICAgICAnbWluJzogc2VsZi54Lm1pbixcclxuICAgICAgICAgICAgICAgICdtYXgnOiBzZWxmLngubWF4LFxyXG4gICAgICAgICAgICAgICAgJ3ZhbHVlJzogc2VsZkNvb3Jkcy5jdXJyLnhcclxuICAgICAgICAgICAgfSApXHJcbiAgICAgICAgICAgIC5jbG9zZXN0KCAnLmNvbnRyb2wtLXBhbmVsX19pdGVtJyApXHJcbiAgICAgICAgICAgIC5maW5kKCAnb3V0cHV0JyApXHJcbiAgICAgICAgICAgIC5odG1sKCBzZWxmQ29vcmRzLmN1cnIueCAvIHNlbGYueC5tYXggKTtcclxuXHJcbiAgICAgICAgJCggJyMnK3NlbGYueS5jdHJsSWQgKVxyXG4gICAgICAgICAgICAuYXR0cigge1xyXG4gICAgICAgICAgICAgICAgJ21pbic6IHNlbGYueS5taW4sXHJcbiAgICAgICAgICAgICAgICAnbWF4Jzogc2VsZi55Lm1heCxcclxuICAgICAgICAgICAgICAgICd2YWx1ZSc6IHNlbGZDb29yZHMuY3Vyci55XHJcbiAgICAgICAgICAgIH0gKVxyXG4gICAgICAgICAgICAucHJvcCgge1xyXG4gICAgICAgICAgICAgICAgJ21pbic6IHNlbGYueS5taW4sXHJcbiAgICAgICAgICAgICAgICAnbWF4Jzogc2VsZi55Lm1heCxcclxuICAgICAgICAgICAgICAgICd2YWx1ZSc6IHNlbGZDb29yZHMuY3Vyci55XHJcbiAgICAgICAgICAgIH0gKVxyXG4gICAgICAgICAgICAuY2xvc2VzdCggJy5jb250cm9sLS1wYW5lbF9faXRlbScgKVxyXG4gICAgICAgICAgICAuZmluZCggJ291dHB1dCcgKVxyXG4gICAgICAgICAgICAuaHRtbCggc2VsZkNvb3Jkcy5jdXJyLnkgLyBzZWxmLnkubWF4ICk7XHJcblxyXG4gICAgICAgICQoICcjJytzZWxmLnouY3RybElkIClcclxuICAgICAgICAgICAgLmF0dHIoIHtcclxuICAgICAgICAgICAgICAgICdtaW4nOiBzZWxmLnoubWluLFxyXG4gICAgICAgICAgICAgICAgJ21heCc6IHNlbGYuei5tYXgsXHJcbiAgICAgICAgICAgICAgICAndmFsdWUnOiBzZWxmQ29vcmRzLmN1cnIuelxyXG4gICAgICAgICAgICB9IClcclxuICAgICAgICAgICAgLnByb3AoIHtcclxuICAgICAgICAgICAgICAgICdtaW4nOiBzZWxmLnoubWluLFxyXG4gICAgICAgICAgICAgICAgJ21heCc6IHNlbGYuei5tYXgsXHJcbiAgICAgICAgICAgICAgICAndmFsdWUnOiBzZWxmQ29vcmRzLmN1cnIuelxyXG4gICAgICAgICAgICB9IClcclxuICAgICAgICAgICAgLmNsb3Nlc3QoICcuY29udHJvbC0tcGFuZWxfX2l0ZW0nIClcclxuICAgICAgICAgICAgLmZpbmQoICdvdXRwdXQnIClcclxuICAgICAgICAgICAgLmh0bWwoIHNlbGZDb29yZHMuY3Vyci56IC8gc2VsZi56Lm1heCApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zZXRDdXJyZW50U2l6ZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRDdXJyZW50U2l6ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLnRhcmdldC5jb29yZHMuY3VycjtcclxuICAgICAgICB2YXIgc2VsZlJlbmRlckNmZyA9IHRoaXMudGFyZ2V0LnJlbmRlckNvbmZpZztcclxuICAgICAgICBzZWxmUmVuZGVyQ2ZnLnJhZGl1cyA9IHNlbGZSZW5kZXJDZmcuYmFzZVJhZGl1cyArICggc2VsZi56IC8gNTAgKTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVuZGVyVGFyZ2V0OiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLnRhcmdldC5jb29yZHMuY3VycjtcclxuICAgICAgICB2YXIgc2VsZlJlbmRlckNmZyA9IHRoaXMudGFyZ2V0LnJlbmRlckNvbmZpZztcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmVkJztcclxuXHJcbiAgICAgICAgaWYgKCAhc2VsZlJlbmRlckNmZy5pc0hpZ2hsaWdodGVkICkge1xyXG4gICAgICAgICAgICBjdHgubGluZVdpZHRoID0gMjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjdHgubGluZVdpZHRoID0gNDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgY3R4LnNldExpbmVEYXNoKFtdKTtcclxuXHJcbiAgICAgICAgY3R4LmxpbmUoIHNlbGYueCAtIHNlbGZSZW5kZXJDZmcucmFkaXVzLCBzZWxmLnksIHNlbGYueCArIHNlbGZSZW5kZXJDZmcucmFkaXVzLCBzZWxmLnkgKTtcclxuICAgICAgICBjdHgubGluZSggc2VsZi54LCBzZWxmLnkgLSBzZWxmUmVuZGVyQ2ZnLnJhZGl1cywgc2VsZi54LCBzZWxmLnkgKyBzZWxmUmVuZGVyQ2ZnLnJhZGl1cyApO1xyXG4gICAgICAgIGN0eC5zdHJva2VDaXJjbGUoIHNlbGYueCwgc2VsZi55LCBzZWxmUmVuZGVyQ2ZnLnJhZGl1cyApO1xyXG4gICAgfSxcclxuXHJcbiAgICBjaGVja01vdXNlSGl0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc2VsZlJlbmRlckNmZyA9IHRoaXMudGFyZ2V0LnJlbmRlckNvbmZpZztcclxuICAgICAgICB2YXIgdGhpc0Nvb3JkcyA9IHRoaXMudGFyZ2V0LmNvb3Jkcy5jdXJyO1xyXG4gICAgICAgIHZhciBtb3VzZU9mZnNldCA9IHRoaXMudGFyZ2V0LmNvb3Jkcy5tb3VzZU9mZnNldDtcclxuXHJcbiAgICAgICAgdmFyIG1vdXNlVGFyZ2V0RGlzdCA9IHRyaWcuZGlzdCggbW91c2VYLCBtb3VzZVksIHRoaXNDb29yZHMueCwgdGhpc0Nvb3Jkcy55ICk7XHJcblxyXG4gICAgICAgIGlmICggbW91c2VUYXJnZXREaXN0IDwgc2VsZlJlbmRlckNmZy5yYWRpdXMgKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoICFzZWxmUmVuZGVyQ2ZnLmlzSGl0ICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRNb3VzZU9mZnNldCgpO1xyXG4gICAgICAgICAgICAgICAgc2VsZlJlbmRlckNmZy5pc0hpdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBzZWxmUmVuZGVyQ2ZnLmlzSGlnaGxpZ2h0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LnJlbmRlckNvbmZpZy5pc0hpZ2hsaWdodGVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc2V0TW91c2VPZmZzZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0aGlzQ29vcmRzID0gdGhpcy50YXJnZXQuY29vcmRzLmN1cnI7XHJcbiAgICAgICAgdmFyIG1vdXNlT2Zmc2V0ID0gdGhpcy50YXJnZXQuY29vcmRzLm1vdXNlT2Zmc2V0O1xyXG4gICAgICAgIG1vdXNlT2Zmc2V0LnggPSBtb3VzZVggLSB0aGlzQ29vcmRzLng7XHJcbiAgICAgICAgbW91c2VPZmZzZXQueSA9IG1vdXNlWSAtIHRoaXNDb29yZHMueTtcclxuICAgIH0sXHJcblxyXG4gICAgbW91c2VNb3ZlVGFyZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc2VsZlJlbmRlckNmZyA9IHRoaXMudGFyZ2V0LnJlbmRlckNvbmZpZztcclxuICAgICAgICB2YXIgdGhpc0Nvb3JkcyA9IHRoaXMudGFyZ2V0LmNvb3Jkcy5jdXJyO1xyXG4gICAgICAgIHZhciBtb3VzZU9mZnNldCA9IHRoaXMudGFyZ2V0LmNvb3Jkcy5tb3VzZU9mZnNldDtcclxuICAgICAgICBpZiAoIHNlbGZSZW5kZXJDZmcuaXNIaWdobGlnaHRlZCApIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXNDb29yZHMueCA9IG1vdXNlWCAtIG1vdXNlT2Zmc2V0Lng7XHJcbiAgICAgICAgICAgIHRoaXNDb29yZHMueSA9IG1vdXNlWSAtIG1vdXNlT2Zmc2V0Lnk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY2xlYXJBY3RpdmVUYXJnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBzZWxmUmVuZGVyQ2ZnID0gdGhpcy50YXJnZXQucmVuZGVyQ29uZmlnO1xyXG4gICAgICAgIHNlbGZSZW5kZXJDZmcuaXNIaXQgPSBmYWxzZTtcclxuICAgICAgICBzZWxmUmVuZGVyQ2ZnLmlzSGlnaGxpZ2h0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uTW91c2VVcCgpIHtcclxuICAgIGFpbUNvbnN0cmFpbnQuY2xlYXJBY3RpdmVUYXJnZXQoKTtcclxufVxyXG5cclxuLy8gc2V0IHVwIGxvb2sgY29uc3RyYWludCBmb3IgZXllIG1vdmUgc3lzdGVtXHJcbmFpbUNvbnN0cmFpbnQuc2V0SHVkQ29udHJvbHNDb25maWcoKTtcclxuYWltQ29uc3RyYWludC5jb21wdXRlVGFyZ2V0QW5nbGVzKCk7XHJcblxyXG5cclxuLy8gY3JlYXRlIGZhY2UgY29vcmRpbmF0ZSBtZWFzdXJlc1xyXG52YXIgYmFzZUZhY2VDb29yZHMgPSB7XHJcblxyXG4gICAgZXllczoge1xyXG4gICAgICAgIHB1cGlsczoge1xyXG4gICAgICAgICAgICBsZWZ0OiB7XHJcbiAgICAgICAgICAgICAgICB4OiBsZWZ0RXllQmFzZVgsXHJcbiAgICAgICAgICAgICAgICB5OiBsZWZ0RXllQmFzZVksXHJcbiAgICAgICAgICAgICAgICByOiBwbS5yMTZcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmlnaHQ6IHtcclxuICAgICAgICAgICAgICAgIHg6IHJpZ2h0RXllQmFzZVgsXHJcbiAgICAgICAgICAgICAgICB5OiByaWdodEV5ZUJhc2VZLFxyXG4gICAgICAgICAgICAgICAgcjogcG0ucjE2XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGxlZnQ6IHtcclxuICAgICAgICAgICAgbFBvaW50WDogbGVmdEV5ZUJhc2VYIC0gZXllQmFzZVJhZGl1cywgXHJcbiAgICAgICAgICAgIGxQb2ludFk6IGxlZnRFeWVCYXNlWSxcclxuICAgICAgICAgICAgdEhhbmRsZVg6IGxlZnRFeWVCYXNlWCxcclxuICAgICAgICAgICAgdEhhbmRsZVk6IGxlZnRFeWVCYXNlWSAtIHBtLnI1LFxyXG4gICAgICAgICAgICByUG9pbnRYOiBsZWZ0RXllQmFzZVggKyBleWVCYXNlUmFkaXVzLCBcclxuICAgICAgICAgICAgclBvaW50WTogbGVmdEV5ZUJhc2VZLFxyXG4gICAgICAgICAgICBiSGFuZGxlWDogbGVmdEV5ZUJhc2VYLFxyXG4gICAgICAgICAgICBiSGFuZGxlWTogbGVmdEV5ZUJhc2VZICsgcG0ucjZcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJpZ2h0OiB7XHJcbiAgICAgICAgICAgIGxQb2ludFg6IHJpZ2h0RXllQmFzZVggLSBleWVCYXNlUmFkaXVzLCBcclxuICAgICAgICAgICAgbFBvaW50WTogcmlnaHRFeWVCYXNlWSxcclxuICAgICAgICAgICAgdEhhbmRsZVg6IHJpZ2h0RXllQmFzZVgsXHJcbiAgICAgICAgICAgIHRIYW5kbGVZOiByaWdodEV5ZUJhc2VZIC0gcG0ucjUsXHJcbiAgICAgICAgICAgIHJQb2ludFg6IHJpZ2h0RXllQmFzZVggKyBleWVCYXNlUmFkaXVzLCBcclxuICAgICAgICAgICAgclBvaW50WTogcmlnaHRFeWVCYXNlWSxcclxuICAgICAgICAgICAgYkhhbmRsZVg6IHJpZ2h0RXllQmFzZVgsXHJcbiAgICAgICAgICAgIGJIYW5kbGVZOiByaWdodEV5ZUJhc2VZICsgcG0ucjZcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGV5ZWJyb3dzOiB7XHJcbiAgICAgICAgbGVmdDoge1xyXG4gICAgICAgICAgICBsUG9pbnRYOiBsZWZ0RXllQmFzZVggLSAoZXllQmFzZVJhZGl1cyAqIDEuNSksIFxyXG4gICAgICAgICAgICBsUG9pbnRZOiBleWVicm93QmFzZVksXHJcbiAgICAgICAgICAgIGhhbmRsZTFYOiBsZWZ0RXllQmFzZVggLSBwbS5yOCxcclxuICAgICAgICAgICAgaGFuZGxlMVk6IGV5ZWJyb3dCYXNlWSAtIHBtLnI0LFxyXG4gICAgICAgICAgICBoYW5kbGUyWDogbGVmdEV5ZUJhc2VYICsgcG0ucjgsXHJcbiAgICAgICAgICAgIGhhbmRsZTJZOiBleWVicm93QmFzZVkgLSBwbS5yNCxcclxuICAgICAgICAgICAgclBvaW50WDogbGVmdEV5ZUJhc2VYICsgKGV5ZUJhc2VSYWRpdXMgKiAxLjUpLCBcclxuICAgICAgICAgICAgclBvaW50WTogZXllYnJvd0Jhc2VZXHJcbiAgICAgICAgfSxcclxuICAgICAgICByaWdodDoge1xyXG4gICAgICAgICAgICBsUG9pbnRYOiByaWdodEV5ZUJhc2VYIC0gKGV5ZUJhc2VSYWRpdXMgKiAxLjUpLCBcclxuICAgICAgICAgICAgbFBvaW50WTogZXllYnJvd0Jhc2VZLFxyXG4gICAgICAgICAgICBoYW5kbGUxWDogcmlnaHRFeWVCYXNlWCAtIHBtLnI4LFxyXG4gICAgICAgICAgICBoYW5kbGUxWTogZXllYnJvd0Jhc2VZIC0gcG0ucjQsXHJcbiAgICAgICAgICAgIGhhbmRsZTJYOiByaWdodEV5ZUJhc2VYICsgcG0ucjgsXHJcbiAgICAgICAgICAgIGhhbmRsZTJZOiBleWVicm93QmFzZVkgLSBwbS5yNCxcclxuICAgICAgICAgICAgclBvaW50WDogcmlnaHRFeWVCYXNlWCArIChleWVCYXNlUmFkaXVzICogMS41KSwgXHJcbiAgICAgICAgICAgIHJQb2ludFk6IGV5ZWJyb3dCYXNlWVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIG5vc2U6IHtcclxuICAgICAgICBwb2ludDFYOiBsZWZ0RXllQmFzZVggKyAoZXllQmFzZVJhZGl1cyAqIDEuNSksXHJcbiAgICAgICAgcG9pbnQxWTogZXllYnJvd0Jhc2VZLFxyXG4gICAgICAgIGhhbmRsZTFYOiBsZWZ0RXllQmFzZVggKyAoZXllQmFzZVJhZGl1cyAqIDEuNSkgLSBwbS5yMjQsXHJcbiAgICAgICAgaGFuZGxlMVk6IHN1bmZhY2UueSAtIHBtLnIxMCxcclxuICAgICAgICBwb2ludDJYOiBzdW5mYWNlLnggLSBwbS5yOCxcclxuICAgICAgICBwb2ludDJZOiBzdW5mYWNlLnkgKyBwbS5yNixcclxuICAgICAgICBoYW5kbGUyWDogc3VuZmFjZS54LFxyXG4gICAgICAgIGhhbmRsZTJZOiBzdW5mYWNlLnkgKyBwbS5yNSxcclxuICAgICAgICBwb2ludDNYOiBzdW5mYWNlLnggKyBwbS5yOCxcclxuICAgICAgICBwb2ludDNZOiBzdW5mYWNlLnkgKyBwbS5yNlxyXG4gICAgfSxcclxuXHJcbiAgICBtb3V0aDoge1xyXG5cclxuICAgICAgICAvLyB0b3AgbGlwIGlubmVyIGN1cnZlXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGVmdF9vdXRlcl9hbmNob3JfWDogbW91dGhCYXNlWCAtIG1vdXRoQmFzZVJhZGl1cywgXHJcbiAgICAgICAgbGVmdF9vdXRlcl9hbmNob3JfWTogbW91dGhCYXNlWSxcclxuICAgICAgICBsZWZ0X2lubmVyX2FuY2hvcl9YOiBtb3V0aEJhc2VYIC0gbW91dGhCYXNlUmFkaXVzICsgcG0ucjgsIFxyXG4gICAgICAgIGxlZnRfaW5uZXJfYW5jaG9yX1k6IG1vdXRoQmFzZVksXHJcblxyXG4gICAgICAgIC8vIGZyb20gbGVmdCBpbm5lclxyXG4gICAgICAgIHRvcF9sZWZ0X2lubmVyX2NwMV9YOiBtb3V0aEJhc2VYIC0gcG0ucjggLSBwbS5yMzIsXHJcbiAgICAgICAgdG9wX2xlZnRfaW5uZXJfY3AxX1k6IG1vdXRoQmFzZVksXHJcbiAgICAgICAgdG9wX2xlZnRfaW5uZXJfY3AyX1g6IG1vdXRoQmFzZVggLSBwbS5yMTYgLSBwbS5yMzIsXHJcbiAgICAgICAgdG9wX2xlZnRfaW5uZXJfY3AyX1k6IG1vdXRoQmFzZVkgLSBwbS5yMzIsXHJcblxyXG4gICAgICAgIC8vIG1pZGRsZSBpbm5lclxyXG4gICAgICAgIHRvcF9pbm5lcl9hbmNob3JfWDogbW91dGhCYXNlWCxcclxuICAgICAgICB0b3BfaW5uZXJfYW5jaG9yX1k6IG1vdXRoQmFzZVksXHJcblxyXG4gICAgICAgIC8vIHRvIHJpZ2h0IGlubmVyXHJcbiAgICAgICAgdG9wX3JpZ2h0X2lubmVyX2NwMV9YOiBtb3V0aEJhc2VYICsgcG0ucjggKyBwbS5yMzIsXHJcbiAgICAgICAgdG9wX3JpZ2h0X2lubmVyX2NwMV9ZOiBtb3V0aEJhc2VZLFxyXG4gICAgICAgIHRvcF9yaWdodF9pbm5lcl9jcDJfWDogbW91dGhCYXNlWCArIHBtLnIxNiArIHBtLnIzMixcclxuICAgICAgICB0b3BfcmlnaHRfaW5uZXJfY3AyX1k6IG1vdXRoQmFzZVkgLSBwbS5yMzIsXHJcblxyXG4gICAgICAgIHJpZ2h0X2lubmVyX2FuY2hvcl9YOiBtb3V0aEJhc2VYICsgbW91dGhCYXNlUmFkaXVzIC0gcG0ucjgsIFxyXG4gICAgICAgIHJpZ2h0X2lubmVyX2FuY2hvcl9ZOiBtb3V0aEJhc2VZLFxyXG4gICAgICAgIHJpZ2h0X291dGVyX2FuY2hvcl9YOiBtb3V0aEJhc2VYICsgbW91dGhCYXNlUmFkaXVzLCBcclxuICAgICAgICByaWdodF9vdXRlcl9hbmNob3JfWTogbW91dGhCYXNlWSxcclxuXHJcbiAgICAgICAgLy8gdG9wIGxpcCBvdXRlciBjdXJ2ZVxyXG5cclxuICAgICAgICAvLyBmcm9tIHJpZ2h0XHJcbiAgICAgICAgdG9wX3JpZ2h0X291dGVyX2NwMV9YOiBtb3V0aEJhc2VYICsgcG0ucjggKyBwbS5yMTYgLSBwbS5yMTYsXHJcbiAgICAgICAgdG9wX3JpZ2h0X291dGVyX2NwMV9ZOiBtb3V0aEJhc2VZICsgcG0ucjMyIC0gcG0ucjMyLFxyXG4gICAgICAgIHRvcF9yaWdodF9vdXRlcl9jcDJfWDogbW91dGhCYXNlWCArIHBtLnI4IC0gcG0ucjE2LFxyXG4gICAgICAgIHRvcF9yaWdodF9vdXRlcl9jcDJfWTogbW91dGhCYXNlWSAtIHBtLnIxNiAtIHBtLnIxNixcclxuXHJcbiAgICAgICAgLy8gdG9wIG1pZGRsZSBvdXRlclxyXG4gICAgICAgIHRvcF9vdXRlcl9hbmNob3JfWDogbW91dGhCYXNlWCxcclxuICAgICAgICB0b3Bfb3V0ZXJfYW5jaG9yX1k6IG1vdXRoQmFzZVkgLSBwbS5yMzIsXHJcblxyXG4gICAgICAgIC8vIHRvIGxlZnRcclxuICAgICAgICB0b3BfbGVmdF9vdXRlcl9jcDFfWDogbW91dGhCYXNlWCAtIHBtLnI4IC0gcG0ucjE2ICsgcG0ucjE2LFxyXG4gICAgICAgIHRvcF9sZWZ0X291dGVyX2NwMV9ZOiBtb3V0aEJhc2VZICsgcG0ucjMyIC0gcG0ucjMyLFxyXG4gICAgICAgIHRvcF9sZWZ0X291dGVyX2NwMl9YOiBtb3V0aEJhc2VYIC0gcG0ucjggKyBwbS5yMTYsXHJcbiAgICAgICAgdG9wX2xlZnRfb3V0ZXJfY3AyX1k6IG1vdXRoQmFzZVkgLSBwbS5yMTYgLSBwbS5yMTYsXHJcblxyXG4gICAgLy8gYm90dG9tIGxpcCBpbm5lciBjdXJ2ZVxyXG5cclxuICAgICAgICAvLyBmcm9tIGxlZnQgaW5uZXIgY3VydmVcclxuICAgICAgICBib3R0b21fbGVmdF9pbm5lcl9jcDFfWDogbW91dGhCYXNlWCAtIHBtLnI4IC0gcG0ucjMyLFxyXG4gICAgICAgIGJvdHRvbV9sZWZ0X2lubmVyX2NwMV9ZOiBtb3V0aEJhc2VZLFxyXG4gICAgICAgIGJvdHRvbV9sZWZ0X2lubmVyX2NwMl9YOiBtb3V0aEJhc2VYIC0gcG0ucjE2IC0gcG0ucjMyLFxyXG4gICAgICAgIGJvdHRvbV9sZWZ0X2lubmVyX2NwMl9ZOiBtb3V0aEJhc2VZIC0gcG0ucjMyLFxyXG5cclxuICAgICAgICAvLyBib3R0b20gbWlkZGxlIGlubmVyXHJcbiAgICAgICAgYm90dG9tX2lubmVyX2FuY2hvcl9YOiBtb3V0aEJhc2VYLFxyXG4gICAgICAgIGJvdHRvbV9pbm5lcl9hbmNob3JfWTogbW91dGhCYXNlWSxcclxuICAgICAgICBcclxuICAgICAgICAvLyB0byByaWdodCBpbm5lciBjdXJ2ZVxyXG4gICAgICAgIGJvdHRvbV9yaWdodF9pbm5lcl9jcDFfWDogbW91dGhCYXNlWCArIHBtLnI4ICsgcG0ucjMyLFxyXG4gICAgICAgIGJvdHRvbV9yaWdodF9pbm5lcl9jcDFfWTogbW91dGhCYXNlWSxcclxuICAgICAgICBib3R0b21fcmlnaHRfaW5uZXJfY3AyX1g6IG1vdXRoQmFzZVggKyBwbS5yMTYgKyBwbS5yMzIsXHJcbiAgICAgICAgYm90dG9tX3JpZ2h0X2lubmVyX2NwMl9ZOiBtb3V0aEJhc2VZIC0gcG0ucjMyLFxyXG5cclxuICAgICAgICAvLyBmcm9tIHJpZ2h0IG91dGVyIGN1cnZlXHJcbiAgICAgICAgYm90dG9tX3JpZ2h0X291dGVyX2NwMV9YOiBtb3V0aEJhc2VYICsgcG0ucjggKyBwbS5yMzIsXHJcbiAgICAgICAgYm90dG9tX3JpZ2h0X291dGVyX2NwMV9ZOiBtb3V0aEJhc2VZICsgcG0ucjgsXHJcbiAgICAgICAgYm90dG9tX3JpZ2h0X291dGVyX2NwMl9YOiBtb3V0aEJhc2VYICsgcG0ucjgsXHJcbiAgICAgICAgYm90dG9tX3JpZ2h0X291dGVyX2NwMl9ZOiBtb3V0aEJhc2VZICsgKCBwbS5yOCAtIHBtLnIzMiApLFxyXG5cclxuICAgICAgICAvLyBib3R0b20gbWlkZGxlIG91dGVyXHJcbiAgICAgICAgYm90dG9tX291dGVyX2FuY2hvcl9YOiBtb3V0aEJhc2VYLFxyXG4gICAgICAgIGJvdHRvbV9vdXRlcl9hbmNob3JfWTogbW91dGhCYXNlWSArIHBtLnI4LFxyXG5cclxuICAgICAgICBib3R0b21fbGVmdF9vdXRlcl9jcDFfWDogbW91dGhCYXNlWCAtIHBtLnI4IC0gcG0ucjMyLFxyXG4gICAgICAgIGJvdHRvbV9sZWZ0X291dGVyX2NwMV9ZOiBtb3V0aEJhc2VZICsgcG0ucjgsXHJcbiAgICAgICAgYm90dG9tX2xlZnRfb3V0ZXJfY3AyX1g6IG1vdXRoQmFzZVggLSBwbS5yOCxcclxuICAgICAgICBib3R0b21fbGVmdF9vdXRlcl9jcDJfWTogbW91dGhCYXNlWSArICggcG0ucjggLSBwbS5yMzIgKVxyXG4gICAgfSxcclxuXHJcbiAgICB0ZWV0aDoge1xyXG4gICAgICAgIHRvcDoge1xyXG4gICAgICAgICAgICBsUG9pbnQxWDogbW91dGhCYXNlWCAtIHBtLnI0IC0gcG0ucjY0LFxyXG4gICAgICAgICAgICBsUG9pbnQxWTogdGVldGhCYXNlQ2VudHJlWSAtIHBtLnI4IC0gcG0ucjE2LFxyXG4gICAgICAgICAgICBsUG9pbnQyWDogbW91dGhCYXNlWCAtIHBtLnI0LFxyXG4gICAgICAgICAgICBsUG9pbnQyWTogdGVldGhCYXNlQ2VudHJlWSxcclxuICAgICAgICAgICAgaGFuZGxlWDogbW91dGhCYXNlWCxcclxuICAgICAgICAgICAgaGFuZGxlWTogdGVldGhCYXNlQ2VudHJlWSArIHBtLnIzMixcclxuICAgICAgICAgICAgclBvaW50MVg6IG1vdXRoQmFzZVggKyBwbS5yNCxcclxuICAgICAgICAgICAgclBvaW50MVk6IHRlZXRoQmFzZUNlbnRyZVksXHJcbiAgICAgICAgICAgIHJQb2ludDJYOiBtb3V0aEJhc2VYICsgcG0ucjQgKyBwbS5yNjQsXHJcbiAgICAgICAgICAgIHJQb2ludDJZOiB0ZWV0aEJhc2VDZW50cmVZIC0gcG0ucjggLSBwbS5yMTZcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvdHRvbToge1xyXG4gICAgICAgICAgICBsUG9pbnQxWDogbW91dGhCYXNlWCAtIHBtLnI0IC0gcG0ucjY0LFxyXG4gICAgICAgICAgICBsUG9pbnQxWTogdGVldGhCYXNlQ2VudHJlWSArIHBtLnI4ICsgcG0ucjE2LFxyXG4gICAgICAgICAgICBsUG9pbnQyWDogbW91dGhCYXNlWCAtIHBtLnI0IC0gcG0ucjY0LFxyXG4gICAgICAgICAgICBsUG9pbnQyWTogdGVldGhCYXNlQ2VudHJlWSxcclxuICAgICAgICAgICAgaGFuZGxlWDogbW91dGhCYXNlWCxcclxuICAgICAgICAgICAgaGFuZGxlWTogdGVldGhCYXNlQ2VudHJlWSArIHBtLnIzMixcclxuICAgICAgICAgICAgclBvaW50MVg6IG1vdXRoQmFzZVggKyBwbS5yNCArIHBtLnI2NCxcclxuICAgICAgICAgICAgclBvaW50MVk6IHRlZXRoQmFzZUNlbnRyZVksXHJcbiAgICAgICAgICAgIHJQb2ludDJYOiBtb3V0aEJhc2VYICsgcG0ucjQgKyBwbS5yNjQsXHJcbiAgICAgICAgICAgIHJQb2ludDJZOiB0ZWV0aEJhc2VDZW50cmVZICsgcG0ucjggKyBwbS5yMTZcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGxpcDoge1xyXG4gICAgICAgIHBvaW50MVg6IG1vdXRoQmFzZVggLSBwbS5yOCxcclxuICAgICAgICBwb2ludDFZOiBtb3V0aEJhc2VZICsgcG0ucjgsXHJcbiAgICAgICAgaGFuZGxlMVg6IG1vdXRoQmFzZVgsXHJcbiAgICAgICAgaGFuZGxlMVk6IG1vdXRoQmFzZVkgKyBwbS5yOCArIHBtLnI2NCxcclxuICAgICAgICBwb2ludDJYOiBtb3V0aEJhc2VYICsgcG0ucjgsXHJcbiAgICAgICAgcG9pbnQyWTogbW91dGhCYXNlWSArIHBtLnI4XHJcbiAgICB9LFxyXG5cclxuICAgIGNoaW46IHtcclxuICAgICAgICBwb2ludDFYOiBtb3V0aEJhc2VYIC0gbW91dGhCYXNlUmFkaXVzICsgcG0ucjgsXHJcbiAgICAgICAgcG9pbnQxWTogbW91dGhCYXNlWSArICggcG0ucjIgLSBwbS5yMTYgKSxcclxuICAgICAgICBoYW5kbGUxWDogbW91dGhCYXNlWCxcclxuICAgICAgICBoYW5kbGUxWTogbW91dGhCYXNlWSArIHBtLnIyICsgcG0ucjMyLFxyXG4gICAgICAgIHBvaW50Mlg6IG1vdXRoQmFzZVggKyBtb3V0aEJhc2VSYWRpdXMgLSBwbS5yOCxcclxuICAgICAgICBwb2ludDJZOiBtb3V0aEJhc2VZICsgKCBwbS5yMiAtIHBtLnIxNiApXHJcbiAgICB9LFxyXG5cclxuICAgIGlubmVyQ2hlZWtzOiB7XHJcbiAgICAgICAgbGVmdDoge1xyXG4gICAgICAgICAgICB0UG9pbnRYOiBtb3V0aEJhc2VYIC0gbW91dGhCYXNlUmFkaXVzLFxyXG4gICAgICAgICAgICB0UG9pbnRZOiBtb3V0aEJhc2VZIC0gcG0ucjQsXHJcbiAgICAgICAgICAgIGhhbmRsZVg6IG1vdXRoQmFzZVggLSBtb3V0aEJhc2VSYWRpdXMgLSBwbS5yOCAtIHBtLnIxNixcclxuICAgICAgICAgICAgaGFuZGxlWTogbW91dGhCYXNlWSxcclxuICAgICAgICAgICAgYlBvaW50WDogbW91dGhCYXNlWCAtIG1vdXRoQmFzZVJhZGl1cyxcclxuICAgICAgICAgICAgYlBvaW50WTogbW91dGhCYXNlWSArIHBtLnI0XHJcbiAgICAgICAgfSxcclxuICAgICAgICByaWdodDoge1xyXG4gICAgICAgICAgICB0UG9pbnRYOiBtb3V0aEJhc2VYICsgbW91dGhCYXNlUmFkaXVzLFxyXG4gICAgICAgICAgICB0UG9pbnRZOiBtb3V0aEJhc2VZIC0gcG0ucjQsXHJcbiAgICAgICAgICAgIGhhbmRsZVg6IG1vdXRoQmFzZVggKyBtb3V0aEJhc2VSYWRpdXMgKyBwbS5yOCArIHBtLnIxNixcclxuICAgICAgICAgICAgaGFuZGxlWTogbW91dGhCYXNlWSxcclxuICAgICAgICAgICAgYlBvaW50WDogbW91dGhCYXNlWCArIG1vdXRoQmFzZVJhZGl1cyxcclxuICAgICAgICAgICAgYlBvaW50WTogbW91dGhCYXNlWSArIHBtLnI0XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcblxyXG4gICAgb3V0ZXJDaGVla3M6IHtcclxuICAgICAgICBsZWZ0OiB7XHJcbiAgICAgICAgICAgIHRQb2ludFg6IHN1bmZhY2UueCAtIHBtLnIyIC0gcG0ucjQgLSBwbS5yOCxcclxuICAgICAgICAgICAgdFBvaW50WTogc3VuZmFjZS55ICsgcG0ucjgsXHJcbiAgICAgICAgICAgIGhhbmRsZVg6IHN1bmZhY2UueCAtICggcG0ucjIgKyBwbS5yOCApLFxyXG4gICAgICAgICAgICBoYW5kbGVZOiBzdW5mYWNlLnkgKyBwbS5yOCxcclxuICAgICAgICAgICAgYlBvaW50WDogc3VuZmFjZS54IC0gcG0ucjIgLSBwbS5yMTYsXHJcbiAgICAgICAgICAgIGJQb2ludFk6IHN1bmZhY2UueSArIHBtLnIyXHJcbiAgICAgICAgfSxcclxuICAgICAgICByaWdodDoge1xyXG4gICAgICAgICAgICB0UG9pbnRYOiBzdW5mYWNlLnggKyBwbS5yMiArIHBtLnI0ICsgcG0ucjgsXHJcbiAgICAgICAgICAgIHRQb2ludFk6IHN1bmZhY2UueSArIHBtLnI4LFxyXG4gICAgICAgICAgICBoYW5kbGVYOiBzdW5mYWNlLnggKyAoIHBtLnIyICsgcG0ucjggKSxcclxuICAgICAgICAgICAgaGFuZGxlWTogc3VuZmFjZS55ICsgcG0ucjgsXHJcbiAgICAgICAgICAgIGJQb2ludFg6IHN1bmZhY2UueCArIHBtLnIyICsgcG0ucjE2LFxyXG4gICAgICAgICAgICBiUG9pbnRZOiBzdW5mYWNlLnkgKyBwbS5yMlxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgZ3JhZGllbnRzOiB7XHJcbiAgICAgICAgdG9wTGlwOiB7XHJcbiAgICAgICAgICAgIHRvcF9ZOiAwLFxyXG4gICAgICAgICAgICBib3R0b21fWTogMCxcclxuICAgICAgICAgICAgdG9wX29wYWNpdHk6IDAsXHJcbiAgICAgICAgICAgIGJvdHRvbV9vcGFjaXR5OiAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBib3R0b21MaXA6IHtcclxuICAgICAgICAgICAgdG9wX1k6IDAsXHJcbiAgICAgICAgICAgIGJvdHRvbV9ZOiAwLFxyXG4gICAgICAgICAgICB0b3Bfb3BhY2l0eTogMCxcclxuICAgICAgICAgICAgYm90dG9tX29wYWNpdHk6IDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRlZXRoU2hhZG93OiB7XHJcbiAgICAgICAgICAgIHI6IDIyMSwgZzogMjIxLCBiOiAyNTUsXHJcbiAgICAgICAgICAgIGN1cnI6IHtcclxuICAgICAgICAgICAgICAgIHI6IDAsIGc6IDAsIGI6IDBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHNldEJvdHRvbVRlZXRoQ29vcmRzKCkge1xyXG5cclxuICAgIHZhciB0ZWV0aCA9IGJhc2VGYWNlQ29vcmRzLnRlZXRoLmJvdHRvbTtcclxuICAgIHZhciB0b290aEJhc2VsaW5lWSA9IHRlZXRoLmxQb2ludDJZICsgcG0ucjY0O1xyXG4gICAgdmFyIHRlZXRoV2lkdGggPSB0ZWV0aC5yUG9pbnQyWCAtIHRlZXRoLmxQb2ludDJYO1xyXG5cclxuICAgIHZhciBpbmNpc29yV2lkdGggPSAoIHRlZXRoV2lkdGggKiAwLjYgKSAvIDQ7XHJcbiAgICB2YXIgaW5jaXNvckNvbnRyb2wgPSBpbmNpc29yV2lkdGggLyAyO1xyXG4gICAgdmFyIGNhbmluZVdpZHRoID0gKCB0ZWV0aFdpZHRoICogMC4yICkgLyAyO1xyXG4gICAgdmFyIGNhbmluZUNvbnRyb2wgPSBjYW5pbmVXaWR0aCAvIDIuNTtcclxuICAgIHZhciBwcmVNb2xhcldpZHRoID0gKCB0ZWV0aFdpZHRoICogMC4yICkgLyAyO1xyXG4gICAgdmFyIHByZU1vbGFyQ29udHJvbCA9IHByZU1vbGFyV2lkdGg7XHJcblxyXG4gICAgdGVldGguY29uZmlnID0ge1xyXG4gICAgICAgIGluY2lzb3JXaWR0aDogKCB0ZWV0aFdpZHRoICogMC42ICkgLyA0LFxyXG4gICAgICAgIGluY2lzb3JDb250cm9sOiBpbmNpc29yV2lkdGggLyAyLFxyXG4gICAgICAgIGNhbmluZVdpZHRoOiAoIHRlZXRoV2lkdGggKiAwLjIgKSAvIDIsXHJcbiAgICAgICAgY2FuaW5lQ29udHJvbDogY2FuaW5lV2lkdGggLyAyLjUsXHJcbiAgICAgICAgcHJlTW9sYXJXaWR0aDogKCB0ZWV0aFdpZHRoICogMC4yICkgLyAyLFxyXG4gICAgICAgIHByZU1vbGFyQ29udHJvbDogcHJlTW9sYXJXaWR0aFxyXG4gICAgfVxyXG59XHJcblxyXG5zZXRCb3R0b21UZWV0aENvb3JkcygpO1xyXG5cclxuLy8gY2xvbmUgYmFzZSBmYWNlIGNvb3JkaW5hdGUgc3RvcmUgZm9yIHVzZSBpbiBhbmltYXRpb25zXHJcbnZhciBmYWNlQ29vcmRzID0gSlNPTi5wYXJzZSggSlNPTi5zdHJpbmdpZnkoIGJhc2VGYWNlQ29vcmRzICkgKTtcclxuXHJcblxyXG4vLyBzZXQgdXAgbW9kaWZpZXIgc3lzdGVtIGFuZCBjb25uZWN0IHRvIHByb3BvcnRpb25hbCBtZWFzdXJlbWVudHNcclxudmFyIG11c2NsZU1vZGlmaWVycyA9IG11c2NsZU1vZGlmaWVyLmNyZWF0ZU1vZGlmaWVycyggcG0gKTtcclxubXVzY2xlTW9kaWZpZXIuc2V0UmFuZ2VJbnB1dHMoIG11c2NsZU1vZGlmaWVycyApO1xyXG5cclxuXHJcbi8vIGluaXQgZXllIGJsaW5rIHRyYWNrXHJcbnRyYWNrUGxheWVyLmxvYWRUcmFjayggNSwgJ2JsaW5rJywgc2VxLCBtdXNjbGVNb2RpZmllcnMgKTtcclxuXHJcblxyXG4vLyBleHByZXNzaW9uIGV2ZW50c1xyXG5cclxuICAgICQoICcuZXhwcmVzc2lvbi1zbWlsZScgKS5jbGljayggZnVuY3Rpb24oIGUgKXtcclxuICAgICAgICB0cmFja1BsYXllci5sb2FkVHJhY2soIDMwLCAnc21pbGUnLCBzZXEsIG11c2NsZU1vZGlmaWVycyApO1xyXG4gICAgICAgIHRyYWNrUGxheWVyLnN0YXJ0VHJhY2soICdzbWlsZScgKTtcclxuICAgIH0gKTtcclxuXHJcbiAgICAkKCAnLmV4cHJlc3Npb24tc21pbGUtYmlnJyApLmNsaWNrKCBmdW5jdGlvbiggZSApe1xyXG4gICAgICAgIHRyYWNrUGxheWVyLmxvYWRUcmFjayggMzAsICdiaWdTbWlsZScsIHNlcSwgbXVzY2xlTW9kaWZpZXJzICk7XHJcbiAgICAgICAgdHJhY2tQbGF5ZXIuc3RhcnRUcmFjayggJ2JpZ1NtaWxlJyApO1xyXG4gICAgfSApO1xyXG5cclxuICAgICQoICcuZXhwcmVzc2lvbi1lY3N0YXRpYycgKS5jbGljayggZnVuY3Rpb24oIGUgKXtcclxuICAgICAgICB0cmFja1BsYXllci5sb2FkVHJhY2soIDMwLCAnZWNzdGF0aWMnLCBzZXEsIG11c2NsZU1vZGlmaWVycyApO1xyXG4gICAgICAgIHRyYWNrUGxheWVyLnN0YXJ0VHJhY2soICdlY3N0YXRpYycgKTtcclxuICAgIH0gKTtcclxuXHJcbiAgICAkKCAnLmV4cHJlc3Npb24tc2FkJyApLmNsaWNrKCBmdW5jdGlvbiggZSApe1xyXG4gICAgICAgIHRyYWNrUGxheWVyLmxvYWRUcmFjayggNjAsICdzYWQnLCBzZXEsIG11c2NsZU1vZGlmaWVycyApO1xyXG4gICAgICAgIHRyYWNrUGxheWVyLnN0YXJ0VHJhY2soICdzYWQnICk7XHJcbiAgICB9ICk7XHJcblxyXG4gICAgJCggJy5leHByZXNzaW9uLXZlcnktc2FkJyApLmNsaWNrKCBmdW5jdGlvbiggZSApe1xyXG4gICAgICAgIHRyYWNrUGxheWVyLmxvYWRUcmFjayggNjAsICdiaWdTYWQnLCBzZXEsIG11c2NsZU1vZGlmaWVycyApO1xyXG4gICAgICAgIHRyYWNrUGxheWVyLnN0YXJ0VHJhY2soICdiaWdTYWQnICk7XHJcbiAgICB9ICk7XHJcblxyXG4gICAgJCggJy5leHByZXNzaW9uLWJsaW5rJyApLmNsaWNrKCBmdW5jdGlvbiggZSApe1xyXG4gICAgICAgIHRyYWNrUGxheWVyLmxvYWRUcmFjayggMTAsICdibGluaycsIHNlcSwgbXVzY2xlTW9kaWZpZXJzICk7XHJcbiAgICAgICAgdHJhY2tQbGF5ZXIuc3RhcnRUcmFjayggJ2JsaW5rJyApO1xyXG4gICAgfSApO1xyXG5cclxuICAgICQoICcuZXhwcmVzc2lvbi1yZXNldCcgKS5jbGljayggZnVuY3Rpb24oIGUgKXtcclxuICAgICAgICB0cmFja1BsYXllci5sb2FkVHJhY2soIDEwLCAncmVzZXQnLCBzZXEsIG11c2NsZU1vZGlmaWVycyApO1xyXG4gICAgICAgIHRyYWNrUGxheWVyLnN0YXJ0VHJhY2soICdyZXNldCcgKTtcclxuICAgIH0gKTtcclxuXHJcblxyXG4vLyBzZXF1ZW5jZSBidXR0b24gZXZlbnRzXHJcblxyXG4gICAgJCggJy5zZXF1ZW5jZS15YXduJyApLmNsaWNrKCBmdW5jdGlvbiggZSApe1xyXG4gICAgICAgIHRyYWNrUGxheWVyLmxvYWRUcmFjayggMzAwLCAneWF3bicsIHNlcSwgbXVzY2xlTW9kaWZpZXJzICk7XHJcbiAgICAgICAgdHJhY2tQbGF5ZXIuc3RhcnRUcmFjayggJ3lhd24nICk7XHJcbiAgICB9ICk7XHJcblxyXG5cclxuLy8gY29udHJvbCBwYW5lbCBldmVudHNcclxuICAgIFxyXG5cclxuICAgIC8vIGZhY2lhbCBmZWF0dXJlIHBhbmVsIGV2ZW50c1xyXG4gICAgdmFyICRmZWF0dXJlUGFnZVBhcmVudCA9ICQoICdbIGRhdGEtcGFnZT1cInBhZ2UtZWxlbWVudHNcIiBdJyk7XHJcblxyXG4gICAgdmFyICRmZWF0dXJlSW5wdXRzID0gJGZlYXR1cmVQYWdlUGFyZW50LmZpbmQoICdbIGRhdGEtZmFjZSBdJyApO1xyXG4gICAgJGZlYXR1cmVJbnB1dHMub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBlICkge1xyXG4gICAgICAgIHZhciAkc2VsZiA9ICQoIHRoaXMgKTtcclxuICAgICAgICB2YXIgZ2V0TW9kaWZpZXIgPSAkc2VsZi5kYXRhKCAnbW9kaWZpZXInICk7XHJcbiAgICAgICAgdmFyIGdldE11bHRpcGxpZXIgPSAkc2VsZi5kYXRhKCAndmFsdWUtbXVsdGlwbGllcicgKTtcclxuXHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHBhcnNlRmxvYXQoICRzZWxmLnZhbCgpICogZ2V0TXVsdGlwbGllciApO1xyXG4gICAgICAgIG11c2NsZU1vZGlmaWVyc1sgZ2V0TW9kaWZpZXIgXS5jdXJyID0gcmVzdWx0O1xyXG4gICAgICAgICRzZWxmLmNsb3Nlc3QoICcuY29udHJvbC0tcGFuZWxfX2l0ZW0nICkuZmluZCggJ291dHB1dCcgKS5odG1sKCByZXN1bHQgKTtcclxuICAgIH0gKTtcclxuXHJcbiAgICAvLyBzcGlrZSBHbGFyZSBwYW5lbCBldmVudHNcclxuXHJcbiAgICBsZXQgJHNwaWtlR2xhcmVFbFBhcmVudCA9ICQoICcuanMtZ2xhcmUtc3Bpa2UtZWZmZWN0cycgKTtcclxuICAgIGxldCAkc3Bpa2VHbGFyZUlucHV0cyA9ICRzcGlrZUdsYXJlRWxQYXJlbnQuZmluZCggJy5yYW5nZS1zbGlkZXInICk7XHJcbiAgICBsZXQgc3Bpa2VHbGFyZUNvbnRyb2xJbnB1dExpbmsgPSB7XHJcbiAgICAgICAgc3Bpa2VDb3VudElucHV0OiAnY291bnQnLFxyXG4gICAgICAgIHNwaWtlUmFkaXVzSW5wdXQ6ICdyJyxcclxuICAgICAgICBzcGlrZU1ham9yU2l6ZTogJ21ham9yUmF5TGVuJyxcclxuICAgICAgICBzcGlrZU1pbm9yU2l6ZTogJ21pbm9yUmF5TGVuJyxcclxuICAgICAgICBzcGlrZU1ham9yV2lkdGg6ICdtYWpvclJheVdpZHRoJyxcclxuICAgICAgICBzcGlrZU1pbm9yV2lkdGg6ICdtaW5vclJheVdpZHRoJyxcclxuICAgICAgICBzcGlrZUJsdXJBbW91bnQ6ICdibHVyJ1xyXG4gICAgfVxyXG5cclxuICAgICRzcGlrZUdsYXJlSW5wdXRzLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZSApIHtcclxuICAgICAgICBjb25zdCAkc2VsZiA9ICQoIHRoaXMgKVsgMCBdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHRoaXNPcHQgPSBzcGlrZUdsYXJlQ29udHJvbElucHV0TGlua1sgJHNlbGYuaWQgXTtcclxuICAgICAgICBjb25zdCB0aGlzT3B0Q2ZnID0gc3VuU3Bpa2VzLmdsYXJlU3Bpa2VDb250cm9sSW5wdXRDZmdbIHRoaXNPcHQgXTtcclxuICAgICAgICBsZXQgJHNlbGZWYWwgPSBwYXJzZUZsb2F0KCAkc2VsZi52YWx1ZSApO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyggJyRzZWxmVmFsOiAnLCAkc2VsZlZhbCApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnJHNlbGYuaWQ6ICcsICRzZWxmLmlkICk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coICd0aGlzT3B0OiAnLCB0aGlzT3B0ICk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coICd0aGlzT3B0Q2ZnOiAnLCB0aGlzT3B0Q2ZnICk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coICd0aGlzT3B0Q2ZnOiAnLCByZXN1bHQgKTtcclxuXHJcbiAgICAgICAgc3VuU3Bpa2VzLmdsYXJlU3Bpa2VPcHRpb25zWyB0aGlzT3B0IF0gPSAkc2VsZlZhbDtcclxuICAgICAgICBzdW5TcGlrZXMuY2xlYXJSZW5kZXJDdHgoKTtcclxuICAgICAgICBzdW5TcGlrZXMucmVuZGVyR2xhcmVTcGlrZXMoKTtcclxuICAgIH0gKTtcclxuXHJcbi8vIGxvb2sgdGFyZ2V0IGV2ZW50c1xyXG4gICAgdmFyICRMb29rVGFyZ2V0SW5wdXRzID0gJGZlYXR1cmVQYWdlUGFyZW50LmZpbmQoICcucmFuZ2Utc2xpZGVyWyBkYXRhLWNvbnRyb2w9XCJsb29rXCIgXScgKTtcclxuICAgICRMb29rVGFyZ2V0SW5wdXRzLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZSApIHtcclxuICAgICAgICB2YXIgJHNlbGYgPSAkKCB0aGlzICk7XHJcbiAgICAgICAgdmFyIGdldE1vZGlmaWVyID0gJHNlbGYuZGF0YSggJ21vZGlmaWVyJyApO1xyXG4gICAgICAgIHZhciBnZXRNdWx0aXBsaWVyID0gJHNlbGYuZGF0YSggJ3ZhbHVlLW11bHRpcGxpZXInICk7XHJcbiAgICAgICAgdmFyIHRoaXNBeGlzID0gZ2V0TW9kaWZpZXIuaW5kZXhPZiggJ1gnICkgIT0gLTEgPyAneCcgOiBnZXRNb2RpZmllci5pbmRleE9mKCAnWScgKSAhPSAtMSA/ICd5JyA6IGdldE1vZGlmaWVyLmluZGV4T2YoICdaJyApICE9IC0xID8gJ3onIDogZmFsc2U7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coICdyYXcgdmFsdWU6ICcsICRzZWxmLnZhbCgpICk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coICdnZXRNdWx0aXBsaWVyOiAnLCBnZXRNdWx0aXBsaWVyICk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coICdyYXcgcmVzdWx0OiAnLCAkc2VsZi52YWwoKSAqIGdldE11bHRpcGxpZXIgKTtcclxuXHJcbiAgICAgICAgaWYgKCB0aGlzQXhpcyA9PT0gJ3onICkge1xyXG4gICAgICAgICAgICBhaW1Db25zdHJhaW50LnNldEN1cnJlbnRTaXplKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXN1bHQgPSBwYXJzZUZsb2F0KCAkc2VsZi52YWwoKSAqIGdldE11bHRpcGxpZXIgKTtcclxuICAgICAgICBhaW1Db25zdHJhaW50LnRhcmdldC5jb29yZHMuY3VyclsgdGhpc0F4aXMgXSA9IHJlc3VsdDtcclxuICAgICAgICAkc2VsZi5wYXJlbnQoKS5maW5kKCAnb3V0cHV0JyApLmh0bWwoIHJlc3VsdCApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnd3Jvbmcgb25lIGZpcmluZycgKTtcclxuICAgIH0gKTtcclxuXHJcblxyXG5mdW5jdGlvbiBkcmF3T3ZlcmxheSgpIHtcclxuXHJcbiAgICBpZiAoIG92ZXJsYXlDZmcuZGlzcGxheU92ZXJsYXkgKSB7XHJcbiAgICAgICAgLy8gZHJhdyByZWZlcmVuY2UgcG9pbnRzXHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc3VuZmFjZS5jb2xvdXJzLmRlYnVnLmxpbmVzO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAxO1xyXG4gICAgICAgIGN0eC5zZXRMaW5lRGFzaChbMSwgNl0pO1xyXG5cclxuICAgICAgICBpZiAoIG92ZXJsYXlDZmcuZGlzcGxheUNlbnRyZUxpbmVzICkge1xyXG5cclxuICAgICAgICAgICAgLy8gZHJhdyBjZW50cmUgbGluZXNcclxuICAgICAgICAgICAgY3R4LmxpbmUoXHJcbiAgICAgICAgICAgICAgICBzdW5mYWNlLnggLSAoIHN1bmZhY2UuciAqIDIgKSwgc3VuZmFjZS55LFxyXG4gICAgICAgICAgICAgICAgc3VuZmFjZS54ICsgKCBzdW5mYWNlLnIgKiAyICksIHN1bmZhY2UueVxyXG4gICAgICAgICAgICApO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGN0eC5saW5lKFxyXG4gICAgICAgICAgICAgICAgc3VuZmFjZS54LCBzdW5mYWNlLnkgLSAoIHN1bmZhY2UuciAqIDIgKSxcclxuICAgICAgICAgICAgICAgIHN1bmZhY2UueCwgc3VuZmFjZS55ICsgKCBzdW5mYWNlLnIgKiAyIClcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGN0eC5zZXRMaW5lRGFzaCggW10gKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIG92ZXJsYXlDZmcuZGlzcGxheUxvb2tUYXJnZXQgKSB7XHJcbiAgICAgICAgICAgIGFpbUNvbnN0cmFpbnQucmVuZGVyVGFyZ2V0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIG92ZXJsYXlDZmcuZGlzcGxheVN1blRvU3RhZ2UgKSB7XHJcbiAgICAgICAgICAgIGZhY2VUb1N0YWdlQ2VudHJlRGVidWdMaW5lKCBjdHggKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRyYXdNdXNjbGVHcm91cHMoKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY29tcHV0ZUZhY2VDb29yZGluYXRlcygpIHtcclxuXHJcbiAgICAvLyBzdG9yZSBiYXNlIGFuZCBjdXJyZW50IHBvc2l0aW9ucyBvZiBmZWF0dXJlc1xyXG5cclxuICAgIC8vIGV5ZWJyb3dzXHJcbiAgICB2YXIgZXllYnJvd0wgPSBmYWNlQ29vcmRzLmV5ZWJyb3dzLmxlZnQ7XHJcbiAgICB2YXIgZXllYnJvd1IgPSBmYWNlQ29vcmRzLmV5ZWJyb3dzLnJpZ2h0O1xyXG4gICAgdmFyIGJhc2VFeWVicm93TCA9IGJhc2VGYWNlQ29vcmRzLmV5ZWJyb3dzLmxlZnQ7XHJcbiAgICB2YXIgYmFzZUV5ZWJyb3dSID0gYmFzZUZhY2VDb29yZHMuZXllYnJvd3MucmlnaHQ7XHJcblxyXG4gICAgLy8gZXllc1xyXG4gICAgdmFyIGV5ZXMgPSBmYWNlQ29vcmRzLmV5ZXM7XHJcbiAgICB2YXIgYmFzZUV5ZXMgPSBiYXNlRmFjZUNvb3Jkcy5leWVzO1xyXG5cclxuICAgIC8vIG5vc2VcclxuICAgIHZhciBub3NlID0gZmFjZUNvb3Jkcy5ub3NlO1xyXG4gICAgdmFyIGJhc2VOb3NlID0gYmFzZUZhY2VDb29yZHMubm9zZTtcclxuXHJcbiAgICAvLyBtb3V0aFxyXG4gICAgdmFyIG1vdXRoID0gZmFjZUNvb3Jkcy5tb3V0aDtcclxuICAgIHZhciBiYXNlTW91dGggPSBiYXNlRmFjZUNvb3Jkcy5tb3V0aDtcclxuICAgIHZhciBsaXAgPSBmYWNlQ29vcmRzLmxpcDtcclxuICAgIHZhciBiYXNlTGlwID0gYmFzZUZhY2VDb29yZHMubGlwO1xyXG5cclxuICAgIC8vIHRlZXRoXHJcbiAgICB2YXIgdGVldGhUb3AgPSBmYWNlQ29vcmRzLnRlZXRoLnRvcDtcclxuICAgIHZhciBiYXNlVGVldGhUb3AgPSBiYXNlRmFjZUNvb3Jkcy50ZWV0aC50b3A7XHJcbiAgICB2YXIgdGVldGhCb3R0b20gPSBmYWNlQ29vcmRzLnRlZXRoLmJvdHRvbTtcclxuICAgIHZhciBiYXNlVGVldGhCb3R0b20gPSBiYXNlRmFjZUNvb3Jkcy50ZWV0aC5ib3R0b207XHJcblxyXG4gICAgLy8gY2hpblxyXG4gICAgdmFyIGNoaW4gPSBmYWNlQ29vcmRzLmNoaW47XHJcbiAgICB2YXIgYmFzZUNoaW4gPSBiYXNlRmFjZUNvb3Jkcy5jaGluO1xyXG5cclxuICAgIC8vIGlubmVyIGNoZWVrc1xyXG4gICAgdmFyIGNoZWVrTGVmdElubmVyID0gZmFjZUNvb3Jkcy5pbm5lckNoZWVrcy5sZWZ0O1xyXG4gICAgdmFyIGJhc2VDaGVla0xlZnRJbm5lciA9IGJhc2VGYWNlQ29vcmRzLmlubmVyQ2hlZWtzLmxlZnQ7XHJcbiAgICB2YXIgY2hlZWtSaWdodElubmVyID0gZmFjZUNvb3Jkcy5pbm5lckNoZWVrcy5yaWdodDtcclxuICAgIHZhciBiYXNlQ2hlZWtSaWdodElubmVyID0gYmFzZUZhY2VDb29yZHMuaW5uZXJDaGVla3MucmlnaHQ7XHJcblxyXG4gICAgLy8gb3V0ZXIgY2hlZWtzXHJcbiAgICB2YXIgY2hlZWtMZWZ0T3V0ZXIgPSBmYWNlQ29vcmRzLm91dGVyQ2hlZWtzLmxlZnQ7XHJcbiAgICB2YXIgYmFzZUNoZWVrTGVmdE91dGVyID0gYmFzZUZhY2VDb29yZHMub3V0ZXJDaGVla3MubGVmdDtcclxuICAgIHZhciBjaGVla1JpZ2h0T3V0ZXIgPSBmYWNlQ29vcmRzLm91dGVyQ2hlZWtzLnJpZ2h0O1xyXG4gICAgdmFyIGJhc2VDaGVla1JpZ2h0T3V0ZXIgPSBiYXNlRmFjZUNvb3Jkcy5vdXRlckNoZWVrcy5yaWdodDtcclxuXHJcblxyXG4gICAgLy8gaW5wdXQgbW9kaWZpZXIgdmFsdWVzXHJcbiAgICB2YXIgbGVmdEJyb3dNb2QgPSBtdXNjbGVNb2RpZmllcnMubGVmdEV5ZWJyb3cuY3VyciA+IDAgPyBtdXNjbGVNb2RpZmllcnMubGVmdEV5ZWJyb3cuY3VyciAvIDIgOiBtdXNjbGVNb2RpZmllcnMubGVmdEV5ZWJyb3cuY3VycjtcclxuICAgIHZhciBsZWZ0QnJvd01vZFF0ciA9IGxlZnRCcm93TW9kIC8gNDtcclxuICAgIC8vIHZhciByaWdodEJyb3dNb2QgPSBtdXNjbGVNb2RpZmllcnMucmlnaHRFeWVicm93LmN1cnI7XHJcbiAgICB2YXIgcmlnaHRCcm93TW9kID0gbXVzY2xlTW9kaWZpZXJzLnJpZ2h0RXllYnJvdy5jdXJyID4gMCA/IG11c2NsZU1vZGlmaWVycy5yaWdodEV5ZWJyb3cuY3VyciAvIDIgOiBtdXNjbGVNb2RpZmllcnMucmlnaHRFeWVicm93LmN1cnI7XHJcbiAgICB2YXIgcmlnaHRCcm93TW9kUXRyID0gcmlnaHRCcm93TW9kIC8gNDtcclxuXHJcbiAgICB2YXIgbGVmdEJyb3dJbmRleEVhc2VkID0gMTtcclxuICAgIHZhciBsZWZ0QnJvd01vZEluZGV4ID0gbXVzY2xlTW9kaWZpZXJzLmxlZnRFeWVicm93LmN1cnIgLyBtdXNjbGVNb2RpZmllcnMubGVmdEV5ZWJyb3cubWluO1xyXG5cclxuICAgIGlmICggbXVzY2xlTW9kaWZpZXJzLmxlZnRFeWVicm93LmN1cnIgPiAwICkge1xyXG4gICAgICAgIGxlZnRCcm93SW5kZXhFYXNlZCA9IDE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxlZnRCcm93SW5kZXhFYXNlZCA9IGVhc2luZy5saW5lYXJFYXNlKCBsZWZ0QnJvd01vZEluZGV4LCAxLCAtMSwgMSApO1xyXG4gICAgfVxyXG4gICAgdmFyIGxlZnRCcm93SW5kZXhFYXNlZFJldmVyc2UgPSAxIC0gbGVmdEJyb3dJbmRleEVhc2VkO1xyXG4gICAgdmFyIGxlZnRCcm93TW9kSW5kZXhSZXZlcnNlID0gMSAtIGxlZnRCcm93TW9kSW5kZXg7XHJcblxyXG5cclxuXHJcbiAgICB2YXIgcmlnaHRCcm93SW5kZXhFYXNlZCA9IDE7XHJcbiAgICB2YXIgcmlnaHRCcm93TW9kSW5kZXggPSBtdXNjbGVNb2RpZmllcnMucmlnaHRFeWVicm93LmN1cnIgLyBtdXNjbGVNb2RpZmllcnMucmlnaHRFeWVicm93Lm1pbjtcclxuXHJcbiAgICBpZiAoIG11c2NsZU1vZGlmaWVycy5yaWdodEV5ZWJyb3cuY3VyciA+IDAgKSB7XHJcbiAgICAgICAgcmlnaHRCcm93SW5kZXhFYXNlZCA9IDE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJpZ2h0QnJvd0luZGV4RWFzZWQgPSBlYXNpbmcubGluZWFyRWFzZSggcmlnaHRCcm93TW9kSW5kZXgsIDEsIC0xLCAxICk7XHJcbiAgICB9XHJcbiAgICB2YXIgcmlnaHRCcm93SW5kZXhFYXNlZFJldmVyc2UgPSAxIC0gcmlnaHRCcm93SW5kZXhFYXNlZDtcclxuICAgIHZhciByaWdodEJyb3dNb2RJbmRleFJldmVyc2UgPSAxIC0gcmlnaHRCcm93TW9kSW5kZXg7XHJcblxyXG5cclxuXHJcbiAgICB2YXIgbGVmdEJyb3dDb250cmFjdE1vZCA9IG11c2NsZU1vZGlmaWVycy5sZWZ0QnJvd0NvbnRyYWN0LmN1cnI7XHJcbiAgICB2YXIgbGVmdEJyb3dDb250cmFjdE1vZEluZGV4ID0gbGVmdEJyb3dDb250cmFjdE1vZCAvIG11c2NsZU1vZGlmaWVycy5sZWZ0QnJvd0NvbnRyYWN0Lm1heDtcclxuICAgIHZhciByaWdodEJyb3dDb250cmFjdE1vZCA9IG11c2NsZU1vZGlmaWVycy5yaWdodEJyb3dDb250cmFjdC5jdXJyO1xyXG4gICAgdmFyIHJpZ2h0QnJvd0NvbnRyYWN0TW9kSW5kZXggPSByaWdodEJyb3dDb250cmFjdE1vZCAvIG11c2NsZU1vZGlmaWVycy5yaWdodEJyb3dDb250cmFjdC5tYXg7XHJcbiAgICAvLyBjb25zb2xlLmxvZyggJ2xlZnRCcm93Q29udHJhY3RNb2Q6ICcsIGxlZnRCcm93Q29udHJhY3RNb2QgKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCAncmlnaHRCcm93Q29udHJhY3RNb2Q6ICcsIHJpZ2h0QnJvd0NvbnRyYWN0TW9kICk7XHJcblxyXG5cclxuXHJcblxyXG4gICAgdmFyIGxlZnRFeWVNb2QgPSBtdXNjbGVNb2RpZmllcnMubGVmdEV5ZS5jdXJyO1xyXG4gICAgdmFyIHJpZ2h0RXllTW9kID0gbXVzY2xlTW9kaWZpZXJzLnJpZ2h0RXllLmN1cnI7XHJcblxyXG4gICAgdmFyIG5vc3RyaWxMZWZ0UmFpc2UgPSBtdXNjbGVNb2RpZmllcnMubm9zdHJpbFJhaXNlTC5jdXJyO1xyXG4gICAgdmFyIG5vc3RyaWxSaWdodFJhaXNlID0gbXVzY2xlTW9kaWZpZXJzLm5vc3RyaWxSYWlzZVIuY3VycjtcclxuXHJcbiAgICB2YXIgbm9zdHJpbExlZnRGbGFyZSA9IG11c2NsZU1vZGlmaWVycy5ub3N0cmlsRmxhcmVMLmN1cnI7XHJcbiAgICB2YXIgbm9zdHJpbFJpZ2h0RmxhcmUgPSBtdXNjbGVNb2RpZmllcnMubm9zdHJpbEZsYXJlUi5jdXJyO1xyXG5cclxuICAgIHZhciBsZWZ0Q2hlZWtNb2QgPSBtdXNjbGVNb2RpZmllcnMubGVmdENoZWVrLmN1cnI7XHJcbiAgICB2YXIgcmlnaHRDaGVla01vZCA9IG11c2NsZU1vZGlmaWVycy5yaWdodENoZWVrLmN1cnI7XHJcblxyXG4gICAgdmFyIG1vdXRoRWRnZUxlZnQgPSBtdXNjbGVNb2RpZmllcnMubW91dGhFZGdlTGVmdC5jdXJyO1xyXG4gICAgdmFyIG1vdXRoRWRnZUxlZnRJbmRleCA9IG1vdXRoRWRnZUxlZnQgLyBtdXNjbGVNb2RpZmllcnMubW91dGhFZGdlTGVmdC5tYXg7XHJcbiAgICB2YXIgbW91dGhFZGdlTGVmdFJldmVyc2VJbmRleCA9IDEgLSBtb3V0aEVkZ2VMZWZ0SW5kZXg7XHJcbiAgICB2YXIgbW91dGhFZGdlUmlnaHQgPSBtdXNjbGVNb2RpZmllcnMubW91dGhFZGdlUmlnaHQuY3VycjtcclxuICAgIHZhciBtb3V0aEVkZ2VSaWdodEluZGV4ID0gbW91dGhFZGdlUmlnaHQgLyBtdXNjbGVNb2RpZmllcnMubW91dGhFZGdlUmlnaHQubWF4O1xyXG4gICAgdmFyIG1vdXRoRWRnZVJpZ2h0UmV2ZXJzZUluZGV4ID0gMSAtIG1vdXRoRWRnZVJpZ2h0SW5kZXg7XHJcblxyXG4gICAgdmFyIG1vdXRoRWRnZUxlZnRFeHRlbmQgPSBtdXNjbGVNb2RpZmllcnMubW91dGhFZGdlTGVmdEV4dGVuZC5jdXJyO1xyXG4gICAgdmFyIG1vdXRoRWRnZVJpZ2h0RXh0ZW5kID0gbXVzY2xlTW9kaWZpZXJzLm1vdXRoRWRnZVJpZ2h0RXh0ZW5kLmN1cnI7IFxyXG5cclxuICAgIHZhciB0b3BMaXBMZWZ0UHVsbCA9IG11c2NsZU1vZGlmaWVycy50b3BMaXBMZWZ0UHVsbC5jdXJyO1xyXG4gICAgdmFyIHRvcExpcFJpZ2h0UHVsbCA9IG11c2NsZU1vZGlmaWVycy50b3BMaXBSaWdodFB1bGwuY3VycjtcclxuXHJcbiAgICB2YXIgYm90dG9tTGlwTGVmdFB1bGwgPSBtdXNjbGVNb2RpZmllcnMuYm90dG9tTGlwTGVmdFB1bGwuY3VycjtcclxuICAgIHZhciBib3R0b21MaXBMZWZ0UHVsbEluZGV4ID0gYm90dG9tTGlwTGVmdFB1bGwgLyBtdXNjbGVNb2RpZmllcnMuYm90dG9tTGlwTGVmdFB1bGwubWF4O1xyXG4gICAgdmFyIGJvdHRvbUxpcExlZnRQdWxsUmV2ZXJzZUluZGV4ID0gMSAtIGJvdHRvbUxpcExlZnRQdWxsSW5kZXg7XHJcbiAgICB2YXIgYm90dG9tTGlwUmlnaHRQdWxsID0gbXVzY2xlTW9kaWZpZXJzLmJvdHRvbUxpcFJpZ2h0UHVsbC5jdXJyO1xyXG4gICAgdmFyIGJvdHRvbUxpcFJpZ2h0UHVsbEluZGV4ID0gYm90dG9tTGlwUmlnaHRQdWxsIC8gbXVzY2xlTW9kaWZpZXJzLmJvdHRvbUxpcFJpZ2h0UHVsbC5tYXg7XHJcbiAgICB2YXIgYm90dG9tTGlwUmlnaHRQdWxsUmV2ZXJzZUluZGV4ID0gMSAtIGJvdHRvbUxpcFJpZ2h0UHVsbEluZGV4O1xyXG5cclxuICAgIHZhciB0b3BMaXBPcGVuTW9kID0gbXVzY2xlTW9kaWZpZXJzLnRvcExpcE9wZW4uY3VycjtcclxuICAgIHZhciB0b3BMaXBPcGVuTWluID0gbXVzY2xlTW9kaWZpZXJzLnRvcExpcE9wZW4ubWluO1xyXG4gICAgdmFyIHRvcExpcE9wZW5NYXggPSBtdXNjbGVNb2RpZmllcnMudG9wTGlwT3Blbi5tYXg7XHJcbiAgICB2YXIgdG9wTGlwQ2hhbmdlRGVsdGEgPSB0b3BMaXBPcGVuTWF4IC0gdG9wTGlwT3Blbk1pbjtcclxuXHJcbiAgICB2YXIgdG9wTGlwT3BlbkluZGV4ID0gdG9wTGlwT3Blbk1vZCAvIHRvcExpcE9wZW5NYXg7XHJcbiAgICB2YXIgdG9wTGlwT3BlblJldmVyc2VJbmRleCA9IDEgLSB0b3BMaXBPcGVuSW5kZXg7XHJcblxyXG4gICAgdmFyIHRvcExpcExlZnRQdWxsTm9ybWFsaXNlZCA9ICggdG9wTGlwTGVmdFB1bGwgKiB0b3BMaXBPcGVuUmV2ZXJzZUluZGV4ICkgKiAxLjI7XHJcbiAgICB2YXIgdG9wTGlwUmlnaHRQdWxsTm9ybWFsaXNlZCA9ICggdG9wTGlwUmlnaHRQdWxsICogdG9wTGlwT3BlblJldmVyc2VJbmRleCApICogMS4yO1xyXG5cclxuICAgIC8vIHRvcExpcCBlYXNlZCBtb3ZlLCB1c2luZyBlYXNpbmcgZnVuY3Rpb25zXHJcbiAgICB2YXIgdG9wTGlwT3BlbkVhc2VkID0gZWFzaW5nLmVhc2VJblF1aW50KCB0b3BMaXBPcGVuTW9kLCB0b3BMaXBPcGVuTWluLCB0b3BMaXBDaGFuZ2VEZWx0YSwgdG9wTGlwT3Blbk1heCApO1xyXG5cclxuICAgIHZhciBib3R0b21MaXBPcGVuTW9kID0gbXVzY2xlTW9kaWZpZXJzLmJvdHRvbUxpcE9wZW4uY3VycjtcclxuXHJcbiAgICB2YXIgbGlwc1B1Y2tlciA9IG11c2NsZU1vZGlmaWVycy5saXBzUHVja2VyLmN1cnI7XHJcbiAgICB2YXIgbGlwc1B1Y2tlck1pbiA9IG11c2NsZU1vZGlmaWVycy5saXBzUHVja2VyLm1pbjtcclxuICAgIHZhciBsaXBzUHVja2VyTWF4ID0gbXVzY2xlTW9kaWZpZXJzLmxpcHNQdWNrZXIubWF4O1xyXG5cclxuXHJcblxyXG4gICAgdmFyIGphd09wZW4gPSBtdXNjbGVNb2RpZmllcnMuamF3T3Blbi5jdXJyO1xyXG4gICAgdmFyIGphd0luZGV4ID0gbXVzY2xlTW9kaWZpZXJzLmphd09wZW4uY3VyciAvIG11c2NsZU1vZGlmaWVycy5qYXdPcGVuLm1heDtcclxuICAgIHZhciBqYXdSZXZlcnNlSW5kZXggPSAxIC0gamF3SW5kZXg7XHJcblxyXG4gICAgdmFyIGphd0xhdGVyYWwgPSBtdXNjbGVNb2RpZmllcnMuamF3TGF0ZXJhbC5jdXJyO1xyXG5cclxuICAgIC8vIG11c2NsZSBtb2RpZmljYXRpb25zXHJcblxyXG4gICAgLy8gZXllYnJvd3NcclxuICAgIC8vLy8vLy8vLy8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovLy8vLy8vLy8vLy8vXHJcbiAgICBleWVicm93TC5oYW5kbGUxWSA9IGJhc2VFeWVicm93TC5oYW5kbGUxWSArIGxlZnRCcm93TW9kO1xyXG4gICAgZXllYnJvd0wuaGFuZGxlMlkgPSBiYXNlRXllYnJvd0wuaGFuZGxlMlkgKyBsZWZ0QnJvd01vZDtcclxuICAgIGV5ZWJyb3dMLmxQb2ludFkgPSBiYXNlRXllYnJvd0wubFBvaW50WSArIGxlZnRCcm93TW9kICogMC4yNTtcclxuICAgIGV5ZWJyb3dMLnJQb2ludFkgPSBiYXNlRXllYnJvd0wuclBvaW50WSArIGxlZnRCcm93TW9kO1xyXG5cclxuICAgIGV5ZWJyb3dSLmhhbmRsZTFZID0gYmFzZUV5ZWJyb3dSLmhhbmRsZTFZICsgcmlnaHRCcm93TW9kO1xyXG4gICAgZXllYnJvd1IuaGFuZGxlMlkgPSBiYXNlRXllYnJvd1IuaGFuZGxlMlkgKyByaWdodEJyb3dNb2Q7XHJcbiAgICBleWVicm93Ui5sUG9pbnRZID0gYmFzZUV5ZWJyb3dSLmxQb2ludFkgKyByaWdodEJyb3dNb2Q7XHJcbiAgICBleWVicm93Ui5yUG9pbnRZID0gYmFzZUV5ZWJyb3dSLnJQb2ludFkgKyByaWdodEJyb3dNb2QgKiAwLjI1O1xyXG4gICAgXHJcbiAgICBub3NlLnBvaW50MVkgPSBiYXNlTm9zZS5wb2ludDFZICsgKCAoIGxlZnRCcm93TW9kICsgcmlnaHRCcm93TW9kICkgLyAyICk7XHJcblxyXG4gICAgZXllcy5sZWZ0LnRIYW5kbGVZID0gYmFzZUV5ZXMubGVmdC50SGFuZGxlWSArIGxlZnRCcm93TW9kUXRyO1xyXG4gICAgZXllcy5yaWdodC50SGFuZGxlWSA9IGJhc2VFeWVzLnJpZ2h0LnRIYW5kbGVZICsgcmlnaHRCcm93TW9kUXRyO1xyXG5cclxuXHJcbiAgICAvLyBmb3JoZWFkIG1vZGlmaWNhdGlvbnNcclxuICAgIC8vLy8vLy8vLy8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgZXllYnJvd0wuclBvaW50WCA9IGJhc2VFeWVicm93TC5yUG9pbnRYICsgbGVmdEJyb3dDb250cmFjdE1vZDtcclxuICAgIGV5ZWJyb3dMLmhhbmRsZTFYID0gYmFzZUV5ZWJyb3dMLmhhbmRsZTFYICsgbGVmdEJyb3dDb250cmFjdE1vZCAqIDI7XHJcbiAgICBleWVicm93TC5oYW5kbGUyWCA9IGJhc2VFeWVicm93TC5oYW5kbGUyWCArIGxlZnRCcm93Q29udHJhY3RNb2QgKiAyO1xyXG5cclxuICAgIGV5ZWJyb3dMLmhhbmRsZTFZIC09ICggKCBsZWZ0QnJvd0NvbnRyYWN0TW9kICogMyApICogbGVmdEJyb3dJbmRleEVhc2VkICk7XHJcbiAgICBleWVicm93TC5oYW5kbGUyWSArPSAoIGxlZnRCcm93Q29udHJhY3RNb2QgKiA3ICkgKyAoICggLTIwICogbGVmdEJyb3dDb250cmFjdE1vZEluZGV4ICkgKiBsZWZ0QnJvd0luZGV4RWFzZWRSZXZlcnNlICk7XHJcbiAgICBleWVicm93TC5yUG9pbnRZIC09ICggbGVmdEJyb3dDb250cmFjdE1vZCAqIDMgKSArICggKCAyMCAqIGxlZnRCcm93Q29udHJhY3RNb2RJbmRleCApICogbGVmdEJyb3dJbmRleEVhc2VkUmV2ZXJzZSApO1xyXG5cclxuXHJcbiAgICBleWVicm93Ui5sUG9pbnRYID0gYmFzZUV5ZWJyb3dSLmxQb2ludFggLSByaWdodEJyb3dDb250cmFjdE1vZDtcclxuICAgIGV5ZWJyb3dSLmhhbmRsZTFYID0gYmFzZUV5ZWJyb3dSLmhhbmRsZTFYIC0gcmlnaHRCcm93Q29udHJhY3RNb2QgKiAyO1xyXG4gICAgZXllYnJvd1IuaGFuZGxlMlggPSBiYXNlRXllYnJvd1IuaGFuZGxlMlggLSByaWdodEJyb3dDb250cmFjdE1vZCAqIDI7XHJcblxyXG4gICAgZXllYnJvd1IuaGFuZGxlMlkgLT0gKCAoIHJpZ2h0QnJvd0NvbnRyYWN0TW9kICogMyApICogcmlnaHRCcm93SW5kZXhFYXNlZCApO1xyXG4gICAgZXllYnJvd1IuaGFuZGxlMVkgKz0gKCByaWdodEJyb3dDb250cmFjdE1vZCAqIDcgKSArICggKCAtMjAgKiByaWdodEJyb3dDb250cmFjdE1vZEluZGV4ICkgKiByaWdodEJyb3dJbmRleEVhc2VkUmV2ZXJzZSApO1xyXG4gICAgZXllYnJvd1IubFBvaW50WSAtPSAoIHJpZ2h0QnJvd0NvbnRyYWN0TW9kICogMyApICsgKCAoIDIwICogcmlnaHRCcm93Q29udHJhY3RNb2RJbmRleCApICogcmlnaHRCcm93SW5kZXhFYXNlZFJldmVyc2UgKTtcclxuXHJcblxyXG4gICAgLy8gbm9zZSBtb2RpZmljYXRpb25zIGZyb20gZm9yZWhlYWQgKCBpbmRpcmVjdCApXHJcbiAgICAvLy8vLy8vLy8vLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqLy8vLy8vLy8vLy8vL1xyXG4gICAgbm9zZS5wb2ludDFYID0gYmFzZU5vc2UucG9pbnQxWCArICggKCBsZWZ0QnJvd0NvbnRyYWN0TW9kICsgcmlnaHRCcm93Q29udHJhY3RNb2QgKSAvIDIgKTtcclxuXHJcbiAgICBleWVzLmxlZnQuYkhhbmRsZVkgPSBiYXNlRXllcy5sZWZ0LmJIYW5kbGVZICsgbGVmdENoZWVrTW9kICogMC40O1xyXG4gICAgZXllcy5yaWdodC5iSGFuZGxlWSA9IGJhc2VFeWVzLnJpZ2h0LmJIYW5kbGVZICsgcmlnaHRDaGVla01vZCAqIDAuNDtcclxuXHJcbiAgICAvLyBleWVzIG1vZFxyXG4gICAgdmFyIGxlZnRFeWVEaXN0ID0gZXllcy5sZWZ0LmJIYW5kbGVZIC0gZXllcy5sZWZ0LnRIYW5kbGVZO1xyXG4gICAgZXllcy5sZWZ0LnRIYW5kbGVZID0gZXllcy5sZWZ0LmJIYW5kbGVZIC0gKCBsZWZ0RXllRGlzdCAqIGxlZnRFeWVNb2QgKTtcclxuXHJcbiAgICB2YXIgcmlnaHRFeWVEaXN0ID0gZXllcy5yaWdodC5iSGFuZGxlWSAtIGV5ZXMucmlnaHQudEhhbmRsZVk7XHJcbiAgICBleWVzLnJpZ2h0LnRIYW5kbGVZID0gZXllcy5yaWdodC5iSGFuZGxlWSAtICggcmlnaHRFeWVEaXN0ICogcmlnaHRFeWVNb2QgKTtcclxuXHJcbiAgICBcclxuXHJcbiAgICAvLyBtb3V0aCAoIHZlcnksIFZFUlkgY29tcGxpY2F0ZWQgKVxyXG4gICAgLy8vLy8vLy8vLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKi8vLy8vLy8vLy8vLy8gXHJcblxyXG4gICAgLy8gd2lkdGhcclxuICAgIG1vdXRoLmxlZnRfb3V0ZXJfYW5jaG9yX1ggPSBiYXNlTW91dGgubGVmdF9vdXRlcl9hbmNob3JfWCArIG1vdXRoRWRnZUxlZnQgKyAoIGphd09wZW4gKiAwLjIgKTtcclxuICAgIG1vdXRoLmxlZnRfaW5uZXJfYW5jaG9yX1ggPSBiYXNlTW91dGgubGVmdF9pbm5lcl9hbmNob3JfWCArIG1vdXRoRWRnZUxlZnQgKyAoIGphd09wZW4gKiAwLjIgKTtcclxuICAgIG1vdXRoLnJpZ2h0X291dGVyX2FuY2hvcl9YID0gYmFzZU1vdXRoLnJpZ2h0X291dGVyX2FuY2hvcl9YICsgbW91dGhFZGdlUmlnaHQgLSAoIGphd09wZW4gKiAwLjIgKTtcclxuICAgIG1vdXRoLnJpZ2h0X2lubmVyX2FuY2hvcl9YID0gYmFzZU1vdXRoLnJpZ2h0X2lubmVyX2FuY2hvcl9YICsgbW91dGhFZGdlUmlnaHQgLSAoIGphd09wZW4gKiAwLjIgKTtcclxuXHJcbiAgICBsZXQgbGlwQ2VudHJlWEF2ZXJhZ2VkID0gbW91dGgubGVmdF9pbm5lcl9hbmNob3JfWCArICggKCBtb3V0aC5yaWdodF9pbm5lcl9hbmNob3JfWCAtIG1vdXRoLmxlZnRfaW5uZXJfYW5jaG9yX1ggKSAvIDIgKTtcclxuICAgIGxldCBsaXBDZW50cmVPZmZzZXRYID0gKCBsaXBDZW50cmVYQXZlcmFnZWQgLSAgYmFzZU1vdXRoLnRvcF9pbm5lcl9hbmNob3JfWCApICogMS41O1xyXG5cclxuICAgIG1vdXRoLnRvcF9pbm5lcl9hbmNob3JfWCA9IGxpcENlbnRyZVhBdmVyYWdlZDtcclxuICAgIG1vdXRoLnRvcF9vdXRlcl9hbmNob3JfWCA9IGxpcENlbnRyZVhBdmVyYWdlZDtcclxuICAgIG1vdXRoLmJvdHRvbV9pbm5lcl9hbmNob3JfWCA9IGJhc2VNb3V0aC5ib3R0b21faW5uZXJfYW5jaG9yX1g7XHJcbiAgICBtb3V0aC5ib3R0b21fb3V0ZXJfYW5jaG9yX1ggPSBiYXNlTW91dGguYm90dG9tX291dGVyX2FuY2hvcl9YO1xyXG5cclxuICAgIG1vdXRoLmJvdHRvbV9pbm5lcl9hbmNob3JfWCArPSBsaXBDZW50cmVPZmZzZXRYO1xyXG4gICAgbW91dGguYm90dG9tX291dGVyX2FuY2hvcl9YICs9IGxpcENlbnRyZU9mZnNldFg7XHJcblxyXG5cclxuICAgIGxldCB0b3BMaXBNYXggPSBwbS5yMTYgKyBwbS5yMzIgKyBwbS5yNjQ7XHJcbiAgICBsZXQgdG9wTGVmdElubmVyQ1AxQ2hhbmdlID0gdG9wTGlwT3BlbkVhc2VkICsgdG9wTGlwTGVmdFB1bGwgPCB0b3BMaXBNYXggPyB0b3BMaXBPcGVuRWFzZWQgKyB0b3BMaXBMZWZ0UHVsbCA6IHRvcExpcE1heDtcclxuICAgIGxldCB0b3BMZWZ0SW5uZXJDUDJDaGFuZ2UgPSB0b3BMaXBPcGVuTW9kICsgKCB0b3BMaXBMZWZ0UHVsbCAqIDAuNSApIDwgdG9wTGlwTWF4ID8gdG9wTGlwT3Blbk1vZCArICggdG9wTGlwTGVmdFB1bGwgKiAwLjUgKSA6IHRvcExpcE1heDtcclxuXHJcbiAgICBsZXQgdG9wUmlnaHRJbm5lckNQMUNoYW5nZSA9IHRvcExpcE9wZW5FYXNlZCArIHRvcExpcFJpZ2h0UHVsbCA8IHRvcExpcE1heCA/IHRvcExpcE9wZW5FYXNlZCArIHRvcExpcFJpZ2h0UHVsbCA6IHRvcExpcE1heDs7XHJcbiAgICBsZXQgdG9wUmlnaHRJbm5lckNQMkNoYW5nZSA9IHRvcExpcE9wZW5Nb2QgKyAoIHRvcExpcFJpZ2h0UHVsbCAqIDAuNSApIDwgdG9wTGlwTWF4ID8gdG9wTGlwT3Blbk1vZCArICggdG9wTGlwUmlnaHRQdWxsICogMC41ICkgOiB0b3BMaXBNYXg7XHJcblxyXG4gICAgbGV0IHRvcExpcENlbnRyZU1heCA9IHBtLnIxNiArIHBtLnIzMiArIHBtLnI2NDtcclxuICAgIGxldCB0b3BMaXBDZW50cmVBbmNob3JOb3JtYWxpc2UgPSAoIHRvcExpcExlZnRQdWxsICsgdG9wTGlwUmlnaHRQdWxsICkgLyAyO1xyXG5cclxuICAgIGxldCB0b3BMaXBJbm5lckNlbnRyZUNoYW5nZSA9ICggdG9wTGlwT3Blbk1vZCAqIDEuMSApICsgdG9wTGlwQ2VudHJlQW5jaG9yTm9ybWFsaXNlIDwgdG9wTGlwQ2VudHJlTWF4ID8gKCB0b3BMaXBPcGVuTW9kICogMS4xICkgKyB0b3BMaXBDZW50cmVBbmNob3JOb3JtYWxpc2UgOiB0b3BMaXBDZW50cmVNYXg7XHJcbiAgICBsZXQgdG9wTGlwT3V0ZXJDZW50cmVDaGFuZ2UgPSAoIHRvcExpcE9wZW5Nb2QgKiAxLjMgKSArIHRvcExpcENlbnRyZUFuY2hvck5vcm1hbGlzZSA8IHRvcExpcENlbnRyZU1heCA/ICggdG9wTGlwT3Blbk1vZCAqIDEuMyApICsgdG9wTGlwQ2VudHJlQW5jaG9yTm9ybWFsaXNlIDogdG9wTGlwQ2VudHJlTWF4O1xyXG4gICAgbGV0IGNoZWVrc05vcm1hbGlzZWQgPSAoICggbGVmdENoZWVrTW9kICsgcmlnaHRDaGVla01vZCApIC8gMiApO1xyXG5cclxuICAgIG1vdXRoLnRvcF9sZWZ0X2lubmVyX2NwMV9ZID0gYmFzZU1vdXRoLnRvcF9sZWZ0X2lubmVyX2NwMV9ZICsgKCBsZWZ0Q2hlZWtNb2QgKiAwLjMgKSAtIHRvcExlZnRJbm5lckNQMUNoYW5nZTtcclxuICAgIG1vdXRoLnRvcF9sZWZ0X2lubmVyX2NwMl9ZID0gYmFzZU1vdXRoLnRvcF9sZWZ0X2lubmVyX2NwMl9ZICsgKCBsZWZ0Q2hlZWtNb2QgKiAwLjIgKSAtIHRvcExlZnRJbm5lckNQMkNoYW5nZTtcclxuICAgIG1vdXRoLnRvcF9sZWZ0X291dGVyX2NwMV9ZID0gYmFzZU1vdXRoLnRvcF9sZWZ0X291dGVyX2NwMV9ZICsgKCBsZWZ0Q2hlZWtNb2QgKiAwLjMgKSAtIHRvcExlZnRJbm5lckNQMUNoYW5nZTtcclxuICAgIG1vdXRoLnRvcF9sZWZ0X291dGVyX2NwMl9ZID0gYmFzZU1vdXRoLnRvcF9sZWZ0X291dGVyX2NwMl9ZICsgKCBsZWZ0Q2hlZWtNb2QgKiAwLjIgKSAtIHRvcExlZnRJbm5lckNQMkNoYW5nZTtcclxuXHJcbiAgICBtb3V0aC50b3BfcmlnaHRfaW5uZXJfY3AxX1kgPSBiYXNlTW91dGgudG9wX3JpZ2h0X2lubmVyX2NwMV9ZICsgKCByaWdodENoZWVrTW9kICogMC4zICkgLSB0b3BSaWdodElubmVyQ1AxQ2hhbmdlO1xyXG4gICAgbW91dGgudG9wX3JpZ2h0X2lubmVyX2NwMl9ZID0gYmFzZU1vdXRoLnRvcF9yaWdodF9pbm5lcl9jcDJfWSArICggcmlnaHRDaGVla01vZCAqIDAuMiApIC0gdG9wUmlnaHRJbm5lckNQMkNoYW5nZTtcclxuICAgIG1vdXRoLnRvcF9yaWdodF9vdXRlcl9jcDFfWSA9IGJhc2VNb3V0aC50b3BfcmlnaHRfb3V0ZXJfY3AxX1kgKyAoIHJpZ2h0Q2hlZWtNb2QgKiAwLjMgKSAtIHRvcFJpZ2h0SW5uZXJDUDFDaGFuZ2U7XHJcbiAgICBtb3V0aC50b3BfcmlnaHRfb3V0ZXJfY3AyX1kgPSBiYXNlTW91dGgudG9wX3JpZ2h0X291dGVyX2NwMl9ZICsgKCByaWdodENoZWVrTW9kICogMC4yICkgLSB0b3BSaWdodElubmVyQ1AyQ2hhbmdlO1xyXG5cclxuICAgIG1vdXRoLnRvcF9pbm5lcl9hbmNob3JfWSA9IGJhc2VNb3V0aC50b3BfaW5uZXJfYW5jaG9yX1kgKyAoIGNoZWVrc05vcm1hbGlzZWQgKiAwLjMgKSAtIHRvcExpcElubmVyQ2VudHJlQ2hhbmdlO1xyXG4gICAgbW91dGgudG9wX291dGVyX2FuY2hvcl9ZID0gYmFzZU1vdXRoLnRvcF9vdXRlcl9hbmNob3JfWSArICggY2hlZWtzTm9ybWFsaXNlZCAqIDAuMyApIC0gdG9wTGlwT3V0ZXJDZW50cmVDaGFuZ2U7XHJcblxyXG4gICAgaWYgKCBsaXBDZW50cmVPZmZzZXRYIDwgMCApIHtcclxuXHJcbiAgICAgICAgbW91dGgudG9wX2xlZnRfaW5uZXJfY3AxX1ggPSBiYXNlTW91dGgudG9wX2xlZnRfaW5uZXJfY3AxX1ggKyAoIGxpcENlbnRyZU9mZnNldFggKiAwLjUgKTtcclxuICAgICAgICBtb3V0aC50b3BfbGVmdF9pbm5lcl9jcDJfWCA9IGJhc2VNb3V0aC50b3BfbGVmdF9pbm5lcl9jcDJfWCArICggbGlwQ2VudHJlT2Zmc2V0WCAqIDAuOCApO1xyXG4gICAgICAgIG1vdXRoLnRvcF9sZWZ0X291dGVyX2NwMV9YID0gYmFzZU1vdXRoLnRvcF9sZWZ0X291dGVyX2NwMV9YICsgKCBsaXBDZW50cmVPZmZzZXRYICogMC43ICk7XHJcbiAgICAgICAgbW91dGgudG9wX2xlZnRfb3V0ZXJfY3AyX1ggPSBiYXNlTW91dGgudG9wX2xlZnRfb3V0ZXJfY3AyX1ggKyAoIGxpcENlbnRyZU9mZnNldFggKTtcclxuICAgICAgICBtb3V0aC50b3BfcmlnaHRfaW5uZXJfY3AxX1ggPSBiYXNlTW91dGgudG9wX3JpZ2h0X2lubmVyX2NwMV9YICsgKCBsaXBDZW50cmVPZmZzZXRYICogMC41ICk7XHJcbiAgICAgICAgbW91dGgudG9wX3JpZ2h0X2lubmVyX2NwMl9YID0gYmFzZU1vdXRoLnRvcF9yaWdodF9pbm5lcl9jcDJfWCArICggbGlwQ2VudHJlT2Zmc2V0WCAqIDAuOCApO1xyXG4gICAgICAgIG1vdXRoLnRvcF9yaWdodF9vdXRlcl9jcDFfWCA9IGJhc2VNb3V0aC50b3BfcmlnaHRfb3V0ZXJfY3AxX1ggKyAoIGxpcENlbnRyZU9mZnNldFggKiAwLjcgKTtcclxuICAgICAgICBtb3V0aC50b3BfcmlnaHRfb3V0ZXJfY3AyX1ggPSBiYXNlTW91dGgudG9wX3JpZ2h0X291dGVyX2NwMl9YICsgKCBsaXBDZW50cmVPZmZzZXRYICk7XHJcblxyXG4gICAgICAgIG1vdXRoLmJvdHRvbV9sZWZ0X2lubmVyX2NwMV9YID0gYmFzZU1vdXRoLmJvdHRvbV9sZWZ0X2lubmVyX2NwMV9YICsgKCBsaXBDZW50cmVPZmZzZXRYICogMC41ICk7XHJcbiAgICAgICAgbW91dGguYm90dG9tX2xlZnRfaW5uZXJfY3AyX1ggPSBiYXNlTW91dGguYm90dG9tX2xlZnRfaW5uZXJfY3AyX1ggKyAoIGxpcENlbnRyZU9mZnNldFggKiAwLjggKTtcclxuICAgICAgICBtb3V0aC5ib3R0b21fbGVmdF9vdXRlcl9jcDFfWCA9IGJhc2VNb3V0aC5ib3R0b21fbGVmdF9vdXRlcl9jcDFfWCArICggbGlwQ2VudHJlT2Zmc2V0WCAqIDAuNyApO1xyXG4gICAgICAgIG1vdXRoLmJvdHRvbV9sZWZ0X291dGVyX2NwMl9YID0gYmFzZU1vdXRoLmJvdHRvbV9sZWZ0X291dGVyX2NwMl9YICsgKCBsaXBDZW50cmVPZmZzZXRYICk7XHJcbiAgICAgICAgbW91dGguYm90dG9tX3JpZ2h0X2lubmVyX2NwMV9YID0gYmFzZU1vdXRoLmJvdHRvbV9yaWdodF9pbm5lcl9jcDFfWCArICggbGlwQ2VudHJlT2Zmc2V0WCAqIDAuNSApO1xyXG4gICAgICAgIG1vdXRoLmJvdHRvbV9yaWdodF9pbm5lcl9jcDJfWCA9IGJhc2VNb3V0aC5ib3R0b21fcmlnaHRfaW5uZXJfY3AyX1ggKyAoIGxpcENlbnRyZU9mZnNldFggKiAwLjggKTtcclxuICAgICAgICBtb3V0aC5ib3R0b21fcmlnaHRfb3V0ZXJfY3AxX1ggPSBiYXNlTW91dGguYm90dG9tX3JpZ2h0X291dGVyX2NwMV9YICsgKCBsaXBDZW50cmVPZmZzZXRYICogMC43ICk7XHJcbiAgICAgICAgbW91dGguYm90dG9tX3JpZ2h0X291dGVyX2NwMl9YID0gYmFzZU1vdXRoLmJvdHRvbV9yaWdodF9vdXRlcl9jcDJfWCArICggbGlwQ2VudHJlT2Zmc2V0WCApO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbW91dGgudG9wX2xlZnRfaW5uZXJfY3AxX1ggPSBiYXNlTW91dGgudG9wX2xlZnRfaW5uZXJfY3AxX1ggKyAoIGxpcENlbnRyZU9mZnNldFggKiAwLjUgKTtcclxuICAgICAgICBtb3V0aC50b3BfbGVmdF9pbm5lcl9jcDJfWCA9IGJhc2VNb3V0aC50b3BfbGVmdF9pbm5lcl9jcDJfWCArICggbGlwQ2VudHJlT2Zmc2V0WCAqIDAuOCApO1xyXG4gICAgICAgIG1vdXRoLnRvcF9sZWZ0X291dGVyX2NwMV9YID0gYmFzZU1vdXRoLnRvcF9sZWZ0X291dGVyX2NwMV9YICsgKCBsaXBDZW50cmVPZmZzZXRYICogMC41ICk7XHJcbiAgICAgICAgbW91dGgudG9wX2xlZnRfb3V0ZXJfY3AyX1ggPSBiYXNlTW91dGgudG9wX2xlZnRfb3V0ZXJfY3AyX1ggKyAoIGxpcENlbnRyZU9mZnNldFggKiAwLjggKTtcclxuICAgICAgICBtb3V0aC50b3BfcmlnaHRfaW5uZXJfY3AxX1ggPSBiYXNlTW91dGgudG9wX3JpZ2h0X2lubmVyX2NwMV9YICsgKCBsaXBDZW50cmVPZmZzZXRYICogMC41ICk7XHJcbiAgICAgICAgbW91dGgudG9wX3JpZ2h0X2lubmVyX2NwMl9YID0gYmFzZU1vdXRoLnRvcF9yaWdodF9pbm5lcl9jcDJfWCArICggbGlwQ2VudHJlT2Zmc2V0WCAqIDAuOCApO1xyXG4gICAgICAgIG1vdXRoLnRvcF9yaWdodF9vdXRlcl9jcDFfWCA9IGJhc2VNb3V0aC50b3BfcmlnaHRfb3V0ZXJfY3AxX1ggKyAoIGxpcENlbnRyZU9mZnNldFggKiAwLjUgKTtcclxuICAgICAgICBtb3V0aC50b3BfcmlnaHRfb3V0ZXJfY3AyX1ggPSBiYXNlTW91dGgudG9wX3JpZ2h0X291dGVyX2NwMl9YICsgKCBsaXBDZW50cmVPZmZzZXRYICogMC44ICk7XHJcblxyXG4gICAgICAgIG1vdXRoLmJvdHRvbV9sZWZ0X2lubmVyX2NwMV9YID0gYmFzZU1vdXRoLmJvdHRvbV9sZWZ0X2lubmVyX2NwMV9YICsgKCBsaXBDZW50cmVPZmZzZXRYICogMC41ICk7XHJcbiAgICAgICAgbW91dGguYm90dG9tX2xlZnRfaW5uZXJfY3AyX1ggPSBiYXNlTW91dGguYm90dG9tX2xlZnRfaW5uZXJfY3AyX1ggKyAoIGxpcENlbnRyZU9mZnNldFggKiAwLjggKTtcclxuICAgICAgICBtb3V0aC5ib3R0b21fbGVmdF9vdXRlcl9jcDFfWCA9IGJhc2VNb3V0aC5ib3R0b21fbGVmdF9vdXRlcl9jcDFfWCArICggbGlwQ2VudHJlT2Zmc2V0WCAqIDAuNSApO1xyXG4gICAgICAgIG1vdXRoLmJvdHRvbV9sZWZ0X291dGVyX2NwMl9YID0gYmFzZU1vdXRoLmJvdHRvbV9sZWZ0X291dGVyX2NwMl9YICsgKCBsaXBDZW50cmVPZmZzZXRYICogMC44ICk7XHJcbiAgICAgICAgbW91dGguYm90dG9tX3JpZ2h0X2lubmVyX2NwMV9YID0gYmFzZU1vdXRoLmJvdHRvbV9yaWdodF9pbm5lcl9jcDFfWCArICggbGlwQ2VudHJlT2Zmc2V0WCAqIDAuNSApO1xyXG4gICAgICAgIG1vdXRoLmJvdHRvbV9yaWdodF9pbm5lcl9jcDJfWCA9IGJhc2VNb3V0aC5ib3R0b21fcmlnaHRfaW5uZXJfY3AyX1ggKyAoIGxpcENlbnRyZU9mZnNldFggKiAwLjggKTtcclxuICAgICAgICBtb3V0aC5ib3R0b21fcmlnaHRfb3V0ZXJfY3AxX1ggPSBiYXNlTW91dGguYm90dG9tX3JpZ2h0X291dGVyX2NwMV9YICsgKCBsaXBDZW50cmVPZmZzZXRYICogMC41ICk7XHJcbiAgICAgICAgbW91dGguYm90dG9tX3JpZ2h0X291dGVyX2NwMl9YID0gYmFzZU1vdXRoLmJvdHRvbV9yaWdodF9vdXRlcl9jcDJfWCArICggbGlwQ2VudHJlT2Zmc2V0WCAqIDAuOCApO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBtb3V0aC50b3BfbGVmdF9pbm5lcl9jcDFfWCAtPSAoIHRvcExpcE9wZW5Nb2QgKiAwLjMgKSArIHRvcExpcExlZnRQdWxsO1xyXG4gICAgbW91dGgudG9wX2xlZnRfaW5uZXJfY3AyX1ggLT0gKCB0b3BMaXBPcGVuTW9kICogMC4yICkgKyAoIHRvcExpcExlZnRQdWxsICogMC4yICk7XHJcbiAgICBtb3V0aC50b3BfbGVmdF9vdXRlcl9jcDFfWCAtPSB0b3BMaXBPcGVuTW9kICsgdG9wTGlwTGVmdFB1bGw7XHJcbiAgICBtb3V0aC50b3BfbGVmdF9vdXRlcl9jcDJfWCAtPSAoIHRvcExpcE9wZW5Nb2QgKiAwLjIgKSArICggdG9wTGlwTGVmdFB1bGwgKiAwLjUgKTtcclxuXHJcbiAgICBtb3V0aC50b3BfbGVmdF9pbm5lcl9jcDFfWCAtPSAoIGphd09wZW4gKiAwLjMgKTtcclxuICAgIG1vdXRoLnRvcF9sZWZ0X291dGVyX2NwMV9YIC09ICggamF3T3BlbiAqIDAuMyApO1xyXG4gICAgbW91dGgudG9wX2xlZnRfb3V0ZXJfY3AyX1ggLT0gKCBqYXdPcGVuICogMC4yICk7XHJcblxyXG4gICAgbW91dGgudG9wX3JpZ2h0X2lubmVyX2NwMV9YICs9ICggdG9wTGlwT3Blbk1vZCAqIDAuMyApICsgdG9wTGlwUmlnaHRQdWxsO1xyXG4gICAgbW91dGgudG9wX3JpZ2h0X2lubmVyX2NwMl9YICs9ICggdG9wTGlwT3Blbk1vZCAqIDAuMiApICsgKCB0b3BMaXBSaWdodFB1bGwgKiAwLjIgKTtcclxuICAgIG1vdXRoLnRvcF9yaWdodF9vdXRlcl9jcDFfWCArPSB0b3BMaXBPcGVuTW9kICsgdG9wTGlwUmlnaHRQdWxsO1xyXG4gICAgbW91dGgudG9wX3JpZ2h0X291dGVyX2NwMl9YICs9ICggdG9wTGlwT3Blbk1vZCAqIDAuMiApICsgKCB0b3BMaXBSaWdodFB1bGwgKiAwLjUgKTtcclxuXHJcbiAgICBtb3V0aC50b3BfcmlnaHRfaW5uZXJfY3AxX1ggKz0gKCBqYXdPcGVuICogMC4zICk7XHJcbiAgICBtb3V0aC50b3BfcmlnaHRfb3V0ZXJfY3AxX1ggKz0gKCBqYXdPcGVuICogMC4zICk7XHJcbiAgICBtb3V0aC50b3BfcmlnaHRfb3V0ZXJfY3AyX1ggKz0gKCBqYXdPcGVuICogMC4yICk7XHJcblxyXG4gICAgbW91dGgudG9wX291dGVyX2FuY2hvcl9ZIC09IGphd09wZW4gKiAwLjA1O1xyXG5cclxuICAgIFxyXG5cclxuICAgIG1vdXRoLmJvdHRvbV9sZWZ0X2lubmVyX2NwMV9ZID0gYmFzZU1vdXRoLmJvdHRvbV9sZWZ0X2lubmVyX2NwMV9ZICsgKCBsZWZ0Q2hlZWtNb2QgKiAwLjMgKSArICggamF3T3BlbiAqIDAuOCApICsgKCBib3R0b21MaXBPcGVuTW9kICogMC45ICk7XHJcbiAgICBtb3V0aC5ib3R0b21fbGVmdF9pbm5lcl9jcDJfWSA9IGJhc2VNb3V0aC5ib3R0b21fbGVmdF9pbm5lcl9jcDJfWSArICggbGVmdENoZWVrTW9kICogMC4yICkgKyAoIGphd09wZW4gKiAwLjggKSArICggYm90dG9tTGlwT3Blbk1vZCAqIDAuOCApO1xyXG4gICAgbW91dGguYm90dG9tX3JpZ2h0X2lubmVyX2NwMV9ZID0gYmFzZU1vdXRoLmJvdHRvbV9yaWdodF9pbm5lcl9jcDFfWSArICggcmlnaHRDaGVla01vZCAqIDAuMyApICsgKCBqYXdPcGVuICogMC44ICkgKyAoIGJvdHRvbUxpcE9wZW5Nb2QgKiAwLjkgKTtcclxuICAgIG1vdXRoLmJvdHRvbV9yaWdodF9pbm5lcl9jcDJfWSA9IGJhc2VNb3V0aC5ib3R0b21fcmlnaHRfaW5uZXJfY3AyX1kgKyAoIHJpZ2h0Q2hlZWtNb2QgKiAwLjIgKSArICggamF3T3BlbiAqIDAuOCApICsgKCBib3R0b21MaXBPcGVuTW9kICogMC44ICk7XHJcblxyXG4gICAgLy8gbW91dGguYm90dG9tX2lubmVyX2FuY2hvcl9ZID0gYmFzZU1vdXRoLmJvdHRvbV9pbm5lcl9hbmNob3JfWSArICggamF3T3BlbiAqIDAuOCApICsgKCBib3R0b21MaXBPcGVuTW9kICogMC44ICk7XHJcbiAgICAvLyBtb3V0aC5ib3R0b21fb3V0ZXJfYW5jaG9yX1kgPSBiYXNlTW91dGguYm90dG9tX291dGVyX2FuY2hvcl9ZICsgKCBqYXdPcGVuICogMC44ICkgKyAoIGJvdHRvbUxpcE9wZW5Nb2QgKiAwLjggKTtcclxuXHJcbiAgICBtb3V0aC5ib3R0b21fbGVmdF9vdXRlcl9jcDFfWSA9IGJhc2VNb3V0aC5ib3R0b21fbGVmdF9vdXRlcl9jcDFfWSArICggbGVmdENoZWVrTW9kICogMC4zICkgKyAoIGphd09wZW4gKiAwLjggKSArICggYm90dG9tTGlwT3Blbk1vZCAqIDAuOSApO1xyXG4gICAgbW91dGguYm90dG9tX2xlZnRfb3V0ZXJfY3AyX1kgPSBiYXNlTW91dGguYm90dG9tX2xlZnRfb3V0ZXJfY3AyX1kgKyAoIGxlZnRDaGVla01vZCAqIDAuMiApICsgKCBqYXdPcGVuICogMC44ICkgKyAoIGJvdHRvbUxpcE9wZW5Nb2QgKiAwLjggKTtcclxuICAgIG1vdXRoLmJvdHRvbV9yaWdodF9vdXRlcl9jcDFfWSA9IGJhc2VNb3V0aC5ib3R0b21fcmlnaHRfb3V0ZXJfY3AxX1kgKyAoIHJpZ2h0Q2hlZWtNb2QgKiAwLjMgKSArICggamF3T3BlbiAqIDAuOCApICsgKCBib3R0b21MaXBPcGVuTW9kICogMC45ICk7XHJcbiAgICBtb3V0aC5ib3R0b21fcmlnaHRfb3V0ZXJfY3AyX1kgPSBiYXNlTW91dGguYm90dG9tX3JpZ2h0X291dGVyX2NwMl9ZICsgKCByaWdodENoZWVrTW9kICogMC4yICkgKyAoIGphd09wZW4gKiAwLjggKSArICAoIGJvdHRvbUxpcE9wZW5Nb2QgKiAwLjggKTtcclxuXHJcbiAgICBsZXQgYm90dG9tTGlwQ2VudHJlQW5jaG9yTm9ybWFsaXNlID0gKCBtb3V0aC5ib3R0b21fbGVmdF9pbm5lcl9jcDJfWSAtIG1vdXRoLmJvdHRvbV9yaWdodF9pbm5lcl9jcDJfWSApIC8gMjtcclxuXHJcbiAgICBtb3V0aC5ib3R0b21faW5uZXJfYW5jaG9yX1kgPSBiYXNlTW91dGguYm90dG9tX2lubmVyX2FuY2hvcl9ZICsgKCBjaGVla3NOb3JtYWxpc2VkICogMC4zICkgKyAoIGphd09wZW4gKiAwLjggKSArICggYm90dG9tTGlwT3Blbk1vZCAqIDAuOCApICsgYm90dG9tTGlwQ2VudHJlQW5jaG9yTm9ybWFsaXNlO1xyXG4gICAgbW91dGguYm90dG9tX291dGVyX2FuY2hvcl9ZID0gYmFzZU1vdXRoLmJvdHRvbV9vdXRlcl9hbmNob3JfWSArICggY2hlZWtzTm9ybWFsaXNlZCAqIDAuMyApICsgKCBqYXdPcGVuICogMC44ICkgKyAoIGJvdHRvbUxpcE9wZW5Nb2QgKiAwLjggKSArIGJvdHRvbUxpcENlbnRyZUFuY2hvck5vcm1hbGlzZTtcclxuXHJcblxyXG4gICAgbW91dGguYm90dG9tX2xlZnRfaW5uZXJfY3AxX1kgKz0gKCAoIGJvdHRvbUxpcExlZnRQdWxsICogMC43ICkgKiBqYXdSZXZlcnNlSW5kZXggKTtcclxuICAgIG1vdXRoLmJvdHRvbV9sZWZ0X2lubmVyX2NwMl9ZICs9ICggKCBib3R0b21MaXBMZWZ0UHVsbCAqIDAuNSApICogamF3UmV2ZXJzZUluZGV4ICk7XHJcbiAgICBtb3V0aC5ib3R0b21fbGVmdF9vdXRlcl9jcDFfWSArPSAoICggYm90dG9tTGlwTGVmdFB1bGwgKiAwLjcgKSAqIGphd1JldmVyc2VJbmRleCApO1xyXG4gICAgbW91dGguYm90dG9tX2xlZnRfb3V0ZXJfY3AyX1kgKz0gKCAoIGJvdHRvbUxpcExlZnRQdWxsICogMC41ICkgKiBqYXdSZXZlcnNlSW5kZXggKTtcclxuXHJcbiAgICBtb3V0aC5ib3R0b21fcmlnaHRfaW5uZXJfY3AxX1kgKz0gKCAoIGJvdHRvbUxpcFJpZ2h0UHVsbCAqIDAuNyApICogamF3UmV2ZXJzZUluZGV4ICk7XHJcbiAgICBtb3V0aC5ib3R0b21fcmlnaHRfaW5uZXJfY3AyX1kgKz0gKCAoIGJvdHRvbUxpcFJpZ2h0UHVsbCAqIDAuNSApICogamF3UmV2ZXJzZUluZGV4ICk7XHJcbiAgICBtb3V0aC5ib3R0b21fcmlnaHRfb3V0ZXJfY3AxX1kgKz0gKCAoIGJvdHRvbUxpcFJpZ2h0UHVsbCAqIDAuNyApICogamF3UmV2ZXJzZUluZGV4ICk7XHJcbiAgICBtb3V0aC5ib3R0b21fcmlnaHRfb3V0ZXJfY3AyX1kgKz0gKCAoIGJvdHRvbUxpcFJpZ2h0UHVsbCAqIDAuNSApICogamF3UmV2ZXJzZUluZGV4ICk7XHJcblxyXG5cclxuICAgIG1vdXRoLmJvdHRvbV9sZWZ0X2lubmVyX2NwMV9YIC09ICggYm90dG9tTGlwTGVmdFB1bGwgKiAoIDEuMyArICggMC42ICogamF3UmV2ZXJzZUluZGV4ICkgKSApO1xyXG4gICAgbW91dGguYm90dG9tX2xlZnRfaW5uZXJfY3AyX1ggLT0gKCBib3R0b21MaXBMZWZ0UHVsbCAqIDAuNSApO1xyXG4gICAgbW91dGguYm90dG9tX2xlZnRfb3V0ZXJfY3AxX1ggLT0gKCBib3R0b21MaXBMZWZ0UHVsbCAqICggMS4zICsgKCAwLjYgKiBqYXdSZXZlcnNlSW5kZXggKSApICk7XHJcbiAgICBtb3V0aC5ib3R0b21fbGVmdF9vdXRlcl9jcDJfWCAtPSAoIGJvdHRvbUxpcExlZnRQdWxsICogMC41ICk7XHJcblxyXG4gICAgbW91dGguYm90dG9tX3JpZ2h0X2lubmVyX2NwMV9YICs9ICggYm90dG9tTGlwUmlnaHRQdWxsICogKCAxLjMgKyAoIDAuNiAqIGphd1JldmVyc2VJbmRleCApICkgKTtcclxuICAgIG1vdXRoLmJvdHRvbV9yaWdodF9pbm5lcl9jcDJfWCArPSAoIGJvdHRvbUxpcFJpZ2h0UHVsbCAqIDAuNSApO1xyXG4gICAgbW91dGguYm90dG9tX3JpZ2h0X291dGVyX2NwMV9YICs9ICggYm90dG9tTGlwUmlnaHRQdWxsICogKCAxLjMgKyAoIDAuNiAqIGphd1JldmVyc2VJbmRleCApICkgKTtcclxuICAgIG1vdXRoLmJvdHRvbV9yaWdodF9vdXRlcl9jcDJfWCArPSAoIGJvdHRvbUxpcFJpZ2h0UHVsbCAqIDAuNSApO1xyXG5cclxuXHJcbiAgICAvLyBjb21wdXRlIGN1cnZlIGVuZCBwb2ludHMgYWZ0ZXIgY29udHJvbCBwb2ludHMgdG8gYXZlcmFnZSBvdXQgY3VydmVzIGluIHRoZSBtb3V0aFxyXG4gICAgLy8gc3RvcHMgcmVzdWx0aW5nIG1vdXRoIHNoYXBlIGxvb2tpbmcgbGlrZSBhbiBleHRyZW1lIGZpZ3VyZSBvZiBlaWdodFxyXG4gICAgdmFyIGxpcEVkZ2VQYXJ0aW5nTWF4ID0gcG0ucjE2ICsgcG0ucjMyICsgcG0ucjY0O1xyXG4gICAgdmFyIGxpcE1heEl0ZXJhdGlvbnMgPSA4MDtcclxuICAgIHZhciBsZWZ0TGlwRWRnZVBhcnRpbmcgPSAwO1xyXG4gICAgdmFyIGxlZnRJbm5lckxpcERpc3QgPSBtb3V0aC5ib3R0b21fbGVmdF9pbm5lcl9jcDFfWSAtIG1vdXRoLnRvcF9sZWZ0X2lubmVyX2NwMV9ZO1xyXG4gICAgbGV0IGxlZnRJbm5lckxpcERpc3RXZWlnaHRlZCA9IGxlZnRJbm5lckxpcERpc3QgKiAwLjE7XHJcbiAgICBsZXQgbGVmdEVkZ2VDdHJsUE9mZnNldCA9ICggbW91dGgubGVmdF9pbm5lcl9hbmNob3JfWCAtICggbW91dGgudG9wX2xlZnRfaW5uZXJfY3AxX1ggKyBtb3V0aC5ib3R0b21fbGVmdF9pbm5lcl9jcDFfWCApIC8gMiApIC8gMjtcclxuICAgIC8vIGNvbnNvbGUubG9nKCAnbW91dGguYm90dG9tX2xlZnRfaW5uZXJfY3AxX1kgLSBtb3V0aC50b3BfbGVmdF9pbm5lcl9jcDFfWTogJywgbW91dGguYm90dG9tX2xlZnRfaW5uZXJfY3AxX1kgLSBtb3V0aC50b3BfbGVmdF9pbm5lcl9jcDFfWSApO1xyXG4gICAgaWYgKCBsZWZ0SW5uZXJMaXBEaXN0ID09PSAwICkge1xyXG4gICAgICAgIGxlZnRMaXBFZGdlUGFydGluZyA9IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICggbGVmdElubmVyTGlwRGlzdCA+IGxpcE1heEl0ZXJhdGlvbnMgKSB7XHJcbiAgICAgICAgICAgIGxlZnRMaXBFZGdlUGFydGluZyA9IGxpcEVkZ2VQYXJ0aW5nTWF4O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxlZnRMaXBFZGdlUGFydGluZyA9IGVhc2luZy5lYXNlT3V0UXVhcnQoIGxlZnRJbm5lckxpcERpc3QsIDAsIGxpcEVkZ2VQYXJ0aW5nTWF4LCBsaXBNYXhJdGVyYXRpb25zICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbW91dGgubGVmdF9vdXRlcl9hbmNob3JfWCAtPSBsZWZ0RWRnZUN0cmxQT2Zmc2V0O1xyXG4gICAgbW91dGgubGVmdF9pbm5lcl9hbmNob3JfWCAtPSBsZWZ0RWRnZUN0cmxQT2Zmc2V0O1xyXG4gICAgbW91dGgubGVmdF9pbm5lcl9hbmNob3JfWCAtPSBsZWZ0TGlwRWRnZVBhcnRpbmc7XHJcblxyXG4gICAgdmFyIHJpZ2h0TGlwRWRnZVBhcnRpbmcgPSAwO1xyXG4gICAgdmFyIHJpZ2h0SW5uZXJMaXBEaXN0ID0gbW91dGguYm90dG9tX3JpZ2h0X2lubmVyX2NwMV9ZIC0gbW91dGgudG9wX3JpZ2h0X2lubmVyX2NwMV9ZO1xyXG4gICAgbGV0IHJpZ2h0SW5uZXJMaXBEaXN0V2VpZ2h0ZWQgPSByaWdodElubmVyTGlwRGlzdCAqIDAuMTtcclxuICAgIGxldCByaWdodEVkZ2VDdHJsUE9mZnNldCA9ICggbW91dGgucmlnaHRfaW5uZXJfYW5jaG9yX1ggLSAoIG1vdXRoLnRvcF9yaWdodF9pbm5lcl9jcDFfWCArIG1vdXRoLmJvdHRvbV9yaWdodF9pbm5lcl9jcDFfWCApIC8gMiApIC8gMjtcclxuXHJcbiAgICBpZiAoIHJpZ2h0SW5uZXJMaXBEaXN0ID09PSAwICkge1xyXG4gICAgICAgIHJpZ2h0TGlwRWRnZVBhcnRpbmcgPSAwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoIHJpZ2h0SW5uZXJMaXBEaXN0ID4gbGlwTWF4SXRlcmF0aW9ucyApIHtcclxuICAgICAgICAgICAgcmlnaHRMaXBFZGdlUGFydGluZyA9IGxpcEVkZ2VQYXJ0aW5nTWF4O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJpZ2h0TGlwRWRnZVBhcnRpbmcgPSBlYXNpbmcuZWFzZU91dFF1YXJ0KCByaWdodElubmVyTGlwRGlzdCwgMCwgbGlwRWRnZVBhcnRpbmdNYXgsIGxpcE1heEl0ZXJhdGlvbnMgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBtb3V0aC5yaWdodF9pbm5lcl9hbmNob3JfWCAtPSByaWdodEVkZ2VDdHJsUE9mZnNldDtcclxuICAgIG1vdXRoLnJpZ2h0X291dGVyX2FuY2hvcl9YIC09IHJpZ2h0RWRnZUN0cmxQT2Zmc2V0O1xyXG4gICAgbW91dGgucmlnaHRfaW5uZXJfYW5jaG9yX1ggKz0gcmlnaHRMaXBFZGdlUGFydGluZztcclxuXHJcbiAgICBsZXQgbGVmdENoZWVrTW91dGhFZGdlSW5mbHVlbmNlID0gbGVmdENoZWVrTW9kIDwgMCA/IDAuNCA6IDAuMTtcclxuICAgIGxldCByaWdodENoZWVrTW91dGhFZGdlSW5mbHVlbmNlID0gcmlnaHRDaGVla01vZCA8IDAgPyAwLjQgOiAwLjE7XHJcbiAgICBtb3V0aC5sZWZ0X291dGVyX2FuY2hvcl9ZID0gYmFzZU1vdXRoLmxlZnRfb3V0ZXJfYW5jaG9yX1kgKyAoIGxlZnRDaGVla01vZCAqIGxlZnRDaGVla01vdXRoRWRnZUluZmx1ZW5jZSApICsgKCBqYXdPcGVuICogMC4yNSApICArICggKCBsZWZ0SW5uZXJMaXBEaXN0V2VpZ2h0ZWQgKiBib3R0b21MaXBMZWZ0UHVsbEluZGV4ICkgKiBqYXdJbmRleCk7XHJcbiAgICBtb3V0aC5sZWZ0X2lubmVyX2FuY2hvcl9ZID0gYmFzZU1vdXRoLmxlZnRfaW5uZXJfYW5jaG9yX1kgKyAoIGxlZnRDaGVla01vZCAqIGxlZnRDaGVla01vdXRoRWRnZUluZmx1ZW5jZSApICsgKCBqYXdPcGVuICogMC4yNSApICArICggKCBsZWZ0SW5uZXJMaXBEaXN0V2VpZ2h0ZWQgKiBib3R0b21MaXBMZWZ0UHVsbEluZGV4ICkgKiBqYXdJbmRleCk7XHJcbiAgICBtb3V0aC5yaWdodF9vdXRlcl9hbmNob3JfWSA9IGJhc2VNb3V0aC5yaWdodF9vdXRlcl9hbmNob3JfWSArICggcmlnaHRDaGVla01vZCAqIHJpZ2h0Q2hlZWtNb3V0aEVkZ2VJbmZsdWVuY2UgKSArICggamF3T3BlbiAqIDAuMjUgKSArICggKCByaWdodElubmVyTGlwRGlzdFdlaWdodGVkICogYm90dG9tTGlwUmlnaHRQdWxsSW5kZXggKSAqIGphd0luZGV4KTtcclxuICAgIG1vdXRoLnJpZ2h0X2lubmVyX2FuY2hvcl9ZID0gYmFzZU1vdXRoLnJpZ2h0X2lubmVyX2FuY2hvcl9ZICsgKCByaWdodENoZWVrTW9kICogcmlnaHRDaGVla01vdXRoRWRnZUluZmx1ZW5jZSApICsgKCBqYXdPcGVuICogMC4yNSApICsgKCAoIHJpZ2h0SW5uZXJMaXBEaXN0V2VpZ2h0ZWQgKiBib3R0b21MaXBSaWdodFB1bGxJbmRleCApICogamF3SW5kZXggKTtcclxuXHJcbiAgICBsZXQgbW91dGhFZGdlTGVmdEV4dGVuZEFic29sdXRlID0gbW91dGhFZGdlTGVmdEV4dGVuZCA8PSAwID8gbW91dGhFZGdlTGVmdEV4dGVuZCAqIC0xIDogbW91dGhFZGdlTGVmdEV4dGVuZDtcclxuICAgIGxldCBtb3V0aEVkZ2VSaWdodEV4dGVuZEFic29sdXRlID0gbW91dGhFZGdlUmlnaHRFeHRlbmQgPD0gMCA/IG1vdXRoRWRnZVJpZ2h0RXh0ZW5kICogLTEgOiBtb3V0aEVkZ2VSaWdodEV4dGVuZDtcclxuXHJcbiAgICBtb3V0aC5sZWZ0X2lubmVyX2FuY2hvcl9ZICs9IG1vdXRoRWRnZUxlZnRFeHRlbmQgKiAwLjM7XHJcbiAgICBtb3V0aC5sZWZ0X2lubmVyX2FuY2hvcl9YIC09IG1vdXRoRWRnZUxlZnRFeHRlbmRBYnNvbHV0ZSAqIDAuMztcclxuICAgIG1vdXRoLmxlZnRfb3V0ZXJfYW5jaG9yX1kgKz0gbW91dGhFZGdlTGVmdEV4dGVuZCAqIDAuNztcclxuICAgIFxyXG5cclxuICAgIG1vdXRoLnRvcF9sZWZ0X2lubmVyX2NwMV9YIC09IG1vdXRoRWRnZUxlZnRFeHRlbmRBYnNvbHV0ZSAqIDAuMztcclxuICAgIG1vdXRoLmJvdHRvbV9sZWZ0X2lubmVyX2NwMV9YIC09IG1vdXRoRWRnZUxlZnRFeHRlbmRBYnNvbHV0ZSAqIDAuMztcclxuICAgIG1vdXRoLnRvcF9sZWZ0X2lubmVyX2NwMl9YIC09IG1vdXRoRWRnZUxlZnRFeHRlbmRBYnNvbHV0ZSAqIDAuMztcclxuICAgIG1vdXRoLmJvdHRvbV9sZWZ0X2lubmVyX2NwMl9YIC09IG1vdXRoRWRnZUxlZnRFeHRlbmRBYnNvbHV0ZSAqIDAuMztcclxuXHJcbiAgICBtb3V0aC50b3BfbGVmdF9vdXRlcl9jcDFfWCAtPSBtb3V0aEVkZ2VMZWZ0RXh0ZW5kQWJzb2x1dGUgKiAwLjM7XHJcblxyXG4gICAgbW91dGgucmlnaHRfaW5uZXJfYW5jaG9yX1kgKz0gbW91dGhFZGdlUmlnaHRFeHRlbmQgKiAwLjM7XHJcbiAgICBtb3V0aC5yaWdodF9pbm5lcl9hbmNob3JfWCArPSBtb3V0aEVkZ2VSaWdodEV4dGVuZEFic29sdXRlICogMC4zO1xyXG4gICAgbW91dGgucmlnaHRfb3V0ZXJfYW5jaG9yX1kgKz0gbW91dGhFZGdlUmlnaHRFeHRlbmQgKiAwLjc7XHJcblxyXG4gICAgbW91dGgudG9wX3JpZ2h0X291dGVyX2NwMV9YICs9IG1vdXRoRWRnZVJpZ2h0RXh0ZW5kQWJzb2x1dGUgKiAwLjM7XHJcblxyXG4gICAgbW91dGgudG9wX3JpZ2h0X2lubmVyX2NwMV9YICs9IG1vdXRoRWRnZVJpZ2h0RXh0ZW5kQWJzb2x1dGUgKiAwLjM7XHJcbiAgICBtb3V0aC5ib3R0b21fcmlnaHRfaW5uZXJfY3AxX1ggKz0gbW91dGhFZGdlUmlnaHRFeHRlbmRBYnNvbHV0ZSAqIDAuMztcclxuICAgIG1vdXRoLnRvcF9yaWdodF9pbm5lcl9jcDJfWCArPSBtb3V0aEVkZ2VSaWdodEV4dGVuZEFic29sdXRlICogMC4zO1xyXG4gICAgbW91dGguYm90dG9tX3JpZ2h0X2lubmVyX2NwMl9YICs9IG1vdXRoRWRnZVJpZ2h0RXh0ZW5kQWJzb2x1dGUgKiAwLjM7XHJcblxyXG4gICAgaWYgKCBtb3V0aEVkZ2VMZWZ0RXh0ZW5kID4gMCAmJiBtb3V0aEVkZ2VSaWdodEV4dGVuZCA+IDAgKSB7XHJcbiAgICAgICAgbW91dGguYm90dG9tX291dGVyX2FuY2hvcl9ZIC09ICggbW91dGhFZGdlTGVmdEV4dGVuZCArIG1vdXRoRWRnZVJpZ2h0RXh0ZW5kICkgLyAyO1xyXG4gICAgfVxyXG4gICAgXHJcblxyXG5cclxuICAgIG1vdXRoLnRvcF9sZWZ0X291dGVyX2NwMV9YICs9ICggbGlwc1B1Y2tlciAqIDAuNiApICogamF3UmV2ZXJzZUluZGV4O1xyXG4gICAgLy8gbW91dGgudG9wX2xlZnRfb3V0ZXJfY3AxX1kgLT0gbGlwc1B1Y2tlciAqIDAuNDtcclxuICAgIG1vdXRoLnRvcF9sZWZ0X291dGVyX2NwMl9YIC09ICggbGlwc1B1Y2tlciAqIDEuNCApICogamF3UmV2ZXJzZUluZGV4O1xyXG4gICAgbW91dGgudG9wX2xlZnRfb3V0ZXJfY3AyX1kgLT0gKCBsaXBzUHVja2VyICogMC40ICkgKiBqYXdSZXZlcnNlSW5kZXg7XHJcblxyXG4gICAgbW91dGgudG9wX291dGVyX2FuY2hvcl9ZIC09ICggbGlwc1B1Y2tlciAqIDAuNCApICogamF3UmV2ZXJzZUluZGV4O1xyXG5cclxuICAgIG1vdXRoLnRvcF9yaWdodF9vdXRlcl9jcDFfWCAtPSAoIGxpcHNQdWNrZXIgKiAwLjYgKSAqIGphd1JldmVyc2VJbmRleDtcclxuICAgIC8vIG1vdXRoLnRvcF9yaWdodF9vdXRlcl9jcDFfWSAtPSBsaXBzUHVja2VyICogMC40O1xyXG4gICAgbW91dGgudG9wX3JpZ2h0X291dGVyX2NwMl9YICs9ICggbGlwc1B1Y2tlciAqIDEuNCApICogamF3UmV2ZXJzZUluZGV4O1xyXG4gICAgbW91dGgudG9wX3JpZ2h0X291dGVyX2NwMl9ZIC09ICggbGlwc1B1Y2tlciAqIDAuNCApICogamF3UmV2ZXJzZUluZGV4O1xyXG5cclxuICAgIG1vdXRoLmJvdHRvbV9sZWZ0X291dGVyX2NwMV9YICs9ICggbGlwc1B1Y2tlciApICogamF3UmV2ZXJzZUluZGV4O1xyXG4gICAgbW91dGguYm90dG9tX2xlZnRfb3V0ZXJfY3AxX1kgLT0gKCBsaXBzUHVja2VyICogMC42ICkgKiBqYXdSZXZlcnNlSW5kZXg7XHJcbiAgICBtb3V0aC5ib3R0b21fbGVmdF9vdXRlcl9jcDJfWCAtPSAoIGxpcHNQdWNrZXIgKiAxLjQgKSAqIGphd1JldmVyc2VJbmRleDtcclxuICAgIG1vdXRoLmJvdHRvbV9sZWZ0X291dGVyX2NwMl9ZICs9ICggbGlwc1B1Y2tlciAqIDAuMyApICogamF3UmV2ZXJzZUluZGV4O1xyXG5cclxuICAgIG1vdXRoLmJvdHRvbV9yaWdodF9vdXRlcl9jcDFfWCAtPSAoIGxpcHNQdWNrZXIgKSAqIGphd1JldmVyc2VJbmRleDtcclxuICAgIG1vdXRoLmJvdHRvbV9yaWdodF9vdXRlcl9jcDFfWSAtPSAoIGxpcHNQdWNrZXIgKiAwLjYgKSAqIGphd1JldmVyc2VJbmRleDtcclxuICAgIG1vdXRoLmJvdHRvbV9yaWdodF9vdXRlcl9jcDJfWCArPSAoIGxpcHNQdWNrZXIgKiAxLjQgKSAqIGphd1JldmVyc2VJbmRleDtcclxuICAgIG1vdXRoLmJvdHRvbV9yaWdodF9vdXRlcl9jcDJfWSArPSAoIGxpcHNQdWNrZXIgKiAwLjMgKSAqIGphd1JldmVyc2VJbmRleDtcclxuXHJcblxyXG4gICAgdmFyIG1vdXRoR3JhZGllbnRzVG9wID0gZmFjZUNvb3Jkcy5ncmFkaWVudHMudG9wTGlwO1xyXG4gICAgdmFyIG1vdXRoR3JhZGllbnRzQm90dG9tID0gZmFjZUNvb3Jkcy5ncmFkaWVudHMuYm90dG9tTGlwO1xyXG5cclxuICAgIG1vdXRoR3JhZGllbnRzVG9wLnRvcF9ZID0gbW91dGgubGVmdF9pbm5lcl9hbmNob3JfWSAtIHBtLnIxNjtcclxuICAgIG1vdXRoR3JhZGllbnRzVG9wLmJvdHRvbV9ZID0gbW91dGgubGVmdF9pbm5lcl9hbmNob3JfWTtcclxuICAgIC8vIG1vdXRoR3JhZGllbnRzVG9wLnRvcF9vcGFjaXR5ID0gMC4yICogamF3SW5kZXg7XHJcbiAgICAvLyBtb3V0aEdyYWRpZW50c1RvcC5ib3R0b21fb3BhY2l0eSA9IDEgLSAoIDAuNCAqIGphd0luZGV4ICk7XHJcbiAgICBtb3V0aEdyYWRpZW50c1RvcC50b3Bfb3BhY2l0eSA9IDAuMiAtICggMC4yICogamF3SW5kZXggKTtcclxuICAgIG1vdXRoR3JhZGllbnRzVG9wLmJvdHRvbV9vcGFjaXR5ID0gMSAtICggMC4zICogamF3SW5kZXggKTtcclxuICAgIG1vdXRoR3JhZGllbnRzQm90dG9tLnRvcF9ZID0gbW91dGguYm90dG9tX2lubmVyX2FuY2hvcl9ZO1xyXG4gICAgbW91dGhHcmFkaWVudHNCb3R0b20uYm90dG9tX1kgPSBtb3V0aC5ib3R0b21fb3V0ZXJfYW5jaG9yX1k7XHJcbiAgICBtb3V0aEdyYWRpZW50c1RvcC50b3Bfb3BhY2l0eSA9IDAuNCAtICggMC4yICogamF3SW5kZXggKTtcclxuICAgIG1vdXRoR3JhZGllbnRzVG9wLmJvdHRvbV9vcGFjaXR5ID0gMC4yO1xyXG5cclxuICAgIGxldCBqYXdDb2xNb2RpZmllciA9IGphd0luZGV4ID4gMC41ID8gMSA6IGphd0luZGV4ICogMjtcclxuICAgIGxldCB0ZWV0aFNoYWRvd0NvbG91ciA9IGZhY2VDb29yZHMuZ3JhZGllbnRzLnRlZXRoU2hhZG93O1xyXG4gICAgdGVldGhTaGFkb3dDb2xvdXIuY3Vyci5yID0gICggKCB0ZWV0aFNoYWRvd0NvbG91ci5yIC8gNCApICogMyApICsgKCAoIHRlZXRoU2hhZG93Q29sb3VyLnIgLyA0ICkgKiBqYXdDb2xNb2RpZmllciApO1xyXG4gICAgdGVldGhTaGFkb3dDb2xvdXIuY3Vyci5nID0gKCAoIHRlZXRoU2hhZG93Q29sb3VyLmcgLyA0ICkgKiAzICkgKyAoICggdGVldGhTaGFkb3dDb2xvdXIuZyAvIDQgKSAqIGphd0NvbE1vZGlmaWVyICk7XHJcbiAgICB0ZWV0aFNoYWRvd0NvbG91ci5jdXJyLmIgPSAoICggdGVldGhTaGFkb3dDb2xvdXIuYiAvIDQgKSAqIDMgKSArICggKCB0ZWV0aFNoYWRvd0NvbG91ci5iIC8gNCApICogamF3Q29sTW9kaWZpZXIgKTtcclxuXHJcbiAgICAvLyBub3NlXHJcbiAgICAvLy8vLy8vLy8vLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqLy8vLy8vLy8vLy8vL1xyXG4gICAgbm9zZS5wb2ludDJZID0gYmFzZU5vc2UucG9pbnQyWSArIG5vc3RyaWxMZWZ0UmFpc2U7XHJcbiAgICBub3NlLnBvaW50M1kgPSBiYXNlTm9zZS5wb2ludDNZICsgbm9zdHJpbFJpZ2h0UmFpc2U7XHJcblxyXG4gICAgbm9zZS5wb2ludDJYID0gYmFzZU5vc2UucG9pbnQyWCArICggbGlwQ2VudHJlT2Zmc2V0WCAqIDAuNSApIC0gbm9zdHJpbExlZnRGbGFyZTtcclxuICAgIG5vc2UuaGFuZGxlMlggPSBiYXNlTm9zZS5oYW5kbGUyWCArICggbGlwQ2VudHJlT2Zmc2V0WCAqIDAuNSApO1xyXG4gICAgbm9zZS5wb2ludDNYID0gYmFzZU5vc2UucG9pbnQzWCArICggbGlwQ2VudHJlT2Zmc2V0WCAqIDAuNSApICsgbm9zdHJpbFJpZ2h0RmxhcmU7XHJcblxyXG5cclxuICAgIC8vIGxpcCBsaW5lXHJcbiAgICAvLy8vLy8vLy8vLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqLy8vLy8vLy8vLy8vL1xyXG4gICAgbGlwLnBvaW50MVggPSBiYXNlTGlwLnBvaW50MVggKyBsaXBDZW50cmVPZmZzZXRYICsgKCBqYXdMYXRlcmFsICogMC42ICk7XHJcbiAgICBsaXAuaGFuZGxlMVggPSBiYXNlTGlwLmhhbmRsZTFYICsgbGlwQ2VudHJlT2Zmc2V0WCArICggamF3TGF0ZXJhbCAqIDAuNiApO1xyXG4gICAgbGlwLnBvaW50MlggPSBiYXNlTGlwLnBvaW50MlggKyBsaXBDZW50cmVPZmZzZXRYICsgKCBqYXdMYXRlcmFsICogMC42ICk7XHJcblxyXG4gICAgbGlwLnBvaW50MVkgPSBiYXNlTGlwLnBvaW50MVkgKyAoIGxlZnRDaGVla01vZCAqIDAuMyApICsgbm9zdHJpbFJpZ2h0UmFpc2U7XHJcbiAgICBsaXAuaGFuZGxlMVkgPSBiYXNlTGlwLmhhbmRsZTFZICsgY2hlZWtzTm9ybWFsaXNlZDtcclxuICAgIGxpcC5wb2ludDJZID0gYmFzZUxpcC5wb2ludDJZICsgKCByaWdodENoZWVrTW9kICogMC4zICkgKyBub3N0cmlsUmlnaHRSYWlzZTtcclxuXHJcbiAgICBsaXAucG9pbnQxWSArPSAoIGJvdHRvbUxpcE9wZW5Nb2QgKyAoIGphd09wZW4gKiAwLjg1ICkgKTtcclxuICAgIGxpcC5oYW5kbGUxWSArPSAoIGJvdHRvbUxpcE9wZW5Nb2QgKyAoIGphd09wZW4gKiAwLjg1ICkgKTtcclxuICAgIGxpcC5wb2ludDJZICs9ICggYm90dG9tTGlwT3Blbk1vZCArICggamF3T3BlbiAqIDAuODUgKSApO1xyXG5cclxuICAgIGxpcC5wb2ludDFZIC09ICggbGlwc1B1Y2tlciAqIDAuNSApO1xyXG4gICAgbGlwLnBvaW50MlkgLT0gKCBsaXBzUHVja2VyICogMC41ICk7XHJcblxyXG4gICAgLy8gY2hlZWtzXHJcbiAgICAvLy8vLy8vLy8vLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqLy8vLy8vLy8vLy8vL1xyXG4gICAgY2hlZWtMZWZ0SW5uZXIudFBvaW50WSA9IGJhc2VDaGVla0xlZnRJbm5lci50UG9pbnRZO1xyXG4gICAgY2hlZWtSaWdodElubmVyLnRQb2ludFkgPSBiYXNlQ2hlZWtSaWdodElubmVyLnRQb2ludFk7XHJcblxyXG4gICAgY2hlZWtMZWZ0SW5uZXIuYlBvaW50WSA9IGJhc2VDaGVla0xlZnRJbm5lci5iUG9pbnRZICsgKCBqYXdPcGVuICogMC41ICk7XHJcbiAgICBjaGVla1JpZ2h0SW5uZXIuYlBvaW50WSA9IGJhc2VDaGVla1JpZ2h0SW5uZXIuYlBvaW50WSArICggamF3T3BlbiAqIDAuNSApO1xyXG5cclxuICAgIGNoZWVrTGVmdElubmVyLmJQb2ludFggPSBiYXNlQ2hlZWtMZWZ0SW5uZXIuYlBvaW50WCArICggamF3TGF0ZXJhbCAqIDAuNSApO1xyXG4gICAgY2hlZWtSaWdodElubmVyLmJQb2ludFggPSBiYXNlQ2hlZWtSaWdodElubmVyLmJQb2ludFggKyAoIGphd0xhdGVyYWwgKiAwLjUgKTtcclxuXHJcbiAgICBjaGVla0xlZnRJbm5lci5oYW5kbGVZID0gYmFzZUNoZWVrTGVmdElubmVyLmhhbmRsZVkgKyAoIGxlZnRDaGVla01vZCAqIDAuNCApICsgbW91dGhFZGdlTGVmdEV4dGVuZDtcclxuICAgIGNoZWVrUmlnaHRJbm5lci5oYW5kbGVZID0gYmFzZUNoZWVrUmlnaHRJbm5lci5oYW5kbGVZICsgKCByaWdodENoZWVrTW9kICogMC40ICkgKyBtb3V0aEVkZ2VSaWdodEV4dGVuZDtcclxuXHJcblxyXG4gICAgY2hlZWtMZWZ0SW5uZXIuaGFuZGxlWCA9IGJhc2VDaGVla0xlZnRJbm5lci5oYW5kbGVYICsgbW91dGhFZGdlTGVmdCArICggbW91dGhFZGdlTGVmdEV4dGVuZCAqIDAuNyk7XHJcbiAgICBjaGVla1JpZ2h0SW5uZXIuaGFuZGxlWCA9IGJhc2VDaGVla1JpZ2h0SW5uZXIuaGFuZGxlWCArIG1vdXRoRWRnZVJpZ2h0IC0gKCBtb3V0aEVkZ2VSaWdodEV4dGVuZCAqIDAuNyk7XHJcblxyXG4gICAgY2hlZWtMZWZ0SW5uZXIuaGFuZGxlWCArPSAoIGxpcHNQdWNrZXIgKiAxLjUgKTtcclxuICAgIGNoZWVrUmlnaHRJbm5lci5oYW5kbGVYIC09ICggbGlwc1B1Y2tlciAqIDEuNSApO1xyXG5cclxuICAgIGNoZWVrTGVmdE91dGVyLmhhbmRsZVkgPSBiYXNlQ2hlZWtMZWZ0T3V0ZXIuaGFuZGxlWSArICggbGVmdENoZWVrTW9kICogMC40ICk7XHJcbiAgICBjaGVla1JpZ2h0T3V0ZXIuaGFuZGxlWSA9IGJhc2VDaGVla1JpZ2h0T3V0ZXIuaGFuZGxlWSArICggcmlnaHRDaGVla01vZCAqIDAuNCApO1xyXG5cclxuICAgIGNoZWVrTGVmdE91dGVyLmJQb2ludFkgPSBiYXNlQ2hlZWtMZWZ0T3V0ZXIuYlBvaW50WSArICggamF3T3BlbiAqIDAuMyApO1xyXG4gICAgY2hlZWtSaWdodE91dGVyLmJQb2ludFkgPSBiYXNlQ2hlZWtSaWdodE91dGVyLmJQb2ludFkgKyAoIGphd09wZW4gKiAwLjMgKTtcclxuXHJcbiAgICBjaGVla0xlZnRPdXRlci5iUG9pbnRYID0gYmFzZUNoZWVrTGVmdE91dGVyLmJQb2ludFggKyAoIGphd0xhdGVyYWwgKiAwLjMgKTtcclxuICAgIGNoZWVrUmlnaHRPdXRlci5iUG9pbnRYID0gYmFzZUNoZWVrUmlnaHRPdXRlci5iUG9pbnRYICsgKCBqYXdMYXRlcmFsICogMC4zICk7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKi8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBcclxuICAgIC8vIC8vIG1vdXRoIG9wZW5lc3NcclxuICAgIHRlZXRoQm90dG9tLmxQb2ludDFZID0gYmFzZVRlZXRoQm90dG9tLmxQb2ludDFZICsgKCBqYXdPcGVuICogMC45NSApO1xyXG4gICAgdGVldGhCb3R0b20ubFBvaW50MlkgPSBiYXNlVGVldGhCb3R0b20ubFBvaW50MlkgKyAoIGphd09wZW4gKiAwLjk1ICk7XHJcbiAgICB0ZWV0aEJvdHRvbS5oYW5kbGVZID0gYmFzZVRlZXRoQm90dG9tLmhhbmRsZVkgKyAoIGphd09wZW4gKiAwLjk1ICk7XHJcbiAgICB0ZWV0aEJvdHRvbS5yUG9pbnQxWSA9IGJhc2VUZWV0aEJvdHRvbS5yUG9pbnQxWSArICggamF3T3BlbiAqIDAuOTUgKTtcclxuICAgIHRlZXRoQm90dG9tLnJQb2ludDJZID0gYmFzZVRlZXRoQm90dG9tLnJQb2ludDJZICsgKCBqYXdPcGVuICogMC45NSApO1xyXG5cclxuICAgIGNoaW4ucG9pbnQxWSA9IGJhc2VDaGluLnBvaW50MVkgKyAoIGphd09wZW4gKiAwLjIgKTtcclxuICAgIGNoaW4uaGFuZGxlMVkgPSBiYXNlQ2hpbi5oYW5kbGUxWSArICggamF3T3BlbiAqIDAuMiApO1xyXG4gICAgY2hpbi5wb2ludDJZID0gYmFzZUNoaW4ucG9pbnQyWSArICggamF3T3BlbiAqIDAuMiApO1xyXG5cclxuICAgIGNoaW4ucG9pbnQxWCA9IGJhc2VDaGluLnBvaW50MVggKyAoIGphd0xhdGVyYWwgKiAwLjIgKTtcclxuICAgIGNoaW4uaGFuZGxlMVggPSBiYXNlQ2hpbi5oYW5kbGUxWCArICggamF3TGF0ZXJhbCAqIDAuMiApO1xyXG4gICAgY2hpbi5wb2ludDJYID0gYmFzZUNoaW4ucG9pbnQyWCArICggamF3TGF0ZXJhbCAqIDAuMiApO1xyXG5cclxuXHJcbiAgICAvLyBqYXcgc2lkZXdheXMgbW92ZW1lbnRcclxuICAgIHRlZXRoQm90dG9tLmxQb2ludDFYID0gYmFzZVRlZXRoQm90dG9tLmxQb2ludDFYICsgKCBqYXdMYXRlcmFsICogMC4zNSApO1xyXG4gICAgdGVldGhCb3R0b20ubFBvaW50MlggPSBiYXNlVGVldGhCb3R0b20ubFBvaW50MlggKyAoIGphd0xhdGVyYWwgKiAwLjM1ICk7XHJcbiAgICB0ZWV0aEJvdHRvbS5oYW5kbGVYID0gYmFzZVRlZXRoQm90dG9tLmhhbmRsZVggKyAoIGphd0xhdGVyYWwgKiAwLjM1ICk7XHJcbiAgICB0ZWV0aEJvdHRvbS5yUG9pbnQxWCA9IGJhc2VUZWV0aEJvdHRvbS5yUG9pbnQxWCArICggamF3TGF0ZXJhbCAqIDAuMzUgKTtcclxuICAgIHRlZXRoQm90dG9tLnJQb2ludDJYID0gYmFzZVRlZXRoQm90dG9tLnJQb2ludDJYICsgKCBqYXdMYXRlcmFsICogMC4zNSApO1xyXG59XHJcblxyXG5cclxuXHJcbi8vIHN1blNwaWtlcy5kaXNwbGF5R2xhcmVTcGlrZXNSYW5kb20oKTtcclxuXHJcbmZ1bmN0aW9uIGRyYXdGYWNlKCkge1xyXG5cclxuICAgIGNvbXB1dGVGYWNlQ29vcmRpbmF0ZXMoKTtcclxuICAgIGFpbUNvbnN0cmFpbnQuY29tcHV0ZVRhcmdldEFuZ2xlcygpO1xyXG5cclxuICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSggMjU1LCAyNTUsIDEwMCwgMSApJztcclxuICAgIGN0eC5maWxsUmVjdCggMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0ICk7XHJcbiAgICAvLyBjb3JvbmFMYXllckN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnc291cmNlLW92ZXInO1xyXG4gICAgLy8gc3VuU3Bpa2VzLmRpc3BsYXlDb3JvbmEoKTtcclxuICAgIFxyXG5cclxuICAgIC8vIHZhciByZW5kZXJGbGFyZXMgPSBzdW5TcGlrZXMuZGlzcGxheUNmZy5mbGFyZXM7XHJcblxyXG4gICAgLy8gY29yb25hTGF5ZXJDdHguZHJhd0ltYWdlKFxyXG4gICAgLy8gICAgIHN1blNwaWtlcy5mbGFyZU9wdGlvbnMuY2FudmFzLFxyXG4gICAgLy8gICAgIHJlbmRlckZsYXJlcy54LCByZW5kZXJGbGFyZXMueSwgcmVuZGVyRmxhcmVzLncsIHJlbmRlckZsYXJlcy5oLFxyXG4gICAgLy8gICAgIHN1bmZhY2UueCAtIChyZW5kZXJGbGFyZXMudyAvIDIgKSwgc3VuZmFjZS55IC0gKHJlbmRlckZsYXJlcy5oIC8gMiApLCByZW5kZXJGbGFyZXMudywgcmVuZGVyRmxhcmVzLmhcclxuICAgIC8vICk7ICAgIFxyXG5cclxuICAgIC8vIGNvcm9uYUxheWVyQ3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdsaWdodGVyJztcclxuXHJcbiAgICAvLyB2YXIgcmVuZGVyR2xhcmUgPSBzdW5TcGlrZXMuZGlzcGxheUNmZy5nbGFyZVNwaWtlc1JhbmRvbS5yZW5kZXI7XHJcblxyXG4gICAgLy8gY29yb25hTGF5ZXJDdHguZHJhd0ltYWdlKFxyXG4gICAgLy8gICAgIHN1blNwaWtlcy5yZW5kZXJDZmcuY2FudmFzLFxyXG4gICAgLy8gICAgIHJlbmRlckdsYXJlLngsIHJlbmRlckdsYXJlLnksIHJlbmRlckdsYXJlLncsIHJlbmRlckdsYXJlLmgsXHJcbiAgICAvLyAgICAgc3VuZmFjZS54IC0gKHJlbmRlckdsYXJlLncgLyAyICksIHN1bmZhY2UueSAtIChyZW5kZXJHbGFyZS5oIC8gMiApLCByZW5kZXJHbGFyZS53LCByZW5kZXJHbGFyZS5oXHJcbiAgICAvLyApO1xyXG5cclxuICAgIFxyXG5cclxuICAgIC8vIHNwaWtlc1xyXG4gICAgLy8gc3VuU3Bpa2VzLnJlbmRlciggc3VuZmFjZS54LCBzdW5mYWNlLnksIHN0YXRpY0Fzc2V0Q29uZmlncy5zdW5TcGlrZSwgY3R4ICk7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIGNvcm9uYUxheWVyQ3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdzb3VyY2Utb3Zlcic7XHJcblxyXG4gICAgLy8gdmFyIHJlbmRlckZsYXJlcyA9IHN1blNwaWtlcy5kaXNwbGF5Q2ZnLmZsYXJlcztcclxuXHJcbiAgICAvLyBjb3JvbmFMYXllckN0eC5kcmF3SW1hZ2UoXHJcbiAgICAvLyAgICAgcmVuZGVyRmxhcmVzLmNhbnZhcyxcclxuICAgIC8vICAgICByZW5kZXJGbGFyZXMueCwgcmVuZGVyRmxhcmVzLnksIHJlbmRlckZsYXJlcy53LCByZW5kZXJGbGFyZXMuaCxcclxuICAgIC8vICAgICBzdW5mYWNlLnggLSAocmVuZGVyRmxhcmVzLncgLyAyICksIHN1bmZhY2UueSAtIChyZW5kZXJGbGFyZXMuaCAvIDIgKSwgcmVuZGVyRmxhcmVzLncsIHJlbmRlckZsYXJlcy5oXHJcbiAgICAvLyApO1xyXG5cclxuICAgIC8vIGNvcm9uYUxheWVyQ3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdsaWdodGVyJztcclxuXHJcbiAgICAvLyB2YXIgcmVuZGVyR2xhcmUgPSBzdW5TcGlrZXMuZGlzcGxheUNmZy5nbGFyZVNwaWtlcztcclxuXHJcbiAgICAvLyBjb3JvbmFMYXllckN0eC5kcmF3SW1hZ2UoXHJcbiAgICAvLyAgICAgc3VuU3Bpa2VzLnJlbmRlckNmZy5jYW52YXMsXHJcbiAgICAvLyAgICAgcmVuZGVyR2xhcmUueCwgcmVuZGVyR2xhcmUueSwgcmVuZGVyR2xhcmUudywgcmVuZGVyR2xhcmUuaCxcclxuICAgIC8vICAgICBzdW5mYWNlLnggLSAocmVuZGVyR2xhcmUudyAvIDIgKSwgc3VuZmFjZS55IC0gKHJlbmRlckdsYXJlLmggLyAyICksIHJlbmRlckdsYXJlLncsIHJlbmRlckdsYXJlLmhcclxuICAgIC8vICk7XHJcblxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICBcclxuICAgIFxyXG5cclxuICAgIC8vICAgICBzdW5TcGlrZXMucmVuZGVyUmFpbmJvd1NwaWtlcyhcclxuICAgIC8vICAgICB7ICAgXHJcbiAgICAvLyAgICAgICAgIHg6IHN1bmZhY2UueCxcclxuICAgIC8vICAgICAgICAgeTogc3VuZmFjZS55LFxyXG4gICAgLy8gICAgICAgICBpbWFnZUNmZzogaW1hZ2VBc3NldENvbmZpZ3MucmFpbmJvd0dsYXJlTG9uZyxcclxuICAgIC8vICAgICAgICAgZDogMzAwXHJcbiAgICAvLyAgICAgfSxcclxuICAgIC8vICAgICBjdHhcclxuICAgIC8vICk7XHJcbiAgICBcclxuXHJcbiAgICAvLyBjb3JvbmEgc2hpbmVcclxuICAgIC8vIGN0eC5maWxsU3R5bGUgPSBjb3JvbmFHcmFkaWVuMjtcclxuICAgIC8vIGN0eC5maWxsQ2lyY2xlKCBzdW5mYWNlLngsIHN1bmZhY2UueSwgc3VuZmFjZS5yICogMyApO1xyXG4gICAgaWYgKCAhb3ZlcmxheUNmZy5kaXNwbGF5R2xhcmVTcGlrZXMgKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdkZXN0aW5hdGlvbi1vdmVyJztcclxuICAgICAgICAvLyBjdHguZmlsbFN0eWxlID0gY29yb25hR3JhZGllbnQyO1xyXG4gICAgICAgIC8vIGN0eC5maWxsQ2lyY2xlKCBzdW5mYWNlLngsIHN1bmZhY2UueSwgc3VuZmFjZS5yICogMTAgKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBjdHguZmlsbFN0eWxlID0gY29yb25hR3JhZGllbnQzO1xyXG4gICAgICAgIC8vIGN0eC5maWxsQ2lyY2xlKCBzdW5mYWNlLngsIHN1bmZhY2UueSwgc3VuZmFjZS5yICogNSApO1xyXG5cclxuICAgICAgICAvLyBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ3NvdXJjZS1vdmVyJztcclxuICAgICAgICAvLyBjdHguZmlsbFN0eWxlID0gY29yb25hR3JhZGllbnQ7XHJcbiAgICAgICAgLy8gY3R4LmZpbGxDaXJjbGUoIHN1bmZhY2UueCwgc3VuZmFjZS55LCBzdW5mYWNlLnIgKiAzICk7XHJcbiAgICAgICAgLy8gY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdsaWdodGVyJztcclxuXHJcblxyXG5cclxuICAgICAgICAvLyBzdW5TcGlrZXMuZGlzcGxheUNvcm9uYSgpO1xyXG5cclxuICAgICAgICAvLyB2YXIgcmVuZGVyRmxhcmVzID0gc3VuU3Bpa2VzLmRpc3BsYXlDZmcuZmxhcmVzO1xyXG5cclxuICAgICAgICAvLyBjb3JvbmFMYXllckN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgLy8gICAgIHN1blNwaWtlcy5mbGFyZU9wdGlvbnMuY2FudmFzLFxyXG4gICAgICAgIC8vICAgICByZW5kZXJGbGFyZXMueCwgcmVuZGVyRmxhcmVzLnksIHJlbmRlckZsYXJlcy53LCByZW5kZXJGbGFyZXMuaCxcclxuICAgICAgICAvLyAgICAgc3VuZmFjZS54IC0gKHJlbmRlckZsYXJlcy53IC8gMiApLCBzdW5mYWNlLnkgLSAocmVuZGVyRmxhcmVzLmggLyAyICksIHJlbmRlckZsYXJlcy53LCByZW5kZXJGbGFyZXMuaFxyXG4gICAgICAgIC8vICk7XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBkcmF3RmVhdHVyZXMoKTtcclxuXHJcbiAgICAgICAgLy8gbGVuc0ZsYXJlLmRpc3BsYXlGbGFyZXMoKTtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG5cclxuICAgIC8vIGRyYXdGZWF0dXJlcygpO1xyXG5cclxuICAgIC8vIGlmICggcmFpbmJvd1JlYWxJbWFnZUxvYWRlZCA9PT0gdHJ1ZSApIHtcclxuXHJcbiAgICAvLyAgICAgY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdzY3JlZW4nO1xyXG5cclxuICAgIC8vICAgICBjdHgudHJhbnNsYXRlKCBzdW5mYWNlLngsIHN1bmZhY2UueSApO1xyXG4gICAgLy8gICAgIGN0eC5yb3RhdGUoIHN1bmZhY2UuZmFjZVRvU3RhZ2VDZW50cmVBbmdsZSApO1xyXG5cclxuICAgIC8vICAgICBjdHguZ2xvYmFsQWxwaGEgPSAwLjU7XHJcbiAgICAvLyAgICAgY3R4LmRyYXdJbWFnZShcclxuICAgIC8vICAgICAgICAgcmFpbmJvd1JlYWxJbWFnZSxcclxuICAgIC8vICAgICAgICAgIDQwMCArIC0oIHJhaW5ib3dSZWFsSW1hZ2VDZmcudyAvIDIgKSxcclxuICAgIC8vICAgICAgICAgLSggcmFpbmJvd1JlYWxJbWFnZUNmZy53IC8gMiApLFxyXG4gICAgLy8gICAgICAgICByYWluYm93UmVhbEltYWdlQ2ZnLncsXHJcbiAgICAvLyAgICAgICAgIHJhaW5ib3dSZWFsSW1hZ2VDZmcuaFxyXG4gICAgLy8gICAgICk7XHJcbiAgICAvLyAgICAgY3R4Lmdsb2JhbEFscGhhID0gMTtcclxuICAgIC8vICAgICBjdHgucm90YXRlKCAtc3VuZmFjZS5mYWNlVG9TdGFnZUNlbnRyZUFuZ2xlICk7XHJcbiAgICAvLyAgICAgY3R4LnRyYW5zbGF0ZSggLXN1bmZhY2UueCwgLXN1bmZhY2UueSApO1xyXG4gICAgLy8gfVxyXG5cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdGZWF0dXJlcygpIHtcclxuICAgIGN0eC5saW5lV2lkdGggPSBzdW5mYWNlLmxpbmVzLmlubmVyO1xyXG4gICAgY3R4LmxpbmVDYXAgPSAncm91bmQnO1xyXG4gICAgLy8gc3VuQ29yb25hLnJlbmRlciggc3VuZmFjZS54LCBzdW5mYWNlLnksIHNpbmVXYXZlLnZhbCwgc2luZVdhdmUuaW52VmFsLCBjdHggKTtcclxuXHJcbiAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ3NvdXJjZS1vdmVyJztcclxuXHJcbiAgICB2YXIgbGVmdEV5ZSA9IGZhY2VDb29yZHMuZXllcy5sZWZ0O1xyXG4gICAgdmFyIHJpZ2h0RXllID0gZmFjZUNvb3Jkcy5leWVzLnJpZ2h0O1xyXG4gICAgdmFyIG1vdXRoID0gZmFjZUNvb3Jkcy5tb3V0aDtcclxuXHJcbiAgICAvLyBiYXNlIHNoYXBlXHJcbiAgICAgICAgLy8gY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICAgICAgLy8gY3R4LmZpbGxDaXJjbGUoIHN1bmZhY2UueCwgc3VuZmFjZS55LCBzdW5mYWNlLnIgKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gZmFjZUdyYWRpZW50O1xyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBzdW5mYWNlLngsIHN1bmZhY2UueSwgc3VuZmFjZS5yICk7XHJcbiAgICAgICAgLy8gY3R4LnN0cm9rZUNpcmNsZSggc3VuZmFjZS54LCBzdW5mYWNlLnksIHN1bmZhY2UuciApO1xyXG5cclxuICAgICAgICBjdHgubGluZVdpZHRoID0gc3VuZmFjZS5saW5lcy5pbm5lcjtcclxuXHJcbiAgICAgICAgaWYgKCAhb3ZlcmxheUNmZy5kaXNwbGF5T3ZlcmxheSApIHtcclxuXHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBzdW5mYWNlLmNvbG91cnMuYmFzZS5vcmFuZ2U7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHN1bmZhY2UuY29sb3Vycy5iYXNlLm9yYW5nZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gc3VuZmFjZS5jb2xvdXJzLmRlYnVnLmRpbW1lZDtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc3VuZmFjZS5jb2xvdXJzLmRlYnVnLmRpbW1lZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgLy8gZXllIHNoYWRvd3NcclxuICAgICAgICBkcmF3RXllU2hhZG93cyggZmFjZUNvb3Jkcy5leWVzLCBiYXNlRmFjZUNvb3Jkcy5leWVzLCBmYWNlQ29vcmRzLmV5ZWJyb3dzICk7XHJcblxyXG4gICAgLy8gbm9zZSBzaGFkb3dcclxuICAgICAgICBkcmF3Tm9zZVNoYWRvdyggZmFjZUNvb3Jkcy5ub3NlLCBmYWNlQ29vcmRzLm1vdXRoICk7XHJcblxyXG4gICAgLy8gbWFza3NcclxuXHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuXHJcbiAgICAvLyBsZWZ0IGV5ZXNoYXBlXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG5cclxuICAgICAgICBjdHgubW92ZVRvKCBsZWZ0RXllLmxQb2ludFgsIGxlZnRFeWUubFBvaW50WSApO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICBsZWZ0RXllLnRIYW5kbGVYLCBsZWZ0RXllLnRIYW5kbGVZLFxyXG4gICAgICAgICAgICBsZWZ0RXllLnJQb2ludFgsIGxlZnRFeWUuclBvaW50WVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgIGxlZnRFeWUuYkhhbmRsZVgsIGxlZnRFeWUuYkhhbmRsZVksXHJcbiAgICAgICAgICAgIGxlZnRFeWUubFBvaW50WCwgbGVmdEV5ZS5sUG9pbnRZXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICAgIGN0eC5jbGlwKCk7XHJcbiAgICAgICAgaWYgKCAhb3ZlcmxheUNmZy5kaXNwbGF5T3ZlcmxheSApIHtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2IoIDIzMCwgMjMwLCAyMzAgKSc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHN1bmZhY2UuY29sb3Vycy5kZWJ1Zy5maWxsc1RlZXRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KCBsZWZ0RXllQmFzZVggLSBleWVCYXNlUmFkaXVzLCBsZWZ0RXllQmFzZVkgLSBleWVCYXNlUmFkaXVzLCBleWVCYXNlUmFkaXVzICogMiwgZXllQmFzZVJhZGl1cyAqIDIgKTtcclxuXHJcbiAgICAgICAgZHJhd0xlZnRQdXBpbCggZmFjZUNvb3Jkcy5leWVzLnB1cGlscywgYWltQ29uc3RyYWludC5leWVzICk7XHJcblxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgLy8gcmlnaHQgZXllc2hhcGVcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyggcmlnaHRFeWUubFBvaW50WCwgcmlnaHRFeWUubFBvaW50WSApO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICByaWdodEV5ZS50SGFuZGxlWCwgcmlnaHRFeWUudEhhbmRsZVksXHJcbiAgICAgICAgICAgIHJpZ2h0RXllLnJQb2ludFgsIHJpZ2h0RXllLnJQb2ludFlcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICByaWdodEV5ZS5iSGFuZGxlWCwgcmlnaHRFeWUuYkhhbmRsZVksXHJcbiAgICAgICAgICAgIHJpZ2h0RXllLmxQb2ludFgsIHJpZ2h0RXllLmxQb2ludFlcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgICAgY3R4LmNsaXAoKTtcclxuICAgICAgICBpZiAoICFvdmVybGF5Q2ZnLmRpc3BsYXlPdmVybGF5ICkge1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYiggMjMwLCAyMzAsIDIzMCApJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gc3VuZmFjZS5jb2xvdXJzLmRlYnVnLmZpbGxzVGVldGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5maWxsUmVjdCggcmlnaHRFeWVCYXNlWCAtIGV5ZUJhc2VSYWRpdXMsIHJpZ2h0RXllQmFzZVkgLSBleWVCYXNlUmFkaXVzLCBleWVCYXNlUmFkaXVzICogMiwgZXllQmFzZVJhZGl1cyAqIDIgKTtcclxuXHJcbiAgICAgICAgZHJhd1JpZ2h0UHVwaWwoIGZhY2VDb29yZHMuZXllcy5wdXBpbHMsIGFpbUNvbnN0cmFpbnQuZXllcyApO1xyXG5cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgIC8vIG1vdXRoXHJcblxyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcblxyXG4gICAgICAgIC8vIHRvcCBsaXAgc2hhcGVcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyggbW91dGgubGVmdF9pbm5lcl9hbmNob3JfWCwgbW91dGgubGVmdF9pbm5lcl9hbmNob3JfWSApO1xyXG5cclxuICAgICAgICAvLyB0b3AgbGVmdCBpbm5lciBib3dcclxuICAgICAgICBjdHguYmV6aWVyQ3VydmVUbyhcclxuICAgICAgICAgICAgbW91dGgudG9wX2xlZnRfaW5uZXJfY3AxX1gsIG1vdXRoLnRvcF9sZWZ0X2lubmVyX2NwMV9ZLFxyXG4gICAgICAgICAgICBtb3V0aC50b3BfbGVmdF9pbm5lcl9jcDJfWCwgbW91dGgudG9wX2xlZnRfaW5uZXJfY3AyX1ksXHJcbiAgICAgICAgICAgIG1vdXRoLnRvcF9pbm5lcl9hbmNob3JfWCwgbW91dGgudG9wX2lubmVyX2FuY2hvcl9ZXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gdG9wIHJpZ2h0IGlubmVyIGJvd1xyXG4gICAgICAgIGN0eC5iZXppZXJDdXJ2ZVRvKFxyXG4gICAgICAgICAgICBtb3V0aC50b3BfcmlnaHRfaW5uZXJfY3AyX1gsIG1vdXRoLnRvcF9yaWdodF9pbm5lcl9jcDJfWSxcclxuICAgICAgICAgICAgbW91dGgudG9wX3JpZ2h0X2lubmVyX2NwMV9YLCBtb3V0aC50b3BfcmlnaHRfaW5uZXJfY3AxX1ksXHJcbiAgICAgICAgICAgIG1vdXRoLnJpZ2h0X2lubmVyX2FuY2hvcl9YLCBtb3V0aC5yaWdodF9pbm5lcl9hbmNob3JfWVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIGJvdHRvbSBsaXAgc2hhcGVcclxuXHJcbiAgICAgICAgLy8gYm90dG9tIHJpZ2h0IGlubmVyIGJvd1xyXG4gICAgICAgIGN0eC5iZXppZXJDdXJ2ZVRvKFxyXG4gICAgICAgICAgICBtb3V0aC5ib3R0b21fcmlnaHRfaW5uZXJfY3AxX1gsIG1vdXRoLmJvdHRvbV9yaWdodF9pbm5lcl9jcDFfWSxcclxuICAgICAgICAgICAgbW91dGguYm90dG9tX3JpZ2h0X2lubmVyX2NwMl9YLCBtb3V0aC5ib3R0b21fcmlnaHRfaW5uZXJfY3AyX1ksXHJcbiAgICAgICAgICAgIG1vdXRoLmJvdHRvbV9pbm5lcl9hbmNob3JfWCwgbW91dGguYm90dG9tX2lubmVyX2FuY2hvcl9ZXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gYm90dG9tIGxlZnQgaW5uZXIgYm93XHJcbiAgICAgICAgY3R4LmJlemllckN1cnZlVG8oXHJcbiAgICAgICAgICAgIG1vdXRoLmJvdHRvbV9sZWZ0X2lubmVyX2NwMl9YLCBtb3V0aC5ib3R0b21fbGVmdF9pbm5lcl9jcDJfWSxcclxuICAgICAgICAgICAgbW91dGguYm90dG9tX2xlZnRfaW5uZXJfY3AxX1gsIG1vdXRoLmJvdHRvbV9sZWZ0X2lubmVyX2NwMV9ZLFxyXG4gICAgICAgICAgICBtb3V0aC5sZWZ0X2lubmVyX2FuY2hvcl9YLCBtb3V0aC5sZWZ0X2lubmVyX2FuY2hvcl9ZXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgICBjdHguY2xpcCgpO1xyXG5cclxuICAgIC8vIG1hc2tlZCBlbGVtZW50c1xyXG4gICAgICAgIC8vIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnc291cmNlLWF0b3AnO1xyXG5cclxuICAgICAgICAvLyB0ZWV0aFxyXG5cclxuICAgICAgICBpZiAoICFvdmVybGF5Q2ZnLmRpc3BsYXlPdmVybGF5ICkge1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoIDAsIDAsIDAsIDAuNCApJztcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KCBtb3V0aEJhc2VYIC0gcG0ucjIsIG1vdXRoQmFzZVkgLSBwbS5yMiwgc3VuZmFjZS5yLCBzdW5mYWNlLnIpXHJcblxyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSBzdW5mYWNlLmxpbmVzLmlubmVyIC8gMjtcclxuICAgICAgICBpZiAoICFvdmVybGF5Q2ZnLmRpc3BsYXlPdmVybGF5ICkge1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gc3VuZmFjZS5jb2xvdXJzLmRlYnVnLmZpbGxzVGVldGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRyYXdUZWV0aCggbW91dGggKTtcclxuXHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHN1bmZhY2UubGluZXMuaW5uZXI7XHJcblxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgLy8gZHJhd2luZ1xyXG5cclxuICAgICAgICAvLyByZWxlYXNlIG1hc2tcclxuICAgICAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ3NvdXJjZS1vdmVyJztcclxuICAgICAgICBsZXQgbW91dGhHcmFkcyA9IGZhY2VDb29yZHMuZ3JhZGllbnRzO1xyXG4gICAgICAgIGxldCBtb3V0aEdyYWRYID0gZmFjZUNvb3Jkcy5tb3V0aC5sZWZ0X291dGVyX2FuY2hvcl9YO1xyXG4gICAgICAgIC8vIHNldCBsaXAgZ3JhZGllbnRcclxuICAgICAgICB2YXIgdG9wTGlwR3JhZGllbnQgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQoXHJcbiAgICAgICAgICAgIG1vdXRoR3JhZFgsIG1vdXRoR3JhZHMudG9wTGlwLnRvcF9ZLFxyXG4gICAgICAgICAgICBtb3V0aEdyYWRYLCBtb3V0aEdyYWRzLnRvcExpcC5ib3R0b21fWVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdG9wTGlwR3JhZGllbnQuYWRkQ29sb3JTdG9wKCAwLCBjb2xvcmluZy5yZ2JhKCAyNTUsIDUwLCAxMywgbW91dGhHcmFkcy50b3BMaXAuYm90dG9tX29wYWNpdHkgKSApO1xyXG4gICAgICAgIHRvcExpcEdyYWRpZW50LmFkZENvbG9yU3RvcCggMSwgY29sb3JpbmcucmdiYSggMjU1LCA1MCwgMTMsIG1vdXRoR3JhZHMudG9wTGlwLnRvcF9vcGFjaXR5ICkgKTtcclxuICAgICAgICAvLyB0b3BMaXBHcmFkaWVudC5hZGRDb2xvclN0b3AoIDEsIHN1bmZhY2UuY29sb3Vycy5yZ2JhLm9yYW5nZVNoYWRvd0xpZ2h0ICk7XHJcblxyXG4gICAgICAgIHZhciBib3R0b21MaXBHcmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudChcclxuICAgICAgICAgICAgbW91dGhHcmFkWCwgbW91dGhHcmFkcy5ib3R0b21MaXAuYm90dG9tX1ksXHJcbiAgICAgICAgICAgIG1vdXRoR3JhZFgsIG1vdXRoR3JhZHMuYm90dG9tTGlwLnRvcF9ZXHJcbiAgICAgICAgKTtcclxuICAgICAgICBib3R0b21MaXBHcmFkaWVudC5hZGRDb2xvclN0b3AoIDAsIGNvbG9yaW5nLnJnYmEoIDI1NSwgMTU2LCAxMywgbW91dGhHcmFkcy5ib3R0b21MaXAuYm90dG9tX29wYWNpdHkgKSApO1xyXG4gICAgICAgIC8vIGJvdHRvbUxpcEdyYWRpZW50LmFkZENvbG9yU3RvcCggMC4yLCBzdW5mYWNlLmNvbG91cnMucmdiYS5vcmFuZ2VTaGFkb3cgKTtcclxuICAgICAgICBib3R0b21MaXBHcmFkaWVudC5hZGRDb2xvclN0b3AoIDEsIGNvbG9yaW5nLnJnYmEoIDI1NSwgMTU2LCAxMywgbW91dGhHcmFkcy50b3BMaXAudG9wX29wYWNpdHkgKSApO1xyXG5cclxuICAgICAgICBpZiAoICFvdmVybGF5Q2ZnLmRpc3BsYXlPdmVybGF5ICkge1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gdG9wTGlwR3JhZGllbnQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHN1bmZhY2UuY29sb3Vycy5kZWJ1Zy5vcmFuZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcblxyXG4gICAgLy8gRXllc1xyXG4gICAgICAgIGRyYXdFeWVTaGFwZXMoKTtcclxuICAgIC8vIEV5ZWJyb3dzXHJcbiAgICAgICAgZHJhd0V5ZWJyb3dzKCk7XHJcbiAgICAvLyBub3NlXHJcbiAgICAgICAgZHJhd05vc2UoKTtcclxuICAgICAgICBjdHgubGluZUNhcD1cImJ1dHRcIjtcclxuXHJcbiAgICAvLyBsaXBcclxuICAgICAgICBkcmF3TGlwU2hhZG93KCk7XHJcblxyXG4gICAgLy8gbW91dGhcclxuICAgICAgICBkcmF3TW91dGhTaGFwZSggbW91dGgsIHRvcExpcEdyYWRpZW50LCBib3R0b21MaXBHcmFkaWVudCApO1xyXG4gICAgLy8gY2hpblxyXG4gICAgICAgIGRyYXdDaGluU2hhcGUoKTtcclxuICAgIC8vIGNoZWVrc1xyXG4gICAgICAgIC8vIGN0eC5maWxsU3R5bGUgPSBmZWF0dXJlQ3JlYXNlVmVydGljYWxHcmFkaWVudDtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoIDI1NSwgMTU2LCAxMywgMC4yICknO1xyXG4gICAgICAgIGRyYXdDaGVla3MoIGZhY2VDb29yZHMuaW5uZXJDaGVla3MubGVmdCwgJzMyJywgcG0sIDUsIGN0eCApO1xyXG4gICAgICAgIGRyYXdDaGVla3MoIGZhY2VDb29yZHMuaW5uZXJDaGVla3MucmlnaHQsICczMicsIHBtLCA1LCBjdHggKTtcclxuICAgICAgICBkcmF3Q2hlZWtzKCBmYWNlQ29vcmRzLm91dGVyQ2hlZWtzLmxlZnQsICcxNicsIHBtLCAxMCwgY3R4ICk7XHJcbiAgICAgICAgZHJhd0NoZWVrcyggZmFjZUNvb3Jkcy5vdXRlckNoZWVrcy5yaWdodCwgJzE2JywgcG0sIDEwLCBjdHggKTtcclxufVxyXG5cclxuLy8gZHJhdyBmZWF0dXJlIGZ1bmN0aW9uIHNldFxyXG4gICAgZnVuY3Rpb24gZHJhd0V5ZWJyb3dzKCkge1xyXG4gICAgICAgIC8vIGxlZnQgZXllYnJvd1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLmV5ZWJyb3dzLmxlZnQubFBvaW50WCwgZmFjZUNvb3Jkcy5leWVicm93cy5sZWZ0LmxQb2ludFlcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5iZXppZXJDdXJ2ZVRvKFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLmV5ZWJyb3dzLmxlZnQuaGFuZGxlMVgsIGZhY2VDb29yZHMuZXllYnJvd3MubGVmdC5oYW5kbGUxWSxcclxuICAgICAgICAgICAgZmFjZUNvb3Jkcy5leWVicm93cy5sZWZ0LmhhbmRsZTJYLCBmYWNlQ29vcmRzLmV5ZWJyb3dzLmxlZnQuaGFuZGxlMlksXHJcbiAgICAgICAgICAgIGZhY2VDb29yZHMuZXllYnJvd3MubGVmdC5yUG9pbnRYLCBmYWNlQ29vcmRzLmV5ZWJyb3dzLmxlZnQuclBvaW50WVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LmJlemllckN1cnZlVG8oXHJcbiAgICAgICAgICAgIGZhY2VDb29yZHMuZXllYnJvd3MubGVmdC5oYW5kbGUyWCwgZmFjZUNvb3Jkcy5leWVicm93cy5sZWZ0LmhhbmRsZTJZICsgcG0ucjE2LFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLmV5ZWJyb3dzLmxlZnQuaGFuZGxlMVgsIGZhY2VDb29yZHMuZXllYnJvd3MubGVmdC5oYW5kbGUxWSArIHBtLnIxNixcclxuICAgICAgICAgICAgZmFjZUNvb3Jkcy5leWVicm93cy5sZWZ0LmxQb2ludFgsIGZhY2VDb29yZHMuZXllYnJvd3MubGVmdC5sUG9pbnRZXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuICAgICAgICAvLyByaWdodCBleWVicm93XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oXHJcbiAgICAgICAgICAgIGZhY2VDb29yZHMuZXllYnJvd3MucmlnaHQubFBvaW50WCwgZmFjZUNvb3Jkcy5leWVicm93cy5yaWdodC5sUG9pbnRZXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHguYmV6aWVyQ3VydmVUbyhcclxuICAgICAgICAgICAgZmFjZUNvb3Jkcy5leWVicm93cy5yaWdodC5oYW5kbGUxWCwgZmFjZUNvb3Jkcy5leWVicm93cy5yaWdodC5oYW5kbGUxWSxcclxuICAgICAgICAgICAgZmFjZUNvb3Jkcy5leWVicm93cy5yaWdodC5oYW5kbGUyWCwgZmFjZUNvb3Jkcy5leWVicm93cy5yaWdodC5oYW5kbGUyWSxcclxuICAgICAgICAgICAgZmFjZUNvb3Jkcy5leWVicm93cy5yaWdodC5yUG9pbnRYLCBmYWNlQ29vcmRzLmV5ZWJyb3dzLnJpZ2h0LnJQb2ludFlcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5iZXppZXJDdXJ2ZVRvKFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLmV5ZWJyb3dzLnJpZ2h0LmhhbmRsZTJYLCBmYWNlQ29vcmRzLmV5ZWJyb3dzLnJpZ2h0LmhhbmRsZTJZICsgcG0ucjE2LFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLmV5ZWJyb3dzLnJpZ2h0LmhhbmRsZTFYLCBmYWNlQ29vcmRzLmV5ZWJyb3dzLnJpZ2h0LmhhbmRsZTFZICsgcG0ucjE2LFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLmV5ZWJyb3dzLnJpZ2h0LmxQb2ludFgsIGZhY2VDb29yZHMuZXllYnJvd3MucmlnaHQubFBvaW50WVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkcmF3RXllU2hhZG93cyggZXllcywgYmFzZUV5ZXMsIGV5ZUJyb3dzICkge1xyXG5cclxuICAgICAgICBsZXQgbGVmdEV5ZSA9IGV5ZXMubGVmdDtcclxuICAgICAgICBsZXQgbGVmdEV5ZUJhc2UgPSBiYXNlRXllcy5sZWZ0O1xyXG4gICAgICAgIGxldCBsZWZ0QnJvdyA9IGV5ZUJyb3dzLmxlZnQ7XHJcbiAgICAgICAgbGV0IHJpZ2h0RXllID0gZXllcy5yaWdodDtcclxuICAgICAgICBsZXQgcmlnaHRFeWVCYXNlID0gYmFzZUV5ZXMucmlnaHQ7XHJcbiAgICAgICAgbGV0IHJpZ2h0QnJvdyA9IGV5ZUJyb3dzLnJpZ2h0O1xyXG4gICAgICAgIGxldCBlbFNoaWZ0ID0gMTAwMDAwO1xyXG5cclxuICAgICAgICBjdHguc2hhZG93Q29sb3IgPSBzdW5mYWNlLmNvbG91cnMucmdiYS5vcmFuZ2VTaGFkb3c7XHJcbiAgICAgICAgY3R4LnNoYWRvd0JsdXIgPSAxNTtcclxuXHJcbiAgICAgICAgLy8gbGVmdCBleWUgc2hhZG93XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oIGxlZnRCcm93LmxQb2ludFgsIGxlZnRCcm93LmxQb2ludFkgLSBlbFNoaWZ0ICk7XHJcbiAgICAgICAgY3R4LmJlemllckN1cnZlVG8oXHJcbiAgICAgICAgICAgIGxlZnRCcm93LmhhbmRsZTFYLCBsZWZ0QnJvdy5oYW5kbGUxWSAtIGVsU2hpZnQsXHJcbiAgICAgICAgICAgIGxlZnRCcm93LmhhbmRsZTJYLCBsZWZ0QnJvdy5oYW5kbGUyWSAtIGVsU2hpZnQsXHJcbiAgICAgICAgICAgIGxlZnRCcm93LnJQb2ludFgsIGxlZnRCcm93LnJQb2ludFkgLSBlbFNoaWZ0XHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgbGVmdEV5ZS5iSGFuZGxlWCArIHBtLnI0LCBsZWZ0RXllLmJIYW5kbGVZIC0gcG0ucjMyIC0gZWxTaGlmdCxcclxuICAgICAgICAgICAgbGVmdEJyb3cubFBvaW50WCwgbGVmdEJyb3cubFBvaW50WSAtIGVsU2hpZnRcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFggPSAtNTtcclxuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IGVsU2hpZnQgKyAxMDtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuICAgICAgICAvLyByaWdodCBleWUgc2hhZG93XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oIHJpZ2h0QnJvdy5sUG9pbnRYLCByaWdodEJyb3cubFBvaW50WSAtIGVsU2hpZnQgKTtcclxuICAgICAgICBjdHguYmV6aWVyQ3VydmVUbyhcclxuICAgICAgICAgICAgcmlnaHRCcm93LmhhbmRsZTFYLCByaWdodEJyb3cuaGFuZGxlMVkgLSBlbFNoaWZ0LFxyXG4gICAgICAgICAgICByaWdodEJyb3cuaGFuZGxlMlgsIHJpZ2h0QnJvdy5oYW5kbGUyWSAtIGVsU2hpZnQsXHJcbiAgICAgICAgICAgIHJpZ2h0QnJvdy5yUG9pbnRYLCByaWdodEJyb3cuclBvaW50WSAtIGVsU2hpZnRcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICByaWdodEV5ZS5iSGFuZGxlWCAtIHBtLnI0LCByaWdodEV5ZS5iSGFuZGxlWSAtIHBtLnIzMiAtIGVsU2hpZnQsXHJcbiAgICAgICAgICAgIHJpZ2h0QnJvdy5sUG9pbnRYLCByaWdodEJyb3cubFBvaW50WSAtIGVsU2hpZnRcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDU7XHJcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSBlbFNoaWZ0ICsgMTA7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gXCJyZ2JhKCAyNTUsIDI1NSwgMTAwLCAxIClcIjtcclxuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDEwO1xyXG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMDtcclxuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IGVsU2hpZnQ7XHJcblxyXG4gICAgICAgIC8vIGxlZnQgZXllQmFsbCBzaGFkb3dcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyggbGVmdEV5ZUJhc2UubFBvaW50WCwgbGVmdEV5ZUJhc2UubFBvaW50WSAtIGVsU2hpZnQgKTtcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgbGVmdEV5ZUJhc2UudEhhbmRsZVgsIGxlZnRFeWVCYXNlLnRIYW5kbGVZIC0gZWxTaGlmdCxcclxuICAgICAgICAgICAgbGVmdEV5ZUJhc2UuclBvaW50WCwgbGVmdEV5ZUJhc2UuclBvaW50WSAtIGVsU2hpZnRcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICBsZWZ0RXllQmFzZS5iSGFuZGxlWCwgbGVmdEV5ZUJhc2UuYkhhbmRsZVkgLSBlbFNoaWZ0LFxyXG4gICAgICAgICAgICBsZWZ0RXllQmFzZS5sUG9pbnRYLCBsZWZ0RXllQmFzZS5sUG9pbnRZIC0gZWxTaGlmdFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMDtcclxuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IGVsU2hpZnQ7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuXHJcbiAgICAgICAgLy8gcmlnaHQgZXllQmFsbCBzaGFkb3dcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyggcmlnaHRFeWVCYXNlLmxQb2ludFgsIHJpZ2h0RXllQmFzZS5sUG9pbnRZIC0gZWxTaGlmdCApO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICByaWdodEV5ZUJhc2UudEhhbmRsZVgsIHJpZ2h0RXllQmFzZS50SGFuZGxlWSAtIGVsU2hpZnQsXHJcbiAgICAgICAgICAgIHJpZ2h0RXllQmFzZS5yUG9pbnRYLCByaWdodEV5ZUJhc2UuclBvaW50WSAtIGVsU2hpZnRcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICByaWdodEV5ZUJhc2UuYkhhbmRsZVgsIHJpZ2h0RXllQmFzZS5iSGFuZGxlWSAtIGVsU2hpZnQsXHJcbiAgICAgICAgICAgIHJpZ2h0RXllQmFzZS5sUG9pbnRYLCByaWdodEV5ZUJhc2UubFBvaW50WSAtIGVsU2hpZnRcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuICAgICAgICBjdHguc2hhZG93Q29sb3IgPSBzdW5mYWNlLmNvbG91cnMucmdiYS5vcmFuZ2VTaGFkb3dEYXJrO1xyXG4gICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMztcclxuICAgICAgICAvLyBsZWZ0IGV5ZUJhbGwgY3JlYXNlXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oIGxlZnRFeWVCYXNlLmxQb2ludFgsIGxlZnRFeWVCYXNlLmxQb2ludFkgLSBlbFNoaWZ0ICk7XHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgIGxlZnRFeWVCYXNlLnRIYW5kbGVYLCBsZWZ0RXllQmFzZS50SGFuZGxlWSAtIGVsU2hpZnQsXHJcbiAgICAgICAgICAgIGxlZnRFeWVCYXNlLnJQb2ludFgsIGxlZnRFeWVCYXNlLnJQb2ludFkgLSBlbFNoaWZ0XHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgbGVmdEV5ZUJhc2UudEhhbmRsZVgsIGxlZnRFeWVCYXNlLnRIYW5kbGVZIC0gZWxTaGlmdCArIHBtLnI2NCxcclxuICAgICAgICAgICAgbGVmdEV5ZUJhc2UubFBvaW50WCwgbGVmdEV5ZUJhc2UubFBvaW50WSAtIGVsU2hpZnRcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyggcmlnaHRFeWVCYXNlLmxQb2ludFgsIHJpZ2h0RXllQmFzZS5sUG9pbnRZIC0gZWxTaGlmdCApO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICByaWdodEV5ZUJhc2UudEhhbmRsZVgsIHJpZ2h0RXllQmFzZS50SGFuZGxlWSAtIGVsU2hpZnQsXHJcbiAgICAgICAgICAgIHJpZ2h0RXllQmFzZS5yUG9pbnRYLCByaWdodEV5ZUJhc2UuclBvaW50WSAtIGVsU2hpZnRcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICByaWdodEV5ZUJhc2UudEhhbmRsZVgsIHJpZ2h0RXllQmFzZS50SGFuZGxlWSAtIGVsU2hpZnQgKyBwbS5yNjQsXHJcbiAgICAgICAgICAgIHJpZ2h0RXllQmFzZS5sUG9pbnRYLCByaWdodEV5ZUJhc2UubFBvaW50WSAtIGVsU2hpZnRcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuXHJcbiAgICAgICAgY3R4LnNoYWRvd0JsdXIgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRyYXdFeWVTaGFwZXMoKSB7XHJcblxyXG4gICAgICAgIC8vIGxlZnQgZXllc2hhcGVcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyggZmFjZUNvb3Jkcy5leWVzLmxlZnQubFBvaW50WCwgZmFjZUNvb3Jkcy5leWVzLmxlZnQubFBvaW50WSApO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLmV5ZXMubGVmdC50SGFuZGxlWCwgZmFjZUNvb3Jkcy5leWVzLmxlZnQudEhhbmRsZVkgKyBwbS5yMzIsXHJcbiAgICAgICAgICAgIGZhY2VDb29yZHMuZXllcy5sZWZ0LnJQb2ludFgsIGZhY2VDb29yZHMuZXllcy5sZWZ0LnJQb2ludFlcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLmV5ZXMubGVmdC50SGFuZGxlWCwgZmFjZUNvb3Jkcy5leWVzLmxlZnQudEhhbmRsZVkgLSBwbS5yMzIsXHJcbiAgICAgICAgICAgIGZhY2VDb29yZHMuZXllcy5sZWZ0LmxQb2ludFgsIGZhY2VDb29yZHMuZXllcy5sZWZ0LmxQb2ludFlcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKCBmYWNlQ29vcmRzLmV5ZXMubGVmdC5yUG9pbnRYLCBmYWNlQ29vcmRzLmV5ZXMubGVmdC5yUG9pbnRZICk7XHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgIGZhY2VDb29yZHMuZXllcy5sZWZ0LmJIYW5kbGVYLCBmYWNlQ29vcmRzLmV5ZXMubGVmdC5iSGFuZGxlWSxcclxuICAgICAgICAgICAgZmFjZUNvb3Jkcy5leWVzLmxlZnQubFBvaW50WCwgZmFjZUNvb3Jkcy5leWVzLmxlZnQubFBvaW50WVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgIGZhY2VDb29yZHMuZXllcy5sZWZ0LmJIYW5kbGVYLCBmYWNlQ29vcmRzLmV5ZXMubGVmdC5iSGFuZGxlWSArIHBtLnIzMixcclxuICAgICAgICAgICAgZmFjZUNvb3Jkcy5leWVzLmxlZnQuclBvaW50WCwgZmFjZUNvb3Jkcy5leWVzLmxlZnQuclBvaW50WVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuXHJcbiAgICAgICAgLy8gcmlnaHQgZXllc2hhcGVcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyggZmFjZUNvb3Jkcy5leWVzLnJpZ2h0LmxQb2ludFgsIGZhY2VDb29yZHMuZXllcy5yaWdodC5sUG9pbnRZICk7XHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgIGZhY2VDb29yZHMuZXllcy5yaWdodC50SGFuZGxlWCwgZmFjZUNvb3Jkcy5leWVzLnJpZ2h0LnRIYW5kbGVZICsgcG0ucjMyLFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLmV5ZXMucmlnaHQuclBvaW50WCwgZmFjZUNvb3Jkcy5leWVzLnJpZ2h0LnJQb2ludFlcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLmV5ZXMucmlnaHQudEhhbmRsZVgsIGZhY2VDb29yZHMuZXllcy5yaWdodC50SGFuZGxlWSAtIHBtLnIzMixcclxuICAgICAgICAgICAgZmFjZUNvb3Jkcy5leWVzLnJpZ2h0LmxQb2ludFgsIGZhY2VDb29yZHMuZXllcy5yaWdodC5sUG9pbnRZXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyggZmFjZUNvb3Jkcy5leWVzLnJpZ2h0LnJQb2ludFgsIGZhY2VDb29yZHMuZXllcy5yaWdodC5yUG9pbnRZICk7XHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgIGZhY2VDb29yZHMuZXllcy5yaWdodC5iSGFuZGxlWCwgZmFjZUNvb3Jkcy5leWVzLnJpZ2h0LmJIYW5kbGVZLFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLmV5ZXMucmlnaHQubFBvaW50WCwgZmFjZUNvb3Jkcy5leWVzLnJpZ2h0LmxQb2ludFlcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLmV5ZXMucmlnaHQuYkhhbmRsZVgsIGZhY2VDb29yZHMuZXllcy5yaWdodC5iSGFuZGxlWSArIHBtLnIzMixcclxuICAgICAgICAgICAgZmFjZUNvb3Jkcy5leWVzLnJpZ2h0LnJQb2ludFgsIGZhY2VDb29yZHMuZXllcy5yaWdodC5yUG9pbnRZXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRyYXdMZWZ0UHVwaWwoIHB1cGlscywgY29tcHV0ZWRQcm9wZXJ0aWVzICkge1xyXG4gICAgICAgIHZhciBsZWZ0RXllQ29uc3RyYWludFgsIGxlZnRFeWVDb25zdHJhaW50WTtcclxuXHJcbiAgICAgICAgaWYgKCBwdXBpbHMubGVmdC54ICsgY29tcHV0ZWRQcm9wZXJ0aWVzLmxlZnQuY29tcHV0ZWQueCA8IHB1cGlscy5sZWZ0LnggLSBjb21wdXRlZFByb3BlcnRpZXMuY29uZmlnLnIgKSB7XHJcbiAgICAgICAgICAgIGxlZnRFeWVDb25zdHJhaW50WCA9IHB1cGlscy5sZWZ0LnggLSBjb21wdXRlZFByb3BlcnRpZXMuY29uZmlnLnI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCBwdXBpbHMubGVmdC54ICsgY29tcHV0ZWRQcm9wZXJ0aWVzLmxlZnQuY29tcHV0ZWQueCA+IHB1cGlscy5sZWZ0LnggKyBjb21wdXRlZFByb3BlcnRpZXMuY29uZmlnLnIgKSB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0RXllQ29uc3RyYWludFggPSBwdXBpbHMubGVmdC54ICsgY29tcHV0ZWRQcm9wZXJ0aWVzLmNvbmZpZy5yO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGVmdEV5ZUNvbnN0cmFpbnRYID0gcHVwaWxzLmxlZnQueCArIGNvbXB1dGVkUHJvcGVydGllcy5sZWZ0LmNvbXB1dGVkLng7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggcHVwaWxzLmxlZnQueSArIGNvbXB1dGVkUHJvcGVydGllcy5sZWZ0LmNvbXB1dGVkLnkgPCBwdXBpbHMubGVmdC55IC0gY29tcHV0ZWRQcm9wZXJ0aWVzLmNvbmZpZy5yICkge1xyXG4gICAgICAgICAgICBsZWZ0RXllQ29uc3RyYWludFkgPSBwdXBpbHMubGVmdC55IC0gKCBjb21wdXRlZFByb3BlcnRpZXMuY29uZmlnLnIgLyAxLjEgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIHB1cGlscy5sZWZ0LnkgKyBjb21wdXRlZFByb3BlcnRpZXMubGVmdC5jb21wdXRlZC55ID4gcHVwaWxzLmxlZnQueSArICggY29tcHV0ZWRQcm9wZXJ0aWVzLmNvbmZpZy5yIC8gMS41ICkgKSB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0RXllQ29uc3RyYWludFkgPSBwdXBpbHMubGVmdC55ICsgKCBjb21wdXRlZFByb3BlcnRpZXMuY29uZmlnLnIgLyAxLjUgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxlZnRFeWVDb25zdHJhaW50WSA9IHB1cGlscy5sZWZ0LnkgKyBjb21wdXRlZFByb3BlcnRpZXMubGVmdC5jb21wdXRlZC55O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbGVmdEV5ZURldGFpbHMgPSB0cmlnLmdldEFuZ2xlQW5kRGlzdGFuY2UoXHJcbiAgICAgICAgICAgIHB1cGlscy5sZWZ0LngsIHB1cGlscy5sZWZ0LnksXHJcbiAgICAgICAgICAgIGxlZnRFeWVDb25zdHJhaW50WCwgbGVmdEV5ZUNvbnN0cmFpbnRZXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpXHJcbiAgICAgICAgdmFyIGxlZnRFeWVTY2FsZSA9IGVhc2luZy5lYXNlSW5TaW5lKCBsZWZ0RXllRGV0YWlscy5kaXN0YW5jZSwgMSwgLTAuNjAgLGV5ZUJhc2VSYWRpdXMpO1xyXG4gICAgICAgIHZhciBsZWZ0RXllUmV2ZXJzZVNjYWxlID0gMS9sZWZ0RXllU2NhbGU7XHJcblxyXG5cclxuICAgICAgICAvLyBwdXBpbFxyXG4gICAgICAgIGN0eC50cmFuc2xhdGUoIGxlZnRFeWVDb25zdHJhaW50WCwgbGVmdEV5ZUNvbnN0cmFpbnRZICk7XHJcbiAgICAgICAgY3R4LnJvdGF0ZSggbGVmdEV5ZURldGFpbHMuYW5nbGUgKTtcclxuICAgICAgICBjdHguc2NhbGUoIGxlZnRFeWVTY2FsZSwgMSApO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ2xlZnRFeWVEZXRhaWxzLmFuZ2xlOiAnLCBsZWZ0RXllRGV0YWlscy5hbmdsZSApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnbGVmdEV5ZVNjYWxlOiAnLCBsZWZ0RXllU2NhbGUgKTtcclxuXHJcbiAgICAgICAgaWYgKCAhb3ZlcmxheUNmZy5kaXNwbGF5T3ZlcmxheSApIHtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHN1bmZhY2UuY29sb3Vycy5iYXNlLm9yYW5nZTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc3VuZmFjZS5jb2xvdXJzLmJhc2Uub3JhbmdlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBzdW5mYWNlLmNvbG91cnMuZGVidWcuZGltbWVkO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBzdW5mYWNlLmNvbG91cnMuZGVidWcuZGltbWVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIDAsIDAsIHB1cGlscy5sZWZ0LnIgKiAxLjQgKTtcclxuXHJcbiAgICAgICAgLy8gaXJpc1xyXG4gICAgICAgIGlmICggIW92ZXJsYXlDZmcuZGlzcGxheU92ZXJsYXkgKSB7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSggMCwgMCwgMCwgMC41ICknO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguZmlsbENpcmNsZSggMCwgMCwgcHVwaWxzLmxlZnQuciAqIDAuOCApO1xyXG5cclxuICAgICAgICBjdHguc2NhbGUoIGxlZnRFeWVSZXZlcnNlU2NhbGUsIDEgKTtcclxuICAgICAgICBjdHgucm90YXRlKCAtbGVmdEV5ZURldGFpbHMuYW5nbGUgKTtcclxuICAgICAgICBjdHgudHJhbnNsYXRlKCAtbGVmdEV5ZUNvbnN0cmFpbnRYLCAtbGVmdEV5ZUNvbnN0cmFpbnRZICk7XHJcblxyXG4gICAgICAgIGlmICggIW92ZXJsYXlDZmcuZGlzcGxheU92ZXJsYXkgKSB7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSggMTAwLCAxMDAsIDIwMCwgMC42ICknO1xyXG4gICAgICAgICAgICAvLyBjdHguZmlsbFN0eWxlID0gJ3JlZCc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKCAxNTAsIDE1MCwgMjU1LCAwICknO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGxlZnRFeWUgPSBmYWNlQ29vcmRzLmV5ZXMubGVmdDtcclxuXHJcbiAgICAgICAgLy8gZXllbGlkIHNoYWRvd1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKCBsZWZ0RXllLmxQb2ludFgsIGxlZnRFeWUubFBvaW50WSApO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICBsZWZ0RXllLnRIYW5kbGVYLCBsZWZ0RXllLnRIYW5kbGVZICsgcG0ucjE2LFxyXG4gICAgICAgICAgICBsZWZ0RXllLnJQb2ludFgsIGxlZnRFeWUuclBvaW50WVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggbGVmdEV5ZS5yUG9pbnRYLCBsZWZ0RXllLnJQb2ludFkgLSBwbS5yNCApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIGxlZnRFeWUubFBvaW50WCwgbGVmdEV5ZS5sUG9pbnRZIC0gcG0ucjQgKTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuXHJcblxyXG4gICAgICAgIC8vIGV5ZSBzcG90IHNoaW5lXHJcbiAgICAgICAgaWYgKCAhb3ZlcmxheUNmZy5kaXNwbGF5T3ZlcmxheSApIHtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKCAyNTUsIDI1NSwgMjU1LCAxICknO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSggMjU1LCAyNTUsIDI1NSwgMC4yICknO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguZmlsbENpcmNsZSggbGVmdEV5ZUJhc2VYICsgcG0ucjMyLCBsZWZ0RXllQmFzZVkgLSBwbS5yNjQsIHBtLnIzMiApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRyYXdSaWdodFB1cGlsKCBwdXBpbHMsIGNvbXB1dGVkUHJvcGVydGllcyApIHtcclxuXHJcbiAgICAgICAgdmFyIHJpZ2h0RXllQ29uc3RyYWludFgsIHJpZ2h0RXllQ29uc3RyYWludFk7XHJcblxyXG4gICAgICAgIGlmICggcHVwaWxzLnJpZ2h0LnggKyBjb21wdXRlZFByb3BlcnRpZXMucmlnaHQuY29tcHV0ZWQueCA8IHB1cGlscy5yaWdodC54IC0gY29tcHV0ZWRQcm9wZXJ0aWVzLmNvbmZpZy5yICkge1xyXG4gICAgICAgICAgICByaWdodEV5ZUNvbnN0cmFpbnRYID0gcHVwaWxzLnJpZ2h0LnggLSBjb21wdXRlZFByb3BlcnRpZXMuY29uZmlnLnI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCBwdXBpbHMucmlnaHQueCArIGNvbXB1dGVkUHJvcGVydGllcy5yaWdodC5jb21wdXRlZC54ID4gcHVwaWxzLnJpZ2h0LnggKyBjb21wdXRlZFByb3BlcnRpZXMuY29uZmlnLnIgKSB7XHJcbiAgICAgICAgICAgICAgICByaWdodEV5ZUNvbnN0cmFpbnRYID0gcHVwaWxzLnJpZ2h0LnggKyBjb21wdXRlZFByb3BlcnRpZXMuY29uZmlnLnI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByaWdodEV5ZUNvbnN0cmFpbnRYID0gcHVwaWxzLnJpZ2h0LnggKyBjb21wdXRlZFByb3BlcnRpZXMucmlnaHQuY29tcHV0ZWQueDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBwdXBpbHMucmlnaHQueSArIGNvbXB1dGVkUHJvcGVydGllcy5yaWdodC5jb21wdXRlZC55IDwgcHVwaWxzLnJpZ2h0LnkgLSBjb21wdXRlZFByb3BlcnRpZXMuY29uZmlnLnIgKSB7XHJcbiAgICAgICAgICAgIHJpZ2h0RXllQ29uc3RyYWludFkgPSBwdXBpbHMucmlnaHQueSAtICggY29tcHV0ZWRQcm9wZXJ0aWVzLmNvbmZpZy5yIC8gMS4xICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCBwdXBpbHMucmlnaHQueSArIGNvbXB1dGVkUHJvcGVydGllcy5yaWdodC5jb21wdXRlZC55ID4gcHVwaWxzLnJpZ2h0LnkgKyAoIGNvbXB1dGVkUHJvcGVydGllcy5jb25maWcuciAvIDEuNSApICkge1xyXG4gICAgICAgICAgICAgICAgcmlnaHRFeWVDb25zdHJhaW50WSA9IHB1cGlscy5yaWdodC55ICsgKCBjb21wdXRlZFByb3BlcnRpZXMuY29uZmlnLnIgLyAxLjUgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJpZ2h0RXllQ29uc3RyYWludFkgPSBwdXBpbHMucmlnaHQueSArIGNvbXB1dGVkUHJvcGVydGllcy5yaWdodC5jb21wdXRlZC55O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcmlnaHRFeWVEZXRhaWxzID0gdHJpZy5nZXRBbmdsZUFuZERpc3RhbmNlKFxyXG4gICAgICAgICAgICBwdXBpbHMucmlnaHQueCwgcHVwaWxzLnJpZ2h0LnksXHJcbiAgICAgICAgICAgIHJpZ2h0RXllQ29uc3RyYWludFgsIHJpZ2h0RXllQ29uc3RyYWludFlcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdmFyIHJpZ2h0RXllU2NhbGUgPSBlYXNpbmcuZWFzZUluU2luZSggcmlnaHRFeWVEZXRhaWxzLmRpc3RhbmNlLCAxLCAtMC42MCAsZXllQmFzZVJhZGl1cyk7XHJcbiAgICAgICAgdmFyIHJpZ2h0RXllUmV2ZXJzZVNjYWxlID0gMS9yaWdodEV5ZVNjYWxlO1xyXG5cclxuICAgICAgICAvLyByaWdodCBwdXBpbFxyXG4gICAgICAgIGN0eC50cmFuc2xhdGUoIHJpZ2h0RXllQ29uc3RyYWludFgsIHJpZ2h0RXllQ29uc3RyYWludFkgKTtcclxuICAgICAgICBjdHgucm90YXRlKCByaWdodEV5ZURldGFpbHMuYW5nbGUgKTtcclxuICAgICAgICBjdHguc2NhbGUoIHJpZ2h0RXllU2NhbGUsIDEgKTtcclxuXHJcbiAgICAgICAgaWYgKCAhb3ZlcmxheUNmZy5kaXNwbGF5T3ZlcmxheSApIHtcclxuXHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBzdW5mYWNlLmNvbG91cnMuYmFzZS5vcmFuZ2U7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHN1bmZhY2UuY29sb3Vycy5iYXNlLm9yYW5nZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gc3VuZmFjZS5jb2xvdXJzLmRlYnVnLmRpbW1lZDtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc3VuZmFjZS5jb2xvdXJzLmRlYnVnLmRpbW1lZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCAwLCAwLCBwdXBpbHMucmlnaHQuciAqIDEuNCApO1xyXG5cclxuICAgICAgICBpZiAoICFvdmVybGF5Q2ZnLmRpc3BsYXlPdmVybGF5ICkge1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoIDAsIDAsIDAsIDAuNSApJztcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIDAsIDAsIHB1cGlscy5yaWdodC5yICogMC44ICk7XHJcbiAgICAgICAgY3R4LnNjYWxlKCByaWdodEV5ZVJldmVyc2VTY2FsZSwgMSApO1xyXG4gICAgICAgIGN0eC5yb3RhdGUoIC1yaWdodEV5ZURldGFpbHMuYW5nbGUgKTtcclxuICAgICAgICBjdHgudHJhbnNsYXRlKCAtcmlnaHRFeWVDb25zdHJhaW50WCwgLXJpZ2h0RXllQ29uc3RyYWludFkgKTtcclxuXHJcblxyXG4gICAgICAgIGlmICggIW92ZXJsYXlDZmcuZGlzcGxheU92ZXJsYXkgKSB7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSggMTAwLCAxMDAsIDIwMCwgMC42ICknO1xyXG4gICAgICAgICAgICAvLyBjdHguZmlsbFN0eWxlID0gJ3JlZCc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKCAxNTAsIDE1MCwgMjU1LCAwICknO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHJpZ2h0RXllID0gZmFjZUNvb3Jkcy5leWVzLnJpZ2h0O1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyggcmlnaHRFeWUubFBvaW50WCwgcmlnaHRFeWUubFBvaW50WSApO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICByaWdodEV5ZS50SGFuZGxlWCwgcmlnaHRFeWUudEhhbmRsZVkgKyBwbS5yMTYsXHJcbiAgICAgICAgICAgIHJpZ2h0RXllLnJQb2ludFgsIHJpZ2h0RXllLnJQb2ludFlcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIHJpZ2h0RXllLnJQb2ludFgsIHJpZ2h0RXllLnJQb2ludFkgLSBwbS5yNCApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIHJpZ2h0RXllLmxQb2ludFgsIHJpZ2h0RXllLmxQb2ludFkgLSBwbS5yNCApO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKCAhb3ZlcmxheUNmZy5kaXNwbGF5T3ZlcmxheSApIHtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKCAyNTUsIDI1NSwgMjU1LCAxICknO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSggMjU1LCAyNTUsIDI1NSwgMC4yICknO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIHJpZ2h0RXllQmFzZVggKyBwbS5yMzIsIHJpZ2h0RXllQmFzZVkgLSBwbS5yNjQsIHBtLnIzMiApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRyYXdDaGVla3MoIGl0ZW0sIGZpbGxDdXJ2ZU9mZnNldCwgcHJvcE1lYXN1cmUsIGJsdXIsICBjb250ZXh0ICkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBjID0gY29udGV4dDtcclxuICAgICAgICB2YXIgb2Zmc2V0ID0gJ3InK2ZpbGxDdXJ2ZU9mZnNldDtcclxuICAgICAgICB2YXIgaXRlbSA9IGl0ZW07XHJcbiAgICAgICAgdmFyIHBtID0gcHJvcE1lYXN1cmU7XHJcbiAgICAgICAgdmFyIGJsdXJBbXQgPSBibHVyO1xyXG4gICAgICAgIHZhciBzdG9yZU9mZnNldCA9IHBtWyBvZmZzZXQgXTtcclxuICAgICAgICB2YXIgcmVuZGVyT2Zmc2V0ID0gMTAwMDAwO1xyXG5cclxuICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGMubW92ZVRvKCBpdGVtLnRQb2ludFgsIGl0ZW0udFBvaW50WSAtIHJlbmRlck9mZnNldCApO1xyXG4gICAgICAgIGMucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgaXRlbS5oYW5kbGVYIC0gc3RvcmVPZmZzZXQsIGl0ZW0uaGFuZGxlWSAtIHJlbmRlck9mZnNldCxcclxuICAgICAgICAgICAgaXRlbS5iUG9pbnRYLCBpdGVtLmJQb2ludFkgLSByZW5kZXJPZmZzZXRcclxuICAgICAgICApO1xyXG4gICAgICAgIGMucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgaXRlbS5oYW5kbGVYICsgc3RvcmVPZmZzZXQsIGl0ZW0uaGFuZGxlWSAtIHJlbmRlck9mZnNldCxcclxuICAgICAgICAgICAgaXRlbS50UG9pbnRYLCBpdGVtLnRQb2ludFkgLSByZW5kZXJPZmZzZXRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjLnNoYWRvd0NvbG9yID0gc3VuZmFjZS5jb2xvdXJzLnJnYmEub3JhbmdlU2hhZG93RGFyaztcclxuICAgICAgICBjLnNoYWRvd0JsdXIgPSBibHVyQW10O1xyXG4gICAgICAgIGMuc2hhZG93T2Zmc2V0WCA9IDA7XHJcbiAgICAgICAgYy5zaGFkb3dPZmZzZXRZID0gcmVuZGVyT2Zmc2V0O1xyXG4gICAgICAgIGMuZmlsbCgpO1xyXG4gICAgICAgIGMuc2hhZG93Qmx1ciA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZHJhd05vc2UoKSB7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuXHJcbiAgICAgICAgLy8gcG9pbnQgMSAoIHN0YXJ0L2ZpbmlzaCApXHJcbiAgICAgICAgY3R4Lm1vdmVUbyggZmFjZUNvb3Jkcy5ub3NlLnBvaW50MVgsIGZhY2VDb29yZHMubm9zZS5wb2ludDFZICsgcG0ucjE2ICk7XHJcblxyXG4gICAgICAgIC8vIGRvd24gY3VydmUgb3V0ZXJcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgZmFjZUNvb3Jkcy5ub3NlLmhhbmRsZTFYIC0gcG0ucjMyLCBmYWNlQ29vcmRzLm5vc2UuaGFuZGxlMVksXHJcbiAgICAgICAgICAgIGZhY2VDb29yZHMubm9zZS5wb2ludDJYIC0gcG0ucjMyLCBmYWNlQ29vcmRzLm5vc2UucG9pbnQyWSArIHBtLnIzMlxyXG4gICAgICAgICk7XHJcbiAgICAgICAgLy8gY3Jvc3MgY3VydmUgb3V0ZXJcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgZmFjZUNvb3Jkcy5ub3NlLmhhbmRsZTJYLCBmYWNlQ29vcmRzLm5vc2UuaGFuZGxlMlkgKyBwbS5yMzIsXHJcbiAgICAgICAgICAgIGZhY2VDb29yZHMubm9zZS5wb2ludDNYLCBmYWNlQ29vcmRzLm5vc2UucG9pbnQzWVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgLy8gY3Jvc3MgY3VydmUgaW5uZXIgKCByZXR1cm4gcGF0aCApXHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgIGZhY2VDb29yZHMubm9zZS5oYW5kbGUyWCwgZmFjZUNvb3Jkcy5ub3NlLmhhbmRsZTJZLFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLm5vc2UucG9pbnQyWCwgZmFjZUNvb3Jkcy5ub3NlLnBvaW50MllcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIGRvd24gY3VydmUgaW5uZXIgKCByZXR1cm4gcGF0aCApXHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgIGZhY2VDb29yZHMubm9zZS5oYW5kbGUxWCwgZmFjZUNvb3Jkcy5ub3NlLmhhbmRsZTFZLFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLm5vc2UucG9pbnQxWCwgZmFjZUNvb3Jkcy5ub3NlLnBvaW50MVkgKyBwbS5yMTZcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICAvLyBjdHguZmlsbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRyYXdOb3NlU2hhZG93KCBub3NlLCBtb3V0aCApIHtcclxuXHJcbiAgICAgICAgbGV0IGVsU2hpZnQgPSAxMDAwMDA7XHJcbiAgICAgICAgbGV0IG5vc2VQb2ludHMgPSBub3NlO1xyXG4gICAgICAgIGxldCBtb3V0aFBvaW50cyA9IG1vdXRoO1xyXG5cclxuICAgICAgICBjdHguc2hhZG93Q29sb3IgPSBzdW5mYWNlLmNvbG91cnMucmdiYS5vcmFuZ2VTaGFkb3c7XHJcbiAgICAgICAgY3R4LnNoYWRvd0JsdXIgPSA1O1xyXG5cclxuICAgICAgICAvLyBub3NlIHNoYWRvd1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKCBub3NlUG9pbnRzLnBvaW50MlggLSBwbS5yMTYsIG5vc2VQb2ludHMucG9pbnQyWSAtIHBtLnIzMiAtIGVsU2hpZnQgKTtcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgbm9zZVBvaW50cy5oYW5kbGUyWCwgbm9zZVBvaW50cy5oYW5kbGUyWSAtIGVsU2hpZnQsXHJcbiAgICAgICAgICAgIG5vc2VQb2ludHMucG9pbnQzWCArIHBtLnIxNiwgbm9zZVBvaW50cy5wb2ludDNZIC0gcG0ucjMyIC0gZWxTaGlmdFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgIG1vdXRoUG9pbnRzLnRvcF9vdXRlcl9hbmNob3JfWCwgbW91dGhQb2ludHMudG9wX291dGVyX2FuY2hvcl9ZICsgcG0ucjE2IC0gZWxTaGlmdCxcclxuICAgICAgICAgICAgbm9zZVBvaW50cy5wb2ludDJYIC0gcG0ucjE2LCBub3NlUG9pbnRzLnBvaW50MlkgLSBwbS5yMzIgLSBlbFNoaWZ0XHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFggPSAwO1xyXG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gZWxTaGlmdDtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDE7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKCBub3NlUG9pbnRzLnBvaW50MlgsIG5vc2VQb2ludHMucG9pbnQyWSAtIGVsU2hpZnQgKTtcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgbm9zZVBvaW50cy5oYW5kbGUyWCwgbm9zZVBvaW50cy5oYW5kbGUyWSAtIGVsU2hpZnQsXHJcbiAgICAgICAgICAgIG5vc2VQb2ludHMucG9pbnQzWCwgbm9zZVBvaW50cy5wb2ludDNZIC0gZWxTaGlmdFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgIG5vc2VQb2ludHMuaGFuZGxlMlgsIG5vc2VQb2ludHMuaGFuZGxlMlkgKyBwbS5yMTYgLSBlbFNoaWZ0LFxyXG4gICAgICAgICAgICBub3NlUG9pbnRzLnBvaW50MlgsIG5vc2VQb2ludHMucG9pbnQyWSAtIGVsU2hpZnRcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDA7XHJcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSBlbFNoaWZ0IC0gNTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkcmF3TW91dGhTaGFwZSggaXRlbSwgdG9wR3JhZGllbnQsIGJvdHRvbUdyYWRpZW50ICkge1xyXG5cclxuICAgICAgICAvLyB0b3AgbGlwIHNoYXBlXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oIGl0ZW0ubGVmdF9vdXRlcl9hbmNob3JfWCwgaXRlbS5sZWZ0X291dGVyX2FuY2hvcl9ZICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggaXRlbS5sZWZ0X2lubmVyX2FuY2hvcl9YLCBpdGVtLmxlZnRfaW5uZXJfYW5jaG9yX1kgKTtcclxuXHJcbiAgICAgICAgLy8gdG9wIGxlZnQgaW5uZXIgYm93XHJcbiAgICAgICAgY3R4LmJlemllckN1cnZlVG8oXHJcbiAgICAgICAgICAgIGl0ZW0udG9wX2xlZnRfaW5uZXJfY3AxX1gsIGl0ZW0udG9wX2xlZnRfaW5uZXJfY3AxX1ksXHJcbiAgICAgICAgICAgIGl0ZW0udG9wX2xlZnRfaW5uZXJfY3AyX1gsIGl0ZW0udG9wX2xlZnRfaW5uZXJfY3AyX1ksXHJcbiAgICAgICAgICAgIGl0ZW0udG9wX2lubmVyX2FuY2hvcl9YLCBpdGVtLnRvcF9pbm5lcl9hbmNob3JfWVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIHRvcCByaWdodCBpbm5lciBib3dcclxuICAgICAgICBjdHguYmV6aWVyQ3VydmVUbyhcclxuICAgICAgICAgICAgaXRlbS50b3BfcmlnaHRfaW5uZXJfY3AyX1gsIGl0ZW0udG9wX3JpZ2h0X2lubmVyX2NwMl9ZLFxyXG4gICAgICAgICAgICBpdGVtLnRvcF9yaWdodF9pbm5lcl9jcDFfWCwgaXRlbS50b3BfcmlnaHRfaW5uZXJfY3AxX1ksXHJcbiAgICAgICAgICAgIGl0ZW0ucmlnaHRfaW5uZXJfYW5jaG9yX1gsIGl0ZW0ucmlnaHRfaW5uZXJfYW5jaG9yX1lcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjdHgubGluZVRvKCBpdGVtLnJpZ2h0X291dGVyX2FuY2hvcl9YLCBpdGVtLnJpZ2h0X291dGVyX2FuY2hvcl9ZICk7XHJcblxyXG4gICAgICAgIC8vIHRvcCByaWdodCBvdXRlciBib3dcclxuICAgICAgICBjdHguYmV6aWVyQ3VydmVUbyhcclxuICAgICAgICAgICAgaXRlbS50b3BfcmlnaHRfb3V0ZXJfY3AxX1gsIGl0ZW0udG9wX3JpZ2h0X291dGVyX2NwMV9ZLFxyXG4gICAgICAgICAgICBpdGVtLnRvcF9yaWdodF9vdXRlcl9jcDJfWCwgaXRlbS50b3BfcmlnaHRfb3V0ZXJfY3AyX1ksXHJcbiAgICAgICAgICAgIGl0ZW0udG9wX291dGVyX2FuY2hvcl9YLCBpdGVtLnRvcF9vdXRlcl9hbmNob3JfWVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgLy8gdG9wIGxlZnQgb3V0ZXIgYm93XHJcbiAgICAgICAgY3R4LmJlemllckN1cnZlVG8oXHJcbiAgICAgICAgICAgIGl0ZW0udG9wX2xlZnRfb3V0ZXJfY3AyX1gsIGl0ZW0udG9wX2xlZnRfb3V0ZXJfY3AyX1ksXHJcbiAgICAgICAgICAgIGl0ZW0udG9wX2xlZnRfb3V0ZXJfY3AxX1ggLCBpdGVtLnRvcF9sZWZ0X291dGVyX2NwMV9ZLFxyXG4gICAgICAgICAgICBpdGVtLmxlZnRfb3V0ZXJfYW5jaG9yX1gsIGl0ZW0ubGVmdF9vdXRlcl9hbmNob3JfWVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgICBpZiAoICFvdmVybGF5Q2ZnLmRpc3BsYXlPdmVybGF5ICkge1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gdG9wR3JhZGllbnQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHN1bmZhY2UuY29sb3Vycy5kZWJ1Zy5vcmFuZ2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuXHJcbiAgICAgICAgLy8gYm90dG9tIGxpcCBzaGFwZVxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKCBpdGVtLmxlZnRfb3V0ZXJfYW5jaG9yX1gsIGl0ZW0ubGVmdF9vdXRlcl9hbmNob3JfWSApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIGl0ZW0ubGVmdF9pbm5lcl9hbmNob3JfWCwgaXRlbS5sZWZ0X2lubmVyX2FuY2hvcl9ZICk7XHJcblxyXG4gICAgICAgIC8vIGJvdHRvbSBsZWZ0IGlubmVyIGJvd1xyXG4gICAgICAgIGN0eC5iZXppZXJDdXJ2ZVRvKFxyXG4gICAgICAgICAgICBpdGVtLmJvdHRvbV9sZWZ0X2lubmVyX2NwMV9YLCBpdGVtLmJvdHRvbV9sZWZ0X2lubmVyX2NwMV9ZLFxyXG4gICAgICAgICAgICBpdGVtLmJvdHRvbV9sZWZ0X2lubmVyX2NwMl9YLCBpdGVtLmJvdHRvbV9sZWZ0X2lubmVyX2NwMl9ZLFxyXG4gICAgICAgICAgICBpdGVtLmJvdHRvbV9pbm5lcl9hbmNob3JfWCwgaXRlbS5ib3R0b21faW5uZXJfYW5jaG9yX1lcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBib3R0b20gcmlnaHQgaW5uZXIgYm93XHJcbiAgICAgICAgY3R4LmJlemllckN1cnZlVG8oXHJcbiAgICAgICAgICAgIGl0ZW0uYm90dG9tX3JpZ2h0X2lubmVyX2NwMl9YLCBpdGVtLmJvdHRvbV9yaWdodF9pbm5lcl9jcDJfWSxcclxuICAgICAgICAgICAgaXRlbS5ib3R0b21fcmlnaHRfaW5uZXJfY3AxX1gsIGl0ZW0uYm90dG9tX3JpZ2h0X2lubmVyX2NwMV9ZLFxyXG4gICAgICAgICAgICBpdGVtLnJpZ2h0X2lubmVyX2FuY2hvcl9YLCBpdGVtLnJpZ2h0X2lubmVyX2FuY2hvcl9ZXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY3R4LmxpbmVUbyggaXRlbS5yaWdodF9vdXRlcl9hbmNob3JfWCwgaXRlbS5yaWdodF9vdXRlcl9hbmNob3JfWSApO1xyXG5cclxuICAgICAgICAvLyBib3R0b20gcmlnaHQgb3V0ZXIgYm93XHJcbiAgICAgICAgY3R4LmJlemllckN1cnZlVG8oXHJcbiAgICAgICAgICAgIGl0ZW0uYm90dG9tX3JpZ2h0X291dGVyX2NwMV9YLCBpdGVtLmJvdHRvbV9yaWdodF9vdXRlcl9jcDFfWSxcclxuICAgICAgICAgICAgaXRlbS5ib3R0b21fcmlnaHRfb3V0ZXJfY3AyX1gsIGl0ZW0uYm90dG9tX3JpZ2h0X291dGVyX2NwMl9ZLFxyXG4gICAgICAgICAgICBpdGVtLmJvdHRvbV9vdXRlcl9hbmNob3JfWCwgaXRlbS5ib3R0b21fb3V0ZXJfYW5jaG9yX1lcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIGJvdHRvbSBsZWZ0IG91dGVyIGJvd1xyXG4gICAgICAgIGN0eC5iZXppZXJDdXJ2ZVRvKFxyXG4gICAgICAgICAgICBpdGVtLmJvdHRvbV9sZWZ0X291dGVyX2NwMl9YLCBpdGVtLmJvdHRvbV9sZWZ0X291dGVyX2NwMl9ZLFxyXG4gICAgICAgICAgICBpdGVtLmJvdHRvbV9sZWZ0X291dGVyX2NwMV9YLCBpdGVtLmJvdHRvbV9sZWZ0X291dGVyX2NwMV9ZLFxyXG4gICAgICAgICAgICBpdGVtLmxlZnRfb3V0ZXJfYW5jaG9yX1gsIGl0ZW0ubGVmdF9vdXRlcl9hbmNob3JfWVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGlmICggIW92ZXJsYXlDZmcuZGlzcGxheU92ZXJsYXkgKSB7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBib3R0b21HcmFkaWVudDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gc3VuZmFjZS5jb2xvdXJzLmRlYnVnLm9yYW5nZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuXHJcbiAgICAgICAgLy8gLy8gYm90dG9tIGxpcCBzaGFwZVxyXG4gICAgICAgIC8vIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAvLyBjdHgubW92ZVRvKCBpdGVtLmxlZnRfb3V0ZXJfYW5jaG9yX1gsIGl0ZW0ubGVmdF9vdXRlcl9hbmNob3JfWSAtIDEwMDAwMCApO1xyXG4gICAgICAgIC8vIGN0eC5saW5lVG8oIGl0ZW0ubGVmdF9pbm5lcl9hbmNob3JfWCwgaXRlbS5sZWZ0X2lubmVyX2FuY2hvcl9ZIC0gMTAwMDAwICk7XHJcblxyXG4gICAgICAgIC8vIC8vIGJvdHRvbSBsZWZ0IGlubmVyIGJvd1xyXG4gICAgICAgIC8vIGN0eC5iZXppZXJDdXJ2ZVRvKFxyXG4gICAgICAgIC8vICAgICBpdGVtLmJvdHRvbV9sZWZ0X2lubmVyX2NwMV9YLCBpdGVtLmJvdHRvbV9sZWZ0X2lubmVyX2NwMV9ZIC0gMTAwMDAwLFxyXG4gICAgICAgIC8vICAgICBpdGVtLmJvdHRvbV9sZWZ0X2lubmVyX2NwMl9YLCBpdGVtLmJvdHRvbV9sZWZ0X2lubmVyX2NwMl9ZIC0gMTAwMDAwLFxyXG4gICAgICAgIC8vICAgICBpdGVtLmJvdHRvbV9pbm5lcl9hbmNob3JfWCwgaXRlbS5ib3R0b21faW5uZXJfYW5jaG9yX1kgLSAxMDAwMDBcclxuICAgICAgICAvLyApO1xyXG5cclxuICAgICAgICAvLyAvLyBib3R0b20gcmlnaHQgaW5uZXIgYm93XHJcbiAgICAgICAgLy8gY3R4LmJlemllckN1cnZlVG8oXHJcbiAgICAgICAgLy8gICAgIGl0ZW0uYm90dG9tX3JpZ2h0X2lubmVyX2NwMl9YLCBpdGVtLmJvdHRvbV9yaWdodF9pbm5lcl9jcDJfWSAtIDEwMDAwMCxcclxuICAgICAgICAvLyAgICAgaXRlbS5ib3R0b21fcmlnaHRfaW5uZXJfY3AxX1gsIGl0ZW0uYm90dG9tX3JpZ2h0X2lubmVyX2NwMV9ZIC0gMTAwMDAwLFxyXG4gICAgICAgIC8vICAgICBpdGVtLnJpZ2h0X2lubmVyX2FuY2hvcl9YLCBpdGVtLnJpZ2h0X2lubmVyX2FuY2hvcl9ZIC0gMTAwMDAwXHJcbiAgICAgICAgLy8gKTtcclxuXHJcbiAgICAgICAgLy8gY3R4LmxpbmVUbyggaXRlbS5yaWdodF9vdXRlcl9hbmNob3JfWCwgaXRlbS5yaWdodF9vdXRlcl9hbmNob3JfWSAtIDEwMDAwMCApO1xyXG5cclxuICAgICAgICAvLyAvLyBib3R0b20gcmlnaHQgb3V0ZXIgYm93XHJcbiAgICAgICAgLy8gY3R4LmJlemllckN1cnZlVG8oXHJcbiAgICAgICAgLy8gICAgIGl0ZW0uYm90dG9tX3JpZ2h0X291dGVyX2NwMV9YLCBpdGVtLmJvdHRvbV9yaWdodF9vdXRlcl9jcDFfWSAtIDEwMDAwMCxcclxuICAgICAgICAvLyAgICAgaXRlbS5ib3R0b21fcmlnaHRfb3V0ZXJfY3AyX1gsIGl0ZW0uYm90dG9tX3JpZ2h0X291dGVyX2NwMl9ZIC0gMTAwMDAwLFxyXG4gICAgICAgIC8vICAgICBpdGVtLmJvdHRvbV9vdXRlcl9hbmNob3JfWCwgaXRlbS5ib3R0b21fb3V0ZXJfYW5jaG9yX1kgLSAxMDAwMDBcclxuICAgICAgICAvLyApO1xyXG4gICAgICAgIC8vIC8vIGJvdHRvbSBsZWZ0IG91dGVyIGJvd1xyXG4gICAgICAgIC8vIGN0eC5iZXppZXJDdXJ2ZVRvKFxyXG4gICAgICAgIC8vICAgICBpdGVtLmJvdHRvbV9sZWZ0X291dGVyX2NwMl9YLCBpdGVtLmJvdHRvbV9sZWZ0X291dGVyX2NwMl9ZIC0gMTAwMDAwLFxyXG4gICAgICAgIC8vICAgICBpdGVtLmJvdHRvbV9sZWZ0X291dGVyX2NwMV9YLCBpdGVtLmJvdHRvbV9sZWZ0X291dGVyX2NwMV9ZIC0gMTAwMDAwLFxyXG4gICAgICAgIC8vICAgICBpdGVtLmxlZnRfb3V0ZXJfYW5jaG9yX1gsIGl0ZW0ubGVmdF9vdXRlcl9hbmNob3JfWSAtIDEwMDAwMFxyXG4gICAgICAgIC8vICk7XHJcbiAgICAgICAgLy8gY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGlmICggIW92ZXJsYXlDZmcuZGlzcGxheU92ZXJsYXkgKSB7XHJcbiAgICAgICAgLy8gICAgIGN0eC5maWxsU3R5bGUgPSBzdW5mYWNlLmNvbG91cnMuYmFzZS55ZWxsb3c7XHJcbiAgICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgICAvLyAgICAgY3R4LmZpbGxTdHlsZSA9IHN1bmZhY2UuY29sb3Vycy5kZWJ1Zy5vcmFuZ2U7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAvLyBjdHguc2hhZG93Q29sb3IgPSAncmdiYSggMjU1LCAyNTUsIDEwMCwgMC41ICknO1xyXG4gICAgICAgIC8vIGN0eC5zaGFkb3dCbHVyID0gMTU7XHJcbiAgICAgICAgLy8gY3R4LnNoYWRvd09mZnNldFggPSAwO1xyXG4gICAgICAgIC8vIGN0eC5zaGFkb3dPZmZzZXRZID0gMTAwMDAwO1xyXG5cclxuICAgICAgICAvLyBjdHguZmlsbCgpO1xyXG5cclxuICAgICAgICAvLyBjdHguc2hhZG93T2Zmc2V0WSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZHJhd1RlZXRoKCBpdGVtICkge1xyXG5cclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG5cclxuICAgICAgICBpZiAoICFvdmVybGF5Q2ZnLmRpc3BsYXlPdmVybGF5ICkge1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVdpZHRoID0gMjtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc3VuZmFjZS5jb2xvdXJzLmJhc2Uud2hpdGVTaGFkb3c7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHN1bmZhY2UuY29sb3Vycy5kZWJ1Zy5maWxsc1RlZXRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gYm90dG9tXHJcbiAgICAgICAgZHJhd0JvdHRvbVRlZXRoKCBpdGVtICk7XHJcblxyXG4gICAgICAgIC8vIHRvcFxyXG4gICAgICAgIGRyYXdUb3BUZWV0aCggaXRlbSApO1xyXG5cclxuICAgICAgICAvLyB0ZWV0aCBzaGFkb3cgKCBkb250IHNob3cgb24gZGVidWcgbW9kZSApXHJcbiAgICAgICAgaWYgKCAhb3ZlcmxheUNmZy5kaXNwbGF5T3ZlcmxheSApIHtcclxuICAgICAgICAgICAgZHJhd1Rvb3RoU2hhZG93KCBpdGVtICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRyYXdUb3BUZWV0aCggaXRlbSApIHtcclxuICAgICAgICAvLyB0b3BcclxuICAgICAgICB2YXIgdGVldGggPSBmYWNlQ29vcmRzLnRlZXRoLnRvcDtcclxuICAgICAgICB2YXIgdG9vdGhCYXNlbGluZVkgPSB0ZWV0aC5sUG9pbnQyWSArIHBtLnI2NDtcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG5cclxuICAgICAgICBjdHgubW92ZVRvKCB0ZWV0aC5sUG9pbnQxWCAtIHBtLnIxNiAtIHBtLnIzMiwgdGVldGgubFBvaW50MVkgKTtcclxuICAgICAgICBcclxuICAgICAgICAvLy8vLy8vIGluZGl2aWR1YWwgdGVldGhcclxuICAgICAgICAvLyBsZWZ0IGNhbmluZVxyXG4gICAgICAgIGN0eC5saW5lVG8oIHRlZXRoLmxQb2ludDJYIC0gcG0ucjE2LCB0b290aEJhc2VsaW5lWSAtIHBtLnIzMiApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgdGVldGgubFBvaW50MlggKyBwbS5yMTI4LCB0b290aEJhc2VsaW5lWSArICggcG0ucjE2IC0gcG0ucjY0ICksXHJcbiAgICAgICAgICAgIHRlZXRoLmxQb2ludDJYICsgcG0ucjY0LCB0b290aEJhc2VsaW5lWVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgLy8gbGVmdCBpbmNpc29yXHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgIHRlZXRoLmxQb2ludDJYICsgcG0ucjE2ICsgcG0ucjMyLCB0b290aEJhc2VsaW5lWSArIHBtLnIzMixcclxuICAgICAgICAgICAgdGVldGgubFBvaW50MlggKyBwbS5yOCwgdG9vdGhCYXNlbGluZVlcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIGNlbnRyZSBsZWZ0IGluY2lzb3JcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgdGVldGguaGFuZGxlWCAtIHBtLnIxNiwgdG9vdGhCYXNlbGluZVkgKyBwbS5yMzIsXHJcbiAgICAgICAgICAgIHRlZXRoLmhhbmRsZVgsIHRvb3RoQmFzZWxpbmVZICsgcG0ucjY0XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gY2VudHJlIHJpZ2h0IGluY2lzb3JcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgdGVldGguaGFuZGxlWCArIHBtLnIxNiwgdG9vdGhCYXNlbGluZVkgKyBwbS5yMzIsXHJcbiAgICAgICAgICAgIHRlZXRoLnJQb2ludDJYIC0gcG0ucjgsIHRvb3RoQmFzZWxpbmVZXHJcbiAgICAgICAgKTtcclxuICAgICAgICAvLyByaWdodCBpbmNpc29yXHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgIHRlZXRoLnJQb2ludDJYIC0gcG0ucjE2IC0gcG0ucjMyLCB0b290aEJhc2VsaW5lWSArIHBtLnIzMixcclxuICAgICAgICAgICAgdGVldGguclBvaW50MlggLSBwbS5yNjQsIHRvb3RoQmFzZWxpbmVZXHJcbiAgICAgICAgKTtcclxuICAgICAgICAvLyByaWdodCBjYW5pbmVcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgdGVldGguclBvaW50MlggLSBwbS5yMTI4LCB0b290aEJhc2VsaW5lWSArICggcG0ucjE2IC0gcG0ucjY0ICksXHJcbiAgICAgICAgICAgIHRlZXRoLnJQb2ludDJYICsgcG0ucjE2LCB0b290aEJhc2VsaW5lWSAtIHBtLnIzMlxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGN0eC5saW5lVG8oIHRlZXRoLnJQb2ludDJYICsgcG0ucjE2ICsgcG0ucjMyLCB0ZWV0aC5yUG9pbnQyWSApO1xyXG5cclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZHJhd0JvdHRvbVRlZXRoKCBpdGVtICkge1xyXG5cclxuICAgICAgICB2YXIgdGVldGggPSBmYWNlQ29vcmRzLnRlZXRoLmJvdHRvbTtcclxuICAgICAgICB2YXIgdGVldGhDb25maWcgPSB0ZWV0aC5jb25maWc7XHJcbiAgICAgICAgdmFyIHRvb3RoQmFzZWxpbmVZID0gdGVldGgubFBvaW50MlkgKyBwbS5yNjQ7XHJcbiAgICAgICAgdmFyIGN1cnJYID0gMDtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcblxyXG4gICAgICAgIC8vIGJvdHRvbSBsZWZ0IGNvcm5lclxyXG4gICAgICAgIGN0eC5tb3ZlVG8oIHRlZXRoLmxQb2ludDFYLCB0ZWV0aC5sUG9pbnQxWSArIHBtLnI4ICk7XHJcblxyXG4gICAgICAgIC8vIGxlZnQgcHJlTW9sYXJcclxuICAgICAgICBjdHgubGluZVRvKCB0ZWV0aC5sUG9pbnQyWCAtIHBtLnI2NCwgdG9vdGhCYXNlbGluZVkgKyBwbS5yMzIgKTtcclxuICAgICAgICBjdXJyWCA9IHRlZXRoLmxQb2ludDJYIC0gcG0ucjY0O1xyXG5cclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgY3VyclggKyB0ZWV0aENvbmZpZy5wcmVNb2xhckNvbnRyb2wsIHRvb3RoQmFzZWxpbmVZIC0gcG0ucjMyLFxyXG4gICAgICAgICAgICBjdXJyWCArIHRlZXRoQ29uZmlnLnByZU1vbGFyV2lkdGgsIHRvb3RoQmFzZWxpbmVZXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdXJyWCArPSB0ZWV0aENvbmZpZy5wcmVNb2xhcldpZHRoXHJcbiAgICAgICAgLy8gbGVmdCBjYW5pbmVcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgY3VyclggKyB0ZWV0aENvbmZpZy5jYW5pbmVDb250cm9sLCB0b290aEJhc2VsaW5lWSAtIHBtLnIzMiAtIHBtLnI2NCxcclxuICAgICAgICAgICAgY3VyclggKyB0ZWV0aENvbmZpZy5jYW5pbmVXaWR0aCwgdG9vdGhCYXNlbGluZVlcclxuICAgICAgICApO1xyXG4gICAgICAgIGN1cnJYICs9IHRlZXRoQ29uZmlnLmNhbmluZVdpZHRoO1xyXG5cclxuICAgICAgICAvLyBsZWZ0IGluY2lzb3JcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgY3VyclggKyB0ZWV0aENvbmZpZy5pbmNpc29yQ29udHJvbCwgdG9vdGhCYXNlbGluZVkgLSBwbS5yNjQsXHJcbiAgICAgICAgICAgIGN1cnJYICsgdGVldGhDb25maWcuaW5jaXNvcldpZHRoLCB0b290aEJhc2VsaW5lWVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3VyclggKz0gdGVldGhDb25maWcuaW5jaXNvcldpZHRoO1xyXG5cclxuICAgICAgICAvLyBjZW50ZXIgbGVmdCBpbmNpc29yXHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgIGN1cnJYICsgdGVldGhDb25maWcuaW5jaXNvckNvbnRyb2wsIHRvb3RoQmFzZWxpbmVZIC0gcG0ucjY0LFxyXG4gICAgICAgICAgICBjdXJyWCArIHRlZXRoQ29uZmlnLmluY2lzb3JXaWR0aCwgdG9vdGhCYXNlbGluZVlcclxuICAgICAgICApO1xyXG4gICAgICAgIGN1cnJYICs9IHRlZXRoQ29uZmlnLmluY2lzb3JXaWR0aDtcclxuXHJcbiAgICAgICAgLy8gY2VudGVyIHJpZ2h0IGluY2lzb3JcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgY3VyclggKyB0ZWV0aENvbmZpZy5pbmNpc29yQ29udHJvbCwgdG9vdGhCYXNlbGluZVkgLSBwbS5yNjQsXHJcbiAgICAgICAgICAgIGN1cnJYICsgdGVldGhDb25maWcuaW5jaXNvcldpZHRoLCB0b290aEJhc2VsaW5lWVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3VyclggKz0gdGVldGhDb25maWcuaW5jaXNvcldpZHRoO1xyXG5cclxuICAgICAgICAvLyByaWdodCBpbmNpc29yXHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgIGN1cnJYICsgdGVldGhDb25maWcuaW5jaXNvckNvbnRyb2wsIHRvb3RoQmFzZWxpbmVZIC0gcG0ucjY0LFxyXG4gICAgICAgICAgICBjdXJyWCArIHRlZXRoQ29uZmlnLmluY2lzb3JXaWR0aCwgdG9vdGhCYXNlbGluZVlcclxuICAgICAgICApO1xyXG4gICAgICAgIGN1cnJYICs9IHRlZXRoQ29uZmlnLmluY2lzb3JXaWR0aDtcclxuXHJcbiAgICAgICAgLy8gcmlnaHQgY2FuaW5lXHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgICggY3VyclggKyB0ZWV0aENvbmZpZy5jYW5pbmVXaWR0aCApIC0gdGVldGhDb25maWcuY2FuaW5lQ29udHJvbCwgdG9vdGhCYXNlbGluZVkgLSBwbS5yMzIgLSBwbS5yNjQsXHJcbiAgICAgICAgICAgIGN1cnJYICsgdGVldGhDb25maWcuY2FuaW5lV2lkdGgsIHRvb3RoQmFzZWxpbmVZXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdXJyWCArPSB0ZWV0aENvbmZpZy5jYW5pbmVXaWR0aDtcclxuXHJcbiAgICAgICAgLy8gcmlnaHQgcHJlbW9sYXJcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgY3VyclggKyB0ZWV0aENvbmZpZy5wcmVNb2xhckNvbnRyb2wsIHRvb3RoQmFzZWxpbmVZIC0gcG0ucjMyLFxyXG4gICAgICAgICAgICB0ZWV0aC5yUG9pbnQyWCArIHBtLnI2NCwgdG9vdGhCYXNlbGluZVkgKyBwbS5yMzJcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBib3R0b20gcmlnaHQgY29ybmVyXHJcbiAgICAgICAgY3R4LmxpbmVUbyggdGVldGguclBvaW50MlgsIHRlZXRoLnJQb2ludDJZICsgcG0ucjggKTtcclxuXHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRyYXdUb290aFNoYWRvdyggaXRlbSApIHtcclxuICAgICAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ211bHRpcGx5JztcclxuICAgICAgICBsZXQgdGVldGhDb2xvdXIgPSBmYWNlQ29vcmRzLmdyYWRpZW50cy50ZWV0aFNoYWRvdy5jdXJyO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcmluZy5yZ2IoIHRlZXRoQ29sb3VyLnIsIHRlZXRoQ29sb3VyLmcsIHRlZXRoQ29sb3VyLmIgKTtcclxuXHJcbiAgICAgICAgLy8gZHJhdyBpbnZlcnNlIHVwcGVyIGxpcCBzaGFwZVxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKCBpdGVtLmxlZnRfaW5uZXJfYW5jaG9yX1gsIGl0ZW0ubGVmdF9pbm5lcl9hbmNob3JfWSAtIHBtLnI0ICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggaXRlbS5sZWZ0X2lubmVyX2FuY2hvcl9YIC0gcG0ucjgsIGl0ZW0ubGVmdF9pbm5lcl9hbmNob3JfWSArIHBtLnIxNiApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIGl0ZW0ubGVmdF9pbm5lcl9hbmNob3JfWCwgaXRlbS5sZWZ0X2lubmVyX2FuY2hvcl9ZICsgcG0ucjE2ICk7XHJcblxyXG4gICAgICAgIC8vIHRvcCBsZWZ0IGJvd1xyXG4gICAgICAgIGN0eC5iZXppZXJDdXJ2ZVRvKFxyXG4gICAgICAgICAgICBpdGVtLnRvcF9sZWZ0X2lubmVyX2NwMV9YLCBpdGVtLnRvcF9sZWZ0X2lubmVyX2NwMV9ZICsgcG0ucjMyLFxyXG4gICAgICAgICAgICBpdGVtLnRvcF9sZWZ0X2lubmVyX2NwMl9YLCBpdGVtLnRvcF9sZWZ0X2lubmVyX2NwMl9ZICsgcG0ucjY0LFxyXG4gICAgICAgICAgICBpdGVtLnRvcF9pbm5lcl9hbmNob3JfWCwgaXRlbS50b3BfaW5uZXJfYW5jaG9yX1kgKyBwbS5yNjRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyB0b3AgcmlnaHQgYm93XHJcbiAgICAgICAgY3R4LmJlemllckN1cnZlVG8oXHJcbiAgICAgICAgICAgIGl0ZW0udG9wX3JpZ2h0X2lubmVyX2NwMl9YLCBpdGVtLnRvcF9yaWdodF9pbm5lcl9jcDJfWSArIHBtLnI2NCxcclxuICAgICAgICAgICAgaXRlbS50b3BfcmlnaHRfaW5uZXJfY3AxX1gsIGl0ZW0udG9wX3JpZ2h0X2lubmVyX2NwMV9ZICsgcG0ucjMyLFxyXG4gICAgICAgICAgICBpdGVtLnJpZ2h0X2lubmVyX2FuY2hvcl9YLCBpdGVtLnJpZ2h0X2lubmVyX2FuY2hvcl9ZICsgcG0ucjE2XHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHgubGluZVRvKCBpdGVtLnJpZ2h0X2lubmVyX2FuY2hvcl9YICsgcG0ucjgsIGl0ZW0ucmlnaHRfaW5uZXJfYW5jaG9yX1kgKyBwbS5yMTYgKTtcclxuICAgICAgICBjdHgubGluZVRvKCBpdGVtLnJpZ2h0X2lubmVyX2FuY2hvcl9YLCBpdGVtLnJpZ2h0X2lubmVyX2FuY2hvcl9ZIC0gcG0ucjQgKTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkcmF3TGlwU2hhZG93KCkge1xyXG5cclxuICAgICAgICB2YXIgZWxTaGlmdCA9IDEwMDAwMDtcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oIFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLm1vdXRoLmxlZnRfb3V0ZXJfYW5jaG9yX1ggKyBwbS5yMTYsIGZhY2VDb29yZHMubW91dGgubGVmdF9vdXRlcl9hbmNob3JfWSAtIGVsU2hpZnQgKTtcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgZmFjZUNvb3Jkcy5tb3V0aC5ib3R0b21fb3V0ZXJfYW5jaG9yX1gsIGZhY2VDb29yZHMubW91dGguYm90dG9tX291dGVyX2FuY2hvcl9ZIC0gcG0ucjMyIC0gZWxTaGlmdCxcclxuICAgICAgICAgICAgZmFjZUNvb3Jkcy5tb3V0aC5yaWdodF9vdXRlcl9hbmNob3JfWCAtIHBtLnIxNiwgZmFjZUNvb3Jkcy5tb3V0aC5yaWdodF9vdXRlcl9hbmNob3JfWSAtIGVsU2hpZnRcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIGZhY2VDb29yZHMuY2hpbi5wb2ludDJYIC0gcG0ucjE2LCAoIGZhY2VDb29yZHMuY2hpbi5wb2ludDJZIC0gcG0ucjQgKSAtIGVsU2hpZnQgKTtcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgZmFjZUNvb3Jkcy5jaGluLmhhbmRsZTFYLCBmYWNlQ29vcmRzLmNoaW4uaGFuZGxlMVkgLSBwbS5yNCAtIHBtLnIxNiAtIGVsU2hpZnQsXHJcbiAgICAgICAgICAgIGZhY2VDb29yZHMuY2hpbi5wb2ludDFYICsgcG0ucjE2LCAoIGZhY2VDb29yZHMuY2hpbi5wb2ludDFZIC0gcG0ucjQgKSAtIGVsU2hpZnRcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguc2hhZG93Q29sb3IgPSBzdW5mYWNlLmNvbG91cnMucmdiYS5vcmFuZ2VTaGFkb3c7XHJcbiAgICAgICAgY3R4LnNoYWRvd0JsdXIgPSAxNTtcclxuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDA7XHJcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSBlbFNoaWZ0O1xyXG4gICAgICAgIC8vIGN0eC5maWxsU3R5bGUgPSAncmdiYSggMCwgMCwgMCwgMCknO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgY3R4LnNoYWRvd0JsdXIgPSAwO1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyggXHJcbiAgICAgICAgICAgIGZhY2VDb29yZHMubW91dGgubGVmdF9vdXRlcl9hbmNob3JfWCArIHBtLnIxNiwgZmFjZUNvb3Jkcy5tb3V0aC5sZWZ0X291dGVyX2FuY2hvcl9ZICsgcG0ucjE2IC0gZWxTaGlmdCApO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLm1vdXRoLmJvdHRvbV9vdXRlcl9hbmNob3JfWCwgZmFjZUNvb3Jkcy5tb3V0aC5ib3R0b21fb3V0ZXJfYW5jaG9yX1kgKyBwbS5yMTYgLSBlbFNoaWZ0LFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLm1vdXRoLnJpZ2h0X291dGVyX2FuY2hvcl9YIC0gcG0ucjE2LCBmYWNlQ29vcmRzLm1vdXRoLnJpZ2h0X291dGVyX2FuY2hvcl9ZICsgcG0ucjE2IC0gZWxTaGlmdFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgIGZhY2VDb29yZHMubW91dGguYm90dG9tX291dGVyX2FuY2hvcl9YLCBmYWNlQ29vcmRzLm1vdXRoLmJvdHRvbV9vdXRlcl9hbmNob3JfWSArIHBtLnI4IC0gZWxTaGlmdCxcclxuICAgICAgICAgICAgZmFjZUNvb3Jkcy5tb3V0aC5sZWZ0X291dGVyX2FuY2hvcl9YICsgcG0ucjE2LCBmYWNlQ29vcmRzLm1vdXRoLmxlZnRfb3V0ZXJfYW5jaG9yX1kgKyBwbS5yMTYgLSBlbFNoaWZ0XHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gc3VuZmFjZS5jb2xvdXJzLnJnYmEub3JhbmdlU2hhZG93RGFyaztcclxuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDEwO1xyXG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMDtcclxuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IGVsU2hpZnQ7XHJcbiAgICAgICAgLy8gY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKCAwLCAwLCAwLCAwKSc7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZHJhd0NoaW5TaGFwZSgpIHtcclxuXHJcbiAgICAgICAgdmFyIGVsU2hpZnQgPSAxMDAwMDA7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKCBmYWNlQ29vcmRzLmNoaW4ucG9pbnQxWCwgKCBmYWNlQ29vcmRzLmNoaW4ucG9pbnQxWSAtIHBtLnIzMiApIC0gZWxTaGlmdCApO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLmNoaW4uaGFuZGxlMVgsICggZmFjZUNvb3Jkcy5jaGluLmhhbmRsZTFZIC0gcG0ucjMyICkgLSBlbFNoaWZ0LFxyXG4gICAgICAgICAgICBmYWNlQ29vcmRzLmNoaW4ucG9pbnQyWCwgKCBmYWNlQ29vcmRzLmNoaW4ucG9pbnQyWSAtIHBtLnIzMiApIC0gZWxTaGlmdFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgIGZhY2VDb29yZHMuY2hpbi5oYW5kbGUxWCwgKCBmYWNlQ29vcmRzLmNoaW4uaGFuZGxlMVkgKyBwbS5yMzIgKSAtIGVsU2hpZnQsXHJcbiAgICAgICAgICAgIGZhY2VDb29yZHMuY2hpbi5wb2ludDFYLCAoIGZhY2VDb29yZHMuY2hpbi5wb2ludDFZIC0gcG0ucjMyICkgLSBlbFNoaWZ0XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gc3VuZmFjZS5jb2xvdXJzLnJnYmEub3JhbmdlU2hhZG93O1xyXG4gICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMztcclxuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDA7XHJcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSBlbFNoaWZ0O1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgY3R4LnNoYWRvd0JsdXIgPSAwO1xyXG4gICAgfVxyXG5cclxuZnVuY3Rpb24gZHJhd011c2NsZUdyb3VwcygpIHtcclxuXHJcbiAgICB2YXIgbXNjR3JwUG9pbnRSYWRpdXMgPSAxMDtcclxuICAgIHZhciBhbmNob3JSYWRpdXMgPSAyO1xyXG4gICAgaWYgKCBvdmVybGF5Q2ZnLmRpc3BsYXlIdWxscyA9PT0gdHJ1ZSApIHtcclxuICAgICAgICBhbmNob3JSYWRpdXMgPSA0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8gQW5jaG9ycyAvLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgaWYgKCBvdmVybGF5Q2ZnLmRpc3BsYXlBbmNob3JzID09PSB0cnVlICkge1xyXG5cclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JlZCc7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vIEV5ZWJyb3dzXHJcblxyXG4gICAgICAgIC8vIExlZnRcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5leWVicm93cy5sZWZ0LmxQb2ludFgsIGZhY2VDb29yZHMuZXllYnJvd3MubGVmdC5sUG9pbnRZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5leWVicm93cy5sZWZ0LnJQb2ludFgsIGZhY2VDb29yZHMuZXllYnJvd3MubGVmdC5yUG9pbnRZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICAvLyByaWdodFxyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLmV5ZWJyb3dzLnJpZ2h0LmxQb2ludFgsIGZhY2VDb29yZHMuZXllYnJvd3MucmlnaHQubFBvaW50WSwgYW5jaG9yUmFkaXVzICk7XHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIGZhY2VDb29yZHMuZXllYnJvd3MucmlnaHQuclBvaW50WCwgZmFjZUNvb3Jkcy5leWVicm93cy5yaWdodC5yUG9pbnRZLCBhbmNob3JSYWRpdXMgKTtcclxuXHJcblxyXG4gICAgICAgIC8vLy8vLy8vIEV5ZXNcclxuICAgICAgICBcclxuICAgICAgICAvLyBMZWZ0XHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIGZhY2VDb29yZHMuZXllcy5sZWZ0LmxQb2ludFgsIGZhY2VDb29yZHMuZXllcy5sZWZ0LmxQb2ludFksIGFuY2hvclJhZGl1cyApO1xyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLmV5ZXMubGVmdC5yUG9pbnRYLCBmYWNlQ29vcmRzLmV5ZXMubGVmdC5yUG9pbnRZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICAvLyBSaWdodFxyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLmV5ZXMucmlnaHQubFBvaW50WCwgZmFjZUNvb3Jkcy5leWVzLnJpZ2h0LmxQb2ludFksIGFuY2hvclJhZGl1cyApO1xyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLmV5ZXMucmlnaHQuclBvaW50WCwgZmFjZUNvb3Jkcy5leWVzLnJpZ2h0LnJQb2ludFksIGFuY2hvclJhZGl1cyApO1xyXG5cclxuXHJcbiAgICAgICAgLy8vLy8vLy8gTm9zZVxyXG4gICAgICAgIFxyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLm5vc2UucG9pbnQxWCwgZmFjZUNvb3Jkcy5ub3NlLnBvaW50MVksIGFuY2hvclJhZGl1cyApO1xyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLm5vc2UucG9pbnQyWCwgZmFjZUNvb3Jkcy5ub3NlLnBvaW50MlksIGFuY2hvclJhZGl1cyApO1xyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLm5vc2UucG9pbnQzWCwgZmFjZUNvb3Jkcy5ub3NlLnBvaW50M1ksIGFuY2hvclJhZGl1cyApO1xyXG5cclxuXHJcbiAgICAgICAgLy8vLy8vLy8gTW91dGhcclxuXHJcbiAgICAgICAgLy8gbGVmdFxyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLm1vdXRoLmxlZnRfb3V0ZXJfYW5jaG9yX1gsIGZhY2VDb29yZHMubW91dGgubGVmdF9vdXRlcl9hbmNob3JfWSwgYW5jaG9yUmFkaXVzICk7XHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIGZhY2VDb29yZHMubW91dGgubGVmdF9pbm5lcl9hbmNob3JfWCwgZmFjZUNvb3Jkcy5tb3V0aC5sZWZ0X2lubmVyX2FuY2hvcl9ZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICAvLyB0b3BcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5tb3V0aC50b3BfaW5uZXJfYW5jaG9yX1gsIGZhY2VDb29yZHMubW91dGgudG9wX2lubmVyX2FuY2hvcl9ZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5tb3V0aC50b3Bfb3V0ZXJfYW5jaG9yX1gsIGZhY2VDb29yZHMubW91dGgudG9wX291dGVyX2FuY2hvcl9ZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICAvLyBib3R0b21cclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5tb3V0aC5ib3R0b21faW5uZXJfYW5jaG9yX1gsIGZhY2VDb29yZHMubW91dGguYm90dG9tX2lubmVyX2FuY2hvcl9ZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5tb3V0aC5ib3R0b21fb3V0ZXJfYW5jaG9yX1gsIGZhY2VDb29yZHMubW91dGguYm90dG9tX291dGVyX2FuY2hvcl9ZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICAvLyByaWdodFxyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLm1vdXRoLnJpZ2h0X291dGVyX2FuY2hvcl9YLCBmYWNlQ29vcmRzLm1vdXRoLnJpZ2h0X291dGVyX2FuY2hvcl9ZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5tb3V0aC5yaWdodF9pbm5lcl9hbmNob3JfWCwgZmFjZUNvb3Jkcy5tb3V0aC5yaWdodF9pbm5lcl9hbmNob3JfWSwgYW5jaG9yUmFkaXVzICk7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vLy8vLy8vIExpcFxyXG5cclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5saXAucG9pbnQxWCwgZmFjZUNvb3Jkcy5saXAucG9pbnQxWSwgYW5jaG9yUmFkaXVzICk7XHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIGZhY2VDb29yZHMubGlwLnBvaW50MlgsIGZhY2VDb29yZHMubGlwLnBvaW50MlksIGFuY2hvclJhZGl1cyApO1xyXG5cclxuXHJcbiAgICAgICAgLy8vLy8vLy8gQ2hpblxyXG5cclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5jaGluLnBvaW50MVgsIGZhY2VDb29yZHMuY2hpbi5wb2ludDFZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5jaGluLnBvaW50MlgsIGZhY2VDb29yZHMuY2hpbi5wb2ludDJZLCBhbmNob3JSYWRpdXMgKTtcclxuXHJcblxyXG4gICAgICAgIC8vLy8vLy8vIElubmVyIENoZWVrc1xyXG5cclxuICAgICAgICAvLyBMZWZ0XHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIGZhY2VDb29yZHMuaW5uZXJDaGVla3MubGVmdC50UG9pbnRYLCBmYWNlQ29vcmRzLmlubmVyQ2hlZWtzLmxlZnQudFBvaW50WSwgYW5jaG9yUmFkaXVzICk7XHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIGZhY2VDb29yZHMuaW5uZXJDaGVla3MubGVmdC5iUG9pbnRYLCBmYWNlQ29vcmRzLmlubmVyQ2hlZWtzLmxlZnQuYlBvaW50WSwgYW5jaG9yUmFkaXVzICk7XHJcblxyXG4gICAgICAgIC8vIFJpZ2h0XHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIGZhY2VDb29yZHMuaW5uZXJDaGVla3MucmlnaHQudFBvaW50WCwgZmFjZUNvb3Jkcy5pbm5lckNoZWVrcy5yaWdodC50UG9pbnRZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5pbm5lckNoZWVrcy5yaWdodC5iUG9pbnRYLCBmYWNlQ29vcmRzLmlubmVyQ2hlZWtzLnJpZ2h0LmJQb2ludFksIGFuY2hvclJhZGl1cyApO1xyXG5cclxuXHJcbiAgICAgICAgLy8vLy8vLy8gT3V0ZXIgQ2hlZWtzXHJcblxyXG4gICAgICAgIC8vIExlZnRcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5vdXRlckNoZWVrcy5sZWZ0LnRQb2ludFgsIGZhY2VDb29yZHMub3V0ZXJDaGVla3MubGVmdC50UG9pbnRZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5vdXRlckNoZWVrcy5sZWZ0LmJQb2ludFgsIGZhY2VDb29yZHMub3V0ZXJDaGVla3MubGVmdC5iUG9pbnRZLCBhbmNob3JSYWRpdXMgKTtcclxuXHJcbiAgICAgICAgLy8gUmlnaHRcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5vdXRlckNoZWVrcy5yaWdodC50UG9pbnRYLCBmYWNlQ29vcmRzLm91dGVyQ2hlZWtzLnJpZ2h0LnRQb2ludFksIGFuY2hvclJhZGl1cyApO1xyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLm91dGVyQ2hlZWtzLnJpZ2h0LmJQb2ludFgsIGZhY2VDb29yZHMub3V0ZXJDaGVla3MucmlnaHQuYlBvaW50WSwgYW5jaG9yUmFkaXVzICk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vIGNvbnRyb2wgcG9pbnRzIC8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBpZiAoIG92ZXJsYXlDZmcuZGlzcGxheUNvbnRyb2xQb2ludHMgPT09IHRydWUgKSB7XHJcblxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnZ3JlZW4nO1xyXG5cclxuICAgICAgICAvLy8vLy8vLyBFeWVicm93c1xyXG5cclxuICAgICAgICAvLyBMZWZ0XHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIGZhY2VDb29yZHMuZXllYnJvd3MubGVmdC5oYW5kbGUxWCwgZmFjZUNvb3Jkcy5leWVicm93cy5sZWZ0LmhhbmRsZTFZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5leWVicm93cy5sZWZ0LmhhbmRsZTJYLCBmYWNlQ29vcmRzLmV5ZWJyb3dzLmxlZnQuaGFuZGxlMlksIGFuY2hvclJhZGl1cyApO1xyXG4gICAgICAgIC8vIFJpZ2h0XHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIGZhY2VDb29yZHMuZXllYnJvd3MucmlnaHQuaGFuZGxlMVgsIGZhY2VDb29yZHMuZXllYnJvd3MucmlnaHQuaGFuZGxlMVksIGFuY2hvclJhZGl1cyApO1xyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLmV5ZWJyb3dzLnJpZ2h0LmhhbmRsZTJYLCBmYWNlQ29vcmRzLmV5ZWJyb3dzLnJpZ2h0LmhhbmRsZTJZLCBhbmNob3JSYWRpdXMgKTtcclxuXHJcblxyXG4gICAgICAgIC8vLy8vLy8vIEV5ZXNcclxuICAgICAgICBcclxuICAgICAgICAvLyBMZWZ0IHRvcCBsaWRcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5leWVzLmxlZnQudEhhbmRsZVgsIGZhY2VDb29yZHMuZXllcy5sZWZ0LnRIYW5kbGVZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICAvLyBMZWZ0IGJvdHRvbSBsaWRcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5leWVzLmxlZnQuYkhhbmRsZVgsIGZhY2VDb29yZHMuZXllcy5sZWZ0LmJIYW5kbGVZLCBhbmNob3JSYWRpdXMgKTtcclxuXHJcbiAgICAgICAgLy8gUmlnaHQgdG9wIGxpZFxyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLmV5ZXMucmlnaHQudEhhbmRsZVgsIGZhY2VDb29yZHMuZXllcy5yaWdodC50SGFuZGxlWSwgYW5jaG9yUmFkaXVzICk7XHJcbiAgICAgICAgLy8gUmlnaHQgYm90dG9tIGxpZFxyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLmV5ZXMucmlnaHQuYkhhbmRsZVgsIGZhY2VDb29yZHMuZXllcy5yaWdodC5iSGFuZGxlWSwgYW5jaG9yUmFkaXVzICk7XHJcblxyXG5cclxuICAgICAgICAvLy8vLy8vLyBOb3NlXHJcbiAgICAgICAgXHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIGZhY2VDb29yZHMubm9zZS5oYW5kbGUxWCwgZmFjZUNvb3Jkcy5ub3NlLmhhbmRsZTFZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5ub3NlLmhhbmRsZTJYLCBmYWNlQ29vcmRzLm5vc2UuaGFuZGxlMlksIGFuY2hvclJhZGl1cyApO1xyXG5cclxuICAgICAgICAvLy8vLy8vLyBNb3V0aFxyXG5cclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5tb3V0aC50b3BfbGVmdF9pbm5lcl9jcDFfWCwgZmFjZUNvb3Jkcy5tb3V0aC50b3BfbGVmdF9pbm5lcl9jcDFfWSwgYW5jaG9yUmFkaXVzICk7XHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIGZhY2VDb29yZHMubW91dGgudG9wX2xlZnRfaW5uZXJfY3AyX1gsIGZhY2VDb29yZHMubW91dGgudG9wX2xlZnRfaW5uZXJfY3AyX1ksIGFuY2hvclJhZGl1cyApO1xyXG5cclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5tb3V0aC50b3BfbGVmdF9vdXRlcl9jcDFfWCwgZmFjZUNvb3Jkcy5tb3V0aC50b3BfbGVmdF9vdXRlcl9jcDFfWSwgYW5jaG9yUmFkaXVzICk7XHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIGZhY2VDb29yZHMubW91dGgudG9wX2xlZnRfb3V0ZXJfY3AyX1gsIGZhY2VDb29yZHMubW91dGgudG9wX2xlZnRfb3V0ZXJfY3AyX1ksIGFuY2hvclJhZGl1cyApO1xyXG5cclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5tb3V0aC50b3BfcmlnaHRfaW5uZXJfY3AxX1gsIGZhY2VDb29yZHMubW91dGgudG9wX3JpZ2h0X2lubmVyX2NwMV9ZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5tb3V0aC50b3BfcmlnaHRfaW5uZXJfY3AyX1gsIGZhY2VDb29yZHMubW91dGgudG9wX3JpZ2h0X2lubmVyX2NwMl9ZLCBhbmNob3JSYWRpdXMgKTtcclxuXHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIGZhY2VDb29yZHMubW91dGgudG9wX3JpZ2h0X291dGVyX2NwMV9YLCBmYWNlQ29vcmRzLm1vdXRoLnRvcF9yaWdodF9vdXRlcl9jcDFfWSwgYW5jaG9yUmFkaXVzICk7XHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIGZhY2VDb29yZHMubW91dGgudG9wX3JpZ2h0X291dGVyX2NwMl9YLCBmYWNlQ29vcmRzLm1vdXRoLnRvcF9yaWdodF9vdXRlcl9jcDJfWSwgYW5jaG9yUmFkaXVzICk7XHJcblxyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLm1vdXRoLmJvdHRvbV9sZWZ0X2lubmVyX2NwMV9YLCBmYWNlQ29vcmRzLm1vdXRoLmJvdHRvbV9sZWZ0X2lubmVyX2NwMV9ZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5tb3V0aC5ib3R0b21fbGVmdF9pbm5lcl9jcDJfWCwgZmFjZUNvb3Jkcy5tb3V0aC5ib3R0b21fbGVmdF9pbm5lcl9jcDJfWSwgYW5jaG9yUmFkaXVzICk7XHJcblxyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLm1vdXRoLmJvdHRvbV9sZWZ0X291dGVyX2NwMV9YLCBmYWNlQ29vcmRzLm1vdXRoLmJvdHRvbV9sZWZ0X291dGVyX2NwMV9ZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5tb3V0aC5ib3R0b21fbGVmdF9vdXRlcl9jcDJfWCwgZmFjZUNvb3Jkcy5tb3V0aC5ib3R0b21fbGVmdF9vdXRlcl9jcDJfWSwgYW5jaG9yUmFkaXVzICk7XHJcblxyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLm1vdXRoLmJvdHRvbV9yaWdodF9pbm5lcl9jcDFfWCwgZmFjZUNvb3Jkcy5tb3V0aC5ib3R0b21fcmlnaHRfaW5uZXJfY3AxX1ksIGFuY2hvclJhZGl1cyApO1xyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLm1vdXRoLmJvdHRvbV9yaWdodF9pbm5lcl9jcDJfWCwgZmFjZUNvb3Jkcy5tb3V0aC5ib3R0b21fcmlnaHRfaW5uZXJfY3AyX1ksIGFuY2hvclJhZGl1cyApO1xyXG5cclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5tb3V0aC5ib3R0b21fcmlnaHRfb3V0ZXJfY3AxX1gsIGZhY2VDb29yZHMubW91dGguYm90dG9tX3JpZ2h0X291dGVyX2NwMV9ZLCBhbmNob3JSYWRpdXMgKTtcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5tb3V0aC5ib3R0b21fcmlnaHRfb3V0ZXJfY3AyX1gsIGZhY2VDb29yZHMubW91dGguYm90dG9tX3JpZ2h0X291dGVyX2NwMl9ZLCBhbmNob3JSYWRpdXMgKTtcclxuXHJcblxyXG4gICAgICAgIC8vLy8vLy8vIExpcFxyXG4gICAgICAgIFxyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLmxpcC5oYW5kbGUxWCwgZmFjZUNvb3Jkcy5saXAuaGFuZGxlMVksIGFuY2hvclJhZGl1cyApO1xyXG5cclxuXHJcbiAgICAgICAgLy8vLy8vLy8gY2hpblxyXG4gICAgICAgIFxyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLmNoaW4uaGFuZGxlMVgsIGZhY2VDb29yZHMuY2hpbi5oYW5kbGUxWSwgYW5jaG9yUmFkaXVzICk7XHJcblxyXG5cclxuICAgICAgICAvLy8vLy8vLyBJbm5lciBDaGVla3NcclxuXHJcbiAgICAgICAgLy8gTGVmdFxyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBmYWNlQ29vcmRzLmlubmVyQ2hlZWtzLmxlZnQuaGFuZGxlWCwgZmFjZUNvb3Jkcy5pbm5lckNoZWVrcy5sZWZ0LmhhbmRsZVksIGFuY2hvclJhZGl1cyApO1xyXG4gICAgICAgIC8vIFJpZ2h0XHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIGZhY2VDb29yZHMuaW5uZXJDaGVla3MucmlnaHQuaGFuZGxlWCwgZmFjZUNvb3Jkcy5pbm5lckNoZWVrcy5yaWdodC5oYW5kbGVZLCBhbmNob3JSYWRpdXMgKTtcclxuXHJcblxyXG4gICAgICAgIC8vLy8vLy8vIE91dGVyIENoZWVrc1xyXG5cclxuICAgICAgICAvLyBMZWZ0XHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIGZhY2VDb29yZHMub3V0ZXJDaGVla3MubGVmdC5oYW5kbGVYLCBmYWNlQ29vcmRzLm91dGVyQ2hlZWtzLmxlZnQuaGFuZGxlWSwgYW5jaG9yUmFkaXVzICk7XHJcbiAgICAgICAgLy8gUmlnaHRcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggZmFjZUNvb3Jkcy5vdXRlckNoZWVrcy5yaWdodC5oYW5kbGVYLCBmYWNlQ29vcmRzLm91dGVyQ2hlZWtzLnJpZ2h0LmhhbmRsZVksIGFuY2hvclJhZGl1cyApO1xyXG4gICAgXHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLyBIdWxscyAvLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgaWYgKCBvdmVybGF5Q2ZnLmRpc3BsYXlIdWxscyA9PT0gdHJ1ZSApIHtcclxuXHJcbiAgICAgICAgY3R4LnNldExpbmVEYXNoKFszLCAzXSk7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vIEV5ZWJyb3dzXHJcbiAgICAgICAgdmFyIGJyb3dMID0gZmFjZUNvb3Jkcy5leWVicm93cy5sZWZ0O1xyXG4gICAgICAgIHZhciBicm93UiA9IGZhY2VDb29yZHMuZXllYnJvd3MucmlnaHQ7XHJcbiAgICAgICAgLy8gTGVmdFxyXG4gICAgICAgIGN0eC5saW5lKCBicm93TC5sUG9pbnRYLCBicm93TC5sUG9pbnRZLCBicm93TC5oYW5kbGUxWCwgYnJvd0wuaGFuZGxlMVkpO1xyXG4gICAgICAgIGN0eC5saW5lKCBicm93TC5oYW5kbGUxWCwgYnJvd0wuaGFuZGxlMVksIGJyb3dMLmhhbmRsZTJYLCBicm93TC5oYW5kbGUyWSk7XHJcbiAgICAgICAgY3R4LmxpbmUoIGJyb3dMLmhhbmRsZTJYLCBicm93TC5oYW5kbGUyWSwgYnJvd0wuclBvaW50WCwgYnJvd0wuclBvaW50WSApO1xyXG4gICAgICAgIC8vIFJpZ2h0XHJcbiAgICAgICAgY3R4LmxpbmUoIGJyb3dSLmxQb2ludFgsIGJyb3dSLmxQb2ludFksIGJyb3dSLmhhbmRsZTFYLCBicm93Ui5oYW5kbGUxWSk7XHJcbiAgICAgICAgY3R4LmxpbmUoIGJyb3dSLmhhbmRsZTFYLCBicm93Ui5oYW5kbGUxWSwgYnJvd1IuaGFuZGxlMlgsIGJyb3dSLmhhbmRsZTJZKTtcclxuICAgICAgICBjdHgubGluZSggYnJvd1IuaGFuZGxlMlgsIGJyb3dSLmhhbmRsZTJZLCBicm93Ui5yUG9pbnRYLCBicm93Ui5yUG9pbnRZICk7XHJcblxyXG5cclxuICAgICAgICAvLy8vLy8vLyBFeWVzXHJcbiAgICAgICAgdmFyIGV5ZUwgPSBmYWNlQ29vcmRzLmV5ZXMubGVmdDtcclxuICAgICAgICB2YXIgZXllUiA9IGZhY2VDb29yZHMuZXllcy5yaWdodDtcclxuICAgICAgICAvLyBMZWZ0XHJcbiAgICAgICAgY3R4LmxpbmUoIGV5ZUwubFBvaW50WCwgZXllTC5sUG9pbnRZLCBleWVMLnRIYW5kbGVYLCBleWVMLnRIYW5kbGVZKTtcclxuICAgICAgICBjdHgubGluZSggZXllTC50SGFuZGxlWCwgZXllTC50SGFuZGxlWSwgZXllTC5yUG9pbnRYLCBleWVMLnJQb2ludFkgKTtcclxuICAgICAgICBjdHgubGluZSggZXllTC5yUG9pbnRYLCBleWVMLnJQb2ludFksIGV5ZUwuYkhhbmRsZVgsIGV5ZUwuYkhhbmRsZVkpO1xyXG4gICAgICAgIGN0eC5saW5lKCBleWVMLmJIYW5kbGVYLCBleWVMLmJIYW5kbGVZLCBleWVMLmxQb2ludFgsIGV5ZUwubFBvaW50WSApO1xyXG4gICAgICAgIC8vIFJpZ2h0XHJcbiAgICAgICAgY3R4LmxpbmUoIGV5ZVIubFBvaW50WCwgZXllUi5sUG9pbnRZLCBleWVSLnRIYW5kbGVYLCBleWVSLnRIYW5kbGVZKTtcclxuICAgICAgICBjdHgubGluZSggZXllUi50SGFuZGxlWCwgZXllUi50SGFuZGxlWSwgZXllUi5yUG9pbnRYLCBleWVSLnJQb2ludFkgKTtcclxuICAgICAgICBjdHgubGluZSggZXllUi5yUG9pbnRYLCBleWVSLnJQb2ludFksIGV5ZVIuYkhhbmRsZVgsIGV5ZVIuYkhhbmRsZVkpO1xyXG4gICAgICAgIGN0eC5saW5lKCBleWVSLmJIYW5kbGVYLCBleWVSLmJIYW5kbGVZLCBleWVSLmxQb2ludFgsIGV5ZVIubFBvaW50WSApO1xyXG5cclxuXHJcbiAgICAgICAgLy8vLy8vLy8gTm9zZVxyXG4gICAgICAgIHZhciBub3NlID0gZmFjZUNvb3Jkcy5ub3NlO1xyXG5cclxuICAgICAgICBjdHgubGluZSggbm9zZS5wb2ludDFYLCBub3NlLnBvaW50MVksIG5vc2UuaGFuZGxlMVgsIG5vc2UuaGFuZGxlMVkpO1xyXG4gICAgICAgIGN0eC5saW5lKCBub3NlLmhhbmRsZTFYLCBub3NlLmhhbmRsZTFZLCBub3NlLnBvaW50MlgsIG5vc2UucG9pbnQyWSk7XHJcbiAgICAgICAgY3R4LmxpbmUoIG5vc2UucG9pbnQyWCwgbm9zZS5wb2ludDJZLCBub3NlLmhhbmRsZTJYLCBub3NlLmhhbmRsZTJZKTtcclxuICAgICAgICBjdHgubGluZSggbm9zZS5oYW5kbGUyWCwgbm9zZS5oYW5kbGUyWSwgbm9zZS5wb2ludDNYLCBub3NlLnBvaW50M1kpO1xyXG5cclxuXHJcbiAgICAgICAgLy8vLy8vLy8gTW91dGhcclxuICAgICAgICB2YXIgbW91dGggPSBmYWNlQ29vcmRzLm1vdXRoO1xyXG5cclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oIG1vdXRoLmxlZnRfb3V0ZXJfYW5jaG9yX1gsIG1vdXRoLmxlZnRfb3V0ZXJfYW5jaG9yX1kgKTtcclxuICAgICAgICBjdHgubGluZVRvKCBtb3V0aC5sZWZ0X2lubmVyX2FuY2hvcl9YLCBtb3V0aC5sZWZ0X2lubmVyX2FuY2hvcl9ZICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggbW91dGgudG9wX2xlZnRfaW5uZXJfY3AxX1gsIG1vdXRoLnRvcF9sZWZ0X2lubmVyX2NwMV9ZICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggbW91dGgudG9wX2xlZnRfaW5uZXJfY3AyX1gsIG1vdXRoLnRvcF9sZWZ0X2lubmVyX2NwMl9ZICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggbW91dGgudG9wX2lubmVyX2FuY2hvcl9YLCBtb3V0aC50b3BfaW5uZXJfYW5jaG9yX1kgKTtcclxuICAgICAgICBjdHgubGluZVRvKCBtb3V0aC50b3BfcmlnaHRfaW5uZXJfY3AyX1gsIG1vdXRoLnRvcF9yaWdodF9pbm5lcl9jcDJfWSApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIG1vdXRoLnRvcF9yaWdodF9pbm5lcl9jcDFfWCwgbW91dGgudG9wX3JpZ2h0X2lubmVyX2NwMV9ZICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggbW91dGgucmlnaHRfaW5uZXJfYW5jaG9yX1gsIG1vdXRoLnJpZ2h0X2lubmVyX2FuY2hvcl9ZICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggbW91dGgucmlnaHRfb3V0ZXJfYW5jaG9yX1gsIG1vdXRoLnJpZ2h0X291dGVyX2FuY2hvcl9ZICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggbW91dGgudG9wX3JpZ2h0X291dGVyX2NwMV9YLCBtb3V0aC50b3BfcmlnaHRfb3V0ZXJfY3AxX1kgKTtcclxuICAgICAgICBjdHgubGluZVRvKCBtb3V0aC50b3BfcmlnaHRfb3V0ZXJfY3AyX1gsIG1vdXRoLnRvcF9yaWdodF9vdXRlcl9jcDJfWSApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIG1vdXRoLnRvcF9vdXRlcl9hbmNob3JfWCwgbW91dGgudG9wX291dGVyX2FuY2hvcl9ZICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggbW91dGgudG9wX2xlZnRfb3V0ZXJfY3AyX1gsIG1vdXRoLnRvcF9sZWZ0X291dGVyX2NwMl9ZICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggbW91dGgudG9wX2xlZnRfb3V0ZXJfY3AxX1gsIG1vdXRoLnRvcF9sZWZ0X291dGVyX2NwMV9ZICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggbW91dGgubGVmdF9vdXRlcl9hbmNob3JfWCwgbW91dGgubGVmdF9vdXRlcl9hbmNob3JfWSApO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKCBtb3V0aC5sZWZ0X291dGVyX2FuY2hvcl9YLCBtb3V0aC5sZWZ0X291dGVyX2FuY2hvcl9ZICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggbW91dGgubGVmdF9pbm5lcl9hbmNob3JfWCwgbW91dGgubGVmdF9pbm5lcl9hbmNob3JfWSApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIG1vdXRoLmJvdHRvbV9sZWZ0X2lubmVyX2NwMV9YLCBtb3V0aC5ib3R0b21fbGVmdF9pbm5lcl9jcDFfWSApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIG1vdXRoLmJvdHRvbV9sZWZ0X2lubmVyX2NwMl9YLCBtb3V0aC5ib3R0b21fbGVmdF9pbm5lcl9jcDJfWSApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIG1vdXRoLmJvdHRvbV9pbm5lcl9hbmNob3JfWCwgbW91dGguYm90dG9tX2lubmVyX2FuY2hvcl9ZICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggbW91dGguYm90dG9tX3JpZ2h0X2lubmVyX2NwMl9YLCBtb3V0aC5ib3R0b21fcmlnaHRfaW5uZXJfY3AyX1kgKTtcclxuICAgICAgICBjdHgubGluZVRvKCBtb3V0aC5ib3R0b21fcmlnaHRfaW5uZXJfY3AxX1gsIG1vdXRoLmJvdHRvbV9yaWdodF9pbm5lcl9jcDFfWSApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIG1vdXRoLnJpZ2h0X2lubmVyX2FuY2hvcl9YLCBtb3V0aC5yaWdodF9pbm5lcl9hbmNob3JfWSApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIG1vdXRoLnJpZ2h0X291dGVyX2FuY2hvcl9YLCBtb3V0aC5yaWdodF9vdXRlcl9hbmNob3JfWSApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIG1vdXRoLmJvdHRvbV9yaWdodF9vdXRlcl9jcDFfWCwgbW91dGguYm90dG9tX3JpZ2h0X291dGVyX2NwMV9ZICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggbW91dGguYm90dG9tX3JpZ2h0X291dGVyX2NwMl9YLCBtb3V0aC5ib3R0b21fcmlnaHRfb3V0ZXJfY3AyX1kgKTtcclxuICAgICAgICBjdHgubGluZVRvKCBtb3V0aC5ib3R0b21fb3V0ZXJfYW5jaG9yX1gsIG1vdXRoLmJvdHRvbV9vdXRlcl9hbmNob3JfWSApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIG1vdXRoLmJvdHRvbV9sZWZ0X291dGVyX2NwMl9YLCBtb3V0aC5ib3R0b21fbGVmdF9vdXRlcl9jcDJfWSApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIG1vdXRoLmJvdHRvbV9sZWZ0X291dGVyX2NwMV9YLCBtb3V0aC5ib3R0b21fbGVmdF9vdXRlcl9jcDFfWSApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIG1vdXRoLmxlZnRfb3V0ZXJfYW5jaG9yX1gsIG1vdXRoLmxlZnRfb3V0ZXJfYW5jaG9yX1kgKTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAvLyBjdHgubGluZSggbW91dGgubFBvaW50WCwgbW91dGgubFBvaW50WSwgbW91dGgudG9wX2xlZnRfY3AxX1gsIG1vdXRoLnRvcF9sZWZ0X2NwMV9ZKTtcclxuICAgICAgICAvLyBjdHgubGluZSggbW91dGgudG9wX2xlZnRfY3AxX1gsIG1vdXRoLnRvcF9sZWZ0X2NwMV9ZLCBtb3V0aC50b3BfbGVmdF9jcDJfWCwgbW91dGgudG9wX2xlZnRfY3AyX1kpO1xyXG4gICAgICAgIC8vIGN0eC5saW5lKCBtb3V0aC50b3BfbGVmdF9jcDJfWCwgbW91dGgudG9wX2xlZnRfY3AyX1ksIG1vdXRoLnRvcF9hbmNob3JfWCwgbW91dGgudG9wX2FuY2hvcl9ZKTtcclxuICAgICAgICAvLyBjdHgubGluZSggbW91dGgudG9wX2FuY2hvcl9YLCBtb3V0aC50b3BfYW5jaG9yX1ksIG1vdXRoLnRvcF9yaWdodF9jcDJfWCwgbW91dGgudG9wX3JpZ2h0X2NwMl9ZICk7XHJcbiAgICAgICAgLy8gY3R4LmxpbmUoIG1vdXRoLnRvcF9yaWdodF9jcDJfWCwgbW91dGgudG9wX3JpZ2h0X2NwMl9ZLCBtb3V0aC50b3BfcmlnaHRfY3AxX1gsIG1vdXRoLnRvcF9yaWdodF9jcDFfWSk7XHJcbiAgICAgICAgLy8gY3R4LmxpbmUoIG1vdXRoLnRvcF9yaWdodF9jcDFfWCwgbW91dGgudG9wX3JpZ2h0X2NwMV9ZLCBtb3V0aC5yUG9pbnRYLCBtb3V0aC5yUG9pbnRZICk7XHJcbiAgICAgICAgLy8gY3R4LmxpbmUoIG1vdXRoLnJQb2ludFgsIG1vdXRoLnJQb2ludFksIG1vdXRoLmJvdHRvbV9yaWdodF9jcDFfWCwgbW91dGguYm90dG9tX3JpZ2h0X2NwMV9ZICk7XHJcbiAgICAgICAgLy8gY3R4LmxpbmUoIG1vdXRoLmJvdHRvbV9yaWdodF9jcDFfWCwgbW91dGguYm90dG9tX3JpZ2h0X2NwMV9ZLCBtb3V0aC5ib3R0b21fcmlnaHRfY3AyX1gsIG1vdXRoLmJvdHRvbV9yaWdodF9jcDJfWSk7XHJcbiAgICAgICAgLy8gY3R4LmxpbmUoIG1vdXRoLmJvdHRvbV9yaWdodF9jcDJfWCwgbW91dGguYm90dG9tX3JpZ2h0X2NwMl9ZLCBtb3V0aC5ib3R0b21fYW5jaG9yX1gsIG1vdXRoLmJvdHRvbV9hbmNob3JfWSk7XHJcbiAgICAgICAgLy8gY3R4LmxpbmUoIG1vdXRoLmJvdHRvbV9hbmNob3JfWCwgbW91dGguYm90dG9tX2FuY2hvcl9ZLCBtb3V0aC5ib3R0b21fbGVmdF9jcDJfWCwgbW91dGguYm90dG9tX2xlZnRfY3AyX1kgKTtcclxuICAgICAgICAvLyBjdHgubGluZSggbW91dGguYm90dG9tX2xlZnRfY3AyX1gsIG1vdXRoLmJvdHRvbV9sZWZ0X2NwMl9ZLCBtb3V0aC5ib3R0b21fbGVmdF9jcDFfWCwgbW91dGguYm90dG9tX2xlZnRfY3AxX1kpO1xyXG4gICAgICAgIC8vIGN0eC5saW5lKCBtb3V0aC5ib3R0b21fbGVmdF9jcDFfWCwgbW91dGguYm90dG9tX2xlZnRfY3AxX1ksIG1vdXRoLmxQb2ludFgsIG1vdXRoLmxQb2ludFkgKTtcclxuXHJcblxyXG4gICAgICAgIC8vLy8vLy8vIExpcFxyXG5cclxuICAgICAgICBjdHgubGluZSggZmFjZUNvb3Jkcy5saXAucG9pbnQxWCwgZmFjZUNvb3Jkcy5saXAucG9pbnQxWSwgZmFjZUNvb3Jkcy5saXAuaGFuZGxlMVgsIGZhY2VDb29yZHMubGlwLmhhbmRsZTFZKTtcclxuICAgICAgICBjdHgubGluZSggZmFjZUNvb3Jkcy5saXAuaGFuZGxlMVgsIGZhY2VDb29yZHMubGlwLmhhbmRsZTFZLCBmYWNlQ29vcmRzLmxpcC5wb2ludDJYLCBmYWNlQ29vcmRzLmxpcC5wb2ludDJZKTtcclxuXHJcblxyXG4gICAgICAgIC8vLy8vLy8vIENoaW5cclxuXHJcbiAgICAgICAgY3R4LmxpbmUoIGZhY2VDb29yZHMuY2hpbi5wb2ludDFYLCBmYWNlQ29vcmRzLmNoaW4ucG9pbnQxWSwgZmFjZUNvb3Jkcy5jaGluLmhhbmRsZTFYLCBmYWNlQ29vcmRzLmNoaW4uaGFuZGxlMVkpO1xyXG4gICAgICAgIGN0eC5saW5lKCBmYWNlQ29vcmRzLmNoaW4uaGFuZGxlMVgsIGZhY2VDb29yZHMuY2hpbi5oYW5kbGUxWSwgZmFjZUNvb3Jkcy5jaGluLnBvaW50MlgsIGZhY2VDb29yZHMuY2hpbi5wb2ludDJZKTtcclxuXHJcblxyXG4gICAgICAgIC8vLy8vLy8vIElubmVyIENoZWVrc1xyXG4gICAgICAgIHZhciBpbm5lckNoZWVrTCA9IGZhY2VDb29yZHMuaW5uZXJDaGVla3MubGVmdDtcclxuICAgICAgICB2YXIgaW5uZXJDaGVla1IgPSBmYWNlQ29vcmRzLmlubmVyQ2hlZWtzLnJpZ2h0O1xyXG5cclxuICAgICAgICAvLyBMZWZ0XHJcbiAgICAgICAgY3R4LmxpbmUoIGlubmVyQ2hlZWtMLnRQb2ludFgsIGlubmVyQ2hlZWtMLnRQb2ludFksIGlubmVyQ2hlZWtMLmhhbmRsZVgsIGlubmVyQ2hlZWtMLmhhbmRsZVkpO1xyXG4gICAgICAgIGN0eC5saW5lKCBpbm5lckNoZWVrTC5oYW5kbGVYLCBpbm5lckNoZWVrTC5oYW5kbGVZLCBpbm5lckNoZWVrTC5iUG9pbnRYLCBpbm5lckNoZWVrTC5iUG9pbnRZKTtcclxuICAgICAgICAvLyByaWdodFxyXG4gICAgICAgIGN0eC5saW5lKCBpbm5lckNoZWVrUi50UG9pbnRYLCBpbm5lckNoZWVrUi50UG9pbnRZLCBpbm5lckNoZWVrUi5oYW5kbGVYLCBpbm5lckNoZWVrUi5oYW5kbGVZKTtcclxuICAgICAgICBjdHgubGluZSggaW5uZXJDaGVla1IuaGFuZGxlWCwgaW5uZXJDaGVla1IuaGFuZGxlWSwgaW5uZXJDaGVla1IuYlBvaW50WCwgaW5uZXJDaGVla1IuYlBvaW50WSk7XHJcblxyXG5cclxuICAgICAgICAvLy8vLy8vLyBPdXRlciBDaGVla3NcclxuICAgICAgICB2YXIgb3V0ZXJDaGVla0wgPSBmYWNlQ29vcmRzLm91dGVyQ2hlZWtzLmxlZnQ7XHJcbiAgICAgICAgdmFyIG91dGVyQ2hlZWtSID0gZmFjZUNvb3Jkcy5vdXRlckNoZWVrcy5yaWdodDtcclxuXHJcbiAgICAgICAgLy8gTGVmdFxyXG4gICAgICAgIGN0eC5saW5lKCBvdXRlckNoZWVrTC50UG9pbnRYLCBvdXRlckNoZWVrTC50UG9pbnRZLCBvdXRlckNoZWVrTC5oYW5kbGVYLCBvdXRlckNoZWVrTC5oYW5kbGVZKTtcclxuICAgICAgICBjdHgubGluZSggb3V0ZXJDaGVla0wuaGFuZGxlWCwgb3V0ZXJDaGVla0wuaGFuZGxlWSwgb3V0ZXJDaGVla0wuYlBvaW50WCwgb3V0ZXJDaGVla0wuYlBvaW50WSk7XHJcbiAgICAgICAgLy8gcmlnaHRcclxuICAgICAgICBjdHgubGluZSggb3V0ZXJDaGVla1IudFBvaW50WCwgb3V0ZXJDaGVla1IudFBvaW50WSwgb3V0ZXJDaGVla1IuaGFuZGxlWCwgb3V0ZXJDaGVla1IuaGFuZGxlWSk7XHJcbiAgICAgICAgY3R4LmxpbmUoIG91dGVyQ2hlZWtSLmhhbmRsZVgsIG91dGVyQ2hlZWtSLmhhbmRsZVksIG91dGVyQ2hlZWtSLmJQb2ludFgsIG91dGVyQ2hlZWtSLmJQb2ludFkpO1xyXG5cclxuICAgICAgICBjdHguc2V0TGluZURhc2goIFtdICk7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3U3VuZmFjZSgpIHtcclxuICAgIGN0eC5saW5lV2lkdGggPSBzdW5mYWNlLmxpbmVzLm91dGVyO1xyXG5cclxuICAgIGlmICggIW92ZXJsYXlDZmcuZGlzcGxheU92ZXJsYXkgKSB7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gZmFjZU91dGxpbmVDb2xvcjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc3VuZmFjZS5jb2xvdXJzLmRlYnVnLmRpbW1lZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZHJhd0ZhY2UoKTsgXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUN5Y2xlKCkge1xyXG4gICAgLy8gZHJhd0ZhY2VHaW1ibGVDb250cm9sKCk7XHJcblxyXG4gICAgaWYgKCBtb3VzZURvd24gKSB7XHJcbiAgICAgICAgaWYgKCAhYWltQ29uc3RyYWludC50YXJnZXQucmVuZGVyQ29uZmlnLmlzSGl0ICkge1xyXG4gICAgICAgICAgICBhaW1Db25zdHJhaW50LmNoZWNrTW91c2VIaXQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCBhaW1Db25zdHJhaW50LnRhcmdldC5yZW5kZXJDb25maWcuaXNIaXQgKSB7XHJcbiAgICAgICAgICAgIGFpbUNvbnN0cmFpbnQubW91c2VNb3ZlVGFyZ2V0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBkcmF3U3VuZmFjZSgpO1xyXG4gICAgZHJhd092ZXJsYXkoKTtcclxuICAgIHNpbmVXYXZlLm1vZHVsYXRvcigpO1xyXG4gICAgdHJhY2tQbGF5ZXIudXBkYXRlVHJhY2tQbGF5ZXIoIHNlcSwgbXVzY2xlTW9kaWZpZXJzICk7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhckNhbnZhcyhjdHgpIHtcclxuICAgIC8vIGNsZWFuaW5nXHJcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhblcsIGNhbkgpO1xyXG4gICAgLy8gY3R4LmNsZWFyUmVjdCggYnVmZmVyQ2xlYXJSZWdpb24ueCwgYnVmZmVyQ2xlYXJSZWdpb24ueSwgYnVmZmVyQ2xlYXJSZWdpb24udywgYnVmZmVyQ2xlYXJSZWdpb24uaCApO1xyXG5cclxuICAgIC8vIGJsaXRDdHguY2xlYXJSZWN0KCAwLCAwLCBjYW5XLCBjYW5IICk7XHJcblxyXG5cclxuICAgIC8vIGN0eC5maWxsU3R5bGUgPSAncmdiYSggMCwgMCwgMCwgMC4xICknO1xyXG4gICAgLy8gY3R4LmZpbGxSZWN0KCAwLCAwLCBjYW5XLCBjYW5IICk7XHJcblxyXG4gICAgLy8gc2V0IGRpcnR5IGJ1ZmZlclxyXG4gICAgLy8gcmVzZXRCdWZmZXJDbGVhclJlZ2lvbigpO1xyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIHJ1bnRpbWVcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5mdW5jdGlvbiB1cGRhdGUoKSB7XHJcblxyXG4gICAgLy8gbG9vcCBob3VzZWtlZXBpbmdcclxuICAgIHJ1bnRpbWUgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgLy8gbW91c2UgdHJhY2tpbmdcclxuICAgIGxhc3RNb3VzZVggPSBtb3VzZVg7IFxyXG4gICAgbGFzdE1vdXNlWSA9IG1vdXNlWTsgXHJcblxyXG4gICAgLy8gY2xlYW4gY2FudmFzXHJcbiAgICBjbGVhckNhbnZhcyggY3R4ICk7XHJcblxyXG4gICAgLy8gYmxlbmRpbmdcclxuICAgIC8vIGlmICggY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiAhPSBjdXJyVGhlbWUuY29udGV4dEJsZW5kaW5nTW9kZSApIHtcclxuICAgIC8vICAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gY3VyclRoZW1lLmNvbnRleHRCbGVuZGluZ01vZGU7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gdXBkYXRlc1xyXG4gICAgdXBkYXRlQ3ljbGUoKTtcclxuXHJcbiAgICAvLyBsb29waW5nXHJcbiAgICBhbmltYXRpb24uc3RhdGUgPT09IHRydWUgPyAocnVudGltZUVuZ2luZS5zdGFydEFuaW1hdGlvbihydW50aW1lLCB1cGRhdGUpLCBjb3VudGVyKyspIDogcnVudGltZUVuZ2luZS5zdG9wQW5pbWF0aW9uKHJ1bnRpbWUpO1xyXG5cclxuICAgIC8vIGdsb2JhbCBjbG9ja1xyXG4gICAgLy8gY291bnRlcisrO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRW5kIHJ1bnRpbWVcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuaWYgKGFuaW1hdGlvbi5zdGF0ZSAhPT0gdHJ1ZSkge1xyXG4gICAgYW5pbWF0aW9uLnN0YXRlID0gdHJ1ZTtcclxuICAgIHVwZGF0ZSgpO1xyXG59XHJcblxyXG4kKCAnLmpzLWF0dGFjaEZsYXJlQ2FudmFzJyApLmNsaWNrKCBmdW5jdGlvbiggZXZlbnQgKXtcclxuXHJcbiAgICBpZiAoICQoIHRoaXMgKS5oYXNDbGFzcyggJ2lzLWFjdGl2ZScgKSApe1xyXG5cclxuICAgICAgICAkKCB0aGlzICkucmVtb3ZlQ2xhc3MoICdpcy1hY3RpdmUnICk7XHJcbiAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICBcclxuICAgICAgICAkKCB0aGlzICkuYWRkQ2xhc3MoICdpcy1hY3RpdmUnICk7XHJcbiAgICAgICAgJCggJy5hc3NldC1jYW52YXMtZGlzcGxheS1sYXllcicgKS5hZGRDbGFzcyggJ2F0dGFjaGVkQ2FudmFzJyApLmFwcGVuZCggbGVuc0ZsYXJlQ2FudmFzICk7XHJcbiAgICBcclxuICAgIH1cclxuXHJcbn0gKTsiLCIvKipcclxuKiBAZGVzY3JpcHRpb24gZXh0ZW5kcyBDYW52YXMgcHJvdG90eXBlIHdpdGggdXNlZnVsIGRyYXdpbmcgbWl4aW5zXHJcbiogQGtpbmQgY29uc3RhbnRcclxuKi9cclxudmFyIGNhbnZhc0RyYXdpbmdBcGkgPSBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlO1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gZHJhdyBjaXJjbGUgQVBJXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvcmlnaW4gWSBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHIgLSByYWRpdXMgb2YgY2lyY2xlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmNpcmNsZSA9IGZ1bmN0aW9uICh4LCB5LCByKSB7XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxuXHR0aGlzLmFyYyh4LCB5LCByLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBmaWxsZWQgY2lyY2xlXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvcmlnaW4gWSBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHIgLSByYWRpdXMgb2YgY2lyY2xlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmZpbGxDaXJjbGUgPSBmdW5jdGlvbiAoeCwgeSwgciwgY29udGV4dCkge1xyXG5cdHRoaXMuY2lyY2xlKHgsIHksIHIsIGNvbnRleHQpO1xyXG5cdHRoaXMuZmlsbCgpO1xyXG5cdHRoaXMuYmVnaW5QYXRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBzdHJva2VkIGNpcmNsZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4IC0gb3JpZ2luIFggb2YgY2lyY2xlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb3JpZ2luIFkgb2YgY2lyY2xlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSByIC0gcmFkaXVzIG9mIGNpcmNsZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5zdHJva2VDaXJjbGUgPSBmdW5jdGlvbiAoeCwgeSwgcikge1xyXG5cdHRoaXMuY2lyY2xlKHgsIHksIHIpO1xyXG5cdHRoaXMuc3Ryb2tlKCk7XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb2ZpZ2luIFkgb3IgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIHdpZHRoIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHcgLSBoZWlnaHQgb2YgZWxsaXBzZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5lbGxpcHNlID0gZnVuY3Rpb24gKHgsIHksIHcsIGgpIHtcclxuXHR0aGlzLmJlZ2luUGF0aCgpO1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgTWF0aC5QSSAqIDI7IGkgKz0gTWF0aC5QSSAvIDE2KSB7XHJcblx0XHR0aGlzLmxpbmVUbyh4ICsgTWF0aC5jb3MoaSkgKiB3IC8gMiwgeSArIE1hdGguc2luKGkpICogaCAvIDIpO1xyXG5cdH1cclxuXHR0aGlzLmNsb3NlUGF0aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgZmlsbGVkIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb2ZpZ2luIFkgb3IgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIHdpZHRoIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHcgLSBoZWlnaHQgb2YgZWxsaXBzZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5maWxsRWxsaXBzZSA9IGZ1bmN0aW9uICh4LCB5LCB3LCBoKSB7XHJcblx0dGhpcy5lbGxpcHNlKHgsIHksIHcsIGgsIGNvbnRleHQpO1xyXG5cdHRoaXMuZmlsbCgpO1xyXG5cdHRoaXMuYmVnaW5QYXRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBzdHJva2VkIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb2ZpZ2luIFkgb3IgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIHdpZHRoIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHcgLSBoZWlnaHQgb2YgZWxsaXBzZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5zdHJva2VFbGxpcHNlID0gZnVuY3Rpb24gKHgsIHksIHcsIGgpIHtcclxuXHR0aGlzLmVsbGlwc2UoeCwgeSwgdywgaCk7XHJcblx0dGhpcy5zdHJva2UoKTtcclxuXHR0aGlzLmJlZ2luUGF0aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgbGluZSBiZXR3ZWVuIDIgdmVjdG9yIGNvb3JkaW5hdGVzLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4MSAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuKiBAcGFyYW0ge251bWJlcn0geTEgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHgyIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5MiAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5saW5lID0gZnVuY3Rpb24gKHgxLCB5MSwgeDIsIHkyKSB7XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxuXHR0aGlzLm1vdmVUbyh4MSwgeTEpO1xyXG5cdHRoaXMubGluZVRvKHgyLCB5Mik7XHJcblx0dGhpcy5zdHJva2UoKTtcclxuXHR0aGlzLmJlZ2luUGF0aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgc3Ryb2tlZCByZWd1bGFyIHBvbHlnb24gc2hhcGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvbHlnb24gb3JpZ2luLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gWSBjb29yZGluYXRlIG9mIHRoZSBwb2x5Z29uIG9yaWdpbi5cclxuKiBAcGFyYW0ge251bWJlcn0gciAtIFJhZGl1cyBvZiB0aGUgcG9seWdvbi5cclxuKiBAcGFyYW0ge251bWJlcn0gcyAtIE51bWJlciBvZiBzaWRlcy5cclxuKiBAcGFyYW0ge251bWJlcn0gY3R4IC0gVGhlIGNhbnZhcyBjb250ZXh0IHRvIG91dHB1dC5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5zdHJva2VQb2x5ID0gZnVuY3Rpb24gKCB4LCB5LCByLCBzLCBjdHggKSB7XHJcblx0XHJcblx0dmFyIHNpZGVzID0gcztcclxuXHR2YXIgcmFkaXVzID0gcjtcclxuXHR2YXIgY3ggPSB4O1xyXG5cdHZhciBjeSA9IHk7XHJcblx0dmFyIGFuZ2xlID0gMiAqIE1hdGguUEkgLyBzaWRlcztcclxuXHRcclxuXHRjdHguYmVnaW5QYXRoKCk7XHJcblx0Y3R4LnRyYW5zbGF0ZSggY3gsIGN5ICk7XHJcblx0Y3R4Lm1vdmVUbyggcmFkaXVzLCAwICk7ICAgICAgICAgIFxyXG5cdGZvciAoIHZhciBpID0gMTsgaSA8PSBzaWRlczsgaSsrICkge1xyXG5cdFx0Y3R4LmxpbmVUbyhcclxuXHRcdFx0cmFkaXVzICogTWF0aC5jb3MoIGkgKiBhbmdsZSApLFxyXG5cdFx0XHRyYWRpdXMgKiBNYXRoLnNpbiggaSAqIGFuZ2xlIClcclxuXHRcdCk7XHJcblx0fVxyXG5cdGN0eC5zdHJva2UoKTtcclxuXHRjdHgudHJhbnNsYXRlKCAtY3gsIC1jeSApO1xyXG59XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBmaWxsZWQgcmVndWxhciBwb2x5Z29uIHNoYXBlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4IC0gWCBjb29yZGluYXRlIG9mIHRoZSBwb2x5Z29uIG9yaWdpbi5cclxuKiBAcGFyYW0ge251bWJlcn0geSAtIFkgY29vcmRpbmF0ZSBvZiB0aGUgcG9seWdvbiBvcmlnaW4uXHJcbiogQHBhcmFtIHtudW1iZXJ9IHIgLSBSYWRpdXMgb2YgdGhlIHBvbHlnb24uXHJcbiogQHBhcmFtIHtudW1iZXJ9IHMgLSBOdW1iZXIgb2Ygc2lkZXMuXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN0eCAtIFRoZSBjYW52YXMgY29udGV4dCB0byBvdXRwdXQuXHJcbiovXHJcbmNhbnZhc0RyYXdpbmdBcGkuZmlsbFBvbHkgPSBmdW5jdGlvbiAoIHgsIHksIHIsIHMsIGN0eCApIHtcclxuXHRcclxuXHR2YXIgc2lkZXMgPSBzO1xyXG5cdHZhciByYWRpdXMgPSByO1xyXG5cdHZhciBjeCA9IHg7XHJcblx0dmFyIGN5ID0geTtcclxuXHR2YXIgYW5nbGUgPSAyICogTWF0aC5QSSAvIHNpZGVzO1xyXG5cdFxyXG5cdGN0eC5iZWdpblBhdGgoKTtcclxuXHRjdHgudHJhbnNsYXRlKCBjeCwgY3kgKTtcclxuXHRjdHgubW92ZVRvKCByYWRpdXMsIDAgKTsgICAgICAgICAgXHJcblx0Zm9yICggdmFyIGkgPSAxOyBpIDw9IHNpZGVzOyBpKysgKSB7XHJcblx0XHRjdHgubGluZVRvKFxyXG5cdFx0XHRyYWRpdXMgKiBNYXRoLmNvcyggaSAqIGFuZ2xlICksXHJcblx0XHRcdHJhZGl1cyAqIE1hdGguc2luKCBpICogYW5nbGUgKVxyXG5cdFx0KTtcclxuXHR9XHJcblx0Y3R4LmZpbGwoKTtcclxuXHRjdHgudHJhbnNsYXRlKCAtY3gsIC1jeSApO1xyXG5cdFxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gY2FudmFzRHJhd2luZ0FwaTsiLCJ2YXIgbWF0aFV0aWxzID0gcmVxdWlyZSgnLi9tYXRoVXRpbHMuanMnKS5tYXRoVXRpbHM7XHJcblxyXG52YXIgY29sb3JVdGlscyA9IHtcclxuXHQvKipcclxuICogcHJvdmlkZXMgY29sb3IgdXRpbCBtZXRob2RzLlxyXG4gKi9cclxuXHRyZ2I6IGZ1bmN0aW9uIHJnYihyZWQsIGdyZWVuLCBibHVlKSB7XHJcblx0XHRyZXR1cm4gJ3JnYignICsgbWF0aFV0aWxzLmNsYW1wKE1hdGgucm91bmQocmVkKSwgMCwgMjU1KSArICcsICcgKyBtYXRoVXRpbHMuY2xhbXAoTWF0aC5yb3VuZChncmVlbiksIDAsIDI1NSkgKyAnLCAnICsgbWF0aFV0aWxzLmNsYW1wKE1hdGgucm91bmQoYmx1ZSksIDAsIDI1NSkgKyAnKSc7XHJcblx0fSxcclxuXHRyZ2JhOiBmdW5jdGlvbiByZ2JhKHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhKSB7XHJcblx0XHRyZXR1cm4gJ3JnYmEoJyArIG1hdGhVdGlscy5jbGFtcChNYXRoLnJvdW5kKHJlZCksIDAsIDI1NSkgKyAnLCAnICsgbWF0aFV0aWxzLmNsYW1wKE1hdGgucm91bmQoZ3JlZW4pLCAwLCAyNTUpICsgJywgJyArIG1hdGhVdGlscy5jbGFtcChNYXRoLnJvdW5kKGJsdWUpLCAwLCAyNTUpICsgJywgJyArIG1hdGhVdGlscy5jbGFtcChhbHBoYSwgMCwgMSkgKyAnKSc7XHJcblx0fSxcclxuXHRoc2w6IGZ1bmN0aW9uIGhzbChodWUsIHNhdHVyYXRpb24sIGxpZ2h0bmVzcykge1xyXG5cdFx0cmV0dXJuICdoc2woJyArIGh1ZSArICcsICcgKyBtYXRoVXRpbHMuY2xhbXAoc2F0dXJhdGlvbiwgMCwgMTAwKSArICclLCAnICsgbWF0aFV0aWxzLmNsYW1wKGxpZ2h0bmVzcywgMCwgMTAwKSArICclKSc7XHJcblx0fSxcclxuXHRoc2xhOiBmdW5jdGlvbiBoc2xhKGh1ZSwgc2F0dXJhdGlvbiwgbGlnaHRuZXNzLCBhbHBoYSkge1xyXG5cdFx0cmV0dXJuICdoc2xhKCcgKyBodWUgKyAnLCAnICsgbWF0aFV0aWxzLmNsYW1wKHNhdHVyYXRpb24sIDAsIDEwMCkgKyAnJSwgJyArIG1hdGhVdGlscy5jbGFtcChsaWdodG5lc3MsIDAsIDEwMCkgKyAnJSwgJyArIG1hdGhVdGlscy5jbGFtcChhbHBoYSwgMCwgMSkgKyAnKSc7XHJcblx0fVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuY29sb3JVdGlscyA9IGNvbG9yVXRpbHM7IiwibGV0IG92ZXJsYXlDZmcgPSByZXF1aXJlKCcuL292ZXJsYXkuanMnKS5vdmVybGF5Q2ZnO1xyXG5sZXQgc3VuU3Bpa2VzID0gcmVxdWlyZSgnLi9zdW5TcGlrZXMuanMnKTtcclxuXHJcblxyXG5cclxuJCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKXtcclxuXHJcblx0bGV0IHBhZ2VBbmltQ2xhc3NMaXN0ID0gJ2lzLWFjdGl2ZSB0by1sZWZ0IGZyb20tbGVmdCB0by1yaWdodCBmcm9tLXJpZ2h0JztcclxuXHRcdCQoICcuanMtcGFnZS1zZWxlY3QnICkuY2xpY2soIGZ1bmN0aW9uKCBlICl7XHJcblx0XHRsZXQgJHRoaXNCdXR0b24gPSAkKCB0aGlzICk7XHJcblx0XHRsZXQgc2VsZWN0c1BhZ2UgPSAkdGhpc0J1dHRvbi5hdHRyKCAnZGF0YS1wYWdlLXNlbGVjdCcgKTtcclxuXHRcdGxldCAkY3VycmVudFBhZ2UgPSAkKCAnLmNvbnRyb2wtLXBhbmVsX19wYWdlLmlzLWFjdGl2ZScpO1xyXG5cdFx0bGV0IGN1cnJlbnRQYWdlT3JkZXIgPSAkKCAnLmNvbnRyb2wtLXBhbmVsX19wYWdlJyApLmF0dHIoICdkYXRhLXBhZ2Utb3JkZXInICk7XHJcblx0XHRsZXQgJG5ld1BhZ2UgPSAkKCAnW2RhdGEtcGFnZT1cIicrc2VsZWN0c1BhZ2UrJ1wiXScpO1xyXG5cdFx0bGV0IG5ld1BhZ2VPcmRlciA9ICRuZXdQYWdlLmF0dHIoICdkYXRhLXBhZ2Utb3JkZXInICk7XHJcblx0XHRsZXQgaXNOZXdQYWdlT3JkZXJHcmVhdGVyID0gbmV3UGFnZU9yZGVyID4gY3VycmVudFBhZ2VPcmRlciA/IHRydWUgOiBmYWxzZTtcclxuXHRcdGxldCBpbnRyb0NsYXNzID0gaXNOZXdQYWdlT3JkZXJHcmVhdGVyID8gJ2Zyb20tcmlnaHQnIDogJ2Zyb20tbGVmdCc7XHJcblx0XHRsZXQgb3V0cm9DbGFzcyA9IGlzTmV3UGFnZU9yZGVyR3JlYXRlciA/ICd0by1sZWZ0JyA6ICd0by1yaWdodCc7XHJcblx0XHRpZiAoICR0aGlzQnV0dG9uLmhhc0NsYXNzKCAnaXMtYWN0aXZlJykgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHQkY3VycmVudFBhZ2UucmVtb3ZlQ2xhc3MoIHBhZ2VBbmltQ2xhc3NMaXN0ICkuYWRkQ2xhc3MoIG91dHJvQ2xhc3MgKTtcclxuXHRcdFx0JHRoaXNCdXR0b24uYWRkQ2xhc3MoICdpcy1hY3RpdmUnICkuc2libGluZ3MoKS5yZW1vdmVDbGFzcyggJ2lzLWFjdGl2ZScgKTtcclxuXHRcdFx0JG5ld1BhZ2UuYWRkQ2xhc3MoICdpcy1hY3RpdmUgJytpbnRyb0NsYXNzICk7XHJcblx0XHR9XHJcblxyXG5cdH0gKTtcclxuXHJcblxyXG5cclxuXHJcblx0bGV0ICRjb250cm9sUGFnZXMgPSAkKCAnLmNvbnRyb2wtLXBhbmVsX19wYWdlJyApO1xyXG5cdGxldCAkY29udHJvbFNlY3Rpb25zID0gJCggJy5jb250cm9sLS1wYW5lbF9fc2VjdGlvbicgKTtcclxuXHRsZXQgbnVtU2VjdGlvbnMgPSAkY29udHJvbFNlY3Rpb25zLmxlbmd0aCAtIDE7XHJcblx0JGNvbnRyb2xTZWN0aW9ucy5hZGRDbGFzcyggJy5pcy1hY3RpdmUnICk7XHJcblx0JGNvbnRyb2xQYWdlcy5hZGRDbGFzcyggJy5pcy1hY3RpdmUnICk7XHJcblxyXG5cdCRjb250cm9sUGFnZXMuY3NzKCB7XHJcblx0XHQndHJhbnNpdGlvbi1kdXJhdGlvbic6ICcwcycsXHJcblx0XHQnaGVpZ2h0JzogJ2F1dG8nLFxyXG5cdFx0J3Bvc2l0aW9uJzogJ3JlbGF0aXZlJyxcclxuXHRcdCdvdmVyZmxvdyc6ICdpbml0aWFsJ1xyXG5cdH0gKTtcclxuXHJcblx0Zm9yIChsZXQgaSA9IG51bVNlY3Rpb25zOyBpID49IDA7IGktLSkge1xyXG5cdFx0bGV0ICR0aGlzU2VjdGlvbiA9ICRjb250cm9sU2VjdGlvbnMuZXEoIGkgKTtcclxuXHRcdGxldCAkdGhpc0FuaW1hdGVkRWwgPSAkdGhpc1NlY3Rpb24uZmluZCggJ2ZpZWxkc2V0JyApO1xyXG5cdFx0JHRoaXNBbmltYXRlZEVsLmNzcygge1xyXG5cdFx0XHQndHJhbnNpdGlvbi1kdXJhdGlvbic6ICcwcycsXHJcblx0XHRcdCdoZWlnaHQnOiAnYXV0bydcclxuXHRcdH0gKTtcclxuXHJcblx0XHRsZXQgZ2V0SGVpZ2h0ID0gICR0aGlzQW5pbWF0ZWRFbC5vdXRlckhlaWdodCgpO1xyXG5cclxuXHRcdCR0aGlzQW5pbWF0ZWRFbC5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XHJcblxyXG5cdFx0JHRoaXNTZWN0aW9uLmF0dHIoJ2RhdGEtb3Blbi1oZWlnaHQnLCBnZXRIZWlnaHQgKTtcclxuXHR9XHJcblxyXG5cdCRjb250cm9sU2VjdGlvbnMucmVtb3ZlQ2xhc3MoICcuaXMtYWN0aXZlJyApO1xyXG5cdCRjb250cm9sUGFnZXMucmVtb3ZlQ2xhc3MoICcuaXMtYWN0aXZlJyApO1xyXG5cdCRjb250cm9sUGFnZXMucmVtb3ZlQXR0ciggJ3N0eWxlJyApO1xyXG5cclxuXHJcblx0JCggJy5qcy1zZWN0aW9uLXRvZ2dsZScgKS5jbGljayggZnVuY3Rpb24oIGUgKXtcclxuXHRcdGxldCAkcGFyZW50ID0gJCggdGhpcyApLmNsb3Nlc3QoICcuY29udHJvbC0tcGFuZWxfX3NlY3Rpb24nICk7XHJcblx0XHRsZXQgcGFyZW50QWN0aXZlID0gJHBhcmVudC5oYXNDbGFzcyggJ2lzLWFjdGl2ZScgKSA/IHRydWUgOiBmYWxzZTtcclxuXHRcdGxldCB0aGlzSGVpZ2h0ID0gJHBhcmVudC5hdHRyKCAnZGF0YS1vcGVuLWhlaWdodCcgKTtcclxuXHRcdGlmICggcGFyZW50QWN0aXZlICkge1xyXG5cdFx0XHQkcGFyZW50LnJlbW92ZUNsYXNzKCAnaXMtYWN0aXZlJyApLmZpbmQoICdmaWVsZHNldCcgKS5jc3MoIHtcclxuXHRcdFx0XHQnaGVpZ2h0JzogJzAnXHJcblx0XHRcdH0gKSA7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkcGFyZW50LmFkZENsYXNzKCAnaXMtYWN0aXZlJyApLmZpbmQoICdmaWVsZHNldCcgKS5jc3MoIHtcclxuXHRcdFx0XHQnaGVpZ2h0JzogdGhpc0hlaWdodCsncHgnXHJcblx0XHRcdH0gKTtcclxuXHRcdH1cclxuXHJcblx0fSApO1xyXG5cclxuXHJcblx0JCggJy5idXR0b24tbGlzdCBidXR0b24nICkuY2xpY2soIGZ1bmN0aW9uKCBlICl7XHJcblx0XHRsZXQgJGVsID0gJCggdGhpcyApO1xyXG5cdFx0bGV0ICRzaWJsaW5ncyA9ICRlbC5jbG9zZXN0KCAnLmJ1dHRvbi1saXN0JyApLmZpbmQoICdidXR0b24nICk7XHJcblx0XHRsZXQgaXNBY3RpdmUgPSAkZWwuaGFzQ2xhc3MoICdpcy1hY3RpdmUnICkgPyB0cnVlIDogZmFsc2U7XHJcblxyXG5cdFx0aWYgKCBpc0FjdGl2ZSApIHtcclxuXHRcdFx0JGVsLnJlbW92ZUNsYXNzKCAnaXMtYWN0aXZlJyApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JHNpYmxpbmdzLnJlbW92ZUNsYXNzKCAnaXMtYWN0aXZlJyApO1xyXG5cdFx0XHQkZWwuYWRkQ2xhc3MoICdpcy1hY3RpdmUnICk7XHJcblx0XHR9XHJcblxyXG5cdH0gKTtcclxuXHJcblx0Ly8gZ2V0IGN1cnJlbnQgc2VsZWN0ZWQgYW5pbWF0aW9uIHNwZWVkXHJcblx0Ly8gbGV0IGluaXRTcGVlZFZhbCA9ICQoICcuanMtc3BlZWQtbGlzdCBidXR0b24uc2VsZWN0ZWQnKS5hdHRyKCAnZGF0YS1hbmltLXNwZWVkJyApO1xyXG5cdC8vIGNvbnNvbGUubG9nKCAnaW5pdFNwZWVkVmFsOiAnLCBpbml0U3BlZWRWYWwgKTtcclxuXHQvLyAkKCAnLmpzLWN1c3RvbS1hbmltLXNwZWVkLWlucHV0JyApLnZhbCggaW5pdFNwZWVkVmFsICk7XHJcblxyXG5cdC8vICQoICcuanMtY3VzdG9tLWFuaW0tc3BlZWQtaW5wdXQnICkub24oICdibHVyJywgZnVuY3Rpb24oIGUpIHtcclxuXHQvLyBcdC8vIGdldCBlbGVtZW50XHJcblx0Ly8gXHRsZXQgJGVsID0gJCggdGhpcyApO1xyXG5cdC8vIFx0Ly8gZ2V0IG1pbi9tYXggdmFsdWVcclxuXHQvLyBcdGxldCBtYXhWYWwgPSAkZWwuYXR0ciggJ21heCcgKTtcclxuXHQvLyBcdGxldCBtaW5WYWwgPSAkZWwuYXR0ciggJ21pbicgKTtcclxuXHRcdC8vIGdldCB2YWx1ZVxyXG5cdC8vIFx0bGV0IHZhbHVlID0gJGVsLnZhbCgpO1xyXG5cclxuXHQvLyBcdGlmICggdmFsdWUgPiBtYXhWYWwgKSB7XHJcblx0Ly8gXHRcdCRlbC52YWwoIG1heFZhbCApO1xyXG5cdC8vIFx0fSBlbHNlIHtcclxuXHQvLyBcdFx0aWYgKCB2YWx1ZSA8IG1pblZhbCApIHtcclxuXHQvLyBcdFx0XHQkZWwudmFsKCBtaW5WYWwgKTtcclxuXHQvLyBcdFx0fSBlbHNlIHtcclxuXHQvLyBcdFx0XHQkZWwudmFsKCBwYXJzZUZsb2F0KCB2YWx1ZSApLnRvRml4ZWQoIDEgKSApO1xyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHR9XHJcblx0Ly8gfSApO1xyXG5cclxuXHJcblx0Ly8gJCggJy5qcy1hbmltLXNwZWVkJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcclxuXHQvLyBcdC8vIGdldCBlbGVtZW50XHJcblx0Ly8gXHRsZXQgJGVsID0gJCggdGhpcyApO1xyXG5cdC8vIFx0Ly8gZ2V0IHZhbHVlXHJcblx0Ly8gXHRsZXQgdmFsdWUgPSAkZWwuYXR0ciggJ2RhdGEtYW5pbS1zcGVlZCcgKTtcclxuXHJcblx0Ly8gXHQkKCAnLmpzLWN1c3RvbS1hbmltLXNwZWVkLWlucHV0JyApLnZhbCggdmFsdWUgKTtcclxuXHQvLyBcdCRlbC5vZmYoKTtcclxuXHJcblx0Ly8gfSApO1xyXG5cclxuXHJcblx0Ly8gc2xpZGVyIGNvbnRyb2xzIGZvciBpbmRpdmlkdWFsIGZhY2lhbCBmZWF0dXJlc1xyXG5cdCQoICcucGFnZS1lbGVtZW50cyAucmFuZ2Utc2xpZGVyJyApLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZSApIHtcclxuXHRcdGNvbnNvbGUubG9nKCAnc2xpZGVyIHByb2Nlc3NpbmcgaXMgZmlyaW5nJyApO1xyXG5cdFx0Ly8gZ2V0IGVsZW1lbnRcclxuXHRcdGxldCAkZWwgPSAkKCB0aGlzICk7XHJcblx0XHQvLyBnZXQgb3V0cHV0IGVsXHJcblx0XHRsZXQgJG91dHB1dEVsID0gJGVsLmNsb3Nlc3QoICcuY29udHJvbC0tcGFuZWxfX2l0ZW0nICkuZmluZCggJ291dHB1dCcgKTtcclxuXHRcdC8vIGdldCBtaW4vbWF4IHZhbHVlXHJcblx0XHRsZXQgbWF4VmFsID0gJGVsLmF0dHIoICdtYXgnICk7XHJcblx0XHRsZXQgbWluVmFsID0gJGVsLmF0dHIoICdtaW4nICk7XHJcblx0XHQvLyBnZXQgdmFsdWVcclxuXHRcdGxldCB2YWx1ZSA9ICRlbC52YWwoKTtcclxuXHRcdGxldCBvdXRwdXQgPSAwO1xyXG5cclxuXHRcdGlmICggbWluVmFsIDwgMCApIHtcclxuXHRcdFx0dmFsdWUgPCAwID8gb3V0cHV0ID0gdmFsdWUgLyBtaW5WYWwgOiBvdXRwdXQgPSAoIHZhbHVlIC8gbWF4VmFsICkgKiAtMTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG91dHB1dCA9IHZhbHVlIC8gbWF4VmFsO1xyXG5cdFx0fVxyXG5cclxuXHRcdCRvdXRwdXRFbC5odG1sKCBwYXJzZUZsb2F0KCBvdXRwdXQgKS50b0ZpeGVkKCAyICkgKTtcclxuXHR9ICk7XHJcblxyXG5cclxuXHQvLyBzbGlkZXIgY29udHJvbHMgZm9yIGdsYXJlIHNwaWtlc1xyXG5cdCQoICcuanMtZ2xhcmUtc3Bpa2UtZWZmZWN0cyAucmFuZ2Utc2xpZGVyJyApLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZSApIHtcclxuXHRcdGNvbnNvbGUubG9nKCAnc2xpZGVyIHByb2Nlc3NpbmcgaXMgZmlyaW5nJyApO1xyXG5cdFx0Ly8gZ2V0IGVsZW1lbnRcclxuXHRcdGxldCAkZWwgPSAkKCB0aGlzICk7XHJcblx0XHQvLyBcdC8vIGdldCBvdXRwdXQgZWxcclxuXHRcdGxldCAkb3V0cHV0RWwgPSAkZWwuY2xvc2VzdCggJy5jb250cm9sLS1wYW5lbF9faXRlbScgKS5maW5kKCAnb3V0cHV0JyApO1xyXG5cdFx0Ly8gZ2V0IHZhbHVlXHJcblx0XHRsZXQgdmFsdWUgPSAkZWwudmFsKCk7XHJcblx0XHQvLyBmbGlwIHZhbHVlIGlmIHJhbmdlIGlzIGZsaXBwZWQgKGRpc3BsYXkgcHVycG9zZXMgb25seSlcclxuXHRcdCRvdXRwdXRFbC5odG1sKCBwYXJzZUZsb2F0KCB2YWx1ZSApLnRvRml4ZWQoIDIgKSApO1xyXG5cdH0gKTtcclxuXHJcblxyXG5cclxuXHQkKCAnLmpzLWRpc3BsYXktY29udHJvbHMgYnV0dG9uJyApLmNsaWNrKCBmdW5jdGlvbiggZSApe1xyXG5cdFx0dmFyICRlbCA9ICQoIHRoaXMgKTtcclxuXHRcdHZhciAkc2libGluZ3MgPSAkZWwuc2libGluZ3MoKTtcclxuXHRcdHZhciBpc0FjdGl2ZSA9ICRlbC5oYXNDbGFzcyggJ2lzLWFjdGl2ZScgKSA/IHRydWUgOiBmYWxzZTtcclxuXHJcblx0XHR2YXIgdGhpc0Rpc3BsYXlJdGVtID0gJGVsLmRhdGEoICdkaXNwbGF5LWl0ZW0nICk7XHJcblxyXG5cdFx0aWYgKCBpc0FjdGl2ZSApIHtcclxuXHRcdFx0JGVsLnJlbW92ZUNsYXNzKCAnaXMtYWN0aXZlJyApO1xyXG5cdFx0XHRvdmVybGF5Q2ZnWyB0aGlzRGlzcGxheUl0ZW0gXSA9IGZhbHNlO1xyXG5cclxuXHRcdFx0aWYgKCAhJHNpYmxpbmdzLmhhc0NsYXNzKCAnaXMtYWN0aXZlJyApICkge1xyXG5cdFx0XHRcdG92ZXJsYXlDZmcuZGlzcGxheU92ZXJsYXkgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkZWwuYWRkQ2xhc3MoICdpcy1hY3RpdmUnICk7XHJcblxyXG5cdFx0XHRpZiAoICFvdmVybGF5Q2ZnLmRpc3BsYXlPdmVybGF5ICkge1xyXG5cdFx0XHRcdG92ZXJsYXlDZmcuZGlzcGxheU92ZXJsYXkgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRvdmVybGF5Q2ZnWyB0aGlzRGlzcGxheUl0ZW0gXSA9IHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0aGlzRGlzcGxheUl0ZW0gPT09ICdkaXNwbGF5R2xhcmVTcGlrZXMnICkge1xyXG5cdFx0XHRzdW5TcGlrZXMuY2xlYXJSZW5kZXJDdHgoKTtcclxuXHRcdFx0c3VuU3Bpa2VzLnJlbmRlckdsYXJlU3Bpa2VzKCk7XHJcblx0XHR9XHJcblxyXG5cdH0gKTtcclxuXHJcblxyXG59ICk7XHJcbiIsInZhciBtYXRoVXRpbHMgPSByZXF1aXJlKCcuL21hdGhVdGlscy5qcycpLm1hdGhVdGlscztcclxuXHJcbnZhciBsYXN0Q2FsbGVkVGltZSA9IHZvaWQgMDtcclxuXHJcbnZhciBkZWJ1ZyA9IHtcclxuXHJcbiAgICBoZWxwZXJzOiB7XHJcbiAgICAgICAgZ2V0U3R5bGU6IGZ1bmN0aW9uIGdldFN0eWxlKGVsZW1lbnQsIHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSA/IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUocHJvcGVydHkpIDogZWxlbWVudC5zdHlsZVtwcm9wZXJ0eS5yZXBsYWNlKC8tKFthLXpdKS9nLCBmdW5jdGlvbiAoZykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdbMV0udG9VcHBlckNhc2UoKTtcclxuICAgICAgICAgICAgfSldO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW52ZXJ0Q29sb3I6IGZ1bmN0aW9uIGludmVydENvbG9yKGhleCwgYncpIHtcclxuICAgICAgICAgICAgaWYgKGhleC5pbmRleE9mKCcjJykgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGhleCA9IGhleC5zbGljZSgxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjb252ZXJ0IDMtZGlnaXQgaGV4IHRvIDYtZGlnaXRzLlxyXG4gICAgICAgICAgICBpZiAoaGV4Lmxlbmd0aCA9PT0gMykge1xyXG4gICAgICAgICAgICAgICAgaGV4ID0gaGV4WzBdICsgaGV4WzBdICsgaGV4WzFdICsgaGV4WzFdICsgaGV4WzJdICsgaGV4WzJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChoZXgubGVuZ3RoICE9PSA2KSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgSEVYIGNvbG9yLicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciByID0gcGFyc2VJbnQoaGV4LnNsaWNlKDAsIDIpLCAxNiksXHJcbiAgICAgICAgICAgICAgICBnID0gcGFyc2VJbnQoaGV4LnNsaWNlKDIsIDQpLCAxNiksXHJcbiAgICAgICAgICAgICAgICBiID0gcGFyc2VJbnQoaGV4LnNsaWNlKDQsIDYpLCAxNik7XHJcbiAgICAgICAgICAgIGlmIChidykge1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzk0MzAyMy8xMTI3MzFcclxuICAgICAgICAgICAgICAgIHJldHVybiByICogMC4yOTkgKyBnICogMC41ODcgKyBiICogMC4xMTQgPiAxODYgPyAnIzAwMDAwMCcgOiAnI0ZGRkZGRic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gaW52ZXJ0IGNvbG9yIGNvbXBvbmVudHNcclxuICAgICAgICAgICAgciA9ICgyNTUgLSByKS50b1N0cmluZygxNik7XHJcbiAgICAgICAgICAgIGcgPSAoMjU1IC0gZykudG9TdHJpbmcoMTYpO1xyXG4gICAgICAgICAgICBiID0gKDI1NSAtIGIpLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICAgICAgLy8gcGFkIGVhY2ggd2l0aCB6ZXJvcyBhbmQgcmV0dXJuXHJcbiAgICAgICAgICAgIHJldHVybiBcIiNcIiArIHBhZFplcm8ocikgKyBwYWRaZXJvKGcpICsgcGFkWmVybyhiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBkaXNwbGF5OiBmdW5jdGlvbiBkaXNwbGF5KGRpc3BsYXlGbGFnLCBtZXNzYWdlLCBwYXJhbSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBpZiAoc2VsZi5hbGwgPT09IHRydWUgfHwgZGlzcGxheUZsYWcgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSwgcGFyYW0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgZGVidWdPdXRwdXQ6IGZ1bmN0aW9uIGRlYnVnT3V0cHV0KGNhbnZhcywgY29udGV4dCwgbGFiZWwsIHBhcmFtLCBvdXRwdXROdW0sIG91dHB1dEJvdW5kcykge1xyXG4gICAgICAgIDtcclxuXHJcbiAgICAgICAgaWYgKG91dHB1dEJvdW5kcykge1xyXG4gICAgICAgICAgICB2YXIgdGhpc1JlZCA9IG1hdGhVdGlscy5tYXAocGFyYW0sIG91dHB1dEJvdW5kcy5taW4sIG91dHB1dEJvdW5kcy5tYXgsIDI1NSwgMCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHZhciB0aGlzR3JlZW4gPSBtYXRoVXRpbHMubWFwKHBhcmFtLCBvdXRwdXRCb3VuZHMubWluLCBvdXRwdXRCb3VuZHMubWF4LCAwLCAyNTUsIHRydWUpO1xyXG4gICAgICAgICAgICAvLyB2YXIgdGhpc0JsdWUgPSBtYXRoVXRpbHMubWFwKHBhcmFtLCBvdXRwdXRCb3VuZHMubWluLCBvdXRwdXRCb3VuZHMubWF4LCAwLCAyNTUsIHRydWUpO1xyXG4gICAgICAgICAgICB2YXIgdGhpc0NvbG9yID0gJ3JnYiggJyArIHRoaXNSZWQgKyAnLCAnICsgdGhpc0dyZWVuICsgJywgMCApJztcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCAnY2hhbmdpbmcgZGVidWcgY29sb3Igb2Y6ICcrcGFyYW0rJyB0bzogJyt0aGlzQ29sb3IgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdGhpc0NvbG9yID0gXCIjZWZlZmVmXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdlBvcyA9IG91dHB1dE51bSAqIDUwICsgNTA7XHJcbiAgICAgICAgY29udGV4dC50ZXh0QWxpZ24gPSBcImxlZnRcIjtcclxuICAgICAgICBjb250ZXh0LmZvbnQgPSBcIjE0cHQgYXJpYWxcIjtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHRoaXNDb2xvcjtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsVGV4dChsYWJlbCArIHBhcmFtLCA1MCwgdlBvcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNhbGN1bGF0ZUZwczogZnVuY3Rpb24gY2FsY3VsYXRlRnBzKCkge1xyXG4gICAgICAgIGlmICghbGFzdENhbGxlZFRpbWUpIHtcclxuICAgICAgICAgICAgbGFzdENhbGxlZFRpbWUgPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZGVsdGEgPSAod2luZG93LnBlcmZvcm1hbmNlLm5vdygpIC0gbGFzdENhbGxlZFRpbWUpIC8gMTAwMDtcclxuICAgICAgICBsYXN0Q2FsbGVkVGltZSA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICByZXR1cm4gMSAvIGRlbHRhO1xyXG4gICAgfSxcclxuXHJcbiAgICBmbGFnczoge1xyXG4gICAgICAgIGFsbDogZmFsc2UsXHJcbiAgICAgICAgcGFydHM6IHtcclxuICAgICAgICAgICAgY2xpY2tzOiB0cnVlLFxyXG4gICAgICAgICAgICBydW50aW1lOiB0cnVlLFxyXG4gICAgICAgICAgICB1cGRhdGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBraWxsQ29uZGl0aW9uczogZmFsc2UsXHJcbiAgICAgICAgICAgIGFuaW1hdGlvbkNvdW50ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICBlbnRpdHlTdG9yZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGZwczogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmRlYnVnID0gZGVidWc7XHJcbm1vZHVsZS5leHBvcnRzLmxhc3RDYWxsZWRUaW1lID0gbGFzdENhbGxlZFRpbWU7IiwiLypcclxuICogVGhpcyBpcyBhIG5lYXItZGlyZWN0IHBvcnQgb2YgUm9iZXJ0IFBlbm5lcidzIGVhc2luZyBlcXVhdGlvbnMuIFBsZWFzZSBzaG93ZXIgUm9iZXJ0IHdpdGhcclxuICogcHJhaXNlIGFuZCBhbGwgb2YgeW91ciBhZG1pcmF0aW9uLiBIaXMgbGljZW5zZSBpcyBwcm92aWRlZCBiZWxvdy5cclxuICpcclxuICogRm9yIGluZm9ybWF0aW9uIG9uIGhvdyB0byB1c2UgdGhlc2UgZnVuY3Rpb25zIGluIHlvdXIgYW5pbWF0aW9ucywgY2hlY2sgb3V0IG15IGZvbGxvd2luZyB0dXRvcmlhbDogXHJcbiAqIGh0dHA6Ly9iaXQubHkvMThpSEhLcVxyXG4gKlxyXG4gKiAtS2lydXBhXHJcbiAqL1xyXG5cclxuLypcclxuICpcclxuICogVEVSTVMgT0YgVVNFIC0gRUFTSU5HIEVRVUFUSU9OU1xyXG4gKiBcclxuICogT3BlbiBzb3VyY2UgdW5kZXIgdGhlIEJTRCBMaWNlbnNlLiBcclxuICogXHJcbiAqIENvcHlyaWdodCDCqSAyMDAxIFJvYmVydCBQZW5uZXJcclxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICogXHJcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sIFxyXG4gKiBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XHJcbiAqIFxyXG4gKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZiBcclxuICogY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxyXG4gKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBcclxuICogb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgXHJcbiAqIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cclxuICogXHJcbiAqIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIGF1dGhvciBub3IgdGhlIG5hbWVzIG9mIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIFxyXG4gKiBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxyXG4gKiBcclxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EIEFOWSBcclxuICogRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GXHJcbiAqIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gKiBDT1BZUklHSFQgT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsXHJcbiAqIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURVxyXG4gKiBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgXHJcbiAqIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HXHJcbiAqIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIFxyXG4gKiBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuIFxyXG4gKlxyXG4gKi9cclxuXHJcbnZhciBlYXNpbmdFcXVhdGlvbnMgPSB7XHJcblx0LyoqXHJcbiAqIHByb3ZpZGVzIGVhc2luZyB1dGlsIG1ldGhvZHMuXHJcbiAqL1xyXG5cdGxpbmVhckVhc2U6IGZ1bmN0aW9uIGxpbmVhckVhc2UoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJblF1YWQ6IGZ1bmN0aW9uIGVhc2VJblF1YWQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucykgKiBjdXJyZW50SXRlcmF0aW9uICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlT3V0UXVhZDogZnVuY3Rpb24gZWFzZU91dFF1YWQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gLWNoYW5nZUluVmFsdWUgKiAoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMpICogKGN1cnJlbnRJdGVyYXRpb24gLSAyKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0UXVhZDogZnVuY3Rpb24gZWFzZUluT3V0UXVhZChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogY3VycmVudEl0ZXJhdGlvbiAqIGN1cnJlbnRJdGVyYXRpb24gKyBzdGFydFZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIC1jaGFuZ2VJblZhbHVlIC8gMiAqICgtLWN1cnJlbnRJdGVyYXRpb24gKiAoY3VycmVudEl0ZXJhdGlvbiAtIDIpIC0gMSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbkN1YmljOiBmdW5jdGlvbiBlYXNlSW5DdWJpYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucywgMykgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRDdWJpYzogZnVuY3Rpb24gZWFzZU91dEN1YmljKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEsIDMpICsgMSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbk91dEN1YmljOiBmdW5jdGlvbiBlYXNlSW5PdXRDdWJpYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiwgMykgKyBzdGFydFZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLSAyLCAzKSArIDIpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5RdWFydDogZnVuY3Rpb24gZWFzZUluUXVhcnQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMsIDQpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlT3V0UXVhcnQ6IGZ1bmN0aW9uIGVhc2VPdXRRdWFydChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiAtY2hhbmdlSW5WYWx1ZSAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSwgNCkgLSAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0UXVhcnQ6IGZ1bmN0aW9uIGVhc2VJbk91dFF1YXJ0KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uLCA0KSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gLWNoYW5nZUluVmFsdWUgLyAyICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLSAyLCA0KSAtIDIpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5RdWludDogZnVuY3Rpb24gZWFzZUluUXVpbnQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMsIDUpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlT3V0UXVpbnQ6IGZ1bmN0aW9uIGVhc2VPdXRRdWludChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxLCA1KSArIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRRdWludDogZnVuY3Rpb24gZWFzZUluT3V0UXVpbnQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcblx0XHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24sIDUpICsgc3RhcnRWYWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC0gMiwgNSkgKyAyKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluU2luZTogZnVuY3Rpb24gZWFzZUluU2luZShjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogKDEgLSBNYXRoLmNvcyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zICogKE1hdGguUEkgLyAyKSkpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlT3V0U2luZTogZnVuY3Rpb24gZWFzZU91dFNpbmUoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGguc2luKGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgKiAoTWF0aC5QSSAvIDIpKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0U2luZTogZnVuY3Rpb24gZWFzZUluT3V0U2luZShjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqICgxIC0gTWF0aC5jb3MoTWF0aC5QSSAqIGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMpKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluRXhwbzogZnVuY3Rpb24gZWFzZUluRXhwbyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5wb3coMiwgMTAgKiAoY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEpKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZU91dEV4cG86IGZ1bmN0aW9uIGVhc2VPdXRFeHBvKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoLU1hdGgucG93KDIsIC0xMCAqIGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMpICsgMSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbk91dEV4cG86IGZ1bmN0aW9uIGVhc2VJbk91dEV4cG8oY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcblx0XHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIE1hdGgucG93KDIsIDEwICogKGN1cnJlbnRJdGVyYXRpb24gLSAxKSkgKyBzdGFydFZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKC1NYXRoLnBvdygyLCAtMTAgKiAtLWN1cnJlbnRJdGVyYXRpb24pICsgMikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbkNpcmM6IGZ1bmN0aW9uIGVhc2VJbkNpcmMoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqICgxIC0gTWF0aC5zcXJ0KDEgLSAoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMpICogY3VycmVudEl0ZXJhdGlvbikpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlT3V0Q2lyYzogZnVuY3Rpb24gZWFzZU91dENpcmMoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGguc3FydCgxIC0gKGN1cnJlbnRJdGVyYXRpb24gPSBjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSkgKiBjdXJyZW50SXRlcmF0aW9uKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0Q2lyYzogZnVuY3Rpb24gZWFzZUluT3V0Q2lyYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKDEgLSBNYXRoLnNxcnQoMSAtIGN1cnJlbnRJdGVyYXRpb24gKiBjdXJyZW50SXRlcmF0aW9uKSkgKyBzdGFydFZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKE1hdGguc3FydCgxIC0gKGN1cnJlbnRJdGVyYXRpb24gLT0gMikgKiBjdXJyZW50SXRlcmF0aW9uKSArIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5FbGFzdGljOiBmdW5jdGlvbiBlYXNlSW5FbGFzdGljKHQsIGIsIGMsIGQpIHtcclxuXHRcdHZhciBzID0gMS43MDE1ODt2YXIgcCA9IDA7dmFyIGEgPSBjO1xyXG5cdFx0aWYgKHQgPT0gMCkgcmV0dXJuIGI7aWYgKCh0IC89IGQpID09IDEpIHJldHVybiBiICsgYztpZiAoIXApIHAgPSBkICogLjM7XHJcblx0XHRpZiAoYSA8IE1hdGguYWJzKGMpKSB7XHJcblx0XHRcdGEgPSBjO3ZhciBzID0gcCAvIDQ7XHJcblx0XHR9IGVsc2UgdmFyIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbihjIC8gYSk7XHJcblx0XHRyZXR1cm4gLShhICogTWF0aC5wb3coMiwgMTAgKiAodCAtPSAxKSkgKiBNYXRoLnNpbigodCAqIGQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSkgKyBiO1xyXG5cdH0sXHJcblx0ZWFzZU91dEVsYXN0aWM6IGZ1bmN0aW9uIGVhc2VPdXRFbGFzdGljKHQsIGIsIGMsIGQpIHtcclxuXHRcdHZhciBzID0gMS43MDE1ODt2YXIgcCA9IDA7dmFyIGEgPSBjO1xyXG5cdFx0aWYgKHQgPT0gMCkgcmV0dXJuIGI7aWYgKCh0IC89IGQpID09IDEpIHJldHVybiBiICsgYztpZiAoIXApIHAgPSBkICogLjM7XHJcblx0XHRpZiAoYSA8IE1hdGguYWJzKGMpKSB7XHJcblx0XHRcdGEgPSBjO3ZhciBzID0gcCAvIDQ7XHJcblx0XHR9IGVsc2UgdmFyIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbihjIC8gYSk7XHJcblx0XHRyZXR1cm4gYSAqIE1hdGgucG93KDIsIC0xMCAqIHQpICogTWF0aC5zaW4oKHQgKiBkIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkgKyBjICsgYjtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRFbGFzdGljOiBmdW5jdGlvbiBlYXNlSW5PdXRFbGFzdGljKHQsIGIsIGMsIGQpIHtcclxuXHRcdHZhciBzID0gMS43MDE1ODt2YXIgcCA9IDA7dmFyIGEgPSBjO1xyXG5cdFx0aWYgKHQgPT0gMCkgcmV0dXJuIGI7aWYgKCh0IC89IGQgLyAyKSA9PSAyKSByZXR1cm4gYiArIGM7aWYgKCFwKSBwID0gZCAqICguMyAqIDEuNSk7XHJcblx0XHRpZiAoYSA8IE1hdGguYWJzKGMpKSB7XHJcblx0XHRcdGEgPSBjO3ZhciBzID0gcCAvIDQ7XHJcblx0XHR9IGVsc2UgdmFyIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbihjIC8gYSk7XHJcblx0XHRpZiAodCA8IDEpIHJldHVybiAtLjUgKiAoYSAqIE1hdGgucG93KDIsIDEwICogKHQgLT0gMSkpICogTWF0aC5zaW4oKHQgKiBkIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkpICsgYjtcclxuXHRcdHJldHVybiBhICogTWF0aC5wb3coMiwgLTEwICogKHQgLT0gMSkpICogTWF0aC5zaW4oKHQgKiBkIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkgKiAuNSArIGMgKyBiO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbkJhY2s6IGZ1bmN0aW9uIGVhc2VJbkJhY2sodCwgYiwgYywgZCwgcykge1xyXG5cdFx0aWYgKHMgPT0gdW5kZWZpbmVkKSBzID0gMS43MDE1ODtcclxuXHRcdHJldHVybiBjICogKHQgLz0gZCkgKiB0ICogKChzICsgMSkgKiB0IC0gcykgKyBiO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRCYWNrOiBmdW5jdGlvbiBlYXNlT3V0QmFjayh0LCBiLCBjLCBkLCBzKSB7XHJcblx0XHRpZiAocyA9PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xyXG5cdFx0cmV0dXJuIGMgKiAoKHQgPSB0IC8gZCAtIDEpICogdCAqICgocyArIDEpICogdCArIHMpICsgMSkgKyBiO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbk91dEJhY2s6IGZ1bmN0aW9uIGVhc2VJbk91dEJhY2sodCwgYiwgYywgZCwgcykge1xyXG5cdFx0aWYgKHMgPT0gdW5kZWZpbmVkKSBzID0gMS43MDE1ODtcclxuXHRcdGlmICgodCAvPSBkIC8gMikgPCAxKSByZXR1cm4gYyAvIDIgKiAodCAqIHQgKiAoKChzICo9IDEuNTI1KSArIDEpICogdCAtIHMpKSArIGI7XHJcblx0XHRyZXR1cm4gYyAvIDIgKiAoKHQgLT0gMikgKiB0ICogKCgocyAqPSAxLjUyNSkgKyAxKSAqIHQgKyBzKSArIDIpICsgYjtcclxuXHR9LFxyXG5cclxuXHQvLyBlYXNlSW5Cb3VuY2U6IGZ1bmN0aW9uKHQsIGIsIGMsIGQpIHtcclxuXHQvLyAgICAgcmV0dXJuIGMgLSBlYXNlT3V0Qm91bmNlKGQtdCwgMCwgYywgZCkgKyBiO1xyXG5cdC8vIH0sXHJcblxyXG5cdGVhc2VPdXRCb3VuY2U6IGZ1bmN0aW9uIGVhc2VPdXRCb3VuY2UodCwgYiwgYywgZCkge1xyXG5cdFx0aWYgKCh0IC89IGQpIDwgMSAvIDIuNzUpIHtcclxuXHRcdFx0cmV0dXJuIGMgKiAoNy41NjI1ICogdCAqIHQpICsgYjtcclxuXHRcdH0gZWxzZSBpZiAodCA8IDIgLyAyLjc1KSB7XHJcblx0XHRcdHJldHVybiBjICogKDcuNTYyNSAqICh0IC09IDEuNSAvIDIuNzUpICogdCArIC43NSkgKyBiO1xyXG5cdFx0fSBlbHNlIGlmICh0IDwgMi41IC8gMi43NSkge1xyXG5cdFx0XHRyZXR1cm4gYyAqICg3LjU2MjUgKiAodCAtPSAyLjI1IC8gMi43NSkgKiB0ICsgLjkzNzUpICsgYjtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBjICogKDcuNTYyNSAqICh0IC09IDIuNjI1IC8gMi43NSkgKiB0ICsgLjk4NDM3NSkgKyBiO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gZWFzZUluT3V0Qm91bmNlOiBmdW5jdGlvbih0LCBiLCBjLCBkKSB7XHJcblx0Ly8gICAgIGlmICh0IDwgZC8yKSByZXR1cm4gdGhpcy5lYXNlSW5Cb3VuY2UodCoyLCAwLCBjLCBkKSAqIC41ICsgYjtcclxuXHQvLyAgICAgcmV0dXJuIHRoaXMuZWFzZU91dEJvdW5jZSh0KjItZCwgMCwgYywgZCkgKiAuNSArIGMqLjUgKyBiO1xyXG5cdC8vIH1cclxufTtcclxuXHJcbmVhc2luZ0VxdWF0aW9ucy5lYXNlSW5Cb3VuY2UgPSBmdW5jdGlvbiAodCwgYiwgYywgZCkge1xyXG5cdHJldHVybiBjIC0gZWFzaW5nRXF1YXRpb25zLmVhc2VPdXRCb3VuY2UoZCAtIHQsIDAsIGMsIGQpICsgYjtcclxufSwgZWFzaW5nRXF1YXRpb25zLmVhc2VJbk91dEJvdW5jZSA9IGZ1bmN0aW9uICh0LCBiLCBjLCBkKSB7XHJcblx0aWYgKHQgPCBkIC8gMikgcmV0dXJuIGVhc2luZ0VxdWF0aW9ucy5lYXNlSW5Cb3VuY2UodCAqIDIsIDAsIGMsIGQpICogLjUgKyBiO1xyXG5cdHJldHVybiBlYXNpbmdFcXVhdGlvbnMuZWFzZU91dEJvdW5jZSh0ICogMiAtIGQsIDAsIGMsIGQpICogLjUgKyBjICogLjUgKyBiO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuZWFzaW5nRXF1YXRpb25zID0gZWFzaW5nRXF1YXRpb25zOyIsInJlcXVpcmUoICcuL2FwcC5qcycgKTtcclxucmVxdWlyZSggJy4vY29udHJvbFBhbmVsLmpzJyApO1xyXG5yZXF1aXJlKCAnLi9leHBvcnRPdmVybGF5LmpzJyApOyIsInZhciBlbnZpcm9ubWVudCA9IHtcclxuXHJcblx0XHRydW50aW1lRW5naW5lOiB7XHJcblxyXG5cdFx0XHRcdHN0YXJ0QW5pbWF0aW9uOiBmdW5jdGlvbiBzdGFydEFuaW1hdGlvbihhbmltVmFyLCBsb29wRm4pIHtcclxuXHRcdFx0XHRcdFx0aWYgKCFhbmltVmFyKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRhbmltVmFyID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wRm4pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHJcblx0XHRcdFx0c3RvcEFuaW1hdGlvbjogZnVuY3Rpb24gc3RvcEFuaW1hdGlvbihhbmltVmFyKSB7XHJcblx0XHRcdFx0XHRcdGlmIChhbmltVmFyKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbVZhcik7XHJcblx0XHRcdFx0XHRcdFx0XHRhbmltVmFyID0gdW5kZWZpbmVkO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdH0sXHJcblxyXG5cdFx0Y2FudmFzOiB7XHJcblx0XHRcdFx0Ly8gYnVmZmVyIGNsZWFyIGZOXHJcblx0XHRcdFx0Y2hlY2tDbGVhckJ1ZmZlclJlZ2lvbjogZnVuY3Rpb24gY2hlY2tDbGVhckJ1ZmZlclJlZ2lvbihwYXJ0aWNsZSwgY2FudmFzQ29uZmlnKSB7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgYnVmZmVyQ2xlYXJSZWdpb24gPSBjYW52YXNDb25maWcuYnVmZmVyQ2xlYXJSZWdpb247XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgZW50aXR5V2lkdGggPSBwYXJ0aWNsZS5yIC8gMjtcclxuXHRcdFx0XHRcdFx0dmFyIGVudGl0eUhlaWdodCA9IHBhcnRpY2xlLnIgLyAyO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHBhcnRpY2xlLnggLSBlbnRpdHlXaWR0aCA8IGJ1ZmZlckNsZWFyUmVnaW9uLngpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGJ1ZmZlckNsZWFyUmVnaW9uLnggPSBwYXJ0aWNsZS54IC0gZW50aXR5V2lkdGg7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGlmIChwYXJ0aWNsZS54ICsgZW50aXR5V2lkdGggPiBidWZmZXJDbGVhclJlZ2lvbi54ICsgYnVmZmVyQ2xlYXJSZWdpb24udykge1xyXG5cdFx0XHRcdFx0XHRcdFx0YnVmZmVyQ2xlYXJSZWdpb24udyA9IHBhcnRpY2xlLnggKyBlbnRpdHlXaWR0aCAtIGJ1ZmZlckNsZWFyUmVnaW9uLng7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGlmIChwYXJ0aWNsZS55IC0gZW50aXR5SGVpZ2h0IDwgYnVmZmVyQ2xlYXJSZWdpb24ueSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0YnVmZmVyQ2xlYXJSZWdpb24ueSA9IHBhcnRpY2xlLnkgLSBlbnRpdHlIZWlnaHQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGlmIChwYXJ0aWNsZS55ICsgZW50aXR5SGVpZ2h0ID4gYnVmZmVyQ2xlYXJSZWdpb24ueSArIGJ1ZmZlckNsZWFyUmVnaW9uLmgpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGJ1ZmZlckNsZWFyUmVnaW9uLmggPSBwYXJ0aWNsZS55ICsgZW50aXR5SGVpZ2h0IC0gYnVmZmVyQ2xlYXJSZWdpb24ueTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblxyXG5cdFx0XHRcdHJlc2V0QnVmZmVyQ2xlYXJSZWdpb246IGZ1bmN0aW9uIHJlc2V0QnVmZmVyQ2xlYXJSZWdpb24oY2FudmFzQ29uZmlnKSB7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgYnVmZmVyQ2xlYXJSZWdpb24gPSBjYW52YXNDb25maWcuYnVmZmVyQ2xlYXJSZWdpb247XHJcblxyXG5cdFx0XHRcdFx0XHRidWZmZXJDbGVhclJlZ2lvbi54ID0gY2FudmFzQ29uZmlnLmNlbnRlckg7XHJcblx0XHRcdFx0XHRcdGJ1ZmZlckNsZWFyUmVnaW9uLnkgPSBjYW52YXNDb25maWcuY2VudGVyVjtcclxuXHRcdFx0XHRcdFx0YnVmZmVyQ2xlYXJSZWdpb24udyA9IGNhbnZhc0NvbmZpZy53aWR0aDtcclxuXHRcdFx0XHRcdFx0YnVmZmVyQ2xlYXJSZWdpb24uaCA9IGNhbnZhc0NvbmZpZy5oZWlnaHQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRmb3JjZXM6IHtcclxuXHRcdFx0XHRmcmljdGlvbjogMC4wMSxcclxuXHRcdFx0XHRib3V5YW5jeTogMSxcclxuXHRcdFx0XHRncmF2aXR5OiAwLFxyXG5cdFx0XHRcdHdpbmQ6IDEsXHJcblx0XHRcdFx0dHVyYnVsZW5jZTogeyBtaW46IC01LCBtYXg6IDUgfVxyXG5cdFx0fVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmVudmlyb25tZW50ID0gZW52aXJvbm1lbnQ7IiwiJCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKXtcclxuXHJcblxyXG5cdHZhciAkZmVhdHVyZVBhZ2VQYXJlbnQgPSAkKCAnWyBkYXRhLXBhZ2U9XCJwYWdlLWVsZW1lbnRzXCIgXScpO1xyXG4gICAgdmFyICRmZWF0dXJlSW5wdXRzID0gJGZlYXR1cmVQYWdlUGFyZW50LmZpbmQoICcucmFuZ2Utc2xpZGVyJyApO1xyXG4gICAgdmFyICRmZWF0dXJlT3V0cHV0cyA9ICRmZWF0dXJlUGFnZVBhcmVudC5maW5kKCAnb3V0cHV0JyApO1xyXG4gICAgdmFyICRmZWF0dXJlSW5wdXRzTGVuID0gJGZlYXR1cmVJbnB1dHMubGVuZ3RoO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCAndGVzdCBpbnB1dDogJywgJGZlYXR1cmVJbnB1dHMuZXEoIDIgKSApO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUV4cHJlc3Npb25QYXJhbWV0ZXJFeHBvcnQoKSB7XHJcblxyXG4gICAgXHR2YXIgb3V0cHV0ID0gJyc7XHJcblxyXG4gICAgXHRmb3IgKCB2YXIgaSA9IDA7IGkgPCAkZmVhdHVyZUlucHV0c0xlbjsgaSsrICkge1xyXG4gICAgXHRcdHZhciB0aGlzSW5wdXQgPSAkZmVhdHVyZUlucHV0cy5lcSggaSApWyAwIF07XHJcbiAgICBcdFx0dmFyICR0aGlzT3V0cHV0ID0gcGFyc2VGbG9hdCggJGZlYXR1cmVPdXRwdXRzLmVxKCBpICkuaHRtbCgpICkudG9GaXhlZCggMiApO1xyXG5cclxuICAgIFx0XHR0aGlzSW5wdXQuaWQgPT09ICdtb3V0aEVkZ2VSaWdodCcgPyAkdGhpc091dHB1dCA9ICR0aGlzT3V0cHV0ICogLTEgOiBmYWxzZTtcclxuXHJcbiAgICBcdFx0dmFyIHRlbXBFbmRpbmcgPSAnJztcclxuXHJcbiAgICBcdFx0aWYgKCBpICE9PSAkZmVhdHVyZUlucHV0c0xlbiAtIDEgKSB7XHJcbiAgICBcdFx0XHR0ZW1wRW5kaW5nID0gJywnO1xyXG4gICAgXHRcdH1cclxuXHJcbiAgICBcdFx0b3V0cHV0ID0gYCR7IG91dHB1dCB9XHJcbiAgICBcdFx0eyBuYW1lOiBcIiR7IHRoaXNJbnB1dC5pZCB9XCIsIHRhcmdldDogXCIkeyAkdGhpc091dHB1dCB9XCIgfSR7dGVtcEVuZGluZ31gO1xyXG4gICAgXHR9XHJcblxyXG4gICAgXHRvdXRwdXQgPSBgW1xyXG4gICAgXHRcdFx0JHsgb3V0cHV0IH1cclxuICAgIFx0XHRdYDtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coICdvdXRwdXQ6ICcsIG91dHB1dCApO1xyXG4gICAgXHRyZXR1cm4gb3V0cHV0O1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cdHZhciAkZXhwb3J0T3ZlcmxheSA9ICQoICcuZXhwb3J0LW92ZXJsYXktLWNvbnRhaW5lcicgKTtcclxuXHJcblx0JCggJy5qcy1leHBvcnQtZXhwcmVzc2lvbicgKS5jbGljayggZnVuY3Rpb24oIGUgKXtcclxuXHJcblx0XHR2YXIgJHRoaXNCdXR0b24gPSAkKCB0aGlzICk7XHJcblxyXG5cdFx0aWYgKCAkZXhwb3J0T3ZlcmxheS5oYXNDbGFzcyggJ2lzLWFjdGl2ZScpICkge1xyXG5cdFx0XHQkZXhwb3J0T3ZlcmxheS5yZW1vdmVDbGFzcyggJ2lzLWFjdGl2ZScgKTtcclxuXHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHJcblxyXG5cdFx0XHQkKCAnLmV4cG9ydC1vdmVybGF5LS1vdXRwdXQnICkuaHRtbCggY3JlYXRlRXhwcmVzc2lvblBhcmFtZXRlckV4cG9ydCgpICk7XHJcblx0XHRcdCRleHBvcnRPdmVybGF5LmFkZENsYXNzKCAnaXMtYWN0aXZlJyApO1xyXG5cdFx0fVxyXG5cclxuXHR9ICk7XHJcblxyXG5cdCQoICcuanMtY2xvc2UtZXhwb3J0LW92ZXJsYXktbGltaXRlcicgKS5jbGljayggZnVuY3Rpb24oIGUgKXtcclxuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0fSApO1xyXG5cclxuXHJcblx0JCggJy5qcy1jbG9zZS1leHBvcnQtb3ZlcmxheScgKS5jbGljayggZnVuY3Rpb24oIGUgKXtcclxuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICk7XHJcblx0XHQkKCAnLmV4cG9ydC1vdmVybGF5LS1jb250YWluZXInICkucmVtb3ZlQ2xhc3MoICdpcy1hY3RpdmUnIClcclxuXHR9ICk7XHJcblxyXG5cdFxyXG5cclxuXHJcbn0gKTsiLCJmdW5jdGlvbiBkZWcycmFkKGQpIHtcclxuICAgIHJldHVybiAoMiAqIE1hdGguUEkgKiBkKSAvIDM2MDtcclxufVxyXG5cclxuZnVuY3Rpb24gcmFkMmRlZyhyKSB7XHJcbiAgICByZXR1cm4gKDM2MCAqIHIpIC8gKDIgKiBNYXRoLlBJKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzdGFuY2UoeDEsIHkxLCB4MiwgeTIpIHtcclxuICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coeDEgLSB4MiwgMikgKyBNYXRoLnBvdyh5MSAtIHkyLCAyKSk7XHJcbn1cclxuXHJcbnZhciBHZWFyID0gZnVuY3Rpb24oeCwgeSwgY29ubmVjdGlvblJhZGl1cywgdGVldGgsIGZpbGxTdHlsZSwgc3Ryb2tlU3R5bGUpIHtcclxuICAgIC8vIEdlYXIgcGFyYW1ldGVyc1xyXG4gICAgdGhpcy54ID0geDtcclxuICAgIHRoaXMueSA9IHk7XHJcbiAgICB0aGlzLmNvbm5lY3Rpb25SYWRpdXMgPSBjb25uZWN0aW9uUmFkaXVzO1xyXG4gICAgdGhpcy50ZWV0aCA9IHRlZXRoO1xyXG5cclxuICAgIC8vIFJlbmRlciBwYXJhbWV0ZXJzXHJcbiAgICB0aGlzLmZpbGxTdHlsZSA9IGZpbGxTdHlsZTtcclxuICAgIHRoaXMuc3Ryb2tlU3R5bGUgPSBzdHJva2VTdHlsZTtcclxuXHJcbiAgICAvLyBDYWxjdWxhdGVkIHByb3BlcnRpZXNcclxuICAgIHRoaXMuZGlhbWV0ZXIgPSB0ZWV0aCAqIDQgKiBjb25uZWN0aW9uUmFkaXVzOyAvLyBFYWNoIHRvdXRoIGlzIGJ1aWx0IGZyb20gdHdvIGNpcmNsZXMgb2YgY29ubmVjdGlvblJhZGl1c1xyXG4gICAgdGhpcy5yYWRpdXMgPSB0aGlzLmRpYW1ldGVyIC8gKDIgKiBNYXRoLlBJKTsgLy8gRCA9IDIgUEkgclxyXG5cclxuICAgIC8vIEFuaW1hdGlvbiBwcm9wZXJ0aWVzXHJcbiAgICB0aGlzLnBoaTAgPSAwOyAvLyBTdGFydGluZyBhbmdsZVxyXG4gICAgdGhpcy5hbmd1bGFyU3BlZWQgPSAwOyAvLyBTcGVlZCBvZiByb3RhdGlvbiBpbiBkZWdyZWVzIHBlciBzZWNvbmRcclxuICAgIHRoaXMuY3JlYXRlZEF0ID0gbmV3IERhdGUoKTsgLy8gVGltZXN0YW1wXHJcbn1cclxuXHJcbkdlYXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAvLyBVcGRhdGUgcm90YXRpb24gYW5nbGVcclxuICAgIHZhciBlbGxhcHNlZCA9IG5ldyBEYXRlKCkgLSB0aGlzLmNyZWF0ZWRBdDtcclxuICAgIHZhciBwaGlEZWdyZWVzID0gdGhpcy5hbmd1bGFyU3BlZWQgKiAoZWxsYXBzZWQgLyAxMDAwKTtcclxuICAgIHZhciBwaGkgPSB0aGlzLnBoaTAgKyBkZWcycmFkKHBoaURlZ3JlZXMpOyAvLyBDdXJyZW50IGFuZ2xlXHJcblxyXG4gICAgLy8gU2V0LXVwIHJlbmRlcmluZyBwcm9wZXJ0aWVzXHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuZmlsbFN0eWxlO1xyXG4gICAgY29udGV4dC5zdHJva2VTdHlsZSA9IHRoaXMuc3Ryb2tlU3R5bGU7XHJcbiAgICBjb250ZXh0LmxpbmVDYXAgPSAncm91bmQnO1xyXG4gICAgY29udGV4dC5saW5lV2lkdGggPSAxO1xyXG5cclxuICAgIC8vIERyYXcgZ2VhciBib2R5XHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRlZXRoICogMjsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGFscGhhID0gMiAqIE1hdGguUEkgKiAoaSAvICh0aGlzLnRlZXRoICogMikpICsgcGhpO1xyXG4gICAgICAgIC8vIENhbGN1bGF0ZSBpbmRpdmlkdWFsIHRvdXRoIHBvc2l0aW9uXHJcbiAgICAgICAgdmFyIHggPSB0aGlzLnggKyBNYXRoLmNvcyhhbHBoYSkgKiB0aGlzLnJhZGl1cztcclxuICAgICAgICB2YXIgeSA9IHRoaXMueSArIE1hdGguc2luKGFscGhhKSAqIHRoaXMucmFkaXVzO1xyXG5cclxuICAgICAgICAvLyBEcmF3IGEgaGFsZi1jaXJjbGUsIHJvdGF0ZSBpdCB0b2dldGhlciB3aXRoIGFscGhhXHJcbiAgICAgICAgLy8gT24gZXZlcnkgb2RkIHRvdXRoLCBpbnZlcnQgdGhlIGhhbGYtY2lyY2xlXHJcbiAgICAgICAgY29udGV4dC5hcmMoeCwgeSwgdGhpcy5jb25uZWN0aW9uUmFkaXVzLCAtTWF0aC5QSSAvIDIgKyBhbHBoYSwgTWF0aC5QSSAvIDIgKyBhbHBoYSwgaSAlIDIgPT0gMCk7XHJcbiAgICB9XHJcbiAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgLy8gRHJhdyBjZW50ZXIgY2lyY2xlXHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgY29udGV4dC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMuY29ubmVjdGlvblJhZGl1cywgMCwgMiAqIE1hdGguUEksIHRydWUpO1xyXG4gICAgY29udGV4dC5maWxsKCk7XHJcbiAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG59XHJcblxyXG5HZWFyLnByb3RvdHlwZS5jb25uZWN0ID0gZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgIHZhciByID0gdGhpcy5yYWRpdXM7XHJcbiAgICB2YXIgZGlzdCA9IGRpc3RhbmNlKHgsIHksIHRoaXMueCwgdGhpcy55KTtcclxuXHJcbiAgICAvLyBUbyBjcmVhdGUgbmV3IGdlYXIgd2UgaGF2ZSB0byBrbm93IHRoZSBudW1iZXIgb2YgaXRzIHRvdXRoXHJcbiAgICB2YXIgbmV3UmFkaXVzID0gTWF0aC5tYXgoZGlzdCAtIHIsIDEwKTtcclxuICAgIHZhciBuZXdEaWFtID0gbmV3UmFkaXVzICogMiAqIE1hdGguUEk7XHJcbiAgICB2YXIgbmV3VGVldGggPSBNYXRoLnJvdW5kKG5ld0RpYW0gLyAoNCAqIHRoaXMuY29ubmVjdGlvblJhZGl1cykpO1xyXG5cclxuICAgIC8vIENhbGN1bGF0ZSB0aGUgQUNUVUFMIHBvc2l0aW9uIGZvciB0aGUgbmV3IGdlYXIsIHRoYXQgd291bGQgYWxsb3cgaXQgdG8gaW50ZXJsb2NrIHdpdGggdGhpcyBnZWFyXHJcbiAgICB2YXIgYWN0dWFsRGlhbWV0ZXIgPSBuZXdUZWV0aCAqIDQgKiB0aGlzLmNvbm5lY3Rpb25SYWRpdXM7XHJcbiAgICB2YXIgYWN0dWFsUmFkaXVzID0gYWN0dWFsRGlhbWV0ZXIgLyAoMiAqIE1hdGguUEkpO1xyXG4gICAgdmFyIGFjdHVhbERpc3QgPSByICsgYWN0dWFsUmFkaXVzOyAvLyBBY3R1YWwgZGlzdGFuY2UgZnJvbSBjZW50ZXIgb2YgdGhpcyBnZWFyXHJcbiAgICB2YXIgYWxwaGEgPSBNYXRoLmF0YW4yKHkgLSB0aGlzLnksIHggLSB0aGlzLngpOyAvLyBBbmdsZSBiZXR3ZWVuIGNlbnRlciBvZiB0aGlzIGdlYXIgYW5kICh4LHkpXHJcbiAgICB2YXIgYWN0dWFsWCA9IHRoaXMueCArIE1hdGguY29zKGFscGhhKSAqIGFjdHVhbERpc3Q7IFxyXG4gICAgdmFyIGFjdHVhbFkgPSB0aGlzLnkgKyBNYXRoLnNpbihhbHBoYSkgKiBhY3R1YWxEaXN0O1xyXG5cclxuICAgIC8vIE1ha2UgbmV3IGdlYXJcclxuICAgIHZhciBuZXdHZWFyID0gbmV3IEdlYXIoYWN0dWFsWCwgYWN0dWFsWSwgdGhpcy5jb25uZWN0aW9uUmFkaXVzLCBuZXdUZWV0aCwgdGhpcy5maWxsU3R5bGUsIHRoaXMuc3Ryb2tlU3R5bGUpO1xyXG5cclxuICAgIC8vIEFkanVzdCBuZXcgZ2VhcidzIHJvdGF0aW9uIHRvIGJlIGluIGRpcmVjdGlvbiBvcG9zaXRlIHRvIHRoZSBvcmlnaW5hbFxyXG4gICAgdmFyIGdlYXJSYXRpbyA9IHRoaXMudGVldGggLyBuZXdUZWV0aDtcclxuICAgIG5ld0dlYXIuYW5ndWxhclNwZWVkID0gLXRoaXMuYW5ndWxhclNwZWVkICogZ2VhclJhdGlvO1xyXG5cclxuICAgIC8vIEF0IHRpbWUgdD0wLCByb3RhdGUgdGhpcyBnZWFyIHRvIGJlIGF0IGFuZ2xlIEFscGhhXHJcbiAgICB0aGlzLnBoaTAgPSBhbHBoYSArICh0aGlzLnBoaTAgLSBhbHBoYSk7IC8vID0gdGhpcy5waGkwLCBkb2VzIG5vdGhpbmcsIGZvciBkZW1vbnN0cmF0aW9uIHB1cnBvc2VzIG9ubHlcclxuICAgIG5ld0dlYXIucGhpMCA9IGFscGhhICsgTWF0aC5QSSArIChNYXRoLlBJIC8gbmV3VGVldGgpICsgKHRoaXMucGhpMCAtIGFscGhhKSAqIChuZXdHZWFyLmFuZ3VsYXJTcGVlZCAvIHRoaXMuYW5ndWxhclNwZWVkKTtcclxuICAgIC8vIEF0IHRoZSBzYW1lIHRpbWUgKHQ9MCksIHJvdGF0ZSB0aGUgbmV3IGdlYXIgdG8gYmUgYXQgKDE4MCAtIEFscGhhKSwgZmFjaW5nIHRoZSBmaXJzdCBnZWFyLFxyXG4gICAgLy8gQW5kIGFkZCBhIGhhbGYgZ2VhciByb3RhdGlvbiB0byBtYWtlIHRoZSB0ZWV0aCBpbnRlcmxvY2tcclxuICAgIG5ld0dlYXIuY3JlYXRlZEF0ID0gdGhpcy5jcmVhdGVkQXQ7IC8vIEFsc28sIHN5bmNyb25pemUgdGhlaXIgY2xvY2tzXHJcblxyXG5cclxuICAgIHJldHVybiBuZXdHZWFyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlYXI7IiwidmFyIHRyaWcgPSByZXF1aXJlKCcuL3RyaWdvbm9taWNVdGlscy5qcycpLnRyaWdvbm9taWNVdGlscztcclxudmFyIHR3b1BpID0gdHJpZy50d29QaTtcclxubGV0IG1hdGhVdGlscyA9IHJlcXVpcmUoJy4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzO1xyXG5sZXQgZWFzaW5nID0gcmVxdWlyZSgnLi9lYXNpbmcuanMnKS5lYXNpbmdFcXVhdGlvbnM7XHJcbmxldCByYW5kID0gbWF0aFV0aWxzLnJhbmRvbTtcclxubGV0IHJhbmRJID0gbWF0aFV0aWxzLnJhbmRvbUludGVnZXI7XHJcbmxldCBtQ29zID0gTWF0aC5jb3M7XHJcbmxldCBtU2luID0gTWF0aC5zaW47XHJcblxyXG52YXIgbnVtRmxhcmVzID0gcmFuZEkoIDMwLCA2MCApO1xyXG52YXIgZmxhcmVTaXplQXJyID0gW107XHJcblxyXG5mb3IgKHZhciBpID0gbnVtRmxhcmVzIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuXHJcbiAgICBsZXQgcmFuZG9tUmFuZG9taXNlciA9IHJhbmRJKCAwLCAxMDAgKTtcclxuICAgIGxldCBzbWFsbFRocmVzaG9sZCA9IG51bUZsYXJlcyA8IDMwID8gNjAgOiA3NTtcclxuICAgIGxldCBtaW4gPSByYW5kb21SYW5kb21pc2VyIDwgNTAgPyAxNSA6IDE1O1xyXG4gICAgbGV0IG1heCA9IHJhbmRvbVJhbmRvbWlzZXIgPCA1MCA/IDEyMCA6IDE4MDtcclxuXHJcbiAgICBmbGFyZVNpemVBcnIucHVzaChcclxuICAgICAgICByYW5kSSggbWluLCBtYXggKVxyXG4gICAgKTtcclxufVxyXG5cclxudmFyIGxlbnNGbGFyZSA9IHtcclxuICAgIGNvbmZpZzoge1xyXG4gICAgICAgIGNvdW50OiBudW1GbGFyZXMsXHJcbiAgICAgICAgc2l6ZUFycjogZmxhcmVTaXplQXJyLFxyXG4gICAgICAgIGZsYXJlQXJyOiBbXSxcclxuICAgICAgICBibHVyOiAwXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyZXJzOiB7XHJcbiAgICAgICAgcmVuZGVyOiB7XHJcbiAgICAgICAgICAgIGNhbnZhczogbnVsbCxcclxuICAgICAgICAgICAgY3R4OiBudWxsLFxyXG4gICAgICAgICAgICB3OiAyMDAwLFxyXG4gICAgICAgICAgICBoOiAyMDAwLFxyXG4gICAgICAgICAgICBkWDogMCxcclxuICAgICAgICAgICAgZFk6IDAsXHJcbiAgICAgICAgICAgIHRvdFRhbGxlc3Q6IDAsXHJcbiAgICAgICAgICAgIGNvbXBvc2l0ZUFyZWE6IHtcclxuICAgICAgICAgICAgICAgIHg6IDAsIHk6IDAsIHc6IDAsIGg6IDBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGlzcGxheToge1xyXG4gICAgICAgICAgICBjYW52YXM6IG51bGwsXHJcbiAgICAgICAgICAgIGN0eDogbnVsbCxcclxuICAgICAgICAgICAgeDogMCwgeTogMCwgdzogMCwgaDogMCwgYTogMCwgZDogMFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc2V0UmVuZGVyZXJFbGVtZW50czogZnVuY3Rpb24oIHJlbmRlck9wdHMsIGRpc3BsYXlPcHRzICkge1xyXG4gICAgICAgIGxldCByZW5kZXJDZmcgPSB0aGlzLnJlbmRlcmVycy5yZW5kZXI7XHJcbiAgICAgICAgbGV0IGRpc3BsYXlDZmcgPSB0aGlzLnJlbmRlcmVycy5kaXNwbGF5O1xyXG5cclxuICAgICAgICByZW5kZXJDZmcuY2FudmFzID0gcmVuZGVyT3B0cy5jYW52YXM7XHJcbiAgICAgICAgcmVuZGVyQ2ZnLmN0eCA9IHJlbmRlck9wdHMuY3R4O1xyXG4gICAgICAgIHJlbmRlckNmZy5jYW52YXMud2lkdGggPSByZW5kZXJDZmcudztcclxuICAgICAgICByZW5kZXJDZmcuY2FudmFzLmhlaWdodCA9IHJlbmRlckNmZy5oO1xyXG5cclxuICAgICAgICBkaXNwbGF5Q2ZnLmNhbnZhcyA9IGRpc3BsYXlPcHRzLmNhbnZhcztcclxuICAgICAgICBkaXNwbGF5Q2ZnLmN0eCA9IGRpc3BsYXlPcHRzLmN0eDtcclxuICAgICAgICBkaXNwbGF5Q2ZnLncgPSBkaXNwbGF5Q2ZnLmNhbnZhcy53aWR0aDtcclxuICAgICAgICBkaXNwbGF5Q2ZnLmggPSBkaXNwbGF5Q2ZnLmNhbnZhcy5oZWlnaHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldERpc3BsYXlQcm9wczogZnVuY3Rpb24oIG9yaWdpblgsIG9yaWdpblksIG9yaWdpblIsIG9yaWdpbkEgKSB7XHJcbiAgICAgICAgbGV0IGRpc3BsYXlDZmcgPSB0aGlzLnJlbmRlcmVycy5kaXNwbGF5O1xyXG5cclxuICAgICAgICBkaXNwbGF5Q2ZnLnggPSBvcmlnaW5YO1xyXG4gICAgICAgIGRpc3BsYXlDZmcueSA9IG9yaWdpblk7XHJcbiAgICAgICAgZGlzcGxheUNmZy5hID0gb3JpZ2luQTtcclxuICAgICAgICBkaXNwbGF5Q2ZnLm1heEQgPSB0cmlnLmRpc3QoIC0oIG9yaWdpblIgKiAyICksIC0oIG9yaWdpblIgKiAyICksIGRpc3BsYXlDZmcudyArICggb3JpZ2luUiAqIDIgKSwgZGlzcGxheUNmZy5oICsgKCBvcmlnaW5SICogMiApICk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnZGlzcGxheUNmZy5tYXhEOiAnLCBkaXNwbGF5Q2ZnLm1heEQgKTtcclxuICAgICAgICBkaXNwbGF5Q2ZnLmQgPSAoIHRyaWcuZGlzdCggb3JpZ2luWCwgb3JpZ2luWSwgZGlzcGxheUNmZy53IC8gMiwgZGlzcGxheUNmZy5oIC8gMiApICkgKiAzO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnZGlzcGxheUNmZy5kOiAnLCBkaXNwbGF5Q2ZnLmQgKTtcclxuICAgICAgICBkaXNwbGF5Q2ZnLnNjYWxlID0gZGlzcGxheUNmZy5kIC8gZGlzcGxheUNmZy5tYXhEO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnZGlzcGxheUNmZy5zY2FsZTogJywgZGlzcGxheUNmZy5zY2FsZSApO1xyXG4gICAgfSxcclxuXHJcbiAgICBjcmVhdGVGbGFyZUNvbmZpZ3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBjZmcgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGNmZy5jb3VudCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdGhpc1R5cGVSYW5kb21pc2VyID0gcmFuZEkoIDAsIDEwMCApO1xyXG4gICAgICAgICAgICBsZXQgdGhpc1R5cGUgPSB0aGlzVHlwZVJhbmRvbWlzZXIgPCAxMCA/ICdzcG90U2hpbmUnIDogdGhpc1R5cGVSYW5kb21pc2VyIDwgNTUgPyAncG9seScgOiAnY2lyY2xlJztcclxuXHJcbiAgICAgICAgICAgIGxldCBjb2xSYW5kID0gcmFuZEkoIDAsIDEwMCApO1xyXG5cclxuICAgICAgICAgICAgbGV0IHIgPSBjb2xSYW5kIDwgNTAgPyAyNTUgOiBjb2xSYW5kIDwgNjAgPyAyNTUgOiBjb2xSYW5kIDwgODAgPyAyMDAgOiAyMDA7XHJcbiAgICAgICAgICAgIGxldCBnID0gY29sUmFuZCA8IDUwID8gMjU1IDogY29sUmFuZCA8IDYwID8gMjAwIDogY29sUmFuZCA8IDgwID8gMjU1IDogMjU1O1xyXG4gICAgICAgICAgICBsZXQgYiA9IGNvbFJhbmQgPCA1MCA/IDI1NSA6IGNvbFJhbmQgPCA2MCA/IDIwMCA6IGNvbFJhbmQgPCA4MCA/IDIwMCA6IDI1NTtcclxuXHJcbiAgICAgICAgICAgIGxldCB0aGlzRmxhcmUgPSB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHI6IHIsXHJcbiAgICAgICAgICAgICAgICAgICAgZzogZyxcclxuICAgICAgICAgICAgICAgICAgICBiOiBiXHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXNUeXBlXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggdGhpc1R5cGUgPT09ICdzcG90U2hpbmUnICkge1xyXG4gICAgICAgICAgICAgICAgdGhpc0ZsYXJlLmNvbG9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHI6IDI1NSwgZzogMjU1LCBiOiAyNTVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpc0ZsYXJlLnNpemUgPSB0aGlzRmxhcmUudHlwZSA9PT0gJ3Nwb3RTaGluZScgPyByYW5kSSggNDAsIDgwICkgOiBjZmcuc2l6ZUFyclsgaSBdO1xyXG5cclxuICAgICAgICAgICAgdGhpc0ZsYXJlLmQgPSB0aGlzRmxhcmUudHlwZSA9PT0gJ3Nwb3RTaGluZScgPyBwYXJzZUZsb2F0KCByYW5kKCAwLjMsIDEgKS50b0ZpeGVkKCAyICkgKSA6IHBhcnNlRmxvYXQoIHJhbmQoIDAsIDEgKS50b0ZpeGVkKCAyICkgKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXNGbGFyZS5oUmFuZCA9IHBhcnNlRmxvYXQoIHJhbmQoIDEsIDIgKS50b0ZpeGVkKCAyICkgKTtcclxuICAgICAgICAgICAgY2ZnLmZsYXJlQXJyLnB1c2goIHRoaXNGbGFyZSApO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcmVuZGVyQ2lyY2xlRmxhcmU6IGZ1bmN0aW9uKCB4LCB5LCBjZmcgKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGMgPSB0aGlzLnJlbmRlcmVycy5yZW5kZXIuY3R4O1xyXG4gICAgICAgIGxldCBiYXNlQ2ZnID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgbGV0IGZsYXJlQ2ZnID0gY2ZnO1xyXG4gICAgICAgIGxldCBmbGFyZVJhbmRvbWlzZXIgPSByYW5kSSggMCwgMTAwICk7XHJcbiAgICAgICAgbGV0IGZsYXJlUmFuZG9tU2hpZnQgPSByYW5kSSggMjAsIDQwICk7XHJcbiAgICAgICAgbGV0IGZsYXJlUmFuZG9tRWRnZSA9IHJhbmRJKCAwLCAxMCApO1xyXG4gICAgICAgIGxldCByYW5kb21GaWxsID0gcmFuZEkoIDAsIDEwMCApIDwgMjAgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgbGV0IGdyYWQgPSBjLmNyZWF0ZVJhZGlhbEdyYWRpZW50KCAwIC0gKCBmbGFyZVJhbmRvbVNoaWZ0ICogMyApLCAwLCAwLCAwLCAwLCBmbGFyZUNmZy5zaXplICk7XHJcbiAgICAgICAgbGV0IHJnYkNvbG9yU3RyaW5nID0gYCR7IGZsYXJlQ2ZnLmNvbG9yLnIgfSwgJHsgZmxhcmVDZmcuY29sb3IuZyB9LCAkeyBmbGFyZUNmZy5jb2xvci5iIH0sIGA7XHJcblxyXG4gICAgICAgICAgICAvLyBncmFkLmFkZENvbG9yU3RvcCggMCwgYHJnYmEoICR7IHJnYkNvbG9yU3RyaW5nIH0gMC42IClgICk7XHJcbiAgICAgICAgICAgIC8vIGdyYWQuYWRkQ29sb3JTdG9wKCAwLjcsICBgcmdiYSggJHsgcmdiQ29sb3JTdHJpbmcgfSAwLjggKWAgKTtcclxuICAgICAgICAgICAgLy8gZ3JhZC5hZGRDb2xvclN0b3AoIDEsICBgcmdiYSggJHsgcmdiQ29sb3JTdHJpbmcgfSAwLjcgKWAgKTtcclxuXHJcbiAgICAgICAgaWYgKCBmbGFyZVJhbmRvbUVkZ2UgPiA1ICkge1xyXG4gICAgICAgICAgICBpZiAoIHJhbmRvbUZpbGwgPT09IHRydWUgKSB7XHJcbiAgICAgICAgICAgICAgICBncmFkLmFkZENvbG9yU3RvcCggMCwgIGByZ2JhKCAkeyByZ2JDb2xvclN0cmluZyB9IDAuMSApYCApO1xyXG4gICAgICAgICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoIDAuOTUsIGByZ2JhKCAkeyByZ2JDb2xvclN0cmluZyB9IDAuMiApYCApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoIDAsICBgcmdiYSggJHsgcmdiQ29sb3JTdHJpbmcgfSAwIClgICk7XHJcbiAgICAgICAgICAgICAgICBncmFkLmFkZENvbG9yU3RvcCggMC44LCAgYHJnYmEoICR7IHJnYkNvbG9yU3RyaW5nIH0gMCApYCApO1xyXG4gICAgICAgICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoIDAuOTUsIGByZ2JhKCAkeyByZ2JDb2xvclN0cmluZyB9IDAuMiApYCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBncmFkLmFkZENvbG9yU3RvcCggMC45NywgYHJnYmEoICR7IHJnYkNvbG9yU3RyaW5nIH0gMC44IClgICk7XHJcbiAgICAgICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKCAwLjk5LCBgcmdiYSggJHsgcmdiQ29sb3JTdHJpbmcgfSAwLjMgKWAgKTtcclxuICAgICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoIDEsIGByZ2JhKCAkeyByZ2JDb2xvclN0cmluZyB9IDAgKWAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBncmFkLmFkZENvbG9yU3RvcCggMCwgIGByZ2JhKCAkeyByZ2JDb2xvclN0cmluZyB9IDAuMiApYCApO1xyXG4gICAgICAgICAgICBncmFkLmFkZENvbG9yU3RvcCggMSwgYHJnYmEoICR7IHJnYkNvbG9yU3RyaW5nIH0gMC4zIClgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICBjLmZpbGxTdHlsZSA9IGdyYWQ7IFxyXG4gICAgICAgIGMuZmlsbENpcmNsZSggMCwgMCwgZmxhcmVDZmcuc2l6ZSApO1xyXG4gICAgICAgIGMuZmlsbCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICByZW5kZXJTcG90RmxhcmU6IGZ1bmN0aW9uKCB4LCB5LCBjZmcgKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGMgPSB0aGlzLnJlbmRlcmVycy5yZW5kZXIuY3R4O1xyXG4gICAgICAgIGxldCBmbGFyZUNmZyA9IGNmZztcclxuICAgICAgICBsZXQgcmdiQ29sb3JTdHJpbmcgPSBgJHsgZmxhcmVDZmcuY29sb3IuciB9LCAkeyBmbGFyZUNmZy5jb2xvci5nIH0sICR7IGZsYXJlQ2ZnLmNvbG9yLmIgfSwgYDtcclxuXHJcbiAgICAgICAgbGV0IGdyYWQgPSBjLmNyZWF0ZVJhZGlhbEdyYWRpZW50KCAwLCAwLCAwLCAwLCAwLCBmbGFyZUNmZy5zaXplICk7XHJcbiAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoIDAsICBgcmdiYSggJHsgcmdiQ29sb3JTdHJpbmcgfSAxIClgICk7XHJcbiAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoIDAuMiwgIGByZ2JhKCAkeyByZ2JDb2xvclN0cmluZyB9IDEgKWAgKTtcclxuICAgICAgICBncmFkLmFkZENvbG9yU3RvcCggMC40LCAgYHJnYmEoICR7IHJnYkNvbG9yU3RyaW5nIH0gMC4xIClgICk7XHJcbiAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoIDEsICBgcmdiYSggJHsgcmdiQ29sb3JTdHJpbmcgfSAwIClgICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYy5maWxsU3R5bGUgPSBncmFkOyBcclxuICAgICAgICBjLmZpbGxDaXJjbGUoIDAsIDAsIGZsYXJlQ2ZnLnNpemUgKTtcclxuICAgICAgICBjLmZpbGwoKTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVuZGVyUG9seUZsYXJlOiBmdW5jdGlvbiggeCwgeSwgY2ZnICkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBjID0gdGhpcy5yZW5kZXJlcnMucmVuZGVyLmN0eDtcclxuICAgICAgICBsZXQgZmxhcmVDZmcgPSBjZmc7XHJcbiAgICAgICAgbGV0IGZsYXJlU2l6ZSA9IGZsYXJlQ2ZnLnNpemU7XHJcbiAgICAgICAgbGV0IGZsYXJlUmFuZG9tU2hpZnQgPSByYW5kSSggMCwgNDAgKTtcclxuXHJcbiAgICAgICAgbGV0IGZsYXJlUmFuZG9tRWRnZSA9IHJhbmRJKCAwLCAxMCApO1xyXG5cclxuICAgICAgICBsZXQgcmdiQ29sb3JTdHJpbmcgPSBgJHsgZmxhcmVDZmcuY29sb3IuciB9LCAkeyBmbGFyZUNmZy5jb2xvci5nIH0sICR7IGZsYXJlQ2ZnLmNvbG9yLmIgfSwgYDtcclxuXHJcbiAgICAgICAgbGV0IGdyYWQgPSBjLmNyZWF0ZVJhZGlhbEdyYWRpZW50KCAwLCAwLCAwLCAwLCAwLCBmbGFyZUNmZy5zaXplICk7XHJcbiAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoIDAsICBgcmdiYSggJHsgcmdiQ29sb3JTdHJpbmcgfSAwLjEgKWAgKTtcclxuICAgICAgICBncmFkLmFkZENvbG9yU3RvcCggMSwgIGByZ2JhKCAkeyByZ2JDb2xvclN0cmluZyB9IDAuMiApYCApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzaWRlcyA9IDg7XHJcblxyXG4gICAgICAgIGMuc2F2ZSgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGMuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaWRlczsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBhbHBoYSA9IHR3b1BpICogKCBpIC8gc2lkZXMgKTtcclxuICAgICAgICAgICAgaWYgKCBpID09PSAwICkge1xyXG4gICAgICAgICAgICAgICAgYy5tb3ZlVG8oIG1Db3MoIGFscGhhICkgKiBmbGFyZVNpemUsIG1TaW4oIGFscGhhICkgKiBmbGFyZVNpemUgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGMubGluZVRvKCBtQ29zKCBhbHBoYSApICogZmxhcmVTaXplLCBtU2luKCBhbHBoYSApICogZmxhcmVTaXplICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgYy5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjLmNsaXAoKTtcclxuXHJcbiAgICAgICAgYy5iZWdpblBhdGgoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpZGVzOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGFscGhhID0gdHdvUGkgKiAoIGkgLyBzaWRlcyApO1xyXG4gICAgICAgICAgICBpZiAoIGkgPT09IDAgKSB7XHJcbiAgICAgICAgICAgICAgICBjLm1vdmVUbyggbUNvcyggYWxwaGEgKSAqIGZsYXJlU2l6ZSwgbVNpbiggYWxwaGEgKSAqIGZsYXJlU2l6ZSApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYy5saW5lVG8oIG1Db3MoIGFscGhhICkgKiBmbGFyZVNpemUsIG1TaW4oIGFscGhhICkgKiBmbGFyZVNpemUgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjLmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgICBjLmZpbGxTdHlsZSA9IGdyYWQ7IFxyXG4gICAgICAgIGMuZmlsbCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGMudHJhbnNsYXRlKCAwLCAtMTAwMDAwICk7XHJcbiAgICAgICAgYy5iZWdpblBhdGgoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpZGVzOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGFscGhhID0gdHdvUGkgKiAoIGkgLyBzaWRlcyApO1xyXG4gICAgICAgICAgICBpZiAoIGkgPT09IDAgKSB7XHJcbiAgICAgICAgICAgICAgICBjLm1vdmVUbyggbUNvcyggYWxwaGEgKSAqIGZsYXJlU2l6ZSwgbVNpbiggYWxwaGEgKSAqIGZsYXJlU2l6ZSApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYy5saW5lVG8oIG1Db3MoIGFscGhhICkgKiBmbGFyZVNpemUsIG1TaW4oIGFscGhhICkgKiBmbGFyZVNpemUgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjLmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGZsYXJlUmFuZG9tU2hpZnQgPSByYW5kSSggMCwgNSApO1xyXG4gICAgICAgIGMuc3Ryb2tlU3R5bGUgPSAncmVkJztcclxuICAgICAgICBjLnNoYWRvd0NvbG9yID0gYHJnYmEoICR7IHJnYkNvbG9yU3RyaW5nIH0gMSApYDtcclxuICAgICAgICBjLnNoYWRvd0JsdXIgPSA0MDtcclxuICAgICAgICBjLnNoYWRvd09mZnNldFggPSAwIC0gZmxhcmVSYW5kb21TaGlmdDtcclxuICAgICAgICBjLnNoYWRvd09mZnNldFkgPSAxMDAwMDA7XHJcbiAgICAgICAgYy5saW5lV2lkdGggPSAxMDtcclxuICAgICAgICBjLnN0cm9rZSgpO1xyXG4gICAgICAgIGMuc2hhZG93Qmx1ciA9IDA7XHJcblxyXG4gICAgICAgIGlmICggZmxhcmVSYW5kb21FZGdlID4gNSApIHtcclxuICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaWRlczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWxwaGEgPSB0d29QaSAqICggaSAvIHNpZGVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIGkgPT09IDAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYy5tb3ZlVG8oIG1Db3MoIGFscGhhICkgKiBmbGFyZVNpemUsIG1TaW4oIGFscGhhICkgKiBmbGFyZVNpemUgKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYy5saW5lVG8oIG1Db3MoIGFscGhhICkgKiBmbGFyZVNpemUsIG1TaW4oIGFscGhhICkgKiBmbGFyZVNpemUgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjLmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICBjLnN0cm9rZVN0eWxlID0gJ3JlZCc7XHJcbiAgICAgICAgICAgIGMuc2hhZG93Q29sb3IgPSBgcmdiYSggJHsgcmdiQ29sb3JTdHJpbmcgfSAxIClgO1xyXG4gICAgICAgICAgICBjLnNoYWRvd0JsdXIgPSAzO1xyXG4gICAgICAgICAgICBjLnNoYWRvd09mZnNldFggPSAwIC0gZmxhcmVSYW5kb21TaGlmdDtcclxuICAgICAgICAgICAgYy5zaGFkb3dPZmZzZXRZID0gMTAwMDAwO1xyXG4gICAgICAgICAgICBjLmxpbmVXaWR0aCA9IDI7XHJcbiAgICAgICAgICAgIGMuc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGMuc2hhZG93Qmx1ciA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjLnRyYW5zbGF0ZSggMCwgMTAwMDAwICk7XHJcblxyXG4gICAgICAgIGMucmVzdG9yZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRDbGVhbkNvb3JkczogZnVuY3Rpb24oIGZsYXJlICkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCByZW5kZXJDZmcgPSB0aGlzLnJlbmRlcmVyLnJlbmRlcjtcclxuICAgICAgICBsZXQgYmx1ciA9IHRoaXMuY29uZmlnLmJsdXI7XHJcbiAgICAgICAgbGV0IGJsdXIyID0gYmx1ciAqIDI7XHJcbiAgICAgICAgbGV0IGZsYXJlUyA9IGZsYXJlLnNpemU7XHJcbiAgICAgICAgbGV0IGZsYXJlUzIgPSBmbGFyZVMgKiAyO1xyXG4gICAgICAgIGxldCB0b3RhbFMgPSBmbGFyZVMyICsgYmx1cjI7XHJcbiAgICAgICAgbGV0IGNsZWFuWCA9IHJlbmRlckNmZy5kWDtcclxuICAgICAgICBsZXQgY2xlYW5ZID0gcmVuZGVyQ2ZnLmRZO1xyXG4gICAgfSxcclxuXHJcbiAgICByZW5kZXJGbGFyZXM6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBsZXQgYmFzZUNmZyA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgIGxldCByZW5kZXJlciA9IHRoaXMucmVuZGVyZXJzLnJlbmRlcjtcclxuICAgICAgICBsZXQgY29tcG9zaXRlQXJlYSA9IHJlbmRlcmVyLmNvbXBvc2l0ZUFyZWE7XHJcbiAgICAgICAgbGV0IGMgPSByZW5kZXJlci5jdHg7XHJcbiAgICAgICAgbGV0IGNXID0gcmVuZGVyZXIudztcclxuICAgICAgICBsZXQgY0ggPSByZW5kZXJlci5oO1xyXG4gICAgICAgIGxldCBmbGFyZUNvdW50ID0gYmFzZUNmZy5jb3VudDtcclxuICAgICAgICBsZXQgZmxhcmVzID0gYmFzZUNmZy5mbGFyZUFycjtcclxuICAgICAgICBsZXQgYmx1ciA9IGJhc2VDZmcuYmx1cjtcclxuICAgICAgICBsZXQgYmx1cjIgPSBibHVyICogMjtcclxuXHJcbiAgICAgICAgbGV0IGN1cnJYID0gMDtcclxuICAgICAgICBsZXQgY3VyclkgPSAwO1xyXG4gICAgICAgIGxldCBjdXJyVGFsbGVzdCA9IDA7XHJcblxyXG4gICAgICAgIGxldCBibHVyU3RyID0gJ2JsdXIoJytibHVyLnRvU3RyaW5nKCkrJ3B4KSc7XHJcbiAgICAgICAgYy5maWx0ZXIgPSBibHVyU3RyO1xyXG4gICAgICAgIGxldCBwb2x5Q291bnQgPSAwO1xyXG5cclxuICAgICAgICAvLyBzb3J0IGZsYXJlcyBiYXNlZCBvbiBzaXplIC0gZGVjZW5kaW5nIG9yZGVyIHRvIG1hcCB0byByZXZlcnNlIEZPUiBsb29wICggc28gbG9vcCBzdGFydHMgd2l0aCBzbWFsbGVzdCApIFxyXG4gICAgICAgIGZsYXJlcy5zb3J0KCBmdW5jdGlvbiggYSwgYiApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBiLnNpemUgLSBhLnNpemVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSBmbGFyZUNvdW50IC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB0aGlzRmxhcmUgPSBmbGFyZXNbIGkgXTtcclxuICAgICAgICAgICAgbGV0IGZsYXJlU2l6ZSA9IHRoaXNGbGFyZS5zaXplO1xyXG4gICAgICAgICAgICBsZXQgZmxhcmVTaXplMiA9IGZsYXJlU2l6ZSAqIDI7XHJcbiAgICAgICAgICAgIGxldCB0b3RhbEZsYXJlVyA9IGZsYXJlU2l6ZTIgKyBibHVyMjtcclxuICAgICAgICAgICAgbGV0IHRvdGFsRmxhcmVIID0gZmxhcmVTaXplMiArIGJsdXIyO1xyXG5cclxuICAgICAgICAgICAgdG90YWxGbGFyZUggPiBjdXJyVGFsbGVzdCA/IGN1cnJUYWxsZXN0ID0gdG90YWxGbGFyZUggOiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmICggY3VyclggKyB0b3RhbEZsYXJlVyArIGJsdXIgPiBjVyApIHtcclxuICAgICAgICAgICAgICAgIGN1cnJYID0gMDtcclxuICAgICAgICAgICAgICAgIGN1cnJZICs9IGN1cnJUYWxsZXN0O1xyXG4gICAgICAgICAgICAgICAgY3VyclRhbGxlc3QgPSB0b3RhbEZsYXJlSDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHRyYW5zWCA9IGN1cnJYICsgZmxhcmVTaXplICsgYmx1cjtcclxuICAgICAgICAgICAgbGV0IHRyYW5zWSA9IGN1cnJZICsgZmxhcmVTaXplICsgYmx1cjtcclxuXHJcbiAgICAgICAgICAgIGMudHJhbnNsYXRlKCB0cmFuc1gsIHRyYW5zWSApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCB0aGlzRmxhcmUudHlwZSA9PT0gJ3Nwb3RTaGluZScgKSB7XHJcbiAgICAgICAgICAgICAgICBjLmdsb2JhbEFscGhhID0gMTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyU3BvdEZsYXJlKCAwLCAwLCB0aGlzRmxhcmUgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCB0aGlzRmxhcmUudHlwZSA9PT0gJ3BvbHknICkge1xyXG4gICAgICAgICAgICAgICAgYy5nbG9iYWxBbHBoYSA9IDE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclBvbHlGbGFyZSggMCwgMCwgdGhpc0ZsYXJlICk7XHJcbiAgICAgICAgICAgICAgICBjLmdsb2JhbEFscGhhID0gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCB0aGlzRmxhcmUudHlwZSA9PT0gJ2NpcmNsZScgKSB7XHJcbiAgICAgICAgICAgICAgICBjLmdsb2JhbEFscGhhID0gcGFyc2VGbG9hdCggcmFuZCggMC41LCAxICkudG9GaXhlZCggMiApICk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckNpcmNsZUZsYXJlKCAwLCAwLCB0aGlzRmxhcmUgKTtcclxuICAgICAgICAgICAgICAgIGMuZ2xvYmFsQWxwaGEgPSAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gYy5zdHJva2VTdHlsZSA9ICdyZWQnO1xyXG4gICAgICAgICAgICAvLyBjLmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgICAgICAgIC8vIGMuc3Ryb2tlUmVjdCggLSggZmxhcmVTaXplICsgYmx1ciApLCAtKCBmbGFyZVNpemUgKyBibHVyICksIHRvdGFsRmxhcmVXLCB0b3RhbEZsYXJlSCApO1xyXG4gICAgICAgICAgICAvLyBjLnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAgICAgYy50cmFuc2xhdGUoIC10cmFuc1gsIC10cmFuc1kgKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXNGbGFyZS5yZW5kZXJDZmcgPSB7XHJcbiAgICAgICAgICAgICAgICB4OiBjdXJyWCxcclxuICAgICAgICAgICAgICAgIHk6IGN1cnJZLFxyXG4gICAgICAgICAgICAgICAgdzogdG90YWxGbGFyZVcsXHJcblxyXG4gICAgICAgICAgICAgICAgaDogdG90YWxGbGFyZUhcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY3VyclggKz0gdG90YWxGbGFyZVc7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGkgPT09IDAgKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wb3NpdGVBcmVhLnggPSAwO1xyXG4gICAgICAgICAgICAgICAgY29tcG9zaXRlQXJlYS55ID0gY3VyclkgKyB0b3RhbEZsYXJlSDtcclxuICAgICAgICAgICAgICAgIGNvbXBvc2l0ZUFyZWEudyA9IGNXO1xyXG4gICAgICAgICAgICAgICAgY29tcG9zaXRlQXJlYS5oID0gdG90YWxGbGFyZUg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjLmZpbHRlciA9ICdibHVyKDBweCknO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgZGlzcGxheUZsYXJlczogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGxldCBiYXNlQ2ZnID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgbGV0IHJlbmRlckMgPSB0aGlzLnJlbmRlcmVycy5yZW5kZXIuY2FudmFzO1xyXG4gICAgICAgIGxldCBkaXNwbGF5Q2ZnID0gdGhpcy5yZW5kZXJlcnMuZGlzcGxheTtcclxuICAgICAgICBsZXQgYyA9IGRpc3BsYXlDZmcuY3R4O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBmbGFyZUNvdW50ID0gYmFzZUNmZy5jb3VudDtcclxuICAgICAgICBsZXQgZmxhcmVzID0gYmFzZUNmZy5mbGFyZUFycjtcclxuXHJcbiAgICAgICAgbGV0IHNjYWxlID0gZGlzcGxheUNmZy5zY2FsZTtcclxuXHJcbiAgICAgICAgYy5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnbGlnaHRlbic7XHJcblxyXG4gICAgICAgIGMudHJhbnNsYXRlKCBkaXNwbGF5Q2ZnLngsIGRpc3BsYXlDZmcueSApO1xyXG4gICAgICAgIGMucm90YXRlKCBkaXNwbGF5Q2ZnLmEgKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGZsYXJlQ291bnQgLSAxOyBpID49IDA7IGktLSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHRoaXNGbGFyZSA9IGZsYXJlc1sgaSBdO1xyXG4gICAgICAgICAgICBsZXQgdGhpc0ZsYXJlQ2ZnID0gdGhpc0ZsYXJlLnJlbmRlckNmZztcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coICd0aGlzRmxhcmVDZmc6ICcsIHRoaXNGbGFyZUNmZyApO1xyXG4gICAgICAgICAgICBsZXQgc2NhbGVkQ29vcmRzID0gKCB0aGlzRmxhcmVDZmcudyAvIDIgKSAqIHNjYWxlO1xyXG4gICAgICAgICAgICBsZXQgc2NhbGVkU2l6ZSA9IHRoaXNGbGFyZUNmZy53ICogc2NhbGU7XHJcbiAgICAgICAgICAgIGxldCBzY2FsZWRYID0gZGlzcGxheUNmZy5kICogdGhpc0ZsYXJlLmQ7XHJcbiAgICAgICAgICAgIGxldCBpbnZlcnNlU2NhbGUgPSAxIC0gKCBzY2FsZWRYIC8gZGlzcGxheUNmZy5kICk7XHJcbiAgICAgICAgICAgIGxldCBzY2FsZU11bHRpcGxpZXIgPSBlYXNpbmcuZWFzZUluQ3ViaWMoIHNjYWxlZFgsIDEsIC0xLCBkaXNwbGF5Q2ZnLmQgKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coICdpbnZlcnNlU2NhbGU6ICcsIGludmVyc2VTY2FsZSk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCAnc2NhbGVkU2l6ZSAqIGludmVyc2VTY2FsZTogJywgc2NhbGVkU2l6ZSAqIGludmVyc2VTY2FsZSApO1xyXG4gICAgICAgICAgICBjLmRyYXdJbWFnZShcclxuICAgICAgICAgICAgICAgIHJlbmRlckMsXHJcbiAgICAgICAgICAgICAgICB0aGlzRmxhcmVDZmcueCwgdGhpc0ZsYXJlQ2ZnLnksIHRoaXNGbGFyZUNmZy53LCB0aGlzRmxhcmVDZmcuaCxcclxuICAgICAgICAgICAgICAgIHNjYWxlZFgsIC1zY2FsZWRDb29yZHMsIHNjYWxlZFNpemUgLyBzY2FsZU11bHRpcGxpZXIgLCBzY2FsZWRTaXplXHJcbiAgICAgICAgICAgICk7XHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGMucm90YXRlKCAtZGlzcGxheUNmZy5hICk7XHJcbiAgICAgICAgYy50cmFuc2xhdGUoIC1kaXNwbGF5Q2ZnLngsIC1kaXNwbGF5Q2ZnLnkgKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXBvc2l0ZUZsYXJlczogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGxldCBiYXNlQ2ZnID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgbGV0IHJlbmRlcmVyID0gdGhpcy5yZW5kZXJlcnMucmVuZGVyO1xyXG4gICAgICAgIGxldCByZW5kZXJDID0gcmVuZGVyZXIuY2FudmFzO1xyXG4gICAgICAgIGxldCByZW5kZXJDdHggPSByZW5kZXJlci5jdHg7XHJcbiAgICAgICAgbGV0IGNvbXBvc2l0ZUFyZWEgPSByZW5kZXJlci5jb21wb3NpdGVBcmVhO1xyXG4gICAgICAgIGxldCBkaXNwbGF5Q2ZnID0gdGhpcy5yZW5kZXJlcnMuZGlzcGxheTtcclxuICAgICAgICBsZXQgZmxhcmVDb3VudCA9IGJhc2VDZmcuY291bnQ7XHJcbiAgICAgICAgbGV0IGZsYXJlcyA9IGJhc2VDZmcuZmxhcmVBcnI7XHJcbiAgICAgICAgbGV0IHNjYWxlID0gZGlzcGxheUNmZy5zY2FsZTtcclxuICAgICAgICBsZXQgdGFsbGVzdEZsYXJlID0gZmxhcmVzWyAwIF0udyAqIHNjYWxlO1xyXG4gICAgICAgIGxldCBzdGFydFBvcyA9IHRhbGxlc3RGbGFyZSAvIDI7XHJcblxyXG4gICAgICAgIHJlbmRlckN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnbGlnaHRlbic7XHJcblxyXG4gICAgICAgIHJlbmRlckN0eC50cmFuc2xhdGUoIHN0YXJ0UG9zLCBjb21wb3NpdGVBcmVhLnkgKyBzdGFydFBvcyApO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gZmxhcmVDb3VudCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdGhpc0ZsYXJlID0gZmxhcmVzWyBpIF07XHJcbiAgICAgICAgICAgIGxldCB0aGlzRmxhcmVDZmcgPSB0aGlzRmxhcmUucmVuZGVyQ2ZnO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyggJ3RoaXNGbGFyZUNmZzogJywgdGhpc0ZsYXJlQ2ZnICk7XHJcbiAgICAgICAgICAgIGxldCBzY2FsZWRDb29yZHMgPSAoIHRoaXNGbGFyZUNmZy53IC8gMiApICogc2NhbGU7XHJcbiAgICAgICAgICAgIGxldCBzY2FsZWRTaXplID0gdGhpc0ZsYXJlQ2ZnLncgKiBzY2FsZTtcclxuICAgICAgICAgICAgbGV0IHNjYWxlZFggPSBkaXNwbGF5Q2ZnLmQgKiB0aGlzRmxhcmUuZDtcclxuICAgICAgICAgICAgbGV0IGludmVyc2VTY2FsZSA9IDEgLSAoIHNjYWxlZFggLyBkaXNwbGF5Q2ZnLmQgKTtcclxuICAgICAgICAgICAgbGV0IHNjYWxlTXVsdGlwbGllciA9IGVhc2luZy5lYXNlSW5DdWJpYyggc2NhbGVkWCwgMSwgLTEsIGRpc3BsYXlDZmcuZCApO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyggJ2ludmVyc2VTY2FsZTogJywgaW52ZXJzZVNjYWxlKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coICdzY2FsZWRTaXplICogaW52ZXJzZVNjYWxlOiAnLCBzY2FsZWRTaXplICogaW52ZXJzZVNjYWxlICk7XHJcbiAgICAgICAgICAgIHJlbmRlckN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgICAgICByZW5kZXJDLFxyXG4gICAgICAgICAgICAgICAgdGhpc0ZsYXJlQ2ZnLngsIHRoaXNGbGFyZUNmZy55LCB0aGlzRmxhcmVDZmcudywgdGhpc0ZsYXJlQ2ZnLmgsXHJcbiAgICAgICAgICAgICAgICBzY2FsZWRYLCAtc2NhbGVkQ29vcmRzLCBzY2FsZWRTaXplIC8gc2NhbGVNdWx0aXBsaWVyICwgc2NhbGVkU2l6ZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcmVuZGVyQ3R4LnRyYW5zbGF0ZSggLXN0YXJ0UG9zLCAtKCBjb21wb3NpdGVBcmVhLnkgK3N0YXJ0UG9zICkgKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGRpc3BsYXlDb21wb3NpdGU6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBsZXQgYmFzZUNmZyA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICBsZXQgcmVuZGVyQyA9IHRoaXMucmVuZGVyZXJzLnJlbmRlci5jYW52YXM7XHJcbiAgICAgICAgbGV0IGNvbXBvc2l0ZUFyZWEgPSB0aGlzLnJlbmRlcmVycy5yZW5kZXIuY29tcG9zaXRlQXJlYTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZGlzcGxheUNmZyA9IHRoaXMucmVuZGVyZXJzLmRpc3BsYXk7XHJcbiAgICAgICAgbGV0IGMgPSBkaXNwbGF5Q2ZnLmN0eDtcclxuXHJcbiAgICAgICAgYy5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnbGlnaHRlbic7XHJcblxyXG4gICAgICAgIGMudHJhbnNsYXRlKCBkaXNwbGF5Q2ZnLngsIGRpc3BsYXlDZmcueSApO1xyXG4gICAgICAgIGMucm90YXRlKCBkaXNwbGF5Q2ZnLmEgKTtcclxuXHJcbiAgICAgICAgYy5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgIHJlbmRlckMsXHJcbiAgICAgICAgICAgIGNvbXBvc2l0ZUFyZWEueCwgY29tcG9zaXRlQXJlYS55LCBjb21wb3NpdGVBcmVhLncsIGNvbXBvc2l0ZUFyZWEuaCxcclxuICAgICAgICAgICAgMCwgLSggY29tcG9zaXRlQXJlYS5oIC8gMiApLCBjb21wb3NpdGVBcmVhLncgLCBjb21wb3NpdGVBcmVhLmhcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjLnJvdGF0ZSggLWRpc3BsYXlDZmcuYSApO1xyXG4gICAgICAgIGMudHJhbnNsYXRlKCAtZGlzcGxheUNmZy54LCAtZGlzcGxheUNmZy55ICk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBjbGVhckNvbXBvc2l0ZUFyZWE6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBsZXQgYyA9IHRoaXMucmVuZGVyZXJzLnJlbmRlci5jdHg7XHJcbiAgICAgICAgbGV0IGNvbXBvc2l0ZUFyZWEgPSB0aGlzLnJlbmRlcmVycy5yZW5kZXIuY29tcG9zaXRlQXJlYTtcclxuXHJcbiAgICAgICAgYy5jbGVhclJlY3QoIGNvbXBvc2l0ZUFyZWEueCwgY29tcG9zaXRlQXJlYS55LCBjb21wb3NpdGVBcmVhLncsIGNvbXBvc2l0ZUFyZWEuaCApO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmNvbXBvc2l0ZUZsYXJlcygpO1xyXG4gICAgICAgIHRoaXMuZGlzcGxheUNvbXBvc2l0ZSgpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJDb21wb3NpdGVBcmVhKCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBmbGFyZUluaXQ6IGZ1bmN0aW9uKCByZW5kZXJPcHRzLCBkaXNwbGF5T3B0cyApIHtcclxuICAgICAgICBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5zZXRSZW5kZXJlckVsZW1lbnRzKCByZW5kZXJPcHRzLCBkaXNwbGF5T3B0cyApO1xyXG4gICAgICAgIHNlbGYuY3JlYXRlRmxhcmVDb25maWdzKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGVuc0ZsYXJlOyIsIi8qKlxyXG4qIHByb3ZpZGVzIG1hdGhzIHV0aWwgbWV0aG9kcy5cclxuKlxyXG4qIEBtaXhpblxyXG4qL1xyXG5cclxudmFyIG1hdGhVdGlscyA9IHtcclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIEdlbmVyYXRlIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gMiB2YWx1ZXMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4gLSBtaW5pbXVtIHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWF4IC0gbWF4aW11bSB2YWx1ZS5cclxuICogQHJldHVybnMge251bWJlcn0gcmVzdWx0LlxyXG4gKi9cclxuXHRyYW5kb21JbnRlZ2VyOiBmdW5jdGlvbiByYW5kb21JbnRlZ2VyKG1pbiwgbWF4KSB7XHJcblx0XHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCArIDEgLSBtaW4pKSArIG1pbjtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIEdlbmVyYXRlIHJhbmRvbSBmbG9hdCBiZXR3ZWVuIDIgdmFsdWVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluIC0gbWluaW11bSB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIG1heGltdW0gdmFsdWUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0cmFuZG9tOiBmdW5jdGlvbiByYW5kb20obWluLCBtYXgpIHtcclxuXHRcdGlmIChtaW4gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRtaW4gPSAwO1xyXG5cdFx0XHRtYXggPSAxO1xyXG5cdFx0fSBlbHNlIGlmIChtYXggPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRtYXggPSBtaW47XHJcblx0XHRcdG1pbiA9IDA7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xyXG5cdH0sXHJcblxyXG5cdGdldFJhbmRvbUFyYml0cmFyeTogZnVuY3Rpb24gZ2V0UmFuZG9tQXJiaXRyYXJ5KG1pbiwgbWF4KSB7XHJcblx0XHRyZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xyXG5cdH0sXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBUcmFuc2Zvcm1zIHZhbHVlIHByb3BvcnRpb25hdGVseSBiZXR3ZWVuIGlucHV0IHJhbmdlIGFuZCBvdXRwdXQgcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIHRoZSB2YWx1ZSBpbiB0aGUgb3JpZ2luIHJhbmdlICggbWluMS9tYXgxICkuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4xIC0gbWluaW11bSB2YWx1ZSBpbiBvcmlnaW4gcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXgxIC0gbWF4aW11bSB2YWx1ZSBpbiBvcmlnaW4gcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4yIC0gbWluaW11bSB2YWx1ZSBpbiBkZXN0aW5hdGlvbiByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heDIgLSBtYXhpbXVtIHZhbHVlIGluIGRlc3RpbmF0aW9uIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2xhbXBSZXN1bHQgLSBjbGFtcCByZXN1bHQgYmV0d2VlbiBkZXN0aW5hdGlvbiByYW5nZSBib3VuZGFyeXMuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0bWFwOiBmdW5jdGlvbiBtYXAodmFsdWUsIG1pbjEsIG1heDEsIG1pbjIsIG1heDIsIGNsYW1wUmVzdWx0KSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgcmV0dXJudmFsdWUgPSAodmFsdWUgLSBtaW4xKSAvIChtYXgxIC0gbWluMSkgKiAobWF4MiAtIG1pbjIpICsgbWluMjtcclxuXHRcdGlmIChjbGFtcFJlc3VsdCkgcmV0dXJuIHNlbGYuY2xhbXAocmV0dXJudmFsdWUsIG1pbjIsIG1heDIpO2Vsc2UgcmV0dXJuIHJldHVybnZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gQ2xhbXAgdmFsdWUgYmV0d2VlbiByYW5nZSB2YWx1ZXMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIHRoZSB2YWx1ZSBpbiB0aGUgcmFuZ2UgeyBtaW58bWF4IH0uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4gLSBtaW5pbXVtIHZhbHVlIGluIHRoZSByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIG1heGltdW0gdmFsdWUgaW4gdGhlIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2xhbXBSZXN1bHQgLSBjbGFtcCByZXN1bHQgYmV0d2VlbiByYW5nZSBib3VuZGFyeXMuXHJcbiAqL1xyXG5cdGNsYW1wOiBmdW5jdGlvbiBjbGFtcCh2YWx1ZSwgbWluLCBtYXgpIHtcclxuXHRcdGlmIChtYXggPCBtaW4pIHtcclxuXHRcdFx0dmFyIHRlbXAgPSBtaW47XHJcblx0XHRcdG1pbiA9IG1heDtcclxuXHRcdFx0bWF4ID0gdGVtcDtcclxuXHRcdH1cclxuXHRcdHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKHZhbHVlLCBtYXgpKTtcclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5tYXRoVXRpbHMgPSBtYXRoVXRpbHM7IiwidmFyIG11c2NsZU1vZGlmaWVyID0ge1xyXG5cdFxyXG5cdHBtOiB7fSxcclxuXHJcblx0Z2V0TWVhc3VyZXM6IGZ1bmN0aW9uKCBtZWFzdXJlcyApIHtcclxuXHRcdHRoaXMucG0gPSBtZWFzdXJlcztcclxuXHR9LFxyXG5cclxuXHRzZXRNb2RpZmllcnM6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHJldHVybiB7XHJcblxyXG5cdFx0XHRsb29rVGFyZ2V0WDoge1xyXG5cdFx0XHRcdG1pbjogLXRoaXMucG0ucjgsIG1heDogdGhpcy5wbS5yOCwgY3VycjogMFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRsb29rVGFyZ2V0WToge1xyXG5cdFx0XHRcdG1pbjogLXRoaXMucG0ucjgsIG1heDogdGhpcy5wbS5yOCwgY3VycjogMFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRsb29rVGFyZ2V0Wjoge1xyXG5cdFx0XHRcdG1pbjogLXRoaXMucG0ucjgsIG1heDogdGhpcy5wbS5yOCwgY3VycjogMFxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Ly8gUmFpc2VzIGFuZCBsb3dlcnMgbGVmdCBleWVicm93XHJcblx0XHRcdGxlZnRFeWVicm93OiB7XHJcblx0XHRcdFx0bWluOiAtdGhpcy5wbS5yOCwgbWF4OiB0aGlzLnBtLnI4LCBjdXJyOiAwXHJcblx0XHRcdH0sXHJcblx0XHRcdC8vIFJhaXNlcyBhbmQgbG93ZXJzIHJpZ2h0IGV5ZWJyb3dcclxuXHRcdFx0cmlnaHRFeWVicm93OiB7XHJcblx0XHRcdFx0bWluOiAtdGhpcy5wbS5yOCwgbWF4OiB0aGlzLnBtLnI4LCBjdXJyOiAwXHJcblx0XHRcdH0sXHJcblx0XHRcdC8vIENvbnRyYWN0cyBsZWZ0IGV5ZWJyb3cgbXVzY2xlICggZnJvd24gKVxyXG5cdFx0XHRsZWZ0QnJvd0NvbnRyYWN0OiB7XHJcblx0XHRcdFx0bWluOiAwLCBtYXg6IHRoaXMucG0ucjMyICsgdGhpcy5wbS5yNjQsIGN1cnI6IDBcclxuXHRcdFx0fSxcclxuXHRcdFx0Ly8gQ29udHJhY3RzIHJpZ2h0IGV5ZWJyb3cgbXVzY2xlICggZnJvd24gKVxyXG5cdFx0XHRyaWdodEJyb3dDb250cmFjdDoge1xyXG5cdFx0XHRcdG1pbjogMCwgbWF4OiB0aGlzLnBtLnIzMiArIHRoaXMucG0ucjY0LCBjdXJyOiAwXHJcblx0XHRcdH0sXHJcblx0XHRcdC8vIE9wZW5zIGFuZCBjbG9zZXMgbGVmdCBleWVcclxuXHRcdFx0bGVmdEV5ZToge1xyXG5cdFx0XHRcdG1pbjogMCwgbWF4OiAxLCBjdXJyOiAxXHJcblx0XHRcdH0sXHJcblx0XHRcdC8vIE9wZW5zIGFuZCBjbG9zZXMgcmlnaHQgZXllXHJcblx0XHRcdHJpZ2h0RXllOiB7XHJcblx0XHRcdFx0bWluOiAwLCBtYXg6IDEsIGN1cnI6IDFcclxuXHRcdFx0fSxcclxuXHJcblxyXG5cdFx0XHQvLyBSYWlzZXMgYW5kIGxvd2VycyBsZWZ0IG5vc3RyaWxcclxuXHRcdFx0bm9zdHJpbFJhaXNlTDoge1xyXG5cdFx0XHRcdG1pbjogLXRoaXMucG0ucjMyLCBtYXg6IHRoaXMucG0ucjMyLCBjdXJyOiAwXHJcblx0XHRcdH0sXHJcblx0XHRcdC8vIFJhaXNlcyBhbmQgbG93ZXJzIHJpZ2h0IG5vc3RyaWxcclxuXHRcdFx0bm9zdHJpbFJhaXNlUjoge1xyXG5cdFx0XHRcdG1pbjogLXRoaXMucG0ucjMyLCBtYXg6IHRoaXMucG0ucjMyLCBjdXJyOiAwXHJcblx0XHRcdH0sXHJcblx0XHRcdC8vIGZsYXJlcyBsZWZ0IG5vc3RyaWxcclxuXHRcdFx0bm9zdHJpbEZsYXJlTDoge1xyXG5cdFx0XHRcdG1pbjogMCwgbWF4OiB0aGlzLnBtLnIzMiwgY3VycjogMFxyXG5cdFx0XHR9LFxyXG5cdFx0XHQvLyBmbGFyZXMgcmlnaHQgbm9zdHJpbFxyXG5cdFx0XHRub3N0cmlsRmxhcmVSOiB7XHJcblx0XHRcdFx0bWluOiAwLCBtYXg6IHRoaXMucG0ucjMyLCBjdXJyOiAwXHJcblx0XHRcdH0sXHJcblx0XHRcdFxyXG5cclxuXHRcdFx0Ly8gcmFpc2VzIGFuZCBsb3dlcnMgbGVmdCBjaGVlayAoIHB1bGxzIG1vdXRoIGVkZ2VzIHVwIGFuZCBkb3duKVxyXG5cdFx0XHRsZWZ0Q2hlZWs6IHtcclxuXHRcdFx0XHRtaW46IC0oIHRoaXMucG0ucjggKyB0aGlzLnBtLnIxNiApLCBtYXg6IHRoaXMucG0ucjggKyB0aGlzLnBtLnIxNiwgY3VycjogMFxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Ly8gcmFpc2VzIGFuZCBsb3dlcnMgcmlnaHQgY2hlZWsgKCBwdWxscyBtb3V0aCBlZGdlcyB1cCBhbmQgZG93bilcclxuXHRcdFx0cmlnaHRDaGVlazoge1xyXG5cdFx0XHRcdG1pbjogLSggdGhpcy5wbS5yOCArIHRoaXMucG0ucjE2ICksIG1heDogdGhpcy5wbS5yOCArIHRoaXMucG0ucjE2LCBjdXJyOiAwXHJcblx0XHRcdH0sXHJcblx0XHRcdFxyXG5cdFx0XHQvLyBtb3V0aCBsZWZ0IGVkZ2UgcHVsbCBpbiBhbmQgb3V0IFx0XHRcdFxyXG5cdFx0XHRtb3V0aEVkZ2VMZWZ0OiB7XHJcblx0XHRcdFx0bWluOiAtKCB0aGlzLnBtLnIxNiArIHRoaXMucG0ucjMyICksIG1heDogdGhpcy5wbS5yMTYgKyB0aGlzLnBtLnIzMiwgY3VycjogMFxyXG5cdFx0XHR9LFxyXG5cdFx0XHQvLyBtb3V0aCByaWdodCBlZGdlIHB1bGwgaW4gYW5kIG91dCBcclxuXHRcdFx0bW91dGhFZGdlUmlnaHQ6IHtcclxuXHRcdFx0XHRtaW46IC0oIHRoaXMucG0ucjE2ICsgdGhpcy5wbS5yMzIgKSwgbWF4OiB0aGlzLnBtLnIxNiArIHRoaXMucG0ucjMyLCBjdXJyOiAwXHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRtb3V0aEVkZ2VMZWZ0RXh0ZW5kOiB7XHJcblx0XHRcdFx0bWluOiAtKCB0aGlzLnBtLnIxNiArIHRoaXMucG0ucjMyICksIG1heDogdGhpcy5wbS5yMTYgKyB0aGlzLnBtLnIzMiwgY3VycjogMFxyXG5cdFx0XHR9LFxyXG5cdFx0XHQvLyBtb3V0aCByaWdodCBlZGdlIHB1bGwgaW4gYW5kIG91dCBcclxuXHRcdFx0bW91dGhFZGdlUmlnaHRFeHRlbmQ6IHtcclxuXHRcdFx0XHRtaW46IC0oIHRoaXMucG0ucjE2ICsgdGhpcy5wbS5yMzIgKSwgbWF4OiB0aGlzLnBtLnIxNiArIHRoaXMucG0ucjMyLCBjdXJyOiAwXHJcblx0XHRcdH0sXHJcblx0XHRcdFxyXG5cdFx0XHQvLyB0b3AgbGlwIGxlZnQgcHVsbCBpbiBhbmQgb3V0XHJcblx0XHRcdHRvcExpcExlZnRQdWxsOiB7XHJcblx0XHRcdFx0bWluOiAwLCBtYXg6IHRoaXMucG0ucjgsIGN1cnI6IDBcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdC8vIHRvcCBsaXAgcmlnaHQgcHVsbCBpbiBhbmQgb3V0XHJcblx0XHRcdHRvcExpcFJpZ2h0UHVsbDoge1xyXG5cdFx0XHRcdG1pbjogMCwgbWF4OiB0aGlzLnBtLnI4LCBjdXJyOiAwXHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQvLyBib3R0b20gbGlwIGxlZnQgcHVsbCBpbiBhbmQgb3V0XHJcblx0XHRcdGJvdHRvbUxpcExlZnRQdWxsOiB7XHJcblx0XHRcdFx0bWluOiAwLCBtYXg6IHRoaXMucG0ucjgsIGN1cnI6IDBcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdC8vIGJvdHRvbSBsaXAgcmlnaHQgcHVsbCBpbiBhbmQgb3V0XHJcblx0XHRcdGJvdHRvbUxpcFJpZ2h0UHVsbDoge1xyXG5cdFx0XHRcdG1pbjogMCwgbWF4OiB0aGlzLnBtLnI4LCBjdXJyOiAwXHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQvLyBUb3AgbGlwIHB1bGwgdXAgYW5kIGRvd25cclxuXHRcdFx0dG9wTGlwT3Blbjoge1xyXG5cdFx0XHRcdG1pbjogMCwgbWF4OiAoIHRoaXMucG0ucjggLSB0aGlzLnBtLnIzMiApLCBjdXJyOiAwXHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQvLyBib3R0b20gbGlwIHB1bGwgdXAgYW5kIGRvd25cclxuXHRcdFx0Ym90dG9tTGlwT3Blbjoge1xyXG5cdFx0XHRcdG1pbjogMCwgbWF4OiB0aGlzLnBtLnI4LCBjdXJyOiAwXHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQvLyBsaXBzIHB1Y2tlciBhbmQgcmVsYXhcclxuXHRcdFx0bGlwc1B1Y2tlcjoge1xyXG5cdFx0XHRcdG1pbjogMCwgbWF4OiB0aGlzLnBtLnI4LCBjdXJyOiAwXHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQvLyBvcGVucyBhbmQgY2xvc2VzIHRoZSBqYXcgKCBtb3V0aCApXHJcblx0XHRcdGphd09wZW46IHtcclxuXHRcdFx0XHRtaW46IDAsIG1heDogdGhpcy5wbS5yNCArIHRoaXMucG0ucjgsIGN1cnI6IDBcclxuXHRcdFx0fSxcclxuXHRcdFx0Ly8gbW92ZXMgamF3IGxhdGVyYWxseSAoIGxlZnQgYW5kIHJpZ2h0IClcclxuXHRcdFx0amF3TGF0ZXJhbDoge1xyXG5cdFx0XHRcdG1pbjogLXRoaXMucG0ucjQsIG1heDogdGhpcy5wbS5yNCwgY3VycjogMFxyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdH1cclxuXHJcblx0fSxcclxuXHJcblx0Y3JlYXRlTW9kaWZpZXJzOiBmdW5jdGlvbiggbWVhc3VyZXMgKSB7XHJcblx0XHR0aGlzLmdldE1lYXN1cmVzKCBtZWFzdXJlcyApO1xyXG5cdFx0dmFyIHRlbXAgPSB0aGlzLnNldE1vZGlmaWVycygpO1xyXG5cdFx0cmV0dXJuIHRlbXA7XHJcblx0fSxcclxuXHJcblx0c2V0UmFuZ2VJbnB1dHM6IGZ1bmN0aW9uKCBvYmogKSB7XHJcblx0XHQvLyBnZXQgbGlzdCBvZiBtZW1iZXJzXHJcblx0XHR2YXIga2V5TGlzdCA9IE9iamVjdC5rZXlzKCBvYmogKTtcclxuXHRcdC8vIGxvb3AgdGhyb3VnaCBtZW1iZXIgbGlzdFxyXG5cdFx0Zm9yKCB2YXIgaSA9IDA7IGkgPD0ga2V5TGlzdC5sZW5ndGggLSAxOyBpKysgKSB7XHJcblx0XHRcdC8vIHN0b3JlIG1lbWJlciBuYW1lXHJcblx0XHRcdHZhciB0aGlzS2V5ID0ga2V5TGlzdFsgaSBdO1xyXG5cdFx0XHR2YXIgdGhpc0l0ZW0gPSBvYmpbIHRoaXNLZXkgXTtcclxuXHJcblx0XHRcdGlmICggdGhpc0tleSA9PT0gJ2xvb2tUYXJnZXRYJyB8fCB0aGlzS2V5ID09PSAnbG9va1RhcmdldFknIHx8IHRoaXNLZXkgPT09ICdsb29rVGFyZ2V0WicgKSB7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCAndGhpc0tleTogJywgdGhpc0tleSApO1xyXG5cdFx0XHRcclxuXHRcdFx0JCggJyMnK3RoaXNLZXkgKVxyXG5cdFx0XHRcdC5hdHRyKCB7XHJcblx0XHRcdFx0XHQnbWluJzogdGhpc0l0ZW0ubWluLFxyXG5cdFx0XHRcdFx0J21heCc6IHRoaXNJdGVtLm1heCxcclxuXHRcdFx0XHRcdCd2YWx1ZSc6IHRoaXNJdGVtLmN1cnJcclxuXHRcdFx0XHR9IClcclxuXHRcdFx0XHQucHJvcCgge1xyXG5cdFx0XHRcdFx0J21pbic6IHRoaXNJdGVtLm1pbixcclxuXHRcdFx0XHRcdCdtYXgnOiB0aGlzSXRlbS5tYXgsXHJcblx0XHRcdFx0XHQndmFsdWUnOiB0aGlzSXRlbS5jdXJyXHJcblx0XHRcdFx0fSApXHJcblx0XHRcdFx0LmNsb3Nlc3QoICcuY29udHJvbC0tcGFuZWxfX2l0ZW0nIClcclxuXHRcdFx0XHQuZmluZCggJ291dHB1dCcgKVxyXG5cdFx0XHRcdC5odG1sKCB0aGlzSXRlbS5jdXJyICk7XHJcblxyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLm11c2NsZU1vZGlmaWVyID0gbXVzY2xlTW9kaWZpZXI7IiwidmFyIGJ0biA9IHtcclxuICAgIHg6IDI1LFxyXG4gICAgeTogMjUsXHJcbiAgICB3OiAxMjUsXHJcbiAgICBoOiA1MCxcclxuICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICBmb250U2l6ZTogMTUsXHJcbiAgICBiZzogJyM2NjY2NjYnLFxyXG4gICAgYmdBY3RpdmU6ICcjYWFhYWFhJyxcclxuICAgIGNvbG9yOiAnIzMzMzMzMycsXHJcbiAgICBjb2xvckFjdGl2ZTogJyNkZGRkZGQnLFxyXG4gICAgY29udGVudDogJ0Rpc3BsYXkgT3ZlcmxheSdcclxufTtcclxuXHJcbmJ0bi50ZXh0WCA9IGJ0bi54ICsgMTA7XHJcbmJ0bi50ZXh0WSA9IGJ0bi55ICsgKCBidG4uaCAvIDIgKTtcclxuXHJcbmZ1bmN0aW9uIGRyYXdPdmVybGF5U3dpdGNoQnV0dG9uKCBjdHggKSB7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gYnRuLmRpc3BsYXlPdmVybGF5ID09PSB0cnVlID8gYnRuLmJnQWN0aXZlIDogYnRuLmJnO1xyXG4gICAgY3R4LmZpbGxSZWN0KCBidG4ueCwgYnRuLnksIGJ0bi53LCBidG4uaCApO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGJ0bi5kaXNwbGF5T3ZlcmxheSA9PT0gdHJ1ZSA/IGJ0bi5jb2xvckFjdGl2ZSA6IGJ0bi5jb2xvcjtcclxuICAgIGN0eC5mb250ID0gYnRuLmZvbnRTaXplICsgJ3B4IFRhaG9tYSc7XHJcbiAgICBjdHguZmlsbFRleHQoIGJ0bi5jb250ZW50LCBidG4udGV4dFgsIGJ0bi50ZXh0WSApO1xyXG59O1xyXG5cclxuXHJcbnZhciBvdmVybGF5Q2ZnID0ge1xyXG4gICAgZGlzcGxheU92ZXJsYXk6IGZhbHNlLFxyXG4gICAgZGlzcGxheUxvb2tUYXJnZXQ6IGZhbHNlLFxyXG4gICAgZGlzcGxheUNlbnRyZUxpbmVzOiBmYWxzZSxcclxuICAgIGRpc3BsYXlBbmNob3JzOiBmYWxzZSxcclxuICAgIGRpc3BsYXlDb250cm9sUG9pbnRzOiBmYWxzZSxcclxuICAgIGRpc3BsYXlIdWxsczogZmFsc2UsXHJcbiAgICBkaXNwbGF5R2xhcmVTcGlrZXM6IGZhbHNlLFxyXG4gICAgZGlzcGxheVN1blRvU3RhZ2U6IGZhbHNlXHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5vdmVybGF5QnRuQ2ZnID0gYnRuO1xyXG5tb2R1bGUuZXhwb3J0cy5kcmF3T3ZlcmxheVN3aXRjaEJ1dHRvbiA9IGRyYXdPdmVybGF5U3dpdGNoQnV0dG9uO1xyXG5tb2R1bGUuZXhwb3J0cy5vdmVybGF5Q2ZnID0gb3ZlcmxheUNmZzsiLCJ2YXIgcHJvcG9ydGlvbmFsTWVhc3VyZXMgPSB7XHJcblxyXG5cdHNldE1lYXN1cmVzOiBmdW5jdGlvbiggYmFzZVJhZGl1cyApIHtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRyMjogYmFzZVJhZGl1cyAvIDIsXHJcblx0XHRcdHI0OiBiYXNlUmFkaXVzIC8gNCxcclxuXHRcdFx0cjg6IGJhc2VSYWRpdXMgLyA4LFxyXG5cdFx0XHRyMTY6IGJhc2VSYWRpdXMgLyAxNixcclxuXHRcdFx0cjMyOiBiYXNlUmFkaXVzIC8gMzIsXHJcblx0XHRcdHI2NDogYmFzZVJhZGl1cyAvIDY0LFxyXG5cdFx0XHRyMTI4OiBiYXNlUmFkaXVzIC8gMTI4LFxyXG5cclxuXHRcdFx0cjM6IGJhc2VSYWRpdXMgLyAzLFxyXG5cdFx0XHRyNjogYmFzZVJhZGl1cyAvIDYsXHJcblx0XHRcdHIxMjogYmFzZVJhZGl1cyAvIDEyLFxyXG5cdFx0XHRyMjQ6IGJhc2VSYWRpdXMgLyAyNCxcclxuXHJcblx0XHRcdHI1OiBiYXNlUmFkaXVzIC8gNSxcclxuXHRcdFx0cjEwOiBiYXNlUmFkaXVzIC8gMTBcclxuXHRcdH1cclxuXHRcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcHJvcG9ydGlvbmFsTWVhc3VyZXM7IiwiZnVuY3Rpb24gZXhwcmVzc2lvbkl0ZW0oIG1vZGlmaWVyLCB0YXJnZXQgKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdG5hbWU6IG1vZGlmaWVyLFxyXG5cdFx0dGFyZ2V0OiB0YXJnZXQsXHJcblx0XHRzdGFydFZhbHVlOiAwLFxyXG5cdFx0dmFsdWVDaGFuZ2U6IDBcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUV4cHJlc3Npb24oIGFyciApIHtcclxuXHJcblx0dmFyIHRlbXBBcnIgPSBbXTtcclxuXHR2YXIgYXJyTGVuID0gYXJyLmxlbmd0aCAtIDE7XHJcblxyXG5cdGZvciAodmFyIGkgPSBhcnJMZW47IGkgPj0gMDsgaS0tKSB7XHJcblx0XHR2YXIgdGhpc0l0ZW0gPSBhcnJbIGkgXTtcclxuXHRcdHRlbXBBcnIucHVzaCggZXhwcmVzc2lvbkl0ZW0oIHRoaXNJdGVtLm5hbWUsIHRoaXNJdGVtLnRhcmdldCApICk7XHJcblx0fVxyXG5cdHJldHVybiB0ZW1wQXJyO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVNlcXVlbmNlKCBvcHRzICkge1xyXG5cclxuXHR2YXIgdGVtcFNlcSA9IHtcclxuXHJcblx0XHQvLyBzZXEgcGFyYW1zXHJcblx0XHRyZXR1cm5Ub0luaXQ6IG9wdHMucmV0dXJuVG9Jbml0IHx8IGZhbHNlLFxyXG5cdFx0bG9vcDogb3B0cy5sb29wIHx8IGZhbHNlLFxyXG5cdFx0cmVwZWF0RGVsYXlPbkxvb3A6IG9wdHMucmVwZWF0RGVsYXlPbkxvb3AgfHwgZmFsc2UsXHJcblx0XHRmYWRlQ2hhbmdlT25Mb29wOiBvcHRzLmZhZGVDaGFuZ2VPbkxvb3AgfHwgZmFsc2UsXHJcblx0XHRmYWRlQ2hhbmdlT25Mb29wRWFzZTogb3B0cy5mYWRlQ2hhbmdlT25Mb29wRWFzZSB8fCAnbGluZWFyRWFzZScsXHJcblx0XHRzZXE6IG9wdHMuc2VxIHx8ICdyZXNldCcsXHJcblxyXG5cdFx0Ly8gc2VxIHRpbWluZ3NcclxuXHRcdGR1cjogb3B0cy5kdXIgfHwgMSxcclxuXHRcdGRlbGF5OiBvcHRzLmRlbGF5IHx8IDAsXHJcblx0XHRsb29wRGVsYXk6IG9wdHMubG9vcERlbGF5IHx8IDAsXHJcblxyXG5cdFx0Ly8gYmFzZSBwYXJhbXNcclxuXHRcdHBsYXlpbmc6IGZhbHNlLFxyXG5cdFx0ZGVsYXlUaWNrczogMCxcclxuXHRcdGxvb3BEZWxheVRpY2tzOiAwLFxyXG5cclxuXHRcdGxvb3BJdGVyYXRpb25zOiAwLFxyXG5cdFx0Y3Vyckxvb3BJdGVyYXRpb246IDAsXHJcblx0XHRcclxuXHRcdGxvb3BEZWxheVRpY2tzOiAwLFxyXG5cdFx0dG90YWxDbG9jazogMCxcclxuXHRcdGRlbGF5Q2xvY2s6IDAsXHJcblx0XHRsb29wRGVsYXlDbG9jazogMCxcclxuXHRcdGNsb2NrOiAwXHRcclxuXHR9XHJcblxyXG5cdHJldHVybiB0ZW1wU2VxO1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlVHJhY2soIG9wdHMgKSB7XHJcblxyXG5cdHZhciB0ZW1wVHJhY2sgPSB7XHJcblxyXG5cdFx0Ly8gdHJhY2sgcGFyYW1zXHJcblx0XHRsb29wOiBvcHRzLmxvb3AgfHwgZmFsc2UsXHJcblx0XHRsaW5rZWRUcmFjazogb3B0cy5saW5rZWRUcmFjayB8fCBudWxsLFxyXG5cdFx0c2VxdWVuY2VzOiBvcHRzLnNlcXVlbmNlcyB8fCBbXSxcclxuXHJcblx0XHQvLyBiYXNlIHBhcmFtc1xyXG5cdFx0cGxheWluZzogZmFsc2UsXHJcblx0XHR0b3RhbENsb2NrOiAwLFxyXG5cdFx0Y2xvY2s6IDAsXHRcclxuXHR9XHJcblxyXG5cdHJldHVybiB0ZW1wVHJhY2s7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVFeHByZXNzaW9uID0gY3JlYXRlRXhwcmVzc2lvbjtcclxubW9kdWxlLmV4cG9ydHMuY3JlYXRlU2VxdWVuY2UgPSBjcmVhdGVTZXF1ZW5jZTtcclxubW9kdWxlLmV4cG9ydHMuY3JlYXRlVHJhY2sgPSBjcmVhdGVUcmFjazsiLCJ2YXIgZWFzaW5nID0gcmVxdWlyZSgnLi9lYXNpbmcuanMnKS5lYXNpbmdFcXVhdGlvbnM7XHJcblxyXG52YXIgc2VxTGlzdCA9IHJlcXVpcmUoJy4vc2VxdWVuY2VzL3NlcXVlbmNlTGlzdC5qcycpXHJcblxyXG5cclxuZnVuY3Rpb24gY29tcHV0ZVNlcVRhcmdldCggdGhpc1NlcSwgbW9kaWZpZXJzICl7XHJcblxyXG4gICAgICAgIHZhciBnZXRNZW1iZXJzID0gdGhpc1NlcS5tZW1iZXJzO1xyXG4gICAgICAgIHZhciBnZXRNZW1iZXJzTGVuID0gZ2V0TWVtYmVycy5sZW5ndGggLSAxO1xyXG5cclxuICAgICAgICBmb3IgKCB2YXIgaSA9IGdldE1lbWJlcnNMZW47IGkgPj0gMDsgaS0tICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHRoaXNNZW0gPSBnZXRNZW1iZXJzWyBpIF07XHJcbiAgICAgICAgICAgIHZhciBnZXRNb2RpZmllciA9IG1vZGlmaWVyc1sgdGhpc01lbS5uYW1lIF07XHJcbiAgICAgICAgICAgIHZhciBjb21wdXRlZFRhcmdldCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBtb2RNaW4gPSBnZXRNb2RpZmllci5taW47XHJcbiAgICAgICAgICAgIHZhciBtb2RNYXggPSBnZXRNb2RpZmllci5tYXg7XHJcbiAgICAgICAgICAgIHZhciB0YXIgPSB0aGlzTWVtLnRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIGlmICggbW9kTWluID09PSAwICkge1xyXG4gICAgICAgICAgICAgICAgY29tcHV0ZWRUYXJnZXQgPSBtb2RNYXggKiB0YXI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIG1vZE1pbiA8IDAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0YXIgPj0gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcHV0ZWRUYXJnZXQgPSBtb2RNYXggKiB0YXI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcHV0ZWRUYXJnZXQgPSBtb2RNaW4gKiAtdGFyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzTWVtLnRhcmdldCA9IGNvbXB1dGVkVGFyZ2V0O1xyXG4gICAgICAgIH0gLy8gY2xvc2UgZm9yIGlcclxufVxyXG5cclxuZnVuY3Rpb24gY29tcHV0ZVNlcUxpc3QoIG1vZGlmaWVycyApe1xyXG5cdHZhciBzZXFzID0gdGhpcy5zZXFMaXN0O1xyXG5cdGZvciggdmFyIHNlcSBpbiBzZXFzICl7XHJcblx0XHRzZXF1ZW5jZXIuY29tcHV0ZVNlcVRhcmdldCggc2Vxc1sgc2VxIF0sIG1vZGlmaWVycyApXHJcblx0fVxyXG59O1xyXG5cclxuZnVuY3Rpb24gdXBkYXRlU2VxdWVuY2UoIG1vZGlmaWVycyApe1xyXG5cdHZhciBtT3B0cyA9IHRoaXMubWFzdGVyT3B0cztcclxuXHR2YXIgc2VxID0gdGhpcy5zZXF1ZW5jZXM7XHJcblx0dmFyIHNlcUxlbiA9IHNlcS5sZW5ndGggLSAxO1xyXG5cclxuXHRmb3IgKHZhciBpID0gc2VxTGVuIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuXHRcdHZhciB0aGlzU2VxID0gc2VxWyBpIF07XHJcblxyXG5cdFx0aWYgKCB0aGlzU2VxLnBsYXlpbmcgPT09IHRydWUgKSB7XHJcblx0XHRcdHZhciB0aGlzTWVtYmVycyA9IHRoaXNTZXEubWVtYmVycztcclxuXHRcdFx0dmFyIHRoaXNNZW1iZXJzTGVuID0gdGhpc01lbWJlcnMubGVuZ3RoIC0gMTtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IHRoaXNNZW1iZXJzTGVuOyBpID49IDA7IGktLSkge1xyXG5cdFx0XHRcdHZhciB0aGlzTWVtID0gdGhpc01lbWJlcnNbIGkgXTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAoIHRoaXNTZXEucmV0dXJuVG9Jbml0ID09PSB0cnVlICkge1xyXG5cdFx0XHRcdFx0dmFyIHRlbXBDbG9jayA9IHRoaXNTZXEudG90YWxDbG9jayAvIDI7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRtb2RpZmllcnNbIHRoaXNNZW0ubmFtZSBdLmN1cnIgPSBlYXNpbmdbIHRoaXNTZXEuZWFzZUZuIF0oIHRoaXNTZXEuY2xvY2ssIHRoaXNTZXEuc3RhcnRWYWx1ZSwgdGhpc01lbS52YWx1ZUNoYW5nZSwgdGhpc1NlcS50b3RhbENsb2NrICk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKCB0aGlzU2VxLmNsb2NrID09PSB0aGlzU2VxLnRvdGFsQ2xvY2sgKSB7XHJcblx0XHRcdFx0XHRpZiAoIHRoaXNTZXEucmV0dXJuVG9Jbml0ID09PSBmYWxzZSApIHtcclxuXHRcdFx0XHRcdFx0dGhpc1NlcS5wbGF5aW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR2YXIgdGVtcFZhbCA9IHRoaXNTZXEuc3RhcnRWYWx1ZSArIHRoaXNNZW0udmFsdWVDaGFuZ2U7XHJcblx0XHRcdFx0XHRcdHZhciB0ZW1wVmFsQ2hhbmdlID0gdGhpc01lbS52YWx1ZUNoYW5nZSAqIC0xO1xyXG5cdFx0XHRcdFx0XHR0aGlzU2VxLnN0YXJ0VmFsdWUgPSB0ZW1wVmFsO1xyXG5cdFx0XHRcdFx0XHR0aGlzU2VxLnZhbHVlQ2hhbmdlID0gdGVtcFZhbENoYW5nZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblx0fVxyXG5cclxufVxyXG5cclxuXHJcblxyXG52YXIgc2VxdWVuY2VyID0ge1xyXG5cdGlzQWN0aXZlOiBmYWxzZSxcclxuXHRzZXFMaXN0OiBzZXFMaXN0LFxyXG5cdGNvbXB1dGVTZXFUYXJnZXQ6IGNvbXB1dGVTZXFUYXJnZXQsXHJcblx0Y29tcHV0ZVNlcUxpc3Q6IGNvbXB1dGVTZXFMaXN0XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNlcXVlbmNlcjsiLCJ2YXIgZXhwcmVzc2lvbnMgPSByZXF1aXJlKCcuL2V4cHJlc3Npb25zLmpzJyk7XHJcblxyXG52YXIgYmlnU2FkU2VxdWVuY2UgPSB7XHJcblx0dG90YWxDbG9jazogMCxcclxuXHRjbG9jazogMCxcclxuXHRwbGF5aW5nOiBmYWxzZSxcclxuXHRyZXZlcnNlUGxheTogZmFsc2UsXHJcblx0ZWFzZUZuOiAnZWFzZU91dEN1YmljJyxcclxuXHRtZW1iZXJzOiBleHByZXNzaW9ucy5iaWdTYWRcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYmlnU2FkU2VxdWVuY2U7IiwidmFyIGV4cHJlc3Npb25zID0gcmVxdWlyZSgnLi9leHByZXNzaW9ucy5qcycpO1xyXG5cclxudmFyIGJpZ1NtaWxlU2VxdWVuY2UgPSB7XHJcblx0dG90YWxDbG9jazogMCxcclxuXHRjbG9jazogMCxcclxuXHRwbGF5aW5nOiBmYWxzZSxcclxuXHRyZXZlcnNlUGxheTogZmFsc2UsXHJcblx0ZWFzZUZuOiAnZWFzZUluT3V0QmFjaycsXHJcblx0bWVtYmVyczogZXhwcmVzc2lvbnMuYmlnU21pbGVcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYmlnU21pbGVTZXF1ZW5jZTsiLCJ2YXIgZXhwcmVzc2lvbnMgPSByZXF1aXJlKCcuL2V4cHJlc3Npb25zLmpzJyk7XHJcblxyXG52YXIgYmxpbmtTZXF1ZW5jZSA9IHtcclxuXHR0b3RhbENsb2NrOiAwLFxyXG5cdGNsb2NrOiAwLFxyXG5cdHBsYXlpbmc6IGZhbHNlLFxyXG5cdHJldmVyc2VQbGF5OiBmYWxzZSxcclxuXHRlYXNlRm46ICdsaW5lYXJFYXNlJyxcclxuXHRtZW1iZXJzOiBleHByZXNzaW9ucy5leWVzQ2xvc2VkXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGJsaW5rU2VxdWVuY2U7XHJcblxyXG4iLCJ2YXIgZXhwcmVzc2lvbnMgPSByZXF1aXJlKCcuL2V4cHJlc3Npb25zLmpzJyk7XHJcblxyXG52YXIgZWNzdGF0aWNTZXF1ZW5jZSA9IHtcclxuXHR0b3RhbENsb2NrOiAwLFxyXG5cdGNsb2NrOiAwLFxyXG5cdHBsYXlpbmc6IGZhbHNlLFxyXG5cdHJldmVyc2VQbGF5OiBmYWxzZSxcclxuXHRlYXNlRm46ICdlYXNlSW5PdXRCYWNrJyxcclxuXHRtZW1iZXJzOiBleHByZXNzaW9ucy5lY3N0YXRpY1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlY3N0YXRpY1NlcXVlbmNlOyIsInZhciBjcmVhdGVFeHByZXNzaW9uID0gcmVxdWlyZSggJy4uL3NlcXVlbmNlVXRpbHMuanMnICkuY3JlYXRlRXhwcmVzc2lvbjtcclxuXHJcbnZhciBzbWlsZSA9IGNyZWF0ZUV4cHJlc3Npb24oXHJcblx0WyB7IG5hbWU6IFwibG9va1RhcmdldFhcIiwgdGFyZ2V0OiBcIjAuNTBcIiB9LCB7IG5hbWU6IFwibG9va1RhcmdldFlcIiwgdGFyZ2V0OiBcIjAuNDNcIiB9LCB7IG5hbWU6IFwibG9va1RhcmdldFpcIiwgdGFyZ2V0OiBcIjAuNjdcIiB9LCB7IG5hbWU6IFwibGVmdEV5ZWJyb3dcIiwgdGFyZ2V0OiBcIi0wLjI0XCIgfSwgeyBuYW1lOiBcImxlZnRCcm93Q29udHJhY3RcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwicmlnaHRFeWVicm93XCIsIHRhcmdldDogXCItMC4yNFwiIH0sIHsgbmFtZTogXCJyaWdodEJyb3dDb250cmFjdFwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJsZWZ0RXllXCIsIHRhcmdldDogXCIxLjAwXCIgfSwgeyBuYW1lOiBcInJpZ2h0RXllXCIsIHRhcmdldDogXCIxLjAwXCIgfSwgeyBuYW1lOiBcIm5vc3RyaWxSYWlzZUxcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwibm9zdHJpbEZsYXJlTFwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJub3N0cmlsUmFpc2VSXCIsIHRhcmdldDogXCIwLjAwXCIgfSwgeyBuYW1lOiBcIm5vc3RyaWxGbGFyZVJcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwibGVmdENoZWVrXCIsIHRhcmdldDogXCItMC40MFwiIH0sIHsgbmFtZTogXCJyaWdodENoZWVrXCIsIHRhcmdldDogXCItMC40MFwiIH0sIHsgbmFtZTogXCJtb3V0aEVkZ2VMZWZ0XCIsIHRhcmdldDogXCItMC4zMVwiIH0sIHsgbmFtZTogXCJtb3V0aEVkZ2VMZWZ0RXh0ZW5kXCIsIHRhcmdldDogXCItMC41N1wiIH0sIHsgbmFtZTogXCJtb3V0aEVkZ2VSaWdodFwiLCB0YXJnZXQ6IFwiMC4zMVwiIH0sIHsgbmFtZTogXCJtb3V0aEVkZ2VSaWdodEV4dGVuZFwiLCB0YXJnZXQ6IFwiLTAuNTdcIiB9LCB7IG5hbWU6IFwibGlwc1B1Y2tlclwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJ0b3BMaXBPcGVuXCIsIHRhcmdldDogXCIwLjAwXCIgfSwgeyBuYW1lOiBcInRvcExpcExlZnRQdWxsXCIsIHRhcmdldDogXCIwLjAwXCIgfSwgeyBuYW1lOiBcInRvcExpcFJpZ2h0UHVsbFwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJib3R0b21MaXBPcGVuXCIsIHRhcmdldDogXCIwLjAwXCIgfSwgeyBuYW1lOiBcImJvdHRvbUxpcExlZnRQdWxsXCIsIHRhcmdldDogXCIwLjAwXCIgfSwgeyBuYW1lOiBcImJvdHRvbUxpcFJpZ2h0UHVsbFwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJqYXdPcGVuXCIsIHRhcmdldDogXCIwLjAwXCIgfSwgeyBuYW1lOiBcImphd0xhdGVyYWxcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9IF1cclxuKTtcclxuXHJcbnZhciBiaWdTbWlsZSA9IGNyZWF0ZUV4cHJlc3Npb24oXHJcblx0WyB7IG5hbWU6IFwibG9va1RhcmdldFhcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwibG9va1RhcmdldFlcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwibG9va1RhcmdldFpcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwibGVmdEV5ZWJyb3dcIiwgdGFyZ2V0OiBcIi0wLjU2XCIgfSwgeyBuYW1lOiBcImxlZnRCcm93Q29udHJhY3RcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwicmlnaHRFeWVicm93XCIsIHRhcmdldDogXCItMC41NlwiIH0sIHsgbmFtZTogXCJyaWdodEJyb3dDb250cmFjdFwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJsZWZ0RXllXCIsIHRhcmdldDogXCIxLjAwXCIgfSwgeyBuYW1lOiBcInJpZ2h0RXllXCIsIHRhcmdldDogXCIxLjAwXCIgfSwgeyBuYW1lOiBcIm5vc3RyaWxSYWlzZUxcIiwgdGFyZ2V0OiBcIi0wLjQwXCIgfSwgeyBuYW1lOiBcIm5vc3RyaWxGbGFyZUxcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwibm9zdHJpbFJhaXNlUlwiLCB0YXJnZXQ6IFwiLTAuNDBcIiB9LCB7IG5hbWU6IFwibm9zdHJpbEZsYXJlUlwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJsZWZ0Q2hlZWtcIiwgdGFyZ2V0OiBcIi0wLjQwXCIgfSwgeyBuYW1lOiBcInJpZ2h0Q2hlZWtcIiwgdGFyZ2V0OiBcIi0wLjQwXCIgfSwgeyBuYW1lOiBcIm1vdXRoRWRnZUxlZnRcIiwgdGFyZ2V0OiBcIi0wLjU5XCIgfSwgeyBuYW1lOiBcIm1vdXRoRWRnZUxlZnRFeHRlbmRcIiwgdGFyZ2V0OiBcIi0wLjQwXCIgfSwgeyBuYW1lOiBcIm1vdXRoRWRnZVJpZ2h0XCIsIHRhcmdldDogXCIwLjU5XCIgfSwgeyBuYW1lOiBcIm1vdXRoRWRnZVJpZ2h0RXh0ZW5kXCIsIHRhcmdldDogXCItMC40MFwiIH0sIHsgbmFtZTogXCJsaXBzUHVja2VyXCIsIHRhcmdldDogXCIwLjAwXCIgfSwgeyBuYW1lOiBcInRvcExpcE9wZW5cIiwgdGFyZ2V0OiBcIjAuMjZcIiB9LCB7IG5hbWU6IFwidG9wTGlwTGVmdFB1bGxcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwidG9wTGlwUmlnaHRQdWxsXCIsIHRhcmdldDogXCIwLjAwXCIgfSwgeyBuYW1lOiBcImJvdHRvbUxpcE9wZW5cIiwgdGFyZ2V0OiBcIjAuNTlcIiB9LCB7IG5hbWU6IFwiYm90dG9tTGlwTGVmdFB1bGxcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwiYm90dG9tTGlwUmlnaHRQdWxsXCIsIHRhcmdldDogXCIwLjAwXCIgfSwgeyBuYW1lOiBcImphd09wZW5cIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwiamF3TGF0ZXJhbFwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0gXVxyXG4pO1xyXG5cclxudmFyIGVjc3RhdGljID0gY3JlYXRlRXhwcmVzc2lvbihcclxuXHRbIHsgbmFtZTogXCJsb29rVGFyZ2V0WFwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJsb29rVGFyZ2V0WVwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJsb29rVGFyZ2V0WlwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJsZWZ0RXllYnJvd1wiLCB0YXJnZXQ6IFwiLTEuMDBcIiB9LCB7IG5hbWU6IFwibGVmdEJyb3dDb250cmFjdFwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJyaWdodEV5ZWJyb3dcIiwgdGFyZ2V0OiBcIi0xLjAwXCIgfSwgeyBuYW1lOiBcInJpZ2h0QnJvd0NvbnRyYWN0XCIsIHRhcmdldDogXCIwLjAwXCIgfSwgeyBuYW1lOiBcImxlZnRFeWVcIiwgdGFyZ2V0OiBcIjEuMDBcIiB9LCB7IG5hbWU6IFwicmlnaHRFeWVcIiwgdGFyZ2V0OiBcIjEuMDBcIiB9LCB7IG5hbWU6IFwibm9zdHJpbFJhaXNlTFwiLCB0YXJnZXQ6IFwiLTEuMDBcIiB9LCB7IG5hbWU6IFwibm9zdHJpbEZsYXJlTFwiLCB0YXJnZXQ6IFwiMS4wMFwiIH0sIHsgbmFtZTogXCJub3N0cmlsUmFpc2VSXCIsIHRhcmdldDogXCItMS4wMFwiIH0sIHsgbmFtZTogXCJub3N0cmlsRmxhcmVSXCIsIHRhcmdldDogXCIxLjAwXCIgfSwgeyBuYW1lOiBcImxlZnRDaGVla1wiLCB0YXJnZXQ6IFwiLTEuMDBcIiB9LCB7IG5hbWU6IFwicmlnaHRDaGVla1wiLCB0YXJnZXQ6IFwiLTEuMDBcIiB9LCB7IG5hbWU6IFwibW91dGhFZGdlTGVmdFwiLCB0YXJnZXQ6IFwiLTEuMDBcIiB9LCB7IG5hbWU6IFwibW91dGhFZGdlTGVmdEV4dGVuZFwiLCB0YXJnZXQ6IFwiLTAuNDBcIiB9LCB7IG5hbWU6IFwibW91dGhFZGdlUmlnaHRcIiwgdGFyZ2V0OiBcIjFcIiB9LCB7IG5hbWU6IFwibW91dGhFZGdlUmlnaHRFeHRlbmRcIiwgdGFyZ2V0OiBcIi0wLjQwXCIgfSwgeyBuYW1lOiBcImxpcHNQdWNrZXJcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwidG9wTGlwT3BlblwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJ0b3BMaXBMZWZ0UHVsbFwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJ0b3BMaXBSaWdodFB1bGxcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwiYm90dG9tTGlwT3BlblwiLCB0YXJnZXQ6IFwiMS4wMFwiIH0sIHsgbmFtZTogXCJib3R0b21MaXBMZWZ0UHVsbFwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJib3R0b21MaXBSaWdodFB1bGxcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwiamF3T3BlblwiLCB0YXJnZXQ6IFwiMC40NlwiIH0sIHsgbmFtZTogXCJqYXdMYXRlcmFsXCIsIHRhcmdldDogXCIwLjAwXCIgfSBdXHJcbik7XHJcblxyXG5cclxuXHJcbnZhciBzYWQgPSBjcmVhdGVFeHByZXNzaW9uKFxyXG5cdFtcclxuXHRcdHsgbmFtZTogJ2ZvcmVoZWFkJywgdGFyZ2V0OiAwLjI1IH0sXHJcblx0XHR7IG5hbWU6ICdsZWZ0RXllYnJvdycsIHRhcmdldDogMC41IH0sXHJcblx0XHR7IG5hbWU6ICdyaWdodEV5ZWJyb3cnLCB0YXJnZXQ6IDAuNSB9LFxyXG5cdFx0eyBuYW1lOiAnbW91dGhXaWR0aCcsIHRhcmdldDogLTAuMjUgfSxcclxuXHRcdHsgbmFtZTogJ21vdXRoRXhwcmVzc2lvbicsIHRhcmdldDogMC40IH0sXHJcblx0XHR7IG5hbWU6ICdtb3V0aE9wZW4nLCB0YXJnZXQ6IDAgfSxcclxuXHRcdHsgbmFtZTogJ3RvcExpcE9wZW4nLCB0YXJnZXQ6IDAgfSxcclxuXHRcdHsgbmFtZTogJ2JvdHRvbUxpcE9wZW4nLCB0YXJnZXQ6IDAgfSxcclxuXHRcdHsgbmFtZTogJ2xlZnRDaGVlaycsIHRhcmdldDogMC41IH0sXHJcblx0XHR7IG5hbWU6ICdyaWdodENoZWVrJywgdGFyZ2V0OiAwLjUgfVxyXG5cdF1cclxuKTtcclxuXHJcbnZhciBiaWdTYWQgPSBjcmVhdGVFeHByZXNzaW9uKFxyXG5cdFtcclxuXHRcdHsgbmFtZTogJ2ZvcmVoZWFkJywgdGFyZ2V0OiAwLjUgfSxcclxuXHRcdHsgbmFtZTogJ2xlZnRFeWVicm93JywgdGFyZ2V0OiAtMC44IH0sXHJcblx0XHR7IG5hbWU6ICdyaWdodEV5ZWJyb3cnLCB0YXJnZXQ6IC0wLjggfSxcclxuXHRcdHsgbmFtZTogJ21vdXRoV2lkdGgnLCB0YXJnZXQ6IC0wLjMgfSxcclxuXHRcdHsgbmFtZTogJ21vdXRoRXhwcmVzc2lvbicsIHRhcmdldDogMC44IH0sXHJcblx0XHR7IG5hbWU6ICdtb3V0aE9wZW4nLCB0YXJnZXQ6IDAuMiB9LFxyXG5cdFx0eyBuYW1lOiAndG9wTGlwT3BlbicsIHRhcmdldDogMC4xIH0sXHJcblx0XHR7IG5hbWU6ICdib3R0b21MaXBPcGVuJywgdGFyZ2V0OiAwLjE1IH0sXHJcblx0XHR7IG5hbWU6ICdsZWZ0Q2hlZWsnLCB0YXJnZXQ6IDAuNCB9LFxyXG5cdFx0eyBuYW1lOiAncmlnaHRDaGVlaycsIHRhcmdldDogMC40IH1cclxuXHRdXHJcbik7XHJcblxyXG5cclxuXHJcbnZhciBleWVzQ2xvc2VkID0gY3JlYXRlRXhwcmVzc2lvbihcclxuXHRbXHJcblx0XHR7IG5hbWU6ICdsZWZ0RXllJywgdGFyZ2V0OiAwIH0sXHJcblx0XHR7IG5hbWU6ICdyaWdodEV5ZScsIHRhcmdldDogMCB9XHJcblx0XVxyXG4pO1xyXG5cclxuXHJcblxyXG52YXIgeWF3bkludHJvID0gY3JlYXRlRXhwcmVzc2lvbihcclxuXHRbXHJcblx0XHR7IG5hbWU6ICdsZWZ0RXllYnJvdycsIHRhcmdldDogLTAuNiB9LFxyXG5cdFx0eyBuYW1lOiAncmlnaHRFeWVicm93JywgdGFyZ2V0OiAtMC42IH0sXHJcblx0XHR7IG5hbWU6ICdtb3V0aEV4cHJlc3Npb24nLCB0YXJnZXQ6IDAgfSxcclxuXHRcdHsgbmFtZTogJ21vdXRoQmlhcycsIHRhcmdldDogMCB9LFxyXG5cdFx0eyBuYW1lOiAnbGVmdENoZWVrJywgdGFyZ2V0OiAtMC4yNSB9LFxyXG5cdFx0eyBuYW1lOiAnbGVmdENoZWVrUHVsbCcsIHRhcmdldDogMCB9LFxyXG5cdFx0eyBuYW1lOiAncmlnaHRDaGVlaycsIHRhcmdldDogLTAuMjUgfSxcclxuXHRcdHsgbmFtZTogJ3JpZ2h0Q2hlZWtQdWxsJywgdGFyZ2V0OiAwIH0sXHJcblx0XHR7IG5hbWU6ICdsZWZ0Sm93bCcsIHRhcmdldDogMCB9LFxyXG5cdFx0eyBuYW1lOiAncmlnaHRKb3dsJywgdGFyZ2V0OiAwIH1cclxuXHRdXHJcbik7XHJcblxyXG52YXIgeWF3bk1pZHRybzEgPSBjcmVhdGVFeHByZXNzaW9uKFxyXG5cdFtcclxuXHRcdHsgbmFtZTogJ2ZvcmVoZWFkJywgdGFyZ2V0OiAxIH0sXHJcblx0XHR7IG5hbWU6ICdsZWZ0RXllJywgdGFyZ2V0OiAwIH0sXHJcblx0XHR7IG5hbWU6ICdyaWdodEV5ZScsIHRhcmdldDogMCB9LFxyXG5cdFx0eyBuYW1lOiAnbW91dGhXaWR0aCcsIHRhcmdldDogMC4yIH0sXHJcblx0XHR7IG5hbWU6ICdtb3V0aE9wZW4nLCB0YXJnZXQ6IDAuOCB9LFxyXG5cdFx0eyBuYW1lOiAnbW91dGhCaWFzJywgdGFyZ2V0OiAwIH0sXHJcblx0XHR7IG5hbWU6ICd0b3BMaXBPcGVuJywgdGFyZ2V0OiAwLjUgfSxcclxuXHRcdHsgbmFtZTogJ2JvdHRvbUxpcE9wZW4nLCB0YXJnZXQ6IDAuNSB9LFxyXG5cdF1cclxuKTtcclxuXHJcblxyXG5cclxuXHJcbnZhciByZXNldCA9IGNyZWF0ZUV4cHJlc3Npb24oXHJcblx0WyB7IG5hbWU6IFwibG9va1RhcmdldFhcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwibG9va1RhcmdldFlcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwibG9va1RhcmdldFpcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwibGVmdEV5ZWJyb3dcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwibGVmdEJyb3dDb250cmFjdFwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJyaWdodEV5ZWJyb3dcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwicmlnaHRCcm93Q29udHJhY3RcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwibGVmdEV5ZVwiLCB0YXJnZXQ6IFwiMS4wMFwiIH0sIHsgbmFtZTogXCJyaWdodEV5ZVwiLCB0YXJnZXQ6IFwiMS4wMFwiIH0sIHsgbmFtZTogXCJub3N0cmlsUmFpc2VMXCIsIHRhcmdldDogXCIwLjAwXCIgfSwgeyBuYW1lOiBcIm5vc3RyaWxGbGFyZUxcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwibm9zdHJpbFJhaXNlUlwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJub3N0cmlsRmxhcmVSXCIsIHRhcmdldDogXCIwLjAwXCIgfSwgeyBuYW1lOiBcImxlZnRDaGVla1wiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJyaWdodENoZWVrXCIsIHRhcmdldDogXCIwLjAwXCIgfSwgeyBuYW1lOiBcIm1vdXRoRWRnZUxlZnRcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwibW91dGhFZGdlTGVmdEV4dGVuZFwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJtb3V0aEVkZ2VSaWdodFwiLCB0YXJnZXQ6IFwiMFwiIH0sIHsgbmFtZTogXCJtb3V0aEVkZ2VSaWdodEV4dGVuZFwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0sIHsgbmFtZTogXCJsaXBzUHVja2VyXCIsIHRhcmdldDogXCIwLjAwXCIgfSwgeyBuYW1lOiBcInRvcExpcE9wZW5cIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwidG9wTGlwTGVmdFB1bGxcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwidG9wTGlwUmlnaHRQdWxsXCIsIHRhcmdldDogXCIwLjAwXCIgfSwgeyBuYW1lOiBcImJvdHRvbUxpcE9wZW5cIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwiYm90dG9tTGlwTGVmdFB1bGxcIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwiYm90dG9tTGlwUmlnaHRQdWxsXCIsIHRhcmdldDogXCIwLjAwXCIgfSwgeyBuYW1lOiBcImphd09wZW5cIiwgdGFyZ2V0OiBcIjAuMDBcIiB9LCB7IG5hbWU6IFwiamF3TGF0ZXJhbFwiLCB0YXJnZXQ6IFwiMC4wMFwiIH0gXVxyXG4pO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG52YXIgZXhwcmVzc2lvbnMgPSB7XHJcblx0c21pbGU6IHNtaWxlLFxyXG5cdGJpZ1NtaWxlOiBiaWdTbWlsZSxcclxuXHRlY3N0YXRpYzogZWNzdGF0aWMsXHJcblx0c2FkOiBzYWQsXHJcblx0YmlnU2FkOiBiaWdTYWQsXHJcblx0eWF3bkludHJvOiB5YXduSW50cm8sXHJcblx0eWF3bk1pZHRybzE6IHlhd25NaWR0cm8xLFxyXG5cdGV5ZXNDbG9zZWQ6IGV5ZXNDbG9zZWQsXHJcblx0cmVzZXQ6IHJlc2V0XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZXhwcmVzc2lvbnM7IiwidmFyIGV4cHJlc3Npb25zID0gcmVxdWlyZSgnLi9leHByZXNzaW9ucy5qcycpO1xyXG5cclxudmFyIHJlc2V0U2VxdWVuY2UgPSB7XHJcblx0dG90YWxDbG9jazogMCxcclxuXHRjbG9jazogMCxcclxuXHRwbGF5aW5nOiBmYWxzZSxcclxuXHRyZXZlcnNlUGxheTogZmFsc2UsXHJcblx0ZWFzZUZuOiAnZWFzZUluT3V0UXVhZCcsXHJcblx0bWVtYmVyczogZXhwcmVzc2lvbnMucmVzZXRcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmVzZXRTZXF1ZW5jZTtcclxuXHJcbiIsInZhciBleHByZXNzaW9ucyA9IHJlcXVpcmUoJy4vZXhwcmVzc2lvbnMuanMnKTtcclxuXHJcbnZhciBzYWRTZXF1ZW5jZSA9IHtcclxuXHR0b3RhbENsb2NrOiAwLFxyXG5cdGNsb2NrOiAwLFxyXG5cdHBsYXlpbmc6IGZhbHNlLFxyXG5cdHJldmVyc2VQbGF5OiBmYWxzZSxcclxuXHRlYXNlRm46ICdlYXNlT3V0Q3ViaWMnLFxyXG5cdG1lbWJlcnM6IGV4cHJlc3Npb25zLnNhZFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYWRTZXF1ZW5jZTsiLCJ2YXIgZXhwcmVzc2lvbnMgPSByZXF1aXJlKCcuL2V4cHJlc3Npb25zLmpzJyk7XHJcblxyXG52YXIgc21pbGVTZXF1ZW5jZSA9IHJlcXVpcmUoJy4vc21pbGVTZXF1ZW5jZS5qcycpO1xyXG52YXIgYmlnU21pbGVTZXF1ZW5jZSA9IHJlcXVpcmUoJy4vYmlnU21pbGVTZXF1ZW5jZS5qcycpO1xyXG52YXIgZWNzdGF0aWNTZXF1ZW5jZSA9IHJlcXVpcmUoJy4vZWNzdGF0aWNTZXF1ZW5jZS5qcycpO1xyXG52YXIgc2FkU2VxdWVuY2UgPSByZXF1aXJlKCcuL3NhZFNlcXVlbmNlLmpzJyk7XHJcbnZhciBiaWdTYWRTZXF1ZW5jZSA9IHJlcXVpcmUoJy4vYmlnU2FkU2VxdWVuY2UuanMnKTtcclxudmFyIGJsaW5rU2VxdWVuY2UgPSByZXF1aXJlKCcuL2JsaW5rU2VxdWVuY2UuanMnKTtcclxudmFyIHJlc2V0U2VxdWVuY2UgPSByZXF1aXJlKCcuL3Jlc2V0U2VxdWVuY2UuanMnKTtcclxuXHJcbnZhciB5YXduSW50cm9TZXF1ZW5jZSA9IHJlcXVpcmUoJy4veWF3blNlcXVlbmNlLmpzJykueWF3bkludHJvU2VxdWVuY2U7XHJcbnZhciB5YXduTWlkdHJvMVNlcXVlbmNlID0gcmVxdWlyZSgnLi95YXduU2VxdWVuY2UuanMnKS55YXduTWlkdHJvMVNlcXVlbmNlO1xyXG5cclxudmFyIHNlcUxpc3QgPSB7XHJcblx0c21pbGVTZXF1ZW5jZTogc21pbGVTZXF1ZW5jZSxcclxuXHRiaWdTbWlsZVNlcXVlbmNlOiBiaWdTbWlsZVNlcXVlbmNlLFxyXG5cdGVjc3RhdGljU2VxdWVuY2U6IGVjc3RhdGljU2VxdWVuY2UsXHJcblx0c2FkU2VxdWVuY2U6IHNhZFNlcXVlbmNlLFxyXG5cdGJpZ1NhZFNlcXVlbmNlOiBiaWdTYWRTZXF1ZW5jZSxcclxuXHRibGlua1NlcXVlbmNlOiBibGlua1NlcXVlbmNlLFxyXG5cdHlhd25JbnRyb1NlcXVlbmNlOiB5YXduSW50cm9TZXF1ZW5jZSxcclxuXHR5YXduTWlkdHJvMVNlcXVlbmNlOiB5YXduTWlkdHJvMVNlcXVlbmNlLFxyXG5cdHJlc2V0U2VxdWVuY2U6IHJlc2V0U2VxdWVuY2VcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2VxTGlzdDsiLCJ2YXIgZXhwcmVzc2lvbnMgPSByZXF1aXJlKCcuL2V4cHJlc3Npb25zLmpzJyk7XHJcblxyXG52YXIgc21pbGVTZXF1ZW5jZSA9IHtcclxuXHR0b3RhbENsb2NrOiAwLFxyXG5cdGNsb2NrOiAwLFxyXG5cdHBsYXlpbmc6IGZhbHNlLFxyXG5cdHJldmVyc2VQbGF5OiBmYWxzZSxcclxuXHRlYXNlRm46ICdlYXNlT3V0Q3ViaWMnLFxyXG5cdG1lbWJlcnM6IGV4cHJlc3Npb25zLnNtaWxlXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNtaWxlU2VxdWVuY2U7IiwidmFyIGV4cHJlc3Npb25zID0gcmVxdWlyZSgnLi9leHByZXNzaW9ucy5qcycpO1xyXG5cclxudmFyIHlhd25JbnRyb1NlcXVlbmNlID0ge1xyXG5cdHRvdGFsQ2xvY2s6IDAsXHJcblx0Y2xvY2s6IDAsXHJcblx0cGxheWluZzogZmFsc2UsXHJcblx0cmV2ZXJzZVBsYXk6IGZhbHNlLFxyXG5cdGVhc2VGbjogJ2xpbmVhckVhc2UnLFxyXG5cdG1lbWJlcnM6IGV4cHJlc3Npb25zLnlhd25JbnRyb1xyXG59O1xyXG5cclxuXHJcbnZhciB5YXduTWlkdHJvMVNlcXVlbmNlID0ge1xyXG5cdHRvdGFsQ2xvY2s6IDAsXHJcblx0Y2xvY2s6IDAsXHJcblx0cGxheWluZzogZmFsc2UsXHJcblx0cmV2ZXJzZVBsYXk6IGZhbHNlLFxyXG5cdGVhc2VGbjogJ2xpbmVhckVhc2UnLFxyXG5cdG1lbWJlcnM6IGV4cHJlc3Npb25zLnlhd25NaWR0cm8xXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy55YXduSW50cm9TZXF1ZW5jZSA9IHlhd25JbnRyb1NlcXVlbmNlO1xyXG5tb2R1bGUuZXhwb3J0cy55YXduTWlkdHJvMVNlcXVlbmNlID0geWF3bk1pZHRybzFTZXF1ZW5jZTtcclxuIiwiLy8gc2luZSB3YXZlIG1vZHVsYXRpb25cclxuXHJcbnZhciB0d29QaSA9IHJlcXVpcmUoICcuL3RyaWdvbm9taWNVdGlscy5qcycgKS50cmlnb25vbWljVXRpbHMudHdvUGk7XHJcblxyXG52YXIgc2luZVdhdmUgPSB7XHJcblx0Y291bnQ6IDAsXHJcblx0aXRlcmF0aW9uczogdHdvUGkgLyA3NSxcclxuXHR2YWw6IDAsXHJcblx0aW52VmFsOiAwXHJcbn1cclxuXHJcbnNpbmVXYXZlLm1vZHVsYXRvciA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMudmFsID0gTWF0aC5zaW4oIHRoaXMuY291bnQgKSAvIDIgKyAwLjU7XHJcbiAgICB0aGlzLmludlZhbCA9IDEgLSB0aGlzLnZhbDtcclxuICAgIHRoaXMuY291bnQgKz0gdGhpcy5pdGVyYXRpb25zO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5zaW5lV2F2ZSA9IHNpbmVXYXZlOyIsInZhciB0d29QaSA9IHJlcXVpcmUoJy4vdHJpZ29ub21pY1V0aWxzLmpzJykudHJpZ29ub21pY1V0aWxzLnR3b1BpO1xyXG5cclxudmFyIG51bVJheXMgPSAyNDtcclxudmFyIHJheVNpemUgPSAzMDA7XHJcblxyXG52YXIgc3VuQ29yb25hID0ge1xyXG4gICAgbnVtUmF5czogbnVtUmF5cyxcclxuICAgIG51bVJheXNEb3VibGU6IG51bVJheXMgKiAyLFxyXG4gICAgcmF5U2l6ZTogcmF5U2l6ZSxcclxuICAgIHJheVNpemVEaWZmTWF4OiAxMDAsXHJcbiAgICByYXlTcHJlYWQ6IDAuMDI1LFxyXG4gICAgcGhpOiAwXHJcbn1cclxuXHJcbnN1bkNvcm9uYS5yZW5kZXIgPSBmdW5jdGlvbiggeCwgeSwgc2luZVdhdmUsIGludlNpbmVXYXZlLCBjdHggKSB7XHJcblxyXG4gICAgY29uc3Qgd2F2ZSA9IHNpbmVXYXZlO1xyXG4gICAgY29uc3QgaW52V2F2ZSA9IGludlNpbmVXYXZlO1xyXG5cclxuICAgIGNvbnN0IG51bVJheXMgPSB0aGlzLm51bVJheXNEb3VibGU7XHJcbiAgICBjb25zdCBiYXNlUiA9IHRoaXMucmF5QmFzZVJhZGl1cyAvIDM7XHJcbiAgICBjb25zdCByYXlTaXplID0gdGhpcy5yYXlTaXplO1xyXG4gICAgY29uc3QgcmF5U3ByZWFkID0gdGhpcy5yYXlTcHJlYWQ7XHJcbiAgICBjb25zdCByYXlEaWZmID0gdGhpcy5yYXlTaXplRGlmZk1heDtcclxuXHJcbiAgICAvLyBzdHJhaWdodCByYXlzXHJcbiAgICBsZXQgY2FsY3VsYXRlUmF5ID0gMDtcclxuXHJcbiAgICAvLyBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAvLyBmb3IgKCBsZXQgaSA9IDA7IGkgPCBudW1SYXlzOyBpKysgKSB7XHJcbiAgICAvLyAgICAgbGV0IGFscGhhID0gdHdvUGkgKiAoIGkgLyAoIG51bVJheXMgKSApICsgdGhpcy5waGk7XHJcbiAgICAvLyAgICAgaWYgKCBpICUgMiA9PSAwICkge1xyXG4gICAgLy8gICAgICAgICBjYWxjdWxhdGVSYXkgPSBiYXNlUiArIHJheVNpemUgKyAoIHJheURpZmYgKiAoIGkgJSA0ID09IDAgPyBpbnZXYXZlIDogd2F2ZSApICk7XHJcbiAgICAvLyAgICAgICAgIGN0eC5saW5lVG8oXHJcbiAgICAvLyAgICAgICAgICAgICB4ICsgTWF0aC5jb3MoIGFscGhhICkgKiBjYWxjdWxhdGVSYXksXHJcbiAgICAvLyAgICAgICAgICAgICB5ICsgTWF0aC5zaW4oIGFscGhhICkgKiBjYWxjdWxhdGVSYXlcclxuICAgIC8vICAgICAgICAgKTtcclxuXHJcbiAgICAvLyAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgbGV0IGFyY01vZCA9IHJheVNwcmVhZCAqIHdhdmU7XHJcbiAgICAvLyAgICAgICAgIGN0eC5hcmMoIHgsIHksIGJhc2VSLCBhbHBoYSAtIHJheVNwcmVhZCAtIGFyY01vZCwgYWxwaGEgKyByYXlTcHJlYWQgKyBhcmNNb2QgKTtcclxuICAgIC8vICAgICB9XHJcblxyXG4gICAgLy8gfVxyXG4gICAgLy8gY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgLy8gY3R4LnN0cm9rZSgpO1xyXG4gICAgLy8gZW5kIHN0cmFpZ2h0IHJheXNcclxuXHJcbiAgICAvLyBjdXJ2ZWQgcmF5c1xyXG4gICAgbGV0IHRlc3RDYWxjID0gMDtcclxuICAgIGxldCBmaXBwZXIgPSBmYWxzZTtcclxuXHJcbiAgICBjdHgubGluZUNhcCA9ICdyb3VuZCc7XHJcbiAgICBcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGZvciAoIGxldCBpID0gMDsgaSA8IG51bVJheXM7IGkrKyApIHtcclxuICAgICAgICBsZXQgYWxwaGEgPSB0d29QaSAqICggaSAvICggbnVtUmF5cyApICkgKyB0aGlzLnBoaTtcclxuICAgICAgICBsZXQgYWxwaGEyID0gdHdvUGkgKiAoICggaSArIDEgKSAvICggbnVtUmF5cyApICkgKyB0aGlzLnBoaTtcclxuXHJcbiAgICAgICAgdGVzdENhbGMgPSBiYXNlUiArIHJheVNpemUgKyAoIHJheURpZmYgKiAoIGZpcHBlciA9PSB0cnVlID8gaW52V2F2ZSA6IHdhdmUgKSApO1xyXG5cclxuICAgICAgICBpZiAoIGkgPT09IDAgKSB7XHJcblxyXG4gICAgICAgICAgICBjdHgubW92ZVRvKFxyXG4gICAgICAgICAgICAgICAgeCArIE1hdGguY29zKCBhbHBoYSApICogdGVzdENhbGMsXHJcbiAgICAgICAgICAgICAgICB5ICsgTWF0aC5zaW4oIGFscGhhICkgKiB0ZXN0Q2FsYyxcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgICAgIHggKyBNYXRoLmNvcyggYWxwaGEgKSAqIGJhc2VSLFxyXG4gICAgICAgICAgICAgICAgeSArIE1hdGguc2luKCBhbHBoYSApICogYmFzZVIsXHJcbiAgICAgICAgICAgICAgICB4ICsgTWF0aC5jb3MoIGFscGhhMiApICogdGVzdENhbGMsXHJcbiAgICAgICAgICAgICAgICB5ICsgTWF0aC5zaW4oIGFscGhhMiApICogdGVzdENhbGMsXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaXBwZXIgPSAhZmlwcGVyO1xyXG4gICAgfVxyXG4gICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuICAgIC8vIGN0eC5zdHJva2UoKTtcclxuICAgIC8vIGVuZCBjdXJ2ZWQgcmF5c1xyXG5cclxuICAgIHRoaXMucGhpICs9IDAuMDA1O1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzdW5Db3JvbmE7IiwidmFyIHRyaWcgPSByZXF1aXJlKCcuL3RyaWdvbm9taWNVdGlscy5qcycpLnRyaWdvbm9taWNVdGlscztcclxudmFyIHR3b1BpID0gdHJpZy50d29QaTtcclxuXHJcbnZhciByYW5kSSA9IHJlcXVpcmUoJy4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzLnJhbmRvbUludGVnZXI7XHJcbnZhciBudW1zcGlrZSA9IDg7XHJcbnZhciBzcGlrZVNpemUgPSAxNjAwO1xyXG5cclxudmFyIHN1blNwaWtlcyA9IHtcclxuICAgIFxyXG4gICAgbnVtc3Bpa2U6IG51bXNwaWtlLFxyXG4gICAgcm90YXRpb246ICggMiAqIE1hdGguUEkgLyBudW1zcGlrZSApLFxyXG4gICAgaGFsZlJvdGF0aW9uOiAoIDIgKiBNYXRoLlBJIC8gbnVtc3Bpa2UgKSAvIDIsXHJcblxyXG4gICAgcmVuZGVyQ2ZnOiB7XHJcbiAgICAgICAgY2FudmFzOiBudWxsLFxyXG4gICAgICAgIGNvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgZGVidWdDZmc6IG51bGxcclxuICAgIH0sXHJcblxyXG4gICAgZGlzcGxheUNmZzoge1xyXG4gICAgICAgIGdsYXJlU3Bpa2VzUmFuZG9tOiB7XHJcbiAgICAgICAgICAgIGlzUmVuZGVyZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICBpc0Rpc3BsYXllZDogZmFsc2UsXHJcbiAgICAgICAgICAgIGNhbnZhczogbnVsbCxcclxuICAgICAgICAgICAgY29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgeDogMCxcclxuICAgICAgICAgICAgeTogMFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG5cclxuICAgIGdsYXJlU3Bpa2VPcHRpb25zOiB7XHJcbiAgICAgICAgeDogMTUwLFxyXG4gICAgICAgIHk6IDE1MCxcclxuICAgICAgICByOiA1MCxcclxuICAgICAgICBtYWpvclJheUxlbjogNTAsXHJcbiAgICAgICAgbWFqb3JSYXlXaWR0aDogMC41LFxyXG4gICAgICAgIG1pbm9yUmF5V2lkdGg6IDAuNSxcclxuICAgICAgICBhbmdsZTogTWF0aC5QSSAvIDAsXHJcbiAgICAgICAgY291bnQ6IDE2LFxyXG4gICAgICAgIGJsdXI6IDE1XHJcbiAgICB9LFxyXG5cclxuICAgIGdsYXJlU3Bpa2VSYW5kb21PcHRpb25zOiB7XHJcbiAgICAgICAgeDogMTUwLFxyXG4gICAgICAgIHk6IDE1MCxcclxuICAgICAgICByOiA1MCxcclxuICAgICAgICBtYWpvclJheUxlbjogNTAsXHJcbiAgICAgICAgbWFqb3JSYXlXaWR0aDogMC41LFxyXG4gICAgICAgIG1pbm9yUmF5V2lkdGg6IDAuNSxcclxuICAgICAgICBhbmdsZTogTWF0aC5QSSAvIDAsXHJcbiAgICAgICAgY291bnQ6IDE2LFxyXG4gICAgICAgIGJsdXI6IDE1XHJcbiAgICB9LFxyXG5cclxuICAgIGZsYXJlT3B0aW9uczoge1xyXG4gICAgICAgIGNvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgY2FudmFzOiBudWxsLFxyXG4gICAgICAgIHg6IDE1MCxcclxuICAgICAgICB5OiAxNTAsXHJcbiAgICAgICAgcjogNTAsXHJcbiAgICAgICAgcmF5TGVuOiA4MDAsXHJcbiAgICAgICAgZmxhcmVXaWR0aDogMC4xLFxyXG4gICAgICAgIGFuZ2xlOiBNYXRoLlBJIC8gMCxcclxuICAgICAgICBjb3VudDogNixcclxuICAgICAgICBibHVyOiA4XHJcbiAgICB9LFxyXG5cclxuICAgIGdsYXJlU3Bpa2VDb250cm9sSW5wdXRDZmc6IHtcclxuXHJcbiAgICAgICAgcjogeyBpZDogJ3NwaWtlUmFkaXVzSW5wdXQnLCBtaW46IDAsIG1heDogMCwgY3VycjogMCwgcmV2OiBmYWxzZSB9LFxyXG4gICAgICAgIG1ham9yUmF5TGVuOiB7IGlkOiAnc3Bpa2VNYWpvclNpemUnLCBtaW46IDAsIG1heDogMjAwMCwgY3VycjogMCwgcmV2OiBmYWxzZSB9LFxyXG4gICAgICAgIG1pbm9yUmF5TGVuOiB7IGlkOiAnc3Bpa2VNaW5vclNpemUnLCBtaW46IDAsIG1heDogNTAwLCBjdXJyOiAwLCByZXY6IGZhbHNlIH0sXHJcbiAgICAgICAgbWFqb3JSYXlXaWR0aDoge2lkOiAnc3Bpa2VNYWpvcldpZHRoJywgIG1pbjogMCwgbWF4OiAyLCBjdXJyOiAwLCByZXY6IHRydWUgfSxcclxuICAgICAgICBtaW5vclJheVdpZHRoOiB7IGlkOiAnc3Bpa2VNaW5vcldpZHRoJywgbWluOiAwLCBtYXg6IDIsIGN1cnI6IDAsIHJldjogdHJ1ZSB9LFxyXG4gICAgICAgIGNvdW50OiB7IGlkOiAnc3Bpa2VDb3VudElucHV0JywgbWluOiA0LCBtYXg6IDEwMCwgY3VycjogMCwgcmV2OiBmYWxzZSB9LFxyXG4gICAgICAgIGJsdXI6IHsgaWQ6ICdzcGlrZUJsdXJBbW91bnQnLCBtaW46IDAsIG1heDogMTAwLCBjdXJyOiAxMCwgcmV2OiBmYWxzZSB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0R2xhcmVTcGlrZUNvbnRyb2xJbnB1dHM6IGZ1bmN0aW9uKCBzdGFnZSApIHtcclxuXHJcbiAgICAgICAgbGV0IHRoaXNDZmcgPSB0aGlzLmdsYXJlU3Bpa2VDb250cm9sSW5wdXRDZmc7XHJcbiAgICAgICAgbGV0IGN1cnJPcHRzID0gdGhpcy5nbGFyZVNwaWtlT3B0aW9ucztcclxuXHJcbiAgICAgICAgdGhpc0NmZy5yLmN1cnIgPSBjdXJyT3B0cy5yO1xyXG4gICAgICAgIHRoaXNDZmcuci5tYXggPSB0aGlzQ2ZnLnIuY3VyciAqIDI7XHJcblxyXG4gICAgICAgICQoICcjJyt0aGlzQ2ZnLnIuaWQgKVxyXG4gICAgICAgICAgICAuYXR0cigge1xyXG4gICAgICAgICAgICAgICAgICAgICdtaW4nOiB0aGlzQ2ZnLnIubWluLFxyXG4gICAgICAgICAgICAgICAgICAgICdtYXgnOiB0aGlzQ2ZnLnIubWF4LFxyXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IHRoaXNDZmcuci5jdXJyXHJcbiAgICAgICAgICAgICAgICB9IClcclxuICAgICAgICAgICAgICAgIC5wcm9wKCB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21pbic6IHRoaXNDZmcuci5taW4sXHJcbiAgICAgICAgICAgICAgICAgICAgJ21heCc6IHRoaXNDZmcuci5tYXgsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogdGhpc0NmZy5yLmN1cnJcclxuICAgICAgICAgICAgICAgIH0gKVxyXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoICcuY29udHJvbC0tcGFuZWxfX2l0ZW0nIClcclxuICAgICAgICAgICAgICAgIC5maW5kKCAnb3V0cHV0JyApXHJcbiAgICAgICAgICAgICAgICAuaHRtbCggdGhpc0NmZy5yLmN1cnIgKTtcclxuXHJcbiAgICAgICAgdGhpc0NmZy5tYWpvclJheUxlbi5jdXJyID0gY3Vyck9wdHMubWFqb3JSYXlMZW47XHJcblxyXG4gICAgICAgICQoICcjJyt0aGlzQ2ZnLm1ham9yUmF5TGVuLmlkIClcclxuICAgICAgICAgICAgLmF0dHIoIHtcclxuICAgICAgICAgICAgICAgICAgICAnbWluJzogdGhpc0NmZy5tYWpvclJheUxlbi5taW4sXHJcbiAgICAgICAgICAgICAgICAgICAgJ21heCc6IHRoaXNDZmcubWFqb3JSYXlMZW4ubWF4LFxyXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IHRoaXNDZmcubWFqb3JSYXlMZW4uY3VyclxyXG4gICAgICAgICAgICAgICAgfSApXHJcbiAgICAgICAgICAgICAgICAucHJvcCgge1xyXG4gICAgICAgICAgICAgICAgICAgICdtaW4nOiB0aGlzQ2ZnLm1ham9yUmF5TGVuLm1pbixcclxuICAgICAgICAgICAgICAgICAgICAnbWF4JzogdGhpc0NmZy5tYWpvclJheUxlbi5tYXgsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogdGhpc0NmZy5tYWpvclJheUxlbi5jdXJyXHJcbiAgICAgICAgICAgICAgICB9IClcclxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KCAnLmNvbnRyb2wtLXBhbmVsX19pdGVtJyApXHJcbiAgICAgICAgICAgICAgICAuZmluZCggJ291dHB1dCcgKVxyXG4gICAgICAgICAgICAgICAgLmh0bWwoIHRoaXNDZmcubWFqb3JSYXlMZW4uY3VyciApO1xyXG5cclxuICAgICAgICB0aGlzQ2ZnLm1pbm9yUmF5TGVuLmN1cnIgPSBjdXJyT3B0cy5taW5vclJheUxlbjtcclxuXHJcbiAgICAgICAgJCggJyMnK3RoaXNDZmcubWlub3JSYXlMZW4uaWQgKVxyXG4gICAgICAgICAgICAuYXR0cigge1xyXG4gICAgICAgICAgICAgICAgICAgICdtaW4nOiB0aGlzQ2ZnLm1pbm9yUmF5TGVuLm1pbixcclxuICAgICAgICAgICAgICAgICAgICAnbWF4JzogdGhpc0NmZy5taW5vclJheUxlbi5tYXgsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogdGhpc0NmZy5taW5vclJheUxlbi5jdXJyXHJcbiAgICAgICAgICAgICAgICB9IClcclxuICAgICAgICAgICAgICAgIC5wcm9wKCB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21pbic6IHRoaXNDZmcubWlub3JSYXlMZW4ubWluLFxyXG4gICAgICAgICAgICAgICAgICAgICdtYXgnOiB0aGlzQ2ZnLm1pbm9yUmF5TGVuLm1heCxcclxuICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiB0aGlzQ2ZnLm1pbm9yUmF5TGVuLmN1cnJcclxuICAgICAgICAgICAgICAgIH0gKVxyXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoICcuY29udHJvbC0tcGFuZWxfX2l0ZW0nIClcclxuICAgICAgICAgICAgICAgIC5maW5kKCAnb3V0cHV0JyApXHJcbiAgICAgICAgICAgICAgICAuaHRtbCggdGhpc0NmZy5taW5vclJheUxlbi5jdXJyICk7XHJcblxyXG4gICAgICAgIHRoaXNDZmcuY291bnQuY3VyciA9IGN1cnJPcHRzLmNvdW50O1xyXG5cclxuICAgICAgICAkKCAnIycrdGhpc0NmZy5jb3VudC5pZCApXHJcbiAgICAgICAgICAgIC5hdHRyKCB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21pbic6IHRoaXNDZmcuY291bnQubWluLFxyXG4gICAgICAgICAgICAgICAgICAgICdtYXgnOiB0aGlzQ2ZnLmNvdW50Lm1heCxcclxuICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiB0aGlzQ2ZnLmNvdW50LmN1cnJcclxuICAgICAgICAgICAgICAgIH0gKVxyXG4gICAgICAgICAgICAgICAgLnByb3AoIHtcclxuICAgICAgICAgICAgICAgICAgICAnbWluJzogdGhpc0NmZy5jb3VudC5taW4sXHJcbiAgICAgICAgICAgICAgICAgICAgJ21heCc6IHRoaXNDZmcuY291bnQubWF4LFxyXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IHRoaXNDZmcuY291bnQuY3VyclxyXG4gICAgICAgICAgICAgICAgfSApXHJcbiAgICAgICAgICAgICAgICAuY2xvc2VzdCggJy5jb250cm9sLS1wYW5lbF9faXRlbScgKVxyXG4gICAgICAgICAgICAgICAgLmZpbmQoICdvdXRwdXQnIClcclxuICAgICAgICAgICAgICAgIC5odG1sKCB0aGlzQ2ZnLmNvdW50LmN1cnIgKTtcclxuXHJcbiAgICAgICAgdGhpc0NmZy5ibHVyLmN1cnIgPSBjdXJyT3B0cy5ibHVyO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnY3Vyck9wdHMuYmx1cjogJywgY3Vyck9wdHMuYmx1ciApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAndGhpc0NmZy5ibHVyLmN1cnI6ICcsIHRoaXNDZmcuYmx1ci5jdXJyICk7XHJcbiAgICAgICAgJCggJyMnK3RoaXNDZmcuYmx1ci5pZCApXHJcbiAgICAgICAgICAgIC5hdHRyKCB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21pbic6IHRoaXNDZmcuYmx1ci5taW4sXHJcbiAgICAgICAgICAgICAgICAgICAgJ21heCc6IHRoaXNDZmcuYmx1ci5tYXgsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogdGhpc0NmZy5ibHVyLmN1cnJcclxuICAgICAgICAgICAgICAgIH0gKVxyXG4gICAgICAgICAgICAgICAgLnByb3AoIHtcclxuICAgICAgICAgICAgICAgICAgICAnbWluJzogdGhpc0NmZy5ibHVyLm1pbixcclxuICAgICAgICAgICAgICAgICAgICAnbWF4JzogdGhpc0NmZy5ibHVyLm1heCxcclxuICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiB0aGlzQ2ZnLmJsdXIuY3VyclxyXG4gICAgICAgICAgICAgICAgfSApXHJcbiAgICAgICAgICAgICAgICAuY2xvc2VzdCggJy5jb250cm9sLS1wYW5lbF9faXRlbScgKVxyXG4gICAgICAgICAgICAgICAgLmZpbmQoICdvdXRwdXQnIClcclxuICAgICAgICAgICAgICAgIC5odG1sKCB0aGlzQ2ZnLmJsdXIuY3VyciApO1xyXG5cclxuICAgICAgICB0aGlzQ2ZnLm1ham9yUmF5V2lkdGguY3VyciA9IGN1cnJPcHRzLm1ham9yUmF5V2lkdGggKiB0aGlzQ2ZnLm1ham9yUmF5V2lkdGgubWF4O1xyXG4gICAgICAgICQoICcjJyt0aGlzQ2ZnLm1ham9yUmF5V2lkdGguaWQgKVxyXG4gICAgICAgICAgICAuYXR0cigge1xyXG4gICAgICAgICAgICAgICAgICAgICdtaW4nOiAtdGhpc0NmZy5tYWpvclJheVdpZHRoLm1heCxcclxuICAgICAgICAgICAgICAgICAgICAnbWF4JzogdGhpc0NmZy5tYWpvclJheVdpZHRoLm1heCxcclxuICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiB0aGlzQ2ZnLm1ham9yUmF5V2lkdGguY3VyclxyXG4gICAgICAgICAgICAgICAgfSApXHJcbiAgICAgICAgICAgICAgICAucHJvcCgge1xyXG4gICAgICAgICAgICAgICAgICAgICdtaW4nOiAtdGhpc0NmZy5tYWpvclJheVdpZHRoLm1heCxcclxuICAgICAgICAgICAgICAgICAgICAnbWF4JzogdGhpc0NmZy5tYWpvclJheVdpZHRoLm1heCxcclxuICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiB0aGlzQ2ZnLm1ham9yUmF5V2lkdGguY3VyclxyXG4gICAgICAgICAgICAgICAgfSApXHJcbiAgICAgICAgICAgICAgICAuY2xvc2VzdCggJy5jb250cm9sLS1wYW5lbF9faXRlbScgKVxyXG4gICAgICAgICAgICAgICAgLmZpbmQoICdvdXRwdXQnIClcclxuICAgICAgICAgICAgICAgIC5odG1sKCB0aGlzQ2ZnLm1ham9yUmF5V2lkdGguY3VyciApO1xyXG5cclxuICAgICAgICB0aGlzQ2ZnLm1pbm9yUmF5V2lkdGguY3VyciA9IGN1cnJPcHRzLm1pbm9yUmF5V2lkdGggKiB0aGlzQ2ZnLm1pbm9yUmF5V2lkdGgubWF4O1xyXG4gICAgICAgICQoICcjJyt0aGlzQ2ZnLm1pbm9yUmF5V2lkdGguaWQgKVxyXG4gICAgICAgICAgICAuYXR0cigge1xyXG4gICAgICAgICAgICAgICAgICAgICdtaW4nOiAtdGhpc0NmZy5taW5vclJheVdpZHRoLm1pbixcclxuICAgICAgICAgICAgICAgICAgICAnbWF4JzogdGhpc0NmZy5taW5vclJheVdpZHRoLm1heCxcclxuICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiB0aGlzQ2ZnLm1pbm9yUmF5V2lkdGguY3VyclxyXG4gICAgICAgICAgICAgICAgfSApXHJcbiAgICAgICAgICAgICAgICAucHJvcCgge1xyXG4gICAgICAgICAgICAgICAgICAgICdtaW4nOiAtdGhpc0NmZy5taW5vclJheVdpZHRoLm1pbixcclxuICAgICAgICAgICAgICAgICAgICAnbWF4JzogdGhpc0NmZy5taW5vclJheVdpZHRoLm1heCxcclxuICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiB0aGlzQ2ZnLm1pbm9yUmF5V2lkdGguY3VyclxyXG4gICAgICAgICAgICAgICAgfSApXHJcbiAgICAgICAgICAgICAgICAuY2xvc2VzdCggJy5jb250cm9sLS1wYW5lbF9faXRlbScgKVxyXG4gICAgICAgICAgICAgICAgLmZpbmQoICdvdXRwdXQnIClcclxuICAgICAgICAgICAgICAgIC5odG1sKCB0aGlzQ2ZnLm1pbm9yUmF5V2lkdGguY3VyciApO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbGVhclJlbmRlckN0eDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHJlbmRlckNmZyA9IHRoaXMucmVuZGVyQ2ZnO1xyXG4gICAgICAgIHJlbmRlckNmZy5jb250ZXh0LmNsZWFyUmVjdChcclxuICAgICAgICAgICAgMCwgMCwgcmVuZGVyQ2ZnLmNhbnZhcy53aWR0aCwgcmVuZGVyQ2ZnLmNhbnZhcy5oZWlnaHRcclxuXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxudmFyIHJhbmRvbVcgPSBbXTtcclxudmFyIHJhbmRvbUggPSBbXTtcclxuXHJcbmZvciAodmFyIGkgPSAxMDA7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICByYW5kb21XLnB1c2goIHJhbmRJKCAxMDAsIDIwMCApICk7XHJcbn1cclxuXHJcbmZvciAodmFyIGkgPSAxMDA7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICByYW5kb21ILnB1c2goIHJhbmRJKCAyMCwgMTAwICkgKTtcclxufVxyXG5cclxuc3VuU3Bpa2VzLnJlbmRlciA9IGZ1bmN0aW9uKCB4LCB5LCBpbWdlQ2ZnLCBjdHggKSB7XHJcblxyXG4gICAgY29uc3QgaW1hZ2UgPSBpbWdlQ2ZnO1xyXG4gICAgbGV0IGN1cnJSb3RhdGlvbiA9IHRoaXMuaGFsZlJvdGF0aW9uO1xyXG5cclxuICAgIGN0eC50cmFuc2xhdGUoIHgsIHkgKTtcclxuXHJcbiAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBudW1zcGlrZTsgaSsrICkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGN0eC5yb3RhdGUoIGN1cnJSb3RhdGlvbiApO1xyXG5cclxuICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICAvLyBzb3VyY2VcclxuICAgICAgICAgICAgaW1hZ2UuY2FudmFzLCBpbWFnZS54LCBpbWFnZS55LCBpbWFnZS53LCBpbWFnZS5oLFxyXG4gICAgICAgICAgICAvLyBkZXN0aW5hdGlvblxyXG4gICAgICAgICAgICAwLCAtaW1hZ2UuaCAvIDIsIGltYWdlLncsIGltYWdlLmhcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5yb3RhdGUoIC1jdXJyUm90YXRpb24gKTtcclxuICAgICAgICBjdXJyUm90YXRpb24gKz0gdGhpcy5yb3RhdGlvbjsgIFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjdHgudHJhbnNsYXRlKCAteCwgLXkgKTtcclxufVxyXG5cclxuc3VuU3Bpa2VzLnJlbmRlclJhaW5ib3dTcGlrZXMgPSBmdW5jdGlvbiggb3B0aW9ucywgY29udGV4dCApIHtcclxuXHJcbiAgICBjb25zdCBjdHggPSBjb250ZXh0O1xyXG4gICAgY29uc3QgZGVidWdDb25maWcgPSB0aGlzLnJlbmRlckNmZy5kZWJ1Z0NmZztcclxuICAgIGNvbnN0IGJhc2VPcHRzID0gdGhpcy5nbGFyZVNwaWtlT3B0aW9ucztcclxuICAgIGNvbnN0IG9wdHMgPSBvcHRpb25zO1xyXG4gICAgY29uc29sZS5sb2coICdvcHRzOiAnLCBvcHRzICk7XHJcbiAgICAvLyBjb25maWd1cmF0aW9uXHJcbiAgICBjb25zdCB4ID0gb3B0cy54IHx8IGJhc2VPcHRzLnggfHwgY3R4LndpZHRoIC8gMjtcclxuICAgIGNvbnN0IHkgPSBvcHRzLnkgfHwgYmFzZU9wdHMueTtcclxuICAgIGNvbnN0IGEgPSBvcHRzLmFuZ2xlIHx8IGJhc2VPcHRzLmFuZ2xlO1xyXG4gICAgY29uc3QgZCA9IG9wdHMuZCB8fCBiYXNlT3B0cy5kIHx8IDIwMDtcclxuICAgIGNvbnN0IG51bVJheXMgPSBvcHRzLmNvdW50IHx8IGJhc2VPcHRzLmNvdW50IHx8IDQ7XHJcbiAgICBjb25zdCBudW1SYXlzTXVsdGlwbGUgPSBudW1SYXlzICogMjtcclxuXHJcbiAgICBjb25zdCBiYXNlUiA9IG9wdHMuciB8fCBiYXNlT3B0cy5yIHx8IDE1MDtcclxuICAgIGNvbnN0IGN1cnZlUiA9IG9wdHMuY3VydmVSIHx8IGJhc2VPcHRzLmN1cnZlUiB8fCBiYXNlUjtcclxuXHJcbiAgICBjb25zdCBpbWFnZSA9IG9wdHMuaW1hZ2VDZmc7XHJcbiAgICBjb25zdCBpbWdTcmMgPSBpbWFnZS5zcmM7XHJcbiAgICBsZXQgYW10ID0gbnVtUmF5cztcclxuICAgIGxldCByb3RhdGlvbiA9ICggMiAqIE1hdGguUEkgLyBhbXQgKTtcclxuICAgIC8vIGxldCBoYWxmUm90YXRpb24gPSAoIDIgKiBNYXRoLlBJIC8gYW10ICkgLyAyO1xyXG4gICAgbGV0IGN1cnJSb3RhdGlvbiA9IHJvdGF0aW9uO1xyXG4gICAgbGV0IHdpZHRoU2NhbGUgPSBpbWFnZS53ICogMjtcclxuICAgIGxldCBoZWlnaHRTY2FsZSA9IGltYWdlLmggKiAzO1xyXG5cclxuICAgIGxldCBjdXJyQmxlbmQgPSBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uO1xyXG5cclxuXHJcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSAwLjY7XHJcbiAgICAvLyBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2h1ZSc7XHJcblxyXG4gICAgY3R4LnRyYW5zbGF0ZSggeCwgeSApO1xyXG4gICAgY3R4LnJvdGF0ZSggLWEgKTtcclxuICAgIGZvciAoIGxldCBpID0gMDsgaSA8IGFtdDsgaSsrICkge1xyXG4gICAgICAgIGN0eC5yb3RhdGUoIGN1cnJSb3RhdGlvbiApO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmVkJztcclxuICAgICAgICBjdHguZmlsbENpcmNsZSggMCwgMCwgMTAgKTtcclxuICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICAvLyBzb3VyY2VcclxuICAgICAgICAgICAgaW1nU3JjLCAwLCAwLCBpbWFnZS53LCBpbWFnZS5oLFxyXG4gICAgICAgICAgICAvLyBkZXN0aW5hdGlvblxyXG4gICAgICAgICAgICBkLCAtKCBoZWlnaHRTY2FsZS8yICksIHdpZHRoU2NhbGUsIGhlaWdodFNjYWxlXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHgucm90YXRlKCAtY3VyclJvdGF0aW9uICk7XHJcbiAgICAgICAgY3VyclJvdGF0aW9uICs9IHJvdGF0aW9uOyAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBjdHgucm90YXRlKCBhICk7XHJcbiAgICBjdHgudHJhbnNsYXRlKCAteCwgLXkgKTtcclxuXHJcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSAxO1xyXG5cclxuICAgIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBjdXJyQmxlbmQ7XHJcblxyXG4gICAgLy8gb3V0cHV0IGNvbmZpZyBmb3IgcmVuZGVyc1xyXG4gICAgdGhpcy5kaXNwbGF5Q2ZnLnJhaW5ib3dTcGlrZXMgPSB7XHJcbiAgICAgICAgeDogeCAtICggZCArIHdpZHRoU2NhbGUgKSxcclxuICAgICAgICB5OiB5IC0gKCBkICsgd2lkdGhTY2FsZSApLCBcclxuICAgICAgICB3OiAoIGQgKiAyICkgKyAoIHdpZHRoU2NhbGUgKiAyICksXHJcbiAgICAgICAgaDogKCBkICogMiApICsgKCB3aWR0aFNjYWxlICogMiApXHJcbiAgICB9XHJcbn1cclxuXHJcbnN1blNwaWtlcy5jbGVhckFzc2V0Q2FudmFzID0gZnVuY3Rpb24oIGN0eCwgY2FudmFzICkge1xyXG4gICAgY3R4LmNsZWFyUmVjdCggMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0ICk7XHJcbn1cclxuXHJcbnN1blNwaWtlcy5yZW5kZXJHbGFyZVNwaWtlcyA9IGZ1bmN0aW9uKCBvcHRpb25zICkge1xyXG5cclxuICAgIGNvbnN0IGN0eCA9IHRoaXMucmVuZGVyQ2ZnLmNvbnRleHQ7XHJcbiAgICBjb25zdCBkZWJ1Z0NvbmZpZyA9IHRoaXMucmVuZGVyQ2ZnLmRlYnVnQ2ZnXHJcbiAgICBjb25zdCBvcHRzID0gb3B0aW9ucyB8fCB0aGlzLmdsYXJlU3Bpa2VPcHRpb25zO1xyXG5cclxuICAgIC8vIGNvbmZpZ3VyYXRpb25cclxuICAgIGNvbnN0IHggPSBvcHRzLnggfHwgY3R4LndpZHRoIC8gMjtcclxuICAgIGNvbnN0IHkgPSBvcHRzLnk7XHJcbiAgICBjb25zdCBhID0gb3B0cy5hbmdsZSB8fCAwO1xyXG4gICAgY29uc3QgbnVtUmF5cyA9IG9wdHMuY291bnQgfHwgNDtcclxuICAgIGNvbnN0IG51bVJheXNNdWx0aXBsZSA9IG51bVJheXMgKiAyO1xyXG5cclxuICAgIGNvbnN0IGJhc2VSID0gb3B0cy5yIHx8IDE1MDtcclxuICAgIGNvbnN0IGN1cnZlUiA9IG9wdHMuY3VydmVSIHx8IGJhc2VSO1xyXG5cclxuICAgIGNvbnN0IG1ham9yUmF5TGVuID0gYmFzZVIgKyBvcHRzLm1ham9yUmF5TGVuIHx8IGJhc2VSICsgMzAwO1xyXG4gICAgY29uc3QgbWlub3JSYXlMZW4gPSBiYXNlUiArIG9wdHMubWlub3JSYXlMZW4gfHwgYmFzZVIgKyBvcHRzLm1ham9yUmF5TGVuIC8gMiB8fCBiYXNlUiArIDE1MDtcclxuXHJcbiAgICBjb25zdCBtYWpvclJheUlucHV0RmxpcHBlZCA9IDEgLSBvcHRzLm1ham9yUmF5V2lkdGg7XHJcbiAgICBjb25zdCBtaW5vclJheUlucHV0RmxpcHBlZCA9IDEgLSBvcHRzLm1pbm9yUmF5V2lkdGg7XHJcbiAgICBjb25zdCBtYXhSYXlXaWR0aCA9IHR3b1BpIC8gbnVtUmF5c011bHRpcGxlO1xyXG4gICAgY29uc3QgbWFqb3JSYXlXaWR0aCA9IG1ham9yUmF5SW5wdXRGbGlwcGVkICogbWF4UmF5V2lkdGg7XHJcbiAgICBjb25zdCBtaW5vclJheVdpZHRoID0gbWlub3JSYXlJbnB1dEZsaXBwZWQgKiBtYXhSYXlXaWR0aDtcclxuXHJcbiAgICBjb25zdCBibHVyID0gb3B0cy5ibHVyIHx8IDEwO1xyXG5cclxuICAgIGNvbnN0IHNoYWRvd1JlbmRlck9mZnNldCA9IGRlYnVnQ29uZmlnLmRpc3BsYXlHbGFyZVNwaWtlcyA9PT0gZmFsc2UgPyAxMDAwMDAgOiAwO1xyXG4gICAgXHJcbiAgICBsZXQgZmxpcHBlciA9IHRydWU7XHJcblxyXG4gICAgLy8gZHJhd2luZ1xyXG4gICAgY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdzb3VyY2Utb3Zlcic7XHJcbiAgICBjdHgudHJhbnNsYXRlKCB4LCB5IC0gc2hhZG93UmVuZGVyT2Zmc2V0ICk7XHJcbiAgICBjdHgucm90YXRlKCAtYSApO1xyXG4gXHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBudW1SYXlzTXVsdGlwbGU7IGkrKyApIHtcclxuXHJcbiAgICAgICAgbGV0IGlOdW1SYXlzID0gaSAvIG51bVJheXM7XHJcbiAgICAgICAgbGV0IGlOdW1SYXlzTXVsdGkgPSBpIC8gbnVtUmF5c011bHRpcGxlO1xyXG5cclxuICAgICAgICBsZXQgYWxwaGEgPSB0d29QaSAqICggaSAvICggbnVtUmF5c011bHRpcGxlICkgKTtcclxuICAgICAgICBsZXQgYWxwaGEyID0gdHdvUGkgKiAoICggaSArIDEgKSAvICggbnVtUmF5c011bHRpcGxlICkgKTtcclxuXHJcbiAgICAgICAgbGV0IGFscGhhTWlkUG9pbnQgPSBhbHBoYSArICggdHdvUGkgKiBudW1SYXlzTXVsdGlwbGUgKTtcclxuXHJcbiAgICAgICAgbGV0IGN1cnZlMUFscGhhID0gYWxwaGFNaWRQb2ludCAtICggZmxpcHBlciA/IG1pbm9yUmF5V2lkdGggOiBtYWpvclJheVdpZHRoICk7XHJcbiAgICAgICAgbGV0IGN1cnZlMkFscGhhID0gYWxwaGFNaWRQb2ludCArICggZmxpcHBlciA/IG1ham9yUmF5V2lkdGggOiBtaW5vclJheVdpZHRoICk7XHJcblxyXG4gICAgICAgIGxldCBmbGlwcGVkUmF5U2l6ZSA9IGZsaXBwZXIgPyBtYWpvclJheUxlbiA6IG1pbm9yUmF5TGVuO1xyXG5cclxuICAgICAgICBpZiAoIGkgPT09IDAgKSB7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oXHJcbiAgICAgICAgICAgICAgICBNYXRoLmNvcyggYWxwaGEgKSAqIGZsaXBwZWRSYXlTaXplLFxyXG4gICAgICAgICAgICAgICAgTWF0aC5zaW4oIGFscGhhICkgKiBmbGlwcGVkUmF5U2l6ZSxcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGN0eC5iZXppZXJDdXJ2ZVRvKFxyXG4gICAgICAgICAgICAgICAgTWF0aC5jb3MoIGN1cnZlMUFscGhhICkgKiBjdXJ2ZVIsIE1hdGguc2luKCBjdXJ2ZTFBbHBoYSApICogY3VydmVSLFxyXG4gICAgICAgICAgICAgICAgTWF0aC5jb3MoIGN1cnZlMkFscGhhICkgKiBjdXJ2ZVIsIE1hdGguc2luKCBjdXJ2ZTJBbHBoYSApICogY3VydmVSLFxyXG4gICAgICAgICAgICAgICAgTWF0aC5jb3MoIGFscGhhMiApICogZmxpcHBlZFJheVNpemUsXHJcbiAgICAgICAgICAgICAgICBNYXRoLnNpbiggYWxwaGEyICkgKiBmbGlwcGVkUmF5U2l6ZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZmxpcHBlciA9ICFmbGlwcGVyO1xyXG5cclxuICAgICAgICBpZiAoIGkgPT09IG51bVJheXNNdWx0aXBsZSAtIDEgKSB7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuXHJcblxyXG4gICAgaWYgKCAhZGVidWdDb25maWcuZGlzcGxheUdsYXJlU3Bpa2VzICkge1xyXG4gICAgICAgIGN0eC5zaGFkb3dDb2xvciA9ICd3aGl0ZSc7XHJcbiAgICAgICAgY3R4LnNoYWRvd0JsdXIgPSBibHVyO1xyXG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMDtcclxuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IHNoYWRvd1JlbmRlck9mZnNldDtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JlZCc7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5yb3RhdGUoIGEgKTtcclxuICAgIGN0eC50cmFuc2xhdGUoIC14LCAteSArIHNoYWRvd1JlbmRlck9mZnNldCApO1xyXG5cclxuICAgIC8vIGRlYnVnIGRpc3BsYXlcclxuXHJcbiAgICBsZXQgZGVidWdGbGlwcGVyID0gdHJ1ZTtcclxuICAgIGxldCBkZWJ1Z0N1cnZlUiA9IGN1cnZlUjtcclxuICAgIGxldCBkZWJ1Z1RleHRPZmZzZXQgPSAzMDtcclxuXHJcbiAgICBpZiAoIGRlYnVnQ29uZmlnLmRpc3BsYXlHbGFyZVNwaWtlcyApIHtcclxuICAgICAgICBjdHgudHJhbnNsYXRlKCB4LCB5ICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY3R4LmZvbnQgPSBcIm5vcm1hbCAxNHB4IFRhaG9tYVwiO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcIiM2NjY2NjZcIjtcclxuICAgICAgICBjdHguc2V0TGluZURhc2goIFsgMSwgNiBdICk7XHJcblxyXG4gICAgICAgIGN0eC5zdHJva2VDaXJjbGUoIDAsIDAsIGJhc2VSICk7XHJcbiAgICAgICAgLy8gY3R4LmZpbGxUZXh0KCAnUmFkaXVzJywgYmFzZVIgKyAxMCwgMCApO1xyXG5cclxuICAgICAgICBjdHguc3Ryb2tlQ2lyY2xlKCAwLCAwLCBkZWJ1Z0N1cnZlUiApO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dCggJ0N1cnZlIFBvaW50IFJhZGl1cycsIGRlYnVnQ3VydmVSICsgMTAsIDAgKTtcclxuXHJcbiAgICAgICAgY3R4LnN0cm9rZUNpcmNsZSggMCwgMCwgbWlub3JSYXlMZW4gKTtcclxuICAgICAgICBjdHguZmlsbFRleHQoICdNaW5vciBTcGlrZSBSYWRpdXMnLCBtaW5vclJheUxlbiArIDEwLCAwICk7XHJcblxyXG4gICAgICAgIGN0eC5zdHJva2VDaXJjbGUoIDAsIDAsIG1ham9yUmF5TGVuICk7XHJcbiAgICAgICAgbGV0IHRleHRNZXRyaWNzID0gY3R4Lm1lYXN1cmVUZXh0KFwiTWFqb3IgU3Bpa2UgUmFkaXVzXCIpO1xyXG4gICAgICAgIGxldCB0ZXh0VyA9IHRleHRNZXRyaWNzLndpZHRoICsgMTA7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KCAnTWFqb3IgU3Bpa2UgUmFkaXVzJywgbWFqb3JSYXlMZW4gLSB0ZXh0VywgMCApO1xyXG5cclxuICAgICAgICBjdHguc2V0TGluZURhc2goIFtdICk7XHJcblxyXG4gICAgICAgIGN0eC5yb3RhdGUoIC1hICk7XHJcblxyXG4gICAgICAgIGN0eC5mb250ID0gXCJub3JtYWwgMTRweCBUYWhvbWFcIjtcclxuXHJcbiAgICAgICAgLy8gcG9pbnRzIGFuZCBsaW5lc1xyXG4gICAgICAgIGZvciAoIGxldCBpID0gMDsgaSA8IG51bVJheXNNdWx0aXBsZTsgaSsrICkge1xyXG5cclxuICAgICAgICAgICAgbGV0IGlOdW1SYXlzID0gaSAvIG51bVJheXM7XHJcbiAgICAgICAgICAgIGxldCBpTnVtUmF5c011bHRpID0gaSAvIG51bVJheXNNdWx0aXBsZTtcclxuICAgICAgICAgICAgbGV0IGFscGhhID0gdHdvUGkgKiAoIGkgLyAoIG51bVJheXNNdWx0aXBsZSApICk7XHJcbiAgICAgICAgICAgIGxldCBhbHBoYTIgPSB0d29QaSAqICggKCBpICsgMSApIC8gKCBudW1SYXlzTXVsdGlwbGUgKSApO1xyXG5cclxuICAgICAgICAgICAgbGV0IGFscGhhTWlkUG9pbnQgPSBhbHBoYSArICggdHdvUGkgKiBudW1SYXlzTXVsdGlwbGUgKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjdXJ2ZTFBbHBoYSA9IGFscGhhTWlkUG9pbnQgLSAoIGRlYnVnRmxpcHBlciA/IG1pbm9yUmF5V2lkdGggOiBtYWpvclJheVdpZHRoICk7XHJcbiAgICAgICAgICAgIGxldCBjdXJ2ZTJBbHBoYSA9IGFscGhhTWlkUG9pbnQgKyAoIGRlYnVnRmxpcHBlciA/IG1ham9yUmF5V2lkdGggOiBtaW5vclJheVdpZHRoICk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGVidWdMaW5lQWxwaGEgPSB0d29QaSAqICggaSAvIG51bVJheXNNdWx0aXBsZSApO1xyXG4gICAgICAgICAgICBsZXQgZGVidWdGbGlwcGVkUmF5U2l6ZSA9IGRlYnVnRmxpcHBlciA/IG1ham9yUmF5TGVuIDogbWlub3JSYXlMZW47XHJcblxyXG4gICAgICAgICAgICBpZiAoIGkgPT09IDAgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZmlyc3QgcG9pbnRcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSggMjU1LCAwLCAwLCAxICknO1xyXG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoIDI1NSwgMCwgMCwgMSApJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsQ2lyY2xlKFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguY29zKCBhbHBoYSApICogZGVidWdGbGlwcGVkUmF5U2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpbiggYWxwaGEgKSAqIGRlYnVnRmxpcHBlZFJheVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgNVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZSggXHJcbiAgICAgICAgICAgICAgICAgICAgMCwgMCwgXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5jb3MoIGFscGhhICkgKiBkZWJ1Z0ZsaXBwZWRSYXlTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2luKCBhbHBoYSApICogZGVidWdGbGlwcGVkUmF5U2l6ZVxyXG4gICAgICAgICAgICAgICAgKVxyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCggaSwgTWF0aC5jb3MoIGFscGhhICkgKiAoIGRlYnVnRmxpcHBlciA/IG1ham9yUmF5TGVuIDogbWlub3JSYXlMZW4gKyBkZWJ1Z1RleHRPZmZzZXQgKSxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpbiggYWxwaGEgKSAqIGRlYnVnRmxpcHBlZFJheVNpemUgKyBkZWJ1Z1RleHRPZmZzZXQgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY2VudHJlIGFuZ2xlIG9mIGNvbnRyb2wgcG9pbnRzXHJcbiAgICAgICAgICAgICAgICBjdHguc2V0TGluZURhc2goIFsgMSwgNiBdICk7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZSggMCwgMCwgTWF0aC5jb3MoIGFscGhhTWlkUG9pbnQgKSAqIG1ham9yUmF5TGVuLCBNYXRoLnNpbiggYWxwaGFNaWRQb2ludCApICogbWFqb3JSYXlMZW4gKTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2VDaXJjbGUoIDAsIDAsIGN1cnZlUiApO1xyXG4gICAgICAgICAgICAgICAgY3R4LnNldExpbmVEYXNoKCBbXSApO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBmaXJzdCBjb250cm9sIHBvaW50IG9mIGN1cnZlICggbWludXMgZnJvbSBjZW50cmUgcG9pbnQgKVxyXG4gICAgICAgICAgICAgICAgaWYgKCBkZWJ1Z0ZsaXBwZXIgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdncmVlbic7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ2dyZWVuJztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibHVlJztcclxuICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnYmx1ZSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxDaXJjbGUoIE1hdGguY29zKCBjdXJ2ZTFBbHBoYSApICogZGVidWdDdXJ2ZVIsIE1hdGguc2luKCBjdXJ2ZTFBbHBoYSApICogZGVidWdDdXJ2ZVIsXHJcbiAgICAgICAgICAgICAgICAgICAgM1xyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZSggMCwgMCwgTWF0aC5jb3MoIGN1cnZlMUFscGhhICkgKiBkZWJ1Z0N1cnZlUiwgTWF0aC5zaW4oIGN1cnZlMUFscGhhICkgKiBkZWJ1Z0N1cnZlUiApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGN0eC5maWxsVGV4dCggaSwgTWF0aC5jb3MoIGN1cnZlMUFscGhhICkgKiAoIGRlYnVnQ3VydmVSICsgZGVidWdUZXh0T2Zmc2V0ICksIE1hdGguc2luKCBjdXJ2ZTFBbHBoYSApICogKCBkZWJ1Z0N1cnZlUiArIGRlYnVnVGV4dE9mZnNldCApICk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBzZWNvbmQgY29udHJvbCBwb2ludCBvZiBjdXJ2ZSAoIHBsdXMgZnJvbSBjZW50cmUgcG9pbnQgKVxyXG4gICAgICAgICAgICAgICAgaWYgKCAhZGVidWdGbGlwcGVyICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnZ3JlZW4nO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdncmVlbic7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmx1ZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ2JsdWUnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5maWxsQ2lyY2xlKFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguY29zKCBjdXJ2ZTJBbHBoYSApICogZGVidWdDdXJ2ZVIsIE1hdGguc2luKCBjdXJ2ZTJBbHBoYSApICogZGVidWdDdXJ2ZVIsXHJcbiAgICAgICAgICAgICAgICAgICAgM1xyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAvLyBjdHguZmlsbFRleHQoIGksIE1hdGguY29zKCBjdXJ2ZTJBbHBoYSApICogKCBkZWJ1Z0N1cnZlUiArIGRlYnVnVGV4dE9mZnNldCApLCBNYXRoLnNpbiggY3VydmUyQWxwaGEgKSAqICggZGVidWdDdXJ2ZVIgKyBkZWJ1Z1RleHRPZmZzZXQgKSApO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmUoIDAsIDAsIE1hdGguY29zKCBjdXJ2ZTJBbHBoYSApICogZGVidWdDdXJ2ZVIsIE1hdGguc2luKCBjdXJ2ZTJBbHBoYSApICogZGVidWdDdXJ2ZVIgKTtcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGVuZCBwb2ludCBvZiBjdXJ2ZVxyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKCAyNTUsIDAsIDAsIDEgKSc7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSggMjU1LCAwLCAwLCAxICknO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxDaXJjbGUoXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5jb3MoIGFscGhhMiApICogZGVidWdGbGlwcGVkUmF5U2l6ZSwgTWF0aC5zaW4oIGFscGhhMiApICogZGVidWdGbGlwcGVkUmF5U2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICA1XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChcclxuICAgICAgICAgICAgICAgICAgICBpICsgMSwgXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5jb3MoIGFscGhhMiApICogKCBkZWJ1Z0ZsaXBwZWRSYXlTaXplICsgZGVidWdUZXh0T2Zmc2V0ICksXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaW4oIGFscGhhMiApICogKCBkZWJ1Z0ZsaXBwZWRSYXlTaXplICsgZGVidWdUZXh0T2Zmc2V0IClcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZShcclxuICAgICAgICAgICAgICAgICAgICAwLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguY29zKCBhbHBoYTIgKSAqIGRlYnVnRmxpcHBlZFJheVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaW4oIGFscGhhMiApICogZGVidWdGbGlwcGVkUmF5U2l6ZVxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpICs9IDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRlYnVnRmxpcHBlciA9ICFkZWJ1Z0ZsaXBwZXI7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGkgPT09IG51bVJheXNNdWx0aXBsZSAtIDEgKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaHVsbHNcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnd2hpdGUnO1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcblxyXG4gICAgICAgIGxldCBodWxsRmxpcHBlciA9IHRydWU7XHJcbiAgICAgICAgZm9yICggbGV0IGkgPSAwOyBpIDwgbnVtUmF5c011bHRpcGxlOyBpKysgKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgaU51bVJheXMgPSBpIC8gbnVtUmF5cztcclxuICAgICAgICAgICAgbGV0IGlOdW1SYXlzTXVsdGkgPSBpIC8gbnVtUmF5c011bHRpcGxlO1xyXG4gICAgICAgICAgICBsZXQgYWxwaGEgPSB0d29QaSAqICggaSAvICggbnVtUmF5c011bHRpcGxlICkgKTtcclxuICAgICAgICAgICAgbGV0IGFscGhhMiA9IHR3b1BpICogKCAoIGkgKyAxICkgLyAoIG51bVJheXNNdWx0aXBsZSApICk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYWxwaGFNaWRQb2ludCA9IGFscGhhICsgKCB0d29QaSAqIG51bVJheXNNdWx0aXBsZSApO1xyXG5cclxuICAgICAgICAgICAgbGV0IGN1cnZlMUFscGhhID0gYWxwaGFNaWRQb2ludCAtICggaHVsbEZsaXBwZXIgPyBtaW5vclJheVdpZHRoIDogbWFqb3JSYXlXaWR0aCApO1xyXG4gICAgICAgICAgICBsZXQgY3VydmUyQWxwaGEgPSBhbHBoYU1pZFBvaW50ICsgKCBodWxsRmxpcHBlciA/IG1ham9yUmF5V2lkdGggOiBtaW5vclJheVdpZHRoICk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZmxpcHBlZFJheVNpemUgPSBodWxsRmxpcHBlciA/IG1ham9yUmF5TGVuIDogbWlub3JSYXlMZW47XHJcblxyXG4gICAgICAgICAgICBpZiAoIGkgPT09IDAgKSB7XHJcbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguY29zKCBhbHBoYSApICogZmxpcHBlZFJheVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaW4oIGFscGhhICkgKiBmbGlwcGVkUmF5U2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyggTWF0aC5jb3MoIGN1cnZlMUFscGhhICkgKiBjdXJ2ZVIsIE1hdGguc2luKCBjdXJ2ZTFBbHBoYSApICogY3VydmVSICk7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKCBNYXRoLmNvcyggY3VydmUyQWxwaGEgKSAqIGN1cnZlUiwgTWF0aC5zaW4oIGN1cnZlMkFscGhhICkgKiBjdXJ2ZVIgKTtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oIE1hdGguY29zKCBhbHBoYTIgKSAqIGZsaXBwZWRSYXlTaXplLCBNYXRoLnNpbiggYWxwaGEyICkgKiBmbGlwcGVkUmF5U2l6ZSApO1xyXG5cclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaHVsbEZsaXBwZXIgPSAhaHVsbEZsaXBwZXI7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGkgPT09IG51bVJheXNNdWx0aXBsZSAtIDEgKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgIGN0eC5zZXRMaW5lRGFzaCggW10gKTtcclxuXHJcblxyXG4gICAgICAgIGN0eC5yb3RhdGUoIGEgKTtcclxuICAgICAgICBjdHgudHJhbnNsYXRlKCAteCwgLXkgKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbWF4UmF5TGVuID0gbWFqb3JSYXlMZW4gPiBtaW5vclJheUxlbiA/IG1ham9yUmF5TGVuIDogbWlub3JSYXlMZW47XHJcblxyXG4gICAgLy8gb3V0cHV0IGNvbmZpZyBmb3IgcmVuZGVyc1xyXG4gICAgdGhpcy5kaXNwbGF5Q2ZnLmdsYXJlU3Bpa2VzID0ge1xyXG4gICAgICAgIHg6IHggLSBtYXhSYXlMZW4gLSAxMCxcclxuICAgICAgICB5OiB5IC0gbWF4UmF5TGVuIC0gMTAsIFxyXG4gICAgICAgIHc6IG1heFJheUxlbiAqIDIgKyAyMCxcclxuICAgICAgICBoOiBtYXhSYXlMZW4gKiAyICsgMjBcclxuICAgIH1cclxufVxyXG5cclxuc3VuU3Bpa2VzLnJlbmRlckdsYXJlU3Bpa2VzUmFuZG9tID0gZnVuY3Rpb24oIG9wdGlvbnMgKSB7XHJcblxyXG4gICAgY29uc3QgY3R4ID0gdGhpcy5yZW5kZXJDZmcuY29udGV4dDtcclxuICAgIGNvbnN0IGRlYnVnQ29uZmlnID0gdGhpcy5yZW5kZXJDZmcuZGVidWdDZmdcclxuICAgIGNvbnN0IG9wdHMgPSBvcHRpb25zIHx8IHRoaXMuZ2xhcmVTcGlrZVJhbmRvbU9wdGlvbnM7XHJcblxyXG4gICAgLy8gY29uZmlndXJhdGlvblxyXG4gICAgY29uc3QgeCA9IG9wdHMueCB8fCBjdHgud2lkdGggLyAyO1xyXG4gICAgY29uc3QgeSA9IG9wdHMueTtcclxuICAgIGNvbnN0IGEgPSBvcHRzLmFuZ2xlIHx8IDA7XHJcbiAgICBjb25zdCBudW1SYXlzID0gb3B0cy5jb3VudCB8fCA0O1xyXG4gICAgY29uc3QgbnVtUmF5c011bHRpcGxlID0gbnVtUmF5cyAqIDI7XHJcblxyXG4gICAgY29uc3QgYmFzZVIgPSBvcHRzLnIgfHwgMTUwO1xyXG4gICAgY29uc3QgY3VydmVSID0gb3B0cy5jdXJ2ZVIgfHwgYmFzZVI7XHJcblxyXG4gICAgbGV0IG1heFNpemUgPSBvcHRzLm1ham9yUmF5TGVuIHx8IDYwMDtcclxuICAgIGxldCBtaW5TaXplID0gb3B0cy5taW5vclJheUxlbiB8fCAzMDA7XHJcblxyXG4gICAgbGV0IHJhbmRvbVNpemUgPSBbXTsgXHJcbiAgICBmb3IgKHZhciBpID0gbnVtUmF5c011bHRpcGxlOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIHJhbmRvbVNpemUucHVzaCggcmFuZEkoIG1pblNpemUsIG1heFNpemUgKSApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbnN0IG1ham9yUmF5TGVuID0gYmFzZVIgKyBvcHRzLm1ham9yUmF5TGVuIHx8IGJhc2VSICsgMzAwO1xyXG4gICAgLy8gY29uc3QgbWlub3JSYXlMZW4gPSBiYXNlUiArIG9wdHMubWlub3JSYXlMZW4gfHwgYmFzZVIgKyBvcHRzLm1ham9yUmF5TGVuIC8gMiB8fCBiYXNlUiArIDE1MDtcclxuXHJcbiAgICBjb25zdCBtYWpvclJheUlucHV0RmxpcHBlZCA9IDEgLSBvcHRzLm1ham9yUmF5V2lkdGg7XHJcbiAgICBjb25zdCBtaW5vclJheUlucHV0RmxpcHBlZCA9IDEgLSBvcHRzLm1pbm9yUmF5V2lkdGg7XHJcbiAgICBjb25zdCBtYXhSYXlXaWR0aCA9IHR3b1BpIC8gbnVtUmF5c011bHRpcGxlO1xyXG4gICAgY29uc3QgbWFqb3JSYXlXaWR0aCA9IG1ham9yUmF5SW5wdXRGbGlwcGVkICogbWF4UmF5V2lkdGg7XHJcbiAgICBjb25zdCBtaW5vclJheVdpZHRoID0gbWlub3JSYXlJbnB1dEZsaXBwZWQgKiBtYXhSYXlXaWR0aDtcclxuXHJcbiAgICBjb25zdCBibHVyID0gb3B0cy5ibHVyIHx8IDEwO1xyXG5cclxuICAgIGNvbnN0IHNoYWRvd1JlbmRlck9mZnNldCA9IGRlYnVnQ29uZmlnLmRpc3BsYXlHbGFyZVNwaWtlcyA9PT0gZmFsc2UgPyAxMDAwMDAgOiAwO1xyXG4gICAgXHJcblxyXG5cclxuICAgIGxldCBmbGlwcGVyID0gdHJ1ZTtcclxuXHJcbiAgICAvLyBkcmF3aW5nXHJcbiAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ3NvdXJjZS1vdmVyJztcclxuICAgIGN0eC50cmFuc2xhdGUoIHgsIHkgLSBzaGFkb3dSZW5kZXJPZmZzZXQgKTtcclxuICAgIGN0eC5yb3RhdGUoIC1hICk7XHJcbiBcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGZvciAoIGxldCBpID0gMDsgaSA8IG51bVJheXNNdWx0aXBsZTsgaSsrICkge1xyXG5cclxuICAgICAgICBsZXQgaU51bVJheXMgPSBpIC8gbnVtUmF5cztcclxuICAgICAgICBsZXQgaU51bVJheXNNdWx0aSA9IGkgLyBudW1SYXlzTXVsdGlwbGU7XHJcblxyXG4gICAgICAgIGxldCBhbHBoYSA9IHR3b1BpICogKCBpIC8gKCBudW1SYXlzTXVsdGlwbGUgKSApO1xyXG4gICAgICAgIGxldCBhbHBoYTIgPSB0d29QaSAqICggKCBpICsgMSApIC8gKCBudW1SYXlzTXVsdGlwbGUgKSApO1xyXG5cclxuICAgICAgICBsZXQgYWxwaGFNaWRQb2ludCA9IGFscGhhICsgKCB0d29QaSAqIG51bVJheXNNdWx0aXBsZSApO1xyXG5cclxuICAgICAgICBsZXQgY3VydmUxQWxwaGEgPSBhbHBoYU1pZFBvaW50IC0gbWF4UmF5V2lkdGg7XHJcbiAgICAgICAgbGV0IGN1cnZlMkFscGhhID0gYWxwaGFNaWRQb2ludCArIG1heFJheVdpZHRoO1xyXG5cclxuICAgICAgICBpZiAoIGkgPT09IDAgKSB7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oXHJcbiAgICAgICAgICAgICAgICBNYXRoLmNvcyggYWxwaGEgKSAqICggYmFzZVIgKyByYW5kb21TaXplWyBpIF0gKSxcclxuICAgICAgICAgICAgICAgIE1hdGguc2luKCBhbHBoYSApICogKCBiYXNlUiArIHJhbmRvbVNpemVbIGkgXSApLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgY3R4LmJlemllckN1cnZlVG8oXHJcbiAgICAgICAgICAgICAgICBNYXRoLmNvcyggY3VydmUxQWxwaGEgKSAqIGN1cnZlUiwgTWF0aC5zaW4oIGN1cnZlMUFscGhhICkgKiBjdXJ2ZVIsXHJcbiAgICAgICAgICAgICAgICBNYXRoLmNvcyggY3VydmUyQWxwaGEgKSAqIGN1cnZlUiwgTWF0aC5zaW4oIGN1cnZlMkFscGhhICkgKiBjdXJ2ZVIsXHJcbiAgICAgICAgICAgICAgICBNYXRoLmNvcyggYWxwaGEyICkgKiAoIGJhc2VSICsgcmFuZG9tU2l6ZVsgaSArIDEgXSApLFxyXG4gICAgICAgICAgICAgICAgTWF0aC5zaW4oIGFscGhhMiApICogKCBiYXNlUiArIHJhbmRvbVNpemVbIGkgKyAxIF0gKVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyggKVxyXG4gICAgICAgIGZsaXBwZXIgPSAhZmxpcHBlcjtcclxuXHJcbiAgICAgICAgaWYgKCBpID09PSBudW1SYXlzTXVsdGlwbGUgLSAxICkge1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjdHguY2xvc2VQYXRoKCk7XHJcblxyXG5cclxuICAgIGlmICggIWRlYnVnQ29uZmlnLmRpc3BsYXlHbGFyZVNwaWtlcyApIHtcclxuICAgICAgICBjdHguc2hhZG93Q29sb3IgPSAnd2hpdGUnO1xyXG4gICAgICAgIGN0eC5zaGFkb3dCbHVyID0gYmx1cjtcclxuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDA7XHJcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSBzaGFkb3dSZW5kZXJPZmZzZXQ7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZWQnO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHgucm90YXRlKCBhICk7XHJcbiAgICBjdHgudHJhbnNsYXRlKCAteCwgLXkgKyBzaGFkb3dSZW5kZXJPZmZzZXQgKTtcclxuXHJcbiAgICAvLyBkZWJ1ZyBkaXNwbGF5XHJcblxyXG4gICAgbGV0IG1heFJheUxlbiA9IG1heFNpemU7XHJcblxyXG4gICAgLy8gb3V0cHV0IGNvbmZpZyBmb3IgcmVuZGVyc1xyXG4gICAgdGhpcy5kaXNwbGF5Q2ZnLmdsYXJlU3Bpa2VzUmFuZG9tLnJlbmRlciA9IHtcclxuICAgICAgICB4OiB4IC0gbWF4UmF5TGVuIC0gMTAsXHJcbiAgICAgICAgeTogeSAtIG1heFJheUxlbiAtIDEwLCBcclxuICAgICAgICB3OiBtYXhSYXlMZW4gKiAyICsgMjAsXHJcbiAgICAgICAgaDogbWF4UmF5TGVuICogMiArIDIwXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kaXNwbGF5Q2ZnLmdsYXJlU3Bpa2VzUmFuZG9tLmlzUmVuZGVyZWQgPSB0cnVlO1xyXG5cclxufVxyXG5cclxuc3VuU3Bpa2VzLmRpc3BsYXlDb3JvbmEgPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCBnbGFyZVNwaWtlT3B0cyA9IHRoaXMuZGlzcGxheUNmZy5nbGFyZVNwaWtlc1JhbmRvbTtcclxuICAgIGxldCBpdGVtQ2ZnID0gZ2xhcmVTcGlrZU9wdHMucmVuZGVyO1xyXG4gICAgbGV0IGMgPSBnbGFyZVNwaWtlT3B0cy5jb250ZXh0O1xyXG4gICAgbGV0IG9yaWdpbkNhbnZhcyA9IHRoaXMucmVuZGVyQ2ZnLmNhbnZhcztcclxuXHJcbiAgICBpZiAoIGdsYXJlU3Bpa2VPcHRzLmlzUmVuZGVyZWQgPT09IGZhbHNlICkge1xyXG4gICAgICAgIHRoaXMucmVuZGVyR2xhcmVTcGlrZXNSYW5kb20oKTtcclxuICAgICAgICB0aGlzLnJlbmRlckZsYXJlcygpO1xyXG4gICAgfVxyXG4gICAgaWYgKCAhaXRlbUNmZyApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAoIGdsYXJlU3Bpa2VPcHRzLmlzRGlzcGxheWVkID09PSBmYWxzZSApIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ2l0ZW1DZmc6ICcsIGl0ZW1DZmcgKTtcclxuICAgICAgICBjLmRyYXdJbWFnZShcclxuICAgICAgICAgICAgb3JpZ2luQ2FudmFzLFxyXG4gICAgICAgICAgICBpdGVtQ2ZnLngsIGl0ZW1DZmcueSwgaXRlbUNmZy53LCBpdGVtQ2ZnLmgsXHJcbiAgICAgICAgICAgIGdsYXJlU3Bpa2VPcHRzLnggLSAoaXRlbUNmZy53IC8gMiApLCBnbGFyZVNwaWtlT3B0cy55IC0gKGl0ZW1DZmcuaCAvIDIgKSwgaXRlbUNmZy53LCBpdGVtQ2ZnLmhcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIGdsYXJlU3Bpa2VPcHRzLmlzRGlzcGxheWVkID0gdHJ1ZTtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuc3VuU3Bpa2VzLnJlbmRlckZsYXJlcyA9IGZ1bmN0aW9uKCBvcHRpb25zICkge1xyXG5cclxuICAgIGNvbnN0IGRlYnVnQ29uZmlnID0gdGhpcy5yZW5kZXJDZmcuZGVidWdDZmdcclxuICAgIGNvbnN0IG9wdHMgPSB0aGlzLmZsYXJlT3B0aW9ucztcclxuICAgIGNvbnN0IGN0eCA9IG9wdHMuY29udGV4dCB8fCB0aGlzLnJlbmRlckNmZy5jb250ZXh0O1xyXG4gICAgY29uc3QgcmVuZGVyQ2FudmFzID0gb3B0cy5jYW52YXMgfHwgdGhpcy5yZW5kZXJDZmcuY2FudmFzO1xyXG4gICAgY29uc3QgcmVuZGVyT2Zmc2V0ID0gMTAwMDAwO1xyXG4gICAgLy8gY29uZmlndXJhdGlvblxyXG4gICAgY29uc3QgeCA9IG9wdHMueCB8fCBjdHgud2lkdGggLyAyO1xyXG4gICAgY29uc3QgeSA9IG9wdHMueTtcclxuICAgIGNvbnN0IGEgPSBvcHRzLmFuZ2xlIHx8IDA7XHJcbiAgICBjb25zdCBudW1SYXlzID0gb3B0cy5jb3VudCB8fCA0O1xyXG4gICAgY29uc3QgbnVtUmF5c011bHRpcGxlID0gbnVtUmF5cyAqIDI7XHJcbiAgICBjb25zdCByYXlXaWR0aCA9IG9wdHMucmF5V2lkdGggfHwgMC4yO1xyXG4gICAgY29uc3QgZ3JhZGllbnRXaWR0aCA9IG9wdHMuZ3JhZGllbnRXaWR0aCB8fCAxMDAwO1xyXG4gICAgY29uc3QgYmFzZVIgPSBvcHRzLnIgfHwgMTUwO1xyXG4gICAgY29uc3QgY3VydmVSID0gb3B0cy5jdXJ2ZVIgfHwgYmFzZVI7XHJcbiAgICBjb25zdCBibHVyID0gb3B0cy5ibHVyIHx8IDQ7XHJcbiAgICBjb25zdCByYXlMZW4gPSBiYXNlUiArIG9wdHMucmF5TGVuIHx8IGJhc2VSICsgMzAwO1xyXG5cclxuICAgIGNvbnN0IG1heFJheVdpZHRoID0gdHdvUGkgLyBudW1SYXlzO1xyXG4gICAgY29uc3QgcmF5U3ByZWFkID0gbWF4UmF5V2lkdGggKiByYXlXaWR0aDtcclxuICAgIGNvbnNvbGUubG9nKCAnbWF4UmF5V2lkdGg6ICcsIG1heFJheVdpZHRoICk7XHJcbiAgICBjb25zb2xlLmxvZyggJ3JheVdpZHRoOiAnLCByYXlXaWR0aCApO1xyXG4gICAgY29uc29sZS5sb2coICdmbGFyZSBvcHRzOiAnLCBvcHRzICk7XHJcbiAgICAvLyBkcmF3aW5nXHJcbiAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ3NvdXJjZS1vdmVyJztcclxuICAgIGN0eC50cmFuc2xhdGUoIHgsIHkgKTtcclxuICAgIGN0eC5yb3RhdGUoIC1hICk7XHJcbiAgICBjdHguZmlsdGVyID0gJ2JsdXIoJytibHVyKydweCknO1xyXG4gICAgbGV0IGZsYXJlR3JkID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KCAwLCAwLCAwLCAwLCAwLCBncmFkaWVudFdpZHRoICk7XHJcbiAgICBmbGFyZUdyZC5hZGRDb2xvclN0b3AoIDAsICdyZ2JhKCAyNTUsIDI1NSwgMjU1LCAxJyApO1xyXG4gICAgZmxhcmVHcmQuYWRkQ29sb3JTdG9wKCAxLCAncmdiYSggMjU1LCAyNTUsIDI1NSwgMCcgKTtcclxuICAgIFxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGZsYXJlR3JkO1xyXG4gICAgXHJcbiAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBudW1SYXlzOyBpKysgKSB7XHJcblxyXG4gICAgICAgIGxldCBhbHBoYSA9IHR3b1BpICogKCBpIC8gKCBudW1SYXlzICkgKTtcclxuXHJcbiAgICAgICAgbGV0IHBvaW50MUFscGhhID0gYWxwaGEgLSByYXlTcHJlYWQ7XHJcbiAgICAgICAgbGV0IHBvaW50MkFscGhhID0gYWxwaGEgKyByYXlTcHJlYWQ7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKCAwLCAwICk7XHJcblxyXG4gICAgICAgIC8vIGN0eC5saW5lVG8oIDgwMCwgLTIwICk7XHJcbiAgICAgICAgLy8gY3R4LmxpbmVUbyggODAwLCAyMCApO1xyXG5cclxuICAgICAgICBjdHgubGluZVRvKCBNYXRoLmNvcyggcG9pbnQxQWxwaGEgKSAqIHJheUxlbiwgTWF0aC5zaW4oIHBvaW50MUFscGhhICkgKiByYXlMZW4gKTtcclxuICAgICAgICBjdHgubGluZVRvKCBNYXRoLmNvcyggcG9pbnQyQWxwaGEgKSAqIHJheUxlbiwgTWF0aC5zaW4oIHBvaW50MkFscGhhICkgKiByYXlMZW4gKTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgLy8gY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcblxyXG4gICAgfVxyXG4gICAgY3R4LmZpbHRlciA9ICdibHVyKDBweCknO1xyXG4gICAgY3R4LnJvdGF0ZSggYSApO1xyXG4gICAgY3R4LnRyYW5zbGF0ZSggLXgsIC15ICk7XHJcblxyXG4gICAgLy8gb3V0cHV0IGNvbmZpZyBmb3IgcmVuZGVyc1xyXG4gICAgdGhpcy5kaXNwbGF5Q2ZnLmZsYXJlcyA9IHtcclxuICAgICAgICBjYW52YXM6IHJlbmRlckNhbnZhcyxcclxuICAgICAgICB4OiB4IC0gcmF5TGVuIC0gMTAsXHJcbiAgICAgICAgeTogeSAtIHJheUxlbiAtIDEwLCBcclxuICAgICAgICB3OiByYXlMZW4gKiAyICsgMjAsXHJcbiAgICAgICAgaDogcmF5TGVuICogMiArIDIwXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN1blNwaWtlczsiLCJ2YXIgZWFzaW5nID0gcmVxdWlyZSggJy4vZWFzaW5nLmpzJyApLmVhc2luZ0VxdWF0aW9ucztcclxuXHJcbnZhciBjb25zb2xlSW5mb1N0eWxlID0gJ2NvbG9yOiAjYWFhYTAwOyc7XHJcblxyXG52YXIgYmxpbmsgPSByZXF1aXJlKCAnLi90cmFja3MvYmxpbmsuanMnICk7XHJcbnZhciBzbWlsZSA9IHJlcXVpcmUoICcuL3RyYWNrcy9zbWlsZS5qcycgKTtcclxudmFyIGJpZ1NtaWxlID0gcmVxdWlyZSggJy4vdHJhY2tzL2JpZ1NtaWxlLmpzJyApO1xyXG52YXIgZWNzdGF0aWMgPSByZXF1aXJlKCAnLi90cmFja3MvZWNzdGF0aWMuanMnICk7XHJcbnZhciBzYWQgPSByZXF1aXJlKCAnLi90cmFja3Mvc2FkLmpzJyApO1xyXG52YXIgYmlnU2FkID0gcmVxdWlyZSggJy4vdHJhY2tzL2JpZ1NhZC5qcycgKTtcclxuXHJcbnZhciB5YXduID0gcmVxdWlyZSggJy4vdHJhY2tzL3lhd24uanMnICk7XHJcblxyXG52YXIgcmVzZXQgPSByZXF1aXJlKCAnLi90cmFja3MvcmVzZXQuanMnICk7XHJcblxyXG52YXIgdHJhY2tzID0ge1xyXG5cdGJsaW5rOiBibGluayxcclxuXHRzbWlsZTogc21pbGUsXHJcblx0YmlnU21pbGU6IGJpZ1NtaWxlLFxyXG5cdGVjc3RhdGljOiBlY3N0YXRpYyxcclxuXHRzYWQ6IHNhZCxcclxuXHRiaWdTYWQ6IGJpZ1NhZCxcclxuXHR5YXduOiB5YXduLFxyXG5cdHJlc2V0OiByZXNldFxyXG59XHJcblxyXG52YXIgdHJhY2tMaXN0ID0gT2JqZWN0LmtleXMoIHRyYWNrcyApO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZUxvb3BJdGVyYXRpb25zKCB0b3RhbFRpbWUsIGxvb3BUaW1lLCBsb29wRGVsYXlUaW1lICkge1xyXG5cdFxyXG5cdHZhciBjb3VudGVyID0gMDtcclxuXHR2YXIgdCA9IHRvdGFsVGltZTtcclxuXHJcblx0d2hpbGUgKCB0ID4gbG9vcFRpbWUgKSB7XHJcblx0XHR0IC09IGxvb3BUaW1lO1xyXG5cdFx0Y291bnRlcisrO1xyXG5cdFx0aWYgKCB0ID4gbG9vcERlbGF5VGltZSApIHtcclxuXHRcdFx0dCAtPSBsb29wRGVsYXlUaW1lO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBjb3VudGVyO1xyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIHNldFRyYWNrQ2xvY2soIHRpbWUsIHRyYWNrLCBzZXF1ZW5jZXIgKXtcclxuXHJcblx0dmFyIGlzT2RkTnVtID0gKCB0aW1lICYgMSApID8gMSA6IDA7XHJcblx0dHJhY2sudG90YWxDbG9jayA9IHRpbWUgKyBpc09kZE51bTtcclxuXHJcblx0dmFyIHNlcXVlbmNlcyA9IHRyYWNrLnNlcXVlbmNlcztcclxuXHR2YXIgc2VxTGVuID0gc2VxdWVuY2VzLmxlbmd0aCAtIDE7XHJcblxyXG5cdGZvciAodmFyIGkgPSBzZXFMZW47IGkgPj0gMDsgaS0tKSB7XHJcblxyXG4gICAgICAgIHZhciBzZXEgPSBzZXF1ZW5jZXNbaV07XHJcbiAgICAgICAgdmFyIGV4cCA9IHNlcXVlbmNlci5zZXFMaXN0WyB0cmFjay5zZXF1ZW5jZXNbIGkgXS5zZXEgXTtcclxuICAgICAgICB2YXIgYXZhaWxhYmxlVGltZSA9IDA7XHJcbiAgICAgICAgdmFyIGV4cER1ciA9IDA7XHJcblxyXG4gICAgXHRzZXEudG90YWxDbG9jayA9IHRyYWNrLnRvdGFsQ2xvY2sgKiBzZXEuZHVyO1xyXG4gICAgXHRzZXEuZGVsYXlDbG9jayA9IHRyYWNrLnRvdGFsQ2xvY2sgKiBzZXEuZGVsYXk7XHJcbiAgICBcdHNlcS5kZWxheVRpY2tzID0gc2VxLmRlbGF5Q2xvY2s7XHJcbiAgICBcdHNlcS5sb29wRGVsYXlUaWNrcyA9IHRyYWNrLnRvdGFsQ2xvY2sgKiBzZXEubG9vcERlbGF5O1xyXG5cclxuICAgIFx0YXZhaWxhYmxlVGltZSA9IHNlcS50b3RhbENsb2NrIC0gc2VxLmRlbGF5VGlja3M7XHJcblxyXG4gICAgXHRpZiAoIHNlcS5sb29wID09PSB0cnVlICkge1xyXG4gICAgXHRcdHNlcS5sb29wSXRlcmF0aW9ucyA9IGNhbGN1bGF0ZUxvb3BJdGVyYXRpb25zKCBhdmFpbGFibGVUaW1lLCBzZXEudG90YWxDbG9jaywgc2VxLmxvb3BEZWxheVRpY2tzICk7XHJcbiAgICBcdH1cclxuICAgIFx0XHJcbiAgICBcdGlmICggc2VxLnJldHVyblRvSW5pdCA9PT0gdHJ1ZSApIHtcclxuICAgICAgICBcdGV4cC50b3RhbENsb2NrID0gYXZhaWxhYmxlVGltZSAvIDI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICBcdGV4cC50b3RhbENsb2NrID0gYXZhaWxhYmxlVGltZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAndGhpc1NlcTogJywgdGhpc1NlcSApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnZXhwOiAnLCBleHAgKTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiBzZXRMaXZlRXhwcmVzc2lvblByb3BzKCBleHByZXNzaW9uLCBtb2RpZmllcnMgKSB7XHJcblxyXG5cdHZhciBtZW1MaXN0ID0gZXhwcmVzc2lvbjtcclxuXHR2YXIgbWVtc0xlbiA9IG1lbUxpc3QubGVuZ3RoIC0gMTtcclxuXHRcclxuXHRmb3IgKHZhciBpID0gbWVtc0xlbjsgaSA+PSAwOyBpLS0pIHtcclxuXHJcblx0XHR2YXIgbSA9IG1lbUxpc3RbIGkgXTtcclxuICAgICAgICB2YXIgbW9kID0gbW9kaWZpZXJzWyBtLm5hbWUgXTtcclxuICAgICAgICB2YXIgZGVsdGEgPSAwO1xyXG4gICAgICAgIHZhciBjID0gbW9kLmN1cnI7XHJcbiAgICAgICAgdmFyIG1pbiA9IG1vZC5taW47XHJcbiAgICAgICAgdmFyIG1heCA9IG1vZC5tYXg7XHJcbiAgICAgICAgdmFyIHQgPSBtLnRhcmdldDtcclxuXHJcbiAgICAgICAgdmFyIGNOZWcgPSBjIDwgMCA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgICB2YXIgbWluTmVnID0gbWluIDwgMCA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgICB2YXIgdE5lZyA9IHQgPCAwID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICB2YXIgdERlbHRhID0gMDtcclxuXHJcbiAgICAgICAgaWYgKCAhbWluTmVnICkge1xyXG4gICAgICAgIFx0dERlbHRhID0gbWF4ICogdDtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICBcdGlmICggIXROZWcgKSB7XHJcbiAgICAgICAgXHRcdHREZWx0YSA9IG1heCAqIHQ7XHJcbiAgICAgICAgXHR9IGVsc2Uge1xyXG4gICAgICAgIFx0XHR0RGVsdGEgPSBtaW4gKiAtdDtcclxuICAgICAgICBcdH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZWx0YSA9IHREZWx0YSAtIGM7XHJcblxyXG4gICAgICAgIG0uc3RhcnRWYWx1ZSA9IGM7XHJcbiAgICAgICAgbS52YWx1ZUNoYW5nZSA9IGRlbHRhO1xyXG5cclxuXHR9IC8vIGZvciBsb29wXHJcbn07XHJcblxyXG5cclxuZnVuY3Rpb24gbG9hZFRyYWNrKCB0aW1lLCB0cmFja05hbWUsIHNlcXVlbmNlciwgbW9kaWZpZXJzICkge1xyXG5cdHZhciB0cmFjayA9IHRoaXMudHJhY2tzWyB0cmFja05hbWUgXTtcclxuXHR0aGlzLnNldFRyYWNrQ2xvY2soIHRpbWUsIHRyYWNrLCBzZXF1ZW5jZXIgKTtcclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiBzdGFydFRyYWNrKCB0cmFja05hbWUgKSB7XHJcblx0dmFyIHRoaXNUcmFjayA9IHRoaXMudHJhY2tzWyB0cmFja05hbWUgXTtcclxuXHR0aGlzVHJhY2sucGxheWluZyA9IHRydWU7XHJcbn07XHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlVHJhY2tQbGF5ZXIoIHNlcSwgbW9kaWZpZXJzICkge1xyXG5cdHZhciB0aGlzTGlzdCA9IHRoaXMudHJhY2tMaXN0O1xyXG5cdHRoaXNMaXN0TGVuID0gdGhpc0xpc3QubGVuZ3RoIC0gMTtcclxuXHRmb3IgKHZhciBpID0gdGhpc0xpc3RMZW47IGkgPj0gMDsgaS0tKSB7XHJcblx0XHR0aGlzLmNoZWNrVHJhY2soIHRoaXMudHJhY2tzWyB0aGlzTGlzdFsgaSBdIF0sIHNlcSwgbW9kaWZpZXJzICk7XHJcblx0fVxyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIGNoZWNrVHJhY2soIHRoaXNUcmFjaywgc2VxLCBtb2RpZmllcnMgKXtcclxuXHJcblx0aWYgKCB0aGlzVHJhY2sucGxheWluZyA9PT0gdHJ1ZSApIHtcclxuXHRcdHRoaXMudXBkYXRlVHJhY2soIHRoaXNUcmFjaywgc2VxLCBtb2RpZmllcnMgKTtcclxuXHR9XHJcbn07XHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlVHJhY2soIHRoaXNUcmFjaywgc2VxdWVuY2VyLCBtb2RpZmllcnMgKSB7XHJcblxyXG5cdGlmICggdGhpc1RyYWNrLnBsYXlpbmcgPT09IHRydWUgKSB7XHJcblx0XHQvLyBjb25zb2xlLmxvZyggJy0tLS0tLS0gVFJBQ0sgQ3ljbGUgVGljayAtLS0tLS0tLScgKTtcclxuXHRcdGlmICggdGhpc1RyYWNrLmNsb2NrIDwgdGhpc1RyYWNrLnRvdGFsQ2xvY2sgKSB7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzVHJhY2suY2xvY2srK1xyXG5cdFx0XHR0aGlzLnVwZGF0ZVNlcXVlbmNlcyggdGhpc1RyYWNrLCBzZXF1ZW5jZXIsIG1vZGlmaWVycyApO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoIHRoaXNUcmFjay5sb29wID09PSB0cnVlICkge1xyXG5cdFx0XHRcdHRoaXNUcmFjay5jbG9jayA9IDA7XHJcblx0XHRcdFx0Ly8gcmVzZXQgc2VxdWVuY2VDbG9ja3NcclxuXHRcdFx0XHQvLyByZXNldCBleHByZXNzaW9uQ2xvY2tzXHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdHN0b3BUcmFjayggdGhpc1RyYWNrLCBzZXF1ZW5jZXIgKTtcclxuXHRcdFx0XHRpZiAoIHRoaXNUcmFjay5saW5rZWRUcmFjayAhPT0gbnVsbCApIHtcclxuXHRcdFx0XHRcdHRoaXMubG9hZFRyYWNrKCB0aGlzVHJhY2sudG90YWxDbG9jaywgdGhpc1RyYWNrLmxpbmtlZFRyYWNrLCBzZXF1ZW5jZXIsIG1vZGlmaWVycyApO1xyXG5cdFx0XHRcdFx0dGhpcy5zdGFydFRyYWNrKCB0aGlzVHJhY2subGlua2VkVHJhY2sgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGVTZXF1ZW5jZXMoIHRoaXNUcmFjaywgc2VxdWVuY2VyLCBtb2RpZmllcnMgKSB7XHJcblxyXG5cdHZhciB0aGlzU2VxcyA9IHRoaXNUcmFjay5zZXF1ZW5jZXM7XHJcblx0dmFyIHRoaXNTZXFzTGVuID0gdGhpc1NlcXMubGVuZ3RoIC0gMTtcclxuXHJcblx0Zm9yICh2YXIgaSA9IHRoaXNTZXFzTGVuOyBpID49IDA7IGktLSkge1xyXG5cdFx0dmFyIHRoaXNTZXEgPSB0aGlzU2Vxc1sgaSBdO1xyXG5cdFx0dmFyIGV4cHJlc3Npb24gPSBzZXF1ZW5jZXIuc2VxTGlzdFsgdGhpc1NlcS5zZXEgXS5tZW1iZXJzO1xyXG5cclxuXHRcdGlmICggdGhpc1NlcS5jbG9jayA9PT0gdGhpc1NlcS5kZWxheUNsb2NrICkge1xyXG5cdFx0XHR0aGlzLnNldExpdmVFeHByZXNzaW9uUHJvcHMoIGV4cHJlc3Npb24sIG1vZGlmaWVycyApO1xyXG5cdFx0XHR0aGlzU2VxLnBsYXlpbmcgPSB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggdGhpc1NlcS5wbGF5aW5nID09PSB0cnVlICkge1xyXG5cdFx0XHRpZiAoIHRoaXNTZXEuY2xvY2sgPCB0aGlzU2VxLnRvdGFsQ2xvY2sgKSB7XHJcblx0XHRcdFx0dGhpcy51cGRhdGVFeHByZXNzaW9uKCB0aGlzU2VxLCBzZXF1ZW5jZXIsIG1vZGlmaWVycyApO1xyXG5cdFx0XHRcdHRoaXNTZXEuY2xvY2srKztcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyggJ3RoaXNTZXEuY2xvY2s6ICcsIHRoaXNTZXEuY2xvY2sgKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0aWYgKCB0aGlzU2VxLmxvb3AgPT09IHRydWUgKSB7XHJcblx0XHRcdFx0XHR0aGlzU2VxLmNsb2NrID0gMDtcclxuXHRcdFx0XHRcdC8vIHJlc2V0RXhwcmVzc2lvbigpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzU2VxLnBsYXlpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRcdC8vIHN0b3BFeHByZXNzaW9uKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRpZiAoIHRoaXNTZXEuZGVsYXkgPT09IHRydWUgKSB7XHJcblxyXG5cdFx0XHRcdGlmICggdGhpc1NlcS5kZWxheUNsb2NrID09PSB0aGlzVHJhY2suY2xvY2sgKSB7XHJcblx0XHRcdFx0XHR0aGlzU2VxLnBsYXlpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdH0gLy8gY2xvc2UgZm9yIHNlcXVlbmNlWyBuIF0gbG9vcDtcclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGVFeHByZXNzaW9uKCB0aGlzU2VxLCBzZXF1ZW5jZXIsIG1vZGlmaWVycyApIHtcclxuXHJcblx0dmFyIHRoaXNFeHAgPSBzZXF1ZW5jZXIuc2VxTGlzdFsgdGhpc1NlcS5zZXEgXTtcclxuXHRpZiAoIHRoaXNTZXEuY2xvY2sgPT09IHRoaXNTZXEuZGVsYXlDbG9jayApIHtcclxuXHRcdHRoaXNFeHAucGxheWluZyA9IHRydWU7XHJcblx0fVxyXG5cdFxyXG5cdGlmICggdGhpc0V4cC5wbGF5aW5nID09PSB0cnVlICkge1xyXG5cclxuXHRcdGlmICggdGhpc0V4cC5yZXZlcnNlUGxheSA9PT0gdHJ1ZSApIHtcclxuXHRcdFx0dGhpcy5leHByZXNzaW9uUmV2UGxheSggdGhpc0V4cCwgdGhpc1NlcSwgc2VxdWVuY2VyICk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmV4cHJlc3Npb25Ob3JtYWxQbGF5KCB0aGlzRXhwLCB0aGlzU2VxLCBzZXF1ZW5jZXIgKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnVwZGF0ZUV4cHJlc3Npb25NZW1iZXJzKCB0aGlzRXhwLCBzZXF1ZW5jZXIsIG1vZGlmaWVycyApO1xyXG5cdH1cclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGVFeHByZXNzaW9uTWVtYmVycyggdGhpc0V4cCwgc2VxdWVuY2VyLCBtb2RpZmllcnMgKSB7XHJcblx0XHJcblx0dmFyIHRoaXNNZW1iZXJzID0gdGhpc0V4cC5tZW1iZXJzO1xyXG5cdHZhciB0aGlzTWVtYmVyc0xlbiA9IHRoaXNNZW1iZXJzLmxlbmd0aCAtIDE7XHJcblx0Zm9yICh2YXIgaSA9IHRoaXNNZW1iZXJzTGVuOyBpID49IDA7IGktLSkge1xyXG5cdFx0dmFyIHRoaXNNZW0gPSB0aGlzTWVtYmVyc1sgaSBdO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCAndGhpc0V4cC5lYXNlRm46ICcrdGhpc0V4cC5lYXNlRm4rJywgdGhpc0V4cC5jbG9jazogJyt0aGlzRXhwLmNsb2NrKycsIHRoaXNFeHAudG90YWxDbG9jazogJyt0aGlzRXhwLnRvdGFsQ2xvY2srJywgdGhpc01lbS5zdGFydFZhbHVlOiAnK3RoaXNNZW0uc3RhcnRWYWx1ZSsnLCB0aGlzTWVtLnZhbHVlQ2hhbmdlOiAnK3RoaXNNZW0udmFsdWVDaGFuZ2UgKTtcclxuXHJcblx0XHRtb2RpZmllcnNbIHRoaXNNZW0ubmFtZSBdLmN1cnIgPSBlYXNpbmdbIHRoaXNFeHAuZWFzZUZuIF0oIHRoaXNFeHAuY2xvY2ssIHRoaXNNZW0uc3RhcnRWYWx1ZSwgdGhpc01lbS52YWx1ZUNoYW5nZSwgdGhpc0V4cC50b3RhbENsb2NrICk7XHJcblx0XHRcclxuXHR9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBleHByZXNzaW9uTm9ybWFsUGxheSggdGhpc0V4cCwgdGhpc1NlcSwgc2VxdWVuY2VyICkge1xyXG5cclxuXHRpZiAoIHRoaXNFeHAuY2xvY2sgPCB0aGlzRXhwLnRvdGFsQ2xvY2sgKSB7XHJcblx0XHR0aGlzRXhwLmNsb2NrKys7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coICd0aGlzRXhwLmNsb2NrOiAnLCB0aGlzRXhwLmNsb2NrICk7XHJcblx0XHJcblx0XHRpZiAoIHRoaXNFeHAuY2xvY2sgPT09IHRoaXNFeHAudG90YWxDbG9jayApIHtcclxuXHRcdFx0aWYgKCB0aGlzU2VxLnJldHVyblRvSW5pdCA9PT0gdHJ1ZSApIHtcclxuXHRcdFx0XHR0aGlzRXhwLnJldmVyc2VQbGF5ID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9IGVsc2Uge1xyXG5cdFx0dGhpcy5leHByZXNzaW9uQ2hlY2tMb29wKCB0aGlzRXhwLCB0aGlzU2VxLCBzZXF1ZW5jZXIgKTtcclxuXHR9XHJcbn07XHJcblxyXG5cclxuZnVuY3Rpb24gZXhwcmVzc2lvblJldlBsYXkoIHRoaXNFeHAsIHRoaXNTZXEsIHNlcXVlbmNlciApIHtcclxuXHRcclxuXHRpZiAoIHRoaXNFeHAuY2xvY2sgPiAwICkge1xyXG5cdFx0dGhpc0V4cC5jbG9jay0tO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coICd0aGlzRXhwLmNsb2NrOiAnLCB0aGlzRXhwLmNsb2NrICk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHRoaXMuZXhwcmVzc2lvbkNoZWNrTG9vcCggdGhpc0V4cCwgdGhpc1NlcSwgc2VxdWVuY2VyICk7XHJcblx0fVx0XHJcbn07XHJcblxyXG5cclxuZnVuY3Rpb24gZXhwcmVzc2lvbkNoZWNrTG9vcCggdGhpc0V4cCwgdGhpc1NlcSwgc2VxdWVuY2VyICkge1xyXG5cdGlmICggdGhpc1NlcS5sb29wID09PSB0cnVlICkge1xyXG5cdFx0dGhpc0V4cC5wbGF5aW5nID0gdHJ1ZTtcclxuXHRcdHRoaXNFeHAucmV2ZXJzZVBsYXkgPSBmYWxzZTtcclxuXHRcdHRoaXNTZXEuY2xvY2sgPSAwO1xyXG5cdFx0Ly8gc2V0IHRoaXNTZXEubG9vcERlbGF5XHJcblx0fSBlbHNlIHtcclxuXHRcdHRoaXNFeHAucGxheWluZyA9IGZhbHNlO1xyXG5cdFx0dGhpc0V4cC5yZXZlcnNlUGxheSA9IGZhbHNlO1xyXG5cdFx0dGhpc1NlcS5jbG9jayA9IDA7XHJcblx0fVxyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIHBsYXlUcmFjayggdGhpc1RyYWNrICkge1xyXG5cclxuXHRpZiAoIHRoaXNUcmFjay5jbG9jayA8IHRoaXNUcmFjay50b3RhbENsb2NrICkge1xyXG5cdFx0dGhpcy51cGRhdGVDbG9ja3MoIHRoaXNUcmFjayApO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRpZiAoIHRoaXNUcmFjay5sb29wID09PSB0cnVlICkge1xyXG5cdFx0XHR0aGlzLnJlc2V0Q2xvY2tzKCB0aGlzVHJhY2sgKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuc3RvcFRyYWNrKCB0aGlzVHJhY2sgKTtcclxuXHRcdFx0dGhpcy5yZXNldENsb2NrcyggdGhpc1RyYWNrICk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIHN0b3BUcmFjayggdGhpc1RyYWNrLCBzZXF1ZW5jZXIgKSB7XHJcblx0dGhpc1RyYWNrLnBsYXlpbmcgPSBmYWxzZTtcclxuXHR0aGlzVHJhY2suY2xvY2sgPSAwO1xyXG5cdFxyXG5cdGZvciAodmFyIGkgPSB0aGlzVHJhY2suc2VxdWVuY2VzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcblx0XHRcclxuXHRcdHZhciB0aGlzU2VxID0gdGhpc1RyYWNrLnNlcXVlbmNlc1sgaSBdO1xyXG5cdFx0dGhpc1NlcS5wbGF5aW5nID0gZmFsc2U7XHJcblx0XHR0aGlzU2VxLmNsb2NrID0gMDtcclxuXHJcblx0XHR2YXIgdGhpc0V4cCA9IHNlcXVlbmNlci5zZXFMaXN0WyB0aGlzU2VxLnNlcSBdOyBcclxuXHRcdHRoaXNFeHAucGxheWluZyA9IGZhbHNlO1xyXG5cdFx0dGhpc0V4cC5yZXZlcnNlUGxheSA9IGZhbHNlO1xyXG5cdFx0dGhpc0V4cC5jbG9jayA9IDA7XHJcblx0fVxyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUNsb2NrcyggdGhpc1RyYWNrICkge1xyXG5cdHRoaXNUcmFjay5jbG9jaysrO1xyXG5cdC8vIGNvbnNvbGUubG9nKCAndGhpc1RyYWNrLmNsb2NrOiAnLCB0aGlzVHJhY2suY2xvY2sgKTtcclxuXHRmb3IgKHZhciBpID0gdGhpc1RyYWNrLnNlcXVlbmNlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG5cdFx0dGhpc1RyYWNrLnNlcXVlbmNlc1sgaSBdLmNsb2NrKys7XHJcblx0XHQvLyBjb25zb2xlLmxvZyggJ3RoaXNUcmFjay5zZXF1ZW5jZXNbIGkgXS5jbG9jazogJywgdGhpc1RyYWNrLnNlcXVlbmNlc1sgaSBdLmNsb2NrICk7IFxyXG5cdH1cclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiByZXNldENsb2NrcyggdGhpc1RyYWNrICkge1xyXG5cdHRoaXNUcmFjay5jbG9jayA9IDA7XHJcblx0Zm9yICh2YXIgaSA9IHRoaXNUcmFjay5zZXF1ZW5jZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuXHRcdHRoaXNUcmFjay5zZXF1ZW5jZXNbIGkgXS5jbG9jayA9IDA7IFxyXG5cdH1cclxufTtcclxuXHJcblxyXG52YXIgdHJhY2tQbGF5ZXIgPSB7XHJcblxyXG5cdHNldFRyYWNrQ2xvY2s6IHNldFRyYWNrQ2xvY2ssXHJcblx0c2V0TGl2ZUV4cHJlc3Npb25Qcm9wczogc2V0TGl2ZUV4cHJlc3Npb25Qcm9wcyxcclxuXHRsb2FkVHJhY2s6IGxvYWRUcmFjayxcclxuXHRzdGFydFRyYWNrOiBzdGFydFRyYWNrLFxyXG5cdHN0b3BUcmFjazogc3RvcFRyYWNrLFxyXG5cdHBsYXlUcmFjazogcGxheVRyYWNrLFxyXG5cdGNoZWNrVHJhY2s6IGNoZWNrVHJhY2ssXHJcblx0dXBkYXRlQ2xvY2tzOiB1cGRhdGVDbG9ja3MsXHJcblx0cmVzZXRDbG9ja3M6IHJlc2V0Q2xvY2tzLFxyXG5cdHVwZGF0ZVNlcXVlbmNlczogdXBkYXRlU2VxdWVuY2VzLFxyXG5cdGV4cHJlc3Npb25Ob3JtYWxQbGF5OiBleHByZXNzaW9uTm9ybWFsUGxheSxcclxuXHRleHByZXNzaW9uUmV2UGxheTogZXhwcmVzc2lvblJldlBsYXksXHJcblx0ZXhwcmVzc2lvbkNoZWNrTG9vcDogZXhwcmVzc2lvbkNoZWNrTG9vcCxcclxuXHR1cGRhdGVFeHByZXNzaW9uOiB1cGRhdGVFeHByZXNzaW9uLFxyXG5cdHVwZGF0ZUV4cHJlc3Npb25NZW1iZXJzOiB1cGRhdGVFeHByZXNzaW9uTWVtYmVycyxcclxuXHR1cGRhdGVUcmFjazogdXBkYXRlVHJhY2ssXHJcblx0dXBkYXRlVHJhY2tQbGF5ZXI6IHVwZGF0ZVRyYWNrUGxheWVyLFxyXG5cdHRyYWNrczogdHJhY2tzLFxyXG5cdHRyYWNrTGlzdDogdHJhY2tMaXN0XHJcblxyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB0cmFja1BsYXllcjsiLCJ2YXIgc2VxdWVuY2VVdGlscyA9IHJlcXVpcmUoICcuLi9zZXF1ZW5jZVV0aWxzLmpzJyk7XHJcbnZhciBjcmVhdGVTZXF1ZW5jZSA9IHNlcXVlbmNlVXRpbHMuY3JlYXRlU2VxdWVuY2U7XHJcbnZhciBjcmVhdGVUcmFjayA9IHNlcXVlbmNlVXRpbHMuY3JlYXRlVHJhY2s7XHJcblxyXG4vLyBpZiBzZXF1ZW5jZS5kdXIoYXRpb24pICE9IDFcclxuLy8gXHRcdHRoZW4gXHJcbi8vIFx0XHRcdHNlcXVlbmNlOlxyXG4vLyBcdFx0XHRcdGR1ciArIGRlbGF5KD8pID0gMVxyXG4vLyBpZiBzZXF1ZW5jZS5sb29wID0gdHJ1ZVxyXG4vLyBcdFx0dGhlblxyXG4vLyBcdFx0XHRzZXF1ZW5jZTpcclxuLy9cdFx0XHRcdGR1ciArIGRlbGF5KD8pICsgbG9vcERlbGF5KD8pID0gPD0gMVxyXG5cclxudmFyIGJpZ1NhZFNlcXVlbmNlID0gY3JlYXRlU2VxdWVuY2UoIHtcclxuXHRzZXE6ICdiaWdTYWRTZXF1ZW5jZSdcclxuXHJcbn0gKTtcclxuXHJcblxyXG52YXIgYmlnU2FkID0gY3JlYXRlVHJhY2soIHtcclxuXHRzZXF1ZW5jZXM6IFsgYmlnU2FkU2VxdWVuY2UgXVxyXG59ICk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGJpZ1NhZDtcclxuIiwidmFyIGJpZ1NtaWxlID0ge1xyXG5cdHBsYXlpbmc6IGZhbHNlLFxyXG5cdHRvdGFsQ2xvY2s6IDAsXHJcblx0Y2xvY2s6IDAsXHJcblx0bG9vcDogZmFsc2UsXHJcblx0bGlua2VkVHJhY2s6IG51bGwsXHJcblx0c2VxdWVuY2VzOiBbXHJcblx0XHR7XHRcclxuXHRcdFx0cGxheWluZzogZmFsc2UsXHJcblx0XHRcdGR1cjogMSxcclxuXHRcdFx0ZGVsYXk6IDAsXHJcblx0XHRcdGxvb3A6IGZhbHNlLFxyXG5cdFx0XHRsb29wRGVsYXk6IDAsXHJcblx0XHRcdHJldHVyblRvSW5pdDogZmFsc2UsXHJcblx0XHRcdHRvdGFsQ2xvY2s6IDAsXHJcblx0XHRcdGRlbGF5Q2xvY2s6IDAsXHJcblx0XHRcdGNsb2NrOiAwLFxyXG5cdFx0XHRzZXE6ICdiaWdTbWlsZVNlcXVlbmNlJ1xyXG5cdFx0fVxyXG5cdF1cclxuXHRcdFx0XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYmlnU21pbGU7XHJcbiIsInZhciBibGluayA9IHtcclxuXHRwbGF5aW5nOiBmYWxzZSxcclxuXHR0b3RhbENsb2NrOiAwLFxyXG5cdGNsb2NrOiAwLFxyXG5cdGxvb3A6IGZhbHNlLFxyXG5cdGxpbmtlZFRyYWNrOiBudWxsLFxyXG5cdHNlcXVlbmNlczogW1xyXG5cdFx0e1x0XHJcblx0XHRcdHBsYXlpbmc6IGZhbHNlLFxyXG5cdFx0XHRkdXI6IDEsXHJcblx0XHRcdGRlbGF5OiAwLFxyXG5cdFx0XHRsb29wOiBmYWxzZSxcclxuXHRcdFx0bG9vcERlbGF5OiAwLFxyXG5cdFx0XHRyZXR1cm5Ub0luaXQ6IHRydWUsXHJcblx0XHRcdHRvdGFsQ2xvY2s6IDAsXHJcblx0XHRcdGRlbGF5Q2xvY2s6IDAsXHJcblx0XHRcdGNsb2NrOiAwLFxyXG5cdFx0XHRzZXE6ICdibGlua1NlcXVlbmNlJ1xyXG5cdFx0fVxyXG5cdF1cclxuXHRcdFx0XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYmxpbms7XHJcbiIsInZhciBlY3N0YXRpYyA9IHtcclxuXHRwbGF5aW5nOiBmYWxzZSxcclxuXHR0b3RhbENsb2NrOiAwLFxyXG5cdGNsb2NrOiAwLFxyXG5cdGxvb3A6IGZhbHNlLFxyXG5cdGxpbmtlZFRyYWNrOiBudWxsLFxyXG5cdHNlcXVlbmNlczogW1xyXG5cdFx0e1x0XHJcblx0XHRcdHBsYXlpbmc6IGZhbHNlLFxyXG5cdFx0XHRkdXI6IDEsXHJcblx0XHRcdGRlbGF5OiAwLFxyXG5cdFx0XHRsb29wOiBmYWxzZSxcclxuXHRcdFx0bG9vcERlbGF5OiAwLFxyXG5cdFx0XHRyZXR1cm5Ub0luaXQ6IGZhbHNlLFxyXG5cdFx0XHR0b3RhbENsb2NrOiAwLFxyXG5cdFx0XHRkZWxheUNsb2NrOiAwLFxyXG5cdFx0XHRjbG9jazogMCxcclxuXHRcdFx0c2VxOiAnZWNzdGF0aWNTZXF1ZW5jZSdcclxuXHRcdH1cclxuXHRdXHJcblx0XHRcdFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVjc3RhdGljO1xyXG4iLCJ2YXIgcmVzZXQgPSB7XHJcblx0cGxheWluZzogZmFsc2UsXHJcblx0dG90YWxDbG9jazogMCxcclxuXHRjbG9jazogMCxcclxuXHRsb29wOiBmYWxzZSxcclxuXHRsaW5rZWRUcmFjazogbnVsbCxcclxuXHRzZXF1ZW5jZXM6IFtcclxuXHRcdHtcdFxyXG5cdFx0XHRwbGF5aW5nOiBmYWxzZSxcclxuXHRcdFx0ZHVyOiAxLFxyXG5cdFx0XHRkZWxheTogMCxcclxuXHRcdFx0bG9vcDogZmFsc2UsXHJcblx0XHRcdGxvb3BEZWxheTogMCxcclxuXHRcdFx0cmV0dXJuVG9Jbml0OiBmYWxzZSxcclxuXHRcdFx0dG90YWxDbG9jazogMCxcclxuXHRcdFx0ZGVsYXlDbG9jazogMCxcclxuXHRcdFx0Y2xvY2s6IDAsXHJcblx0XHRcdHNlcTogJ3Jlc2V0U2VxdWVuY2UnXHJcblx0XHR9XHJcblx0XVxyXG5cdFx0XHRcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByZXNldDtcclxuIiwidmFyIHNlcXVlbmNlVXRpbHMgPSByZXF1aXJlKCAnLi4vc2VxdWVuY2VVdGlscy5qcycpO1xyXG52YXIgY3JlYXRlU2VxdWVuY2UgPSBzZXF1ZW5jZVV0aWxzLmNyZWF0ZVNlcXVlbmNlO1xyXG52YXIgY3JlYXRlVHJhY2sgPSBzZXF1ZW5jZVV0aWxzLmNyZWF0ZVRyYWNrO1xyXG5cclxuLy8gaWYgc2VxdWVuY2UuZHVyKGF0aW9uKSAhPSAxXHJcbi8vIFx0XHR0aGVuIFxyXG4vLyBcdFx0XHRzZXF1ZW5jZTpcclxuLy8gXHRcdFx0XHRkdXIgKyBkZWxheSg/KSA9IDFcclxuLy8gaWYgc2VxdWVuY2UubG9vcCA9IHRydWVcclxuLy8gXHRcdHRoZW5cclxuLy8gXHRcdFx0c2VxdWVuY2U6XHJcbi8vXHRcdFx0XHRkdXIgKyBkZWxheSg/KSArIGxvb3BEZWxheSg/KSA9IDw9IDFcclxuXHJcbnZhciBzYWRTZXF1ZW5jZSA9IGNyZWF0ZVNlcXVlbmNlKCB7XHJcblx0c2VxOiAnc2FkU2VxdWVuY2UnXHJcblxyXG59ICk7XHJcblxyXG5cclxudmFyIHNhZCA9IGNyZWF0ZVRyYWNrKCB7XHJcblx0c2VxdWVuY2VzOiBbIHNhZFNlcXVlbmNlIF1cclxufSApO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYWQ7XHJcbiIsInZhciBzZXF1ZW5jZVV0aWxzID0gcmVxdWlyZSggJy4uL3NlcXVlbmNlVXRpbHMuanMnKTtcclxudmFyIGNyZWF0ZVNlcXVlbmNlID0gc2VxdWVuY2VVdGlscy5jcmVhdGVTZXF1ZW5jZTtcclxudmFyIGNyZWF0ZVRyYWNrID0gc2VxdWVuY2VVdGlscy5jcmVhdGVUcmFjaztcclxuXHJcbi8vIGlmIHNlcXVlbmNlLmR1cihhdGlvbikgIT0gMVxyXG4vLyBcdFx0dGhlbiBcclxuLy8gXHRcdFx0c2VxdWVuY2U6XHJcbi8vIFx0XHRcdFx0ZHVyICsgZGVsYXkoPykgPSAxXHJcbi8vIGlmIHNlcXVlbmNlLmxvb3AgPSB0cnVlXHJcbi8vIFx0XHR0aGVuXHJcbi8vIFx0XHRcdHNlcXVlbmNlOlxyXG4vL1x0XHRcdFx0ZHVyICsgZGVsYXkoPykgKyBsb29wRGVsYXkoPykgPSA8PSAxXHJcblxyXG52YXIgc21pbGVTZXF1ZW5jZSA9IGNyZWF0ZVNlcXVlbmNlKCB7XHJcblx0c2VxOiAnc21pbGVTZXF1ZW5jZSdcclxuXHJcbn0gKTtcclxuXHJcblxyXG52YXIgc21pbGUgPSBjcmVhdGVUcmFjaygge1xyXG5cdHNlcXVlbmNlczogWyBzbWlsZVNlcXVlbmNlIF1cclxufSApO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzbWlsZTtcclxuIiwidmFyIHNlcXVlbmNlVXRpbHMgPSByZXF1aXJlKCAnLi4vc2VxdWVuY2VVdGlscy5qcycpO1xyXG52YXIgY3JlYXRlU2VxdWVuY2UgPSBzZXF1ZW5jZVV0aWxzLmNyZWF0ZVNlcXVlbmNlO1xyXG52YXIgY3JlYXRlVHJhY2sgPSBzZXF1ZW5jZVV0aWxzLmNyZWF0ZVRyYWNrO1xyXG5cclxuLy8gaWYgc2VxdWVuY2UuZHVyKGF0aW9uKSAhPSAxXHJcbi8vIFx0XHR0aGVuIFxyXG4vLyBcdFx0XHRzZXF1ZW5jZTpcclxuLy8gXHRcdFx0XHRkdXIgKyBkZWxheSg/KSA9IDFcclxuLy8gaWYgc2VxdWVuY2UubG9vcCA9IHRydWVcclxuLy8gXHRcdHRoZW5cclxuLy8gXHRcdFx0c2VxdWVuY2U6XHJcbi8vXHRcdFx0XHRkdXIgKyBkZWxheSg/KSArIGxvb3BEZWxheSg/KSA9IDw9IDFcclxuXHJcbnZhciB5YXduSW50cm9TZXF1ZW5jZSA9IGNyZWF0ZVNlcXVlbmNlKCB7XHJcblx0c2VxOiAneWF3bkludHJvU2VxdWVuY2UnLFxyXG5cdGR1cjogMC41XHJcblxyXG59ICk7XHJcblxyXG52YXIgeWF3bk1pZHRybzFTZXF1ZW5jZSA9IGNyZWF0ZVNlcXVlbmNlKCB7XHJcblx0c2VxOiAneWF3bk1pZHRybzFTZXF1ZW5jZScsXHJcblx0ZHVyOiAwLjI1XHJcblxyXG59ICk7XHJcblxyXG52YXIgeWF3biA9IGNyZWF0ZVRyYWNrKCB7XHJcblx0c2VxdWVuY2VzOiBbIHlhd25JbnRyb1NlcXVlbmNlLCB5YXduTWlkdHJvMVNlcXVlbmNlIF1cclxufSApO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB5YXduO1xyXG4iLCJ2YXIgX3RyaWdvbm9taWNVdGlscztcclxuXHJcbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XHJcblxyXG4vKipcclxuKiBjYWNoZWQgdmFsdWVzXHJcbiovXHJcblxyXG52YXIgcGlCeUhhbGYgPSBNYXRoLlBpIC8gMTgwO1xyXG52YXIgaGFsZkJ5UGkgPSAxODAgLyBNYXRoLlBJO1xyXG52YXIgdHdvUGkgPSAyICogTWF0aC5QSTtcclxuXHJcbi8qKlxyXG4qIHByb3ZpZGVzIHRyaWdvbm1pYyB1dGlsIG1ldGhvZHMuXHJcbipcclxuKiBAbWl4aW5cclxuKi9cclxudmFyIHRyaWdvbm9taWNVdGlscyA9IChfdHJpZ29ub21pY1V0aWxzID0ge1xyXG5cclxuXHR0d29QaTogdHdvUGksXHJcblx0cGlCeUhhbGY6IHBpQnlIYWxmLFxyXG5cdGhhbGZCeVBpOiBoYWxmQnlQaSxcclxuXHJcblx0YW5nbGU6IGZ1bmN0aW9uKG9yaWdpblgsIG9yaWdpblksIHRhcmdldFgsIHRhcmdldFkpIHtcclxuICAgICAgICB2YXIgZHggPSBvcmlnaW5YIC0gdGFyZ2V0WDtcclxuICAgICAgICB2YXIgZHkgPSBvcmlnaW5ZIC0gdGFyZ2V0WTtcclxuICAgICAgICB2YXIgdGhldGEgPSBNYXRoLmF0YW4yKC1keSwgLWR4KTtcclxuICAgICAgICByZXR1cm4gdGhldGE7XHJcbiAgICB9LFxyXG5cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIGNhbGN1bGF0ZSBkaXN0YW5jZSBiZXR3ZWVuIDIgdmVjdG9yIGNvb3JkaW5hdGVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geDEgLSBYIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5MSAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHgyIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geTIgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDIuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0ZGlzdDogZnVuY3Rpb24gZGlzdCh4MSwgeTEsIHgyLCB5Mikge1xyXG5cdFx0eDIgLT0geDE7eTIgLT0geTE7XHJcblx0XHRyZXR1cm4gTWF0aC5zcXJ0KHgyICogeDIgKyB5MiAqIHkyKTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIGNvbnZlcnQgZGVncmVlcyB0byByYWRpYW5zLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGVncmVlcyAtIHRoZSBkZWdyZWUgdmFsdWUgdG8gY29udmVydC5cclxuICogQHJldHVybnMge251bWJlcn0gcmVzdWx0LlxyXG4gKi9cclxuXHRkZWdyZWVzVG9SYWRpYW5zOiBmdW5jdGlvbiBkZWdyZWVzVG9SYWRpYW5zKGRlZ3JlZXMpIHtcclxuXHRcdHJldHVybiBkZWdyZWVzICogcGlCeUhhbGY7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBjb252ZXJ0IHJhZGlhbnMgdG8gZGVncmVlcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IHJhZGlhbnMgLSB0aGUgZGVncmVlIHZhbHVlIHRvIGNvbnZlcnQuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0cmFkaWFuc1RvRGVncmVlczogZnVuY3Rpb24gcmFkaWFuc1RvRGVncmVlcyhyYWRpYW5zKSB7XHJcblx0XHRyZXR1cm4gcmFkaWFucyAqIGhhbGZCeVBpO1xyXG5cdH0sXHJcblxyXG5cdC8qXHJcbiByZXR1cm4gdXNlZnVsIFRyaWdvbm9taWMgdmFsdWVzIGZyb20gcG9zaXRpb24gb2YgMiBvYmplY3RzIGluIHgveSBzcGFjZVxyXG4gd2hlcmUgeDEveTEgaXMgdGhlIGN1cnJlbnQgcG9pc3Rpb24gYW5kIHgyL3kyIGlzIHRoZSB0YXJnZXQgcG9zaXRpb25cclxuICovXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBjYWxjdWxhdGUgdHJpZ29tb21pYyB2YWx1ZXMgYmV0d2VlbiAyIHZlY3RvciBjb29yZGluYXRlcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IHgxIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geTEgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4MiAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuICogQHBhcmFtIHtudW1iZXJ9IHkyIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBDYWxjdWxhdGlvblxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gZGlzdGFuY2UgVGhlIGRpc3RhbmNlIGJldHdlZW4gdmVjdG9yc1xyXG4gKiBAcHJvcGVydHkge251bWJlcn0gYW5nbGUgVGhlIGFuZ2xlIGJldHdlZW4gdmVjdG9yc1xyXG4gKiBAcmV0dXJucyB7IENhbGN1bGF0aW9uIH0gdGhlIGNhbGN1bGF0ZWQgYW5nbGUgYW5kIGRpc3RhbmNlIGJldHdlZW4gdmVjdG9yc1xyXG4gKi9cclxuXHRnZXRBbmdsZUFuZERpc3RhbmNlOiBmdW5jdGlvbiBnZXRBbmdsZUFuZERpc3RhbmNlKHgxLCB5MSwgeDIsIHkyKSB7XHJcblxyXG5cdFx0Ly8gc2V0IHVwIGJhc2UgdmFsdWVzXHJcblx0XHR2YXIgZFggPSB4MiAtIHgxO1xyXG5cdFx0dmFyIGRZID0geTIgLSB5MTtcclxuXHRcdC8vIGdldCB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgcG9pbnRzXHJcblx0XHR2YXIgZCA9IE1hdGguc3FydChkWCAqIGRYICsgZFkgKiBkWSk7XHJcblx0XHQvLyBhbmdsZSBpbiByYWRpYW5zXHJcblx0XHQvLyB2YXIgcmFkaWFucyA9IE1hdGguYXRhbjIoeURpc3QsIHhEaXN0KSAqIDE4MCAvIE1hdGguUEk7XHJcblx0XHQvLyBhbmdsZSBpbiByYWRpYW5zXHJcblx0XHR2YXIgciA9IE1hdGguYXRhbjIoZFksIGRYKTtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGRpc3RhbmNlOiBkLFxyXG5cdFx0XHRhbmdsZTogclxyXG5cdFx0fTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIGdldCBuZXcgWCBjb29yZGluYXRlIGZyb20gYW5nbGUgYW5kIGRpc3RhbmNlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gcmFkaWFucyAtIHRoZSBhbmdsZSB0byB0cmFuc2Zvcm0gaW4gcmFkaWFucy5cclxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gdGhlIGRpc3RhbmNlIHRvIHRyYW5zZm9ybS5cclxuICogQHJldHVybnMge251bWJlcn0gcmVzdWx0LlxyXG4gKi9cclxuXHRnZXRBZGphY2VudExlbmd0aDogZnVuY3Rpb24gZ2V0QWRqYWNlbnRMZW5ndGgocmFkaWFucywgZGlzdGFuY2UpIHtcclxuXHRcdHJldHVybiBNYXRoLmNvcyhyYWRpYW5zKSAqIGRpc3RhbmNlO1xyXG5cdH1cclxuXHJcbn0sIF9kZWZpbmVQcm9wZXJ0eShfdHJpZ29ub21pY1V0aWxzLCBcImdldEFkamFjZW50TGVuZ3RoXCIsIGZ1bmN0aW9uIGdldEFkamFjZW50TGVuZ3RoKHJhZGlhbnMsIGRpc3RhbmNlKSB7XHJcblx0cmV0dXJuIE1hdGguc2luKHJhZGlhbnMpICogZGlzdGFuY2U7XHJcbn0pLCBfZGVmaW5lUHJvcGVydHkoX3RyaWdvbm9taWNVdGlscywgXCJmaW5kTmV3UG9pbnRcIiwgZnVuY3Rpb24gZmluZE5ld1BvaW50KHgsIHksIGFuZ2xlLCBkaXN0YW5jZSkge1xyXG5cdHJldHVybiB7XHJcblx0XHR4OiBNYXRoLmNvcyhhbmdsZSkgKiBkaXN0YW5jZSArIHgsXHJcblx0XHR5OiBNYXRoLnNpbihhbmdsZSkgKiBkaXN0YW5jZSArIHlcclxuXHR9O1xyXG59KSwgX2RlZmluZVByb3BlcnR5KF90cmlnb25vbWljVXRpbHMsIFwiY2FsY3VsYXRlVmVsb2NpdGllc1wiLCBmdW5jdGlvbiBjYWxjdWxhdGVWZWxvY2l0aWVzKHgsIHksIGFuZ2xlLCBpbXB1bHNlKSB7XHJcblx0dmFyIGEyID0gTWF0aC5hdGFuMihNYXRoLnNpbihhbmdsZSkgKiBpbXB1bHNlICsgeSAtIHksIE1hdGguY29zKGFuZ2xlKSAqIGltcHVsc2UgKyB4IC0geCk7XHJcblx0cmV0dXJuIHtcclxuXHRcdHhWZWw6IE1hdGguY29zKGEyKSAqIGltcHVsc2UsXHJcblx0XHR5VmVsOiBNYXRoLnNpbihhMikgKiBpbXB1bHNlXHJcblx0fTtcclxufSksIF9kZWZpbmVQcm9wZXJ0eShfdHJpZ29ub21pY1V0aWxzLCBcInJhZGlhbERpc3RyaWJ1dGlvblwiLCBmdW5jdGlvbiByYWRpYWxEaXN0cmlidXRpb24oY3gsIGN5LCByLCBhKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHg6IGN4ICsgciAqIE1hdGguY29zKGEpLFxyXG5cdFx0eTogY3kgKyByICogTWF0aC5zaW4oYSlcclxuXHR9O1xyXG59KSwgX3RyaWdvbm9taWNVdGlscyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cy50cmlnb25vbWljVXRpbHMgPSB0cmlnb25vbWljVXRpbHM7Il19
