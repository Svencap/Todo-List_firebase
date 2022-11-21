import dayjs from "dayjs";

/**
 * Эта функция проверяет, что текущая дата идет до выбранной даты в задаче
 * @see {@link https://day.js.org/en/ Day.js} 
 * @param {string} expirationDate Дата до которой нужно выполнить задачу
 * @returns {boolean}
 */


const isOverdueDate = (expirationDate) => dayjs().isSameOrBefore(dayjs(expirationDate));

export default isOverdueDate;

