"use client"

interface Props {
  password: string;
}

/**
 * This components takes a new users password and through regex, validates certain parameters
 * 
 * @param password password that was typed and needs to be validated
 * 
 * @returns A jsx component
 */
const PasswordRequirements = (props: Props) => {
  /* function that validates the password passed in the props */
  const vallidatePassword = () => {
    const isEightChars = /^[A-Za-z\d@$!%*?&-]{8,16}$/
    const isOneUpperChar = /[A-Z]/
    const isOneLowerChar = /[a-z]/
    const isOneSpecialChar = /[@$!%*?&-]/
    const isOneNum = /\d/

    return {
      isOneNum: isOneNum.test(props.password),
      eightChars: isEightChars.test(props.password),
      isOneUpperChar: isOneUpperChar.test(props.password),
      isOneLowerChar: isOneLowerChar.test(props.password),
      isOneSpecialChar: isOneSpecialChar.test(props.password),
    }
  }

  const PWRequirementsContainer = (props: {children: React.ReactNode}) => {
    const styles: React.CSSProperties = {
      position: 'absolute',
      left: '0',
      margin: '0 10px',
      backgroundColor: '#DCDCDC',
      borderRadius: '8px',
    }

    return (
      <div style={styles}>
        {props.children}
      </div>
    )
  }

  const ULContainer = (props: {children: React.ReactNode}) => {
    const styles = {
      listStyleType: 'none',
      padding: '15px',
      fontFamily: `'IBM Plex Sans', sans-serif`,
    }

    return (
      <div style={styles}>
        {props.children}
      </div>
    )
  }

  return (
    <PWRequirementsContainer>
      <ULContainer>
        <li style={{ color: vallidatePassword().eightChars ? 'green' : '#FF4500', margin: '0px 0px 5px 0px' }}>- Password must be a minimum eight characters</li>
        <li style={{ color: vallidatePassword().isOneUpperChar ? 'green' : '#FF4500' }}>- At least one uppercase letter</li>
        <li style={{ color: vallidatePassword().isOneLowerChar ? 'green' : '#FF4500' }}>- One lowercase letter</li>
        <li style={{ color: vallidatePassword().isOneSpecialChar ? 'green' : '#FF4500' }}>- One special character (@,$,!,%,*,?,&,-)</li>
        <li style={{ color: vallidatePassword().isOneNum ? 'green' : '#FF4500', margin: '5px 0px 0px 0px' }}>- One number</li>
      </ULContainer>
    </PWRequirementsContainer>
  )
};

export default PasswordRequirements