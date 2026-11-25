const SIZE = 3;
const CELL_COUNT = SIZE ** 3;
const CENTER = (SIZE - 1) / 2;
const CLICK_TOLERANCE_PX = 6;

const puzzle = JSON.parse(document.getElementById("puzzle-data").textContent);
const board = puzzle.board;
const storageKey = "word-cube-" + board;

// Клетка i = x + 3*y + 9*z; z = 0 — верхний слой.
const cells = Array.from({ length: CELL_COUNT }, (_, i) => ({
	x: i % SIZE,
	y: Math.floor(i / SIZE) % SIZE,
	z: Math.floor(i / SIZE ** 2),
}));

function isAdjacent(a, b) {
	const p = cells[a];
	const q = cells[b];
	return a !== b && Math.max(Math.abs(p.x - q.x), Math.abs(p.y - q.y), Math.abs(p.z - q.z)) <= 1;
}

const neighbours = cells.map((_, a) => cells.map((_, b) => b).filter(b => isAdjacent(a, b)));

/**
 * Перебирает все способы выложить слово по соседним клеткам и вызывает onPath для каждого.
 * Если onPath вернёт true, перебор останавливается, и функция возвращает true.
 */
function forEachPath(word, onPath) {
	const path = [];
	function extend(cell) {
		if (board[cell] !== word[path.length] || path.includes(cell)) return false;
		path.push(cell);
		const stop = path.length === word.length ? onPath(path) : neighbours[cell].some(extend);
		path.pop();
		return Boolean(stop);
	}
	return cells.some((_, cell) => extend(cell));
}

const canSpell = word => forEachPath(word, () => true);
const alphabetically = (a, b) => a.localeCompare(b, "ru");

const answers = puzzle.words.filter(canSpell).sort(alphabetically);
const bonusAnswers = (puzzle.bonus_words || []).filter(canSpell);

let found = loadFound();
let selection = [];
let repeatedWord = "";
let liveCells = replayLiveCells();

function loadFound() {
	try {
		const saved = JSON.parse(localStorage.getItem(storageKey)) || [];
		return saved.filter(word => answers.includes(word) || bonusAnswers.includes(word));
	} catch {
		return [];
	}
}

function saveFound() {
	try {
		localStorage.setItem(storageKey, JSON.stringify(found));
	} catch {
		// прогресс просто не сохранится
	}
}

function cellsOnAnyPath(words) {
	const used = new Set();
	words.forEach(word => forEachPath(word, path => path.forEach(cell => used.add(cell))));
	return used;
}

// Каждое оставшееся слово держит на кубе один свой путь из ещё видимых клеток, остальные клетки исчезают.
// Из нескольких путей слова берём тот, что больше пересекается с уже занятыми клетками.
function shrinkLiveCells(live, remainingWords) {
	const kept = new Set();
	remainingWords.forEach(word => {
		let best = null;
		forEachPath(word, path => {
			if (!path.every(cell => live.has(cell))) return false;
			const overlap = path.filter(cell => kept.has(cell)).length;
			if (!best || overlap > best.overlap) best = { path: [...path], overlap };
			return overlap === path.length;
		});
		best?.path.forEach(cell => kept.add(cell));
	});
	return kept;
}

// Видимые клетки зависят от порядка, в котором находили слова, поэтому при загрузке повторяем его.
function replayLiveCells() {
	let live = cellsOnAnyPath(answers);
	const remaining = [...answers];
	found.forEach(word => {
		if (!remaining.includes(word)) return;
		remaining.splice(remaining.indexOf(word), 1);
		live = shrinkLiveCells(live, remaining);
	});
	return live;
}

const foundAnswers = () => answers.filter(word => found.includes(word));
const remainingAnswers = () => answers.filter(word => !found.includes(word));
const lastSelected = () => selection[selection.length - 1];
const selectedWord = () => selection.map(cell => board[cell]).join("");

function clickCell(cell) {
	if (!liveCells.has(cell)) return;
	if (cell === lastSelected()) {
		selection.pop();
	} else if (selection.includes(cell)) {
		selection = selection.slice(0, selection.indexOf(cell) + 1);
	} else if (selection.length === 0 || isAdjacent(lastSelected(), cell)) {
		selection.push(cell);
	} else {
		selection = [cell];
	}
	repeatedWord = "";
	showMessage("");
	acceptSelectedWord();
	render();
}

