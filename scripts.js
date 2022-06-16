const form = document.querySelector('.form');
form.addEventListener('submit', handleSubmit);

const searchResults = document.querySelector('.search-results');

async function handleSubmit(e) {
    e.preventDefault();
    try {
        let userName = document.querySelector('.data').value;
        const results = await GithubApi(userName);
        if (userName != results.login) {
            alert('Enter a valid input!');
        } else {
            displayResults(results);
        }
        document.querySelector('.data').value = '';
    } catch (err) {
        console.log(err);
        alert('Invalid input');
        location.reload();
    }
}

async function GithubApi(userName) {
    const url = `https://api.github.com/users/${userName}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw Error(response.statusText);
    }
    const jsonResponse = await response.json();
    return jsonResponse;

}

async function displayResults(results) {
    searchResults.innerHTML += `
        <div class="row mb-2">
            <div class="col-md-4 ">
                <img class="profil" src="${results.avatar_url}" alt="">
            </div>
            <div class="col-md-4  p-1">
                <li class ="item">Name: ${results.login}</li>
                <li class ="item">GitHub: <a href="${results.html_url}" class="btn btn-primary">link</a></li>
                <li class ="item">Repos:<span class="btn btn-success">${results.public_repos}</span></li>
            </div>
            <div class="col-md-4 text-center">
                <div class="btn-group">
                    <button type="button" class="btn btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Get repos
                    </button>
                    <div class="dropdown-menu mt-2">
                        ${await getRepos(results.login)}
                    </div>
                </div>
            </div>
        </div>
        <hr>
    `;
}

async function getRepos(userName) {
    const url = `https://api.github.com/users/${userName}/repos`;
    const repos = await fetch(url);
    const reposResponse = await repos.json();
    let links = '';
    reposResponse.forEach(reposway => {
        links += ` <a class="dropdown-item" href="${reposway.html_url}" target="_blank">${reposway.name}</a><div class="dropdown-divider"></div>`
    });
    return links;
}

//NarcisseObadiah