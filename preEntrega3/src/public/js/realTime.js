const socket = io();

socket.on('products', (data) => {
    renderProducts(data);
});


const renderProducts = (products) => {
    const container = document.getElementById('div__container--products');
    container.innerHTML = "";
    products.forEach(e => {
        const card = document.createElement("div");
        card.innerHTML = `
        
        <div class="card col-12 m-3">
                <div class="card-body">
                <h5 class="card-title text-center">${e.title}</h5>
                <div class="d-flex justify-content-evenly">
                <p class="card-text">ID: ${e._id}</p>
                <p>$ ${e.price}</p>
                </div>
                <button class="rounded-2 col-11 btn btn-danger">Eliminar</button>
            </div>
        </div>
        
        `
        container.appendChild(card);
        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(e._id)
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
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('img').value,
        code: document.getElementById('code').value,
        stock: document.getElementById('stock').value,
        status: document.getElementById('status').value === "true",
        img: "",
        category: document.getElementById('category').value
    };
    socket.emit('addProduct', product);
}
