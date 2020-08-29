# fullstack-test-boilerplate

### Quick start

1. Use the node version manager to run the proper version of `node`, by installing `nvm` and running `nvm add 13` and `nvm use`.
2. Install the proper version of `yarn` by typing `npm install -g yarn@1.22.4` or later.
3. Install dependencies with `yarn install`.
4. Run the tests with `yarn test`.
5. Tests are featured with an electron-based debugger. To use it, simply add keyword `debugger` in your code and run `yarn test-debug`.

### Rendered tests

To write tests that involve the browser, you can use libraries like `browser-monkey`.

browser-monkey example:

```
import createMonkey from 'browser-monkey/create'
import createTestDiv from 'browser-monkey/lib/createTestDiv'

let page
beforeEach(() => {
  server = createServer().listen(port)

  const $testContainer = createTestDiv()

  ReactDOM.render(
    React.createElement(App, {apiUrl: `http://localhost:${port}/`}),
    $testContainer
  )

  page = createMonkey($testContainer)
})

it('clicks', () => {
  await page.click('test')
  await page.shouldHave('clicked')
})
```

### Note

You can run both the unit and the fullstack (browser) tests with the debugger, by simply putting the word `debugger` in your code and running `yarn test-debug`. The only difference is that the browser tests will be rendered.
