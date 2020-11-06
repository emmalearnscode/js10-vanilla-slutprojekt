function main() {
  const btnBottle = document.querySelector(".js-random-btn");
  const modalPage = document.querySelector(".js-modal");
  let api = "https://api.punkapi.com/v2/";
  const apiExtend = {
    random: "beers/random",
  };

  function initEvents() {
    btnBottle.addEventListener("click", getRandomBottle);
  }
  function toggleClass(element, className) {
    element.classList.toggle(className);
  }
  async function getData(extend) {
    const result = await fetch(api.concat(extend));
    const data = await result.json();
    return data;
  }
  // Event functions
  async function getRandomBottle() {
    const data = await getData(apiExtend.random);
    renderModal(data[0]);
  }
  // Modal page
  function renderModal(data) {
    modalPage.addEventListener("click", closeModal);
    toggleClass(modalPage, "hide");
    const cardWrapper = modalPage.querySelector(".wrapper");
    cardWrapper.innerHTML = `
    <div class="card">
    <div class="card__img">
      <img src="${data.image_url}" alt="${data.name}" />
    </div>
    <div class="card__content">
      <h2 class="beer-name">${data.name}</h2>
      <button class="btn btn--white js-more-info-btn">MORE INFO</button>
    </div>
  </div>
  `;
    const moreInfoBtn = modalPage.querySelector(".js-more-info-btn");
    moreInfoBtn.addEventListener("click", function () {
      renderInfoPage(data);
    });
  }

  function closeModal(e) {
    if (
      e.target.classList.contains("js-modal") ||
      e.target.classList.contains("js-modal-close")
    ) {
      toggleClass(modalPage, "hide");
    }
  }

  // Info Page
  function renderInfoPage(data) {
    console.log(data);
  }

  // Main Start up
  initEvents();
}

main();
