export default function LoadingIndicator() {
    return <div style={{ width: '100%', display: 'flex', justifyContent: "center" }}>
        <img src='https://junglejims.com/wp-content/uploads/soup.gif' style={{
            width: "40px",
            filter: `drop-shadow(0 2px 1px rgba(0, 0, 0, 0.4))
                     drop-shadow(1px 4px 5px rgba(0, 0, 0, 0.2))`
        }} />
    </div>

}