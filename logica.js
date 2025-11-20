document.addEventListener('DOMContentLoaded', function() {
  // Funcionalidad para mostrar/ocultar contraseña
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      const icon = this.querySelector('i');
      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');
    });
  }

  // Mejorar la experiencia del login
  const loginForm = document.getElementById('loginForm');
  const loginBtn = document.querySelector('.login-btn');
  const errorMessage = document.getElementById('error-message');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();

      // Mostrar estado de carga
      if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
        loginBtn.disabled = true;
      }

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Simular delay para mejor UX
      setTimeout(() => {
        if ((username === 'admin' && password === '123') 
          || (username === 'usuario' && password === 'fenix')
          || (username === 'laura' && password === 'fenix')
          || (username === 'zora' && password === 'fenix')) {
          
          // Mostrar éxito antes de redirigir
          if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-check"></i> ¡Acceso exitoso!';
            loginBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
          }
          
          setTimeout(() => {
            window.location.href = 'ini.html';
          }, 1000);
        } else {
          // Mostrar error
          if (errorMessage) {
            errorMessage.style.display = 'flex';
            errorMessage.style.animation = 'shake 0.5s ease-in-out';
          }
          
          // Restaurar botón
          if (loginBtn) {
            loginBtn.innerHTML = '<span class="btn-text">Iniciar Sesión</span><span class="btn-icon"><i class="fas fa-sign-in-alt"></i></span>';
            loginBtn.disabled = false;
          }
          
          // Redirigir después de mostrar error
          setTimeout(() => {
            window.location.href = 'https://btoys.co/?gad_source=1&gclid=Cj0KCQiAire5BhCNARIsAM53K1ipYAmP0vU6F-iWy2d41IwxteGp30wQ73l97GnyQrnF8slIk5I7ZHIaAmzSEALw_wcB';
          }, 2000);
        }
      }, 800);
    });
  }

  // Mejorar UX de los inputs
  const inputs = document.querySelectorAll('.input-icon input');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'scale(1)';
    });
  });
});

// Cargar productos del archivo JSON
let productos = [];

// Función para exportar a Excel
function exportarExcel() {
  try {
    // Crear un nuevo libro de trabajo
    const wb = XLSX.utils.book_new();
    
    // Obtener los datos de las tarjetas de resultados
    const pesoTotal = document.getElementById("peso-total").innerText;
    const volumenTotalBolsa = document.getElementById("volumen-total-bolsa").innerText;
    const volumenTotalCajas = document.getElementById("volumen-total-cajas").innerText;
    const volumenConsolidadoCajasBolsas = document.getElementById("volumen-consolidado-cajas-bolsas").innerText;

    // Crear hoja de resultados totales
    const resultadosTotales = [
      ["RESULTADOS TOTALES - SISTEMA DE CUBICAJE FENIX"],
      [""],
      ["Peso Total:", pesoTotal],
      ["Volumen Total Bolsa:", volumenTotalBolsa],
      ["Volumen Total Cajas:", volumenTotalCajas],
      ["Volumen Consolidado (Cajas + Bolsas):", volumenConsolidadoCajasBolsas],
      [""],
      ["Fecha de Exportación:", new Date().toLocaleString('es-ES')]
    ];

    const wsTotales = XLSX.utils.aoa_to_sheet(resultadosTotales);
    XLSX.utils.book_append_sheet(wb, wsTotales, "Resultados Totales");

    // Crear hoja de resultados individuales
    const tablaIndividuales = document.querySelector("#tab-individuales table");
    if (tablaIndividuales && tablaIndividuales.rows.length > 1) {
      const wsIndividuales = XLSX.utils.table_to_sheet(tablaIndividuales);
      XLSX.utils.book_append_sheet(wb, wsIndividuales, "Resultados Individuales");
    }

    // Crear hoja de análisis de camiones
    const tablaCamiones = document.querySelector("#tab-camiones table");
    if (tablaCamiones && tablaCamiones.rows.length > 1) {
      const wsCamiones = XLSX.utils.table_to_sheet(tablaCamiones);
      XLSX.utils.book_append_sheet(wb, wsCamiones, "Análisis de Camiones");
    }

    // Generar y descargar el archivo
    const fileName = `resultados_fenix_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    showNotification("Archivo Excel exportado exitosamente", "success");
  } catch (error) {
    console.error("Error al exportar Excel:", error);
    showNotification("Error al exportar Excel", "error");
  }
}

// Función para exportar a PDF
function exportarPDF() {
  try {
    // Verificar si jsPDF está disponible
    if (typeof window.jspdf === 'undefined') {
      showNotification("Librería PDF no disponible. Cargando...", "warning");
      // Intentar cargar la librería dinámicamente
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => {
        setTimeout(() => exportarPDF(), 1000);
      };
      document.head.appendChild(script);
      return;
    }

    // Crear el contenido del PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configurar fuente
    doc.setFont("helvetica");
    
    // Título principal
    doc.setFontSize(18);
    doc.setTextColor(37, 99, 235);
    doc.text("SISTEMA DE CUBICAJE FENIX", 105, 20, { align: "center" });
    
    // Fecha
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 105, 30, { align: "center" });
    
    // Resultados totales
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text("RESULTADOS TOTALES", 20, 50);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    const pesoTotal = document.getElementById("peso-total").innerText;
    const volumenTotalBolsa = document.getElementById("volumen-total-bolsa").innerText;
    const volumenTotalCajas = document.getElementById("volumen-total-cajas").innerText;
    const volumenConsolidadoCajasBolsas = document.getElementById("volumen-consolidado-cajas-bolsas").innerText;
    
    doc.text(`Peso Total: ${pesoTotal}`, 20, 65);
    doc.text(`Volumen Total Bolsa: ${volumenTotalBolsa}`, 20, 75);
    doc.text(`Volumen Total Cajas: ${volumenTotalCajas}`, 20, 85);
    doc.text(`Volumen Consolidado: ${volumenConsolidadoCajasBolsas}`, 20, 95);
    
    // Análisis de camiones
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text("ANÁLISIS DE CAMIONES", 20, 120);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const tablaCamiones = document.querySelector("#tab-camiones table tbody");
    if (tablaCamiones) {
      let yPosition = 135;
      const filas = tablaCamiones.querySelectorAll("tr");
      
      filas.forEach((fila, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        const celdas = fila.querySelectorAll("td");
        if (celdas.length > 0) {
          const nombreCamion = celdas[0]?.textContent || '';
          const capacidadVolumen = celdas[1]?.textContent || '';
          const cabe = celdas[7]?.textContent || '';
          
          const texto = `${nombreCamion} | Capacidad: ${capacidadVolumen} | ¿Cabe?: ${cabe}`;
          doc.text(texto, 20, yPosition);
          yPosition += 8;
        }
      });
    }
    
    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("© 2024 FENIX. Sistema de Cubicaje de Vehículos.", 105, 280, { align: "center" });
    
    // Generar y descargar el PDF
    const fileName = `reporte_fenix_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    showNotification("Archivo PDF exportado exitosamente", "success");
  } catch (error) {
    console.error("Error al exportar PDF:", error);
    showNotification("Error al exportar PDF. Verifica que la librería esté cargada.", "error");
  }
}

