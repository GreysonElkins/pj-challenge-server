import express from 'express'
import cors from 'cors'
import { fakeUsers } from './fakeUsers'

const app = express()


app.locals.realUsers = [
  {
    firstName: 'Greyson',
    lastName: 'Elkins',
    id: 1,
    email: 'greysonelkins@localhost:3000',
    avatar:
      'https://scontent.fapa1-2.fna.fbcdn.net/v/t1.6435-9/67871819_2434063816830946_7127810300035727360_n.jpg?_nc_cat=105&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=BtL3Os_N_zkAX-LZUEZ&_nc_ht=scontent.fapa1-2.fna&oh=cb4b13d13d71a7aa63a049245a407e74&oe=60B383F2',
    products: [1]
  },
  {
    firstName: 'Travis',
    lastName: 'Baker',
    id: 2,
    email: 'travisbaker@tixsee.com',
    avatar:
      'https://media-exp1.licdn.com/dms/image/C4E03AQGcSBB74JovWw/profile-displayphoto-shrink_200_200/0/1544638571448?e=1625097600&v=beta&t=XZXB7Ksfct7sQ7bXXKNO8qVhiIynj399NGI05KRcpCo',
  },
]
app.locals.users = []

fakeUsers().then(users => app.locals.users = [...app.locals.users, ...users])

app.locals.products = [
  {
    id: 1,
    name: 'The perfect example of a website',
    description: "It works but it doesn't tell you much",
    price: '$100',
    image: '',
  },
  {
    id: 2,
    name: 'A perfect egg',
    description: 'Nearly golden, still edible',
    price: '$550',
    image:
      'https://image.shutterstock.com/image-illustration/golden-egg-row-isolated-on-600w-1012007863.jpg',
  },
]

app.use(cors())
app.use(express.json())

app.post('/login', (request, response) => {
  const { email } = request.body
  const matchedUser = app.locals.users.filter(user => user.email === email)
  if (!email) {
    return response.status(400).send('You must provide an email to login.')
  }
  if (matchedUser.length === 0) {
    return response.status(404).json("That email wasn't found")
  }
  if (matchedUser.length > 0) return response.status(200).json(matchedUser[0])
    // technically there is a possibility of there being more than one matched user with random data
    // ideally there'd be a safety in the DB against this
})

app.get('/users', async (request, response) => {
  const { authorization } = request.headers
  const allEmails = app.locals.users.map(({ email }) => email)
  if (!allEmails.includes(authorization)) return response.status(401)
  return response.status(200).json(app.locals.users)
})

app.set('PORT', process.env.PORT || 8080)

app.listen(app.get('PORT'), () => {
  fakeUsers(3, 50).then(users => {
    app.locals.users = [ ...app.locals.realUsers, ...users ]
  })
  console.log(`The server is running on http://localhost:${app.get('PORT')} 💪`)
})

