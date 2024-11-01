/* PSEUDOCODE

Use one of your board game ideas?

SWOON!

- Five re-rollable dice with the love languages and a SWOON!
- SWOON!s don't do anything on their own, so it's risky to go for it.
- You get set up with a girl via a dating-app style interface, where you learn a little about her (it's your job to deduce which love languages she likes).
- On your date, you have a certain amount of chances to make a big impression, but luck might make things go sour, or there might be a random event that shakes things up.
- You go through your (let's say) five chances and see how the date went, determining whether you get another date?
- Date #2 would be a harder version of the date with higher stakes?
- Win condition would be for her to be your girlfriend/boyfriend/etc?
- So, I suppose the menu is the dating app, but it doesn't have a ton of info and you learn as you go what they like and don't?


What does this game need?
- Dating app interface menu
- Dice elements (animation can just be cycling through the faces)
- Three chance structure with hold buttons and re-roll button
- Special effect on full SWOON! (i.e. you take a big swing and it works!)
- Otherwise, the thing you do is based on the situation. They like certain things better than others, but doing the same thing over and over has diminishing returns?
- Simple art (even silhouettes) for the people you date
- Scenarios for the dates (make it more akin to boyfriend dungeon)
- Some way to affect your chances as you go (class or change die faces, etc?)
- Variables that store your overall progress with a person between dates. (Maybe you even get to choose what you wear and that has an effect?)

Die Faces:
Words of Affirmation (Speech Bubble)
Physical Touch (Holding Hands)
Quality Time (Clock Face)
Acts of Service (Dinner Plate)
Gift Giving (Gift Box)
SWOON! (Heart)

MAYBE MAKE IT MORE GENERAL, LIKE BE FUNNY, SMART, EMOTIONAL, etc?
Then the dice can be weighted certain ways based on a self-profile at the beginning of the game?

Point Calculation:
-100 points per majority face
-50 points per SWOON! (750 total if full set)
-Multipliers (Based on Personality) - Love (1.5), Like (1.2), Neutral (1.0), Dislike (0.8), Hate (0.5)
-Situation Bonus - Each date event will have a choice based on the event, with some making slightly more sense than others (awarding a small flat bonus to your post-multiplier score) [NOT SURE ABOUT THIS ONE]
-Maybe FUNNY, CLEVER and SWEET
*/

/* ----------------------------------------------------------- */
/* ---------------------- Cached Elements -------------------- */
/* ----------------------------------------------------------- */

// cached elements for main game window (upper box)
const gameWindow = document.querySelector("#game-window");
const storyPrompt = document.querySelector("#prompt");
const storyButtonBox = document.querySelector("#choice-box");

// cached elements for individual story buttons
const storyButton1 = document.querySelector("#ch1");
const storyButton2 = document.querySelector("#ch2");
const storyButton3 = document.querySelector("#ch3");

// to manipluate content and display of three reactions
const eventReactions = document.querySelector("#reaction-box");

// cached meter elements (between game and action windows)
const moodMeter = document.querySelector("#mood");
const swoonMeter = document.querySelector("#swoon");

// I wanted to event bubble the dice cache, but this was way easier
const die1 = document.querySelector("#d1");
const die2 = document.querySelector("#d2");
const die3 = document.querySelector("#d3");
const die4 = document.querySelector("#d4");
const die5 = document.querySelector("#d5");

// caches lock button bar to make them interactive
const lockButtons = document.querySelector("#lock-buttons");

// cached elements for action buttons
const rollButton = document.querySelector("#ab1");
const commitButton = document.querySelector("#ab2");

/* ----------------------------------------------------------- */
/* -------------------- Arrays & Variables ------------------- */
/* ----------------------------------------------------------- */

// defining current URL path for proper image finding
const currentURL = window.location.href;

// for easier iteration within storyButtonBox
const storyButtons = [storyButton1, storyButton2, storyButton3];

// defining array for all die faces to ease switching; each is an object with locked and unlocked properties
const dieFaces = [
	{
		type: "Funny",
		locked: currentURL + "images/laugh-die-locked.png",
		unlocked: currentURL + "images/laugh-die.png",
	},
	{
		type: "Clever",
		locked: currentURL + "images/brain-die-locked.png",
		unlocked: currentURL + "images/brain-die.png",
	},
	{
		type: "Sweet",
		locked: currentURL + "images/rose-die-locked.png",
		unlocked: currentURL + "images/rose-die.png",
	},
	{
		type: "Swoon",
		locked: currentURL + "images/heart-die-locked.png",
		unlocked: currentURL + "images/heart-die.png",
	},
];

/* dieFaces Array Key
Funny -> dieFaces[0]
Clever -> dieFaces[1]
Sweet -> dieFaces[2]
Swoon -> dieFaces[3]
*/

// array of each cached die element for use later
const allDice = [die1, die2, die3, die4, die5];

