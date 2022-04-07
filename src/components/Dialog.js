import styled from 'styled-components'

const Container = styled.div`
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
    0 2px 6px 2px rgba(60, 64, 67, 0.15);
  border-radius: 5px;
`

export default function Dialog({ className, children }) {
  return <Container className={className}>{children}</Container>
}
