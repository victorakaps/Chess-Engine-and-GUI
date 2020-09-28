function MOVE(from, to, captured, promoted, flag) {
  return from | (to << 7) | (captured << 14) | (promoted << 20) | flag;
}

function AddCaptureMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] = 0;
}

function AddQuietMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] = 0;
}

function AddEnPassaneMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] = 0;
}

function GenerateMoves() {
  GameBoard.moveListStart[GameBoard.ply + 1] =
    GameBoard.moveListStart[GameBoard.ply];
  var pceType;
  var pceNum;
  var sq;
  var pceIndex;
  var pce;
  var t_sq;
  var dir;
  if (GameBoard.side == COLOURS.WHITE) {
    pceType = PIECES.wP;
    for (pceNum = 0; pceNum < GameBoard.pceNum[pceType]; ++pceType) {
      sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];
      if (GameBoard.pieces[sq + 10] == PIECES.EMPTY) {
        // PAwn move
        if (
          RanksBrd[sq] == RANKS.RANK_2 &&
          GameBoard.pieces[sq + 20] == PIECES.EMPTY
        ) {
          // add quiet move
        }
      }
      if (
        SQOFFBOARD(sq + 9) == BOOL.FALSE &&
        PieceCol[GameBoard.pieces[sq + 9]] == COLOURS.BLACK
      ) {
        // Pawn Move
      }
      if (
        SQOFFBOARD(sq + 11) == BOOL.FALSE &&
        PieceCol[GameBoard.pieces[sq + 11]] == COLOURS.BLACK
      ) {
        // Pawn Move
      }
      if (GameBoard != SQUARES.NO_SQ) {
        if (sq + 9 == GameBoard.enPas) {
          // en pasan move
        }
        if (sq + 11 == GameBoard.enPas) {
          // en pasan move
        }
      }
    }

    if (GameBoard.castlePerm & CASTLEBIT.WKCA) {
      if (
        GameBoard.pieces[SQUARES.F1] == PIECES.EMPTY &&
        GameBoard.pieces[SQUARES.G1] == PIECES.EMPTY
      ) {
        if (
          SqAttacked(SQUARES.F1, COLOURS.BLACK) == BOOL.FALSE &&
          SqAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE
        ) {
          // add quiet white king side castel move
        }
      }
    }

    if (GameBoard.castlePerm & CASTLEBIT.WQCA) {
      if (
        GameBoard.pieces[SQUARES.D1] == PIECES.EMPTY &&
        GameBoard.pieces[SQUARES.C1] == PIECES.EMPTY &&
        GameBoard.pieces[SQUARES.B1] == PIECES.EMPTY
      ) {
        if (
          SqAttacked(SQUARES.D1, COLOURS.BLACK) == BOOL.FALSE &&
          SqAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE
        ) {
          // add quiet white queen side castle move
        }
      }
    }
  } else {
    pceType = PIECES.bP;
    for (pceNum = 0; pceNum < GameBoard.pceNum[pceType]; ++pceType) {
      sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];
      if (GameBoard.pieces[sq - 10] == PIECES.EMPTY) {
        // PAwn move
        if (
          RanksBrd[sq] == RANKS.RANK_7 &&
          GameBoard.pieces[sq - 20] == PIECES.EMPTY
        ) {
          // add quiet move
        }
      }
      if (
        SQOFFBOARD(sq - 9) == BOOL.FALSE &&
        PieceCol[GameBoard.pieces[sq - 9]] == COLOURS.WHITE
      ) {
        // Pawn Move
      }
      if (
        SQOFFBOARD(sq - 11) == BOOL.FALSE &&
        PieceCol[GameBoard.pieces[sq - 11]] == COLOURS.WHITE
      ) {
        // Pawn Move
      }
      if (GameBoard != SQUARES.NO_SQ) {
        if (sq - 9 == GameBoard.enPas) {
          // en pasan move
        }
        if (sq - 11 == GameBoard.enPas) {
          // en pasan move
        }
      }
    }
    if (GameBoard.castlePerm & CASTLEBIT.BKCA) {
      if (
        GameBoard.pieces[SQUARES.F8] == PIECES.EMPTY &&
        GameBoard.pieces[SQUARES.G8] == PIECES.EMPTY
      ) {
        if (
          SqAttacked(SQUARES.F8, COLOURS.WHITE) == BOOL.FALSE &&
          SqAttacked(SQUARES.E8, COLOURS.WHITE) == BOOL.FALSE
        ) {
          // add quiet black king side castel move
        }
      }
    }

    if (GameBoard.castlePerm & CASTLEBIT.BQCA) {
      if (
        GameBoard.pieces[SQUARES.D8] == PIECES.EMPTY &&
        GameBoard.pieces[SQUARES.C8] == PIECES.EMPTY &&
        GameBoard.pieces[SQUARES.B8] == PIECES.EMPTY
      ) {
        if (
          SqAttacked(SQUARES.D8, COLOURS.BLACK) == BOOL.FALSE &&
          SqAttacked(SQUARES.E8, COLOURS.BLACK) == BOOL.FALSE
        ) {
          // add quiet white queen side castle move
        }
      }
    }
  }
  pceIndex = LoopNonSlideIndex[GameBoard.side];
  pce = LoopNonSlidePce[pceIndex++];
  while (pce != 0) {
    for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
      sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
      for (index = 0; index < DirNum[pce]; index++) {
        dir = PceDir[pce][index];
        t_sq = sq + dir;
        if (SQOFFBOARD(t_sq) == BOOL.TRUE) {
          continue;
        }
        if (GameBoard.pieces[t_sq] != PIECES.EMPTY) {
          if (PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side) {
            AddCaptureMove(
              MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0)
            );
          }
        } else {
          AddQuietMove(MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0));
        }
      }
    }
    pce = LoopNonSlidePce[pceIndex++];
  }

  pceIndex = LoopSlideIndex[GameBoard.side];
  pce = LoopSlidePce[pceIndex++];

  while (pce != 0) {
    for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
      sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
      for (index = 0; index < DirNum[pce]; index++) {
        dir = PceDir[pce][index];
        t_sq = sq + dir;
        while (SQOFFBOARD(t_sq) == BOOL.FALSE) {
          if (GameBoard.pieces[t_sq] != PIECES.EMPTY) {
            if (PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side) {
              AddCaptureMove(
                MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0)
              );
            }
            break;
          }
          AddQuietMove(MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0));
          t_sq += dir;
        }
      }
    }
    pce = LoopSlidePce[pceIndex++];
  }
}
