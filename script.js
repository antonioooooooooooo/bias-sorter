const submitButton = document.querySelector("[data-submit-button]");
const inputTextBox = document.querySelector("[data-input-textbox]");
const optionsListElem = document.querySelector("[data-options-list]");
const startButton = document.querySelector("[data-start-button]");
const container = document.querySelector("[data-container]");

let optionsList = [];
let sortingIterations;
let battleNum;

submitButton.addEventListener("click", handleSubmit);

inputTextBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSubmit(e);
  }
});

startButton.addEventListener("click", handleClickStart);

document.addEventListener("click", handleClickOptionButton);

document.addEventListener("click", handleClickILikeBoth);

function handleSubmit(e) {
  e.preventDefault();

  if (inputTextBox.value === "") {
    return;
  }

  if (optionsListElem.classList.contains("initial-options")) {
    optionsListElem.classList.remove("initial-options");
    optionsListElem.classList.add("options");
  }

  const newOption = document.createElement("span");
  newOption.setAttribute("class", "option");
  newOption.setAttribute(`data-option-${optionsList.length + 1}`, "");
  newOption.innerHTML = inputTextBox.value;

  const deleteButton = document.createElement("input");
  deleteButton.setAttribute("type", "button");
  deleteButton.setAttribute("class", "delete-button");
  deleteButton.setAttribute("value", "X");
  deleteButton.setAttribute("id", optionsList.length + 1);
  deleteButton.setAttribute(`data-delete-button-${optionsList.length + 1}`, "");
  deleteButton.setAttribute("onclick", "handleClickDeleteButton(event)");

  newOption.append(deleteButton);
  optionsListElem.append(newOption);

  if (optionsList.length >= 1) {
    const comma = document.createElement("span");
    comma.setAttribute(`data-comma-${optionsList.length}`, "");
    comma.innerHTML = ", ";
    optionsListElem.insertBefore(comma, newOption);
  }

  optionsList.push(inputTextBox.value);

  if (
    optionsList.length >= 2 &&
    startButton.classList.contains("start-button-initial")
  ) {
    startButton.classList.remove("start-button-initial");
    startButton.classList.add("start-button");
  }

  inputTextBox.value = "";
}

function handleClickDeleteButton(event) {
  event.preventDefault();

  const button = event.target;
  const ind = button.id;

  document.querySelector(`[data-option-${ind}]`).remove();

  if (ind !== "1") {
    document.querySelector(`[data-comma-${ind - 1}]`).remove();
  } else if (optionsList.length > 1) {
    document.querySelector(`[data-comma-${ind}]`).remove();
  }

  optionsList.splice(ind - 1, 1);

  const items = optionsListElem.querySelectorAll(".option");

  for (let i = parseInt(ind) - 1; i < items.length; i++) {
    items[i].removeAttribute(`data-option-${i + 2}`);
    items[i].setAttribute(`data-option-${i + 1}`, "");
    items[i].children[0].removeAttribute(`data-delete-button-${i + 2}`);
    items[i].children[0].setAttribute(`data-delete-button-${i + 1}`, "");
    items[i].children[0].setAttribute("id", i + 1);

    if (i !== 0) {
      const comma = optionsListElem.querySelector(`[data-comma-${i + 1}]`);
      comma.removeAttribute(`data-comma-${i + 1}`);
      comma.setAttribute(`data-comma-${i}`, "");
    }
  }

  if (optionsList.length < 2) {
    startButton.classList.remove("start-button");
    startButton.classList.add("start-button-initial");
  }

  if (optionsList.length === 0) {
    optionsListElem.classList.remove("options");
    optionsListElem.classList.add("initial-options");
  }
}

