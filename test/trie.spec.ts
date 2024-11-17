const {describe, expect, test, beforeEach} = require("@jest/globals");
const {Trie, TrieNode} = require("../dist/grove.js");

// Type definitions for the test
describe("Trie spec", () => {

    let trie;

    beforeEach(() => {
        trie = new Trie();
    });

    test("creating new instance of Trie", () => {
        expect(trie).toBeDefined();
        expect(trie).toBeInstanceOf(Trie);
        expect(trie.root).toBeInstanceOf(TrieNode);
        expect(trie["_lastIndex"]).toEqual(1); // Accessing _lastIndex as it's private
    });

    test("inserting word CACAO", () => {
        const word = "CACAO";

        trie.insert(word);
        console.log(trie.search(word));
        expect(trie.search(word)).toBe(1);
    });
});
