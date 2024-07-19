class userDTO{
    constructor(user){
        this.name = user.first_name;
        this.last_name = user.last_name;
        this.role = user.role;
    }
}

module.exports = userDTO;