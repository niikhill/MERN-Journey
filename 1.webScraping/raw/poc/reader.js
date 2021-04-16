let fs =require('fs');
// let content = fs.readFileSync("f1.txt")
// console.log("Content -> "+content); 
console.log("before");
// fs.readFile("f1.txt",cb);
// function cb(err,data){
//     console.log("Content ->"+data);
// }
console.log("after");

fs.readFile('f1.txt',(err,data) => {
    if(err)throw err
    console.log("content" +data)
})