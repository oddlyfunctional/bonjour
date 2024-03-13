export const Spinner = () => {
  return (
    <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
      <circle
        className="animate-spin"
        cx="400"
        cy="400"
        fill="none"
        r="200"
        stroke-width="50"
        stroke="#E387FF"
        stroke-dasharray="700 1400"
        stroke-linecap="round"
      />
    </svg>
  );
};
