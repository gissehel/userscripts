const cleanString = (str) => {
    if (str.startsWith('\n')) {
        str = str.substring(1);
    }
    if (str.endsWith('\n')) {
        str = str.substring(0, str.length - 1);
    }
    return str;
}
describe('LSData', () => {
    /**
     * Helper function to test markdown generation
     * @param {string} name The test name
     * @param {string} mdFormat The markdown format to test
     * @param {function(lsData: LSData, mdFormat: string): void} prepareCode The code to prepare the LSData instance
     * @param {string} expectedMarkdown The expected markdown output
     */
    testGeneration = (name, mdFormat, prepareCode, expectedMarkdown) => {
        test(name, () => {
            const lsData = LSData.create(mdFormat)
            prepareCode(lsData, mdFormat)
            expect(lsData.toString()).toBe(expectedMarkdown)
        })
    }
    /**
     * @param {LSData} lsData 
     */
    const screnarioCode = (lsData) => {
        lsData.insertH1('Test')
        const section2 = lsData.insertH1('Test2')
        let section3 = section2.insertH2('Test3')
        section3.insertTodo('Grut')
        section3.insertTodo('Mank')
        section3 = section2.insertH2('Test4')
        section3.insertTodo('Shon')
    }
    const expectedForLogseq = cleanString(`
- # Test
- # Test2
  - ## Test3
    - TODO Grut
    - TODO Mank
  - ## Test4
    - TODO Shon
`)
    const expectedForObsidianOutliner = cleanString(`
- # Test
- # Test2
    - ## Test3
        - [ ] Grut
        - [ ] Mank
    - ## Test4
        - [ ] Shon
`)
    const expectedForObsidian = cleanString(`
# Test

# Test2

## Test3

- [ ] Grut
- [ ] Mank

## Test4

- [ ] Shon
`)

    testGeneration('should generate correct markdown for Logseq', MD_FORMATS.LOGSEQ, screnarioCode, expectedForLogseq)
    testGeneration('should generate correct markdown for Obsidian Outliner', MD_FORMATS.OBSIDIAN_OUTLINER, screnarioCode, expectedForObsidianOutliner)
    testGeneration('should generate correct markdown for Obsidian', MD_FORMATS.OBSIDIAN, screnarioCode, expectedForObsidian)

    /**
     * @param {LSData} lsData 
     * @param {string} mdFormat The markdown format to test
     */
    const screnarioCode2 = (lsData, mdFormat) => {
        lsData.insertH1('Test')
        const section2 = lsData.insertH1('Test2')

        const lsData2 = LSData.create(mdFormat)
        let section3 = lsData2.insertH2('Test3')
        section3.insertTodo('Grut')
        section3.insertTodo('Mank')
        section3 = lsData2.insertH2('Test4')
        section3.insertTodo('Shon')
        section2.insertData(lsData2)
    }

    testGeneration('should generate correct markdown for Logseq (with nested data)', MD_FORMATS.LOGSEQ, screnarioCode2, expectedForLogseq)
    testGeneration('should generate correct markdown for Obsidian Outliner (with nested data)', MD_FORMATS.OBSIDIAN_OUTLINER, screnarioCode2, expectedForObsidianOutliner)
    testGeneration('should generate correct markdown for Obsidian (with nested data)', MD_FORMATS.OBSIDIAN, screnarioCode2, expectedForObsidian)

    /**
     * @param {LSData} lsData 
     */
    const screnarioCodeLink = (lsData) => {
        const serieSection = lsData.insertH1("The tale of the story : A not flex's serie")
        const seasonSection = serieSection.insertH2('Saison 2')
        seasonSection.insertLink('https://notflex.com/serie/185472-the-tale-of-the-story.html', 'https://notflex.com/serie/185472-the-tale-of-the-story.html')
        seasonSection.insertBulletLine('TODO Episode 1')
        seasonSection.insertBulletLine('TODO Episode 2')
        seasonSection.insertBulletLine('TODO Episode 3')
    }

    const expectedForLogseqLink = cleanString(`
- # The tale of the story : A not flex's serie
  - ## Saison 2
    - https://notflex.com/serie/185472-the-tale-of-the-story.html
    - TODO Episode 1
    - TODO Episode 2
    - TODO Episode 3
`)
    const expectedForObsidianOutlinerLink = cleanString(`
- # The tale of the story : A not flex's serie
    - ## Saison 2
        - [https://notflex.com/serie/185472-the-tale-of-the-story.html](https://notflex.com/serie/185472-the-tale-of-the-story.html)
        - TODO Episode 1
        - TODO Episode 2
        - TODO Episode 3
`)
    const expectedForObsidianLink = cleanString(`
# The tale of the story : A not flex's serie

## Saison 2

[https://notflex.com/serie/185472-the-tale-of-the-story.html](https://notflex.com/serie/185472-the-tale-of-the-story.html)
- TODO Episode 1
- TODO Episode 2
- TODO Episode 3
`)

    testGeneration('should generate correct markdown for Logseq (with links)', MD_FORMATS.LOGSEQ, screnarioCodeLink, expectedForLogseqLink)
    testGeneration('should generate correct markdown for Obsidian Outliner (with links)', MD_FORMATS.OBSIDIAN_OUTLINER, screnarioCodeLink, expectedForObsidianOutlinerLink)
    testGeneration('should generate correct markdown for Obsidian (with links)', MD_FORMATS.OBSIDIAN, screnarioCodeLink, expectedForObsidianLink)

})