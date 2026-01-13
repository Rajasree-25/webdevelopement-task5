
const CONFIG = {
    productsPerPage: 8,
    maxProducts: 32,
    currency: 'INR',
    taxRate: 0.18,
    shippingCost: 99
};

class AppState {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.currentFilter = 'all';
        this.isLoading = false;
    }

    save() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
        localStorage.setItem('cart', JSON.stringify(this.cart));
        localStorage.setItem('language', this.currentLanguage);
        localStorage.setItem('theme', this.currentTheme);
    }

    addToWishlist(productId) {
        if (!this.wishlist.includes(productId)) {
            this.wishlist.push(productId);
            this.save();
            return true;
        }
        return false;
    }

    removeFromWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }

    addToCart(productId) {
        this.cart.push(productId);
        this.save();
        return true;
    }

    removeFromCart(productId) {
        const index = this.cart.indexOf(productId);
        if (index > -1) {
            this.cart.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }

    getCartTotal() {
        return this.cart.reduce((total, productId) => {
            const product = this.products.find(p => p.id === productId);
            return total + (product?.price || 0);
        }, 0);
    }

    getCartItems() {
        return this.cart.map(productId => {
            const product = this.products.find(p => p.id === productId);
            return product ? { ...product, quantity: 1 } : null;
        }).filter(Boolean);
    }

    getWishlistItems() {
        return this.wishlist.map(productId => {
            return this.products.find(p => p.id === productId);
        }).filter(Boolean);
    }
}

const appState = new AppState();