function handleClickStart(e) {
  e.preventDefault();

  let child = container.lastElementChild;

  while (child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }

  const sorterHeader = document.createElement("h2");
  sorterHeader.setAttribute("class", "sorter-header");
  sorterHeader.innerText = "Anton's Bias Sorter";

  const sorterDescription = document.createElement("p");
  sorterDescription.setAttribute("class", "sorter-description");
  sorterDescription.innerText =
    'Pick who you like better in each matchup to get an accurate ranking, from favourite to least favourite.\nNote: hitting "No opinion" or "I like both" frequently will negatively affect your results.';

  const battleHeader = document.createElement("p");
  battleHeader.setAttribute("class", "battle-header");
  battleHeader.setAttribute("data-battle-header", "");
  battleHeader.innerText = "Battle #1";

  const sortedPercent = document.createElement("p");
  sortedPercent.setAttribute("class", "sorted-percent");
  sortedPercent.setAttribute("data-sorted-percent", "");
  sortedPercent.innerText = "0% sorted";

  const sorterContainer = document.createElement("div");
  sorterContainer.setAttribute("class", "sorter-container");
  sorterContainer.setAttribute("data-sorter-container", "");

  shuffle(optionsList);
  sortingIterations = optionsList.length - 1;
  battleNum = 1;

  const firstOption = document.createElement("div");
  firstOption.setAttribute("class", "option-button first-option sorter-button");
  firstOption.setAttribute("data-option", "");
  firstOption.setAttribute("data-first-option", "");
  firstOption.setAttribute("ind", "0");
  firstOption.innerText = optionsList[0];

  const secondOption = document.createElement("div");
  secondOption.setAttribute(
    "class",
    "option-button second-option sorter-button"
  );
  secondOption.setAttribute("data-option", "");
  secondOption.setAttribute("data-second-option", "");
  secondOption.setAttribute("ind", "1");
  secondOption.innerText = optionsList[1];

  const iLikeBothButton = document.createElement("div");
  iLikeBothButton.setAttribute(
    "class",
    "i-like-both-button middle-button sorter-button"
  );
  iLikeBothButton.setAttribute("data-middle-button", "");
  iLikeBothButton.setAttribute("data-i-like-both-button", "");
  iLikeBothButton.innerText = "I like both";

  const noOpinionButton = document.createElement("div");
  noOpinionButton.setAttribute(
    "class",
    "no-opinion-button middle-button sorter-button"
  );
  noOpinionButton.setAttribute("data-middle-button", "");
  noOpinionButton.setAttribute("data-no-opinion-button", "");
  noOpinionButton.innerText = "No opinion";

  sorterContainer.append(
    firstOption,
    secondOption,
    iLikeBothButton,
    noOpinionButton
  );
  container.append(
    sorterHeader,
    sorterDescription,
    battleHeader,
    sortedPercent,
    sorterContainer
  );
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function handleClickOptionButton(e) {
  e.preventDefault();

  if (sortingIterations < 1 || !e.target.hasAttribute("data-option")) {
    return;
  }

  const firstOption = document.querySelector("[data-first-option]");
  const secondOption = document.querySelector("[data-second-option]");
  const firstInd = firstOption.getAttribute("ind");
  const secondInd = secondOption.getAttribute("ind");
  const maxInd = Math.max(parseInt(firstInd), parseInt(secondInd));

  const newOptionInd = maxInd + 1 <= sortingIterations ? maxInd + 1 : 0;

  if (e.target.hasAttribute("data-first-option")) {
    if (parseInt(firstInd) > parseInt(secondInd)) {
      [optionsList[parseInt(firstInd)], optionsList[parseInt(secondInd)]] = [
        optionsList[parseInt(secondInd)],
        optionsList[parseInt(firstInd)],
      ];
      secondOption.setAttribute("ind", firstInd);
    }

    if (newOptionInd === 0) {
      firstOption.innerText =
        typeof optionsList[0] === "string"
          ? optionsList[0]
          : optionsList[0][Math.floor(Math.random() * optionsList[0].length)];
      firstOption.setAttribute("ind", "0");
      secondOption.innerText =
        typeof optionsList[1] === "string"
          ? optionsList[1]
          : optionsList[1][Math.floor(Math.random() * optionsList[1].length)];
      secondOption.setAttribute("ind", "1");
      sortingIterations--;
    } else {
      firstOption.innerText =
        typeof optionsList[newOptionInd] === "string"
          ? optionsList[newOptionInd]
          : optionsList[newOptionInd][
              Math.floor(Math.random() * optionsList[newOptionInd].length)
            ];
      firstOption.setAttribute("ind", newOptionInd.toString());
    }
  } else {
    if (parseInt(secondInd) > parseInt(firstInd)) {
      [optionsList[parseInt(firstInd)], optionsList[parseInt(secondInd)]] = [
        optionsList[parseInt(secondInd)],
        optionsList[parseInt(firstInd)],
      ];
      firstOption.setAttribute("ind", secondInd);
    }

    if (newOptionInd === 0) {
      firstOption.innerText =
        typeof optionsList[0] === "string"
          ? optionsList[0]
          : optionsList[0][Math.floor(Math.random() * optionsList[0].length)];
      firstOption.setAttribute("ind", "0");
      secondOption.innerText =
        typeof optionsList[1] === "string"
          ? optionsList[1]
          : optionsList[1][Math.floor(Math.random() * optionsList[1].length)];
      secondOption.setAttribute("ind", "1");
      sortingIterations--;
    } else {
      secondOption.innerText =
        typeof optionsList[newOptionInd] === "string"
          ? optionsList[newOptionInd]
          : optionsList[newOptionInd][
              Math.floor(Math.random() * optionsList[newOptionInd].length)
            ];
      secondOption.setAttribute("ind", newOptionInd.toString());
    }
  }

  if (sortingIterations === 0) {
    generateResultsChart();
    document.querySelector("[data-sorted-percent]").innerHTML = "100% sorted";
  } else {
    battleNum++;
    document.querySelector(
      "[data-battle-header]"
    ).innerHTML = `Battle #${battleNum}`;
    document.querySelector("[data-sorted-percent]").innerHTML = `${Math.round(
      ((battleNum - 1) * 100) /
        ((optionsList.length * (optionsList.length - 1)) / 2)
    )}% sorted`;
  }
}

function handleClickILikeBoth(e) {
  e.preventDefault();

  if (
    sortingIterations < 1 ||
    (!e.target.hasAttribute("data-i-like-both-button") &&
      !e.target.hasAttribute("data-no-opinion-button"))
  ) {
    return;
  }

  const firstOption = document.querySelector("[data-first-option]");
  const secondOption = document.querySelector("[data-second-option]");
  const firstInd = firstOption.getAttribute("ind");
  const secondInd = secondOption.getAttribute("ind");
  const minInd = Math.min(parseInt(firstInd), parseInt(secondInd));
  sortingIterations--;

  if (minInd + 2 <= optionsList.length - 1) {
    optionsList =
      typeof optionsList[parseInt(firstInd)] === "string" &&
      typeof optionsList[parseInt(secondInd)] === "string"
        ? [
            ...optionsList.slice(0, minInd),
            [firstOption.innerText, secondOption.innerText],
            ...optionsList.slice(minInd + 2),
          ]
        : typeof optionsList[parseInt(firstInd)] !== "string" &&
          typeof optionsList[parseInt(secondInd)] !== "string"
        ? [
            ...optionsList.slice(0, minInd),
            optionsList[parseInt(firstInd)].concat(
              optionsList[parseInt(secondInd)]
            ),
            ...optionsList.slice(minInd + 2),
          ]
        : typeof optionsList[minInd] !== "string"
        ? [
            ...optionsList.slice(0, minInd),
            optionsList[minInd].concat([optionsList[minInd + 1]]),
            ...optionsList.slice(minInd + 2),
          ]
        : [
            ...optionsList.slice(0, minInd),
            optionsList[minInd + 1].concat([optionsList[minInd]]),
            ...optionsList.slice(minInd + 2),
          ];

    if (sortingIterations < 1) {
      generateResultsChart();
      return;
    }

    if (minInd === parseInt(firstInd)) {
      secondOption.innerText =
        typeof optionsList[minInd + 1] === "string"
          ? optionsList[minInd + 1]
          : optionsList[minInd + 1][
              Math.floor(Math.random() * optionsList[minInd + 1].length)
            ];
    } else {
      firstOption.innerText =
        typeof optionsList[minInd + 1] === "string"
          ? optionsList[minInd + 1]
          : optionsList[minInd + 1][
              Math.floor(Math.random() * optionsList[minInd + 1].length)
            ];
    }
  } else {
    optionsList =
      typeof optionsList[parseInt(firstInd)] === "string" &&
      typeof optionsList[parseInt(secondInd)] === "string"
        ? [
            ...optionsList.slice(0, minInd),
            [firstOption.innerText, secondOption.innerText],
          ]
        : typeof optionsList[parseInt(firstInd)] !== "string" &&
          typeof optionsList[parseInt(secondInd)] !== "string"
        ? [
            ...optionsList.slice(0, minInd),
            optionsList[parseInt(firstInd)].concat(
              optionsList[parseInt(secondInd)]
            ),
          ]
        : typeof optionsList[minInd] !== "string"
        ? [
            ...optionsList.slice(0, minInd),
            optionsList[minInd].concat([optionsList[minInd + 1]]),
          ]
        : [
            ...optionsList.slice(0, minInd),
            optionsList[minInd + 1].concat([optionsList[minInd]]),
          ];

    if (sortingIterations < 1) {
      generateResultsChart();
      document.querySelector("[data-sorted-percent]").innerHTML = "100% sorted";
      return;
    }

    firstOption.innerText =
      typeof optionsList[0] === "string"
        ? optionsList[0]
        : optionsList[0][Math.floor(Math.random() * optionsList[0].length)];
    firstOption.setAttribute("ind", "0");
    secondOption.innerText =
      typeof optionsList[1] === "string"
        ? optionsList[1]
        : optionsList[1][Math.floor(Math.random() * optionsList[1].length)];
    secondOption.setAttribute("ind", "1");
    sortingIterations--;
  }

  battleNum++;
  document.querySelector(
    "[data-battle-header]"
  ).innerHTML = `Battle #${battleNum}`;
  document.querySelector("[data-sorted-percent]").innerHTML = `${Math.round(
    ((battleNum - 1) * 100) /
      ((optionsList.length * (optionsList.length - 1)) / 2)
  )}% sorted`;
}

function generateResultsChart() {
  const resultsContainer = document.createElement("div");
  resultsContainer.setAttribute("class", "results-container");

  const resultsTable = document.createElement("table");
  resultsTable.setAttribute("class", "results-table");

  const tableHeader = document.createElement("tr");
  tableHeader.setAttribute(
    "class",
    "results-table-row results-table-header-row"
  );

  const rank = document.createElement("th");
  rank.setAttribute(
    "class",
    "results-table-cell rank-header results-table-rank results-table-header"
  );
  rank.innerHTML = "Rank";
  tableHeader.append(rank);

  const character = document.createElement("th");
  character.setAttribute(
    "class",
    "results-table-cell character-header results-table-header"
  );
  character.innerHTML = "Character";
  tableHeader.append(character);

  resultsTable.append(tableHeader);
  resultsContainer.append(resultsTable);

  for (let i = 1; i <= optionsList.length; i++) {
    const newRow = document.createElement("tr");
    newRow.setAttribute("class", "results-table-row");

    const characterRank = document.createElement("td");
    characterRank.setAttribute(
      "class",
      "results-table-cell results-table-rank"
    );
    characterRank.innerHTML = i.toString();
    newRow.append(characterRank);

    const characterName = document.createElement("td");
    characterName.setAttribute(
      "class",
      "results-table-cell results-table-character"
    );
    characterName.innerHTML =
      typeof optionsList[i - 1] === "string"
        ? optionsList[i - 1]
        : optionsList[i - 1].join(", ");
    newRow.append(characterName);

    resultsTable.append(newRow);
  }

  container.append(resultsContainer);
}