// Función para recargar la página
function reiniciar() {
  location.reload();
}

fetch("productos.json")
  .then((response) => response.json())
  .then((data) => (productos = data))
  .catch((error) => console.error("Error cargando productos:", error));

// Función para procesar los datos ingresados
function procesarDatosCore() {
  const pedidoTexto = document.getElementById("pedido").value;
  const lineas = pedidoTexto.split("\n");
  const resultadosIndividuales = document.getElementById("resultado-individuales");
  const resultadoCamiones = document.getElementById("resultado-camiones");
  const pesoTotalElem = document.getElementById("peso-total");
  const volumenTotalBolsaElem = document.getElementById("volumen-total-bolsa");
  const volumenTotalCajasElem = document.getElementById("volumen-total-cajas");
  const volumenConsolidadoElem = document.getElementById("volumen-consolidado-cajas-bolsas");

  // Limpiar resultados anteriores
  resultadosIndividuales.innerHTML = "";
  resultadoCamiones.innerHTML = "";
  pesoTotalElem.textContent = "0 kg";
  volumenTotalBolsaElem.textContent = "0 m³";
  volumenTotalCajasElem.textContent = "0 m³";
  volumenConsolidadoElem.textContent = "0 m³";

  let volumenTotal = 0;
  let pesoTotal = 0;
  let totalCanastilla = 0;
  let volumenTotalBolsa = 0;
  let volumenTotalCajas = 0;

  const VOLUMEN_CANASTA = 2.89;

  lineas.forEach((linea) => {
    const datos = linea.includes("\t") ? linea.split("\t") : linea.split(/[\s,]+/);

    if (datos.length >= 2) {
      const codigo = datos[0].trim().toUpperCase();
      const cantidadStr = datos[1].trim();
      const cantidad = parseInt(cantidadStr);
      const producto = productos.find((p) => p.codigo.trim() === codigo.trim());

      if (producto) {
        const largo_m = producto.largo_m || 0;
        const alto_m = producto.alto_m || 0;
        const ancho_m = producto.ancho_m || 0;
        const volumenUnidad = largo_m * alto_m * ancho_m;
        const pesoUnidadGramos = producto.peso_unidad_empaque || 0;
        const volumenTotalProducto = volumenUnidad * cantidad;
        const pesoTotalProducto = pesoUnidadGramos * cantidad;

        volumenTotal += volumenTotalProducto;
        pesoTotal += pesoTotalProducto;

        const volumenCanastillaUnidad = VOLUMEN_CANASTA / producto.empaque_canasta;
        const volumenTotalCanastilla = volumenCanastillaUnidad * cantidad;

        const cubicajeBolsa = producto.tipo === "Bolsa" ? parseFloat(volumenTotalCanastilla.toFixed(6)) : 0;
        const cubicajeCaja = producto.tipo === "Caja" ? parseFloat(volumenTotalProducto.toFixed(6)) : 0;

        volumenTotalBolsa += cubicajeBolsa;
        volumenTotalCajas += cubicajeCaja;
        totalCanastilla += volumenTotalCanastilla;

        const cubicajeTotal = (parseFloat(cubicajeBolsa) + parseFloat(cubicajeCaja)).toFixed(6);

        const fila = `<tr>
                      <td>${producto.codigo}</td>
                      <td>${producto.empaque || "N/A"}</td>
                      <td>${producto.unidad_empaque_gramos || "N/A"}</td>
                      <td>${(pesoUnidadGramos / 1000).toFixed(4)}</td>
                      <td>${producto.empaque_canasta || "N/A"}</td>
                      <td>${volumenUnidad.toFixed(6)}</td>
                      <td>${volumenCanastillaUnidad.toFixed(6)}</td>
                      <td>${cantidad}</td>
                      <td>${volumenTotalProducto.toFixed(6)}</td> 
                      <td>${volumenTotalCanastilla.toFixed(6)}</td>                 
                      <td>${(pesoTotalProducto / 1000).toFixed(2)}</td>
                      <td>${cubicajeBolsa}</td>                   
                      <td>${cubicajeCaja}</td>
                    </tr>`;

        resultadosIndividuales.insertAdjacentHTML("beforeend", fila);
      } else {
        const fila = `<tr>
                      <td>${codigo.trim()}</td>
                      <td colspan="12">Producto no encontrado</td>
                    </tr>`;
        resultadosIndividuales.insertAdjacentHTML("beforeend", fila);
      }
    }
  });

  // Actualizar las tarjetas de resultados con animación
  const volumenConsolidadoCajasBolsas = volumenTotalBolsa + volumenTotalCajas;
  
  // GUARDAR DATOS CALCULADOS DIRECTAMENTE (Evitar leer del DOM animado)
  datosCalculados.totales = {
      pesoTotal: pesoTotal / 1000,
      volumenTotalBolsa: volumenTotalBolsa,
      volumenTotalCajas: volumenTotalCajas,
      volumenConsolidado: volumenConsolidadoCajasBolsas
  };
  
  // Animar los cambios de valores
  animateValue(pesoTotalElem, 0, pesoTotal / 1000, 1000, (value) => `${value.toFixed(2)} kg`);
  animateValue(volumenTotalBolsaElem, 0, volumenTotalBolsa, 1000, (value) => `${value.toFixed(6)} m³`);
  animateValue(volumenTotalCajasElem, 0, volumenTotalCajas, 1000, (value) => `${value.toFixed(6)} m³`);
  animateValue(volumenConsolidadoElem, 0, volumenConsolidadoCajasBolsas, 1000, (value) => `${value.toFixed(6)} m³`);

  // Análisis de camiones
  const camiones = [
    { nombre: "Camión Placa WDL-969", capacidadVolumen: 16.75, capacidadPeso: 2100 },
    { nombre: "Camión Placa SQD-655", capacidadVolumen: 57.61, capacidadPeso: 7000 },
    { nombre: "Camión Placa SQD-563", capacidadVolumen: 57.88, capacidadPeso: 7000 },
    { nombre: "Camión Placa WCW-366", capacidadVolumen: 60.68, capacidadPeso: 6900 },
    { nombre: "Camión Placa TJB-056", capacidadVolumen: 58.73, capacidadPeso: 7000 },
    { nombre: "Camión Placa SZR-699", capacidadVolumen: 75.25, capacidadPeso: 24000 },
    { nombre: "Camión Placa SZR-652", capacidadVolumen: 75.25, capacidadPeso: 24000 },
    { nombre: "Contenedor 20 ST", capacidadVolumen: 26.0, capacidadPeso: 22180 },
    { nombre: "Contenedor 40 ST", capacidadVolumen: 60, capacidadPeso: 27750 },
    { nombre: "Contenedor 40 HC", capacidadVolumen: 68.0, capacidadPeso: 29600 },
  ];

  camiones.forEach((camion) => {
    const volumenUtilizado = (volumenConsolidadoCajasBolsas / camion.capacidadVolumen) * 100;
    const pesoUtilizado = (pesoTotal / 1000 / camion.capacidadPeso) * 100;
    const volumenMetros = camion.capacidadVolumen - totalCanastilla;
    const cabe = volumenUtilizado <= 100 && pesoUtilizado <= 100 ? "Sí" : "No";

    const filaCamion = document.createElement("tr");

    const nombreTd = document.createElement("td");
    nombreTd.textContent = camion.nombre;

    const capacidadVolumenTd = document.createElement("td");
    capacidadVolumenTd.textContent = camion.capacidadVolumen;

    const capacidadPesoTd = document.createElement("td");
    capacidadPesoTd.textContent = camion.capacidadPeso;

    const volumenTd = document.createElement("td");
    volumenTd.textContent = `${volumenUtilizado.toFixed(4)}%`;
    if (volumenUtilizado > 100) {
      volumenTd.style.color = "#ef4444";
      volumenTd.style.fontWeight = "bold";
    }

    const pesoTd = document.createElement("td");
    pesoTd.textContent = `${pesoUtilizado.toFixed(2)}%`;
    if (pesoUtilizado >= 100) {
      pesoTd.style.color = "#ef4444";
      pesoTd.style.fontWeight = "bold";
    }

    const volumenMetrosTd = document.createElement("td");
    volumenMetrosTd.textContent = `${volumenConsolidadoCajasBolsas.toFixed(2)}m³`;

    const cubicajeTotalCBTd = document.createElement("td");
    const cubicajeTotalCB = camion.capacidadVolumen - volumenConsolidadoCajasBolsas;
    cubicajeTotalCBTd.textContent = `${cubicajeTotalCB.toFixed(2)}m³`;

    const cabeTd = document.createElement("td");
    cabeTd.textContent = cabe;
    if (cabe === "Sí") {
      cabeTd.style.color = "#10b981";
      cabeTd.style.fontWeight = "bold";
    } else {
      cabeTd.style.color = "#ef4444";
      cabeTd.style.fontWeight = "bold";
    }

    filaCamion.appendChild(nombreTd);
    filaCamion.appendChild(capacidadVolumenTd);
    filaCamion.appendChild(capacidadPesoTd);
    filaCamion.appendChild(volumenTd);
    filaCamion.appendChild(pesoTd);
    filaCamion.appendChild(volumenMetrosTd);
    filaCamion.appendChild(cubicajeTotalCBTd);
    filaCamion.appendChild(cabeTd);

    resultadoCamiones.appendChild(filaCamion);
  });

  // Mostrar mensaje de éxito
  showNotification("Cálculo completado exitosamente", "success");
}

