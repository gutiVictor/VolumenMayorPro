/**
 * Sistema de autocompletado para códigos de productos
 * Sistema de Cubicaje FENIX
 */

class ProductAutocomplete {
    constructor(inputElement, productos, options = {}) {
        this.input = inputElement;
        this.productos = productos;
        this.options = {
            minChars: 2,
            maxResults: 10,
            highlightClass: 'autocomplete-highlight',
            containerClass: 'autocomplete-container',
            itemClass: 'autocomplete-item',
            activeClass: 'autocomplete-active',
            ...options
        };
        
        this.container = null;
        this.selectedIndex = -1;
        this.currentSuggestions = [];
        
        this.init();
    }
    
    init() {
        // Crear contenedor de sugerencias
        this.container = document.createElement('div');
        this.container.className = this.options.containerClass;
        this.container.style.display = 'none';
        this.input.parentNode.style.position = 'relative';
        this.input.parentNode.appendChild(this.container);
        
        // Event listeners
        this.input.addEventListener('input', debounce((e) => this.handleInput(e), 300));
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.input.addEventListener('blur', () => {
            setTimeout(() => this.hide(), 200);
        });
        
        // Click fuera para cerrar
        document.addEventListener('click', (e) => {
            if (!this.input.contains(e.target) && !this.container.contains(e.target)) {
                this.hide();
            }
        });
    }
    
    handleInput(e) {
        const value = e.target.value.trim();
        
        if (value.length < this.options.minChars) {
            this.hide();
            return;
        }
        
        // Obtener la última línea siendo editada
        const lines = this.input.value.split('\n');
        const currentLine = lines[lines.length - 1];
        const parts = currentLine.split(/[,\s\t]/);
        const searchTerm = parts[0].trim().toUpperCase();
        
        if (searchTerm.length < this.options.minChars) {
            this.hide();
            return;
        }
        
        this.search(searchTerm);
    }
    
    search(term) {
        // Búsqueda fuzzy en códigos de productos
        this.currentSuggestions = this.productos
            .filter(p => {
                const code = p.codigo.toUpperCase();
                return code.includes(term) || this.fuzzyMatch(code, term);
            })
            .slice(0, this.options.maxResults);
        
        if (this.currentSuggestions.length > 0) {
            this.show();
        } else {
            this.hide();
        }
    }
    
    fuzzyMatch(str, pattern) {
        let patternIdx = 0;
        let strIdx = 0;
        
        while (strIdx < str.length && patternIdx < pattern.length) {
            if (str[strIdx] === pattern[patternIdx]) {
                patternIdx++;
            }
            strIdx++;
        }
        
        return patternIdx === pattern.length;
    }
    
    show() {
        this.container.innerHTML = '';
        this.selectedIndex = -1;
        
        this.currentSuggestions.forEach((producto, index) => {
            const item = document.createElement('div');
            item.className = this.options.itemClass;
            item.innerHTML = `
                <div class="autocomplete-code">${producto.codigo}</div>
                <div class="autocomplete-details">
                    <span class="autocomplete-empaque">${producto.empaque || 'N/A'}</span>
                    <span class="autocomplete-tipo">${producto.tipo || 'N/A'}</span>
                </div>
            `;
            
            item.addEventListener('click', () => this.select(index));
            item.addEventListener('mouseenter', () => this.setActive(index));
            
            this.container.appendChild(item);
        });
        
        this.container.style.display = 'block';
    }
    
    hide() {
        this.container.style.display = 'none';
        this.selectedIndex = -1;
    }
    
    handleKeydown(e) {
        if (this.container.style.display === 'none') return;
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.currentSuggestions.length - 1);
                this.updateActive();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateActive();
                break;
                
            case 'Enter':
                if (this.selectedIndex >= 0) {
                    e.preventDefault();
                    this.select(this.selectedIndex);
                }
                break;
                
            case 'Escape':
                this.hide();
                break;
        }
    }
    
    setActive(index) {
        this.selectedIndex = index;
        this.updateActive();
    }
    
    updateActive() {
        const items = this.container.querySelectorAll(`.${this.options.itemClass}`);
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.classList.add(this.options.activeClass);
            } else {
                item.classList.remove(this.options.activeClass);
            }
        });
    }
    
    select(index) {
        const producto = this.currentSuggestions[index];
        
        // Reemplazar la última línea con el código seleccionado
        const lines = this.input.value.split('\n');
        const currentLine = lines[lines.length - 1];
        const parts = currentLine.split(/[,\s\t]/);
        
        // Mantener la cantidad si ya existe
        const quantity = parts.length > 1 ? parts[1] : '';
        const newLine = quantity ? `${producto.codigo},${quantity}` : `${producto.codigo},`;
        
        lines[lines.length - 1] = newLine;
        this.input.value = lines.join('\n');
        
        // Posicionar cursor después de la coma
        const cursorPos = this.input.value.length;
        this.input.setSelectionRange(cursorPos, cursorPos);
        this.input.focus();
        
        this.hide();
        
        // Trigger input event para validación
        this.input.dispatchEvent(new Event('input'));
    }
    
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// Estilos CSS para autocompletado (se agregarán al CSS principal)
const autocompleteStyles = `
.autocomplete-container {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(31, 41, 55, 0.98);
    backdrop-filter: blur(20px);
    border: 1px solid #374151;
    border-radius: 8px;
    margin-top: 4px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.autocomplete-item {
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid rgba(55, 65, 81, 0.5);
    transition: all 0.2s ease;
}

.autocomplete-item:last-child {
    border-bottom: none;
}

.autocomplete-item:hover,
.autocomplete-item.autocomplete-active {
    background: rgba(37, 99, 235, 0.2);
}

.autocomplete-code {
    font-weight: 600;
    color: #f9fafb;
    font-size: 14px;
    margin-bottom: 4px;
}

.autocomplete-details {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #9ca3af;
}

.autocomplete-empaque,
.autocomplete-tipo {
    padding: 2px 8px;
    background: rgba(55, 65, 81, 0.6);
    border-radius: 4px;
}

.autocomplete-tipo {
    background: rgba(37, 99, 235, 0.2);
    color: #60a5fa;
}

/* Scrollbar para el contenedor */
.autocomplete-container::-webkit-scrollbar {
    width: 6px;
}

.autocomplete-container::-webkit-scrollbar-track {
    background: rgba(55, 65, 81, 0.3);
    border-radius: 3px;
}

.autocomplete-container::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
}

.autocomplete-container::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.7);
}
`;
