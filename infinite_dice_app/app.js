const rollNButton = document.getElementById("roll-n");
const rollScoreButton = document.getElementById("roll-score");
const resetButton = document.getElementById("reset");
const diceCountEl = document.getElementById("dice-count");
const scoreEl = document.getElementById("score");
const totalEl = document.getElementById("total");
const diceArea = document.getElementById("dice-area");
const logEl = document.getElementById("log");

let diceCount = null;
let totalScore = 0;

const log = (message) => {
  const entry = document.createElement("div");
  entry.textContent = message;
  logEl.prepend(entry);
};

const rollDie = () => Math.floor(Math.random() * 6) + 1;

const renderDice = (values) => {
  diceArea.innerHTML = "";
  values.forEach((value) => {
    const die = document.createElement("div");
    die.className = "dice";
    die.textContent = value;
    diceArea.appendChild(die);
  });
};

const isStraight = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i] !== sorted[i - 1] + 1) {
      return false;
    }
  }
  return true;
};

const isAllOdd = (values) => values.every((value) => value % 2 === 1);
const isAllEven = (values) => values.every((value) => value % 2 === 0);

const applyEmperorBonus = (values, baseScore) => {
  const allSame = values.every((value) => value === values[0]);
  const allOneOrSix = allSame && (values[0] === 1 || values[0] === 6);

  if (allOneOrSix) {
    return { score: 520, label: "天选 520 分" };
  }
  if (allSame) {
    return { score: baseScore * 5, label: "狗子 ×5" };
  }
  if (isStraight(values)) {
    return { score: baseScore * 4, label: "顺子 ×4" };
  }
  if (isAllOdd(values) || isAllEven(values)) {
    return { score: baseScore * 2, label: "纯净 ×2" };
  }
  return { score: baseScore, label: "普通" };
};

const rollChainScore = (initialDice) => {
  const chainLog = [];
  let pending = initialDice;
  let round = 1;
  let score = 0;

  while (pending > 0 && round <= 6) {
    const values = Array.from({ length: pending }, rollDie);
    renderDice(values);
    const sixes = values.filter((value) => value === 6).length;
    const roundScore = values.reduce((sum, value) => sum + value, 0);
    score += roundScore;
    chainLog.push(`第 ${round} 轮：${values.join(" ")} → +${roundScore}`);
    pending = sixes;
    round += 1;
  }

  if (pending > 0) {
    chainLog.push("连击过长，系统自动收束。继续挑战可以再试一次！");
  }

  return { score, chainLog };
};

rollNButton.addEventListener("click", () => {
  diceCount = rollDie();
  diceCountEl.textContent = diceCount;
  renderDice([diceCount]);
  log(`Roll N 得到 ${diceCount} 颗骰子。`);
});

rollScoreButton.addEventListener("click", () => {
  if (!diceCount) {
    log("请先 Roll N 决定骰子数量。");
    return;
  }

  if (diceCount < 3) {
    const { score, chainLog } = rollChainScore(diceCount);
    totalScore += score;
    scoreEl.textContent = score;
    totalEl.textContent = totalScore;
    log(`触发绝境翻盘，总得分 +${score}`);
    chainLog.forEach((entry) => log(entry));
    return;
  }

  const values = Array.from({ length: diceCount }, rollDie);
  renderDice(values);

  const baseScore = values.reduce((sum, value) => sum + value, 0);
  const { score, label } = applyEmperorBonus(values, baseScore);

  totalScore += score;
  scoreEl.textContent = score;
  totalEl.textContent = totalScore;

  log(`点数：${values.join(" ")}｜基础分 ${baseScore}｜${label} → +${score}`);
});

resetButton.addEventListener("click", () => {
  diceCount = null;
  totalScore = 0;
  diceCountEl.textContent = "-";
  scoreEl.textContent = "0";
  totalEl.textContent = "0";
  diceArea.innerHTML = "";
  logEl.innerHTML = "";
  log("已重置。祝你好运！");
});
