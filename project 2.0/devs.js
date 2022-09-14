const url = "./data.json"
const { default: jsonObject } = await import(url, {
    assert: {
      type: 'json'
    }
  });
  console.log(jsonObject[0])



const state = {};
state.data = jsonObject


console.log(state.data[0])

const body = document.getElementById("body");
const container = document.querySelector(".app");
const search = document.querySelector(".search");

const phraseInput = document.getElementById("searchPhrase");
const locationInput = document.getElementById("searchLocation");
const fullTimeCheckbox = document.getElementById("fullTimeOnly");

const searchButton = document.getElementById("SearchButton");
const moreButton = document.getElementById('loadMore');

const showJob = (job) => {
	const markup = `
        <div class="card" id = "${job.id}">
            <div class="card-logo" style="background-color: ${job.logoBackground}">
                <img src="${job.logo}" alt="${job.position}" />
            </div>
            <div class="card-top">
                <p>${job.postedAt}</p>
                <div class="card-dot"></div>
                <p>${job.contract}</p>
            </div>
            <a href="#${job.id}">${job.position}</a>
            <p>${job.company}</p>
            <span class="card-location">${job.location}</span>
        </div>
    `;

	container.insertAdjacentHTML("beforeend", markup);
};

const showAllJobs = () => {
	container.innerHTML = "";
	search.classList.remove("invisible");

	let data;

	if (fullTimeCheckbox.checked) {
		console.log("checked");
		data = state.data.filter((job) => job.contract === "Full Time");

		data.forEach((job) => {
			showJob(job);
		});
	} else {
		state.data.forEach((job) => {
			showJob(job);
		});
	}
};

const generateLi = (item) => {
	return `
        <li>${item}</li>
    `;
};

const showJobInfomation = (id) => {
	const job = state.data.find((el) => el.id === id);
	if (!job) return showAllJobs();
	search.classList.add("invisible");
    moreButton.classList.add('invisible');

	const markup = `
    <div class="info">
				<div class="info-header">
					<div class="info-header-logo" style="background-color: ${job.logoBackground}">
						<img src="${job.logo}" alt="${job.position}" />
					</div>
					<div class="info-right">
						<div class="info-header-content">
							<h2>${job.company}</h2>
							<p href="">${job.company}.com</p>
						</div>
                        
						<button class="btn btn-2"  onclick = "window.open('${job.website}', '_blank')">Company Site</button>
                        
					</div>
				</div>
				<div class="info-body">
					<div class="info-body-top">
						<div class="info-body-top__content">
							<p>${job.postedAt}</p>
							<div class="info-body-top-dot"></div>
							<p>${job.contract}</p>
						</div>
						<a href="#${job.id}">${job.position}</a>
						<span class="info-body-top-location">United Kingdom</span>
					</div>
					<button class="btn" onclick = "window.open('${job.apply}', '_blank')" >Apply Now</button>
				</div>
				<div class="info-content">
					<p>
						${job.description}
					</p>
					<h3>Requirements</h3>
					<p>
						${job.requirements.content}
					</p>
					<ul>
                        ${job.requirements.items.map((ele) => generateLi(ele)).join("")}
					</ul>
					<h3>What You Will Do</h3>
					<p>
                        ${job.role.content}
					</p>
					<ol>
                        ${job.role.items.map((ele) => generateLi(ele)).join("")}
					</ol>
				</div>
			</div>
			<footer class="footer">
				<div class="footer-content hide-mobile">
					<h3>${job.position}</h3>
					<p>${job.company}</p>
				</div>
				<button class="btn" onclick = "window.open('${job.apply}', '_blank')">Apply Now</button>
			</footer>
    `;

	container.innerHTML = markup;

	
};

function locationHashChanged() {
	let id = parseInt(location.hash.slice(1));
	search.classList.add("invisible");
    moreButton.classList.add('invisible');
	showJobInfomation(id);
}
window.onhashchange = locationHashChanged;

const init = () => {
	if (location.hash == undefined || location.hash == null || location.hash === "#" || location.hash === "") {
		showAllJobs();
	} else {
		let id = parseInt(location.hash.slice(1));
		showJobInfomation(id);
	}
};
init();

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

searchButton.addEventListener("click", (e) => {
	e.preventDefault();
	let data = [];
	let phrase = phraseInput.value;
	let location = locationInput.value;

	if (!phrase && !location) return showAllJobs();

	// Only phrase it inputted
	if (!locationInput.value && phrase != null) {
		data.push(state.data.filter((job) => job.company.toLowerCase().includes(phrase.toLowerCase())));
		data.push(state.data.filter((job) => job.position.toLowerCase().includes(phrase.toLowerCase())));
		data.push(state.data.filter((job) => job.description.toLowerCase().includes(phrase.toLowerCase())));
	}

	if (location != "" && phrase != "") {
		data.push(state.data.filter((job) => job.company.toLowerCase().includes(phrase.toLowerCase())));
		data.push(state.data.filter((job) => job.position.toLowerCase().includes(phrase.toLowerCase())));
		data.push(state.data.filter((job) => job.description.toLowerCase().includes(phrase.toLowerCase())));
		data.push(state.data.filter((job) => job.location.toLowerCase().includes(location.toLowerCase())));
	}

	if (!phrase && location != null) {
		data.push(state.data.filter((job) => job.location.toLowerCase().includes(location.toLowerCase())));
	}

	if (data.length < 1) return showAllJobs();

	let merged = [].concat.apply([], data);
	let unique = merged.filter(onlyUnique);

	container.innerHTML = "";

	console.log(unique);

	if (fullTimeCheckbox.checked) {
		console.log("checked");
		fullTimeChecked = unique.filter((job) => job.contract === "Full Time");

		fullTimeChecked.forEach((job) => {
			showJob(job);
		});
	} else {
		unique.forEach((job) => {
			showJob(job);
		});
	}
});

let loadedImgs = 12
moreButton.addEventListener('click', ()=>{
    let jobsContainer = document.querySelectorAll('.card');
     

    console.log(jobsContainer)  
    for(var j = loadedImgs; j < loadedImgs + 3; j++){
        if(jobsContainer[j]){
           jobsContainer[j].style.display = 'flex' 
        }
        
    }
    loadedImgs += 3;
    if(loadedImgs >= jobsContainer.length){
        moreButton.style.display = 'none';
    }
})

