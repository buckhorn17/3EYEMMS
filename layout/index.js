let tarotCards = document.querySelectorAll(".tarot-card-back");
let tarotButton = document.querySelector(".tarot-button");

// 动态导入卡牌图像资源
const cardImages = {
  ...import.meta.globEager('../assets/images/card/inFrame/past/*.png'),
  ...import.meta.globEager('../assets/images/card/inFrame/past/content/*.png'),
  ...import.meta.globEager('../assets/images/card/inFrame/present/*.png'),
  ...import.meta.globEager('../assets/images/card/inFrame/present/content/*.png'),
  ...import.meta.globEager('../assets/images/card/inFrame/future/*.png'),
  ...import.meta.globEager('../assets/images/card/inFrame/future/content/*.png'),
};

// 计算已选择的卡牌数量
function countSelectedCards() {
  let selectedCount = 0;
  tarotCards.forEach(function(card) {
    if (card.style.transform === "translateY(-30px)") {
      selectedCount++;
    }
  });
  return selectedCount;
}

// 点击 tarotCards 时切换选择状态
tarotCards.forEach(function(card) {
  card.addEventListener("click", function() {
    let selectedCount = countSelectedCards();
    if (selectedCount < 3 || card.style.transform === "translateY(-30px)") {
      card.style.transform = card.style.transform === "translateY(-30px)" ? "translateY(0px)" : "translateY(-30px)";
    } else {
      alert("最多只能选择三张卡牌。");
    }
  });
});

// 点击 tarotButton 时执行的函数
tarotButton.addEventListener("click", function() {
  let selectedCount = countSelectedCards();

  if (selectedCount < 3) {
    alert("请选择满三张卡牌。");
    return;
  }

  selectAndDisplayImages(); // 使用新的图片选择和显示逻辑

  // 将已选择的卡牌恢复到 translateY(0px)
  tarotCards.forEach(function(card) {
    card.style.transform = "translateY(0px)";
  });
});

// 更新图片路径
function updateImagePath(path, modalId, fallback, imageIndex) {
  const imagePath = getImagePath(`${path}${imageIndex}`);
  let modalBody = document.getElementById(modalId).querySelector(".modal-body img");
  modalBody.src = imagePath || fallback; // 使用动态导入的路径或回退到默认图片
  let resultImage = document.querySelector(`[data-bs-target="#${modalId}"] img`);
  resultImage.src = imagePath || fallback; // 使用动态导入的路径或回退到默认图片
}

// 获取图片路径
function getImagePath(imageKey) {
  const imagePathKey = Object.keys(cardImages).find(key => key.endsWith(`${imageKey}.png`));
  return cardImages[imagePathKey]?.default;
}

// 随机选择图片并更新 DOM
function selectAndDisplayImages() {
  const paths = ["past/", "present/", "future/"];
  const fallback = '../assets/images/card/inFrame/CARDB.png'; // 定义回退图片路径
  paths.forEach((path, index) => {
    const imageIndex = getRandomImageKey(); // 随机获取一个图片的关键词
    updateImagePath(path, `imageModal-${index + 1}`, fallback, imageIndex);
    let resultImg = document.querySelector(`[data-bs-target="#imageModal-${index + 1}"] img`);
    resultImg.classList.add("flip-animation");
    setTimeout(function() {
      resultImg.classList.remove("flip-animation");
    }, 1000);
  });
}

// 随机获取图片关键词
function getRandomImageKey() {
  const keys = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "O"];
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
}

// 洗牌函数
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
