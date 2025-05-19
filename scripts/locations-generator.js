const sheetURL = "https://script.google.com/macros/s/AKfycbxP9QjHtw_10mhp44_1ITeJjfSIw4EqtRI-oy70suIPymrSRjxpuLmy_QS4YJpuuQpT/exec";
        let locations = [];
        let searchHistory = [];
        let altTextHistory = [];

        async function fetchData() {
            try {
                const response = await fetch(sheetURL, { mode: 'cors' });
                const text = await response.text();
                console.log("Raw Response:", text);

                const jsonData = JSON.parse(text);
                console.log("Parsed JSON Data:", jsonData);

                if (Array.isArray(jsonData)) {
                    locations = jsonData;
                    console.log("Locations Data Loaded Successfully:", locations);
                } else {
                    console.error("Unexpected response format", jsonData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        function formatURL(url) {
            return url ? (url.startsWith("http") ? url : `https://${url}`) : null;
        }

        function searchLocation() {
            const query = document.getElementById("searchInput").value.toLowerCase().trim();
            const companyName = document.getElementById("companyInput").value.trim();

            const results = locations.filter(entry => entry.location && entry.location.toLowerCase().includes(query));

            console.log("Search Query:", query);
            console.log("Filtered Results:", results);

            displayResults(results);
            updateHistory(query, results);
            generateAltText(companyName, results);
        }

        function displayResults(results) {
            const resultsContainer = document.getElementById("searchResults");
            resultsContainer.innerHTML = results.length
                ? results.map(r => `
                    <li>
                        <span>
                            <a href="${formatURL(r.links)}" target="_blank">${r.location}</a>
                        </span>
                        <br>
                        ${r.links ? `<a href="${formatURL(r.links)}" target="_blank">${r.links}</a>` : ''}
                        <br>
                        ${r.localstockImages && r.localstockLinks
                            ? `<strong>Localstock Link:</strong> <a href="${formatURL(r.localstockLinks)}" target="_blank">${r.localstockImages}</a>`
                            : ''
                        }
                    </li>
                `).join('')
                : '<li class="text-gray-500">No results found</li>';
        }


        function updateHistory(query, results) {
          if (!query || searchHistory.some(item => item.query === query)) return;

          searchHistory.unshift({ query, results });
          if (searchHistory.length > 50) searchHistory.pop();

          const historyContainer = document.getElementById("searchHistory");
          historyContainer.innerHTML = searchHistory.map((item, index) => `
              <li class="text-gray-700 hover:text-blue-600" onclick="showPreviousResult(${index})">
                  ${item.results.length > 0 ? item.results[0].location : query}
              </li>
          `).join('');
      }

      function showPreviousResult(index) {
          const previousResultsContainer = document.getElementById("previousResult");
          const results = searchHistory[index].results;

          previousResultsContainer.innerHTML = results.length
              ? results.map(r => `
                  <li>
                      <span>
                          <a href="${formatURL(r.links)}" target="_blank">${r.location}</a>
                      </span>
                      <br>
                      ${r.links ? `<a href="${formatURL(r.links)}" target="_blank">${r.links}</a>` : ''}
                      <br>
                      ${r.localstockImages && r.localstockLinks
                          ? `<strong>Localstock Link:</strong> <a href="${formatURL(r.localstockLinks)}" target="_blank">${r.localstockImages}</a>`
                          : ''
                      }
                  </li>
              `).join('')
              : '<li class="text-gray-500">No results found</li>';
      }


        function generateAltText(companyName, results) {
            const altTextContainer = document.getElementById("altTextOutput");

            if (!companyName || results.length === 0) {
                altTextContainer.innerHTML = '<li class="text-gray-500">No ALT text available</li>';
                return;
            }

            const generatedAltTexts = results.map(r => `— ${companyName} in ${r.location}`);

            altTextContainer.innerHTML = generatedAltTexts.map(text => `<li>${text}</li>`).join('');
            altTextHistory.unshift(...generatedAltTexts);
            if (altTextHistory.length > 50) altTextHistory = altTextHistory.slice(0, 50);
            updateAltTextHistory();
        }

        function updateAltTextHistory() {
            document.getElementById("altTextHistory").innerHTML = altTextHistory.map(text => `<li>${text}</li>`).join('');
        }

        document.getElementById("searchInput").addEventListener("keypress", function(event) {
            if (event.key === "Enter") searchLocation();
        });

        fetchData();