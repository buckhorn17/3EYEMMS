document.addEventListener("DOMContentLoaded", function () {
    let tarotButton = document.querySelector(".tarot-button");
    let tarotCards = document.querySelectorAll(".tarot-card-back");

    // 讀取 tarot-all.html 內容
    async function loadTarotPaths() {
        let response = await fetch('tarot-all.html');
        let text = await response.text();
        let parser = new DOMParser();
        let doc = parser.parseFromString(text, 'text/html');
        return {
            past: Array.from(doc.querySelectorAll('.tarot-past img')).map(img => img.src),
            present: Array.from(doc.querySelectorAll('.tarot-present img')).map(img => img.src),
            future: Array.from(doc.querySelectorAll('.tarot-future img')).map(img => img.src),
            pastContent: Array.from(doc.querySelectorAll('.tarot-past-content img')).map(img => img.src),
            presentContent: Array.from(doc.querySelectorAll('.tarot-present-content img')).map(img => img.src),
            futureContent: Array.from(doc.querySelectorAll('.tarot-future-content img')).map(img => img.src)
        };
    }

    // 計算已選擇的卡牌數量
    function countSelectedCards() {
        let selectedCount = 0;
        tarotCards.forEach(function (card) {
            if (card.style.transform === "translateY(-30px)") {
                selectedCount++;
            }
        });
        return selectedCount;
    }

    // 點擊 tarotCards 時切換選擇狀態
    tarotCards.forEach(function (card) {
        card.addEventListener("click", function () {
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
    tarotButton.addEventListener("click", async function () {
        let selectedCount = countSelectedCards();

        if (selectedCount < 3) {
            alert("請選滿三枚卡牌。");
            return;
        }

        let tarotPaths = await loadTarotPaths();

        // 獲取不重複的圖片索引
        let selectedIndexes = getUniqueRandomIndexes(tarotPaths.past.length, 3);

        // 根據索引選取圖片路徑
        let selectedPast = tarotPaths.past[selectedIndexes[0]];
        let selectedPresent = tarotPaths.present[selectedIndexes[1]];
        let selectedFuture = tarotPaths.future[selectedIndexes[2]];

        // 更新圖片路徑
        updateImagePath('tarot-result', 'imageModal-1', selectedPast, tarotPaths.pastContent.find(p => p.includes(selectedPast.split('/').pop())));
        updateImagePath('tarot-result', 'imageModal-2', selectedPresent, tarotPaths.presentContent.find(p => p.includes(selectedPresent.split('/').pop())));
        updateImagePath('tarot-result', 'imageModal-3', selectedFuture, tarotPaths.futureContent.find(p => p.includes(selectedFuture.split('/').pop())));

        // 將已選擇的卡牌恢復到 translateY(0px)
        tarotCards.forEach(function (card) {
            card.style.transform = "translateY(0px)";
        });
    });

    // 生成一組唯一的隨機索引
    function getUniqueRandomIndexes(max, count) {
        let indexes = [];
        while (indexes.length < count) {
            let index = Math.floor(Math.random() * max);
            if (!indexes.includes(index)) {
                indexes.push(index);
            }
        }
        return indexes;
    }



// 更新圖片路徑函數，確保正確處理 GitHub Pages 上的絕對路徑
function updateImagePath(targetClass, modalId, selectedPath, selectedContentPath) {
    // 從選擇的路徑中提取文件名
    let fileName = selectedPath.split('/').pop();
    let contentFileName = selectedContentPath.split('/').pop();

    // 構建 GitHub Pages 的絕對路徑
    let basePath = 'https://buckhorn17.github.io/3EYEMMS/assets/images/card/inFrame/';
    let newSrc = `${basePath}${fileName}`;
    let newContentSrc = `${basePath}content/${contentFileName}`;

    // 更新 tarot-result 的圖片 src
    let resultImage = document.querySelector(`[data-bs-target="#${modalId}"] img`);
    if(resultImage) resultImage.src = newSrc;

    // 更新 tarot-lightBox 的圖片 src
    let modalBody = document.getElementById(modalId).querySelector(".modal-body img");
    if(modalBody) modalBody.src = newContentSrc;
}


    // 洗牌函數
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
