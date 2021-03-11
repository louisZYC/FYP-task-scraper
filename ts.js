[[1, 2], [2, 3], [3, 4]].map((...arg) => {
    return print(...arg)
})

function print(x,y) {
    console.log(x)
    console.log(y)
}