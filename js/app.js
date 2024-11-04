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

// general cached elements for main game window (upper box)
const gameWindow = document.querySelector("#game-window");
const storyPrompt = document.querySelector("#prompt");

// cached elements for story buttons (next, choose date, etc)
const storyButtonBox = document.querySelector("#choice-box");
const storyButton1 = document.querySelector("#ch1");
const storyButton2 = document.querySelector("#ch2");
const storyButton3 = document.querySelector("#ch3");

// to manipluate content and display of three reactions
const reactionBox = document.querySelector("#reaction-box");
const funnyReaction = document.querySelector("#funny-re");
const cleverReaction = document.querySelector("#clever-re");
const sweetReaction = document.querySelector("#sweet-re");

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

// variable for tracking roll attempts in rollDice() function
let rollsLeft = 3;
let practice = true;

// for mood and swoon-o-meter tracking (out of seven for now)
let moodLevel = 0;
let swoonLevel = 0;

// variables for tracking which date we're on plus scene/choices
let dateChosen = null; // will only be movieDate for now
let sceneIndex = 0;
let choiceMade = "funny";
let dateOpinion = "bad";

// variable to track overall date score (counting array in func)
let dateScore = 0;
let moodTracker = 0;

/* ----------------------------------------------------------- */
/* ----------------------- Date Events ----------------------- */
/* ----------------------------------------------------------- */

// this is where the HTML/text for the date flow(s) will go.

