/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * This file contains the code for the Lockdown dialog.
 */

// Handles lockdown dialog initialization
//
function LeechBlock_lockdownInit() {
	// Get current time in seconds
	var now = Math.floor(Date.now() / 1000);

	// Check whether a lockdown is currently active
	var endTime = 0;
	for (var set = 1; set <= 6; set++) {
		var timedata = LeechBlock_getCharPref("timedata" + set).split(",");
		if (timedata.length == 5) {
			endTime = Math.max(endTime, timedata[4]);
		}
	}
	if (endTime > now) {
		// Show alert dialog with end time
		LeechBlock_alertLockdown(new Date(endTime * 1000).toLocaleString());
		// Close lockdown dialog
		window.close();
	}

	// Get preferences
	var duration = LeechBlock_getIntPref("lockdownDuration");
	var sets = LeechBlock_getIntPref("lockdownSets");

	// Set component values
	var hours = Math.floor(duration / 3600);
	var mins = Math.floor(duration / 60) % 60;
	document.getElementById("lb-lockdown-hours").value = hours;
	document.getElementById("lb-lockdown-mins").value = mins;
	for (var set = 1; set <= 6; set++) {
		var lockdown = (sets & (1 << (set - 1))) != 0;
		document.getElementById("lb-lockdown-set" + set).checked = lockdown;
		document.getElementById("lb-lockdown-set" + set).label += " "
				+ LeechBlock_getLockdownBlockSetLabel(set);
	}
}

// Handles lockdown dialog OK button
//
function LeechBlock_lockdownOK() {
	// Get component values
	var hours = document.getElementById("lb-lockdown-hours").value;
	var mins = document.getElementById("lb-lockdown-mins").value;
	var duration = hours * 3600 + mins * 60;
	var sets = 0;
	for (var set = 1; set <= 6; set++) {
		var lockdown = document.getElementById("lb-lockdown-set" + set).checked;
		if (lockdown) sets |= (1 << (set - 1));
	}

	// Set preferences
	LeechBlock_setIntPref("lockdownDuration", duration);
	LeechBlock_setIntPref("lockdownSets", sets);

	// Get current time in seconds
	var now = Math.floor(Date.now() / 1000);

	// Update time data for selected block sets
	for (var set = 1; set <= 6; set++) {
		var lockdown = document.getElementById("lb-lockdown-set" + set).checked;

		if (lockdown) {
			// Update time data for this set
			var timedata = LeechBlock_getCharPref("timedata" + set).split(",");
			if (timedata.length == 5) {
				timedata[4] = now + duration;
			} else {
				timedata = [now, 0, 0, 0, now + duration];
			}
			LeechBlock_setCharPref("timedata" + set, timedata.join(","));
		}
	}

	return true;
}

// Handles lockdown dialog Cancel button
//
function LeechBlock_lockdownCancel() {
	return true;
}
