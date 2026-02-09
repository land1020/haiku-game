const fs = require('fs');
const path = 'c:\\Users\\landk\\OneDrive\\Desktop\\game\\俳句\\性癖俳句_自由記入_Ver4\\index.html';

try {
    const content = fs.readFileSync(path, 'utf-8');
    
    // Extract WORD_DICTIONARY block roughly to ensure we are looking inside it
    const startIdx = content.indexOf('const WORD_DICTIONARY = [');
    const endIdx = content.indexOf('];', startIdx);
    
    if (startIdx === -1 || endIdx === -1) {
        console.log("Could not isolate WORD_DICTIONARY");
        process.exit(1);
    }

    const dictionaryContent = content.substring(startIdx, endIdx + 2);

    // Regex to match each word definition line
    // { text: "...", type: 5, score: ..., isOni: ..., genre: "..." },
    const regex = /{[\s\n]*text:[\s\n]*"([^"]+)"[\s\n]*,[\s\n]*type:[\s\n]*(\d+)[\s\n]*,[\s\n]*score:[\s\n]*(\d+)[\s\n]*,[\s\n]*isOni:[\s\n]*(true|false)[\s\n]*,[\s\n]*genre:[\s\n]*"([^"]+)"[\s\n]*}/g;
    
    let match;
    const words = [];
    
    while ((match = regex.exec(dictionaryContent)) !== null) {
        words.push({
            text: match[1],
            type: parseInt(match[2]),
            score: parseInt(match[3]),
            isOni: match[4] === 'true',
            genre: match[5]
        });
    }

    console.log(`Total words parsed: ${words.length}`);

    // Check for exact duplicates
    const counts = {};
    const exactDuplicates = [];
    
    words.forEach(w => {
        if (!counts[w.text]) {
            counts[w.text] = [];
        }
        counts[w.text].push(w);
    });

    Object.keys(counts).forEach(text => {
        if (counts[text].length > 1) {
            exactDuplicates.push({
                text: text,
                occurrences: counts[text]
            });
        }
    });

    console.log("\n--- Exact Duplicates ---");
    if (exactDuplicates.length === 0) console.log("None");
    exactDuplicates.forEach(d => {
        console.log(`"${d.text}" appears ${d.occurrences.length} times:`);
        d.occurrences.forEach(o => console.log(`  - Type: ${o.type}, Genre: ${o.genre}, Oni: ${o.isOni}`));
    });

} catch (e) {
    console.error("Error:", e);
}
