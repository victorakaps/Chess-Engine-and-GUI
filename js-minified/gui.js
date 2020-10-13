function NewGame(e) {
  ParseFen(e), PrintBoard(), SetInitialBoardPieces(), CheckAndSet();
}
function ClearAllPieces() {
  $(".Piece").remove();
}
function SetInitialBoardPieces() {
  let e, o, a;
  for (ClearAllPieces(), e = 0; e < 64; ++e)
    (o = SQ120(e)),
      (a = GameBoard.pieces[o]) >= PIECES.wP &&
        a <= PIECES.bK &&
        AddGUIPiece(o, a);
}
function DeSelectSq(e) {
  $(".Square").each(function (o) {
    PieceIsOnSq(e, $(this).position().top, $(this).position().left) ==
      BOOL.TRUE && $(this).removeClass("SqSelected");
  });
}
function SetSqSelected(e) {
  $(".Square").each(function (o) {
    PieceIsOnSq(e, $(this).position().top, $(this).position().left) ==
      BOOL.TRUE && $(this).addClass("SqSelected");
  });
}
function ClickedSquare(e, o) {
  console.log("clickedSquare at" + e + "," + o);
  let a = $("#Board").position(),
    r = Math.floor(a.left),
    t = Math.floor(a.top);
  (e = Math.floor(e)), (o = Math.floor(o));
  let i = Math.floor((e - r) / 80),
    c = 7 - Math.floor((o - t) / 80),
    S = FR2SQ(i, c);
  return console.log("clicked square: " + PrSq(S)), SetSqSelected(S), S;
}
function MakeUserMove() {
  if (UserMove.from != SQUARES.NO_SQ && UserMove.to != SQUARES.NO_SQ) {
    console.log("User Move: " + PrSq(UserMove.from) + PrSq(UserMove.to));
    let e = ParseMove(UserMove.from, UserMove.to);
    e != NOMOVE &&
      (MakeMove(e), PrintBoard(), MoveGUIPiece(e), CheckAndSet(), PreSearch()),
      DeSelectSq(UserMove.from),
      DeSelectSq(UserMove.to),
      (UserMove.from = SQUARES.NO_SQ),
      (UserMove.to = SQUARES.NO_SQ);
  }
}
function PieceIsOnSq(e, o, a) {
  return RanksBrd[e] == 7 - Math.round(o / 80) &&
    FilesBrd[e] == Math.round(a / 80)
    ? BOOL.TRUE
    : BOOL.FALSE;
}
function RemoveGUIPiece(e) {
  $(".Piece").each(function (o) {
    PieceIsOnSq(e, $(this).position().top, $(this).position().left) ==
      BOOL.TRUE && $(this).remove();
  });
}
function AddGUIPiece(e, o) {
  let a = FilesBrd[e],
    r = " rank" + (RanksBrd[e] + 1),
    t = "file" + (a + 1),
    i = `<img src=${
      "./pieces_img/" +
      SideChar[PieceCol[o]] +
      PceChar[o].toUpperCase() +
      ".png"
    } class="Piece ${r} ${t}"/>`;
  $("#Board").append(i);
}
function MoveGUIPiece(e) {
  let o = FROMSQ(e),
    a = TOSQ(e);
  e & MFLAGEP
    ? RemoveGUIPiece(GameBoard.side == COLOURS.BLACK ? a - 10 : a + 10)
    : CAPTURED(e) && RemoveGUIPiece(a);
  let r = FilesBrd[a],
    t = " rank" + (RanksBrd[a] + 1),
    i = "file" + (r + 1);
  if (
    ($(".Piece").each(function (e) {
      PieceIsOnSq(o, $(this).position().top, $(this).position().left) ==
        BOOL.TRUE &&
        ($(this).removeClass(), $(this).addClass(`Piece ${t} ${i}`));
    }),
    e & MFLAGCA)
  )
    switch (a) {
      case SQUARES.G1:
        RemoveGUIPiece(SQUARES.H1), AddGUIPiece(SQUARES.F1, PIECES.wR);
        break;
      case SQUARES.C1:
        RemoveGUIPiece(SQUARES.A1), AddGUIPiece(SQUARES.D1, PIECES.wR);
        break;
      case SQUARES.G8:
        RemoveGUIPiece(SQUARES.H8), AddGUIPiece(SQUARES.F8, PIECES.bR);
        break;
      case SQUARES.C8:
        RemoveGUIPiece(SQUARES.A8), AddGUIPiece(SQUARES.D8, PIECES.bR);
    }
  else PROMOTED(e) && (RemoveGUIPiece(a), AddGUIPiece(a, PROMOTED(e)));
}
function DrawMaterial() {
  return 0 != GameBoard.pceNum[PIECES.wP] || 0 != GameBoard.pceNum[PIECES.bP]
    ? BOOL.FALSE
    : 0 != GameBoard.pceNum[PIECES.wQ] ||
      0 != GameBoard.pceNum[PIECES.bQ] ||
      0 != GameBoard.pceNum[PIECES.wR] ||
      0 != GameBoard.pceNum[PIECES.bR]
    ? BOOL.FALSE
    : GameBoard.pceNum[PIECES.wB] > 1 || GameBoard.pceNum[PIECES.bB] > 1
    ? BOOL.FALSE
    : GameBoard.pceNum[PIECES.wN] > 1 || GameBoard.pceNum[PIECES.bN] > 1
    ? BOOL.FALSE
    : 0 != GameBoard.pceNum[PIECES.wN] && 0 != GameBoard.pceNum[PIECES.wB]
    ? BOOL.FALSE
    : 0 != GameBoard.pceNum[PIECES.bN] && 0 != GameBoard.pceNum[PIECES.bB]
    ? BOOL.FALSE
    : BOOL.TRUE;
}
function ThreeFoldRep() {
  let e = 0,
    o = 0;
  for (e = 0; e < GameBoard.hisPly; ++e)
    GameBoard.history[e].posKey == GameBoard.posKey && o++;
  return o;
}
function CheckResult() {
  if (GameBoard.fiftyMove >= 100)
    return $("#GameStatus").text("GAME DRAWN By Fifty Move Rule"), BOOL.TRUE;
  if (ThreeFoldRep() >= 2)
    return $("#GameStatus").text("GAME DRAWN By Repetition"), BOOL.TRUE;
  if (DrawMaterial() == BOOL.TRUE)
    return (
      $("#GameStatus").text("GAME DRAWN Due To Insufficient Material"),
      BOOL.TRUE
    );
  GenerateMoves();
  let e = 0,
    o = 0;
  for (
    e = GameBoard.moveListStart[GameBoard.ply];
    e < GameBoard.moveListStart[GameBoard.ply + 1];
    ++e
  )
    if (MakeMove(GameBoard.moveList[e]) != BOOL.FALSE) {
      o++, TakeMove();
      break;
    }
  return 0 != o
    ? BOOL.FALSE
    : SqAttacked(
        GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)],
        1 ^ GameBoard.side
      ) == BOOL.TRUE
    ? GameBoard.side == COLOURS.WHITE
      ? ($("#GameStatus").text("GAME OVER Black Wins"), BOOL.TRUE)
      : ($("#GameStatus").text("GAME OVER White Wins"), BOOL.TRUE)
    : ($("#GameStatus").text("GAME DRAWN Stalemate"), BOOL.TRUE);
}
function CheckAndSet() {
  CheckResult() == BOOL.TRUE
    ? (GameController.GameOver = BOOL.TRUE)
    : ((GameController.GameOver = BOOL.FALSE), $("#GameStatus").text(""));
}
function PreSearch() {
  GameController.GameOver == BOOL.FALSE &&
    (SearchController.thinking,
    BOOL.TRUE,
    setTimeout(function () {
      StartSearch();
    }, 200));
}
function StartSearch() {
  SearchController.depth = MAXDEPTH;
  $.now();
  let e = $("#ThinkTimeChoice").val();
  (SearchController.time = 1e3 * parseInt(e)),
    SearchPosition(),
    MakeMove(SearchController.best),
    MoveGUIPiece(SearchController.best),
    CheckAndSet();
}
$("#SetFen").click(function () {
  let e = $("#fenIn").val();
  e || (console.log("Trigered"), (e = START_FEN)),
    $("#FenInDiv").toggleClass("Hide"),
    $("#fenIn").val(""),
    NewGame(e);
}),
  $("#TakeButton").click(function () {
    GameBoard.hisPly > 0 &&
      (TakeMove(), (GameBoard.ply = 0), SetInitialBoardPieces());
  }),
  $("#NewGameButton").click(function () {
    NewGame(START_FEN);
  }),
  $("#FenButton").click(function () {
    $("#FenInDiv").toggleClass("Hide");
  }),
  $(document).on("click", ".Piece", function (e) {
    console.log("Piece Click"),
      UserMove.from == SQUARES.NO_SQ
        ? (UserMove.from = ClickedSquare(e.pageX, e.pageY))
        : (UserMove.to = ClickedSquare(e.pageX, e.pageY)),
      MakeUserMove();
  }),
  $(document).on("click", ".Square", function (e) {
    console.log("Square Click"),
      UserMove.from != SQUARES.NO_SQ &&
        ((UserMove.to = ClickedSquare(e.pageX, e.pageY)), MakeUserMove());
  }),
  $("#SearchButton").click(function () {
    (GameController.PlayerSide = 1 ^ GameController.side), PreSearch();
  });
