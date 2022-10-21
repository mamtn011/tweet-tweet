console.log("tweet connected");
(() => {
  // .............DOM selectors.............
  const form = document.querySelector("form");
  const messageElm = document.querySelector(".msg");
  const tweetInput = document.querySelector(".tweet-input");
  const letterCountElm = document.querySelector(".counter");
  const submitBtn = document.querySelector(".submitBtn button");
  const searchInput = document.querySelector("#search");
  const tweetCollections = document.querySelector(".collection");
  // mamory storage
  let allTweets = localStorage.getItem("tweetsInLocalStore")
    ? JSON.parse(localStorage.getItem("tweetsInLocalStore"))
    : [];
  showAllTweetsToUI(allTweets);

  // common funtions
  function clearMessage() {
    messageElm.textContent = "";
  }
  function showMessage(msg, action = "success") {
    const message = `<div class="alert alert-${action}" role="alert">
${msg}
</div>`;
    messageElm.insertAdjacentHTML("afterbegin", message);
    setTimeout(() => {
      clearMessage();
    }, 3000);
  }
  function showNoTweetMessage() {
    if (allTweets.length < 1) {
      const liElm = `<li
      class="list-group-item collection-item d-flex flex-row justify-content-between"
    >No tweets available in storage. Add new tweet please!</li>`;
      tweetCollections.insertAdjacentHTML("beforeend", liElm);
    }
  }
  // functions for adding new tweet
  function receiveNewTweet() {
    return tweetInput.value;
  }
  function validateInputDataIsEmpty(data) {
    let validity = true;
    if (data.length < 1) {
      validity = false;
      showMessage("You have to write something to tweet!", "warning");
    }
    return validity;
  }
  function validateLetterCount(letterCount) {
    if (letterCount === 250) {
      showMessage("You can't input more the 250 letter!", "warning");
      tweetInput.setAttribute("readonly", "true");
    } else if (letterCount > 250) {
      submitBtn.setAttribute("disabled", "disabled");
      tweetInput.setAttribute("readonly", "true");
      showMessage(
        "You have inserted more then 250 letter illegally!",
        "danger"
      );
    }
  }
  function resetInput() {
    tweetInput.value = "";
    tweetInput.removeAttribute("readonly");
    letterCountElm.textContent = 0;
  }
  function addNewTweet(tweet, allTweets) {
    const id = Date.now();
    const time = moment().format("h:mm A");
    const createTweet = {
      id,
      time,
      tweet,
    };
    allTweets.push(createTweet);
    return createTweet;
  }
  function addNewTweetToLocalStorage(newTweet) {
    let tweets;
    if (localStorage.getItem("tweetsInLocalStore")) {
      tweets = JSON.parse(localStorage.getItem("tweetsInLocalStore"));
      tweets.push(newTweet);
    } else {
      tweets = [];
      tweets.push(newTweet);
    }
    localStorage.setItem("tweetsInLocalStore", JSON.stringify(tweets));
  }
  // functions for showing tweets to UI
  function showAllTweetsToUI(tweets) {
    tweetCollections.textContent = "";
    let alltweet = [];
    let liElms;
    liElms =
      tweets.length === 0
        ? `<li class="list-group-item collection-item d-flex flex-row justify-content-between noProduct">Sorry! No tweets available now.</li>`
        : "";
    alltweet = tweets.sort((a, b) => b.id - a.id);
    alltweet.forEach((singleTweet, i) => {
      const { id, time, tweet } = singleTweet;
      liElms += `<li
      class="list-group-item collection-item d-flex flex-row justify-content-between" data-id="${id}"
    >
      <div class="tweet-info">
        <p>
          <strong><span>${i + 1}</span>.</strong>
          <span
            >${tweet}</span
          >
          <br />
          <span class="time" style="float: left; color: #ff6d6d"
            >${time}</span
          >
        </p>
      </div>
      <!-- <div class="action-btn"></div> -->
      <button
        class="edit-tweet"
        style="position: absolute; bottom: 0; right: 30px"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
      <button
        class="delete-tweet"
        style="position: absolute; bottom: 0; right: 0"
      >
        <i class="fa fa-trash-alt"></i>
      </button>
    </li>`;
    });
    tweetCollections.insertAdjacentHTML("afterbegin", liElms);
  }
  // functions for edit and delete tweet
  function getTarget(evt) {
    let target;
    if (evt.target.classList.contains("edit-tweet")) {
      target = evt.target;
    } else if (evt.target.classList.contains("delete-tweet")) {
      target = evt.target;
    } else if (evt.target.parentElement.classList.contains("edit-tweet")) {
      target = evt.target.parentElement;
    } else {
      target = evt.target.parentElement;
    }
    return target;
  }
  function getTweetId(target) {
    const liElm = target.parentElement;
    const id = Number(liElm.getAttribute("data-id"));
    return id;
  }
  //edit tweet
  function finedTweetForEdit(id, tweets) {
    const foundTweet = tweets.find((tweet) => tweet.id === id);
    return foundTweet;
  }
  function populateTweetForEdit(tweet) {
    tweetInput.value = tweet.tweet;
    submitBtn.textContent = "Update";
    letterCountElm.textContent = tweet.tweet.length;
    submitBtn.setAttribute("data-id", tweet.id);
    submitBtn.classList.add("btn-info");
    submitBtn.classList.add("edit");
  }
  function editTweet(id, inputData, tweets) {
    const time = moment().format("h:mm A");
    const updatedTweet = tweets.map((singleTweet) => {
      if (singleTweet.id === id) {
        return {
          ...singleTweet,
          time,
          tweet: inputData,
        };
      } else {
        return singleTweet;
      }
    });
    return updatedTweet;
  }
  function editInLocalStorage(tweets) {
    localStorage.setItem("tweetsInLocalStore", JSON.stringify(tweets));
  }
  function resetEditForm() {
    submitBtn.textContent = "Tweet";
    submitBtn.removeAttribute("data-id");
    submitBtn.classList.remove("btn-info");
    submitBtn.classList.remove("edit");
  }
  //delete tweet
  function deleteTweet(id, tweets) {
    allTweets = tweets.filter((tweet) => tweet.id != id);
  }
  function deleteTweetFromUI(target) {
    target.parentElement.remove();
  }
  function deleteTweetFromLocalStorage(id, tweets) {
    let all_tweet;
    //all_tweet = JSON.parse(localStorage.getItem("tweetsInLocalStore"));
    all_tweet = tweets.filter((tweet) => tweet.id != id);
    localStorage.setItem("tweetsInLocalStore", JSON.stringify(all_tweet));
  }
  // event handler functions
  function handleInputFormSubmit(evt) {
    evt.preventDefault();
    const inputData = receiveNewTweet();
    resetInput();
    const isValid = validateInputDataIsEmpty(inputData);
    if (!isValid) return;
    if (submitBtn.classList.contains("edit")) {
      const id = Number(submitBtn.dataset.id);
      allTweets = editTweet(id, inputData, allTweets);
      editInLocalStorage(allTweets);
      resetEditForm();
      showMessage("Tweet updated successfully!");
    } else {
      const newTweet = addNewTweet(inputData, allTweets);
      addNewTweetToLocalStorage(newTweet);
    }
    showAllTweetsToUI(allTweets);
  }
  function handleletterCountValidation() {
    let letterCount = 0;
    letterCount = tweetInput.value.length;
    letterCountElm.textContent = letterCount;
    validateLetterCount(letterCount);
  }
  function editOrDeleteTweet(evt) {
    const target = getTarget(evt);
    const id = getTweetId(target);
    if (target.classList.contains("delete-tweet")) {
      deleteTweet(id, allTweets);
      deleteTweetFromUI(target);
      deleteTweetFromLocalStorage(id, allTweets);
      showMessage("Tweet deleted successfully!");
    } else if (target.classList.contains("edit-tweet")) {
      const foundTweet = finedTweetForEdit(id, allTweets);
      populateTweetForEdit(foundTweet);
    }
  }
  function handleFilterTweets() {
    const filterText = searchInput.value;
    const filterdTweets = allTweets.filter((singleTweet) =>
      singleTweet.tweet.toLowerCase().includes(filterText.toLowerCase())
    );
    showAllTweetsToUI(filterdTweets);
  }
  // event listeners
  function init() {
    form.addEventListener("submit", handleInputFormSubmit);
    tweetInput.addEventListener("keyup", handleletterCountValidation);
    tweetCollections.addEventListener("click", editOrDeleteTweet);
    searchInput.addEventListener("keyup", handleFilterTweets);
  }
  init();
})();
