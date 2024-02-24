import express from "express"
import ProductManager from "../productManager.js";
import CartManager from "../cartsManager.js";
const PORT = 8080;
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const products = new ProductManager("./products.json");
const carts = new CartManager("./cart.json")

//Ruta inicial
app.get("/", (req, res)=>{
    
})

app.listen(PORT, ()=>{
    console.log(`Server is listening in port: ${PORT}`);
})

app.get("/api/products", async (req, res) => {
    try {
        let limit = parseInt(req.query.limit);
        let reqProducts = await products.getProducts();
        if (limit){
            res.send(reqProducts.slice(0,limit));
        } else {
            res.send(reqProducts);
        }
    } catch (error) {
        res.send("No products found", error)
    }

})

app.get("/api/products/:pid", async (req,res) => {
    try {
        let id = req.params.pid;
        let reqProducts = await products.getProductById(id);

        if(!reqProducts){
            res.send("Product not found")
        } else {
            res.send(reqProducts)
        }
    } catch (error) {
        res.send("Server error",error)
    }
})

app.post("/api/products", async (req,res)=>{
    try {
        let newProduct = req.body;
        await products.addProduct(newProduct);
        res.send({status: "success", message: "product added"})
    } catch (error) {
        res.send("Server error",error)
    }
})

app.put("/api/products/:pid", async (req,res)=>{
    let {pid} = req.params;
    let {title,description,code,price,status,stock,category,thumbnails} = req.body;
    let prod = await products.getProducts();
    let prodIndex = prod.findIndex((product) => product.id === pid)
    
    if(prodIndex != -1){
        await products.updateProduct(pid,"title",title);
        await products.updateProduct(pid,"description",description);
        await products.updateProduct(pid,"code",code);
        await products.updateProduct(pid,"price",price);
        await products.updateProduct(pid,"status",status);
        await products.updateProduct(pid,"stock",stock);
        await products.updateProduct(pid,"category",category);
        await products.updateProduct(pid,"thumbnails",thumbnails);
        res.send({status: "success", message: "product updated"})
    } else{
            res.sendStatus(404).send({status: "error", message: "producto no encontrado"})
    }

})

app.delete("/api/products/:pid", async (req,res)=>{
    try {
        let {id} = req.params;
        await products.deleteProduct(id);
    } catch (error) {
        res.send("Server error",error)
    }
})

app.post("/api/carts", async (req,res)=>{
    try {
        let newCart = req.body;
        console.log(newCart)
        console.log(newCart.products)
        let newList = await carts.addCart(newCart.products);
        console.log(newList)
        res.send({status: "success", message: "product added"})
    } catch (error) {
        console.log("error linea 100")
        res.sendStatus(404).send({status: "error", message: "producto no encontrado"})
    }
})

app.get("/api/carts/:cid",async (req,res)=>{
    try {
        let {cid} = req.params;
        let cart = await carts.getCartById(cid);
        res.send(cart.products)
        
    } catch (error) {
        res.send("Server error",error)
    }
})

app.post("/:cid/product/:pid", async (req,res)=>{
    try {
        let {cid,pid} = req.params;
        await carts.addProduct(cid,pid);
        res.send(carts)
    } catch (error) {
        res.send("Server error",error)
    }
})