function acceptSelectedWord() {
	const word = selectedWord();
	if (found.includes(word)) {
		repeatedWord = word;
		if (!canBeExtended(word)) selection = [];
		return;
	}

	if (bonusAnswers.includes(word)) {
		addFound(word);
		showMessage(`Бонус: ${word}!`, true);
	} else if (answers.includes(word)) {
		addFound(word);
		const cellsBefore = liveCells.size;
		liveCells = shrinkLiveCells(liveCells, remainingAnswers());
		const vanished = cellsBefore - liveCells.size;
		if (foundAnswers().length === answers.length) {
			showMessage(`Все ${answers.length} найдены! Куб пуст.`, true);
		} else {
			showMessage(`Есть: ${word}!` + (vanished ? ` Исчезло букв: ${vanished}.` : ""), true);
		}
	}
}

// Если найденное слово — начало ещё не найденного (куб → кубоид), выделение не сбрасываем, чтобы можно было продолжить.
function canBeExtended(word) {
	return [...answers, ...bonusAnswers].some(other => other !== word && other.startsWith(word) && !found.includes(other));
}

function addFound(word) {
	found.push(word);
	saveFound();
	selection = [];
}

function removeLastLetter() {
	selection.pop();
	repeatedWord = "";
	render();
}

function clearSelection() {
	selection = [];
	repeatedWord = "";
	showMessage("");
	render();
}

function restart() {
	found = [];
	selection = [];
	repeatedWord = "";
	saveFound();
	liveCells = replayLiveCells();
	showMessage("Начали заново.");
	render();
}

const $ = id => document.getElementById(id);

function element(tag, className = "", text = "") {
	const el = document.createElement(tag);
	el.className = className;
	el.textContent = text;
	return el;
}

function showMessage(text, success = false) {
	const message = $("msg");
	message.textContent = text;
	message.classList.toggle("ok", success);
}

function render() {
	renderWord();
	renderLayers();
	renderProgress();
	renderBonus();
	view.update({ selection, liveCells });
}

function renderWord() {
	const word = selectedWord() || repeatedWord;
	const box = $("word");
	box.classList.toggle("empty", !word);
	if (!word) {
		box.textContent = "Выбери первую букву";
	} else if (repeatedWord) {
		box.replaceChildren(word, element("span", "note", " — уже есть!"));
	} else {
		box.textContent = word;
	}
}

function renderLayers() {
	const layers = Array.from({ length: SIZE }, () => element("div", "grid3"));
	cells.forEach(({ z }, cell) => layers[z].append(cellButton(cell)));
	$("layers").replaceChildren(...layers);
}

function cellButton(cell) {
	const button = element("button", "cellbtn");
	if (!liveCells.has(cell)) {
		button.classList.add("gone");
		button.disabled = true;
		button.setAttribute("aria-label", "пусто");
		return button;
	}
	const last = lastSelected();
	const selected = selection.includes(cell);
	button.classList.toggle("sel", selected);
	button.classList.toggle("last", cell === last);
	button.classList.toggle("can", last !== undefined && !selected && isAdjacent(last, cell));
	button.textContent = board[cell];
	button.setAttribute("aria-label", `буква ${board[cell]}, слой ${cells[cell].z + 1}`);
	button.onclick = () => clickCell(cell);
	return button;
}

function renderProgress() {
	const count = foundAnswers().length;
	$("count").textContent = count;
	$("total").textContent = `из ${answers.length}`;
	$("bar").style.width = `${(100 * count) / answers.length}%`;
	$("found").replaceChildren(...answers.map(word => (found.includes(word) ? element("span", "chip", word) : hiddenWordChip(word))));
}

function hiddenWordChip(word) {
	const chip = element("span", "chip slot");
	chip.setAttribute("aria-label", `не найдено, букв: ${word.length}`);
	chip.append(...Array.from(word, () => element("i")));
	return chip;
}

function renderBonus() {
	const words = found.filter(word => bonusAnswers.includes(word)).sort(alphabetically);
	const row = $("bonus");
	row.hidden = words.length === 0;
	row.replaceChildren(element("small", "", "Бонус:"), ...words.map(word => element("span", "chip bonus", word)));
}

