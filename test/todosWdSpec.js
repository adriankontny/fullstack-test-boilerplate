import {existsSync, unlinkSync} from 'fs'
import {Builder, By, Key} from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import {Database} from 'sqlite3'
import createServer from '../server/app'
import assert from 'assert'

let dbPath = process.env.DB = process.cwd() + '/test/test.db'

function seedDb () {
  return new Promise((resolve, reject) => {
    existsSync(dbPath) && unlinkSync(dbPath)

    const db = new Database(dbPath)

    db.run('create table todos (id integer, title text, user text)', (err) => {
      if (err) return reject(err)

      db.run("insert into todos values (1, 'one', 'Alice'), (2, 'two', 'Alice')", () => {
        db.close()
        resolve()
      })
    })
  })
}

const port = 6365

describe('todos app', () => {
  let driver
  let server

  before(async () => {
    let builder = new Builder().forBrowser('chrome')
    if (!process.env.GUI) {
      builder = builder.setChromeOptions(
        new chrome.Options().headless()
      )
    }
    driver = await builder.build()
  })

  beforeEach(async () => {
    await seedDb()
    server = createServer().listen(port)
    await driver.get('http://localhost:6365')
  })

  afterEach(() => server.close())

  context('user exists', () => {
    it('shows TODOs', async () => {
      await driver
        .findElement(By.name('user'))
        .sendKeys('Alice', Key.RETURN)

      const elements = await driver.findElements(By.css('ul li'))

      const todos = await Promise.all(elements.map(e => e.getText()))
      
      assert.deepEqual(todos, ['one', 'two'])
    })
  })

  context('user does not exist', () => {
    it('shows a "not found" message', async () => {
      await driver
        .findElement(By.name('user'))
        .sendKeys('Bob', Key.RETURN)
      
      const element = await driver.findElement(By.css('h3'))
        
      const alert = await element.getText()

      assert.equal(alert, "Could not find Bob's TODOs")
    })
  })
})