// array of objects for movie date, to be used by advance
const movieDate = [
	{
		type: "intro",
		text: 'You arrive at the Cineplex to find your date waiting. They smile lightly when they see you, fidgeting in place. It looks like they\'re nervous. Maybe it\'s a good sign?\n\n"Nice to meet you," they say. You awkwardly make small talk as you walk into the building.\n\n(Press "Next" to continue)',
	},
	{
		type: "event",
		text: 'Nervously, they ask you what kind of movie you\'d like to see. You look up at the "Now Playing" board.\n\nWhat do you do? (Roll and click "Make your move!" to continue)',
		choices: true, // to determine which flex is showing
		funny: 'Choose the romantic comedy "Falling for Autumn"',
		clever: 'Choose the oscar-bait drama "A Palace of Glass"',
		sweet: 'Choose the animated family movie "The Hog Prince"',
	},
	{
		type: "resolve",
		funny: 'You choose "Falling for Autumn", it looks funny!',
		clever: 'You choose "A Palace of Glass", it looks intense!',
		sweet: 'You choose "The Hog Prince", it looks cute!',
		bad: "\n\nYour date seems mildly disappointed, but politely accepts your idea.",
		med: '\n\nYour date smiles and says "Oh yeah, I\'ve heard good things about this one."',
		good: "\n\nYour date's face lights up! They say \"I've really been wanting to see this one!\"",
		post: '\n\nYou buy the tickets and head toward the consession counter. You and your date chat idly as you approach an empty line. They say "Don\'t you love it when you don\'t have to wait? Feels like winning the timing lottery." You both chuckle. Their laugh is infectious. As they talk about work, their eyes seem to sparkle. You almost forget where you are for a moment. "What do you do for work?" they ask. You babble out the broad details, but...',
		choices: false,
	},
	{
		type: "event",
		text: 'Suddenly, a man talking on a cell phone shoves in front of you right as you reach the counter. He doesn\'t even look at you. Your date looks quite annoyed.\n\nWhat do you do? (Roll and click "Make your move!" to continue)',
		choices: true,
		funny: 'Say "Ah, that must be Mr Movie. Here on very important business."',
		clever: "Spy another cashier opening their register and pull your date over.",
		sweet: "Tell the man you were there first and he has to wait his turn.",
	},
	{
		type: "resolve",
		funny: "You make light of the situation, suggesting this will just give you more time to talk.",
		clever: "You grab your date's arm and slide over to the new register quick as a flash!",
		sweet: "You stand up for your date! The cashier glares at the man and he sheepishly backs down.",
		bad: '\n\n"Uh... Okay." your date says. Their voice sounds dejected. Maybe that wasn\'t so smooth.',
		med: "\n\nYour date laughs it off and falls back into conversation with you. Not too shabby!",
		good: "\n\nRelief washes over their face. A blush fills their cheeks as you two continue to flirt. Nice!",
		post: '\n\nTwo minutes later, you\'re off to the theatre with two sodas and a popcorn bag in hand! In the dark of the theatre, you both sidle into a pair of seats in the back row. As you sit down, your hand incidentally bumps theirs. They break the tension by saying "Check this out!" They toss a piece of popcorn up and it bounces anti-climactically off their forehead. You take turns attempting to catch them until the movie starts.',
		choices: false,
	},
	{
		type: "event",
		text: 'As the movie plays, your eyes keep drifting over to your date. Did they just look at you, too? Distracted, you reach for the popcorn right as they do. Your hands touch again!\n\nWhat do you do? (Roll and click "Make your move!" to continue)',
		choices: true,
		funny: 'Pretend your hand is a shark and "chomp" on theirs with a smile',
		clever: 'Whisper "Great minds think alike..." and nudge them playfully.',
		sweet: "Grab their hand and hold it gently - no words needed right now.",
	},
	{
		type: "resolve",
		funny: 'You quietly hum the "Jaws" theme and nip at their hand. They let out a surprised gasp.',
		clever: "You compliment your date. They nod with a small smile, fishing more popcorn.",
		sweet: "You take fate by the... well... hand. They look over, the light of the movie reflecting in their eyes.",
		bad: "\n\nThey politely withdraw their hand with a small chuckle. You both adjust back into your separate seats.",
		med: "\n\nThey hold your hand for a few scenes. The movie plays out and you chat with your date about it afterward.",
		good: "\n\nThey interlace their fingers with yours and don't let go, leaning against you until the lights come up.",
		post: '\n\nWhen the credits have finished rolling and the popcorn has either been eaten or dropped to the floor, you both stand and make your way out to the lobby once more. You ask them what they\'re looking for in a partner and they say "I guess I want someone who accepts me exactly as I am. Someone I can sit and watch movies with until we get old. And you?" You detail your ideal romance until you find yourselves standing outside the Cineplex.',
		choices: false,
	},
	{
		type: "swoon",
		mild: "Your Swoon-O-Meter is full!\n\nYou shuffle slightly, unsure how to say goodbye. You feel like the date went well enough, but you're wondering if there's truly a spark. Your eyes wander over to find your date apparently locked in the same thought. They take a hesitant step toward you and place their hands on your waist. You both lean in slowly until your lips brush, sending a shiver through your body. They kiss you gently until their phone alarm goes off.\n\n\"Gotta get home and feed the dogs.\" they say. They offer you a small smile as they step away.",
		hot: 'Your Swoon-O-Meter is full!\n\nYou yawn and stretch, shaking off the stiffness of sitting for two hours. You turn to find your date watching you. "It was a good movie," they say. You take an unconscious step closer until you\'re less than a foot away. Your date closes the gap and finds your lips with theirs. You explore each other\'s mouths thoroughly, bodies pressing tighter against each other. The moment is finally interrupted by the chime of a phone alarm.\n\n"Gotta get home and feed the dogs." they say. They offer you a warm smile and linger slightly before separating their body from yours.',
		spicy: "Your Swoon-O-Meter is full!\n\nIt doesn't take long at all for your date's hands to find your body out on the sidewalk. It's clear that the heat you felt between the two of you wasn't just one-sided! Within seconds, your hands are desperately pulling them closer. Their fingertips dig into your hips and you sink deeply into the kiss. Time slips by in a haze, until you are snapped back to reality by the ringing of a phone alarm.\n\n\"Gotta get home and feed the dogs.\" they say. However, they don't move from your embrace. Their eyes stay locked on yours for an impossibly long moment before they finally take a step back.",
		choices: false,
	},
	{
		type: "end",
		bad: '"Thanks for the movie," your date says. Unsure how to cap off the night, they offer you a polite handshake. You return it and the two of you walk in separate directions back the way you came. Nothing ventured, nothing gained, huh? At least it was a good movie.\n\nTough luck! You didn\'t earn a second date this time. But, you can always try again! Thanks for playing Swoon!',
		med: '"Thanks for a fun night," your date says with a slight yawn. "Looking forward to the next one!" They wander off, leaving you with butterflies in your stomach. "Next time you pick the movie!" you shout after them. They nod playfully and head home.\n\nCongratulations! You\'ve earned a second date. Thanks for playing Swoon!',
		good: '"This was a wonderful night..." your date says, trailing off. Their eyes wander down your body. There is a tension in the air that you could cut with a knife. You take a step to close the distance between you.\n\n"Who says it has to end...?" you ask. They smile devilishly and beckon you to follow them home.\n\nCongratulations! You\'ve earned a second date. And it looks like this one isn\'t over. Go get \'em, tiger! Thanks for playing Swoon!',
		choices: false,
	},
];

