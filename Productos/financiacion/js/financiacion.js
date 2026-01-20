// Productos data
const productos = [
    {
        id: 'panel-solar',
        nombre: 'Panel Solar',
        precio: 'CONSULTAR PRECIO',
        precioConIva: '',
        imagen: '../../Energias-renovables/img/PanelesSolares.jpg',
        descripcion: 'Panel solar fotovoltaico de alta eficiencia para generación de energía renovable. Fabricado con células monocristalinas de última generación.'
    },
    {
        id: 'inversor-solar',
        nombre: 'Inversor Solar',
        precio: '$5.500.000',
        precioConIva: '$7.000.000 con IVA e Impuestos',
        imagen: '../../Energias-renovables/img/Grupo Electrogeno.jpg',
        descripcion: 'Inversor de alta eficiencia para sistemas solares fotovoltaicos. Convierte la energía DC de los paneles solares en corriente alterna (AC).'
    },
    {
        id: 'kit-solar',
        nombre: 'Kit Solar Completo',
        precio: '$6.600.000',
        precioConIva: '$8.400.000 con IVA e Impuestos',
        imagen: '../../Energias-renovables/img/Equipo_todo_en_uno.jpg',
        descripcion: 'Kit completo de energía solar con paneles, inversor y baterías. Solución todo en uno para tu hogar o negocio.'
    },
    {
        id: 'soportes-coplanar',
        nombre: 'Soportes Coplanar',
        precio: 'CONSULTAR PRECIO',
        precioConIva: '',
        imagen: '../../Energias-renovables/img/Soportes_coplanar.jpg',
        descripcion: 'Soportes de montaje colplanar de alta calidad para paneles solares. Diseñados para instalaciones en techos y estructuras planas.'
    },
    {
        id: 'cables-fotovoltaicos',
        nombre: 'Cables Fotovoltaicos',
        precio: 'CONSULTAR PRECIO',
        precioConIva: '',
        imagen: '../../Energias-renovables/img/Cableado especial.jpg',
        descripcion: 'Cables fotovoltaicos de alta calidad diseñados específicamente para sistemas solares. Fabricados con materiales resistentes a la intemperie.'
    },
    {
        id: 'portable-power-station',
        nombre: 'Portable Power Station',
        precio: 'CONSULTAR PRECIO',
        precioConIva: '',
        imagen: '../../Energias-renovables/img/Banco_de_energia.jpg',
        descripcion: 'Estación de energía portátil de alta capacidad para uso doméstico y exterior. Ideal para camping, emergencias y respaldo energético.'
    }
];

// Estado de la aplicación
let productoSeleccionado = null;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarProductos();
    inicializarEventos();
    inicializarFormulario();
    inicializarDropdown();
});

// Inicializar productos
function inicializarProductos() {
    renderizarDropdown();
    // Preseleccionar Inversor Solar
    seleccionarProducto('inversor-solar');
}

