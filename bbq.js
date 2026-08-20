// HTML 문서가 모두 준비된 다음 자바스크립트를 실행합니다.
// 이렇게 하면 아직 만들어지지 않은 HTML 요소를 찾는 오류를 방지할 수 있습니다.
document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     1. 배달/포장 주문 탭
     ========================================================= */

  const orderTabs = [...document.querySelectorAll(".tab-btn")];
  const addressInput = document.querySelector(".search-bar input");

  // 클릭한 탭만 선택 상태로 만들고 입력창 안내 문구를 변경합니다.
  orderTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      orderTabs.forEach((button) => button.classList.remove("active"));
      tab.classList.add("active");

      addressInput.placeholder = tab.textContent.includes("포장")
        ? "포장하실 매장명이나 주소를 입력해주세요"
        : "배달 받으실 주소를 입력해주세요";
    });
  });

  /* =========================================================
     2. 메인 이미지 배너
     ========================================================= */

  // HTML에 있는 모든 배너와 배너 조작에 필요한 요소를 가져옵니다.

  const slides = [...document.querySelectorAll(".banner-slide")];
  console.log(slides);
  const dotsWrap = document.querySelector(".banner-dots");
  const currentText = document.querySelector(".banner-current");
  const pauseButton = document.querySelector(".banner-pause");

  // current: 현재 화면에 표시 중인 배너 번호입니다. 배열 번호는 0부터 시작합니다.
  // playing: 자동 재생 중인지 저장합니다.
  // timer: setInterval로 만든 자동 재생 타이머를 저장합니다.
  let current = 0;
  let playing = true;
  let timer;

  // 배너 개수만큼 하단의 페이지 점 버튼을 자동으로 만듭니다.
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `banner-dot${index === 0 ? " active" : ""}`;
    dot.setAttribute("aria-label", `${index + 1}번 배너 보기`);

    // 점을 누르면 해당 번호의 배너로 바로 이동합니다.
    dot.addEventListener("click", () => showSlide(index, true));
    dotsWrap.appendChild(dot);
  });

  // 위에서 만들어진 점 버튼들을 배열로 가져옵니다.
  const dots = [...document.querySelectorAll(".banner-dot")];

  // 전달받은 번호에 해당하는 배너를 화면에 보여주는 함수입니다.
  function showSlide(index, restart = false) {
    // 마지막 배너에서 다음을 누르면 첫 번째로,
    // 첫 번째 배너에서 이전을 누르면 마지막으로 이동하도록 계산합니다.
    current = (index + slides.length) % slides.length;

    // 현재 배너와 점에만 active 클래스를 붙입니다.
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === current);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
    });

    // 1을 01처럼 두 자리로 만들어 현재 페이지 번호를 표시합니다.
    currentText.textContent = String(current + 1).padStart(2, "0");

    // 화살표나 점을 직접 눌렀다면 자동 재생 시간을 처음부터 다시 셉니다.
    if (restart && playing) startAutoPlay();
  }

  // 4.5초마다 다음 배너를 보여주는 자동 재생 함수입니다.
  function startAutoPlay() {
    // 기존 타이머를 먼저 제거해서 타이머가 여러 개 생기지 않게 합니다.
    clearInterval(timer);
    timer = setInterval(() => showSlide(current + 1), 4500);
  }

  // 좌우 화살표를 누르면 이전 또는 다음 배너로 이동합니다.
  document.querySelector(".banner-prev").addEventListener("click", () => {
    showSlide(current - 1, true);
  });
  document.querySelector(".banner-next").addEventListener("click", () => {
    showSlide(current + 1, true);
  });

  // 일시정지 버튼으로 자동 재생을 켜거나 끕니다.
  pauseButton.addEventListener("click", () => {
    playing = !playing;
    pauseButton.textContent = playing ? "Ⅱ" : "▶";
    pauseButton.setAttribute(
      "aria-label",
      playing ? "자동 재생 일시정지" : "자동 재생 시작",
    );

    if (playing) startAutoPlay();
    else clearInterval(timer);
  });

  // 배너에 마우스를 올리면 읽기 편하도록 자동 전환을 잠시 멈춥니다.
  // 마우스가 배너 밖으로 나가면 다시 자동 재생합니다.
  const mainBanner = document.querySelector(".main-banner");
  mainBanner.addEventListener("mouseenter", () => clearInterval(timer));
  mainBanner.addEventListener("mouseleave", () => {
    if (playing) startAutoPlay();
  });

  // 페이지가 처음 열렸을 때 자동 재생을 시작합니다.
  startAutoPlay();

  /* =========================================================
     3. 신메뉴 페이지 전환
     ========================================================= */

  const newMenuCards = [...document.querySelectorAll(".new-menu-card")];
  const newMenuPageText = document.querySelector(".new-menu-page");

  // 한 페이지에 보여줄 메뉴 카드 수입니다.
  const cardsPerPage = 2;
  let newMenuPage = 0;

  // 전체 카드 수를 페이지당 카드 수로 나눠 전체 페이지 수를 계산합니다.
  const newMenuPageCount = Math.ceil(newMenuCards.length / cardsPerPage);

  // 선택한 페이지에 포함된 신메뉴 카드 2개만 보여줍니다.
  function showNewMenuPage(page) {
    // 첫 페이지와 마지막 페이지가 서로 이어지도록 페이지 번호를 계산합니다.
    newMenuPage = (page + newMenuPageCount) % newMenuPageCount;
    const firstCard = newMenuPage * cardsPerPage;

    newMenuCards.forEach((card, index) => {
      const isOutsidePage =
        index < firstCard || index >= firstCard + cardsPerPage;
      card.classList.toggle("is-hidden", isOutsidePage);
    });

    // 화면의 1 / 2 또는 2 / 2 문구를 갱신합니다.
    newMenuPageText.textContent = `${newMenuPage + 1} / ${newMenuPageCount}`;
  }

  // 신메뉴 영역의 좌우 화살표에 페이지 이동 기능을 연결합니다.
  document.querySelector(".new-menu-prev").addEventListener("click", () => {
    showNewMenuPage(newMenuPage - 1);
  });
  document.querySelector(".new-menu-next").addEventListener("click", () => {
    showNewMenuPage(newMenuPage + 1);
  });

  // 처음에는 신메뉴 첫 페이지를 보여줍니다.
  showNewMenuPage(0);

  /* =========================================================
     4. 추천메뉴 페이지 전환
     ========================================================= */

  const recommendCards = [...document.querySelectorAll(".recommend-menu-card")];
  const recommendPageText = document.querySelector(".recommend-page");
  let recommendPage = 0;
  const recommendPageCount = Math.ceil(recommendCards.length / cardsPerPage);

  // 선택한 페이지에 포함된 추천메뉴 카드 2개만 보여줍니다.
  function showRecommendPage(page) {
    recommendPage = (page + recommendPageCount) % recommendPageCount;
    const firstCard = recommendPage * cardsPerPage;

    recommendCards.forEach((card, index) => {
      const isOutsidePage =
        index < firstCard || index >= firstCard + cardsPerPage;
      card.classList.toggle("is-hidden", isOutsidePage);
    });

    // 화면의 1 / 2 또는 2 / 2 문구를 갱신합니다.
    recommendPageText.textContent = `${recommendPage + 1} / ${recommendPageCount}`;
  }

  // 추천메뉴 영역의 좌우 화살표에 페이지 이동 기능을 연결합니다.
  document.querySelector(".recommend-prev").addEventListener("click", () => {
    showRecommendPage(recommendPage - 1);
  });
  document.querySelector(".recommend-next").addEventListener("click", () => {
    showRecommendPage(recommendPage + 1);
  });

  // 처음에는 추천메뉴 첫 페이지를 보여줍니다.
  showRecommendPage(0);
});
