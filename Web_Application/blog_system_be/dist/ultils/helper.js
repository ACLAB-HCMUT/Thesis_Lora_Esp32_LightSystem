"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareTime = exports.activationTime = exports.currentTime = exports.comparePass = exports.hashPassword = void 0;
exports.paginateResponse = paginateResponse;
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const saltRounds = 10;
const hashPassword = async (plainPassword) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashPassword = await bcrypt.hash(plainPassword, salt);
        return hashPassword.toString();
    }
    catch (error) {
        console.log(error);
    }
};
exports.hashPassword = hashPassword;
const comparePass = async (plainPassword, ValidPass) => {
    try {
        const isMatch = bcrypt.compare(plainPassword, ValidPass);
        return isMatch;
    }
    catch (error) {
        console.log(error);
    }
};
exports.comparePass = comparePass;
function paginateResponse(data, page, limit) {
    page = parseInt(page);
    const [result, total] = data;
    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
        statusCode: 'success',
        data: [...result],
        count: total,
        currentPage: page,
        nextPage: nextPage,
        prevPage: prevPage,
        totalPage: lastPage,
    };
}
const currentTime = () => {
    const vietnamTime = dayjs();
    return vietnamTime.format('YYYY-MM-DD HH:mm:ss');
};
exports.currentTime = currentTime;
const activationTime = () => {
    const vietnamTime = dayjs();
    const extraTime = vietnamTime.add(100, 'days');
    return extraTime.format('YYYY-MM-DD HH:mm:ss');
};
exports.activationTime = activationTime;
const compareTime = (activation_Time) => {
    const current = dayjs();
    const activateTime = dayjs(activation_Time);
    if (current.isAfter(activateTime))
        return false;
    else {
        return true;
    }
};
exports.compareTime = compareTime;
//# sourceMappingURL=helper.js.map