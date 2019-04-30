(function () {
	"use strict";

	S.grid.prototype.initMouseEvents = function () {
		var grid = this;
		S.attach(grid.panel, "mousedown", function (e) {
			var cell = grid.getCellAtEvent(e);
			if (cell != null) {
				if (!e.ctrlKey) {
					grid.setFocus(cell.rowIndex, cell.columnIndex, false);
				} else {
					grid.setFocus(cell.rowIndex, cell.columnIndex, true);
				}
			}
		});
		S.attach(grid.headerPanel, "mousedown", function (e) {
			e = e || window.event;
			var target = e.target || e.srcElement;

			if (grid.editingCell != null) {
				grid.endEdit();
			}

			var columnIndex = target.className.split(' ')[2];
			if (grid.sortedColumn == columnIndex) {
				grid.sortedColumn = -1;
				grid.values.reverse();
				grid.reload();
			} else {
				// sort columnIndex
				grid.sortedColumn = columnIndex;
				// grid.values.sort(function(a, b) {
				// 	return a[columnIndex].toString().localeCompare(b[columnIndex]);
				//   });
				var newvalues = grid.sortArray(grid.values, columnIndex);
				grid.backup = grid.sortArray(grid.backup, columnIndex);
				grid.setValues(newvalues);
			}

		}, false);
	};
})();