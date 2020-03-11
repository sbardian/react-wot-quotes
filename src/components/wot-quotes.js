import React from 'react'
import { useMachine } from '@xstate/react'
import { wotMachine } from './machine'

export default ({
  children: WrappedComponent,
  credit = null,
  limit = null,
  random = false,
}) => {
  const [state, send] = useMachine(wotMachine)
  const [data, setData] = React.useState({ quotes: [] })

  let fetchUrl = ''
  if (credit && limit) {
    fetchUrl = `https://sbardian.api.stdlib.com/wotQuotes@0.0.1/?credit=${credit}&limit=${limit}`
  }
  if (credit && !limit) {
    fetchUrl = `https://sbardian.api.stdlib.com/wotQuotes@0.0.1/?credit=${credit}`
  }
  if (limit && !credit) {
    fetchUrl = `https://sbardian.api.stdlib.com/wotQuotes@0.0.1/?limit=${limit}`
  }
  if (random && !credit && !limit) {
    fetchUrl = `https://sbardian.api.stdlib.com/wotQuotes@0.0.1/?random=true`
  }

  React.useEffect(() => {
    fetch(`${fetchUrl}`)
      .then((response, err) => {
        send('FETCH')
        if (err) {
          send('REJECT')
        }
        return response.json()
      })
      .then(myJson => {
        setData(myJson)
        send('RESOLVE')
      })
  }, [])

  const bag = {
    state,
    data,
  }

  return <WrappedComponent {...bag} />
}
