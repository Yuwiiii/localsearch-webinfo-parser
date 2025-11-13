document.getElementById('searchInput').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll('#outputTable tbody tr');

    rows.forEach(row => {
        const field = row.querySelector('td:first-child').textContent.toLowerCase();
        const detail = row.querySelector('td:last-child').textContent.toLowerCase();

        if (field.includes(searchValue) || detail.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

    document.getElementById('parseButton').addEventListener('click', function() {
        const inputText = document.getElementById('inputText').value;
        const outputBody = document.getElementById('outputBody');
        const newPagesContainer = document.getElementById('newPagesContainer');
        // Clear previous results
        outputBody.innerHTML = '';
        newPagesContainer.innerHTML = '';
        // Mapping of fields to look for
        const fields = [
            "Theme Selection",
          "Business Name",
          "ABN",
          "ACN",
          "Address",
          "How would you like your address shown on your website/profile?",
          "Primary Business Phone Number",
          "Secondary Business Phone Number",
          "Business Email Address",
          "Would you like your email address displayed on your website?",
          "Additional Email Address/es",
          "Trading Hours",
          "Special Trading Hours",
          "Do you have any offers or deals you'd like showcased?",
          "How would you like the deal or offers shown on your website?",
          "What deals or offers would you like to display on your website?",
          "Please provide your slogan or mission value statement",
          "Do you have any memberships, accreditations and/or licenses?",
          "Please provide your existing website URL",
          "Please provide the link to your Facebook page",
          "Please provide the link to your Instagram",
          "Please provide the link to your Localsearch Business Profile",
          "Please provide the link to your Google Business Profile",
          "Please provide the link to your YouTube channel",
          "Please provide the link to your TikTok profile",
          "Please provide any other social links",
          "Website image source",
          "Website stock image guide",
          "Would you like any brands or companies highlighted on every page?",
          "Do you have your frequent ly asked questions ready?",
          "Please provide your frequently asked questions",
          "Do you have testimonials?",
          "Where would you like us to get the testimonials from?",
          "Use Google as live testimonial source",
          "Use Localsearch as live testimonial source",
          "Use Facebook as live testimonial source",
          "Use TripAdvisor as live testimonial source",
          "Do you want to choose any specific stock images for your site?",
          "Are there multiple locations?",
          "If there are multiple location pages, do all locations offer the same services, products & facilities?",
          "If there are multiple locations please advise of any differences in contact details",
          "If there are multiple location pages, how would you like your address shown on the location pages?",
          "Is this a funeral website?",
          "General Notes for Website",
          "Notes for the Developer",
          "301 Redirects",
          "Primary Accent Colour Hex Code",
          "Secondary Accent Colour Hex Code",
          "Tertiary Accent Colour Hex Code",
          "Website Theme",
          "Is the client having dynamic pages?",
          "If a CSV is not being provided prior to build please list one product details below",
          "What payment options do you offer?",
          "Does the client want prices shown on their catalogue store?",
          "Is the client having Localsearch Chat?",
          "Email for chat",
          "Display name for chat",
          "Collect contact info: Name",
          "Collect contact info: Phone Number",
          "Collect contact info: Email",
          "Is the client having Localsearch Bookings?",
          "Bookings",
          "Number of booking users needed",
          "Booking Primary Users Full Name",
          "Bookings Primary Users Email",
          "Booking Primary Users Hours",
          "Number of booking types",
        ];

        // Fields that require an orange background
        const orangeFields = [
            "Is the client having dynamic pages?",
            "If a CSV is not being provided prior to build please list one product details below",
            "What payment options do you offer?",
            "Does the client want prices shown on their catalogue store?",
            "Is the client having Localsearch Chat?",
            "Is the client having Localsearch Bookings?"
        ];
        // Fields that require an red and green background
        const yesNoFields = [
            "Would you like your email address displayed on your website?",
            "Do you have testimonials?"
        ];
    

        // Split the input text into lines
        const lines = inputText.split('\n');

        // Store details found
        const results = {};

        // Regular expressions for CX/Sales and date/time formats
        const cxSalesPattern = /^(CX|Sales)$/;
        const dateTimePattern = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/;
        
        // Variable to hold the current field we're capturing details for
        let currentField = null;

        // Variable to hold multi-line details
        let multiLineDetail = '';

        let newItems = [];

        let currentFieldDateTime = {};
        let lastDateTime = null;
        let pendingField = null; // Store the field we need to assign date to after finishing
        let pendingDetail = '';  // Store its details
        let lastField = null;
        // Iterate over the lines to find relevant information
        for (let i = 0; i < lines.length; i++) {
            const trimmedLine = lines[i].trim();
            if (!trimmedLine) continue;

            // If it's a date line
            if (dateTimePattern.test(trimmedLine)) {
                if (lastField) {
                    currentFieldDateTime[lastField] = trimmedLine;
                }
                continue;
            }
        
            // If it's CX/Sales line, treat as break
            if (cxSalesPattern.test(trimmedLine)) {
                if (currentField) {
                    results[currentField] = multiLineDetail.trim();
                    lastField = currentField; // Save it as the most recent field
                    currentField = null;
                    multiLineDetail = '';
                }
                continue;
            }
        
            // If it's a new field
            if (fields.includes(trimmedLine)) {
                if (currentField) {
                    results[currentField] = multiLineDetail.trim();
                    lastField = currentField; // Store for future date assignment
                }
                currentField = trimmedLine;
                multiLineDetail = '';
                continue;
            }
        
            // Otherwise, add to current field's content
            if (currentField) {
                multiLineDetail += trimmedLine + '\n';
            }
            
            // Items for Website Upgrade (Trimming)
           // Items for Website Upgrade (Trimming)
            if (/^Item \d+ Action$/i.test(trimmedLine)) {
                const itemNumber = trimmedLine.match(/^Item (\d+)/)?.[1]; 
                const action = lines[i + 1]?.trim() || "Unknown";

                const itemNameIndex = lines.findIndex(line => line.trim() === `Item ${itemNumber} Name`);
                const itemName = itemNameIndex !== -1 ? lines[itemNameIndex + 1]?.trim() : "Unknown";

                const anchorLinksIndex = lines.findIndex(line => line.trim().toLowerCase() === `item ${itemNumber} anchor links`);
                const anchorLinks = anchorLinksIndex !== -1 ? lines[anchorLinksIndex + 1]?.trim() : "NA";

                const parent = lines[i - 9]?.trim() || "NA";        // These may need refining if input structure varies
                const type = lines[i - 4]?.trim() || "NA";
                const timestamp = lines[i - 1]?.trim() || "";

                newItems.push({ itemName, parent, type, anchorLinks, timestamp, action });
            }

            
            
            
            
        }

        if (currentField) {
            results[currentField] = multiLineDetail.trim();
            lastField = currentField;
        }
        
        // Format the ABN if it exists
        if (results['ABN']) {
            results['ABN'] = formatABN(results['ABN']);
        }

        if (results['ACN']) {
            results['ACN'] = formatACN(results['ACN']);
        }

        // Display results in the table
        for (const [field, detail] of Object.entries(results)) {
            const newRow = document.createElement('tr');
            const fieldCell = document.createElement('td');
            const detailCell = document.createElement('td');
            const buttonCell = document.createElement('td'); // Cell for the button

            fieldCell.innerHTML = `<strong>${field}</strong>`; // Set field to bold
            detailCell.textContent = detail.replace(/\n/g, "\n"); // Preserve line breaks for display
            // Create the "Copy" button
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy';
            copyButton.style.cursor = 'pointer';
            copyButton.addEventListener('click', function () {
                navigator.clipboard.writeText(detail)
                    .then(() => Swal.fire({
                        toast: true,
                        position: "top-end",
                        title: `Copied: ${detail}`,
                        customClass: 'swal-wide',
                        icon: "success",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                    })         
                    )
                    .catch(err => console.error('Could not copy text: ', err));
            });

            buttonCell.appendChild(copyButton);

            // Apply orange background for specific fields
            if (orangeFields.includes(field)) {
                fieldCell.classList.add('orange');
                detailCell.classList.add('orange');
            }
            //apply green or red to yesornofields
            if (yesNoFields.includes(field)) {
                detailCell.style.backgroundColor = detail.toLowerCase() === "yes" ? "lightgreen" : "lightcoral";
            }

            newRow.appendChild(fieldCell);
            newRow.appendChild(detailCell);
            outputBody.appendChild(newRow);
            newRow.appendChild(buttonCell);
        }
        if (newItems.length > 0) {
            Swal.fire({
                title: "Is this a Website Upgrade?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No"
            }).then((result) => {
                if (result.isConfirmed) {
                    const table = document.createElement('table');
                    table.innerHTML = `
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Parent</th>
                                <th>Type</th>
                                <th>Anchor Links</th>
                                <th>Date & Time Added</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${newItems.map(item => `
                                <tr>
                                    <td>${item.itemName}</td>
                                    <td>${item.parent}</td>
                                    <td>${item.type}</td>
                                    <td>${item.anchorLinks}</td>
                                    <td>${item.timestamp}</td>
                                    <td>${item.action}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    `;
                    newPagesContainer.innerHTML = '<h2>New Pages for Website Upgrade</h2>';
                    newPagesContainer.appendChild(table);

                    // Add "Date Updated" column to the main output table if not already added
                    const outputTable = document.getElementById('outputTable');
                    const headerRow = outputTable.querySelector('thead tr');

                    const alreadyExists = Array.from(headerRow.children).some(th => th.textContent === 'Date Updated');

                    if (!alreadyExists) {
                        const newHeader = document.createElement('th');
                        newHeader.textContent = 'Date Updated';
                        headerRow.appendChild(newHeader);

                        // Add the correct date-time for each existing row
                        const outputRows = outputTable.querySelectorAll('tbody tr');
                        outputRows.forEach(row => {
                            const field = row.querySelector('td:first-child').textContent.trim(); // Get the field name
                            const dateTime = currentFieldDateTime[field] || ""; // Get the date-time for that field
                            const dateCell = document.createElement('td');
                            dateCell.textContent = dateTime; // Insert date-time for this field
                            row.appendChild(dateCell);
                        });
                    }
                }
                else {
                    // Remove the "Date Updated" column if it exists
                    if (headerRow) {
                        const headers = Array.from(headerRow.children);
                        const index = headers.findIndex(th => th.textContent === 'Date Updated');
        
                        if (index !== -1) {
                            // Remove the header
                            headerRow.removeChild(headerRow.children[index]);
        
                            // Remove the cell from each body row
                            const rows = outputTable.querySelectorAll('tbody tr');
                            rows.forEach(row => {
                                if (row.children[index]) {
                                    row.removeChild(row.children[index]);
                                }
                            });
                        }
                    }
                }
            });
        }
        // If no details were found, display a message
        if (outputBody.childNodes.length === 0) {
            const newRow = document.createElement('tr');
            const newCell = document.createElement('td');
            newCell.setAttribute('colspan', '2');
            newCell.textContent = 'No important details found.';
            newRow.appendChild(newCell);
            outputBody.appendChild(newRow);
        }
    });

    
    
    // Function to format ABN
    function formatABN(abn) {
        // Remove all non-digit characters
        const cleaned = abn.replace(/\D/g, '');

        // Check if we have 11 digits
        if (cleaned.length === 11) {
            // Format as xx xxx xxx xxx
            return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
        }
        return abn; // Return original if not 11 digits
    }

    function formatACN(acn) {
        return acn.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }

    function exportToCSV() {
        const rows = [];
        const businessName = document.querySelector('td:first-child').textContent.includes('Business Name')
            ? document.querySelector('td:nth-child(2)').textContent
            : 'parsed_data';

        const filename = `parse_data_${businessName}.csv`;

        // Get table rows for CSV export
        const table = document.getElementById('outputTable');
        for (let row of table.rows) {
            const cells = [];
            for (let cell of row.cells) {
                // Wrap in double quotes for preserving line breaks and commas
                cells.push(`"${cell.textContent.replace(/\n/g, '\r\n')}"`);
            }
            rows.push(cells.join(","));
        }

        // Convert rows to CSV format
        const csvContent = rows.join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");

        // Download CSV file
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    document.getElementById('openOtherToolButton').addEventListener('click', function () {
    const inputText = document.getElementById('inputText').value;
    localStorage.setItem('parserInput', inputText); // Store the input text
    window.open('./parse-sitemap.html', '_blank'); // Open the other HTML file
});


