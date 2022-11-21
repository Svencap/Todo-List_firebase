import dayjs from "dayjs";

const isOverdueDate = (expirationDate) => dayjs().isSameOrBefore(dayjs(expirationDate));

export default isOverdueDate;

