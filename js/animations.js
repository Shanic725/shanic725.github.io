// Intro
class TextScramble {
	constructor(el, start = 'Math.floor(Math.random() * 40)', end = 'Math.floor(Math.random() * 40)') {
		this.el = el;
		this.last = 0;
		this.update = this.update.bind(this);
		this.start = start;
		this.end = end;
	}
	setText(newText, oldText = this.el.textContent) {
		const length = Math.max(oldText.length, newText.length);
		const promise = new Promise((resolve) => this.resolve = resolve);
		this.queue = [];
		for (let i = 0; i < length; i++) {
			const from = oldText[i] || ''
			const to = newText[i] || ''
			const start = eval(this.start);
			const end = start + eval(this.end);
			this.queue.push({
				from,
				to,
				start,
				end
			})
		}
		cancelAnimationFrame(this.frameRequest)
		this.frame = 0
		this.update()
		return promise
	}
	letterScramble(iterations) {
		if (iterations >= 0) {
			requestAnimationFrame(() => this.letterScramble(iterations));
		}
	}
	update() {
		let output = ''
		let complete = 0
		for (let i = 0, n = this.queue.length; i < n; i++) {
			let {
				from,
				to,
				start,
				end,
				char
			} = this.queue[i]
			if (this.frame >= end) {
				complete++
				output += to
			} else if (this.frame >= start) {
				if (!char || Math.random() < 0.28) {
					char = this.randomChar()
					this.queue[i].char = char
				}
				output += `<span class="glitch">${char}</span>`
			} else {
				output += from
			}
		}
		this.el.innerHTML = output
		if (complete === this.queue.length) {
			this.resolve()
		} else {
			this.frameRequest = requestAnimationFrame(this.update)
			this.frame++
		}
	}
	randomChar() {
		return String.fromCharCode(0x0041 + Math.random() * (0x005A - 0x0041 + 1));
	}
}

//Animations Class
class Animations {
	constructor(phrases, el) {
		this.phrases = phrases;
		this.el = el;
		this.fx = new TextScramble(this.el);
		this.counter = 0;
	}
	setText(start = this.fx.el.textContent) {
		return this.fx.setText(this.phrases[this.counter], start);
	}
	next() {
		this.counter++;
		this.setText();
	}
	previous() {
		this.counter--
		this.setText();
	}
}
//Animations Class for Intro part
class Intro extends Animations {
	next() {
		playSE('audio/click1.ogg', seVolume);
		super.next();
		if (this.counter === 1) document.getElementById("previous").removeAttribute("disabled");
		if (this.counter + 1 === this.phrases.length) {
			document.getElementById("next").setAttribute("disabled", "");
			document.getElementById("accept").classList.remove("d-none");
		}

	}
	previous() {
		playSE('audio/click1.ogg', seVolume);
		if (this.counter === this.phrases.length - 1) {
			document.getElementById("next").removeAttribute("disabled");
			document.getElementById("accept").classList.add("d-none");
		}
		super.previous();
		if (this.counter === 0) document.getElementById("previous").setAttribute("disabled", "");

	}
	accept() {
		playSE('audio/click1.ogg', seVolume);
		changeAudio(bgm, 'audio/bgm2.ogg', bgmVolume);
		anime({
			targets: '#welcome, #goddess',
			opacity: 0,
			easing: 'easeInOutSine',
			complete: () => {
				document.getElementById("welcome").classList.add("d-none")
				document.getElementById("goddess").classList.add("d-none")
				document.getElementById("unwelcome").classList.remove("d-none");
				anime({
					targets: '#unwelcome',
					opacity: 1,
					easing: 'easeInOutSine'
				});
			}
		});
	}
}

// ——————————————————————————————————————————————————
// 1st scramble (and probably only one)
// ——————————————————————————————————————————————————
const koharu = "<span class='glitch'>Koharu Yakumo</span>"
const phrases = [
	`...-ell it seems like your conciousness is still in tact... 
	Hello, I am ${koharu}, and sorry about bothering you, but, uh.. well, you're dead, and we're technically responsible for it...`,
	`You see, a member of our "Organization," has a bad habit of destroying worlds that slightly inconvenience her without checking any of our prior paperwork. <br><br>In this case, your world was apparently marked for observation, because of... well, you.`,
	`You're one of a very, very select few that... let's say has "the potential" to become an Observer; a person who is cognizant of the boundaries between the different conceptual and meta-conceptual aspects of reality.<br><br>Originally, we were hoping to contact you when that "potential" was starting to grow and develop, but considering... well, the current circumstances, we had to step in.`,
	`Now… while we still want to potentially bring you on... we can't exactly hire you as a raw shard of a soul, so we're gonna have to fix your situation.<br><br>We'll have to make you a new body and an environment for your fragmented soul to gradually heal and develop in.`, 
	`Another thing is... the one in charge of documenting your world, ended up forgetting to document anything beyond... well, that you exist.<br><br>So… hey... free slate to make the world you want to live in... I guess...`,
	`Just keep in mind that we have a bit of a budget here, all of this is requiring us to call in a lot of favors, and that's gonna end up costing a lot of Macca.<br><br>Macca is the currency of the dead, and a loooot of places outside normal realities use it as a type of default currency, and in this case, our budget for this whole project.`,
	`But, that being said, if you're willing to take on a few challenges, maybe take care of some problems we'd need dealt with, it should free up more Macca to spend elsewhere.<br><br> Think of it as a "Hard Earned Karmic Currancy" in a sense.`,
	`So, with all that out of the way, it's up to you if you wanna take the offer or not. I can't promiss this will be the smoothest transitions for you, but it might be better than letting you just reincarnate in your current state.`
]
const intro = new Intro(phrases, document.getElementById('intro'));

