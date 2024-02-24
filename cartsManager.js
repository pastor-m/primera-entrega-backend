import { promises as fs } from "fs";

class CartManager {



    constructor(path){
        this.path = path;
    }

    static getRandomCode(){         //Funcion para generar un numero random que sera el ID
        const min = Math.ceil(0)    
        const max = Math.floor(9)
        let id1 = Math.floor(Math.random()*(max - min + 1)+min)
        let id2 = Math.floor(Math.random()*(max - min + 1)+min)
        let id3 = Math.floor(Math.random()*(max - min + 1)+min)
        let id = (id1.toString()).concat((id2.toString()), (id3.toString()))  //Pasando los numeros enteros a string
        return id;
    }

    static addId(array){ //Funcion para generar id especifico al producto al momento de agregarlo al carrito
        let len = array.length;
        for(let i=0;i<len; i++){
            let idc = CartManager.getRandomCode() 
            array[i].id = idc;
        }
        return array
    }

    async getCarts(){
        try {
            const content = await fs.readFile(this.path, 'utf-8');
            let contentm =  JSON.parse(content, null, 2);
            return contentm;
        } catch (error) {
            console.log("Error trying to read products", error)
        }
    }

    async addCart(object){
        let id = CartManager.getRandomCode()

        let prodWithId = CartManager.addId(object)

        let cart = {
            id: id,
            products: [prodWithId]
        }

        try {
            let currentCarts = await this.getCarts();
            currentCarts.push(cart);
            console.log(currentCarts);
            await fs.writeFile(this.path, JSON.stringify(currentCarts, null, 2))
        } catch (error) {
            console.log("Error trying to add products", error)
        }
    }

    async getCartById(cid){ 
        try {
            const list = await this.getCarts();
            let cart = list.find(element => element.id === cid)
            console.log(cart);
            return cart;
        } catch (error) {
            console.log("Error, there is no cart with the given id", error)
        }
    }

    async deleteCart(cid){ 
        try {
            const list = await this.getCarts();
            const newList = list.filter(element => element.id != cid)
            await fs.writeFile(this.path, JSON.stringify(newList, null, 2));
        } catch (error) {
            console.log("Error, there is no cart with the given id", error)
        }      
    }

    async addProduct(cid,pid){ //funcion para agregar un nuevo producto a un carrito especifico
        let newProduct = {
            product: "",
            quantity: 1,
            id: pid
        }

        try {

            const completeList = await this.getCarts();
            const cart = await this.getCartById(cid);
            const newList = completeList.filter(element => element.id !== cid)
            let cartProducts = cart.products;
            let prodIndex = cartProducts.findIndex((element)=> element.id === pid)

            if(prodIndex !== -1){ //Validacion para aumentar la cantidad o agregar nuevo producto

                let prod = cartProducts.find(element => element.id === pid)
                prod.quantity = prod.quantity+1;
                console.log(prod.quantity)
                cartProducts.filter((element)=> element.id === pid)
                console.log(cartProducts)
                cart.products = cartProducts;
                console.log(cart)
                newList.push(cart);
                console.log(newList)
                await fs.writeFile(this.path, JSON.stringify(newList,null,2))

            } else {
                cartProducts.push(newProduct);
                cart.products = cartProducts;
                newList.push(cart);
                console.log(newList)
                await fs.writeFile(this.path, JSON.stringify(newList,null,2))
            }

        } catch (error) {
            console.log("Error, there is no cart with the given id", error)
        }
    }
}

export default CartManager

export const cart = new CartManager();

