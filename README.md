# dd-trace-restify-asynclocalstorage

Small example to demonstrate dd-trace is breaking AsyncLocalStorage when using it in a restify **global** middleware.

Steps to reproduce:

I tried w/ node 14, 16, 17, doesn't matter it's always the same behavior, thus I haven't prepared a Dockerfile.

If you start the application using `yarn run:restify:without:datadog` or `yarn run:express:with:datadog` the context is accessible but when running `yarn run:restify:with:datadog` the context suddenly becomes undefined. As soon as you change the implementation to using a dedicated middleware as in:

```typescript 
app.get('/', middleware, (req, res, next) => { ... })
```

the context keeps intact, while using a global middleware as in

```typescript
app.use(middleware)
app.get('/', (req, res, next) => {})
```

breaks it.