// Función para animar valores
function animateValue(element, start, end, duration, formatter) {
  const startTime = performance.now();
  const change = end - start;
  
  function updateValue(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Función de easing suave
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = start + change * easeOutQuart;
    
    element.textContent = formatter(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(updateValue);
    }
  }
  
  requestAnimationFrame(updateValue);
}

// Función para mostrar notificaciones
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  
  let icon = 'info-circle';
  let bgColor = '#3b82f6';
  
  switch(type) {
    case 'success':
      icon = 'check-circle';
      bgColor = '#10b981';
      break;
    case 'error':
      icon = 'exclamation-triangle';
      bgColor = '#ef4444';
      break;
    case 'warning':
      icon = 'exclamation-circle';
      bgColor = '#f59e0b';
      break;
    default:
      icon = 'info-circle';
      bgColor = '#3b82f6';
  }
  
  notification.innerHTML = `
    <i class="fas fa-${icon}"></i>
    <span>${message}</span>
  `;
  
  // Estilos para la notificación
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${bgColor};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 400px;
    word-wrap: break-word;
  `;
  
  document.body.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);
  
  // Remover después de 4 segundos para errores, 3 para otros
  const duration = type === 'error' ? 4000 : 3000;
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
    }, duration);
}

// ========================================
// NUEVAS FUNCIONALIDADES - MEJORAS DE VISUALIZACIÓN
// ========================================

// Variables globales para gráficos
let chartCamiones, chartDistribucion, chartComparacion;
let autocompleteInstance;
let datosCalculados = {
    productos: [],
    camiones: [],
    totales: {}
};

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar autocompletado si existe el textarea
    const pedidoTextarea = document.getElementById('pedido');
    if (pedidoTextarea && typeof ProductAutocomplete !== 'undefined') {
        autocompleteInstance = new ProductAutocomplete(pedidoTextarea, productos);
    }
    
    // Agregar validación en tiempo real
    if (pedidoTextarea) {
        pedidoTextarea.addEventListener('input', validarEnTiempoReal);
    }
    
    // Cargar preferencias guardadas
    cargarPreferencias();
    
    // Inicializar gráficos vacíos
    inicializarGraficos();
});

// ========================================
// FUNCIONES DE GRÁFICOS
// ========================================

function inicializarGraficos() {
    // Gráfico de camiones
    const ctxCamiones = document.getElementById('chart-camiones');
    if (ctxCamiones) {
        chartCamiones = new Chart(ctxCamiones, getHorizontalBarChartConfig(
            [],
            [],
            'Utilización (%)',
            []
        ));
    }
    
    // Gráfico de distribución
    const ctxDistribucion = document.getElementById('chart-distribucion');
    if (ctxDistribucion) {
        chartDistribucion = new Chart(ctxDistribucion, getDoughnutChartConfig(
            ['Bolsas', 'Cajas'],
            [0, 0],
            [COLORS.info, COLORS.purple],
            'Distribución de Empaque'
        ));
    }
    
    // Gráfico de comparación
    const ctxComparacion = document.getElementById('chart-comparacion');
    if (ctxComparacion) {
        chartComparacion = new Chart(ctxComparacion, getBarChartConfig(
            [],
            [],
            'Capacidad (m³)',
            COLORS.primary
        ));
    }
}

function actualizarGraficos() {
    if (!datosCalculados.camiones || datosCalculados.camiones.length === 0) return;
    
    // Actualizar gráfico de camiones (top 5 por utilización)
    const top5Camiones = [...datosCalculados.camiones]
        .sort((a, b) => b.volumenUtilizado - a.volumenUtilizado)
        .slice(0, 5);
    
    const nombresCamiones = top5Camiones.map(c => c.nombre.replace('Camión Placa ', '').replace('Contenedor ', ''));
    const utilizaciones = top5Camiones.map(c => c.volumenUtilizado);
    const colores = utilizaciones.map(u => getColorByPercentage(u));
    
    if (chartCamiones) {
        chartCamiones.data.labels = nombresCamiones;
        chartCamiones.data.datasets[0].data = utilizaciones;
        chartCamiones.data.datasets[0].backgroundColor = colores;
        chartCamiones.data.datasets[0].borderColor = colores;
        chartCamiones.update();
    }
    
    // Actualizar gráfico de distribución
    const volumenBolsas = datosCalculados.totales.volumenTotalBolsa || 0;
    const volumenCajas = datosCalculados.totales.volumenTotalCajas || 0;
    
    if (chartDistribucion && (volumenBolsas > 0 || volumenCajas > 0)) {
        chartDistribucion.data.datasets[0].data = [volumenBolsas, volumenCajas];
        chartDistribucion.update();
    }
    
    // Actualizar gráfico de comparación
    const nombresComparacion = datosCalculados.camiones.map(c => c.nombre.replace('Camión Placa ', '').replace('Contenedor ', ''));
    const capacidades = datosCalculados.camiones.map(c => c.capacidadVolumen);
    
    if (chartComparacion) {
        chartComparacion.data.labels = nombresComparacion;
        chartComparacion.data.datasets[0].data = capacidades;
        chartComparacion.update();
    }
}

// ========================================
// FUNCIONES DE MÉTRICAS Y KPIs
// ========================================

function calcularMetricas() {
    const productosCount = datosCalculados.productos.length;
    const camionesDisponibles = datosCalculados.camiones.filter(c => c.cabe === 'Sí').length;
    const totalCamiones = datosCalculados.camiones.length;
    
    // Calcular eficiencia (promedio de utilización de camiones que caben)
    const camionesQueCaben = datosCalculados.camiones.filter(c => c.cabe === 'Sí');
    const eficiencia = camionesQueCaben.length > 0
        ? camionesQueCaben.reduce((sum, c) => sum + c.volumenUtilizado, 0) / camionesQueCaben.length
        : 0;
    
    // Encontrar mejor opción (mayor eficiencia sin exceder 100%)
    const mejorOpcion = camionesQueCaben.length > 0
        ? camionesQueCaben.reduce((best, current) => {
            if (current.volumenUtilizado > best.volumenUtilizado && current.volumenUtilizado <= 100) {
                return current;
            }
            return best;
        }, camionesQueCaben[0])
        : null;
    
    return {
        productos: productosCount,
        camionesDisponibles: `${camionesDisponibles}/${totalCamiones}`,
        eficiencia: eficiencia.toFixed(1) + '%',
        mejorOpcion: mejorOpcion ? mejorOpcion.nombre.replace('Camión Placa ', '').replace('Contenedor ', '') : '-'
    };
}

function mostrarMetricas() {
    const metricas = calcularMetricas();
    
    animateValue(
        document.getElementById('metric-productos'),
        0,
        metricas.productos,
        800,
        (value) => Math.round(value).toString()
    );
    
    document.getElementById('metric-camiones').textContent = metricas.camionesDisponibles;
    document.getElementById('metric-eficiencia').textContent = metricas.eficiencia;
    document.getElementById('metric-mejor').textContent = metricas.mejorOpcion;
    
    // Celebrar si la eficiencia es alta
    const eficienciaNum = parseFloat(metricas.eficiencia);
    if (eficienciaNum >= 90 && typeof confetti !== 'undefined') {
        celebrarCargaOptima();
    }
}

function celebrarCargaOptima() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [COLORS.success, COLORS.primary, COLORS.warning]
    });
    
    showNotification('¡Excelente! Eficiencia de carga óptima (>90%)', 'success');
}

// ========================================
// FUNCIONES DE BÚSQUEDA Y FILTROS
// ========================================

function buscarEnTabla() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const tabla = document.getElementById('resultado-individuales');
    if (!tabla) return;
    
    const filas = tabla.getElementsByTagName('tr');
    
    for (let fila of filas) {
        const texto = fila.textContent.toLowerCase();
        if (texto.includes(searchTerm)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    }
}

function filtrarPorTipo() {
    const filtroSelect = document.getElementById('filter-tipo');
    if (!filtroSelect) return;
    
    const tipoSeleccionado = filtroSelect.value;
    const tabla = document.getElementById('resultado-individuales');
    if (!tabla) return;
    
    const filas = tabla.getElementsByTagName('tr');
    
    for (let fila of filas) {
        if (tipoSeleccionado === '') {
            fila.style.display = '';
        } else {
            const celdas = fila.getElementsByTagName('td');
            if (celdas.length > 1) {
                const empaque = celdas[1].textContent; // Columna de empaque
                if (empaque.includes(tipoSeleccionado)) {
                    fila.style.display = '';
                } else {
                    fila.style.display = 'none';
                }
            }
        }
    }
}

function resetearFiltros() {
    const searchInput = document.getElementById('search-input');
    const filtroSelect = document.getElementById('filter-tipo');
    
    if (searchInput) searchInput.value = '';
    if (filtroSelect) filtroSelect.value = '';
    
    const tabla = document.getElementById('resultado-individuales');
    if (tabla) {
        const filas = tabla.getElementsByTagName('tr');
        for (let fila of filas) {
            fila.style.display = '';
        }
    }
}

// ========================================
// FUNCIONES DE VALIDACIÓN EN TIEMPO REAL
// ========================================

function validarEnTiempoReal() {
    const textarea = document.getElementById('pedido');
    if (!textarea) return;
    
    const lineas = textarea.value.split('\n');
    let validos = 0;
    let invalidos = 0;
    
    lineas.forEach(linea => {
        if (linea.trim() === '') return;
        
        const validacion = validateProductLine(linea);
        if (validacion.valid) {
            validos++;
        } else {
            invalidos++;
        }
    });
    
    // Actualizar contadores
    const validCount = document.querySelector('.valid-count');
    const invalidCount = document.querySelector('.invalid-count');
    
    if (validCount) validCount.textContent = `✓ ${validos}`;
    if (invalidCount) invalidCount.textContent = `✗ ${invalidos}`;
}

// ========================================
// FUNCIONES DE CARGA DE ARCHIVOS
// ========================================

function cargarArchivo() {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.click();
    }
}

function procesarArchivo(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (extension === 'csv') {
        procesarCSV(file);
    } else if (extension === 'xlsx' || extension === 'xls') {
        procesarExcel(file);
    } else {
        showNotification('Formato de archivo no soportado', 'error');
    }
}

function procesarCSV(file) {
    if (typeof Papa === 'undefined') {
        showNotification('Librería CSV no disponible', 'error');
        return;
    }
    
    Papa.parse(file, {
        complete: function(results) {
            let contenido = '';
            results.data.forEach(row => {
                if (row.length >= 2 && row[0] && row[1]) {
                    contenido += `${row[0]},${row[1]}\n`;
                }
            });
            
            const textarea = document.getElementById('pedido');
            if (textarea) {
                textarea.value = contenido.trim();
                validarEnTiempoReal();
                showNotification('Archivo CSV cargado exitosamente', 'success');
            }
        },
        error: function(error) {
            showNotification('Error al procesar CSV: ' + error.message, 'error');
        }
    });
}

function procesarExcel(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            
            let contenido = '';
            jsonData.forEach(row => {
                if (row.length >= 2 && row[0] && row[1]) {
                    contenido += `${row[0]},${row[1]}\n`;
                }
            });
            
            const textarea = document.getElementById('pedido');
            if (textarea) {
                textarea.value = contenido.trim();
                validarEnTiempoReal();
                showNotification('Archivo Excel cargado exitosamente', 'success');
            }
        } catch (error) {
            showNotification('Error al procesar Excel: ' + error.message, 'error');
        }
    };
    
    reader.readAsArrayBuffer(file);
}

function descargarPlantilla() {
    const plantilla = `CÓDIGO,CANTIDAD
