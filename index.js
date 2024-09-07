/*
TO BE ADDED
 - Write over other letters
 - Randomly generated background
 - Download as pdf
 - Optional color
 - Some fun background?
*/

const numCols = 32;
const numRows = 30;
let activeCell = 0;

const bounce = 30;
let typingTimeout;

const gridContainer = document.querySelector(".grid-container");

function setupGrid(rows = numRows, cols = numCols) {
	for (let i = 0; i < rows; i++) {
		const gridRow = document.createElement("div");
		gridContainer.appendChild(gridRow).className = "grid-row";
		for (let j = 0; j < cols; j++) {
			const gridItem = document.createElement("div");
			gridRow.appendChild(gridItem).className = "grid-item";
		}
	}
}

function indexToRowCol(index) {
	const row = Math.floor(index / numCols);
	const col = index % numCols;
	return [row, col];
}

function getCell(index) {
	const [row, col] = indexToRowCol(index);
	return gridContainer.children[row].children[col];
}

function getActiveCell() {
	return getCell(activeCell);
}

function changeCell(updateActive) {
	const old = getActiveCell();
	old.classList.remove("active-grid-item");
	updateActive();
	const newCell = getActiveCell();
	newCell.classList.add("active-grid-item");
}

function prevCell() {
	const updateActive = () => {
		if (activeCell > 0) {
			activeCell--;
		}
	};
	changeCell(updateActive);
}

function nextCell(ding = true) {
	const updateActive = () => {
		if (activeCell < numRows * numCols - 1) {
			if (activeCell % numCols === numCols - 1 && ding) {
				const newLineDing = new Audio("static/sounds/typewriter_ding.wav");
				newLineDing.play();
			}
			activeCell++;
		}
	};
	changeCell(updateActive);
}

function downCell() {
	const updateActive = () => {
		if (activeCell + numCols < numRows * numCols) {
			activeCell += numCols;
		}
	};
	changeCell(updateActive);
}

function upCell() {
	const updateActive = () => {
		if (activeCell - numCols > 0) {
			activeCell -= numCols;
		}
	};
	changeCell(updateActive);
}

document.addEventListener("keydown", (event) => {
	const key = event.key;
	const isPrintable = key.length === 1 && key.match(/[ -~]/);
	if (key === "ArrowRight") {
		nextCell((ding = false));
	} else if (key === "ArrowLeft") {
		prevCell();
	} else if (key === "ArrowDown") {
		downCell();
	} else if (key === "ArrowUp") {
		upCell();
	} else {
		if (!isPrintable) {
			event.preventDefault();
		} else {
			// Clear any existing timeout
			clearTimeout(typingTimeout);

			// Set a new timeout to handle the delay
			typingTimeout = setTimeout(() => {
				getActiveCell().innerHTML = key;
				nextCell();
				const keyClick = new Audio("static/sounds/typewriter_click.wav");
				keyClick.play();
			}, bounce);
		}
	}
});

window.onload = function () {
	setupGrid();
	getActiveCell().classList.add("active-grid-item");
};
