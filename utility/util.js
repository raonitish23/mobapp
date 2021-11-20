const bcrypt = require("bcrypt");
const saltRounds = 10;
var generator = require("generate-password");

module.exports = {
    getBcryptPassword: function (password) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPassword = bcrypt.hashSync(password, salt);
        return hashPassword;
    },

    comparePassword: function (input_password, hashPassword) {

        return bcrypt.compareSync(input_password, hashPassword);
    },

    getGeneratePassword: function () {
        var password = generator.generate({
            length: 8,
            numbers: true,
            uppercase: true,
            lowercase: true,
            symbols: true,
            excludeSimilarCharacters: true,
            exclude: [',', '"', '{', '}', '[', ']', '.', '/', '+', '-', ')', '(', '%', '|', '`', '~', ';', '^', '*', '=', ':']
        });
        return password;
    },
}