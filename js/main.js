// Declaration as per assignment requirement
/**********************************************************************************  
WEB422 – Assignment 2
I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
No part of this assignment has been copied manually or electronically from any other source 
(including web sites) or distributed to other students.
Name: [Your Name] Student ID: [Your Student ID] Date: [Submission Date]
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

    document.querySelector('#previous-page').addEventListener('click', () => {
        if (page > 1) {
            page--;
            loadCompanyData();
        }
    });

    document.querySelector('#next-page').addEventListener('click', () => {
        page++;
        loadCompanyData();
    });

    document.querySelector('#searchForm').addEventListener('submit', e => {
        e.preventDefault();
        const searchValue = document.querySelector('#searchForm input').value;
        loadCompanyData(searchValue);
    });

    document.querySelector('#clearForm').addEventListener('click', () => {
        document.querySelector('#searchForm input').value = '';
        loadCompanyData(); // Load data without any filter
    });
});

const loadCompanyData = (name = null) => {
    const url = `https://crimson-abalone-yoke.cyclic.app/api/companies?page=${page}&perPage=${perPage}${name ? `&name=${name}` : ''}`;
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
    const { _id, name, description, number_of_employees, homepage_url, category_code, founded_year, tag_list } = companyObj;
    const foundedDate = founded_year ? `${founded_year}` : "--";
    const tags = tag_list ? tag_list.split(',').slice(0, 2).join(', ') : "--";
    return `
        <tr data-id="${_id}">
            <td>${name}</td>
            <td>${description || "--"}</td>
            <td>${number_of_employees || "--"}</td>
            <td>${category_code || "--"}</td>
            <td>${foundedDate}</td>
            <td><a href="${homepage_url}" target="_blank">${homepage_url || "--"}</a></td>
            <td>${tags}</td>
        </tr>
    `;
};

const attachRowClickEvents = () => {
    document.querySelectorAll('#companiesTable tbody tr').forEach(row => {
        row.addEventListener('click', () => {
            const companyId = row.getAttribute('data-id');
            fetch(`https://crimson-abalone-yoke.cyclic.app/api/companies?page=${page}&perPage=${perPage}`)
                .then(response => response.json())
                .then(company => {
                    const modalTitle = document.querySelector('#detailsModal .modal-title');
                    const modalBody = document.querySelector('#detailsModal .modal-body');
                    modalTitle.textContent = company.name;
                    modalBody.innerHTML = company.overview;
                    myModal.show();
                })
                .catch(error => console.error('Error fetching company details:', error));
        });
    });
};