/* DATE IDEAS
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
		if (practice) {
			rollButton.innerText = `Practice rolling! (${rollsLeft} Remaining)`;
		} else {
			rollButton.innerText = `Roll the dice! (${rollsLeft} Remaining)`;
		}
	}
	// adds listeners back after roll (and scoring if appropriate)
	if (practice === false) {
		commitButton.addEventListener("click", commitDice);
	}
	// updates text, allows dice locking, committ resets dice state
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
	rollButton.innerText = "Practice rolling! (3 Remaining)";
	commitButton.innerText = "Make your move! (Must Roll First)";

	// removes lock & commit functionailty until next roll is made
	lockButtons.removeEventListener("click", lockDie);
	commitButton.removeEventListener("click", resetActionWindow);
};

// function to add hearts to either date mood or swoon-o-meter
const addHeart = (meterElement, heartLevel) => {
	if (heartLevel < 5) {
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

// function for scoring the current state of the dice
const scoreDice = () => {
	// array of objects that will be used in die face counting
	const faceCount = [
		{ choice: "funny", count: 0 },
		{ choice: "clever", count: 0 },
		{ choice: "sweet", count: 0 },
	];

	// iterates through dice and banks the count in faceCount obj
	for (die of allDice) {
		if (die.src.includes("laugh")) {
			faceCount[0].count += 1;
		} else if (die.src.includes("brain")) {
			faceCount[1].count += 1;
		} else if (die.src.includes("rose")) {
			faceCount[2].count += 1;
		} else if (die.src.includes("heart")) {
			addHeart(swoonMeter, swoonLevel);
			dateScore += 40;
		}
	}

	// grabs the max value and finds + banks number/choice
	let maxFace = 0;
	for (face of faceCount) {
		if (face.count > maxFace) {
			maxFace = face.count;
			choiceMade = face.choice;
		}
	}

	// calculates total score of event and updates total score
	let eventScore = maxFace * 100;
	dateScore += eventScore;
	moodTracker += eventScore;

	// uses switch trickle-down to set dateOpinion based on score
	switch (eventScore) {
		case 100:
			dateOpinion = "bad";
			break;
		case 200:
		case 300:
			dateOpinion = "med";
			break;
		case 400:
		case 500:
			dateOpinion = "good";
			break;
	}
};

// function for committing the dice and scoring the roll
const commitDice = () => {
	// scores dice and adjusts progress meters
	scoreDice();

	// while loop adds hearts based on new point earnings (saving remainder)
	while (moodTracker >= 200) {
		addHeart(moodMeter, moodLevel);
		moodTracker -= 200;
	}

	/*
	Calculating score intervals:
	date min score - 300 (100 per event with no swoon)
	date max score - 2100 (500 per event with 600 point swoon)
	median score with no swoon - 900
	median score overall - 1200
	threshhold to get a second date - 1000 / 4 hearts (for now)
	*/

	// prevents banking of points between scenes without taking away roll practice
	commitButton.removeEventListener("click", commitDice);

	// resets practice state to display correct text in roll button
	practice = true;

	// moves to next scene after calculations are done
	resetActionWindow();
	advanceScene();
};

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
			storyPrompt.innerText = dateChosen[0].text;
			showStoryButtons(1);
			storyButton1.innerText = "Next";
			storyButton1.addEventListener("click", advanceScene);
			break;
	}
};

