if (!window.hasRunAutoFarm) {
  window.hasRunAutoFarm = true;
  console.log("🚀 Sunflower Land Auto Farm đã khởi động.");

  let toolRunning = false;
  let toolInterval = null;

  // Lắng nghe tín hiệu từ popup.js
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "startTool") {
          startTool();
      } else if (message.action === "stopTool") {
          stopTool();
      }
  });

  function startTool() {
      if (toolRunning) return;
      toolRunning = true;
      console.log("🚀 Tool đang chạy...");

      toolInterval = setInterval(() => {
          if (!toolRunning) return; // Chỉ chạy nếu toolRunning = true

          console.log("🌾 Auto farm đang hoạt động...");
          // ➤ Chạy tool ở đây
          // Hàm random khoảng thời gian kiểm tra
async function startRandomInterval() {
  while (true) {
    const randomDelay = Math.floor(Math.random() * 9000) + 1000; // Từ 1s đến 10s
    console.log(`⏳ Kiểm tra tự động sau ${randomDelay / 1000} giây...`);

    await new Promise((resolve) => setTimeout(resolve, randomDelay));

    await selectSeed([1, 2, 3]);
    await randomDelayBetweenFunctions();
    await handlePlantClick(); // Chờ hàm này chạy xong rồi mới tiếp tục
    // await randomDelayBetweenFunctions();
    // await handleCooking();
  }
}

// Hàm tạo độ trễ ngẫu nhiên từ 1 đến 3 giây giữa các hàm
async function randomDelayBetweenFunctions() {
  const delay = Math.floor(Math.random() * 2000) + 1000;
  console.log(`⏳ Chờ ${delay / 1000} giây trước khi chạy hàm tiếp theo...`);
  await new Promise((resolve) => setTimeout(resolve, delay));
}

// Chạy kiểm tra lần đầu
startRandomInterval();

// Hàm chính xử lý hình ảnh
async function handlePlantClick() {
  console.log("🔍 Kiểm tra tất cả ảnh plant.png hoặc soil2.png...");

  let images = Array.from(document.querySelectorAll("img")).filter(
    (img) => img.src.includes("plant.png") || img.src.includes("soil2.png")
  );

  if (images.length === 0) {
    console.log("✅ Không còn ảnh cần xử lý, dừng lại!");
    return;
  }

  images = images.sort(() => Math.random() - 0.5);

  for (const img of images) {
    const parent = img.closest("div");
    if (!parent) continue;

    if (img.src.includes("plant.png")) {
      console.log("🌱 Click vào plant.png");
      simulateRandomClick(img);

      await new Promise((resolve) => setTimeout(resolve, 300));

      const newImg = parent.querySelector("img");
      if (newImg && newImg.src.includes("soil2.png")) {
        console.log("🟤 Đã đổi thành soil2.png, tiếp tục click...");
        await clickSoil2(newImg);
      } else {
        console.log("🌱 Vẫn là plant.png, click lần nữa...");
        simulateRandomClick(img);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    } else if (img.src.includes("soil2.png")) {
      console.log("🟤 Tìm thấy soil2.png, xử lý từng cái một...");
      await clickSoil2(img);
    }

    const fixedContainer = document.querySelector(
      ".fixed.inset-0.overflow-y-auto"
    );
    if (fixedContainer) {
      console.log("🔄 Phát hiện menu đặc biệt, xử lý tiếp...");
      await handleFixedElement();
      await randomDelayBetweenFunctions();
      await handleMoonSeekers();
      console.log("✅ Hoàn thành xử lý menu.");
    }

    await randomDelayBetweenFunctions();
  }
}

// chọn hạt giống
async function selectSeed(seedOrder) {
  console.log("🛒 Đang tìm Market...");

  const marketImage = document.querySelector("img[src*='market.webp']");
  if (!marketImage) {
    console.log("❌ Không tìm thấy Market, dừng lại!");
    return;
  }

  marketImage.click();
  console.log("✅ Đã click vào Market");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const seedElements = document.querySelectorAll(
    ".fixed.inset-0.overflow-y-auto .flex.flex-wrap.mb-2 > .relative"
  );
  if (seedElements.length === 0) {
    console.log("❌ Không tìm thấy danh sách hạt giống, dừng lại!");
    return;
  }

  for (let seedIndex of seedOrder) {
    let seedElement = seedElements[seedIndex - 1];
    if (!seedElement) {
      console.log(
        `⚠️ Hạt giống số ${seedIndex} không tồn tại trong danh sách!`
      );
      continue;
    }

    let stockDiv = seedElement.querySelector(
      ".w-fit.justify-center.flex.items-center.text-xs"
    );
    if (!stockDiv || stockDiv.textContent.trim() === "0") {
      console.log(`❌ Hết hạt giống số ${seedIndex}, thử loại khác...`);
      continue;
    }

    let cropImage = seedElement.querySelector("img[src*='crop.png']");
    if (!cropImage) {
      console.log(
        `⚠️ Không tìm thấy ảnh crop.png trong hạt giống số ${seedIndex}, bỏ qua.`
      );
      continue;
    }

    cropImage.click();
    console.log(`✅ Đã chọn hạt giống số ${seedIndex}`);

    setTimeout(() => {
      const closeButton = document.querySelector(
        "img[src='https://sunflower-land.com/game-assets/icons/close.png']"
      );
      if (closeButton) {
        closeButton.click();
        console.log("❌ Đã đóng Market");
      } else {
        console.log("⚠️ Không tìm thấy nút đóng Market");
      }
    }, 500);

    await randomDelayBetweenFunctions();
    return;
  }

  console.log(
    "❌ Tất cả hạt giống trong danh sách đều hết hàng hoặc không hợp lệ!"
  );
}

async function handleCooking() {
  // Tìm Fire Pit với ảnh chứa "fire_pit.webp" (bỏ qua phần winter/)
  const firePitContainer = Array.from(
    document.querySelectorAll(
      ".relative.w-full.h-full.cursor-pointer.hover\\:img-highlight"
    )
  ).find((container) => {
    const img = container.querySelector("img");
    return img && img.src.includes("fire_pit.webp"); // Kiểm tra URL có chứa fire_pit.webp hay không
  });

  if (!firePitContainer) {
    console.log("🔥 Không tìm thấy Fire Pit, kiểm tra lại sau 10 giây...");
    return;
  }

  console.log("🔥 Tìm thấy Fire Pit! Click để mở menu nấu ăn...");
  firePitContainer.dispatchEvent(new MouseEvent("click", { bubbles: true }));

  // Chờ 1 giây để giao diện mở ra
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Kiểm tra menu có mở ra không
  const recipeTitle = Array.from(
    document.querySelectorAll(".fixed.inset-0 .w-full")
  ).find((el) => el.textContent.trim() === "Recipes");

  if (!recipeTitle) {
    console.log("❌ Không tìm thấy menu Recipes, thử lại sau...");
    return;
  }

  console.log("📜 Đã mở menu Recipes!");

  // Tìm danh sách món ăn
  const recipeContainer = recipeTitle.nextElementSibling;
  if (!recipeContainer || !recipeContainer.classList.contains("flex")) {
    console.log("❌ Không tìm thấy danh sách món ăn.");
    return;
  }

  // Kiểm tra số lượng ảnh "cancel.png"
  const cancelImages = Array.from(
    document.querySelectorAll(".fixed.inset-0 img")
  ).filter((img) => img.src.includes("cancel.png"));

  console.log(`🛑 Số lượng ảnh cancel.png: ${cancelImages.length}`);

  // Nếu có 3 ảnh "cancel.png", đóng menu ngay lập tức
  if (cancelImages.length >= 3) {
    console.log(
      "❌ Đã đạt giới hạn món ăn (3 món trong hàng chờ), đóng menu..."
    );
    await closeMenu();
    return;
  }

  // Chọn món ăn theo thứ tự
  const dishNumber = 4;
  console.log(`🍽 Chọn món số ${dishNumber}`);

  const dishes = recipeContainer.querySelectorAll(".relative .cursor-pointer");
  if (dishes.length >= dishNumber) {
    dishes[dishNumber - 1].dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );
    console.log("✅ Đã chọn món ăn!");
  } else {
    console.log("❌ Không tìm thấy món ăn theo số đã chọn.");
    return;
  }

  // Chờ một chút để giao diện cập nhật
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Kiểm tra các button để bấm theo thứ tự
  const buttons = document.querySelectorAll(
    ".w-full.p-1.text-sm.object-contain.justify-center.items-center.hover\\:brightness-90"
  );

  if (!buttons.length) {
    console.log("❌ Không tìm thấy button phù hợp.");
    return;
  }

  // Tạo danh sách theo thứ tự ưu tiên
  const buttonOrder = ["Cook", "Collect", "Add to queue"];

  for (const buttonText of buttonOrder) {
    // Kiểm tra lại ảnh "cancel.png" trước khi tiếp tục bấm nút
    const cancelImagesNow = Array.from(
      document.querySelectorAll(".fixed.inset-0 img")
    ).filter((img) => img.src.includes("cancel.png"));

    console.log(
      `🔄 Kiểm tra lại số lượng cancel.png: ${cancelImagesNow.length}`
    );

    if (cancelImagesNow.length >= 3) {
      console.log("🛑 Đã có 3 món trong hàng chờ, đóng menu...");
      await closeMenu();
      break; // Thoát vòng lặp buttonOrder
    }

    // Tìm nút cần bấm
    const button = Array.from(buttons).find(
      (btn) => btn.innerText.trim() === buttonText
    );

    if (button && !button.disabled) {
      console.log(`✅ Bấm vào nút: ${buttonText}`);
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));

      // Chờ một chút trước khi bấm nút tiếp theo
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log("✅ Đã hoàn thành bấm tất cả các nút theo thứ tự.");

  // Đóng menu sau khi thực hiện xong
  await closeMenu();
}

// Hàm đóng menu
async function closeMenu() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const closeButton = Array.from(
    document.querySelectorAll(".fixed.inset-0 .absolute.flex img")
  ).find(
    (img) =>
      img.src === "https://sunflower-land.com/game-assets/icons/close.png"
  );

  if (closeButton) {
    console.log("❌ Đóng menu bằng cách bấm vào nút X");
    closeButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  } else {
    console.log("⚠ Không tìm thấy nút X để đóng menu.");
  }
}

function simulateRandomClick(img) {
  const rect = img.getBoundingClientRect();
  const randomX = rect.left + Math.random() * rect.width;
  const randomY = rect.top + Math.random() * rect.height;

  console.log(
    `🎯 Click ngẫu nhiên vào X=${randomX.toFixed(2)}, Y=${randomY.toFixed(2)}`
  );

  img.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      clientX: randomX,
      clientY: randomY,
    })
  );
}

