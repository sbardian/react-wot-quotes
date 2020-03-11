import React from 'react'
import './App.css'
import WotQuotes from './components/wot-quotes'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <WotQuotes random={true}>
          {({ state, data }) => {
            if (state.value === 'idle') return <div>idle...</div>
            if (state.value === 'loading') return <div>fetching data!</div>
            if (state.value === 'failure') return <div>failure. . . :( </div>
            if (
              state.value === 'success' &&
              data &&
              data.quotes &&
              data.quotes.length > 0
            ) {
              return (
                <div style={{ maxWidth: '800px' }}>
                  {data.quotes.map(quote => {
                    return (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateRows: '1fr 1fr',
                          marginBottom: '60px',
                          alignContent: 'start',
                        }}
                      >
                        <div>{`"${quote.quote}"`}</div>
                        <div
                          style={{
                            justifySelf: 'end',
                          }}
                        >{`-- ${quote.credit}`}</div>
                      </div>
                    )
                  })}
                </div>
              )
            }
            if (state.value === 'success' && data && data.quote) {
              return (
                <div style={{ maxWidth: '800px' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateRows: '1fr 1fr',
                      marginBottom: '60px',
                      alignContent: 'start',
                    }}
                  >
                    <div>{`"${data.quote}"`}</div>
                    <div
                      style={{
                        justifySelf: 'end',
                      }}
                    >{`-- ${data.credit}`}</div>
                  </div>
                </div>
              )
            }
            return <div>Attempting to fetch quote.</div>
          }}
        </WotQuotes>
      </header>
    </div>
  )
}

export default App
