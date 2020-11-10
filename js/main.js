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
      beerName: "beer_name",
      brewedBefore: "brewed_before",
      brewedAfter: "brewed_after",
      hops: "hops",
      malt: "malt",
      abvLess: "abv_lt",
      abvGreater: "abv_gt",
    },
  };

  function initEvents() {
    btnBottle.addEventListener("click", getRandomBottle);
    btnSearch.addEventListener("click", renderSearchPage);
  }

  function toggleClass(element, className) {
    element.classList.toggle(className);
  }
  async function getData(query) {
    const result = await fetch(api.concat(query)); // real api later use
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
      e.target.classList.contains("js-modal-close") ||
      e.target.classList.contains("search-modal")
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
    for (let index in arr) {
      if (index === arr.length - 1) {
        newString += `${arr[index].name} `;
      } else {
        newString += `${arr[index].name}, `;
      }
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
    <div class="header-content">
      <h1 class="beer-name">${data.name}</h1>
      <p class="desc">
        ${data.description}
      </p>
      </div>
      <div class="header-img">
      <img class="info__img" src="${data.image_url}" alt="beer name" />
      </div>
      </header>
    <div class="info__wrapper">
      <article class="info__description">
        <div class="info-container info-flex">
        
          <img src="images/discount.svg" />
          <h5>Absolute volume: </h5>
          <p> ${data.abv}</p>
        
          
        </div>
        <div class="info-container volume info-flex">
          <img src="images/beaker.svg" />
          <h5>Volume: </h5>
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
        <div class="info-container__header">
        <img src="images/hop.svg" />
        <h5>Hops: </h5>
        </div>
        <p> ${ingredientsToString(data.ingredients.hops)}</p>
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
            
          </div>
          <ul class="js-food-pairing-list"></ul>
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
    const forwardBtn = searchPage.querySelector(".page-right");
    const showCurrentPage = searchPage.querySelector(".current-page");
    const pagination = searchPage.querySelector(".pagination");

    if (pagination.classList.contains("hide")) {
      toggleClass(pagination, "hide");
    }

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

      const data = await getData(query);
      if (data.length < 10) {
        forwardBtn.disabled = true;
      } else {
        forwardBtn.disabled = false;
        createBeerSearchList(data, searchList);
      }
      showCurrentPage.innerText = "Page " + currentPage;
    } else {
      toggleClass(pagination, "hide");
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
  function createSearchCard(obj) {
    const searchCard = document.createElement("div");
    toggleClass(searchCard, "card");
    searchCard.innerHTML = `
    <div class="card__img">
    <img src="${obj.image_url}" alt="${obj.name}" />
  </div>
  <div class="card__content">
    <h2 class="beer-name">${obj.name}</h2>
    <button class="btn btn--white js-more-info-btn">MORE INFO</button>
  </div>
    `;
    const btnMoreInfo = searchCard
      .querySelector(".js-more-info-btn")
      .addEventListener("click", () => {
        renderInfoPage(obj);
      });
    return searchCard;
  }
  function searchModal(data) {
    modalPage.addEventListener("click", closeModal);
    document.body.classList.add("no-scroll");
    const wrapper = modalPage.querySelector(".wrapper");
    wrapper.innerHTML = "";
    toggleClass(modalPage, "hide");
    if (!wrapper.classList.contains("search-modal")) {
      toggleClass(wrapper, "search-modal");
    }
    data.forEach((item) => {
      const card = createSearchCard(item);
      wrapper.append(card);
    });
  }
  async function advanceSearch(e) {
    e.preventDefault();
    const advanceInputs = searchPage.querySelectorAll(
      ".search-section__advanced input"
    );
    let query = apiExtend.query.queryStart + "1";

    advanceInputs.forEach((input) => {
      if (input.value !== "") {
        query += `&${apiExtend.query[input.dataset.query]}=${input.value}`;
      }
    });
    const data = await getData(query);
    searchModal(data);
  }
  function clearInputs() {
    const inputs = searchPage
      .querySelectorAll("input")
      .forEach((input) => (input.value = ""));
  }

  function renderSearchPage() {
    toggleClass(homePage, "hide");
    toggleClass(searchPage, "hide");
    clearInputs();
    currentPage = 1;
    const pagination = searchPage.querySelector(".pagination");
    if (!pagination.classList.contains("hide")) {
      toggleClass(pagination, "hide");
    }
    const beerNameSearchList = searchPage.querySelector(".search-list");
    beerNameSearchList.innerHTML = "";
    const beerNameInput = searchPage.querySelector("#search-beer");
    beerNameInput.addEventListener("keyup", renderBeerList);
    const cancelSearchBtn = searchPage.querySelector(".js-search-cancel");
    cancelSearchBtn.addEventListener("click", cancelBtnEvent);
    const advanceSetting = searchPage.querySelector(".js-toggle-arrow");
    advanceSetting.addEventListener("click", toggleAdvanceSearch);
    const pageLeft = searchPage.querySelector(".page-left");
    pageLeft.addEventListener("click", previousPage);
    const pageRight = searchPage.querySelector(".page-right");
    pageRight.addEventListener("click", nextPage);
    const btnSearch = searchPage.querySelector(".js-search-submit");
    btnSearch.addEventListener("click", advanceSearch);
  }

  // Main Start up
  initEvents();
}

main();
