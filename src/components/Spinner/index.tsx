import { motion } from 'motion/react'

interface Props {
  resource?: string
  width?: number
  height?: number
}

const Spinner = ({ resource, width = 60, height = width }: Props) => (
  <motion.svg
    width={width}
    height={height}
    viewBox="0 0 42 42"
    xmlns="http://www.w3.org/2000/svg"
    stroke="#00703c"
    data-testid={`spinner-${resource}`}
    animate={{ rotate: 360 }}
    transition={{ duration: 1.2, ease: 'linear', repeat: Infinity }}
  >
    <g
      fill="none"
      fillRule="evenodd"
      transform="translate(3 3)"
      strokeWidth="5"
    >
      <circle strokeOpacity=".15" cx="18" cy="18" r="18" />
      <motion.circle
        cx="18"
        cy="18"
        r="18"
        strokeLinecap="round"
        initial={{ pathLength: 0.15 }}
        animate={{ pathLength: [0.15, 0.7, 0.15] }}
        transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
      />
    </g>
  </motion.svg>
)

export default Spinner
