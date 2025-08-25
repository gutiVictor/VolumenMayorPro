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
function procesarDatos() {
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