function cssColor(name) {
	return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function letterTexture(letter, { background, ink, border }) {
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = 128;
	const ctx = canvas.getContext("2d");

	ctx.beginPath();
	ctx.roundRect(6, 6, 116, 116, 22);
	ctx.fillStyle = background;
	ctx.fill();
	ctx.lineWidth = 5;
	ctx.strokeStyle = border;
	ctx.stroke();

	ctx.fillStyle = ink;
	ctx.font = "600 70px Unbounded, Golos Text, sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(letter.toUpperCase(), 64, 70);

	const texture = new THREE.CanvasTexture(canvas);
	texture.anisotropy = 4;
	return texture;
}

function createCubeView(container, initialSpread, onCellClick) {
	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	const canvas = renderer.domElement;
	container.prepend(canvas);

	const scene = new THREE.Scene();
	scene.add(new THREE.AmbientLight(0xffffff, 0.75));
	const light = new THREE.DirectionalLight(0xffffff, 0.55);
	light.position.set(5, 9, 6);
	scene.add(light);

	const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
	camera.position.set(8.6, 6.2, 10.4);

	const controls = new THREE.OrbitControls(camera, canvas);
	controls.enableDamping = true;
	controls.enablePan = false;
	controls.minDistance = 6;
	controls.maxDistance = 20;

	const sprites = cells.map((_, cell) => {
		const sprite = new THREE.Sprite();
		sprite.scale.set(0.95, 0.95, 1);
		sprite.userData.cell = cell;
		scene.add(sprite);
		return sprite;
	});

	const layerFrames = Array.from({ length: SIZE }, () => {
		const frame = new THREE.LineLoop(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ transparent: true, opacity: 0.5 }));
		scene.add(frame);
		return frame;
	});

	let spread = initialSpread;
	let state = { selection: [], liveCells: new Set() };
	let pathLine = null;

	function layout() {
		sprites.forEach((sprite, cell) => {
			const { x, y, z } = cells[cell];
			sprite.position.set((x - CENTER) * spread, (CENTER - z) * spread, (y - CENTER) * spread);
		});
		const half = (spread * SIZE) / 2;
		layerFrames.forEach((frame, z) => {
			const height = (CENTER - z) * spread;
			frame.geometry.setFromPoints([
				new THREE.Vector3(-half, height, -half),
				new THREE.Vector3(half, height, -half),
				new THREE.Vector3(half, height, half),
				new THREE.Vector3(-half, height, half),
			]);
		});
	}

	function redraw() {
		const { selection, liveCells } = state;
		const last = selection[selection.length - 1];

		sprites.forEach((sprite, cell) => {
			const selected = selection.includes(cell);
			const colors = {
				background: cssColor(selected ? "--sel" : "--cell"),
				ink: cssColor(selected ? "--sel-ink" : "--cell-ink"),
				border: cssColor(cell === last ? "--accent" : "--line"),
			};
			sprite.material.map?.dispose();
			sprite.material.dispose();
			sprite.material = new THREE.SpriteMaterial({ map: letterTexture(board[cell], colors), depthWrite: false });
			sprite.visible = liveCells.has(cell);
		});

		layerFrames.forEach(frame => frame.material.color.set(cssColor("--muted")));

		if (pathLine) {
			scene.remove(pathLine);
			pathLine.geometry.dispose();
			pathLine.material.dispose();
			pathLine = null;
		}
		if (selection.length > 1) {
			const geometry = new THREE.BufferGeometry().setFromPoints(selection.map(cell => sprites[cell].position));
			pathLine = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: cssColor("--accent") }));
			scene.add(pathLine);
		}
	}

	function resize() {
		const { width, height } = container.getBoundingClientRect();
		renderer.setSize(width, height, false);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	}

	const raycaster = new THREE.Raycaster();
	const pointer = new THREE.Vector2();

	function cellAt(clientX, clientY) {
		const rect = canvas.getBoundingClientRect();
		pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
		raycaster.setFromCamera(pointer, camera);
		const [hit] = raycaster.intersectObjects(sprites.filter(sprite => sprite.visible), false);
		return hit?.object.userData.cell;
	}

	// Отпускание кнопки без заметного сдвига — клик по букве, иначе это было вращение куба.
	let pointerDownAt = null;
	canvas.addEventListener("pointerdown", event => {
		pointerDownAt = { x: event.clientX, y: event.clientY };
	});
	canvas.addEventListener("pointerup", event => {
		const isClick = pointerDownAt && Math.hypot(event.clientX - pointerDownAt.x, event.clientY - pointerDownAt.y) <= CLICK_TOLERANCE_PX;
		pointerDownAt = null;
		if (!isClick) return;
		const cell = cellAt(event.clientX, event.clientY);
		if (cell !== undefined) onCellClick(cell);
	});

	new ResizeObserver(resize).observe(container);

	function animate() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}

	layout();
	animate();

	return {
		update(newState) {
			state = newState;
			redraw();
		},
		redraw,
		setSpread(value) {
			spread = value;
			layout();
			redraw();
		},
	};
}

const view = createCubeView($("stage"), Number($("spread").value), clickCell);

$("spread").addEventListener("input", event => view.setSpread(Number(event.target.value)));
$("clear").addEventListener("click", clearSelection);
$("reset").addEventListener("click", restart);
document.addEventListener("keydown", event => {
	if (event.key === "Backspace") removeLastLetter();
	else if (event.key === "Escape") clearSelection();
});
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", view.redraw);
document.fonts?.ready.then(view.redraw);

render();
