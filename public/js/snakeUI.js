var SnakeGame = (function () {

  var Game = function (opts) {
    var game = this;

    game.board = new SnakeBoard(opts.dim, 
      opts.numApples, 
      opts.numWalls
    );

    game.dim = opts.dim;
    game.numWalls = opts.numWalls;
    game.numApples = opts.numApples;
    game.timeStep = opts.timeStep;
    
    game.initDisplay();

    game.bindKeys();
    game.setInterval(opts.timeStep);
    game.impulse = {x: 0, y: 0};

    game.IMPULSES = { 
      38: {x: -1, y: 0},
      40: {x: 1, y: 0}, 
      37: {x: 0, y: -1}, 
      39: {x: 0, y: 1} 
    };

    game.streak = 0;
  }

  Game.prototype.setInterval = function (timeStep) {
    var game = this;

    game.interval = window.setInterval(function () {
        game.makeMove(game.impulse);
        game.updateBoard();

        if (game.lose()) {
          clearInterval(game.interval);
          game.displayMessage("game over!<br/>press 'r' to restart.");
          game.promptRestart();
        }

    }, timeStep);
  },

  Game.prototype.bindKeys = function () {
    var game = this;

    _.each([37, 38, 39, 40], function (keycode) {

      $(document).keydown(function (ev) {
        if (ev.which === keycode &&
            game.validImpulse.apply(game, [ keycode ])) {
          game.impulse = game.IMPULSES[keycode]
        }
      })
    })
  }

  Game.prototype.validImpulse = function (keycode) {
    return this.board.validImpulse(this.IMPULSES[keycode]);
  }

  Game.prototype.styleSidebar = function () {
    var width = window.innerWidth - this.board_width;
    $("#sidebar").css({
      "width": width / 2 + "px",
      "font": "bold " + width / 20 + "px consolas"
    });

    $("#score").css("font", "bold " + width / 25 + "px consolas")
    $("#streak").css("font", "bold " + width / 25 + "px consolas")
    $("#message").css("font", "bold " + width / 25 + "px consolas")
  }

  Game.prototype.initDisplay = function () {
    var game = this;

    var cell_size = window.innerHeight / (game.dim + 10);
    game.board_width = game.dim * cell_size;
    game.styleSidebar();

    $(".board").css({
      "margin-left": -10 * cell_size + "px",
      "margin-top": -10 * cell_size + "px"
    });

    return _.times(game.dim, function (i) {
      var $row = $('<div class="board-row" id="' + i + '"></div>')

      $(".board").append($row);

      return _.times(game.dim, function (j) {
        var pos = {x: i, y: j};

        var $cell = $('<div class="col"></div>');
        $cell.css({"height": cell_size + "px", "width": cell_size + "px"});
        

        if (_.isEqual(game.board.head, pos)) {
          $cell.toggleClass("head");
        } else if (game.board.has("snake", pos)) {
          $cell.toggleClass("seg");
        } else if (game.board.has("walls", pos)) {
          $cell.toggleClass("wall");
        } else if (game.board.has("apples", pos)) {
          $cell.toggleClass("apple");
        } 

        $(".board-row#" + i).append($cell);
      });
    });
  }

  // Game.prototype.renderRows = function () {
    // var game = this;

    // function renderRow (row) {
    //   if (row === game.dim())
    // }

  // }

  Game.prototype.updateBoard = function () {
    var game = this;

    _.times(game.dim, function (i) {
      _.times(game.dim, function (j) {
        var $cell = $('div.board-row#' + i).children()[j];

        var pos = {x: i, y: j};
        if (game.board.has("apples", pos)) {
          $cell.setAttribute("class", "col apple");
        } else if (game.board.has("walls", pos)) {
          $cell.setAttribute("class", "col wall");
        } else if (_.isEqual(game.board.head, pos)) {
          $cell.setAttribute("class", "col head");
        } else if (game.board.has("snake", pos)) {
          $cell.setAttribute("class", "col seg");
        } else {
          $cell.setAttribute("class", "col");
        }
      })
    })

    if (!game.board.apples.length) {
      game.displayMessage("great job!");
      game.repopulateApples();
      game.shuffleWalls();
      game.streak++;
    } 

    game.updateScore();
    game.updateStreak();
  }

  Game.prototype.updateScore = function () {
    var game = this;

    var score = game.numApples * (game.streak + 1) - 
                                  game.board.apples.length;

    $("#score").html("score: " + score);
  }

  Game.prototype.updateStreak = function () {
    var game = this;
    $("#streak").html("streak: " + game.streak);
  }

  Game.prototype.repopulateApples = function () {
    var game = this;
    game.board.randomApples(game.numApples);
  }

  Game.prototype.displayMessage = function (msg) {
    $("#message").html(msg);
    $("#message").hide().fadeIn(1000);
    window.setTimeout(function () {
      $("#message").fadeOut(1000);
      $("#message").html("");
    }, 3000)
  }

  // 'r' keycode: 114.
  Game.prototype.promptRestart = function () {
    var game = this;

    $(window).keypress(function (ev) {
      if (ev.which == 114) {
        game.restart.apply(game);
        $(window).off("keypress");
     }
    })
  }

  Game.prototype.restart = function () {
    var game = this;

    opts = {
      dim: game.dim,
      numWalls: game.numWalls,
      numApples: game.numApples,
      timeStep: game.timeStep 
    }

    $(".board").empty();
    $("#score").html("score: 0").hide().fadeIn(1000);
    $("#streak").html("streak: 0").hide().fadeIn(1000);
    $("#message").html("");

    new Game(opts);
  }

  Game.prototype.shuffleWalls = function () {
    var game = this;

    game.board.walls = [];
    game.board.randomWalls(game.numWalls);
  }

  Game.prototype.makeMove = function (impulse) {
    var game = this;
    this.board.moveHead(impulse);
  }

  Game.prototype.lose = function () {
    return this.board.lose();
  }

  return Game;
})();