(function () {
	"use strict";

	var ENTER = 13;
	var KEY_UP = 38;
	var KEY_DOWN = 40;
	var KEY_LEFT = 37;
	var KEY_RIGHT = 39;
	var TAB = 9;
	var cKey = 67;
	var vKey = 86;
	var ESCAPE = 27;

	S.grid.prototype.initEditEvents = function () {
		var grid = this;
		S.attach(grid.panel, "click", function (e) {
			var cell = grid.getCellAtEvent(e);
			if (cell != null) {
				grid.startEdit(e, cell);
			}
		});
	}

	S.grid.prototype.startEdit = function (e, cell) {
		S.stopBubble(e);
		var grid = this;

		if (grid.editingCell != null) {
			grid.endEdit();
		}

		grid.editingCell = cell;

		var editor = buildEditor(cell);
		if (cell.value) {
			editor.value = cell.value;
			editor.select();
		}

		editor.focus();

		function buildEditor() {
			editor = document.createElement("input");
			editor.type = "text"
			editor.className = "gridEditor";

			editor.onblur = function (e) {
				grid.endEdit();
			};

			editor.onkeydown = function (e) {
				onKeydown(e, cell);
			};

			editor.onclick = function (e) {
				e.stopPropagation();
			};

			setEditorBounds(editor, cell);
			grid.wrapper.appendChild(editor);
			return editor;
		}

		function setEditorBounds(editor, cell) {
			var element = cell.element;
			editor.style.top = (element.offsetTop + 2) + "px";
			editor.style.left = (element.offsetLeft + 2) + "px";
			editor.style.width = (element.offsetWidth - 4) + "px";;
			editor.style.height = (element.offsetHeight - 4) + "px";;
		}


		function onKeydown(e, cell) {
			switch (e.keyCode) {
				case ENTER:
				case KEY_DOWN:
					grid.endEdit();

					if (cell.rowIndex < grid.rows.length) {
						grid.setFocus(cell.rowIndex + 1, cell.columnIndex, false);
					}
					S.stopBubble(e);
					break;

				case TAB:
					e.preventDefault();
					e.stopPropagation();

					grid.endEdit();
					if (cell.columnIndex < grid.columns.length) {
						grid.setFocus(cell.rowIndex, cell.columnIndex + 1, false);
					}
					break;

				case KEY_UP:
					grid.endEdit();
					if (cell.rowIndex > 0) {
						grid.setFocus(cell.rowIndex - 1, cell.columnIndex, false);
					}
					S.stopBubble(e);
					break;

				case KEY_LEFT:
					if (cell.columnIndex > 0) {
						var position = S.getCaretPosition(editor);
						if (position <= 0) {
							grid.endEdit();
							if (cell.columnIndex > 0) {
								grid.setFocus(cell.rowIndex, cell.columnIndex - 1, false);
							}
							S.stopBubble(e);
						}
					}
					break;

				case KEY_RIGHT:
					var position = S.getCaretPosition(editor);
					if (position >= editor.value.length) {
						grid.endEdit();
						if (cell.columnIndex < grid.columns.length) {
							grid.setFocus(cell.rowIndex, cell.columnIndex + 1, false);
						}
						S.stopBubble(e);
					}
					break;

				case cKey:
					if (e.ctrlKey) {
						var selected = grid.selected.map(function (cell) {
							return cell.value;
						});
						S.copyTextToClipboard(selected);
					}
					break;

				case ESCAPE:
					// set old value. end edit
					editor.value = grid.editingCell.value;
					grid.endEdit();
					break;
			}
		}

		S.grid.prototype.endEdit = function () {
			grid.sortedColumn = -1;
			
			var cell = grid.editingCell;
			if (cell != null) {
				grid.editingCell = null;

				var oldValue = cell.value || null;
				var newValue = editor.value;

				if (oldValue != newValue) {
					grid.setValue(cell, newValue);

					if (grid.onCellChanged) {
						// launch the event that a cell has been modified.
						grid.onCellChanged(newValue, oldValue, cell);
					}
				}

				S.removeNode(editor);
				editor = null;
			}
		}
	};
})();