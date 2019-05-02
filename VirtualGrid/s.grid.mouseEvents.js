(function () {
	"use strict";

	S.grid.prototype.initMouseEvents = function () {
		var grid = this;
		S.attach(grid.panel, "mousedown", function (e) {
			var cell = grid.getCellAtEvent(e);
			if (cell != null) {
				if (e.ctrlKey) {
					grid.setFocus(cell.rowIndex, cell.columnIndex, true);
				} else if (e.shiftKey) {
					var columnrange = S.range(grid.selected[0].columnIndex, cell.columnIndex);
					var rowrange = S.range(grid.selected[0].rowIndex, cell.rowIndex);
					var first = true;
					rowrange.forEach(function (row) {
						columnrange.forEach(function (column) {
							if (first) {
								grid.setFocus(row, column, false);
								first = false;
							} else {
								grid.setFocus(row, column, true);
							}
						});
					});
				} else {
					grid.setFocus(cell.rowIndex, cell.columnIndex, false);
				}
			}
		});

		S.attach(grid.headerPanel, "mousedown", function (e) {
			grid.container.style.cursor = "wait";
		}, false);

		S.attach(grid.headerPanel, "mouseup", function (e) {
			e = e || window.event;
			var target = e.target || e.srcElement;

			if (grid.editingCell != null) {
				grid.endEdit();
			}

			var columnIndex = target.className.split(' ')[2];
			if (grid.sortedColumn == columnIndex) {
				grid.values.reverse();
				grid.reload();
			} else {
				// sort columnIndex
				grid.sortedColumn = columnIndex;
				var newvalues = grid.sortArray(grid.values, columnIndex);
				grid.backup = grid.sortArray(grid.backup, columnIndex);
				grid.setValues(newvalues);
			}

			grid.container.style.cursor = "default";

		}, false);
	};
})();