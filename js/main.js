function main() {
  const btnBottle = document.querySelector(".js-random-btn");
  const modalPage = document.querySelector(".js-modal");
  const infoPage = document.querySelector(".js-info");
  const homePage = document.querySelector(".home");
  const searchPage = document.querySelector(".search-section");
  const btnSearch = document.querySelector(".js-search-btn");

  let api = "https://api.punkapi.com/v2/";
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
    const result = await fetch(api.concat(query));
    const data = await result.json();
    return data;
  }

  // Event functions
  async function getRandomBottle() {
    const data = await getData(apiExtend.random);
    const preloader = modalPage.querySelector(".preloader-wrapper");
    toggleClass(preloader, "hide");
    renderModal(data[0]);
  }

  // Modal page
  function renderModal(data) {
    modalPage.addEventListener("click", closeModal);
    toggleClass(modalPage, "hide");
    const preloader = modalPage.querySelector(".preloader-wrapper");

    const cardWrapper = modalPage.querySelector(".wrapper");
    if (cardWrapper.classList.contains("search-modal")) {
      toggleClass(cardWrapper, "search-modal");
    }

    if (data.image_url === null) {
      data.image_url = "./images/DefaultBeer.png";
    }
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
    toggleClass(preloader, "hide");
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

  function closeBeerList(e) {
    if (e.target.classList.contains("search-section")) {
      const searchList = searchPage.querySelector(".search-section__list");
      const pagination = searchPage.querySelector(".pagination");
      toggleClass(searchList, "hide");
      toggleClass(pagination, "hide");
    }
  }

  searchPage.addEventListener("click", (e) => {
    closeBeerList(e);
  });

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
    if (data.image_url === null) {
      data.image_url = "./images/DefaultBeer.png";
    }
    infoPage.innerHTML = `
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
        <div class="info-container__header">
          <img src="images/grain.svg" />
          <h5>Ingredients:</h5>
          </div>
          <h5>Malt:</h5>
    <p>${ingredientsToString(data.ingredients.malt)}</p> 
    <h5>Yeast:</h5>
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
    <div class="info__buttons">
    <button class="btn btn--white js-btn-home"><i class="fas fa-home"></i></button>
    <button class="btn btn--purple js-btn-search"><i class="fas fa-search"></i></button></div>
    `;
    const foodPairingList = document.querySelector(".js-food-pairing-list");
    createList(data.food_pairing, foodPairingList);

    const homeBtn = document.querySelector(".js-btn-home");
    homeBtn.addEventListener("click", () => {
      renderHomePage(infoPage);
    });

    const searchBtn = document.querySelector(".js-btn-search");
    searchBtn.addEventListener("click", () => {
      renderSearchPage();
      toggleClass(homePage, "hide");
      toggleClass(infoPage, "hide");
    });
  }

  function getLocalStorage(query) {
    const getStorage = JSON.parse(localStorage.getItem("queryCache"));
    if (!getStorage || !getStorage[query]) {
      return false;
    }
    if (getStorage[query]) {
      return getStorage[query];
    }
  }

  function setLocalStorage(query, data) {
    let queryStorage = JSON.parse(localStorage.getItem("queryCache"));

    if (!queryStorage) {
      queryStorage = {};
    }

    queryStorage[query] = data;
    localStorage.setItem("queryCache", JSON.stringify(queryStorage));

    const getLocal = JSON.parse(localStorage.getItem("queryCache"));

    console.log(getLocal, "Local Get");
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
        const searchSectionList = searchPage.querySelector(
          ".search-section__list"
        );
        toggleClass(searchSectionList, "hide");
      });
      list.append(li);
    }
  }

  async function renderBeerList() {
    const searchList = searchPage.querySelector(".search-list");
    const input = searchPage.querySelector(".js-search-input");
    const forwardBtn = searchPage.querySelector(".page-right");
    const showCurrentPage = searchPage.querySelector(".current-page");
    const noResults = searchPage.querySelector(".no-results");
    const pagination = searchPage.querySelector(".pagination");
    const searchSectionList = searchPage.querySelector(".search-section__list");
    const preloader = searchPage.querySelector(".search-preloader-wrapper");
    toggleClass(preloader, "hide");
    if (pagination.classList.contains("hide")) {
      toggleClass(pagination, "hide");
    }
    if (searchSectionList.classList.contains("hide")) {
      toggleClass(searchSectionList, "hide");
    }

    if (!input.value) {
      currentPage = 1;
    }

    searchList.innerHTML = "";
    if (input.value) {
      let beerName = input.value.replace(" ", "_").toLowerCase();
      let data;
      const query =
        apiExtend.query.queryStart +
        currentPage +
        "&" +
        apiExtend.query.beerPerPage +
        "&" +
        apiExtend.query.beerName +
        "=" +
        input.value;
      const ls = getLocalStorage(query);
      if (ls) {
        data = ls;
      } else {
        data = await getData(query);
        setLocalStorage(query, data);
      }

      if (data.length <= 0) {
        toggleClass(pagination, "hide");
        toggleClass(searchSectionList, "hide");

        toggleClass(noResults, "hide");
        setTimeout(() => {
          toggleClass(noResults, "hide");
        }, 5000);
      } else {
        forwardBtn.disabled = false;
        createBeerSearchList(data, searchList);
      }
      showCurrentPage.innerText = "Page " + currentPage;
    } else {
      toggleClass(pagination, "hide");
      toggleClass(searchSectionList, "hide");
    }
    toggleClass(preloader, "hide");
  }

  function toggleAdvanceSearch(e) {
    const advanceSearch = searchPage.querySelector(".search-section__advanced");
    clearInputs();

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
    if (obj.image_url === null) {
      obj.image_url = "./images/DefaultBeer.png";
    }
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
        console.log("CLICKED");
      });
    return searchCard;
  }

  function searchModal(data, query) {
    const preloader = modalPage.querySelector(".preloader-wrapper");
    toggleClass(preloader, "hide");
    modalPage.addEventListener("click", closeModal);
    document.body.classList.add("no-scroll");
    const wrapper = modalPage.querySelector(".wrapper");
    if (modalPage.classList.contains("hide")) {
      toggleClass(modalPage, "hide");
    }
    if (!wrapper.classList.contains("search-modal")) {
      toggleClass(wrapper, "search-modal");
    }

    wrapper.innerHTML = `<i class="fas fa-angle-left page-left"></i>`;
    data.forEach((item) => {
      const card = createSearchCard(item);
      wrapper.append(card);
    });
    wrapper.innerHTML += `<i class="fas fa-angle-right page-right"></i>`;
    toggleClass(preloader, "hide");

    const iterateForward = wrapper.querySelector(".page-right");
    const iterateBackward = wrapper.querySelector(".page-left");

    iterateForward.addEventListener("click", async () => {
      if (currentPage < 33) {
        let data;
        const newQuery = query.replace(
          `page=${currentPage}`,
          `page=${currentPage + 1}`
        );
        let ls = getLocalStorage(newQuery);
        if (ls) {
          data = ls;
        } else {
          data = await getData(newQuery);
          if (data) {
            setLocalStorage(query);
          } else {
            return;
          }
        }
        currentPage++;
        searchModal(data, newQuery);
      }
    });
    iterateBackward.addEventListener("click", async () => {
      if (currentPage - 1 !== 0) {
        const newQuery = query.replace(
          `page=${currentPage}`,
          `page=${currentPage - 1}`
        );
        let data;
        let ls = getLocalStorage(newQuery);
        if (ls) {
          data = ls;
        } else {
          data = await getData(newQuery);
        }
        currentPage--;
        searchModal(data, newQuery);
      }
    });
  }
  async function advanceSearch(e) {
    e.preventDefault();
    let data;
    const advanceInputs = searchPage.querySelectorAll(
      ".search-section__advanced input"
    );
    let query =
      apiExtend.query.queryStart + "1" + "&" + apiExtend.query.beerPerPage;

    advanceInputs.forEach((input) => {
      if (input.value !== "") {
        if (
          input.id === "search-brewed-before" ||
          input.id === "search-brewed-after"
        ) {
          query += `&${
            apiExtend.query[input.dataset.query]
          }=${input.value.split("-").reverse().join("-")}`;
        } else {
          query += `&${
            apiExtend.query[input.dataset.query]
          }=${input.value.toLowerCase()}`;
        }
      }
    });

    const ls = getLocalStorage(query);
    if (ls) {
      data = ls;
      console.log("Getting from localStorage");
      console.log(ls, "localStorage");
    } else {
      data = await getData(query);
      setLocalStorage(query, data);
      console.log("this is a fetch request");
    }

    if (data.length === 0) {
      const noResults = searchPage.querySelector(".no-results");
      toggleClass(noResults, "hide");
      setTimeout(() => {
        toggleClass(noResults, "hide");
      }, 5000);
    } else {
      searchModal(data, query);
    }
  }
  function clearInputs() {
    searchPage.querySelectorAll("input").forEach((input) => (input.value = ""));
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
