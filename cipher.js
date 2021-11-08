const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const CHAR_SKIP = /J/g;
const CHAR_REPLACE = "I";
const spcs = /\s/g;

export function formatMessage(mes) {
  const dbls = /..|.$/g;
  const reoc = /(?<=(.))\1/g;
  let form = mes
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

  console.log(form.join(""));
  return form;
}

export function formatKeyword(kwd) {
  const ret = kwd
    .concat(ALPHABET)
    .toUpperCase()
    .replace(CHAR_SKIP, CHAR_REPLACE)
    .split("")
    .filter((item, pos, self) => self.indexOf(item) == pos)
    .join("")
    .replace(spcs, "");
  console.log(ret);
  return ret;
}

export function forgeCypherGrid(kwd) {
  const keywordArr = kwd.split("");
  let cipherGrid = [];
  let index = 0;

  while (keywordArr.length != 0) {
    cipherGrid[index] = keywordArr.splice(0, 5);
    index++;
  }

  console.log(cipherGrid);
  return cipherGrid;
}

export function cipherify(kwd, msg) {
  const message = formatMessage(msg);
  const keyword = formatKeyword(kwd);
  const cypherGrid = forgeCypherGrid(keyword);
  let cypher = "";

  message.forEach(el => {
    let X1 = cypherGrid.findIndex((row) => row.includes(el[0]));
    let X2 = cypherGrid.findIndex((row) => row.includes(el[1]));

    let Y1 = cypherGrid[X1].indexOf(el[0]);
    let Y2 = cypherGrid[X2].indexOf(el[1]);

    if (Y1 == Y2) {
      cypher +=
        cypherGrid[X1 == 4 ? 0 : X1 + 1][Y1] +
        cypherGrid[X2 == 4 ? 0 : X2 + 1][Y2];
    } else if (X1 == X2) {
      cypher +=
        cypherGrid[X1][Y1 == 4 ? 0 : Y1 + 1] +
        cypherGrid[X2][Y2 == 4 ? 0 : Y2 + 1];
    } else {
      cypher += cypherGrid[X1][Y2] + cypherGrid[X2][Y1];
    }
  });
  return cypher;
}