// page reloading function, since we're not storing data right now
const pageReload = () => {
	location.reload();
};

// function to advance the scene
const advanceScene = () => {
	// moves forward in date array every time we advance
	sceneIndex++;
	console.log(dateScore)

	// put an if statement here to add +1 to index if swoon not acheieved (skips it)
	if (dateChosen[sceneIndex].type === "swoon") {
		if (swoonLevel < 5) {
			sceneIndex++;
		} else {
			if (dateScore >= 1000) {
				storyPrompt.innerText = dateChosen[sceneIndex].spicy;
			} else if (dateScore >= 800) {
				storyPrompt.innerText = dateChosen[sceneIndex].hot;
			} else {
				storyPrompt.innerText = dateChosen[sceneIndex].mild;
			}
		}
	}

	// displays dynamic text depending on scene type
	if (dateChosen[sceneIndex].type === "resolve") {
		// shows the choice that was committed
		switch (choiceMade) {
			case "funny":
				storyPrompt.innerText = dateChosen[sceneIndex].funny;
				break;
			case "clever":
				storyPrompt.innerText = dateChosen[sceneIndex].clever;
				break;
			case "sweet":
				storyPrompt.innerText = dateChosen[sceneIndex].sweet;
				break;
		}

		// show date's reaction depending on roll point value
		switch (dateOpinion) {
			case "bad":
				storyPrompt.innerText += dateChosen[sceneIndex].bad;
				break;
			case "med":
				storyPrompt.innerText += dateChosen[sceneIndex].med;
				break;
			case "good":
				storyPrompt.innerText += dateChosen[sceneIndex].good;
				break;
		}

		// finally, adds post-text to prompt
		storyPrompt.innerText += dateChosen[sceneIndex].post;

		// if end of date, points are tallied for dynamic text
	} else if (dateChosen[sceneIndex].type === "end") {
		// sets up reset function
		storyButton1.addEventListener("click", pageReload);
		storyButton1.innerText = "Restart app?";
		// displays dynamic ending based on final score
		if (dateScore >= 1000) {
			storyPrompt.innerText = dateChosen[sceneIndex].good;
		} else if (dateScore >= 8000) {
			storyPrompt.innerText = dateChosen[sceneIndex].med;
		} else {
			storyPrompt.innerText = dateChosen[sceneIndex].bad;
		}
	} else if (
		dateChosen[sceneIndex].type === "intro" ||
		dateChosen[sceneIndex].type === "event"
	) {
		storyPrompt.innerText = dateChosen[sceneIndex].text;
	}

	// determines which div needs to be showing and updates them
	if (dateChosen[sceneIndex].choices) {
		showStoryButtons(0);
		reactionBox.style.display = "flex";
		funnyReaction.innerText = dateChosen[sceneIndex].funny;
		cleverReaction.innerText = dateChosen[sceneIndex].clever;
		sweetReaction.innerText = dateChosen[sceneIndex].sweet;
		resetActionWindow();
		practice = false;
		rollButton.innerText = "Roll the dice! (3 Remaining)";
	} else {
		reactionBox.style.display = "none";
		showStoryButtons(1);
	}
};

/* ----------------------------------------------------------- */
/* ------- Un-Nested Event Listeners & Called Functions ------ */
/* ----------------------------------------------------------- */

// event listeners for action window
rollButton.addEventListener("click", rollDice);

// event listener for starting date
storyButton1.addEventListener("click", getMatched);