PF101,12
PF102,24
PF103,6`;
    
    downloadFile(plantilla, 'plantilla_productos.csv', 'text/csv');
    showNotification('Plantilla descargada', 'success');
}

function limpiarTextarea() {
    const textarea = document.getElementById('pedido');
    if (textarea) {
        if (confirm('¿Estás seguro de que quieres limpiar todos los datos?')) {
            textarea.value = '';
            validarEnTiempoReal();
            showNotification('Datos limpiados', 'info');
        }
    }
}

// ========================================
// FUNCIONES DE COMPARACIÓN DE CAMIONES
// ========================================

function abrirModalComparacion() {
    const modal = document.getElementById('modal-comparacion');
    if (!modal) return;
    
    // Llenar selector de camiones
    const selector = document.getElementById('camiones-selector');
    if (selector && datosCalculados.camiones.length > 0) {
        selector.innerHTML = '';
        datosCalculados.camiones.forEach((camion, index) => {
            const checkboxItem = createElement('label', 'checkbox-item');
            checkboxItem.innerHTML = `
                <input type="checkbox" value="${index}" onchange="limitarSeleccion(this)">
                <span>${camion.nombre}</span>
            `;
            selector.appendChild(checkboxItem);
        });
    }
    
    modal.classList.add('active');
}

function cerrarModalComparacion() {
    const modal = document.getElementById('modal-comparacion');
    if (modal) {
        modal.classList.remove('active');
    }
}

function limitarSeleccion(checkbox) {
    const checkboxes = document.querySelectorAll('#camiones-selector input[type="checkbox"]');
    const seleccionados = Array.from(checkboxes).filter(cb => cb.checked);
    
    if (seleccionados.length > 3) {
        checkbox.checked = false;
        showNotification('Máximo 3 camiones para comparar', 'warning');
    }
}

function compararSeleccionados() {
    const checkboxes = document.querySelectorAll('#camiones-selector input[type="checkbox"]:checked');
    const indices = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    if (indices.length < 2) {
        showNotification('Selecciona al menos 2 camiones para comparar', 'warning');
        return;
    }
    
    const camionesSeleccionados = indices.map(i => datosCalculados.camiones[i]);
    
    // Crear tabla de comparación
    const container = document.getElementById('comparison-results');
    if (container) {
        let html = '<table class="modern-table"><thead><tr>';
        html += '<th>Característica</th>';
        camionesSeleccionados.forEach(c => {
            html += `<th>${c.nombre}</th>`;
        });
        html += '</tr></thead><tbody>';
        
        // Filas de comparación
        const filas = [
            { label: 'Capacidad Volumen', key: 'capacidadVolumen', suffix: ' m³' },
            { label: 'Capacidad Peso', key: 'capacidadPeso', suffix: ' kg' },
            { label: 'Volumen Utilizado', key: 'volumenUtilizado', suffix: '%' },
            { label: 'Peso Utilizado', key: 'pesoUtilizado', suffix: '%' },
            { label: '¿Cabe?', key: 'cabe', suffix: '' }
        ];
        
        filas.forEach(fila => {
            html += `<tr><td><strong>${fila.label}</strong></td>`;
            camionesSeleccionados.forEach(c => {
                let valor = c[fila.key];
                if (typeof valor === 'number') {
                    valor = valor.toFixed(2);
                }
                html += `<td>${valor}${fila.suffix}</td>`;
            });
            html += '</tr>';
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    }
    
    // Generar recomendación
    const mejorOpcion = camionesSeleccionados.reduce((mejor, actual) => {
        if (actual.cabe === 'Sí') {
            if (mejor.cabe !== 'Sí' || actual.volumenUtilizado > mejor.volumenUtilizado) {
                return actual;
            }
        }
        return mejor;
    }, camionesSeleccionados[0]);
    
    const recomendacion = document.getElementById('recommendation');
    if (recomendacion) {
        recomendacion.innerHTML = `
            <h3><i class="fas fa-lightbulb"></i> Recomendación</h3>
            <p><strong>${mejorOpcion.nombre}</strong> es la mejor opción con una utilización de <strong>${mejorOpcion.volumenUtilizado.toFixed(2)}%</strong> del volumen.</p>
        `;
    }
}

// ========================================
// FUNCIONES DE ACCESIBILIDAD
// ========================================

function cambiarTamañoFuente(tamaño) {
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${tamaño}`);
    
    // Guardar preferencia
    storage.set('fontSize', tamaño);
    
    // Actualizar botones activos
    document.querySelectorAll('.toolbar-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.toolbar-btn').classList.add('active');
}

