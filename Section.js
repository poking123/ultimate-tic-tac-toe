const { emptySpace } = require('./Constants');

const sectionOneStart = 0;
const sectionTwoStart = 3;
const sectionThreeStart = 6;
const sectionFourStart = 27;
const sectionFiveStart = 30;
const sectionSixStart = 33;
const sectionSevenStart = 54;
const sectionEightStart = 57;
const sectionNineStart = 60;

let sectionStartArray = [sectionOneStart, sectionTwoStart, sectionThreeStart, sectionFourStart, sectionFiveStart, sectionSixStart, sectionSevenStart, sectionEightStart, sectionNineStart ];

function sectionIsFinished(section, overallBoard) {
    if (section === -1) {
        return false;
    }

    let row = Math.floor(section / 3);
    let col = section % 3;
    return overallBoard[row][col] !== emptySpace;
}

function returnSmallBoardSection(move) {
    // if (move === -1) return -1;

    let topLeft = [0, 3, 6, 27, 30, 33, 54, 57, 60];

    if (topLeft.includes(move)) {
        return 0;
    } else if (topLeft.includes(move - 1)) {
        return 1;
    } else if (topLeft.includes(move - 2)) {
        return 2;
    } else if (topLeft.includes(move - 9)) {
        return 3;
    } else if (topLeft.includes(move - 10)) {
        return 4;
    } else if (topLeft.includes(move - 11)) {
        return 5;
    } else if (topLeft.includes(move - 18)) {
        return 6;
    } else if (topLeft.includes(move - 19)) {
        return 7;
    } else if (topLeft.includes(move - 20)) {
        return 8;
    }

    // shouldn't get here
    return -10;
}

function returnOverallBoardSection(index) {
    let topLeft = [0, 3, 6, 27, 30, 33, 54, 57, 60];

    for (let section = 0; section < topLeft.length; section++) {
        let startingIndex = topLeft[section];
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                let currIndex = 9 * j + k + startingIndex;
                if (currIndex === index) return section;
            }
        }
    }

    // shouldn't get here
    return -10;
}

let toExport = {
    sectionOneStart,
    sectionTwoStart,
    sectionThreeStart,
    sectionFourStart,
    sectionFiveStart,
    sectionSixStart,
    sectionSevenStart,
    sectionEightStart,
    sectionNineStart,
    sectionStartArray,
    sectionIsFinished,
    returnSmallBoardSection,
    returnOverallBoardSection,
};

module.exports = toExport;