const DOM = {
    body: document.body,
    themeToggle: document.getElementById('themeToggle'),
    themeIcon: document.querySelector('#themeToggle i'),
    languageSelect: document.getElementById('languageSelect'),
    menuToggle: document.getElementById('menuToggle'),
    navList: document.querySelector('.nav-list'),
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    searchResults: document.getElementById('searchResults'),
    userBtn: document.getElementById('userBtn'),
    wishlistBtn: document.getElementById('wishlistBtn'),
    cartBtn: document.getElementById('cartBtn'),
    wishlistCount: document.getElementById('wishlistCount'),
    cartCount: document.getElementById('cartCount'),
    productsGrid: document.getElementById('productsGrid'),
    loadMoreBtn: document.getElementById('loadMore'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    authModal: document.getElementById('authModal'),
    wishlistModal: document.getElementById('wishlistModal'),
    cartModal: document.getElementById('cartModal'),
    modalOverlay: document.getElementById('modalOverlay'),
    closeModalBtns: document.querySelectorAll('.modal-close'),
    authForm: document.getElementById('authForm'),
    switchToRegister: document.getElementById('switchToRegister'),
    switchToLogin: document.getElementById('switchToLogin'),
    authModalTitle: document.getElementById('authModalTitle'),
    authSubmit: document.getElementById('authSubmit'),
    nameField: document.getElementById('nameField'),
    confirmPasswordField: document.getElementById('confirmPasswordField'),
    noAccountText: document.getElementById('noAccountText'),
    haveAccountText: document.getElementById('haveAccountText'),
    wishlistItems: document.getElementById('wishlistItems'),
    cartItems: document.getElementById('cartItems'),
    cartTotal: document.getElementById('cartTotal'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    newsletterForm: document.getElementById('newsletterForm'),
    toastContainer: document.getElementById('toastContainer'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    categoryCards: document.querySelectorAll('.category-card')
};


const i18n = {
    en: {
        nav: {
            home: "Home",
            products: "Products",
            categories: "Categories",
            deals: "Deals",
            about: "About"
        },
        hero: {
            title: "Experience Tomorrow's Technology Today",
            subtitle: "Discover cutting-edge electronics, smart gadgets, and premium accessories that redefine your digital lifestyle.",
            shop: "Shop Now",
            explore: "Explore Categories"
        },
        categories: {
            title: "Shop by Category",
            smartphones: "Smartphones",
            smartphones_desc: "Latest models & accessories",
            laptops: "Laptops",
            laptops_desc: "Powerful computing solutions",
            audio: "Audio",
            audio_desc: "Immersive sound experience",
            wearables: "Wearables",
            wearables_desc: "Smart watches & bands"
        },
        products: {
            title: "Featured Products",
            loadMore: "Load More Products"
        },
        filters: {
            all: "All",
            smartphones: "Smartphones",
            laptops: "Laptops",
            audio: "Audio",
            wearables: "Wearables"
        },
        deals: {
            title: "Today's Hot Deals",
            deal1: {
                title: "Premium Wireless Earbuds",
                desc: "Noise cancellation & 24h battery"
            },
            deal2: {
                title: "Gaming Laptop Pro",
                desc: "RTX 4060, 16GB RAM, 1TB SSD"
            },
            deal3: {
                title: "Smart Watch Ultra",
                desc: "Health tracking & notifications"
            }
        },
        features: {
            title: "Why Choose TechShop",
            fastShipping: "Fast Shipping",
            fastShippingDesc: "Free 2-day delivery on orders over ₹8,217",
            warranty: "2-Year Warranty",
            warrantyDesc: "All products covered for peace of mind",
            support: "24/7 Support",
            supportDesc: "Expert help whenever you need it",
            returns: "Easy Returns",
            returnsDesc: "30-day return policy, no questions asked"
        },
        footer: {
            description: "Your premier destination for cutting-edge technology and premium electronics.",
            quickLinks: "Quick Links",
            support: "Support",
            newsletter: "Newsletter",
            newsletterDesc: "Subscribe for exclusive deals and updates",
            subscribe: "Subscribe",
            copyright: "© 2024 TechShop. All rights reserved.",
            privacy: "Privacy Policy",
            terms: "Terms of Service",
            help: "Help Center",
            contact: "Contact Us",
            shipping: "Shipping Info",
            returns: "Returns & Refunds"
        },
        auth: {
            login: "Login",
            register: "Register",
            logout: "Logout",
            name: "Full Name",
            email: "Email Address",
            password: "Password",
            confirmPassword: "Confirm Password",
            noAccount: "Don't have an account?",
            haveAccount: "Already have an account?"
        },
        wishlist: {
            title: "My Wishlist",
            empty: "Your wishlist is empty"
        },
        cart: {
            title: "Shopping Cart",
            empty: "Your cart is empty",
            total: "Total:",
            checkout: "Proceed to Checkout",
            remove: "Remove"
        },
        placeholder: {
            email: "Enter your email"
        },
        messages: {
            addedToWishlist: "Added to wishlist",
            removedFromWishlist: "Removed from wishlist",
            addedToCart: "Added to cart",
            removedFromCart: "Removed from cart",
            loginSuccess: "Login successful!",
            registerSuccess: "Registration successful!",
            logoutSuccess: "Logged out successfully",
            newsletterSuccess: "Thank you for subscribing!",
            checkoutSuccess: "Order placed successfully!",
            error: "An error occurred",
            loading: "Loading..."
        }
    },
    es: {
        nav: {
            home: "Inicio",
            products: "Productos",
            categories: "Categorías",
            deals: "Ofertas",
            about: "Nosotros"
        },
        hero: {
            title: "Experimenta la Tecnología del Mañana Hoy",
            subtitle: "Descubre electrónica de vanguardia, gadgets inteligentes y accesorios premium que redefinen tu estilo de vida digital.",
            shop: "Comprar Ahora",
            explore: "Explorar Categorías"
        },
        categories: {
            title: "Comprar por Categoría",
            smartphones: "Smartphones",
            smartphones_desc: "Últimos modelos y accesorios",
            laptops: "Laptops",
            laptops_desc: "Soluciones de computación potentes",
            audio: "Audio",
            audio_desc: "Experiencia de sonido inmersiva",
            wearables: "Wearables",
            wearables_desc: "Relojes y bandas inteligentes"
        },
        products: {
            title: "Productos Destacados",
            loadMore: "Cargar Más Productos"
        },
        filters: {
            all: "Todos",
            smartphones: "Smartphones",
            laptops: "Laptops",
            audio: "Audio",
            wearables: "Wearables"
        },
        deals: {
            title: "Ofertas del Día",
            deal1: {
                title: "Audífonos Inalámbricos Premium",
                desc: "Cancelación de ruido y 24h de batería"
            },
            deal2: {
                title: "Laptop Gaming Pro",
                desc: "RTX 4060, 16GB RAM, 1TB SSD"
            },
            deal3: {
                title: "Smart Watch Ultra",
                desc: "Monitoreo de salud y notificaciones"
            }
        },
        features: {
            title: "Por Qué Elegir TechShop",
            fastShipping: "Envío Rápido",
            fastShippingDesc: "Envío gratuito de 2 días en pedidos superiores a ₹8,217",
            warranty: "Garantía de 2 Años",
            warrantyDesc: "Todos los productos cubiertos para tu tranquilidad",
            support: "Soporte 24/7",
            supportDesc: "Ayuda experta cuando la necesites",
            returns: "Devoluciones Fáciles",
            returnsDesc: "Política de devolución de 30 días, sin preguntas"
        },
        footer: {
            description: "Tu destino principal para tecnología de vanguardia y electrónica premium.",
            quickLinks: "Enlaces Rápidos",
            support: "Soporte",
            newsletter: "Boletín",
            newsletterDesc: "Suscríbete para ofertas exclusivas y actualizaciones",
            subscribe: "Suscribirse",
            copyright: "© 2024 TechShop. Todos los derechos reservados.",
            privacy: "Política de Privacidad",
            terms: "Términos de Servicio",
            help: "Centro de Ayuda",
            contact: "Contáctanos",
            shipping: "Información de Envío",
            returns: "Devoluciones y Reembolsos"
        },
        auth: {
            login: "Iniciar Sesión",
            register: "Registrarse",
            logout: "Cerrar Sesión",
            name: "Nombre Completo",
            email: "Correo Electrónico",
            password: "Contraseña",
            confirmPassword: "Confirmar Contraseña",
            noAccount: "¿No tienes cuenta?",
            haveAccount: "¿Ya tienes cuenta?"
        },
        wishlist: {
            title: "Mi Lista de Deseos",
            empty: "Tu lista de deseos está vacía"
        },
        cart: {
            title: "Carrito de Compras",
            empty: "Tu carrito está vacío",
            total: "Total:",
            checkout: "Proceder al Pago",
            remove: "Eliminar"
        },
        placeholder: {
            email: "Ingresa tu correo"
        },
        messages: {
            addedToWishlist: "Agregado a la lista de deseos",
            removedFromWishlist: "Eliminado de la lista de deseos",
            addedToCart: "Agregado al carrito",
            removedFromCart: "Eliminado del carrito",
            loginSuccess: "¡Inicio de sesión exitoso!",
            registerSuccess: "¡Registro exitoso!",
            logoutSuccess: "Sesión cerrada exitosamente",
            newsletterSuccess: "¡Gracias por suscribirte!",
            checkoutSuccess: "¡Pedido realizado exitosamente!",
            error: "Ocurrió un error",
            loading: "Cargando..."
        }
    },
    fr: {
        nav: {
            home: "Accueil",
            products: "Produits",
            categories: "Catégories",
            deals: "Offres",
            about: "À Propos"
        },
        hero: {
            title: "Vivez la Technologie de Demain Aujourd'hui",
            subtitle: "Découvrez l'électronique de pointe, les gadgets intelligents et les accessoires premium qui redéfinissent votre style de vie numérique.",
            shop: "Acheter Maintenant",
            explore: "Explorer les Catégories"
        },
        categories: {
            title: "Acheter par Catégorie",
            smartphones: "Smartphones",
            smartphones_desc: "Derniers modèles et accessoires",
            laptops: "Ordinateurs Portables",
            laptops_desc: "Solutions informatiques puissantes",
            audio: "Audio",
            audio_desc: "Expérience sonore immersive",
            wearables: "Wearables",
            wearables_desc: "Montres et bracelets connectés"
        },
        products: {
            title: "Produits en Vedette",
            loadMore: "Charger Plus de Produits"
        },
        filters: {
            all: "Tous",
            smartphones: "Smartphones",
            laptops: "Ordinateurs Portables",
            audio: "Audio",
            wearables: "Wearables"
        },
        deals: {
            title: "Offres du Jour",
            deal1: {
                title: "Écouteurs Sans Fil Premium",
                desc: "Annulation du bruit et batterie 24h"
            },
            deal2: {
                title: "PC Portable Gaming Pro",
                desc: "RTX 4060, 16GB RAM, 1TB SSD"
            },
            deal3: {
                title: "Montre Connectée Ultra",
                desc: "Suivi santé et notifications"
            }
        },
        features: {
            title: "Pourquoi Choisir TechShop",
            fastShipping: "Livraison Rapide",
            fastShippingDesc: "Livraison gratuite en 2 jours pour les commandes de plus de ₹8,217",
            warranty: "Garantie 2 Ans",
            warrantyDesc: "Tous les produits couverts pour votre tranquillité d'esprit",
            support: "Support 24/7",
            supportDesc: "Aide experte quand vous en avez besoin",
            returns: "Retours Faciles",
            returnsDesc: "Politique de retour de 30 jours, sans questions"
        },
        footer: {
            description: "Votre destination premium pour la technologie de pointe et l'électronique haut de gamme.",
            quickLinks: "Liens Rapides",
            support: "Support",
            newsletter: "Newsletter",
            newsletterDesc: "Abonnez-vous pour des offres exclusives et des mises à jour",
            subscribe: "S'abonner",
            copyright: "© 2024 TechShop. Tous droits réservés.",
            privacy: "Política de Confidentialité",
            terms: "Conditions d'Utilisation",
            help: "Centre d'Aide",
            contact: "Nous Contacter",
            shipping: "Informations de Livraison",
            returns: "Retours et Remboursements"
        },
        auth: {
            login: "Connexion",
            register: "S'inscrire",
            logout: "Déconnexion",
            name: "Nom Complet",
            email: "Adresse Email",
            password: "Mot de Passe",
            confirmPassword: "Confirmer le Mot de Passe",
            noAccount: "Pas de compte?",
            haveAccount: "Déjà un compte?"
        },
        wishlist: {
            title: "Ma Liste de Souhaits",
            empty: "Votre liste de souhaits est vide"
        },
        cart: {
            title: "Panier d'Achat",
            empty: "Votre panier est vide",
            total: "Total:",
            checkout: "Passer à la Caisse",
            remove: "Supprimer"
        },
        placeholder: {
            email: "Entrez votre email"
        },
        messages: {
            addedToWishlist: "Ajouté à la liste de souhaits",
            removedFromWishlist: "Supprimé de la liste de souhaits",
            addedToCart: "Ajouté au panier",
            removedFromCart: "Supprimé du panier",
            loginSuccess: "Connexion réussie!",
            registerSuccess: "Inscription réussie!",
            logoutSuccess: "Déconnexion réussie",
            newsletterSuccess: "Merci de vous être abonné!",
            checkoutSuccess: "Commande passée avec succès!",
            error: "Une erreur est survenue",
            loading: "Chargement..."
        }
    }
};

const productsData = [
    { 
        id: 1, 
        name: "iPhone 15 Pro", 
        category: "smartphones", 
        price: 129900, 
        rating: 4.8, 
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
        description: "Titanium design, A17 Pro chip" 
    },
    { 
        id: 2, 
        name: "Samsung Galaxy S24", 
        category: "smartphones", 
        price: 79990, 
        rating: 4.7, 
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
        description: "AI-powered, 200MP camera" 
    },
    { 
        id: 3, 
        name: "MacBook Pro 16\"", 
        category: "laptops", 
        price: 249900, 
        rating: 4.9, 
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
        description: "M3 Max, 48GB RAM, 1TB SSD" 
    },
    { 
        id: 4, 
        name: "Dell XPS 15", 
        category: "laptops", 
        price: 139900, 
        rating: 4.6, 
        image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
        description: "OLED display, i9 processor" 
    },
    { 
        id: 5, 
        name: "Sony WH-1000XM5", 
        category: "audio", 
        price: 28999, 
        rating: 4.8, 
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
        description: "Noise cancelling headphones" 
    },
    { 
        id: 6, 
        name: "AirPods Pro 2", 
        category: "audio", 
        price: 24900, 
        rating: 4.7, 
        image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
        description: "Wireless earbuds with ANC" 
    },
    { 
        id: 7, 
        name: "Apple Watch Ultra 2", 
        category: "wearables", 
        price: 89900, 
        rating: 4.8, 
        image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
        description: "Rugged smartwatch" 
    },
    { 
        id: 8, 
        name: "Galaxy Watch 6", 
        category: "wearables", 
        price: 29990, 
        rating: 4.6, 
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
        description: "Advanced health tracking" 
    },
    { 
        id: 9, 
        name: "Google Pixel 8 Pro", 
        category: "smartphones", 
        price: 106999, 
        rating: 4.7, 
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
        description: "Tensor G3, AI features" 
    },
    { 
        id: 10, 
        name: "OnePlus 12", 
        category: "smartphones", 
        price: 69999, 
        rating: 4.6, 
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
        description: "Fast charging, Hasselblad camera" 
    },
    { 
        id: 11, 
        name: "ASUS ROG Zephyrus", 
        category: "laptops", 
        price: 169999, 
        rating: 4.7, 
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
        description: "Gaming laptop, RTX 4080" 
    },
    { 
        id: 12, 
        name: "Lenovo ThinkPad X1", 
        category: "laptops", 
        price: 139999, 
        rating: 4.8, 
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
        description: "Business laptop, lightweight" 
    },
    { 
        id: 13, 
        name: "Bose QuietComfort", 
        category: "audio", 
        price: 28990, 
        rating: 4.7, 
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
        description: "Comfortable noise cancellation" 
    },
    { 
        id: 14, 
        name: "JBL Flip 6", 
        category: "audio", 
        price: 11990, 
        rating: 4.5, 
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
        description: "Portable Bluetooth speaker" 
    },
    { 
        id: 15, 
        name: "Fitbit Charge 6", 
        category: "wearables", 
        price: 15990, 
        rating: 4.4, 
        image: "https://images.unsplash.com/photo-1579586337278-3f326621cbf2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
        description: "Fitness tracker with GPS" 
    },
    { 
        id: 16, 
        name: "Garmin Fenix 7", 
        category: "wearables", 
        price: 75999, 
        rating: 4.8, 
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
        description: "Multisport GPS watch" 
    }
];


const utils = {
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: CONFIG.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    showLoading(show) {
        if (DOM.loadingSpinner) {
            DOM.loadingSpinner.hidden = !show;
        }
    },

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const ui = {
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        DOM.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    },

    updateCounters() {
        if (DOM.wishlistCount) {
            DOM.wishlistCount.textContent = appState.wishlist.length;
        }
        if (DOM.cartCount) {
            DOM.cartCount.textContent = appState.cart.length;
        }
    },

    updateLanguage() {
        const lang = appState.currentLanguage;
        const data = i18n[lang];
        
        if (!data) return;
        
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const keys = el.dataset.i18n.split('.');
            let value = data;
            keys.forEach(key => {
                if (value && value[key] !== undefined) {
                    value = value[key];
                }
            });
            if (value && typeof value === 'string') {
                el.textContent = value;
            }
        });
        

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const keys = el.dataset.i18nPlaceholder.split('.');
            let value = data;
            keys.forEach(key => {
                if (value && value[key] !== undefined) {
                    value = value[key];
                }
            });
            if (value && typeof value === 'string') {
                el.placeholder = value;
            }
        });
    },

    renderProducts() {
        if (!DOM.productsGrid) return;
        
        const start = (appState.currentPage - 1) * CONFIG.productsPerPage;
        const end = start + CONFIG.productsPerPage;
        const productsToShow = appState.filteredProducts.slice(0, end);
        
        DOM.productsGrid.innerHTML = productsToShow.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         loading="lazy">
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                        <span>(${product.rating})</span>
                    </div>
                    <div class="product-price">${utils.formatCurrency(product.price)}</div>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline add-to-wishlist ${appState.wishlist.includes(product.id) ? 'active' : ''}" 
                                data-id="${product.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        if (DOM.loadMoreBtn) {
            const hasMore = end < appState.filteredProducts.length;
            DOM.loadMoreBtn.style.display = hasMore ? 'block' : 'none';
        }
    },

    renderWishlist() {
        if (!DOM.wishlistItems) return;
        
        const items = appState.getWishlistItems();
        
        if (items.length === 0) {
            DOM.wishlistItems.innerHTML = `<p class="empty-state" data-i18n="wishlist.empty">${i18n[appState.currentLanguage]?.wishlist?.empty || 'Your wishlist is empty'}</p>`;
            return;
        }
        
        DOM.wishlistItems.innerHTML = items.map(item => `
            <div class="wishlist-item" data-id="${item.id}">
                <img src="${item.image}" 
                     alt="${item.name}" 
                     width="60" 
                     height="60">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <div class="item-price">${utils.formatCurrency(item.price)}</div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-primary add-to-cart" data-id="${item.id}">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                    <button class="btn btn-outline remove-from-wishlist" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },

    renderCart() {
        if (!DOM.cartItems || !DOM.cartTotal) return;
        
        const items = appState.getCartItems();
        const total = appState.getCartTotal();
        
        if (items.length === 0) {
            DOM.cartItems.innerHTML = `<p class="empty-state" data-i18n="cart.empty">${i18n[appState.currentLanguage]?.cart?.empty || 'Your cart is empty'}</p>`;
            DOM.cartTotal.textContent = utils.formatCurrency(0);
            return;
        }
        
        DOM.cartItems.innerHTML = items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" 
                     alt="${item.name}" 
                     width="60" 
                     height="60">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <div class="item-price">${utils.formatCurrency(item.price)}</div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-outline remove-from-cart" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        DOM.cartTotal.textContent = utils.formatCurrency(total);
    },

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.hidden = false;
            modal.style.display = 'block';
            DOM.modalOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    },

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.hidden = true;
            modal.style.display = 'none';
            DOM.modalOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    },

    hideAllModals() {
        ['authModal', 'wishlistModal', 'cartModal'].forEach(modalId => {
            this.hideModal(modalId);
        });
    },

    setupAuthModal(mode = 'login') {
        if (mode === 'login') {
            DOM.authModalTitle.textContent = i18n[appState.currentLanguage]?.auth?.login || 'Login';
            DOM.authSubmit.textContent = i18n[appState.currentLanguage]?.auth?.login || 'Login';
            DOM.nameField.style.display = 'none';
            DOM.confirmPasswordField.style.display = 'none';
            DOM.noAccountText.style.display = 'block';
            DOM.haveAccountText.style.display = 'none';
        } else {
            DOM.authModalTitle.textContent = i18n[appState.currentLanguage]?.auth?.register || 'Register';
            DOM.authSubmit.textContent = i18n[appState.currentLanguage]?.auth?.register || 'Register';
            DOM.nameField.style.display = 'block';
            DOM.confirmPasswordField.style.display = 'block';
            DOM.noAccountText.style.display = 'none';
            DOM.haveAccountText.style.display = 'block';
        }
    }
};


const events = {
    init() {
        // Theme toggle
        if (DOM.themeToggle) {
            DOM.themeToggle.addEventListener('click', () => {
                const isDark = DOM.body.classList.contains('dark-theme');
                if (isDark) {
                    DOM.body.classList.remove('dark-theme');
                    DOM.themeIcon.classList.remove('fa-sun');
                    DOM.themeIcon.classList.add('fa-moon');
                    appState.currentTheme = 'light';
                } else {
                    DOM.body.classList.add('dark-theme');
                    DOM.themeIcon.classList.remove('fa-moon');
                    DOM.themeIcon.classList.add('fa-sun');
                    appState.currentTheme = 'dark';
                }
                appState.save();
            });
        }

      
        if (DOM.languageSelect) {
            DOM.languageSelect.value = appState.currentLanguage;
            DOM.languageSelect.addEventListener('change', (e) => {
                appState.currentLanguage = e.target.value;
                appState.save();
                ui.updateLanguage();
                ui.renderProducts();
                ui.renderWishlist();
                ui.renderCart();
            });
        }

        if (DOM.menuToggle) {
            DOM.menuToggle.addEventListener('click', () => {
                DOM.navList.classList.toggle('active');
            });
        }

       
        if (DOM.searchInput) {
            const debouncedSearch = utils.debounce((value) => {
                if (value.length < 2) {
                    DOM.searchResults.hidden = true;
                    return;
                }
                
                const results = appState.products.filter(product =>
                    product.name.toLowerCase().includes(value.toLowerCase()) ||
                    product.description.toLowerCase().includes(value.toLowerCase())
                ).slice(0, 5);
                
                if (results.length > 0) {
                    DOM.searchResults.innerHTML = results.map(product => `
                        <div class="search-result" data-id="${product.id}">
                            <strong>${product.name}</strong>
                            <br>
                            <small>${product.description}</small>
                        </div>
                    `).join('');
                    DOM.searchResults.hidden = false;
                } else {
                    DOM.searchResults.innerHTML = '<div class="search-result">No results found</div>';
                    DOM.searchResults.hidden = false;
                }
            }, 300);
            
            DOM.searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
            
            DOM.searchBtn.addEventListener('click', () => {
                const value = DOM.searchInput.value.trim();
                if (value) {
                    this.handleSearch(value);
                }
            });
            
            DOM.searchResults.addEventListener('click', (e) => {
                const result = e.target.closest('.search-result');
                if (result) {
                    const productId = parseInt(result.dataset.id);
                    const product = appState.products.find(p => p.id === productId);
                    if (product) {
                        this.handleSearch(product.name);
                        DOM.searchResults.hidden = true;
                    }
                }
            });
            
            
            document.addEventListener('click', (e) => {
                if (!DOM.searchInput.contains(e.target) && !DOM.searchResults.contains(e.target)) {
                    DOM.searchResults.hidden = true;
                }
            });
        }


        if (DOM.userBtn) {
            DOM.userBtn.addEventListener('click', () => {
                if (appState.currentUser) {
                    ui.showToast(`Welcome ${appState.currentUser.name}!`, 'success');
                } else {
                    ui.setupAuthModal('login');
                    ui.showModal('authModal');
                }
            });
        }

        if (DOM.wishlistBtn) {
            DOM.wishlistBtn.addEventListener('click', () => {
                ui.renderWishlist();
                ui.showModal('wishlistModal');
            });
        }

        if (DOM.cartBtn) {
            DOM.cartBtn.addEventListener('click', () => {
                ui.renderCart();
                ui.showModal('cartModal');
            });
        }

        if (DOM.filterBtns) {
            DOM.filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    DOM.filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    const filter = btn.dataset.filter;
                    appState.currentFilter = filter;
                    appState.currentPage = 1;
                    
                    if (filter === 'all') {
                        appState.filteredProducts = [...appState.products];
                    } else {
                        appState.filteredProducts = appState.products.filter(p => p.category === filter);
                    }
                    
                    ui.renderProducts();
                    utils.scrollToTop();
                });
            });
        }

        if (DOM.categoryCards) {
            DOM.categoryCards.forEach(card => {
                card.addEventListener('click', () => {
                    const category = card.dataset.category;
                    const filterBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
                    if (filterBtn) {
                        filterBtn.click();
                        window.scrollTo({
                            top: DOM.productsGrid.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }

        if (DOM.loadMoreBtn) {
            DOM.loadMoreBtn.addEventListener('click', () => {
                appState.currentPage++;
                ui.renderProducts();
            });
        }

        if (DOM.closeModalBtns) {
            DOM.closeModalBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    ui.hideAllModals();
                });
            });
        }

        
        if (DOM.modalOverlay) {
            DOM.modalOverlay.addEventListener('click', () => {
                ui.hideAllModals();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                ui.hideAllModals();
            }
        });

        if (DOM.switchToRegister) {
            DOM.switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                ui.setupAuthModal('register');
            });
        }

        if (DOM.switchToLogin) {
            DOM.switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                ui.setupAuthModal('login');
            });
        }

        if (DOM.authForm) {
            DOM.authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAuthSubmit();
            });
        }

        if (DOM.newsletterForm) {
            DOM.newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = DOM.newsletterForm.querySelector('input[type="email"]').value;
                if (email) {
                    ui.showToast(i18n[appState.currentLanguage]?.messages?.newsletterSuccess || 'Thank you for subscribing!', 'success');
                    DOM.newsletterForm.reset();
                }
            });
        }

        if (DOM.checkoutBtn) {
            DOM.checkoutBtn.addEventListener('click', () => {
                if (appState.cart.length === 0) {
                    ui.showToast('Your cart is empty', 'error');
                    return;
                }
                
                const total = appState.getCartTotal();
                appState.cart = [];
                appState.save();
                ui.updateCounters();
                ui.renderCart();
                ui.hideModal('cartModal');
                ui.showToast(`${i18n[appState.currentLanguage]?.messages?.checkoutSuccess || 'Order placed successfully!'} Total: ${utils.formatCurrency(total)}`, 'success');
            });
        }

        
        document.addEventListener('click', (e) => {
            // Add to cart
            if (e.target.closest('.add-to-cart')) {
                const btn = e.target.closest('.add-to-cart');
                const productId = parseInt(btn.dataset.id);
                appState.addToCart(productId);
                ui.updateCounters();
                ui.renderCart();
                ui.showToast(i18n[appState.currentLanguage]?.messages?.addedToCart || 'Added to cart', 'success');
            }
            
          
            else if (e.target.closest('.add-to-wishlist')) {
                const btn = e.target.closest('.add-to-wishlist');
                const productId = parseInt(btn.dataset.id);
                
                if (appState.wishlist.includes(productId)) {
                    appState.removeFromWishlist(productId);
                    btn.classList.remove('active');
                    ui.showToast(i18n[appState.currentLanguage]?.messages?.removedFromWishlist || 'Removed from wishlist', 'info');
                } else {
                    appState.addToWishlist(productId);
                    btn.classList.add('active');
                    ui.showToast(i18n[appState.currentLanguage]?.messages?.addedToWishlist || 'Added to wishlist', 'success');
                }
                
                ui.updateCounters();
                ui.renderWishlist();
            }
            
            else if (e.target.closest('.remove-from-wishlist')) {
                const btn = e.target.closest('.remove-from-wishlist');
                const productId = parseInt(btn.dataset.id);
                appState.removeFromWishlist(productId);
                ui.updateCounters();
                ui.renderWishlist();
                ui.renderProducts();
                ui.showToast(i18n[appState.currentLanguage]?.messages?.removedFromWishlist || 'Removed from wishlist', 'info');
            }
            
           
            else if (e.target.closest('.remove-from-cart')) {
                const btn = e.target.closest('.remove-from-cart');
                const productId = parseInt(btn.dataset.id);
                appState.removeFromCart(productId);
                ui.updateCounters();
                ui.renderCart();
                ui.showToast(i18n[appState.currentLanguage]?.messages?.removedFromCart || 'Removed from cart', 'info');
            }
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Close mobile menu if open
                    DOM.navList.classList.remove('active');
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });

        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.classList.add('loaded');
                        observer.unobserve(lazyImage);
                    }
                });
            });

            document.querySelectorAll('img[loading="lazy"]').forEach(lazyImage => {
                lazyImageObserver.observe(lazyImage);
            });
        }
    },

    handleSearch(query) {
        if (!query.trim()) return;
        
        appState.filteredProducts = appState.products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
        
        appState.currentPage = 1;
        ui.renderProducts();
        
   
        DOM.filterBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.filter-btn[data-filter="all"]')?.classList.add('active');
        
        
        window.scrollTo({
            top: DOM.productsGrid.offsetTop - 100,
            behavior: 'smooth'
        });
    },

    handleAuthSubmit() {
        const isRegister = DOM.authModalTitle.textContent === (i18n[appState.currentLanguage]?.auth?.register || 'Register');
        const name = DOM.authName.value;
        const email = DOM.authEmail.value;
        const password = DOM.authPassword.value;
        const confirmPassword = DOM.confirmPassword.value;
        
        
        if (!email || !password) {
            ui.showToast('Please fill all required fields', 'error');
            return;
        }
        
        if (isRegister) {
            if (!name) {
                ui.showToast('Please enter your name', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                ui.showToast('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 6) {
                ui.showToast('Password must be at least 6 characters', 'error');
                return;
            }
            
            
            appState.currentUser = { name, email };
            appState.save();
            ui.showToast(i18n[appState.currentLanguage]?.messages?.registerSuccess || 'Registration successful!', 'success');
            ui.hideModal('authModal');
        } else {
       
            if (!appState.currentUser) {
                appState.currentUser = { 
                    name: email.split('@')[0], 
                    email 
                };
            }
            appState.save();
            ui.showToast(i18n[appState.currentLanguage]?.messages?.loginSuccess || 'Login successful!', 'success');
            ui.hideModal('authModal');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Set initial theme
    if (appState.currentTheme === 'dark') {
        DOM.body.classList.add('dark-theme');
        if (DOM.themeIcon) {
            DOM.themeIcon.classList.remove('fa-moon');
            DOM.themeIcon.classList.add('fa-sun');
        }
    }
    
  
    appState.products = productsData;
    appState.filteredProducts = [...productsData];
    
    // Initialize UI
    ui.updateLanguage();
    ui.updateCounters();
    ui.renderProducts();
    
    
    events.init();
    
    setTimeout(() => {
        ui.showToast('Welcome to TechShop! 🎉', 'success');
    }, 1000);
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}