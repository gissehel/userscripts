// @import{MD_FORMATS}

/**
 * Class to create LogSeq/Obsidian markdown data structures.
 */
class LSData {
    /**
     * Creates a new LSData instance.
     * @param {'obsidian'|'logseq'} format The format to use.
     * @returns {LSData}
     */
    constructor(format = MD_FORMATS.LOGSEQ) {
        this.data = [];
        this.line = '';
        this.isRoot = false;
        this._format = format;
        this._outliner = true;
        if (this._format === MD_FORMATS.OBSIDIAN || this._format === MD_FORMATS.OBSIDIAN_OUTLINER) {
            this.indentPattern = '    '
        } else {
            this.indentPattern = '  '
        }
        if (this._format === MD_FORMATS.OBSIDIAN) {
            this._outliner = false;
        }
        this._emptyBox = '[ ]'
        if (this._format === MD_FORMATS.LOGSEQ) {
            this._emptyBox = 'TODO'
        }
        this._lastLineWasEmpty = true;
    }

    /**
     * Pushes an instance to the data array, handling empty line logic
     * 
     * @param {LSData} instance The instance of the subNode to add to this node
     */
    _pushInstance(instance) {
        if (this._outliner || !this._lastLineWasEmpty || instance.line !== '' || instance.data.length > 0) {
            this.data.push(instance);
            this._lastLineWasEmpty = (!this._outliner) && (instance.line === '');
        }
    }

    /**
     * Inserts raw markdown line
     * 
     * @param {string} item The markdown line
     * @returns {LSData}
     */
    insertRawMarkdown(item) {
        const itemData = new LSData(this._format);
        itemData.line = item;
        this._pushInstance(itemData);
        return itemData;
    }

    /**
     * Inserts a markdown line
     * @param {string} line The markdown line
     * @returns {LSData}
     */
    insertLine(line, withEmpty = false) {
        if (this._outliner) {
            return this.insertBulletLine(line);
        } else {
            if (withEmpty) {
                this.insertRawMarkdown('');
            }
            this.insertRawMarkdown(line);
            if (withEmpty) {
                this.insertRawMarkdown('');
            }
            return this;
        }
    }

    insertBulletLine(line) {
        const result = this.insertRawMarkdown(`- ${line}`);
        if (this._outliner) {
            return result;
        } else {
            return this;
        }
    }

    /**
     * Inserts a heading level 1
     * @param {string} title The heading title
     * @returns {LSData}
     */
    insertH1(title) {
        return this.insertLine(`# ${title}`, true);
    }
    /**
     * Inserts a heading level 2
     * @param {string} title The heading title
     * @returns {LSData}
     */
    insertH2(title) {
        return this.insertLine(`## ${title}`, true);
    }

    /**
     * Inserts a heading level 3
     * @param {string} title The heading title
     * @returns {LSData}
     */
    insertH3(title) {
        return this.insertLine(`### ${title}`, true);
    }
    /**
     * Inserts a heading level 4
     * @param {string} title The heading title
     * @returns {LSData}
     */
    insertH4(title) {
        return this.insertLine(`#### ${title}`, true);
    }
    /**
     * Inserts a property
     * @param {string} key The property key
     * @param {string} value The property value
     * @returns {LSData}
     */
    insertProperty(key, value) {
        if (this._format === MD_FORMATS.LOGSEQ) {
            this.insertRawMarkdown(`${key}:: ${value}`);
        }
        return this;
    }
    /**
     * Inserts a collapsed property
     * @param {boolean} value Whether the block is collapsed
     * @returns {LSData}
     */
    collapsed(value = true) {
        return this.insertProperty('collapsed', value ? 'true' : 'false');
    }

    /**
     * Inserts a link
     * @param {string} name The link name
     * @param {string} url The link URL
     * @returns {LSData}
     */
    insertLink(name, url) {
        if (this._format === MD_FORMATS.LOGSEQ && name === url) {
            return this.insertLine(url);
        }
        return this.insertLine(`[${name}](${url})`);
    }

    /**
     * 
     * @param {string} name The link name
     * @param {string} url The link URL
     * @returns {LSData}
     */
    insertTodoLink(name, url) {
        return this.insertBulletLine(`${this._emptyBox} [${name}](${url})`);
    }
    insertTodo(line) {
        return this.insertBulletLine(`${this._emptyBox} ${line}`);
    }

    /**
     * Inserts data
     * @param {LSData} instance The data to insert
     * @returns {LSData}
     */
    insertData(instance) {
        if (instance.isRoot) {
            for (const child of instance.data) {
                this._pushInstance(child);
            }
        } else {
            this._pushInstance(instance);
        }
        return instance;
    }

    /**
     * Gets all lines as an array 
     * @param {string} indent The indentation string
     * @returns {string[]} An array of all lines
     */
    getAllLines(indent = '') {
        let result = []
        if (this.line !== null && this !== undefined) {
            if ((!this.isRoot) || (this.line.length !== 0)) {
                result.push(indent + this.line);
            }
        }
        for (const child of this.data) {
            result = result.concat(child.getAllLines(this.line ? indent + this.indentPattern : indent));
        }
        return result;
    }

    /**
     * Converts the data to a markdown string
     * @returns {string} The markdown string
     */
    toString() {
        return this.getAllLines().join('\n');
    }

    /**
     * Creates a root LSData instance
     * 
     * @param {'obsidian'|'logseq'} format The format to use.
     * @returns {LSData} The root LSData instance
     */
    static create(format = MD_FORMATS.LOGSEQ) {
        const result = new LSData(format);
        result.isRoot = true;
        return result;
    }
}
