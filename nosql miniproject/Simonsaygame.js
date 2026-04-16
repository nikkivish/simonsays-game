let gameseq = [];
let userseq = [];
let btns = ["yellow", "red", "green", "purple"];
let start = false;
let level = 0;
let h2 = document.querySelector("h2");
let popup = document.getElementById("popup");
let closeBtn = document.getElementById("closeBtn");

// Show the popup when the page loads
window.onload = function () {
  popup.style.display = "block";
};

// Close popup when OK is clicked
closeBtn.addEventListener("click", function () {
  popup.style.display = "none";
});

document.addEventListener("keypress", function (event) {
  if (event.target.id === "username") {
    return;
  }

  if (start == false) {
    console.log("game started");
    start = true;
    levelup();
  }
});
function gameflash(btn) {
  btn.classList.add("flash");
  setTimeout(function () {
    btn.classList.remove("flash");
  }, 250);
}
function userflash(btn) {
  btn.classList.add("userflash");
  setTimeout(function () {
    btn.classList.remove("userflash");
  }, 250);
}

function levelup() {
  userseq = [];
  level++;
  h2.classList.add("level-animate");
  setTimeout(() => h2.classList.remove("level-animate"), 400);
  h2.innerText = `Level ${level}`;
  let randomindex = Math.floor(Math.random() * 4);
  let randomcolor = btns[randomindex];
  let randombtn = document.querySelector(`.${randomcolor}`);
  // console.log(randomindex);
  // console.log(randomcolor);
  // console.log(randombtn);

  gameseq.push(randomcolor);
  console.log(gameseq);
  gameflash(randombtn);
}
function checkAns(idx) {
  // let idx = level - 1;
  if (userseq[idx] == gameseq[idx]) {
    if (userseq.length == gameseq.length) {
      setTimeout(levelup, 1000);
    }
  } else {
    h2.innerHTML = `Game Over!  Your score was <b> ${level}</b> <br> Press any key to start.`;

    let name = document.getElementById("username").value || "Anonymous";
    console.log("Sending:", { score: level, name: name });
    fetch("http://localhost:3000/save-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score: level,
        name: name,
      }),
    });
    document.getElementById("username").value = "";

    // leaderboard refresh

    setTimeout(() => {
      getScores();
    }, 500);
    document.querySelector("body").style.backgroundColor = "red";
    setTimeout(function () {
      document.querySelector("body").style.backgroundColor = "white";
    }, 150);
    reset();
  }
}
function btnpress() {
  let btn = this;
  userflash(btn);
  usercolor = btn.getAttribute("id");
  userseq.push(usercolor);
  checkAns(userseq.length - 1);
}
let allbtns = document.querySelectorAll(".btn");
for (btn of allbtns) {
  btn.addEventListener("click", btnpress);
}
function reset() {
  start = false;
  gameseq = [];
  userseq = [];
  level = 0;
}
async function getScores() {
  let res = await fetch("http://localhost:3000/scores");
  let data = await res.json();

  let list = document.getElementById("leaderboard");
  list.innerHTML = "";

  data.forEach((item, index) => {
    let li = document.createElement("li");

    let medal = ["🥇", "🥈", "🥉"][index] || "";

    li.innerText = `${medal} ${item.name || "Player"} - ${item.score}`;

    list.appendChild(li);
  });
}
getScores();