// Renderizar productos en el dropdown
function renderizarDropdown() {
    const dropdownList = document.getElementById('productsDropdownList');
    if (!dropdownList) return;

    dropdownList.innerHTML = productos.map((producto, index) => `
        <div class="dropdown-product-item" data-product-id="${producto.id}" data-index="${index}">
            <div class="dropdown-product-image">
                <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
            </div>
            <div class="dropdown-product-info">
                <h4 class="dropdown-product-name">${producto.nombre}</h4>
                <p class="dropdown-product-description">${producto.descripcion}</p>
                <p class="dropdown-product-price">${producto.precio}</p>
            </div>
            <div class="dropdown-product-check">
                <i class="fas fa-check-circle"></i>
            </div>
        </div>
    `).join('');

    // Agregar event listeners a los items del dropdown
    const items = dropdownList.querySelectorAll('.dropdown-product-item');
    items.forEach(item => {
        item.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            seleccionarProducto(productId);
            cerrarDropdown();
        });

        // Soporte para teclado
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Seleccionar ${item.querySelector('.dropdown-product-name').textContent}`);
        
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const productId = this.getAttribute('data-product-id');
                seleccionarProducto(productId);
                cerrarDropdown();
            }
        });
    });
}

// Actualizar el card principal
function actualizarMainCard(producto) {
    const mainImage = document.getElementById('mainProductImage');
    const mainName = document.getElementById('mainProductName');
    const mainDescription = document.getElementById('mainProductDescription');
    const mainPrice = document.getElementById('mainProductPrice');
    const mainCard = document.getElementById('mainProductCard');

    if (!mainImage || !mainName || !mainDescription || !mainPrice || !mainCard) return;

    if (producto) {
        mainImage.src = producto.imagen;
        mainImage.alt = producto.nombre;
        mainName.textContent = producto.nombre;
        mainDescription.textContent = producto.descripcion;
        mainPrice.textContent = `${producto.precio} - ${producto.precioConIva}`;
        mainPrice.style.display = 'block';
        mainCard.classList.add('selected');
    } else {
        mainImage.src = '';
        mainImage.alt = 'Selecciona un producto';
        mainName.textContent = 'Selecciona un producto';
        mainDescription.textContent = 'Haz clic para ver todas las opciones disponibles';
        mainPrice.style.display = 'none';
        mainCard.classList.remove('selected');
    }
}

// Inicializar dropdown
function inicializarDropdown() {
    const mainCard = document.getElementById('mainProductCard');
    const dropdown = document.getElementById('productsDropdown');
    
    if (!mainCard || !dropdown) return;

    // Toggle dropdown al hacer click en el card principal
    mainCard.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown();
    });

    // Soporte para teclado
    mainCard.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
        }
    });

    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!mainCard.contains(e.target) && !dropdown.contains(e.target)) {
            cerrarDropdown();
        }
    });

    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && dropdown.classList.contains('open')) {
            cerrarDropdown();
        }
    });
}

// Toggle dropdown
function toggleDropdown() {
    const dropdown = document.getElementById('productsDropdown');
    const mainCard = document.getElementById('mainProductCard');
    
    if (!dropdown || !mainCard) return;

    const isOpen = dropdown.classList.contains('open');
    
    if (isOpen) {
        cerrarDropdown();
    } else {
        abrirDropdown();
    }
}

// Abrir dropdown
function abrirDropdown() {
    const dropdown = document.getElementById('productsDropdown');
    const mainCard = document.getElementById('mainProductCard');
    
    if (!dropdown || !mainCard) return;

    dropdown.classList.add('open');
    mainCard.classList.add('active');
    mainCard.setAttribute('aria-expanded', 'true');
}

// Cerrar dropdown
function cerrarDropdown() {
    const dropdown = document.getElementById('productsDropdown');
    const mainCard = document.getElementById('mainProductCard');
    
    if (!dropdown || !mainCard) return;

    dropdown.classList.remove('open');
    mainCard.classList.remove('active');
    mainCard.setAttribute('aria-expanded', 'false');
}

// Seleccionar un producto
function seleccionarProducto(productId) {
    const producto = productos.find(p => p.id === productId);
    if (!producto) return;

    productoSeleccionado = producto;

    // Actualizar card principal
    actualizarMainCard(producto);

    // Actualizar UI de los items del dropdown
    const items = document.querySelectorAll('.dropdown-product-item');
    items.forEach(item => {
        if (item.getAttribute('data-product-id') === productId) {
            item.classList.add('selected');
            item.setAttribute('aria-selected', 'true');
        } else {
            item.classList.remove('selected');
            item.setAttribute('aria-selected', 'false');
        }
    });

    // Mostrar producto seleccionado en el formulario
    mostrarProductoSeleccionado(producto);

    // Habilitar botón de envío
    const submitBtn = document.getElementById('submitBtn');
    const productInput = document.getElementById('productInput');
    
    if (submitBtn && productInput) {
        submitBtn.disabled = false;
        productInput.value = producto.nombre;
    }

    // Scroll suave al formulario
    setTimeout(() => {
        const formSection = document.querySelector('.financing-form-section');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 300);
}

// Mostrar producto seleccionado en el formulario
function mostrarProductoSeleccionado(producto) {
    const display = document.getElementById('selectedProductDisplay');
    const image = document.getElementById('selectedProductImage');
    const name = document.getElementById('selectedProductName');
    const price = document.getElementById('selectedProductPrice');

    if (display && image && name && price) {
        image.src = producto.imagen;
        image.alt = producto.nombre;
        name.textContent = producto.nombre;
        price.textContent = `${producto.precio} - ${producto.precioConIva}`;
        display.style.display = 'block';
    }
}

// Remover selección de producto
function removerSeleccion() {
    productoSeleccionado = null;

    // Actualizar card principal
    actualizarMainCard(null);

    // Actualizar UI de los items del dropdown
    const items = document.querySelectorAll('.dropdown-product-item');
    items.forEach(item => {
        item.classList.remove('selected');
        item.setAttribute('aria-selected', 'false');
    });

    // Ocultar producto seleccionado
    const display = document.getElementById('selectedProductDisplay');
    if (display) {
        display.style.display = 'none';
    }

    // Deshabilitar botón de envío
    const submitBtn = document.getElementById('submitBtn');
    const productInput = document.getElementById('productInput');
    
    if (submitBtn && productInput) {
        submitBtn.disabled = true;
        productInput.value = '';
    }
}

// Inicializar eventos
function inicializarEventos() {
    // Botón para remover selección
    const btnRemove = document.getElementById('btnRemoveSelection');
    if (btnRemove) {
        btnRemove.addEventListener('click', removerSeleccion);
    }
}

// Inicializar formulario
function inicializarFormulario() {
    const form = document.getElementById('financingForm');
    if (!form) return;

    // Restricción para CUIT/CUIL: solo números, máximo 11 dígitos
    const cuitInput = document.getElementById('cuit_cuil_dni');
    if (cuitInput) {
        cuitInput.addEventListener('input', function(e) {
            // Solo permitir números
            this.value = this.value.replace(/[^0-9]/g, '');
            // Limitar a 11 dígitos
            if (this.value.length > 11) {
                this.value = this.value.slice(0, 11);
            }
        });

        cuitInput.addEventListener('keypress', function(e) {
            // Solo permitir números
            if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });
    }

    // Restricción para teléfono: solo números
    const telefonoInput = document.getElementById('telefono');
    if (telefonoInput) {
        telefonoInput.addEventListener('input', function(e) {
            // Solo permitir números
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        telefonoInput.addEventListener('keypress', function(e) {
            // Solo permitir números
            if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });
    }

    // Validación en tiempo real
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validarCampo(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validarCampo(this);
            }
        });
    });

    // Manejar envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validar que haya un producto seleccionado
        if (!productoSeleccionado) {
            mostrarError('Por favor, selecciona un producto primero.');
            const productSection = document.querySelector('.product-selection');
            if (productSection) {
                productSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }

        // Validar todos los campos
        let esValido = true;
        inputs.forEach(input => {
            if (!validarCampo(input)) {
                esValido = false;
            }
        });

        if (!esValido) {
            mostrarError('Por favor, completa todos los campos requeridos correctamente.');
            return;
        }

        // Mostrar estado de carga
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }

        // Enviar formulario
        form.submit();
    });
}

// Validar campo individual
function validarCampo(input) {
    const valor = input.value.trim();
    const esRequerido = input.hasAttribute('required');
    let esValido = true;
    let mensajeError = '';

    // Remover clases de error previas
    input.classList.remove('error');
    const errorMsg = input.parentElement.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }

    // Validar campo requerido
    if (esRequerido && !valor) {
        esValido = false;
        mensajeError = 'Este campo es obligatorio';
    }

    // Validar email
    if (input.type === 'email' && valor) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(valor)) {
            esValido = false;
            mensajeError = 'Ingresa un email válido';
        }
    }

    // Validar CUIT/CUIL: exactamente 11 dígitos numéricos
    if (input.id === 'cuit_cuil_dni' && valor) {
        const cuitRegex = /^[0-9]{11}$/;
        if (!cuitRegex.test(valor)) {
            esValido = false;
            mensajeError = 'El CUIT/CUIL debe tener exactamente 11 dígitos numéricos';
        }
    }

    // Validar teléfono: solo números, mínimo 8 dígitos
    if (input.type === 'tel' && valor) {
        const phoneRegex = /^[0-9]+$/;
        if (!phoneRegex.test(valor) || valor.length < 8) {
            esValido = false;
            mensajeError = 'Ingresa un teléfono válido (solo números, mínimo 8 dígitos)';
        }
    }

    // Mostrar error si es necesario
    if (!esValido) {
        input.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = mensajeError;
        errorDiv.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 4px;';
        input.parentElement.appendChild(errorDiv);
    }

    return esValido;
}

// Mostrar mensaje de error general
function mostrarError(mensaje) {
    // Crear o actualizar mensaje de error
    let errorDiv = document.querySelector('.form-error-general');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-general';
        errorDiv.style.cssText = 'background: #fee2e2; border: 2px solid #ef4444; color: #991b1b; padding: 16px; border-radius: 8px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px;';
        const form = document.getElementById('financingForm');
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
        }
    }

    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>${mensaje}</span>`;

    // Remover después de 5 segundos
    setTimeout(() => {
        if (errorDiv) {
            errorDiv.style.transition = 'opacity 0.3s';
            errorDiv.style.opacity = '0';
            setTimeout(() => errorDiv.remove(), 300);
        }
    }, 5000);
}

// Agregar estilos para errores
const style = document.createElement('style');
style.textContent = `
    .form-input.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
`;
document.head.appendChild(style);
