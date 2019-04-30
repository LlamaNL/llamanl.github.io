(function () {
	"use strict";

	S.grid = function (container) {
		var grid = this;
		this.container = S.get(container);
		this.columns = null;
		this.backup = null;
		this.values = null;
		this.panel = null;
		this.totalRows = 0;
		this.setOddRowStyle = false;
		this.focusBorder = null;
		this.shortcuts = [];
		var initialized = false;
		this.selected = [];
		this.sortedColumn = -1;
		var lastScrollLeft = 0;
		var lastScrollTop = 0;

		function init() {
			grid.build();

			if (grid.initMouseEvents) {
				grid.initMouseEvents();
			}

			if (grid.initEditEvents) {
				grid.initEditEvents();
			}

			initialized = true;
		};

		this.setValues = function (values, init) {
			grid.values = values;
			if (init === true) {
				grid.backup = values;
			}
			grid.reload();
		}

		this.sortArray = function (array, columnIndex) {
			var numbers = array.filter(col => !isNaN(col[columnIndex]));
			var strings = array.filter(col => isNaN(col[columnIndex]));
			if (numbers.length > 0) {
				numbers.sort(function (a, b) {
					return a[columnIndex] - b[columnIndex];
				});
			}
			if (strings.length > 0) {
				strings.sort(function (a, b) {
					return a[columnIndex].localeCompare(b[columnIndex]);
				});
			}
			var newvalues = numbers.concat(strings);
			return newvalues;
		}

		this.filterValues = function (element) {
			if (!element) {
				return;
			}
			grid.setValues(this.backup.filter(x => x.some(y => y.toString().indexOf(element.value) > -1)));
			// set focus back to inputbox because reload steals focus
			element.focus();
		}

		this.getCell = function (rowIndex, columnIndex) {
			if (grid.columns.length <= columnIndex) {
				return null;
			}

			var rows = grid.rows;
			if (rows.length <= rowIndex) {
				return null;
			}

			var row = rows[rowIndex];
			if (row == null) {
				return null;
			}

			return row.cells[columnIndex];
		};

		// Returns the number of visible rows.
		this.visibleRowCount = function () {
			return parseInt(grid.globalPanelSize.height / grid.columnHeight);
		}

		this.setPageSize = function (rowIndex) {
			var visibleRowCount = grid.visibleRowCount();
			var rowOffset = 1;
			var start = rowIndex - rowOffset;
			if (start < 0) {
				start = 0;
			}

			var totalRows = getTotalRows();

			var end = rowIndex + visibleRowCount + rowOffset;
			if (totalRows > 0 && end > totalRows) {
				end = totalRows;
			}

			grid.renderPageSize = {
				start: start,
				end: end
			};
		}

		this.reload = function () {
			grid.clear();
			grid.totalRows = 0;
			grid.update();
		}

		this.update = function (rowIndex) {
			if (!initialized) {
				init();
			}
			rowIndex = rowIndex || 0;
			grid.setPageSize(rowIndex);
			paint(rowIndex);
		};

		this.onScrollPanel = function (e) {
			var left = grid.wrapper.scrollLeft;
			var top = grid.wrapper.scrollTop;

			if (Math.abs(left - grid.lastScrollLeft) > 0) {
				updateHeader(left);
			}

			if (Math.abs(top - grid.lastScrollTop) > 0) {
				updateRows();
			}

			grid.lastScrollLeft = left;
			grid.lastScrollTop = top;
		};

		function updateHeader(left) {
			grid.headerPanel.style.left = (left * -1) + "px";
		}

		function updateRows() {
			var rowIndex = parseInt(grid.wrapper.scrollTop / grid.columnHeight);
			grid.update(rowIndex);
		}

		this.isRowInMemory = function (rowIndex) {
			var values = grid.values;

			if (values == null) {
				return false;
			}

			if (values.length <= rowIndex) {
				return false;
			}

			var value = values[rowIndex];
			if (value == null) {
				return false;
			}

			return true;
		}

		// Indicates whether the row is generated in the dom or is virtual
		this.isRowRendered = function (rowIndex) {
			if (grid.rows.length <= rowIndex) {
				return false;
			}

			var value = grid.rows[rowIndex];
			if (value == null) {
				return false;
			}

			return true;
		}

		function paint(rowIndex) {
			grid.totalRows = getTotalRows();
			if (grid.totalRows > 0) {
				grid.buildRows(rowIndex || 0);
				grid.setFocus(0, 0);
			} else {
				grid.clear();
			}
		};

		this.clear = function () {
			if (grid.panel) {
				S.clearChildNodes(grid.panel);
			}
			grid.rows = [];
		}

		this.setValue = function (cell, value) {
			var newvalue;
			if (isNaN(value)) {
				newvalue = value.toString();
			} else {
				newvalue = Number(value);
			}
			cell.value = value.toString();

			grid.values[cell.rowIndex][cell.columnIndex] = newvalue;

			S.setText(cell.element, cell.value);
		};

		this.getCellAtEvent = function (e) {
			var coords = S.getMouseCoords(e, grid.panel);
			var row = getRowAt(coords.y);
			var column = getColumnAt(coords.x);
			return grid.getCell(row, column);
		};

		function getTotalRows() {
			if (grid.totalRows > 0) {
				return grid.totalRows;
			}

			if (grid.values) {
				return grid.values.length;
			}

			return 0;
		};

		function getColumnAt(x) {
			var columns = grid.columns;
			var offset = grid.numbersColumnWidth;
			for (var i = columns.length - 1; i >= 0; i--) {
				var left = columns[i].left + offset;
				if (x > left) {
					return i;
				}
			}
			return -1;
		}

		function getRowAt(y) {
			return Math.floor(y / grid.columnHeight);
		}
	};

})();