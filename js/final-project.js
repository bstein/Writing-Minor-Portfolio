let STATE = 0; // 0: start, odd: question, even: storyline, -1: game over
let START_TEXT = "goal: answer as many questions correctly as you can";

let LOADING_RATE = 1000;
let CRITICAL_STORY_LINES = 4;

const FULL_STORY_BANK = [ "i decide what choice is correct<br><br>you'll have good chances<br>until I gradually make this harder",
                          "pseudorandom looks like random<br><br>but it's based off of something else<br>like the current time or weather",
                          "your chances here are pseudorandom<br>as a computer cannot do better",
                          "what if the same model applies<br>to real life?<br><br>i hope you're ready",
                          "non-critical 1",
                          "non-critical 2",
                          "non-critical 3"];
const FULL_QUESTION_BANK = ["Which color is better?",
                            "Shall we continue?",
                            "Do you understand?",
                            "Which 1 do you like?",
                            "Are you enjoing this?",
                            "Sample Question? 2",
                            "Sample Question? 3"];
const FULL_OPTION_BANK = [["Maize", "Blue"],
                          ["Sure", "OK", "Yes"],
                          ["No"],
                          ["1","1"],
                          ["Maybe"],
                          ["A 1","A 2","A 3"],
                          ["A 1"]];

let STORY_BANK = [];
let QUESTION_BANK = [];
let OPTION_BANK = [];

$(document).ready(() => {
  // Copy bank lists since this is the first load
  STORY_BANK = FULL_STORY_BANK;
  QUESTION_BANK = FULL_QUESTION_BANK;
  OPTION_BANK = FULL_OPTION_BANK;

  // Begin loading...
  setTimeout(removeLoadingDot, LOADING_RATE);

  // Listen for option click events
  $(".option").click(optionClicked);
});

function optionClicked() {
  STATE += 1;
  showStory();
}

function removeLoadingDot() {
  currentProgress = $("#loading").html();

  if (currentProgress.length > 1) {
    // "Remove" one dot
    $("#loading").html(currentProgress.slice(0, -1));

    // Check status again in 500 ms
    setTimeout(removeLoadingDot, LOADING_RATE);
  }
  else {
    STATE += 1;
    showQuestion();
  }
}

function showQuestion() {
  // Pick a question randomly
  let qIndex = Math.floor(Math.random() * QUESTION_BANK.length);

  // Append the question and its options to the DOM
  $("#question").html(QUESTION_BANK[qIndex]);
  for (let i = 0; i < OPTION_BANK[qIndex].length; i += 1) {
    // Prepare option element
    const optionStr = `<button class='option'>${OPTION_BANK[qIndex][i].toUpperCase()}</button>`;
    $("#optionContainer").append(optionStr);
  }

  // Remove question and options from arrays
  QUESTION_BANK.splice(qIndex, 1);
  OPTION_BANK.splice(qIndex, 1);

  // Listen for option click events
  $(".option").click(optionClicked);

  // Switch from story to question view
  $("#storyContainer").hide();
  $("#questionContainer").show();
}

function showStory() {
  // Use the next story line
  let sIndex = 0;

  $("#story").html(STORY_BANK[sIndex]);
  $("#loading").html(getLoadingText(STORY_BANK[sIndex]));

  // Remove story line
  STORY_BANK.shift();

  // Switch from question to story view
  $("#questionContainer").hide();
  $(".option").remove();
  $("#storyContainer").show();

  // Begin loading...
  setTimeout(removeLoadingDot, LOADING_RATE);
}

function getLoadingText(story) {
  let wordCount = story.trim().split(/\s+/).length;
  return ".".repeat(Math.ceil(wordCount / 2.5));
}
