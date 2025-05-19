function parseData() {
    const rawText = document.getElementById('inputText').value;
    const lines = rawText.split('\n');
    const navTableBody = document.getElementById('navTableBody');
    navTableBody.innerHTML = '';

    const sitemap = [];
    let itemName = '';
    let itemParent = '';
    let itemType = '';
    let anchorLinks = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith("Item") && line.endsWith("Name")) {
            itemName = lines[i + 1]?.trim() || '';
            if (!sitemap[itemName]) {
                sitemap[itemName] = {};
            }
            i += 1;
        } else if (line.startsWith("Item") && line.endsWith("Parent")) {
            itemParent = lines[i + 1]?.trim() || '';
            sitemap[itemName].parent = itemParent;
            i += 1;
        } else if (line.startsWith("Item") && line.endsWith("Type")) {
            itemType = lines[i + 1]?.trim() || '';
            sitemap[itemName].type = itemType;
            i += 1;
        } else if (line.startsWith("Item") && (line.endsWith("Anchor links") || line.endsWith("anchor links"))) {
            i += 1; // Move to the next line to start capturing links
            anchorLinks = '';
            while (i < lines.length && !lines[i].startsWith("Item")) {
                anchorLinks += (lines[i].trim() + "\n");
                i++;
            }
            anchorLinks = anchorLinks.trim() || 'N/A'; // Default to 'N/A' if no links found
            sitemap[itemName].anchorLinks = anchorLinks;
            i -= 1; // Decrement the index to account for the next iteration increment
        }
    }

    // Render navigation items in a table
    for (const itemName in sitemap) {
        const item = sitemap[itemName];
        const row = document.createElement('tr');
        const cell1 = document.createElement('td');
        const cell2 = document.createElement('td');
        const cell3 = document.createElement('td');
        const cell4 = document.createElement('td');
        cell1.textContent = itemName;
        cell2.textContent = item.parent || '';
        cell3.textContent = item.type || '';
        cell4.textContent = item.anchorLinks || 'N/A';
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        navTableBody.appendChild(row);
    }
}