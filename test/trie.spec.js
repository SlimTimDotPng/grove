const {describe, expect, test, beforeEach} = require("@jest/globals");
const {Trie, TrieNode, CardinalTrie, CardinalTrieNode} = require("../dist/grove.js");


describe("Trie spec", () => {

    let trie;

    beforeEach(() => {
        trie = new Trie();
    });

    test("creating new instance of Trie", () => {
        expect(trie).toBeDefined();
        expect(trie).toBeInstanceOf(Trie);
        expect(trie.root).toBeInstanceOf(TrieNode);
        expect(trie._lastIndex).toEqual(1);
    });

    test("inserting word CACAO", () => {
        const word = "CACAO";

        trie.insert(word);
        console.log(trie.search(word));
        expect(trie.search(word)).toBe(1);
    })
});

describe("CardinalTrie spec", () => {

    let cardinalTrie;

    beforeEach(() => {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
        cardinalTrie = new CardinalTrie(36, alphabet);
    });

    test("should insert and search words", () => {
        const word = "caca0";

        cardinalTrie.insert(word);
        expect(cardinalTrie.search(word)).toBe(1);
        expect(cardinalTrie.search("caca")).toBe(null);
        expect(cardinalTrie.search("cacap")).toBe(null);
        cardinalTrie.insert("cake");
        expect(cardinalTrie.search("cake")).toBe(2);
        expect(cardinalTrie.search("ca")).toBe(null);
        cardinalTrie.insert("cat");
        expect(cardinalTrie.search("cat")).toBe(3);
    });

    test("should delete a word from the trie", () => {
        const word = "delete";
        cardinalTrie.insert(word);
        expect(cardinalTrie.search(word)).toBe(1);
        cardinalTrie.delete(word);
        expect(cardinalTrie.search(word)).toBe(null);
    });

    test("should update the data of a word", () => {
        const word = "update";
        const initialData = 1;
        const updatedData = 99;

        cardinalTrie.insert(word, initialData);
        expect(cardinalTrie.search(word)).toBe(initialData);

        cardinalTrie.update(word, updatedData);
        expect(cardinalTrie.search(word)).toBe(updatedData);
    });

    test("should retrieve the path of a word", () => {
        const word = "path";

        cardinalTrie.insert(word);
        const path = cardinalTrie.getPath(word);
        
        expect(path.length).toBe(word.length + 1);
        expect(path[path.length - 1].data).toBe(1);
    });

    test("should handle insertion and search with overlapping prefixes", () => {
        cardinalTrie.insert("prefix");
        cardinalTrie.insert("prefixes");
        cardinalTrie.insert("prefixed");

        expect(cardinalTrie.search("prefix")).toBe(1);
        expect(cardinalTrie.search("prefixes")).toBe(2);
        expect(cardinalTrie.search("prefixed")).toBe(3);
        expect(cardinalTrie.search("prefi")).toBe(null);
    });

    test("should throw an error for invalid characters in word", () => {
        const invalidWord = "invalid!";

        expect(() => cardinalTrie.insert(invalidWord)).toThrowError(
            new Error("Invalid character in word: !")
        );
        expect(cardinalTrie.search(invalidWord)).toBe(null);
    });
    
    test("should return null when searching in an empty trie", () => {
        expect(cardinalTrie.search("anyword")).toBe(null);
    });

    test("inserting very long word to test recursion depth", () => {
        const longWord = 'a'.repeat(5500);
        expect(() => cardinalTrie.insert(longWord)).not.toThrow();
        expect(cardinalTrie.search(longWord)).toBe(1);
    });
});

describe("CardinalTrie without alphabet", () => {
    let cardinalTrie;

    beforeEach(() => {
        cardinalTrie = new CardinalTrie(10);
    });

    test("should insert and search numeric words", () => {
        const word = "0123456789";
        cardinalTrie.insert(word);
        expect(cardinalTrie.search(word)).toBe(1);
        expect(cardinalTrie.search("01234")).toBe(null);
    });

    test("should throw an error for invalid characters (non-digit)", () => {
        const invalidWord = "123a5";
        expect(() => cardinalTrie.insert(invalidWord)).toThrowError(
            new Error("Invalid character in word: a")
        );
    });

    test("should handle insertion and search with overlapping numeric prefixes", () => {
        cardinalTrie.insert("123");
        cardinalTrie.insert("1234");
        cardinalTrie.insert("12345");

        expect(cardinalTrie.search("123")).toBe(1);
        expect(cardinalTrie.search("1234")).toBe(2);
        expect(cardinalTrie.search("12345")).toBe(3);
        expect(cardinalTrie.search("12")).toBe(null);
    });

    test("should return null when searching for non-existent numeric word", () => {
        expect(cardinalTrie.search("98765")).toBe(null);
    });
});

