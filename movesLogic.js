//MovesLogic.js
class ShortRange {
    constructor(graphic, piece, links) {
        this._graphic = graphic;
        this._piece = piece;
        this._links = links;
        this._playing = true;
    }

    getSquares(square) {
        let samePlayer = false;
        let opponentPlayer = false;
        if (square !== null && square._piece) {
            samePlayer = (square._piece._player._number === this._piece._player._number) && (square._piece._piece._playing);
            opponentPlayer = (square._piece._player._number !== this._piece._player._number) && (square._piece._piece._playing);
        }
        let outsideBoard = (square === null);
        if (outsideBoard || samePlayer || (opponentPlayer && this._link === this._condition1) || (this._link !== this._condition1 && square._piece._piece._playing === false)) {
            return;
        } else {
            this._links[this._link] = square;
        }
    }

    getMoves() {
        for (let link of Object.keys(this._links)) {
            this._links[link] = null;
            this._link = link;
            let square = this._piece._square._links[this._link];
            this.getSquares(square);
        }
        let moves = [];
        for (let link of Object.values(this._links)) {
            if (link) {
                moves.push(link);
            }
        }
        return moves;
    }
}

class King extends ShortRange {
    constructor(piece) {
        let graphic = { 'black': '♔', 'white': '♚' };
        let links = { 'diagpp': 0, 'diagnp': 0, 'diagnn': 0, 'diagpn': 0, 'above': 0, 'below': 0, 'right': 0, 'left': 0 };
        super(graphic, piece, links);
        this._condition1 = null;
        this._condition2 = [null, null];
    }
}

class Pawn extends ShortRange {
    constructor(piece) {
        let graphic = { 'black': '♙', 'white': '♟' };
        let links = [{ 'diagpn': 0, 'diagnn': 0, 'below': 0 }, { 'diagpp': 0, 'diagnp': 0, 'above': 0 }];
        let condition1 = ['below', 'above'][piece._player._number];
        let condition2 = [['diagnn', 'diagpn'], ['diagnp', 'diagpp']][piece._player._number];
        super(graphic, piece, links[piece._player._number]);
        this._condition1 = condition1;
        this._condition2 = condition2;
    }

    checkAscend() {
        let squareIndex = this._piece._square._board._squares.indexOf(this._piece._square);
        if ((squareIndex < 8 && this._piece._square._board._turn === 1) || (squareIndex > 56 && this._piece._square._board._turn === 0)) {
            this._piece._piece = new Queen(this._piece);
            this._piece._graphic = this._piece._piece._graphic[this._piece._color];
        }
        return this._piece;
    }
}

class LongRange {
    constructor(graphic, piece, links) {
        this._graphic = graphic;
        this._piece = piece;
        this._links = links;
        this._playing = true;
    }

    getSquares(square) {
        let samePlayer = false;
        let opponentPlayer = false;
        if (square !== null && square._piece) {
            samePlayer = (square._piece._player._number === this._piece._player._number) && (square._piece._piece._playing);
            opponentPlayer = (square._piece._player._number !== this._piece._player._number) && (square._piece._piece._playing);
        }
        let outsideBoard = (square === null);
        if (outsideBoard || samePlayer) {
            return;
        } else if (opponentPlayer) {
            this._links[this._link].push(square);
        } else {
            this._links[this._link].push(square);
            this.getSquares(square._links[this._link]);
        }
    }

    getMoves() {
        for (let link of Object.keys(this._links)) {
            this._links[link] = [];
            this._link = link;
            let square = this._piece._square._links[this._link];
            this.getSquares(square);
        }
        let moves = [];
        for (let link of Object.values(this._links)) {
            moves = moves.concat(link);
        }
        return moves;
    }
}

class Rook extends LongRange {
    constructor(piece) {
        let graphic = { 'black': '♖', 'white': '♜' };
        let links = { 'above': [], 'below': [], 'right': [], 'left': [] };
        super(graphic, piece, links);
    }
}

class Bishop extends LongRange {
    constructor(piece) {
        let graphic = { 'black': '♗', 'white': '♝' };
        let links = { 'diagpp': [], 'diagnp': [], 'diagnn': [], 'diagpn': [] };
        super(graphic, piece, links);
    }
}

class Queen extends LongRange {
    constructor(piece) {
        let graphic = { 'black': '♕', 'white': '♛' };
        let links = { 'diagpp': [], 'diagnp': [], 'diagnn': [], 'diagpn': [], 'above': [], 'below': [], 'right': [], 'left': [] };
        super(graphic, piece, links);
    }
}

class Knight {
    constructor(piece) {
        let graphic = { 'black': '♘', 'white': '♞' };
        this._piece = piece;
        this._graphic = graphic;
        this._playing = true;
    }

    getMoves() {
        this._links = {
            'abover': ['above', 'diagpp'], 'abovel': ['above', 'diagnp'], 'belowl': ['below', 'diagnn'], 'belowr': ['below', 'diagpn'],
            'righta': ['right', 'diagpp'], 'lefta': ['left', 'diagnp'], 'leftb': ['left', 'diagnn'], 'rightn': ['right', 'diagpn']
        };
        this._pLinks = this._piece._square._links;
        for (let link of Object.keys(this._links)) {
            let linkV = this._links[link];
            let first = this._piece._square._links[linkV[0]];
            let second = first ? first._links[linkV[1]] : null;
            if (second && second._piece._player._number === this._piece._player._number && second._piece._piece._playing) {
                second = null;
            }
            this._links[link] = second;
        }
        return Object.values(this._links);
    }
}

class Empty {
    constructor(piece) {
        this._graphic = { 'black': null, 'white': null };
        this._piece = piece;
        this._playing = false;
    }
}

export { Pawn, King, Rook, Bishop, Knight, Queen, Empty };