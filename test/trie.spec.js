const {describe, expect, test, beforeEach} = require("@jest/globals");
const {Trie, TrieNode} = require("../dist/grove.js");


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
