export async function testLoop() {
  let counter = 0
  while (true) {
    console.log('big brother is watching', counter)
    const date = new Date().getSeconds()
    console.log(date)
    innerWhile: while (true) {
      console.log('i ran')
      const date = new Date().getSeconds()
      console.log(date)
      console.log(date % 3)
      if (date % 3 === 0) {
        break innerWhile
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    counter++

    // await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

await testLoop()
