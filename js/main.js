function main() {
  const btnBottle = document.querySelector(".js-random-btn");
  const modalPage = document.querySelector(".js-modal");
  const infoPage = document.querySelector(".js-info");
  const homePage = document.querySelector(".home");
  const searchPage = document.querySelector(".search-section");
  const btnSearch = document.querySelector(".js-search-btn");

  let api = "https://api.punkapi.com/v2/";
  const dummyApi = "../dummyData/data.json";
  let currentPage = 1;
  const apiExtend = {
    random: "beers/random",
    query: {
      queryStart: "beers?page=",
      beerPerPage: "per_page=10",
      brewedBefore: "brewed_before",
      beerName: "beer_name",
      brewedBefore: "brewed_before",
      brewedAfter: "brewed_after",
      hops: "hops",
      malt: "malt",
    },
  };

  function initEvents() {
    btnBottle.addEventListener("click", getRandomBottle);
    btnSearch.addEventListener("click", renderSearchPage);
  }

  function toggleClass(element, className) {
    element.classList.toggle(className);
  }
  async function getData(extend) {
    const result = await fetch(api.concat(extend)); // real api later use
    // const result = await fetch(dummyApi);
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
  function hidePages() {
    const pages = document.querySelectorAll("section");
    pages.forEach((page) => {
      if (!page.classList.contains("hide")) {
        toggleClass(page, "hide");
      }
    });
  }
  function createList(arr, list) {
    for (let listItem of arr) {
      const li = document.createElement("li");
      li.innerText = listItem;
      list.append(li);
    }
  }
  function ingredientsToString(arr) {
    let newString = "";
    for (let item of arr) {
      newString += `${item.name},`;
    }
    return newString;
  }

  function renderHomePage(page) {
    toggleClass(page, "hide");
    toggleClass(homePage, "hide");
  }

  // Info Page
  function renderInfoPage(data) {
    hidePages();
    toggleClass(infoPage, "hide");
    infoPage.innerHTML = `
    <button class="btn btn--purple js-btn-home">HOME</button>
    <header class="info__header">
      <h1 class="beer-name">${data.name}</h1>
      <p class="desc">
        ${data.description}
      </p>
      <img class="info__img" src="${data.image_url}" alt="beer name" />
    </header>
    <div class="info__wrapper">
      <article class="info__description">
        <div class="info-container">
          <img src="images/discount.svg" />
          <h5>Absolute volume:</h5>
          <p> ${data.abv}</p>
        </div>
        <div class="info-container volume">
          <img src="images/beaker.svg" />
          <h5>Volume:</h5>
          <p>${data.volume.value} ${data.volume.unit}</p>
        </div>
        <div class="info-container info__ingredients">
          <img src="images/grain.svg" />
          <h5>Malt</h5>
    <p>${ingredientsToString(data.ingredients.malt)}</p> 
    <h5>Yeast</h5>
    <p>${data.ingredients.yeast}</p>
        </div>
        <div class="info-container">
        <img src="images/hop.svg" />
        <h5>Hops: </h5>
        <p>${ingredientsToString(data.ingredients.hops)}</p>
      </div>
        
      </article>
      <!-- <div class="info__wrapper"> -->
      <article class="info__description">
        
        <div class="info-container info__brewers-tips">
          <div class="info-container__header">
            <img src="images/beer.svg" />
            <h5>Brewer's tips</h5>
          </div>
          <p class="info__p">
            ${data.brewers_tips}
          </p>
        </div>
        <div class="info-container js__food-pairings">
          <div class="info-container__header">
            <img src="images/knife_1.svg" />
            <h5>Food pairings:</h5>
            <ul class="js-food-pairing-list"></ul>
          </div>
        </div>
        <!-- </div> -->
      </article>
      <article class="info__description__img">
        <img class="info__img" src="${data.image_url}" alt="beer-img" />
      </article>
    </div>
    `;
    const foodPairingList = document.querySelector(".js-food-pairing-list");
    createList(data.food_pairing, foodPairingList);

    const homeBtn = document.querySelector(".js-btn-home");
    homeBtn.addEventListener("click", () => {
      renderHomePage(infoPage);
    });
  }
  function cancelBtnEvent(e) {
    e.preventDefault();
    renderHomePage(searchPage);
  }
  function createBeerSearchList(arr, list) {
    for (let listItem of arr) {
      const li = document.createElement("li");
      li.innerText = listItem.name;
      li.addEventListener("click", function () {
        renderInfoPage(listItem);
      });
      list.append(li);
    }
  }
  async function renderBeerList() {
    const searchList = searchPage.querySelector(".search-list");
    const input = searchPage.querySelector(".js-search-input");
    searchList.innerHTML = "";
    if (input.value) {
      let beerName = input.value;

      if (beerName.includes(" ")) {
        beerName.replace(" ", "_");
      }
      const query =
        apiExtend.query.queryStart +
        currentPage +
        "&" +
        apiExtend.query.beerPerPage +
        "&" +
        apiExtend.query.beerName +
        "=" +
        input.value;
      console.log(query);
      const data = await getData(query);

      if (data.length !== 0) {
        createBeerSearchList(data, searchList);
      }
    }
  }
  function toggleAdvanceSearch(e) {
    const advanceSearch = searchPage.querySelector(".search-section__advanced");
    let element;
    if (e.target.classList.contains("fas")) {
      element = e.target;
    } else {
      element = e.target.children[0];
    }
    toggleClass(advanceSearch, "hide");
    toggleClass(element, "fa-angle-down");
    toggleClass(element, "fa-angle-up");
  }
  function previousPage() {
    if (currentPage > 1) {
      currentPage--;
      renderBeerList();
    }
  }

  function nextPage() {
    if (currentPage < 33) {
      currentPage++;
      renderBeerList();
    }
  }

  function renderSearchPage() {
    toggleClass(homePage, "hide");
    toggleClass(searchPage, "hide");
    currentPage = 1;
    const beerNameSearchList = searchPage.querySelector(".search-list");
    beerNameSearchList.innerHTML = "";
    const beerNameInput = searchPage.querySelector("#search-beer");
    beerNameInput.value = "";
    beerNameInput.addEventListener("keyup", renderBeerList);
    const cancelSearchBtn = searchPage.querySelector(".js-search-cancel");
    cancelSearchBtn.addEventListener("click", cancelBtnEvent);
    const advanceSetting = searchPage.querySelector(".js-toggle-arrow");
    advanceSetting.addEventListener("click", toggleAdvanceSearch);
    const pageLeft = searchPage.querySelector(".page-left");
    pageLeft.addEventListener("click", previousPage);
    const pageRight = searchPage.querySelector(".page-right");
    pageRight.addEventListener("click", nextPage);
  }

  // Main Start up
  initEvents();
}

main();
