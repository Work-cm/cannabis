export default function Logo({ className = "" }) {
  const font = "var(--font-poppins), system-ui, sans-serif";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 48" fill="none" className={className} role="img" aria-label="CannabisLap.com">
      <defs>
        <linearGradient id="logoPillGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff9d2e" />
          <stop offset="1" stopColor="#b4551b" />
        </linearGradient>
      </defs>

      <rect x="2" y="10" width="60" height="28" rx="14" fill="url(#logoPillGrad)" />
      <rect x="6" y="14" width="52" height="20" rx="10" stroke="#fdf4ea" strokeOpacity="0.45" strokeWidth="1.2" strokeDasharray="2.5 2.5" />
      <circle cx="32" cy="24" r="7" fill="#fdf4ea" />

      <text x="72" y="30" fontFamily={font} fontSize="24" fontWeight="800" fill="#a3470d" letterSpacing="-0.02em">
        Cannabis<tspan fill="#ff9d2e">Lap</tspan>
      </text>
      <text x="73" y="41" fontFamily={font} fontSize="6.2" fontWeight="700" fill="#b4551b" letterSpacing="0.28em">
        PREMIUM CRAFT FLOWER · WORLDWIDE
      </text>
    </svg>
  );
}
