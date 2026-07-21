import { Component } from "solid-js"

type Props = {
  progress: number
  radius: number
  stroke: number
}

const ProgressRing: Component<Props> = props => {
  const normalizedRadius = props.radius - props.stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI

  const strokeDashoffset = () =>
    circumference - props.progress * circumference

  return (
    <svg height={props.radius * 2} width={props.radius * 2}>
      <circle
        stroke="var(--color-paper-3)"
        fill="transparent"
        stroke-width={props.stroke}
        r={normalizedRadius}
        cx={props.radius}
        cy={props.radius}
      />
      <circle
        stroke="var(--color-accent)"
        fill="transparent"
        stroke-width={props.stroke}
        stroke-linecap="round"
        stroke-dasharray={`${circumference} ${circumference}`}
        style={{
          "stroke-dashoffset": strokeDashoffset(),
          transition: "stroke-dashoffset var(--dur-long) var(--ease-in-out)",
          transform: "rotate(-90deg)",
          "transform-origin": "50% 50%"
        }}
        r={normalizedRadius}
        cx={props.radius}
        cy={props.radius}
      />
    </svg>
  )
}

export default ProgressRing
