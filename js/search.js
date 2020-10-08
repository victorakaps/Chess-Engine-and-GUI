var SearchController = {};

SearchController.nodes;
SearchController.fh;
SearchController.fhf;
SearchController.depth;
SearchController.time;
SearchController.start;
SearchController.stop;
SearchController.best;
SearchController.thinking;

function SearchPosition() {
  var bestMove = NOMOVE;
  var bestScore = -INFINITE;
  var currentDepth = 0;
  for (
    currentDepth = 1;
    currentDepth <= SearchController.depth;
    ++currentDepth
  ) {
    if (SearchController.stop == BOOL.TRUE) {
      break;
    }
  }
  SearchController.best = bestMove;
  SearchController.thinking = BOOL.FALSE;
}
