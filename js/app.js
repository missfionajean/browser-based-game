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

// I wanted to event bubble the dice cache, but this was way easier
const die1 = document.querySelector("#d1");
const die2 = document.querySelector("#d2");
const die3 = document.querySelector("#d3");
const die4 = document.querySelector("#d4");
const die5 = document.querySelector("#d5");

// caches lock button bar to make them interactive
const lockButtons = document.querySelector("#lock-buttons");

// function to  dynamically switch current face to locked and back
// args -> (ref'd image URL, which die in action window, html Id)
const switchFace = (faceImg, dieNumber) => {
	// for loop to find the correct object in dieFaces array
	for (die of dieFaces) {
		if (die.locked === faceImg) {
			dieNumber.src = die.unlocked;
			break;
		} else if (die.unlocked === faceImg) {
			dieNumber.src = die.locked;
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
			switchFace(die1.src, die1);
			break;
		case "lb2":
			event.target.innerText = lockUnlock(event.target.innerText);
			switchFace(die2.src, die2);
			break;
		case "lb3":
			event.target.innerText = lockUnlock(event.target.innerText);
			switchFace(die3.src, die3);
			break;
		case "lb4":
			event.target.innerText = lockUnlock(event.target.innerText);
			switchFace(die4.src, die4);
			break;
		case "lb5":
			event.target.innerText = lockUnlock(event.target.innerText);
			switchFace(die5.src, die5);
			break;
	}
};

lockButtons.addEventListener("click", lockDie);