document.getElementById("next").onclick = () => intro.next();
document.getElementById("previous").onclick = () => intro.previous();
document.getElementById("accept").onclick = () => intro.accept();

// ——————————————————————————————————————————————————
// 2nd scramble (it turns out I was wrong)
// ——————————————————————————————————————————————————
class World extends Animations {
	constructor(el, old, worldLines) {
		super('World Simulation 1.342', el);
		this.old = old;
		this.fx = new TextScramble(el, 'i + Math.floor(Math.random() * 20)', '1 + Math.floor(Math.random() * 20)');
		this.serialNumber = "";
		this.worldLine = 0;
		this.worldLines = worldLines;
		this.phrases = [
			`Initializing Multiverse Simulation...`,
			`Quantum Entanglement Stabilized...`,
			`Parsing Akashic Records...`,
			`Synchronizing Karmic Database...`,
			`Mana Reservoirs Allocated...`
		];
	}

	// Generate a random serial number
	randomSerial() {
		const serialNumber = [];
		let i = 0;
		serialNumber.push("1." + Math.floor(Math.random() * 1000000) + "e+" + Math.floor(Math.random() * 10000));
		i++;
		return serialNumber.toString();
	}

	// Automatically update text based on the given interval
	auto(maxInterval = 800) {
		const max = maxInterval;
		const interval = Math.floor(Math.random()*max + 200);
		this.setText('').then(() => {
			if (this.counter === this.phrases.length - 1) {
				this.worldLine = Math.floor(Math.random() * (this.worldLines.length - 1));
				this.serialNumber = this.randomSerial();
				this.phrases = this.worldLines[this.worldLine].map((str) => str.replaceAll('${serialNumber}', this.serialNumber).replaceAll('${altNumber}', this.randomSerial()));
				this.counter = 0;
			} else {
				this.counter++;
			}

			setTimeout(() => {
				for (let i = this.old.length - 1; i >= 0; i--) {
					const old = this.old[i];
					old.textContent = i === 0 ? this.el.textContent : this.old[i - 1].textContent;
				}
				this.auto(max);
			}, interval);
		});
	}
}
const programming = document.getElementsByClassName('programming-old');
let margin = 1.2;
let color = 0x000000aa;
for (let i = 0; i < programming.length; i++) {
	programming[i].style= `margin-bottom: ${margin}rem !important; color: #${color.toString(16)} !important`;
	margin += 0.9;
	color -= 0x33;
}
const consoleOutputFromFile = async (url) => {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			return;
		}
		const fileContent = await response.text();
		const lines = fileContent.replaceAll('\r', '').split('\n');
		let formated = [
			[]
		];
		let group = 0;
		for (const line of lines) {
			if (line === '') {
				group++;
				formated.push([]);
			} else formated[group].push(line);
		}
		const worldScramble = new World(document.getElementById('programming-gibberish'), document.getElementsByClassName('programming-old'), formated);
		worldScramble.auto(800);
	} catch (error) {
		console.error('Error:', error);
	}
}
consoleOutputFromFile('data/console.txt').then();
//collapsing categories
const collapseCategory = (category) => {
	const toCollapse = category.nextElementSibling;
	if (toCollapse.classList.contains("animating")) {
		playSE('audio/error.ogg', seVolume);
		return;
	}
	toCollapse.classList.add("animating");
	playSE('audio/click1.ogg', seVolume);
	const toCollapseAttribute = toCollapse.getAttribute("data-height");
	const toCollapseHeight = toCollapseAttribute ? toCollapseAttribute : toCollapse.offsetHeight.toString() + 'px';
	const toFade = toCollapse.children;
	toCollapse.setAttribute("data-height", toCollapseHeight);
	if (!toCollapse.classList.contains("collapsed")) {
		toCollapse.classList.add("collapsed");
		anime({
			targets: toCollapse,
			keyframes: [
				{height: 0},
				{scaleX: 0.5}
			],
			height: 0,
			easing: 'easeInOutExpo',
			duration: 500
		});
		anime({
			targets: toFade,
			opacity: 0,
			easing: 'easeInOutExpo',
			duration: 500,
			complete: () => {
				toCollapse.classList.remove("animating");
				for (let element of toFade){
					element.classList.add("d-none");
				}
			}
		})
		anime({
			targets: category,
			boxShadow: "0rem -2.5rem 2.0rem -2.5rem rgba(0,0,0,0.25) inset",
			borderRadius: ".375rem",
			easing: 'easeInOutExpo',
			duration: 500
		})
	}
	else {
		toCollapse.classList.remove("collapsed");
		toCollapse.removeAttribute("data-height");
		anime({
			targets: toCollapse,
			keyframes: [
				{scaleX: 1},
				{height: toCollapseHeight}
			],
			easing: 'easeInOutExpo',
			duration: 500,
			complete: () => {
				toCollapse.classList.remove("collapsed", "animating");
				toCollapse.removeAttribute("data-height");
				toCollapse.removeAttribute("style");
			}
		});
		for (let element of toFade){
			element.classList.remove("d-none");
		}
		anime({
			targets: toFade,
			opacity: 1,
			easing: 'easeInOutExpo',
			duration: 500
		})
		anime({
			targets: category,
			boxShadow: "0rem -2.5rem 2.0rem -2.5rem rgba(0,0,0,0.75) inset",
			borderRadius: ".375rem .375rem 0 0",
			easing: 'easeInOutExpo',
			duration: 500,
			complete: () => category.removeAttribute("style")
		})
	}
}