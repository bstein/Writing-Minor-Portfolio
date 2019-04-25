let STATE = 0; // 0: start, odd: question, even: storyline, -1: game over
let START_TEXT = "goal: answer as many questions correctly as you can";

let LOADING_RATE = 1000;
let CRITICAL_STORY_LINES = 4;

const FULL_STORY_BANK = [ "i decide what choice is correct<br><br>you'll have good chances<br>at least at first",
                          "pseudorandom looks like random<br><br>but it's based off of something else<br>like the current time or weather",
                          "your chances here are pseudorandom<br>(a computer cannot do better)",
                          "perhaps life is also pseudorandom<br><br>are you ready?",
                          "you might have free will<br><br>it feels like it, right?",
                          "you might not have free will<br><br>the past could wholly decide the present, yes?",
                          "control could be an illusion<br>just like pseudorandomness",
                          "how could you know the truth?",
                          "everything matters<br>or nothing matters<br><br>but if nothing matters,<br>why jeopardize everything?",
                          "if you have free will,<br>then the coin toss is random<br><br>you can push decisions out of our hands",
                          "if you do not have free will,<br>then the coin toss is not random<br><br>you repeatedly fall for the illusion",
                          "cause to effect<br>effect to cause<br><br>and repeat",
                          "you can stop at any time",
                          "when does nature stop being random?<br><br>when could it be predicted?<br>(hypothetically)",
                          "avoid nihilism,<br>if possible"];
const FULL_QUESTION_BANK = ["Which color is better?",
                            "Shall we continue?",
                            "Do you understand?",
                            "Which 1 do you like?",
                            "Are you having any fun?",
                            "Which one is right?",
                            "What time is it?",
                            "01010100 01101000 01100001 01110100 00100000 01110111 01100001 01110011 01101110 00100111 01110100 00100000 01101110 01100101 01100011 01100101 01110011 01110011 01100001 01110010 01111001?",
                            "Where are you?",
                            "Are you going to answer this correctly?",
                            "Why continue?",
                            "Which would you have as a pet?",
                            "Are you feeling young or old?",
                            "Which letter do you prefer?",
                            "Has the sun set?"];
const FULL_OPTION_BANK = [["Maize", "Blue"],
                          ["Sure", "OK", "Yes"],
                          ["No"],
                          ["1","1"],
                          ["No", "Maybe"],
                          ["<","=",">"],
                          ["Before 12", "After 12"],
                          ["00100000", "01110010", "01110011"],
                          ["Here"],
                          ["No", "Yes"],
                          ["*"],
                          ["Lion", "Tiger"],
                          ["Young", "Old"],
                          ["A", "N", "Q"],
                          ["No", "Not sure", "Yes"]];

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

  // If the critical story lines have already been displayed, pick a line randomly instead
  if (STORY_BANK.length <= FULL_STORY_BANK.length - CRITICAL_STORY_LINES) {
    sIndex = Math.floor(Math.random() * STORY_BANK.length);
  }

  $("#story").html(STORY_BANK[sIndex]);
  $("#loading").html(getLoadingText(STORY_BANK[sIndex]));

  // Remove story line
  STORY_BANK.splice(sIndex, 1);

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
