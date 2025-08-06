export default function NotFound() {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      fontFamily: 'system-ui',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '6rem', margin: '0', color: '#666' }}>404</h1>
      <h2 style={{ margin: '1rem 0' }}>Page Not Found</h2>
      <p style={{ color: '#666', margin: '1rem 0' }}>
        Sorry, the page you are looking for does not exist.
      </p>
      <a 
        href="/"
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          marginTop: '1rem'
        }}
      >
        Go back home
      </a>
    </div>
  )
}
