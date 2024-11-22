import CardinalTrieNode from "./CardinalTrieNode.js";

export default class CardinalTrie {
    /**
     * Constructor for the Cardinal Trie data structure
     * @param {number} k The degree (k) of the cardinal tree
     * @param {Array<string>} [alphabet] Optional alphabet for mapping characters to indices
     */
    constructor(k = 2, alphabet = null) {
        this.k = k;
        this._root = new CardinalTrieNode(null, true, k);
        this._lastIndex = 1;

        if (alphabet) {
            if (alphabet.length !== k)
                throw new Error("Alphabet length must match the k");

            this.alphabet = alphabet;
            this.charToIndex = {};
            this.indexToChar = {};
            for (let i = 0; i < alphabet.length; i++) {
                const char = alphabet[i];
                this.charToIndex[char] = i;
                this.indexToChar[i] = char;
            }
        } else {
            this.alphabet = null;
            this.charToIndex = null;
            this.indexToChar = null;
        }
    }

    /**
     * Get the root node of the Cardinal Trie
     * @returns {CardinalTrieNode}
     */
    get root() {
        return this._root;
    }

    /**
     * Insert a word into the Cardinal Trie and map data onto it.
     * If data is not provided, it is automatically generated as an increasing number.
     * @param {string} word
     * @param {Object} [data]
     */
    insert(word, data) {
        return this._insertWord(word, data, this._root, 0);
    }

    _insertWord(word, data, currentNode, wordIndex) {
        if (wordIndex === word.length) {
            currentNode.word = word;
            currentNode.update(data || this._getNextIndex());
            return true;
        }

        let index;
        if (this.alphabet) {
            const char = word.charAt(wordIndex);
            if (!(char in this.charToIndex))
                throw new Error("Invalid character in word: " + char);
            index = this.charToIndex[char];
        } else {
            index = parseInt(word.charAt(wordIndex), 10);
            if (isNaN(index) || index < 0 || index >= this.k)
                throw new Error("Invalid character in word: " + word.charAt(wordIndex));
        }

        if (!currentNode.hasChild(index)) {
            currentNode.addChild(index, new CardinalTrieNode({ key: index, node: currentNode }, false, this.k));
        }

        return this._insertWord(word, data, currentNode.children[index], wordIndex + 1);
    }

    /**
     * Search for data indexed by the provided word in the Cardinal Trie.
     * @param {string} word
     * @returns {Object|null} Returns the data if found, otherwise null.
     */
    search(word) {
        const node = this._searchNode(word, this._root, 0);
        return !node ? null : node.data;
    }

    _searchNode(word, currentNode, wordIndex) {
        if (wordIndex === word.length) {
            return currentNode.isEndOfWord ? currentNode : null;
        }

        let index;
        if (this.alphabet) {
            const char = word.charAt(wordIndex);
            if (!(char in this.charToIndex))
                return null;
            index = this.charToIndex[char];
        } else {
            index = parseInt(word.charAt(wordIndex), 10);
            if (isNaN(index) || index < 0 || index >= this.k)
                return null;
        }

        return currentNode.hasChild(index) ? this._searchNode(word, currentNode.children[index], wordIndex + 1) : null;
    }

    /**
     * Delete a word from the Cardinal Trie.
     * @param {string} word
     * @returns {boolean} True if the word was deleted, otherwise false.
     */
    delete(word) {
        const node = this._searchNode(word, this._root, 0);
        if (!node)
            return false;

        if (node.hasChildren()) {
            node.update(null);
            return true;
        }

        this._deleteWord(node);
        return true;
    }

    _deleteWord(currentNode) {
        if (currentNode === this._root)
            return;
        const parent = currentNode.parent;

        parent.node.deleteChild(parent.key);
        if (parent.node.hasChildren())
            return;

        this._deleteWord(parent.node);
    }

    /**
     * Update data associated with a word in the Cardinal Trie.
     * @param {string} word
     * @param {*} data
     * @returns {boolean} True if the word was updated, otherwise false.
     */
    update(word, data) {
        const node = this._searchNode(word, this._root, 0);
        if (!node)
            return false;

        node.update(data);
        return true;
    }

    /**
     * Get the node containing data for the given word.
     * @param {string} word
     * @returns {CardinalTrieNode|null}
     */
    getDataNode(word) {
        return this._searchNode(word, this._root, 0);
    }

    /**
     * Get the path (nodes) representing the given word in the Cardinal Trie.
     * @param {string} word
     * @returns {Array<CardinalTrieNode|null>}
     */
    getPath(word) {
        const path = [];
        path.push(this._root);

        for (let i = 1; i <= word.length; i++) {
            path.push(this._searchNode(word.substring(0, i), this._root, 0));
        }

        return path;
    }

    _getNextIndex() {
        return this._lastIndex++;
    }
}