// array that lets us iterate past locked dice when rolling
let lockStates = ["unlocked", "unlocked", "unlocked", "unlocked", "unlocked"];

// array for storing final roll values during dice commit
let finalRoll = ["none", "none", "none", "none", "none"];

// variable for tracking roll attempts in rollDice() function
let rollsLeft = 3;

// for mood and swoon-o-meter tracking (out of seven for now)
let moodLevel = 0;
let swoonLevel = 0;

// variables for tracking which date we're on plus scene/choices
let dateChosen = null; // will only be movieDate for now
let sceneIndex = 0;
let choiceMade = null;

// variable to track overall date score (counting array in func)
let dateScore = 0;

/* ----------------------------------------------------------- */
/* ----------------------- Date Events ----------------------- */
/* ----------------------------------------------------------- */

// this is where the HTML/text for the date flow(s) will go.

// array of objects for movie date, to be used by advance
const movieDate = [
	{
		type: "intro",
		text: 'You arrive at the Cineplex to find your date waiting. They smile lightly when they see you, fidgeting in place. It looks like they\'re nervous. Maybe it\'s a good sign?\n\n"Nice to meet you," they say. You awkwardly make small talk as you walk into the building.\n\n(Press "Next" to continue)',
		choices: false, // to determine which flex is showing
	},
	{
		type: "event",
		text: 'Nervously, they ask you what kind of movie you\'d like to see. You look up at the "Now Playing" board.',
		choices: true,
		funny: 'Choose the romantic comedy "Falling for Autumn"',
		clever: 'Choose the oscar-bait drama "A Palace of Glass"',
		sweet: 'Choose the animated family movie "The Hog Prince"',
	},
	{
		type: "resolve",
		funny: 'You choose "Falling for Autumn", looks funny!',
		clever: 'You choose "A Palace of Glass", looks intense!',
		sweet: 'You choose "The Hog Prince", looks cute!',
		bad: "Your date seems mildly disappointed, but politely accepts your idea.",
		med: 'Your date smiles and says "Oh yeah, I\'ve heard good things about this one."',
		good: "Your date's face lights up! They say \"I've really been wanting to see this one!\"",
		post: "You buy the tickets and move over to the concession line.",
		choices: false,
	},
	{
		scene: "event",
		text: "",
		choices: true,
		funny: "",
		clever: "",
		sweet: "",
	},
	{
		scene: "resolve",
		bad: "",
		med: "",
		good: "",
		choices: false,
	},
	{
		scene: "event",
		text: "",
		choices: true,
		funny: "",
		clever: "",
		sweet: "",
	},
	{
		scene: "resolve",
		bad: "",
		med: "",
		good: "",
		choices: false,
	},
];

/* DATE IDEAS
- At The Movies
- Picnic In The Park
- Hiking Trail Romance
- Roller Skating Rink
- Miniature Golf Course
- Out To A Fancy Dinner
- Dancing At A Club
- Going To A Concert
- Quiet Night At Home
*/

/* ----------------------------------------------------------- */
/* ------------------------ Functions ------------------------ */
/* ----------------------------------------------------------- */

// function to  dynamically switch current face to locked and back
// args -> (ref'd image URL, which die in action window, html Id)
const switchFace = (faceImg, dieNumber, trayIndex) => {
	// for loop to find the correct object in dieFaces array
	for (face of dieFaces) {
		if (face.locked === faceImg) {
			dieNumber.src = face.unlocked;
			// swaps the state in lockStates array
			lockStates[trayIndex] = "unlocked";
			break;
		} else if (face.unlocked === faceImg) {
			dieNumber.src = face.locked;
			lockStates[trayIndex] = "locked";
			break;
		}
	}
};

// function for elegant handling of dynamic lock button text
const lockUnlock = (lockState) => {
	if (lockState === "Lock") {
		return "Unlock";
	} else {
		return "Lock";
	}
};

// function for applying switchFace() function to lock buttons
const lockDie = (event) => {
	switch (event.target.id) {
		case "lb1":
			event.target.innerText = lockUnlock(event.target.innerText);
			switchFace(die1.src, die1, 0);
			break;
		case "lb2":
			event.target.innerText = lockUnlock(event.target.innerText);
			switchFace(die2.src, die2, 1);
			break;
		case "lb3":
			event.target.innerText = lockUnlock(event.target.innerText);
			switchFace(die3.src, die3, 2);
			break;
		case "lb4":
			event.target.innerText = lockUnlock(event.target.innerText);
			switchFace(die4.src, die4, 3);
			break;
		case "lb5":
			event.target.innerText = lockUnlock(event.target.innerText);
			switchFace(die5.src, die5, 4);
			break;
	}
};

// rolls individual die in rollDice step (grabs/applies random face)
const rollDie = (whichDie) => {
	// Source: https://stackoverflow.com/questions/5915096/
	whichDie.src =
		dieFaces[Math.floor(Math.random() * dieFaces.length)].unlocked;
};

