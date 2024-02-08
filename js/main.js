// Declaration as per assignment requirement
/**********************************************************************************  
WEB422 – Assignment 2
I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
No part of this assignment has been copied manually or electronically from any other source 
(including web sites) or distributed to other students.
Name: Arman Jeevani Student ID: 158510180 Date: 07/02/2024
*********************************************************************************/

// Initial variables
let page = 1;
const perPage = 8;

let myModal = new bootstrap.Modal(document.getElementById('detailsModal'), {
    backdrop: 'static',
    keyboard: false,
    focus: true,
});

document.addEventListener('DOMContentLoaded', () => {
    loadCompanyData();
    currentPageDisplay();

    const prevPage = document.querySelector('#previous-page');
    if (prevPage) {
        prevPage.addEventListener('click', () => {
            if (page > 1) {
                page--;
                console.log('Previous page:', page); // Debugging log to confirm the page number
                currentPageDisplay();
                loadCompanyData();
            }
        });
    }

    const nextPage = document.querySelector('#next-page');
    if (nextPage) {
        nextPage.addEventListener('click', () => {
            page++;
            console.log('Next page:', page); // Debugging log to confirm the page number
            currentPageDisplay();
            loadCompanyData();
        });
    }

    const searchForm = document.querySelector('#searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', e => {
            e.preventDefault();
            const searchValue = document.querySelector('#searchForm input').value;
            page=1;
            currentPageDisplay();
            loadCompanyData(searchValue);
        });
    }

    const clearForm = document.querySelector('#clearForm');
    if (clearForm) {
        clearForm.addEventListener('click', () => {
            document.querySelector('#searchForm input').value = '';
            page=1;
            currentPageDisplay();
            loadCompanyData(); // Load data without any filter
        });
    }
});

const currentPageDisplay = () =>{
    const currentPageElement = document.querySelector('#current-page');
    if (currentPageElement) {
        currentPageElement.textContent = page;
    }
}

const loadCompanyData = (name = null) => {
    const url = `http://localhost:8080/api/companies?page=${page}&perPage=${perPage}${name ? `&name=${name}` : ''}`;
    console.log(`Fetching data from: ${url}`); // Debugging log to confirm the fetch URL
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableRows = data.map(companyObjectToTableRowTemplate).join('');
            document.querySelector('#companiesTable tbody').innerHTML = tableRows;
            attachRowClickEvents();
        })
        .catch(error => {
            console.error('Error fetching company data:', error);
            alert('Error fetching company data. Please check the console for more details.'); // Alert for user-friendly error notification
        });
};

const companyObjectToTableRowTemplate = companyObj => {
    const { _id, name, description, offices, number_of_employees, homepage_url, category_code, founded_year, tag_list } = companyObj;
    const foundedDate = founded_year ? `${founded_year}` : "--";
    const tags = tag_list ? tag_list.split(',').slice(0, 2).join(', ') : "--"; // Ensure tag_list is a comma-separated string
    let officeLocation = "--";

    // Check if there's at least one office and construct the location string accordingly
    if (offices && offices.length > 0) {
        const { city, state_code, country_code } = offices[0]; // Destructure the first office's details
        officeLocation = `${city}`;
        if (state_code) { // Add state code if available
            officeLocation += `, ${state_code}`;
        }
        officeLocation += `, ${country_code}`; // Append country code
    }
    return `
        <tr data-id="${_id}">
            <td>${name}</td>
            <td>${description || "--"}</td>
            <td>${number_of_employees || "--"}</td>
            <td>${officeLocation || "--"}</td>
            <td>${category_code || "--"}</td>
            <td>${foundedDate}</td>
            <td><a href="${homepage_url}" target="_blank">${homepage_url || "--"}</a></td>
            <td>${tags}</td>
        </tr>
    `;
};

// Update current page display and pagination controls
const updatePaginationControls = () => {
    const currentPageElement = document.getElementById('current-page');
    if (currentPageElement) {
        currentPageElement.textContent = page; // Update current page number
    }
};

const attachRowClickEvents = () => {
    document.querySelectorAll('#companiesTable tbody tr').forEach(row => {
        row.addEventListener('click', () => {
            const companyId = row.getAttribute('data-id');
            fetch(`http://localhost:8080/api/company/${companyId}`)
                .then(response => response.json())
                .then(company => {
                    const modalTitle = document.querySelector('#detailsModal .modal-title');
                    const modalBody = document.querySelector('#detailsModal .modal-body');
                    const modalContent = `
                        <strong>Category:</strong> ${company.category_code || "N/A"}<br /><br />
                        <strong>Description:</strong> ${company.description || "N/A"}<br /><br />
                        <strong>Overview:</strong> ${company.overview || "N/A"}<br /><br />
                        <strong>Tag List:</strong> ${company.tag_list || "N/A"}<br /><br />
                        <strong>Founded:</strong> ${company.founded_year ? new Date(company.founded_year).toDateString() : "N/A"}<br /><br />
                        <strong>CEOs:</strong> ${company.ceo || "N/A"}<br /><br />
                        <strong>Products:</strong> ${company.products || "N/A"}<br /><br />
                        <strong>Number of Employees:</strong> ${company.number_of_employees || "N/A"}<br /><br />
                        <strong>Website:</strong> <a href="${company.homepage_url}" target="_blank">${company.homepage_url || "N/A"}</a><br /><br />
                    `;
                    modalTitle.textContent = company.name;
                    modalBody.innerHTML = modalContent; // Provide fallback for overview
                    myModal.show();
                })
                .catch(error => console.error('Error fetching company details:', error));
        });
    });
};
