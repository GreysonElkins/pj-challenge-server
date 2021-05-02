import fetch from 'node-fetch'

const getNames = async (type) => {
  // must be name or surname
  let params = `?type=type=${type}&min_freq=50`
  return fetch(`https://namey.muffinlabs.com/name.json${params}`)
    .then((response) => response.json())
    .then((data) => {
      let name = data[0]
      return name
    })
    .catch((error) => {
      console.error(error)
      return type === 'name' ? 'J.' : 'Doe'
    })
}

exports.fakeUsers = async (startId, stopId) => {
  // startId should be set to the current length of users + 1
  const users = []
  console.log(`making users, please wait a moment`)
  for (let i = startId; i <= stopId; i++) {
    const first = await getNames('name')
    const second = await getNames('surname')
    users.push({
      id: i,
      firstName: first,
      lastName: second,
      email: `${first}${second}${i}@tixsee.com`,
      avatar: `https://i.pravatar.cc/150?u=${first}${second}${i}@tixsee.com`,
    })
  }
  console.log('users have been created')
  return users
}
