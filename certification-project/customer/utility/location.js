const iplocate = require("node-iplocate");
const publicIp = require('public-ip');

const userloc = async ()=>{
    try{
        const ip = await publicIp.v4()
        //console.log("ip : ", ip)
        return await iplocate(ip)    
    }catch(err){
        console.log(err)
    }
}

module.exports = userloc;