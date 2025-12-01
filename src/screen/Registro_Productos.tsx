// src/screens/Registro_Productos.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, Modal, StyleSheet, ScrollView } from 'react-native';
import TextInputField from '../components/TextInputField';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { Product } from '../types/productos';

type Props = NativeStackScreenProps<RootStackParamList, 'Registro'>;
const STORAGE_KEY = 'PRODUCTS_V1';

export default function RegistroProductos({ navigation }: Props) {
  // --- Estados para el formulario ---
  const [nombre, setNombre] = useState('');
  const [marca, setMarca] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [fechaCompra, setFechaCompra] = useState('');
  const [fechaCaducidad, setFechaCaducidad] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [cantidad, setCantidad] = useState('');
  
  // --- Estados para el escáner ---
  const [scannerOpen, setScannerOpen] = useState(false);
  const [hasPermission, requestPermission] = BarCodeScanner.usePermissions();

  // Solicitar permisos al montar el componente
  useEffect(() => {
    requestPermission();
  }, []);

  // Función para guardar el producto
  async function save() {
    if (!nombre.trim()) {
      Alert.alert('Validación', 'El nombre es obligatorio.');
      return;
    }

    const newProduct: Product = {
      id: uuidv4(),
      nombre: nombre.trim(),
      marca: marca.trim() || undefined,
      proveedor: proveedor.trim() || undefined,
      precioCompra: precioCompra ? Number(precioCompra) : undefined,
      precioVenta: precioVenta ? Number(precioVenta) : undefined,
      fechaCompra: fechaCompra || undefined,
      fechaCaducidad: fechaCaducidad || undefined,
      codigoBarras: codigoBarras || undefined,
      cantidad: cantidad ? Number(cantidad) : undefined
    };

    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(newProduct);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      Alert.alert('Éxito', 'Producto guardado', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (e) {
      console.warn(e);
      Alert.alert('Error', 'No fue posible guardar el producto');
    }
  }

  // Manejador del escaneo de códigos de barras
  const handleBarCodeScanned = ({ type, data }: BarCodeScannerResult) => {
    setScannerOpen(false);
    setCodigoBarras(data);
    Alert.alert("Código Escaneado", `Tipo: ${type}\nCódigo: ${data}`);
  };

  // Lógica para abrir el escáner
  const openScanner = () => {
    if (!hasPermission?.granted) {
      Alert.alert(
        'Permiso de Cámara', 
        'Necesitas otorgar permiso de cámara para escanear códigos de barras. Por favor, habilítalo en la configuración de tu dispositivo.'
      );
      return;
    }
    setScannerOpen(true);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Campos de Entrada */}
      <TextInputField label="Nombre" value={nombre} onChangeText={setNombre} placeholder="Ej. Leche entera 1L" />
      <TextInputField label="Marca" value={marca} onChangeText={setMarca} placeholder="Ej. Nombra" />
      <TextInputField label="Proveedor" value={proveedor} onChangeText={setProveedor} placeholder="Nombre del proveedor" />
      <TextInputField label="Precio de compra" value={precioCompra} onChangeText={setPrecioCompra} keyboardType="numeric" placeholder="0.00" />
      <TextInputField label="Precio de venta" value={precioVenta} onChangeText={setPrecioVenta} keyboardType="numeric" placeholder="0.00" />
      <TextInputField label="Fecha de compra (YYYY-MM-DD)" value={fechaCompra} onChangeText={setFechaCompra} placeholder="2025-07-30" />
      <TextInputField label="Fecha de caducidad (YYYY-MM-DD)" value={fechaCaducidad} onChangeText={setFechaCaducidad} placeholder="2025-08-30" />
      
      {/* Campo y Botón de Escaneo */}
      <TextInputField 
        label="Código de barras" 
        value={codigoBarras} 
        onChangeText={setCodigoBarras} 
        placeholder="Escanear o introducir manualmente" 
      />
      <Button title="Escanear código (abrir cámara)" onPress={openScanner} />
      
      <TextInputField label="Cantidad en stock" value={cantidad} onChangeText={setCantidad} keyboardType="numeric" placeholder="0" />

      {/* Botones de Acción */}
      <View style={{ marginTop: 20 }}>
        <Button title="Guardar producto" onPress={save} />
        <View style={{ height: 8 }} />
        <Button title="Cancelar" onPress={() => navigation.goBack()} color="#d9534f" />
      </View>

      {/* Modal para el Escáner de Código de Barras */}
      <Modal visible={scannerOpen} animationType="slide" onRequestClose={() => setScannerOpen(false)}>
        <View style={styles.scannerContainer}>
          {hasPermission?.granted ? (
            <BarCodeScanner 
              onBarCodeScanned={scannerOpen ? handleBarCodeScanned : undefined}
              style={StyleSheet.absoluteFillObject} 
            />
          ) : hasPermission?.canAskAgain ? (
            <View style={styles.permissionDenied}>
              <Text style={styles.permissionText}>Permiso de cámara requerido</Text>
              <Button title="Solicitar permiso" onPress={requestPermission} />
            </View>
          ) : (
            <View style={styles.permissionDenied}>
              <Text style={styles.permissionText}>Permiso de cámara denegado</Text>
              <Text style={styles.permissionSubText}>Habilítalo en la configuración de tu dispositivo.</Text>
            </View>
          )}
          
          <View style={styles.closeButtonContainer}>
            <Button title="Cerrar Escáner" onPress={() => setScannerOpen(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scannerContainer: { 
    flex: 1, 
    backgroundColor: '#000',
  },
  permissionDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000'
  },
  permissionText: {
    color: '#fff', 
    fontSize: 18, 
    marginBottom: 10,
    textAlign: 'center'
  },
  permissionSubText: {
    color: '#fff', 
    textAlign: 'center',
    marginBottom: 20
  },
  closeButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 5
  }
});
