const main = document.querySelector("main");
const start = document.querySelector("#start");
const win = document.querySelector(".win");
const lose = document.querySelector(".lose");
const frame = document.querySelector("#frame");
let state = "start";
let buttons = [];
let buttons2 = [];
let level = 9;
let endlevel = 12;

let timer = 45;
let timeLeft = 0;

window.addEventListener('message', (event) => {
  let e = event.data;

  switch (e.action) {
      case 'show':
          timer = e.time;
          level = e.startLevel;
          endlevel = e.endLevel;
          StartMinigame();
      break;
      case 'reset':
          ResetMinigame();
      break;
  }
});

StartMinigame = function() {
  state = "start";

  //$('#frame').fadeIn(1000, () => {});
  $('#frame').fadeIn(1000);
}

ResetMinigame = function() {
  state = "start";
  buttons = [];
  buttons2 = [];
  buttons.forEach((b) => {
    main.removeChild(b);
  });
  buttons2.forEach((b) => {
    main.removeChild(b);
  });

  lose.style.display = "none";
  win.style.display = "none";
  start.style.display = "block";

  $('.inner-bar').css('background-color', '#69ea00ab');
  $('.inner-bar').css('width', '100%');
}

FinishMinigame = function(){
  buttons.forEach((b) => {
    main.removeChild(b);
  });
  buttons2.forEach((b) => {
    main.removeChild(b);
  });
  buttons = [];
  buttons2 = [];

  if (state == 'win') {
    win.style.display = "flex";
    lose.style.display = "none";
  } else {
    lose.style.display = "flex";
    win.style.display = "none";
  }
  
  setTimeout(() => {
    $('#frame').fadeOut(750, () => {
      if (state == 'win') {
          $.post('http://doom-chimp/GameFinished', JSON.stringify({
              status: true
          }));
      } else if (state == 'lose') {
          $.post('http://doom-chimp/GameFinished', JSON.stringify({
            status: false
        }));
      }
    });
  }, 1000);
  
};

CreateLevel = function(n) {
  for (let i = 1; i <= n; ++i) {
    const btn = document.createElement("button");
    const btn2 = document.createElement("button-overlay");
    btn.textContent = i;
    let y, x, j;
    for (j = 0; j < 500; ++j) {
      y = 100 + Math.random() * (main.clientHeight - 330);
      x = 100 + Math.random() * (main.clientWidth - 220);
      if (
        buttons.every(
          (c) => Math.hypot(y - c.offsetTop, x - c.offsetLeft) >= 160
        )
      ) {
        break;
      }
    }
    if (j == 500) {
      return FinishMinigame();
    }
    btn.style.top = y + "px";
    btn.style.left = x + "px";
    btn2.style.left = x + "px";
    btn2.style.top = (y + 50) + "px";
    main.appendChild(btn);
    main.appendChild(btn2);
    buttons.push(btn);
    buttons2.push(btn2);
  }
};
start.addEventListener("click", (e) => {
  state = "running";
  start.style.display = "none";
  
  lose.style.display = "none";
  win.style.display = "none";
  setTimeout(() => {
      ProgressBar(timer, timer, $('.progress-bar'));
      CreateLevel(level);
  }, 500);
});
main.addEventListener("click", (e) => {
    if (e.target != main && state == "running") {
      if (e.target == buttons[0] || e.target == buttons2[0]) {
        main.removeChild(buttons.shift());
        main.removeChild(buttons2.shift());
        if (e.target.textContent) {
          buttons.forEach((b) => {
               b.textContent = "";
               setTimeout(() => {
                 b.style.background = "#FFF"
               }, 280);
          });
          buttons2.forEach((b) => {
              b.className = 'button-animation';
          });

        }
        if (buttons.length == 0 || buttons2.length == 0) {
          if (level == endlevel) {
            state = "win";
            FinishMinigame();
          } else {
            level += 1;
            CreateLevel(level);
          }
        }
      } else {
        state = "lose";
        FinishMinigame();
      }
    }
  },
  true
);


ProgressBar = function(remaining, total, $element) {
    let progressWidth = remaining * $element.width() / total;
    timeLeft = remaining
    let decrease = 0.050;

    $element.find('div').css('width', progressWidth+'px');

    if (remaining > 0) {
        if (state == "start") {
          return;
        }
        setTimeout(() => {
            let percent = Percent((timeLeft - decrease), total)
            ProgressBar(timeLeft - decrease, total, $element);
            if (percent <= 35) {
                $('.inner-bar').css('background-color', '#c90202d2');
            } else if (percent <= 70) {
                $('.inner-bar').css('background-color', '#dde000d5');
            }
        }, 50);
    } else {
        state = "lose";
        FinishMinigame();
    }
}

Percent = function(num, amount) {
    return (num / amount) * 100;
}