var CHAR_SKIP = "J";
var CHAR_REPLACE = "I";
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

const TEST_KWD = "CoolBeans";
const TEST_MSG = "A quick brown fox jumped ovjer tjhe lazy dojgs quickly";

const regexCharFinder = new RegExp(`${CHAR_SKIP}`, "g");
const spcs = /\s/g;
const dbls = /..|.$/g;

var replaceLocation = [];

// Format the message to be sent with cypher grid.
function formatMessage(msg) {
  const reoc = /(?<=(.))\1/g;
  const form = msg
    .replace(spcs, "")
    .toUpperCase()
    .replace(CHAR_SKIP, CHAR_REPLACE)
    .match(dbls);
  let lastIdxLen = form[form.length - 1].length;

  // Checking for double characters.
  form.forEach((itm, idx, frm) => {
    if (itm[0] == itm[1]) {
      frm[idx] = itm.replace(reoc, "X");
    }
  });

  // Adding X to end of string if last entry is without partner.
  if (lastIdxLen < 2) {
    form[form.length - 1] += "X";
  }

  return form;
}

function formatKeyword(kwd) {
  const ret = kwd
    .concat(ALPHABET)
    .toUpperCase()
    .replace(CHAR_SKIP, CHAR_REPLACE)
    .split("")
    .filter((item, pos, self) => self.indexOf(item) == pos)
    .join("")
    .replace(spcs, "");
  return ret;
}

function forgeCypherGrid(fkwd) {
  const keywordArr = fkwd.split("");
  let cipherGrid = [];
  let index = 0;

  while (keywordArr.length != 0) {
    cipherGrid[index] = keywordArr.splice(0, 5);
    index++;
  }

  return cipherGrid;
}

function cipherify(kwd, msg) {
  const message = formatMessage(msg);
  const keyword = formatKeyword(kwd);
  const cipherGrid = forgeCypherGrid(keyword);
  let cipher = "";

  message.forEach(el => {
    let X1 = cipherGrid.findIndex((row) => row.includes(el[0]));
    let X2 = cipherGrid.findIndex((row) => row.includes(el[1]));

    let Y1 = cipherGrid[X1].indexOf(el[0]);
    let Y2 = cipherGrid[X2].indexOf(el[1]);

    if (Y1 == Y2) {
      cipher +=
        cipherGrid[X1 == 4 ? 0 : X1 + 1][Y1] +
        cipherGrid[X2 == 4 ? 0 : X2 + 1][Y2];
    } else if (X1 == X2) {
      cipher +=
        cipherGrid[X1][Y1 == 4 ? 0 : Y1 + 1] +
        cipherGrid[X2][Y2 == 4 ? 0 : Y2 + 1];
    } else {
      cipher += cipherGrid[X1][Y2] + cipherGrid[X2][Y1];
    }
  });
  return cipher;
}

function uncipherify(kwd, cph) {
  var message = "";
  const cipher = cph.match(dbls);
  const keyword = formatKeyword(kwd);
  const cipherGrid = forgeCypherGrid(keyword);

  cipher.forEach(el => {
    let X1 = cipherGrid.findIndex((row) => row.includes(el[0]));
    let X2 = cipherGrid.findIndex((row) => row.includes(el[1]));

    let Y1 = cipherGrid[X1].indexOf(el[0]);
    let Y2 = cipherGrid[X2].indexOf(el[1]);

    if (Y1 == Y2) {
      message +=
        cipherGrid[X1 == 0 ? 4 : X1 - 1][Y1] +
        cipherGrid[X2 == 0 ? 4 : X2 - 1][Y2];
    } else if (X1 == X2) {
      message +=
        cipherGrid[X1][Y1 == 0 ? 4 : Y1 - 1] +
        cipherGrid[X2][Y2 == 0 ? 4 : Y2 - 1];
    } else {
      message += cipherGrid[X1][Y2] + cipherGrid[X2][Y1];
    }

  });

  return message;
}

/*
console.log(`Message: '${TEST_MSG}' -> '${formatMessage(TEST_MSG)}'`);
console.log(`Keyword: '${TEST_KWD}' -> '${formatKeyword(TEST_KWD)}'`);
console.log(forgeCypherGrid(formatKeyword(TEST_KWD)));
console.log(`Ciphered Message -> '${cipherify(TEST_KWD, TEST_MSG)}'`);
console.log(`Deciphered Message -> '${uncipherify(TEST_KWD, cipherify(TEST_KWD, TEST_MSG))}'`);

Remove to make crash :)
*/

function createListeners() {
  document.getElementById("cipher-input").addEventListener("keyup", (e) => { filterText(e), updateGrid() });
  document.getElementById("message-input").addEventListener("input", (e) => { updateMessageOutput(e) });
  document.getElementById("message-output").addEventListener("input", (e) => { updateMessageInput(e) });
  document.getElementById("switch-from").addEventListener("click", (e) => { changeSwitch(e) });
  document.getElementById("switch-to").addEventListener("click", (e) => { changeSwitch(e) });
}

function updateMessageInput(field) {

}

function updateMessageOutput(field) {

  document.getElementById("message-output").value = field.target.value;
}

function changeSwitch(button) {
  const key_reminder = button.target.innerHTML;
  const keyupTarget = button.target
  const focusListner = () => button.target.innerHTML = key_reminder;

  keyupTarget.innerHTML = "...";
  keyupTarget.addEventListener("focusout", focusListner, { once: true });
  keyupTarget.addEventListener("keyup", (t) => {
    keyupTarget.removeEventListener("focusout", focusListner);
    t.target.innerHTML = t.key.toUpperCase();
  }, { once: true });
}

function filterText(e) {
  const element = document.getElementById('cipher-input');
  element.value = element.value.replace(/[^a-zA-Z]+/, '');
};

function getUserKeyword() {
  let ret = document.querySelector("#cipher-input").value;

  return ret;
}

function updateGrid() {
  const kwd = getUserKeyword();
  const data = formatKeyword(kwd);
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell, idx) => {
    cell.innerHTML = `<p>${data[idx]}</p>`;
  });
}

function CreateGrid() {
  for (let i = 1; i <= 5; i++) {
    for (let y = 1; y <= 5; y++) {
      const newTableCell = document.createElement("div");
      const cellContent = document.createElement("p");
      const gridContainer = document.querySelector('.cipher-grid');

      newTableCell.classList.add("cell", `${i}x${y}`);
      newTableCell.appendChild(cellContent);
      gridContainer.appendChild(newTableCell);
    }
  }

  updateGrid();
}

function doCoolCheck(msg) {
  const TEST_CHAR = "J";
  const TEST_REPLACE = "I";
  const regexCharFinder = new RegExp(`${TEST_CHAR}`, "g");
  const msgForm = msg.replace(spcs, "").toUpperCase().split("");
  var matchesIndex = [];

  msgForm.forEach((el, idx) => {
    if (el === TEST_CHAR) {
      matchesIndex.push(idx);
    }
  });

  console.log(matchesIndex);
}

CreateGrid();
doCoolCheck(TEST_MSG);
createListeners();
