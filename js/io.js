function PrSq(sq) {
  return FileChar[FilesBrd[sq]] + RankChar[RanksBrd[sq]];
}

function PrMove(move) {
  let MvStr;

  let ff = FilesBrd[FROMSQ(move)];
  let rf = RanksBrd[FROMSQ(move)];
  let ft = FilesBrd[TOSQ(move)];
  let rt = RanksBrd[TOSQ(move)];

  MvStr = FileChar[ff] + RankChar[rf] + FileChar[ft] + RankChar[rt];

  let promoted = PROMOTED(move);

  if (promoted != PIECES.EMPTY) {
    let pchar = "q";
    if (PieceKnight[promoted] == BOOL.TRUE) {
      pchar = "n";
    } else if (
      PieceRookQueen[promoted] == BOOL.TRUE &&
      PieceBishopQueen[promoted] == BOOL.FALSE
    ) {
      pchar = "r";
    } else if (
      PieceRookQueen[promoted] == BOOL.FALSE &&
      PieceBishopQueen[promoted] == BOOL.TRUE
    ) {
      pchar = "b";
    }
    MvStr += pchar;
  }
  return MvStr;
}

function PrintMoveList() {
  let index;
  let move;
  console.log("MOVELIST:");
  for (
    index = GameBoard.moveListStart[GameBoard.ply];
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    ++index
  ) {
    move = GameBoard.moveList[index];
    console.log(PrMove(move));
  }
}
