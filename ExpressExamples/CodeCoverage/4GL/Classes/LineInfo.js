class LineInfo {
    constructor(sourceName, lineNumber, startCol, endCol)
    {
        this.sourceName = sourceName;
        this.lineNumber = lineNumber;
        this.startCol = startCol;
        this.endCol = endCol;
    }
};

exports.LineInfo = LineInfo;