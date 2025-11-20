/**
 * Configuración centralizada para Chart.js
 * Sistema de Cubicaje FENIX
 */

// Paleta de colores del tema
const COLORS = {
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    success: '#10b981',
    successDark: '#059669',
    warning: '#f59e0b',
    warningDark: '#d97706',
    danger: '#ef4444',
    dangerDark: '#dc2626',
    info: '#3b82f6',
    purple: '#8b5cf6',
    pink: '#ec4899',
    gray: '#6b7280',
    lightGray: '#9ca3af',
};

// Configuración por defecto para todos los gráficos
const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: '#f9fafb',
                font: {
                    family: 'Inter, sans-serif',
                    size: 12,
                    weight: 500
                },
                padding: 15
            }
        },
        tooltip: {
            backgroundColor: 'rgba(31, 41, 55, 0.95)',
            titleColor: '#f9fafb',
            bodyColor: '#d1d5db',
            borderColor: '#374151',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            titleFont: {
                family: 'Inter, sans-serif',
                size: 14,
                weight: 600
            },
            bodyFont: {
                family: 'Inter, sans-serif',
                size: 13
            }
        }
    }
};

// Configuración para gráfico de barras
function getBarChartConfig(labels, data, label, color) {
    return {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            ...defaultChartOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(55, 65, 81, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#d1d5db',
                        font: {
                            family: 'Inter, sans-serif',
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#d1d5db',
                        font: {
                            family: 'Inter, sans-serif',
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    };
}

// Configuración para gráfico circular/donut
function getDoughnutChartConfig(labels, data, colors, title) {
    return {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: '#1f2937',
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            ...defaultChartOptions,
            cutout: '65%',
            plugins: {
                ...defaultChartOptions.plugins,
                legend: {
                    ...defaultChartOptions.plugins.legend,
                    position: 'bottom',
                    labels: {
                        ...defaultChartOptions.plugins.legend.labels,
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                title: {
                    display: true,
                    text: title,
                    color: '#f9fafb',
                    font: {
                        family: 'Inter, sans-serif',
                        size: 16,
                        weight: 600
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                }
            }
        }
    };
}

// Configuración para gráfico de líneas
function getLineChartConfig(labels, datasets) {
    return {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            ...defaultChartOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(55, 65, 81, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#d1d5db',
                        font: {
                            family: 'Inter, sans-serif',
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(55, 65, 81, 0.3)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#d1d5db',
                        font: {
                            family: 'Inter, sans-serif',
                            size: 11
                        }
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.4,
                    borderWidth: 3
                },
                point: {
                    radius: 4,
                    hoverRadius: 6,
                    borderWidth: 2
                }
            }
        }
    };
}

// Configuración para gráfico de barras horizontales
function getHorizontalBarChartConfig(labels, data, label, colors) {
    return {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            ...defaultChartOptions,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(55, 65, 81, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#d1d5db',
                        font: {
                            family: 'Inter, sans-serif',
                            size: 11
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#d1d5db',
                        font: {
                            family: 'Inter, sans-serif',
                            size: 11
                        }
                    }
                }
            }
        }
    };
}



// Utilidad para crear gradiente
function createGradient(ctx, color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
}
