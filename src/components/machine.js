import { Machine, assign } from 'xstate'

export const wotMachine = Machine(
  {
    id: 'fetch',
    initial: 'idle',
    context: {
      retries: 0,
      data: {},
    },
    states: {
      idle: {
        on: {
          FETCH: {
            target: 'loading',
          },
        },
      },
      loading: {
        on: {
          RESOLVE: {
            target: 'success',
            actions: assign({
              data: (context, event) => event.data,
            }),
          },
          REJECT: {
            target: 'failure',
          },
        },
        entry: ['fetchData', 'logContext'],
      },
      success: {
        on: {
          RESET: {
            target: 'idle',
            actions: assign({
              retries: 0,
            }),
          },
        },
        entry: ['logContext'],
      },
      failure: {
        on: {
          RETRY: {
            target: 'loading',
            actions: assign({
              retries: (context, event) => context.retries + 1,
            }),
            cond: 'retryFetch',
          },
          RESET: {
            target: 'idle',
            actions: assign({
              retries: 0,
            }),
            cond: 'resetFetch',
          },
        },
        entry: ['logContext'],
      },
    },
  },
  {
    actions: {
      logContext: (context, event) =>
        console.log('event: ', event.type, ', context: ', context),
    },
    guards: {
      retryFetch: (context, event) => {
        return context.retries <= 2
      },
      resetFetch: (context, event) => {
        return context.retries >= 2
      },
    },
  },
)
