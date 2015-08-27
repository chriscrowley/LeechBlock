/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * This file contains the code for the Statistics dialog.
 */

// Refreshes values in statistics dialog
//
function LeechBlock_statsRefresh() {
	// Get current time in seconds
	var now = Math.floor(Date.now() / 1000);

	for (var set = 1; set <= 6; set++) {
		// Get preferences for this set
		var setName = LeechBlock_getUniCharPref("setName" + set);
		var timedata = LeechBlock_getCharPref("timedata" + set).split(",");
		var limitMins = LeechBlock_getCharPref("limitMins" + set);
		var limitPeriod = LeechBlock_getCharPref("limitPeriod" + set);
		var periodStart = LeechBlock_getTimePeriodStart(now, limitPeriod);

		// Update block set name
		if (setName == "") {
			setName = LeechBlock_getDefaultSetName(set);
		}
		document.getElementById("lb-set-name" + set).value = setName;

		// Update time values
		if (timedata.length == 5) {
			var fs = LeechBlock_getFormattedStats(timedata);
			document.getElementById("lb-start-time" + set).value = fs.startTime;
			document.getElementById("lb-total-time" + set).value = fs.totalTime;
			document.getElementById("lb-per-day-time" + set).value = fs.perDayTime;

			if (limitMins != "" && limitPeriod != "") {
				// Calculate total seconds left in this time period
				var secsLeft = timedata[2] == periodStart
						? Math.max(0, (limitMins * 60) - timedata[3])
						: (limitMins * 60);
				var timeLeft = LeechBlock_formatTime(secsLeft);
				document.getElementById("lb-time-left" + set).value = timeLeft;
			}
		}
	}
}

// Restarts data gathering for block set
//
function LeechBlock_statsRestart(set) {
	// Get current time in seconds
	var now = Math.floor(Date.now() / 1000);

	// Update time data for this set
	var timedata = LeechBlock_getCharPref("timedata" + set).split(",");
	if (timedata.length == 5) {
		timedata[0] = now;
		timedata[1] = 0;
	} else {
		timedata = [now, 0, 0, 0, 0];
	}
	LeechBlock_setCharPref("timedata" + set, timedata.join(","));

	// Update display for this set
	var fs = LeechBlock_getFormattedStats(timedata);
	document.getElementById("lb-start-time" + set).value = fs.startTime;
	document.getElementById("lb-total-time" + set).value = fs.totalTime;
	document.getElementById("lb-per-day-time" + set).value = fs.perDayTime;
}

// Restarts data gathering for all block sets
//
function LeechBlock_statsRestartAll() {
	// Get current time in seconds
	var now = Math.floor(Date.now() / 1000);

	for (var set = 1; set <= 6; set++) {
		// Update time data for this set
		var timedata = LeechBlock_getCharPref("timedata" + set).split(",");
		if (timedata.length == 5) {
			timedata[0] = now;
			timedata[1] = 0;
		} else {
			timedata = [now, 0, 0, 0, 0];
		}
		LeechBlock_setCharPref("timedata" + set, timedata.join(","));

		// Update display for this set
		var fs = LeechBlock_getFormattedStats(timedata);
		document.getElementById("lb-start-time" + set).value = fs.startTime;
		document.getElementById("lb-total-time" + set).value = fs.totalTime;
		document.getElementById("lb-per-day-time" + set).value = fs.perDayTime;
	}
}

// Returns formatted times based on time data
//
function LeechBlock_getFormattedStats(timedata) {
	var days = 1
			+ Math.floor(Date.now() / 86400000)
			- Math.floor(timedata[0] / 86400);
	return {
		startTime: new Date(timedata[0] * 1000).toLocaleString(),
		totalTime: LeechBlock_formatTime(timedata[1]),
		perDayTime: LeechBlock_formatTime(timedata[1] / days)
	};
}