function toggleAltoContraste() {
    document.body.classList.toggle('high-contrast');
    const activo = document.body.classList.contains('high-contrast');
    
    // Guardar preferencia
    storage.set('highContrast', activo);
    
    // Actualizar botón
    event.target.closest('.toolbar-btn').classList.toggle('active');
    
    showNotification(
        activo ? 'Modo alto contraste activado' : 'Modo alto contraste desactivado',
        'info'
    );
}

function cargarPreferencias() {
    const fontSize = storage.get('fontSize', 'medium');
    const highContrast = storage.get('highContrast', false);
    
    if (fontSize) {
        document.body.classList.add(`font-${fontSize}`);
    }
    
    if (highContrast) {
        document.body.classList.add('high-contrast');
    }
}

// ========================================
// MODIFICACIÓN DE LA FUNCIÓN procesarDatos ORIGINAL
// ========================================

// Sobrescribir con versión mejorada
function procesarDatos() {
    // Mostrar skeleton loaders
    mostrarSkeletonLoader();
    
    // Ejecutar procesamiento original con delay para mostrar loaders
    setTimeout(() => {
        procesarDatosCore();
        
        // Guardar datos para gráficos y métricas
        guardarDatosCalculados();
        
        // Actualizar visualizaciones
        actualizarGraficos();
        mostrarMetricas();
        
        // Ocultar skeleton loaders
        ocultarSkeletonLoader();
        
        // Agregar clases de animación
        document.querySelectorAll('.result-card, .metric-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-scale-in');
            }, index * 100);
        });
    }, 500);
}

