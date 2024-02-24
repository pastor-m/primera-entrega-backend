import { promises as fs } from "fs";
import { stringify } from "querystring";

class ProductManager {

    
    
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

    async getProducts(){ //Metodo para recibir productos en el array
        try {
            const content = await fs.readFile(this.path, 'utf-8');
            let contentm =  JSON.parse(content, null, 2);
            return contentm;
        } catch (error) {
            console.log("Error trying to read products", error)
        }
    }
    
    async addProduct(object){  //Metodo para agregar los productos, 

        let id = ProductManager.getRandomCode()  //Se llama a la funcion para generar ID
        
        let element = { //El objeto a agregar al array, recibe los parametros del metodo
            title: object.title,
            description: object.description,
            code: object.code,
            price: object.price,
            status: object.status,
            stock: object.stock,
            thumbnail: object.thumbnail,
            id: id
        }

        try {
            let currentProducts = await this.getProducts();
            currentProducts.push(element);
            console.log(currentProducts)
            await fs.writeFile(this.path, JSON.stringify(currentProducts, null, 2));
        } catch (error) {
            console.log("Error trying to add products", error)
        }
    }

    async getProductById(idu){  //Metodo para obtener un elemento por su ID

        try {
            const list = await this.getProducts();
            let result = list.find(element => element.id === idu);
            return result;
        } catch (error) {
            console.log("Error, there is no product with the given id", error)
        }

    }

    async deleteProduct(idu){ //Metodo para borrar un producto del array a partir de su id
        try {
            const list = await this.getProducts();
            const newList = list.filter(element => element.id != idu);
            await fs.writeFile(this.path, JSON.stringify(newList, null, 2));

        } catch (error) {
            console.log("Error, no existe producto con ese id", error)
        }
    }

    async updateProduct(idu, propName, value){ //Metodo para actualizar el array
        try {
            const objMod = await this.getProductById(idu);
            const objDeleted = await this.deleteProduct(idu);
            const list = await this.getProducts();
            const newList = list.filter(element => element.id != idu)
            objMod[propName] = value;
            newList.push(objMod);
            console.log(newList)
            await fs.writeFile(this.path, JSON.stringify(newList, null, 2))

        } catch (error) {
            console.log("Error, no existe producto a modificar", error)
        }
    }
    

}

export default ProductManager

export const prodMan = new ProductManager();
//prodMan.addProduct('producto prueba', 'prueba', '200', 'sin imagen', 'abc1', '25')
//prodMan.updateProduct('085','title', 'hello2');
//prodMan.deleteProduct('085')

