const generateResetTocken = () =>{
    const token = Math.floor(Math.random()* (999999 - 100000 + 1)) + 100000;
    return generateResetTocken.toString(token);
}

module.exports = generateResetTocken;