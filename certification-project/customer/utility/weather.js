const axios =require('axios');

const getWeather = async (lon, lat) =>{
    const apikey = 'f443d734d889d6c735762b5fedab80b1'
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?lon=${lon}&lat=${lat}&appid=${apikey}&units=metric`
    //console.log("getWeather : apiUrl : ", apiUrl)
    try{
        return await axios.get(apiUrl)
    }catch(err){
        console.log(err)
    }
}

module.exports = getWeather;