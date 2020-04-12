import React from 'react'
import { useMachine } from '@xstate/react'
import { wotMachine } from './machine'

export default ({
  children: WrappedComponent,
  url = `https://sbardian.api.stdlib.com/wotQuotes@0.0.1/?random=true`,
}) => {
  const [state, send] = useMachine(wotMachine, {
    actions: {
      fetchData: async () => {
        const response = await fetch(`${url}`)
        console.log('response', response)

        if (response.status === 200) {
          const quotes = await response.json()
          send({ type: 'RESOLVE', data: quotes })
        } else {
          send('REJECT')
          send('RETRY')
        }
      },
    },
    services: {
      testService: (context, event) => {
        console.log(event.type, ': im am the testService!: ', context)
        return new Promise((resolve, reject) =>
          resolve({ blah: 'test service resolved', something: 20 }),
        )
      },
    },
  })

  const resetFetch = () => {
    send('RESET')
    send('FETCH')
  }

  React.useEffect(() => {
    send('FETCH')
  }, [url, send])

  const bag = {
    state,
    resetFetch,
  }

  return <WrappedComponent {...bag} />
}
