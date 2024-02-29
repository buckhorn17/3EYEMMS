let tarotCards = document.querySelectorAll(".tarot-card-back");
let tarotButton = document.querySelector(".tarot-button");

const cardImages = import.meta.glob('../assets/images/card/inFrame/*/*.png', { eager: true });


// 計算已選擇的卡牌數量
function countSelectedCards() {
    let selectedCount = 0;
    tarotCards.forEach(function(card) {
        if (card.style.transform === "translateY(-30px)") {
            selectedCount++;
        }
    });
    return selectedCount;
}

// 點擊 tarotCards 時切換選擇狀態
tarotCards.forEach(function(card) {
    card.addEventListener("click", function() {
        let selectedCount = countSelectedCards();
        if (selectedCount < 3 || card.style.transform === "translateY(-30px)") {
            if (card.style.transform === "translateY(-30px)") {
                card.style.transform = "translateY(0px)";
            } else {
                card.style.transform = "translateY(-30px)";
            }
        } else {
            alert("最多只能選擇三枚卡牌。");
        }
    });
});

// 點擊 tarotButton 時執行的函數
tarotButton.addEventListener("click", function() {
    let selectedCount = countSelectedCards();

    if (selectedCount < 3) {
        alert("請選滿三枚卡牌。");
        return;
    }

    // 設定圖片路徑
    let paths = [
        "../assets/images/card/inFrame/past/",
        "../assets/images/card/inFrame/present/",
        "../assets/images/card/inFrame/future/"
    ];

    // 隨機不重複地選取圖片
    let images = ["I.png", "II.png", "III.png", "IV.png", "V.png", "VI.png", "VII.png", "VIII.png", "IX.png", "X.png", "XI.png", "XII.png", "XIII.png", "XIV.png", "XV.png", "XVI.png", "XVII.png", "XVIII.png", "XIX.png", "XX.png", "XXI.png", "O.png"];
    let randomImages = shuffleArray(images);

    // 更新圖片路徑並添加轉牌動畫效果
    paths.forEach(function(path, index) {
        updateImagePath(path, `imageModal-${index + 1}`, "CARDB", randomImages[index]);
        let resultImg = document.querySelector(`[data-bs-target="#imageModal-${index + 1}"] img`);
        resultImg.classList.add("flip-animation");
        setTimeout(function() {
            resultImg.classList.remove("flip-animation");
        }, 1000);
    });

    // 將已選擇的卡牌恢復到 translateY(0px)
    tarotCards.forEach(function(card) {
        card.style.transform = "translateY(0px)";
    });
});


// 更新圖片路徑
function updateImagePath(path, modalId, fallback, imageIndex) {
    // 假设 imageIndex 为 "I.png"，构造搜索键的正则表达式
    const regex = new RegExp(`/${imageIndex}$`);
    // 搜索匹配的图像资源路径
    const imagePathKey = Object.keys(cardImages).find(key => regex.test(key));
    const imagePath = cardImages[imagePathKey].default;

    let modalBody = document.getElementById(modalId).querySelector(".modal-body img");
    modalBody.src = imagePath; // 使用动态导入的路径
    let resultImage = document.querySelector(`[data-bs-target="#${modalId}"] img`);
    resultImage.src = imagePath; // 使用动态导入的路径
}


// 洗牌函數
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
