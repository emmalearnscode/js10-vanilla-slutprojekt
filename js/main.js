function main() {
  const btnBottle = document.querySelector(".js-random-btn");
  let api = "https://api.punkapi.com/v2/";
  const apiExtend = {
    random: "beers/random",
  };

  function initEvents() {
    btnBottle.addEventListener("click", getRandomBottle);
  }
  async function getData(extend) {
    const result = await fetch(api.concat(extend));
    const data = await result.json();
    return data;
  }
  // Event functions
  async function getRandomBottle() {
    const data = await getData(apiExtend.random);
    console.log(data[0]);
  }

  // Main Start up
  initEvents();
}

main();
