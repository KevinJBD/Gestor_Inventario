// src/components/ProductCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Product } from '../types/productos';

type Props = {
  product: Product;
  onPress?: () => void;
};

export default function ProductCard({ product, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.name}>{product.nombre}</Text>
        <Text style={styles.qty}>{product.cantidad ?? 0}</Text>
      </View>
      <Text style={styles.sub}>{product.marca ?? '-' } • {product.proveedor ?? '-'}</Text>
      {product.precioVenta !== undefined && (
        <Text style={styles.price}>${product.precioVenta}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  name: { fontSize: 16, fontWeight: '700' },
  sub: { fontSize: 13, color: '#666', marginTop: 4 },
  price: { marginTop: 8, fontWeight: '600' },
  qty: { fontSize: 14, color: '#333' }
});