function mostrarSkeletonLoader() {
    // Agregar estado de carga a las tarjetas de resultados sin destruir el DOM
    const ids = ['peso-total', 'volumen-total-bolsa', 'volumen-total-cajas', 'volumen-consolidado-cajas-bolsas'];
    
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            // Guardar valor actual si es necesario, o simplemente poner spinner
            el.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculando...';
            el.style.opacity = '0.7';
        }
    });
    
    // También limpiar tablas visualmente
    const tablaIndividuales = document.getElementById('resultado-individuales');
    if (tablaIndividuales) {
        tablaIndividuales.innerHTML = '<tr><td colspan="13" style="text-align:center; padding: 2rem;"><i class="fas fa-spinner fa-spin fa-2x"></i><br>Procesando datos...</td></tr>';
    }
    
    const tablaCamiones = document.getElementById('resultado-camiones');
    if (tablaCamiones) {
        tablaCamiones.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 2rem;"><i class="fas fa-spinner fa-spin fa-2x"></i><br>Analizando camiones...</td></tr>';
    }
}

function ocultarSkeletonLoader() {
    // Restaurar opacidad de los elementos
    const ids = ['peso-total', 'volumen-total-bolsa', 'volumen-total-cajas', 'volumen-consolidado-cajas-bolsas'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.opacity = '1';
        }
    });
}

