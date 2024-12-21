import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone.js';
const saltRounds = 10;

export const hashPassword = async (plainPassword: string) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(plainPassword, salt);
    return hashPassword.toString();
  } catch (error) {
    console.log(error);
  }
};

export const comparePass = async (plainPassword: string, ValidPass: string) => {
  try {
    const isMatch = bcrypt.compare(plainPassword, ValidPass);
    return isMatch;
  } catch (error) {
    console.log(error);
  }
};

export function paginateResponse(data, page, limit) {
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

export const currentTime = () => {
  const vietnamTime = dayjs();
  return vietnamTime.format('YYYY-MM-DD HH:mm:ss');
};

export const activationTime = () => {
  const vietnamTime = dayjs();
  const extraTime = vietnamTime.add(100, 'days');
  return extraTime.format('YYYY-MM-DD HH:mm:ss');
};

export const compareTime = (activation_Time: string): boolean => {
  const current = dayjs();
  const activateTime = dayjs(activation_Time);
  if (current.isAfter(activateTime)) return false;
  else {
    return true;
  }
};
