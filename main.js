var express = require('express')
// { ObjectId } = require('mongodb')
var app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true}))

//var url = 'mongodb://127.0.0.1:27017' //địa chỉ mongodb
var url = 'mongodb+srv://GCH200087:gch200087@cluster0.tkcln.mongodb.net/?retryWrites=true&w=majority' //database online trên mongodb 

var MongoClient = require('mongodb').MongoClient;

app.get('/edit/:id', async (req, res)=>{ //hàm này để xác định và lấy thông tin sp cần sửa 
    const id = req.params.id //keyword 'params' dùng để lấy id sản phẩm cần sửa, cái id ngay dòng trên, gán nó vào 1 biến id  
    let client = await MongoClient.connect(url)
    let dbo = client.db("GCH1005")
    var ObjectId = require('mongodb').ObjectId
    let condition = {"_id" : new ObjectId(id)}; //điều kiện tìm sp, id muốn sửa 
    const prod = await dbo.collection("products").findOne(condition)
    res.render('edit', {prod:prod}) // keyword 'redirect': từ khóa chuyển hướng 
})

app.post('/edit', async(req, res)=>{ //hàm này để post thông tin sp đã được sửa lên database 
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picURL = req.body.picURL
    const id = req.body.id
    let client = await MongoClient.connect(url)
    let dbo = client.db("GCH1005")
    var ObjectId = require('mongodb').ObjectId
    let condition = {"_id" : new ObjectId(id)};
    const newValues = {$set : {name:name, price:price, picURL:picURL}} //để tránh vc viết dài quá, nên khai báo 1 biến mới //name:name -> cái đầu tiên là tên trong table products, cài thứ 2 là giá trị được nhập vào mà đã gán ở trên txtName, phần còn lại giống thế 
    await dbo.collection("products").updateOne(condition, newValues)
    res.redirect('/')
})

app.post('/add', async (req, res)=>{ //để add thì ta có post (để đẩy dữ liệu input lên database GCH1005 ) và get (để lấy dữ liệu)
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picURL = req.body.picURL
    //Check input
    if(name.length <=5){
        res.render('add', {name_err:'Need 5 characters'})
        return
    }

    //
    const newProduct = {
        'name' : name,
        'price' : price,
        'picURL' : picURL
    }
    let client = await MongoClient.connect(url)
    let dbo = client.db("GCH1005")
    await dbo.collection("products").insertOne(newProduct) //2 dòng này nghĩa là: sau khi đã insert vào bảng products xong thì chuyển hướng về trang home // từ khóa await --> nghĩa là sau khi insert thành công thì đến dòng lệnh tiếp theo 
    res.redirect('/') // keyword 'redirect': từ khóa chuyển hướng 
})

app.get('/add', (req, res)=>{
    res.render('add')
} )

app.get('/delete/:id', async (req, res)=>{ //:id --> id trên trang url, nghĩa là id từ trang main.hbs
    const id = req.params.id //keyword 'params' dùng để lấy id sản phẩm cần xóa, cái id ngay dòng trên, gán nó vào 1 biến id  
    let client = await MongoClient.connect(url)
    let dbo = client.db("GCH1005")
    var ObjectId = require('mongodb').ObjectId
    let condition = {"_id" : new ObjectId(id)};
    await dbo.collection("products").deleteOne(condition) //để xóa trong table products, dùng cú pháp deleteOne
    res.redirect('/') // keyword 'redirect': từ khóa chuyển hướng 
})


app.get('/', async (req, res)=>{ //để dùng đc hàm await thì cần hàm async để hỗ trợ
    let client = await MongoClient.connect(url) //kết nối tới server thông qua url //keyword: await --> sau khi chạy xong dòng lệnh, nghĩa là sau khi kết nối xong thì mới thực hiện các bước tiếp theo
    let dbo = client.db('GCH1005') // truy cập tới database GCH1005
    let products = await dbo.collection("products").find().toArray();  // toArray: chuyển thành mảng //trong database GCH1005 có nhiều bảng, cú pháp trên để tìm bảng chỉ định: products
    res.render('main',{'products':products})
})

//const PORT = 3500
const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log("Server running at " + PORT)
})
