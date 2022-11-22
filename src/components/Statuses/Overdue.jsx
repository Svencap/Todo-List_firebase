/**
 * @desc Задача просрочена
 */

const OverdueStatus = () => (
  <div className="task_status_late">
    Просрочено
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1856_2284)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM5.25 2.25C5.25 1.83579 5.58579 1.5 6 1.5C6.41421 1.5 6.75 1.83579 6.75 2.25V5.25H9C9.41421 5.25 9.75 5.58579 9.75 6C9.75 6.41421 9.41421 6.75 9 6.75H6C5.58579 6.75 5.25 6.41421 5.25 6V2.25Z"
          fill="#FFFFFF"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_1856_2284">
          <rect width="12" height="12" fill="white"></rect>
        </clipPath>
      </defs>
    </svg>
  </div>
);
export default OverdueStatus;