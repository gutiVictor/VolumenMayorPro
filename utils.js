/**
 * Funciones utilitarias reutilizables
 * Sistema de Cubicaje FENIX
 */

// Formateo de números
const formatNumber = (num, decimals = 2) => {
    return parseFloat(num).toFixed(decimals);
};

const formatNumberWithCommas = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatCurrency = (num) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(num);
};

// Validaciones
const isValidProductCode = (code) => {
    return /^[A-Z0-9]+$/i.test(code.trim());
};

const isValidQuantity = (quantity) => {
    const num = parseInt(quantity);
    return !isNaN(num) && num > 0;
};

const validateProductLine = (line) => {
    const parts = line.includes('\t') ? line.split('\t') : line.split(/[\s,]+/);
    
    if (parts.length < 2) {
        return { valid: false, error: 'Formato incorrecto. Use: CÓDIGO,CANTIDAD' };
    }
    
    const code = parts[0].trim();
    const quantity = parts[1].trim();
    
    if (!isValidProductCode(code)) {
        return { valid: false, error: 'Código de producto inválido' };
    }
    
    if (!isValidQuantity(quantity)) {
        return { valid: false, error: 'Cantidad inválida' };
    }
    
    return { valid: true, code: code.toUpperCase(), quantity: parseInt(quantity) };
};

// Helpers de DOM
const createElement = (tag, className, innerHTML = '') => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
};

const clearElement = (element) => {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

const showElement = (element, display = 'block') => {
    element.style.display = display;
};

const hideElement = (element) => {
    element.style.display = 'none';
};

const toggleElement = (element, display = 'block') => {
    element.style.display = element.style.display === 'none' ? display : 'none';
};

// Debounce para optimizar búsquedas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle para optimizar eventos
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Funciones de fecha/hora
const getCurrentDate = () => {
    return new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

const getCurrentDateTime = () => {
    return new Date().toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

const getTimestamp = () => {
    return new Date().getTime();
};

// Almacenamiento local
const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error guardando en localStorage:', e);
            return false;
        }
    },
    
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error leyendo de localStorage:', e);
            return defaultValue;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error eliminando de localStorage:', e);
            return false;
        }
    },
    
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Error limpiando localStorage:', e);
            return false;
        }
    }
};

// Utilidades de color
const hexToRgba = (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getColorByPercentage = (percentage) => {
    if (percentage <= 70) return '#10b981'; // Verde
    if (percentage <= 90) return '#f59e0b'; // Amarillo
    if (percentage <= 100) return '#ef4444'; // Rojo
    return '#7f1d1d'; // Rojo oscuro
};

// Utilidades de array
const sortByKey = (array, key, ascending = true) => {
    return array.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        if (typeof aVal === 'string') {
            return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        
        return ascending ? aVal - bVal : bVal - aVal;
    });
};

const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {});
};

// Utilidades de cálculo
const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return (value / total) * 100;
};

const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};

const roundToDecimals = (value, decimals) => {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
};

// Generador de IDs únicos
const generateId = (prefix = 'id') => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Copiar al portapapeles
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Error copiando al portapapeles:', err);
        return false;
    }
};

// Descargar archivo
const downloadFile = (content, filename, type = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Animación de scroll suave
const smoothScrollTo = (element, duration = 500) => {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
};
