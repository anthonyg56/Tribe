interface Props {
  message: string;
  color: string;
}
/**
 * A reusable component for forms to display a message
 * 
 * @param message string to display a message
 * @param color color of the form message
 * 
 * @returns 
 */
export default function FormMessage(props: Props) {
  const { color, message } = props

  const style = {
    color: `${color}`
  }

  /* We do the logic in here to simplify the parent component */
  const component = message ? <p style={style}>{message}</p> : null
  
  return (
    <div>
      {component}
    </div>
  )
}
