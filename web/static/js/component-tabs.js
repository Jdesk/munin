/**
 * Nodeview/comparison tabs
 *  Tabs can be disabled by setting the <div id="content"> tabsenabled attribute to false
 */

var tabsEnabled,
	content,
	tabsContainer,
	tabs,
	activeTab,
	categoryTitles;

$(document).ready(function() {
	content = $('#content');
	tabsEnabled = content.attr('data-tabsenabled') == 'true';
	tabsContainer = $('.tabs');
	tabs = tabsContainer.find('li');
	categoryTitles = $('h3');

	// Get active tab
	var qs = new Querystring();
	if (qs.contains('cat'))
		activeTab = tabs.filter(function() { return $(this).text().trim() == qs.get('cat'); });
	else if (window.location.hash.length > 0) { // URL contains anchor to category: overview->nodeview
		var anchorName = window.location.hash.substr(1); // Remove leading #
		activeTab = tabs.filter(function() { return $(this).text().trim() == anchorName; });
	}
	else
		activeTab = tabs.first();

	// If category in URL doesn't exist
	if (activeTab[0] === undefined)
		activeTab = tabs.first();


	// If tabs are disabled, they will serve as links to jump to categories
	if (!tabsEnabled) {
		// Remove "ALL" tab
		tabs.first().remove();

		tabs.each(function() {
			var text = $(this).text();
			$(this).html('<a href="#' + text + '">' + text + '</a>');
		});

		// Stop here
		return;
	}

	activeTab.addClass('active');

	tabs.click(function() {
		activeTab.removeClass('active');
		activeTab = $(this);
		activeTab.addClass('active');

		// Hide all categories
		if ($(this).index() != 0) {
			$('[data-category]').hide();
			// Show the right one
			$('[data-category="' + activeTab.text() + '"]').show();

			categoryTitles.hide();
		}
		else { // ALL
			$('[data-category]').show();
			categoryTitles.show();
		}

		// Save state in URL
		saveState('cat', activeTab.text());
	});

	// Hide graphs that aren't in the activeTab category
	if (activeTab.index() != 0) {
		// Hide all categories
		$('[data-category]').hide();
		// Show the right one
		$('[data-category="' + activeTab.text() + '"]').show();

		categoryTitles.hide();
	}
	else { // All
		$('[data-category]').show();

		categoryTitles.show();
	}

	// If there's an active filter, hide tabs
	if (qs.contains('filter'))
		hideTabs();
	else
		showTabs();
});

/**
 * Called on filter search begins
 */
function showTabs() {
	if (!tabsEnabled)
		return;

	// If tabs are already shown, don't do anything
	if (content.attr('data-tabs') == 'true')
		return;

	content.attr('data-tabs', 'true');

	if (activeTab.text() == 'all') // Show all categories
		$('[data-category]').show();
	else // Only show activeTab category
		$('[data-category]').not('[data-category="' + activeTab.text() + '"]').hide();
}

/**
 * Called on filter search ends
 */
function hideTabs() {
	if (!tabsEnabled)
		return;

	// If tabs are already hidden, don't do anything
	if (content.attr('data-tabs') == 'false')
		return;

	content.attr('data-tabs', 'false');

	// Show back every hidden category
	$('[data-category]').show();
}
