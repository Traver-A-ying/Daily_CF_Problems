Page({
  data: {
    diceCount: null,
    diceCountDisplay: "-",
    score: 0,
    total: 0,
    diceValues: [],
    logs: []
  },
  rollDie() {
    return Math.floor(Math.random() * 6) + 1;
  },
  log(message) {
    const nextLogs = [message, ...this.data.logs];
    this.setData({ logs: nextLogs.slice(0, 12) });
  },
  renderDice(values) {
    this.setData({ diceValues: values });
  },
  isStraight(values) {
    const sorted = [...values].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i += 1) {
      if (sorted[i] !== sorted[i - 1] + 1) {
        return false;
      }
    }
    return true;
  },
  applyEmperorBonus(values, baseScore) {
    const allSame = values.every((value) => value === values[0]);
    const allOneOrSix = allSame && (values[0] === 1 || values[0] === 6);

    if (allOneOrSix) {
      return { score: 520, label: "天选 520 分" };
    }
    if (allSame) {
      return { score: baseScore * 5, label: "狗子 ×5" };
    }
    if (this.isStraight(values)) {
      return { score: baseScore * 4, label: "顺子 ×4" };
    }
    const allOdd = values.every((value) => value % 2 === 1);
    const allEven = values.every((value) => value % 2 === 0);
    if (allOdd || allEven) {
      return { score: baseScore * 2, label: "纯净 ×2" };
    }
    return { score: baseScore, label: "普通" };
  },
  rollChainScore(initialDice) {
    const chainLog = [];
    let pending = initialDice;
    let round = 1;
    let score = 0;

    while (pending > 0 && round <= 6) {
      const values = Array.from({ length: pending }, () => this.rollDie());
      this.renderDice(values);
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
  },
  onRollN() {
    const diceCount = this.rollDie();
    this.setData({
      diceCount,
      diceCountDisplay: diceCount,
      diceValues: [diceCount]
    });
    this.log(`Roll N 得到 ${diceCount} 颗骰子。`);
  },
  onRollScore() {
    const { diceCount } = this.data;
    if (!diceCount) {
      this.log("请先 Roll N 决定骰子数量。");
      return;
    }

    if (diceCount < 3) {
      const { score, chainLog } = this.rollChainScore(diceCount);
      const total = this.data.total + score;
      this.setData({ score, total });
      this.log(`触发绝境翻盘，总得分 +${score}`);
      chainLog.forEach((entry) => this.log(entry));
      return;
    }

    const values = Array.from({ length: diceCount }, () => this.rollDie());
    this.renderDice(values);
    const baseScore = values.reduce((sum, value) => sum + value, 0);
    const { score, label } = this.applyEmperorBonus(values, baseScore);
    const total = this.data.total + score;

    this.setData({ score, total });
    this.log(`点数：${values.join(" ")}｜基础分 ${baseScore}｜${label} → +${score}`);
  },
  onReset() {
    this.setData({
      diceCount: null,
      diceCountDisplay: "-",
      score: 0,
      total: 0,
      diceValues: [],
      logs: []
    });
    this.log("已重置。祝你好运！");
  }
});
