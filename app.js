const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const vaciar = document.getElementById('vaciar-carrito');
const templateCard = document.getElementById('template-card').content;
const templateCarrito = document.getElementById('template-carrito').content;
const templateFooter = document.getElementById('template-footer').content;
const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener('DOMContentLoaded', () => {
    fecthData();
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }
})

cards.addEventListener('click', e => {
    addCarrito(e);
})

items.addEventListener('click', (e) => {
    btnAccion(e);
})

const fecthData = async () => {
    try {
        const res = await fetch('api.json');
        const data = await res.json();
        pintarCards(data);
    } catch (error) {
        console.log(error);
    }
}

const pintarCards = (data) => {
    data.forEach(item => {
        templateCard.querySelector('img').src = item.thumbnailUrl;
        templateCard.querySelector('h5').textContent = item.title;
        templateCard.querySelector('p').textContent = item.precio;
        templateCard.querySelector('button').dataset.id = item.id;
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    })

    cards.appendChild(fragment);
}

const addCarrito = e => {
    if (e.target.classList.contains('btn-primary')) {
        setCarrito(e.target.parentElement);
    }
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('button').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }

    carrito[producto.id] = producto;
    pintarCarrito();
}

const pintarCarrito = () => {
    items.innerHTML = '';
    Object.values(carrito).forEach(item => {
        templateCarrito.querySelector('th').textContent = item.id;
        templateCarrito.querySelectorAll('td')[0].textContent = item.title;
        templateCarrito.querySelectorAll('td')[1].textContent = item.cantidad;
        templateCarrito.querySelector('.btn-info').dataset.id = item.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = item.id;
        templateCarrito.querySelector('span').textContent = item.cantidad * item.precio;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone)
    })
    items.appendChild(fragment);
    pintarFooter();
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

const pintarFooter = () => {
    footer.innerHTML = '';
    let contador = 0;
    let total = 0;
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = '<th scope="row" colspan="5"></th>'
        return
    }
    Object.values(carrito).forEach(item => {
        contador += item.cantidad;
        total += (item.cantidad * Number(item.precio));
    });

    templateFooter.querySelectorAll('td')[0].textContent = contador;
    templateFooter.querySelector('span').textContent = total;
    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);
    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        console.log("CLICKKKK");
        carrito = {}
        pintarCarrito();
    })
}

const btnAccion = e => {
    if (e.target.classList.contains('btn-info')) {
        carrito[e.target.dataset.id].cantidad++;
        pintarCarrito();
    }
    if (e.target.classList.contains('btn-danger')) {
        carrito[e.target.dataset.id].cantidad--;
        if (carrito[e.target.dataset.id].cantidad === 0) delete carrito[e.target.dataset.id];
        pintarCarrito();
    }

    e.stopPropagation();
}