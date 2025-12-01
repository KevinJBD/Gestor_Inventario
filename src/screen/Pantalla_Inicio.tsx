// src/screens/Pantalla_Inicio.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { Product } from '../types/productos';
import ProductCard from '../components/ProductCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
const STORAGE_KEY = 'PRODUCTS_V1';

export default function PantallaInicio({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', load);
    load();
    return unsubscribe;
  }, [navigation]);

  async function load() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      setProducts(raw ? JSON.parse(raw) : []);
    } catch (e) {
      console.warn('Error cargando productos', e);
    }
  }

  const filtered = products.filter(p => p.nombre.toLowerCase().includes(query.toLowerCase()) || (p.codigoBarras ?? '').includes(query));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Button title="Registrar" onPress={() => navigation.navigate('Registro')} />
        <TextInput
          placeholder="Buscar por nombre o código"
          value={query}
          onChangeText={setQuery}
          style={styles.search}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => { /* más tarde: ver detalles */ }} />
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No hay productos aún.</Text>}
        contentContainerStyle={{ paddingTop: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  search: {
    flex: 1,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 8
  }
});
 