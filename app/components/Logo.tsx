interface LogoProps {
  size?: number;
}

export default function Logo({ size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="HowToUseMyAI logo"
    >
      {/* Magnifying glass circle — blue fill */}
      <circle cx="13" cy="13" r="9" fill="#1877F2" />
      {/* Inner white circle to create ring effect */}
      <circle cx="13" cy="13" r="6.5" fill="white" />
      {/* Lightning bolt inside the circle */}
      <path
        d="M14.5 9.5L11.5 13.5H14L12.5 17L16 12.5H13.5L14.5 9.5Z"
        fill="#1877F2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Handle — red, rounded */}
      <line
        x1="20"
        y1="20"
        x2="27"
        y2="27"
        stroke="#e41e3f"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
