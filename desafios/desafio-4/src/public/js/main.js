
const socket = io();

socket.on('products', (data) => {
    renderProducts(data.products);
});


const renderProducts = (products) => {
    const container = document.getElementById('div__container--products');
    container.innerHTML = "";
    products.forEach(e => {
        const card = document.createElement("div");
        card.innerHTML = `
        
        <div class="card col-4 m-3" style="width: 18rem;">
                <div class="card-body">
                <h5 class="card-title text-center">${e.title}</h5>
                <div class="d-flex justify-content-evenly">
                <p class="card-text">ID: ${e.id}</p>
                <p>$ ${e.price}</p>
                </div>
                <button class="rounded-2 col-11">Eliminar</button>
            </div>
        </div>
        
        `
        container.appendChild(card);
        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(e.id)
        })
    });

}

const deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
}

document.getElementById('btn__AddProduct').addEventListener('click', () => {
    addProduct();
})

const addProduct = () => {
    const product = {
        title: document.getElementById('title').value,
        desciption: document.getElementById('description').value,
        price: document.getElementById('price').value,
        img: document.getElementById('img').value,
        code: document.getElementById('code').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value,
        status: document.getElementById('status').value === "true"
    };
    socket.emit('addProduct', product);
}