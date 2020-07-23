import React from 'react'
import MoonLoader from 'react-spinners/MoonLoader'
import { css } from '@emotion/core'
import './App.css'
import WotQuotes from './components/wot-quotes'

//  `https://sbardian.api.stdlib.com/wotQuotes@0.0.1/?credit=Thom&limit=3`
//  `https://sbardian.api.stdlib.com/wotQuotes@0.0.1/?credit=Thom`
//  `https://sbardian.api.stdlib.com/wotQuotes@0.0.1/?limit=5`
//  `https://sbardian.api.stdlib.com/wotQuotes@0.0.1/?random=true`

function App() {
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `

  return (
    <div className="App">
      <header className="App-header">
        <WotQuotes
          url={`https://sbardian.api.stdlib.com/wotQuotes@0.0.1/?random=true`}
        >
          {({ state, resetFetch }) => {
            if (state.value === 'idle') return <div>idle...</div>
            if (state.value === 'loading')
              return (
                <div>
                  {' '}
                  <MoonLoader css={override} size={150} color={'#123abc'} />
                </div>
              )
            if (state.value === 'failure')
              return (
                <div>
                  failure. . . :({' '}
                  <button typ="button" onClick={() => resetFetch()}>
                    Reset
                  </button>{' '}
                </div>
              )

            // handle multiple quotes
            if (
              state.value === 'success' &&
              state?.context?.data?.quotes?.length > 0
            ) {
              const {
                context: { data },
              } = state
              return (
                <div style={{ maxWidth: '800px', margin: '20px' }}>
                  {data.quotes.map((quote) => {
                    return (
                      <div
                        key={quote.id}
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

            // handle single quotes
            if (
              state.value === 'success' &&
              state.context.data &&
              state.context.data.quote
            ) {
              const {
                context: { data },
              } = state
              return (
                <div style={{ maxWidth: '800px', margin: '20px' }}>
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
