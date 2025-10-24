import { isInteger, isString } from "../../guard";

export { isString }

/**
 * toCharArray("abc") => ["a", "b", "c"].
 * @param str 
 */
export function toCharArray(str: string): string[] {
    return str.split("");
}

/**
 * repeat("abc", 3) => "abcabcabc".
 * repeat("abc", 0) => "".
 * @param repeatString 
 * @param repeatCount 
 */
export function repeatString(repeatString: string, repeatCount: number): string {
    if (!isInteger(repeatCount) || repeatCount < 0) {
        throw new Error("repeatStr: Invalid repeatCount = " + repeatCount);
    }

    return new Array(repeatCount + 1).join(repeatString);
}

/**
 * "abcdefgh":chunkSize = 3 => ["abc", "def", "gh"]
 * @param str 
 * @param chunkSize
 */
export function chunkString(str: string, chunkSize: number): string[] {
    if (!isInteger(chunkSize) || chunkSize < 1) {
        throw new Error("chunckString: Invalid chuckSize = " + chunkSize);
    }
    let result: string[] = [];
    for (let i = 0; i < str.length; i += chunkSize) {
        result.push(str.slice(i, i + chunkSize));
    }
    return result;
}

/**
 * Replaces part of string.
 * @param str 
 * @param pos 
 * @param removeCount 
 * @param insert 
 */
export function replaceAt(str: string, pos: number, removeCount: number, insert: string) {
    if (!isInteger(removeCount) || removeCount < 0) {
        throw new Error("replaceAt: Invalid removeCount = " + removeCount);
    }
    else if (!isInteger(pos) || pos < 0 || pos + removeCount > str.length) {
        throw new Error("replaceAt: Invalid pos = " + pos + ", removeCount = " + removeCount + ", str.length = " + str.length);
    }
    else {
        return str.substring(0, pos) + insert + str.substring(pos + removeCount);
    }
}

/**
 * Insert string to another.
 * @param str 
 * @param pos 
 * @param insertStr 
 */
export function insertAt(str: string, pos: number, insertStr: string) {
    return replaceAt(str, pos, 0, insertStr);
}

/**
 * Remove part of string.
 * @param str 
 * @param pos 
 * @param removeCount 
 */
export function removeAt(str: string, pos: number, removeCount: number) {
    return replaceAt(str, pos, removeCount, "");
}

/**
 * Count number of char in string.
 * @param str
 * @param ch - must be single char.
 * @returns number of chars in string.
 */
export function charCount(str: string, ch: string): number {
    if (ch.length !== 1 || str.length === 0) return 0;

    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === ch) count++;
    }

    return count;
}

/**
 * "UndeclaredVariable" => "Undeclared variable"
 * @param PascalString 
 */
export function makeSentenceFromPascal(PascalString: string) {
    if (PascalString === "") {
        return "";
    }
    let word = PascalString.charAt(0);
    let sentence = "";

    const addWord = () => {
        if (word !== "") {
            if (sentence === "") {
                sentence += word.charAt(0).toUpperCase() + word.substring(1);
            }
            else {
                sentence += " " + word;
            }
            word = "";
        }
    }

    const isLetterAndCapital = (c: string) => {
        return c.toUpperCase() !== c.toLowerCase() && c === c.toUpperCase();
    }

    for (let i = 1; i < PascalString.length; i++) {
        let c = PascalString.charAt(i);
        if (isLetterAndCapital(c)) {
            addWord();
        }
        word += c.toLowerCase();
    }

    addWord();

    return sentence;
}
