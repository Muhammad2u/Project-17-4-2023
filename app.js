let updatedData = [];

let renewData = async () => {
    const response = await fetch("./data.json")
    const data = await response.json();
    return data;
}


function fillSelect(element, data) {
    let option = document.createElement('option');
    option.text = data;
    option.value = data;
    element.appendChild(option);
}


let sortRanking = (data, option) => {
    console.log(data.length);
    for (let i = 0; i < data.length; i++) {
        if (option == 'top') {
            if (data[i].vote_average < data[i + 1].vote_average) {
                let temp = data[i];
                data[i] = data[i + 1];
                data[i + 1] = temp;
            }
        } else {
            if (data[i].vote_average > data[i + 1].vote_average) {
                let temp = data[i];
                data[i] = data[i + 1];
                data[i + 1] = temp;
            }
        }
    }
    return data;
}
async function fillData() {
    // const response = await fetch("./data.json")
    // const data = await response.json();
    let originalData = await renewData();
    let genreSelect = document.getElementById('genre');
    let langSelect = document.getElementById('lang');
    // let ratingSelect = document.getElementById('rating');
    let yearsSelect = document.getElementById('year');
    let genres = [];
    let years = [];
    let languages = [];
    originalData.forEach((obj) => {
        if (Array.isArray(obj.genres)) {
            genres = [...genres, ...obj.genres];
        } else {
            genres.push(obj.genres);
        }
        let date = obj.release_date.slice(0, 4);
        years.push(date);
        // rating.push(obj.vote_average);
        languages.push(obj.original_language)
    });
    genres = [...new Set(genres)];
    // rating = [...new Set(rating)];
    years = [...new Set(years)];
    languages = [...new Set(languages)];
    genres.forEach(g => {
        fillSelect(genreSelect, g);
    });
    languages.forEach(g => {
        fillSelect(langSelect, g);
    });
    years.forEach(g => {
        fillSelect(yearsSelect, g);
    });
    // rating.forEach(g => {
    //     fillSelect(ratingSelect, g);
    // });
    updatedData = originalData;
    fillTable(originalData);

};
fillData();

let rankInput = (e) => {
    let option = e.value;
    let data = sortRanking(updatedData, option);
    fillTable(data);
}

let filter = {}
let filteredData = [];
let passedCases = {};

async function onChange(e, type) {
    filter[type] = e.value;
    const originalData = await renewData();
    filteredData = originalData.reduce((previous, next) => {
        passedCases = {}
        Object.keys(filter).forEach(key => {
            if (key === 'genres') {
                if (next[key] instanceof Array) {
                    if (next[key].includes(filter[key])) {
                        passedCases[key] = true;
                    }
                } else {
                    if (next[key] === filter[key]) {
                        passedCases[key] = true;
                    }
                }
            }
            if (key === 'release_date') {
                if (next[key].indexOf(filter[key]) !== -1) {
                    passedCases[key] = true;
                }
            }

            if (next[key] === filter[key]) {
                passedCases[key] = true;
            }
        })
        if (Object.keys(passedCases).length === Object.keys(filter).length) {
            previous.push(next);
        }
        return previous;
    }, [])
    fillTable(filteredData);
}


let table = document.getElementById('table');



async function fillTable(d) {
    let data = await d;
    table.innerHTML = '';
    data.forEach((obj, i) => {
        let row = table.insertRow(i);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        cell1.innerHTML = i + 1;
        cell2.innerHTML = obj.title;
        cell3.innerHTML = obj.release_date.slice(0, 4);
    })
}



