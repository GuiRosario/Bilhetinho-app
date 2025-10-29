import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { getNoteletHistory } from '../services/firebase';

const HistoryScreen = ({ route }) => {
  const { userId } = route.params;
  const [notelets, setNotelets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getNoteletHistory(userId);
        setNotelets(history);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const renderNotelet = ({ item }) => (
    <View style={styles.noteletCard}>
      {item.imageUrl && (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.noteletImage}
          resizeMode="contain"
        />
      )}
      {item.text && (
        <Text style={styles.noteletText}>{item.text}</Text>
      )}
      <Text style={styles.noteletDate}>{formatDate(item.createdAt)}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading notelets...</Text>
      </View>
    );
  }

  if (notelets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No notelets yet</Text>
        <Text style={styles.emptySubtext}>
          When you receive notelets from your partner, they will appear here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notelets}
        renderItem={renderNotelet}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#999',
  },
  listContent: {
    padding: 15,
  },
  noteletCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  noteletImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  noteletText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  noteletDate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
});

export default HistoryScreen;