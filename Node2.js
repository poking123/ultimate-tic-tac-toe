class Node {
    constructor(board, parent, move) {
        this.board = board;
        this.parent = parent;
        this.move = move;
        this.children = [];
        this.score = 0;
        this.visits = 0;
    }

    getBoard() {
        return this.board;
    }

    getParent() {
        return this.parent;
    }

    getChildren() {
        return this.children;
    }

    getMove() {
        return this.move;
    }

    setChildren(children) {
        this.children = children;
    }

    hasChildren() {
        return this.children.length !== 0;
    }

    getScore() {
        return this.score;
    }

    getVisits() {
        return this.visits;
    }

    incScore(inc) {
        this.score += inc;
    }

    incVisits() {
        this.visits++;
    }

    backPropogateValues(inc) {
        this.incScore(inc);
        this.incVisits();
        if (this.parent !== null) {
            this.parent.backPropogateValues(inc);
        }
    }
}

module.exports = Node;