describe("CardinalTrieNode spec", () => {
    test("should throw an error if parent key is null and not root", () => {
        expect(() => {
            new CardinalTrieNode({ key: null, node: new CardinalTrieNode({}, true) }, false, 2);
        }).toThrowError("Parent key cannot be null or not type of number!");
    });

    test("should throw an error if parent node is null and not root", () => {
        expect(() => {
            new CardinalTrieNode({ key: 0, node: null }, false, 2);
        }).toThrowError("Parent node cannot be null or not instance of CardinalTrieNode");
    });

    test("should create a root node without a parent", () => {
        const rootNode = new CardinalTrieNode({}, true, 2);
        expect(rootNode).toBeDefined();
        expect(rootNode.isEndOfWord).toBe(false);
        expect(rootNode.hasChildren()).toBe(false);
    });
});


describe("CardinalTrieNode methods", () => {
    let node, childNode;

    beforeEach(() => {
        node = new CardinalTrieNode({}, true, 2);
        childNode = new CardinalTrieNode({ key: 0, node: node }, false, 2);
        node.addChild(0, childNode);
    });

    test("should check if node has a child at a specific index", () => {
        expect(node.hasChild(0)).toBe(true);
        expect(node.hasChild(1)).toBe(false);
    });

    test("should add and delete child nodes correctly", () => {
        const newChild = new CardinalTrieNode({ key: 1, node: node }, false, 2);
        node.addChild(1, newChild);
        expect(node.hasChild(1)).toBe(true);

        node.deleteChild(1);
        expect(node.hasChild(1)).toBe(false);
    });

    test("should verify if node has any children", () => {
        expect(node.hasChildren()).toBe(true);
        node.deleteChild(0);
        expect(node.hasChildren()).toBe(false);
    });

    test("should unlink a child node from its parent", () => {
        expect(childNode.parent.node).toBe(node);
        childNode.unlink();
        expect(childNode.parent.node).toBe(null);
    });

    test("should update node data correctly", () => {
        childNode.update("testData");
        expect(childNode.data).toBe("testData");
        expect(childNode.isEndOfWord).toBe(true);

        childNode.update(null);
        expect(childNode.data).toBe(null);
        expect(childNode.isEndOfWord).toBe(false);
    });
});

describe("CardinalTrie additional tests", () => {
    let cardinalTrie;

    beforeEach(() => {
        const alphabet = 'abc'.split('');
        cardinalTrie = new CardinalTrie(3, alphabet);
    });

    test("should handle insertion with provided data", () => {
        const word = "abc";
        const data = { value: 42 };
        cardinalTrie.insert(word, data);
        expect(cardinalTrie.search(word)).toBe(data);
    });

    test("should update existing word with new data", () => {
        const word = "abc";
        const initialData = { value: 1 };
        const updatedData = { value: 2 };
        cardinalTrie.insert(word, initialData);
        cardinalTrie.update(word, updatedData);
        expect(cardinalTrie.search(word)).toBe(updatedData);
    });

    test("should delete a word and ensure it's removed", () => {
        const word = "abc";
        cardinalTrie.insert(word);
        expect(cardinalTrie.search(word)).toBe(1);
        cardinalTrie.delete(word);
        expect(cardinalTrie.search(word)).toBe(null);
    });

    test("should retrieve the correct path for a given word", () => {
        const word = "abc";
        cardinalTrie.insert(word);
        const path = cardinalTrie.getPath(word);
        expect(path.length).toBe(word.length + 1);
        expect(path[0]).toBe(cardinalTrie.root);
        expect(path[word.length].isEndOfWord).toBe(true);
    });

    test("should return null when searching for a non-existent word", () => {
        expect(cardinalTrie.search("nonexistent")).toBe(null);
    });

    test("should handle insertion and search with overlapping prefixes without alphabet", () => {
        cardinalTrie = new CardinalTrie(2);
        cardinalTrie.insert("0");
        cardinalTrie.insert("01");
        cardinalTrie.insert("011");

        expect(cardinalTrie.search("0")).toBe(1);
        expect(cardinalTrie.search("01")).toBe(2);
        expect(cardinalTrie.search("011")).toBe(3);
        expect(cardinalTrie.search("1")).toBe(null);
    });

    test("should throw an error when inserting a word with invalid character without alphabet", () => {
        cardinalTrie = new CardinalTrie(2);
        expect(() => cardinalTrie.insert("012")).toThrowError(
            "Invalid character in word: 2"
        );
    });
});