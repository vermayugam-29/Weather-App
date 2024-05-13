const API_KEY = "0f692cbeb1e0bf89ef049c47093640a2";

const loading = document.getElementById('loading')
const err = document.getElementById('error')


const searchBarForm = document.getElementById('search-bar')
const searchBtn = document.getElementById('search-btn')
const searchInput = document.getElementById('search')


const yourWeather = document.getElementById('your-weather')
yourWeather.classList.add('changeBtn');
const grantLoc = document.getElementById('grant-location')

const output = document.getElementById('output')
const cityName = document.getElementById('cityName')
const weatherType = document.getElementById('weatherType')
const temp = document.getElementById('tempDisplay')
const image = document.getElementById('imageChange')
const speed = document.getElementById('speed')
const humidity = document.getElementById('humid')
const cloud = document.getElementById('cloud')
const flag = document.getElementById('flag')


const grantPermission = document.getElementById('grant-access')


let currentTab = yourWeather

getOldCords();

searchBarForm.addEventListener('submit' , (e) => {
    e.preventDefault()
    changeOpacity(output,0)
    // changeOpacity(loading,100)
    const city = searchInput.value.trim()
    if(city === ''){
        return;
    }
    fetchWeatherUsingCityName(city)
    searchInput.value = ''
})


searchBtn.addEventListener('click' , () => {
        changeOpacity(output,0)
    changeOpacity(searchBarForm,100);
    changeOpacity(grantLoc,0);
    searchBtn.classList.add('changeBtn')
    yourWeather.classList.remove('changeBtn');
})

yourWeather.addEventListener('click' , () => {
    changeOpacity(output,0);
    changeOpacity(loading,0);
    changeOpacity(err,0)
    changeOpacity(searchBarForm,0);
    getOldCords();
    yourWeather.classList.add('changeBtn');
    searchBtn.classList.remove('changeBtn')
})



grantPermission.addEventListener('click' , () => {
    if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                getCoordinates(position)
                changeOpacity(output,100)
            },
            (err) => {  
                changeOpacity(err,100)
                changeOpacity(grantLoc,0)
                console.error('Eroor getting location' , err)
            }
        )
    } else {
        changeOpacity(err,100)
        changeOpacity(grantLoc,0)
        console.error('Geolocation is not supported by this browser')
    }
})


function getCoordinates(position) {
    const userCords = {
        lat : position.coords.latitude,
        long : position.coords.longitude
    }
    sessionStorage.setItem('cords', JSON.stringify(userCords))
    changeOpacity(grantLoc,0)
    displayWeather(userCords)
    // changeData(userCords)
}

function displayWeather(userCoords){
    // changeOpacity(loading,100)
    fetchWeatherUsingCoords(userCoords);
    changeOpacity(grantLoc,0)
}

function changeOpacity(currDiv , opacity){
    currDiv.style.opacity = opacity;
}


function getOldCords() {
    const oldCords = sessionStorage.getItem('cords')
    if(!oldCords){
        changeOpacity(grantLoc,100);
    } else {
        displayWeather(JSON.parse(oldCords))
        changeOpacity(grantLoc,0)
    }
}





//Main code starts here ---------------------------

async function fetchWeatherUsingCityName(cityName) {
    try {
        changeOpacity(loading,100)
        const responseFromApi = await 
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
        changeOpacity(loading,0)
        const data = await responseFromApi.json();
        
        changeData(data);
        changeOpacity(err,0) 
        changeOpacity(output,100)
        return data;
    } catch (error) {
        changeOpacity(loading,0)
        changeOpacity(output,0)
        changeOpacity(err,100)
        return error;
    }
} 


async function fetchWeatherUsingCoords(coords) {
    try {
        const lat = coords.lat.toFixed(2)
        const lon = coords.long.toFixed(2)
        const responseFromApi = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        
        const data = await responseFromApi.json();
        changeData(data);
        changeOpacity(output,100)
        changeOpacity(err,0) 
        return data;
    } catch (error) {
        changeOpacity(output,0)
        changeOpacity(err,100) 
        return error;
    }
}

function changeData(data) {
    cityName.innerHTML = data.name
    weatherType.innerHTML = data.weather[0].main
    temp.innerHTML = `${data.main.temp} °C`
    image.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`
    speed.innerHTML = `${data.wind.speed} m/s`
    humidity.innerHTML = `${data.main.humidity}%`
    cloud.innerHTML = `${data.clouds.all}%`
    flag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
}