function guardarDatosCalculados() {
    // Guardar productos procesados
    const tablaIndividuales = document.getElementById('resultado-individuales');
    if (tablaIndividuales) {
        const filas = tablaIndividuales.getElementsByTagName('tr');
        datosCalculados.productos = Array.from(filas).map(fila => {
            const celdas = fila.getElementsByTagName('td');
            if (celdas.length > 0) {
                return {
                    codigo: celdas[0]?.textContent || '',
                    empaque: celdas[1]?.textContent || '',
                    tipo: celdas[1]?.textContent.includes('Bolsa') ? 'Bolsa' : 'Caja'
                };
            }
            return null;
        }).filter(p => p !== null);
    }
    
    // Guardar datos de camiones
    const tablaCamiones = document.getElementById('resultado-camiones');
    if (tablaCamiones) {
        const filas = tablaCamiones.getElementsByTagName('tr');
        datosCalculados.camiones = Array.from(filas).map(fila => {
            const celdas = fila.getElementsByTagName('td');
            if (celdas.length >= 8) {
                return {
                    nombre: celdas[0]?.textContent || '',
                    capacidadVolumen: parseFloat(celdas[1]?.textContent) || 0,
                    capacidadPeso: parseFloat(celdas[2]?.textContent) || 0,
                    volumenUtilizado: parseFloat(celdas[3]?.textContent) || 0,
                    pesoUtilizado: parseFloat(celdas[4]?.textContent) || 0,
                    cabe: celdas[7]?.textContent || 'No'
                };
            }
            return null;
        }).filter(c => c !== null);
    }
    
    // Guardar totales - YA NO ES NECESARIO LEER DEL DOM
    // Los totales se guardan directamente en procesarDatosCore para evitar leer valores animados (0)
    /*
    datosCalculados.totales = {
        pesoTotal: parseFloat(document.getElementById('peso-total')?.textContent) || 0,
        volumenTotalBolsa: parseFloat(document.getElementById('volumen-total-bolsa')?.textContent) || 0,
        volumenTotalCajas: parseFloat(document.getElementById('volumen-total-cajas')?.textContent) || 0,
        volumenConsolidado: parseFloat(document.getElementById('volumen-consolidado-cajas-bolsas')?.textContent) || 0
    };
    */
}

// Agregar botón de comparación a la sección de acciones
document.addEventListener('DOMContentLoaded', function() {
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        const compareBtn = createElement('button', 'action-btn success');
        compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i> Comparar Camiones';
        compareBtn.onclick = abrirModalComparacion;
        actionButtons.appendChild(compareBtn);
    }
});