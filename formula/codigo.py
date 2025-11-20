import pandas as pd
import json

# Leer el archivo Excel
archivo_excel = 'python.xlsx'
hoja = 'Hoja1'

# Leer todas las filas y columnas
df = pd.read_excel(archivo_excel, sheet_name=hoja, engine='openpyxl')

# Limpiar nombres de columnas (eliminar espacios extra, saltos de línea, etc.)
df.columns = df.columns.str.strip()

# Asegurarnos de que los nombres de columnas coincidan
# Renombramos manualmente si hay errores de formato
nombres_correctos = [
    'codigo', 'empaque', 'unidad_empaque_gramos', 'peso_unidad_empaque',
    'empaque_canasta', 'largo_m', 'alto_m', 'ancho_m', 'tipo'
]
df = df.iloc[:, :9]  # Tomar solo las primeras 9 columnas
df.columns = nombres_correctos

# Limpiar datos: eliminar filas vacías
df.dropna(how='all', inplace=True)

# Resetear índice
df.reset_index(drop=True, inplace=True)

# Asegurar tipos de datos correctos
df['codigo'] = df['codigo'].astype(str).str.strip()
df['empaque'] = df['empaque'].astype(str).str.strip()
df['unidad_empaque_gramos'] = pd.to_numeric(df['unidad_empaque_gramos'], errors='coerce')
df['peso_unidad_empaque'] = pd.to_numeric(df['peso_unidad_empaque'], errors='coerce')
df['empaque_canasta'] = pd.to_numeric(df['empaque_canasta'], errors='coerce')
df['largo_m'] = pd.to_numeric(df['largo_m'], errors='coerce')
df['alto_m'] = pd.to_numeric(df['alto_m'], errors='coerce')
df['ancho_m'] = pd.to_numeric(df['ancho_m'], errors='coerce')
df['tipo'] = df['tipo'].astype(str).str.strip()

# Rellenar valores NaN con 0 o valor por defecto si es necesario
df.fillna(0, inplace=True)

# Asegurar que 'peso_unidad_empaque' tenga .0 (formato float)
# Python automáticamente lo maneja como float si usamos float()

# Convertir a lista de diccionarios
lista_json = df.to_dict(orient='records')

# Formatear cada valor de 'peso_unidad_empaque' como float (ya está, pero aseguramos)
for item in lista_json:
    item['peso_unidad_empaque'] = float(item['peso_unidad_empaque'])
    item['unidad_empaque_gramos'] = int(item['unidad_empaque_gramos'])
    item['empaque_canasta'] = int(item['empaque_canasta'])
    item['largo_m'] = float(item['largo_m'])
    item['alto_m'] = float(item['alto_m'])
    item['ancho_m'] = float(item['ancho_m'])

# Guardar como archivo JSON
with open('salida.json', 'w', encoding='utf-8') as f:
    json.dump(lista_json, f, indent=2, ensure_ascii=False)

print("✅ Archivo 'salida.json' generado correctamente.")