async function handleFixedElement() {
  console.log("📌 Phát hiện menu đặc biệt trên trang!");

  const parent = document.querySelector(".fixed .relative.w-full.rounded-md");
  if (!parent) return;

  console.log("📌 Đã tìm thấy phần tử cha.");

  // Lấy tất cả thẻ img bên trong
  const imgs = parent.querySelectorAll("img");
  if (imgs.length < 2) return;

  // Lấy tọa độ của ảnh thứ 2
  const img2 = imgs[1];
  const rect = img2.getBoundingClientRect();

  console.log(`🖱 Click vào ảnh tại X=${rect.left}, Y=${rect.top}`);
  img2.dispatchEvent(new MouseEvent("click", { bubbles: true }));

  // Bấm nút "Close"
  clickCloseButton();
}

async function handleMoonSeekers() {
  const moonSeekersSpan = document.querySelector(
    ".fixed .flex.flex-col.justify-center span.text-center.mb-2"
  );

  if (moonSeekersSpan) {
    const text = moonSeekersSpan.textContent.toLowerCase(); // Chuyển về chữ thường để kiểm tra
    console.log(`🔍 Phát hiện tiêu đề: "${text}"`);

    let validSizes = [];

    if (text.includes("moon seekers")) {
      console.log("🟠 Xử lý Moon Seekers...");
      validSizes = [
        { width: 13, height: 16 },
        { width: 12, height: 16 },
        { width: 16, height: 17 },
        { width: 15, height: 16 },
        { width: 15, height: 17 },
        { width: 96, height: 64 },
        { width: 18, height: 16 },
        { width: 22, height: 25 },
        { width: 18, height: 29 },
        { width: 20, height: 19 },
        { width: 33, height: 28 },
        { width: 29, height: 28 },
        { width: 25, height: 25 },
      ];
    } else if (text.includes("goblins")) {
      console.log("🟢 Xử lý goblins...");
      validSizes = [
        { width: 96, height: 64 },
        { width: 18, height: 16 },
        { width: 22, height: 25 },
        { width: 18, height: 29 },
        { width: 20, height: 19 },
        { width: 33, height: 28 },
        { width: 29, height: 28 },
        { width: 25, height: 25 },
        { width: 26, height: 21 },
        { width: 18, height: 12 },
        { width: 25, height: 27 },
        { width: 24, height: 21 },
        { width: 19, height: 21 },
      ];
    }

    if (validSizes.length > 0) {
      // Lấy danh sách ảnh cần kiểm tra
      const images = document.querySelectorAll(
        ".fixed .flex.flex-col.justify-center .flex.flex-wrap.justify-center.items-center img"
      );

      for (let img of images) {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        if (
          validSizes.some(
            (size) => size.width === width && size.height === height
          )
        ) {
          console.log(`🖱 Click vào ảnh có kích thước ${width}x${height}`);
          img.dispatchEvent(new MouseEvent("click", { bubbles: true }));

          // Chờ 500ms giữa mỗi lần click để đảm bảo hiệu ứng hoàn tất
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }

    // Gọi function bấm nút Close
    clickCloseButton();
  }
}

function clickCloseButton() {
  setTimeout(() => {
    const closeButton = Array.from(
      document.querySelectorAll(".fixed button")
    ).find((btn) => btn.textContent.trim() === "Close");

    if (closeButton) {
      console.log("❌ Click vào nút Close.");
      closeButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

      // Kiểm tra lại sau khi bấm Close
      setTimeout(() => {
        const remainingImages = Array.from(
          document.querySelectorAll("img")
        ).filter(
          (img) =>
            img.src.includes("plant.png") || img.src.includes("soil2.png")
        );

        if (remainingImages.length > 0) {
          console.log("🔄 Vẫn còn ảnh cần xử lý, tiếp tục...");
          handlePlantClick();
        } else {
          console.log("✅ Không còn ảnh cần xử lý, dừng lại!");
        }
      }, 1000); // Chờ 1 giây để trang cập nhật
    } else {
      console.log("⚠️ Không tìm thấy nút Close.");
    }
  }, 1000);
}

async function clickSoil2(soilImg) {
  console.log("🖱 Click vào soil2.png...");
  soilImg.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 300));
}

      }, 5000);
  }

  function stopTool() {
      if (!toolRunning) return;
      toolRunning = false;
      console.log("🛑 Tool đã tắt!");

      if (toolInterval !== null) {
          clearInterval(toolInterval);
          toolInterval = null;
      }

      // Ngăn mọi hành động khác đang chạy
      let scripts = document.querySelectorAll("script");
      scripts.forEach((script) => {
          if (script.src.includes("content.js")) {
              script.remove();
          }
      });
  }
}
