export default class CardinalTrieNode {
    /**
     * Constructor of a new node in the Cardinal Trie data structure
     * @param {Object} parent Parent config object
     * @param {number} parent.key Index for this node in its parent node
     * @param {CardinalTrieNode} parent.node Reference to the parent node
     * @param {boolean} [isRoot] Boolean flag indicating if this node is the root
     * @param {number} k The degree (k) of the cardinal tree
     */
    constructor(parent = { key: null, node: null }, isRoot = false, k = 2) {
        if (!isRoot && (parent.key === null || typeof parent.key !== 'number'))
            throw new Error("Parent key cannot be null or not type of number!");
        if (!isRoot && (!parent.node || !(parent.node instanceof CardinalTrieNode)))
            throw new Error("Parent node cannot be null or not instance of CardinalTrieNode");

        this._parent = parent;
        this.k = k;
        this._children = new Array(k).fill(null);
        this.data = null;
        this.isEndOfWord = false;
        this.word = null;
    }

    /**
     * Get parent object consisting of the child index and parent node.
     * @returns {{key: number, node: CardinalTrieNode}}
     */
    get parent() {
        return this._parent;
    }

    /**
     * Get array of all node's children.
     * @returns {Array<CardinalTrieNode|null>} Array of child nodes.
     */
    get children() {
        return this._children;
    }

    /**
     * Update indexed data of the node.
     * @param {*} data If data is set, the node is marked as the end of a word.
     */
    update(data) {
        this.isEndOfWord = !!data;
        this.data = data;

        if (!this.isEndOfWord)
            this.word = null;
    }

    /**
     * Remove parent object from this node.
     */
    unlink() {
        this._parent = { key: null, node: null };
    }

    /**
     * Check if the node has any child nodes attached to it.
     * @returns {boolean} True if it has any children, otherwise false.
     */
    hasChildren() {
        return this._children.some(child => child !== null);
    }

    /**
     * Delete child at the given index.
     * @param {number} index Child index
     */
    deleteChild(index) {
        if (index < 0 || index >= this.k || this._children[index] === null)
            return;

        this._children[index].update(null);
        this._children[index].unlink();
        this._children[index].word = null;
        this._children[index] = null;
    }

    /**
     * Add a child to the node at the specified index.
     * @param {number} index Child index
     * @param {CardinalTrieNode} node Child node to add
     * @returns {CardinalTrieNode|null} Returns the old child if it existed, otherwise null.
     */
    addChild(index, node) {
        if (index < 0 || index >= this.k || !node)
            return null;

        const old = this._children[index];
        this._children[index] = node;
        return old;
    }

    /**
     * Check if the node has a child at the specified index.
     * @param {number} index Child index
     * @returns {boolean} True if a child exists at the index, otherwise false.
     */
    hasChild(index) {
        return index >= 0 && index < this.k && this._children[index] !== null;
    }
}