// THE ABOVE FUNCTION CAN HAVE ITS OWN ARRAY BASED ON USER ANSWERS, I.E. DIFFERENT DICE WEIGHTING

// function for rolling unlocked dice (contains rollDie function)
const rollDice = () => {
	if (rollsLeft > 0) {
		let currentIndex = 0;
		for (state of lockStates) {
			if (state === "unlocked") {
				rollDie(allDice[currentIndex]);
			}
			currentIndex++;
		}
		rollsLeft--;
		rollButton.innerText = `Roll the dice! (${rollsLeft} Remaining)`;
	}
	// adds back button listeners after one roll (remove them after pressing commit button, so you can't roll during interim)
	commitButton.innerText = "Make your move! (Commit Dice)";
	lockButtons.addEventListener("click", lockDie);
	commitButton.addEventListener("click", resetActionWindow);
};

// function for restoring default values to action window
const resetActionWindow = () => {
	// for loop that resets lock buttons to og state
	for (lb of ["lb1", "lb2", "lb3", "lb4", "lb5"]) {
		document.getElementById(lb).innerText = "Lock";
	}

	// resets variables used in dice rolling to og states
	lockStates = ["unlocked", "unlocked", "unlocked", "unlocked", "unlocked"];
	finalRoll = ["none", "none", "none", "none", "none"];
	rollsLeft = 3;

	// resets dice tray images back to og unlocked state
	for (die of allDice) {
		for (face of dieFaces) {
			if (face.locked === die.src) {
				die.src = face.unlocked;
			}
		}
	}

	// resets text of action buttons to og state
	rollButton.innerText = "Roll the dice! (3 Remaining)";
	commitButton.innerText = "Make your move! (Must Roll First)";

	// removes lock & commit functionailty until next roll is made
	lockButtons.removeEventListener("click", lockDie);
	commitButton.removeEventListener("click", resetActionWindow);
};

// function to add hearts to either date mood or swoon-o-meter
const addHeart = (meterElement, heartLevel) => {
	if (heartLevel < 7) {
		// creates meter heart element, adds src/id, appends to meter
		const heartIcon = document.createElement("img");
		heartIcon.src = "images/heart-icon-white.png";
		heartIcon.id = "meter-heart";
		meterElement.appendChild(heartIcon);
		if (meterElement === moodMeter) {
			moodLevel++;
		} else if (meterElement === swoonMeter) {
			swoonLevel++;
		}
	}
};

// function for committing the dice and scoring the roll
// once this is done, resetActionWindow func will nest at the end
/* const commitDice = () => {} */

// function for displaying story buttons (parameter = 1-3)
const showStoryButtons = (amount) => {
	// sets everything to invisible for a baseline
	storyButtonBox.style.display = "none";
	for (button of storyButtons) {
		button.style.display = "none";
	}

	// if amount is at least 1, box and buttons become visible
	if (amount > 0) {
		storyButtonBox.style.display = "flex";
		let buttonIndex = 0;
		for (button of storyButtons) {
			button.style.display = "block";
			buttonIndex++;
			if (buttonIndex === amount) {
				break;
			}
		}
	}
};

// function for getting you from intro screen to date flow
const getMatched = () => {
	storyPrompt.innerText =
		"You've been matched with Alex! They are 5'8\" with sandy blone hair. They're a professional dog walker, enjoy italian food and have an expansive vinyl record collection. When asked if they prefer Saturdays or Sundays, they said \"Both? Haha ;)\" We think you two will hit it off!\n\nAnd would you look at that! They've agreed to meet you for a date!\n\nWhich date would you like to go on?";

	// removes previous function from button and shows all three
	storyButton1.removeEventListener("click", getMatched);
	showStoryButtons(3);

	// set button text to match available date options
	// the choice can matter later, but focus on movie for now
	storyButton1.innerText = "See a movie!";
	storyButton2.innerText = "(Under Construction)";
	storyButton3.innerText = "(Under Construction)";

	// adds a startDate function to each (func will read target)
	for (button of storyButtons) {
		button.addEventListener("click", startDate);
	}
};

const startDate = (event) => {
	// reemoves previous listeners
	for (button of storyButtons) {
		button.removeEventListener("click", startDate);
	}

	// sets starting state of new date (more can be added later)
	switch (event.target.innerText) {
		case "See a movie!":
			dateChosen = movieDate;
			storyPrompt.innerText = movieDate[0].text;
			showStoryButtons(1);
			storyButton1.innerText = "Next";
			break;
	}
};

// function to advance the scene
const advanceScene = (event, whichDate) => {
	if (event.target.innerText === "Next") {
		sceneIndex++;
	}
};

/* ----------------------------------------------------------- */
/* ------- Un-Nested Event Listeners & Called Functions ------ */
/* ----------------------------------------------------------- */

// event listeners for action window
rollButton.addEventListener("click", rollDice);

// event listener for starting date
storyButton1.addEventListener("click", getMatched);
