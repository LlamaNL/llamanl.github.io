(function () {
	"use strict";


	S.grid.prototype.setFocus = function (rowIndex, columnIndex, multi) {
		var grid = this;

		if (multi === false) {
			var removeEl = document.querySelectorAll('.focus');
			for (var i = 0; i < removeEl.length; i++) {
				removeEl[i].remove();
			}
			grid.selected = [];
		}

		initFocusBoder();

		if (rowIndex >= grid.rows.length) {
			rowIndex = grid.rows.length - 1;
		}

		if (columnIndex >= grid.columns.length) {
			columnIndex = grid.columns.length - 1;
		}

		var cell = grid.getCell(rowIndex, columnIndex);
		var arrayContainsObject = grid.selected.includes(cell);

		if (cell != null && !arrayContainsObject) {
			setBorderBounds(cell);
			if (multi === false || grid.selected === null) {
				grid.selected = [];
			}
			grid.selected.push(cell);
			// focus on the element to receive key events
			cell.element.focus();
		} else if (cell != null && arrayContainsObject) {
			// remove cell from grid.selected
			var index = grid.selected.indexOf(cell);
			if (index > -1) {
				grid.selected.splice(index, 1);
			}

			// remove focus from selected cell
			var removeEl = document.querySelectorAll('.focus');
			for (var i = 0; i < removeEl.length; i++) {
				var elementcolumn = removeEl[i].className.split(' ')[1];
				var elementrow = removeEl[i].className.split(' ')[2];
				if (elementrow == cell.rowIndex && elementcolumn == cell.columnIndex) {
					removeEl[i].remove();
				}
			}
		}

		function setBorderBounds(cell) {
			var element = cell.element;
			var focus = grid.focusBorder;
			focus.className = "focus " + cell.columnIndex + " " + cell.rowIndex;
			focus.style.top = element.style.top;
			focus.style.left = element.style.left;
			focus.style.width = element.style.width;
			focus.style.height = element.style.height;
		}

		function initFocusBoder() {
			grid.focusBorder = document.createElement("div");
			grid.focusBorder.className = "focus";
			grid.panel.appendChild(grid.focusBorder);
			if (grid.focusBorder.parentNode == null) {
				grid.panel.appendChild(grid.focusBorder);
			}
		}
	};
})();