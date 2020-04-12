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
        invoke: [
          {
            id: 'getUserService1',
            src: 'getUser',
            onDone: {
              actions: (context, event) =>
                console.log(event.type, ': service done: ', event),
            },
            onError: {
              actions: (context, event) =>
                console.log(event.type, ': service error: ', event),
            },
          },
          {
            id: 'getUserService2',
            src: 'getUser',
            onDone: {
              actions: (context, event) =>
                console.log(event.type, ': service done: ', event),
            },
            onError: {
              actions: (context, event) =>
                console.log(event.type, ': service error: ', event),
            },
          },
          {
            id: 'testservice',
            src: 'testService',
            onDone: {
              actions: (context, event) =>
                console.log(event.type, ': service done: ', event),
            },
            onError: {
              actions: (context, event) =>
                console.log(event.type, ': service error: ', event),
            },
          },
        ],
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
    services: {
      getUser: (context, event) => {
        console.log('im am src')
        return new Promise((resolve, reject) => resolve(20))
      },
    },
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
