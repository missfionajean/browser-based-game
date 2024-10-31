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

// cached elements for main game window (upper box)
const gameWindow = document.querySelector("#game-window");
const storyPrompt = document.querySelector("#prompt");
const storyButtons = document.querySelector("#choices");

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

// defining current URL path for proper image finding
const currentURL = window.location.href;

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

/* // Source: https://stackoverflow.com/questions/14446447/
const updateGameWindow = (fileName) => {
	// .fetch() is a method of window (i.e. this browser view)
	window
		// selects file -> grabs contents -> puts in gameWindow
		.fetch(fileName)
		.then((response) => response.text())
		.then((text) => {
			gameWindow.innerHTML = text;
		});
};
 */

// function for committing the dice and scoring the roll
// once this is done, resetActionWindow func will nest at the end
/* const commitDice = () => {} */

// event listeners for action window
rollButton.addEventListener("click", rollDice);
